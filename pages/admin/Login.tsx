
import React, { useState } from 'react';
import { Lock, Mail, LogIn, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface LoginProps {
  onLogin: (status: boolean) => void;
}

const AdminLogin: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.session) {
        onLogin(true);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f2fe] via-[#dbeafe] to-[#e0e7ff] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements to simulate the reference arcs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/20 rounded-full -z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-white/10 rounded-full -z-0"></div>

      <div className="max-w-[460px] w-full bg-white/70 backdrop-blur-2xl rounded-[3.5rem] p-10 md:p-14 shadow-2xl shadow-blue-900/10 border border-white/60 relative z-10">
        
        {/* Top Icon Box */}
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-slate-100">
            <LogIn size={26} className="text-slate-900" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-[1.75rem] font-bold text-slate-900 mb-3 tracking-tight">Sign in with email</h1>
          <p className="text-slate-500 text-sm leading-relaxed px-4">
            Access the TechCore administrative console to manage your digital inventory, brands, and store operations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 bg-rose-50/50 text-rose-600 text-xs font-semibold rounded-2xl border border-rose-100 text-center animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-100/50 border-none rounded-[1.25rem] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                placeholder="Email"
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-slate-100/50 border-none rounded-[1.25rem] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400 font-medium"
                placeholder="Password"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end pr-1">
            <button type="button" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 bg-slate-900 hover:bg-black text-white font-bold rounded-[1.25rem] transition-all shadow-xl shadow-slate-900/20 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>Sign In</>
            )}
          </button>
        </form>
        
        <div className="mt-12 text-center">
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
             &copy; {new Date().getFullYear()} TechCore IT Solutions
           </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
