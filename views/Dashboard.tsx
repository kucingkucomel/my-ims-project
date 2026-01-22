
import React, { useState, useEffect, useMemo } from 'react';
import { Warehouse, StockMovement, Product, User, UserRole, MovementStatus, MovementType, Alert } from '../types';
import { ICONS, MOCK_PRODUCTS } from '../constants';
import StatCard from '../components/StatCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { getInventoryInsights } from '../services/geminiService';

interface DashboardProps {
  warehouse: Warehouse;
  movements: StockMovement[];
  user: User;
  alerts: Alert[];
}

const Dashboard: React.FC<DashboardProps> = ({ warehouse, movements, user, alerts }) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const stats = useMemo(() => {
    const totalValue = MOCK_PRODUCTS.reduce((acc, p) => acc + (p.currentStock * p.unitCost), 0);
    const criticalStockouts = MOCK_PRODUCTS.filter(p => p.currentStock === 0 && p.sku !== "").length; // Only count defined products
    const pendingApprovals = movements.filter(m => m.status === MovementStatus.PENDING || m.status === MovementStatus.REVIEW_REQUIRED).length;
    
    // Dynamically calculate Category A exposure
    const catAValue = MOCK_PRODUCTS
      .filter(p => p.abcCategory === 'A')
      .reduce((acc, p) => acc + (p.currentStock * p.unitCost), 0);

    return { totalValue, criticalStockouts, pendingApprovals, catAValue };
  }, [movements]);

  const velocityData = useMemo(() => {
    return MOCK_PRODUCTS.map(p => ({
      name: p.sku,
      stock: p.currentStock,
      val: p.currentStock * p.unitCost,
      color: p.abcCategory === 'A' ? '#2563eb' : p.abcCategory === 'B' ? '#64748b' : '#cbd5e1'
    })).sort((a,b) => b.val - a.val).slice(0, 5);
  }, []);

  useEffect(() => {
    if (user.role !== UserRole.WAREHOUSE && MOCK_PRODUCTS.length > 0) {
      setLoadingAi(true);
      getInventoryInsights(movements, MOCK_PRODUCTS).then(setAiInsight).finally(() => setLoadingAi(false));
    } else if (MOCK_PRODUCTS.length === 0) {
      setAiInsight("Director is standing by. Please initialize the inventory registry to begin strategic analysis.");
    }
  }, [movements, user.role]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Valuation & Ops KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard label="Total Inventory Value" value={`$${stats.totalValue.toLocaleString()}`} icon={ICONS.Finance} colorClass="text-emerald-600 bg-emerald-50" description="FIFO Valuation Applied" />
        <StatCard label="Capital Exposure (Cat A)" value={`$${(stats.catAValue / 1000).toFixed(1)}k`} icon={ICONS.Inventory} colorClass="text-blue-600 bg-blue-50" />
        <StatCard label="Critical Outages" value={stats.criticalStockouts} icon={ICONS.Reports} colorClass="text-rose-600 bg-rose-50" />
        <StatCard label="Pending Authorizations" value={stats.pendingApprovals} icon={ICONS.Checklist} colorClass="text-amber-600 bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Alerts Center */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-sm font-black text-slate-800 tracking-widest uppercase">System Exceptions</h3>
               <span className={`${alerts.length > 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400'} px-3 py-1 rounded-full text-[10px] font-black`}>
                 {alerts.length > 0 ? `${alerts.length} NEW` : 'NO EXCEPTIONS'}
               </span>
             </div>
             <div className="space-y-6">
                {alerts.length === 0 ? (
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest text-center py-10 opacity-30">Clear of any exceptions</p>
                ) : (
                  alerts.map(alert => (
                    <div key={alert.id} className="flex gap-4 group cursor-pointer">
                      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${alert.type === 'CRITICAL' ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'}`}></div>
                      <div>
                        <p className="text-xs font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{alert.message}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{new Date(alert.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))
                )}
             </div>
             {alerts.length > 0 && (
               <button className="w-full mt-10 py-4 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all">Clear All Alerts</button>
             )}
           </div>

           <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-600 p-2 rounded-xl"><ICONS.Procurement className="w-5 h-5"/></div>
                  <h3 className="font-black text-lg tracking-tight">AI Suggested Orders</h3>
                </div>
                <div className="space-y-4 text-sm font-medium text-slate-400">
                  {MOCK_PRODUCTS.length === 0 ? (
                    <p className="text-[10px] italic">Awaiting inventory data for ordering suggestions...</p>
                  ) : (
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-white font-black text-xs">Awaiting Velocity Data</p>
                      <p className="text-[10px] mt-1">Status: Monitoring Consumption</p>
                    </div>
                  )}
                </div>
              </div>
           </div>
        </div>

        {/* Intelligence Hub */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
           <div className="flex items-center justify-between mb-10">
             <div>
               <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Strategic Intelligence Hub</h3>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Global Director Analysis</p>
             </div>
             <button 
                onClick={() => {
                   if (MOCK_PRODUCTS.length > 0) setLoadingAi(true);
                }}
                className="bg-blue-600 text-white p-4 rounded-2xl shadow-xl shadow-blue-200 hover:scale-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={MOCK_PRODUCTS.length === 0}
              >
               <svg className={`w-5 h-5 ${loadingAi ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" /></svg>
             </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="h-[300px]">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Valuation by Top SKU (ABC-Sorted)</p>
                {MOCK_PRODUCTS.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-10">
                     <ICONS.Inventory className="w-16 h-16" />
                     <p className="text-[10px] font-black uppercase mt-4">Registry Empty</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={velocityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="val" radius={[10, 10, 0, 0]}>
                        {velocityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="bg-slate-50 p-8 rounded-[2.5rem] overflow-y-auto max-h-[300px]">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Director Summary</p>
                {loadingAi ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-slate-200 rounded animate-pulse w-5/6"></div>
                  </div>
                ) : (
                  <div className="prose prose-sm font-medium text-slate-600 leading-relaxed">
                    {aiInsight?.split('\n').map((line, i) => <p key={i} className="mb-2">{line}</p>) || "Standing by for director synthesis..."}
                  </div>
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
