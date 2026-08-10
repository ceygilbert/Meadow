import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, ShieldCheck, Laptop, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log("Attempting sign in for:", email);
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error("Auth error:", authError);
        throw authError;
      }

      console.log("Auth success, checking profile for session:", data.session?.user?.id);

      if (data.session) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single();

        if (profileError || !profile) {
          console.error("Profile check error:", profileError || "No profile found");
          await supabase.auth.signOut();
          setError(`Profile not found for ${email}. Please ensure you have an account.`);
          return;
        }

        console.log("Profile role check:", profile.role);

        if (profile.role !== 'admin') {
          console.warn("Unauthorized access attempt by non-admin:", email);
          await supabase.auth.signOut();
          setError('Access Denied: You do not have administrative privileges.');
          return;
        }

        onLogin(true);
        console.log("Navigating to dashboard...");
        navigate('/admin/dashboard');
      } else {
        console.warn("No session returned from Supabase sign in");
        setError("Sign in succeeded but no session was created. Please try again.");
      }
    } catch (err: any) {
      console.error("Catch block in login:", err);
      setError(err.message || 'An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1a19] p-2 md:p-4 lg:p-6 flex items-center justify-center font-sans">
      <div className="w-full max-w-[1440px] min-h-[92vh] bg-[#1c1a19] rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl border border-white/5">
        
        {/* Left Dark Hero Side */}
        <div className="lg:col-span-5 xl:col-span-6 bg-[#1c1a19] p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden text-white">
          
          {/* Subtle concentric rings background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] md:w-[600px] md:h-[600px] border border-white/5 rounded-full pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] border border-white/10 rounded-full pointer-events-none"></div>
          
          {/* Top Slogan */}
          <div className="relative z-10 max-w-sm">
            <p className="text-slate-400 text-xs md:text-sm font-normal tracking-wide leading-relaxed">
              Next-generation IT solutions made simple – hardware management for you.
            </p>
          </div>

          {/* Main Visual Showcase */}
          <div className="my-12 lg:my-0 flex flex-col items-center justify-center relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-normal text-white tracking-tight leading-[1.1] mb-12 max-w-md">
              Manage <br />
              <span className="font-semibold text-slate-100">your hardware</span>
            </h2>

            {/* Mobile / Screen Mockup Graphic */}
            <div className="relative w-64 md:w-72 bg-gradient-to-b from-slate-900 to-black rounded-[2.5rem] p-3 border-4 border-slate-700/60 shadow-2xl shadow-black/80">
              {/* Phone Speaker Notch */}
              <div className="w-20 h-4 bg-slate-950 rounded-full mx-auto mb-3 flex items-center justify-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
              </div>

              {/* Inner Dashboard UI preview */}
              <div className="bg-[#121214] rounded-[2rem] p-4 text-left border border-white/10 space-y-4">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>Week 4-10 August</span>
                  <BarChart3 size={14} className="text-rose-500" />
                </div>

                <div>
                  <div className="text-2xl font-bold text-white tracking-tight">
                    RM 89,700 <span className="text-xs text-emerald-400 font-normal">↑ 14%</span>
                  </div>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">Total System Inventory Value</p>
                </div>

                {/* Bar chart graphics */}
                <div className="flex items-end justify-between gap-1.5 h-16 pt-2 pb-1 px-1 border-b border-white/10">
                  <div className="w-full bg-slate-800 rounded-t h-[40%]"></div>
                  <div className="w-full bg-slate-800 rounded-t h-[60%]"></div>
                  <div className="w-full bg-rose-500 rounded-t h-[85%]"></div>
                  <div className="w-full bg-slate-800 rounded-t h-[50%]"></div>
                  <div className="w-full bg-orange-500 rounded-t h-[95%]"></div>
                  <div className="w-full bg-slate-800 rounded-t h-[35%]"></div>
                  <div className="w-full bg-slate-800 rounded-t h-[70%]"></div>
                </div>

                {/* Stock category cards */}
                <div className="space-y-2 pt-1">
                  <div className="p-2 bg-slate-900/90 rounded-xl flex items-center justify-between border border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                        <Laptop size={12} />
                      </div>
                      <span className="text-xs font-medium text-slate-200">Gaming Laptops</span>
                    </div>
                    <span className="text-xs font-bold text-white">42 units</span>
                  </div>

                  <div className="p-2 bg-slate-900/90 rounded-xl flex items-center justify-between border border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                        <ShieldCheck size={12} />
                      </div>
                      <span className="text-xs font-medium text-slate-200">Desktop Rigs</span>
                    </div>
                    <span className="text-xs font-bold text-white">28 units</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Footer Badge */}
          <div className="relative z-10 flex items-center gap-2 text-slate-500 text-xs">
            <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-bold">
              ✓
            </span>
            <span>Enterprise Admin Portal</span>
          </div>
        </div>

        {/* Right Light Sign In Side */}
        <div className="lg:col-span-7 xl:col-span-6 bg-white rounded-[2.5rem] lg:rounded-[3rem] p-8 md:p-12 lg:p-16 flex flex-col justify-between">
          
          {/* Top Row: Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="12" stroke="url(#logo_grad_main)" strokeWidth="4" />
                <defs>
                  <linearGradient id="logo_grad_main" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#f97316" />
                    <stop offset="0.5" stopColor="#ef4444" />
                    <stop offset="1" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-2xl font-semibold tracking-tight text-slate-900">Meadow IT</span>
            </div>
            
            {/* No register button or language selector as requested */}
            <div></div>
          </div>

          {/* Center Form Container */}
          <div className="max-w-md w-full mx-auto my-12 lg:my-auto">
            <h1 className="text-4xl lg:text-5xl font-normal text-slate-900 mb-8 md:mb-10 tracking-tight">
              Sign In
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-rose-50 text-rose-600 text-xs font-semibold rounded-2xl border border-rose-200 text-center">
                  {error}
                </div>
              )}

              {/* Email / Username field */}
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or Username"
                  required
                  className="w-full h-14 px-6 rounded-full bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all text-sm md:text-base font-normal shadow-sm"
                />
              </div>

              {/* Password field */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full h-14 pl-6 pr-14 rounded-full bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all text-sm md:text-base font-normal shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* No forget password link as requested */}

              {/* Sign In Button with orange-red-pink gradient */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 mt-4 rounded-full bg-gradient-to-r from-[#ff4d00] via-[#ff2a5f] to-[#e6005c] hover:opacity-95 text-white font-medium text-base shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ArrowRight size={20} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Bottom Footer */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-6">
            <span>&copy; 2005-{new Date().getFullYear()} Meadow IT Inc.</span>
            <a href="#contact" className="hover:text-slate-600 transition-colors font-medium">
              Contact Us
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
