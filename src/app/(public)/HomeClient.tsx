'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Layout,
  Layers,
  Code,
  Server,
  Rocket,
  Palette,
  PackageCheck,
  Check,
  ShoppingCart,
  CheckCircle2,
  Zap,
  ShieldCheck,
  ChevronDown,
  Eye,
  Terminal,
  Play,
  RotateCcw,
  Sliders,
  Send,
  HelpCircle,
} from 'lucide-react';
import { DigitalProduct, DigitalCategory } from '@/lib/digitalProducts';
import { useCart } from '@/context/CartContext';
import ShivBrandIntro from '@/components/common/ShivBrandIntro';
import ShivBrandSignature from '@/components/common/ShivBrandSignature';
import styles from './page.module.css';

interface HomeClientProps {
  featuredProducts: DigitalProduct[];
  categories: DigitalCategory[];
  bundles: DigitalProduct[];
}

export default function HomeClient({ featuredProducts, categories, bundles }: HomeClientProps) {
  const { addToCart } = useCart();
  const [activePlaygroundTab, setActivePlaygroundTab] = useState<'logo' | 'loaders' | 'login' | 'scroll' | 'hover' | 'orbs' | 'page' | 'buttons'>('buttons');
  const [addedIds, setAddedIds] = useState<{ [id: string]: boolean }>({});
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);
  const [logoReplayKey, setLogoReplayKey] = useState(0);
  
  // Playground interactive states
  const [buttonEffectTrigger, setButtonEffectTrigger] = useState(0);
  const [loginStep, setLoginStep] = useState<'login' | 'register'>('login');
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleAddToCart = (product: DigitalProduct, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity: 1,
      variant: 'Standard License',
      customization: `Category: ${product.categoryLabel}`,
    });

    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout': return Layout;
      case 'Sparkles': return Sparkles;
      case 'Layers': return Layers;
      case 'Code': return Code;
      case 'Server': return Server;
      case 'Rocket': return Rocket;
      case 'Palette': return Palette;
      case 'PackageCheck': return PackageCheck;
      default: return Code;
    }
  };

  const playgroundTabs = [
    { id: 'buttons', label: 'Animated Buttons' },
    { id: 'logo', label: 'Logo Reveal' },
    { id: 'loaders', label: 'Animated Loaders' },
    { id: 'login', label: 'Auth Transitions' },
    { id: 'hover', label: '3D Hover Cards' },
    { id: 'orbs', label: 'Fluid Mesh Orbs' },
    { id: 'scroll', label: 'Scroll Reveals' },
    { id: 'page', label: 'Page Transitions' },
  ];

  const faqs = [
    {
      q: 'What do I receive immediately after purchasing?',
      a: 'You receive instant access to full production-ready source code (.zip format), documentation, configuration templates, and a commercial license certificate. Download links are stored permanently in your SHIV account library.',
    },
    {
      q: 'Can I use these templates for client projects and commercial SaaS?',
      a: 'Yes! Commercial licenses allow single end-client builds or production deployment. Extended licenses grant unlimited client builds, agency distribution, and SaaS end-product usage with zero recurring royalty fees.',
    },
    {
      q: 'Which tech stacks and frameworks are supported?',
      a: 'Our products are built on modern industry standards: Next.js 15/16, React 19, TypeScript, Tailwind CSS, FastAPI (Python), Node.js, and Figma design kits.',
    },
    {
      q: 'Are future updates and bug fixes included?',
      a: 'Yes, all digital assets receive lifetime bug fixes and maintenance patches directly downloadable from your account dashboard.',
    },
    {
      q: 'What if I need custom modifications or turnkey deployment?',
      a: 'SHIV provides dedicated customization and development services. You can select custom scoping from our Client Services page or chat directly with our engineering team on WhatsApp (6267686575).',
    },
  ];

  return (
    <div className={styles.main}>
      <ShivBrandIntro />
      {/* Background Gradients & Grid */}
      <div className={styles.heroGlowContainer} />
      <div className={styles.heroGridPattern} />

      {/* =========================================
          1. HERO SECTION
          ========================================= */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.heroBadge}
          >
            <span className={styles.badgePulse} />
            <span>Digital Assets &amp; Developer Marketplace</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={styles.heroTitle}
          >
            Build Better. <span className={styles.heroTitleGradient}>Launch Faster.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={styles.heroSubtitle}
          >
            Premium website templates, powerful UI components, motion effects, and developer tools to bring your next idea to life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={styles.heroCtas}
          >
            <Link href="/products?category=website-templates" className={styles.primaryCta}>
              Explore Templates <ArrowRight size={16} />
            </Link>
            <a href="#playground" className={styles.secondaryCta}>
              Explore Animations <Sparkles size={16} />
            </a>
          </motion.div>
        </div>

        {/* Animated Digital Product Mockups */}
        <div className={styles.floatingPreviewsGrid}>
          {/* Mockup 1: Website Layout */}
          <motion.div
            whileHover={{ y: -6 }}
            className={styles.previewMockCard}
          >
            <div className={styles.mockHeader}>
              <div className={styles.mockDots}>
                <span className={styles.mockDot} style={{ background: '#ef4444' }} />
                <span className={styles.mockDot} style={{ background: '#f59e0b' }} />
                <span className={styles.mockDot} style={{ background: '#10b981' }} />
              </div>
              <span className={styles.mockTag}>Website Template</span>
            </div>
            <div className={styles.mockBody}>
              <div className={styles.mockTitle}>SaaS Launch Studio</div>
              <p className={styles.mockDesc}>Next.js 16 + Tailwind CSS landing kit with high-conversion pricing &amp; testimonial grids.</p>
              <div className={styles.mockVisualArea}>
                <div style={{ height: '8px', width: '60%', background: '#38bdf8', borderRadius: '4px', marginBottom: '6px' }} />
                <div style={{ height: '6px', width: '90%', background: '#334155', borderRadius: '4px', marginBottom: '4px' }} />
                <div style={{ height: '6px', width: '45%', background: '#1e293b', borderRadius: '4px' }} />
              </div>
            </div>
          </motion.div>

          {/* Mockup 2: SaaS Dashboard */}
          <motion.div
            whileHover={{ y: -6 }}
            className={styles.previewMockCard}
          >
            <div className={styles.mockHeader}>
              <div className={styles.mockDots}>
                <span className={styles.mockDot} />
                <span className={styles.mockDot} />
                <span className={styles.mockDot} />
              </div>
              <span className={styles.mockTag} style={{ color: '#c084fc' }}>UI Kit</span>
            </div>
            <div className={styles.mockBody}>
              <div className={styles.mockTitle}>Apex Analytics UI</div>
              <p className={styles.mockDesc}>Modular React dashboard kit with charts, metrics, dark mode, and responsive layout.</p>
              <div className={styles.mockVisualArea}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '32px' }}>
                  <div style={{ flex: 1, height: '40%', background: '#818cf8', borderRadius: '2px' }} />
                  <div style={{ flex: 1, height: '70%', background: '#6366f1', borderRadius: '2px' }} />
                  <div style={{ flex: 1, height: '50%', background: '#a855f7', borderRadius: '2px' }} />
                  <div style={{ flex: 1, height: '95%', background: '#38bdf8', borderRadius: '2px' }} />
                  <div style={{ flex: 1, height: '65%', background: '#34d399', borderRadius: '2px' }} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mockup 3: Backend & API */}
          <motion.div
            whileHover={{ y: -6 }}
            className={styles.previewMockCard}
          >
            <div className={styles.mockHeader}>
              <div className={styles.mockDots}>
                <span className={styles.mockDot} />
                <span className={styles.mockDot} />
                <span className={styles.mockDot} />
              </div>
              <span className={styles.mockTag} style={{ color: '#fb923c' }}>Backend Starter</span>
            </div>
            <div className={styles.mockBody}>
              <div className={styles.mockTitle}>FastAPI Cloud Engine</div>
              <p className={styles.mockDesc}>Production Python async architecture with JWT auth, PostgreSQL ORM, and rate limits.</p>
              <div className={styles.mockVisualArea} style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: '#34d399' }}>
                $ uvicorn app.main:app<br />
                ✓ Status 200 OK (1.2ms)
              </div>
            </div>
          </motion.div>

          {/* Mockup 4: Motion Effect */}
          <motion.div
            whileHover={{ y: -6 }}
            className={styles.previewMockCard}
          >
            <div className={styles.mockHeader}>
              <div className={styles.mockDots}>
                <span className={styles.mockDot} />
                <span className={styles.mockDot} />
                <span className={styles.mockDot} />
              </div>
              <span className={styles.mockTag} style={{ color: '#f43f5e' }}>Motion Pack</span>
            </div>
            <div className={styles.mockBody}>
              <div className={styles.mockTitle}>Cyber Kinetic FX</div>
              <p className={styles.mockDesc}>Framer Motion button collections, page wipes, neon borders, and magnetic cards.</p>
              <div className={styles.mockVisualArea} style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'rgba(236,72,153,0.2)', border: '1px solid #ec4899', color: '#f472b6' }}>
                  Interactive Effect ⚡
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================
          2. CATEGORY EXPLORER
          ========================================= */}
      <section className={styles.section} id="categories">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>Catalogue Taxonomy</span>
          <h2 className={styles.sectionTitle}>Explore By Category</h2>
          <p className={styles.sectionSubtitle}>
            Browse production-grade digital assets organized across 8 core disciplines.
          </p>
        </div>

        <div className={styles.categoriesGrid}>
          {categories.map((cat) => {
            const IconComponent = getCategoryIcon(cat.iconName);
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={styles.categoryCard}
              >
                <div className={styles.categoryTop}>
                  <div className={styles.categoryIconBox} style={{ color: cat.color }}>
                    <IconComponent size={22} />
                  </div>
                  <span className={styles.categoryCountPill}>
                    {cat.itemCount} items
                  </span>
                </div>
                <div>
                  <h3 className={styles.categoryName}>{cat.name}</h3>
                  <p className={styles.categoryDesc}>{cat.shortDesc}</p>
                </div>
                <div className={styles.categoryLinkText}>
                  Explore {cat.name} <ArrowRight size={13} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* =========================================
          3. FEATURED DIGITAL PRODUCTS
          ========================================= */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>Handcrafted Releases</span>
          <h2 className={styles.sectionTitle}>Featured Digital Products</h2>
          <p className={styles.sectionSubtitle}>
            Our most popular and highly rated templates, components, and starter kits.
          </p>
        </div>

        <div className={styles.featuredGrid}>
          {featuredProducts.map((product) => {
            const isAdded = addedIds[product.id];
            return (
              <div key={product.id} className={styles.productCard}>
                <div>
                  <div className={styles.productTopRow}>
                    <span className={styles.productCategoryLabel}>
                      {product.categoryLabel}
                    </span>
                    {product.badge && (
                      <span className={styles.productBadge}>
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <h3 className={styles.productName}>
                    {product.name}
                  </h3>

                  <p className={styles.productDesc}>
                    {product.description}
                  </p>

                  <div className={styles.techChipsRow}>
                    {product.techStack.slice(0, 3).map((tech) => (
                      <span key={tech} className={styles.techChip}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.productBottom}>
                  <div className={styles.priceRow}>
                    <div>
                      <span className={styles.priceText}>
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.compareAtPrice && (
                        <span className={styles.comparePrice}>
                          ₹{product.compareAtPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      v{product.version}
                    </span>
                  </div>

                  <div className={styles.cardBtns}>
                    <Link href={`/products/${product.slug}`} className={styles.viewBtn}>
                      View Details
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(product, e)}
                      className={`${styles.cartBtn} ${isAdded ? styles.cartBtnSuccess : ''}`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={14} /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={14} /> Add
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link
            href="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.85rem 2rem',
              borderRadius: '0.75rem',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            View Complete Catalogue (95+ Assets) <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* =========================================
          4. INTERACTIVE ANIMATION PLAYGROUND
          ========================================= */}
      <section className={`${styles.section} ${styles.playgroundSection}`} id="playground">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge} style={{ color: '#ec4899' }}>Interactive Lab</span>
          <h2 className={styles.sectionTitle}>SHIV Animation Playground</h2>
          <p className={styles.sectionSubtitle}>
            Test live interaction mechanics and motion effects directly in your browser. All code available in our components pack.
          </p>
        </div>

        {/* Tab Controls */}
        <div className={styles.playgroundTabs}>
          {playgroundTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActivePlaygroundTab(tab.id as any)}
              className={`${styles.playgroundTab} ${activePlaygroundTab === tab.id ? styles.playgroundTabActive : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Live Interactive Stage */}
        <div className={styles.playgroundInteractiveStage}>
          {/* TAB 1: ANIMATED BUTTONS */}
          {activePlaygroundTab === 'buttons' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Click buttons to trigger physics springs, ripple bursts, and glowing border beams.</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setButtonEffectTrigger((prev) => prev + 1)}
                  style={{
                    padding: '0.85rem 1.75rem',
                    borderRadius: '0.75rem',
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 0 25px rgba(14, 165, 233, 0.4)',
                  }}
                >
                  Spring Physics Push ({buttonEffectTrigger})
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px #ec4899' }}
                  whileTap={{ scale: 0.92 }}
                  style={{
                    padding: '0.85rem 1.75rem',
                    borderRadius: '0.75rem',
                    background: '#090c14',
                    border: '1px solid #ec4899',
                    color: '#f472b6',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Neon Pulse Border ⚡
                </motion.button>

                <motion.button
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  style={{
                    padding: '0.85rem 1.75rem',
                    borderRadius: '0.75rem',
                    backgroundImage: 'linear-gradient(90deg, #10b981, #06b6d4, #6366f1, #10b981)',
                    backgroundSize: '300% 300%',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Gradient Fluid Loop
                </motion.button>
              </div>
            </div>
          )}

          {/* TAB 2: LOGO REVEAL */}
          {activePlaygroundTab === 'logo' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', padding: '1rem 0' }}>
              <ShivBrandSignature
                key={logoReplayKey}
                size={140}
                showTagline={true}
                speedMultiplier={1}
              />
              <button
                type="button"
                onClick={() => setLogoReplayKey((prev) => prev + 1)}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem 1.15rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: '0.5rem',
                  color: '#cbd5e1',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.2s ease',
                }}
              >
                <RotateCcw size={13} /> Replay Brand Signature
              </button>
            </div>
          )}

          {/* TAB 3: LOADERS */}
          {activePlaygroundTab === 'loaders' && (
            <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: '3px solid rgba(56, 189, 248, 0.2)',
                  borderTopColor: '#38bdf8',
                }}
              />
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scaleY: [0.3, 1.2, 0.3] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                    style={{
                      width: '6px',
                      height: '36px',
                      borderRadius: '3px',
                      background: '#10b981',
                    }}
                  />
                ))}
              </div>
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
                  boxShadow: '0 0 20px #ec4899',
                }}
              />
            </div>
          )}

          {/* TAB 4: AUTH TRANSITIONS */}
          {activePlaygroundTab === 'login' && (
            <div style={{ width: '100%', maxWidth: '320px', background: '#111827', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #374151' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setLoginStep('login')}
                  style={{ flex: 1, padding: '0.4rem', borderRadius: '0.4rem', border: 'none', background: loginStep === 'login' ? '#2563eb' : 'transparent', color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setLoginStep('register')}
                  style={{ flex: 1, padding: '0.4rem', borderRadius: '0.4rem', border: 'none', background: loginStep === 'register' ? '#2563eb' : 'transparent', color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Create Account
                </button>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={loginStep}
                  initial={{ opacity: 0, x: loginStep === 'login' ? -15 : 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: loginStep === 'login' ? 15 : -15 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}
                >
                  <input
                    type="email"
                    placeholder="name@example.com"
                    defaultValue="demo@shiv.tech"
                    style={{ width: '100%', padding: '0.5rem 0.75rem', background: '#030712', border: '1px solid #4b5563', borderRadius: '0.5rem', color: '#fff', fontSize: '0.78rem' }}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    defaultValue="••••••••"
                    style={{ width: '100%', padding: '0.5rem 0.75rem', background: '#030712', border: '1px solid #4b5563', borderRadius: '0.5rem', color: '#fff', fontSize: '0.78rem' }}
                  />
                  <button
                    type="button"
                    style={{ padding: '0.55rem', borderRadius: '0.5rem', background: '#3b82f6', border: 'none', color: '#fff', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    {loginStep === 'login' ? 'Continue with Email' : 'Register Account'}
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* TAB 5: 3D HOVER */}
          {activePlaygroundTab === 'hover' && (
            <motion.div
              whileHover={{ rotateY: 15, rotateX: -10, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                perspective: 1000,
                width: '280px',
                height: '160px',
                borderRadius: '1rem',
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <Sparkles size={28} color="#38bdf8" />
              <div style={{ fontWeight: 800, fontSize: '0.95rem', marginTop: '0.5rem' }}>Interactive 3D Card</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Hover to tilt perspective</div>
            </motion.div>
          )}

          {/* TAB 6: FLUID ORBS */}
          {activePlaygroundTab === 'orbs' && (
            <div style={{ position: 'relative', width: '280px', height: '180px', borderRadius: '1rem', overflow: 'hidden', background: '#030712', border: '1px solid #1f2937' }}>
              <motion.div
                animate={{
                  x: [0, 80, -40, 0],
                  y: [0, -40, 30, 0],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: '#38bdf8',
                  filter: 'blur(35px)',
                  opacity: 0.7,
                }}
              />
              <motion.div
                animate={{
                  x: [80, 0, 100, 80],
                  y: [40, 80, 0, 40],
                }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  background: '#ec4899',
                  filter: 'blur(40px)',
                  opacity: 0.6,
                }}
              />
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                Mesh Dynamic Gradient
              </div>
            </div>
          )}

          {/* TAB 7 & 8: SCROLL / PAGE */}
          {(activePlaygroundTab === 'scroll' || activePlaygroundTab === 'page') && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ padding: '1rem 2rem', borderRadius: '0.75rem', background: '#1e293b', border: '1px solid #38bdf8', color: '#fff', fontWeight: 700 }}
              >
                Zero Layout-Shift Page Wipe Transition
              </motion.div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', maxWidth: '340px' }}>
                Hardware accelerated with 60FPS fluid transitions tested across Android and iOS viewports.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =========================================
          5. DEVELOPER CORNER
          ========================================= */}
      <section className={styles.section}>
        <div className={styles.devCornerCard}>
          <div>
            <span className={styles.sectionBadge} style={{ color: '#10b981' }}>Engineered for Developers</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
              Zero Bloat. Pure Production Architecture.
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.75rem', lineHeight: 1.6 }}>
              Every template is built with clean separation of concerns, TypeScript strict mode, reusable UI components, and complete configuration files.
            </p>

            <div className={styles.devFeaturesList}>
              <div className={styles.devFeatureItem}>
                <CheckCircle2 size={16} color="#34d399" />
                <span>React 19 &amp; Next.js 16 App Router Native</span>
              </div>
              <div className={styles.devFeatureItem}>
                <CheckCircle2 size={16} color="#34d399" />
                <span>Tailwind CSS &amp; Pure CSS Module Hybrid Systems</span>
              </div>
              <div className={styles.devFeatureItem}>
                <CheckCircle2 size={16} color="#34d399" />
                <span>FastAPI &amp; Node.js Async Backend Boilerplates</span>
              </div>
              <div className={styles.devFeatureItem}>
                <CheckCircle2 size={16} color="#34d399" />
                <span>Strict Typing, Zero Lint Warnings, Lifetime Patches</span>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <Link href="/products?category=backend" className={styles.primaryCta}>
                View Backend Starters <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className={styles.devSnippetBox}>
            <div style={{ color: '#64748b', marginBottom: '0.5rem' }}>// shiv-quickstart.sh</div>
            <span style={{ color: '#f43f5e' }}>git</span> clone https://github.com/shiv-tech/starter.git<br />
            <span style={{ color: '#38bdf8' }}>cd</span> my-saas-project<br />
            <span style={{ color: '#10b981' }}>npm</span> install<br />
            <span style={{ color: '#fbbf24' }}>npm</span> run dev<br />
            <br />
            <div style={{ color: '#64748b' }}># Ready on http://localhost:3000 (0 errors, 42ms TTFB)</div>
          </div>
        </div>
      </section>

      {/* =========================================
          6. BUNDLES & PROMOTIONS
          ========================================= */}
      {bundles && bundles.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionBadge} style={{ color: '#06b6d4' }}>Save Up To 60%</span>
            <h2 className={styles.sectionTitle}>Curated Value Bundles</h2>
            <p className={styles.sectionSubtitle}>
              Massive collections combining frontend starters, backend APIs, design systems, and animations.
            </p>
          </div>

          <div className={styles.bundlesGrid}>
            {bundles.slice(0, 3).map((bundle, idx) => (
              <div
                key={bundle.id}
                className={`${styles.bundleCard} ${idx === 1 ? styles.bundleCardFeatured : ''}`}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '4px', background: 'rgba(6,182,212,0.15)', color: '#22d3ee' }}>
                      COLLECTION
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                      {bundle.includedFiles.length} In-1
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
                    {bundle.name}
                  </h3>

                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {bundle.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                    {bundle.features.slice(0, 3).map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: '#cbd5e1' }}>
                        <Check size={14} color="#34d399" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff' }}>
                      ₹{bundle.price.toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Lifetime Commercial
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <Link href={`/products/${bundle.slug}`} className={styles.viewBtn}>
                      Details
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(bundle, e)}
                      className={styles.cartBtn}
                    >
                      <ShoppingCart size={14} /> Add Bundle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================
          7. MULTIPURPOSE UNIVERSE: PHYSICAL DROPS, REELS & JOURNAL
          ========================================= */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge} style={{ color: '#38bdf8' }}>The Multipurpose Ecosystem</span>
          <h2 className={styles.sectionTitle}>Physical Drops, Art, Video Reels &amp; Stories</h2>
          <p className={styles.sectionSubtitle}>
            Beyond digital code—explore our complete universe of heavyweight streetwear apparel, original canvas paintings, room decor, video reels, and editorial stories.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {/* Card 1: Apparel & Shoes */}
          <Link
            href="/products?category=clothes"
            style={{
              background: '#0d121f',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '1.25rem',
              overflow: 'hidden',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.25s ease',
            }}
          >
            <div style={{ height: '170px', overflow: 'hidden', background: '#090d16', position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80"
                alt="Streetwear Apparel"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: 'rgba(56, 189, 248, 0.85)', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                Apparel &amp; Footwear
              </span>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>Clothes, Shoes &amp; Accessories</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                Heavyweight 400+ GSM loopback hoodies, minimalist cyber tees, and vulcanized footwear.
              </p>
              <span style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                Shop Physical Drops <ArrowRight size={13} />
              </span>
            </div>
          </Link>

          {/* Card 2: Canvas Paintings & Living Decor */}
          <Link
            href="/products?category=paintings"
            style={{
              background: '#0d121f',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '1.25rem',
              overflow: 'hidden',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.25s ease',
            }}
          >
            <div style={{ height: '170px', overflow: 'hidden', background: '#090d16', position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80"
                alt="Canvas Art"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: 'rgba(236, 72, 153, 0.85)', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                Decor &amp; Art
              </span>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>Paintings &amp; Ambient Decor</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                Original textured canvas art, diffused ambient lights, and minimalist desk objects.
              </p>
              <span style={{ fontSize: '0.82rem', color: '#ec4899', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                View Art Collection <ArrowRight size={13} />
              </span>
            </div>
          </Link>

          {/* Card 3: Reels & Media Showcase */}
          <Link
            href="/showcase"
            style={{
              background: '#0d121f',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '1.25rem',
              overflow: 'hidden',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.25s ease',
            }}
          >
            <div style={{ height: '170px', overflow: 'hidden', background: '#090d16', position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80"
                alt="Video Reels & Media"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: 'rgba(168, 85, 247, 0.85)', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                Reels &amp; Video
              </span>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>Reels &amp; Photos Showcase</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                Watch vertical 9:16 video reels, fit checks, and interactive photo drops with direct shop links.
              </p>
              <span style={{ fontSize: '0.82rem', color: '#a855f7', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                Explore Showcase <ArrowRight size={13} />
              </span>
            </div>
          </Link>

          {/* Card 4: Editorial Journal */}
          <Link
            href="/blog"
            style={{
              background: '#0d121f',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '1.25rem',
              overflow: 'hidden',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.25s ease',
            }}
          >
            <div style={{ height: '170px', overflow: 'hidden', background: '#090d16', position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80"
                alt="SHIV Journal"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', background: 'rgba(52, 211, 153, 0.85)', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                Journal &amp; Guides
              </span>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>Stories, Guides &amp; Tech</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                Written articles covering design philosophies, software architecture, and startup growth.
              </p>
              <span style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                Read The Journal <ArrowRight size={13} />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* =========================================
          8. WHY CHOOSE SHIV & HOW IT WORKS
          ========================================= */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>The SHIV Advantage</span>
          <h2 className={styles.sectionTitle}>Why Engineers Choose SHIV Shop</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(14, 18, 28, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '1rem', padding: '1.5rem' }}>
            <Zap size={24} color="#fbbf24" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>Instant Code Access</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Immediate access to complete repositories, documentation, and starter templates the millisecond checkout is confirmed.
            </p>
          </div>

          <div style={{ background: 'rgba(14, 18, 28, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '1rem', padding: '1.5rem' }}>
            <ShieldCheck size={24} color="#38bdf8" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>Zero Vendor Lock-in</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
              You own 100% of the downloaded source code. Host anywhere: Vercel, AWS, Cloudflare, Docker, or bare metal VPS.
            </p>
          </div>

          <div style={{ background: 'rgba(14, 18, 28, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '1rem', padding: '1.5rem' }}>
            <Code size={24} color="#10b981" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>Production Tested</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Strict TypeScript types, responsive breakpoints, accessible markup, and real-world database models built for scalability.
            </p>
          </div>

          <div style={{ background: 'rgba(14, 18, 28, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '1rem', padding: '1.5rem' }}>
            <RotateCcw size={24} color="#ec4899" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>Lifetime Patches</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Receive free software updates and dependency patch releases accessible directly from your account download library.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================
          8. FREQUENTLY ASKED QUESTIONS
          ========================================= */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>Answers &amp; Clarity</span>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        </div>

        <div className={styles.faqGrid}>
          {faqs.map((faq, index) => {
            const isOpen = faqOpenIndex === index;
            return (
              <div key={index} className={styles.faqItem}>
                <button
                  type="button"
                  onClick={() => setFaqOpenIndex(isOpen ? null : index)}
                  className={styles.faqQuestionBtn}
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', color: '#60a5fa' }} />
                </button>
                {isOpen && (
                  <div className={styles.faqAnswer}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================
          9. NEWSLETTER / UPDATES SIGNUP
          ========================================= */}
      <section className={styles.section} style={{ paddingBottom: '7rem' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '1.5rem', padding: '3rem 2rem', textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
          <Sparkles size={28} color="#60a5fa" style={{ margin: '0 auto 0.75rem' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>Join the SHIV Developer Dispatch</h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', maxWidth: '480px', margin: '0.5rem auto 1.5rem' }}>
            Get notified of new website templates, React component releases, and architectural breakdowns. No spam, ever.
          </p>

          {newsletterSubscribed ? (
            <div style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} /> Subscribed! Welcome to the developer circle.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail) setNewsletterSubscribed(true);
              }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', maxWidth: '460px', margin: '0 auto' }}
            >
              <input
                type="email"
                required
                placeholder="Enter your developer email..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                style={{ flex: 1, minWidth: '220px', padding: '0.75rem 1rem', background: '#090c14', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '0.65rem', color: '#fff', fontSize: '0.85rem' }}
              />
              <button
                type="submit"
                style={{ padding: '0.75rem 1.5rem', borderRadius: '0.65rem', background: '#2563eb', border: 'none', color: '#fff', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
