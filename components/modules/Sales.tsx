
import React from 'react';
import { SaleOrder } from '../../types';

const Sales: React.FC = () => {
  const mockOrders: SaleOrder[] = [
    { id: 'SO001', customer: 'Acme Corp', date: '2023-10-24', total: 1250.00, status: 'Sales Order' },
    { id: 'SO002', customer: 'Globex Corp', date: '2023-10-25', total: 4300.50, status: 'Quotation' },
    { id: 'SO003', customer: 'Umbrella Inc', date: '2023-10-26', total: 890.00, status: 'Invoiced' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quotations</h2>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 shadow-sm">New Quotation</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Number</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Creation Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Total</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {mockOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                <td className="px-6 py-4 font-bold text-blue-600">{order.id}</td>
                <td className="px-6 py-4 text-gray-600">{order.date}</td>
                <td className="px-6 py-4 text-gray-700 font-medium">{order.customer}</td>
                <td className="px-6 py-4 font-mono">${order.total.toFixed(2)}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;
