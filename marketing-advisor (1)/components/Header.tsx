import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { View } from '../types';

interface HeaderProps {
    onNavigate: (view: View) => void;
    currentView: View;
}

const AIBrainIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="#4F46E5"/>
        <path d="M22.5 12C22.5 11.17 21.83 10.5 21 10.5C20.17 10.5 19.5 11.17 19.5 12V12.58C19.19 12.65 18.89 12.76 18.62 12.9L18.08 12.35C17.49 11.76 16.54 11.76 15.95 12.35C15.36 12.94 15.36 13.89 15.95 14.48L16.5 15.03C16.34 15.28 16.23 15.56 16.16 15.86L15.58 15.75C14.75 15.61 13.91 16.22 13.78 17.05C13.64 17.88 14.25 18.72 15.08 18.85L15.66 18.96C15.63 19.16 15.61 19.36 15.61 19.57C15.61 20.37 15.77 21.14 16.05 21.85H13.5C12.67 21.85 12 22.52 12 23.35C12 24.18 12.67 24.85 13.5 24.85H16.05C15.77 25.56 15.61 26.33 15.61 27.13C15.61 27.34 15.63 27.54 15.66 27.74L15.08 27.85C14.25 27.98 13.64 28.82 13.78 29.65C13.91 30.48 14.75 31.09 15.58 30.95L16.16 30.84C16.23 31.14 16.34 31.42 16.5 31.67L15.95 32.22C15.36 32.81 15.36 33.76 15.95 34.35C16.54 34.94 17.49 34.94 18.08 34.35L18.63 33.8C18.9 33.95 19.2 34.06 19.51 34.12V34.7C19.51 35.53 20.18 36.2 21.01 36.2C21.84 36.2 22.51 35.53 22.51 34.7V34.13C22.82 34.06 23.12 33.95 23.39 33.81L23.94 34.36C24.53 34.95 25.47 34.95 26.06 34.36C26.65 33.77 26.65 32.82 26.06 32.23L25.52 31.68C25.67 31.43 25.79 31.15 25.86 30.85L26.44 30.96C27.27 31.1 28.11 30.49 28.24 29.66C28.37 28.83 27.76 27.99 26.93 27.86L26.35 27.75C26.38 27.55 26.4 27.35 26.4 27.15C26.4 26.35 26.24 25.58 25.96 24.87H28.5C29.33 24.87 30 24.2 30 23.37C30 22.54 29.33 21.87 28.5 21.87H25.96C26.24 21.16 26.4 20.39 26.4 19.59C26.4 19.38 26.38 19.18 26.35 18.98L26.93 18.87C27.76 18.74 28.37 17.9 28.24 17.07C28.11 16.24 27.27 15.63 26.44 15.77L25.86 15.88C25.79 15.58 25.67 15.3 25.52 15.05L26.07 14.5C26.66 13.91 26.66 12.96 26.07 12.37C25.48 11.78 24.53 11.78 23.94 12.37L23.4 12.92C23.13 12.77 22.83 12.66 22.52 12.59L22.5 12Z" fill="white"/>
        <path d="M20.94 18.15C20.64 17.55 20.03 17.25 19.43 17.25C18.83 17.25 18.22 17.55 17.92 18.15L17.5 18.9C16.81 20.13 16.81 21.57 17.5 22.8L17.92 23.55C18.22 24.15 18.83 24.45 19.43 24.45C20.03 24.45 20.64 24.15 20.94 23.55L21.52 22.65C22.11 21.69 22.11 20.76 21.52 19.8L20.94 18.15Z" fill="#A5B4FC"/>
        <path d="M24.08 18.15C23.78 17.55 23.17 17.25 22.57 17.25C21.97 17.25 21.36 17.55 21.06 18.15L20.48 19.8C19.89 20.76 19.89 21.69 20.48 22.65L21.06 23.55C21.36 24.15 21.97 24.45 22.57 24.45C23.17 24.45 23.78 24.15 24.08 23.55L24.5 22.8C25.19 21.57 25.19 20.13 24.5 18.9L24.08 18.15Z" fill="#C7D2FE"/>
        <circle cx="31" cy="11" r="5" fill="#FBBF24"/>
        <path d="M30.06 9.53H30.5V13.3H29.56V12.38H29.55C29.29 13.04 28.66 13.44 27.91 13.44C27.24 13.44 26.74 13.23 26.41 12.8C26.08 12.37 25.92 11.75 25.92 10.94V9.53H26.86V10.87C26.86 11.45 26.97 11.89 27.19 12.18C27.41 12.47 27.75 12.61 28.2 12.61C28.98 12.61 29.55 12.13 29.55 11.2V9.53H30.06Z" fill="#4338CA"/>
        <path d="M34.31 13.3H33.37V9.53H34.31V13.3Z" fill="#4338CA"/>
    </svg>
);


const GlobeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c1.358 0 2.662-.331 3.757-.934m-7.514 0A9.008 9.008 0 0112 3c1.358 0 2.662.331 3.757.934m-7.514 0a8.963 8.963 0 00-3.757.934m15.028 0a8.963 8.963 0 00-3.757-.934M6.934 16.5A8.963 8.963 0 0012 18.75c1.358 0 2.662-.331 3.757-.934m-7.514 0c-1.093-.603-2.003-1.42-2.734-2.366m12.434 0c-.731.946-1.641 1.763-2.734 2.366M12 3v1.518c0 .92.744 1.668 1.668 1.668h1.664M12 3v1.518c0 .92-.744 1.668-1.668 1.668H8.668" />
    </svg>
);

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-white sticky top-0 z-40 border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center cursor-pointer" onClick={() => user ? onNavigate('dashboard') : onNavigate('home')}>
            <AIBrainIcon className="w-10 h-10 mr-3" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">এআই মার্কেটিং প্ল্যাটফর্ম</h1>
        </div>

        {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
                <span className="text-sm text-gray-600 hidden md:block">{user.email}</span>
                {user.isAdmin && (
                    <button
                        onClick={() => onNavigate('admin')}
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold py-2 px-4 rounded-md text-sm transition-colors flex items-center gap-2"
                        title="অ্যাডমিন প্যানেল"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                        </svg>
                       <span className="hidden sm:inline">অ্যাডমিন</span>
                    </button>
                )}
                <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors"
                >
                    লগআউট
                </button>
            </div>
        ) : (
             <div className="flex items-center gap-4 md:gap-6">
                <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                    <GlobeIcon className="w-5 h-5"/>
                    <span className="hidden sm:inline">বাংলা</span>
                </button>
                <button onClick={() => onNavigate('auth')} className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                    লগইন
                </button>
                <button
                    onClick={() => onNavigate('auth')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors"
                >
                    রেজিস্টার
                </button>
             </div>
        )}
      </div>
    </header>
  );
};