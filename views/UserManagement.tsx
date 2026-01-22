
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { MOCK_WAREHOUSES } from '../constants';

const INITIAL_USERS: User[] = [
  { id: 1, name: 'System Admin', email: 'admin@hzims.com', role: UserRole.ADMIN, isActive: true, department: 'IT Infrastructure', lastLogin: new Date().toISOString() },
  { id: 2, name: 'Logistics Manager', email: 'manager@hzims.com', role: UserRole.MANAGER, isActive: true, department: 'Operations', lastLogin: new Date().toISOString() },
  { id: 3, name: 'Standard Operator', email: 'wh@hzims.com', role: UserRole.WAREHOUSE, isActive: true, department: 'Warehouse A', lastLogin: new Date().toISOString(), assignedWarehouseId: 1 },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: UserRole.WAREHOUSE,
    department: '',
    assignedWarehouseId: ''
  });

  const currentUserEmail = 'admin@hzims.com'; // In a real app, get from auth context

  const toggleUserStatus = (id: number) => {
    const target = users.find(u => u.id === id);
    if (target?.email === currentUserEmail) {
      alert("Critical Lock: Administrators cannot suspend their own operational access.");
      return;
    }
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
  };

  const updateRole = (id: number, role: UserRole) => {
    const target = users.find(u => u.id === id);
    if (target?.email === currentUserEmail && role !== UserRole.ADMIN) {
      alert("Security Violation: You cannot demote your own Administrative Clearance.");
      return;
    }
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.max(...users.map(u => u.id)) + 1;
    const addedUser: User = {
      ...newUser,
      id,
      isActive: true,
      lastLogin: undefined,
      assignedWarehouseId: newUser.assignedWarehouseId ? Number(newUser.assignedWarehouseId) : undefined,
    };
    setUsers(prev => [addedUser, ...prev]);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', role: UserRole.WAREHOUSE, department: '', assignedWarehouseId: '' });
  };

  const resetPassword = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, forcePasswordReset: true } : u));
    alert("System signal transmitted. User will be forced to rotate security keys upon next initialization.");
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Identity & Access</h2>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-3">Governance Control • User Provisioning</p>
        </div>
        <div className="flex gap-4">
          <input 
            type="text"
            placeholder="Search Operators..."
            className="bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 focus:ring-4 focus:ring-blue-50 outline-none transition-all w-80 shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-blue-200"
          >
            Provision User
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                <th className="px-10 py-8">Identity Profile</th>
                <th className="px-10 py-8">Department / Hub</th>
                <th className="px-10 py-8 text-center">Clearance Level</th>
                <th className="px-10 py-8">Status</th>
                <th className="px-10 py-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map(u => (
                <tr key={u.id} className="group hover:bg-slate-50/80 transition-all">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-sm font-black ring-4 ring-slate-100 shadow-lg">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{u.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <p className="text-sm font-black text-slate-700">{u.department || 'Unassigned'}</p>
                    {u.assignedWarehouseId && (
                      <p className="text-[10px] text-blue-600 font-black uppercase mt-1">
                        Hub: {MOCK_WAREHOUSES.find(w => w.id === u.assignedWarehouseId)?.name}
                      </p>
                    )}
                  </td>
                  <td className="px-10 py-8 text-center">
                    <select 
                      className="bg-slate-100 border-none rounded-xl px-4 py-2 text-[10px] font-black text-slate-600 uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-200"
                      value={u.role}
                      onChange={(e) => updateRole(u.id, e.target.value as UserRole)}
                    >
                      {Object.values(UserRole).map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${u.isActive ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#ef4444]'}`}></div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${u.isActive ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {u.isActive ? 'Authorized' : 'Suspended'}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => resetPassword(u.id)}
                        className="p-3 rounded-xl bg-slate-100 text-slate-400 hover:bg-amber-100 hover:text-amber-600 transition-all"
                        title="Force Password Reset"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                      </button>
                      <button 
                        onClick={() => toggleUserStatus(u.id)}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          u.isActive ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                        }`}
                      >
                        {u.isActive ? 'Suspend' : 'Restore'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4">
          <div className="bg-white rounded-[3.5rem] w-full max-w-xl shadow-2xl animate-in zoom-in duration-500">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Provision New User</h3>
              <button onClick={() => setShowAddModal(false)} className="bg-slate-100 p-4 rounded-2xl hover:bg-slate-200 transition-all">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Full Name</label>
                  <input 
                    type="text" required
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none"
                    value={newUser.name}
                    onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Email Address</label>
                  <input 
                    type="email" required
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none"
                    value={newUser.email}
                    onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Clearance Level</label>
                  <select 
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none"
                    value={newUser.role}
                    onChange={e => setNewUser(p => ({ ...p, role: e.target.value as UserRole }))}
                  >
                    {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Department</label>
                  <input 
                    type="text" required
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none"
                    value={newUser.department}
                    onChange={e => setNewUser(p => ({ ...p, department: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Assigned Hub Terminal</label>
                <select 
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none"
                  value={newUser.assignedWarehouseId}
                  onChange={e => setNewUser(p => ({ ...p, assignedWarehouseId: e.target.value }))}
                >
                  <option value="">-- No Assignment --</option>
                  {MOCK_WAREHOUSES.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <button 
                type="submit"
                className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all mt-4"
              >
                Execute Provisioning
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
