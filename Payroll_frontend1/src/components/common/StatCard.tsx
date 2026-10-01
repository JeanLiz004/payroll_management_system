import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  variant?: 'default' | 'success';
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, variant = 'default' }) => {
  const isSuccess = variant === 'success';

  return (
    <div
      className={`p-5 rounded-lg border shadow-sm transition-all ${
        isSuccess ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'
      }`}
    >
      <span
        className={`text-xs font-semibold uppercase tracking-wider ${
          isSuccess ? 'text-emerald-700' : 'text-slate-500'
        }`}
      >
        {label}
      </span>
      <h2
        className={`mt-2 text-2xl font-bold ${
          isSuccess ? 'text-emerald-800' : 'text-slate-900'
        }`}
      >
        {value}
      </h2>
    </div>
  );
};