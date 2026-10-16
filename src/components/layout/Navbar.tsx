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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import styles from './Navbar.module.css';

const categoriesList = [
  { name: 'Website Templates', href: '/products?category=website-templates', icon: Layout, color: '#38bdf8' },
  { name: 'Animations & Effects', href: '/products?category=animations', icon: Sparkles, color: '#ec4899' },
  { name: 'UI Kits & Components', href: '/products?category=ui-kits', icon: Layers, color: '#a855f7' },
  { name: 'Frontend Code', href: '/products?category=frontend', icon: Code, color: '#10b981' },
  { name: 'Backend Starters', href: '/products?category=backend', icon: Server, color: '#f97316' },
  { name: 'SaaS Starter Kits', href: '/products?category=saas-kits', icon: Rocket, color: '#6366f1' },
  { name: 'Graphics & Branding', href: '/products?category=graphics', icon: Palette, color: '#eab308' },
  { name: 'Bundles & Collections', href: '/products?category=bundles', icon: PackageCheck, color: '#06b6d4' },
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
      <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
        <div className={styles.container}>
          {/* Logo */}
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

            <Link 
              href="/products" 
              className={`${styles.navLink} ${pathname.startsWith('/products') ? styles.navLinkActive : ''}`}
            >
              All Assets
            </Link>

            {/* Categories Mega Dropdown trigger */}
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
                <span>Categories</span>
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
                    <div className={styles.dropdownGrid}>
                      {categoriesList.map((cat) => {
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
                    <div className={styles.dropdownFooter}>
                      <Link href="/products" className={styles.dropdownFooterLink}>
                        Browse full catalogue of 95+ digital products <ArrowRight size={14} />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link 
              href="/business/services" 
              className={`${styles.navLink} ${pathname.startsWith('/business/services') ? styles.navLinkActive : ''}`}
            >
              Client Services
            </Link>

            <Link 
              href="/about" 
              className={`${styles.navLink} ${pathname === '/about' ? styles.navLinkActive : ''}`}
            >
              About
            </Link>
          </div>

          {/* Right Actions */}
          <div className={styles.actions}>
            {/* Quick Search Button */}
            <button
              type="button"
              className={styles.searchTriggerBtn}
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search digital products"
            >
              <Search size={16} />
              <span className={styles.searchPlaceholderText}>Search assets...</span>
              <kbd className={styles.searchKbd}>⌘K</kbd>
            </button>

            {/* Account Profile Link */}
            {session ? (
              <Link href="/account" className={styles.accountBtn} title="My Account">
                <User size={18} />
                <span className={styles.accountText}>{session.user?.name?.split(' ')[0] || 'Account'}</span>
              </Link>
            ) : (
              <Link href="/login" className={styles.accountBtn} title="Sign In">
                <User size={18} />
                <span className={styles.accountText}>Sign In</span>
              </Link>
            )}

            {/* Shopping Cart Button */}
            <Link href="/cart" className={styles.cartButton} aria-label="Cart">
              <ShoppingCart size={19} />
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              className={styles.mobileMenuBtn}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Global Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className={styles.searchModalOverlay} onClick={() => setIsSearchOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className={styles.searchModalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearchSubmit} className={styles.searchModalForm}>
                <Search size={18} className={styles.searchModalIcon} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search website templates, React kits, FastAPI starters, animations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchModalInput}
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className={styles.searchModalClose}
                >
                  <X size={18} />
                </button>
              </form>

              {/* Quick Suggestion Pills */}
              <div className={styles.searchSuggestionsBox}>
                <div className={styles.searchSuggestionsHeader}>Popular Searches</div>
                <div className={styles.searchPills}>
                  {['Next.js SaaS', 'FastAPI Starter', 'Interactive Button Pack', 'Figma UI Kit', 'Admin Dashboard', 'Portfolio Template'].map((term) => (
                    <button
                      key={term}
                      type="button"
                      className={styles.searchPill}
                      onClick={() => {
                        setIsSearchOpen(false);
                        router.push(`/products?q=${encodeURIComponent(term)}`);
                      }}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={styles.mobileOverlay}
          >
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={styles.mobileMenu}
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
                  placeholder="Search digital assets..."
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
                  All Products
                </Link>
                <Link
                  href="/business/services"
                  className={`${styles.mobileNavLink} ${pathname.startsWith('/business/services') ? styles.mobileNavLinkActive : ''}`}
                >
                  Custom Business Services
                </Link>
                <Link
                  href="/about"
                  className={`${styles.mobileNavLink} ${pathname === '/about' ? styles.mobileNavLinkActive : ''}`}
                >
                  About SHIV
                </Link>
              </div>

              {/* Categories Sublist */}
              <div className={styles.mobileCategorySection}>
                <div className={styles.mobileCategoryTitle}>Categories</div>
                <div className={styles.mobileCategoryGrid}>
                  {categoriesList.map((cat) => {
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
                  <Shield size={14} /> Admin Portal
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
