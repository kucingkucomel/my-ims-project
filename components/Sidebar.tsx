
import React from 'react';
import { User, Warehouse, UserRole } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
  warehouse: Warehouse | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, warehouse, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Command Center', icon: ICONS.Dashboard, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.WAREHOUSE] },
    { id: 'inventory', label: 'Inventory Hub', icon: ICONS.Inventory, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.WAREHOUSE] },
    { id: 'transfers', label: 'Logistics Transfer', icon: ICONS.Transfer, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.WAREHOUSE] },
    { id: 'procurement', label: 'Sourcing PR', icon: ICONS.Procurement, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.WAREHOUSE] },
    { id: 'approvals', label: 'Authorization', icon: ICONS.Checklist, roles: [UserRole.MANAGER, UserRole.ADMIN] },
    { id: 'finance', label: 'Costing & Valuation', icon: ICONS.Finance, roles: [UserRole.MANAGER, UserRole.ADMIN] },
    { id: 'audit', label: 'Audit Chain', icon: ICONS.Audit, roles: [UserRole.ADMIN, UserRole.MANAGER] },
    { id: 'users', label: 'User Directory', icon: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>, roles: [UserRole.ADMIN] },
    { id: 'map', label: 'Hub Registry', icon: ICONS.Warehouse, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.WAREHOUSE] },
    { id: 'testing', label: 'User Testing', icon: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.WAREHOUSE] },
    { id: 'handbook', label: 'Documentation', icon: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.WAREHOUSE] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <aside className="w-72 bg-slate-950 flex flex-col h-full border-r border-slate-800">
      <div className="p-10 flex-1 overflow-y-auto scrollbar-none">
        <div className="flex items-center gap-4 text-white mb-12 px-2">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-2xl shadow-blue-900/40 transform rotate-3">
            <ICONS.Inventory className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tighter leading-none block">HZ<span className="text-blue-500">IMS</span></span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Enterprise v4.0</span>
          </div>
        </div>

        <nav className="space-y-2">
          {filteredItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-500 group relative overflow-hidden ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-2xl shadow-blue-900/40 translate-x-2' 
                : 'text-slate-500 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-500 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
              {activeTab === item.id && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white opacity-20"></div>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-10 space-y-6">
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-[2rem] shadow-inner">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Terminal</span>
            <div className={`w-2 h-2 rounded-full ${warehouse ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]' : 'bg-slate-600'}`}></div>
          </div>
          <p className="text-slate-100 text-sm font-black truncate leading-tight">
            {warehouse ? warehouse.name : 'Satellite Standby'}
          </p>
          <p className="text-[10px] text-slate-500 font-bold mt-1">Region: {warehouse ? warehouse.address.split(',')[1] : 'Central'}</p>
        </div>

        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-600 hover:bg-rose-500/10 hover:text-rose-500 transition-all font-black text-xs uppercase tracking-widest"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Exit System
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
