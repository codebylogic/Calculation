import React, { useState, useEffect } from 'react';
import { Shield, Lock, Unlock, RefreshCw, Plus, Edit, Trash2, X, Check, Key } from 'lucide-react';

const ADMIN_FALLBACK_PIN = "7368";

function getDynamicTimePin() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();

  hours = hours % 12;
  if (hours === 0) hours = 12;

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');

  return `${hh}${mm}`;
}

export default function AdminView({
  players,
  onRefreshPlayers,
  onRegisterStudent,
  onUpdateStudent,
  onDeleteStudent,
  onShowToast,
  loading
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);

  const [newStudent, setNewStudent] = useState({
    name: '',
    studentClass: '',
    age: '',
    userId: '',
    password: ''
  });

  const handleUnlock = (e) => {
    e.preventDefault();
    const expectedTimePin = getDynamicTimePin();
    const cleanPin = pinInput.trim();

    if (cleanPin === expectedTimePin || cleanPin === ADMIN_FALLBACK_PIN) {
      setIsAuthenticated(true);
      setPinInput('');
      onShowToast?.("🔓", "Admin Access Granted!");
      onRefreshPlayers();
    } else {
      onShowToast?.("❌", "Wrong PIN! (Try hhmm time format)");
    }
  };

  const handleLock = () => {
    setIsAuthenticated(false);
    setPinInput('');
    setEditingStudent(null);
    onShowToast?.("🔒", "Admin panel locked.");
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.studentClass || !newStudent.age || !newStudent.userId || !newStudent.password) {
      onShowToast?.("⚠️", "कृपया सभी बॉक्स भरें (Please fill all fields)!");
      return;
    }
    onRegisterStudent(newStudent);
    setNewStudent({ name: '', studentClass: '', age: '', userId: '', password: '' });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingStudent) return;
    onUpdateStudent(editingStudent);
    setEditingStudent(null);
  };

  const handleDelete = (student) => {
    onDeleteStudent(student.id, student.name);
  };

  return (
    <section className="space-y-6 animate-fade-in max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <span>🛠️ Admin Control Panel</span>
          </h2>
          <p className="text-xs text-slate-400">Calcu-Voice Cloud Student Management System</p>
        </div>
        <span className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-full font-bold">
          Secure Access
        </span>
      </div>

      {!isAuthenticated ? (
        /* Password Lock Screen */
        <div className="max-w-md mx-auto w-full pt-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">🔒 Admin Authentication</h3>
              <p className="text-xs text-slate-400">
                कृपया एडमिन पैनल खोलने के लिए अपना गुप्त पिन (hhmm Time PIN) दर्ज करें।
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-3">
              <input
                type="password"
                placeholder="Enter 4-digit PIN..."
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-center text-base text-white focus:outline-none focus:border-rose-500 tracking-widest font-mono"
              />

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-rose-600/20 flex items-center justify-center space-x-2"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Unlock Panel</span>
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Authenticated Admin Dashboard */
        <div className="space-y-6">
          {/* Quick Stats Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase">Total Students</h4>
                <p className="text-2xl font-black text-indigo-400 font-mono mt-0.5">
                  {players?.length || 0}
                </p>
              </div>
              <button
                onClick={onRefreshPlayers}
                disabled={loading}
                className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition flex items-center space-x-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
              </button>
            </div>

            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase">Admin Session</h4>
                <p className="text-xs font-bold text-emerald-400 mt-1">● Active & Secure</p>
              </div>
              <button
                onClick={handleLock}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center space-x-1"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Panel</span>
              </button>
            </div>
          </div>

          {/* New Student Registration Form */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-extrabold text-slate-200 flex items-center space-x-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>👤 Register New Student Account</span>
            </h3>
            <p className="text-xs text-slate-400">
              यहाँ से आप किसी भी नए छात्र का अकाउंट सीधे गूगल शीट व डेटाबेस में बना सकते हैं।
            </p>

            <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
              <input
                type="text"
                required
                placeholder="Full Name (असली नाम)"
                value={newStudent.name}
                onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                required
                placeholder="Class (कक्षा जैसे: 8th)"
                value={newStudent.studentClass}
                onChange={(e) => setNewStudent(prev => ({ ...prev, studentClass: e.target.value }))}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <input
                type="number"
                required
                placeholder="Age (उम्र)"
                value={newStudent.age}
                onChange={(e) => setNewStudent(prev => ({ ...prev, age: e.target.value }))}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                required
                placeholder="Create User ID (यूनिक)"
                value={newStudent.userId}
                onChange={(e) => setNewStudent(prev => ({ ...prev, userId: e.target.value.toLowerCase().trim() }))}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
              <input
                type="password"
                required
                placeholder="Create Password"
                value={newStudent.password}
                onChange={(e) => setNewStudent(prev => ({ ...prev, password: e.target.value }))}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white rounded-xl transition shadow-lg shadow-indigo-600/20"
              >
                Create Student Account
              </button>
            </form>
          </div>

          {/* Student Management Table */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300">
                User Details & Ratings Management
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/40 border-b border-slate-800 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                    <th className="p-3.5 sm:p-4">User ID</th>
                    <th className="p-3.5 sm:p-4">Name</th>
                    <th className="p-3.5 sm:p-4">Password</th>
                    <th className="p-3.5 sm:p-4 text-center">Class</th>
                    <th className="p-3.5 sm:p-4 text-center">Age</th>
                    <th className="p-3.5 sm:p-4 text-center">Elo Rating</th>
                    <th className="p-3.5 sm:p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                  {players && players.length > 0 ? (
                    players.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-900/30 transition">
                        <td className="p-3.5 sm:p-4 font-mono text-slate-400 select-all">{p.id}</td>
                        <td className="p-3.5 sm:p-4 font-bold text-slate-200">{p.name}</td>
                        <td className="p-3.5 sm:p-4 font-mono text-slate-400">{p.password || '***'}</td>
                        <td className="p-3.5 sm:p-4 text-center text-slate-300">{p.studentClass || '-'}</td>
                        <td className="p-3.5 sm:p-4 text-center text-slate-300">{p.age || '-'}</td>
                        <td className="p-3.5 sm:p-4 text-center font-mono font-extrabold text-indigo-400">
                          {p.rating}
                        </td>
                        <td className="p-3.5 sm:p-4 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              onClick={() => setEditingStudent({ ...p })}
                              className="px-2 py-1 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg transition font-bold text-[11px] flex items-center space-x-1"
                            >
                              <Edit className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(p)}
                              className="px-2 py-1 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg transition font-bold text-[11px] flex items-center space-x-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                        No students found in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Student Modal */}
          {editingStudent && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <Edit className="w-4 h-4 text-indigo-400" />
                    <span>Edit User Details</span>
                  </h3>
                  <button
                    onClick={() => setEditingStudent(null)}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveEdit} className="space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-400 font-bold">User ID (Read Only)</label>
                    <input
                      type="text"
                      readOnly
                      value={editingStudent.id}
                      className="w-full px-3 py-2 bg-slate-950/50 border border-slate-800 rounded-xl text-xs text-slate-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-bold">Name</label>
                    <input
                      type="text"
                      required
                      value={editingStudent.name}
                      onChange={(e) => setEditingStudent(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-bold">Password</label>
                    <input
                      type="text"
                      required
                      value={editingStudent.password || ''}
                      onChange={(e) => setEditingStudent(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 font-bold">Class</label>
                      <input
                        type="text"
                        value={editingStudent.studentClass || ''}
                        onChange={(e) => setEditingStudent(prev => ({ ...prev, studentClass: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 font-bold">Age</label>
                      <input
                        type="number"
                        value={editingStudent.age || ''}
                        onChange={(e) => setEditingStudent(prev => ({ ...prev, age: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-bold">Elo Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={editingStudent.rating}
                      onChange={(e) => setEditingStudent(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-indigo-400 font-mono font-bold focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingStudent(null)}
                      className="w-1/2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
