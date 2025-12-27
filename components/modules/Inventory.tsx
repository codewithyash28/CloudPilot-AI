
import React, { useState, useEffect } from 'react';
import { Product, StockEntry } from '../../types';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState<Product | null>(null);
  
  // Forms
  const [formData, setFormData] = useState({ name: '', price: '', stock: '', category: 'Hardware' });
  const [stockFormData, setStockFormData] = useState({ quantity: '', note: '', date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    const saved = localStorage.getItem('cloudpilot_inventory');
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse inventory", e);
      }
    }
  }, []);

  const saveToStorage = (updated: Product[]) => {
    setProducts(updated);
    localStorage.setItem('cloudpilot_inventory', JSON.stringify(updated));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const initialQty = parseInt(formData.stock) || 0;
    const newProd: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      price: parseFloat(formData.price),
      stock: initialQty,
      category: formData.category,
      stockHistory: initialQty > 0 ? [{
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString().split('T')[0],
        quantity: initialQty,
        note: 'Initial Stocking'
      }] : []
    };

    saveToStorage([...products, newProd]);
    setShowAddModal(false);
    setFormData({ name: '', price: '', stock: '', category: 'Hardware' });
  };

  const handleUpdateStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showStockModal || !stockFormData.quantity) return;

    const qty = parseInt(stockFormData.quantity);
    const entry: StockEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: stockFormData.date,
      quantity: qty,
      note: stockFormData.note || 'Restock Arrival'
    };

    const updated = products.map(p => {
      if (p.id === showStockModal.id) {
        const history = [...(p.stockHistory || []), entry];
        const newTotal = history.reduce((sum, item) => sum + item.quantity, 0);
        return { ...p, stockHistory: history, stock: newTotal };
      }
      return p;
    });

    saveToStorage(updated);
    setShowStockModal(null);
    setStockFormData({ quantity: '', note: '', date: new Date().toISOString().split('T')[0] });
  };

  const deleteProduct = (id: string) => {
    if (confirm('Permanently remove this product from inventory assets?')) {
      saveToStorage(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-800 dark:text-white">Inventory Management</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Arrival Ledger & Assets</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-100 dark:shadow-none transition-all active:scale-95"
        >
          + Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? products.map(product => (
          <div key={product.id} className="bg-white dark:bg-zinc-800 p-6 rounded-2xl border dark:border-zinc-700 shadow-sm hover:shadow-md transition-all group relative">
            <button 
              onClick={() => deleteProduct(product.id)}
              className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
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
            
            <div className="mt-6 grid grid-cols-2 gap-4 border-b dark:border-zinc-700 pb-4">
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

            <div className="mt-4">
              <button 
                onClick={() => setShowStockModal(product)}
                className="w-full bg-slate-50 dark:bg-zinc-900 hover:bg-teal-50 dark:hover:bg-teal-900/10 text-slate-600 dark:text-gray-400 hover:text-teal-600 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-transparent hover:border-teal-200"
              >
                Log Stock Arrivals
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-32 text-center text-gray-400 bg-white dark:bg-zinc-800 rounded-3xl border-2 border-dashed dark:border-zinc-700">
            <span className="text-4xl block mb-4">🏗️</span>
            <p className="font-bold">No assets found.</p>
            <p className="text-sm">Log your first product to track daily stock updates.</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-zinc-700">
            <h3 className="text-2xl font-black mb-6 text-gray-800 dark:text-white">New Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-4" autoComplete="off">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Product Name</label>
                <input required className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 transition-all outline-none font-medium" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Item name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Price</label>
                  <input required type="number" step="0.01" className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 transition-all outline-none font-medium" 
                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Starting Qty</label>
                  <input type="number" className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 transition-all outline-none font-medium" 
                    value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="0" />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-2xl transition-colors">Discard</button>
                <button type="submit" className="flex-1 py-4 bg-teal-600 text-white font-black rounded-2xl hover:bg-teal-700 shadow-xl shadow-teal-100 dark:shadow-none transition-all">Add Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Journal Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-zinc-700 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-black text-gray-800 dark:text-white">{showStockModal.name}</h3>
                <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mt-1">Stock Arrival Journal</p>
              </div>
              <button onClick={() => setShowStockModal(null)} className="text-gray-400 hover:text-gray-600 text-3xl">×</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden flex-1">
              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">Register Movement (e.g. Mon 400, Tue 600)</h4>
                <form onSubmit={handleUpdateStock} className="space-y-4 bg-slate-50 dark:bg-zinc-900/50 p-6 rounded-2xl border dark:border-zinc-700">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Quantity Change (+ / -)</label>
                    <input 
                      required type="number" 
                      className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 transition-all outline-none font-bold text-lg" 
                      placeholder="e.g. 400"
                      value={stockFormData.quantity}
                      onChange={e => setStockFormData({...stockFormData, quantity: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Date</label>
                    <input 
                      required type="date" 
                      className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 transition-all outline-none font-medium" 
                      value={stockFormData.date}
                      onChange={e => setStockFormData({...stockFormData, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Movement Note</label>
                    <input 
                      className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 transition-all outline-none font-medium" 
                      placeholder="e.g. Monday Batch Arrival"
                      value={stockFormData.note}
                      onChange={e => setStockFormData({...stockFormData, note: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="w-full py-4 bg-teal-600 text-white font-black rounded-xl hover:bg-teal-700 transition-all">
                    Commit Movement
                  </button>
                </form>
              </div>

              <div className="flex flex-col h-full border-l dark:border-zinc-700 pl-8">
                <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Historical Log</h4>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                  {(showStockModal.stockHistory || []).slice().reverse().map(entry => (
                    <div key={entry.id} className="flex items-center justify-between p-4 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-2xl shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{entry.note}</span>
                        <span className="text-[10px] text-gray-400">{entry.date}</span>
                      </div>
                      <span className={`font-mono font-black text-lg ${entry.quantity >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {entry.quantity >= 0 ? '+' : ''}{entry.quantity}
                      </span>
                    </div>
                  ))}
                  {(!showStockModal.stockHistory || showStockModal.stockHistory.length === 0) && (
                    <div className="text-center py-20 text-gray-400 text-xs italic">No entries recorded.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
