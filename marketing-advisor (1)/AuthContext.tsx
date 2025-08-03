import React, { createContext, useState, useEffect } from 'react';
import { User, Plan, GeneratedContent, SocialPostContent, MarketingVariation, AnalyticsMetrics } from './types';
import * as db from './services/database'; // ডেটাবেস সার্ভিস ইম্পোর্ট করা

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => boolean;
  register: (email: string) => { success: boolean; message: string };
  logout: () => void;
  selectPlan: (plan: Plan) => void;
  addGeneratedContent: (content: GeneratedContent) => void;
  setDailySocialPost: (post: { date: string; content: SocialPostContent } | null) => void;
  updateGeneratedContent: (index: number, updatedContent: GeneratedContent) => void;
  updateUserInContext: (user: User) => void; // For admin updates
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => false,
  register: () => ({ success: false, message: 'ব্যর্থ হয়েছে' }),
  logout: () => {},
  selectPlan: () => {},
  addGeneratedContent: () => {},
  setDailySocialPost: () => {},
  updateGeneratedContent: () => {},
  updateUserInContext: () => {},
});

const generateMockAnalytics = (): AnalyticsMetrics => {
    const reach = Math.floor(Math.random() * 5000) + 1000;
    const impressions = reach * (Math.random() * 0.4 + 1.1);
    const engagement = Math.floor(impressions * (Math.random() * 0.02 + 0.01));
    const ctr = parseFloat((Math.random() * 2.5 + 0.5).toFixed(2));
    const roas = parseFloat((Math.random() * 5 + 1.5).toFixed(2));
    return {
        reach: Math.round(reach),
        impressions: Math.round(impressions),
        engagement: Math.round(engagement),
        ctr,
        roas,
    };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = db.getCurrentUser();
    if (currentUser) {
        setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = (email: string): boolean => {
    const userFromDb = db.getUserByEmail(email);
    if (userFromDb) {
        if (userFromDb.status === 'inactive') {
            // This is a simple check. Real apps would show a proper message.
            alert("Your account is inactive. Please contact support.");
            return false;
        }
        setUser(userFromDb);
        db.setCurrentUser(userFromDb);
        db.logActivity('সফলভাবে লগইন করেছেন।', email);
        // We can avoid a full reload now by managing state properly.
        return true;
    }
    return false;
  };

  const register = (email: string): { success: boolean, message: string } => {
    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return { success: false, message: 'এই ইমেইল দিয়ে ইতিমধ্যে রেজিস্টার করা আছে।' };
    }
    const isAdmin = email.toLowerCase() === 'admin@app.com';
    const newUser = db.createUser(email, isAdmin);
    setUser(newUser);
    db.setCurrentUser(newUser);
    db.logActivity('নতুন অ্যাকাউন্ট রেজিস্টার করেছেন।', email);
    return { success: true, message: 'রেজিস্ট্রেশন সফল হয়েছে!' };
  };
  
  const logout = () => {
    if(user) {
        db.logActivity('সিস্টেম থেকে লগআউট করেছেন।', user.email);
    }
    db.clearCurrentUser();
    setUser(null);
  };

  const selectPlan = (plan: Plan) => {
    if (user) {
      const oldPlan = user.plan || 'None';
      const updatedUser = { ...user, plan };
      setUser(updatedUser);
      db.updateUser(updatedUser);
      db.logActivity(`${oldPlan} থেকে ${plan} প্ল্যানে আপগ্রেড করেছেন।`, user.email);
    }
  };

  const addGeneratedContent = (content: GeneratedContent) => {
    if (user) {
      let contentToAdd = { ...content };
      
      if (user.plan === Plan.STANDARD || user.plan === Plan.PRO) {
          contentToAdd.variations = content.variations.map(variation => ({
              ...variation,
              analytics: generateMockAnalytics(),
          }));
      }

      const existingContent = user.generatedContent || [];
      const updatedUser = { ...user, generatedContent: [contentToAdd, ...existingContent] };
      setUser(updatedUser);
      db.updateUser(updatedUser);
      db.logActivity('নতুন মার্কেটিং কনটেন্ট তৈরি করেছেন।', user.email);
    }
  };

  const updateGeneratedContent = (index: number, updatedContent: GeneratedContent) => {
    if(user && user.generatedContent) {
        const allContent = [...user.generatedContent];
        allContent[index] = updatedContent;
        const updatedUser = {...user, generatedContent: allContent};
        setUser(updatedUser);
        db.updateUser(updatedUser);
    }
  };

  const setDailySocialPost = (post: { date: string; content: SocialPostContent } | null) => {
      if (user) {
          const updatedUser = { ...user, dailySocialPost: post };
          setUser(updatedUser);
          db.updateUser(updatedUser);
          if(post) {
            db.logActivity('নতুন সোশ্যাল পোস্ট তৈরি করেছেন।', user.email);
          }
      }
  };

  const updateUserInContext = (updatedUser: User) => {
      if (user && user.email === updatedUser.email) {
          setUser(updatedUser);
      }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, selectPlan, addGeneratedContent, setDailySocialPost, updateGeneratedContent, updateUserInContext }}>
      {children}
    </AuthContext.Provider>
  );
};