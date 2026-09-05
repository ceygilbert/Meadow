
import { createClient } from '@supabase/supabase-js';

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

// Values from the user's .env file provided in the prompt
const FALLBACK_URL = 'https://hxfftpvzumcvtnzbpegb.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4ZmZ0cHZ6dW1jdnRuemJwZWdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NzA0NTUsImV4cCI6MjA4NDE0NjQ1NX0.Fgn2rbrtdkUv8i6IWqnS5WxUeTIiRtwVy8MFmPFzPHg';

export const supabaseUrl = getEnvVar('SUPABASE_URL') || FALLBACK_URL;
export const supabaseAnonKey = getEnvVar('SUPABASE_ANON_KEY') || FALLBACK_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseUrl.startsWith('https://'));

if (!isSupabaseConfigured) {
  console.error("Supabase URL is invalid or missing. Please check your environment variables (SUPABASE_URL).");
} else {
  console.log(`Supabase initialized with URL: ${supabaseUrl.substring(0, 15)}...`);
}

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

// Initialize the client with the detected or fallback values
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: resilientFetch
  }
});
