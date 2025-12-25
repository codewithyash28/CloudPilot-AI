
import React, { useState, useEffect } from 'react';
import { Invoice } from '../../types';

const Invoicing: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ customer: '', amount: 0, dueDate: '' });

  useEffect(() => {
    const saved = localStorage.getItem('cloudpilot_invoices');
    if (saved) {
      setInvoices(JSON.parse(saved));
    } else {
      const initial: Invoice[] = [
        { id: 'INV-001', customer: 'Acme Corp', amount: 1500.00, status: 'Paid', dueDate: '2023-11-30' },
        { id: 'INV-002', customer: 'Globex Corp', amount: 2450.00, status: 'Sent', dueDate: '2023-12-15' },
      ];
      setInvoices(initial);
      localStorage.setItem('cloudpilot_invoices', JSON.stringify(initial));
    }
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newInv: Invoice = {
      id: `INV-${Math.floor(Math.random() * 9000 + 1000)}`,
      customer: formData.customer,
      amount: Number(formData.amount),
      status: 'Draft',
      dueDate: formData.dueDate
    };
    const updated = [newInv, ...invoices];
    setInvoices(updated);
    localStorage.setItem('cloudpilot_invoices', JSON.stringify(updated));
    setShowModal(false);
    setFormData({ customer: '', amount: 0, dueDate: '' });
  };

  const stats = invoices.reduce((acc, inv) => {
    if (inv.status === 'Paid') acc.paid += inv.amount;
    else acc.pending += inv.amount;
    return acc;
  }, { paid: 0, pending: 0 });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Invoicing & Billing</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-cyan-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-cyan-700 shadow-md transition-all active:scale-95"
        >
          Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border-l-4 border-l-green-500 shadow-sm">
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total Received</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">${stats.paid.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border-l-4 border-l-yellow-500 shadow-sm">
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Awaiting Payment</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white mt-1">${stats.pending.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border dark:border-zinc-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-zinc-900/50 border-b dark:border-zinc-700">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Number</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Due Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-zinc-700">
            {invoices.length > 0 ? invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/30 transition-colors cursor-pointer">
                <td className="px-6 py-4 font-bold text-cyan-600">{inv.id}</td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">{inv.customer}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{inv.dueDate}</td>
                <td className="px-6 py-4 text-right font-mono text-gray-900 dark:text-white">${inv.amount.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    inv.status === 'Paid' ? 'bg-green-100 text-green-700' :
                    inv.status === 'Sent' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {inv.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="p-10 text-center text-gray-400">No invoices yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-zinc-700">
            <h3 className="text-2xl font-black mb-6 text-gray-800 dark:text-white">New Invoice</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Customer</label>
                <input required className="w-full p-3 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-cyan-500" 
                  value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} placeholder="Customer Name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Amount ($)</label>
                <input required type="number" step="0.01" className="w-full p-3 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-cyan-500" 
                  value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} placeholder="0.00" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Due Date</label>
                <input required type="date" className="w-full p-3 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-cyan-500" 
                  value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-cyan-600 text-white font-black rounded-xl hover:bg-cyan-700 shadow-lg shadow-cyan-100 dark:shadow-none">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoicing;
