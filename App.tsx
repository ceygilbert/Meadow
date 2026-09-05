
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import OrderSuccess from './pages/public/OrderSuccess';
import TermsOfUse from './pages/public/TermsOfUse';
import ProductPolicy from './pages/public/ProductPolicy';
import ProductDetails from './pages/public/ProductDetails';
import ProductListing from './pages/public/ProductListing';
import Categories from './pages/public/Categories';
import OurStores from './pages/public/OurStores';
import OurStory from './pages/public/OurStory';
import AllBrands from './pages/public/AllBrands';
import Events from './pages/public/Events';
import Contact from './pages/public/Contact';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import HomePageSettingsPage from './pages/admin/HomePageSettings';
import OurStorySettingsPage from './pages/admin/OurStorySettings';
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

import { AuthProvider, useAuth } from './lib/AuthContext';

const AppContent: React.FC = () => {
  const { profile, loading, signOut, isAdmin, isCustomer } = useAuth();

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
      <Route path="/events" element={<Events />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/customised" element={<Customised />} />
      <Route path="/prebuilt" element={<Prebuilt />} />
      <Route path="/prebuilt/:slug" element={<PrebuiltProduct />} />
      <Route path="/track-order" element={<TrackOrder />} />
      <Route path="/buildpc" element={<PCBuilder />} />
      <Route path="/workstation" element={<Workstation />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout-light" element={<LightCheckout />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/terms" element={<TermsOfUse />} />
      <Route path="/product-policy" element={<ProductPolicy />} />
      
      <Route 
        path="/admin/login" 
        element={isAdmin ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin onLogin={() => {}} />} 
      />

      <Route 
        path="/admin" 
        element={isAdmin ? <AdminLayout onLogout={signOut} /> : <Navigate to="/admin/login" replace />}
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="homepage" element={<HomePageSettingsPage />} />
        <Route path="our-story" element={<OurStorySettingsPage />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="stock-take" element={<StockTake />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="subcategories" element={<SubCategoryManagement />} />
        <Route path="brands" element={<BrandManagement />} />
        <Route path="units" element={<UnitManagement />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      <Route 
        path="/customer/*" 
        element={isCustomer ? <CustomerLayout onLogout={signOut} /> : <Navigate to="/" />}
      >
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="*" element={<Navigate to="dashboard" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
