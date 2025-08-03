import React, { useState, useEffect, useMemo, useContext } from 'react';
import { User, Plan, ActivityLog } from '../types';
import * as db from '../services/database';
import { PRICING_PLANS } from '../constants';
import { AuthContext } from '../AuthContext';

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; }> = ({ icon, title, value }) => (
    <div className="bg-white p-5 rounded-lg shadow flex items-center gap-4">
        <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full flex-shrink-0">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

const PlanDistributionChart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    const colors = ['#4f46e5', '#10b981', '#f59e0b', '#6b7280'];

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg text-gray-800 mb-4">প্ল্যান অনুযায়ী ব্যবহারকারী</h3>
            <div className="space-y-3">
                {data.map((item, index) => (
                    <div key={item.name}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{item.name}</span>
                            <span className="text-gray-500">{item.value} জন ({total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="h-2.5 rounded-full"
                                style={{ width: `${total > 0 ? (item.value / total) * 100 : 0}%`, backgroundColor: colors[index % colors.length] }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const AdminScreen: React.FC = () => {
    const { user, updateUserInContext } = useContext(AuthContext);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Fetch all data on component mount
        setAllUsers(db.getAllUsers());
        setActivities(db.getActivities());
    }, []);
    
    const stats = useMemo(() => {
        const totalUsers = allUsers.length;
        const activeSubscriptions = allUsers.filter(u => u.plan !== null).length;
        
        const monthlyRevenue = allUsers.reduce((acc, u) => {
            if (u.plan && u.status === 'active') {
                return acc + PRICING_PLANS[u.plan].price;
            }
            return acc;
        }, 0);

        const planDistribution = Object.values(Plan).map(plan => ({
            name: PRICING_PLANS[plan].name,
            value: allUsers.filter(u => u.plan === plan).length,
        }));
        planDistribution.push({
            name: 'প্ল্যান নেই',
            value: allUsers.filter(u => u.plan === null).length,
        });

        return { totalUsers, activeSubscriptions, monthlyRevenue, planDistribution };
    }, [allUsers]);

    const filteredUsers = useMemo(() => {
        return allUsers.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [allUsers, searchTerm]);
    
    const handlePlanChange = (email: string, newPlan: Plan | 'null') => {
        const userToUpdate = allUsers.find(u => u.email === email);
        if (userToUpdate) {
            const planValue = newPlan === 'null' ? null : newPlan;
            const updatedUser = { ...userToUpdate, plan: planValue };
            db.updateUser(updatedUser);
            setAllUsers(allUsers.map(u => u.email === email ? updatedUser : u));
            if(user && user.email === email) updateUserInContext(updatedUser);
            db.logActivity(`অ্যাডমিন দ্বারা প্ল্যান পরিবর্তন করে '${newPlan}' করা হয়েছে।`, email);

        }
    };
    
    const handleStatusChange = (email: string, newStatus: 'active' | 'inactive') => {
         const userToUpdate = allUsers.find(u => u.email === email);
        if (userToUpdate) {
            const updatedUser = { ...userToUpdate, status: newStatus };
            db.updateUser(updatedUser);
            setAllUsers(allUsers.map(u => u.email === email ? updatedUser : u));
             if(user && user.email === email) updateUserInContext(updatedUser);
            db.logActivity(`অ্যাডমিন দ্বারা স্ট্যাটাস পরিবর্তন করে '${newStatus}' করা হয়েছে।`, email);
        }
    };


    if (!user?.isAdmin) {
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold text-red-600">প্রবেশাধিকার নেই</h1>
                <p className="text-gray-600 mt-2">এই পৃষ্ঠাটি শুধুমাত্র অ্যাডমিনদের জন্য।</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">অ্যাডমিন ড্যাশবোর্ড</h1>
                <p className="text-gray-500 mt-1">আপনার প্ল্যাটফর্মের সার্বিক অবস্থা পর্যবেক্ষণ ও নিয়ন্ত্রণ করুন।</p>
            </div>
            
            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} 
                    title="মোট ব্যবহারকারী" 
                    value={stats.totalUsers.toLocaleString('bn-BD')}
                />
                <StatCard 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
                    title="সক্রিয় সাবস্ক্রিপশন" 
                    value={stats.activeSubscriptions.toLocaleString('bn-BD')}
                />
                 <StatCard 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                    title="আনুমানিক মাসিক আয়" 
                    value={`৳${stats.monthlyRevenue.toLocaleString('bn-BD')}`}
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">সাম্প্রতিক কার্যকলাপ</h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {activities.map(activity => (
                             <div key={activity.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
                                <div className="bg-gray-100 p-2 rounded-full mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-800">
                                       <span className="font-semibold">{activity.userEmail}</span> {activity.message}
                                    </p>
                                    <p className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleString('bn-BD')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                 <PlanDistributionChart data={stats.planDistribution} />
            </div>

            {/* Users Table */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="sm:flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-gray-800">ব্যবহারকারী ব্যবস্থাপনা</h3>
                     <div className="relative mt-2 sm:mt-0">
                        <input
                            type="text"
                            placeholder="ইমেইল দিয়ে খুঁজুন..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        />
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                         </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ব্যবহারকারী</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">প্ল্যান</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">স্ট্যাটাস</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">রেজিস্ট্রেশন তারিখ</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map(u => (
                                <tr key={u.email} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                         <select
                                            value={u.plan || 'null'}
                                            onChange={(e) => handlePlanChange(u.email, e.target.value as Plan | 'null')}
                                            disabled={u.isAdmin}
                                            className={`p-1.5 rounded-md text-xs border ${u.isAdmin ? 'bg-gray-200' : 'bg-white border-gray-300'}`}
                                         >
                                             <option value="null">প্ল্যান নেই</option>
                                             {Object.values(Plan).map(p => <option key={p} value={p}>{PRICING_PLANS[p].name}</option>)}
                                         </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                         <select
                                            value={u.status || 'active'}
                                            onChange={(e) => handleStatusChange(u.email, e.target.value as 'active' | 'inactive')}
                                            disabled={u.isAdmin}
                                            className={`p-1.5 rounded-md text-xs border ${u.isAdmin ? 'bg-gray-200' : 'bg-white border-gray-300'} ${u.status === 'active' ? 'text-green-800' : 'text-red-800'}`}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                         </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(u.createdAt).toLocaleDateString('bn-BD')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {u.isAdmin ? <span className="text-xs font-bold text-yellow-600">অ্যাডমিন</span> : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};
