
import React, { useState, useEffect } from 'react';
import type { CompetitorAnalysisResult } from '../types';
import { generateCompetitorAnalysis } from '../services/marketingApi';

// Helper function to convert file to Base64
const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });


// --- Re-designed UI Components ---

const ResultSection: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode; }> = ({ title, children, icon }) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <div className="space-y-4 text-gray-700 leading-relaxed">
            {children}
        </div>
    </div>
);


const StrengthWeaknessCard: React.FC<{ item: { title: string; description: string }; type: 'strength' | 'weakness' }> = ({ item, type }) => {
    const isStrength = type === 'strength';
    const bgColor = isStrength ? 'bg-green-50' : 'bg-red-50';
    const iconColor = isStrength ? 'text-green-600' : 'text-red-600';
    const titleColor = isStrength ? 'text-green-800' : 'text-red-800';
    const Icon = isStrength ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
    );

    return (
        <div className={`${bgColor} p-4 rounded-lg border ${isStrength ? 'border-green-200' : 'border-red-200'}`}>
            <div className="flex items-center gap-3">
                <div className={iconColor}>{Icon}</div>
                <h4 className={`font-semibold ${titleColor}`}>{item.title}</h4>
            </div>
            <p className="text-sm text-gray-700 mt-2 ml-9">{item.description}</p>
        </div>
    );
};


const AnalysisDisplay: React.FC<{ result: CompetitorAnalysisResult; onReset: () => void }> = ({ result, onReset }) => (
    <div className="space-y-8 animate-fade-in">
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m3 6V7m-15.5 12h16.5a2 2 0 002-2V7a2 2 0 00-2-2H4.5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800">অ্যানালাইসিস সারসংক্ষেপ</h3>
            </div>
            <p className="font-medium text-gray-700">{result.analysis_summary}</p>
            <p className="text-sm text-gray-600 pt-3 border-t mt-3">
                <strong>আনুমানিক প্রতিযোগী:</strong>
                <span className="ml-2 bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full">{result.competitor_count_estimation}</span>
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                 <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" /></svg>
                    প্রতিযোগীদের শক্তি
                </h3>
                {result.common_strengths.map((item, i) => <StrengthWeaknessCard key={i} item={item} type="strength" />)}
            </div>
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" /></svg>
                    প্রতিযোগীদের দুর্বলতা
                </h3>
                {result.common_weaknesses.map((item, i) => <StrengthWeaknessCard key={i} item={item} type="weakness" />)}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-yellow-50/60 border border-yellow-300 p-6 rounded-xl shadow-lg">
                 <h3 className="text-xl font-bold text-yellow-900 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 011.414-1.414L8 12.586V5a1 1 0 012 0v7.586l3.293-3.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    মার্কেট গ্যাপ ও সুযোগ
                 </h3>
                 <h4 className="text-lg font-semibold text-gray-800 mt-3">{result.market_gap_analysis.title}</h4>
                 <p className="text-gray-700 mt-1">{result.market_gap_analysis.description}</p>
            </div>
            <div className="bg-indigo-50/60 border border-indigo-300 p-6 rounded-xl shadow-lg">
                 <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.789 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                    আপনার ইউনিক সেলিং প্রোপোজিশন (USP)
                 </h3>
                 <h4 className="text-lg font-semibold text-gray-800 mt-3">{result.suggested_usp.title}</h4>
                 <p className="text-gray-700 mt-1">{result.suggested_usp.description}</p>
            </div>
        </div>
        
        <ResultSection title="আপনার জেতার কৌশল" icon={
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a1 1 0 011-1h12a1 1 0 110 2H3a1 1 0 01-1-1z" /></svg>
        }>
            {result.winning_content_strategy.steps.map(step => (
                 <div key={step.step_number} className="flex items-start gap-4 p-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg border-2 border-blue-200">
                        {step.step_number.toLocaleString('bn-BD')}
                    </div>
                    <div>
                        <h4 className="font-bold text-blue-900">{step.title}</h4>
                        <p className="text-sm text-gray-700 mt-1">{step.description}</p>
                    </div>
                 </div>
            ))}
        </ResultSection>

        <div className="text-center pt-4">
            <button
                onClick={onReset}
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" /></svg>
                নতুন করে বিশ্লেষণ করুন
            </button>
        </div>
    </div>
);


export const CompetitorAnalyzerScreen: React.FC = () => {
    const [keyword, setKeyword] = useState('');
    const [competitorInfo, setCompetitorInfo] = useState('');
    const [myProductInfo, setMyProductInfo] = useState('');
    
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [analysisResult, setAnalysisResult] = useState<CompetitorAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handlePaste = (event: ClipboardEvent) => {
            const items = event.clipboardData?.items;
            if (!items || analysisResult) return; // Don't handle paste if results are shown

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    if (file) {
                        processFile(file);
                        event.preventDefault();
                        return;
                    }
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => {
            window.removeEventListener('paste', handlePaste);
        };
    }, [analysisResult]);

    const processFile = (file: File) => {
        setImageFile(file);
        setError(null);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };
    
    const handleReset = () => {
        setKeyword('');
        setCompetitorInfo('');
        setMyProductInfo('');
        setImageFile(null);
        setImagePreview(null);
        setAnalysisResult(null);
        setError(null);
        setIsLoading(false);
    };

    const executeAnalysis = async () => {
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        if (!keyword || (!competitorInfo && !imageFile)) {
            setError("অনুগ্রহ করে কীওয়ার্ড এবং প্রতিযোগীর তথ্য বা ছবি দিন।");
            setIsLoading(false);
            return;
        }

        try {
            const imageBase64 = imageFile ? await toBase64(imageFile) : null;
            const result = await generateCompetitorAnalysis(keyword, competitorInfo, myProductInfo, imageBase64);
            setAnalysisResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'একটি অজানা ত্রুটি ঘটেছে।');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="elegant-title">কম্পিটিটর অ্যানালাইসিস ও কৌশল</h1>
                <p className="mt-2 elegant-subtitle">ফেসবুক অ্যাড লাইব্রেরি থেকে প্রতিযোগীদের তথ্য কপি করে পেস্ট করুন, অথবা তাদের পণ্যের ছবি দিন। AI আপনার জন্য মার্কেট গ্যাপ, ইউনিক সেলিং পয়েন্ট (USP) এবং জেতার কৌশল তৈরি করবে।</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl animate-fade-in">
                    <p><strong>ত্রুটি:</strong> {error}</p>
                </div>
            )}
            
            {isLoading && (
                 <div className="flex flex-col items-center justify-center min-h-[400px] bg-white p-6 rounded-xl shadow-lg">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
                    <p className="mt-4 text-lg font-semibold text-gray-700">প্রতিযোগীদের বিশ্লেষণ করা হচ্ছে...</p>
                    <p className="text-sm text-gray-500">অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন।</p>
                </div>
            )}
            
            {!isLoading && analysisResult && <AnalysisDisplay result={analysisResult} onReset={handleReset}/>}

            {!isLoading && !analysisResult && (
                <div className="card-style p-6 sm:p-8 space-y-6 animate-fade-in">
                    {/* --- Input Section --- */}
                    <div>
                        <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">আপনার প্রধান কীওয়ার্ড <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="keyword"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="যেমন: টমেটো, শাড়ি, মোবাইল ফোন"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">প্রতিযোগীর তথ্য (বিজ্ঞাপনের লেখা বা ছবি) <span className="text-red-500">*</span></label>
                        <p className="text-xs text-gray-500 mb-2">ফেসবুক অ্যাড লাইব্রেরি থেকে প্রতিযোগীদের বিজ্ঞাপনের লেখা পেস্ট করুন, অথবা নিচের অপশন ব্যবহার করে তাদের পণ্যের ছবি আপলোড করুন। উভয়টিই প্রদান করলে বিশ্লেষণ আরও সঠিক হবে।</p>
                         <textarea
                            id="competitorInfo"
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="এখানে প্রতিযোগীদের বিজ্ঞাপনের লেখা, অফার, দাম ইত্যাদি পেস্ট করুন..."
                            value={competitorInfo}
                            onChange={(e) => setCompetitorInfo(e.target.value)}
                        />
                    </div>

                    {/* --- Image Uploader --- */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">প্রতিযোগীর পণ্যের ছবি পেস্ট করুন (Ctrl+V) অথবা ব্রাউজ করুন</p>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                           {imagePreview ? (
                                <div className="relative group">
                                    <img src={imagePreview} alt="প্রতিযোগীর প্রিভিউ" className="max-h-48 rounded-md" />
                                     <button 
                                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="ছবি সরান"
                                     >
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                     </button>
                                </div>
                           ) : (
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                        <span>একটি ফাইল আপলোড করুন</span>
                                        <input id="image-upload" name="image-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                    </label>
                                    <p className="pl-1">অথবা ক্যামেরা ব্যবহার করুন</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                           )}
                        </div>
                        <label 
                            htmlFor="camera-upload" 
                            className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                            title="মোবাইল ডিভাইসে এটি সরাসরি ক্যামেরা চালু করবে।"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                            ক্যামেরা দিয়ে ছবি তুলুন
                            <input id="camera-upload" type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
                        </label>
                    </div>

                    {/* --- My Product Info --- */}
                     <div>
                        <label htmlFor="myProductInfo" className="block text-sm font-medium text-gray-700 mb-1">আপনার নিজের পণ্য সম্পর্কে জানান <span className="text-gray-400">(ঐচ্ছিক)</span></label>
                         <textarea
                            id="myProductInfo"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="আপনার পণ্য কেন আলাদা বা এর প্রধান সুবিধা কী? এই তথ্য AI-কে আরও ভালো ইউনিক সেলিং পয়েন্ট (USP) তৈরি করতে সাহায্য করবে।"
                            value={myProductInfo}
                            onChange={(e) => setMyProductInfo(e.target.value)}
                        />
                    </div>
                     <div className="pt-2 text-center">
                        <button
                            onClick={executeAnalysis}
                            disabled={isLoading}
                            className="btn-primary w-full sm:w-auto inline-flex justify-center items-center gap-2 px-10 py-3 text-base"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                            বিশ্লেষণ করুন
                        </button>
                     </div>
                </div>
            )}
        </div>
    );
};
