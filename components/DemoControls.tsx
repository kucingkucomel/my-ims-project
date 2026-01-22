
import React from 'react';
import { User, UserRole } from '../types';

interface DemoControlsProps {
  onSwitchUser: (user: User) => void;
  currentUser: User;
}

const DemoControls: React.FC<DemoControlsProps> = ({ onSwitchUser, currentUser }) => {
  const demoUsers: User[] = [
    { id: 1, name: 'Root Admin', email: 'admin@hzims.com', role: UserRole.ADMIN, isActive: true },
    { id: 2, name: 'Ops Manager', email: 'manager@hzims.com', role: UserRole.MANAGER, isActive: true },
    { id: 3, name: 'Floor Staff', email: 'wh@hzims.com', role: UserRole.WAREHOUSE, isActive: true, assignedWarehouseId: 1 },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[100] group">
      <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-2xl border border-white/10 flex items-center gap-4 transition-all group-hover:pr-8">
        <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center animate-pulse">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <div className="hidden group-hover:block animate-in fade-in slide-in-from-right-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Live Demo Controller</p>
          <div className="flex gap-2">
            {demoUsers.map(user => (
              <button
                key={user.id}
                onClick={() => onSwitchUser(user)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                  currentUser.role === user.role ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {user.role}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoControls;
