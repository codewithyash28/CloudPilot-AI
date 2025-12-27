
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
      setProducts(JSON.parse(saved));
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
        note: 'Initial Stock'
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
      note: stockFormData.note || 'Manual Update'
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
    if (confirm('Delete this product from inventory?')) {
      saveToStorage(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-800 dark:text-white">Inventory Management</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Stock Ledger & Asset Tracking</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-teal-700 shadow-md transition-all active:scale-95"
        >
          + Create Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? products.map(product => (
          <div key={product.id} className="bg-white dark:bg-zinc-800 p-6 rounded-2xl border dark:border-zinc-700 shadow-sm hover:shadow-md transition-all group relative">
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
            
            <div className="mt-6 grid grid-cols-2 gap-4 border-b dark:border-zinc-700 pb-4">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Unit Price</p>
                <p className="text-xl font-mono font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">On Hand</p>
                <p className={`text-xl font-black ${product.stock < 10 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {product.stock}
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => setShowStockModal(product)}
                className="flex-1 bg-slate-50 dark:bg-zinc-900 hover:bg-teal-50 dark:hover:bg-teal-900/10 text-slate-600 dark:text-gray-400 hover:text-teal-600 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all border border-transparent hover:border-teal-200"
              >
                Update Stock
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-32 text-center text-gray-400 bg-white dark:bg-zinc-800 rounded-3xl border-2 border-dashed dark:border-zinc-700">
            <span className="text-4xl block mb-4">🏗️</span>
            <p className="font-bold">Inventory empty.</p>
            <p className="text-sm">Log your first asset to track arrivals.</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-zinc-700">
            <h3 className="text-2xl font-black mb-6 text-gray-800 dark:text-white">New Asset Entry</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
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
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Opening Qty</label>
                  <input type="number" className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 transition-all outline-none" 
                    value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="0" />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-2xl transition-colors">Discard</button>
                <button type="submit" className="flex-1 py-4 bg-teal-600 text-white font-black rounded-2xl hover:bg-teal-700 shadow-xl shadow-teal-100 dark:shadow-none">Confirm Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Update/Journal Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-zinc-700 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-black text-gray-800 dark:text-white">{showStockModal.name}</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stock Movement Journal</p>
              </div>
              <button onClick={() => setShowStockModal(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden flex-1">
              {/* Add Movement Form */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-teal-600 uppercase tracking-widest">Register New Arrival</h4>
                <form onSubmit={handleUpdateStock} className="space-y-4 bg-slate-50 dark:bg-zinc-900/50 p-6 rounded-2xl border dark:border-zinc-700">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Quantity Change (+/-)</label>
                    <input 
                      required type="number" 
                      className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 transition-all outline-none" 
                      placeholder="e.g. 400 or -50"
                      value={stockFormData.quantity}
                      onChange={e => setStockFormData({...stockFormData, quantity: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Arrival Date</label>
                    <input 
                      required type="date" 
                      className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 transition-all outline-none" 
                      value={stockFormData.date}
                      onChange={e => setStockFormData({...stockFormData, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Notes</label>
                    <input 
                      className="w-full p-4 border dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 transition-all outline-none" 
                      placeholder="e.g. Monday Delivery"
                      value={stockFormData.note}
                      onChange={e => setStockFormData({...stockFormData, note: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="w-full py-4 bg-teal-600 text-white font-black rounded-xl hover:bg-teal-700 shadow-lg shadow-teal-100 dark:shadow-none transition-all">
                    Register Movement
                  </button>
                </form>
              </div>

              {/* History Log */}
              <div className="flex flex-col h-full">
                <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Movement History</h4>
                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                  {(showStockModal.stockHistory || []).slice().reverse().map(entry => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-xl">
                      <div>
                        <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{entry.note}</p>
                        <p className="text-[10px] text-gray-400">{entry.date}</p>
                      </div>
                      <span className={`font-mono font-black text-sm ${entry.quantity >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {entry.quantity >= 0 ? '+' : ''}{entry.quantity}
                      </span>
                    </div>
                  ))}
                  {(!showStockModal.stockHistory || showStockModal.stockHistory.length === 0) && (
                    <div className="text-center py-10 text-gray-400 text-xs italic">No history recorded</div>
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
