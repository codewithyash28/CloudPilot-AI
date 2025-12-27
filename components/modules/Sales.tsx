
import React, { useState, useEffect } from 'react';
import { SaleOrder } from '../../types';

const Sales: React.FC = () => {
  const [orders, setOrders] = useState<SaleOrder[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newOrder, setNewOrder] = useState({ customer: '', total: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('cloudpilot_sales');
    if (saved) {
      setOrders(JSON.parse(saved));
    }
  }, []);

  const saveToStorage = (updated: SaleOrder[]) => {
    setOrders(updated);
    localStorage.setItem('cloudpilot_sales', JSON.stringify(updated));
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrder.customer) return;

    const order: SaleOrder = {
      id: `SO${Math.floor(Math.random() * 9000 + 1000)}`,
      customer: newOrder.customer,
      date: new Date().toISOString().split('T')[0],
      total: Number(newOrder.total),
      status: 'Quotation'
    };
    saveToStorage([order, ...orders]);
    setShowModal(false);
    setNewOrder({ customer: '', total: 0 });
  };

  const confirmOrder = (id: string) => {
    saveToStorage(orders.map(o => o.id === id ? { ...o, status: 'Sales Order' } : o));
  };

  const markInvoiced = (id: string) => {
    saveToStorage(orders.map(o => o.id === id ? { ...o, status: 'Invoiced' } : o));
  };

  const deleteOrder = (id: string) => {
    if (confirm('Permanently delete this record?')) {
      saveToStorage(orders.filter(o => o.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">Quotations & Orders</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Order Execution Lifecycle</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-blue-700 shadow-xl shadow-blue-100 dark:shadow-none transition-all active:scale-95 text-sm uppercase tracking-widest"
        >
          + New Quotation
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-sm border dark:border-zinc-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-zinc-900/50 border-b dark:border-zinc-700">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Reference</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Total</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-zinc-700">
              {orders.length > 0 ? orders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-zinc-700/30 transition-colors group">
                  <td className="px-6 py-5 font-black text-blue-600 tracking-tighter text-lg">{order.id}</td>
                  <td className="px-6 py-5 text-gray-700 dark:text-gray-200 font-bold">{order.customer}</td>
                  <td className="px-6 py-5 text-gray-500 font-medium text-sm">{order.date}</td>
                  <td className="px-6 py-5 text-right font-mono dark:text-white font-black text-lg">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      order.status === 'Invoiced' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20' :
                      order.status === 'Sales Order' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20' :
                      'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-3">
                      {order.status === 'Quotation' && (
                        <button onClick={() => confirmOrder(order.id)} className="text-[10px] font-black uppercase text-blue-600 hover:underline">Confirm Order</button>
                      )}
                      {order.status === 'Sales Order' && (
                        <button onClick={() => markInvoiced(order.id)} className="text-[10px] font-black uppercase text-emerald-600 hover:underline">Create Invoice</button>
                      )}
                      <button onClick={() => deleteOrder(order.id)} className="text-gray-300 hover:text-rose-500 font-black">×</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="p-32 text-center text-gray-400 font-medium italic">No quotations found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-800 rounded-3xl p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-zinc-700">
            <h3 className="text-3xl font-black mb-8 text-gray-800 dark:text-white tracking-tighter">Issue Quotation</h3>
            <form onSubmit={handleCreateOrder} className="space-y-5">
              <input required placeholder="Customer Name" className="w-full p-4 bg-slate-50 dark:bg-zinc-900 dark:text-white border dark:border-zinc-700 rounded-2xl outline-none font-bold" value={newOrder.customer} onChange={e => setNewOrder({...newOrder, customer: e.target.value})} />
              <input required type="number" step="0.01" placeholder="Grand Total ($)" className="w-full p-4 bg-slate-50 dark:bg-zinc-900 dark:text-white border dark:border-zinc-700 rounded-2xl outline-none font-bold" value={newOrder.total === 0 ? '' : newOrder.total} onChange={e => setNewOrder({...newOrder, total: Number(e.target.value)})} />
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-gray-500 font-black uppercase hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-2xl transition-colors">Discard</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl transition-all">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
