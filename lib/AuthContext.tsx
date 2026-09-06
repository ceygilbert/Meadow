
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
  isSuperAdmin?: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const CACHE_KEY_CURRENT = 'meadow_auth_profile_current';
const CACHE_KEY_USER_PREFIX = 'meadow_auth_profile_';
const CACHE_KEY_LAST_USER = 'meadow_last_active_user_id';

const getStoredProfile = (userId?: string): Profile | null => {
  try {
    if (userId) {
      const specific = localStorage.getItem(`${CACHE_KEY_USER_PREFIX}${userId}`);
      if (specific) {
        const parsed = JSON.parse(specific);
        if (parsed && (!parsed.id || parsed.id === userId)) return parsed;
      }
    }
    const current = localStorage.getItem(CACHE_KEY_CURRENT);
    if (current) {
      const parsed = JSON.parse(current);
      if (parsed && (!userId || parsed.id === userId)) return parsed;
    }
  } catch (e) {
    console.warn('[Auth] Failed to parse cached profile:', e);
  }
  return null;
};

const storeProfileInCache = (profileData: Profile) => {
  try {
    if (profileData && profileData.id) {
      localStorage.setItem(`${CACHE_KEY_USER_PREFIX}${profileData.id}`, JSON.stringify(profileData));
      localStorage.setItem(CACHE_KEY_CURRENT, JSON.stringify(profileData));
      localStorage.setItem(CACHE_KEY_LAST_USER, profileData.id);
    }
  } catch (e) {
    console.warn('[Auth] Failed to store profile in cache:', e);
  }
};

const clearProfileCache = (userId?: string) => {
  try {
    if (userId) {
      localStorage.removeItem(`${CACHE_KEY_USER_PREFIX}${userId}`);
    }
    const lastId = localStorage.getItem(CACHE_KEY_LAST_USER);
    if (lastId) {
      localStorage.removeItem(`${CACHE_KEY_USER_PREFIX}${lastId}`);
    }
    localStorage.removeItem(CACHE_KEY_CURRENT);
    localStorage.removeItem(CACHE_KEY_LAST_USER);
  } catch (e) {
    console.warn('[Auth] Failed to clear profile cache:', e);
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  
  // Synchronously initialize with cached profile to eliminate flash & premature unauth redirect
  const initialCachedProfile = getStoredProfile();
  const [profile, setProfile] = useState<Profile | null>(initialCachedProfile);
  const [loading, setLoading] = useState<boolean>(!initialCachedProfile);
  const fetchingRef = useRef<string | null>(null);

  const fetchProfile = async (
    userId: string, 
    currentUser?: any, 
    retryCount = 0,
    isSilent = false
  ): Promise<Profile | null> => {
    // Prevent duplicate parallel requests for the same user
    if (fetchingRef.current === userId && retryCount === 0) {
      return null;
    }
    
    fetchingRef.current = userId;
    
    // Create an AbortController for cancellation
    const controller = new AbortController();
    const timeoutValue = 10000 + (retryCount * 4000); // 10s, 14s, 18s
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
          console.warn(`[Auth] Transient profile fetch issue for ${userId}, retrying (${retryCount + 1})...`);
          const delay = (retryCount + 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchProfile(userId, currentUser, retryCount + 1, isSilent);
        }

        // On failure, preserve existing cached or current profile if valid!
        const existing = getStoredProfile(userId);
        if (existing) {
          console.warn(`[Auth] Could not refresh profile from DB; retaining valid cached profile (${existing.role})`);
          setProfile(existing);
          fetchingRef.current = null;
          return existing;
        }

        // Construct safe fallback profile from available user session data
        console.warn(`[Auth] Could not retrieve profile from database, utilizing session fallback`);
        if (currentUser) {
          const isUserAdmin = 
            currentUser.user_metadata?.role === 'admin' || 
            currentUser.email === 'chong3ryuan@gmail.com' ||
            currentUser.email?.includes('admin@meadow');
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
          storeProfileInCache(fallbackProfile);
        } else {
          setProfile(null);
        }
        fetchingRef.current = null;
        return null;
      }
      
      if (data) {
        setProfile(data);
        storeProfileInCache(data);
      } else if (currentUser) {
        // Check existing cache first
        const existing = getStoredProfile(userId);
        if (existing) {
          setProfile(existing);
        } else {
          const isUserAdmin = 
            currentUser.user_metadata?.role === 'admin' || 
            currentUser.email === 'chong3ryuan@gmail.com' ||
            currentUser.email?.includes('admin@meadow');
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
          storeProfileInCache(defaultProfile);
        }
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
        return fetchProfile(userId, currentUser, retryCount + 1, isSilent);
      }

      // Check existing cached profile
      const existing = getStoredProfile(userId);
      if (existing) {
        console.warn(`[Auth] Exception fetching profile for ${userId}; retaining valid cached profile (${existing.role})`);
        setProfile(existing);
        fetchingRef.current = null;
        return existing;
      }
      
      if (currentUser) {
        const isUserAdmin = 
          currentUser.user_metadata?.role === 'admin' || 
          currentUser.email === 'chong3ryuan@gmail.com' ||
          currentUser.email?.includes('admin@meadow');
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
        storeProfileInCache(fallbackProfile);
      } else {
        setProfile(null);
      }
      
      fetchingRef.current = null;
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Safety timeout in case of prolonged network stall
    const safetyTimeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 8000);

    // 1. Check existing session immediately via getSession()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        const cached = getStoredProfile(session.user.id);
        if (cached) {
          setProfile(cached);
          setLoading(false);
        }
        fetchProfile(session.user.id, session.user).finally(() => {
          if (mounted) setLoading(false);
        });
      } else {
        setSession(null);
        setUser(null);
        clearProfileCache();
        setProfile(null);
        setLoading(false);
      }
    }).catch((err) => {
      console.warn('[Auth] Initial getSession warning:', err);
      if (mounted) setLoading(false);
    });

    // 2. Subscribe to subsequent auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setProfile(null);
        clearProfileCache();
        setLoading(false);
        return;
      }
      
      setSession(newSession);
      setUser(newSession?.user || null);
      
      if (newSession?.user) {
        const cached = getStoredProfile(newSession.user.id);
        if (cached) {
          setProfile(cached);
          setLoading(false);
        }

        if (event === 'TOKEN_REFRESHED') {
          // Token refreshed quietly in the background without disturbing UI state or causing bounce
          fetchProfile(newSession.user.id, newSession.user, 0, true);
          return;
        }

        // On SIGNED_IN, INITIAL_SESSION, USER_UPDATED:
        fetchProfile(newSession.user.id, newSession.user).finally(() => {
          if (mounted) setLoading(false);
        });
      } else {
        if (event !== 'INITIAL_SESSION') {
          setProfile(null);
          clearProfileCache();
        }
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
    clearProfileCache(user?.id);
    setSession(null);
    setUser(null);
    setProfile(null);
    setLoading(false);
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
    isAdmin: profile?.role === 'admin' || profile?.role === 'superadmin',
    isSuperAdmin: profile?.role === 'superadmin',
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
