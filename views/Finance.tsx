
import React, { useMemo } from 'react';
import { StockMovement, Product, MovementStatus, MovementType } from '../types';
import { ICONS } from '../constants';
import StatCard from '../components/StatCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface FinanceProps {
  movements: StockMovement[];
  products: Product[];
}

const Finance: React.FC<FinanceProps> = ({ movements, products }) => {
  // 1. Calculate Valuation Data for the Chart
  const valuationData = useMemo(() => {
    if (products.length === 0) return [];
    return products.map(p => ({
      name: p.name,
      value: p.currentStock * p.unitCost,
      color: p.abcCategory === 'A' ? '#2563eb' : '#64748b'
    })).sort((a,b) => b.value - a.value);
  }, [products]);

  // 2. Dynamic Metric Calculations
  const metrics = useMemo(() => {
    const totalVal = products.reduce((acc, p) => acc + (p.currentStock * p.unitCost), 0);
    
    // WIP: Value of stock currently in transit or pending receipt
    const wipVal = movements
      .filter(m => 
        (m.status === MovementStatus.PENDING || m.status === MovementStatus.IN_TRANSIT) && 
        (m.type === MovementType.IN || m.type === MovementType.TRANSFER_IN || m.type === MovementType.PURCHASE)
      )
      .reduce((acc, m) => acc + (m.quantity * m.unitCost), 0);

    // Average Unit Cost across the catalog
    const avgCost = products.length > 0 
      ? products.reduce((acc, p) => acc + p.unitCost, 0) / products.length 
      : 0;

    const catA = products
      .filter(p => p.abcCategory === 'A')
      .reduce((acc, p) => acc + (p.currentStock * p.unitCost), 0);

    const catB = products
      .filter(p => p.abcCategory === 'B')
      .reduce((acc, p) => acc + (p.currentStock * p.unitCost), 0);

    return { totalVal, wipVal, avgCost, catA, catB };
  }, [products, movements]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         <StatCard label="GL Closing Value" value={`$${metrics.totalVal.toLocaleString()}`} icon={ICONS.Finance} colorClass="text-emerald-600 bg-emerald-50" />
         <StatCard label="WIP Inbound Value" value={`$${metrics.wipVal.toLocaleString()}`} icon={ICONS.Transfer} colorClass="text-blue-600 bg-blue-50" />
         <StatCard label="Average Unit Cost" value={`$${metrics.avgCost.toFixed(2)}`} icon={ICONS.Inventory} colorClass="text-slate-600 bg-slate-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl">
           <h3 className="text-sm font-black text-slate-800 tracking-widest uppercase mb-10">Capital Allocation</h3>
           <div className="h-[250px]">
             {products.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                 <ICONS.Finance className="w-12 h-12 mb-4" />
                 <p className="text-[10px] font-black uppercase tracking-widest">No Asset Data</p>
               </div>
             ) : (
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie data={valuationData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                     {valuationData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                   </Pie>
                   <Tooltip />
                 </PieChart>
               </ResponsiveContainer>
             )}
           </div>
           <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-black text-blue-600 uppercase tracking-tighter">Category A Assets</span>
                <span className="font-black text-slate-900">${metrics.catA.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-black text-slate-400 uppercase tracking-tighter">Category B Assets</span>
                <span className="font-black text-slate-900">${metrics.catB.toLocaleString()}</span>
              </div>
           </div>
        </div>

        <div className="lg:col-span-8 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl">
           <h3 className="text-sm font-black text-slate-800 tracking-widest uppercase mb-10">FIFO Asset Registry</h3>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                   <th className="pb-6">Commodity</th>
                   <th className="pb-6">Unit Cost</th>
                   <th className="pb-6">Qty OH</th>
                   <th className="pb-6 text-right">Total Valuation</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {products.length === 0 ? (
                   <tr>
                     <td colSpan={4} className="py-20 text-center text-slate-300 font-black uppercase tracking-[0.2em] text-xs">Registry Standby: Awaiting Data Entry</td>
                   </tr>
                 ) : (
                   products.map(p => (
                     <tr key={p.id} className="group hover:bg-slate-50 transition-colors">
                       <td className="py-6">
                         <p className="text-sm font-black text-slate-800">{p.name}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{p.sku}</p>
                       </td>
                       <td className="py-6 font-mono text-xs font-black text-slate-500">${p.unitCost.toFixed(2)}</td>
                       <td className="py-6 font-black text-slate-900">{p.currentStock}</td>
                       <td className="py-6 text-right font-mono text-sm font-black text-blue-600">${(p.currentStock * p.unitCost).toLocaleString()}</td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;
