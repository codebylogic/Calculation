import React, { useRef } from 'react';
import { User, Camera, LogOut, RefreshCw, Layers, Shield } from 'lucide-react';
import { getPlayerStatus, getStatusBadgeClass } from '../utils/eloRating';

export default function ProfileView({
  currentUser,
  savedAccounts,
  onLogout,
  onSwitchAccount,
  onUploadProfilePic
}) {
  const fileInputRef = useRef(null);
  const status = getPlayerStatus(currentUser?.rating || 120);
  const badgeClass = getStatusBadgeClass(status);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5000000) {
        alert("Image size exceeds 5MB! Please select a smaller photo.");
        return;
      }
      onUploadProfilePic(file);
    }
  };

  return (
    <section className="space-y-6 animate-fade-in max-w-md mx-auto py-2">
      <div className="text-center space-y-3 pt-2">
        {/* Profile Picture with hover upload trigger */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative w-24 h-24 mx-auto group cursor-pointer"
          title="Click to change profile picture"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-3xl font-black shadow-xl border-2 border-slate-700 overflow-hidden">
            {currentUser?.profilePicUrl ? (
              <img src={currentUser.profilePicUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-white/80" />
            )}
          </div>

          <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition duration-200">
            <Camera className="w-5 h-5 text-white mb-0.5" />
            <span className="text-[9px] font-bold text-white tracking-wider uppercase">Change</span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          {currentUser?.name || "Student Name"}
        </h2>
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${badgeClass}`}>
          {status} Tier
        </span>
      </div>

      {/* Profile Details Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2">
          Profile Information
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">User ID (यूनिक आईडी)</span>
            <span className="font-mono font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {currentUser?.id || "---"}
            </span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Class (कक्षा)</span>
            <span className="font-bold text-slate-200">{currentUser?.studentClass || "Not Set"}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Age (उम्र)</span>
            <span className="font-bold text-slate-200">{currentUser?.age || "Not Set"}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-medium">Current Math Rating</span>
            <span className="font-mono font-black text-indigo-400 text-sm">
              {currentUser?.rating || 120}
            </span>
          </div>
        </div>
      </div>

      {/* Multi-Account Switch List */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2 flex items-center justify-between">
          <span className="flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Switch Account</span>
          </span>
          <span className="text-[10px] text-slate-400 lowercase font-normal">Saved sessions</span>
        </h3>

        <div className="space-y-2">
          {savedAccounts && savedAccounts.length > 0 ? (
            savedAccounts.map((acc) => {
              const isCurrent = acc.id === currentUser?.id;
              return (
                <div
                  key={acc.id}
                  className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800/80"
                >
                  <div className="flex items-center space-x-2 truncate pr-2">
                    <span className="text-xs font-bold text-white truncate">{acc.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">({acc.id})</span>
                  </div>

                  {isCurrent ? (
                    <span className="text-[10px] text-emerald-400 font-extrabold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg shrink-0">
                      Active
                    </span>
                  ) : (
                    <button
                      onClick={() => onSwitchAccount(acc.id)}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition shadow shrink-0"
                    >
                      Switch
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-500 italic text-center py-2">
              No other saved accounts on this device.
            </p>
          )}
        </div>
      </div>

      {/* Log Out button */}
      <div className="pt-2">
        <button
          onClick={onLogout}
          className="w-full py-2.5 bg-rose-600/15 hover:bg-rose-600 border border-rose-500/30 hover:border-rose-600 text-rose-300 hover:text-white font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out From This Device</span>
        </button>
      </div>
    </section>
  );
}
