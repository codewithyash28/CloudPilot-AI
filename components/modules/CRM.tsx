
import React, { useState, useEffect } from 'react';
import { Lead } from '../../types';

const CRM: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', company: '', value: '' });

  useEffect(() => {
    const saved = localStorage.getItem('cloudpilot_leads');
    if (saved) {
      try {
        setLeads(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load leads", e);
      }
    }
  }, []);

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.company) return;

    const lead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      name: newLead.name,
      company: newLead.company,
      status: 'New',
      value: parseFloat(newLead.value || '0')
    };
    
    const updated = [lead, ...leads];
    setLeads(updated);
    localStorage.setItem('cloudpilot_leads', JSON.stringify(updated));
    setShowModal(false);
    setNewLead({ name: '', company: '', value: '' });
  };

  const removeLead = (id: string) => {
    if (confirm('Permanently remove this opportunity?')) {
      const updated = leads.filter(l => l.id !== id);
      setLeads(updated);
      localStorage.setItem('cloudpilot_leads', JSON.stringify(updated));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-800 dark:text-white">Revenue Pipeline</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">CRM & Lead Management</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-95"
        >
          + New Opportunity
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border dark:border-zinc-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-zinc-900/50 border-b dark:border-zinc-700">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Opportunity</th>
              <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Customer</th>
              <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest">Stage</th>
              <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Revenue</th>
              <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-zinc-700">
            {leads.length > 0 ? leads.map(lead => (
              <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/30 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-700 dark:text-gray-200">{lead.name}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-medium">{lead.company}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    lead.status === 'Won' ? 'bg-green-100 text-green-700' :
                    'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-gray-400'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono text-gray-900 dark:text-white font-black">${lead.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => removeLead(lead.id)} className="text-gray-300 hover:text-rose-500 transition-colors text-xl font-bold">
                    ×
                  </button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="p-20 text-center text-gray-400 italic">Pipeline is currently empty. Define a new lead to start tracking revenue.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-zinc-700">
            <h3 className="text-2xl font-black mb-6 text-gray-800 dark:text-white">New Opportunity</h3>
            <form onSubmit={handleAddLead} className="space-y-4" autoComplete="off">
              <input 
                required placeholder="Opportunity Name"
                className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                value={newLead.name}
                onChange={e => setNewLead({...newLead, name: e.target.value})}
              />
              <input 
                required placeholder="Company Name"
                className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                value={newLead.company}
                onChange={e => setNewLead({...newLead, company: e.target.value})}
              />
              <input 
                required type="number" step="0.01"
                placeholder="Expected Revenue ($)"
                className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                value={newLead.value}
                onChange={e => setNewLead({...newLead, value: e.target.value})}
              />
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-2xl transition-colors">Discard</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none transition-all">Create Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRM;
