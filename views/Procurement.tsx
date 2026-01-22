
import React, { useState } from 'react';
import { PurchaseRequisition, User, UserRole } from '../types';
import { MOCK_PRODUCTS, ICONS } from '../constants';

interface ProcurementProps {
  requisitions: PurchaseRequisition[];
  onAdd: (pr: Omit<PurchaseRequisition, 'id' | 'createdAt' | 'status'>) => void;
  user: User;
}

const Procurement: React.FC<ProcurementProps> = ({ requisitions, onAdd, user }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = MOCK_PRODUCTS.find(p => p.id === Number(formData.productId));
    if (!product) return;

    onAdd({
      productId: product.id,
      productName: product.name,
      quantity: Number(formData.quantity),
      priority: formData.priority,
      requestedBy: user.name
    });

    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Procurement Gateway</h2>
          <p className="text-slate-500 text-sm font-medium">Manage Purchase Requisitions (PR) & Sourcing</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-emerald-200 flex items-center gap-2 transition-all transform hover:-translate-y-1 active:scale-95"
        >
          <ICONS.Procurement className="w-5 h-5" />
          New Requisition
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-6">PR ID</th>
                <th className="px-8 py-6">Requested Item</th>
                <th className="px-8 py-6 text-center">Qty</th>
                <th className="px-8 py-6">Priority</th>
                <th className="px-8 py-6">PR Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {requisitions.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-32 text-center text-slate-300 font-bold uppercase tracking-widest text-[10px]">Registry empty: No sourcing requests</td></tr>
              ) : (
                requisitions.map(pr => (
                  <tr key={pr.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6 font-mono text-xs font-bold text-slate-400">#PR-{pr.id.toString().slice(-6)}</td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-slate-800">{pr.productName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Requested by {pr.requestedBy}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <p className="text-sm font-black text-slate-800">{pr.quantity}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        pr.priority === 'HIGH' ? 'bg-rose-100 text-rose-600' : 
                        pr.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {pr.priority}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-600`}>
                         {pr.status}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in duration-300">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Create Sourcing Requisition</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-800 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Commodity Procurement</label>
                  <select 
                    required
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none"
                    value={formData.productId}
                    onChange={e => setFormData(prev => ({ ...prev, productId: e.target.value }))}
                  >
                    <option value="">-- Choose Item to Source --</option>
                    {MOCK_PRODUCTS.map(p => (
                      <option key={p.id} value={p.id}>{p.sku} | {p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Required Yield</label>
                    <input 
                      type="number" required min="1"
                      className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-black text-slate-800 outline-none"
                      placeholder="0"
                      value={formData.quantity}
                      onChange={e => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Order Priority</label>
                    <select 
                      className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none"
                      value={formData.priority}
                      onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                    >
                      <option value="LOW">Low (Replenish)</option>
                      <option value="MEDIUM">Medium (Stable)</option>
                      <option value="HIGH">High (Stockout Risk)</option>
                    </select>
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black shadow-2xl shadow-emerald-200 transition-all">
                Finalize Purchase Requisition
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Procurement;
