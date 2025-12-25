
import React, { useState, useEffect } from 'react';
import { Product } from '../../types';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '', category: 'Hardware' });

  useEffect(() => {
    const saved = localStorage.getItem('cloudpilot_inventory');
    if (saved) {
      setProducts(JSON.parse(saved));
    }
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) return;

    const newProd: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category
    };

    const updated = [...products, newProd];
    setProducts(updated);
    localStorage.setItem('cloudpilot_inventory', JSON.stringify(updated));
    setShowModal(false);
    setFormData({ name: '', price: '', stock: '', category: 'Hardware' });
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('cloudpilot_inventory', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-gray-800 dark:text-white">Inventory Assets</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-teal-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700 shadow-md transition-all active:scale-95"
        >
          + Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? products.map(product => (
          <div key={product.id} className="bg-white dark:bg-zinc-800 p-6 rounded-2xl border dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow group relative">
            <button 
              onClick={() => deleteProduct(product.id)}
              className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              ×
            </button>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-xl flex items-center justify-center text-2xl">
                📦
              </div>
              <span className="text-[10px] font-black text-gray-400 bg-gray-50 dark:bg-zinc-900 px-2 py-1 rounded-full uppercase tracking-wider">{product.category}</span>
            </div>
            <h3 className="font-bold text-gray-800 dark:text-white text-lg group-hover:text-teal-600 transition-colors">{product.name}</h3>
            <div className="mt-6 flex justify-between items-end">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Unit Price</p>
                <p className="text-xl font-mono font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">In Stock</p>
                <p className={`text-xl font-black ${product.stock < 10 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {product.stock}
                </p>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-32 text-center text-gray-400 bg-white dark:bg-zinc-800 rounded-3xl border-2 border-dashed dark:border-zinc-700">
            <span className="text-4xl block mb-4">🏗️</span>
            <p className="font-bold">No assets found in current workspace.</p>
            <p className="text-sm">Click "Add Product" to define inventory items.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-zinc-700">
            <h3 className="text-2xl font-black mb-6 text-gray-800 dark:text-white">New Asset Entry</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Product Name</label>
                <input required className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 transition-all outline-none" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Item label" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Price</label>
                  <input required type="number" step="0.01" className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 transition-all outline-none" 
                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Quantity</label>
                  <input required type="number" className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 transition-all outline-none" 
                    value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Category</label>
                <select className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 transition-all outline-none font-bold" 
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option>Hardware</option>
                  <option>Software</option>
                  <option>Subscription</option>
                  <option>Services</option>
                </select>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-2xl transition-colors">Discard</button>
                <button type="submit" className="flex-1 py-4 bg-teal-600 text-white font-black rounded-2xl hover:bg-teal-700 shadow-xl shadow-teal-100 dark:shadow-none">Confirm Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
