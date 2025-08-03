
import React, { useState, useContext } from 'react';
import { type ProductInfo, Plan, CampaignType } from '../types';
import { AuthContext } from '../AuthContext';
import { CAMPAIGN_DETAILS } from '../constants';

interface InputFormProps {
  onSubmit: (productInfo: ProductInfo, campaignType: CampaignType | null) => void;
  isLoading: boolean;
}

const CATEGORIES = [
    'Fashion and Apparel',
    'Electronics and Gadgets',
    'Food and Beverage',
    'Health and Beauty',
    'Home and Lifestyle',
    'Education',
    'Services (Digital/Physical)',
    'Other'
];

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const { user } = useContext(AuthContext);
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    name: '',
    description: '',
    price: '',
    currency: 'BDT (৳)',
    targetAgeStart: '18',
    targetAgeEnd: '65',
    category: '',
  });
  const [selectedCampaignType, setSelectedCampaignType] = useState<CampaignType | null>(null);

  const showCampaignTypeSelector = user?.plan === Plan.STANDARD || user?.plan === Plan.PRO;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProductInfo({ ...productInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(productInfo, selectedCampaignType);
  };

  return (
    <div className="animate-fade-in">
        <div className="mb-6">
            <div className="flex items-center gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5v-5.714c0-.597-.237-1.17-.659-1.591L14.25 3.104 9.75 3.104l4.5 7.5 4.5-7.5z" />
                </svg>
                <h2 className="text-xl font-bold text-gray-800">প্রোডাক্ট তথ্য ফর্ম</h2>
            </div>
            <p className="text-sm text-gray-500 mt-2 ml-11">আপনার প্রোডাক্ট সম্পর্কে বিস্তারিত তথ্য দিন</p>
        </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">প্রোডাক্ট নাম <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="name"
            name="name"
            value={productInfo.name}
            onChange={handleChange}
            placeholder="যেমন: স্মার্টফোন, ওয়েব ডিজাইন সেবা"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">প্রোডাক্ট এর কাজ <span className="text-red-500">*</span></label>
          <textarea
            id="description"
            name="description"
            value={productInfo.description}
            onChange={handleChange}
            rows={3}
            placeholder="যেমন: উন্নত ক্যামেরা সহ স্মার্টফোন যা ছবি তোলা ও ভিডিও কল করার জন্য ব্যবহৃত হয়"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {showCampaignTypeSelector && (
          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">ক্যাম্পেইন টাইপ (ঐচ্ছিক)</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(Object.keys(CAMPAIGN_DETAILS) as Array<keyof typeof CAMPAIGN_DETAILS>).map(key => {
                    const campaign = CAMPAIGN_DETAILS[key];
                    return (
                        <div key={key}>
                            <input
                                type="radio"
                                id={key}
                                name="campaignType"
                                value={key}
                                checked={selectedCampaignType === key}
                                onChange={() => setSelectedCampaignType(selectedCampaignType === key ? null : key)}
                                className="hidden peer"
                            />
                            <label
                                htmlFor={key}
                                className="block p-4 border rounded-lg cursor-pointer transition-all peer-checked:border-indigo-600 peer-checked:ring-2 peer-checked:ring-indigo-500 peer-checked:bg-indigo-50 border-gray-300 bg-white hover:border-gray-400"
                            >
                                <h4 className="font-semibold text-sm text-gray-800">{campaign.name}</h4>
                                <p className="text-xs text-gray-500 mt-1">{campaign.description}</p>
                            </label>
                        </div>
                    )
                })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                 <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">প্রাইস <span className="text-red-500">*</span></label>
                <div className="flex">
                     <input
                        type="number"
                        id="price"
                        name="price"
                        value={productInfo.price}
                        onChange={handleChange}
                        placeholder="যেমন: 25000"
                        className="flex-grow w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                     <select
                        id="currency"
                        name="currency"
                        value={productInfo.currency}
                        onChange={handleChange}
                        className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option>BDT (৳)</option>
                        <option>USD ($)</option>
                    </select>
                </div>
            </div>
             <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">ক্যাটাগরি <span className="text-red-500">*</span></label>
                <select
                    id="category"
                    name="category"
                    value={productInfo.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    required
                >
                    <option value="" disabled>ক্যাটাগরি নির্বাচন করুন</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
        </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="targetAgeStart" className="block text-sm font-medium text-gray-700 mb-1">টার্গেট এইজ (শুরু) <span className="text-red-500">*</span></label>
              <input
                type="number"
                id="targetAgeStart"
                name="targetAgeStart"
                value={productInfo.targetAgeStart}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="targetAgeEnd" className="block text-sm font-medium text-gray-700 mb-1">টার্গেট এইজ (শেষ)</label>
              <input
                type="number"
                id="targetAgeEnd"
                name="targetAgeEnd"
                value={productInfo.targetAgeEnd}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                জেনারেট হচ্ছে...
              </>
            ) : (
              'কনটেন্ট জেনারেট করুন'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};