import React from 'react';
import { Plan } from '../types';
import { PRICING_PLANS } from '../constants';

interface HomeScreenProps {
  onNavigate: (view: 'pricing' | 'auth') => void;
}

const AIBrainIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="#E0E7FF"/>
        <path d="M22.5 12C22.5 11.17 21.83 10.5 21 10.5C20.17 10.5 19.5 11.17 19.5 12V12.58C19.19 12.65 18.89 12.76 18.62 12.9L18.08 12.35C17.49 11.76 16.54 11.76 15.95 12.35C15.36 12.94 15.36 13.89 15.95 14.48L16.5 15.03C16.34 15.28 16.23 15.56 16.16 15.86L15.58 15.75C14.75 15.61 13.91 16.22 13.78 17.05C13.64 17.88 14.25 18.72 15.08 18.85L15.66 18.96C15.63 19.16 15.61 19.36 15.61 19.57C15.61 20.37 15.77 21.14 16.05 21.85H13.5C12.67 21.85 12 22.52 12 23.35C12 24.18 12.67 24.85 13.5 24.85H16.05C15.77 25.56 15.61 26.33 15.61 27.13C15.61 27.34 15.63 27.54 15.66 27.74L15.08 27.85C14.25 27.98 13.64 28.82 13.78 29.65C13.91 30.48 14.75 31.09 15.58 30.95L16.16 30.84C16.23 31.14 16.34 31.42 16.5 31.67L15.95 32.22C15.36 32.81 15.36 33.76 15.95 34.35C16.54 34.94 17.49 34.94 18.08 34.35L18.63 33.8C18.9 33.95 19.2 34.06 19.51 34.12V34.7C19.51 35.53 20.18 36.2 21.01 36.2C21.84 36.2 22.51 35.53 22.51 34.7V34.13C22.82 34.06 23.12 33.95 23.39 33.81L23.94 34.36C24.53 34.95 25.47 34.95 26.06 34.36C26.65 33.77 26.65 32.82 26.06 32.23L25.52 31.68C25.67 31.43 25.79 31.15 25.86 30.85L26.44 30.96C27.27 31.1 28.11 30.49 28.24 29.66C28.37 28.83 27.76 27.99 26.93 27.86L26.35 27.75C26.38 27.55 26.4 27.35 26.4 27.15C26.4 26.35 26.24 25.58 25.96 24.87H28.5C29.33 24.87 30 24.2 30 23.37C30 22.54 29.33 21.87 28.5 21.87H25.96C26.24 21.16 26.4 20.39 26.4 19.59C26.4 19.38 26.38 19.18 26.35 18.98L26.93 18.87C27.76 18.74 28.37 17.9 28.24 17.07C28.11 16.24 27.27 15.63 26.44 15.77L25.86 15.88C25.79 15.58 25.67 15.3 25.52 15.05L26.07 14.5C26.66 13.91 26.66 12.96 26.07 12.37C25.48 11.78 24.53 11.78 23.94 12.37L23.4 12.92C23.13 12.77 22.83 12.66 22.52 12.59L22.5 12Z" fill="#4F46E5"/>
        <path d="M20.94 18.15C20.64 17.55 20.03 17.25 19.43 17.25C18.83 17.25 18.22 17.55 17.92 18.15L17.5 18.9C16.81 20.13 16.81 21.57 17.5 22.8L17.92 23.55C18.22 24.15 18.83 24.45 19.43 24.45C20.03 24.45 20.64 24.15 20.94 23.55L21.52 22.65C22.11 21.69 22.11 20.76 21.52 19.8L20.94 18.15Z" fill="#A5B4FC"/>
        <path d="M24.08 18.15C23.78 17.55 23.17 17.25 22.57 17.25C21.97 17.25 21.36 17.55 21.06 18.15L20.48 19.8C19.89 20.76 19.89 21.69 20.48 22.65L21.06 23.55C21.36 24.15 21.97 24.45 22.57 24.45C23.17 24.45 23.78 24.15 24.08 23.55L24.5 22.8C25.19 21.57 25.19 20.13 24.5 18.9L24.08 18.15Z" fill="#C7D2FE"/>
        <circle cx="31" cy="11" r="5" fill="#FBBF24" stroke="#4338CA" strokeWidth="1.5"/>
        <path d="M29.5 9.75L30.5 9.75M29.5 12.25L30.5 12.25M32.5 9.75L31.5 9.75M32.5 12.25L31.5 12.25M31 8.5V7.5M31 14.5V13.5" stroke="#4338CA" strokeWidth="1" strokeLinecap="round"/>
        <path d="M30.06 9.53H30.5V13.3H29.56V12.38H29.55C29.29 13.04 28.66 13.44 27.91 13.44C27.24 13.44 26.74 13.23 26.41 12.8C26.08 12.37 25.92 11.75 25.92 10.94V9.53H26.86V10.87C26.86 11.45 26.97 11.89 27.19 12.18C27.41 12.47 27.75 12.61 28.2 12.61C28.98 12.61 29.55 12.13 29.55 11.2V9.53H30.06Z" fill="#4338CA"/>
        <path d="M34.31 13.3H33.37V9.53H34.31V13.3Z" fill="#4338CA"/>
    </svg>
);


const CheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
);

const featureCards = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.43 2.43a4.5 4.5 0 008.642-1.128 3 3 0 00-5.78-1.128zM15.75 12.75a3 3 0 00-5.78-1.128 2.25 2.25 0 01-2.43 2.43A4.5 4.5 0 0014.25 12a3 3 0 00-5.78-1.128 2.25 2.25 0 01-2.43 2.43a4.5 4.5 0 008.642-1.128 3 3 0 00-5.78-1.128zM18.75 9a3 3 0 00-5.78-1.128 2.25 2.25 0 01-2.43 2.43A4.5 4.5 0 0017.25 9a3 3 0 00-5.78-1.128 2.25 2.25 0 01-2.43 2.43a4.5 4.5 0 008.642-1.128 3 3 0 00-5.78-1.128z" /></svg>,
        title: 'AI-ভিত্তিক কনটেন্ট জেনারেশন',
        description: 'বিজ্ঞাপন কপি, ফেসবুক পোস্ট, পণ্যের বিবরণী ইত্যাদি স্বয়ংক্রিয়ভাবে তৈরি করুন।'
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        title: 'স্মার্ট পার্সোনালাইজেশন',
        description: 'গ্রাহকদের রুচি ও আচরণ বুঝে প্রত্যেককে তার মতো করে কনটেন্ট দেখান।'
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
        title: 'দ্রুত ও সহজ',
        description: 'নির্দিষ্ট প্রশ্ন করে মিনিটের মধ্যে মার্কেটিং এর জন্য প্রয়োজনীয় সকল কনটেন্ট পান।'
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
        title: 'বিক্রয় বৃদ্ধি',
        description: 'পার্সোনালাইজড মার্কেটিং এর মাধ্যমে গ্রাহকদের সাথে সম্পর্ক স্থাপন করুন ও বিক্রয় বাড়ান।'
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.512 2.72a3 3 0 01-4.682-2.72 9.094 9.094 0 013.741-.479m-4.26 9.22a9.094 9.094 0 003.742-.479 3 3 0 004.682-2.72m-7.512 2.72a3 3 0 01-4.682-2.72 9.094 9.094 0 013.742-.479" /></svg>,
        title: 'গ্রাহক সেগমেন্টেশন',
        description: 'আপনার গ্রাহকদের বয়স, পছন্দ, আচরণ ইত্যাদি অনুযায়ী ভাগ করে টার্গেটেড ক্যাম্পেইন চালান।'
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /></svg>,
        title: 'বিস্তারিত অ্যানালিটিক্স',
        description: 'আপনার মার্কেটিং ক্যাম্পেইনের পারফরম্যান্স ট্র্যাক করুন এবং ডাটা-ভিত্তিক সিদ্ধান্ত নিন।'
    }
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  return (
    <div className="text-gray-800 space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="text-center pt-12 md:pt-20">
          <div className="flex justify-center mb-6">
               <AIBrainIcon className="w-24 h-24" />
          </div>
        <h1 className="text-4xl sm:text-5xl md:text-[56px] font-extrabold text-gray-900 leading-tight">
          AI-ভিত্তিক স্মার্ট মার্কেটিং
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          কৃত্রিম বুদ্ধিমত্তার শক্তি ব্যবহার করে আপনার ব্যবসার জন্য পার্সোনালাইজড মার্কেটিং কনটেন্ট তৈরি করুন।
        </p>
        <div className="mt-8 flex justify-center items-center gap-4 flex-wrap">
          <button onClick={() => onNavigate('auth')} className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
            ফ্রি ট্রায়াল শুরু করুন
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
          </button>
          <button onClick={() => { /* TODO: Implement Demo */ }} className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-colors">
            ডেমো দেখুন
          </button>
        </div>
         <div className="mt-8 flex justify-center gap-x-6 gap-y-2 text-sm text-gray-500 flex-wrap">
            <span className="flex items-center gap-2"><CheckIcon className="w-5 h-5 text-green-500"/> কোনো ক্রেডিট কার্ডের প্রয়োজন নেই</span>
            <span className="flex items-center gap-2"><CheckIcon className="w-5 h-5 text-green-500"/> ফ্রি রিসোর্স লাইব্রেরি</span>
            <span className="flex items-center gap-2"><CheckIcon className="w-5 h-5 text-green-500"/> যেকোনো সময় বাতিল করুন</span>
         </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">কেন আমাদের প্ল্যাটফর্ম বেছে নেবেন?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">আধুনিক AI প্রযুক্তি এবং স্মার্ট ফিচারের সমন্বয়ে তৈরি আমাদের প্ল্যাটফর্ম আপনার মার্কেটিং প্রক্রিয়াকে করবে সহজ ও কার্যকর।</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureCards.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-start h-12 w-12 rounded-lg bg-indigo-100 text-indigo-600 mb-4">
                        {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
            ))}
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-16 md:py-24 bg-gray-50/50 rounded-xl -mx-4 px-4">
          <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">সাশ্রয়ী মূল্যে শক্তিশালী ফিচার</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">আপনার ব্যবসার আকার অনুযায়ী উপযুক্ত প্ল্যান বেছে নিন।</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
               {(Object.keys(PRICING_PLANS) as Array<keyof typeof PRICING_PLANS>).map(planKey => {
                  const plan = PRICING_PLANS[planKey];
                  return (
                      <div key={planKey} className={`rounded-lg p-6 flex flex-col border transition-all duration-300 ${plan.popular ? 'border-indigo-500 ring-2 ring-indigo-500 bg-white scale-105 shadow-2xl' : 'border-gray-200 bg-white hover:shadow-xl'}`}>
                          {plan.popular && (
                              <div className="text-center mb-4 -mt-9">
                                  <span className="bg-indigo-600 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">জনপ্রিয়</span>
                              </div>
                          )}
                          <h3 className="text-2xl font-semibold text-gray-800 text-center">{plan.name}</h3>
                          <div className="mt-4 flex items-baseline justify-center">
                              <span className="text-4xl font-extrabold tracking-tight">৳{plan.price.toLocaleString('bn-BD')}</span>
                              <span className="ml-1 text-xl font-medium text-gray-500">/মাস</span>
                          </div>
                           <p className="text-center text-sm text-gray-500 mt-2">যেকোনো সময় বাতিল করুন</p>
                          <ul className="mt-8 space-y-4 flex-grow">
                              {plan.features.map((feature, index) => (
                                  <li key={index} className="flex items-start">
                                      <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0 mr-2 mt-0.5"/>
                                      <span className="text-gray-600">{feature}</span>
                                  </li>
                              ))}
                          </ul>
                          <div className="mt-auto pt-8">
                              <button
                                  onClick={() => onNavigate('auth')}
                                  className={`w-full py-3 px-4 rounded-md font-semibold transition-colors ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-white text-indigo-600 ring-1 ring-indigo-200 hover:bg-indigo-50'}`}
                              >
                                  শুরু করুন
                              </button>
                          </div>
                      </div>
                  );
              })}
          </div>
      </section>

      {/* Final CTA Section */}
      <section>
         <div className="bg-blue-900 text-white rounded-lg p-8 sm:p-12 text-center">
            <h2 className="text-3xl font-bold">আজই শুরু করুন আপনার স্মার্ট মার্কেটিং যাত্রা</h2>
            <p className="mt-4 max-w-2xl mx-auto text-blue-200">হাজারো ব্যবসায়ী আমাদের প্ল্যাটফর্ম ব্যবহার করে তাদের মার্কেটিং এর মান উন্নত করেছেন।</p>
            <div className="mt-8 flex justify-center items-center gap-4">
              <button onClick={() => onNavigate('auth')} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-colors">
                ফ্রি ট্রায়াল শুরু করুন
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>
              </button>
               <button onClick={() => onNavigate('pricing')} className="px-6 py-3 bg-transparent text-white font-semibold rounded-lg ring-2 ring-blue-500 hover:bg-blue-800 transition-colors">
                  প্ল্যান দেখুন
               </button>
            </div>
          </div>
      </section>
    </div>
  );
};