'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Code,
  Sparkles,
  Layers,
  ExternalLink,
  Eye,
  ShoppingCart,
  Check,
  Zap,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  Tag,
  Laptop,
  Server,
  Terminal,
  PackageCheck,
  AlertCircle,
  FileCode,
  Info,
  CheckCircle2,
  X,
  MessageCircle,
} from 'lucide-react';
import { MarketplaceTemplate, LicenseType, LICENSE_CONFIG, TEMPLATE_CATEGORIES } from '@/lib/templatesMarketplaceData';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

interface SoftwarePageClientProps {
  software: any[];
  templates: MarketplaceTemplate[];
}

export default function SoftwarePageClient({ software, templates }: SoftwarePageClientProps) {
  const router = useRouter();
  const { addToCart, items } = useCart();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLicense, setSelectedLicense] = useState<LicenseType>('personal');
  const [previewTemplate, setPreviewTemplate] = useState<MarketplaceTemplate | null>(null);
  const [addedIds, setAddedIds] = useState<{ [key: string]: boolean }>({});

  const licenseInfo = LICENSE_CONFIG[selectedLicense];

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      // Must be active
      if (t.active === false) return false;

      // Category filter
      if (activeCategory !== 'all' && t.category !== activeCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const inName = t.name.toLowerCase().includes(q);
        const inDesc = t.description.toLowerCase().includes(q);
        const inSub = t.subcategory.toLowerCase().includes(q);
        const inTech = t.techStack.some((tech) => tech.toLowerCase().includes(q));
        if (!inName && !inDesc && !inSub && !inTech) return false;
      }

      return true;
    });
  }, [templates, activeCategory, searchQuery]);

  const calculatePrice = (basePrice: number) => {
    return Math.round(basePrice * licenseInfo.multiplier);
  };

  const handleAddToCart = (template: MarketplaceTemplate, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const finalPrice = calculatePrice(template.basePrice);
    const cartItemId = `${template.id}-${selectedLicense}`;

    addToCart({
      id: cartItemId,
      productId: template.id,
      name: template.name,
      slug: template.id,
      price: finalPrice,
      quantity: 1,
      variant: `${licenseInfo.name} (${licenseInfo.multiplier}x)`,
      customization: `Tech: ${template.techStack.slice(0, 3).join(', ')} | Category: ${template.subcategory}`,
    });

    setAddedIds((prev) => ({ ...prev, [cartItemId]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [cartItemId]: false }));
    }, 2200);
  };

  const handleBuyNow = (template: MarketplaceTemplate, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    handleAddToCart(template);
    router.push('/cart');
  };

  return (
    <div className={styles.container}>
      {/* Background Glow Accents */}
      <div className={styles.bgGlow} />

      {/* Main Content Wrapper */}
      <div className={styles.contentWrapper}>
        
        {/* Header Section */}
        <div className={styles.headerSection}>
          <div className={styles.officialBadge}>
            <Sparkles size={14} />
            Official SHIV Marketplace
          </div>
          <h1 className={styles.mainTitle}>
            Website Templates &amp; Developer Assets
          </h1>
          <p className={styles.mainSubtitle}>
            Production-ready website templates, UI component kits, backend APIs, and developer toolkits. Built for high performance, modern architecture, and immediate deployment.
          </p>

          {/* Value Badges */}
          <div className={styles.valueBadgesRow}>
            <span className={styles.valueBadge}>
              <CheckCircle2 size={16} color="#34d399" /> Instant Source Code Delivery
            </span>
            <span className={styles.valueBadge}>
              <Zap size={16} color="#fbbf24" /> Clean, Documented Architecture
            </span>
            <span className={styles.valueBadge}>
              <ShieldCheck size={16} color="#38bdf8" /> Free Bug Fix Guarantee
            </span>
          </div>
        </div>

        {/* License Selector & Customization Banner */}
        <div className={styles.licenseCard}>
          <div className={styles.licenseCardInner}>
            
            {/* License Switcher */}
            <div className={styles.licenseLeftSection}>
              <div className={styles.licenseHeaderRow}>
                <Tag size={16} color="#60a5fa" />
                <span className={styles.licenseHeaderTitle}>
                  Select Your License Tier
                </span>
                <span className={styles.licenseHeaderSubtitle}>
                  (Prices dynamically adjust below)
                </span>
              </div>
              <div className={styles.licenseTiersGrid}>
                {(['personal', 'commercial', 'extended'] as LicenseType[]).map((type) => {
                  const cfg = LICENSE_CONFIG[type];
                  const isSelected = selectedLicense === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedLicense(type)}
                      className={`${styles.tierBtn} ${isSelected ? styles.tierBtnActive : ''}`}
                    >
                      <div className={styles.tierTopRow}>
                        <span className={`${styles.tierName} ${isSelected ? styles.tierNameActive : ''}`}>
                          {cfg.name}
                        </span>
                        <span className={`${styles.multiplierPill} ${isSelected ? styles.multiplierPillActive : ''}`}>
                          {cfg.multiplier}x
                        </span>
                      </div>
                      <p className={styles.tierDesc}>
                        {cfg.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customization Callout */}
            <div className={styles.customizationBox}>
              <div>
                <div className={styles.customTitle}>
                  <MessageCircle size={16} />
                  Need Customization by SHIV?
                </div>
                <p className={styles.customDesc}>
                  Want our engineers to customize, integrate your brand, or deploy this template? We provide custom turnkey delivery.
                </p>
              </div>
              <a
                href="https://wa.me/916267686575?text=Hi%20SHIV,%20I%20am%20interested%20in%20customizing%20a%20website%20template%20for%20my%20business."
                target="_blank"
                rel="noopener noreferrer"
                className={styles.customWaBtn}
              >
                Chat on WhatsApp <ArrowRight size={14} />
              </a>
            </div>

          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className={styles.toolbarRow}>
          
          {/* Category Pills */}
          <div className={styles.categoryPillsScroll}>
            {TEMPLATE_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`${styles.categoryPill} ${isActive ? styles.categoryPillActive : ''}`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, tech, or feature..."
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className={styles.searchClearBtn}
              >
                <X size={14} />
              </button>
            )}
          </div>

        </div>

        {/* Results Counter */}
        <div className={styles.resultsStatusBar}>
          <span>
            Showing <strong style={{ color: '#ffffff' }}>{filteredTemplates.length}</strong> products
            {activeCategory !== 'all' && ` in ${TEMPLATE_CATEGORIES.find((c) => c.id === activeCategory)?.label}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
          <span>
            Active Tier: <strong style={{ color: '#60a5fa' }}>{licenseInfo.name}</strong>
          </span>
        </div>

        {/* Product Cards Grid */}
        {filteredTemplates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', background: '#0e121c', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            <FileCode size={48} color="#64748b" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#e2e8f0' }}>No products found</h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', maxWidth: '380px', margin: '0.25rem auto 1rem' }}>
              We couldn't find any templates matching your search criteria. Try searching for other keywords like "React", "API", "Landing", or select a different category.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              style={{ padding: '0.5rem 1rem', background: '#1e293b', border: 'none', borderRadius: '0.5rem', color: '#ffffff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {filteredTemplates.map((template) => {
              const currentPrice = calculatePrice(template.basePrice);
              const cartItemId = `${template.id}-${selectedLicense}`;
              const isAdded = addedIds[cartItemId];

              return (
                <div key={template.id} className={styles.productCard}>
                  {/* Top Bar: Subcategory & Badge */}
                  <div>
                    <div className={styles.cardTopRow}>
                      <span className={styles.subcatBadge}>
                        {template.subcategory}
                      </span>
                      {template.badge ? (
                        <span className={styles.cardBadge}>
                          {template.badge}
                        </span>
                      ) : (
                        <span className={styles.versionBadge}>
                          {template.version}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className={styles.productTitle}>
                      {template.name}
                    </h3>

                    {/* Description */}
                    <p className={styles.productDesc}>
                      {template.description}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className={styles.techStackRow}>
                      {template.techStack.map((tech) => (
                        <span key={tech} className={styles.techChip}>
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Deliverables snippet */}
                    <div className={styles.deliverablesSnippet}>
                      {template.fileContents.slice(0, 2).map((item, i) => (
                        <div key={i} className={styles.deliverableRow}>
                          <Check size={12} color="#34d399" style={{ flexShrink: 0 }} />
                          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom: Price, Demo Link, and Purchase */}
                  <div className={styles.cardBottom}>
                    <div className={styles.priceAndDemoRow}>
                      <div>
                        <div className={styles.priceBig}>
                          ₹{currentPrice.toLocaleString('en-IN')}
                        </div>
                        <div className={styles.priceSub}>
                          {licenseInfo.name} ({licenseInfo.multiplier}x)
                        </div>
                      </div>

                      {/* Live Demo or Preview button */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        {template.demoUrl ? (
                          <a
                            href={template.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.demoLinkBtn}
                          >
                            <Eye size={14} /> Demo
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPreviewTemplate(template)}
                            className={styles.detailsBtn}
                          >
                            <Info size={14} /> Details
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Buttons: Add to Cart & Buy Now */}
                    <div className={styles.cardActionBtns}>
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(template, e)}
                        className={`${styles.addToCartBtn} ${isAdded ? styles.addToCartBtnSuccess : ''}`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={14} /> Added!
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={14} /> Add to Cart
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleBuyNow(template, e)}
                        className={styles.buyNowBtn}
                      >
                        Buy Now
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Standalone Software Products Section (if any DB software exists) */}
        {software && software.length > 0 && (
          <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60a5fa', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Custom Applications &amp; Standalone Software
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginTop: '0.25rem' }}>
                SHIV Desktop &amp; Platform Software
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.4rem' }}>
                Production-grade applications and utilities maintained by SHIV Technologies.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {software.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'rgba(14, 18, 28, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '4px', background: '#1e293b', color: '#cbd5e1' }}>
                          {item.status?.replace('_', ' ') || 'AVAILABLE'}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace' }}>
                          {item.priceFormatted || (item.price === 0 ? 'Free' : `₹${item.price?.toLocaleString('en-IN')}`)}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: '#64748b' }}>v{item.version || '1.0.0'}</span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>{item.name}</h3>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.5rem', lineHeight: 1.5 }}>{item.description}</p>
                  </div>

                  <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {item.websiteLink ? (
                      <a
                        href={item.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 700, color: '#60a5fa' }}
                      >
                        Visit Website <ArrowRight size={14} />
                      </a>
                    ) : item.downloadLink ? (
                      <a
                        href={item.downloadLink}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 700, color: '#34d399' }}
                      >
                        Download Build <ArrowRight size={14} />
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>Available soon</span>
                    )}

                    <a
                      href="https://wa.me/916267686575?text=Hi%20SHIV,%20I%20have%20an%20enquiry%20regarding%20software%20downloads."
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.75rem', color: '#94a3b8' }}
                    >
                      Enquire via WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Digital Products Policy & Trust Notice */}
        <div className={styles.policyBox}>
          <div className={styles.policyInner}>
            <div>
              <div className={styles.policyBadge}>
                <AlertCircle size={15} />
                Instant Digital Fulfillment &amp; Licensing Terms
              </div>
              <h3 className={styles.policyTitle}>
                All Digital Product Purchases are Final &amp; Backed by Direct Support
              </h3>
              <p className={styles.policyDesc}>
                Because digital templates, source code repositories, and UI kits provide immediate and irrevocable intellectual property access, all sales are non-refundable. Please verify tech stack compatibility, documentation, and live preview demos before purchasing. If you encounter any bugs or code errors, our engineering team provides direct support.
              </p>
            </div>

            <div className={styles.policyBtns}>
              <a
                href="https://wa.me/916267686575?text=Hi%20SHIV,%20I%20need%20developer%20support%20for%20a%20template%20purchase."
                target="_blank"
                rel="noopener noreferrer"
                className={styles.policyWaLink}
              >
                Developer WhatsApp: +91 62676 86575
              </a>
              <Link
                href="/cart"
                className={styles.policyCartLink}
              >
                View Cart ({items.length})
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Details & Live Demo Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <div className={styles.modalBackdrop}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={styles.modalCard}
            >
              {/* Modal Header */}
              <div className={styles.modalHeader}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase' }}>
                      {previewTemplate.subcategory}
                    </span>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#64748b' }}>
                      v{previewTemplate.version}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
                    {previewTemplate.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className={styles.modalCloseBtn}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className={styles.modalBody}>
                {/* Description */}
                <div>
                  <h4 className={styles.modalSectionTitle}>
                    Overview
                  </h4>
                  <p style={{ color: '#94a3b8', lineHeight: 1.55 }}>
                    {previewTemplate.description}
                  </p>
                </div>

                {/* Tech Stack */}
                <div>
                  <h4 className={styles.modalSectionTitle}>
                    Tech Stack &amp; Compatibility
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {previewTemplate.techStack.map((tech) => (
                      <span
                        key={tech}
                        style={{ padding: '0.2rem 0.6rem', borderRadius: '0.35rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', color: '#cbd5e1', fontSize: '0.75rem', fontWeight: 500 }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Included Deliverables */}
                <div>
                  <h4 className={styles.modalSectionTitle}>
                    Files &amp; Deliverables Included
                  </h4>
                  <div className={styles.modalIncludedGrid}>
                    {previewTemplate.fileContents.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem' }}>
                        <Check size={14} color="#34d399" style={{ flexShrink: 0 }} />
                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Licensing Breakdown */}
                <div className={styles.modalLicenseBox}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, color: '#93c5fd' }}>
                      Selected License: {licenseInfo.name}
                    </span>
                    <span style={{ fontFamily: 'monospace', color: '#34d399', fontWeight: 800, fontSize: '0.95rem' }}>
                      ₹{calculatePrice(previewTemplate.basePrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    {licenseInfo.description} Includes complete source files, documentation, and free code patches.
                  </p>
                </div>

                {/* Live Demo Link notice */}
                {previewTemplate.demoUrl && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', borderRadius: '0.75rem', background: 'rgba(6, 8, 14, 0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Interactive Live Preview</span>
                    <a
                      href={previewTemplate.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#60a5fa', fontWeight: 700 }}
                    >
                      Open Live Demo <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  style={{ padding: '0.55rem 1rem', borderRadius: '0.65rem', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#cbd5e1', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Close
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart(previewTemplate);
                    }}
                    style={{ padding: '0.55rem 1rem', borderRadius: '0.65rem', background: '#1e293b', border: '1px solid rgba(255,255,255,0.12)', color: '#ffffff', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <ShoppingCart size={14} /> Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleBuyNow(previewTemplate);
                    }}
                    style={{ padding: '0.55rem 1.25rem', borderRadius: '0.65rem', background: '#2563eb', border: 'none', color: '#ffffff', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.35)' }}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
