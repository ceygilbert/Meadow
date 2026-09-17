import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, AlertCircle, ShoppingBag, ArrowRight, CheckCircle2, User, Mail, Phone, Lock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

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

const CustomerSignup: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();
  const { refreshProfile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Form Validations
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please check and try again.');
      return;
    }

    if (!agreeTerms) {
      setError('Please accept the Terms of Service to continue.');
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = fullName.trim();
      const cleanPhone = phone.trim();

      console.log("[Customer Signup] Attempting signup for:", cleanEmail);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            full_name: cleanName,
            phone: cleanPhone,
            role: 'customer'
          }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.user) {
        const userId = data.user.id;

        // Create profile directly in profiles table
        const newProfile = {
          id: userId,
          full_name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          role: 'customer',
          created_at: new Date().toISOString()
        };

        try {
          await supabase
            .from('profiles')
            .upsert([newProfile]);
        } catch (dbErr) {
          console.warn("[Customer Signup] Note on upserting profile:", dbErr);
        }

        // Check if session is already active (auto-confirm enabled)
        if (data.session) {
          try {
            localStorage.setItem(`meadow_auth_profile_${userId}`, JSON.stringify(newProfile));
            localStorage.setItem('meadow_auth_profile_current', JSON.stringify(newProfile));
            localStorage.setItem('meadow_last_active_user_id', userId);
          } catch (e) {
            console.warn("Failed to cache customer profile in localStorage:", e);
          }

          await refreshProfile();
          navigate('/customer/dashboard');
          return;
        }

        // Email confirmation is required by Supabase configuration
        setIsSuccess(true);
      } else {
        setError('Signup could not be completed. Please try again.');
      }
    } catch (err: any) {
      console.error("Catch block in customer signup:", err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FBFBFC] font-sans">
      
      {/* LEFT SECTION: Customer Hero Illustration with Hexagonal Composition */}
      <div className="w-full lg:w-[55%] xl:w-[58%] flex flex-col justify-between bg-[#F7F7F8] p-8 sm:p-12 md:p-16 lg:p-20 relative overflow-hidden min-h-[550px] lg:min-h-screen">
        
        {/* Top Headline & Customer Badge */}
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-[#c5161d] text-xs font-black uppercase tracking-widest mb-4 border border-red-100 shadow-sm"
          >
            <ShoppingBag size={14} className="text-[#c5161d]" />
            New Customer Registration
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#112340] tracking-tight leading-[1.18] max-w-xl"
          >
            Join Meadow to Track<br />
            Orders &amp; Custom Builds
          </motion.h1>
          <p className="text-slate-500 font-medium text-sm md:text-base mt-3 max-w-md">
            Create your customer account to view order milestones, request direct hardware warranty support, and save your custom PC configurations.
          </p>
        </div>

        {/* Center Hexagonal Visual Showcase */}
        <div className="relative w-full max-w-[580px] h-[440px] sm:h-[500px] md:h-[540px] mx-auto my-auto flex items-center justify-center select-none">
          
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

          {/* MAIN CENTRAL HERO HEXAGON */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative z-10 w-[270px] h-[312px] sm:w-[320px] sm:h-[370px] md:w-[350px] md:h-[404px] filter drop-shadow-xl"
          >
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

          {/* TOP-RIGHT HEXAGON */}
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

          {/* MID-RIGHT HEXAGON */}
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

          {/* BOTTOM-LEFT HEXAGON */}
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

          {/* BOTTOM-LEFT SMALL HEXAGON */}
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


      {/* RIGHT SECTION: Pure White Signup Card */}
      <div className="w-full lg:w-[45%] xl:w-[42%] bg-white flex flex-col justify-between p-8 sm:p-12 md:p-14 lg:p-16 xl:p-20 relative min-h-screen shadow-[-12px_0_35px_rgba(0,0,0,0.03)] border-l border-slate-100 overflow-y-auto">
        
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

        {/* Center Signup Container */}
        <div className="my-auto py-8 max-w-sm w-full mx-auto">
          
          {isSuccess ? (
            /* Registration Success Confirmation */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Account Created!
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed mt-2.5 max-w-xs mx-auto">
                We’ve sent a confirmation link to <strong className="text-slate-900">{email}</strong>. Please check your inbox to activate your account.
              </p>

              <div className="mt-8 space-y-3">
                <Link
                  to="/customer/login"
                  className="w-full h-11 bg-[#c5161d] hover:bg-[#a81318] text-white font-bold text-xs tracking-wider uppercase rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>PROCEED TO SIGN IN</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/"
                  className="block text-xs text-slate-500 font-semibold hover:text-slate-800 transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </motion.div>
          ) : (
            /* Signup Form */
            <>
              <h2 className="text-4xl sm:text-5xl font-black text-[#c5161d] tracking-tight">
                Sign Up
              </h2>

              <div className="mt-4 mb-6">
                <h3 className="text-sm md:text-base font-bold text-slate-900 tracking-tight">
                  Create your customer account
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Access warranty records, track delivery status, and save PC builds.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-start gap-2.5"
                >
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
                  <div className="flex-1 font-medium">{error}</div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Tan"
                      required
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#c5161d] focus:ring-1 focus:ring-[#c5161d] transition-all bg-white shadow-sm"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="customer@example.com"
                    required
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#c5161d] focus:ring-1 focus:ring-[#c5161d] transition-all bg-white shadow-sm"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+60 12-345 6789"
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#c5161d] focus:ring-1 focus:ring-[#c5161d] transition-all bg-white shadow-sm"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      required
                      minLength={6}
                      className="w-full h-10 pl-3 pr-10 rounded-lg border border-slate-300 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#c5161d] focus:ring-1 focus:ring-[#c5161d] transition-all bg-white shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      required
                      minLength={6}
                      className="w-full h-10 pl-3 pr-10 rounded-lg border border-slate-300 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#c5161d] focus:ring-1 focus:ring-[#c5161d] transition-all bg-white shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600 font-medium select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-[#c5161d] accent-[#c5161d] cursor-pointer"
                    />
                    <span className="leading-tight">
                      I agree to Meadow’s terms of service and privacy policy.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-[#c5161d] hover:bg-[#a81318] active:bg-[#8f1014] text-white font-bold text-xs tracking-wider uppercase rounded-lg shadow-md hover:shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin text-white" />
                    ) : (
                      <>
                        <span>SIGN UP &amp; CREATE ACCOUNT</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div className="relative my-3.5 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Or register with
                  </div>
                </div>

                {/* Google Sign Up Button (Disabled) */}
                <div className="space-y-1">
                  <button
                    type="button"
                    disabled
                    className="w-full h-11 bg-slate-50 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 font-semibold text-xs tracking-wide flex items-center justify-center gap-3 cursor-not-allowed opacity-75 shadow-2xs select-none relative"
                    title="Google Sign-Up will be enabled soon"
                    aria-disabled="true"
                  >
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
                    <span>Sign up with Google</span>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full ml-1">
                      Disabled
                    </span>
                  </button>
                </div>

                {/* Bottom Already Have Account Link */}
                <div className="pt-3 text-center">
                  <p className="text-xs text-slate-600 font-medium">
                    Already have an account?{" "}
                    <Link to="/customer/login" className="text-[#c5161d] font-bold hover:underline">
                      Sign In
                    </Link>
                  </p>
                </div>

              </form>
            </>
          )}

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

export default CustomerSignup;
