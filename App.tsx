
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/public/Home';
import StoreLocator from './pages/public/StoreLocator';
import Customised from './pages/public/Customised';
import PCBuilder from './pages/public/PCBuilder';
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
import { supabase } from './lib/supabase';
import { Profile } from './types';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.warn('Profile record not found for user:', userId);
        setUserProfile(null);
        return null;
      }
      setUserProfile(data);
      return data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      setUserProfile(null);
      return null;
    }
  };

  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (loading) {
        console.warn("Auth check timed out, proceeding as guest.");
        setLoading(false);
      }
    }, 5000);

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      setLoading(false);
      clearTimeout(safetyTimeout);
    }).catch(err => {
      console.error("Initial session check failed:", err);
      setLoading(false);
      clearTimeout(safetyTimeout);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
      clearTimeout(safetyTimeout);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
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
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stores" element={<StoreLocator />} />
        <Route path="/customised" element={<Customised />} />
        <Route path="/buildpc" element={<PCBuilder />} />
        
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
      <FloatingWhatsApp />
    </HashRouter>
  );
};

export default App;
