'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Menu,
  X,
  ArrowRight,
  Shield,
  Search,
  User,
  ChevronDown,
  Sparkles,
  Layers,
  Code,
  Server,
  Rocket,
  Palette,
  PackageCheck,
  Layout,
  ExternalLink,
  Shirt,
  Footprints,
  Watch,
  Lamp,
  Paintbrush,
  Film,
  BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import styles from './Navbar.module.css';

const physicalCategories = [
  { name: 'Clothes & Streetwear', href: '/products?category=clothes', icon: Shirt, color: '#38bdf8' },
  { name: 'Shoes & Footwear', href: '/products?category=shoes', icon: Footprints, color: '#f97316' },
  { name: 'Accessories & Gear', href: '/products?category=accessories', icon: Watch, color: '#a855f7' },
  { name: 'Decor & Living', href: '/products?category=decor', icon: Lamp, color: '#34d399' },
  { name: 'Paintings & Canvas Art', href: '/products?category=paintings', icon: Paintbrush, color: '#ec4899' },
];

const digitalCategories = [
  { name: 'Website Templates', href: '/products?category=website-templates', icon: Layout, color: '#38bdf8' },
  { name: 'Animations & Effects', href: '/products?category=animations', icon: Sparkles, color: '#ec4899' },
  { name: 'UI Kits & Components', href: '/products?category=ui-kits', icon: Layers, color: '#a855f7' },
  { name: 'Software & Starters', href: '/software', icon: Rocket, color: '#6366f1' },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount } = useCart();
  const { data: session } = useSession();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsCatDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus search input when modal opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCatDropdownOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
        <div className={styles.container}>
          {/* Brand Logo */}
          <Link href="/" className={styles.logo}>
            <span className={styles.logoGradient}>SHIV</span>
            <span className={styles.logoTag}>SHOP</span>
            <span className={styles.logoDot}></span>
          </Link>

          {/* Desktop Nav Links */}
          <div className={styles.navLinks}>
            <Link 
              href="/" 
              className={`${styles.navLink} ${pathname === '/' ? styles.navLinkActive : ''}`}
            >
              Home
            </Link>

            {/* Shop & Categories Dropdown */}
            <div 
              className={styles.dropdownWrapper}
              onMouseEnter={() => setIsCatDropdownOpen(true)}
              onMouseLeave={() => setIsCatDropdownOpen(false)}
            >
              <button 
                type="button"
                className={`${styles.navLink} ${styles.dropdownBtn}`}
                onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
              >
                <span>Shop Catalogue</span>
                <ChevronDown size={14} className={isCatDropdownOpen ? styles.chevronRotated : ''} />
              </button>

              <AnimatePresence>
                {isCatDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className={styles.dropdownMenu}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', padding: '1.25rem' }}>
                      {/* Physical Products */}
                      <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.08em', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>
                          Physical Drops &amp; Art
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {physicalCategories.map((cat) => {
                            const Icon = cat.icon;
                            return (
                              <Link
                                key={cat.name}
                                href={cat.href}
                                className={styles.dropdownItem}
                                onClick={() => setIsCatDropdownOpen(false)}
                              >
                                <div className={styles.dropdownIconBox} style={{ color: cat.color }}>
                                  <Icon size={16} />
                                </div>
                                <span className={styles.dropdownItemText}>{cat.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>

                      {/* Digital & Software */}
                      <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.08em', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>
                          Software &amp; Digital
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {digitalCategories.map((cat) => {
                            const Icon = cat.icon;
                            return (
                              <Link
                                key={cat.name}
                                href={cat.href}
                                className={styles.dropdownItem}
                                onClick={() => setIsCatDropdownOpen(false)}
                              >
                                <div className={styles.dropdownIconBox} style={{ color: cat.color }}>
                                  <Icon size={16} />
                                </div>
                                <span className={styles.dropdownItemText}>{cat.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className={styles.dropdownFooter}>
                      <Link href="/products" className={styles.dropdownFooterLink}>
                        Explore full multipurpose catalogue (Physical &amp; Digital) <ArrowRight size={14} />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              href="/software" 
              className={`${styles.navLink} ${pathname.startsWith('/software') ? styles.navLinkActive : ''}`}
            >
              Software
            </Link>

            <Link 
              href="/business/services" 
              className={`${styles.navLink} ${pathname.startsWith('/business/services') ? styles.navLinkActive : ''}`}
            >
              Services
            </Link>

            <Link 
              href="/showcase" 
              className={`${styles.navLink} ${pathname.startsWith('/showcase') || pathname.startsWith('/gallery') ? styles.navLinkActive : ''}`}
            >
              <Film size={14} style={{ marginRight: 4, display: 'inline', verticalAlign: 'middle', color: '#38bdf8' }} />
              Showcase
            </Link>

            <Link 
              href="/blog" 
              className={`${styles.navLink} ${pathname.startsWith('/blog') ? styles.navLinkActive : ''}`}
            >
              <BookOpen size={14} style={{ marginRight: 4, display: 'inline', verticalAlign: 'middle', color: '#f472b6' }} />
              Journal
            </Link>
          </div>

          {/* Right Actions */}
          <div className={styles.actions}>
            {/* Quick Search Button */}
            <button
              type="button"
              className={styles.searchTriggerBtn}
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search all products"
            >
              <Search size={16} />
              <span className={styles.searchPlaceholderText}>Search shop &amp; code...</span>
              <kbd className={styles.searchKbd}>⌘K</kbd>
            </button>

            {/* Account Profile Link */}
            {session ? (
              <Link 
                href="/account" 
                className={styles.userBtn}
                title={`Logged in as ${session.user?.name || session.user?.email}`}
              >
                <User size={18} />
                <span className={styles.userBtnText}>{session.user?.name?.split(' ')[0] || 'Account'}</span>
              </Link>
            ) : (
              <Link href="/login" className={styles.userBtn} title="Sign in">
                <User size={18} />
                <span className={styles.userBtnText}>Sign In</span>
              </Link>
            )}

            {/* Cart Button */}
            <Link href="/cart" className={styles.cartBtn} aria-label="Shopping Cart">
              <ShoppingCart size={19} />
              {cartCount > 0 && (
                <span className={styles.cartCountBadge}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={styles.mobileToggle}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Quick Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.searchModalOverlay}
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              className={styles.searchModalCard}
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                <Search size={20} className={styles.searchIcon} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search clothes, decor, software, templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className={styles.searchCloseBtn}
                >
                  <X size={18} />
                </button>
              </form>

              <div className={styles.searchQuickLinks}>
                <span className={styles.quickLinksLabel}>Trending:</span>
                <Link href="/products?category=clothes" onClick={() => setIsSearchOpen(false)} className={styles.quickLinkPill}>
                  Clothes
                </Link>
                <Link href="/products?category=paintings" onClick={() => setIsSearchOpen(false)} className={styles.quickLinkPill}>
                  Paintings
                </Link>
                <Link href="/products?category=decor" onClick={() => setIsSearchOpen(false)} className={styles.quickLinkPill}>
                  Decor
                </Link>
                <Link href="/software" onClick={() => setIsSearchOpen(false)} className={styles.quickLinkPill}>
                  Software
                </Link>
                <Link href="/showcase" onClick={() => setIsSearchOpen(false)} className={styles.quickLinkPill}>
                  Reels
                </Link>
                <Link href="/blog" onClick={() => setIsSearchOpen(false)} className={styles.quickLinkPill}>
                  Journal
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.mobileOverlay}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={styles.mobileMenu}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.mobileMenuHeader}>
                <div className={styles.logo}>
                  <span className={styles.logoGradient}>SHIV</span>
                  <span className={styles.logoTag}>SHOP</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={styles.mobileCloseBtn}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className={styles.mobileSearchForm}>
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search products &amp; stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.mobileSearchInput}
                />
              </form>

              {/* Primary Links */}
              <div className={styles.mobileNavSection}>
                <Link
                  href="/"
                  className={`${styles.mobileNavLink} ${pathname === '/' ? styles.mobileNavLinkActive : ''}`}
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className={`${styles.mobileNavLink} ${pathname.startsWith('/products') ? styles.mobileNavLinkActive : ''}`}
                >
                  All Shop Products
                </Link>
                <Link
                  href="/software"
                  className={`${styles.mobileNavLink} ${pathname.startsWith('/software') ? styles.mobileNavLinkActive : ''}`}
                >
                  Software Tools
                </Link>
                <Link
                  href="/business/services"
                  className={`${styles.mobileNavLink} ${pathname.startsWith('/business/services') ? styles.mobileNavLinkActive : ''}`}
                >
                  Client Services
                </Link>
                <Link
                  href="/showcase"
                  className={`${styles.mobileNavLink} ${pathname.startsWith('/showcase') || pathname.startsWith('/gallery') ? styles.mobileNavLinkActive : ''}`}
                >
                  Reels &amp; Photos Showcase
                </Link>
                <Link
                  href="/blog"
                  className={`${styles.mobileNavLink} ${pathname.startsWith('/blog') ? styles.mobileNavLinkActive : ''}`}
                >
                  Blog &amp; Journal
                </Link>
              </div>

              {/* Physical Categories Sublist */}
              <div className={styles.mobileCategorySection}>
                <div className={styles.mobileCategoryTitle}>Physical Drops</div>
                <div className={styles.mobileCategoryGrid}>
                  {physicalCategories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        className={styles.mobileCategoryItem}
                      >
                        <Icon size={14} style={{ color: cat.color }} />
                        <span>{cat.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Footer Actions */}
              <div className={styles.mobileFooterActions}>
                <Link 
                  href="/cart" 
                  className={styles.mobileCartBtn}
                >
                  <ShoppingCart size={18} />
                  <span>Cart ({cartCount})</span>
                </Link>

                {session ? (
                  <Link href="/account" className={styles.mobileAccountBtn}>
                    <User size={18} /> My Account ({session.user?.name?.split(' ')[0]})
                  </Link>
                ) : (
                  <Link href="/login" className={styles.mobileAccountBtn}>
                    <User size={18} /> Sign In
                  </Link>
                )}

                <Link href="/admin/login" className={styles.mobileAdminLink}>
                  <Shield size={14} /> Admin Portal (Staff Only)
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
