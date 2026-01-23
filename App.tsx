
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/public/Home';
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
        // If profile doesn't exist, we might need to handle it gracefully
        console.warn('Profile not found, user might be new.');
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
    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    }).catch(err => {
      console.error("Initial session check failed:", err);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <div className="w-12 h-12 border-4 border-slate-900/10 border-t-slate-900 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Verifying Identity & Roles...</p>
      </div>
    );
  }

  const isAdmin = userProfile?.role === 'admin';
  const isCustomer = userProfile?.role === 'customer';

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Admin Access Logic */}
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

        {/* Customer Access Logic */}
        <Route 
          path="/customer/*" 
          element={isCustomer ? <CustomerLayout onLogout={handleLogout} /> : <Navigate to="/" />}
        >
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="*" element={<Navigate to="dashboard" />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
