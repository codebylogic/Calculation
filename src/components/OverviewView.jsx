import React from 'react';
import { Play, ArrowLeft, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { categories } from '../data/categories';

export default function OverviewView({ selectedCounts, appSettings, onBack, onStartTest }) {
  const activeItems = categories
    .map(cat => {
      const count = selectedCounts[cat.name] || 0;
      const timePerQ = appSettings.categoryTimes[cat.name] || 15;
      const isTimerOn = appSettings.globalTimer && appSettings.countdownEnabled[cat.name];
      const totalTimeSec = isTimerOn ? timePerQ * count : 0;
      return {
        ...cat,
        count,
        timePerQ,
        isTimerOn,
        totalTimeSec
      };
    })
    .filter(item => item.count > 0);

  const totalQuestions = activeItems.reduce((acc, curr) => acc + curr.count, 0);
  const totalDurationSec = activeItems.reduce((acc, curr) => acc + curr.totalTimeSec, 0);

  return (
    <section className="space-y-6 animate-fade-in max-w-2xl mx-auto py-2">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-black text-white">Test Rotation Overview</h2>
        <p className="text-xs text-slate-400">
          Review your customized test parameters and timers before starting.
        </p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="divide-y divide-slate-800/80">
          {activeItems.map((item) => (
            <div key={item.id} className="py-3 flex justify-between items-center text-xs">
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-200">{item.name}</span>
                <span className="text-slate-400 block text-[11px]">
                  {item.count} question{item.count > 1 ? 's' : ''}
                </span>
              </div>
              <span className="font-mono font-medium text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                {item.isTimerOn ? `${item.totalTimeSec}s limit` : 'No timer limit'}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-200">
            <span>Total Question Volume:</span>
            <span className="text-indigo-400 font-mono text-sm">{totalQuestions} Questions</span>
          </div>
          <div className="flex justify-between text-xs font-bold text-slate-200">
            <span>Estimated Max Duration:</span>
            <span className="text-indigo-400 font-mono text-sm">
              {totalDurationSec > 0 ? `${totalDurationSec} Seconds` : 'Unlimited Duration'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={onBack}
          className="px-5 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold rounded-xl transition flex items-center space-x-2 text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Customize</span>
        </button>

        <button
          onClick={onStartTest}
          className="flex-grow px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 text-sm cursor-pointer"
        >
          <span>Start Verbal Test</span>
          <Play className="w-4 h-4 fill-white" />
        </button>
      </div>
    </section>
  );
}
