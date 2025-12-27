
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
    <div className="h-screen flex flex-col bg-zinc-950 overflow-hidden text-zinc-100">
      {/* Top Navbar */}
      <header className="h-12 flex items-center justify-between px-4 text-white shrink-0 shadow-xl z-30" style={{ backgroundColor: ODOO_PURPLE }}>
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
            className="text-xs font-semibold uppercase tracking-wider bg-rose-600 hover:bg-rose-700 px-4 py-1.5 rounded-lg transition-colors shadow-lg"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {location.pathname !== '/' && (
          <aside className={`w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-all duration-300 shadow-2xl ${isSidebarOpen ? '' : '-ml-64'}`}>
            <div className="p-4 font-black text-zinc-500 text-[10px] uppercase tracking-[0.2em] border-b border-zinc-800">
              Navigation
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-hide">
              {APP_MODULES.map(module => (
                <Link
                  key={module.id}
                  to={module.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                    location.pathname.startsWith(module.path) 
                    ? 'bg-indigo-600/10 text-indigo-400 font-bold border border-indigo-600/20 shadow-inner' 
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                  }`}
                >
                  <span className="text-lg opacity-80">{module.icon}</span>
                  {module.name}
                </Link>
              ))}
            </nav>
          </aside>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-zinc-950">
          <div className={`${location.pathname === '/' ? '' : 'p-8 max-w-7xl mx-auto'}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
