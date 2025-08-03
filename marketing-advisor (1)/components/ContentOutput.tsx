import React, { useState, useEffect, useContext } from 'react';
import { Plan } from '../types';
import type { GeneratedContent, MarketingVariation, VideoScript, CoreAudienceSet, AudienceSuggestion } from '../types';
import { Loader } from './Loader';
import { AuthContext } from '../AuthContext';

interface ContentOutputProps {
  content: GeneratedContent | null;
  isLoading: boolean;
  error: string | null;
  isGeneratingScript: boolean;
  generatedScript: VideoScript | null;
  onGenerateScript: (adCopy: string) => void;
  onToggleSave: (variationId: number) => void;
  displaySection?: 'content' | 'audience' | 'video';
}

const StarIconFilled: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
      <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.134-.662 1.456 0l1.86 3.844 4.251.618c.732.107 1.023.99.494 1.513l-3.076 2.998.726 4.234c.125.73-.64 1.284-1.29.939L10 15.176l-3.818 2.008c-.65.345-1.415-.209-1.29-.939l.726-4.234-3.076-2.998c-.529-.523-.238-1.406.494-1.513l4.251-.618 1.86-3.844z" clipRule="evenodd" />
    </svg>
);

const StarIconOutline: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.613.049.842.859.433 1.283l-4.018 3.882a.563.563 0 00-.162.522l.942 5.503a.563.563 0 01-.813.612l-4.925-2.738a.563.563 0 00-.526 0l-4.925 2.738a.563.563 0 01-.813-.612l.942-5.503a.563.563 0 00-.162-.522l-4.018-3.882a.563.563 0 01.433-1.283l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
);

const OutputCard: React.FC<{ title?: string; children: React.ReactNode, icon?: React.ReactNode, noPadding?: boolean }> = ({ title, children, icon, noPadding }) => (
    <div className={`card-style ${noPadding ? '' : 'p-6'} mb-6`}>
        {title && <div className="flex items-center mb-4 px-6 pt-6">
            {icon}
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </div>}
        <div className={`space-y-4 text-gray-700 ${noPadding ? '' : 'px-6 pb-6'}`}>
            {children}
        </div>
    </div>
);

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-indigo-100 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100"
            aria-label={copied ? 'Copied' : 'Copy'}
        >
            {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                    <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h6a2 2 0 00-2-2H5z" />
                </svg>
            )}
        </button>
    );
};

const StructuredContentCard: React.FC<{ variation: MarketingVariation }> = ({ variation }) => {
    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-800">ব্যবহৃত ফর্মুলা: <span className="font-bold">{variation.formula_name}</span></h4>
                <p className="text-sm text-indigo-700 mt-1">{variation.reasoning}</p>
            </div>
            
             <div className="card-style p-5 relative group">
                <h4 className="text-sm font-bold uppercase text-gray-400 tracking-wider mb-2">হুক (Hook)</h4>
                <p className="text-gray-800 font-semibold leading-relaxed">{variation.hook}</p>
                <CopyButton textToCopy={variation.hook} />
            </div>

            <div className="card-style p-5 relative group">
                <h4 className="text-sm font-bold uppercase text-gray-400 tracking-wider mb-2">কনটেন্ট বডি</h4>
                <p className="whitespace-pre-wrap leading-relaxed text-gray-700 text-justify">{variation.body}</p>
                <CopyButton textToCopy={variation.body} />
            </div>

            <div className="card-style p-5 relative group bg-gray-800 text-white">
                 <h4 className="text-sm font-bold uppercase text-gray-300 tracking-wider mb-2">কল টু অ্যাকশন (CTA)</h4>
                 <p className="font-bold text-lg">{variation.cta}</p>
                 <CopyButton textToCopy={variation.cta} />
            </div>
        </div>
    );
};

const TagList: React.FC<{ title: string; tags: string[] | undefined; color: 'indigo' | 'teal' | 'pink' | 'sky' | 'purple' }> = ({ title, tags, color }) => {
    if (!tags || tags.length === 0) return null;

    const colorClasses = {
        indigo: 'bg-indigo-100 text-indigo-800',
        teal: 'bg-teal-100 text-teal-800',
        pink: 'bg-pink-100 text-pink-800',
        sky: 'bg-sky-100 text-sky-800',
        purple: 'bg-purple-100 text-purple-800',
    };

    return (
        <div>
            <strong>{title}:</strong>
            <div className="flex flex-wrap gap-1.5 mt-1">
                {tags.map((tag, i) => (
                    <span key={i} className={`${colorClasses[color]} px-2 py-0.5 rounded-full text-xs font-medium`}>{tag}</span>
                ))}
            </div>
        </div>
    );
};


const CoreAudienceCard: React.FC<{ audience: CoreAudienceSet }> = ({ audience }) => (
    <div className="card-style p-5">
        <h4 className="font-bold text-gray-800">{audience.title}</h4>
        <p className="text-xs text-gray-500 mb-3 italic">{audience.reasoning}</p>
        <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-x-4">
                <span><strong>Age:</strong> {audience.age}</span>
                <span><strong>Gender:</strong> {audience.gender}</span>
            </div>
            <div><strong>Location:</strong> {audience.location}</div>
            
            <TagList title="Relationship" tags={audience.relationship} color="pink" />
            <TagList title="Education" tags={audience.education} color="sky" />
            <TagList title="Profession" tags={audience.profession} color="purple" />
            <TagList title="Interests" tags={audience.interests} color="indigo" />
            <TagList title="Behaviors" tags={audience.behaviors} color="teal" />
        </div>
    </div>
);


const AudienceSuggestionCard: React.FC<{ suggestion: AudienceSuggestion }> = ({ suggestion }) => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h5 className="font-bold text-gray-900">{suggestion.title}</h5>
        <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
        <div className="mt-3 bg-gray-100 p-2 rounded-md">
            <p className="text-xs font-semibold text-gray-500">How-to:</p>
            <p className="text-xs text-gray-700">{suggestion.how_to}</p>
        </div>
    </div>
);


export const ContentOutput: React.FC<ContentOutputProps> = ({ content, isLoading, error, isGeneratingScript, generatedScript, onGenerateScript, onToggleSave, displaySection }) => {
  const [activeVariationIndex, setActiveVariationIndex] = useState(0);
  const { user } = useContext(AuthContext);
  const showSaveFeature = user?.plan === Plan.STANDARD || user?.plan === Plan.PRO;

  useEffect(() => {
    if (content && content.variations && activeVariationIndex >= content.variations.length) {
      setActiveVariationIndex(0);
    }
  }, [content]);


  if (isLoading) {
    return <div className="min-h-[400px] flex items-center justify-center"><Loader /></div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl min-h-[400px]">
        <p>{error}</p>
      </div>
    );
  }

  if (!content || !content.variations || content.variations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-500 p-6 rounded-xl text-center min-h-[400px]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-800">আপনার কনটেন্ট এখানে দেখা যাবে</h3>
        <p className="mt-2 max-w-sm">শুরু করতে "প্রোডাক্ট তথ্য" ফর্মটি পূরণ করে "কনটেন্ট জেনারেট করুন" বাটনে ক্লিক করুন।</p>
      </div>
    );
  }

  const activeVariation = content.variations[activeVariationIndex];
  const hasCoreAudience = content.coreAudienceSets && content.coreAudienceSets.length > 0;
  const hasCustomAudiences = content.customAudienceSuggestions && content.customAudienceSuggestions.length > 0;
  const hasLookalikeAudiences = content.lookalikeAudienceSuggestions && content.lookalikeAudienceSuggestions.length > 0;

  const handleGenerateScriptClick = () => {
    if (activeVariation) {
        const fullAdCopy = `${activeVariation.hook}\n\n${activeVariation.body}\n\n${activeVariation.cta}`;
        onGenerateScript(fullAdCopy);
    }
  };


  return (
    <div className="animate-fade-in">
        {displaySection === 'content' && (
            <OutputCard noPadding>
                <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/50">
                    <div className="flex items-center overflow-x-auto">
                        {content.variations.map((variation, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveVariationIndex(index)}
                                className={`flex items-center py-3 px-5 text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                                    activeVariationIndex === index
                                        ? 'border-b-2 border-indigo-600 text-indigo-600 bg-white'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-white/50 border-b-2 border-transparent'
                                }`}
                            >
                                কনটেন্ট ভার্সন {index + 1}
                                {variation.isSaved && (
                                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-yellow-400 ml-1.5 inline-block">
                                        <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.134-.662 1.456 0l1.86 3.844 4.251.618c.732.107 1.023.99.494 1.513l-3.076 2.998.726 4.234c.125.73-.64 1.284-1.29.939L10 15.176l-3.818 2.008c-.65.345-1.415-.209-1.29-.939l.726-4.234-3.076-2.998c-.529-.523-.238-1.406.494-1.513l4.251-.618 1.86-3.844z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                     {showSaveFeature && activeVariation && (
                        <button
                            onClick={() => onToggleSave(activeVariation.id)}
                            className="p-3 text-gray-400 hover:text-yellow-500 transition-colors mr-2"
                            title={activeVariation.isSaved ? 'সংরক্ষণ সরান' : 'সংরক্ষণ করুন'}
                        >
                            {activeVariation.isSaved ? <StarIconFilled /> : <StarIconOutline />}
                            <span className="sr-only">Save Content</span>
                        </button>
                    )}
                </div>

                {activeVariation && (
                    <div className="p-4 sm:p-6">
                        <StructuredContentCard variation={activeVariation} />
                    </div>
                )}
            </OutputCard>
        )}
        
        {displaySection === 'audience' && (
            <div className="space-y-8">
                {hasCoreAudience && (
                    <OutputCard title="কোর অডিয়েন্স সেট" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {content.coreAudienceSets.map((audience, i) => <CoreAudienceCard key={i} audience={audience} />)}
                        </div>
                    </OutputCard>
                )}

                {hasCustomAudiences && (
                    <OutputCard title="কাস্টম অডিয়েন্স সাজেশন" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5V4H4zm0 9h5v5H4v-5zm9-9h5v5h-5V4zm0 9h5v5h-5v-5z" /></svg>}>
                        <div className="space-y-4">
                            {content.customAudienceSuggestions?.map((sug, i) => <AudienceSuggestionCard key={i} suggestion={sug} />)}
                        </div>
                    </OutputCard>
                )}
                
                {hasLookalikeAudiences && (
                     <OutputCard title="লুক-এলাইক অডিয়েন্স সাজেশন" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>}>
                        <div className="space-y-4">
                            {content.lookalikeAudienceSuggestions?.map((sug, i) => <AudienceSuggestionCard key={i} suggestion={sug} />)}
                        </div>
                    </OutputCard>
                )}
                
                {content.audienceReasoning && (
                    <OutputCard title="সামগ্রিক অডিয়েন্স কৌশল" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.7-1.588 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.833.582-1.888-.197-1.588-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>}>
                        <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{content.audienceReasoning}</p>
                    </OutputCard>
                )}
            </div>
        )}
      
        {displaySection === 'video' && (
            <div className="card-style p-6 mt-6">
                 <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">AI ভিডিও স্ক্রিপ্ট জেনারেটর</h3>
                
                {isGeneratingScript ? (
                    <div className="min-h-[200px] flex items-center justify-center"><Loader /></div>
                ) : generatedScript ? (
                    <div className="mt-4 space-y-6 animate-fade-in">
                        <h4 className="text-lg font-bold text-center text-indigo-700">"{generatedScript.title}"</h4>
                        {generatedScript.scenes.map(scene => (
                            <div key={scene.sceneNumber} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h5 className="font-bold text-gray-800 mb-3">দৃশ্য {scene.sceneNumber.toLocaleString('bn-BD')}</h5>
                                <div className="space-y-2 text-sm">
                                    <p><strong className="text-indigo-600">ভিজ্যুয়াল:</strong> {scene.visuals}</p>
                                    <p><strong className="text-teal-600">ভয়েসওভার:</strong> {scene.voiceover}</p>
                                    <p><strong className="text-purple-600">অন-স্ক্রিন টেক্সট:</strong> {scene.onScreenText}</p>
                                </div>
                            </div>
                        ))}
                         <div className="text-center">
                            <button
                                onClick={handleGenerateScriptClick}
                                disabled={isGeneratingScript}
                                className="w-full sm:w-auto mt-4 inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-base font-medium rounded-md text-white btn-primary"
                            >
                                আবার তৈরি করুন
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-500 mb-4 text-center">আপনার নির্বাচিত কনটেন্ট থেকে একটি সম্পূর্ণ ভিডিও স্ক্রিপ্ট তৈরি করুন।</p>
                         <div className="text-center">
                            <button 
                                onClick={handleGenerateScriptClick}
                                disabled={!content || isGeneratingScript || !activeVariation || (user?.plan === Plan.BASIC)}
                                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-base font-medium rounded-md text-white disabled:bg-gray-400 disabled:cursor-not-allowed group transition-colors btn-primary"
                            >
                                ভিডিও স্ক্রিপ্ট তৈরি করুন
                            </button>
                            {user?.plan === Plan.BASIC && <p className="text-xs text-red-500 mt-2">এই ফিচারটি ব্যবহার করতে আপনার প্ল্যান আপগ্রেড করুন।</p>}
                        </div>
                    </>
                )}

            </div>
        )}
    </div>
  );
};