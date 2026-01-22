import React from 'react';
import { StockMovement, MovementStatus, User, UserRole, WarehouseTransfer } from '../types';
import { MOCK_WAREHOUSES } from '../constants';

interface ApprovalsProps {
  movements: StockMovement[];
  transfers: WarehouseTransfer[];
  onUpdate: (id: number, status: MovementStatus, role: UserRole) => void;
  onTransferUpdate: (id: number, decision: 'APPROVED' | 'REJECTED') => void;
  user: User;
}

const Approvals: React.FC<ApprovalsProps> = ({ movements, transfers, onUpdate, onTransferUpdate, user }) => {
  const pendingMovements = movements.filter(m => 
    m.status === MovementStatus.PENDING || 
    m.status === MovementStatus.REVIEW_REQUIRED
  );

  const pendingTransfers = transfers.filter(t => t.status === 'PENDING');

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Stock Adjustments Section */}
      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-tight">Control Matrix Authorization</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 italic">Internal Inventory Corrections</p>
          </div>
          <div className="bg-amber-100 text-amber-600 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">{pendingMovements.length} Pending</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="pb-8 pl-6">Requester</th>
                <th className="pb-8">Asset Details</th>
                <th className="pb-8 text-center">Variance</th>
                <th className="pb-8">Threshold Risk</th>
                <th className="pb-8 text-right pr-6">Decision Authority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pendingMovements.length === 0 ? (
                <tr><td colSpan={5} className="py-24 text-center text-slate-300 font-black uppercase tracking-[0.2em] text-xs">No pending corrections</td></tr>
              ) : (
                pendingMovements.map(m => {
                  const isCritical = m.status === MovementStatus.REVIEW_REQUIRED;
                  const canApprove = (isCritical && user.role === UserRole.ADMIN) || (!isCritical && (user.role === UserRole.MANAGER || user.role === UserRole.ADMIN));
                  
                  return (
                    <tr key={m.id} className="hover:bg-slate-50 transition-all group">
                      <td className="py-8 pl-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500">{m.createdBy.charAt(0)}</div>
                           <div>
                             <p className="text-sm font-black text-slate-800 leading-none">{m.createdBy}</p>
                             <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{new Date(m.createdAt).toLocaleDateString()}</p>
                           </div>
                        </div>
                      </td>
                      <td className="py-8">
                        <p className="text-sm font-black text-slate-800">{m.productName}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{m.sku}</p>
                      </td>
                      <td className="py-8 text-center">
                        <span className={`px-4 py-1.5 rounded-xl text-xs font-black ${m.quantity > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {m.quantity > 0 ? '+' : ''}{m.quantity}
                        </span>
                      </td>
                      <td className="py-8">
                         <div className="flex flex-col gap-1">
                           <span className={`text-[10px] font-black uppercase tracking-widest ${isCritical ? 'text-rose-600' : 'text-amber-600'}`}>
                             {isCritical ? 'Critical Review' : 'Manager Access'}
                           </span>
                           <span className="text-[10px] text-slate-400 font-bold">${(m.quantity * m.unitCost).toLocaleString()} total risk</span>
                         </div>
                      </td>
                      <td className="py-8 text-right pr-6">
                        <div className="flex items-center justify-end gap-3">
                          {canApprove ? (
                            <>
                              <button 
                                onClick={() => onUpdate(m.id, MovementStatus.REJECTED, user.role)}
                                className="px-6 py-3 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 hover:text-rose-600 transition-all"
                              >
                                Reject
                              </button>
                              <button 
                                onClick={() => onUpdate(m.id, MovementStatus.APPROVED, user.role)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-black transition-all"
                              >
                                Authorize
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] font-black text-slate-300 uppercase italic">Higher Authority Required</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warehouse Transfers Section */}
      <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-tight">Logistics Relocation Orders</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 italic">Hub-to-Hub Inventory Transfers</p>
          </div>
          <div className="bg-blue-100 text-blue-600 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">{pendingTransfers.length} Pending</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="pb-8 pl-6">Source Hub</th>
                <th className="pb-8 text-center">→</th>
                <th className="pb-8">Destination Hub</th>
                <th className="pb-8">Asset / Qty</th>
                <th className="pb-8 text-right pr-6">Management Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pendingTransfers.length === 0 ? (
                <tr><td colSpan={5} className="py-24 text-center text-slate-300 font-black uppercase tracking-[0.2em] text-xs">No pending relocations</td></tr>
              ) : (
                pendingTransfers.map(t => {
                  const canApprove = user.role === UserRole.ADMIN || user.role === UserRole.MANAGER;
                  
                  return (
                    <tr key={t.id} className="hover:bg-slate-50 transition-all group">
                      <td className="py-8 pl-6">
                        <p className="text-sm font-black text-slate-800 leading-none">{MOCK_WAREHOUSES.find(w => w.id === t.sourceWarehouseId)?.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Requested by {t.requestedBy}</p>
                      </td>
                      <td className="py-8 text-center">
                        <svg className="w-4 h-4 text-slate-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </td>
                      <td className="py-8">
                        <p className="text-sm font-black text-slate-800 leading-none">{MOCK_WAREHOUSES.find(w => w.id === t.destinationWarehouseId)?.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Target Destination</p>
                      </td>
                      <td className="py-8">
                        <p className="text-sm font-black text-slate-800">{t.productName}</p>
                        <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Quantity: {t.quantity} Pcs</p>
                      </td>
                      <td className="py-8 text-right pr-6">
                        <div className="flex items-center justify-end gap-3">
                          {canApprove ? (
                            <>
                              <button 
                                onClick={() => onTransferUpdate(t.id, 'REJECTED')}
                                className="px-6 py-3 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 hover:text-rose-600 transition-all"
                              >
                                Reject
                              </button>
                              <button 
                                onClick={() => onTransferUpdate(t.id, 'APPROVED')}
                                className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-black transition-all"
                              >
                                Execute
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] font-black text-slate-300 uppercase italic">Logistics Authorization Required</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Approvals;