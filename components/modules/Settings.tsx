
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';

interface SettingsProps {
  user: UserProfile | null;
}

const Settings: React.FC<SettingsProps> = ({ user }) => {
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));

  const toggleDarkMode = () => {
    const newVal = !isDarkMode;
    setIsDarkMode(newVal);
    if (newVal) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cloudpilot_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cloudpilot_theme', 'light');
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('cloudpilot_theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h2 className="text-2xl font-black text-gray-800 dark:text-white">System Preferences</h2>

      <section className="bg-white dark:bg-zinc-800 p-8 rounded-2xl border dark:border-zinc-700 shadow-sm space-y-6">
        <h3 className="text-lg font-bold border-b dark:border-zinc-700 pb-2 text-gray-700 dark:text-gray-300">Profile Information</h3>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-4xl overflow-hidden border dark:border-zinc-700">
             {user?.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : '👤'}
          </div>
          <div className="space-y-1">
            <p className="text-lg font-black text-gray-700 dark:text-white">{user?.displayName || 'Enterprise User'}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
            <div className="mt-4 flex gap-2">
               <span className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Admin</span>
               <span className="bg-green-50 dark:bg-green-900/20 text-green-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Active Workspace</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-zinc-800 p-8 rounded-2xl border dark:border-zinc-700 shadow-sm space-y-6">
        <h3 className="text-lg font-bold border-b dark:border-zinc-700 pb-2 text-gray-700 dark:text-gray-300">Workspace Configuration</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center group">
            <div>
              <p className="font-bold text-gray-700 dark:text-white">Dark Mode</p>
              <p className="text-xs text-gray-400">Toggle dark user interface</p>
            </div>
            <button 
              onClick={toggleDarkMode}
              className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-zinc-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${isDarkMode ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
          <div className="flex justify-between items-center opacity-50 cursor-not-allowed">
            <div>
              <p className="font-bold text-gray-700 dark:text-white">Multi-Factor Auth</p>
              <p className="text-xs text-gray-400">Extra security for your login (Enterprise Only)</p>
            </div>
            <div className="w-12 h-6 bg-gray-200 dark:bg-zinc-700 rounded-full relative">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-zinc-800 p-8 rounded-2xl border dark:border-zinc-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold border-b dark:border-zinc-700 pb-2 text-red-600">Danger Zone</h3>
        <p className="text-xs text-gray-400">Permanently delete all workspace data including invoices, products, and AI solutions.</p>
        <button 
          onClick={() => {
            if (confirm('Are you sure? This will wipe ALL local data.')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="bg-red-50 dark:bg-red-900/10 text-red-600 border border-red-100 dark:border-red-900/30 px-4 py-2 rounded-lg font-black text-sm hover:bg-red-100 transition-colors"
        >
          Wipe Workspace Data
        </button>
      </section>
    </div>
  );
};

export default Settings;
