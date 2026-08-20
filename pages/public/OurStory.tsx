
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight,
  ArrowUpRight,
  Facebook,
  Instagram,
  Award,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Layers,
  Headset
} from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';
import Footer from '../../components/Footer';
import { supabase } from '../../lib/supabase';
import { Profile, OurStorySettings, AwardCardItem } from '../../types';
import { fetchOurStorySettings, DEFAULT_OUR_STORY_SETTINGS } from '../../services/ourStoryService';

interface CartItem {
  id: string;
  quantity: number;
}

import { useAuth } from '../../lib/AuthContext';

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/Red%20Full%20Logo.png";

const OurStory: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [awardSlide, setAwardSlide] = useState(0);
  const [storySettings, setStorySettings] = useState<OurStorySettings>(DEFAULT_OUR_STORY_SETTINGS);

  useEffect(() => {
    fetchOurStorySettings().then(data => setStorySettings(data));
  }, []);

  const awardCardsPages = React.useMemo(() => {
    const cards = storySettings.award_cards && storySettings.award_cards.length > 0
      ? storySettings.award_cards
      : DEFAULT_OUR_STORY_SETTINGS.award_cards;

    const pages: AwardCardItem[][] = [];
    for (let i = 0; i < cards.length; i += 2) {
      pages.push(cards.slice(i, i + 2));
    }
    return pages.length > 0 ? pages : [[]];
  }, [storySettings.award_cards]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem('meadow_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFEFA] text-[#333] font-sans selection:bg-[#333] selection:text-white overflow-x-hidden">
      <PublicNavbar 
        user={user}
        profile={profile}
        cartCount={cart.length}
        onOpenAuth={() => navigate('/')} 
        onOpenCart={() => {}}
        scrolled={scrolled}
      />

      {/* Hero Section */}
      <section className="pt-28 md:pt-36 pb-12 md:pb-16 px-4 md:px-10 lg:px-12 max-w-[1440px] mx-auto">
        {/* Top Grid: Content & Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Text & CTA Buttons */}
          <div className="lg:col-span-7 xl:col-span-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#e11d48] mb-3 block">
                {storySettings.hero_eyebrow || 'OUR STORY'}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
                {storySettings.hero_title || 'A Trusted Name in PCs & Technology Since 1995.'}
              </h1>
              <div className="space-y-4 text-sm md:text-base text-slate-600 font-medium leading-relaxed max-w-2xl">
                <p>
                  {storySettings.hero_paragraph_1 || 'Meadow Computer is a computer retailer and distributor offering a wide range of PCs, laptops, components, printers and everyday IT products through our retail stores. Our journey began in distribution in 1995, before gradually expanding into retail with Meadow Computer stores, together with official ASUS and HP concept stores.'}
                </p>
                <p>
                  {storySettings.hero_paragraph_2 || 'Over the years, we have grown alongside the technology industry while building long-standing relationships with leading brands and the customers we serve.'}
                </p>
                <p>
                  {storySettings.hero_paragraph_3 || 'For us, the experience does not end when a product is sold. We want customers to feel confident about what they buy, with practical advice before their purchase and dependable after-sales support whenever they need it.'}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Hero Image with Rounded Corners */}
          <div className="lg:col-span-5 xl:col-span-6">
            <motion.div 
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative w-full h-[360px] sm:h-[420px] lg:h-[480px] rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-100 bg-slate-100"
            >
              <img 
                src={storySettings.hero_image_url || "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&q=80"} 
                alt="Meadow Computer Store" 
                className="w-full h-full object-cover grayscale brightness-95 contrast-105"
              />
            </motion.div>
          </div>
        </div>

        {/* Bottom Feature / Stat Card Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 md:mt-16 bg-white border border-slate-100/90 rounded-3xl p-6 md:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.03)]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x divide-slate-100">
            
            {/* Item 1 */}
            <div className="flex items-start gap-4 lg:px-6 first:lg:pl-0">
              <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base md:text-lg tracking-tight leading-snug">
                  30+ Years Experience
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Serving Johor since 1995 with integrity and dedication.
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-start gap-4 lg:px-6">
              <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base md:text-lg tracking-tight leading-snug">
                  5 Retail Locations
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Conveniently located across Johor to serve you better.
                </p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-start gap-4 lg:px-6">
              <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                <Layers size={18} />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base md:text-lg tracking-tight leading-snug">
                  Multi-Brand IT Retail
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  Authorised partner for leading global technology brands.
                </p>
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex items-start gap-4 lg:px-6 last:lg:pr-0">
              <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                <Headset size={18} />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base md:text-lg tracking-tight leading-snug">
                  Workshop-Backed Support
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  In-house workshop and expert support you can count on.
                </p>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* Philosophy / Foundations Section */}
      <section className="py-32 px-6 md:px-16 lg:px-32 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
           <div className="lg:col-span-2">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#666] mb-12">{storySettings.foundations_eyebrow || 'Foundations'}</h2>
              <h3 className="text-3xl md:text-4xl font-light text-[#333] leading-snug mb-16 max-w-3xl">
                {storySettings.foundations_title || 'We help every customer choose the right products with genuine advice and the right value for their needs.'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                 <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-6 italic text-[#333]">{storySettings.foundations_feature1_title || 'Official Brand Partnership'}</h4>
                    <p className="text-sm text-[#666] leading-relaxed font-light">
                      {storySettings.foundations_feature1_desc}
                    </p>
                 </div>
                 <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-6 italic text-[#333]">{storySettings.foundations_feature2_title || 'Workshop Backed Support'}</h4>
                    <p className="text-sm text-[#666] leading-relaxed font-light">
                      {storySettings.foundations_feature2_desc}
                    </p>
                 </div>
              </div>
           </div>
           <div className="flex items-end">
              <div className="aspect-[3/4] w-full bg-[#F6F5E8] rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-200/60">
                 <img 
                   src={storySettings.foundations_image_url || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80"} 
                   alt="Details" 
                   className="w-full h-full object-cover grayscale opacity-80 rounded-3xl md:rounded-[2.5rem]"
                 />
              </div>
           </div>
        </div>
      </section>

      {/* Our Locations Section */}
      <section className="bg-[#FFFEFA] text-[#333] py-32 border-t border-slate-200/50">
        <div className="max-w-[1600px] mx-auto px-6 md:px-16 lg:px-32">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="order-2 lg:order-1">
                 <div className="w-full aspect-video bg-[#F6F5E8] rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-200/60">
                   <img 
                     src={storySettings.locations_image_url || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"} 
                     alt="Space" 
                     className="w-full h-full object-cover grayscale opacity-80 rounded-3xl md:rounded-[2.5rem]"
                   />
                 </div>
              </div>
              <div className="order-1 lg:order-2 max-w-xl">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#666] mb-8 block">{storySettings.locations_eyebrow || 'Distribution'}</span>
                 <h2 className="text-3xl md:text-5xl font-light text-[#333] mb-12 leading-tight">
                   {storySettings.locations_title || 'Our Locations'}
                 </h2>
                 <p className="text-sm md:text-lg text-[#666] leading-relaxed font-light mb-12">
                   {storySettings.locations_desc}
                 </p>
                 <Link 
                    to={storySettings.locations_btn_link || "/our-stores"}
                    className="inline-flex items-center justify-between px-8 py-4 border border-[#333]/20 hover:border-[#333] hover:bg-[#333] hover:text-[#FFFEFA] group transition-all duration-500 w-full md:w-auto md:min-w-[280px] rounded-full"
                 >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{storySettings.locations_btn_text || 'Explore our locations'}</span>
                    <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-2" />
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* Multi-Award Company Section */}
      <section className="bg-[#121212] text-[#FFFEFA] py-28 border-t border-white/10 relative overflow-hidden">
        {/* Subtle background red gradient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-[1600px] mx-auto px-6 md:px-16 lg:px-32 relative z-10">
          
          {/* Main Title & Overview */}
          <div className="max-w-4xl mb-12">
            <h2 className="text-3xl md:text-5xl font-light leading-tight mb-6">
              {storySettings.awards_section_title || "We're Multi-Award Company."}
            </h2>
            <p className="text-sm md:text-lg text-white/70 leading-relaxed font-light mb-10 max-w-3xl">
              {storySettings.awards_section_desc}
            </p>
            
            {/* Tag Button */}
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-red-600 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] bg-red-600/10 hover:bg-red-600/20 transition-colors">
              <Award size={14} className="text-red-500" />
              {storySettings.awards_tag_label || 'Award List'}
            </div>
          </div>

          {/* Subheading & Slider Nav Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h3 className="text-2xl md:text-3xl font-light text-white tracking-tight">
              Multi-Award.
            </h3>

            {/* Carousel Controls */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold tracking-widest text-white/50 uppercase">
                Page <span className="text-red-500 font-black">{awardSlide + 1}</span> / {awardCardsPages.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAwardSlide(prev => (prev === 0 ? awardCardsPages.length - 1 : prev - 1))}
                  className="w-10 h-10 rounded-full border border-red-600/50 hover:border-red-500 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white transition-all flex items-center justify-center shadow-lg active:scale-95 cursor-pointer"
                  aria-label="Previous Award Slide"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  onClick={() => setAwardSlide(prev => (prev === awardCardsPages.length - 1 ? 0 : prev + 1))}
                  className="w-10 h-10 rounded-full border border-red-600/50 hover:border-red-500 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white transition-all flex items-center justify-center shadow-lg active:scale-95 cursor-pointer"
                  aria-label="Next Award Slide"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* 2 Cards Grid Slider View */}
          <div className="relative min-h-[320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={awardSlide}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
              >
                {awardCardsPages[awardSlide] && awardCardsPages[awardSlide].map((card) => (
                  <div
                    key={card.id || card.company}
                    className="rounded-[1.75rem] border border-red-600/60 bg-[#181818] p-8 hover:border-red-500 hover:shadow-red-600/10 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Brand Header */}
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center p-2.5 shrink-0 shadow-md">
                          {card.logo_url ? (
                            <img src={card.logo_url} alt={card.company} className="w-10 h-10 object-contain" />
                          ) : (
                            <span className="text-xl font-black italic tracking-tighter text-slate-900 font-sans">
                              {card.company.slice(0, 3).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="text-base md:text-lg font-bold text-white tracking-tight group-hover:text-red-500 transition-colors">
                            {card.company}
                          </h4>
                          <p className="text-xs text-white/50 font-medium tracking-wide">
                            {card.type}
                          </p>
                        </div>
                      </div>

                      {/* Awards List */}
                      <ul className="space-y-3 pt-6 border-t border-white/10 text-sm font-medium text-white/90">
                        {(card.awards || []).map((awardText, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 mt-2"></span>
                            <span>{awardText}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/10">
                      <span className="text-xs md:text-sm font-bold text-red-500 block">
                        {card.duration}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide Dots Indicator */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {awardCardsPages.map((_, index) => (
              <button
                key={index}
                onClick={() => setAwardSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  awardSlide === index
                    ? 'w-8 bg-red-600'
                    : 'w-2.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* More Information & Social Media Section */}
      <section className="py-24 md:py-32 px-6 md:px-16 lg:px-32 max-w-[1600px] mx-auto border-b border-[#EAEABA]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 text-left">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
              More Information?
            </h2>
            <p className="text-base md:text-lg text-slate-600 font-medium">
              Visit our social media for latest update and information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Facebook Card */}
            <a
              href="https://www.facebook.com/share/1K7NghHPxP/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#1877F2] hover:bg-[#166fe5] text-white p-7 md:p-8 rounded-3xl min-h-[240px] md:min-h-[280px] flex flex-col justify-between shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {/* Facebook Icon Top-Left */}
              <div className="w-12 h-12 rounded-full bg-white text-[#1877F2] flex items-center justify-center shadow-md">
                <Facebook size={26} className="fill-[#1877F2] text-[#1877F2]" />
              </div>

              {/* Bottom Label & Line */}
              <div className="pt-8">
                <div className="flex items-center justify-between border-b border-white/40 pb-2 group-hover:border-white transition-colors">
                  <span className="font-bold text-sm md:text-base tracking-wide text-white">
                    Meadow Computer - Main Page
                  </span>
                  <ArrowUpRight size={18} className="text-white/80 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </a>

            {/* TikTok Card */}
            <a
              href="https://www.tiktok.com/@meadowit.my?_r=1&_t=ZS-98nOPPqLcFF"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-black hover:bg-neutral-900 text-white p-7 md:p-8 rounded-3xl min-h-[240px] md:min-h-[280px] flex flex-col justify-between shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {/* TikTok Icon Top-Left */}
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center shadow-md backdrop-blur-sm">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                </svg>
              </div>

              {/* Bottom Label & Line */}
              <div className="pt-8">
                <div className="flex items-center justify-between border-b border-white/40 pb-2 group-hover:border-white transition-colors">
                  <span className="font-bold text-sm md:text-base tracking-wide text-white">
                    Meadow Computer - @meadowit.my
                  </span>
                  <ArrowUpRight size={18} className="text-white/80 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </a>

            {/* Instagram Card */}
            <a
              href="https://www.instagram.com/meadow.it?igsh=MTBxejNkcmc5ZHJ6cw%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] hover:opacity-95 text-white p-7 md:p-8 rounded-3xl min-h-[240px] md:min-h-[280px] flex flex-col justify-between shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
            >
              {/* Instagram Icon Top-Left */}
              <div className="w-12 h-12 rounded-full bg-white/20 border border-white/30 text-white flex items-center justify-center shadow-md backdrop-blur-sm">
                <Instagram size={26} className="text-white" />
              </div>

              {/* Bottom Label & Line */}
              <div className="pt-8">
                <div className="flex items-center justify-between border-b border-white/40 pb-2 group-hover:border-white transition-colors">
                  <span className="font-bold text-sm md:text-base tracking-wide text-white">
                    Meadow Computer - @meadow.it
                  </span>
                  <ArrowUpRight size={18} className="text-white/80 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default OurStory;
