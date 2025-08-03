import React, { useState } from 'react';
import type { CampaignStrategy, CampaignGoal, ProductInfo, CampaignType } from '../types';
import { generateCampaignStrategy } from '../services/marketingApi';
import { Loader } from '../components/Loader';
import { InputForm } from '../components/InputForm';

const Accordion: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-gray-200 rounded-lg bg-white">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-700 hover:bg-gray-50"
            >
                <span>{title}</span>
                <svg
                    className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            {isOpen && (
                <div className="p-4 border-t border-gray-200 bg-gray-50/50">
                    {children}
                </div>
            )}
        </div>
    );
};

export const StrategistScreen: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [campaignStrategy, setCampaignStrategy] = useState<CampaignStrategy | null>(null);
    const [selectedGoal, setSelectedGoal] = useState<CampaignGoal>('SALES_CONVERSION');
    const [totalBudget, setTotalBudget] = useState<number>(10000);

    const handleGenerateStrategy = async (productInfo: ProductInfo, _campaignType: CampaignType | null) => {
        if (totalBudget <= 0) {
            setError("অনুগ্রহ করে একটি সঠিক বাজেট লিখুন।");
            return;
        }
        setIsLoading(true);
        setError(null);
        setCampaignStrategy(null);
        try {
            const result = await generateCampaignStrategy(productInfo, selectedGoal, totalBudget);
            setCampaignStrategy(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'একটি অজানা ত্রুটি ঘটেছে।');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="elegant-title">AI ক্যাম্পেইন স্ট্র্যাটেজিস্ট</h1>
                <p className="mt-2 elegant-subtitle">আপনার পণ্যের তথ্য ও মার্কেটিং লক্ষ্য দিন, AI আপনার জন্য একটি সম্পূর্ণ ফানেল-ভিত্তিক ক্যাম্পেইন কৌশল তৈরি করে দেবে।</p>
            </div>

            <div className="card-style p-6">
                 <div className="mb-6">
                     <label htmlFor="campaignGoal" className="block text-lg font-bold text-gray-800 mb-2">১. আপনার প্রধান লক্ষ্য কী?</label>
                     <select
                        id="campaignGoal"
                        value={selectedGoal}
                        onChange={(e) => setSelectedGoal(e.target.value as CampaignGoal)}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                     >
                        <option value="SALES_CONVERSION">সরাসরি বিক্রয় বৃদ্ধি করা</option>
                        <option value="LEAD_GENERATION">লিড সংগ্রহ করা</option>
                        <option value="BRAND_AWARENESS">ব্র্যান্ড সচেতনতা বৃদ্ধি</option>
                     </select>
                </div>
                 <div className="mb-6">
                    <label htmlFor="totalBudget" className="block text-lg font-bold text-gray-800 mb-2">২. আপনার মোট বাজেট কত?</label>
                    <div className="relative">
                        <input
                            type="number"
                            id="totalBudget"
                            value={totalBudget}
                            onChange={(e) => setTotalBudget(Number(e.target.value))}
                            className="w-full p-3 pl-20 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="10000"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 font-semibold">BDT (৳)</span>
                        </div>
                    </div>
                </div>
                <div>
                     <h3 className="text-lg font-bold text-gray-800 mb-2">৩. আপনার প্রোডাক্টের তথ্য দিন</h3>
                    <InputForm onSubmit={handleGenerateStrategy} isLoading={isLoading} />
                </div>
            </div>

            {isLoading && (
                 <div className="flex flex-col items-center justify-center h-64 bg-white p-6 rounded-xl shadow-lg">
                    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
                    <p className="mt-4 text-lg font-semibold text-gray-700">আপনার জন্য ক্যাম্পেইন কৌশল তৈরি হচ্ছে...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
                    <p><strong>ত্রুটি:</strong> {error}</p>
                </div>
            )}

            {campaignStrategy && (
                <div className="card-style p-6 animate-fade-in">
                    <div className="text-center mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold text-gray-900">{campaignStrategy.strategy_title}</h2>
                        <p className="text-gray-600"><strong>লক্ষ্য:</strong> {campaignStrategy.primary_goal}</p>
                        <p className="mt-2 text-lg font-bold text-indigo-600">মোট বাজেট: ৳{campaignStrategy.total_budget.toLocaleString('bn-BD')}</p>
                    </div>

                    <div className="mb-6 bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
                        <h4 className="font-bold text-indigo-800 flex items-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                             </svg>
                            বাজেট বরাদ্দের যুক্তি
                        </h4>
                        <p className="text-sm text-indigo-900 mt-2 leading-relaxed">{campaignStrategy.budget_reasoning}</p>
                    </div>

                    <div className="space-y-4">
                        {campaignStrategy.funnel.map((stage, index) => (
                            <Accordion key={stage.stage} title={`${stage.title} (${stage.stage})`} defaultOpen={index === 0}>
                                <div className="space-y-4">
                                     <div className="p-3 bg-white rounded-md border">
                                        <p className="text-sm font-semibold text-gray-700">বাজেট বরাদ্দ:</p>
                                        <p className="text-xl font-bold text-gray-800">৳{stage.suggested_budget.toLocaleString('bn-BD')} <span className="text-sm font-normal text-gray-500">({stage.budget_allocation_percentage}%)</span></p>
                                    </div>
                                    <p className="text-sm italic text-gray-600"><strong>উদ্দেশ্য:</strong> {stage.objective}</p>
                                    <h4 className="font-semibold text-gray-700 pt-2 border-t">কনটেন্ট আইডিয়া:</h4>
                                    <div className="space-y-3">
                                        {stage.content_ideas.map((idea, ideaIndex) => (
                                            <div key={ideaIndex} className="bg-white p-3 border rounded-md">
                                                <h5 className="font-semibold text-gray-800">{idea.title}</h5>
                                                <p className="text-sm text-gray-600 mt-1">{idea.description}</p>
                                                <span className="mt-2 inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                    প্ল্যাটফর্ম: {idea.platform}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Accordion>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};