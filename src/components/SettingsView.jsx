import React, { useState } from 'react';
import { Settings, Shield, Clock, RotateCcw, Save, Zap } from 'lucide-react';
import { categories } from '../data/categories';

export default function SettingsView({
  appSettings,
  currentUser,
  onSaveSettings,
  onResetAIDifficulty,
  onLogout
}) {
  const [formData, setFormData] = useState({ ...appSettings });

  const handleToggleGlobalTimer = () => {
    setFormData(prev => ({ ...prev, globalTimer: !prev.globalTimer }));
  };

  const handleToggleIncognito = () => {
    setFormData(prev => ({ ...prev, incognitoMode: !prev.incognitoMode }));
  };

  const handleTierChange = (e) => {
    setFormData(prev => ({ ...prev, customPracticeTier: e.target.value }));
  };

  const handleCategoryTimeChange = (catName, time) => {
    setFormData(prev => ({
      ...prev,
      categoryTimes: {
        ...prev.categoryTimes,
        [catName]: parseInt(time, 10) || 15
      }
    }));
  };

  const handleCategoryCountdownToggle = (catName) => {
    setFormData(prev => ({
      ...prev,
      countdownEnabled: {
        ...prev.countdownEnabled,
        [catName]: !prev.countdownEnabled[catName]
      }
    }));
  };

  const handleSave = () => {
    onSaveSettings(formData);
  };

  return (
    <section className="space-y-6 animate-fade-in max-w-3xl mx-auto py-2">
      <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">App Configurations</h2>
          <p className="text-xs text-slate-400">
            Configure profile, test timers per category, or incognito practice tier.
          </p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl">
        {/* User quick profile */}
        <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs text-slate-400">
              Logged In ID: <span className="font-bold text-white font-mono">{currentUser?.id || "None"}</span>
            </p>
            <p className="text-xs text-slate-400">
              Name: <span className="font-bold text-indigo-400">{currentUser?.name || "None"}</span>
            </p>
          </div>
          <button
            onClick={onLogout}
            className="px-3.5 py-2 bg-rose-600/20 hover:bg-rose-600 border border-rose-500/30 text-rose-300 hover:text-white font-bold text-xs rounded-xl transition self-start sm:self-auto"
          >
            Log Out 🚪
          </button>
        </div>

        {/* Incognito / Practice Mode Toggle */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center space-x-1.5">
                <span>🕵️ Incognito / Custom Practice Mode</span>
              </h3>
              <p className="text-[11px] text-slate-400 leading-snug">
                इसे ऑन करने पर आपकी रेटिंग अपडेट नहीं होगी और आप मनपसंद लेवल चुन सकते हैं।
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
              <input
                type="checkbox"
                checked={formData.incognitoMode || false}
                onChange={handleToggleIncognito}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {formData.incognitoMode && (
            <div className="space-y-2 border-t border-slate-800 pt-3">
              <label className="text-xs font-bold text-slate-300">Select Practice Tier Level:</label>
              <select
                value={formData.customPracticeTier || "learner"}
                onChange={handleTierChange}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-indigo-300 font-bold focus:outline-none focus:border-indigo-500"
              >
                <option value="learner">Learner (Beginner)</option>
                <option value="silver">Silver Tier</option>
                <option value="gold">Gold Tier</option>
                <option value="diamond">Diamond Tier</option>
                <option value="heroic">Heroic / Grandmaster Tier</option>
              </select>
            </div>
          )}
        </div>

        {/* Global Countdown Timer Toggle */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Global Countdown Timers</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Enable or disable timer limits across all categories in tests.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
            <input
              type="checkbox"
              checked={formData.globalTimer}
              onChange={handleToggleGlobalTimer}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Category Specific Times Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
            Category Timers Configuration
          </h4>

          <div className="divide-y divide-slate-800/80">
            {categories.map((cat) => {
              const time = formData.categoryTimes?.[cat.name] || 15;
              const isActive = formData.countdownEnabled?.[cat.name] !== false;

              return (
                <div key={cat.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">{cat.name}</h5>
                    <p className="text-[10px] text-slate-500">{cat.desc}</p>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-auto">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] text-slate-400">Time:</span>
                      <input
                        type="number"
                        min="5"
                        max="120"
                        value={time}
                        onChange={(e) => handleCategoryTimeChange(cat.name, e.target.value)}
                        className="w-14 px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-center text-xs text-indigo-400 font-mono focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400">sec</span>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() => handleCategoryCountdownToggle(cat.name)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4.5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end space-x-3 pt-2">
        <button
          onClick={onResetAIDifficulty}
          className="px-4 py-2.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 text-rose-300 font-bold text-xs rounded-xl transition flex items-center space-x-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset AI Difficulty</span>
        </button>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-indigo-600/25 flex items-center space-x-1.5 cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Apply Settings</span>
        </button>
      </div>
    </section>
  );
}
