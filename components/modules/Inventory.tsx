
import React, { useState, useEffect } from 'react';
import { Product, StockEntry } from '../../types';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState<Product | null>(null);
  
  // Form States
  const [formData, setFormData] = useState({ name: '', price: '', stock: '', category: 'Hardware' });
  const [stockFormData, setStockFormData] = useState({ 
    quantity: '', 
    note: '', 
    date: new Date().toISOString().split('T')[0] 
  });

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
      stockHistory: initialQty !== 0 ? [{
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString().split('T')[0],
        quantity: initialQty,
        note: 'Opening Stock Balance'
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
      note: stockFormData.note || (qty >= 0 ? 'Stock Arrival' : 'Stock Removal')
    };

    const updated = products.map(p => {
      if (p.id === showStockModal.id) {
        const history = [...(p.stockHistory || []), entry];
        history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const newTotal = history.reduce((sum, item) => sum + item.quantity, 0);
        return { ...p, stockHistory: history, stock: Math.max(0, newTotal) };
      }
      return p;
    });

    saveToStorage(updated);
    const currentProduct = updated.find(p => p.id === showStockModal.id);
    if (currentProduct) setShowStockModal(currentProduct);
    
    setStockFormData({ 
      quantity: '', 
      note: '', 
      date: new Date().toISOString().split('T')[0] 
    });
  };

  const deleteProduct = (id: string) => {
    if (confirm('Permanently remove this product asset and all its history?')) {
      saveToStorage(products.filter(p => p.id !== id));
      if (showStockModal?.id === id) setShowStockModal(null);
    }
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const calculateRunningBalances = (history: StockEntry[]) => {
    let balance = 0;
    return history.map(entry => {
      balance += entry.quantity;
      return { ...entry, runningBalance: balance };
    });
  };

  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">Inventory Intelligence</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Real-time Warehouse Valuation</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-teal-700 shadow-xl shadow-teal-100 dark:shadow-none transition-all active:scale-95 text-sm uppercase tracking-widest"
        >
          + Add New Product
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-800 p-8 rounded-[2.5rem] border dark:border-zinc-700 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Asset Value</p>
          <p className="text-5xl font-black text-teal-600 tracking-tighter">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-50 dark:bg-zinc-900 px-6 py-4 rounded-2xl border dark:border-zinc-700">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total SKU</p>
            <p className="text-2xl font-black text-gray-800 dark:text-white">{products.length}</p>
          </div>
          <div className="bg-slate-50 dark:bg-zinc-900 px-6 py-4 rounded-2xl border dark:border-zinc-700">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Low Stock Items</p>
            <p className="text-2xl font-black text-rose-500">{products.filter(p => p.stock < 10).length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? products.map(product => {
          const health = Math.min(100, (product.stock / 50) * 100);
          return (
            <div key={product.id} className="bg-white dark:bg-zinc-800 p-6 rounded-3xl border dark:border-zinc-700 shadow-sm hover:shadow-md transition-all group relative flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border shadow-inner ${
                  product.stock === 0 ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-teal-50 border-teal-100 text-teal-600 dark:bg-teal-900/20 dark:border-teal-900/40'
                }`}>
                  {product.stock === 0 ? '⚠️' : '📦'}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] font-black text-teal-600 bg-teal-50 dark:bg-zinc-900 border border-teal-100 dark:border-zinc-700 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                    {product.category}
                  </span>
                  <div className="w-16 h-1 bg-slate-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${product.stock < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${health}%` }}></div>
                  </div>
                </div>
              </div>

              <h3 className="font-black text-gray-800 dark:text-white text-xl group-hover:text-teal-600 transition-colors leading-tight mb-1">
                {product.name}
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-4">Total Value: ${(product.price * product.stock).toFixed(2)}</p>
              
              <div className="mt-auto pt-6 border-t dark:border-zinc-700 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Unit Price</p>
                  <p className="text-lg font-mono font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Quantity</p>
                  <p className={`text-lg font-black ${product.stock <= 5 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {product.stock}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button 
                  onClick={() => setShowStockModal(product)}
                  className="flex-1 bg-slate-50 dark:bg-zinc-900 hover:bg-teal-50 dark:hover:bg-teal-900/20 text-slate-600 dark:text-gray-400 hover:text-teal-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-slate-100 dark:border-zinc-700 hover:border-teal-200"
                >
                  Stock Journal
                </button>
                <button 
                  onClick={() => deleteProduct(product.id)}
                  className="px-4 bg-rose-50 dark:bg-rose-900/10 hover:bg-rose-100 text-rose-300 hover:text-rose-600 rounded-2xl border border-rose-50 dark:border-zinc-700 transition-all"
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full py-40 text-center text-gray-400 bg-white dark:bg-zinc-800 rounded-[3rem] border-4 border-dashed dark:border-zinc-700">
            <span className="text-6xl block mb-6">🏪</span>
            <p className="font-black uppercase text-sm tracking-[0.3em]">Shelves are Empty</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-md">
          <div className="bg-white dark:bg-zinc-800 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-zinc-700">
            <h3 className="text-3xl font-black mb-8 text-gray-800 dark:text-white tracking-tighter text-center">New Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-5" autoComplete="off">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Product Name</label>
                <input required className="w-full p-4 bg-slate-50 dark:bg-zinc-900 dark:text-white border dark:border-zinc-700 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all outline-none font-bold" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Widget Pro" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Price ($)</label>
                  <input required type="number" step="0.01" className="w-full p-4 bg-slate-50 dark:bg-zinc-900 dark:text-white border dark:border-zinc-700 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all outline-none font-bold" 
                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Opening Stock</label>
                  <input type="number" className="w-full p-4 bg-slate-50 dark:bg-zinc-900 dark:text-white border dark:border-zinc-700 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all outline-none font-bold" 
                    value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="0" />
                </div>
              </div>
              <div className="flex gap-4 pt-8">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-gray-400 font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-zinc-700 rounded-2xl transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-teal-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-teal-700 shadow-xl shadow-teal-100 dark:shadow-none transition-all">Create Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Journal Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-lg">
          <div className="bg-white dark:bg-zinc-800 rounded-[3rem] p-10 max-w-5xl w-full shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-zinc-700 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-4xl font-black text-gray-800 dark:text-white tracking-tighter">{showStockModal.name}</h3>
                <div className="flex items-center gap-4 mt-3">
                   <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest bg-teal-50 dark:bg-teal-900/20 px-3 py-1.5 rounded-lg border border-teal-100 dark:border-teal-900/40">Daily Log History</span>
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available: {showStockModal.stock} Units</span>
                </div>
              </div>
              <button onClick={() => setShowStockModal(null)} className="bg-slate-50 dark:bg-zinc-900 text-gray-400 hover:text-rose-500 w-12 h-12 flex items-center justify-center rounded-full transition-all text-3xl font-light">×</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 overflow-hidden flex-1">
              <div className="lg:col-span-2 space-y-8">
                <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] border-b dark:border-zinc-700 pb-4">Log New Movement</h4>
                <form onSubmit={handleUpdateStock} className="space-y-6 bg-slate-50 dark:bg-zinc-900/50 p-8 rounded-[2rem] border dark:border-zinc-700 shadow-inner">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Quantity Adjustment</label>
                    <input required type="number" className="w-full p-5 bg-white dark:bg-zinc-900 dark:text-white border dark:border-zinc-700 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all outline-none font-black text-3xl text-center" placeholder="+400 or -100" value={stockFormData.quantity} onChange={e => setStockFormData({...stockFormData, quantity: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <input required type="date" className="w-full p-4 bg-white dark:bg-zinc-900 dark:text-white border dark:border-zinc-700 rounded-2xl outline-none font-bold text-sm" value={stockFormData.date} onChange={e => setStockFormData({...stockFormData, date: e.target.value})} />
                    <input className="w-full p-4 bg-white dark:bg-zinc-900 dark:text-white border dark:border-zinc-700 rounded-2xl outline-none font-bold text-sm" placeholder="Log Description" value={stockFormData.note} onChange={e => setStockFormData({...stockFormData, note: e.target.value})} />
                  </div>
                  <button type="submit" className="w-full py-5 bg-teal-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-teal-700 transition-all">Commit Log</button>
                </form>
              </div>

              <div className="lg:col-span-3 flex flex-col h-full border-l dark:border-zinc-700 pl-12 overflow-hidden">
                <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] border-b dark:border-zinc-700 pb-4 mb-6">Movement Ledger</h4>
                <div className="flex-1 overflow-y-auto space-y-4 pr-4 scrollbar-hide pb-10">
                  {calculateRunningBalances(showStockModal.stockHistory || []).slice().reverse().map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-6 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-[1.5rem] shadow-sm hover:border-teal-100 transition-all group">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-black text-gray-800 dark:text-gray-200">{entry.note}</span>
                        <span className="text-[10px] text-teal-600 font-black uppercase tracking-tighter bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-md w-fit">{getDayName(entry.date)}</span>
                      </div>
                      <div className="flex items-center gap-8 text-right">
                        <div>
                          <span className={`font-mono font-black text-xl leading-none ${entry.quantity >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {entry.quantity >= 0 ? '+' : ''}{entry.quantity}
                          </span>
                          <p className="text-[8px] text-gray-300 font-black tracking-widest uppercase mt-1">Delta</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-zinc-900/50 px-4 py-2 rounded-xl min-w-[80px]">
                          <span className="font-mono font-black text-lg text-gray-700 dark:text-gray-300">
                            {entry.runningBalance}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
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
