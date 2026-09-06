import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';

interface LoginProps {
  onLogin: (status: boolean) => void;
}

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/Red%20Full%20Logo.png";

// SVG Wireframe Hexagon helper component
const WireframeHexagon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 64 }) => (
  <svg 
    width={size} 
    height={Math.round(size * 1.1547)} 
    viewBox="0 0 100 115.47" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <polygon 
      points="50,2 98,29.87 98,85.6 50,113.47 2,85.6 2,29.87" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinejoin="round" 
    />
  </svg>
);

const AdminLogin: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Load saved username if remember me was active
  useEffect(() => {
    const saved = localStorage.getItem('meadow_admin_remembered_username');
    if (saved) {
      setEmail(saved);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cleanEmail = email.trim();
      if (rememberMe) {
        localStorage.setItem('meadow_admin_remembered_username', cleanEmail);
      } else {
        localStorage.removeItem('meadow_admin_remembered_username');
      }

      console.log("Attempting sign in for:", cleanEmail);
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (data.session) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        if (profileError || !profile) {
          console.error("Profile check error:", profileError || "No profile found");
          await supabase.auth.signOut();
          setError(`Profile not found for ${cleanEmail}. Please ensure you have an administrator account.`);
          return;
        }

        if (profile.role !== 'admin' && profile.role !== 'superadmin') {
          console.warn("Unauthorized access attempt by non-admin:", cleanEmail);
          await supabase.auth.signOut();
          setError('Access Denied: You do not have administrative privileges.');
          return;
        }

        // Cache the verified admin profile immediately for synchronous authentication
        try {
          localStorage.setItem(`meadow_auth_profile_${data.session.user.id}`, JSON.stringify(profile));
          localStorage.setItem('meadow_auth_profile_current', JSON.stringify(profile));
          localStorage.setItem('meadow_last_active_user_id', data.session.user.id);
        } catch (e) {
          console.warn("Failed to cache profile in localStorage:", e);
        }

        // --- NEW: Log login to txt file via backend API ---
        try {
          fetch('/api/log-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: cleanEmail,
              role: profile.role,
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent
            })
          }).catch(err => console.warn("Failed to send login log:", err));
        } catch (e) {
          console.warn("Error calling log api", e);
        }
        // ------------------------------------------------

        onLogin(true);
        navigate('/admin/dashboard');
      } else {
        setError("Sign in succeeded but no session was created. Please try again.");
      }
    } catch (err: any) {
      console.error("Catch block in login:", err);
      setError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F4F7FB] font-sans">
      
      {/* LEFT SECTION: Hero Illustration with Hexagonal Composition */}
      <div className="w-full lg:w-[58%] xl:w-[60%] flex flex-col justify-between bg-[#F4F7FB] p-8 sm:p-12 md:p-16 lg:p-20 relative overflow-hidden min-h-[600px] lg:min-h-screen">
        
        {/* Top Headline */}
        <div className="relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1a2b49] tracking-tight leading-[1.18] max-w-xl"
          >
            Set Your Online Business<br />
            in One Platform
          </motion.h1>
        </div>

        {/* Center Hexagonal Visual Showcase */}
        <div className="relative w-full max-w-[580px] h-[480px] sm:h-[540px] md:h-[580px] mx-auto my-auto flex items-center justify-center select-none">
          
          {/* Decorative Background Outline Hexagon: Top-Left */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.7, scale: 1, y: [0, -6, 0] }}
            transition={{ opacity: { duration: 0.8 }, y: { repeat: Infinity, duration: 6, ease: 'easeInOut' } }}
            className="absolute top-10 left-4 sm:left-12 z-0"
          >
            <WireframeHexagon size={48} className="text-slate-300" />
          </motion.div>

          {/* Decorative Background Outline Hexagon: Right of Center */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.5, scale: 1, y: [0, 8, 0] }}
            transition={{ opacity: { duration: 0.8 }, y: { repeat: Infinity, duration: 7, ease: 'easeInOut' } }}
            className="absolute top-44 right-2 sm:right-6 z-0"
          >
            <WireframeHexagon size={64} className="text-slate-300" />
          </motion.div>

          {/* Decorative Background Outline Hexagon: Bottom-Right */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35, y: [0, -5, 0] }}
            transition={{ opacity: { duration: 0.8 }, y: { repeat: Infinity, duration: 8, ease: 'easeInOut' } }}
            className="absolute bottom-8 right-16 sm:right-28 z-0"
          >
            <WireframeHexagon size={72} className="text-slate-300" />
          </motion.div>

          {/* MAIN CENTRAL HERO HEXAGON (Celebrating Person in Peach Hexagon) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative z-10 w-[270px] h-[312px] sm:w-[320px] sm:h-[370px] md:w-[350px] md:h-[404px] filter drop-shadow-xl"
          >
            {/* Peach-Coral Hexagon Background */}
            <div 
              className="w-full h-full bg-gradient-to-tr from-[#ffe6e1] via-[#ffd5cc] to-[#ffbcae] flex items-center justify-center overflow-hidden"
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" 
                alt="Meadow Specialist"
                className="w-full h-full object-cover object-top scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          {/* TOP-RIGHT HEXAGON (Coral Red background with smiling man) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
            transition={{ duration: 0.6, delay: 0.2, y: { repeat: Infinity, duration: 5, ease: 'easeInOut' } }}
            className="absolute top-4 sm:top-8 right-8 sm:right-16 z-20 w-[95px] h-[110px] sm:w-[115px] sm:h-[133px] filter drop-shadow-md"
          >
            <div 
              className="w-full h-full bg-[#E84F3D] flex items-center justify-center overflow-hidden"
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" 
                alt="Hardware Lead"
                className="w-full h-full object-cover object-center scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          {/* MID-RIGHT HEXAGON (Soft Blue background with smiling bearded technician) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1, y: [0, 6, 0] }}
            transition={{ duration: 0.6, delay: 0.3, y: { repeat: Infinity, duration: 6, ease: 'easeInOut' } }}
            className="absolute top-48 sm:top-56 right-4 sm:right-10 z-20 w-[85px] h-[98px] sm:w-[100px] sm:h-[115px] filter drop-shadow-md"
          >
            <div 
              className="w-full h-full bg-[#70B8D0] flex items-center justify-center overflow-hidden"
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80" 
                alt="System Engineer"
                className="w-full h-full object-cover object-center scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          {/* BOTTOM-LEFT HEXAGON (Golden Yellow/Amber background with smiling woman) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
            transition={{ duration: 0.6, delay: 0.25, y: { repeat: Infinity, duration: 5.5, ease: 'easeInOut' } }}
            className="absolute bottom-12 sm:bottom-16 left-6 sm:left-14 z-20 w-[95px] h-[110px] sm:w-[115px] sm:h-[133px] filter drop-shadow-md"
          >
            <div 
              className="w-full h-full bg-[#E8AF35] flex items-center justify-center overflow-hidden"
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80" 
                alt="Operations Specialist"
                className="w-full h-full object-cover object-center scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          {/* BOTTOM-LEFT SMALL HEXAGON (Vibrant Violet/Purple background with avatar) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1, y: [0, 5, 0] }}
            transition={{ duration: 0.6, delay: 0.35, y: { repeat: Infinity, duration: 6.5, ease: 'easeInOut' } }}
            className="absolute bottom-4 sm:bottom-6 left-24 sm:left-36 z-20 w-[65px] h-[75px] sm:w-[76px] sm:h-[88px] filter drop-shadow-md"
          >
            <div 
              className="w-full h-full bg-[#8F4F9E] flex items-center justify-center overflow-hidden"
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80" 
                alt="Client Support"
                className="w-full h-full object-cover object-center scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

        </div>

        {/* Bottom subtle note / spacer */}
        <div className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-4">
          Meadow It Distribution
        </div>

      </div>


      {/* RIGHT SECTION: Pure White Login Card */}
      <div className="w-full lg:w-[42%] xl:w-[40%] bg-white flex flex-col justify-between p-8 sm:p-12 md:p-16 lg:p-20 xl:p-24 relative min-h-screen shadow-[-12px_0_35px_rgba(0,0,0,0.03)] border-l border-slate-100">
        
        {/* Top Meadow Logo */}
        <div>
          <Link to="/" className="inline-block group" title="Return to Meadow Home">
            <img 
              src={LOGO_URL} 
              alt="Meadow IT" 
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Center Login Form Container */}
        <div className="my-auto py-10 max-w-sm w-full mx-auto">
          
          {/* Bigger Red Login Header */}
          <h2 className="text-4xl sm:text-5xl font-black text-[#c5161d] tracking-tight">
            Login
          </h2>

          {/* Subtitles matching the exact structure from the reference */}
          <div className="mt-6 mb-8">
            <h3 className="text-sm md:text-base font-bold text-slate-900 tracking-tight">
              Login to your account
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mt-1">
              Thank you for choosing our platform, let's access our system management portal
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-start gap-2.5"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
              <div className="flex-1 font-medium">{error}</div>
            </motion.div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input (Phone Number removed) */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full h-11 px-3.5 rounded-lg border border-slate-300 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#c5161d] focus:ring-1 focus:ring-[#c5161d] transition-all bg-white shadow-sm"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full h-11 pl-3.5 pr-11 rounded-lg border border-slate-300 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#c5161d] focus:ring-1 focus:ring-[#c5161d] transition-all bg-white shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me (Reset Password removed) */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-medium select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#c5161d] accent-[#c5161d] cursor-pointer"
                />
                <span>Remember me</span>
              </label>
            </div>

            {/* Red SIGN IN Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#c5161d] hover:bg-[#ad1319] active:bg-[#961015] text-white font-bold text-sm tracking-wider uppercase rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin text-white" />
                ) : (
                  "SIGN IN"
                )}
              </button>
            </div>

            {/* Bottom Support Link */}
            <div className="pt-4 text-center">
              <p className="text-xs text-slate-600 font-medium">
                Don't have an account yet?{" "}
                <Link to="/contact" className="text-[#c5161d] font-bold hover:underline">
                  Join Meadow Now!
                </Link>
              </p>
            </div>

          </form>

        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>&copy; {new Date().getFullYear()} Meadow IT</span>
          <Link to="/" className="hover:text-slate-600 transition-colors">
            Return to Store
          </Link>
        </div>

      </div>

    </div>
  );
};

export default AdminLogin;
