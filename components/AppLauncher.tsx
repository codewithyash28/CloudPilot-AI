
import React from 'react';
import { Link } from 'react-router-dom';
import { APP_MODULES } from '../constants';

const AppLauncher: React.FC = () => {
  return (
    <div className="min-h-full bg-[#f0f2f5] p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Enterprise Console</h1>
          <p className="text-gray-500 mt-2">Welcome back, Administrator. Select a workspace to begin.</p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-8 gap-y-12">
          {APP_MODULES.map((module) => (
            <Link 
              key={module.id}
              to={module.path}
              className="group flex flex-col items-center"
            >
              <div className={`w-24 h-24 rounded-[1.5rem] ${module.color} flex items-center justify-center text-4xl shadow-xl transform transition-all duration-200 group-hover:scale-105 group-hover:-translate-y-1 group-hover:shadow-2xl`}>
                <span className="drop-shadow-lg">{module.icon}</span>
              </div>
              <span className="mt-4 text-sm font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">
                {module.name}
              </span>
            </Link>
          ))}

          {/* New Module Placeholder */}
          <div className="flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity cursor-pointer group">
            <div className="w-24 h-24 rounded-[1.5rem] bg-gray-200 flex items-center justify-center text-4xl border-2 border-dashed border-gray-400 group-hover:border-indigo-400 group-hover:bg-white group-hover:text-indigo-400 transition-all">
              ➕
            </div>
            <span className="mt-4 text-sm font-bold text-gray-500 group-hover:text-indigo-600">Install Apps</span>
          </div>
        </div>

        {/* Stats Summary Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Leads</div>
            <div className="text-3xl font-bold text-indigo-600 mt-1">12</div>
            <div className="text-xs text-green-600 font-medium mt-2">↑ 8% from last month</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Open Tasks</div>
            <div className="text-3xl font-bold text-orange-600 mt-1">24</div>
            <div className="text-xs text-gray-400 mt-2">4 projects in pipeline</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">AI Queries</div>
            <div className="text-3xl font-bold text-purple-600 mt-1">1,402</div>
            <div className="text-xs text-indigo-400 mt-2">Enterprise Plan Active</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLauncher;
