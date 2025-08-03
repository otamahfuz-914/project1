

import React, { useState, useContext } from 'react';
import { Plan, View } from '../types';
import { PRICING_PLANS } from '../constants';
import { AuthContext } from '../AuthContext';
import { PaymentModal } from '../components/PaymentModal';

interface PricingScreenProps {
    onNavigate: (view: View) => void;
}

const CheckIcon: React.FC = () => (
    <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
);

export const PricingScreen: React.FC<PricingScreenProps> = ({ onNavigate }) => {
    const { user, selectPlan } = useContext(AuthContext);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSelectPlan = (planKey: Plan) => {
        if (user) {
            setSelectedPlan(planKey);
            setIsModalOpen(true);
        } else {
            // If user is not logged in, navigate to auth screen
            onNavigate('auth');
        }
    };

    const handlePaymentSuccess = () => {
        if (selectedPlan) {
            selectPlan(selectedPlan);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900">আপনার জন্য সঠিক প্ল্যানটি বেছে নিন</h2>
            <p className="mt-4 text-center text-gray-500 max-w-2xl mx-auto">
                {user ? 'আপনার ব্যবসার প্রয়োজন অনুযায়ী সেরা প্ল্যানটি সাবস্ক্রাইব করুন।' : 'শুরু করার জন্য আপনার পছন্দের প্ল্যানটি বেছে নিন এবং সাইন আপ করুন।'}
            </p>
            
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                {(Object.keys(PRICING_PLANS) as Array<keyof typeof PRICING_PLANS>).map(planKey => {
                    const plan = PRICING_PLANS[planKey];
                    const isPopular = plan.popular;
                    return (
                        <div key={planKey} className={`border rounded-lg p-6 flex flex-col hover:shadow-xl transition-shadow ${isPopular ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-200'}`}>
                            {isPopular && <div className="text-center mb-4"><span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">সবচেয়ে জনপ্রিয়</span></div>}
                            <h3 className="text-2xl font-semibold text-gray-800 text-center">{plan.name}</h3>
                            <div className="mt-4 flex items-baseline justify-center">
                                <span className="text-4xl font-extrabold">৳{plan.price.toLocaleString('bn-BD')}</span>
                                <span className="ml-1 text-xl font-medium text-gray-500">/মাস</span>
                            </div>
                            <ul className="mt-6 space-y-4 flex-grow">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckIcon />
                                        <span className="ml-3 text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-auto pt-6">
                                <button
                                    onClick={() => handleSelectPlan(planKey)}
                                    className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors ${isPopular ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-800 hover:bg-gray-900'}`}
                                >
                                    {user ? 'প্ল্যানটি বেছে নিন' : 'শুরু করুন'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {isModalOpen && selectedPlan && user && (
                <PaymentModal
                    plan={PRICING_PLANS[selectedPlan]}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
};