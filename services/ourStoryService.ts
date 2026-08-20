import { supabase } from '../lib/supabase';
import { OurStorySettings } from '../types';

export const DEFAULT_OUR_STORY_SETTINGS: OurStorySettings = {
  id: 'our_story',
  hero_eyebrow: 'OUR STORY',
  hero_title: 'A Trusted Name in PCs & Technology Since 1995.',
  hero_paragraph_1: 'Meadow Computer is a computer retailer and distributor offering a wide range of PCs, laptops, components, printers and everyday IT products through our retail stores. Our journey began in distribution in 1995, before gradually expanding into retail with Meadow Computer stores, together with official ASUS and HP concept stores.',
  hero_paragraph_2: 'Over the years, we have grown alongside the technology industry while building long-standing relationships with leading brands and the customers we serve.',
  hero_paragraph_3: 'For us, the experience does not end when a product is sold. We want customers to feel confident about what they buy, with practical advice before their purchase and dependable after-sales support whenever they need it.',
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

function sanitizeOurStorySettings(raw: Partial<OurStorySettings> | null | undefined): OurStorySettings {
  if (!raw) return { ...DEFAULT_OUR_STORY_SETTINGS };

  const merged: OurStorySettings = {
    ...DEFAULT_OUR_STORY_SETTINGS,
    ...raw
  };

  // Migrate legacy template hero text if found in storage/database
  if (
    !merged.hero_paragraph_1 ||
    merged.hero_paragraph_1.includes('Founded in 1995') ||
    merged.hero_paragraph_1.includes('technology retailer and distributor')
  ) {
    merged.hero_paragraph_1 = DEFAULT_OUR_STORY_SETTINGS.hero_paragraph_1;
  }

  if (
    !merged.hero_title ||
    merged.hero_title.includes('30 Years as Johor Leading Retailers and Distributors')
  ) {
    merged.hero_title = DEFAULT_OUR_STORY_SETTINGS.hero_title;
  }

  if (
    !merged.hero_eyebrow ||
    merged.hero_eyebrow.toLowerCase() === 'our story'
  ) {
    merged.hero_eyebrow = DEFAULT_OUR_STORY_SETTINGS.hero_eyebrow;
  }

  if (
    !merged.hero_paragraph_2 ||
    merged.hero_paragraph_2.includes('Today, that foundation continues to shape our growth')
  ) {
    merged.hero_paragraph_2 = DEFAULT_OUR_STORY_SETTINGS.hero_paragraph_2;
  }

  if (!merged.hero_paragraph_3) {
    merged.hero_paragraph_3 = DEFAULT_OUR_STORY_SETTINGS.hero_paragraph_3;
  }

  return merged;
}

export async function fetchOurStorySettings(): Promise<OurStorySettings> {
  // 1. Try reading from dedicated Supabase table 'our_story_settings'
  try {
    const { data, error } = await supabase
      .from('our_story_settings')
      .select('*')
      .eq('id', 'our_story')
      .maybeSingle();

    if (!error && data) {
      const merged = sanitizeOurStorySettings(data);
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
      const merged = sanitizeOurStorySettings(parsed);
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
      const parsed = JSON.parse(cached);
      const merged = sanitizeOurStorySettings(parsed);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    } catch (e) {
      console.error('Error parsing cached our story settings:', e);
    }
  }

  return { ...DEFAULT_OUR_STORY_SETTINGS };
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
