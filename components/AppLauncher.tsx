
import React from 'react';
import { Link } from 'react-router-dom';
import { APP_MODULES } from '../constants';

const AppLauncher: React.FC = () => {
  return (
    <div className="min-h-full bg-zinc-950 p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-white tracking-tighter">Enterprise Console</h1>
          <p className="text-zinc-500 mt-2 font-medium">Welcome back, Administrator. Deploy your strategy.</p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-8 gap-y-12">
          {APP_MODULES.map((module) => (
            <Link 
              key={module.id}
              to={module.path}
              className="group flex flex-col items-center"
            >
              <div className={`w-24 h-24 rounded-[2rem] ${module.color} flex items-center justify-center text-4xl shadow-2xl transform transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-2 group-hover:brightness-110 ring-4 ring-transparent group-hover:ring-white/10`}>
                <span className="drop-shadow-2xl">{module.icon}</span>
              </div>
              <span className="mt-4 text-xs font-black text-zinc-400 group-hover:text-white uppercase tracking-widest transition-colors">
                {module.name}
              </span>
            </Link>
          ))}

          {/* New Module Placeholder */}
          <div className="flex flex-col items-center opacity-30 hover:opacity-100 transition-all duration-300 cursor-pointer group">
            <div className="w-24 h-24 rounded-[2rem] bg-zinc-800 flex items-center justify-center text-4xl border-2 border-dashed border-zinc-700 group-hover:border-indigo-500 group-hover:bg-zinc-700 transition-all">
              ➕
            </div>
            <span className="mt-4 text-xs font-black text-zinc-500 group-hover:text-indigo-400 uppercase tracking-widest">Install</span>
          </div>
        </div>

        {/* Stats Summary Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-900 p-8 rounded-[2rem] border border-zinc-800 shadow-2xl hover:border-indigo-500/30 transition-colors group">
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">Active Pipeline</div>
            <div className="text-4xl font-black text-indigo-400 mt-1 tracking-tighter">12 Leads</div>
            <div className="text-[10px] text-emerald-500 font-black mt-4 uppercase tracking-wider bg-emerald-500/10 w-fit px-2 py-1 rounded">↑ 8% Velocity</div>
          </div>
          <div className="bg-zinc-900 p-8 rounded-[2rem] border border-zinc-800 shadow-2xl hover:border-orange-500/30 transition-colors">
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">Operational Tasks</div>
            <div className="text-4xl font-black text-orange-400 mt-1 tracking-tighter">24 Open</div>
            <div className="text-[10px] text-zinc-500 font-black mt-4 uppercase tracking-wider">Across 4 projects</div>
          </div>
          <div className="bg-zinc-900 p-8 rounded-[2rem] border border-zinc-800 shadow-2xl hover:border-purple-500/30 transition-colors">
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">AI Cognitive Load</div>
            <div className="text-4xl font-black text-purple-400 mt-1 tracking-tighter">1,402 Req</div>
            <div className="text-[10px] text-indigo-400 font-black mt-4 uppercase tracking-wider">Enterprise Mode</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLauncher;
