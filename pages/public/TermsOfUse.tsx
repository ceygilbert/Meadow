
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Scale, Clock } from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/Red%20Full%20Logo.png";

const TermsOfUse: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <PublicNavbar 
        user={null}
        profile={null}
        cartCount={0}
        onOpenAuth={() => {}}
        onOpenCart={() => {}}
        scrolled={true}
      />

      <main className="pt-32 pb-24 px-4 md:px-10 max-w-[1440px] mx-auto">
        {/* Header Section */}
        <div className="mb-16 md:mb-24">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors mb-8 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
                  <Shield size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Legal Framework</span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-[0.85] mb-8">
                Terms of <br /> Use.
              </h1>
              <p className="text-sm md:text-lg text-slate-500 font-medium leading-relaxed">
                Last Updated: October 1, 2024. Please read these terms carefully before using our services.
              </p>
            </div>
            
            <div className="hidden md:flex flex-col items-end gap-4">
              <div className="flex items-center gap-4 text-slate-200">
                <FileText size={48} strokeWidth={1} />
                <Scale size={48} strokeWidth={1} />
                <Clock size={48} strokeWidth={1} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Operational Protocol v2.4</p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-32 space-y-8">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Index</p>
              <nav className="flex flex-col gap-4">
                {['Scope', 'Acceptance', 'User Rights', 'E-Commerce', 'Privacy', 'Liability'].map((item) => (
                  <a 
                    key={item} 
                    href={`#${item.toLowerCase()}`}
                    className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-16">
            <section id="scope" className="prose prose-slate max-w-none">
              <div className="p-8 md:p-12 bg-slate-50 rounded-[2.5rem] border border-slate-100 mb-12">
                <p className="text-sm md:text-base font-bold text-slate-700 leading-relaxed m-0">
                  This Terms & Policy Section only applies exclusively to Meadow Computer Official E-Commerce website [https://www.meadow.com]. For marketplace store, please refer to the respective help sections on each individual website for their specific terms and services.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  {[
                    { name: 'Shopee', link: 'Help Centre / Terms of Service' },
                    { name: 'Shopee Mall', link: 'Help Centre / Terms of Service' },
                    { name: 'Lazada', link: 'Help Centre / Terms of Use' },
                    { name: 'LazMall', link: 'Help Centre / Terms & Conditions' },
                    { name: 'TikTok Shop', link: 'TikTok Shop Academy / Terms Of Services' }
                  ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-900">{item.name}</span>
                      <span className="text-[10px] font-bold text-slate-400">{item.link}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-12">
                <div id="acceptance">
                  <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-6 flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs">01</span>
                    Acceptance of Terms
                  </h2>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    MEADOW COMPUTER SDN BHD [921893-M] and its affiliates ("Meadow," "we," "our," and "us") offer website information services, an e-commerce store, and product catalog features. Prior to accessing our website or utilizing any features, it is imperative to thoroughly review these terms and use, encompassing both the Terms and Use and Privacy Policy. This is essential to ensure an understanding of the legal rights and obligations associated with the use of our services.
                  </p>
                </div>

                <div id="user-rights">
                  <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-6 flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs">02</span>
                    User Rights & Obligations
                  </h2>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    By accessing or using the Meadow website, you agree to be bound by these Terms of Use. If you do not agree to these terms, please refrain from using our website. We reserve the right to update or modify these terms at any time without prior notice. Your continued use of the website following any changes constitutes your acceptance of the revised terms.
                  </p>
                </div>

                <div id="e-commerce">
                  <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-6 flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs">03</span>
                    E-Commerce & Transactions
                  </h2>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    Our e-commerce platform allows you to browse and purchase products. All orders are subject to availability and confirmation of the order price. We strive to provide accurate product descriptions and pricing, but errors may occur. In the event of a pricing error, we reserve the right to cancel any orders placed at the incorrect price.
                  </p>
                </div>

                <div id="privacy">
                  <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-6 flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs">04</span>
                    Privacy Policy
                  </h2>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    Your privacy is important to us. Our Privacy Policy outlines how we collect, use, and protect your personal information. By using our website, you consent to the collection and use of your information as described in the Privacy Policy.
                  </p>
                </div>

                <div id="liability">
                  <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-6 flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs">05</span>
                    Limitation of Liability
                  </h2>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    Meadow shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with the use of our website or services. This includes, but is not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses.
                  </p>
                </div>
              </div>
            </section>

            {/* Footer Note */}
            <div className="pt-16 border-t border-slate-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-4">
                  <img src={LOGO_URL} className="h-10 w-auto grayscale opacity-30" alt="Meadow" />
                  <div className="h-8 w-px bg-slate-100"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                    Meadow Computer SDN BHD [921893-M]
                  </p>
                </div>
                <button 
                  onClick={() => window.print()}
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl"
                >
                  Print Document
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-slate-50 py-12 border-t border-slate-100">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">
            © {new Date().getFullYear()} Meadow SDN BHD — ALL RIGHTS RESERVED
          </p>
          <div className="flex gap-8">
            <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Home</Link>
            <Link to="/stores" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Stores</Link>
            <Link to="/track-order" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Tracking</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfUse;
