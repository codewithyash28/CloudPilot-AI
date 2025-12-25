
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ODOO_PURPLE } from '../constants';

interface LoginProps {
  onLogin: (profile: UserProfile) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulating Google Login Popup
    setTimeout(() => {
      onLogin({
        uid: 'google-user-123',
        email: 'ceo@enterprise.com',
        displayName: 'Enterprise Admin',
        photoURL: 'https://picsum.photos/seed/admin/200'
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        uid: 'email-user-456',
        email: email,
        displayName: email.split('@')[0],
        photoURL: null
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border-t-8 overflow-hidden" style={{ borderTopColor: ODOO_PURPLE }}>
        <div className="p-10 flex flex-col items-center bg-white">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6 text-white shadow-xl" style={{ backgroundColor: ODOO_PURPLE }}>
            🛸
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter">CloudPilot AI</h1>
          <p className="text-sm font-medium text-slate-400 mt-2">Next-Gen Enterprise Management</p>
        </div>

        <div className="p-10 pt-0 space-y-8">
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 hover:border-indigo-100 hover:bg-slate-50 py-4 rounded-xl font-bold text-slate-700 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-2 border-slate-50"></span>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black text-slate-300">
              <span className="bg-white px-4">Workspace Login</span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-5">
            <div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                placeholder="Work Email"
              />
            </div>
            <div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                placeholder="Security Pin / Password"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl text-white font-black uppercase tracking-wider transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg hover:shadow-indigo-200"
              style={{ backgroundColor: ODOO_PURPLE }}
            >
              {isLoading ? 'Synchronizing...' : isRegistering ? 'Setup Workspace' : 'Enter Workspace'}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 font-bold">
            {isRegistering ? 'Already part of the fleet?' : "New to CloudPilot AI?"}{' '}
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-indigo-600 hover:underline"
            >
              {isRegistering ? 'Login Instead' : 'Create Free Workspace'}
            </button>
          </p>
        </div>
      </div>
      
      <div className="mt-12 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex gap-6">
        <span>Vertex AI Integrated</span>
        <span>•</span>
        <span>Multi-Tenant Ready</span>
      </div>
    </div>
  );
};

export default Login;
