
import React from 'react';
import { UserProfile } from '../../types';

interface SettingsProps {
  user: UserProfile | null;
}

const Settings: React.FC<SettingsProps> = ({ user }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h2 className="text-3xl font-black text-white tracking-tight">System Settings</h2>

      <section className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800 shadow-2xl space-y-8">
        <h3 className="text-[10px] font-black border-b border-zinc-800 pb-4 text-zinc-500 uppercase tracking-[0.3em]">Administrator Identity</h3>
        <div className="flex items-center gap-8">
          <div className="w-24 h-24 rounded-[2rem] bg-zinc-800 flex items-center justify-center text-4xl overflow-hidden border border-zinc-700 shadow-inner">
             {user?.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : '👤'}
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-black text-white tracking-tight">{user?.displayName || 'Enterprise Lead'}</p>
            <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider">{user?.email}</p>
            <div className="mt-4 flex gap-3">
               <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border border-indigo-500/20">Root Admin</span>
               <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">Active Workspace</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800 shadow-2xl space-y-8">
        <h3 className="text-[10px] font-black border-b border-zinc-800 pb-4 text-zinc-500 uppercase tracking-[0.3em]">Environment Specs</h3>
        <div className="space-y-6">
          <div className="flex justify-between items-center group">
            <div>
              <p className="font-black text-white uppercase text-xs tracking-widest">Interface Status</p>
              <p className="text-xs text-zinc-500 mt-1">Dark Mode is permanently active for maximum performance.</p>
            </div>
            <div className="flex items-center gap-2 text-emerald-500">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="text-[10px] font-black uppercase tracking-widest">Optimized</span>
            </div>
          </div>
          <div className="flex justify-between items-center opacity-40 grayscale">
            <div>
              <p className="font-black text-white uppercase text-xs tracking-widest">Enterprise Identity</p>
              <p className="text-xs text-zinc-500 mt-1">SSO & LDAP Integration (Managed by IT)</p>
            </div>
            <div className="w-14 h-8 bg-zinc-800 rounded-full relative border-2 border-transparent">
              <div className="absolute left-1 top-1 w-5 h-5 bg-zinc-600 rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-rose-500/5 p-8 rounded-[2.5rem] border border-rose-500/10 shadow-2xl space-y-6">
        <h3 className="text-[10px] font-black border-b border-rose-500/20 pb-4 text-rose-500 uppercase tracking-[0.3em]">Destructive Actions</h3>
        <p className="text-xs text-zinc-500 leading-relaxed font-bold uppercase tracking-tight">Permanently purge all localized workspace data. This includes CRM records, sales quotations, inventory logs, and all generated AI architectures.</p>
        <button 
          onClick={() => {
            if (confirm('Critical Action: Clear entire workspace? This cannot be undone.')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="bg-rose-600 text-white border border-rose-500 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all active:scale-95 shadow-xl shadow-rose-900/20"
        >
          Factory Reset Workspace
        </button>
      </section>
    </div>
  );
};

export default Settings;
