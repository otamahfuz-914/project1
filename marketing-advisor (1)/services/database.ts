// services/database.ts
/**
 * @file এই ফাইলটি একটি সিমুলেটেড ডেটাবেস লেয়ার হিসেবে কাজ করে।
 * এটি `localStorage` ব্যবহার করে ব্যবহারকারীর ডেটা সংরক্ষণ এবং পুনরুদ্ধার করে।
 * এই অ্যাবস্ট্র্যাকশনের ফলে, ভবিষ্যতে localStorage পরিবর্তন করে একটি সত্যিকারের ডেটাবেস (যেমন Firebase, Supabase, MongoDB)
 * যুক্ত করা অনেক সহজ হবে। শুধুমাত্র এই ফাইলের ফাংশনগুলো পরিবর্তন করলেই চলবে।
 */

import { User, Plan, GeneratedContent, ActivityLog } from '../types';

const DB_PREFIX = 'marketing-ai-user-db-';
const CURRENT_USER_KEY = 'marketing-ai-user';
const ACTIVITY_LOG_KEY = 'marketing-ai-activity-log';

// --- ডেটা মাইগ্রেশন এবং রিটেনশন লজিক ---

const applyMigrations = (user: any): User => {
    // পুরনো audienceAvatar থেকে নতুন coreAudienceSets এ ডেটা মাইগ্রেট করা
    if (user.generatedContent && Array.isArray(user.generatedContent)) {
        user.generatedContent = user.generatedContent.map((content: any) => {
            if (content.audienceAvatar && (!content.coreAudienceSets || content.coreAudienceSets.length === 0)) {
                content.coreAudienceSets = [{
                    title: 'Primary Target Audience',
                    reasoning: content.audienceReasoning || 'Default audience based on product info.',
                    age: content.audienceAvatar.age || '18-65+',
                    gender: content.audienceAvatar.gender || 'Any',
                    location: content.audienceAvatar.location || 'Bangladesh',
                    relationship: content.audienceAvatar.relationship ? [content.audienceAvatar.relationship] : [],
                    education: content.audienceAvatar.education ? [content.audienceAvatar.education] : [],
                    profession: content.audienceAvatar.profession ? [content.audienceAvatar.profession] : [],
                    interests: content.audienceAvatar.interest || [],
                    behaviors: content.audienceAvatar.behavior || [],
                }];
            }
            if (!content.customAudienceSuggestions) content.customAudienceSuggestions = [];
            if (!content.lookalikeAudienceSuggestions) content.lookalikeAudienceSuggestions = [];
            if (!content.createdAt) content.createdAt = new Date().toISOString();
            return content;
        });
    }
     // নতুন ফিল্ডগুলোর জন্য ডিফল্ট মান সেট করা
    if (!user.createdAt) user.createdAt = new Date().toISOString();
    if (typeof user.isAdmin === 'undefined') user.isAdmin = false;
    if (typeof user.status === 'undefined') user.status = 'active';

    return user;
};

const applyRetentionPolicy = (user: User): User => {
    if (!user.generatedContent) return user;

    let retentionDays: number;
    switch (user.plan) {
        case Plan.STANDARD:
            retentionDays = 90;
            break;
        case Plan.PRO:
            retentionDays = 180; // প্রো প্ল্যানের জন্য ৬ মাস
            break;
        case Plan.BASIC:
        default:
            retentionDays = 30;
            break;
    }

    const now = new Date();
    const cutoffDate = new Date(new Date().setDate(now.getDate() - retentionDays));
    
    user.generatedContent = user.generatedContent.filter((content: GeneratedContent) => {
        const contentDate = new Date(content.createdAt);
        return contentDate >= cutoffDate;
    });

    return user;
};


// --- প্রধান ডেটাবেস ফাংশন ---

export const getUserByEmail = (email: string): User | null => {
    const storedUser = localStorage.getItem(DB_PREFIX + email);
    if (storedUser) {
        let user = JSON.parse(storedUser);
        user = applyMigrations(user);
        user = applyRetentionPolicy(user); // ডেটা রিট্রিভ করার সময় রিটেনশন পলিসি প্রয়োগ করা
        
        // নিশ্চিত করা যে অ্যারে এবং অবজেক্টগুলো উপস্থিত আছে
        if (!Array.isArray(user.generatedContent)) user.generatedContent = [];
        if (typeof user.dailySocialPost === 'undefined') user.dailySocialPost = null;
        return user;
    }
    return null;
};

export const getAllUsers = (): User[] => {
    const users: User[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(DB_PREFIX)) {
            const email = key.substring(DB_PREFIX.length);
            const user = getUserByEmail(email);
            if (user) {
                users.push(user);
            }
        }
    }
    return users;
};

export const createUser = (email: string, isAdmin: boolean = false): User => {
    const newUser: User = {
        email,
        plan: null,
        generatedContent: [],
        dailySocialPost: null,
        createdAt: new Date().toISOString(),
        isAdmin,
        status: 'active',
    };
    localStorage.setItem(DB_PREFIX + email, JSON.stringify(newUser));
    return newUser;
};

export const updateUser = (user: User): void => {
    localStorage.setItem(DB_PREFIX + user.email, JSON.stringify(user));
    // বর্তমানে লগইন থাকা ব্যবহারকারীর সেশনও আপডেট করা
    if (getCurrentUser()?.email === user.email) {
      setCurrentUser(user);
    }
};

export const getCurrentUser = (): User | null => {
    try {
        const storedUser = localStorage.getItem(CURRENT_USER_KEY);
        if (storedUser) {
            const session = JSON.parse(storedUser);
            // সেশন লোড করার সময়, আমরা "DB" থেকে আসল রেকর্ডটি নিয়ে আসি
            // এবং পলিসি প্রয়োগ করি
            return getUserByEmail(session.email);
        }
        return null;
    } catch (error) {
        console.error("Failed to parse current user from localStorage", error);
        clearCurrentUser();
        return null;
    }
};

export const setCurrentUser = (user: User | null): void => {
    if (user) {
        // একটি হালকা সেশন অবজেক্ট সংরক্ষণ করা, পুরো ব্যবহারকারীর অবজেক্ট "DB"-তে থাকে
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ email: user.email }));
    } else {
        localStorage.removeItem(CURRENT_USER_KEY);
    }
};

export const clearCurrentUser = (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
};

// --- Activity Log Functions ---
export const getActivities = (): ActivityLog[] => {
    const logs = localStorage.getItem(ACTIVITY_LOG_KEY);
    return logs ? JSON.parse(logs) : [];
};

export const logActivity = (message: string, userEmail: string) => {
    const activities = getActivities();
    const newActivity: ActivityLog = {
        id: new Date().toISOString() + Math.random(),
        timestamp: new Date().toISOString(),
        userEmail,
        message,
    };
    const updatedActivities = [newActivity, ...activities].slice(0, 100); // Keep last 100 logs
    localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(updatedActivities));
};