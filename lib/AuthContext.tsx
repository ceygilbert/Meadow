
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

  const fetchProfile = async (userId: string, retryCount = 0): Promise<any> => {
    // Prevent parallel fetches
    if (fetchingRef.current === userId && retryCount === 0) {
      return;
    }
    
    fetchingRef.current = userId;
    
    // Create an AbortController for true cancellation
    const controller = new AbortController();
    const timeoutValue = 30000 + (retryCount * 15000); // 30s, 45s, 60s, 75s, 90s
    const timeoutId = setTimeout(() => controller.abort(), timeoutValue);
    
    try {
      console.log(`[Auth] Fetching profile for ${userId}, Attempt ${retryCount + 1}, Timeout: ${timeoutValue}ms`);
      
      const { data, error } = await (supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle() as any)
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);
      
      if (error) {
        console.error(`[Auth] Profile fetch error for ${userId}:`, error);
        // Retry logic for transient errors
        if (retryCount < 4 && (error.status === 502 || error.status === 504 || error.status === 0 || error.message?.includes('network') || error.message?.includes('FetchError') || error.message?.includes('aborted'))) {
          const delay = Math.pow(2, retryCount) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchProfile(userId, retryCount + 1);
        }
        setProfile(null);
        fetchingRef.current = null;
        return null;
      }
      
      if (data) {
        setProfile(data);
        console.log(`[Auth] Profile loaded for ${userId}:`, data.role);
      } else {
        setProfile(null);
        console.log(`[Auth] No profile record found for ${userId}`);
      }
      
      fetchingRef.current = null;
      return data;
    } catch (err: any) {
      clearTimeout(timeoutId);
      
      const isTimeout = err.name === 'AbortError' || err.message === 'aborted' || err.message === 'TIMEOUT';
      
      if (isTimeout && retryCount < 4) {
        console.warn(`[Auth] Profile fetch TIMEOUT/ABORTED (${retryCount + 1}) for ${userId}, retrying in ${Math.pow(2, retryCount)}s...`);
        const delay = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchProfile(userId, retryCount + 1);
      }
      
      console.error(`[Auth] Profile fetch failed after retries:`, err);
      fetchingRef.current = null;
      setProfile(null);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Safety timeout
    const safetyTimeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 45000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'USER_UPDATED') {
          // Start fetching profile but don't strictly await it forever to unblock UI
          // if the network is extremely slow
          const fetchPromise = fetchProfile(session.user.id);
          
          // Initial unblock after first attempt (or quick success)
          fetchPromise.finally(() => {
            if (mounted) setLoading(false);
          });

          // Secondary unblock if it's taking too long
          setTimeout(() => {
            if (mounted) setLoading(false);
          }, 15000);
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
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
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
