
import React, { useState } from 'react';
// Fixed: Removed non-existent AuditLog import
import { StockMovement, User, UserRole } from '../types';

interface AuditLogsProps {
  movements: StockMovement[];
  user: User;
}

const AuditLogs: React.FC<AuditLogsProps> = ({ movements, user }) => {
  const [filter, setFilter] = useState('');

  // Performance Optimization: Search filtering
  // Note: For a Manager, this might be pre-filtered by warehouse context in a real app.
  const displayLogs = movements.filter(m => 
    (m.productName.toLowerCase().includes(filter.toLowerCase()) ||
    m.sku.toLowerCase().includes(filter.toLowerCase()) ||
    m.createdBy.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">System Audit Logs</h2>
          <p className="text-slate-500 text-sm italic">
            {user.role === UserRole.ADMIN 
              ? "Global record of all system-wide stock transactions." 
              : "Localized record of warehouse activity and approvals."}
          </p>
        </div>
        
        <div className="relative">
          <input 
            type="text"
            className="bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-64 shadow-sm"
            placeholder="Search activity..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-8 py-5">Event ID</th>
                <th className="px-8 py-5">Timestamp</th>
                <th className="px-8 py-5">User Account</th>
                <th className="px-8 py-5">Action Performed</th>
                <th className="px-8 py-5">System Entity</th>
                <th className="px-8 py-5 text-right">Entity Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <p className="font-semibold uppercase tracking-widest text-xs">Clear of any logged events</p>
                    </div>
                  </td>
                </tr>
              ) : (
                displayLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5 font-mono text-xs text-slate-400 tracking-tighter">#{log.id}</td>
                    <td className="px-8 py-5 text-xs text-slate-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {log.createdBy.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{log.createdBy}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        {log.type === 'IN' ? 'Inbound Receipt' : log.type === 'OUT' ? 'Stock Dispatch' : 'Inventory Correction'}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-widest">StockMovements</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <p className="text-sm font-mono text-slate-400">UID-{log.id.toString().slice(-4)}</p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Production Integrity Note
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          Nexus IMS audit logs are designed to be append-only. No records can be modified or deleted once finalized. This ensures compliance with standard logistics transparency requirements and production hardening protocols.
        </p>
      </div>
    </div>
  );
};

export default AuditLogs;
