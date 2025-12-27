
import React, { useState, useEffect } from 'react';
import { Invoice } from '../../types';

const Invoicing: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ customer: '', amount: '', dueDate: '' });

  // Load data on mount
  useEffect(() => {
    const saved = localStorage.getItem('cloudpilot_invoices');
    if (saved) {
      try {
        setInvoices(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load invoices", e);
      }
    }
  }, []);

  // Sync state to storage whenever it changes
  useEffect(() => {
    localStorage.setItem('cloudpilot_invoices', JSON.stringify(invoices));
  }, [invoices]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(formData.amount);
    
    // Explicit validation check
    if (!formData.customer || isNaN(amountNum) || !formData.dueDate) {
      alert("Please fill in all fields with valid data.");
      return;
    }

    const newInv: Invoice = {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: formData.customer,
      amount: amountNum,
      status: 'Draft',
      dueDate: formData.dueDate
    };
    
    setInvoices(prev => [newInv, ...prev]);
    setShowModal(false);
    setFormData({ customer: '', amount: '', dueDate: '' });
  };

  const toggleStatus = (id: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        const nextStatus: 'Draft' | 'Paid' = inv.status === 'Paid' ? 'Draft' : 'Paid';
        return { ...inv, status: nextStatus };
      }
      return inv;
    }));
  };

  const removeInvoice = (id: string) => {
    if (confirm('Permanently remove this invoice from financial records?')) {
      setInvoices(prev => prev.filter(inv => inv.id !== id));
    }
  };

  const downloadInvoice = (inv: Invoice) => {
    const content = `
******************************************
         CLOUDPILOT AI BUSINESS INVOICE
******************************************
Invoice Number: ${inv.id}
Date Issued:    ${new Date().toLocaleDateString()}
Due Date:       ${inv.dueDate}
Status:         ${inv.status.toUpperCase()}

CLIENT:         ${inv.customer}

DESCRIPTION             AMOUNT
------------------------------------------
Consultancy Services    $${inv.amount.toFixed(2)}

------------------------------------------
TOTAL DUE:              $${inv.amount.toFixed(2)}

NOTES: Please include Invoice ID in payment reference.
Thank you for your business!
******************************************
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${inv.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const stats = invoices.reduce((acc, inv) => {
    if (inv.status === 'Paid') acc.paid += inv.amount;
    else acc.pending += inv.amount;
    return acc;
  }, { paid: 0, pending: 0 });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">Billing & Invoicing</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Financial Operations & Revenue</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-cyan-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-cyan-700 shadow-xl shadow-cyan-100 dark:shadow-none transition-all active:scale-95 text-sm uppercase tracking-widest"
        >
          + Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-800 p-8 rounded-3xl border dark:border-zinc-700 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="text-6xl">💰</span>
          </div>
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">Total Received</p>
          <p className="text-4xl font-black text-gray-900 dark:text-white">${stats.paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <div className="mt-4 h-1.5 w-full bg-emerald-50 dark:bg-emerald-900/20 rounded-full overflow-hidden">
             <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${(stats.paid / (stats.paid + stats.pending || 1)) * 100}%` }}></div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-800 p-8 rounded-3xl border dark:border-zinc-700 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="text-6xl">⏳</span>
          </div>
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-1">Awaiting Payment</p>
          <p className="text-4xl font-black text-gray-900 dark:text-white">${stats.pending.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <div className="mt-4 h-1.5 w-full bg-amber-50 dark:bg-amber-900/20 rounded-full overflow-hidden">
             <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: `${(stats.pending / (stats.paid + stats.pending || 1)) * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-sm border dark:border-zinc-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-zinc-900/50 border-b dark:border-zinc-700">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Reference</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Customer</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Due Date</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Amount</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-zinc-700">
              {invoices.length > 0 ? invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-zinc-700/30 transition-colors group">
                  <td className="px-6 py-4 font-black text-cyan-600 tracking-tighter">{inv.id}</td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-bold">{inv.customer}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm font-medium">{inv.dueDate}</td>
                  <td className="px-6 py-4 text-right font-mono text-gray-900 dark:text-white font-black text-lg">${inv.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => toggleStatus(inv.id)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        inv.status === 'Paid' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/40' 
                        : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/40'
                      }`}
                    >
                      {inv.status}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => downloadInvoice(inv)}
                        className="p-2.5 bg-slate-100 dark:bg-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-600 rounded-xl transition-all"
                        title="Download Text Document"
                      >
                        📄
                      </button>
                      <button 
                        onClick={() => removeInvoice(inv.id)}
                        className="p-2.5 bg-rose-50 dark:bg-rose-900/10 hover:bg-rose-500 hover:text-white text-rose-500 rounded-xl transition-all border border-rose-100 dark:border-zinc-700"
                        title="Delete Record"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="p-32 text-center text-gray-400 font-medium italic">
                    <div className="text-4xl mb-4">📑</div>
                    No invoices generated yet.<br/>Create your first invoice to begin tracking revenue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-md">
          <div className="bg-white dark:bg-zinc-800 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-zinc-700">
            <h3 className="text-3xl font-black mb-8 text-gray-800 dark:text-white tracking-tighter text-center">Generate Invoice</h3>
            <form onSubmit={handleCreate} className="space-y-5" autoComplete="off">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Customer Name</label>
                <input required className="w-full p-4 bg-slate-50 dark:bg-zinc-900 dark:text-white border dark:border-zinc-700 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all outline-none font-bold" 
                  value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} placeholder="e.g. Odoo Enterprise" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Amount ($)</label>
                  <input required type="number" step="0.01" className="w-full p-4 bg-slate-50 dark:bg-zinc-900 dark:text-white border dark:border-zinc-700 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all outline-none font-bold" 
                    value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Due Date</label>
                  <input required type="date" className="w-full p-4 bg-slate-50 dark:bg-zinc-900 dark:text-white border dark:border-zinc-700 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all outline-none font-bold" 
                    value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-4 pt-8">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-gray-400 font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-2xl transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-cyan-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-700 shadow-xl shadow-cyan-100 dark:shadow-none transition-all">Issue Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoicing;
