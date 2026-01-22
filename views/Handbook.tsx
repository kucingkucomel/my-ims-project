
import React from 'react';

const Handbook: React.FC = () => {
  const sections = [
    {
      title: 'Operational Workflow',
      content: 'All stock movements must be logged at the physical terminal within 5 minutes of physical touch. Use the "Quick Log" tool for standard IN/OUT operations.'
    },
    {
      title: 'Validation & Approvals',
      content: 'Adjustments exceeding $5,000 or 100 units trigger "Review Required" status, demanding dual-authorization from an Administrator.'
    },
    {
      title: 'Logistics Transfers',
      content: 'Inbound transfers must be confirmed via the destination terminal to reconcile virtual and physical inventory counts.'
    },
    {
      title: 'ABC Categorization',
      content: 'System automatically assigns categories: A (Top 20% Value), B (Next 30%), C (Remaining 50%). Category A items require weekly cycle counts.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">System Handbook</h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">Standard Operating Procedures (SOP) for HZIMS Terminal v4.0 Operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, i) => (
          <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="font-black text-lg">{i + 1}</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{section.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">{section.content}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-200">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Emergency Technical Protocol</h4>
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          <div className="text-center">
            <p className="text-2xl font-black text-slate-900">1-800-IMS-SUPPORT</p>
            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Global Hotline</p>
          </div>
          <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
          <div className="text-center">
            <p className="text-2xl font-black text-slate-900">support@hzims.io</p>
            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Technical Tickets</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Handbook;
