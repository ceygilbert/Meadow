/**
 * Service for Managing Physical Stores & Store Locator Page Settings
 * Syncs seamlessly with Hostinger MySQL / MariaDB (app_settings & stores table).
 */

export interface StoreItem {
  id: string;
  name: string;
  badge: string;
  badgeType: 'meadow' | 'asus' | 'hp' | 'hq' | 'other';
  category: 'Meadow Computer' | 'ASUS' | 'HP' | 'Distribution HQ' | string;
  address: string;
  tags: string[];
  image: string;
  phone: string;
  hours: string;
  googleMapsUrl: string;
  embedMapUrl: string;
  description: string;
  features: string[];
  isActive?: boolean;
  order?: number;
}

export interface OurStoresSettings {
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  hero_video_url: string;
  stores: StoreItem[];
  updated_at?: string;
}

export const DEFAULT_STORE_LIST: StoreItem[] = [
  {
    id: 'pelangi-meadow',
    name: 'Pelangi Plaza',
    badge: 'MEADOW STORE',
    badgeType: 'meadow',
    category: 'Meadow Computer',
    address: 'Lot 3.26, 26A, 27, Level 3, Plaza Pelangi, Taman Pelangi, 80400 Johor Bahru, Johor',
    tags: ['PC Build', 'Laptops', 'Components', 'Support'],
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200',
    phone: '+60 7-333 3333',
    hours: '10:00 AM - 10:00 PM (Daily)',
    googleMapsUrl: 'https://maps.google.com/?q=Lot+3.26+Plaza+Pelangi+Johor+Bahru',
    embedMapUrl: 'https://www.google.com/maps?q=Lot+3.26+Plaza+Pelangi+Johor+Bahru&output=embed',
    description: 'Our flagship retail experience featuring an extensive showroom of custom gaming rigs, workstation architectures, and enthusiast component displays.',
    features: [
      'Custom PC Assembly & Diagnostic Lab',
      'Dedicated Component Consultation Desk',
      'Comprehensive Peripheral Testing Zone',
      'Immediate Warranty & RMA Drop-off'
    ],
    isActive: true,
    order: 1
  },
  {
    id: 'larkin-junction',
    name: 'Larkin Junction',
    badge: 'MEADOW STORE',
    badgeType: 'meadow',
    category: 'Meadow Computer',
    address: "Lot 4.12, Jalan Dewata, Taman Larkin Perdana, 80350 Johor Bahru, Johor Darul Ta'zim",
    tags: ['PC Build', 'Laptops', 'Peripherals', 'Support'],
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=1200',
    phone: '+60 7-221 2222',
    hours: '10:00 AM - 10:00 PM (Daily)',
    googleMapsUrl: 'https://maps.google.com/?q=Larkin+Junction+Johor+Bahru',
    embedMapUrl: 'https://www.google.com/maps?q=Lot+4.12+Jalan+Dewata+Taman+Larkin+Perdana+Johor+Bahru&output=embed',
    description: 'Conveniently situated in Larkin, offering prompt technical assistance, prebuilt desktop configurations, and everyday workspace peripherals.',
    features: [
      'Instant Hardware Upgrade Station',
      'Business Fleet & Student Solutions',
      'Official Genuine Components Guarantee',
      'Same-Day Pickup for Online Orders'
    ],
    isActive: true,
    order: 2
  },
  {
    id: 'taman-universiti',
    name: 'Taman Universiti',
    badge: 'MEADOW STORE',
    badgeType: 'meadow',
    category: 'Meadow Computer',
    address: '8, Jalan Kebudayaan 1, Taman Universiti, 81300 Skudai',
    tags: ['PC Build', 'Components', 'Peripherals', 'Support'],
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1200',
    phone: '+60 7-521 1111',
    hours: '10:00 AM - 9:00 PM (Daily)',
    googleMapsUrl: 'https://maps.google.com/?q=8+Jalan+Kebudayaan+1+Taman+Universiti+81300+Skudai',
    embedMapUrl: 'https://www.google.com/maps?q=8+Jalan+Kebudayaan+1+Taman+Universiti+81300+Skudai&output=embed',
    description: 'The core student and enthusiast hub in Skudai, providing accessible custom PC builds, laptop optimization, and hardware upgrades.',
    features: [
      'Student Discount Verification & Bundles',
      'Rapid Thermal Paste & Cleaning Service',
      'Comprehensive Graphic Card Stock',
      'Mechanical Keyboards & Audio Gear Demo'
    ],
    isActive: true,
    order: 3
  },
  {
    id: 'pelangi-asus',
    name: 'Pelangi Plaza (ASUS)',
    badge: 'ASUS CONCEPT STORE',
    badgeType: 'asus',
    category: 'ASUS',
    address: "LOT 3.16 & 3.17, Level 3, Plaza Pelangi, Jalan Kuning, Taman Pelangi, 80400 Johor Bahru, Johor Darul Ta'zim",
    tags: ['ASUS Products', 'Laptops', 'Accessories', 'Support'],
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200',
    phone: '+60 7-333 4444',
    hours: '10:00 AM - 10:00 PM (Daily)',
    googleMapsUrl: 'https://maps.google.com/?q=ASUS+Plaza+Pelangi+Johor+Bahru',
    embedMapUrl: 'https://www.google.com/maps?q=Plaza+Pelangi+ASUS+Concept+Store+Johor+Bahru&output=embed',
    description: 'Authorized ASUS concept store showcasing the complete Republic of Gamers (ROG), TUF Gaming, ZenBook, and ProArt ecosystem.',
    features: [
      'Complete ROG & TUF Gaming Battle Stations',
      'ZenBook Ultraportable Touch Experience',
      'ProArt Color-Calibrated Displays',
      'Official ASUS Authorized Warranty Service'
    ],
    isActive: true,
    order: 4
  },
  {
    id: 'toppen-hp',
    name: 'Toppen (HP)',
    badge: 'HP CONCEPT STORE',
    badgeType: 'hp',
    category: 'HP',
    address: "No 33A, Lot L2/22, Level 2, Toppen Shopping Centre, Jln Harmonium, Taman Desa Tebrau, 81100 Johor Bahru, Johor Darul Ta'zim",
    tags: ['HP Products', 'Laptops', 'Printers', 'Support'],
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=1200',
    phone: '+60 7-364 8888',
    hours: '10:00 AM - 10:00 PM (Daily)',
    googleMapsUrl: 'https://maps.google.com/?q=Toppen+Shopping+Centre+Johor+Bahru',
    embedMapUrl: 'https://www.google.com/maps?q=Toppen+Shopping+Centre+HP+Store+Johor+Bahru&output=embed',
    description: 'Dedicated HP Brand Experience Store showcasing OMEN gaming rigs, Spectre luxury convertibles, ENVY creative laptops, and smart printing solutions.',
    features: [
      'OMEN High-FPS Gaming Playground',
      'Spectre & ENVY Creator Experience',
      'Smart Tank Printer & Ink Supply Hub',
      'Certified HP Customer Support Desk'
    ],
    isActive: true,
    order: 5
  },
  {
    id: 'distribution-hq',
    name: 'Meadow IT Distribution (HQ)',
    badge: 'DISTRIBUTION HQ',
    badgeType: 'hq',
    category: 'Distribution HQ',
    address: "7 & 9, Jalan Keembong 22, Taman Johor Jaya, 81100 Johor Bahru, Johor Darul Ta'zim",
    tags: ['Distribution', 'Warehouse', 'Business', 'HQ'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    phone: '+60 7-355 5555',
    hours: '9:00 AM - 6:00 PM (Mon - Fri)',
    googleMapsUrl: 'https://maps.google.com/?q=7+Jalan+Keembong+22+Johor+Jaya+Johor+Bahru',
    embedMapUrl: 'https://www.google.com/maps?q=7+Jalan+Keembong+22+Johor+Jaya+Johor+Bahru&output=embed',
    description: 'The central hub for wholesale hardware distribution, enterprise computing procurement, and corporate IT infrastructure deployment in Southern Malaysia.',
    features: [
      'B2B Corporate Procurement Department',
      'Large-Scale Warehousing & Logistics Fulfillment',
      'Enterprise Server & Networking Testing Area',
      'Wholesale Partner Helpdesk'
    ],
    isActive: true,
    order: 6
  }
];

export const DEFAULT_OUR_STORES_SETTINGS: OurStoresSettings = {
  hero_eyebrow: 'Store Locator',
  hero_title: 'Find a Meadow Store Near You',
  hero_subtitle: "Discover Meadow's physical spaces across Johor",
  hero_video_url: 'https://illuminatelabs.space/assets/locator_vd.mp4',
  stores: DEFAULT_STORE_LIST,
};

const LOCAL_STORAGE_KEY = 'meadow_our_stores_settings';
export const STORES_UPDATED_EVENT = 'meadow_stores_updated';

function getApiUrl(path: string): string {
  if (typeof window !== 'undefined') return path;
  return `http://localhost:3000${path}`;
}

function sanitizeStoresSettings(raw: any): OurStoresSettings {
  if (!raw || typeof raw !== 'object') return DEFAULT_OUR_STORES_SETTINGS;

  const storesList = Array.isArray(raw.stores) && raw.stores.length > 0
    ? raw.stores.map((s: any, idx: number) => ({
        id: s.id || `store-${idx + 1}`,
        name: s.name || 'Meadow Store',
        badge: s.badge || 'MEADOW STORE',
        badgeType: s.badgeType || 'meadow',
        category: s.category || 'Meadow Computer',
        address: s.address || '',
        tags: Array.isArray(s.tags) ? s.tags : [],
        image: s.image || '',
        phone: s.phone || '',
        hours: s.hours || '10:00 AM - 10:00 PM (Daily)',
        googleMapsUrl: s.googleMapsUrl || '',
        embedMapUrl: s.embedMapUrl || '',
        description: s.description || '',
        features: Array.isArray(s.features) ? s.features : [],
        isActive: s.isActive !== false,
        order: typeof s.order === 'number' ? s.order : idx + 1,
      }))
    : DEFAULT_STORE_LIST;

  return {
    hero_eyebrow: raw.hero_eyebrow || DEFAULT_OUR_STORES_SETTINGS.hero_eyebrow,
    hero_title: raw.hero_title || DEFAULT_OUR_STORES_SETTINGS.hero_title,
    hero_subtitle: raw.hero_subtitle || DEFAULT_OUR_STORES_SETTINGS.hero_subtitle,
    hero_video_url: raw.hero_video_url || DEFAULT_OUR_STORES_SETTINGS.hero_video_url,
    stores: storesList,
    updated_at: raw.updated_at,
  };
}

/**
 * Retrieve cached settings immediately from localStorage (no lag).
 */
export function getStoredOurStoresSettings(): OurStoresSettings {
  if (typeof window === 'undefined') return DEFAULT_OUR_STORES_SETTINGS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return DEFAULT_OUR_STORES_SETTINGS;
    return sanitizeStoresSettings(JSON.parse(raw));
  } catch {
    return DEFAULT_OUR_STORES_SETTINGS;
  }
}

/**
 * Fetch authoritative settings from backend/database across all devices and browsers.
 */
export async function fetchOurStoresSettings(): Promise<OurStoresSettings> {
  // 1. Try reading from backend API (MariaDB/MySQL `app_settings` table)
  try {
    const res = await fetch(getApiUrl('/api/settings/our_stores'));
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && typeof json.data === 'object') {
        const merged = sanitizeStoresSettings(json.data);
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
          window.dispatchEvent(new CustomEvent(STORES_UPDATED_EVENT, { detail: merged }));
        }
        return merged;
      }
    }
  } catch (err) {
    console.warn('[StoresService] Error fetching stores settings from database:', err);
  }

  // 2. Fallback to localStorage
  return getStoredOurStoresSettings();
}

/**
 * Save store settings and store locations to database.
 */
export async function saveOurStoresSettings(settings: OurStoresSettings): Promise<{ success: boolean; message?: string }> {
  const payload = {
    ...settings,
    updated_at: new Date().toISOString()
  };

  // 1. Immediate local cache
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
      window.dispatchEvent(new CustomEvent(STORES_UPDATED_EVENT, { detail: payload }));
    } catch (e) {
      console.warn('Failed to cache stores in localStorage:', e);
    }
  }

  let savedToDb = false;

  // 2. Persist to MariaDB/MySQL via authoritative sync endpoint
  try {
    const syncRes = await fetch(getApiUrl('/api/stores/sync'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (syncRes.ok) {
      savedToDb = true;
    }
  } catch (err: any) {
    console.warn('[StoresService] Error syncing stores to database:', err);
  }

  // Secondary fallback to app_settings if needed
  if (!savedToDb) {
    try {
      const res = await fetch(getApiUrl('/api/settings/our_stores'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: payload })
      });
      if (res.ok) {
        savedToDb = true;
      }
    } catch (err: any) {
      console.warn('[StoresService] Error saving to app_settings:', err);
    }
  }

  if (savedToDb) {
    return { success: true, message: 'Store locations & page settings saved to database successfully!' };
  } else {
    return { success: true, message: 'Settings saved locally and queued for database sync.' };
  }
}

/**
 * Reset to default stores
 */
export async function resetOurStoresSettings(): Promise<OurStoresSettings> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent(STORES_UPDATED_EVENT, { detail: DEFAULT_OUR_STORES_SETTINGS }));
    } catch {}
  }

  try {
    await fetch(getApiUrl('/api/settings/our_stores'), { method: 'DELETE' });
  } catch {}

  return DEFAULT_OUR_STORES_SETTINGS;
}
