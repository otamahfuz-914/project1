
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white p-6 rounded-xl shadow-lg">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
        <p className="mt-4 text-lg font-semibold text-gray-700">আপনার জন্য সেরা কনটেন্ট তৈরি হচ্ছে...</p>
        <p className="text-gray-500">অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন।</p>
    </div>
  );
};