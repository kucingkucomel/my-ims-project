import React, { useState } from 'react';
import { Warehouse, StockMovement, MovementType, MovementStatus, User, UserRole, WarehouseTransfer } from '../types';
import { MOCK_PRODUCTS, MOCK_WAREHOUSES, ICONS } from '../constants';

interface TransfersProps {
  warehouse: Warehouse;
  transfers: WarehouseTransfer[];
  onAdd: (m: Omit<WarehouseTransfer, 'id' | 'createdAt' | 'status'>) => void;
  user: User;
}

const Transfers: React.FC<TransfersProps> = ({ warehouse, transfers, onAdd, user }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    destWhId: '',
    quantity: '',
    reason: ''
  });

  const hubTransfers = transfers.filter(t => 
    t.sourceWarehouseId === warehouse.id || t.destinationWarehouseId === warehouse.id
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = MOCK_PRODUCTS.find(p => p.id === Number(formData.productId));
    if (!product) return;

    if (Number(formData.destWhId) === warehouse.id) {
      alert("Validation Error: Destination must be a external hub terminal.");
      return;
    }

    onAdd({
      sourceWarehouseId: warehouse.id,
      destinationWarehouseId: Number(formData.destWhId),
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: Number(formData.quantity),
      reason: formData.reason,
      requestedBy: user.name
    });

    setFormData({ productId: '', destWhId: '', quantity: '', reason: '' });
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Hub-to-Hub Logistics</h2>
          <p className="text-slate-500 text-sm font-medium">Internal stock relocation and transfer lifecycle</p>
        </div>
        {user.role !== UserRole.ADMIN && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-bold shadow-xl flex items-center gap-2 transition-all transform hover:-translate-y-1 active:scale-95"
          >
            <ICONS.Transfer className="w-5 h-5" />
            Request Relocation
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-6">ID</th>
                <th className="px-8 py-6">Commodity</th>
                <th className="px-8 py-6">Hub Path</th>
                <th className="px-8 py-6 text-center">Volume</th>
                <th className="px-8 py-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {hubTransfers.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-32 text-center text-slate-300 font-bold uppercase tracking-widest text-[10px]">Registry empty: No active transfers</td></tr>
              ) : (
                hubTransfers.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-6 font-mono text-xs font-bold text-slate-400">#TR-{t.id.toString().slice(-6)}</td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">{t.productName}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{t.sku}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-600 uppercase">
                          {MOCK_WAREHOUSES.find(w => w.id === t.sourceWarehouseId)?.name.split(' ')[0]}
                        </span>
                        <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        <span className="text-[10px] font-black text-blue-600 uppercase">
                          {MOCK_WAREHOUSES.find(w => w.id === t.destinationWarehouseId)?.name.split(' ')[0]}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <p className="text-sm font-black text-slate-800">{t.quantity}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Pcs</p>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         t.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 
                         t.status === 'PENDING' ? 'bg-amber-100 text-amber-600 animate-pulse' : 'bg-rose-100 text-rose-600'
                       }`}>
                         {t.status}
                       </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
            <div className="p-10 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none">Relocation Order</h3>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2">Logistics Control Interface</p>
              </div>
              <button onClick={() => setShowModal(false)} className="bg-white p-3 rounded-xl shadow-sm hover:bg-slate-100 transition-all text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Source Terminal</label>
                  <div className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-500">
                    {warehouse.name}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Destination Hub</label>
                  <select 
                    required
                    className="w-full bg-slate-50 border border-transparent focus:border-blue-200 focus:bg-white rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none transition-all"
                    value={formData.destWhId}
                    onChange={e => setFormData(prev => ({ ...prev, destWhId: e.target.value }))}
                  >
                    <option value="">-- Choose Hub Node --</option>
                    {MOCK_WAREHOUSES.filter(w => w.id !== warehouse.id).map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Asset Registry SKU</label>
                  <select 
                    required
                    className="w-full bg-slate-50 border border-transparent focus:border-blue-200 focus:bg-white rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none transition-all"
                    value={formData.productId}
                    onChange={e => setFormData(prev => ({ ...prev, productId: e.target.value }))}
                  >
                    <option value="">-- Select Commodity --</option>
                    {MOCK_PRODUCTS.map(p => (
                      <option key={p.id} value={p.id}>{p.sku} | {p.name} (Available: {p.currentStock})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Transfer Volume</label>
                  <input 
                    type="number" required min="1"
                    className="w-full bg-slate-50 border border-transparent focus:border-blue-200 focus:bg-white rounded-2xl px-5 py-4 text-sm font-black text-slate-800 outline-none transition-all"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={e => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-black text-white py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 transition-all transform hover:-translate-y-1 active:scale-95">
                Transmit Relocation Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transfers;