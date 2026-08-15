import React from 'react';
import { Play, Sparkles, Mic, BarChart2, Shield, Flame, Award, ChevronRight } from 'lucide-react';
import { getPlayerStatus, getStatusBadgeClass } from '../utils/eloRating';

export default function HomeView({ onStartPlay, currentUser, topPlayers }) {
  const top1 = topPlayers && topPlayers[0];
  const top2 = topPlayers && topPlayers[1];
  const top3 = topPlayers && topPlayers[2];

  const userStatus = getPlayerStatus(currentUser?.rating || 120);
  const userStatusClass = getStatusBadgeClass(userStatus);

  return (
    <section className="space-y-10 animate-fade-in max-w-5xl mx-auto py-2">
      
      {/* Top 3 Rankers Podium */}
      <div className="flex items-end justify-center gap-2 sm:gap-6 pt-4 pb-2 select-none">
        
        {/* 3RD RANK (BRONZE) */}
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-600/80 bg-slate-900 shadow-[0_0_15px_rgba(217,119,6,0.4)] flex items-center justify-center p-0.5">
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-slate-950">
              {top3?.profilePicUrl ? (
                <img src={top3.profilePicUrl} alt="3rd Rank" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">🥉</span>
              )}
            </div>
            <span className="absolute -top-2 -right-1 bg-amber-800 text-amber-100 text-[10px] font-black px-1.5 py-0.2 rounded-full border border-amber-600 shadow">
              3rd
            </span>
          </div>
          <span className="text-xs font-bold text-slate-300 mt-2 tracking-wide truncate max-w-[80px] text-center">
            {top3?.name || "3rd Rank"}
          </span>
          <span className="text-[10px] font-mono text-amber-400 font-bold">
            {top3 ? `${top3.rating} Elo` : "-"}
          </span>
        </div>

        {/* 1ST RANK (CENTER - GOLD - MAXIMUM GLOW & CURVED SVG NAME) */}
        <div className="flex flex-col items-center -translate-y-3">
          <div className="relative flex flex-col items-center">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-yellow-300 bg-amber-950/30 shadow-[0_0_35px_rgba(250,204,21,0.9),0_0_70px_rgba(234,179,8,0.5)] flex items-center justify-center p-1 z-10">
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-slate-900 border-2 border-yellow-300 shadow-[inner_0_0_15px_rgba(250,204,21,0.8)]">
                {top1?.profilePicUrl ? (
                  <img src={top1.profilePicUrl} alt="1st Rank" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl drop-shadow-[0_0_10px_rgba(250,204,21,1)]">🥇</span>
                )}
              </div>
              <span className="absolute -top-3 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-slate-950 text-xs font-black px-3 py-0.5 rounded-full border-2 border-yellow-100 shadow-[0_0_15px_rgba(250,204,21,0.9)] tracking-wider">
                👑 1st
              </span>
            </div>

            {/* Curved SVG Name */}
            <svg className="w-36 h-12 -mt-2 overflow-visible pointer-events-none" viewBox="0 0 160 55">
              <path id="curve-path-1st-home" d="M 10,12 A 70,70 0 0,0 150,12" fill="transparent" />
              <text className="fill-yellow-300 font-extrabold text-[12px] sm:text-[13px] tracking-wider uppercase drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]">
                <textPath href="#curve-path-1st-home" startOffset="50%" textAnchor="middle">
                  {top1?.name || "1st Champion"}
                </textPath>
              </text>
            </svg>
          </div>
          <span className="text-xs font-mono text-yellow-300 font-extrabold -mt-3">
            {top1 ? `${top1.rating} Elo` : "-"}
          </span>
        </div>

        {/* 2ND RANK (SILVER) */}
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-slate-300 bg-slate-900 shadow-[0_0_20px_rgba(203,213,225,0.4)] flex items-center justify-center p-0.5">
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-slate-950">
              {top2?.profilePicUrl ? (
                <img src={top2.profilePicUrl} alt="2nd Rank" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl">🥈</span>
              )}
            </div>
            <span className="absolute -top-2 -right-1 bg-slate-700 text-slate-100 text-[10px] font-black px-1.5 py-0.2 rounded-full border border-slate-400 shadow">
              2nd
            </span>
          </div>
          <span className="text-xs font-bold text-slate-300 mt-2 tracking-wide truncate max-w-[80px] text-center">
            {top2?.name || "2nd Rank"}
          </span>
          <span className="text-[10px] font-mono text-slate-300 font-bold">
            {top2 ? `${top2.rating} Elo` : "-"}
          </span>
        </div>

      </div>

      {/* Hero Headline & Rating Badge */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Mic className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Voice-Activated Verbal Calculation Trainer (Hindi/English)</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
          Sharpen Your Speed With{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-500 bg-clip-text text-transparent">
            Verbal Calculation
          </span>
        </h2>

        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Improve your mental arithmetic reflexes dynamically. Listen or look at the math expression, speak the answer aloud in Hindi, English, or Hinglish, and the engine validates it immediately.
        </p>

        {/* Current Student Rating Badge */}
        {currentUser && (
          <div className="pt-2 flex items-center justify-center">
            <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-2xl bg-slate-900/90 border border-indigo-500/30 shadow-lg">
              <span className="text-xs text-slate-400 font-semibold">Your Rating:</span>
              <span className="text-base font-black text-indigo-400 font-mono">
                {currentUser.rating || 120}
              </span>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${userStatusClass}`}>
                {userStatus}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        <div className="p-5 bg-slate-900/50 border border-slate-800/80 rounded-2xl space-y-2 hover:border-slate-700 transition">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-sm">
            15+
          </div>
          <h3 className="text-sm font-bold text-slate-100">Customizable Formats</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Double/Triple Addition, Number Sum, Tables 11-30, Squares, Square/Cube Roots, Fractions, Percentages & BODMAS.
          </p>
        </div>

        <div className="p-5 bg-slate-900/50 border border-slate-800/80 rounded-2xl space-y-2 hover:border-slate-700 transition">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 font-bold text-sm">
            🎙️
          </div>
          <h3 className="text-sm font-bold text-slate-100">Hindi / Hinglish Engine</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Natural speech parsing supporting spoken numbers in Hindi ("पच्चीस", "एक सौ"), English, or direct digits.
          </p>
        </div>

        <div className="p-5 bg-slate-900/50 border border-slate-800/80 rounded-2xl space-y-2 hover:border-slate-700 transition">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 font-bold text-sm">
            🏆
          </div>
          <h3 className="text-sm font-bold text-slate-100">Live Global Elo Ranking</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real-time Elo rating adjustments, daily solved questions bar charts, and classroom rankings sync.
          </p>
        </div>
      </div>

      {/* Start Play CTA */}
      <div className="flex flex-col items-center justify-center pt-4 pb-6">
        <button
          onClick={onStartPlay}
          className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transform transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-3 cursor-pointer"
        >
          <span>Let's Play Trainer</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </section>
  );
}
