import React from 'react';
import { Trophy, BarChart3, RefreshCw, UserCheck } from 'lucide-react';
import { getPlayerStatus, getStatusBadgeClass, getStatusGradientClass } from '../utils/eloRating';

export default function LeaderboardView({ players, currentUser, onRefresh, loading }) {
  const sortedPlayers = [...(players || [])].sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));

  const maxTodayCount = Math.max(
    ...sortedPlayers.map(p => parseInt(p.todayCount, 10) || 0),
    1
  );

  return (
    <section className="space-y-6 animate-fade-in max-w-4xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center space-x-2">
            <span>Global Math Rankings</span>
            <span>🏆</span>
          </h2>
          <p className="text-xs text-slate-400">
            सभी छात्रों की लाइव योग्यता (Elo Rating) और वैश्विक रैंक सूची।
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-300 rounded-xl transition flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Live</span>
        </button>
      </div>

      {/* User Quick Rating Banner */}
      {currentUser && (
        <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900/60 to-slate-900/60 border border-indigo-500/40 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-sm border border-indigo-500/40">
              You
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">{currentUser.name}</h3>
              <p className="text-[11px] text-slate-400">अपनी रैंक बढ़ाने के लिए टेस्ट खेलते रहें!</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-semibold">Your Rating</span>
            <span className="text-lg font-black text-indigo-400 font-mono">
              {currentUser.rating || 120}
            </span>
          </div>
        </div>
      )}

      {/* Global Rankings Data Grid */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
              <th className="p-3.5 sm:p-4 w-16 text-center">Rank</th>
              <th className="p-3.5 sm:p-4">Student Name</th>
              <th className="p-3.5 sm:p-4 text-center">Rating (Elo)</th>
              <th className="p-3.5 sm:p-4 text-center">Status Tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
            {sortedPlayers.length > 0 ? (
              sortedPlayers.map((player, index) => {
                const rank = index + 1;
                let rankBadge = rank;
                if (rank === 1) rankBadge = "🥇";
                else if (rank === 2) rankBadge = "🥈";
                else if (rank === 3) rankBadge = "🥉";

                const isSelf = player.id === currentUser?.id;
                const status = getPlayerStatus(player.rating);
                const badgeStyle = getStatusBadgeClass(status);

                return (
                  <tr
                    key={player.id || index}
                    className={`transition ${
                      isSelf
                        ? 'bg-indigo-500/10 font-bold border-l-2 border-indigo-500'
                        : 'hover:bg-slate-900/30'
                    }`}
                  >
                    <td className="p-3.5 sm:p-4 text-center font-mono text-sm">{rankBadge}</td>
                    <td className="p-3.5 sm:p-4 text-slate-200">
                      <div className="flex items-center space-x-2">
                        <span>{player.name}</span>
                        {isSelf && (
                          <span className="text-[10px] text-indigo-400 font-bold px-1.5 py-0.5 rounded bg-indigo-500/20">
                            (You)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 sm:p-4 text-center font-mono font-extrabold text-indigo-400">
                      {player.rating}
                    </td>
                    <td className="p-3.5 sm:p-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${badgeStyle}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500 italic">
                  Loading rankings from cloud database...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Today's Practice Solved Questions Bar Chart */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-extrabold text-slate-200 flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          <span>📊 आज का अभ्यास दंड आलेख (Today's Solved Questions Chart)</span>
        </h3>
        <p className="text-xs text-slate-400">
          सभी छात्रों द्वारा आज हल किए गए कुल प्रश्नों की संख्या (हर रात 12:00 बजे रीसेट होती है)।
        </p>

        <div className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col space-y-3">
          {sortedPlayers.map((player) => {
            const isSelf = player.id === currentUser?.id;
            const count = parseInt(player.todayCount, 10) || 0;
            const status = getPlayerStatus(player.rating);
            const gradient = getStatusGradientClass(status);
            const barWidth = Math.min(100, Math.max(count > 0 ? 8 : 2, (count / maxTodayCount) * 100));

            return (
              <div key={player.id} className="space-y-1">
                <div className="flex justify-between text-[11px] font-medium px-1">
                  <span className={isSelf ? 'text-indigo-400 font-bold' : 'text-slate-300'}>
                    {player.name} {isSelf ? '(You)' : ''}
                  </span>
                  <span className="text-slate-400 font-mono font-bold">
                    {count} Solved Today
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-3.5 rounded-lg overflow-hidden border border-slate-800/70 flex items-center">
                  <div
                    className={`bg-gradient-to-r ${gradient} h-full rounded-lg flex items-center justify-end px-2 transition-all duration-500`}
                    style={{ width: `${barWidth}%` }}
                  >
                    <span className="text-[9px] text-white font-black font-mono tracking-tight opacity-90">
                      {count}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
