import React, { useContext, useState, useMemo } from 'react';
import { AuthContext } from '../AuthContext';
import { View, Plan, GeneratedContent, MarketingVariation } from '../types';
import { PRICING_PLANS } from '../constants';

interface DashboardScreenProps {
    onNavigate: (view: View) => void;
    onViewContent: (content: GeneratedContent, index: number) => void;
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; valueColor?: string; }> = ({ icon, title, value, valueColor = 'text-gray-900' }) => (
    <div className="card-style p-4 flex items-center gap-4">
        <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg flex-shrink-0">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
        </div>
    </div>
);

const ContentPreviewCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    content: GeneratedContent;
    onViewClick: () => void;
}> = ({ icon, title, content, onViewClick }) => {
    const firstVariation = content.variations?.[0];
    const snippet = firstVariation?.hook || 'পূর্ব نمایشের জন্য কোনো লেখা নেই।';
    
    return (
        <div className="card-style p-6 flex flex-col h-full min-h-[220px]">
            <div className="flex items-center mb-4">
                <div className="text-gray-400">{icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 ml-3">{title}</h3>
            </div>
            <p className="text-sm text-gray-600 italic line-clamp-3 mb-4 flex-grow">"{snippet}"</p>
            <button
                onClick={onViewClick}
                className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-2 px-4 rounded-md text-sm transition-colors mt-auto self-start"
            >
                বিস্তারিত দেখুন
            </button>
        </div>
    );
};

const SavedContentCard: React.FC<{
    variation: MarketingVariation;
    onViewClick: () => void;
}> = ({ variation, onViewClick }) => {
    return (
        <div className="card-style p-5 flex flex-col h-full">
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">{variation.formula_name}</span>
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-yellow-400 flex-shrink-0">
                    <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.134-.662 1.456 0l1.86 3.844 4.251.618c.732.107 1.023.99.494 1.513l-3.076 2.998.726 4.234c.125.73-.64 1.284-1.29.939L10 15.176l-3.818 2.008c-.65.345-1.415-.209-1.29-.939l.726-4.234-3.076-2.998c-.529-.523-.238-1.406.494-1.513l4.251-.618 1.86-3.844z" clipRule="evenodd" />
                </svg>
            </div>
            <p className="text-gray-800 font-semibold italic line-clamp-2 my-2">"{variation.hook}"</p>
            <p className="text-gray-600 text-sm line-clamp-3 flex-grow">{variation.body}</p>

            <button
                onClick={onViewClick}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md text-sm transition-colors mt-4 self-start"
            >
                সম্পূর্ণ ক্যাম্পেইন দেখুন
            </button>
        </div>
    );
};


const EmptyStateCard: React.FC<{ icon: React.ReactNode; title: string; description: string; buttonText: string; onButtonClick: () => void; }> = ({ icon, title, description, buttonText, onButtonClick }) => (
    <div className="card-style p-6 text-center flex flex-col items-center justify-center h-full min-h-[220px]">
        <div className="text-gray-400 mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mt-1 mb-4 max-w-xs">{description}</p>
        <button
            onClick={onButtonClick}
            className="btn-primary py-2 px-4 text-sm"
        >
            {buttonText}
        </button>
    </div>
);

const QuickActionCard: React.FC<{ icon: React.ReactNode; title: string; description: string; onButtonClick: () => void; proOnly?: boolean }> = ({ icon, title, description, onButtonClick, proOnly }) => (
    <button onClick={onButtonClick} className="card-style p-4 text-left transition-all flex items-center gap-4 w-full relative">
        <div className="bg-gray-100 text-gray-600 p-3 rounded-lg">
            {icon}
        </div>
        <div>
            <h4 className="font-semibold text-gray-800">{title}</h4>
            <p className="text-xs text-gray-500">{description}</p>
        </div>
         {proOnly && <span className="absolute top-2 right-2 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">PRO</span>}
    </button>
);

const FeaturedToolCard: React.FC<{ onNavigate: () => void; }> = ({ onNavigate }) => (
    <div className="relative rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-2xl shadow-indigo-500/30 overflow-hidden">
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute -top-12 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="relative z-10 flex-shrink-0">
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m3 6V7m-15.5 12h16.5a2 2 0 002-2V7a2 2 0 00-2-2H4.5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
        </div>
        <div className="relative z-10 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded-full">প্রো ফিচার</span>
            <h3 className="text-xl font-bold mt-2">গুগল শীট ক্যাম্পেইন অ্যানালাইজার</h3>
            <p className="text-sm mt-1 text-indigo-200">আপনার ক্যাম্পেইন ডেটা বিশ্লেষণ করে বিক্রয় বাড়ানোর কৌশল খুঁজে বের করুন।</p>
        </div>
        <div className="relative z-10 w-full sm:w-auto mt-4 sm:mt-0">
            <button onClick={onNavigate} className="w-full sm:w-auto bg-white text-indigo-600 font-bold py-2.5 px-6 rounded-lg shadow-md hover:bg-gray-100 transition-colors">
                বিশ্লেষণ করুন
            </button>
        </div>
    </div>
);


export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate, onViewContent }) => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');

    const userName = user?.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'ব্যবহারকারী';
    
    const planName = user?.plan ? PRICING_PLANS[user.plan].name : 'N/A';
    const planStatusColor = user?.plan ? 'text-green-600' : 'text-yellow-500';

    const totalCampaigns = user?.generatedContent?.length ?? 0;
    const totalGeneratedContent = user?.generatedContent?.reduce((sum, item) => sum + (item.variations?.length || 0), 0) ?? 0;

    const latestContent = user?.generatedContent?.[0];
    const showSaveFeature = user?.plan === Plan.STANDARD || user?.plan === Plan.PRO;

    const savedVariations = showSaveFeature ? (user?.generatedContent?.flatMap((content, contentIndex) => 
        (content.variations || [])
            .filter(v => v.isSaved)
            .map(variation => ({
                variation,
                parentContent: content,
                parentIndex: contentIndex
            }))
    ) || []) : [];
    
    const showAnalytics = user?.plan === Plan.STANDARD || user?.plan === Plan.PRO;

    const analyticsData = useMemo(() => {
        if (!showAnalytics || !user?.generatedContent) return null;

        const allVariationsWithAnalytics = user.generatedContent.flatMap(
            (content, contentIndex) => content.variations
                .filter(v => v.analytics)
                .map(v => ({...v, parentContent: content, parentIndex: contentIndex}))
        );

        if (allVariationsWithAnalytics.length === 0) return {
            winningVariation: null,
            topFormula: null,
            campaigns: []
        };
        
        const winningVariation = [...allVariationsWithAnalytics].sort((a, b) => (b.analytics!.roas) - (a.analytics!.roas))[0];

        const formulaStats = allVariationsWithAnalytics.reduce((acc, v) => {
            if (!acc[v.formula_name]) {
                acc[v.formula_name] = { totalRoas: 0, count: 0 };
            }
            acc[v.formula_name].totalRoas += v.analytics!.roas;
            acc[v.formula_name].count++;
            return acc;
        }, {} as Record<string, {totalRoas: number, count: number}>);
        
        const topFormulaName = Object.keys(formulaStats).length > 0 ? Object.keys(formulaStats).sort((a, b) => 
            (formulaStats[b].totalRoas / formulaStats[b].count) - (formulaStats[a].totalRoas / formulaStats[a].count)
        )[0] : null;

        const topFormula = topFormulaName ? {
            name: topFormulaName,
            avgRoas: (formulaStats[topFormulaName].totalRoas / formulaStats[topFormulaName].count)
        } : null;
        
        const campaigns = user.generatedContent
            .map((c, index) => {
                const variationsWithAnalytics = c.variations.filter(v => v.analytics);
                if (variationsWithAnalytics.length === 0) return null;

                const totalRoas = variationsWithAnalytics.reduce((sum, v) => sum + v.analytics!.roas, 0);
                const totalCtr = variationsWithAnalytics.reduce((sum, v) => sum + v.analytics!.ctr, 0);
                return {
                    createdAt: c.createdAt,
                    avgRoas: (totalRoas / variationsWithAnalytics.length),
                    avgCtr: (totalCtr / variationsWithAnalytics.length),
                    content: c,
                    index: index
                }
            })
            .filter(Boolean)
            .sort((a, b) => new Date(b!.createdAt).getTime() - new Date(a!.createdAt).getTime())
            .slice(0, 3);

        return { winningVariation, topFormula, campaigns };

    }, [user?.generatedContent, showAnalytics]);
    
    const renderAnalyticsContent = () => {
        if (!analyticsData || !analyticsData.winningVariation) {
            return (
                 <div className="card-style p-6 text-center flex flex-col items-center justify-center min-h-[300px] bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /></svg>
                    <h3 className="text-lg font-semibold text-gray-800">কোনো অ্যানালিটিক্স ডেটা নেই</h3>
                    <p className="text-sm text-gray-500 mt-1 mb-4 max-w-xs">ক্যাম্পেইন পারফরম্যান্স দেখতে প্রথমে কিছু কনটেন্ট তৈরি করুন।</p>
                    <button onClick={() => onNavigate('generator')} className="btn-primary py-2 px-4 text-sm">নতুন কনটেন্ট তৈরি করুন</button>
                 </div>
            );
        }

        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Winning Variation Card */}
                <div className="card-style p-5 flex flex-col justify-between">
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                        জয়ী কনটেন্ট
                    </h3>
                    <div className="bg-indigo-50/70 p-4 rounded-lg my-2 flex-grow">
                        <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">{analyticsData.winningVariation!.formula_name}</span>
                        <p className="text-gray-800 font-semibold italic text-sm my-2">"{analyticsData.winningVariation!.hook}"</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center mt-3 text-sm">
                        <div>
                            <div className="font-bold text-lg text-green-600">{analyticsData.winningVariation!.analytics!.roas.toLocaleString('bn-BD')}x</div>
                            <div className="text-gray-500 text-xs">ROAS</div>
                        </div>
                        <div>
                            <div className="font-bold text-lg text-indigo-600">{analyticsData.winningVariation!.analytics!.ctr.toLocaleString('bn-BD')}%</div>
                            <div className="text-gray-500 text-xs">CTR</div>
                        </div>
                    </div>
                    <button onClick={() => onViewContent(analyticsData.winningVariation!.parentContent, analyticsData.winningVariation!.parentIndex)} className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-md text-sm transition-colors">ক্যাম্পেইন দেখুন</button>
                </div>
                {/* Top Formula Card */}
                <div className="card-style p-5 flex flex-col justify-between">
                     <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                        সেরা ফর্মুলা
                     </h3>
                     <div className="bg-teal-50/70 p-4 rounded-lg my-2 flex-grow flex flex-col items-center justify-center text-center">
                        <h4 className="font-bold text-xl text-teal-800">{analyticsData.topFormula?.name}</h4>
                        <p className="text-teal-600 text-sm">গড় রিটার্ন</p>
                        <p className="font-extrabold text-3xl text-teal-700 mt-1">{analyticsData.topFormula?.avgRoas.toFixed(1)}x</p>
                     </div>
                     <p className="text-xs text-center text-gray-500 mt-2">আপনার সকল ক্যাম্পেইন জুড়ে এই ফর্মুলাটি সবচেয়ে ভালো ফলাফল দিচ্ছে।</p>
                </div>
                {/* Recent Campaigns List */}
                <div className="card-style p-5 lg:col-span-2">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a1 1 0 011-1h12a1 1 0 110 2H3a1 1 0 01-1-1z" /></svg>
                        সাম্প্রতিক ক্যাম্পেইন ওভারভিউ
                    </h3>
                    <div className="space-y-3">
                        {analyticsData.campaigns!.map((c, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div>
                                    <p className="font-semibold text-sm text-gray-800">ক্যাম্পেইন - {new Date(c!.createdAt).toLocaleDateString('bn-BD')}</p>
                                    <p className="text-xs text-gray-500">{c!.content.variations[0].hook.substring(0, 40)}...</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="font-bold text-sm text-green-600">{c!.avgRoas.toFixed(2)}x</p>
                                        <p className="text-xs text-gray-500">Avg. ROAS</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm text-indigo-600">{c!.avgCtr.toFixed(2)}%</p>
                                        <p className="text-xs text-gray-500">Avg. CTR</p>
                                    </div>
                                     <button onClick={() => onViewContent(c!.content, c!.index)} className="p-2 text-gray-400 hover:text-gray-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">স্বাগতম, {userName}!</h1>
                    <p className="text-gray-500 mt-1">আপনার AI মার্কেটিং ড্যাশবোর্ডে আজকের কার্যক্রম দেখুন।</p>
                </div>
                <button
                    onClick={() => onNavigate('generator')}
                    className="btn-primary flex items-center gap-2"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    নতুন কনটেন্ট
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <StatCard 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25C6.477 2.25 2 6.727 2 12s4.477 9.75 10 9.75 10-4.477 10-9.75S17.523 2.25 12 2.25z" /></svg>}
                    title="মোট ক্যাম্পেইন" 
                    value={String(totalCampaigns)}
                />
                <StatCard 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} 
                    title="জেনারেটেড কনটেন্ট" 
                    value={String(totalGeneratedContent)}
                />
                <StatCard 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>} 
                    title="সাবস্ক্রিপশন" 
                    value={planName} 
                    valueColor={planStatusColor}
                />
            </div>
            
            {/* Featured Pro Tool */}
            {user?.plan === Plan.PRO && (
                <div>
                    <FeaturedToolCard onNavigate={() => onNavigate('sheet-analysis')} />
                </div>
            )}

            {/* Performance Analytics Section */}
            {showAnalytics && (
                 <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">পারফরম্যান্স অ্যানালিটিক্স</h2>
                    {renderAnalyticsContent()}
                </div>
            )}


            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">দ্রুত অ্যাকশন</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                     <QuickActionCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                        title="নতুন কনটেন্ট তৈরি করুন"
                        description="বিজ্ঞাপন, পোস্ট, বা পণ্যের বিবরণী তৈরি করুন।"
                        onButtonClick={() => onNavigate('generator')}
                     />
                      <QuickActionCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                        title="ক্যাম্পেইন স্ট্র্যাটেজিস্ট"
                        description="সম্পূর্ণ মার্কেটিং ফানেল তৈরি করুন।"
                        onButtonClick={() => onNavigate('strategist')}
                        proOnly={user?.plan === Plan.PRO}
                     />
                     <QuickActionCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1-1m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        title="সমস্যা বিশ্লেষক"
                        description="ছবি দিয়ে ব্যবসায়িক সমস্যা বিশ্লেষণ করুন।"
                        onButtonClick={() => onNavigate('analyzer')}
                        proOnly={user?.plan === Plan.PRO}
                     />
                     <QuickActionCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /><path d="M7 8a.5.5 0 01.5-.5H8a.5.5 0 01.5.5v2a.5.5 0 01-.5.5H7.5a.5.5 0 01-.5-.5V8zm2 0a.5.5 0 01.5-.5h.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5h-.5a.5.5 0 01-.5-.5V8zm2 0a.5.5 0 01.5-.5h.5a.5.5 0 01.5.5v3a.5.5 0 01-.5.5h-.5a.5.5 0 01-.5-.5V8z" /></svg>}
                        title="কম্পিটিটর অ্যানালাইজার"
                        description="মার্কেট গ্যাপ ও জেতার কৌশল খুঁজে বের করুন।"
                        onButtonClick={() => onNavigate('competitor-analysis')}
                        proOnly={user?.plan === Plan.PRO}
                     />
                </div>
            </div>

            {/* Main Content Sections */}
             <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">আপনার কার্যক্রম</h2>
                    {showSaveFeature && (
                        <div className="flex items-center bg-gray-200 p-1 rounded-lg">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${activeTab === 'all' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                সব ক্যাম্পেইন
                            </button>
                            <button
                                onClick={() => setActiveTab('saved')}
                                className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${activeTab === 'saved' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                সংরক্ষিত ({savedVariations.length.toLocaleString('bn-BD')})
                            </button>
                        </div>
                    )}
                </div>

                {activeTab === 'all' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {latestContent ? (
                            <ContentPreviewCard
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                                title="সাম্প্রতিক কনটেন্ট"
                                content={latestContent}
                                onViewClick={() => onViewContent(latestContent, 0)}
                            />
                        ) : (
                            <div className="lg:col-span-2">
                                <EmptyStateCard
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                                    title="কোনো কনটেন্ট নেই"
                                    description="আপনার সর্বশেষ জেনারেটেড কনটেন্ট এখানে দেখা যাবে।"
                                    buttonText="প্রথম কনটেন্ট তৈরি করুন"
                                    onButtonClick={() => onNavigate('generator')}
                                />
                            </div>
                        )}
                        {user?.plan === Plan.PRO ? (
                            <QuickActionCard
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                title="দৈনিক সোশ্যাল পোস্ট"
                                description="আপনার আজকের ফেসবুক পোস্টটি দেখুন ও প্রকাশ করুন।"
                                onButtonClick={() => onNavigate('social')}
                                proOnly={true}
                            />
                        ) : (
                           latestContent &&  <QuickActionCard
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>}
                                title="সাবস্ক্রিপশন আপগ্রেড করুন"
                                description="আরও উন্নত ফিচার পেতে প্ল্যান আপগ্রেড করুন।"
                                onButtonClick={() => onNavigate('pricing')}
                            />
                        )}
                    </div>
                )}
                {activeTab === 'saved' && showSaveFeature && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedVariations.length > 0 ? (
                            savedVariations.map(({ variation, parentContent, parentIndex }, index) => (
                                <SavedContentCard
                                    key={`${parentIndex}-${variation.id}`}
                                    variation={variation}
                                    onViewClick={() => onViewContent(parentContent, parentIndex)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full">
                                <EmptyStateCard
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.613.049.842.859.433 1.283l-4.018 3.882a.563.563 0 00-.162.522l.942 5.503a.563.563 0 01-.813.612l-4.925-2.738a.563.563 0 00-.526 0l-4.925 2.738a.563.563 0 01-.813-.612l.942-5.503a.563.563 0 00-.162.522l-4.018-3.882a.563.563 0 01.433-1.283l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>}
                                    title="কোনো সংরক্ষিত কনটেন্ট নেই"
                                    description="কনটেন্ট ভার্সনের পাশে থাকা তারকা ★ চিহ্নতে ক্লিক করে আপনার পছন্দের কনটেন্ট সেভ করুন।"
                                    buttonText="কনটেন্ট তৈরি করুন"
                                    onButtonClick={() => onNavigate('generator')}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};