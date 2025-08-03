
import React, { useState, useEffect } from 'react';
import { type AnalysisResult } from '../types';
import { analyzeBusinessProblemFromImage } from '../services/marketingApi';


const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
  
const base64ToBlob = (base64: string, contentType: string = ''): Blob => {
    const sliceSize = 512;
    const byteCharacters = atob(base64.split(',')[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
};


const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1-1m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
);

const ImageAnalysisDisplay: React.FC<{ result: AnalysisResult }> = ({ result }) => (
    <div className="space-y-8 animate-fade-in">
        <ResultCard title="সমস্যার সারসংক্ষেপ" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}>
            <p className="font-semibold">{result.problem_summary}</p>
        </ResultCard>

        <ResultCard title="বিস্তারিত বিশ্লেষণ" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}>
            <p>{result.detailed_analysis}</p>
        </ResultCard>

         <ResultCard title="ব্যবসায়িক প্রভাব" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
            <p>{result.impact_assessment}</p>
        </ResultCard>
         
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 <h3 className="text-xl font-bold text-gray-800">কার্যকরী সমাধান</h3>
            </div>
            <div className="space-y-6">
                 {result.solutions.map((solution, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold text-md text-gray-900">{solution.title}</h4>
                            <PriorityBadge priority={solution.priority} />
                        </div>
                        <ul className="space-y-2">
                            {solution.steps.map((step, stepIndex) => (
                                <li key={stepIndex} className="flex items-start">
                                    <svg className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    <span className="text-gray-700">{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                 ))}
            </div>
        </div>
    </div>
);


const ResultCard: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <div className="space-y-3 text-gray-700 leading-relaxed">
            {children}
        </div>
    </div>
);

const PriorityBadge: React.FC<{ priority: 'High' | 'Medium' | 'Low' }> = ({ priority }) => {
    const styles = {
        High: 'bg-red-100 text-red-800',
        Medium: 'bg-yellow-100 text-yellow-800',
        Low: 'bg-blue-100 text-blue-800',
    };
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[priority]}`}>
            {priority} Priority
        </span>
    );
};

export const AnalyzerScreen: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [problemDescription, setProblemDescription] = useState<string>('');
    const [imageAnalysisResult, setImageAnalysisResult] = useState<AnalysisResult | null>(null);
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handlePaste = (event: ClipboardEvent) => {
            const items = event.clipboardData?.items;
            if (!items) return;

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
    }, []);
    
    const processFile = (file: File) => {
        setImageFile(file);
        setImageAnalysisResult(null);
        setError(null);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };
    
    const handleCameraCapture = async () => {
        try {
            // @ts-ignore
            const base64Image = await window.puter.vision.takePicture();
            if (base64Image) {
                const blob = base64ToBlob(base64Image, 'image/jpeg');
                const file = new File([blob], "camera-shot.jpg", { type: 'image/jpeg' });
                processFile(file);
            }
        } catch (err) {
            console.error("Camera capture failed:", err);
            setError("ক্যামেরা দিয়ে ছবি তুলতে সমস্যা হয়েছে।");
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const executeAnalysis = async () => {
        setIsLoading(true);
        setError(null);
        setImageAnalysisResult(null);

        if (!imageFile) {
            setError("অনুগ্রহ করে প্রথমে একটি ছবি আপলোড করুন।");
            setIsLoading(false);
            return;
        }

        try {
            const base64Image = await toBase64(imageFile);
            const result = await analyzeBusinessProblemFromImage(base64Image, problemDescription);
            setImageAnalysisResult(result);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'একটি অজানা ত্রুটি ঘটেছে।');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">ছবি দিয়ে সমস্যা বিশ্লেষক</h2>
                    <p className="text-gray-500 mt-2 max-w-2xl mx-auto">আপনার ব্যবসার সমস্যার একটি ছবি/স্ক্রিনশট দিন এবং ঐচ্ছিকভাবে বর্ণনা করুন। AI এটি বিশ্লেষণ করে কারণ ও সমাধান বের করবে।</p>
                </div>

                <div className="animate-fade-in">
                    <div className="space-y-6">
                        <div className="space-y-3">
                             <label htmlFor="image-upload" className="flex justify-center w-full h-40 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="প্রিভিউ" className="h-full w-auto object-contain" />
                                ) : (
                                    <span className="flex items-center space-x-2">
                                        <UploadIcon/>
                                        <span className="font-medium text-gray-600">
                                            ছবি পেস্ট করুন (Ctrl+V) অথবা 
                                            <span className="text-blue-600 underline ml-1">ব্রাউজ করুন</span>
                                        </span>
                                    </span>
                                )}
                                <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                             <button
                                onClick={handleCameraCapture}
                                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                                title="মোবাইল ডিভাইসে এটি সরাসরি ক্যামেরা চালু করবে।"
                            >
                                <CameraIcon />
                                ক্যামেরা দিয়ে ছবি তুলুন
                            </button>
                        </div>
                        <div>
                            <label htmlFor="problemDescription" className="block text-sm font-medium text-gray-700 mb-1">আপনার সমস্যাটি বিস্তারিত বলুন (ঐচ্ছিক)</label>
                            <textarea
                                id="problemDescription"
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="এখানে আপনার সমস্যাটি বর্ণনা করুন। যেমন: 'আমার বিজ্ঞাপনে ক্লিক আসছে কিন্তু বিক্রি হচ্ছে না।' এটি AI-কে আরও সঠিক সমাধান দিতে সাহায্য করবে।"
                                value={problemDescription}
                                onChange={(e) => setProblemDescription(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                     <button
                        onClick={executeAnalysis}
                        disabled={isLoading}
                        className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
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

            {imageAnalysisResult && <ImageAnalysisDisplay result={imageAnalysisResult} />}
        </div>
    );
};