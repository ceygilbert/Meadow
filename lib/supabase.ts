
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

const supabaseUrl = getEnvVar('SUPABASE_URL') || FALLBACK_URL;
const supabaseAnonKey = getEnvVar('SUPABASE_ANON_KEY') || FALLBACK_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseUrl.startsWith('https://'));

if (!isSupabaseConfigured) {
  console.error("Supabase URL is invalid or missing.");
}

// Initialize the client with the detected or fallback values
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
