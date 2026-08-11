import { supabase } from '../lib/supabase';
import { HomePageSettings } from '../types';

export const DEFAULT_HOMEPAGE_SETTINGS: HomePageSettings = {
  id: 'home',
  hero_bg_text: 'Precision Engineering',
  hero_title: 'Next-Gen Computing & Custom Builds',
  hero_subtitle: 'Explore high performance laptops, workstations, and custom PC components.',
  banners: [
    {
      id: 'banner-1',
      image_url: 'https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/banner_1.png',
      title: 'Precision Performance',
      subtitle: 'Build your dream custom rig with top hardware',
      link: '/customised',
      button_text: 'Start Building',
      is_active: true
    },
    {
      id: 'banner-2',
      image_url: 'https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/banner_2.jpg',
      title: 'Flagship Laptops & Monitors',
      subtitle: 'Discover top deals on laptops & displays',
      link: '/products?category=laptop',
      button_text: 'Shop Laptops',
      is_active: true
    }
  ],
  categories: [
    { id: 'cat-1', name: 'PC Component', slug: 'pc-component', image_url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80', is_active: true, order: 1 },
    { id: 'cat-2', name: 'Laptop', slug: 'laptop', image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80', is_active: true, order: 2 },
    { id: 'cat-3', name: 'Peripheral', slug: 'peripheral', image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80', is_active: true, order: 3 },
    { id: 'cat-4', name: 'Monitor', slug: 'monitor', image_url: 'https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&q=80', is_active: true, order: 4 },
    { id: 'cat-5', name: 'Desktop', slug: 'desktop', image_url: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80', is_active: true, order: 5 },
    { id: 'cat-6', name: 'Home & Office', slug: 'home-office', image_url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80', is_active: true, order: 6 },
    { id: 'cat-7', name: 'Networking', slug: 'networking', image_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80', is_active: true, order: 7 },
    { id: 'cat-8', name: 'Smart Home', slug: 'smart-home', image_url: 'https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/smart_house.jpg?auto=format&fit=crop&q=80', is_active: true, order: 8 }
  ],
  custom_pc_title: 'Build Your Own PC.',
  custom_pc_subtitle: 'Pick your parts step by step to build your dream PC that suits your budget and needs. Full warranty and after-sales support.',
  custom_pc_btn_text: 'Start Building',
  custom_pc_btn_link: '/customised',
  custom_pc_bg_image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80',
  store_section_title: 'Visit Our Store.',
  store_card_title: 'View All Meadow\nComputer Mega Store\nLocation.',
  store_btn_text: 'Our Store',
  store_btn_link: '/our-stores',
  store_video_label: 'TAMAN PELANGI ASUS STORE',
  store_media_url: 'https://illuminatelabs.space/assets/locator_vd.mp4',
  store_media_type: 'video'
};

const LOCAL_STORAGE_KEY = 'meadow_homepage_settings';
const DB_SETTINGS_ID = '00000000-0000-0000-0000-000000000001';
const DB_PREFIX = 'HOMEPAGE_SETTINGS:';

export async function fetchHomePageSettings(): Promise<HomePageSettings> {
  // 1. Try reading from Supabase table 'homepage_settings' first
  try {
    const { data, error } = await supabase
      .from('homepage_settings')
      .select('*')
      .eq('id', 'home')
      .maybeSingle();

    if (!error && data) {
      const merged: HomePageSettings = {
        id: 'home',
        hero_bg_text: data.hero_bg_text ?? DEFAULT_HOMEPAGE_SETTINGS.hero_bg_text,
        hero_title: data.hero_title ?? DEFAULT_HOMEPAGE_SETTINGS.hero_title,
        hero_subtitle: data.hero_subtitle ?? DEFAULT_HOMEPAGE_SETTINGS.hero_subtitle,
        banners: Array.isArray(data.banners) && data.banners.length > 0 ? data.banners : DEFAULT_HOMEPAGE_SETTINGS.banners,
        categories: Array.isArray(data.categories) && data.categories.length > 0 ? data.categories : DEFAULT_HOMEPAGE_SETTINGS.categories,
        custom_pc_title: data.custom_pc_title ?? DEFAULT_HOMEPAGE_SETTINGS.custom_pc_title,
        custom_pc_subtitle: data.custom_pc_subtitle ?? DEFAULT_HOMEPAGE_SETTINGS.custom_pc_subtitle,
        custom_pc_btn_text: data.custom_pc_btn_text ?? DEFAULT_HOMEPAGE_SETTINGS.custom_pc_btn_text,
        custom_pc_btn_link: data.custom_pc_btn_link ?? DEFAULT_HOMEPAGE_SETTINGS.custom_pc_btn_link,
        custom_pc_bg_image: data.custom_pc_bg_image ?? DEFAULT_HOMEPAGE_SETTINGS.custom_pc_bg_image,
        store_section_title: data.store_section_title ?? DEFAULT_HOMEPAGE_SETTINGS.store_section_title,
        store_card_title: data.store_card_title ?? DEFAULT_HOMEPAGE_SETTINGS.store_card_title,
        store_btn_text: data.store_btn_text ?? DEFAULT_HOMEPAGE_SETTINGS.store_btn_text,
        store_btn_link: data.store_btn_link ?? DEFAULT_HOMEPAGE_SETTINGS.store_btn_link,
        store_video_label: data.store_video_label ?? DEFAULT_HOMEPAGE_SETTINGS.store_video_label,
        store_media_url: data.store_media_url ?? DEFAULT_HOMEPAGE_SETTINGS.store_media_url,
        store_media_type: data.store_media_type ?? DEFAULT_HOMEPAGE_SETTINGS.store_media_type,
        updated_at: data.updated_at
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    // Ignore and fallback
  }

  // 2. Query system settings row in database
  try {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .eq('id', DB_SETTINGS_ID)
      .maybeSingle();

    if (!error && data && data.name && data.name.startsWith(DB_PREFIX)) {
      const jsonStr = data.name.substring(DB_PREFIX.length);
      const parsed = JSON.parse(jsonStr);
      const merged: HomePageSettings = {
        ...DEFAULT_HOMEPAGE_SETTINGS,
        ...parsed
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn('Unable to query homepage settings from database:', err);
  }

  // 3. Fallback to LocalStorage
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    try {
      return {
        ...DEFAULT_HOMEPAGE_SETTINGS,
        ...JSON.parse(cached)
      };
    } catch (e) {
      console.error('Error parsing cached homepage settings:', e);
    }
  }

  return DEFAULT_HOMEPAGE_SETTINGS;
}

export async function saveHomePageSettings(settings: HomePageSettings): Promise<{ success: boolean; message?: string }> {
  const settingsToSave = {
    ...settings,
    id: 'home',
    updated_at: new Date().toISOString()
  };

  // 1. Update local storage cache
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settingsToSave));

  let savedToDb = false;

  // 2. Try saving to 'homepage_settings' table
  try {
    const { error } = await supabase
      .from('homepage_settings')
      .upsert(settingsToSave, { onConflict: 'id' });

    if (!error) {
      savedToDb = true;
    }
  } catch (err) {
    // Table may not exist yet
  }

  // 3. Save to database system settings record ('units' table persistence)
  try {
    const dbPayload = {
      id: DB_SETTINGS_ID,
      name: DB_PREFIX + JSON.stringify(settingsToSave)
    };
    const { error } = await supabase
      .from('units')
      .upsert(dbPayload, { onConflict: 'id' });

    if (!error) {
      savedToDb = true;
    } else {
      console.warn('Database save warning:', error.message);
    }
  } catch (err: any) {
    console.warn('Error persisting homepage settings to database:', err);
  }

  if (savedToDb) {
    return { success: true, message: 'Home page settings saved to database successfully!' };
  } else {
    return { success: true, message: 'Settings saved locally.' };
  }
}

