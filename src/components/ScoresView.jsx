import React, { useState } from 'react';
import { Table, LineChart as ChartIcon, Download, Trash2 } from 'lucide-react';
import { parseMarkdownTable, downloadMarkdownFile } from '../utils/markdownExporter';

export default function ScoresView({ markdownContent, onClearHistory, onShowToast }) {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'graph'
  const records = parseMarkdownTable(markdownContent);

  const handleExport = () => {
    downloadMarkdownFile(markdownContent);
    onShowToast?.("📥", "calculation_score.md downloaded successfully!");
  };

  const handleClear = () => {
    onClearHistory();
    onShowToast?.("🗑️", "Score history reset!");
  };

  return (
    <section className="space-y-6 animate-fade-in max-w-5xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Scores Dashboard</h2>
          <p className="text-xs text-slate-400">
            Records logged in virtual file{' '}
            <code className="text-indigo-400 font-mono text-[11px] bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/40">
              calculation_score.md
            </code>
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setViewMode(prev => prev === 'table' ? 'graph' : 'table')}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-xl transition flex items-center space-x-1.5 shadow-sm"
          >
            {viewMode === 'table' ? (
              <>
                <ChartIcon className="w-3.5 h-3.5" />
                <span>Graph View</span>
              </>
            ) : (
              <>
                <Table className="w-3.5 h-3.5" />
                <span>Table View</span>
              </>
            )}
          </button>

          <button
            onClick={handleExport}
            className="px-3 py-2 bg-slate-900 border border-slate-800 hover:text-white text-xs font-bold text-slate-400 rounded-xl transition flex items-center space-x-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .md</span>
          </button>

          <button
            onClick={handleClear}
            className="px-3 py-2 bg-rose-950/20 hover:bg-rose-900/40 text-xs font-bold text-rose-400 rounded-xl transition flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden overflow-x-auto shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                <th className="p-3.5 sm:p-4">Date & Time</th>
                <th className="p-3.5 sm:p-4">Total Q</th>
                <th className="p-3.5 sm:p-4">Score</th>
                <th className="p-3.5 sm:p-4">Accuracy</th>
                <th className="p-3.5 sm:p-4">Category Breakdown</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              {records.length > 0 ? (
                [...records].reverse().map((rec, i) => (
                  <tr key={i} className="hover:bg-slate-900/30 transition">
                    <td className="p-3.5 sm:p-4 font-semibold text-slate-200">{rec.dateTime}</td>
                    <td className="p-3.5 sm:p-4 font-mono">{rec.total}</td>
                    <td className="p-3.5 sm:p-4 font-mono font-bold text-slate-200">{rec.score}</td>
                    <td className="p-3.5 sm:p-4 font-mono font-extrabold text-indigo-400">{rec.accuracy}</td>
                    <td className="p-3.5 sm:p-4 text-slate-400 max-w-xs truncate" title={rec.breakdown}>
                      {rec.breakdown}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 text-sm italic">
                    No performance history records found. Start a test to write score records!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-slate-200">Historical Accuracy Trend Chart</h3>
          <div className="w-full h-64 bg-slate-950/60 border border-slate-800/80 rounded-xl relative flex items-center justify-center p-4">
            <SvgTrendChart records={records} />
          </div>
        </div>
      )}
    </section>
  );
}

function SvgTrendChart({ records }) {
  if (!records || records.length === 0) {
    return <p className="text-xs text-slate-500 italic">Play some tests to render tracking curves!</p>;
  }

  const dataPoints = records.map(r => parseFloat(r.accuracy?.replace('%', '')) || 0);
  const width = 600;
  const height = 220;
  const padding = 35;
  const xStep = (width - padding * 2) / Math.max(dataPoints.length - 1, 1);

  let pointsPath = "";
  let areaPath = `M ${padding} ${height - padding} `;

  dataPoints.forEach((val, index) => {
    const x = padding + index * xStep;
    const y = padding + ((100 - val) / 100) * (height - padding * 2);
    if (index === 0) pointsPath += `M ${x} ${y} `;
    else pointsPath += `L ${x} ${y} `;
    areaPath += `L ${x} ${y} `;
  });

  areaPath += `L ${padding + (dataPoints.length - 1) * xStep} ${height - padding} Z`;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map(pct => {
        const y = padding + ((100 - pct) / 100) * (height - padding * 2);
        return (
          <g key={pct}>
            <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />
            <text x={padding - 8} y={y + 4} fill="#64748b" fontSize="10" textAnchor="end">{pct}%</text>
          </g>
        );
      })}

      {/* Area & Line */}
      <path d={areaPath} fill="url(#chartGrad)" />
      <path d={pointsPath} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Data Markers */}
      {dataPoints.map((val, index) => {
        const x = padding + index * xStep;
        const y = padding + ((100 - val) / 100) * (height - padding * 2);
        return (
          <g key={index}>
            <circle cx={x} cy={y} r="4" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
            <text x={x} y={y - 8} fill="#a5b4fc" fontSize="9" textAnchor="middle" fontWeight="bold">
              {val}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}
