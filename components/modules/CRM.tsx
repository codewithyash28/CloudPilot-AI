
import React, { useState, useEffect } from 'react';
import { Lead } from '../../types';

const CRM: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', company: '', value: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('cloudpilot_leads');
    if (saved) {
      setLeads(JSON.parse(saved));
    } else {
      setLeads([]); // Start empty if no registration data
    }
  }, []);

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const lead: Lead = {
      id: Math.random().toString(36).substr(2, 9),
      name: newLead.name,
      company: newLead.company,
      status: 'New',
      value: Number(newLead.value)
    };
    const updated = [lead, ...leads];
    setLeads(updated);
    localStorage.setItem('cloudpilot_leads', JSON.stringify(updated));
    setShowModal(false);
    setNewLead({ name: '', company: '', value: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Pipeline Management</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 shadow-md transition-all active:scale-95"
        >
          New Opportunity
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border dark:border-zinc-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-zinc-900/50 border-b dark:border-zinc-700">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Opportunity</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Stage</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-zinc-700">
            {leads.length > 0 ? leads.map(lead => (
              <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/30 transition-colors cursor-pointer">
                <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">{lead.name}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{lead.company}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    lead.status === 'Won' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-gray-400'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono text-gray-900 dark:text-white">${lead.value.toLocaleString()}</td>
              </tr>
            )) : (
              <tr><td colSpan={4} className="p-10 text-center text-gray-400">No active leads</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-zinc-700">
            <h3 className="text-2xl font-black mb-6 text-gray-800 dark:text-white">Create Lead</h3>
            <form onSubmit={handleAddLead} className="space-y-4">
              <input 
                required placeholder="Opportunity Title"
                className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newLead.name}
                onChange={e => setNewLead({...newLead, name: e.target.value})}
              />
              <input 
                required placeholder="Company Name"
                className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newLead.company}
                onChange={e => setNewLead({...newLead, company: e.target.value})}
              />
              <input 
                required type="number"
                placeholder="Expected Value"
                className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newLead.value}
                onChange={e => setNewLead({...newLead, value: Number(e.target.value)})}
              />
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRM;
