import React from 'react';
import { Award, CheckCircle, Home, Save, ArrowRight, TrendingUp } from 'lucide-react';
import { getPlayerStatus, getStatusBadgeClass } from '../utils/eloRating';

export default function ReportView({ reportData, currentUser, onReturnHome, onSaveToMarkdown }) {
  if (!reportData) return null;

  const { total, correct, percentage, scoresBreakdown, newRating, ratingBonus } = reportData;
  const status = getPlayerStatus(newRating || currentUser?.rating || 120);
  const badgeClass = getStatusBadgeClass(status);

  let feedbackTitle = "💪 ध्यान दें और दोबारा प्रयास करें!";
  let feedbackSub = "Keep practicing regularly to build instant numerical fluency and reflexes.";
  if (percentage === 100) {
    feedbackTitle = "🌟 शत-प्रतिशत परफेक्ट! (100% Accuracy)";
    feedbackSub = "Sensational numerical reflexes! Your accuracy is absolute mastery.";
  } else if (percentage >= 80) {
    feedbackTitle = "🔥 बेमिसाल स्पीड और एक्यूरेसी! (Great Score)";
    feedbackSub = "Excellent problem solving speed! You are performing at high tier level.";
  } else if (percentage >= 50) {
    feedbackTitle = "📈 बहुत बढ़िया, अभ्यास जारी रखें!";
    feedbackSub = "Good performance. Consistent daily practice will push your rating to Master!";
  }

  return (
    <section className="space-y-6 animate-fade-in max-w-2xl mx-auto py-2">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-emerald-400">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">Test Completed Successfully!</h2>
        <p className="text-xs text-slate-400">
          Review your final assessment score and type-specific breakdown details below.
        </p>
      </div>

      {/* Main Stats Card */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-around gap-6 text-center sm:text-left shadow-2xl">
        <div className="space-y-1">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
            Combined Accuracy
          </span>
          <h3 className="text-4xl sm:text-5xl font-black text-indigo-400 font-mono">
            {percentage}%
          </h3>
          <p className="text-xs text-slate-400">
            {correct} / {total} Questions Correct
          </p>
        </div>

        <div className="h-px w-full sm:h-16 sm:w-px bg-slate-800"></div>

        <div className="space-y-1">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
            Updated Math Rating
          </span>
          <div className="flex items-baseline space-x-2 justify-center sm:justify-start">
            <h3 className="text-4xl sm:text-5xl font-black text-emerald-400 font-mono">
              {newRating || currentUser?.rating || 120}
            </h3>
            {ratingBonus > 0 && (
              <span className="text-xs font-bold text-yellow-300 font-mono">
                +{ratingBonus} bonus!
              </span>
            )}
          </div>
          <span className={`inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded border ${badgeClass}`}>
            {status}
          </span>
        </div>

        <div className="h-px w-full sm:h-16 sm:w-px bg-slate-800"></div>

        <div className="space-y-1 max-w-[200px]">
          <h4 className="text-xs font-bold text-slate-100">{feedbackTitle}</h4>
          <p className="text-[11px] text-slate-400 leading-snug">{feedbackSub}</p>
        </div>
      </div>

      {/* Accuracy Breakdown by Type */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300">
          Accuracy Breakdown By Category
        </h3>
        <div className="space-y-3">
          {Object.keys(scoresBreakdown || {}).map((catName) => {
            const metric = scoresBreakdown[catName];
            const catPct = metric.total > 0 ? Math.round((metric.correct / metric.total) * 100) : 0;
            return (
              <div key={catName} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{catName}</span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {metric.correct} / {metric.total} correct ({catPct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800/80">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${catPct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={onReturnHome}
          className="px-5 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold rounded-xl transition flex items-center space-x-2 text-xs"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </button>

        <button
          onClick={onSaveToMarkdown}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition shadow-lg shadow-indigo-600/25 flex items-center space-x-2 text-xs cursor-pointer"
        >
          <span>Save Score to MD</span>
          <Save className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
