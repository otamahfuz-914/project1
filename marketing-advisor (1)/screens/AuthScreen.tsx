


import React, { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';

interface AuthScreenProps {
    onLoginSuccess: () => void;
}

const AuthLogoIcon: React.FC = () => (
    <div className="mx-auto h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg">
        <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 12.5C4.5 10.5 5.5 6.5 8.5 5.5C11.5 4.5 14 6.5 15 8C16.5 6.5 19 4.5 21.5 5.5C24.5 6.5 23.5 10.5 21 12.5C19.5 14 17 15.5 15.5 17C14.5 18 13.5 19.5 12 19.5C10.5 19.5 9.5 18 8.5 17C7 15.5 4.5 14 3 12.5C.5 10.5 1.5 6.5 4.5 5.5C7.5 4.5 10 6.5 11 8C9.5 9 8.5 10.5 7 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.5 17C15.5 17.5 15.5 18.5 15.5 19.5C15.5 20.5 14.5 21.5 12 21.5C9.5 21.5 8.5 20.5 8.5 19.5C8.5 18.5 8.5 17.5 8.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    </div>
);

const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639l4.443-5.244a5.25 5.25 0 018.736 0l4.443 5.244a1.012 1.012 0 010 .639l-4.443 5.243a5.25 5.25 0 01-8.736 0l-4.443-5.243z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EyeSlashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" />
    </svg>
);

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const { login, register } = useContext(AuthContext);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            if (!email || !password) {
                setError('অনুগ্রহ করে ইমেইল এবং পাসওয়ার্ড দিন।');
                return;
            }
            const success = login(email);
            if (success) {
                onLoginSuccess();
            } else {
                setError('ইমেইল বা পাসওয়ার্ড সঠিক নয়।');
            }
        } else {
            if (!fullName || !email || !password || !confirmPassword) {
                setError('অনুগ্রহ করে সকল বাধ্যতামূলক ঘর পূরণ করুন।');
                return;
            }
            if (password !== confirmPassword) {
                setError('পাসওয়ার্ড দুটি মিলছে না।');
                return;
            }
            const result = register(email);
            if (result.success) {
                onLoginSuccess();
            } else {
                setError(result.message);
            }
        }
    };

    const renderInputField = (label: string, id: string, type: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string, required: boolean, isOptional: boolean = false) => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>} {isOptional && <span className="text-gray-400">(ঐচ্ছিক)</span>}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                autoComplete={id}
                required={required}
                value={value}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={placeholder}
            />
        </div>
    );
    
    const renderPasswordStrengthIndicator = () => {
        // Simple length check for demo
        const strength = password.length > 10 ? 'Strong' : password.length > 6 ? 'Medium' : 'Weak';
        if (!password) return null;
        return (
            <div className="flex items-center gap-2 mt-1">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${strength === 'Strong' ? 'bg-green-500 w-full' : strength === 'Medium' ? 'bg-yellow-500 w-2/3' : 'bg-red-500 w-1/3'}`}></div>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{strength}</span>
            </div>
        );
    }
    
    const renderPasswordField = (label: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string, show: boolean, toggle: () => void, withStrength?: boolean) => (
         <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
                <input
                    id={id}
                    name={id}
                    type={show ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={value}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder={placeholder}
                />
                <button type="button" onClick={toggle} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                    {show ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
            </div>
            {withStrength && renderPasswordStrengthIndicator()}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-indigo-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6">
                <div className="text-center">
                    <AuthLogoIcon />
                    <h1 className="mt-4 text-3xl font-bold text-gray-900 tracking-tight">AI Marketing Platform</h1>
                    <p className="mt-2 text-md text-gray-600">
                        {isLogin ? 'আপনার অ্যাকাউন্টে লগইন করুন' : 'নতুন অ্যাকাউন্ট তৈরি করুন'}
                    </p>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isLogin ? 'লগইন করুন' : 'রেজিস্টার করুন'}
                        </h2>
                        {!isLogin && <p className="mt-1 text-sm text-gray-500">আপনার তথ্য দিয়ে নতুন অ্যাকাউন্ট তৈরি করুন</p>}
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                        {!isLogin && renderInputField('পূর্ণ নাম', 'fullName', 'text', fullName, (e) => setFullName(e.target.value), 'আপনার পূর্ণ নাম', true)}
                        
                        {renderInputField('ইমেইল', 'email', 'email', email, (e) => setEmail(e.target.value), 'আপনার ইমেইল ঠিকানা', true)}
                        
                        {!isLogin && (
                            <>
                                {renderInputField('কোম্পানির নাম', 'companyName', 'text', companyName, (e) => setCompanyName(e.target.value), 'আপনার কোম্পানির নাম', false, true)}
                                {renderInputField('ফোন নম্বর', 'phone', 'tel', phone, (e) => setPhone(e.target.value), 'আপনার ফোন নম্বর', false, true)}
                            </>
                        )}
                        
                        {renderPasswordField('পাসওয়ার্ড', 'password', password, (e) => setPassword(e.target.value), 'আপনার পাসওয়ার্ড', showPassword, () => setShowPassword(!showPassword), !isLogin)}

                        {!isLogin && renderPasswordField('পাসওয়ার্ড নিশ্চিত করুন', 'confirmPassword', confirmPassword, (e) => setConfirmPassword(e.target.value), 'পাসওয়ার্ড আবার লিখুন', showConfirmPassword, () => setShowConfirmPassword(!showConfirmPassword))}

                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 mt-4 border border-transparent rounded-md shadow-sm text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                {isLogin ? 'লগইন করুন' : 'রেজিস্টার করুন'}
                            </button>
                        </div>
                    </form>
                    
                    <div className="text-sm text-center mt-6">
                        <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="font-medium text-indigo-600 hover:text-indigo-500">
                            {isLogin ? 'অ্যাকাউন্ট নেই? রেজিস্টার করুন' : 'ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন'}
                        </button>
                    </div>
                </div>
                 
                {!isLogin && (
                     <p className="text-center text-xs text-gray-500 px-4">
                         রেজিস্টার করার মাধ্যমে আপনি আমাদের <a href="#" className="font-medium text-indigo-600 hover:underline">শর্তাবলী</a> এবং <a href="#" className="font-medium text-indigo-600 hover:underline">গোপনীয়তা নীতি</a> মেনে নিচ্ছেন।
                     </p>
                 )}
            </div>
        </div>
    );
};