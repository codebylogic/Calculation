import React, { useState } from 'react';
import { LogIn, UserPlus, Sparkles, Shield, User, Lock, BookOpen, Clock } from 'lucide-react';

export default function AuthView({ onLogin, onSignup, loading }) {
  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    studentClass: '',
    age: '',
    userId: '',
    password: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.studentClass || !formData.age || !formData.userId || !formData.password) {
      alert("कृपया सभी बॉक्स भरें (Please fill all fields)!");
      return;
    }
    onSignup(formData);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!formData.userId || !formData.password) {
      alert("कृपया User ID और Password दर्ज करें!");
      return;
    }
    onLogin(formData.userId, formData.password);
  };

  return (
    <section className="flex-grow flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-slate-900/70 border border-slate-800/90 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
            {isSignup ? <UserPlus className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {isSignup ? "Create Account 🚀" : "Welcome Back 🔑"}
          </h2>
          <p className="text-xs text-slate-400">
            {isSignup
              ? "कैलकुलेशन प्रतियोगिता में शामिल होने के लिए साइन-अप करें।"
              : "आगे खेलने के लिए अपने क्रेडेंशियल्स से लॉग-इन करें।"}
          </p>
        </div>

        {isSignup ? (
          <form onSubmit={handleSignupSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Full Name (पूरा नाम)</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="अपना असली नाम (e.g. Rahul Sharma)"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Class (कक्षा)</label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 8th, 10th"
                    value={formData.studentClass}
                    onChange={(e) => handleChange('studentClass', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Age (उम्र)</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="number"
                    required
                    placeholder="e.g. 14"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Unique User ID (यूनिक आईडी)</label>
              <div className="relative">
                <Shield className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. rahul@10"
                  value={formData.userId}
                  onChange={(e) => handleChange('userId', e.target.value.toLowerCase().trim())}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Create Password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white rounded-xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2"
            >
              <span>{loading ? "Registering..." : "Sign Up & Register"}</span>
            </button>

            <p className="text-[11px] text-center text-slate-400 pt-2">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignup(false)}
                className="text-indigo-400 font-bold hover:underline"
              >
                Log In here
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">User ID</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Enter User ID (e.g. rahul@10 or shivam@123)"
                  value={formData.userId}
                  onChange={(e) => handleChange('userId', e.target.value.toLowerCase().trim())}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white rounded-xl transition shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2"
            >
              <span>{loading ? "Authenticating..." : "Log In"}</span>
            </button>

            <p className="text-[11px] text-center text-slate-400 pt-2">
              New here?{' '}
              <button
                type="button"
                onClick={() => setIsSignup(true)}
                className="text-indigo-400 font-bold hover:underline"
              >
                Create an account
              </button>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
