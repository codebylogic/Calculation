import React from 'react';
import { Home, LineChart, Trophy, User, ShieldCheck } from 'lucide-react';

export default function BottomNav({ currentView, onNavigate, currentUser, profilePicUrl }) {
  const isAdminUser = currentUser?.id?.toLowerCase() === "shivam@123";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-xl z-40 px-3 py-2 flex justify-around items-center text-xs shadow-2xl">
      {/* Home */}
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center space-y-1 transition py-1 px-2.5 rounded-xl ${
          currentView === 'home'
            ? 'text-indigo-400 bg-indigo-500/10 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      {/* Scores History */}
      <button
        onClick={() => onNavigate('scores')}
        className={`flex flex-col items-center space-y-1 transition py-1 px-2.5 rounded-xl ${
          currentView === 'scores'
            ? 'text-indigo-400 bg-indigo-500/10 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <LineChart className="w-5 h-5" />
        <span className="text-[10px]">Scores</span>
      </button>

      {/* Leaderboard */}
      <button
        onClick={() => onNavigate('leaderboard')}
        className={`flex flex-col items-center space-y-1 transition py-1 px-2.5 rounded-xl ${
          currentView === 'leaderboard'
            ? 'text-indigo-400 bg-indigo-500/10 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Trophy className="w-5 h-5" />
        <span className="text-[10px]">Leaderboard</span>
      </button>

      {/* Profile */}
      <button
        onClick={() => onNavigate('profile')}
        className={`flex flex-col items-center space-y-1 transition py-1 px-2.5 rounded-xl ${
          currentView === 'profile'
            ? 'text-indigo-400 bg-indigo-500/10 font-bold'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center bg-slate-900 border border-slate-700">
          {profilePicUrl ? (
            <img src={profilePicUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="w-3.5 h-3.5" />
          )}
        </div>
        <span className="text-[10px]">Profile</span>
      </button>

      {/* Admin Panel (If user is admin or accessible) */}
      {isAdminUser && (
        <button
          onClick={() => onNavigate('admin')}
          className={`flex flex-col items-center space-y-1 transition py-1 px-2.5 rounded-xl ${
            currentView === 'admin'
              ? 'text-rose-400 bg-rose-500/10 font-bold'
              : 'text-rose-400/70 hover:text-rose-300'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px]">Admin</span>
        </button>
      )}
    </nav>
  );
}
