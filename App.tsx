
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AppLauncher from './components/AppLauncher';
import Layout from './components/Layout';
import PartnerAssistant from './components/PartnerAssistant';
import CRM from './components/modules/CRM';
import Sales from './components/modules/Sales';
import Inventory from './components/modules/Inventory';
import Projects from './components/modules/Projects';
import HR from './components/modules/HR';
import Invoicing from './components/modules/Invoicing';
import Settings from './components/modules/Settings';
import SolutionArchitect from './components/modules/SolutionArchitect';
import DeepArchitect from './components/modules/DeepArchitect';
import PartnerChat from './components/modules/PartnerChat';
import MarketIntel from './components/modules/MarketIntel';
import CreativeStudio from './components/modules/CreativeStudio';
import IntelligenceLab from './components/modules/IntelligenceLab';
import PartnerLive from './components/modules/PartnerLive';
import SpeechStudio from './components/modules/SpeechStudio';
import { UserProfile } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('cloudpilot_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('cloudpilot_user', JSON.stringify(profile));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cloudpilot_user');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-zinc-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#714B67]"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        
        <Route element={user ? <Layout user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}>
          <Route path="/" element={<AppLauncher />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/hr" element={<HR />} />
          <Route path="/invoicing" element={<Invoicing />} />
          <Route path="/assistant" element={<PartnerAssistant userId={user?.uid || ''} />} />
          <Route path="/solution-architect" element={<SolutionArchitect />} />
          <Route path="/deep-architect" element={<DeepArchitect />} />
          <Route path="/partner-chat" element={<PartnerChat />} />
          <Route path="/market-intel" element={<MarketIntel />} />
          <Route path="/creative-studio" element={<CreativeStudio />} />
          <Route path="/intelligence-lab" element={<IntelligenceLab />} />
          <Route path="/partner-live" element={<PartnerLive />} />
          <Route path="/speech-studio" element={<SpeechStudio />} />
          <Route path="/settings" element={<Settings user={user} />} />
        </Route>

        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
