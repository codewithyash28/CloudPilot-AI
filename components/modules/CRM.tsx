
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

  const saveToStorage = (updated: Lead[]) => {
    setLeads(updated);
    localStorage.setItem('cloudpilot_leads', JSON.stringify(updated));
  };

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
    
    saveToStorage([lead, ...leads]);
    setShowModal(false);
    setNewLead({ name: '', company: '', value: '' });
  };

  const promoteLead = (id: string) => {
    const stages: Lead['status'][] = ['New', 'Qualified', 'Proposition', 'Won'];
    const updated = leads.map(l => {
      if (l.id === id) {
        const currentIdx = stages.indexOf(l.status);
        if (currentIdx < stages.length - 1) {
          return { ...l, status: stages[currentIdx + 1] };
        }
      }
      return l;
    });
    saveToStorage(updated);
  };

  const markLost = (id: string) => {
    saveToStorage(leads.map(l => l.id === id ? { ...l, status: 'Lost' } : l));
  };

  const removeLead = (id: string) => {
    if (confirm('Permanently remove this opportunity?')) {
      saveToStorage(leads.filter(l => l.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">Sales Pipeline</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Opportunity Stage Management</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none transition-all active:scale-95 text-sm uppercase tracking-widest"
        >
          + New Lead
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-sm border dark:border-zinc-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-zinc-900/50 border-b dark:border-zinc-700">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Opportunity</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Stage</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Revenue</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-zinc-700">
              {leads.length > 0 ? leads.map(lead => (
                <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-zinc-700/30 transition-colors group">
                  <td className="px-6 py-5">
                    <p className="font-black text-gray-800 dark:text-white">{lead.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">ID: {lead.id}</p>
                  </td>
                  <td className="px-6 py-5 text-gray-600 dark:text-gray-400 font-bold">{lead.company}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                      lead.status === 'Won' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/40' :
                      lead.status === 'Lost' ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:border-rose-900/40' :
                      'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-zinc-900 dark:border-zinc-700'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right font-mono text-gray-900 dark:text-white font-black text-lg">${lead.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-2">
                      {lead.status !== 'Won' && lead.status !== 'Lost' && (
                        <>
                          <button onClick={() => promoteLead(lead.id)} className="bg-emerald-500 text-white p-2 rounded-xl text-xs hover:bg-emerald-600 transition-all shadow-sm" title="Advance Stage">🚀</button>
                          <button onClick={() => markLost(lead.id)} className="bg-rose-100 text-rose-600 p-2 rounded-xl text-xs hover:bg-rose-200 transition-all border border-rose-200" title="Mark as Lost">🚩</button>
                        </>
                      )}
                      <button onClick={() => removeLead(lead.id)} className="text-gray-300 hover:text-rose-500 transition-colors text-xl font-bold ml-2">×</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="p-32 text-center text-gray-400 italic">No opportunities in pipeline.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-800 rounded-3xl p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-zinc-700">
            <h3 className="text-3xl font-black mb-8 text-gray-800 dark:text-white tracking-tighter">New Opportunity</h3>
            <form onSubmit={handleAddLead} className="space-y-5" autoComplete="off">
              <input required placeholder="Opportunity Name" className="w-full p-4 bg-slate-50 dark:bg-zinc-900 dark:text-white border dark:border-zinc-700 rounded-2xl outline-none font-bold" value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} />
              <input required placeholder="Company Name" className="w-full p-4 bg-slate-50 dark:bg-zinc-900 dark:text-white border dark:border-zinc-700 rounded-2xl outline-none font-bold" value={newLead.company} onChange={e => setNewLead({...newLead, company: e.target.value})} />
              <input required type="number" step="0.01" placeholder="Expected Revenue ($)" className="w-full p-4 bg-slate-50 dark:bg-zinc-900 dark:text-white border dark:border-zinc-700 rounded-2xl outline-none font-bold" value={newLead.value} onChange={e => setNewLead({...newLead, value: e.target.value})} />
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-gray-400 font-black uppercase hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-2xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl transition-all">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRM;
