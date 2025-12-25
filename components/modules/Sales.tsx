
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
    const updated = [order, ...orders];
    setOrders(updated);
    localStorage.setItem('cloudpilot_sales', JSON.stringify(updated));
    setShowModal(false);
    setNewOrder({ customer: '', total: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Quotations</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 shadow-sm transition-all active:scale-95"
          >
            New Quotation
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border dark:border-zinc-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-zinc-900/50 border-b dark:border-zinc-700">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Number</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Total</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-zinc-700">
            {orders.length > 0 ? orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-zinc-700/30 transition-colors cursor-pointer">
                <td className="px-6 py-4 font-bold text-blue-600">{order.id}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{order.date}</td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-200 font-medium">{order.customer}</td>
                <td className="px-6 py-4 font-mono dark:text-white">${order.total.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                    order.status === 'Invoiced' ? 'bg-green-100 text-green-700' :
                    order.status === 'Sales Order' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="p-10 text-center text-gray-400">No quotations found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-zinc-700">
            <h3 className="text-2xl font-black mb-6 text-gray-800 dark:text-white">Create Quotation</h3>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <input 
                required placeholder="Customer Name"
                className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={newOrder.customer}
                onChange={e => setNewOrder({...newOrder, customer: e.target.value})}
              />
              <input 
                required type="number" step="0.01"
                placeholder="Total Amount"
                className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={newOrder.total}
                onChange={e => setNewOrder({...newOrder, total: Number(e.target.value)})}
              />
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-100 dark:shadow-none">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
