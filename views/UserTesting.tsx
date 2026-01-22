
import React from 'react';
import { ICONS, MOCK_PRODUCTS } from '../constants';
import { MovementType, UserRole } from '../types';

interface UserTestingProps {
  onExecuteScenario: (id: string) => void;
  isResetting: boolean;
}

const UserTesting: React.FC<UserTestingProps> = ({ onExecuteScenario, isResetting }) => {
  const scenarios = [
    {
      id: 'sc1',
      title: 'Atomic Transfer Verification',
      role: 'Manager / Staff',
      description: 'Test the end-to-end logistics relocation flow.',
      steps: [
        'Switch to "Floor Staff" role',
        'Request 20 units of CPU to Industrial Center',
        'Switch to "Ops Manager" and Approve',
        'Verify balanced TRANSFER_IN/OUT logs'
      ],
      impact: 'Prevents quantity mismatches during transit.'
    },
    {
      id: 'sc2',
      title: 'High-Value Guardrails',
      role: 'Staff',
      description: 'Test the system automatic escalation triggers.',
      steps: [
        'Attempt a correction for 500+ units',
        'Notice "REVIEW_REQUIRED" escalation',
        'Attempt to submit negative stock OUT',
        'Observe "Inventory Violation" block'
      ],
      impact: 'Prevents massive inventory leakage or fraud.'
    },
    {
      id: 'sc3',
      title: 'Identity Governance',
      role: 'Admin',
      description: 'Test administrative self-protection and user control.',
      steps: [
        'Navigate to "User Directory"',
        'Try to suspend your own Root Admin account',
        'Observe the "Critical Lock" enforcement',
        'Provision a new warehouse operator'
      ],
      impact: 'Ensures system availability for authorized leads.'
    }
  ];

  return (
    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      <div className="bg-slate-900 p-16 rounded-[4rem] text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-8 inline-block border border-emerald-500/30">
            Interactive Live Simulation Mode
          </div>
          <h2 className="text-5xl font-black tracking-tighter mb-6">User Acceptance Testing (UAT)</h2>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            This environment is a <span className="text-white font-bold underline decoration-blue-500 underline-offset-4">fully functional live demo</span>. 
            All logic, validations, and AI integrations are active. Data is persisted in your local session.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button 
              onClick={() => onExecuteScenario('reset')}
              className="bg-rose-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-900/40 hover:bg-rose-700 transition-all flex items-center gap-3"
            >
              <svg className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357-2H15" /></svg>
              Wipe & Reset Terminal Data
            </button>
            <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-300">
              Build v4.0.2-ALPHA • STABLE
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 right-12 opacity-10">
          <ICONS.Checklist className="w-64 h-64 transform rotate-12" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {scenarios.map((sc, i) => (
          <div key={sc.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl flex flex-col h-full group hover:border-blue-200 transition-all">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Scenario 0{i+1}</span>
              <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">{sc.role}</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">{sc.title}</h3>
            <p className="text-xs text-slate-400 font-medium mb-6 uppercase tracking-tight">{sc.description}</p>
            
            <div className="space-y-4 flex-1">
              {sc.steps.map((step, si) => (
                <div key={si} className="flex gap-4">
                  <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-black text-slate-400">{si + 1}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 leading-tight">{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 space-y-4">
               <button 
                 onClick={() => onExecuteScenario(sc.id)}
                 className="w-full bg-blue-50 text-blue-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
               >
                 Initialize Scenario {i+1}
               </button>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Success Metric</p>
                  <p className="text-xs font-bold text-slate-800 italic">"{sc.impact}"</p>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-12 bg-white rounded-[3.5rem] border border-slate-100 shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/3">
             <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 text-center">
                <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3">Direct Virtual Terminal Access</p>
                <div className="text-[10px] font-black text-blue-800 break-all bg-white p-4 rounded-xl border border-blue-100 shadow-inner flex flex-col gap-2">
                  <span>Terminal ID: <span className="text-slate-900">HZ-KL-004</span></span>
                  <span>Encryption: <span className="text-emerald-600 uppercase tracking-widest text-[9px]">AES-256-GCM</span></span>
                </div>
                <button className="w-full mt-4 py-3 bg-white text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-all">
                  Copy Diagnostic Link
                </button>
             </div>
          </div>
          <div className="md:w-2/3 space-y-4">
             <h4 className="text-2xl font-black text-slate-900 tracking-tight">Enterprise Feedback Loop</h4>
             <p className="text-slate-500 font-medium leading-relaxed">
               The previous placeholder URL was for internal network documentation simulation. <span className="text-blue-600 font-bold">This current page is your active testing environment.</span> All "Initializations" above will automatically create pending requests and movements for you to authorize.
             </p>
             <div className="flex gap-8 pt-4">
                <div className="text-center">
                  <p className="text-xl font-black text-slate-900">100%</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Client Side Simulation</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-slate-900">0.02s</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Logic Latency</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-slate-900">No URL</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Standalone Build</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTesting;
