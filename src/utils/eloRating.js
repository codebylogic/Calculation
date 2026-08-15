// Elo Rating & Status Helpers

export function getPlayerStatus(rating) {
  const num = parseFloat(rating) || 120;
  if (num >= 1000) return "Grandmaster";
  if (num >= 650)  return "Master";
  if (num >= 500)  return "Elite Heroic";
  if (num >= 400)  return "Heroic";
  if (num >= 325)  return "Platinum";
  if (num >= 275)  return "Dimand";
  if (num >= 225)  return "Gold";
  if (num >= 140)  return "Silver";
  return "Learner";
}

export function getStatusBadgeClass(status) {
  switch (status) {
    case 'Grandmaster':
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    case 'Master':
      return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
    case 'Elite Heroic':
    case 'Heroic':
      return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
    case 'Platinum':
    case 'Dimand':
      return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
    case 'Gold':
      return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';
    case 'Silver':
      return 'bg-slate-400/15 text-slate-300 border-slate-400/30';
    default:
      return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
  }
}

export function getStatusGradientClass(status) {
  switch (status) {
    case 'Grandmaster':
      return 'from-amber-500 to-orange-500';
    case 'Master':
      return 'from-rose-500 to-red-500';
    case 'Elite Heroic':
    case 'Heroic':
      return 'from-purple-500 to-pink-500';
    case 'Platinum':
    case 'Dimand':
      return 'from-cyan-500 to-blue-500';
    case 'Gold':
      return 'from-yellow-500 to-amber-500';
    case 'Silver':
      return 'from-slate-400 to-slate-500';
    default:
      return 'from-indigo-500 to-indigo-600';
  }
}

export function getEloQuestionTier(rating) {
  const num = parseFloat(rating) || 120;
  if (num >= 400) return "heroic";
  if (num >= 275) return "diamond";
  if (num >= 225) return "gold";
  if (num >= 140) return "silver";
  return "learner";
}

const EASY_SQUEEZE_CATEGORIES = [
  "Addition (1 Digit)", "Addition", "Addition (2 Digit)",
  "Subtraction (1 Digit)", "Subtraction", "Subtraction (2 Digit)"
];

export function isSqueezeEligible(currentRating, categoryName) {
  return currentRating > 500 && EASY_SQUEEZE_CATEGORIES.includes(categoryName);
}

export function calculateNewRating(currentRating, isCorrect, questionLevel, isTimerActive, secondsUsed, maxDuration, streak, lastWrong, squeezeApplies) {
  const curRatingNum = parseFloat(currentRating) || 120;
  const questionRating = 100 + (questionLevel * 30);
  let K = 2.0;

  if (isTimerActive && maxDuration > 0) {
    if (isCorrect) {
      const speedBonus = 1 + ((maxDuration - secondsUsed) / maxDuration) * 0.3;
      K = K * speedBonus;
    } else {
      const speedPenalty = 1 + ((maxDuration - secondsUsed) / maxDuration) * 0.2;
      K = K * speedPenalty;
    }
  }

  if (isCorrect && streak >= 3) K = K + 0.3;
  if (isCorrect && lastWrong) K = K + 0.2;

  const expectedScore = 1 / (1 + Math.pow(10, (questionRating - curRatingNum) / 400));
  const actualScore = isCorrect ? 1 : 0;

  let change = K * (actualScore - expectedScore);
  if (change > 5.0) change = 5.0;
  if (change < -5.0) change = -5.0;

  if (squeezeApplies && isCorrect && change > 0.1) {
    change = 0.1;
  }

  const newRating = curRatingNum + change;
  return parseFloat(newRating.toFixed(1));
}

export function getTodayDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function initTodayCount() {
  const savedDate = localStorage.getItem('lastDate');
  const todayStr = getTodayDateString();
  let savedCount = parseInt(localStorage.getItem('todayCount'), 10);
  if (savedDate !== todayStr || isNaN(savedCount)) {
    savedCount = 0;
    localStorage.setItem('lastDate', todayStr);
    localStorage.setItem('todayCount', "0");
  }
  return savedCount;
}

export function incrementTodaySolvedCount() {
  const todayStr = getTodayDateString();
  let count = initTodayCount();
  count++;
  localStorage.setItem('todayCount', String(count));
  localStorage.setItem('lastDate', todayStr);
  return count;
}

