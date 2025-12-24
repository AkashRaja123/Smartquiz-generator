
import React, { useState } from 'react';
import { UserAccount } from '../types';

interface AuthProps {
  onLogin: (user: UserAccount) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ email, name: fullName || email.split('@')[0] });
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[2.5rem] shadow-2xl border border-slate-50">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          <i className="fas fa-lock text-xl"></i>
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          {view === 'login' ? 'Welcome Back' : 'Get Started'}
        </h2>
        <p className="text-slate-500 mt-3 font-medium">
          Professional Adaptive Learning Portal
        </p>
      </div>

      <form onSubmit={handleAction} className="space-y-6">
        {view === 'signup' && (
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 outline-none transition-all font-medium"
              placeholder="Enter your name"
            />
          </div>
        )}
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Work Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 outline-none transition-all font-medium"
            placeholder="name@company.com"
          />
        </div>
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-slate-900/5 outline-none transition-all font-medium"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl active:scale-95 text-lg"
        >
          {view === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <div className="mt-10 text-center">
        <button
          onClick={() => setView(view === 'login' ? 'signup' : 'login')}
          className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          {view === 'login' ? "New here? Join the platform" : "Already registered? Log in here"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
