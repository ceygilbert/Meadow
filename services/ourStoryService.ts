import { supabase } from '../lib/supabase';
import { OurStorySettings } from '../types';

export const DEFAULT_OUR_STORY_SETTINGS: OurStorySettings = {
  id: 'our_story',
  hero_eyebrow: 'Our Story',
  hero_title: '30 Years as Johor Leading Retailers and Distributors',
  hero_paragraph_1: 'Founded in 1995, Meadow has been serving customers across Johor for more than 30 years through IT distribution, wholesale and multi-brand retail. Over the years, we have grown alongside the industry while building trusted relationships with leading technology brands and the customers we serve.',
  hero_paragraph_2: 'Today, that foundation continues to shape our growth as we expand our retail presence, strengthen our customer support services, and make technology products more accessible, reliable and easier to shop with confidence for our customers.',
  hero_image_url: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&q=80',

  foundations_eyebrow: 'Foundations',
  foundations_title: 'We help every customer choose the right products with genuine advice and the right value for their needs.',
  foundations_feature1_title: 'Official Brand Partnership',
  foundations_feature1_desc: 'As one of the largest distributors in Johor, we work with leading brands across laptops, printers, monitors, PC components and everyday IT products, giving customers more choice from brands they trust in one place.',
  foundations_feature2_title: 'Workshop Backed Support',
  foundations_feature2_desc: 'Our in-store workshop supports customers with problem diagnosis, formatting, dust cleaning, warranty coordination and technical follow-up after purchase.',
  foundations_image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',

  locations_eyebrow: 'Distribution',
  locations_title: 'Our Locations',
  locations_desc: 'Across Meadow signature stores and official HP and ASUS concept stores, customers can browse, compare, and get practical advice in person. From laptops and printers to PC components and custom builds, our team is here to help you choose with greater clarity and confidence.',
  locations_btn_text: 'Explore our locations',
  locations_btn_link: '/our-stores',
  locations_image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',

  awards_section_title: "We're Multi-Award Company.",
  awards_section_desc: 'We have been honored with awards from multiple international brands and local authorities, recognized for our nationwide distribution capabilities and our best-in-class products and services.',
  awards_tag_label: 'Award List',
  award_cards: [
    {
      id: 'asus',
      company: 'ASUSTeK Computer Inc',
      type: 'Computer Hardware Company',
      logo_url: '',
      awards: [
        'Millions Dollar Award',
        'Top Contribution Award',
        'Top Performance Partner Award'
      ],
      duration: 'Consecutively 2015-2023 Award Winner'
    },
    {
      id: 'msi',
      company: 'Micro-Star International Co. Ltd',
      type: 'Computer Hardware Company',
      logo_url: '',
      awards: [
        'Outstanding Award',
        'Top Performance Award',
        'Best Performance Award',
        'Online Best Performance Award'
      ],
      duration: 'Consecutively 2013-2024 Award Winner'
    },
    {
      id: 'gigabyte',
      company: 'Gigabyte Technology Co., Ltd.',
      type: 'Computer Hardware & Components',
      logo_url: '',
      awards: [
        'Excellence in Retail Sales',
        'Outstanding System Integrator Partner',
        'Top Growth Partner Award'
      ],
      duration: 'Consecutively 2016-2024 Award Winner'
    },
    {
      id: 'hp',
      company: 'HP Inc. Malaysia',
      type: 'Computing & Printing Technology',
      logo_url: '',
      awards: [
        'Best Retail Growth Award',
        'Outstanding Concept Store Partner',
        'Top Consumer PC Partner'
      ],
      duration: 'Consecutively 2016-2024 Award Winner'
    }
  ],

  commitment_eyebrow: 'Our Commitment',
  commitment_quote: '"We serve those who define the future. To provide anything less than perfection would be to fail the vision of our clients."',
  val1_title: 'Integrity',
  val1_desc: 'Honest consultation, transparent pricing, and genuine components from verified global supply chains.',
  val2_title: 'Mastery',
  val2_desc: 'Continuous research into emerging hardware architectures and thermal optimization techniques.',
  val3_title: 'Support',
  val3_desc: 'A lifecycle-long commitment to the machines we build, ensuring they evolve with your ambitions.'
};

const LOCAL_STORAGE_KEY = 'meadow_our_story_settings';
const DB_SETTINGS_ID = '00000000-0000-0000-0000-000000000002';
const DB_PREFIX = 'OUR_STORY_SETTINGS:';

export async function fetchOurStorySettings(): Promise<OurStorySettings> {
  // 1. Try reading from dedicated Supabase table 'our_story_settings'
  try {
    const { data, error } = await supabase
      .from('our_story_settings')
      .select('*')
      .eq('id', 'our_story')
      .maybeSingle();

    if (!error && data) {
      const merged: OurStorySettings = {
        ...DEFAULT_OUR_STORY_SETTINGS,
        ...data
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    // Ignore and fallback
  }

  // 2. Query system database row in units table
  try {
    const { data, error } = await supabase
      .from('units')
      .select('*')
      .eq('id', DB_SETTINGS_ID)
      .maybeSingle();

    if (!error && data && data.name && data.name.startsWith(DB_PREFIX)) {
      const jsonStr = data.name.substring(DB_PREFIX.length);
      const parsed = JSON.parse(jsonStr);
      const merged: OurStorySettings = {
        ...DEFAULT_OUR_STORY_SETTINGS,
        ...parsed
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn('Unable to query our story settings from database:', err);
  }

  // 3. Fallback to LocalStorage
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    try {
      return {
        ...DEFAULT_OUR_STORY_SETTINGS,
        ...JSON.parse(cached)
      };
    } catch (e) {
      console.error('Error parsing cached our story settings:', e);
    }
  }

  return DEFAULT_OUR_STORY_SETTINGS;
}

export async function saveOurStorySettings(settings: OurStorySettings): Promise<{ success: boolean; message?: string }> {
  const settingsToSave = {
    ...settings,
    updated_at: new Date().toISOString()
  };

  // 1. Update local storage cache
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settingsToSave));

  let savedToDb = false;

  // 2. Try saving to 'our_story_settings' table
  try {
    const { error } = await supabase
      .from('our_story_settings')
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
    console.warn('Error persisting our story settings to database:', err);
  }

  if (savedToDb) {
    return { success: true, message: 'Our Story settings saved to database successfully!' };
  } else {
    return { success: true, message: 'Settings saved locally.' };
  }
}
