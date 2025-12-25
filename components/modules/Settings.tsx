
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
    const root = document.documentElement;
    if (saved === 'dark') {
      root.classList.add('dark');
      setIsDarkMode(true);
    } else if (saved === 'light') {
      root.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h2 className="text-2xl font-black text-gray-800 dark:text-white">System Settings</h2>

      <section className="bg-white dark:bg-zinc-800 p-8 rounded-3xl border dark:border-zinc-700 shadow-sm space-y-8">
        <h3 className="text-sm font-black border-b dark:border-zinc-700 pb-4 text-gray-400 uppercase tracking-widest">Active Profile</h3>
        <div className="flex items-center gap-8">
          <div className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-4xl overflow-hidden border dark:border-zinc-700 shadow-inner">
             {user?.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : '👤'}
          </div>
          <div className="space-y-1">
            <p className="text-xl font-black text-gray-700 dark:text-white">{user?.displayName || 'Enterprise Lead'}</p>
            <p className="text-sm text-gray-400 font-medium">{user?.email}</p>
            <div className="mt-4 flex gap-3">
               <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Root Admin</span>
               <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Standard Workspace</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-zinc-800 p-8 rounded-3xl border dark:border-zinc-700 shadow-sm space-y-8">
        <h3 className="text-sm font-black border-b dark:border-zinc-700 pb-4 text-gray-400 uppercase tracking-widest">Interface Preferences</h3>
        <div className="space-y-6">
          <div className="flex justify-between items-center group">
            <div>
              <p className="font-bold text-gray-700 dark:text-white">Dark Mode</p>
              <p className="text-xs text-gray-400">Enable high-contrast dark environment</p>
            </div>
            <button 
              onClick={toggleDarkMode}
              className={`w-14 h-8 rounded-full relative transition-all duration-300 shadow-inner border-2 ${isDarkMode ? 'bg-indigo-600 border-indigo-500' : 'bg-gray-200 dark:bg-zinc-700 border-transparent'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ${isDarkMode ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>
          <div className="flex justify-between items-center opacity-40 cursor-not-allowed grayscale">
            <div>
              <p className="font-bold text-gray-700 dark:text-white">Enterprise Identity</p>
              <p className="text-xs text-gray-400">SSO & LDAP Integration</p>
            </div>
            <div className="w-14 h-8 bg-gray-100 dark:bg-zinc-700 rounded-full relative border-2 border-transparent">
              <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-zinc-800 p-8 rounded-3xl border dark:border-zinc-700 shadow-sm space-y-6">
        <h3 className="text-sm font-black border-b dark:border-zinc-700 pb-4 text-rose-500 uppercase tracking-widest">Workspace Management</h3>
        <p className="text-xs text-gray-400 leading-relaxed font-medium">Permanently purge all localized workspace data. This includes CRM records, sales quotations, inventory logs, and all generated AI architectures. This action is irreversible.</p>
        <button 
          onClick={() => {
            if (confirm('Critical Action: Clear entire workspace? This cannot be undone.')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="bg-rose-50 dark:bg-rose-900/10 text-rose-600 border border-rose-100 dark:border-rose-900/30 px-6 py-3 rounded-2xl font-black text-sm hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-all active:scale-95"
        >
          Factory Reset Workspace
        </button>
      </section>
    </div>
  );
};

export default Settings;
