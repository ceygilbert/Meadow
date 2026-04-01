
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Search,
  Loader2,
  AlertCircle
} from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';
import { supabase } from '../../lib/supabase';
import { Brand, Profile } from '../../types';

const AllBrands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Auth & Profile States
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetchBrands();
    checkUser();

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    } catch (err) {
      console.error("Auth check failed", err);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (data) setProfile(data);
    } catch (err) {
      console.error("Profile fetch failed", err);
    }
  };

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setBrands(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedBrands = filteredBrands.reduce((acc, brand) => {
    const firstLetter = brand.name[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(brand);
    return acc;
  }, {} as Record<string, Brand[]>);

  const alphabet = Object.keys(groupedBrands).sort();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
        <Loader2 className="animate-spin text-slate-900" size={48} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Loading Brand Registry...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <PublicNavbar 
        user={user}
        profile={profile}
        cartCount={0} // Simplified for this page
        onOpenAuth={() => {}} // Simplified
        onOpenCart={() => {}} // Simplified
        scrolled={scrolled}
      />

      <main className="pt-32 md:pt-48 pb-32 px-4 md:px-10 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="flex flex-col">
            <Link to="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors mb-6">
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-[0.85]">
              Brand<br />Registry.
            </h1>
          </div>
          
          <div className="w-full md:w-96 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Filter by brand name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-16 pr-8 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all outline-none shadow-sm"
            />
          </div>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="text-rose-500 mb-6" size={48} />
            <p className="text-slate-500 font-medium">{error}</p>
          </div>
        ) : alphabet.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
            <Search size={48} className="mb-6" />
            <p className="text-xs font-black uppercase tracking-widest">No brands found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-24">
            {alphabet.map(letter => (
              <div key={letter} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                <div className="md:col-span-2">
                  <span className="text-6xl md:text-8xl font-black text-slate-100 uppercase tracking-tighter leading-none sticky top-32">
                    {letter}
                  </span>
                </div>
                <div className="md:col-span-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                  {groupedBrands[letter].map(brand => (
                    <Link 
                      key={brand.id}
                      to={`/products?brand=${brand.id}`}
                      className="group flex flex-col gap-6 p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:shadow-2xl hover:border-transparent transition-all duration-500"
                    >
                      <div className="aspect-square bg-slate-50 rounded-2xl flex items-center justify-center p-6 group-hover:scale-105 transition-transform duration-700">
                        <img 
                          src={brand.logo_url || undefined} 
                          className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" 
                          alt={brand.name} 
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{brand.name}</h3>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Official Partner</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                          <ArrowUpRight size={14} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-slate-900 py-20 px-4 md:px-10">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">
            © {new Date().getFullYear()} Meadow SDN BHD — ALL RIGHTS RESERVED
          </p>
          <div className="flex gap-8">
            <Link to="/terms" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AllBrands;
