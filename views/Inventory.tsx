
import React, { useState, useMemo } from 'react';
import { Warehouse, Product, StockMovement, MovementType, MovementStatus, User, UserRole } from '../types';
import { MOCK_PRODUCTS, ICONS, MOCK_BINS } from '../constants';

interface InventoryProps {
  warehouse: Warehouse;
  movements: StockMovement[];
  onAdd: (m: Omit<StockMovement, 'id' | 'createdAt' | 'status'>) => void;
  user: User;
}

const Inventory: React.FC<InventoryProps> = ({ warehouse, movements, onAdd, user }) => {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    type: MovementType.IN,
    quantity: '',
    uom: 'Pcs',
    locationId: '',
    reason: '',
    referenceNo: ''
  });

  const selectedProduct = useMemo(() => 
    MOCK_PRODUCTS.find(p => p.id === Number(formData.productId)), 
    [formData.productId]
  );

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    // Trigger confirmation for high-risk actions
    const qty = Number(formData.quantity);
    if (formData.type === MovementType.OUT || formData.type === MovementType.ADJUST || qty > 100) {
      setShowConfirm(true);
    } else {
      executeLog();
    }
  };

  const executeLog = () => {
    if (!selectedProduct) return;
    setIsSubmitting(true);

    onAdd({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      sku: selectedProduct.sku,
      warehouseId: warehouse.id,
      warehouseName: warehouse.name,
      locationId: formData.locationId,
      type: formData.type,
      quantity: Number(formData.quantity),
      uom: formData.uom,
      unitCost: selectedProduct.unitCost,
      reason: formData.reason,
      referenceNo: formData.referenceNo,
      createdBy: user.name
    });

    // Simulated short delay for double-submit prevention visualization
    setTimeout(() => {
      setFormData({ productId: '', type: MovementType.IN, quantity: '', uom: 'Pcs', locationId: '', reason: '', referenceNo: '' });
      setShowModal(false);
      setShowConfirm(false);
      setIsSubmitting(false);
    }, 500);
  };

  const filteredMovements = useMemo(() => {
    return movements.filter(m => m.warehouseId === warehouse.id);
  }, [movements, warehouse.id]);

  const bins = MOCK_BINS.filter(b => b.warehouseId === warehouse.id);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Hub Terminal</h2>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-3">High-Frequency Stock Control</p>
        </div>
        {user.role !== UserRole.ADMIN && (
          <button 
            onClick={() => setShowModal(true)}
            className="group bg-blue-600 hover:bg-black text-white px-10 py-5 rounded-3xl font-black shadow-2xl shadow-blue-200 flex items-center gap-4 transition-all active:scale-95"
          >
            <div className="bg-white/20 p-2 rounded-xl group-hover:bg-blue-500 transition-colors"><ICONS.Inventory className="w-6 h-6" /></div>
            <span className="text-lg">Quick Log Movement</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-10 py-8">Asset / SKU</th>
                <th className="px-10 py-8">Bin Location</th>
                <th className="px-10 py-8">Operation</th>
                <th className="px-10 py-8">Qty / Yield</th>
                <th className="px-10 py-8">Validation</th>
                <th className="px-10 py-8 text-right">Value Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredMovements.length === 0 ? (
                <tr><td colSpan={6} className="px-10 py-40 text-center text-slate-300 font-black uppercase tracking-widest text-xs">Waiting for terminal input...</td></tr>
              ) : (
                filteredMovements.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-10 py-8">
                      <p className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors">{m.productName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{m.sku}</p>
                    </td>
                    <td className="px-10 py-8">
                       <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">{m.locationId || 'OFF-GRID'}</span>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] ${
                        m.type.includes('IN') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {m.type}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900">{m.type.includes('OUT') ? '-' : '+'}{m.quantity}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.uom}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${m.status === MovementStatus.APPROVED ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : m.status === MovementStatus.REVIEW_REQUIRED ? 'bg-rose-500 animate-pulse shadow-[0_0_8px_#ef4444]' : 'bg-amber-500'}`}></div>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.status.replace('_', ' ')}</span>
                       </div>
                    </td>
                    <td className="px-10 py-8 text-right font-mono text-xs font-black text-slate-900">
                      ${(m.quantity * m.unitCost).toLocaleString()}
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
          {!showConfirm ? (
            <div className="bg-white rounded-[3.5rem] w-full max-w-xl shadow-2xl animate-in zoom-in duration-500">
              <div className="p-12 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Terminal Log</h3>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Manual Asset Override</p>
                </div>
                <button onClick={() => setShowModal(false)} className="bg-slate-100 p-4 rounded-2xl hover:bg-slate-200 transition-all active:scale-90">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <form onSubmit={handleInitialSubmit} className="p-12 space-y-10">
                <div className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Search Registry SKU</label>
                    <select 
                      required
                      className="w-full bg-slate-50 border-none rounded-[1.5rem] px-6 py-5 text-sm font-black text-slate-800 focus:ring-4 focus:ring-blue-100 outline-none transition-all appearance-none"
                      value={formData.productId}
                      onChange={e => setFormData(prev => ({ ...prev, productId: e.target.value }))}
                    >
                      <option value="">-- Choose Commodity --</option>
                      {MOCK_PRODUCTS.map(p => (
                        <option key={p.id} value={p.id}>{p.sku} | {p.name}</option>
                      ))}
                    </select>
                    {selectedProduct && (
                      <div className="mt-4 flex items-center justify-between px-4 py-3 bg-blue-50 rounded-2xl border border-blue-100 animate-in fade-in slide-in-from-top-2">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Current Terminal Stock:</span>
                        <span className="text-sm font-black text-blue-800">{selectedProduct.currentStock} {selectedProduct.uom}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Target Hub Bin</label>
                      <select 
                        required
                        className="w-full bg-slate-50 border-none rounded-[1.5rem] px-6 py-5 text-sm font-black text-slate-800 focus:ring-4 focus:ring-blue-100 outline-none"
                        value={formData.locationId}
                        onChange={e => setFormData(p => ({...p, locationId: e.target.value}))}
                      >
                        <option value="">-- Bin --</option>
                        {bins.map(b => (
                          <option key={b.id} value={b.id}>{b.zone}-{b.rack}-{b.bin}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Operation</label>
                      <select 
                        className="w-full bg-slate-50 border-none rounded-[1.5rem] px-6 py-5 text-sm font-black text-slate-800 focus:ring-4 focus:ring-blue-100 outline-none"
                        value={formData.type}
                        onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as MovementType }))}
                      >
                        <option value={MovementType.IN}>Direct In</option>
                        <option value={MovementType.OUT}>Direct Out</option>
                        <option value={MovementType.ADJUST}>Correction</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Transaction Volume</label>
                    <input 
                      type="number" required min="1"
                      className="w-full bg-slate-50 border-none rounded-[1.5rem] px-6 py-5 text-lg font-black text-slate-800 focus:ring-4 focus:ring-blue-100 outline-none"
                      placeholder="0.00"
                      value={formData.quantity}
                      onChange={e => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-black text-white py-6 rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-200 transition-all transform hover:-translate-y-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Transmitting Data...' : 'Confirm System Entry'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-[3.5rem] w-full max-w-md shadow-2xl animate-in zoom-in duration-300 p-12 text-center">
              <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-100">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-4">Verification Required</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10">
                You are performing a <span className="text-slate-900 font-bold uppercase tracking-widest text-[10px]">{formData.type}</span> of <span className="text-slate-900 font-bold">{formData.quantity} units</span>. 
                {formData.type === MovementType.OUT && Number(formData.quantity) > (selectedProduct?.currentStock || 0) && (
                  <span className="block mt-4 text-rose-600 font-black uppercase tracking-widest text-[10px] animate-pulse">Critical: Stock Out exceeds current Hub inventory!</span>
                )}
              </p>
              <div className="flex gap-4">
                 <button 
                   onClick={() => setShowConfirm(false)}
                   className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={executeLog}
                   disabled={isSubmitting}
                   className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-black transition-all"
                 >
                   {isSubmitting ? 'Transmitting...' : 'Confirm'}
                 </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Inventory;
