import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

interface CustomerLoginProps {
  onLogin?: (status: boolean) => void;
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

const CustomerLogin: React.FC<CustomerLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  // Load saved email if remember me was active
  useEffect(() => {
    const saved = localStorage.getItem('meadow_customer_remembered_username');
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
        localStorage.setItem('meadow_customer_remembered_username', cleanEmail);
      } else {
        localStorage.removeItem('meadow_customer_remembered_username');
      }

      console.log("[Customer Login] Attempting sign in for:", cleanEmail);
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (data.session) {
        // Fetch user profile to verify role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        let userProfile = profile;

        // If profile doesn't exist yet, auto-provision default customer profile
        if (profileError || !userProfile) {
          console.warn("[Customer Login] No profile found, creating default customer profile...");
          const newProfile = {
            id: data.session.user.id,
            full_name: data.session.user.user_metadata?.full_name || cleanEmail.split('@')[0] || 'Customer Member',
            email: cleanEmail,
            phone: data.session.user.user_metadata?.phone || '',
            role: 'customer',
            created_at: new Date().toISOString()
          };

          const { data: insertedProfile } = await supabase
            .from('profiles')
            .upsert([newProfile])
            .select('*')
            .single();

          userProfile = insertedProfile || newProfile;
        }

        // Validate customer role:
        // This login page is dedicated for customers. If an admin signs in here, give friendly guidance or block
        if (userProfile.role !== 'customer') {
          console.warn("[Customer Login] Non-customer role detected:", userProfile.role);
          await supabase.auth.signOut();
          setError(`This portal is exclusively for Customer accounts. Admin accounts should use the Admin Portal.`);
          return;
        }

        // Cache the verified customer profile immediately for synchronous authentication
        try {
          localStorage.setItem(`meadow_auth_profile_${data.session.user.id}`, JSON.stringify(userProfile));
          localStorage.setItem('meadow_auth_profile_current', JSON.stringify(userProfile));
          localStorage.setItem('meadow_last_active_user_id', data.session.user.id);
        } catch (e) {
          console.warn("Failed to cache customer profile in localStorage:", e);
        }

        // Refresh global auth context
        await refreshProfile();

        if (onLogin) {
          onLogin(true);
        }

        // Navigate directly to the customer management dashboard
        navigate('/customer/dashboard');
      } else {
        setError("Sign in succeeded but no session was created. Please try again.");
      }
    } catch (err: any) {
      console.error("Catch block in customer login:", err);
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FBFBFC] font-sans">
      
      {/* LEFT SECTION: Customer Hero Illustration with Hexagonal Composition */}
      <div className="w-full lg:w-[58%] xl:w-[60%] flex flex-col justify-between bg-[#F7F7F8] p-8 sm:p-12 md:p-16 lg:p-20 relative overflow-hidden min-h-[600px] lg:min-h-screen">
        
        {/* Top Headline & Customer Badge */}
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-[#c5161d] text-xs font-black uppercase tracking-widest mb-4 border border-red-100 shadow-sm"
          >
            <ShoppingBag size={14} className="text-[#c5161d]" />
            Customer Portal
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#112340] tracking-tight leading-[1.18] max-w-xl"
          >
            Manage Your Hardware &amp;<br />
            Track Orders in One Place
          </motion.h1>
          <p className="text-slate-500 font-medium text-sm md:text-base mt-3 max-w-md">
            Welcome to Meadow Customer Portal. Check order status, manage your custom builds, and access warranty support anytime.
          </p>
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
            <WireframeHexagon size={48} className="text-red-200" />
          </motion.div>

          {/* Decorative Background Outline Hexagon: Right of Center */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.5, scale: 1, y: [0, 8, 0] }}
            transition={{ opacity: { duration: 0.8 }, y: { repeat: Infinity, duration: 7, ease: 'easeInOut' } }}
            className="absolute top-44 right-2 sm:right-6 z-0"
          >
            <WireframeHexagon size={64} className="text-red-200" />
          </motion.div>

          {/* Decorative Background Outline Hexagon: Bottom-Right */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35, y: [0, -5, 0] }}
            transition={{ opacity: { duration: 0.8 }, y: { repeat: Infinity, duration: 8, ease: 'easeInOut' } }}
            className="absolute bottom-8 right-16 sm:right-28 z-0"
          >
            <WireframeHexagon size={72} className="text-red-200" />
          </motion.div>

          {/* MAIN CENTRAL HERO HEXAGON (Customer with tech setup) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative z-10 w-[270px] h-[312px] sm:w-[320px] sm:h-[370px] md:w-[350px] md:h-[404px] filter drop-shadow-xl"
          >
            {/* Soft Warm-Red Hexagon Background */}
            <div 
              className="w-full h-full bg-gradient-to-tr from-[#fee2e2] via-[#fecaca] to-[#fca5a5] flex items-center justify-center overflow-hidden"
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" 
                alt="Happy Customer"
                className="w-full h-full object-cover object-top scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          {/* TOP-RIGHT HEXAGON (Tech enthusiast / gamer customer) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
            transition={{ duration: 0.6, delay: 0.2, y: { repeat: Infinity, duration: 5, ease: 'easeInOut' } }}
            className="absolute top-4 sm:top-8 right-8 sm:right-16 z-20 w-[95px] h-[110px] sm:w-[115px] sm:h-[133px] filter drop-shadow-md"
          >
            <div 
              className="w-full h-full bg-[#dc2626] flex items-center justify-center overflow-hidden"
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80" 
                alt="PC Enthusiast"
                className="w-full h-full object-cover object-center scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          {/* MID-RIGHT HEXAGON (Workstation / Creator customer) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1, y: [0, 6, 0] }}
            transition={{ duration: 0.6, delay: 0.3, y: { repeat: Infinity, duration: 6, ease: 'easeInOut' } }}
            className="absolute top-48 sm:top-56 right-4 sm:right-10 z-20 w-[85px] h-[98px] sm:w-[100px] sm:h-[115px] filter drop-shadow-md"
          >
            <div 
              className="w-full h-full bg-[#b91c1c] flex items-center justify-center overflow-hidden"
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80" 
                alt="Content Creator"
                className="w-full h-full object-cover object-center scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          {/* BOTTOM-LEFT HEXAGON (Laptop / Office user) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
            transition={{ duration: 0.6, delay: 0.25, y: { repeat: Infinity, duration: 5.5, ease: 'easeInOut' } }}
            className="absolute bottom-12 sm:bottom-16 left-6 sm:left-14 z-20 w-[95px] h-[110px] sm:w-[115px] sm:h-[133px] filter drop-shadow-md"
          >
            <div 
              className="w-full h-full bg-[#ef4444] flex items-center justify-center overflow-hidden"
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80" 
                alt="Pro Customer"
                className="w-full h-full object-cover object-center scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          {/* BOTTOM-LEFT SMALL HEXAGON (Gaming rig builder) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1, y: [0, 5, 0] }}
            transition={{ duration: 0.6, delay: 0.35, y: { repeat: Infinity, duration: 6.5, ease: 'easeInOut' } }}
            className="absolute bottom-4 sm:bottom-6 left-24 sm:left-36 z-20 w-[65px] h-[75px] sm:w-[76px] sm:h-[88px] filter drop-shadow-md"
          >
            <div 
              className="w-full h-full bg-[#991b1b] flex items-center justify-center overflow-hidden"
              style={{
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80" 
                alt="Custom Rig Builder"
                className="w-full h-full object-cover object-center scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

        </div>

        {/* Bottom subtle note / spacer */}
        <div className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-4 flex items-center justify-between">
          <span>Meadow Customer Hub</span>
          <span className="text-[11px] text-[#c5161d] font-bold">Johor, Malaysia</span>
        </div>

      </div>


      {/* RIGHT SECTION: Pure White Login Card */}
      <div className="w-full lg:w-[42%] xl:w-[40%] bg-white flex flex-col justify-between p-8 sm:p-12 md:p-16 lg:p-20 xl:p-24 relative min-h-screen shadow-[-12px_0_35px_rgba(0,0,0,0.03)] border-l border-slate-100">
        
        {/* Top Meadow Logo */}
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-block group" title="Return to Meadow Home">
            <img 
              src={LOGO_URL} 
              alt="Meadow IT" 
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#c5161d] bg-red-50 border border-red-100 px-3 py-1 rounded-full">
            Customer Area
          </span>
        </div>

        {/* Center Login Form Container */}
        <div className="my-auto py-10 max-w-sm w-full mx-auto">
          
          {/* Customer Login Header in Signature Red */}
          <h2 className="text-4xl sm:text-5xl font-black text-[#c5161d] tracking-tight">
            Login
          </h2>

          {/* Subtitles matching the structure */}
          <div className="mt-6 mb-8">
            <h3 className="text-sm md:text-base font-bold text-slate-900 tracking-tight">
              Sign in to your customer account
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mt-1">
              Access your order history, manage saved PC builds, and track repairs and delivery.
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
            
            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
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

            {/* Remember Me */}
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

            {/* Customer Sign In Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#c5161d] hover:bg-[#a81318] active:bg-[#8f1014] text-white font-bold text-sm tracking-wider uppercase rounded-lg shadow-md hover:shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin text-white" />
                ) : (
                  <>
                    <span>SIGN IN TO DASHBOARD</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Or continue with
              </div>
            </div>

            {/* Google Sign In / Sign Up Button (Disabled) */}
            <div className="space-y-1.5">
              <button
                type="button"
                disabled
                className="w-full h-12 bg-slate-50 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 font-semibold text-xs tracking-wide flex items-center justify-center gap-3 cursor-not-allowed opacity-75 shadow-2xs select-none relative group"
                title="Google Login & Sign-Up will be enabled soon"
                aria-disabled="true"
              >
                {/* Official Google 'G' Mark */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
                <span className="text-[9px] font-extrabold uppercase tracking-wider bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full ml-1">
                  Disabled
                </span>
              </button>
              <p className="text-[10px] text-center text-slate-400 font-medium">
                Google login & signup will be available soon
              </p>
            </div>

            {/* Bottom Register & Sign Up Info */}
            <div className="pt-3 text-center">
              <p className="text-xs text-slate-600 font-medium">
                New customer?{" "}
                <Link to="/customer/signup" className="text-[#c5161d] font-bold hover:underline">
                  Sign Up Here
                </Link>
              </p>
            </div>

          </form>

        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>&copy; {new Date().getFullYear()} Meadow IT Customer Portal</span>
          <Link to="/" className="hover:text-[#c5161d] transition-colors">
            Return to Store
          </Link>
        </div>

      </div>

    </div>
  );
};

export default CustomerLogin;
