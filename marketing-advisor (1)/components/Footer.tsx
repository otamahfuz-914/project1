


import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white">
      <div className="container mx-auto px-4 py-8 text-center text-gray-500 border-t border-gray-200 mt-12">
        <p>&copy; {new Date().getFullYear()} এআই মার্কেটিং প্ল্যাটফর্ম। সর্বসত্ত্ব সংরক্ষিত।</p>
      </div>
    </footer>
  );
};