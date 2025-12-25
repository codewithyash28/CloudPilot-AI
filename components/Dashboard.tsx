
import React from 'react';
import { Link } from 'react-router-dom';
import { APP_MODULES } from '../constants';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Welcome, Partner Architect</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {APP_MODULES.map((module) => (
          <Link 
            key={module.id}
            to={module.path}
            className="group flex flex-col items-center transition-transform hover:scale-105"
          >
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ${module.color} flex items-center justify-center text-4xl shadow-lg group-hover:shadow-xl transition-shadow`}>
              {module.icon}
            </div>
            <span className="mt-3 text-sm font-semibold text-gray-700 text-center">{module.name}</span>
            <span className="mt-1 text-[10px] text-gray-400 text-center leading-tight max-w-[100px] hidden sm:block">
              {module.description}
            </span>
          </Link>
        ))}
        
        {/* Placeholder for "Add Apps" feel */}
        <div className="flex flex-col items-center opacity-40 cursor-not-allowed">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gray-200 flex items-center justify-center text-4xl border-2 border-dashed border-gray-400">
            ➕
          </div>
          <span className="mt-3 text-sm font-semibold text-gray-700">Add Modules</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
