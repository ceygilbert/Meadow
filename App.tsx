
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/public/Home';
import StoreLocator from './pages/public/StoreLocator';
import Customised from './pages/public/Customised';
import Prebuilt from './pages/public/Prebuilt';
import PrebuiltProduct from './pages/public/PrebuiltProduct';
import TrackOrder from './pages/public/TrackOrder';
import PCBuilder from './pages/public/PCBuilder';
import Workstation from './pages/public/Workstation';
import Checkout from './pages/public/Checkout';
import LightCheckout from './pages/public/LightCheckout';
import TermsOfUse from './pages/public/TermsOfUse';
import ProductPolicy from './pages/public/ProductPolicy';
import ProductDetails from './pages/public/ProductDetails';
import ProductListing from './pages/public/ProductListing';
import Categories from './pages/public/Categories';
import OurStores from './pages/public/OurStores';
import OurStory from './pages/public/OurStory';
import AllBrands from './pages/public/AllBrands';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/Products';
import CategoryManagement from './pages/admin/Categories';
import SubCategoryManagement from './pages/admin/SubCategories';
import BrandManagement from './pages/admin/Brands';
import UnitManagement from './pages/admin/Units';
import StockTake from './pages/admin/StockTake';
import Orders from './pages/admin/Orders';
import Customers from './pages/admin/Customers';
import AdminLayout from './components/AdminLayout';
import CustomerLayout from './components/CustomerLayout';
import CustomerDashboard from './pages/customer/Dashboard';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import { supabase, supabaseUrl, supabaseAnonKey } from './lib/supabase';
import { Profile } from './types';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string, retryCount = 0): Promise<any> => {
    console.log(`Fetching profile for user: ${userId} (Attempt: ${retryCount + 1})`);
    
    if (!supabase) {
      console.error("Supabase client is not initialized.");
      return null;
    }

    try {
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT')), 30000) // Increased to 30s
      );

      console.log(`Starting Supabase query for userId: ${userId}`);
      const { data, error } = await Promise.race([profilePromise, timeoutPromise]) as any;
      console.log(`Query finished for userId: ${userId}`, { hasData: !!data, hasError: !!error });
      
      if (error) {
        console.warn('Profile fetch error:', userId, error);
        
        // Retry logic for transient errors
        if (retryCount < 2 && (error.message?.includes('FetchError') || error.status === 502 || error.status === 504 || error.status === 0)) {
          console.log(`Retrying profile fetch (attempt ${retryCount + 2}) due to network/transient error...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return fetchProfile(userId, retryCount + 1);
        }
        
        setUserProfile(null);
        setLoading(false);
        return null;
      }
      
      if (!data) {
        console.log("No profile found for user - normal if new signup.");
        setUserProfile(null);
        setLoading(false);
        return null;
      }

      console.log("Profile fetched successfully for role:", data.role);
      setUserProfile(data);
      setLoading(false);
      return data;
    } catch (err: any) {
      if (err.message === 'TIMEOUT') {
        console.error("Profile fetch TIMEOUT for user:", userId);
        if (retryCount < 2) {
          console.log(`Retrying profile fetch (attempt ${retryCount + 2}) after timeout...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return fetchProfile(userId, retryCount + 1);
        }
      } else {
        console.error('Error fetching profile in catch:', err);
      }
      
      setUserProfile(null);
      setLoading(false);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    console.log("App mounted, initializing auth check...");
    
    const globalSafetyTimeout = setTimeout(() => {
      if (mounted) {
        setLoading(currentLoading => {
          if (currentLoading) {
            console.warn("Global auth check safety timeout triggered at 45s.");
            return false;
          }
          return false;
        });
      }
    }, 45000); // Extended significantly to account for longer fetch timeouts + retries

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      console.log("Auth state change event:", event, session?.user?.email || "No session");
      
      setSession(session);
      if (session?.user) {
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          await fetchProfile(session.user.id);
        }
        setLoading(false);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(globalSafetyTimeout);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setSession(null);
      setUserProfile(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
        <div className="w-16 h-16 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
        <div className="text-center">
          <p className="text-slate-900 font-black uppercase tracking-[0.4em] text-[10px] mb-2">Meadow IT</p>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px]">Verifying Identity & Roles...</p>
        </div>
      </div>
    );
  }

  const isAdmin = userProfile?.role === 'admin';
  const isCustomer = userProfile?.role === 'customer';

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/brands" element={<AllBrands />} />
      <Route path="/products" element={<ProductListing />} />
      <Route path="/product/:slug" element={<ProductDetails />} />
      <Route path="/stores" element={<StoreLocator />} />
      <Route path="/our-stores" element={<OurStores />} />
      <Route path="/our-story" element={<OurStory />} />
      <Route path="/customised" element={<Customised />} />
      <Route path="/prebuilt" element={<Prebuilt />} />
      <Route path="/prebuilt/:slug" element={<PrebuiltProduct />} />
      <Route path="/track-order" element={<TrackOrder />} />
      <Route path="/buildpc" element={<PCBuilder />} />
      <Route path="/workstation" element={<Workstation />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout-light" element={<LightCheckout />} />
      <Route path="/terms" element={<TermsOfUse />} />
      <Route path="/product-policy" element={<ProductPolicy />} />
      
      <Route 
        path="/admin/login" 
        element={isAdmin ? <Navigate to="/admin/dashboard" /> : <AdminLogin onLogin={() => {}} />} 
      />

      <Route 
        path="/admin/*" 
        element={isAdmin ? <AdminLayout onLogout={handleLogout} /> : <Navigate to="/admin/login" />}
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="stock-take" element={<StockTake />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="subcategories" element={<SubCategoryManagement />} />
        <Route path="brands" element={<BrandManagement />} />
        <Route path="units" element={<UnitManagement />} />
        <Route path="*" element={<Navigate to="dashboard" />} />
      </Route>

      <Route 
        path="/customer/*" 
        element={isCustomer ? <CustomerLayout onLogout={handleLogout} /> : <Navigate to="/" />}
      >
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="*" element={<Navigate to="dashboard" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
