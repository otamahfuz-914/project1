

import React, { useState } from 'react';
import type { Plan } from '../types';

interface PaymentModalProps {
  plan: { name: string; price: number };
  onClose: () => void;
  onSuccess: () => void;
}

const CardIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

const BkashIcon: React.FC<{className?: string}> = ({className}) => (
     <svg className={className} viewBox="0 0 128 41" fill="currentColor"><path d="M89.2 20.3c0-7.3-5-11.8-12.3-11.8H60.3v23.5h16.2c7.6 0 12.7-4.4 12.7-11.7zm-4.7 0c0 4.4-2.8 6.7-7.9 6.7H65V13.6h11.2c5.3 0 8.1 2.3 8.1 6.7zM20.9.3v31.5h17.3c9.3 0 15-5.6 15-15.8C53.2 5.8 47.5.3 38.2.3H20.9zm4.7 26.5V5h12.6c6.4 0 9.8 4 9.8 10.8s-3.4 10.7-9.8 10.7H25.6zM128 20.2c0-8.2-5.4-13-14-13-5.2 0-9.4 2.1-12.1 5.9V7.5H97.2v24.2h4.7V22c2.1-3.6 5.9-6.2 10.8-6.2 5.7 0 9.3 3.3 9.3 8.9s-3.6 8.9-9.3 8.9c-5 0-8.7-2.6-10.8-6.2v-1.1h-4.7v10h43.3V20.2h-4.7z"/></svg>
);

export const PaymentModal: React.FC<PaymentModalProps> = ({ plan, onClose, onSuccess }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'bkash'>('card');
    const [cardDetails, setCardDetails] = useState({ name: '', number: '', expiry: '', cvc: '' });
    const [error, setError] = useState('');

    const handleCardPayment = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!cardDetails.name || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvc) {
            setError('অনুগ্রহ করে কার্ডের সমস্ত তথ্য পূরণ করুন।');
            return;
        }
        setIsProcessing(true);
        setTimeout(() => onSuccess(), 2000);
    };
    
    const handleBkashPayment = () => {
        setIsProcessing(true);
        setTimeout(() => onSuccess(), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">পেমেন্ট সম্পন্ন করুন</h2>
                    <p className="text-gray-500 mt-1">আপনি <span className="font-semibold text-indigo-600">{plan.name}</span> প্ল্যানটি বেছে নিয়েছেন।</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg text-center my-4 border">
                    <p className="text-sm text-gray-500">মোট পরিশোধ করতে হবে</p>
                    <p className="text-3xl font-bold text-gray-800">৳{plan.price.toLocaleString('bn-BD')}</p>
                </div>

                {isProcessing ? (
                    <div className="text-center py-8">
                        <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-4 text-gray-600 font-semibold">পেমেন্ট প্রসেস হচ্ছে...</p>
                        <p className="text-sm text-gray-500">অনুগ্রহ করে অপেক্ষা করুন।</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-2 bg-gray-200 p-1 rounded-lg mb-4">
                             <button onClick={() => setPaymentMethod('card')} className={`flex items-center justify-center gap-2 w-full p-2 rounded-md text-sm font-semibold transition-colors ${paymentMethod === 'card' ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}>
                                <CardIcon className="w-5 h-5"/> কার্ড
                            </button>
                             <button onClick={() => setPaymentMethod('bkash')} className={`flex items-center justify-center gap-2 w-full p-2 rounded-md text-sm font-semibold transition-colors ${paymentMethod === 'bkash' ? 'bg-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}>
                                <BkashIcon className="w-12 h-auto"/>
                            </button>
                        </div>

                        {paymentMethod === 'card' && (
                            <form onSubmit={handleCardPayment} className="space-y-3 animate-fade-in">
                                 <div>
                                    <label className="text-sm font-medium text-gray-700">কার্ড হোল্ডারের নাম</label>
                                    <input type="text" placeholder="আপনার নাম লিখুন" value={cardDetails.name} onChange={e => setCardDetails({...cardDetails, name: e.target.value})} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">কার্ড নম্বর</label>
                                    <input type="text" placeholder="•••• •••• •••• ••••" value={cardDetails.number} onChange={e => setCardDetails({...cardDetails, number: e.target.value})} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">মেয়াদ</label>
                                        <input type="text" placeholder="MM/YY" value={cardDetails.expiry} onChange={e => setCardDetails({...cardDetails, expiry: e.target.value})} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">CVC</label>
                                        <input type="text" placeholder="CVC" value={cardDetails.cvc} onChange={e => setCardDetails({...cardDetails, cvc: e.target.value})} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                </div>
                                {error && <p className="text-xs text-red-600 text-center">{error}</p>}
                                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors text-base">
                                     ৳{plan.price.toLocaleString('bn-BD')} পরিশোধ করুন
                                </button>
                            </form>
                        )}
                        
                        {paymentMethod === 'bkash' && (
                             <div className="animate-fade-in">
                                <button onClick={handleBkashPayment} className="w-full bg-pink-500 text-white font-bold py-3 rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center gap-2 text-lg">
                                    <BkashIcon className="w-16 h-auto"/>
                                    <span>দিয়ে পেমেন্ট করুন</span>
                                </button>
                             </div>
                        )}
                         <button
                            onClick={onClose}
                            className="w-full mt-3 text-center text-gray-500 font-medium py-2 rounded-lg hover:bg-gray-100 text-sm"
                        >
                            বাতিল করুন
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};