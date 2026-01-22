
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ICONS } from '../constants';

interface AuthProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'login' | 'register' | 'forgot' | 'reset' | 'email_sent';

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.WAREHOUSE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authMode === 'login' || authMode === 'register') {
      const simulatedUser: User = {
        id: Math.floor(Math.random() * 1000),
        name: authMode === 'login' ? (email.split('@')[0] || 'User') : name,
        email: email,
        role: authMode === 'login' ? (email.includes('admin') ? UserRole.ADMIN : email.includes('manager') ? UserRole.MANAGER : UserRole.WAREHOUSE) : role,
        isActive: true
      };
      onLogin(simulatedUser);
    } else if (authMode === 'forgot') {
      setAuthMode('email_sent');
    } else if (authMode === 'reset') {
      alert("Password has been successfully updated. Please sign in with your new security key.");
      setAuthMode('login');
    }
  };

  const renderFormContent = () => {
    switch (authMode) {
      case 'forgot':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Recover Security Key</h2>
              <p className="text-slate-500 mt-3 font-medium leading-relaxed">
                Enter your enterprise email address. We will transmit a secure reset link to your primary inbox.
              </p>
            </div>
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 group-focus-within:text-blue-600 transition-colors">Enterprise Email</label>
              <input 
                type="email" 
                required
                placeholder="operator@hzims.com"
                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-5 text-sm font-black text-slate-700 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-slate-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-slate-900 hover:bg-black text-white py-6 rounded-3xl font-black text-lg tracking-tight shadow-2xl shadow-slate-300 transition-all transform hover:-translate-y-1 active:scale-95"
            >
              Transmit Reset Link
            </button>
            <button 
              type="button"
              onClick={() => setAuthMode('login')}
              className="w-full text-center text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
            >
              Return to Session Initialization
            </button>
          </div>
        );

      case 'email_sent':
        return (
          <div className="space-y-10 animate-in fade-in zoom-in duration-500 text-center">
            <div className="mx-auto w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-8 border border-blue-100 shadow-xl shadow-blue-100/50">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Transmission Successful</h2>
              <p className="text-slate-500 mt-4 font-medium leading-relaxed max-w-sm mx-auto">
                Authentication link sent to <span className="text-slate-900 font-bold">{email}</span>. Link expires in 15 minutes.
              </p>
            </div>
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Internal Simulation Mode</p>
              <button 
                type="button"
                onClick={() => setAuthMode('reset')}
                className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline"
              >
                [ Simulate Email Link Click ]
              </button>
            </div>
            <button 
              type="button"
              onClick={() => setAuthMode('login')}
              className="w-full text-center text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        );

      case 'reset':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Reset Security Key</h2>
              <p className="text-slate-500 mt-3 font-medium leading-relaxed">
                Define a new high-entropy security key for terminal <span className="text-slate-900 font-bold">{email}</span>.
              </p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 group-focus-within:text-blue-600 transition-colors">New Security Key</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-5 text-sm font-black text-slate-700 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 group-focus-within:text-blue-600 transition-colors">Confirm New Key</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-5 text-sm font-black text-slate-700 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={password !== confirmPassword || !password}
              className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-200 text-white py-6 rounded-3xl font-black text-lg tracking-tight shadow-2xl shadow-slate-300 transition-all transform hover:-translate-y-1 active:scale-95"
            >
              Update Security Key
            </button>
          </div>
        );

      default: // LOGIN & REGISTER
        const isLogin = authMode === 'login';
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {isLogin ? 'Initialize Session' : 'Create Operator Account'}
              </h2>
              <p className="text-slate-500 mt-3 font-medium leading-relaxed">
                Authorized access required for secure terminal operations.
              </p>
            </div>

            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-10">
              <button 
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-4 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-4 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${!isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Register
              </button>
            </div>

            <div className="space-y-8">
              {!isLogin && (
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 group-focus-within:text-blue-600 transition-colors">Operator Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., John Smith"
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-5 text-sm font-black text-slate-700 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-slate-300"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 group-focus-within:text-blue-600 transition-colors">Enterprise Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="operator@hzims.com"
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-5 text-sm font-black text-slate-700 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-slate-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2 group">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-focus-within:text-blue-600 transition-colors">Security Key</label>
                  {isLogin && <button type="button" onClick={() => setAuthMode('forgot')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Reset Key</button>}
                </div>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-5 text-sm font-black text-slate-700 focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-slate-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {!isLogin && (
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Clearance Level</label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: UserRole.WAREHOUSE, label: 'Standard Operator', desc: 'Stock In/Out & Relocation' },
                      { id: UserRole.MANAGER, label: 'Logistics Manager', desc: 'Approvals & Advanced Analytics' },
                      { id: UserRole.ADMIN, label: 'System Admin', desc: 'Full System & Audit Control' }
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id)}
                        className={`flex flex-col text-left p-5 rounded-2xl border-2 transition-all relative ${role === r.id ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                      >
                        <span className={`text-sm font-black ${role === r.id ? 'text-blue-600' : 'text-slate-700'}`}>{r.label}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">{r.desc}</span>
                        {role === r.id && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center"><svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M5 13l4 4L19 7" /></svg></div>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-slate-900 hover:bg-black text-white py-6 rounded-3xl font-black text-lg tracking-tight shadow-2xl shadow-slate-300 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
              >
                <span>{isLogin ? 'Initialize System Access' : 'Register Operator Profile'}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>

            {isLogin && (
              <div className="mt-12 p-6 bg-blue-50 rounded-3xl border border-blue-100">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Internal Access Note</p>
                <p className="text-xs text-blue-800 font-medium leading-relaxed">
                  Admins: Use <span className="font-black">admin@hzims.com</span>. 
                  Managers: Use <span className="font-black">manager@hzims.com</span>. 
                  Operators: Use <span className="font-black">wh@hzims.com</span>.
                </p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Pane: Immersive Visual (Hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 p-20 flex-col justify-between relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
            <circle cx="20" cy="20" r="30" fill="blue" filter="blur(60px)" opacity="0.4" />
            <circle cx="80" cy="80" r="30" fill="indigo" filter="blur(60px)" opacity="0.4" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 text-white mb-12">
            <div className="bg-blue-600 p-4 rounded-3xl shadow-2xl shadow-blue-900/50">
              <ICONS.Inventory className="w-8 h-8" />
            </div>
            <div>
              <span className="text-4xl font-black tracking-tighter leading-none block">HZ<span className="text-blue-500">IMS</span></span>
              <span className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Enterprise Operations</span>
            </div>
          </div>

          <div className="max-w-md mt-24">
            <h2 className="text-5xl font-black text-white tracking-tighter leading-[1.1] mb-8">
              Strategic Control Over Global Supply Chains.
            </h2>
            <p className="text-xl text-slate-400 font-medium leading-relaxed">
              Experience the next generation of inventory intelligence with real-time analytics, AI insights, and production-hardened security.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-8 border-t border-white/10 pt-10">
           <div className="space-y-1">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Status</p>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <p className="text-xs font-bold text-white uppercase tracking-tighter">Terminals Operational</p>
             </div>
           </div>
           <div className="space-y-1 border-l border-white/10 pl-8">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Version</p>
             <p className="text-xs font-bold text-white">4.0.2 Stable Production</p>
           </div>
        </div>
      </div>

      {/* Right Pane: Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
        <div className="w-full max-w-md">
          {/* Mobile Logo Only */}
          <div className="lg:hidden flex flex-col items-center mb-12">
            <div className="bg-blue-600 p-4 rounded-3xl shadow-lg shadow-blue-200 mb-6">
              <ICONS.Inventory className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">HZIMS</h1>
          </div>

          <form onSubmit={handleSubmit}>
            {renderFormContent()}
          </form>
          
          <p className="mt-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
            © 2025 HZIMS GLOBAL • ALL TERMINALS SECURED
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;