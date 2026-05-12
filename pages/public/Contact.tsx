
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Facebook, 
  Instagram, 
  MessageCircle, 
  Send,
  Globe,
  User,
  HelpCircle,
  FileText,
  ArrowRight
} from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';
import Footer from '../../components/Footer';
import FloatingWhatsApp from '../../components/FloatingWhatsApp';
import { useAuth } from '../../lib/AuthContext';

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/Red%20Full%20Logo.png";

const XHS_ICON = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47V18.77a6.738 6.738 0 0 1-6.76 6.76 6.738 6.738 0 0 1-6.76-6.76 6.738 6.738 0 0 1 6.76-6.76c.42-.02.84.03 1.25.12v4.03a2.71 2.71 0 0 0-1.25-.12 2.728 2.728 0 0 0-2.72 2.73 2.728 2.728 0 0 0 2.72 2.73 2.728 2.728 0 0 0 2.73-2.73V.02z"/>
  </svg>
);

const Contact: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    country: '',
    iam: 'End User',
    topic: 'Support',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <PublicNavbar 
        user={user}
        profile={profile}
        cartCount={0}
        onOpenAuth={() => {}}
        onOpenCart={() => {}}
        scrolled={true}
      />

      <main className="pb-24">
        {/* Hero Section */}
        <section className="relative pt-40 pb-20 px-4 md:px-10 overflow-hidden bg-slate-50/30">
          <div className="max-w-[1440px] mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 mb-6">Innovation & Support</h1>
              <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase text-slate-900 leading-[0.85]">
                Let's Build The<br />
                <span className="text-blue-600">Future</span> Together
              </h2>
            </motion.div>
          </div>
          
          {/* Abstract background elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 -skew-x-12 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-slate-100/50 skew-x-12 -translate-x-1/2" />
        </section>

        <section className="px-4 md:px-10 max-w-[1440px] mx-auto mt-12 md:mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
            
            {/* Left Column: Contact Info & Socials */}
            <div className="space-y-16">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl font-black italic tracking-tighter uppercase text-slate-900 mb-6">
                    Connect with our <span className="text-blue-600">Technical Specialists</span>
                  </h3>
                  <p className="text-slate-500 text-base font-medium leading-relaxed max-w-md">
                    Whether you're looking for high-performance workstations, server deployments, or custom gaming solutions, our team provides precision engineering for your specific requirements.
                  </p>
                </motion.div>
              </div>

              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-blue-200 transition-colors"
                  >
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                      <Mail size={24} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email Support</h3>
                    <p className="text-slate-900 font-bold">kairyong.meadowit@gmail.com</p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-blue-200 transition-colors"
                  >
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                      <Phone size={24} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Service Center</h3>
                    <p className="text-slate-900 font-bold">+60 7-355 5555</p>
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-10 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
                >
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-6">Our Store Locations</h3>
                    <p className="text-slate-400 text-sm font-medium mb-8 max-w-xs uppercase tracking-wide">
                      Visit us at our HQ in Johor Jaya or any of our official ASUS & HP Concept stores.
                    </p>
                    <a href="/our-stores" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 hover:text-white transition-colors group">
                      View Map <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                  <MapPin size={120} className="absolute -bottom-4 -right-4 text-white opacity-5 rotate-12" />
                </motion.div>
              </div>

              {/* Social Channels */}
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 pl-4">Social Channels</h3>
                <div className="flex flex-wrap gap-4">
                  {[
                    { icon: Facebook, name: 'Facebook', url: '#', color: 'hover:bg-[#1877F2]' },
                    { icon: Instagram, name: 'Instagram', url: '#', color: 'hover:bg-[#E4405F]' },
                    { icon: MessageCircle, name: 'WhatsApp', url: '#', color: 'hover:bg-[#25D366]' },
                    { icon: XHS_ICON, name: 'RedNote', url: '#', color: 'hover:bg-[#FF2442]' }
                  ].map((social) => (
                    <a 
                      key={social.name}
                      href={social.url}
                      className={`flex items-center gap-3 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 hover:text-white ${social.color} transition-all group font-bold text-sm`}
                    >
                      <social.icon size={20} className="group-hover:scale-110 transition-transform" />
                      {social.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Inquiry Form */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-2xl relative z-10"
              >
                {submitted ? (
                  <div className="py-20 text-center space-y-8">
                    <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <Send size={40} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Transmission Successful</h3>
                      <p className="text-slate-500 font-medium max-w-xs mx-auto">
                        Your inquiry has been logged in our system. Our team will contact you within 24-48 business hours.
                      </p>
                    </div>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                          <User size={12} /> First Name
                        </label>
                        <input 
                          required
                          type="text" 
                          className="w-full h-14 bg-slate-50 border border-transparent rounded-2xl px-6 font-bold text-sm outline-none focus:border-blue-600/30 transition-all"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={e => setFormData({...formData, firstName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Last Name</label>
                        <input 
                          required
                          type="text" 
                          className="w-full h-14 bg-slate-50 border border-transparent rounded-2xl px-6 font-bold text-sm outline-none focus:border-blue-600/30 transition-all"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={e => setFormData({...formData, lastName: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Mail size={12} /> Email Address
                      </label>
                      <input 
                        required
                        type="email" 
                        className="w-full h-14 bg-slate-50 border border-transparent rounded-2xl px-6 font-bold text-sm outline-none focus:border-blue-600/30 transition-all"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                          <Globe size={12} /> Country
                        </label>
                        <select 
                          required
                          className="w-full h-14 bg-slate-50 border border-transparent rounded-2xl px-6 font-bold text-sm outline-none focus:border-blue-600/30 transition-all appearance-none"
                          value={formData.country}
                          onChange={e => setFormData({...formData, country: e.target.value})}
                        >
                          <option value="">Select Country</option>
                          <option value="Malaysia">Malaysia</option>
                          <option value="Singapore">Singapore</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                          <User size={12} /> I am a...
                        </label>
                        <select 
                          required
                          className="w-full h-14 bg-slate-50 border border-transparent rounded-2xl px-6 font-bold text-sm outline-none focus:border-blue-600/30 transition-all appearance-none"
                          value={formData.iam}
                          onChange={e => setFormData({...formData, iam: e.target.value})}
                        >
                          <option value="End User">End User</option>
                          <option value="Reseller">Reseller</option>
                          <option value="Media">Media / Press</option>
                          <option value="Corporate">Corporate / Enterprise</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <HelpCircle size={12} /> Topic
                      </label>
                      <select 
                        required
                        className="w-full h-14 bg-slate-50 border border-transparent rounded-2xl px-6 font-bold text-sm outline-none focus:border-blue-600/30 transition-all appearance-none"
                        value={formData.topic}
                        onChange={e => setFormData({...formData, topic: e.target.value})}
                      >
                        <option value="Support">Technical Support</option>
                        <option value="Sales">Sales Inquiry</option>
                        <option value="Warranty">Warranty & RMA</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Other">General Feedback</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <FileText size={12} /> Subject
                      </label>
                      <input 
                        required
                        type="text" 
                        className="w-full h-14 bg-slate-50 border border-transparent rounded-2xl px-6 font-bold text-sm outline-none focus:border-blue-600/30 transition-all"
                        placeholder="Inquiry Subject"
                        value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Message</label>
                      <textarea 
                        required
                        rows={5}
                        className="w-full bg-slate-50 border border-transparent rounded-[2rem] px-8 py-6 font-bold text-sm outline-none focus:border-blue-600/30 transition-all resize-none"
                        placeholder="How can we help you today?"
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                      ></textarea>
                    </div>

                    <div className="pt-4">
                      <button 
                        disabled={isSubmitting}
                        className="w-full h-16 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-black hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-4"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            Submit <Send size={16} />
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mt-6">
                      By submitting, you agree to our <a href="/terms" className="text-slate-900 hover:underline">Privacy Policy</a>.
                    </p>
                  </form>
                )}
              </motion.div>

              {/* Decorative blobs */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-100 rounded-full opacity-50 blur-3xl -z-10" />
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-slate-100 rounded-full opacity-50 blur-3xl -z-10" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Contact;
