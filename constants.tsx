
import { AppModule } from './types';

export const APP_MODULES: AppModule[] = [
  // Core Business Modules
  { id: 'crm', name: 'CRM', icon: '🤝', description: 'Leads & Opportunities', path: '/crm', color: 'bg-indigo-600' },
  { id: 'sales', name: 'Sales', icon: '💰', description: 'Quotations & Orders', path: '/sales', color: 'bg-blue-600' },
  { id: 'inventory', name: 'Inventory', icon: '📦', description: 'Stock & Products', path: '/inventory', color: 'bg-teal-600' },
  { id: 'invoicing', name: 'Invoicing', icon: '🧾', description: 'Billing & Payments', path: '/invoicing', color: 'bg-cyan-600' },
  { id: 'projects', name: 'Projects', icon: '📋', description: 'Tasks & Planning', path: '/projects', color: 'bg-orange-600' },
  { id: 'hr', name: 'Employees', icon: '👥', description: 'HR & Attendance', path: '/hr', color: 'bg-pink-600' },
  
  // Advanced AI Modules
  { id: 'solution-architect', name: 'Solution Architect', icon: '🏗️', description: 'Instant GCP Drafts', path: '/solution-architect', color: 'bg-sky-500' },
  { id: 'deep-architect', name: 'Deep Architect', icon: '🧠', description: 'Thinking AI Solutions', path: '/deep-architect', color: 'bg-indigo-800' },
  { id: 'partner-chat', name: 'Partner Chat', icon: '💬', description: 'Conversational Support', path: '/partner-chat', color: 'bg-emerald-500' },
  { id: 'market-intel', name: 'Market Intel', icon: '🌐', description: 'Search & Maps Grounding', path: '/market-intel', color: 'bg-amber-500' },
  { id: 'creative-studio', name: 'Creative Studio', icon: '🎨', description: 'Image & Video Generation', path: '/creative-studio', color: 'bg-rose-500' },
  { id: 'intelligence-lab', name: 'Intelligence Lab', icon: '🔬', description: 'Vision & Transcription', path: '/intelligence-lab', color: 'bg-violet-600' },
  { id: 'partner-live', name: 'Partner Live', icon: '🎙️', description: 'Real-time Voice', path: '/partner-live', color: 'bg-red-600' },
  { id: 'speech-studio', name: 'Speech Studio', icon: '🔊', description: 'Pro Audio Narrations', path: '/speech-studio', color: 'bg-slate-700' },
  
  // Infrastructure
  { id: 'workspace', name: 'Workspace', icon: '🗄️', description: 'Solution History', path: '/assistant', color: 'bg-purple-600' },
  { id: 'settings', name: 'Settings', icon: '⚙️', description: 'Configurations', path: '/settings', color: 'bg-slate-600' },
];

export const ODOO_PURPLE = '#714B67';
export const ODOO_BG = '#f0f2f5';
