
import React, { useState, useEffect } from 'react';
import { Product } from '../../types';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: 0, stock: 0, category: 'Hardware' });

  useEffect(() => {
    const saved = localStorage.getItem('cloudpilot_inventory');
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      const initial: Product[] = [
        { id: '1', name: 'Cloud Instance T2', price: 0.02, stock: 500, category: 'Computing' },
        { id: '2', name: 'SSD Storage 100GB', price: 12.00, stock: 42, category: 'Storage' },
      ];
      setProducts(initial);
      localStorage.setItem('cloudpilot_inventory', JSON.stringify(initial));
    }
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: Product = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData
    };
    const updated = [...products, newProd];
    setProducts(updated);
    localStorage.setItem('cloudpilot_inventory', JSON.stringify(updated));
    setShowModal(false);
    setFormData({ name: '', price: 0, stock: 0, category: 'Hardware' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Inventory Management</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-teal-700 shadow-md transition-all active:scale-95"
        >
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white dark:bg-zinc-800 p-6 rounded-xl border dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/30 text-teal-600 rounded-lg flex items-center justify-center text-2xl">
                📦
              </div>
              <span className="text-xs font-bold text-gray-400 bg-gray-50 dark:bg-zinc-900 px-2 py-1 rounded">{product.category}</span>
            </div>
            <h3 className="font-bold text-gray-800 dark:text-white text-lg group-hover:text-teal-600 transition-colors">{product.name}</h3>
            <div className="mt-4 flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Unit Price</p>
                <p className="text-xl font-mono text-gray-900 dark:text-white">${product.price.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">In Stock</p>
                <p className={`text-xl font-bold ${product.stock < 10 ? 'text-red-500' : 'text-green-600'}`}>
                  {product.stock}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-zinc-700">
            <h3 className="text-2xl font-black mb-6 text-gray-800 dark:text-white">New Product</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Product Name</label>
                <input required className="w-full p-3 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-teal-500" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Item name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Price</label>
                  <input required type="number" step="0.01" className="w-full p-3 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-teal-500" 
                    value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Quantity</label>
                  <input required type="number" className="w-full p-3 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-teal-500" 
                    value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Category</label>
                <select className="w-full p-3 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-teal-500" 
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option>Hardware</option>
                  <option>Software</option>
                  <option>Subscription</option>
                  <option>Services</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-teal-600 text-white font-black rounded-xl hover:bg-teal-700 shadow-lg shadow-teal-100 dark:shadow-none">Add Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
