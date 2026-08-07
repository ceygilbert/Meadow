import { loadStripe } from '@stripe/stripe-js';

// Default Stripe Test Publishable Key
export const DEFAULT_STRIPE_PUBLISHABLE_KEY = "pk_test_51N1234567890STRIETESTKEYXXXXXXXXXXXXX";

// Default Stripe Payment Link / Sandbox Checkout Page URL placeholder
export const DEFAULT_STRIPE_CHECKOUT_URL = "";

export interface StripePaymentParams {
  publishableKey?: string;
  checkoutUrl?: string;
  detail: string;
  amount: number; // e.g. 1500.00
  currency?: string; // default 'MYR'
  orderId: string;
  name: string;
  email: string;
  phone?: string;
}

/**
 * Redirects the browser directly to a custom Stripe Payment Link if provided,
 * or returns false if fallback interactive Stripe checkout modal should be rendered.
 */
export function redirectToStripeCheckout(params: StripePaymentParams): boolean {
  const customUrl = params.checkoutUrl?.trim();
  
  // If user provided a real Stripe Payment Link (e.g. https://buy.stripe.com/...), launch it
  if (customUrl && customUrl.startsWith('http') && !customUrl.includes('test_checkout')) {
    try {
      const url = new URL(customUrl);
      url.searchParams.set('client_reference_id', params.orderId);
      if (params.email) url.searchParams.set('prefilled_email', params.email);
      window.open(url.toString(), '_blank');
      return true;
    } catch (e) {
      console.error("Invalid Stripe checkout URL provided", e);
    }
  }

  // Fallback to interactive in-app Stripe checkout modal
  return false;
}

/**
 * Initializes Stripe JS client with the given publishable key
 */
export async function getStripeClient(publishableKey?: string) {
  const key = publishableKey?.trim() || DEFAULT_STRIPE_PUBLISHABLE_KEY;
  try {
    return await loadStripe(key);
  } catch (err) {
    console.error("Failed to load Stripe SDK:", err);
    return null;
  }
}

/**
 * Format currency string for display
 */
export function formatCurrency(amount: number, currency: string = 'MYR'): string {
  return `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
