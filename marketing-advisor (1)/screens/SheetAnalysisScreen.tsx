
import React, { useState } from 'react';
import type { SheetAnalysisResult, PerformanceMetric, PerformanceGap, DeepDiveInsight, OptimizationRecommendation, AudiencePerformanceInsight, CreativePerformanceInsight, PerformanceForecast } from '../types';
import { analyzeAdMetricsFromSheet } from '../services/marketingApi';

type Tab = 'overview' | 'deep_dive' | 'audience_creative' | 'recommendations_forecast';


const HealthScoreGauge: React.FC<{ score: number }> = ({ score }) => {
    const getScoreColor = (s: number) => {
        if (s < 40) return 'text-red-500';
        if (s < 75) return 'text-yellow-500';
        return 'text-green-500';
    };
    const color = getScoreColor(score);
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-40 h-40 mx-auto">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                    className="text-gray-200"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                />
                <circle
                    className={`${color} transition-all duration-1000 ease-out`}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                />
            </svg>
            <div className={`absolute inset-0 flex flex-col items-center justify-center ${color}`}>
                <span className="text-4xl font-extrabold">{score}</span>
                <span className="text-sm font-semibold -mt-1">স্কোর</span>
            </div>
        </div>
    );
};

const ResultCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode; className?: string }> = ({ title, children, icon, className }) => (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <div className="space-y-3 text-gray-700 leading-relaxed">
            {children}
        </div>
    </div>
);

const PerformanceCard: React.FC<{ item: PerformanceMetric; type: 'top' | 'under' }> = ({ item, type }) => {
    const isTop = type === 'top';
    const bgColor = isTop ? 'bg-green-50' : 'bg-red-50';
    const borderColor = isTop ? 'border-green-200' : 'border-red-200';
    const metricColor = isTop ? 'text-green-700' : 'text-red-700';

    return (
        <div className={`p-3 rounded-lg border ${bgColor} ${borderColor}`}>
            <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{item.entity_type}</span>
            <h5 className="font-bold text-gray-800 mt-2 truncate">{item.name}</h5>
            <div className="mt-1">
                <span className="text-sm text-gray-600">{item.metric}: </span>
                <span className={`font-bold text-sm ${metricColor}`}>{item.value}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{item.reason}</p>
        </div>
    );
};

const DeepDiveCard: React.FC<{ insight: DeepDiveInsight }> = ({ insight }) => (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
        <h4 className="font-bold text-blue-900">{insight.title}</h4>
        <div className="mt-2 space-y-2 text-sm">
            <p><strong className="text-gray-700">পর্যবেক্ষণ:</strong> {insight.observation}</p>
            <p><strong className="text-gray-700">সম্ভাব্য কারণ:</strong> {insight.hypothesis}</p>
            <p className="text-green-800"><strong className="text-green-800">সুপারিশ:</strong> {insight.recommendation}</p>
        </div>
    </div>
);

const AudienceInsightCard: React.FC<{ insight: AudiencePerformanceInsight }> = ({ insight }) => {
    const isTop = insight.performance_level === 'Top Performer';
    const bgColor = isTop ? 'bg-green-50' : 'bg-red-50';
    const icon = isTop ? '▲' : '▼';
    const color = isTop ? 'text-green-600' : 'text-red-600';

    return (
        <div className={`p-4 rounded-lg ${bgColor}`}>
            <p className={`font-bold ${color}`}>{icon} {insight.performance_level}</p>
            <p className="font-semibold text-gray-800">{insight.audience_segment}</p>
            <p className="text-sm text-gray-600">{insight.key_metric}: <span className="font-bold">{insight.metric_value}</span></p>
            <p className="text-sm text-blue-700 mt-2"><strong>সুপারিশ:</strong> {insight.suggestion}</p>
        </div>
    );
};

const CreativeInsightCard: React.FC<{ insight: CreativePerformanceInsight }> = ({ insight }) => (
    <div className="p-4 rounded-lg bg-indigo-50">
        <p className="font-bold text-indigo-700">{insight.creative_type}</p>
        <p className="text-sm text-gray-800">{insight.trend}</p>
        <p className="text-xs text-gray-600 mt-1">{insight.reasoning}</p>
    </div>
);

const ForecastCard: React.FC<{ forecast: PerformanceForecast }> = ({ forecast }) => (
    <div className="p-4 rounded-lg bg-purple-50 text-center">
        <p className="text-sm text-purple-800 font-semibold">{forecast.metric}</p>
        <p className="text-3xl font-bold text-purple-600 my-1">{forecast.projected_value}</p>
        <p className="text-xs text-purple-500">({forecast.timeline})</p>
        <p className="text-xs text-gray-500 mt-2">{forecast.condition}</p>
    </div>
);

const ActionPlanItem: React.FC<{ item: OptimizationRecommendation, index: number }> = ({ item, index }) => (
    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg border-2 border-indigo-300">
            {index + 1}
        </div>
        <div>
            <h4 className="font-bold text-indigo-900">{item.title}</h4>
            <p className="text-xs text-gray-600 mt-1 italic">{item.reasoning}</p>
            <ul className="mt-3 space-y-2">
                {item.action_steps.map((step, i) => (
                    <li key={i} className="flex items-start">
                        <svg className="h-4 w-4 text-green-600 mr-2 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        <span className="text-sm text-gray-800">{step}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

const AnalysisDisplay: React.FC<{ result: SheetAnalysisResult }> = ({ result }) => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    const tabs: { id: Tab, name: string }[] = [
        { id: 'overview', name: 'ওভারভিউ' },
        { id: 'deep_dive', name: 'গভীর বিশ্লেষণ' },
        { id: 'audience_creative', name: 'অডিয়েন্স ও কনটেন্ট' },
        { id: 'recommendations_forecast', name: 'সুপারিশ ও পূর্বাভাস' },
    ];
    
    const sortedRecommendations = [...result.recommendations].sort((a,b) => a.priority - b.priority);

    return (
        <div className="animate-fade-in mt-8">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex justify-center space-x-2 sm:space-x-6 overflow-x-auto" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`whitespace-nowrap py-3 px-4 border-b-2 font-semibold text-sm transition-colors duration-200 focus:outline-none ${
                                activeTab === tab.id
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="pt-8">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center animate-fade-in">
                        <div className="md:col-span-1 flex flex-col items-center justify-center card-style p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">ক্যাম্পেইন হেলথ স্কোর</h3>
                            <HealthScoreGauge score={result.health_score} />
                            <p className="text-xs text-gray-500 text-center mt-2">{result.health_score_reasoning}</p>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            <ResultCard title="সার্বিক পারফর্মেন্স সারাংশ" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                                <p>{result.overall_summary}</p>
                            </ResultCard>
                            <ResultCard title="কী ইনসাইটস" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}>
                                <ul className="space-y-2 list-disc list-inside">
                                    {result.key_insights.map((insight, i) => <li key={i}>{insight}</li>)}
                                </ul>
                            </ResultCard>
                        </div>
                    </div>
                )}
                
                {activeTab === 'deep_dive' && (
                     <div className="space-y-8 animate-fade-in">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                             <ResultCard title="টপ পারফর্মার" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" /></svg>} className="bg-gray-50/30">
                                {result.top_performers.map((item, i) => <PerformanceCard key={i} item={item} type="top" />)}
                             </ResultCard>
                             <ResultCard title="আন্ডার পারফর্মার" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" /></svg>} className="bg-gray-50/30">
                                {result.underperformers.map((item, i) => <PerformanceCard key={i} item={item} type="under" />)}
                            </ResultCard>
                        </div>
                        <ResultCard title="পারফরম্যান্স গ্যাপ" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>}>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {result.performance_gaps.map((gap, i) => (
                                    <div key={i} className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                        <h4 className="font-bold text-yellow-800">{gap.area}</h4>
                                        <p className="text-sm text-gray-700 mt-1">{gap.description}</p>
                                        <p className="text-xs text-gray-600 mt-2"><strong>প্রভাব:</strong> {gap.implication}</p>
                                        <p className="text-xs text-blue-600 mt-1 font-semibold"><strong>সুপারিশ:</strong> {gap.suggestion}</p>
                                    </div>
                                ))}
                            </div>
                        </ResultCard>
                    </div>
                )}
                
                 {activeTab === 'audience_creative' && (
                     <div className="space-y-8 animate-fade-in">
                        <ResultCard title="অডিয়েন্স ইনসাইটস" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {result.audience_insights.map((insight, i) => <AudienceInsightCard key={i} insight={insight} />)}
                            </div>
                        </ResultCard>
                        <ResultCard title="কনটেন্ট টাইপ অ্যানালাইসিস" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1-1m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {result.creative_insights.map((insight, i) => <CreativeInsightCard key={i} insight={insight} />)}
                            </div>
                        </ResultCard>
                         <ResultCard title="গভীর ডেটা বিশ্লেষণ" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m3 6V7m-15.5 12h16.5a2 2 0 002-2V7a2 2 0 00-2-2H4.5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}>
                            <div className="space-y-4">
                                {result.deep_dive_analysis.map((insight, i) => <DeepDiveCard key={i} insight={insight} />)}
                            </div>
                        </ResultCard>
                    </div>
                )}
                
                {activeTab === 'recommendations_forecast' && (
                    <div className="space-y-8 animate-fade-in">
                         <ResultCard title="অগ্রাধিকার ভিত্তিক অ্যাকশন প্ল্যান" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                            <div className="space-y-4">
                                {sortedRecommendations.map((rec, index) => (
                                    <ActionPlanItem key={index} item={rec} index={index} />
                                ))}
                            </div>
                        </ResultCard>
                        <ResultCard title="পারফরম্যান্স পূর্বাভাস" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {result.forecasts.map((forecast, i) => <ForecastCard key={i} forecast={forecast} />)}
                            </div>
                        </ResultCard>
                    </div>
                )}
            </div>
        </div>
    );
}

export const SheetAnalysisScreen: React.FC = () => {
    const [sheetUrl, setSheetUrl] = useState('');
    const [analysisResult, setAnalysisResult] = useState<SheetAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const executeAnalysis = async () => {
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        
        if (!sheetUrl || !sheetUrl.startsWith('https://docs.google.com/spreadsheets/')) {
            setError("অনুগ্রহ করে একটি সঠিক গুগল শীট লিংক দিন।");
            setIsLoading(false);
            return;
        }

        try {
            const result = await analyzeAdMetricsFromSheet(sheetUrl);
            setAnalysisResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'একটি অজানা ত্রুটি ঘটেছে।');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
             <div className="text-center">
                <h1 className="elegant-title">গুগল শীট ক্যাম্পেইন অ্যানালাইজার</h1>
                <p className="mt-2 elegant-subtitle">আপনার ফেসবুক ক্যাম্পেইনের পারফরম্যান্স ডেটা সহ গুগল শীটের লিংক দিন। AI আপনার ডেটা গভীরভাবে বিশ্লেষণ করে বিস্তারিত রিপোর্ট এবং অপটিমাইজেশন কৌশল প্রদান করবে।</p>
            </div>
            
             {!analysisResult && !isLoading && (
                 <div className="bg-white p-6 rounded-xl shadow-lg animate-fade-in">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m3 6V7m-15.5 12h16.5a2 2 0 002-2V7a2 2 0 00-2-2H4.5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <h2 className="text-xl font-bold text-gray-800">আপনার ক্যাম্পেইন ডেটা লিংক করুন</h2>
                    </div>
                    <div>
                        <label htmlFor="sheetUrl" className="sr-only">আপনার গুগল শীট লিংক দিন</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                            </div>
                            <input
                                type="url"
                                id="sheetUrl"
                                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                                placeholder="https://docs.google.com/spreadsheets/..."
                                value={sheetUrl}
                                onChange={(e) => setSheetUrl(e.target.value)}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">অনুগ্রহ করে নিশ্চিত করুন যে আপনার শীটটি "Anyone with the link can view" পারমিশন দিয়ে শেয়ার করা আছে। আমরা আপনার ডেটার গোপনীয়তা রক্ষা করি।</p>
                    </div>
                    <div className="mt-6 text-center">
                        <button
                            onClick={executeAnalysis}
                            disabled={isLoading}
                            className="w-full sm:w-auto inline-flex justify-center items-center px-10 py-3 border border-transparent text-base font-semibold rounded-md text-white btn-primary"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    বিশ্লেষণ চলছে...
                                </>
                            ) : (
                                'বিশ্লেষণ করুন'
                            )}
                        </button>
                    </div>
                </div>
            )}


            {isLoading && (
                <div className="flex flex-col items-center justify-center h-48 bg-white p-6 rounded-xl shadow-lg">
                    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
                    <p className="mt-4 text-lg font-semibold text-gray-700">আপনার ডেটা বিশ্লেষণ করা হচ্ছে...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
                    <p><strong>ত্রুটি:</strong> {error}</p>
                </div>
            )}
            
            {analysisResult && <AnalysisDisplay result={analysisResult} />}

        </div>
    );
};