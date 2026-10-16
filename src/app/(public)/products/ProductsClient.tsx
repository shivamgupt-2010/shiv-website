'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  ShoppingCart,
  Check,
  ArrowRight,
  Filter,
  Layers,
  Code,
  Layout,
  Sparkles,
  Server,
  Rocket,
  Palette,
  PackageCheck,
  ChevronDown,
  FileCode,
} from 'lucide-react';
import { DigitalProduct, DigitalCategory } from '@/lib/digitalProducts';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

interface ProductsClientProps {
  products: DigitalProduct[];
  categories: DigitalCategory[];
}

const techFilters = [
  'All',
  'Next.js',
  'React',
  'Tailwind',
  'FastAPI',
  'Node.js',
  'Python',
  'TypeScript',
  'Figma',
];

export default function ProductsClient({ products, categories }: ProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  const initialCat = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [activeCategory, setActiveCategory] = useState<string>(initialCat);
  const [activeTech, setActiveTech] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<string>('popular');
  const [addedIds, setAddedIds] = useState<{ [id: string]: boolean }>({});

  // Sync state with URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (activeCategory !== 'all' && p.category !== activeCategory) {
        return false;
      }

      // Tech filter
      if (activeTech !== 'All') {
        const t = activeTech.toLowerCase();
        const hasTech = p.techStack.some((tech) => tech.toLowerCase().includes(t));
        if (!hasTech) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = p.name.toLowerCase().includes(q);
        const inDesc = p.description.toLowerCase().includes(q);
        const inSub = p.subcategory.toLowerCase().includes(q);
        const inTech = p.techStack.some((tech) => tech.toLowerCase().includes(q));
        if (!inName && !inDesc && !inSub && !inTech) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return b.id.localeCompare(a.id);
      // popular default
      return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    });
  }, [products, activeCategory, activeTech, searchQuery, sortBy]);

  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug);
    const params = new URLSearchParams(window.location.search);
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    router.replace(`/products?${params.toString()}`, { scroll: false });
  };

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

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.headerBadge}>SHIV DIGITAL REPOSITORY</span>
        <h1 className={styles.title}>All Digital Products</h1>
        <p className={styles.subtitle}>
          Production-grade website templates, React UI components, backend APIs, and starter kits. Built for high performance, modern architecture, and immediate deployment.
        </p>
      </div>

      {/* Toolbar & Filters */}
      <div className={styles.toolbarCard}>
        <div className={styles.toolbarInner}>
          {/* Top Controls: Search & Sort */}
          <div className={styles.topControlsRow}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} size={16} />
              <input
                type="text"
                placeholder="Search templates, components, tech stacks, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

            <div className={styles.filtersGroup}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest Releases</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Pills Bar */}
          <div className={styles.categoryPills}>
            <button
              type="button"
              onClick={() => handleCategoryChange('all')}
              className={`${styles.categoryBtn} ${activeCategory === 'all' ? styles.categoryBtnActive : ''}`}
            >
              All Assets <span className={styles.catCount}>{products.length}</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => handleCategoryChange(cat.slug)}
                className={`${styles.categoryBtn} ${activeCategory === cat.slug ? styles.categoryBtnActive : ''}`}
              >
                <span>{cat.name}</span>
                <span className={styles.catCount}>{cat.itemCount}</span>
              </button>
            ))}
          </div>

          {/* Technology Filter Chips */}
          <div className={styles.techFilterRow}>
            <span className={styles.techFilterLabel}>Tech:</span>
            {techFilters.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => setActiveTech(tech)}
                className={`${styles.techBtn} ${activeTech === tech ? styles.techBtnActive : ''}`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Status Bar */}
      <div className={styles.statusBar}>
        <span>
          Showing <strong style={{ color: '#fff' }}>{filteredProducts.length}</strong> products
          {activeCategory !== 'all' && ` in ${categories.find((c) => c.slug === activeCategory)?.name}`}
          {activeTech !== 'All' && ` (${activeTech})`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
        <button
          type="button"
          onClick={() => {
            setActiveCategory('all');
            setActiveTech('All');
            setSearchQuery('');
          }}
          style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
        >
          Reset All Filters
        </button>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', background: '#0e121c', padding: '3.5rem 2rem', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.08)' }}>
          <FileCode size={48} color="#64748b" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>No products match your filters</h3>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Try searching for other terms like "Next.js", "API", "Dashboard", or clear your active category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('all');
              setActiveTech('All');
              setSearchQuery('');
            }}
            style={{ padding: '0.65rem 1.5rem', borderRadius: '0.65rem', background: '#2563eb', border: 'none', color: '#fff', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredProducts.map((product) => {
            const isAdded = addedIds[product.id];
            return (
              <div key={product.id} className={styles.productCard}>
                <div>
                  <div className={styles.cardTop}>
                    <span className={styles.subcat}>
                      {product.subcategory}
                    </span>
                    {product.badge ? (
                      <span className={styles.badge}>
                        {product.badge}
                      </span>
                    ) : (
                      <span className={styles.version}>
                        v{product.version}
                      </span>
                    )}
                  </div>

                  <h3 className={styles.name}>
                    {product.name}
                  </h3>

                  <p className={styles.desc}>
                    {product.description}
                  </p>

                  <div className={styles.techRow}>
                    {product.techStack.map((tech) => (
                      <span key={tech} className={styles.techPill}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.cardBottom}>
                  <div className={styles.priceRow}>
                    <div>
                      <span className={styles.price}>
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.compareAtPrice && (
                        <span className={styles.comparePrice}>
                          ₹{product.compareAtPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    {product.demoUrl ? (
                      <a
                        href={product.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, textDecoration: 'none' }}
                      >
                        Live Demo ↗
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Source + Docs
                      </span>
                    )}
                  </div>

                  <div className={styles.cardActions}>
                    <Link href={`/products/${product.slug}`} className={styles.viewDetailsBtn}>
                      View Details
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => handleAddToCart(product, e)}
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
