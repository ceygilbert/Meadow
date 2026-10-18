import { createClient, processLock } from '@supabase/supabase-js';
import { MysqlQueryBuilder, mysqlStorage, mysqlAuth } from './mysqlClient';

/**
 * Robustly fetch environment variables.
 */
const getEnvVar = (key: string): string => {
  const viteKey = `VITE_${key}`;

  // Priority 1: process.env (Standard for many Node/Injected environments)
  try {
    if (typeof process !== 'undefined' && process.env) {
      if (process.env[viteKey]) return process.env[viteKey] as string;
      if (process.env[key]) return process.env[key] as string;
    }
  } catch (e) {}

  // Priority 2: import.meta.env (Standard Vite)
  try {
    const metaEnv = (import.meta as any).env;
    if (metaEnv) {
      if (metaEnv[viteKey]) return metaEnv[viteKey];
      if (metaEnv[key]) return metaEnv[key];
    }
  } catch (e) {}

  return '';
};

// Database driver switch: 'mysql' or 'supabase'
export const getActiveDatabaseDriver = (): 'mysql' | 'supabase' => {
  try {
    const stored = localStorage.getItem('meadow_db_driver');
    if (stored === 'mysql' || stored === 'supabase') return stored;
  } catch {}

  const envDriver = getEnvVar('USE_MYSQL') || getEnvVar('DB_DRIVER');
  if (envDriver === 'true' || envDriver === 'mysql') return 'mysql';

  return 'supabase';
};

export const setDatabaseDriver = (driver: 'mysql' | 'supabase') => {
  try {
    localStorage.setItem('meadow_db_driver', driver);
    window.location.reload();
  } catch (e) {
    console.warn('Failed to persist db driver:', e);
  }
};

// Values from the user's .env file
const FALLBACK_URL = 'https://ecscjefihrntuhumtqwe.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjc2NqZWZpaHJudHVodW10cXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1MjE0NDQsImV4cCI6MjEwNTA5NzQ0NH0.e5O14flqHFoue0297dp6JXmAAmDbrpkMp7-M66RE3k8';

export const supabaseUrl = getEnvVar('SUPABASE_URL') || FALLBACK_URL;
export const supabaseAnonKey = getEnvVar('SUPABASE_ANON_KEY') || FALLBACK_KEY;
export const isSupabaseConfigured = !!(supabaseUrl && supabaseUrl.startsWith('https://'));

/**
 * Resilient fetch wrapper with automatic retry for transient network dropouts,
 * iframe request interruptions, and "TypeError: Failed to fetch".
 */
const resilientFetch: typeof fetch = async (input, init) => {
  const maxRetries = 2;
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (init?.signal?.aborted) {
        throw new DOMException('Aborted', 'AbortError');
      }

      const response = await fetch(input, init);
      return response;
    } catch (err: any) {
      lastError = err;

      if (err.name === 'AbortError' || init?.signal?.aborted) {
        throw err;
      }

      const errMsg = String(err?.message || err || '');
      const isTransientNetworkIssue =
        err.name === 'TypeError' ||
        errMsg.includes('Failed to fetch') ||
        errMsg.includes('NetworkError') ||
        errMsg.includes('Load failed') ||
        errMsg.includes('aborted');

      if (attempt < maxRetries && isTransientNetworkIssue) {
        const delay = (attempt + 1) * 600;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw err;
    }
  }

  throw lastError;
};

/**
 * Safe auth lock implementation to prevent "AbortError: Lock broken by another request with the 'steal' option".
 * Uses processLock (in-memory sequential promise chain) instead of browser navigator.locks with steal:true,
 * preventing lock contention and crashes across tabs, iframes, and React StrictMode mounts.
 */
const safeAuthLock = async <R>(name: string, acquireTimeout: number, fn: () => Promise<R>): Promise<R> => {
  try {
    if (typeof processLock === 'function') {
      return await processLock(name, acquireTimeout, fn);
    }
    return await fn();
  } catch (err: any) {
    if (err?.name === 'AbortError' || String(err?.message || '').includes('steal')) {
      console.warn(`Recovered from lock contention for "${name}":`, err);
      return await fn();
    }
    throw err;
  }
};

// Standard Supabase client instance
const realSupabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    lock: safeAuthLock,
  },
  global: {
    fetch: resilientFetch,
  },
});

/**
 * Universal Database Client:
 * Automatically delegates to Hostinger MariaDB/MySQL when driver is 'mysql',
 * and seamlessly uses Supabase when driver is 'supabase'.
 */
export const supabase: any = new Proxy(realSupabase, {
  get(target, prop, receiver) {
    const isMysql = getActiveDatabaseDriver() === 'mysql';

    if (isMysql) {
      if (prop === 'from') {
        return (table: string) => new MysqlQueryBuilder(table);
      }
      if (prop === 'storage') {
        return mysqlStorage;
      }
      if (prop === 'auth') {
        return mysqlAuth;
      }
    }

    return Reflect.get(target, prop, receiver);
  },
});
