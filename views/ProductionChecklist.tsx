
import React from 'react';

const ProductionChecklist: React.FC = () => {
  const categories = [
    {
      title: 'Performance Optimization',
      items: [
        { label: 'Asset Compression', desc: 'Enable Brotli/Gzip compression on production servers.', done: true },
        { label: 'Image Lazy Loading', desc: 'Implemented for dashboard avatars and product imagery.', done: true },
        { label: 'Code Splitting', desc: 'Use React.lazy() for route-level chunking.', done: false },
        { label: 'Debounced Search', desc: 'Applied to Inventory and Audit log filters to reduce renders.', done: true },
        { label: 'Virtualized Lists', desc: 'Required for tables exceeding 500 rows to maintain smooth FPS.', done: false }
      ]
    },
    {
      title: 'Production Hardening',
      items: [
        { label: 'Secure Cookies', desc: 'Set HttpOnly, Secure, and SameSite=Strict on all auth cookies.', done: true },
        { label: 'Rate Limiting', desc: 'Prevent brute-force on API routes (Max 5 attempts/15min).', done: true },
        { label: 'CSRF Protection', desc: 'Enforced via Double Submit Cookie or Header Verification.', done: true },
        { label: 'Content Security Policy', desc: 'Whitelisted scripts for Google Fonts, Leaflet, and Gemini API.', done: false },
        { label: 'XSS Sanitization', desc: 'Automatic React escaping handles 99% of UI injections.', done: true }
      ]
    },
    {
      title: 'UX & Accessibility',
      items: [
        { label: 'Responsive Viewports', desc: 'Mobile-first styling using Tailwind breakpoints.', done: true },
        { label: 'Empty State Feedback', desc: 'No data graphics for empty warehouses or log searches.', done: true },
        { label: 'Skeleton Loaders', desc: 'Smooth AI insight transitions during async fetches.', done: true },
        { label: 'Color Contrast', desc: 'Ensured 4.5:1 ratio for all critical UI text.', done: true }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-extrabold text-slate-900">Deployment & Hardening</h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">Maintain system integrity by ensuring all production standards are met before final release.</p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {categories.map((cat, i) => (
          <section key={i} className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm">{i + 1}</span>
              {cat.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cat.items.map((item, j) => (
                <div key={j} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4">
                  <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center ${item.done ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {item.done ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">{item.label}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="bg-blue-600 text-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-200 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">Ready for Mainframe Deployment?</h3>
            <p className="text-blue-100 max-w-md">Nexus IMS v2.4 includes all core optimizations required for high-frequency logistic centers.</p>
          </div>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20">
            Export Deployment Plan
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>
    </div>
  );
};

export default ProductionChecklist;
