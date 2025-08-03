import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import { InputForm } from '../components/InputForm';
import { Loader } from '../components/Loader';
import { generateSocialPostContent, generateImageForPost } from '../services/marketingApi';
import type { ProductInfo, SocialPostContent } from '../types';

export const SocialStrategyScreen: React.FC = () => {
    const { user, setDailySocialPost } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    
    const today = new Date().toISOString().split('T')[0];
    const todaysPost = user?.dailySocialPost?.date === today ? user.dailySocialPost.content : null;

    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    const handleGeneratePost = async (productInfo: ProductInfo) => {
        setIsLoading(true);
        setError(null);
        try {
            const { postText, imagePrompt } = await generateSocialPostContent(productInfo);
            const imageBase64 = await generateImageForPost(imagePrompt);
            
            const newPost: SocialPostContent = {
                text: postText,
                imagePrompt: imagePrompt,
                imageUrl: `data:image/jpeg;base64,${imageBase64}`
            };

            setDailySocialPost({ date: today, content: newPost });

        } catch (err) {
            setError(err instanceof Error ? err.message : 'কনটেন্ট তৈরিতে একটি অজানা ত্রুটি হয়েছে।');
        } finally {
            setIsLoading(false);
        }
    };
    
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setToastMessage('পোস্টের লেখা কপি করা হয়েছে!');
    };
    
    const handleProceedToFacebook = () => {
        if (todaysPost) {
            copyToClipboard(todaysPost.text);
            setTimeout(() => {
                window.open('https://www.facebook.com/creatorstudio/home', '_blank');
            }, 500);
        }
    };
    
    const handleForceNewGeneration = () => {
        // This will clear today's post and show the form again
        setDailySocialPost(null);
    };

    if (isLoading) {
        return <div className="min-h-[400px] flex items-center justify-center"><Loader /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="elegant-title">দৈনিক সোশ্যাল স্ট্র্যাটেজি</h1>
                <p className="mt-2 elegant-subtitle">AI দিয়ে আপনার পণ্যের জন্য প্রতিদিন নতুন ফেসবুক পোস্ট ও ছবি তৈরি করুন।</p>
            </div>
            
            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
                    <p>{error}</p>
                </div>
            )}
            
            {!todaysPost ? (
                <div className="card-style p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
                    <InputForm onSubmit={handleGeneratePost} isLoading={isLoading} />
                </div>
            ) : (
                <div className="space-y-6">
                     <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg max-w-lg mx-auto">
                        <h3 className="font-semibold text-green-800">আপনার আজকের পোস্ট তৈরি আছে!</h3>
                     </div>
                     <div className="max-w-lg mx-auto">
                        {/* Post Preview Card */}
                        <div className="card-style overflow-hidden">
                             <img src={todaysPost.imageUrl} alt={todaysPost.imagePrompt} className="w-full h-auto object-cover aspect-square" />
                             <div className="p-5">
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{todaysPost.text}</p>
                             </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <a 
                                href={todaysPost.imageUrl} 
                                download={`ai_post_image_${today}.jpg`}
                                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                             >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                ছবি ডাউনলোড
                            </a>
                            <button onClick={() => copyToClipboard(todaysPost.text)} className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" /><path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h6a2 2 0 00-2-2H5z" /></svg>
                                লেখা কপি
                            </button>
                            <button onClick={handleProceedToFacebook} className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>
                                ফেসবুকে যান
                            </button>
                        </div>
                     </div>
                      <div className="mt-8 text-center">
                            <button onClick={handleForceNewGeneration} className="text-sm text-gray-500 hover:text-gray-700 hover:underline">
                                আবার নতুন করে তৈরি করতে চান?
                            </button>
                      </div>
                </div>
            )}
             {toastMessage && (
                <div className="fixed bottom-5 right-5 bg-gray-900 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in z-50">
                    {toastMessage}
                </div>
            )}
        </div>
    );
};