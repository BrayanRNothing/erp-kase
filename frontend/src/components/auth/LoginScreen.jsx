import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    if (!result.success) toast.error(result.error);
    setLoading(false);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative w-full max-w-sm bg-slate-50/90 backdrop-blur-3xl rounded-[3rem] border-[6px] border-white z-10"
        style={{ boxShadow: 'inset 0 10px 0 rgba(255,255,255,1), inset 0 -10px 0 rgba(0,0,0,0.03), 0 32px 64px rgba(0,0,0,0.15)' }}
      >
        {/* Main Card Toon Reflections */}
        <div className="absolute top-5 right-8 w-24 h-4 bg-white rounded-full opacity-100 rotate-[-12deg] pointer-events-none z-0" />
        <div className="absolute top-14 right-6 w-4 h-4 bg-white rounded-full opacity-100 pointer-events-none z-0" />
        <div className="absolute bottom-10 left-6 w-16 h-3 bg-white rounded-full opacity-60 pointer-events-none z-0" />

        <div className="p-10 relative z-20">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img src="/logokase.png" alt="Kase Logo" className="h-20 w-auto object-contain" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <label className="block text-[11px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-2">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-100/50 border-4 border-white shadow-[inset_0_4px_8px_rgba(0,0,0,0.04)] rounded-[1.5rem] text-slate-800 font-bold text-sm placeholder:text-slate-300 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100/50 focus:bg-white transition-all peer"
                  placeholder="admin"
                  required
                />
                {/* Input Reflection */}
                <div className="absolute top-2 right-4 w-8 h-1.5 bg-white rounded-full opacity-80 pointer-events-none peer-focus:opacity-100 transition-opacity rotate-[-8deg]" />
              </div>
            </div>

            <div className="relative group mt-5">
              <label className="block text-[11px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-100/50 border-4 border-white shadow-[inset_0_4px_8px_rgba(0,0,0,0.04)] rounded-[1.5rem] text-slate-800 font-bold text-sm placeholder:text-slate-300 focus:outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100/50 focus:bg-white transition-all peer"
                  placeholder="••••••••"
                  required
                />
                {/* Input Reflection */}
                <div className="absolute top-2 right-4 w-8 h-1.5 bg-white rounded-full opacity-80 pointer-events-none peer-focus:opacity-100 transition-opacity rotate-[-8deg]" />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.96 }}
              className="relative w-full mt-8 py-5 bg-indigo-500 hover:bg-indigo-600 text-white border-[4px] border-white rounded-[1.75rem] text-lg font-black tracking-wide transition-all flex items-center justify-center gap-3 group disabled:opacity-50 shadow-[inset_0_4px_0_rgba(255,255,255,0.5),_inset_0_-4px_0_rgba(0,0,0,0.1),_0_12px_24px_rgba(0,0,0,0.15)] overflow-hidden"
            >
              {/* Button Reflections */}
              <div className="absolute top-2 right-6 w-12 h-2.5 bg-white rounded-full opacity-70 pointer-events-none rotate-[-12deg]" />
              <div className="absolute top-5 right-3 w-2.5 h-2.5 bg-white rounded-full opacity-70 pointer-events-none" />

              <span className="relative z-10 drop-shadow-sm">{loading ? 'Signing in…' : 'Sign In'}</span>
              {!loading && <ArrowRight size={22} strokeWidth={3} className="relative z-10 group-hover:translate-x-1.5 transition-transform drop-shadow-sm" />}
            </motion.button>
          </form>
        </div>
      </motion.div>
      
      {/* Decorative floating shapes for the background */}
      <div className="fixed top-20 left-20 w-32 h-32 bg-indigo-300 rounded-[3rem] blur-xl opacity-30 animate-pulse" />
      <div className="fixed bottom-20 right-20 w-48 h-48 bg-purple-300 rounded-full blur-2xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
}
