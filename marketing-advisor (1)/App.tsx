import React, { useContext, useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthContext } from './AuthContext';
import { AuthScreen } from './screens/AuthScreen';
import { PricingScreen } from './screens/PricingScreen';
import { GeneratorScreen } from './screens/GeneratorScreen';
import { HomeScreen } from './screens/HomeScreen';
import { Loader } from './components/Loader';
import { Plan, View, GeneratedContent } from './types';
import { AnalyzerScreen } from './screens/AnalyzerScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { SocialStrategyScreen } from './screens/SocialStrategyScreen';
import { StrategistScreen } from './screens/StrategistScreen';
import { SheetAnalysisScreen } from './screens/SheetAnalysisScreen';
import { CompetitorAnalyzerScreen } from './screens/CompetitorAnalyzerScreen';
import { AdminScreen } from './screens/AdminScreen';
import { PuterPermissionModal } from './components/PuterPermissionModal';


const App: React.FC = () => {
  const { user, loading } = useContext(AuthContext);
  const [view, setView] = useState<View>('home');
  const [contentToView, setContentToView] = useState<{content: GeneratedContent, index: number} | null>(null);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (view === 'home' || view === 'auth' || (view === 'pricing' && user.plan)) {
          if (user.isAdmin) {
             setView('admin');
          } else if (user.plan) {
            setView('dashboard');
          } else {
            setView('pricing');
          }
        }
      } else {
        const privateViews: View[] = ['dashboard', 'generator', 'analyzer', 'social', 'strategist', 'sheet-analysis', 'competitor-analysis', 'admin'];
        if (privateViews.includes(view)) {
          setView('home');
        }
      }
    }
  }, [user, loading, view]); // view added to dependency array to handle navigation correctly

  const handleNavigate = (newView: View) => {
    if (newView === 'analyzer') {
        // @ts-ignore
        if (window.puter.vision.requestPermission) {
             // @ts-ignore
            window.puter.vision.requestPermission('camera').then(granted => {
                if (granted) {
                    setView(newView);
                } else {
                    setIsPermissionModalOpen(true);
                }
            });
        } else {
             setView(newView);
        }
    } else {
      setView(newView);
    }
    
    if (newView === 'generator') {
      setContentToView(null);
    }
  };
  
  const handleLoginSuccess = () => {
    // This function is now less critical because of the useEffect, but we can keep it for clarity
    // After login, the useEffect will handle redirection.
  }

  const handleViewContent = (content: GeneratedContent, index: number) => {
    setContentToView({content, index});
    setView('generator');
  };
  
  const ProNav: React.FC = () => (
      <div className="mb-6 pb-4 border-b border-gray-200">
          <nav className="flex space-x-1 sm:space-x-2 flex-wrap">
              <button
                  onClick={() => handleNavigate('generator')}
                  className={`flex items-center gap-2 px-3 py-2 font-medium text-sm rounded-md transition-colors ${view === 'generator' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                  aria-current={view === 'generator'}
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
                  কনটেন্ট জেনারেটর
              </button>
              <button
                  onClick={() => handleNavigate('strategist')}
                  className={`flex items-center gap-2 px-3 py-2 font-medium text-sm rounded-md transition-colors ${view === 'strategist' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                  aria-current={view === 'strategist'}
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                  ক্যাম্পেইন স্ট্র্যাটেজিস্ট
              </button>
              <button
                  onClick={() => handleNavigate('competitor-analysis')}
                  className={`flex items-center gap-2 px-3 py-2 font-medium text-sm rounded-md transition-colors ${view === 'competitor-analysis' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                  aria-current={view === 'competitor-analysis'}
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /><path d="M7 8a.5.5 0 01.5-.5H8a.5.5 0 01.5.5v2a.5.5 0 01-.5.5H7.5a.5.5 0 01-.5-.5V8zm2 0a.5.5 0 01.5-.5h.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5h-.5a.5.5 0 01-.5-.5V8zm2 0a.5.5 0 01.5-.5h.5a.5.5 0 01.5.5v3a.5.5 0 01-.5.5h-.5a.5.5 0 01-.5-.5V8z" /></svg>
                  কম্পিটিটর অ্যানালাইজার
              </button>
              <button
                  onClick={() => handleNavigate('analyzer')}
                  className={`flex items-center gap-2 px-3 py-2 font-medium text-sm rounded-md transition-colors ${view === 'analyzer' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                  aria-current={view === 'analyzer'}
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  সমস্যা বিশ্লেষক
              </button>
               <button
                  onClick={() => handleNavigate('sheet-analysis')}
                  className={`flex items-center gap-2 px-3 py-2 font-medium text-sm rounded-md transition-colors ${view === 'sheet-analysis' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                  aria-current={view === 'sheet-analysis'}
              >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m3 6V7m-15.5 12h16.5a2 2 0 002-2V7a2 2 0 00-2-2H4.5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  শীট অ্যানালাইসিস
              </button>
               <button
                  onClick={() => handleNavigate('social')}
                  className={`flex items-center gap-2 px-3 py-2 font-medium text-sm rounded-md transition-colors ${view === 'social' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                  aria-current={view === 'social'}
              >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.993.883L4 8v9a1 1 0 001 1h10a1 1 0 001-1V8l-.007-.117A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5H8v1h4V7zM8 9a1 1 0 00-1 1v2a1 1 0 102 0v-2a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v2a1 1 0 102 0v-2a1 1 0 00-1-1z" />
                   </svg>
                  সোশ্যাল স্ট্র্যাটেজি
              </button>
          </nav>
      </div>
  );

  if (loading) {
      return (
        <div className="flex-grow flex items-center justify-center min-h-screen bg-gray-50">
            <Loader />
        </div>
      );
  }

  // Special full-screen layout for the authentication page
  if (!user && view === 'auth') {
      return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    if (user) {
        if (view === 'admin') {
            return user.isAdmin ? <AdminScreen /> : <HomeScreen onNavigate={handleNavigate} />;
        }
        
        if (user.plan || user.isAdmin) { // Admin can access all features regardless of plan
            const isProAccess = user.plan === Plan.PRO || user.isAdmin;
            switch(view) {
                case 'dashboard':
                    return <DashboardScreen onNavigate={handleNavigate} onViewContent={handleViewContent} />;
                case 'generator':
                    return <GeneratorScreen contentToView={contentToView} />;
                case 'strategist':
                     return isProAccess ? <StrategistScreen /> : <PricingScreen onNavigate={handleNavigate} />;
                case 'analyzer':
                     return isProAccess ? <AnalyzerScreen /> : <PricingScreen onNavigate={handleNavigate} />;
                 case 'sheet-analysis':
                     return isProAccess ? <SheetAnalysisScreen /> : <PricingScreen onNavigate={handleNavigate} />;
                case 'competitor-analysis':
                    return isProAccess ? <CompetitorAnalyzerScreen /> : <PricingScreen onNavigate={handleNavigate} />;
                case 'social':
                    return isProAccess ? <SocialStrategyScreen /> : <PricingScreen onNavigate={handleNavigate} />;
                case 'pricing':
                    return <PricingScreen onNavigate={handleNavigate} />;
                default:
                    return <DashboardScreen onNavigate={handleNavigate} onViewContent={handleViewContent} />;
            }
        } else {
             return <PricingScreen onNavigate={handleNavigate} />;
        }
    }

    // Unauthenticated users (non-auth pages)
    switch (view) {
        case 'home':
            return <HomeScreen onNavigate={handleNavigate} />;
        case 'pricing':
            return <PricingScreen onNavigate={handleNavigate} />;
        default:
            return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  const showProNav = user && (user.plan === Plan.PRO || user.isAdmin) && ['generator', 'analyzer', 'social', 'strategist', 'sheet-analysis', 'competitor-analysis'].includes(view);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Header onNavigate={handleNavigate} currentView={view}/>
      <main className="flex-grow container mx-auto px-4 py-8">
        {showProNav && <ProNav />}
        {renderContent()}
      </main>
      <Footer />
      {isPermissionModalOpen && (
          <PuterPermissionModal
              permissionName="ক্যামেরা"
              onClose={() => setIsPermissionModalOpen(false)}
          />
      )}
    </div>
  );
};

export default App;