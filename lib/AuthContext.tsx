
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';
import { Profile } from '../types';

interface AuthContextType {
  session: any;
  user: any;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchingRef = useRef<string | null>(null);

  const fetchProfile = async (userId: string, currentUser?: any, retryCount = 0): Promise<any> => {
    // Prevent parallel fetches for same user at base attempt
    if (fetchingRef.current === userId && retryCount === 0) {
      return;
    }
    
    fetchingRef.current = userId;
    
    // Create an AbortController for cancellation
    const controller = new AbortController();
    const timeoutValue = 10000 + (retryCount * 5000); // 10s, 15s, 20s
    const timeoutId = setTimeout(() => controller.abort(), timeoutValue);
    
    try {
      const { data, error } = await (supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle() as any)
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);
      
      if (error) {
        const errorMsg = error.message || String(error);
        const isTransient = 
          error.status === 502 || 
          error.status === 504 || 
          error.status === 0 || 
          errorMsg.includes('Failed to fetch') || 
          errorMsg.includes('TypeError') || 
          errorMsg.includes('network') || 
          errorMsg.includes('FetchError') || 
          errorMsg.includes('aborted');

        if (retryCount < 2 && isTransient) {
          console.warn(`[Auth] Transient profile fetch issue for ${userId}, retrying attempt ${retryCount + 2}...`);
          const delay = (retryCount + 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchProfile(userId, currentUser, retryCount + 1);
        }

        // Construct safe fallback profile from available user session data
        console.warn(`[Auth] Could not retrieve profile from database, utilizing session fallback`);
        if (currentUser) {
          const isUserAdmin = currentUser.user_metadata?.role === 'admin' || currentUser.email?.includes('admin@meadow');
          const fallbackProfile: Profile = {
            id: userId,
            full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Member',
            email: currentUser.email || '',
            phone: currentUser.user_metadata?.phone || '',
            address: '',
            avatar_url: currentUser.user_metadata?.avatar_url || '',
            role: isUserAdmin ? 'admin' : 'customer',
            created_at: new Date().toISOString()
          };
          setProfile(fallbackProfile);
        } else {
          setProfile(null);
        }
        fetchingRef.current = null;
        return null;
      }
      
      if (data) {
        setProfile(data);
      } else if (currentUser) {
        // No record exists in table yet, generate a default profile for the authenticated user
        const isUserAdmin = currentUser.user_metadata?.role === 'admin' || currentUser.email?.includes('admin@meadow');
        const defaultProfile: Profile = {
          id: userId,
          full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Member',
          email: currentUser.email || '',
          phone: currentUser.user_metadata?.phone || '',
          address: '',
          avatar_url: currentUser.user_metadata?.avatar_url || '',
          role: isUserAdmin ? 'admin' : 'customer',
          created_at: new Date().toISOString()
        };
        setProfile(defaultProfile);
      } else {
        setProfile(null);
      }
      
      fetchingRef.current = null;
      return data;
    } catch (err: any) {
      clearTimeout(timeoutId);
      
      const isTransient = 
        err.name === 'AbortError' || 
        err.message === 'aborted' || 
        err.message?.includes('Failed to fetch') ||
        err.message?.includes('TypeError');
      
      if (isTransient && retryCount < 2) {
        console.warn(`[Auth] Retrying profile fetch for ${userId} (attempt ${retryCount + 2})...`);
        const delay = (retryCount + 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchProfile(userId, currentUser, retryCount + 1);
      }
      
      if (currentUser) {
        const isUserAdmin = currentUser.user_metadata?.role === 'admin' || currentUser.email?.includes('admin@meadow');
        const fallbackProfile: Profile = {
          id: userId,
          full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Member',
          email: currentUser.email || '',
          phone: currentUser.user_metadata?.phone || '',
          address: '',
          avatar_url: currentUser.user_metadata?.avatar_url || '',
          role: isUserAdmin ? 'admin' : 'customer',
          created_at: new Date().toISOString()
        };
        setProfile(fallbackProfile);
      } else {
        setProfile(null);
      }
      
      fetchingRef.current = null;
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Safety timeout
    const safetyTimeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 10000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'USER_UPDATED') {
          const fetchPromise = fetchProfile(session.user.id, session.user);
          
          fetchPromise.finally(() => {
            if (mounted) setLoading(false);
          });

          setTimeout(() => {
            if (mounted) setLoading(false);
          }, 3000);
        } else {
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id, user);
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    isCustomer: profile?.role === 'customer',
    signOut,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
