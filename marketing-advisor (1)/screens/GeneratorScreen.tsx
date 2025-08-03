
import React, { useState, useCallback, useContext, useEffect } from 'react';
import { InputForm } from '../components/InputForm';
import { ContentOutput } from '../components/ContentOutput';
import { generateMarketingContent, generateVideoScript } from '../services/marketingApi';
import type { ProductInfo, GeneratedContent, VideoScript, CampaignType } from '../types';
import { AuthContext } from '../AuthContext';

type Tab = 'productInfo' | 'generatedContent' | 'facebookTargeting' | 'video';

interface GeneratorScreenProps {
    contentToView: {content: GeneratedContent, index: number} | null;
}

const TABS: { id: Tab, name: string }[] = [
    { id: 'productInfo', name: 'প্রোডাক্ট তথ্য' },
    { id: 'generatedContent', name: 'জেনারেটেড কনটেন্ট' },
    { id: 'facebookTargeting', name: 'ফেসবুক টার্গেটিং' },
    { id: 'video', name: 'ভিডিও স্ক্রিপ্ট' },
];

export const GeneratorScreen: React.FC<GeneratorScreenProps> = ({ contentToView }) => {
  const { user, addGeneratedContent, updateGeneratedContent } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<Tab>('productInfo');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [contentIndex, setContentIndex] = useState<number | null>(null);

  const [isGeneratingScript, setIsGeneratingScript] = useState<boolean>(false);
  const [generatedScript, setGeneratedScript] = useState<VideoScript | null>(null);


  useEffect(() => {
    if (contentToView) {
        setGeneratedContent(contentToView.content);
        setContentIndex(contentToView.index);
        setGeneratedScript(contentToView.content.videoScript || null);
        setActiveTab('generatedContent');
    }
  }, [contentToView]);


  const startContentGeneration = async (productInfo: ProductInfo, campaignType: CampaignType | null) => {
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    setGeneratedScript(null);
    setContentIndex(null);
    setActiveTab('generatedContent');

    try {
      const apiResult = await generateMarketingContent(productInfo, user?.plan || null, campaignType);
      
      const finalContent: GeneratedContent = {
        ...apiResult,
        createdAt: new Date().toISOString(),
      };

      if (finalContent && finalContent.variations.length > 0) {
        addGeneratedContent(finalContent);
        setGeneratedContent(finalContent);
        setContentIndex(0); // It's the newest item, so index is 0
      } else {
        setError('AI থেকে কোনো কনটেন্ট তৈরি করা সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('কনটেন্ট তৈরি করতে একটি অজানা সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFormSubmit = (productInfo: ProductInfo, campaignType: CampaignType | null) => {
    startContentGeneration(productInfo, campaignType);
  };

  const handleGenerateScript = useCallback(async (adCopy: string) => {
    if (!adCopy || contentIndex === null || !generatedContent) return;

    setIsGeneratingScript(true);
    setGeneratedScript(null);
    
    try {
        const script = await generateVideoScript(adCopy);
        setGeneratedScript(script);
        // Persist the generated script to the main content object
        const updatedContent = { ...generatedContent, videoScript: script };
        updateGeneratedContent(contentIndex, updatedContent);
        setGeneratedContent(updatedContent);

    } catch (err) {
        console.error("Error generating video script", err);
        setError(err instanceof Error ? err.message : 'ভিডিও স্ক্রিপ্ট তৈরিতে একটি সমস্যা হয়েছে।');
    } finally {
        setIsGeneratingScript(false);
    }

  }, [generatedContent, contentIndex, updateGeneratedContent]);

  const handleToggleSaveVariation = useCallback((variationId: number) => {
    if (!generatedContent || contentIndex === null) return;

    const updatedVariations = generatedContent.variations.map(v =>
        v.id === variationId ? { ...v, isSaved: !v.isSaved } : v
    );

    const updatedContent = { ...generatedContent, variations: updatedVariations };
    
    // Update local state for immediate UI feedback
    setGeneratedContent(updatedContent);
    // Persist the change
    updateGeneratedContent(contentIndex, updatedContent);

  }, [generatedContent, contentIndex, updateGeneratedContent]);

  const renderContent = () => {
      switch (activeTab) {
          case 'productInfo':
              return (
                <div className="card-style p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
                  <InputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
                </div>
              );
          case 'generatedContent':
              return <ContentOutput content={generatedContent} isLoading={isLoading} error={error} displaySection="content" isGeneratingScript={isGeneratingScript} generatedScript={generatedScript} onGenerateScript={handleGenerateScript} onToggleSave={handleToggleSaveVariation} />;
          case 'facebookTargeting':
              return <ContentOutput content={generatedContent} isLoading={isLoading} error={error} displaySection="audience" isGeneratingScript={isGeneratingScript} generatedScript={generatedScript} onGenerateScript={handleGenerateScript} onToggleSave={handleToggleSaveVariation} />
          case 'video':
              return <ContentOutput content={generatedContent} isLoading={isLoading} error={error} displaySection="video" isGeneratingScript={isGeneratingScript} generatedScript={generatedScript} onGenerateScript={handleGenerateScript} onToggleSave={handleToggleSaveVariation}/>
          default:
              return null;
      }
  };

  return (
      <div className="animate-fade-in">
        <div className="text-center mb-8">
            <h1 className="elegant-title">উন্নত AI কনটেন্ট জেনারেটর</h1>
            <p className="mt-2 elegant-subtitle">প্রোডাক্ট তথ্য দিয়ে স্বয়ংক্রিয়ভাবে কার্যকর মার্কেটিং কনটেন্ট ও ভিডিও তৈরি করুন।</p>
        </div>
        
        <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex justify-center space-x-2 sm:space-x-6 overflow-x-auto" aria-label="Tabs">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        disabled={!generatedContent && tab.id !== 'productInfo'}
                        className={`whitespace-nowrap py-3 px-4 border-b-2 font-semibold text-sm transition-colors duration-200 focus:outline-none disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-transparent ${
                            activeTab === tab.id
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        aria-current={activeTab === tab.id ? 'page' : undefined}
                    >
                        {tab.name}
                    </button>
                ))}
            </nav>
        </div>

        <div>
            {error && activeTab === 'productInfo' && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl animate-fade-in max-w-2xl mx-auto">
                    <p>{error}</p>
                </div>
            )}
            {renderContent()}
        </div>
      </div>
  );
};