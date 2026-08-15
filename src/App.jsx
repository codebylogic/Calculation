import React, { useState, useEffect, useCallback } from 'react';
import { 
  Home, 
  BarChart2, 
  Trophy, 
  User, 
  Shield, 
  Settings, 
  Menu, 
  Calculator,
  Volume2
} from 'lucide-react';

import AuthView from './components/AuthView';
import HomeView from './components/HomeView';
import CustomizeView from './components/CustomizeView';
import OverviewView from './components/OverviewView';
import TestView from './components/TestView';
import ReportView from './components/ReportView';
import ScoresView from './components/ScoresView';
import LeaderboardView from './components/LeaderboardView';
import ProfileView from './components/ProfileView';
import SettingsView from './components/SettingsView';
import AdminView from './components/AdminView';
import Toast from './components/Toast';

import { categories } from './data/categories';
import { 
  fetchCloudPlayers, 
  loginUserCloud, 
  signupUserCloud, 
  updateUserCloud, 
  deleteUserCloud, 
  updateProfilePicCloud, 
  uploadDirectToCloudinary 
} from './utils/cloudApi';
import { 
  calculateNewRating, 
  isSqueezeEligible, 
  getTodayDateString, 
  initTodayCount, 
  incrementTodaySolvedCount, 
  getPlayerStatus 
} from './utils/eloRating';
import { generateArithmeticExpression } from './utils/mathGenerator';
import { 
  defaultMarkdown, 
  appendScoreToMarkdown 
} from './utils/markdownExporter';
import { playFeedbackBeep } from './utils/speechEngine';

export default function App() {
  // Navigation View: 'home', 'customize', 'overview', 'test', 'report', 'scores', 'leaderboard', 'profile', 'settings', 'admin'
  const [currentView, setCurrentView] = useState('home');

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [savedAccounts, setSavedAccounts] = useState([]);

  // Cloud players / Leaderboard state
  const [playersList, setPlayersList] = useState([]);
  const [isCloudLoading, setIsCloudLoading] = useState(false);

  // Settings State
  const [appSettings, setAppSettings] = useState(() => {
    const defaultTimes = {};
    const defaultCountdown = {};
    categories.forEach(c => {
      defaultTimes[c.name] = 15;
      defaultCountdown[c.name] = true;
    });

    const saved = localStorage.getItem('calcu_voice_settings');
    if (saved) {
      try {
        return { ...JSON.parse(saved) };
      } catch (e) {}
    }
    return {
      categoryTimes: defaultTimes,
      countdownEnabled: defaultCountdown,
      globalTimer: true,
      incognitoMode: false,
      customPracticeTier: "learner"
    };
  });

  // Category Difficulty Levels state (1 to 3 for each)
  const [categoryDifficulty, setCategoryDifficulty] = useState(() => {
    const saved = localStorage.getItem('categoryDifficulty');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    const def = {};
    categories.forEach(c => {
      def[c.name] = 2;
    });
    return def;
  });

  // Selected Category Counts for customize
  const [selectedCounts, setSelectedCounts] = useState(() => {
    const counts = {};
    categories.forEach(c => {
      counts[c.name] = c.defaultCount || 0;
    });
    return counts;
  });

  // Active Test Run State
  const [testState, setTestState] = useState({
    questions: [],
    currentIndex: 0,
    correctCount: 0,
    scoresBreakdown: {},
    currentStreak: 0,
    wasLastWrong: false,
    overlayState: { show: false, isCorrect: false, message: '' }
  });

  // Report summary state
  const [reportData, setReportData] = useState(null);

  // Scores Markdown State
  const [markdownContent, setMarkdownContent] = useState(() => {
    return localStorage.getItem('calculation_score_md') || defaultMarkdown;
  });

  // Toast Notification State
  const [toast, setToast] = useState({ visible: false, icon: 'ℹ️', message: '' });

  const showToast = useCallback((icon, message) => {
    setToast({ visible: true, icon, message });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3200);
  }, []);

  // Sync saved account to multi-account list
  const saveAccountToMultiList = useCallback((uId, name, rating, profilePic) => {
    let accounts = [];
    try {
      accounts = JSON.parse(localStorage.getItem('saved_accounts')) || [];
    } catch (e) {
      accounts = [];
    }
    const idx = accounts.findIndex(a => a.id === uId);
    const item = { id: uId, name, rating, profilePicUrl: profilePic || "" };
    if (idx > -1) {
      accounts[idx] = item;
    } else {
      accounts.push(item);
    }
    localStorage.setItem('saved_accounts', JSON.stringify(accounts));
    setSavedAccounts(accounts);
  }, []);

  // Fetch players from Cloud API
  const refreshCloudData = useCallback(async (activeUserId) => {
    setIsCloudLoading(true);
    try {
      const players = await fetchCloudPlayers();
      if (players && players.length > 0) {
        setPlayersList(players);

        const targetId = activeUserId || currentUser?.id;
        if (targetId) {
          const currentRemote = players.find(p => p.id === targetId);
          if (currentRemote) {
            const remoteRating = parseFloat(currentRemote.rating) || 120;
            const remoteName = currentRemote.name || currentUser?.name;
            const remotePic = currentRemote.profilePicUrl || localStorage.getItem(`profile_img_${targetId}`) || "";

            setCurrentUser(prev => {
              if (!prev) return null;
              return {
                ...prev,
                name: remoteName,
                rating: remoteRating,
                profilePicUrl: remotePic,
                studentClass: currentRemote.studentClass || prev.studentClass,
                age: currentRemote.age || prev.age
              };
            });

            localStorage.setItem('auth_rating', remoteRating);
            localStorage.setItem('auth_name', remoteName);
            saveAccountToMultiList(targetId, remoteName, remoteRating, remotePic);
          }
        }
      }
    } catch (err) {
      console.warn("Cloud fetch notice:", err);
    } finally {
      setIsCloudLoading(false);
    }
  }, [currentUser?.id, currentUser?.name, saveAccountToMultiList]);

  // Initial Load & Auth Check
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_userid');
    const savedName = localStorage.getItem('auth_name');
    const savedRating = localStorage.getItem('auth_rating');
    const savedClass = localStorage.getItem('auth_class');
    const savedAge = localStorage.getItem('auth_age');

    let savedAccList = [];
    try {
      savedAccList = JSON.parse(localStorage.getItem('saved_accounts')) || [];
    } catch (e) {}
    setSavedAccounts(savedAccList);

    if (savedUser && savedName) {
      const pic = localStorage.getItem(`profile_img_${savedUser}`) || "";
      const userObj = {
        id: savedUser,
        name: savedName,
        rating: savedRating ? parseFloat(savedRating) : 120,
        studentClass: savedClass || '',
        age: savedAge || '',
        profilePicUrl: pic
      };
      setCurrentUser(userObj);
      refreshCloudData(savedUser);
    } else {
      // Fetch public leaderboard / top 3 even before login
      refreshCloudData(null);
    }
  }, []);

  // Update cloud rating helper
  const syncRatingToCloud = useCallback((newRatingValue, userToSync) => {
    const user = userToSync || currentUser;
    if (!user || appSettings.incognitoMode) return;

    updateUserCloud({
      id: user.id,
      name: user.name,
      rating: newRatingValue,
      todayCount: parseInt(localStorage.getItem('todayCount'), 10) || 0,
      lastDate: getTodayDateString(),
      profilePicUrl: user.profilePicUrl || localStorage.getItem(`profile_img_${user.id}`) || ""
    }).catch(() => {});

    localStorage.setItem('auth_rating', newRatingValue);
    saveAccountToMultiList(user.id, user.name, newRatingValue, user.profilePicUrl);
  }, [currentUser, appSettings.incognitoMode, saveAccountToMultiList]);

  // Auth Handlers
  const [authLoading, setAuthLoading] = useState(false);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    saveAccountToMultiList(userData.id, userData.name, userData.rating, userData.profilePicUrl);
    showToast("🔓", "Login successful! Welcome back.");
    setCurrentView('home');
    refreshCloudData(userData.id);
  };

  const handleLogin = async (userId, password) => {
    setAuthLoading(true);
    showToast("⏳", "Authenticating credentials...");
    try {
      const resData = await loginUserCloud(userId, password);
      if (resData && resData.status === "success") {
        const userData = {
          id: userId,
          name: resData.name,
          rating: parseFloat(resData.rating) || 120,
          studentClass: resData.studentClass || '',
          age: resData.age || '',
          profilePicUrl: resData.profilePicUrl || localStorage.getItem(`profile_img_${userId}`) || ''
        };
        localStorage.setItem('auth_userid', userId);
        localStorage.setItem('auth_name', userData.name);
        localStorage.setItem('auth_rating', userData.rating);
        if (userData.studentClass) localStorage.setItem('auth_class', userData.studentClass);
        if (userData.age) localStorage.setItem('auth_age', userData.age);

        handleLoginSuccess(userData);
      } else {
        showToast("❌", resData?.message || "Invalid User ID or Password!");
      }
    } catch (err) {
      showToast("❌", "Authentication request failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (formData) => {
    setAuthLoading(true);
    showToast("⏳", "Registering account into cloud...");
    try {
      const resData = await signupUserCloud(formData);
      if (resData && resData.status === "success") {
        showToast("🎉", "Registration complete! Logging in...");
        await handleLogin(formData.userId, formData.password);
      } else {
        showToast("❌", resData?.message || "User ID already taken!");
      }
    } catch (err) {
      showToast("❌", "Cloud registration error.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_userid');
    localStorage.removeItem('auth_name');
    localStorage.removeItem('auth_rating');
    localStorage.removeItem('auth_class');
    localStorage.removeItem('auth_age');
    setCurrentUser(null);
    setCurrentView('home');
    showToast("🚪", "Logged out successfully.");
  };

  const handleSwitchAccount = (targetUserId) => {
    const acc = savedAccounts.find(a => a.id === targetUserId);
    if (acc) {
      showToast("⏳", `Switching account to ${acc.name}...`);
      localStorage.setItem('auth_userid', acc.id);
      localStorage.setItem('auth_name', acc.name);
      localStorage.setItem('auth_rating', acc.rating);

      const switchedUser = {
        id: acc.id,
        name: acc.name,
        rating: acc.rating,
        studentClass: localStorage.getItem('auth_class') || '',
        age: localStorage.getItem('auth_age') || '',
        profilePicUrl: acc.profilePicUrl || localStorage.getItem(`profile_img_${acc.id}`) || ''
      };
      setCurrentUser(switchedUser);
      refreshCloudData(acc.id);
      setCurrentView('home');
      showToast("👤", `Active account: ${acc.name}`);
    }
  };

  const handleProfileImageUpload = async (file) => {
    if (!currentUser) return;
    showToast("⏳", "Cloudinary पर फोटो अपलोड हो रही है...");
    try {
      const res = await uploadDirectToCloudinary(file);
      const newUrl = typeof res === 'string' ? res : (res?.secure_url || res?.url);
      if (newUrl) {
        localStorage.setItem(`profile_img_${currentUser.id}`, newUrl);

        const updatedUser = { ...currentUser, profilePicUrl: newUrl };
        setCurrentUser(updatedUser);
        saveAccountToMultiList(currentUser.id, currentUser.name, currentUser.rating, newUrl);

        showToast("⏳", "गूगल शीट में सेव हो रही है...");
        await updateProfilePicCloud(currentUser.id, newUrl);
        showToast("📸", "प्रोफाइल फोटो सफलतापूर्वक सेव हो गई!");
        refreshCloudData(currentUser.id);
      } else {
        throw new Error("No URL returned from upload");
      }
    } catch (err) {
      showToast("❌", "फोटो अपलोड या सेव करने में त्रुटि!");
    }
  };

  // Test Flow Handlers
  const handleStartTest = () => {
    const questions = [];
    const scoresBreakdown = {};

    categories.forEach(cat => {
      const count = selectedCounts[cat.name] || 0;
      if (count > 0) {
        scoresBreakdown[cat.name] = { correct: 0, total: count };
        for (let i = 0; i < count; i++) {
          const { questionText, correctAnswer } = generateArithmeticExpression(
            cat.name,
            categoryDifficulty,
            appSettings.incognitoMode,
            appSettings.customPracticeTier,
            currentUser?.rating || 120
          );
          questions.push({
            category: cat.name,
            question: questionText,
            correctAnswer
          });
        }
      }
    });

    if (questions.length === 0) {
      showToast("⚠️", "Please select at least 1 question to start.");
      return;
    }

    // Shuffle questions
    questions.sort(() => Math.random() - 0.5);

    setTestState({
      questions,
      currentIndex: 0,
      correctCount: 0,
      scoresBreakdown,
      currentStreak: 0,
      wasLastWrong: false,
      overlayState: { show: false, isCorrect: false, message: '' }
    });

    setCurrentView('test');
  };

  const handleValidateAnswer = (isCorrect, debugMsg, secondsUsed, maxDuration) => {
    const curQ = testState.questions[testState.currentIndex];
    if (!curQ) return;

    playFeedbackBeep(isCorrect);

    const nextStreak = isCorrect ? testState.currentStreak + 1 : 0;
    const isTimerOn = Boolean(appSettings.globalTimer && appSettings.countdownEnabled[curQ.category]);
    const currentQLevel = categoryDifficulty[curQ.category] || 2;
    const squeeze = isSqueezeEligible(currentUser?.rating || 120, curQ.category);

    let updatedUserRating = currentUser?.rating || 120;
    if (!appSettings.incognitoMode) {
      updatedUserRating = calculateNewRating(
        currentUser?.rating || 120,
        isCorrect,
        currentQLevel,
        isTimerOn,
        secondsUsed || 0,
        maxDuration || 15,
        nextStreak,
        testState.wasLastWrong,
        squeeze
      );

      setCurrentUser(prev => prev ? ({ ...prev, rating: updatedUserRating }) : null);
      incrementTodaySolvedCount();
      syncRatingToCloud(updatedUserRating);
    } else {
      incrementTodaySolvedCount();
    }

    // Update Category Difficulty
    setCategoryDifficulty(prev => {
      const curLvl = prev[curQ.category] || 2;
      const nextLvl = isCorrect ? Math.min(3, curLvl + 1) : Math.max(1, curLvl - 1);
      const nextObj = { ...prev, [curQ.category]: nextLvl };
      localStorage.setItem('categoryDifficulty', JSON.stringify(nextObj));
      return nextObj;
    });

    // Update Test Scores breakdown
    const nextScoresBreakdown = { ...testState.scoresBreakdown };
    if (nextScoresBreakdown[curQ.category]) {
      if (isCorrect) {
        nextScoresBreakdown[curQ.category] = {
          ...nextScoresBreakdown[curQ.category],
          correct: nextScoresBreakdown[curQ.category].correct + 1
        };
      }
    }

    const nextCorrectCount = isCorrect ? testState.correctCount + 1 : testState.correctCount;

    setTestState(prev => ({
      ...prev,
      correctCount: nextCorrectCount,
      scoresBreakdown: nextScoresBreakdown,
      currentStreak: nextStreak,
      wasLastWrong: !isCorrect,
      overlayState: {
        show: true,
        isCorrect,
        message: debugMsg
      }
    }));

    // Auto advance after 1.2s
    setTimeout(() => {
      setTestState(prev => {
        const nextIdx = prev.currentIndex + 1;
        if (nextIdx >= prev.questions.length) {
          finishTestRun(nextCorrectCount, prev.questions.length, nextScoresBreakdown, updatedUserRating);
          return { ...prev, overlayState: { show: false, isCorrect: false, message: '' } };
        }
        return {
          ...prev,
          currentIndex: nextIdx,
          overlayState: { show: false, isCorrect: false, message: '' }
        };
      });
    }, 1200);
  };

  const finishTestRun = (correctCount, totalCount, scoresBreakdown, ratingAtFinish) => {
    const pct = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    let bonus = 0;

    let finalRating = ratingAtFinish;
    if (!appSettings.incognitoMode) {
      if (pct >= 90 && totalCount >= 5) {
        bonus = 0.5;
        finalRating = parseFloat((ratingAtFinish + 0.5).toFixed(1));
        setCurrentUser(prev => prev ? ({ ...prev, rating: finalRating }) : null);
        syncRatingToCloud(finalRating);
        showToast("🏆", "शानदार एक्यूरेसी! आपको +0.5 रेटिंग बोनस मिला।");
      }
    }

    setReportData({
      total: totalCount,
      correct: correctCount,
      percentage: pct,
      scoresBreakdown,
      newRating: finalRating,
      ratingBonus: bonus
    });

    setCurrentView('report');
  };

  const handleSaveReportToMarkdown = () => {
    if (!reportData) return;
    const newMd = appendScoreToMarkdown(
      reportData.total,
      reportData.correct,
      reportData.percentage,
      reportData.scoresBreakdown
    );
    setMarkdownContent(newMd);
    showToast("💾", "Score saved to calculation_score.md!");
    setCurrentView('scores');
  };

  const handleSaveSettings = (newSettings) => {
    setAppSettings(newSettings);
    localStorage.setItem('calcu_voice_settings', JSON.stringify(newSettings));
    showToast("⚙️", "Settings saved successfully!");
    setCurrentView('home');
  };

  const handleResetAIDifficulty = () => {
    const resetDiff = {};
    categories.forEach(c => { resetDiff[c.name] = 2; });
    setCategoryDifficulty(resetDiff);
    localStorage.setItem('categoryDifficulty', JSON.stringify(resetDiff));

    if (currentUser) {
      const resetRating = 120;
      setCurrentUser(prev => prev ? ({ ...prev, rating: resetRating }) : null);
      syncRatingToCloud(resetRating);
    }
    showToast("🔄", "AI डिफिकल्टी और रेटिंग को रीसेट कर दिया गया है!");
    setCurrentView('home');
  };

  // Top 3 Players for Home Podium
  const sortedPlayers = [...playersList].sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
  const topPlayers = [sortedPlayers[0], sortedPlayers[1], sortedPlayers[2]];

  const isAdminUser = currentUser?.id?.toLowerCase() === "shivam@123";

  // If not authenticated, display the AuthGate
  if (!currentUser) {
    return (
      <div className="h-full flex flex-col justify-between overflow-x-hidden">
        <AuthView onLogin={handleLogin} onSignup={handleSignup} loading={authLoading} />
        <Toast toast={toast} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-between overflow-x-hidden">
      {/* Top Header Navbar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => setCurrentView('home')}
          >
            <div className="bg-gradient-to-tr from-indigo-500 to-indigo-700 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                CALCU-VOICE
              </h1>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
                Voice Calculation Trainer
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentView('settings')}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition flex items-center"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-indigo-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-6 pb-24 flex flex-col justify-start">
        {currentView === 'home' && (
          <HomeView
            onStartPlay={() => setCurrentView('customize')}
            currentUser={currentUser}
            topPlayers={topPlayers}
          />
        )}

        {currentView === 'customize' && (
          <CustomizeView
            selectedCounts={selectedCounts}
            onUpdateCount={(catName, count) => {
              setSelectedCounts(prev => ({ ...prev, [catName]: count }));
            }}
            onResetCounts={() => {
              const def = {};
              categories.forEach(c => { def[c.name] = c.defaultCount || 0; });
              setSelectedCounts(def);
              showToast("🔄", "Counts reset to defaults.");
            }}
            onPresetQuick={() => {
              const fiveAll = {};
              categories.forEach(c => { fiveAll[c.name] = 5; });
              setSelectedCounts(fiveAll);
              showToast("⚡", "All categories set to 5 questions!");
            }}
            onProceed={() => {
              const total = Object.values(selectedCounts).reduce((a, b) => a + (b || 0), 0);
              if (total === 0) {
                showToast("⚠️", "Please select at least 1 question.");
                return;
              }
              setCurrentView('overview');
            }}
          />
        )}

        {currentView === 'overview' && (
          <OverviewView
            selectedCounts={selectedCounts}
            appSettings={appSettings}
            onBack={() => setCurrentView('customize')}
            onStartTest={handleStartTest}
          />
        )}

        {currentView === 'test' && (
          <TestView
            testState={testState}
            appSettings={appSettings}
            onValidateAnswer={handleValidateAnswer}
            onForceSubmit={() => {
              finishTestRun(
                testState.correctCount,
                testState.questions.length,
                testState.scoresBreakdown,
                currentUser?.rating || 120
              );
            }}
          />
        )}

        {currentView === 'report' && (
          <ReportView
            reportData={reportData}
            currentUser={currentUser}
            onReturnHome={() => setCurrentView('home')}
            onSaveToMarkdown={handleSaveReportToMarkdown}
          />
        )}

        {currentView === 'scores' && (
          <ScoresView
            markdownContent={markdownContent}
            onClearHistory={() => {
              localStorage.setItem('calculation_score_md', defaultMarkdown);
              setMarkdownContent(defaultMarkdown);
            }}
            onShowToast={showToast}
          />
        )}

        {currentView === 'leaderboard' && (
          <LeaderboardView
            players={playersList}
            currentUser={currentUser}
            onRefresh={() => refreshCloudData(currentUser?.id)}
            loading={isCloudLoading}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            savedAccounts={savedAccounts}
            onLogout={handleLogout}
            onSwitchAccount={handleSwitchAccount}
            onUploadProfilePic={handleProfileImageUpload}
          />
        )}

        {currentView === 'settings' && (
          <SettingsView
            appSettings={appSettings}
            currentUser={currentUser}
            onSaveSettings={handleSaveSettings}
            onResetAIDifficulty={handleResetAIDifficulty}
            onLogout={handleLogout}
          />
        )}

        {currentView === 'admin' && (
          <AdminView
            players={playersList}
            onRefreshPlayers={() => refreshCloudData(currentUser?.id)}
            onRegisterStudent={async (newStd) => {
              showToast("⏳", "Creating account on cloud...");
              try {
                const res = await signupUserCloud(newStd);
                if (res.status === "success") {
                  showToast("🎉", `Account created for ${newStd.name}!`);
                  refreshCloudData(currentUser?.id);
                } else {
                  showToast("❌", "User ID already taken!");
                }
              } catch (err) {
                showToast("❌", "Cloud connection error.");
              }
            }}
            onUpdateStudent={async (std) => {
              showToast("⏳", `Updating ${std.name}...`);
              try {
                await updateUserCloud(std);
                showToast("✅", "Account updated successfully!");
                refreshCloudData(currentUser?.id);
              } catch (err) {
                showToast("❌", "Failed to update account.");
              }
            }}
            onDeleteStudent={async (userId, name) => {
              showToast("⏳", `Deleting ${name}...`);
              try {
                await deleteUserCloud(userId);
                showToast("🗑️", `${name} deleted successfully!`);
                refreshCloudData(currentUser?.id);
              } catch (err) {
                showToast("❌", "Failed to delete student.");
              }
            }}
            onShowToast={showToast}
            loading={isCloudLoading}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/90 border-t border-slate-800/90 backdrop-blur-xl z-40 px-4 py-2 flex justify-around items-center text-xs">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center space-y-1 transition ${
            currentView === 'home' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-indigo-300'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => setCurrentView('scores')}
          className={`flex flex-col items-center space-y-1 transition ${
            currentView === 'scores' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-indigo-300'
          }`}
        >
          <BarChart2 className="w-5 h-5" />
          <span className="text-[10px]">Score History</span>
        </button>

        <button
          onClick={() => setCurrentView('leaderboard')}
          className={`flex flex-col items-center space-y-1 transition ${
            currentView === 'leaderboard' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-indigo-300'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[10px]">Leaderboard</span>
        </button>

        <button
          onClick={() => setCurrentView('profile')}
          className={`flex flex-col items-center space-y-1 transition ${
            currentView === 'profile' ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-indigo-300'
          }`}
        >
          <div className="w-5 h-5 rounded-full flex items-center justify-center overflow-hidden border border-slate-700">
            {currentUser?.profilePicUrl ? (
              <img src={currentUser.profilePicUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-3.5 h-3.5" />
            )}
          </div>
          <span className="text-[10px]">Profile</span>
        </button>

        {isAdminUser && (
          <button
            onClick={() => setCurrentView('admin')}
            className={`flex flex-col items-center space-y-1 transition ${
              currentView === 'admin' ? 'text-rose-400 font-bold' : 'text-rose-400/80 hover:text-rose-300'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="text-[10px]">Admin</span>
          </button>
        )}
      </nav>

      {/* Global Toast */}
      <Toast toast={toast} />
    </div>
  );
}
