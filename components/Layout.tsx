
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';
import { ODOO_PURPLE, APP_MODULES } from '../constants';

interface LayoutProps {
  user: UserProfile;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const activeModule = APP_MODULES.find(m => location.pathname.startsWith(m.path));

  return (
    <div className="h-screen flex flex-col bg-[#f0f2f5] overflow-hidden">
      {/* Top Navbar */}
      <header className="h-12 flex items-center justify-between px-4 text-white shrink-0 shadow-md z-30" style={{ backgroundColor: ODOO_PURPLE }}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-1 hover:bg-black/20 rounded transition-colors flex items-center gap-2"
            title="App Switcher"
          >
            <span className="text-xl">🎛️</span>
            <span className="font-bold tracking-tight hidden sm:inline">CloudPilot AI</span>
          </button>
          
          {activeModule && (
            <div className="flex items-center gap-2 border-l border-white/20 pl-4">
              <span className="text-lg">{activeModule.icon}</span>
              <span className="font-medium">{activeModule.name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm bg-black/10 px-3 py-1 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="font-medium">{user.displayName || user.email}</span>
          </div>
          <button 
            onClick={onLogout}
            className="text-xs font-semibold uppercase tracking-wider bg-red-500/80 hover:bg-red-600 px-3 py-1 rounded transition-colors shadow-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - only shown inside modules */}
        {location.pathname !== '/' && (
          <aside className={`w-64 bg-white border-r flex flex-col transition-all duration-300 ${isSidebarOpen ? '' : '-ml-64'}`}>
            <div className="p-4 font-bold text-gray-500 text-xs uppercase tracking-widest border-b">
              Main Navigation
            </div>
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
              {APP_MODULES.map(module => (
                <Link
                  key={module.id}
                  to={module.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    location.pathname.startsWith(module.path) 
                    ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{module.icon}</span>
                  {module.name}
                </Link>
              ))}
            </nav>
          </aside>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className={`${location.pathname === '/' ? '' : 'p-6 max-w-7xl mx-auto'}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
