import { useState, useEffect, useCallback } from 'react';

export interface FooterMenuItem {
  id: string;
  name: string;
  url: string;
  openInNewTab?: boolean;
  isVisible?: boolean;
}

export interface FooterColumn {
  id: string;
  title: string;
  items: FooterMenuItem[];
  isVisible?: boolean;
}

export interface FooterSocialLinks {
  facebook: string;
  instagram: string;
  tiktok: string;
  whatsapp: string;
  xiaohongshu: string;
}

export interface FooterConfig {
  description: string;
  paymentTitle: string;
  logisticTitle: string;
  newsletterTitle: string;
  newsletterText: string;
  copyrightText: string;
  columns: FooterColumn[];
  socialLinks: FooterSocialLinks;
}

export const STORAGE_KEY = 'meadow_footer_config_v1';
export const FOOTER_EVENT_NAME = 'meadow_footer_updated';

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  description: "IT retail, distribution and custom PC solutions, serving customers across Johor since 1995.",
  paymentTitle: "Payment Method",
  logisticTitle: "Logistic Services",
  newsletterTitle: "Newsletter",
  newsletterText: "Subscribe our newsletter on for received the latest promotion and campaign on IT Products",
  copyrightText: "© {year} Meadow IT — ALL RIGHTS RESERVED",
  socialLinks: {
    facebook: "https://www.facebook.com/share/1K7NghHPxP/?mibextid=wwXIfr",
    instagram: "https://www.instagram.com/meadow.it?igsh=MTBxejNkcmc5ZHJ6cw%3D%3D&utm_source=qr",
    tiktok: "https://www.tiktok.com/@meadowit.my?_r=1&_t=ZS-98nOPPqLcFF",
    whatsapp: "https://wa.me/message/SWV2JDRGAAHHK1",
    xiaohongshu: "https://xhslink.cn/m/1CKc6WkV0ZJ",
  },
  columns: [
    {
      id: "col-company",
      title: "Company",
      isVisible: true,
      items: [
        { id: "c-1", name: "Our Story", url: "/our-story", isVisible: true },
        { id: "c-2", name: "Our Store", url: "/our-stores", isVisible: true },
        { id: "c-3", name: "Events", url: "/events", isVisible: true },
        { id: "c-4", name: "Suppliers", url: "/suppliers", isVisible: true },
      ],
    },
    {
      id: "col-shop",
      title: "Shop With Us",
      isVisible: true,
      items: [
        { id: "s-1", name: "BUILD YOUR OWN PC", url: "/customised", isVisible: true },
        { id: "s-2", name: "Desktop", url: "/products?category=Desktop", isVisible: true },
        { id: "s-3", name: "Display", url: "/products?category=Display", isVisible: true },
        { id: "s-4", name: "Laptop", url: "/products/laptop", isVisible: true },
        { id: "s-5", name: "Networking", url: "/products/networking", isVisible: true },
        { id: "s-6", name: "PC Component", url: "/products/pc-component", isVisible: true },
      ],
    },
    {
      id: "col-support",
      title: "Support",
      isVisible: true,
      items: [
        { id: "sp-1", name: "Track Your Order", url: "/track-order", isVisible: true },
        { id: "sp-2", name: "Warranty", url: "/warranty", isVisible: true },
        { id: "sp-3", name: "Terms & Conditions", url: "/product-policy", isVisible: true },
        { id: "sp-4", name: "Contact Us", url: "/contact", isVisible: true },
        { id: "sp-5", name: "Customer Portal", url: "/customer/login", isVisible: true },
      ],
    },
  ],
};

/**
 * Retrieve the current footer configuration from localStorage (zero database calls).
 * Falls back safely to DEFAULT_FOOTER_CONFIG.
 */
export function getFooterConfig(): FooterConfig {
  if (typeof window === 'undefined') return DEFAULT_FOOTER_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_FOOTER_CONFIG;
    const parsed = JSON.parse(raw);
    const parsedColumns = Array.isArray(parsed.columns) ? parsed.columns : DEFAULT_FOOTER_CONFIG.columns;

    // Check if a supplier link exists in any column; if not, inject it so admin can see and edit it
    const hasSupplierLink = parsedColumns.some((col: FooterColumn) => 
      Array.isArray(col.items) && col.items.some(item => item.url === '/suppliers' || item.url === '/supplier')
    );

    let finalColumns = parsedColumns;
    if (!hasSupplierLink && finalColumns.length > 0) {
      finalColumns = finalColumns.map((col: FooterColumn, idx: number) => {
        if (idx === 0 || col.id === 'col-company') {
          return {
            ...col,
            items: [
              ...(col.items || []),
              { id: "c-supplier", name: "Suppliers", url: "/suppliers", isVisible: true }
            ]
          };
        }
        return col;
      });
    }

    return {
      ...DEFAULT_FOOTER_CONFIG,
      ...parsed,
      socialLinks: {
        ...DEFAULT_FOOTER_CONFIG.socialLinks,
        ...(parsed.socialLinks || {})
      },
      columns: finalColumns
    };
  } catch (err) {
    console.warn('Error reading footer config from localStorage:', err);
    return DEFAULT_FOOTER_CONFIG;
  }
}

/**
 * Save footer configuration to localStorage and notify all listeners immediately.
 * Zero database calls.
 */
export function saveFooterConfig(config: FooterConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent(FOOTER_EVENT_NAME, { detail: config }));
  } catch (err) {
    console.error('Failed to save footer config to localStorage:', err);
  }
}

/**
 * Reset footer configuration to factory defaults in localStorage.
 */
export function resetFooterConfig(): FooterConfig {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent(FOOTER_EVENT_NAME, { detail: DEFAULT_FOOTER_CONFIG }));
    } catch (err) {
      console.error('Failed to reset footer config:', err);
    }
  }
  return DEFAULT_FOOTER_CONFIG;
}

/**
 * React hook for consuming and dynamically synchronizing the footer configuration.
 */
export function useFooterConfig() {
  const [config, setConfig] = useState<FooterConfig>(() => getFooterConfig());

  useEffect(() => {
    // Initial sync
    setConfig(getFooterConfig());

    const handleCustomEvent = (e: Event) => {
      const custom = e as CustomEvent<FooterConfig>;
      if (custom.detail) {
        setConfig(custom.detail);
      } else {
        setConfig(getFooterConfig());
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) {
        setConfig(getFooterConfig());
      }
    };

    window.addEventListener(FOOTER_EVENT_NAME, handleCustomEvent);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(FOOTER_EVENT_NAME, handleCustomEvent);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const save = useCallback((newConfig: FooterConfig) => {
    saveFooterConfig(newConfig);
    setConfig(newConfig);
  }, []);

  const reset = useCallback(() => {
    const def = resetFooterConfig();
    setConfig(def);
  }, []);

  return { config, setConfig, save, reset };
}
