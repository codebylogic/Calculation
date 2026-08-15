import React from 'react';
import { RotateCcw, Zap, ArrowRight, Plus, Minus } from 'lucide-react';
import { categories } from '../data/categories';

export default function CustomizeView({ selectedCounts, onUpdateCount, onResetCounts, onPresetQuick, onProceed }) {
  const totalSelected = Object.values(selectedCounts).reduce((a, b) => a + (b || 0), 0);

  return (
    <section className="space-y-6 animate-fade-in max-w-4xl mx-auto py-2">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Customize Your Test Set</h2>
          <p className="text-xs text-slate-400">
            Select the question count for each mathematical category you want in your test rotation.
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onResetCounts}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={onPresetQuick}
            className="px-3 py-1.5 text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-300 hover:bg-indigo-500/20 transition flex items-center space-x-1"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Preset (5 Each)</span>
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {categories.map((cat) => {
          const count = selectedCounts[cat.name] || 0;
          return (
            <div
              key={cat.id}
              className={`p-4 rounded-2xl border transition flex items-center justify-between ${
                count > 0
                  ? 'bg-slate-900/70 border-indigo-500/40 shadow-sm'
                  : 'bg-slate-900/30 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1 pr-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-100">{cat.name}</h3>
                <p className="text-[11px] text-slate-400 leading-snug">{cat.desc}</p>
              </div>

              <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => onUpdateCount(cat.name, Math.max(0, count - 1))}
                  className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold text-xs transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center font-bold text-xs text-indigo-400 font-mono">
                  {count}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateCount(cat.name, Math.min(50, count + 1))}
                  className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold text-xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Proceed bar */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-900">
        <div className="text-xs text-slate-400">
          Selected: <span className="font-bold text-indigo-400 font-mono text-sm">{totalSelected}</span> Questions
        </div>
        <button
          onClick={onProceed}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition shadow-lg shadow-indigo-600/25 flex items-center space-x-2 cursor-pointer"
        >
          <span>Proceed to Overview</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
