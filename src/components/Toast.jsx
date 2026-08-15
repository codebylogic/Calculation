import React from 'react';

export default function Toast({ toast }) {
  if (!toast || !toast.visible) return null;

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 z-50 bg-slate-900/95 border border-indigo-500/40 text-white rounded-2xl px-4 py-3 shadow-2xl shadow-indigo-950/80 flex items-center space-x-2.5 text-xs font-semibold backdrop-blur-md animate-fade-in pointer-events-none max-w-sm">
      <span className="text-base">{toast.icon || 'ℹ️'}</span>
      <span className="text-slate-100">{toast.message}</span>
    </div>
  );
}
