import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';

export interface SupplierPageConfig {
  // Top Banner
  bannerImageUrl: string;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerBadge: string;
  bannerButtonText: string;
  bannerButtonLink: string;
  bannerOverlayOpacity: number; // e.g. 65
  bannerHeight?: number; // e.g. 680 (height in px)
  bannerImageFit?: 'cover' | 'contain'; // 'cover' or 'contain'

  // Showcase Section (Text above products grid)
  sectionBadge: string;
  sectionTitle: string;
  sectionDescription: string;

  // Selected Product IDs (Strict: ONLY these products are displayed)
  selectedProductIds: string[];
}

export const SUPPLIER_STORAGE_KEY = 'meadow_supplier_page_config_v1';
export const SUPPLIER_EVENT_NAME = 'meadow_supplier_page_updated';
export const SUPPLIER_CHANNEL_NAME = 'meadow_supplier_sync';

const DB_SETTINGS_ID = '00000000-0000-0000-0000-000000000003';
const DB_PREFIX = 'SUPPLIER_SETTINGS:';

export const DEFAULT_SUPPLIER_CONFIG: SupplierPageConfig = {
  bannerImageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2000&q=80",
  bannerTitle: "Authorized Direct Supplier & Distribution",
  bannerSubtitle: "Direct supply of premier computing hardware, enterprise systems, and components with official manufacturer warranties.",
  bannerBadge: "OFFICIAL DISTRIBUTION & SUPPLY NETWORK",
  bannerButtonText: "Explore Supplier Products",
  bannerButtonLink: "#supplier-products",
  bannerOverlayOpacity: 65,
  bannerHeight: 680,
  bannerImageFit: 'cover',

  sectionBadge: "VERIFIED HARDWARE",
  sectionTitle: "Official Supplier Products",
  sectionDescription: "Explore our verified catalog of distributor-sourced desktop systems, enterprise laptops, high-performance parts, and displays.",
  
  selectedProductIds: [],
};

// Create or reuse BroadcastChannel if available in browser
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
  try {
    broadcastChannel = new BroadcastChannel(SUPPLIER_CHANNEL_NAME);
  } catch (e) {
    console.warn('BroadcastChannel initialization error:', e);
  }
}

/**
 * Synchronous read from localStorage for instant zero-flicker UI render.
 */
export function getSupplierConfig(): SupplierPageConfig {
  if (typeof window === 'undefined') return DEFAULT_SUPPLIER_CONFIG;
  try {
    const raw = localStorage.getItem(SUPPLIER_STORAGE_KEY);
    if (!raw) return DEFAULT_SUPPLIER_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SUPPLIER_CONFIG,
      ...parsed,
      selectedProductIds: Array.isArray(parsed.selectedProductIds) ? parsed.selectedProductIds : []
    };
  } catch (err) {
    console.warn('Error reading supplier page config from localStorage:', err);
    return DEFAULT_SUPPLIER_CONFIG;
  }
}

/**
 * Fetch latest supplier configuration with database synchronization.
 * Checks Supabase DB and caches to localStorage.
 */
export async function fetchSupplierConfig(): Promise<SupplierPageConfig> {
  // 1. Check direct table 'supplier_settings' if created
  try {
    const { data, error } = await supabase
      .from('supplier_settings')
      .select('*')
      .eq('id', 'supplier')
      .maybeSingle();

    if (!error && data) {
      const merged: SupplierPageConfig = {
        ...DEFAULT_SUPPLIER_CONFIG,
        ...data,
        selectedProductIds: Array.isArray(data.selectedProductIds) ? data.selectedProductIds : []
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(SUPPLIER_STORAGE_KEY, JSON.stringify(merged));
      }
      return merged;
    }
  } catch (err) {
    // table may not exist
  }

  // 2. Query standard system units row (matching homepageService & ourStoryService)
  try {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .eq('id', DB_SETTINGS_ID)
      .maybeSingle();

    if (!error && data && data.name && data.name.startsWith(DB_PREFIX)) {
      const jsonStr = data.name.substring(DB_PREFIX.length);
      const parsed = JSON.parse(jsonStr);
      const merged: SupplierPageConfig = {
        ...DEFAULT_SUPPLIER_CONFIG,
        ...parsed,
        selectedProductIds: Array.isArray(parsed.selectedProductIds) ? parsed.selectedProductIds : []
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(SUPPLIER_STORAGE_KEY, JSON.stringify(merged));
      }
      return merged;
    }
  } catch (err) {
    console.warn('Unable to query supplier settings from database:', err);
  }

  // 3. Fallback to localStorage
  return getSupplierConfig();
}

/**
 * Save supplier page configuration:
 * 1. Synchronously updates localStorage
 * 2. Broadcasts event across tabs and components
 * 3. Persists to database in background
 */
export async function saveSupplierConfig(config: SupplierPageConfig): Promise<{ success: boolean; message?: string }> {
  const sanitizedConfig: SupplierPageConfig = {
    ...DEFAULT_SUPPLIER_CONFIG,
    ...config,
    selectedProductIds: Array.isArray(config.selectedProductIds) ? config.selectedProductIds : []
  };

  // 1. Synchronous localStorage update
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SUPPLIER_STORAGE_KEY, JSON.stringify(sanitizedConfig));
      window.dispatchEvent(new CustomEvent(SUPPLIER_EVENT_NAME, { detail: sanitizedConfig }));
      
      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: 'UPDATE', config: sanitizedConfig });
      }
    } catch (err) {
      console.error('Failed to save supplier page config locally:', err);
    }
  }

  // 2. Asynchronous DB persistence
  let savedToDb = false;

  // Try saving to 'supplier_settings' table
  try {
    const { error } = await supabase
      .from('supplier_settings')
      .upsert({
        id: 'supplier',
        ...sanitizedConfig,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (!error) savedToDb = true;
  } catch (err) {
    // Ignore if table not present
  }

  // Save to units table system settings record
  try {
    const dbPayload = {
      id: DB_SETTINGS_ID,
      name: DB_PREFIX + JSON.stringify(sanitizedConfig)
    };
    const { error } = await supabase
      .from('units')
      .upsert(dbPayload, { onConflict: 'id' });

    if (!error) {
      savedToDb = true;
    }
  } catch (err: any) {
    console.warn('Error persisting supplier settings to database units record:', err);
  }

  return { 
    success: true, 
    message: savedToDb ? 'Saved to database & synchronized!' : 'Settings updated locally.' 
  };
}

/**
 * Reset supplier page configuration to default values.
 */
export async function resetSupplierConfig(): Promise<SupplierPageConfig> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(SUPPLIER_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent(SUPPLIER_EVENT_NAME, { detail: DEFAULT_SUPPLIER_CONFIG }));
      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: 'UPDATE', config: DEFAULT_SUPPLIER_CONFIG });
      }
    } catch (err) {
      console.error('Failed to reset supplier page config:', err);
    }
  }

  // Reset database record
  try {
    await supabase.from('units').delete().eq('id', DB_SETTINGS_ID);
  } catch (e) {}

  return DEFAULT_SUPPLIER_CONFIG;
}

/**
 * React hook for consuming and updating supplier page configuration with real-time sync.
 */
export function useSupplierConfig() {
  const [config, setConfig] = useState<SupplierPageConfig>(() => getSupplierConfig());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. Read immediate local value
    setConfig(getSupplierConfig());

    // 2. Fetch remote DB value asynchronously to ensure sync across devices/browsers
    fetchSupplierConfig().then((fresh) => {
      setConfig(fresh);
    });

    // 3. Listen to CustomEvent in current window
    const handleCustomEvent = (e: Event) => {
      const custom = e as CustomEvent<SupplierPageConfig>;
      if (custom.detail) {
        setConfig(custom.detail);
      } else {
        setConfig(getSupplierConfig());
      }
    };

    // 4. Listen to StorageEvent (other windows with same origin)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === SUPPLIER_STORAGE_KEY || e.key === null) {
        setConfig(getSupplierConfig());
      }
    };

    // 5. Listen to BroadcastChannel (real-time cross-tab message)
    const handleChannelMessage = (e: MessageEvent) => {
      if (e.data && e.data.config) {
        setConfig(e.data.config);
      }
    };

    window.addEventListener(SUPPLIER_EVENT_NAME, handleCustomEvent);
    window.addEventListener('storage', handleStorage);
    if (broadcastChannel) {
      broadcastChannel.addEventListener('message', handleChannelMessage);
    }

    return () => {
      window.removeEventListener(SUPPLIER_EVENT_NAME, handleCustomEvent);
      window.removeEventListener('storage', handleStorage);
      if (broadcastChannel) {
        broadcastChannel.removeEventListener('message', handleChannelMessage);
      }
    };
  }, []);

  const save = useCallback(async (newConfig: SupplierPageConfig) => {
    setConfig(newConfig);
    return await saveSupplierConfig(newConfig);
  }, []);

  const reset = useCallback(async () => {
    const def = await resetSupplierConfig();
    setConfig(def);
    return def;
  }, []);

  return { config, setConfig, save, reset, loading };
}
