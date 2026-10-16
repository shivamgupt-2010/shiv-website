'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Check,
  ShoppingCart,
  Download,
  ShieldCheck,
  Zap,
  Code2,
  FileCode,
  Layers,
  Sparkles,
  RefreshCw,
  Star,
} from 'lucide-react';
import { DigitalProduct } from '@/lib/digitalProducts';
import { useCart } from '@/context/CartContext';
import styles from './DigitalProductDetail.module.css';

interface DigitalProductDetailClientProps {
  product: DigitalProduct;
  relatedProducts: DigitalProduct[];
  userId?: string;
}

type LicenseType = 'standard' | 'commercial' | 'extended';

export default function DigitalProductDetailClient({
  product,
  relatedProducts,
  userId,
}: DigitalProductDetailClientProps) {
  const { addToCart } = useCart();
  const [selectedLicense, setSelectedLicense] = useState<LicenseType>('standard');
  const [isAdded, setIsAdded] = useState(false);

  const licenseConfig: Record<
    LicenseType,
    { name: string; multiplier: number; desc: string; sub: string }
  > = {
    standard: {
      name: 'Standard License',
      multiplier: 1.0,
      desc: 'Single Commercial Project',
      sub: 'Use for 1 personal or client project. Non-transferable source.',
    },
    commercial: {
      name: 'Commercial License',
      multiplier: 1.5,
      desc: 'Up to 5 Commercial Projects',
      sub: 'Ideal for freelance agencies and multiple client deployments.',
    },
    extended: {
      name: 'Extended License',
      multiplier: 3.0,
      desc: 'Unlimited Projects & SaaS',
      sub: 'Unlimited client & SaaS deployments. Priority developer support.',
    },
  };

  const currentPrice = Math.round(product.price * licenseConfig[selectedLicense].multiplier);
  const compareAt = product.compareAtPrice
    ? Math.round(product.compareAtPrice * licenseConfig[selectedLicense].multiplier)
    : Math.round(currentPrice * 1.4);

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${selectedLicense}`,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: currentPrice,
      quantity: 1,
      variant: licenseConfig[selectedLicense].name,
      customization: `Category: ${product.categoryLabel}`,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* Breadcrumb Navigation */}
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <ChevronRight size={14} />
          <Link href="/products" className={styles.breadcrumbLink}>
            Marketplace
          </Link>
          <ChevronRight size={14} />
          <Link
            href={`/products?category=${product.category}`}
            className={styles.breadcrumbLink}
          >
            {product.categoryLabel}
          </Link>
          <ChevronRight size={14} />
          <span className={styles.breadcrumbActive}>{product.name}</span>
        </nav>

        {/* Two-Column Specification & Action Layout */}
        <div className={styles.grid}>
          {/* Left Column: Mockup, Deliverables & Tech Specs */}
          <div className={styles.previewCol}>
            {/* Interactive Browser Frame */}
            <div className={styles.mockupFrame}>
              <div className={styles.browserHeader}>
                <div className={styles.browserDots}>
                  <span className={styles.browserDot} style={{ background: '#ef4444' }} />
                  <span className={styles.browserDot} style={{ background: '#eab308' }} />
                  <span className={styles.browserDot} style={{ background: '#22c55e' }} />
                </div>
                <div className={styles.browserUrl}>
                  preview.shiv.dev/{product.slug}
                </div>
                <div style={{ width: 40 }} />
              </div>

              <div className={styles.mockupDisplay}>
                <div className={styles.mockupIconBadge}>
                  <Code2 size={36} />
                </div>
                <h3 className={styles.mockupTitle}>{product.name}</h3>
                <p className={styles.mockupSubtitle}>{product.description}</p>

                {product.demoUrl && (
                  <a
                    href={product.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.liveDemoAction}
                  >
                    <span>View Interactive Demo</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>

            {/* Included Deliverables */}
            <div className={styles.deliverablesBox}>
              <h4 className={styles.deliverablesTitle}>
                <Layers size={18} style={{ color: '#38bdf8' }} />
                Included Deliverables
              </h4>
              <ul className={styles.deliverablesList}>
                {product.includedFiles && product.includedFiles.length > 0 ? (
                  product.includedFiles.map((file, idx) => (
                    <li key={idx} className={styles.deliverableItem}>
                      <Check size={14} className={styles.deliverableIcon} />
                      <span>{file}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className={styles.deliverableItem}>
                      <Check size={14} className={styles.deliverableIcon} />
                      <span>Clean Next.js 15 &amp; React source code</span>
                    </li>
                    <li className={styles.deliverableItem}>
                      <Check size={14} className={styles.deliverableIcon} />
                      <span>TypeScript types &amp; schema models</span>
                    </li>
                    <li className={styles.deliverableItem}>
                      <Check size={14} className={styles.deliverableIcon} />
                      <span>Setup documentation &amp; command guide</span>
                    </li>
                    <li className={styles.deliverableItem}>
                      <Check size={14} className={styles.deliverableIcon} />
                      <span>Free lifetime bug fixes and updates</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Tech Stack Chips */}
            {product.techStack && product.techStack.length > 0 && (
              <div className={styles.techBox}>
                <h4 className={styles.techTitle}>Built With Modern Architecture</h4>
                <div className={styles.techChips}>
                  {product.techStack.map((tech) => (
                    <span key={tech} className={styles.techChip}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Title, License, Price, Purchase */}
          <div className={styles.infoCol}>
            <div className={styles.badgeRow}>
              <span className={styles.catBadge}>{product.categoryLabel}</span>
              <span className={styles.versionBadge}>v{product.version}</span>
              {product.badge && (
                <span
                  className={styles.catBadge}
                  style={{
                    background: 'rgba(236, 72, 153, 0.15)',
                    color: '#f472b6',
                    borderColor: 'rgba(236, 72, 153, 0.3)',
                  }}
                >
                  {product.badge}
                </span>
              )}
            </div>

            <h1 className={styles.title}>{product.name}</h1>

            <div className={styles.ratingRow}>
              <div className={styles.stars}>★★★★★</div>
              <span>
                <strong>{product.rating || 4.9}</strong> (
                {product.reviewsCount || 24} verified developer purchases)
              </span>
            </div>

            <p className={styles.shortDesc}>{product.description}</p>

            {/* License Selection Selector */}
            <div className={styles.licenseSection}>
              <span className={styles.licenseLabel}>Select License Tier</span>
              <div className={styles.licenseGrid}>
                {(['standard', 'commercial', 'extended'] as LicenseType[]).map((type) => {
                  const cfg = licenseConfig[type];
                  const tierPrice = Math.round(product.price * cfg.multiplier);
                  const isSelected = selectedLicense === type;

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedLicense(type)}
                      className={`${styles.licenseOption} ${
                        isSelected ? styles.licenseOptionActive : ''
                      }`}
                    >
                      <div className={styles.licenseInfo}>
                        <div className={styles.licenseName}>{cfg.name}</div>
                        <div className={styles.licenseSub}>{cfg.sub}</div>
                      </div>
                      <div className={styles.licensePrice}>
                        ₹{tierPrice.toLocaleString('en-IN')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Box */}
            <div className={styles.priceBox}>
              <span className={styles.priceDisplay}>
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              <span className={styles.comparePrice}>
                ₹{compareAt.toLocaleString('en-IN')}
              </span>
              <span className={styles.priceTag}>Save 30%</span>
            </div>

            {/* Primary Action Buttons */}
            <div className={styles.actionRow}>
              <button
                type="button"
                onClick={handleAddToCart}
                className={`${styles.cartBtn} ${isAdded ? styles.cartBtnSuccess : ''}`}
              >
                {isAdded ? (
                  <>
                    <Check size={18} /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} /> Add to Cart (Instant Download)
                  </>
                )}
              </button>
            </div>

            {/* Key Features */}
            {product.features && product.features.length > 0 && (
              <div className={styles.featuresSection}>
                <h4 className={styles.featuresTitle}>Key Product Features</h4>
                <ul className={styles.featuresList}>
                  {product.features.map((feat, idx) => (
                    <li key={idx} className={styles.featureItem}>
                      <Check size={16} className={styles.featureIcon} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Developer Trust & Guarantee */}
            <div className={styles.guaranteeCard}>
              <div className={styles.guaranteeRow}>
                <Download size={16} className={styles.guaranteeIcon} />
                <span>Instant delivery: Access `.zip` code download right after checkout.</span>
              </div>
              <div className={styles.guaranteeRow}>
                <ShieldCheck size={16} className={styles.guaranteeIcon} />
                <span>Commercial usage rights certificate included.</span>
              </div>
              <div className={styles.guaranteeRow}>
                <RefreshCw size={16} className={styles.guaranteeIcon} />
                <span>Lifetime product updates &amp; developer bug patches.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products from Category */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className={styles.relatedSection}>
            <div className={styles.relatedHeader}>
              <h3 className={styles.relatedTitle}>Related {product.categoryLabel}</h3>
              <Link
                href={`/products?category=${product.category}`}
                className={styles.breadcrumbLink}
                style={{ fontSize: '0.85rem', fontWeight: 600 }}
              >
                Explore all {product.categoryLabel} &rarr;
              </Link>
            </div>

            <div className={styles.relatedGrid}>
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.slug}`}
                  className={styles.relatedCard}
                >
                  <h4 className={styles.relatedCardTitle}>{item.name}</h4>
                  <p className={styles.relatedCardDesc}>{item.description}</p>
                  <div className={styles.relatedCardFooter}>
                    <span className={styles.relatedCardPrice}>
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    <span className={styles.relatedCardLink}>
                      Details &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
