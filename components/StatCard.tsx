
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<any>;
  trend?: {
    value: number;
    isUp: boolean;
  };
  colorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, description, icon: Icon, trend, colorClass = 'text-blue-600 bg-blue-50' }) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
          
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-bold ${trend.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
              <svg className={`w-3 h-3 ${!trend.isUp ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {trend.value}% vs last month
            </div>
          )}
          
          {description && <p className="text-slate-400 text-xs mt-2">{description}</p>}
        </div>
        
        <div className={`p-4 rounded-2xl ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
