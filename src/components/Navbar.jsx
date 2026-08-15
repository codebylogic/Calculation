import React from 'react';
import { Calculator, Settings, Volume2, Shield } from 'lucide-react';

export default function Navbar({ currentView, onNavigate, currentUser, onOpenSettings }) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center space-x-3 cursor-pointer group select-none"
        >
          <div className="bg-gradient-to-tr from-indigo-500 to-indigo-700 p-2 rounded-xl shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                CALCU-VOICE
              </h1>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold uppercase tracking-wider">
                Vocal Math
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Interactive Speech Arithmetic</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {currentUser && (
            <button
              onClick={onOpenSettings}
              className="p-2 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-indigo-400 rounded-xl transition flex items-center shadow-sm"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
