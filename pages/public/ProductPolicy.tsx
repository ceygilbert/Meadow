import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Facebook, Instagram } from 'lucide-react';
import PublicNavbar from '../../components/PublicNavbar';

const LOGO_URL = "https://hxfftpvzumcvtnzbpegb.supabase.co/storage/v1/object/public/generals/White%20Full%20Logo.png";

type TabId = 'categories' | 'information' | 'pricing' | 'compatibility' | 'custom' | 'digital' | 'fulfillment' | 'delivery' | 'returns' | 'rights';

interface Tab {
  id: TabId;
  label: string;
}

const TABS: Tab[] = [
  { id: 'categories', label: '1. Product Categories' },
  { id: 'information', label: '2. Product Information' },
  { id: 'pricing', label: '3. Pricing & Charges' },
  { id: 'compatibility', label: '4. Compatibility' },
  { id: 'custom', label: '5. Custom Builds' },
  { id: 'digital', label: '6. Digital Products' },
  { id: 'fulfillment', label: '7. Order Fulfilment' },
  { id: 'delivery', label: '8. Delivery & Packaging' },
  { id: 'returns', label: '9. Returns & Refunds' },
  { id: 'rights', label: '10. Rights & Contact' },
];

const ProductPolicy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('categories');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'categories':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">1. Product Categories</h3>
              <div className="space-y-6 text-slate-600 leading-relaxed text-sm">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">1.1 Physical Products</h4>
                  <p>Physical products refer to tangible goods delivered in physical form, including but not limited to computer hardware, PC components, laptops, monitors, printers, networking products, peripherals, accessories, and other IT-related products.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">1.2 Digital / Virtual Products</h4>
                  <p>Digital or virtual products refer to products delivered electronically or activated digitally, including but not limited to software licenses, activation keys, antivirus software keys, Microsoft licenses, subscriptions, and other non-physical items.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">1.3 Custom-Built PCs and Bundled PC Packages</h4>
                  <p>Custom-built PCs refer to systems configured based on customer-selected components or upgrade options through the Meadow website or other approved sales channels. Bundled PC packages refer to pre-configured systems, promotional builds, or package deals offered by Meadow from time to time.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">1.4 Pre-Order, Backorder, and Specially Sourced Items</h4>
                  <p>Certain products, particularly selected components offered within the PC Build section, may be offered on a pre-order, backorder, or specially sourced basis. These items may not be held in Meadow's ready stock at the time of order and may only be procured after a customer places an order.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'information':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">2. Product Information and Listing</h3>
              <div className="space-y-6 text-slate-600 leading-relaxed text-sm">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">2.1 Sources of Product Information</h4>
                  <p>Product information published on the Meadow website may be obtained from manufacturers, official brand owners, authorised distributors, suppliers, product databases, or other third-party sources.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">2.2 Accuracy of Information</h4>
                  <p>We make reasonable efforts to ensure that product names, descriptions, specifications, compatibility information, model numbers, images, pricing, and other details are accurate and up to date. However, such information may be incomplete, outdated, inaccurate, or changed by the manufacturer or supplier without prior notice.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">2.3 No Guarantee of Absolute Accuracy</h4>
                  <p>Due to rapid product refresh cycles, manufacturer revisions, supplier updates, and market volatility, Meadow does not guarantee that all product listings, descriptions, specifications, packaging details, compatibility information, or other product-related content will always be fully accurate, complete, or current at all times.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">2.4 Customer Responsibility to Verify Key Specifications</h4>
                  <p>Customers are responsible for reviewing product descriptions carefully and verifying all important specifications before purchase, including but not limited to dimensions, interfaces, ports, socket type, chipset support, power requirements, compatibility requirements, and performance suitability. Where necessary, customers should refer to the official manufacturer's website or contact Meadow for clarification before placing an order.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">2.5 Product Images</h4>
                  <p>All product images, renders, illustrations, promotional visuals, and lifestyle images displayed on the website are for reference, illustration, and advertising purposes only. Actual products may differ in appearance, size perception, packaging, included accessories, labeling, hardware revision, or minor design details.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">2.6 Packaging and Revision Differences</h4>
                  <p>Manufacturers and distributors may revise packaging, bundled accessories, labels, printed details, or product revision numbers from time to time without prior notice. Minor differences in packaging, product revision, labeling, or included non-core accessories shall not be treated as defects, wrong items, or valid grounds for refund, exchange, or return.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">2.7 Stock Availability</h4>
                  <p>All products displayed on the website are subject to stock availability, supplier availability, procurement lead time, and order acceptance by Meadow. Listing of a product on the website does not guarantee immediate availability for dispatch, fulfilment, or collection.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'pricing':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">3. Product Pricing</h3>
              <div className="space-y-6 text-slate-600 leading-relaxed text-sm">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">3.1 Online Pricing</h4>
                  <p>Prices displayed on the Meadow website apply to online purchases only unless otherwise expressly stated. Prices at Meadow's physical stores, showrooms, marketplace stores, or other sales channels may differ from the prices shown on the website.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">3.2 Price Changes</h4>
                  <p>Prices are subject to change without prior notice due to supplier cost revisions, currency fluctuations, promotions, stock conditions, shortages, market volatility, and manufacturer pricing updates.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">3.3 Pricing Errors</h4>
                  <p>While Meadow makes reasonable efforts to ensure pricing accuracy, pricing errors, system errors, typographical mistakes, or listing mistakes may occasionally occur. If an error is identified after an order is placed, Meadow reserves the right to correct the price and contact the customer to:<br/>
                  (a) reconfirm the order at the correct price; or<br/>
                  (b) cancel the order and issue a refund if the customer does not accept the corrected price.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">3.4 Delivery and Additional Charges</h4>
                  <p>Unless otherwise expressly stated, listed prices do not include delivery charges, remote-area surcharges, installation charges, assembly charges, or additional protective packaging charges where applicable. Such charges may be applied separately during checkout or otherwise communicated to the customer before order confirmation.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">3.5 Additional Protective Packaging</h4>
                  <p>For selected fragile or high-value products, including but not limited to assembled PCs, laptops, and graphics cards, Meadow reserves the right to apply additional protective packaging measures and corresponding charges where necessary for safer shipment.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">3.6 Promotional and Bundle Pricing</h4>
                  <p>Promotional prices, bundled pricing, campaign offers, voucher prices, and special package pricing are subject to the terms of the relevant promotion and may be revised, withdrawn, or limited at Meadow's discretion.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">3.7 Instalment / BNPL / Deferred Payment</h4>
                  <p>Where instalment plans, pay-later services, or third-party financing options are made available, separate payment terms, fees, eligibility requirements, and conditions may apply. Customers are responsible for reviewing the applicable Payment Terms before completing checkout.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'compatibility':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">4. Product Compatibility and Suitability</h3>
              <div className="space-y-6 text-slate-600 leading-relaxed text-sm">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">4.1 Compatibility Responsibility</h4>
                  <p>Customers are responsible for ensuring that purchased products are suitable and compatible with their intended devices, systems, software, and configurations unless Meadow has expressly confirmed such compatibility in writing.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">4.2 PC Components</h4>
                  <p>For PC components such as processors, motherboards, RAM, graphics cards, coolers, power supplies, storage drives, chassis, and related products, compatibility may depend on socket type, chipset support, BIOS version, clearance, power requirements, cooling support, and other technical factors.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">4.3 Wrong Purchase by Customer</h4>
                  <p>Orders placed for the wrong model, wrong interface, wrong size, wrong specification, wrong compatibility requirement, or wrong item due to customer oversight, misunderstanding, or failure to verify specifications shall not be eligible for refund, return, or exchange, subject to applicable law.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'custom':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">5. Custom-Built PCs, Bundled PCs & Sourced</h3>
              <div className="space-y-6 text-slate-600 leading-relaxed text-sm">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">5.1 Order Basis</h4>
                  <p>Custom-built PC orders shall be based on the component selection, upgrade options, and pricing confirmed at the time of checkout or order confirmation.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">5.2 Selected Upgrade Options</h4>
                  <p>For bundled PC packages, Meadow may provide optional upgrade selections, including but not limited to RAM, SSD, and AIO upgrades. The final confirmed order shall reflect the specifications selected by the customer and accepted by Meadow.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">5.3 Component Availability</h4>
                  <p>Certain components listed in the PC Build section may be pre-order, backorder, or specially sourced items. If a selected component is not immediately available, Meadow will first notify the customer of the estimated waiting time.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">5.4 Priority Handling for Out-of-Stock Components</h4>
                  <p>If a selected component becomes unavailable, Meadow may, at its discretion:<br/>
                  (a) request that the customer wait for restock;<br/>
                  (b) offer a substitute or alternative component; or<br/>
                  (c) issue a refund where fulfilment is not possible and no suitable alternative is accepted.<br/>
                  Refund shall generally be treated as the final fallback option where fulfilment cannot reasonably proceed.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">5.5 Build Lead Time</h4>
                  <p>Custom-built PCs may require assembly, testing, cable management, BIOS setup, software setup, and internal quality checks before shipment or collection. Unless otherwise expressly stated, the fulfilment lead time for custom-built PCs shall not exceed fourteen (14) days, subject to component availability and operational circumstances.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">5.6 Cancellation and Refund Restrictions for Custom Builds</h4>
                  <p>For custom-built PCs, specially sourced components, pre-order components, and made-to-order configurations, cancellation or refund is generally not permitted after payment has been made, except where Meadow is unable to fulfil the order. Where assembly, procurement, preparation, or unboxing has commenced, the order shall be treated as committed and non-cancellable, as affected components or products may no longer be resold as brand-new items.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">5.7 Bundle Adjustment Rights</h4>
                  <p>For bundled PC packages, Meadow reserves the right to make reasonable adjustments to non-core accessories, bundled gifts, or minor promotional items without prior notice, provided that the core system specifications purchased by the customer are not materially reduced without customer confirmation.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">5.8 Build Presentation Differences</h4>
                  <p>For custom-built PCs and bundled systems, final internal cable arrangement, fan positioning, packaging arrangement, accessory packing, and other non-material assembly presentation details may vary based on technician judgment, practical build requirements, and component compatibility.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'digital':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">6. Digital / Virtual Products</h3>
              <div className="space-y-6 text-slate-600 leading-relaxed text-sm">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">6.1 Delivery Method</h4>
                  <p>Digital or virtual products may be delivered by email, customer account, digital key issuance, activation code, or other electronic means as determined by Meadow.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">6.2 No Return or Refund Once Delivered</h4>
                  <p>Unless otherwise required by law, digital and virtual products, including software licenses, activation keys, antivirus software keys, Microsoft licenses, and similar electronically delivered goods, are non-returnable and non-refundable once delivered, revealed, issued, accessed, or activated.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">6.3 Customer Responsibility</h4>
                  <p>Customers are responsible for ensuring compatibility, licensing suitability, edition selection, account requirements, and activation conditions before purchasing any digital or virtual product.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'fulfillment':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">7. Order Acceptance and Fulfilment</h3>
              <div className="space-y-6 text-slate-600 leading-relaxed text-sm">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">7.1 Order Submission Does Not Equal Acceptance</h4>
                  <p>Submission of an order by a customer does not automatically constitute acceptance of that order by Meadow.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">7.2 Right to Review, Reject, or Cancel Orders</h4>
                  <p>Meadow reserves the right to review, reject, suspend, or cancel any order before fulfilment in cases including but not limited to:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>pricing or listing errors</li>
                    <li>stock unavailability</li>
                    <li>supplier unavailability</li>
                    <li>suspected fraud or unauthorised payment</li>
                    <li>incomplete customer information</li>
                    <li>delivery limitations</li>
                    <li>technical or system errors</li>
                    <li>abnormal, suspicious, or commercially unreasonable orders</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">7.3 Out-of-Stock After Checkout</h4>
                  <p>If a product is found to be unavailable after checkout, Meadow may contact the customer to discuss revised lead time, substitution, partial fulfilment where appropriate, or cancellation and refund.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'delivery':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">8. Delivery, Packaging, and Inspection</h3>
              <div className="space-y-6 text-slate-600 leading-relaxed text-sm">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">8.1 Standard Packaging</h4>
                  <p>Products are shipped using packaging that Meadow considers reasonable and appropriate for normal handling and delivery.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">8.2 Protective Packaging Measures</h4>
                  <p>For selected fragile, irregular, or high-value products, Meadow may apply additional protective packaging measures at its discretion for shipment safety.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">8.3 Inspection Upon Receipt</h4>
                  <p>Customers are encouraged to inspect products promptly upon receipt.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">8.4 Reporting Damage, Missing Item, or Transit Issue</h4>
                  <p>Any claim relating to damaged parcels, damaged products, missing items, or transit-related issues must be reported to Meadow promptly and, where applicable, the product must be returned or presented to Meadow within two (2) days from the date of delivery or receipt, subject to our Shipping Policy and Return and Refund Policy.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'returns':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">9. Returns, Refunds, and Exchanges</h3>
              <div className="space-y-6 text-slate-600 leading-relaxed text-sm">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">9.1 General Policy Reference</h4>
                  <p>All requests for return, refund, exchange, cancellation, transit damage claim, DOA claim, or warranty claim are subject to Meadow's Return and Refund Policy, Shipping Policy, Warranty Policy, and any other applicable terms.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">9.2 Listing Inaccuracy and Material Difference</h4>
                  <p>Where a return, refund, or exchange request is based on alleged listing inaccuracy, Meadow reserves the sole right to assess whether the issue is material, whether the delivered product matches the purchased model, and whether the request falls within the applicable return, refund, or warranty conditions.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">9.3 Non-Material Differences</h4>
                  <p>Minor differences in images, packaging, product revision, labeling, bundled accessories, or manufacturer presentation shall not automatically qualify as valid grounds for refund, return, or exchange.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">9.4 Customer Mis-purchase</h4>
                  <p>Products purchased incorrectly due to customer oversight, including wrong model, wrong interface, wrong socket, wrong specification, or wrong compatibility requirement, shall not be eligible for refund, return, or exchange, unless otherwise required by law.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">9.5 Digital Products</h4>
                  <p>Digital and virtual products are non-refundable once delivered, revealed, issued, accessed, or activated.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">9.6 Custom-Built PCs and Specially Sourced Items</h4>
                  <p>Custom-built PCs, pre-order components, backorder components, and specially sourced items are subject to stricter cancellation and refund limitations as set out in this Product Policy and the relevant return/cancellation terms.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'rights':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">10. Reservation of Rights</h3>
              <div className="space-y-6 text-slate-600 leading-relaxed text-sm">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">10.1 Right to Correct Listings</h4>
                  <p>Meadow reserves the right to correct, amend, update, remove, or revise any product listing, image, description, specification, price, stock information, or promotional content at any time without prior notice.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">10.2 Final Review Rights</h4>
                  <p>Meadow reserves the right to make final operational and commercial decisions regarding listing corrections, stock fulfilment feasibility, substitution proposals, and order handling, subject to applicable law.</p>
                </div>
              </div>
            </div>
            
            <hr className="border-slate-100" />
            
            <div>
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">11. Contact and Clarification</h3>
              <div className="space-y-6 text-slate-600 leading-relaxed text-sm">
                <div>
                  <p>If you require clarification regarding product specifications, compatibility, stock availability, lead time, bundled contents, digital product suitability, or custom PC configuration, please contact Meadow before placing your order. Customers are strongly encouraged to obtain clarification in advance for any technical, compatibility-sensitive, or made-to-order purchase.</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <PublicNavbar 
        user={null}
        profile={null}
        cartCount={0}
        onOpenAuth={() => {}}
        onOpenCart={() => {}}
        scrolled={true}
      />

      <main className="max-w-[1440px] mx-auto px-6 pt-32 pb-20 min-h-screen">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">Product Policy</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm leading-relaxed">
            This Product Policy applies to all products displayed, promoted, sold, or otherwise made available through the Meadow website and related online sales channels.
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 flex flex-col lg:flex-row gap-12 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)]">
          {/* Vertical Tabs */}
          <div className="lg:w-72 shrink-0">
            <div className="sticky top-32 flex flex-col gap-2">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 px-4">Policy Contents</h2>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-left px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === tab.id 
                      ? 'bg-slate-900 text-white shadow-lg scale-100' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 scale-[0.98]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-slate-50/50 rounded-3xl p-8 md:p-12 border border-slate-100/50">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Editorial Footer */}
      <footer className="bg-[#F9FAFB] pt-24 pb-12 border-t border-slate-100">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <img src={LOGO_URL} className="h-16 w-auto mb-8 grayscale opacity-50" alt="Meadow" />
              <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs">
                Premium hardware distribution and bespoke computational engineering. Built for the elite.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8">Company</h4>
              <ul className="space-y-4">
                <li><Link to="/" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Our Story</Link></li>
                <li><Link to="/" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Contact Us</Link></li>
                <li><Link to="/stores" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Store Locator</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8">Legal</h4>
              <ul className="space-y-4">
                <li><Link to="/terms" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Terms & Conditions</Link></li>
                <li><Link to="/product-policy" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Product Policy</Link></li>
                <li><Link to="/product-policy" className="text-[11px] font-nav text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">Refund Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 mb-8">Newsletter</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">Join the Registry for updates.</p>
              <form className="flex gap-2 mb-8">
                <input type="email" placeholder="Email" className="flex-1 bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:border-slate-900 transition-colors" />
                <button className="bg-slate-900 text-white p-3 rounded-xl hover:bg-black transition-colors"><ArrowRight size={16} /></button>
              </form>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47V18.77a6.738 6.738 0 0 1-6.76 6.76 6.738 6.738 0 0 1-6.76-6.76 6.738 6.738 0 0 1 6.76-6.76c.42-.02.84.03 1.25.12v4.03a2.71 2.71 0 0 0-1.25-.12 2.728 2.728 0 0 0-2.72 2.73 2.728 2.728 0 0 0 2.72 2.73 2.728 2.728 0 0 0 2.73-2.73V.02z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm">
                  <img src="https://illuminatelabs.space/assets/xhs_logo.png" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" alt="Xiaohongshu" />
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-slate-200/50">
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 text-center">© {new Date().getFullYear()} Meadow SDN BHD — ALL RIGHTS RESERVED</p>
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 italic">Core Operational Status: Nominal</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductPolicy;
