
import React from 'react';
import { Warehouse } from '../types';
// Added ICONS to the import list to fix the undefined reference error
import { MOCK_WAREHOUSES, COLORS, ICONS } from '../constants';

interface MapProps {
  onSelect: (w: Warehouse) => void;
  selectedId?: number;
}

const WarehouseMap: React.FC<MapProps> = ({ onSelect, selectedId }) => {
  /**
   * FIXED COORDINATE MAPPING
   * Peninsular Malaysia Range:
   * Longitude: 100.0 (West) to 104.5 (East)
   * Latitude: 7.0 (North) to 1.0 (South)
   */
  const mapLon = (lon: number) => {
    // Maps 100.0 - 104.5 to 0% - 100%
    return ((lon - 100) / (104.5 - 100)) * 100;
  };
  const mapLat = (lat: number) => {
    // Maps 7.0 - 1.0 to 0% - 100% (Flipped: 7 is top, 1 is bottom)
    return ((7 - lat) / (7 - 1)) * 100;
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Operational Hub Registry</h2>
          <p className="text-slate-500 text-sm">Select a Peninsular Malaysia distribution hub to initialize terminal access.</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
           <div className="flex items-center gap-1.5">
             <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
             <span>Active Hub</span>
           </div>
           <div className="flex items-center gap-1.5">
             <div className="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-300"></div>
             <span>Region Out of Scope</span>
           </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Fixed Aspect Ratio Map Container to prevent drift when resizing/zooming */}
        <div className="relative bg-slate-100 rounded-[3rem] border-4 border-white shadow-inner overflow-hidden flex items-center justify-center p-8 aspect-[3/4] max-h-[700px] mx-auto w-full lg:max-w-md">
           {/* Background Schematic aligned with Malaysia's geography */}
           <div className="absolute inset-0 opacity-20 pointer-events-none p-12">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 {/* Simplified Peninsular Malaysia Shape matching the 0-100 coordinate grid */}
                 <path 
                    d="M 25,5 
                       L 55,10 
                       L 75,25 
                       L 85,45 
                       L 80,75 
                       L 75,95 
                       L 65,98 
                       L 45,85 
                       L 25,65 
                       L 15,45 
                       L 10,25 
                       Z" 
                    stroke="#94a3b8" 
                    strokeWidth="0.5" 
                    fill="none" 
                    strokeDasharray="2,2"
                 />
                 {/* Visual Grid for alignment */}
                 <line x1="50" y1="0" x2="50" y2="100" stroke="#cbd5e1" strokeWidth="0.1" />
                 <line x1="0" y1="50" x2="100" y2="50" stroke="#cbd5e1" strokeWidth="0.1" />
              </svg>
           </div>
           
           {/* Interactive Map Layer */}
           <div className="relative w-full h-full">
             {MOCK_WAREHOUSES.map((wh) => (
               <button
                key={wh.id}
                onClick={() => onSelect(wh)}
                className={`absolute group flex items-center gap-3 transition-all transform hover:scale-110 -translate-x-1/2 -translate-y-1/2 ${
                  selectedId === wh.id ? 'z-20 scale-110' : 'z-10'
                }`}
                style={{ 
                  left: `${mapLon(wh.longitude)}%`, 
                  top: `${mapLat(wh.latitude)}%` 
                }}
               >
                 <div className="relative">
                    <div className={`w-10 h-10 rounded-full border-4 border-white shadow-xl transition-all flex items-center justify-center ${
                      selectedId === wh.id ? 'bg-blue-600 scale-110' : 'bg-slate-400 group-hover:bg-blue-500'
                    }`}>
                       <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                    </div>
                    {/* All three warehouses have the active ping effect */}
                    <div className={`absolute inset-0 rounded-full animate-ping opacity-40 ${selectedId === wh.id ? 'bg-blue-600' : 'bg-slate-500'}`}></div>
                    <div className={`absolute -inset-2 rounded-full animate-pulse opacity-10 ${selectedId === wh.id ? 'bg-blue-400' : 'bg-slate-300'}`}></div>
                 </div>
                 
                 {/* Tooltip on Hover */}
                 <div className={`bg-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity absolute left-12 whitespace-nowrap z-50 ${
                   selectedId === wh.id ? 'opacity-100 border-blue-200' : ''
                 }`}>
                   <p className="text-xs font-black text-slate-800 leading-none">{wh.name}</p>
                   <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{wh.address}</p>
                 </div>
               </button>
             ))}
             
             {/* Labels for Regions */}
             <div className="absolute top-0 right-0 p-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] flex flex-col items-end">
                <span>Northern Corridor</span>
                <span className="mt-20">Central Industrial Zone</span>
                <span className="mt-auto pb-10">Southern Gateway</span>
             </div>
           </div>
        </div>

        {/* Directory Listing */}
        <div className="space-y-4 overflow-y-auto max-h-[700px] pr-2 scrollbar-thin">
          <div className="flex items-center justify-between px-4 mb-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connected Terminals</h3>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">System v4.0 Online</span>
          </div>
          {MOCK_WAREHOUSES.map(wh => (
            <div 
              key={wh.id}
              onClick={() => onSelect(wh)}
              className={`p-6 rounded-[2.5rem] cursor-pointer border-2 transition-all group relative overflow-hidden ${
                selectedId === wh.id 
                ? 'bg-blue-50 border-blue-200 shadow-blue-100 shadow-lg' 
                : 'bg-white border-transparent hover:border-slate-100 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-5">
                  <div className={`p-4 rounded-[1.25rem] transition-all transform group-hover:rotate-3 ${selectedId === wh.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                    {wh.id === 1 ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 tracking-tight text-lg leading-tight">{wh.name}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-tight">{wh.address}</p>
                  </div>
                </div>
                {selectedId === wh.id ? (
                  <div className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg shadow-emerald-100">
                    Live
                  </div>
                ) : (
                  <svg className="w-5 h-5 text-slate-300 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                )}
              </div>
              {selectedId === wh.id && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16"></div>
              )}
            </div>
          ))}
          
          <div className="mt-8 p-8 bg-slate-900 rounded-[2.5rem] text-white overflow-hidden relative group">
             <div className="relative z-10">
                <h4 className="text-sm font-black uppercase tracking-widest mb-2">Network Health</h4>
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[10px] font-bold text-slate-400">All Nodes Functional • 100% Up</span>
                </div>
             </div>
             <div className="absolute top-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
                {/* Fixed: ICONS is now correctly imported and accessible here */}
                <ICONS.Warehouse className="w-24 h-24 transform translate-x-4 -translate-y-4" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseMap;
