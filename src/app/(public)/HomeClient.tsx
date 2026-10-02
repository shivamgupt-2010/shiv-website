'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Package, Code, Building2, ArrowRight, Star } from 'lucide-react';
import styles from './page.module.css';

type FeaturedProduct = {
  id: string;
  name: string;
  slug: string;
  priceFormatted: string;
  imageUrl: string | null;
};

type ReviewProps = {
  id: string;
  customerName: string;
  company: string | null;
  review: string;
  rating: number;
  productProject: string | null;
};

export default function HomeClient({ featuredProducts, featuredReviews }: { featuredProducts: FeaturedProduct[], featuredReviews?: ReviewProps[] }) {
  return (
    <div className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground} />
        <div className={styles.heroContent}>
          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            BUILD. DESIGN. EVOLVE.
          </motion.h1>
          
          <motion.p 
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            SHIV creates products, software and digital solutions designed to move ideas forward.
          </motion.p>
          
          <motion.div 
            className={styles.heroActions}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <Link href="#explore" className={styles.btnPrimary}>
              Explore SHIV
            </Link>
            <Link href="/contact" className={styles.btnSecondary}>
              Start a Project
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Three Worlds Section */}
      <section id="explore" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>One brand.<br />Multiple ways to build.</h2>
        </div>
        
        <div className={styles.worldsGrid}>
          {/* Products */}
          <div className={styles.worldCard}>
            <Package className={styles.worldIcon} size={32} />
            <h3 className={styles.worldTitle}>PRODUCTS</h3>
            <p className={styles.worldDesc}>
              Physical products designed for everyday life. SHIV Wear, accessories, covers and decorations.
            </p>
            <Link href="/products" className={styles.worldLink}>
              Explore Products <ArrowRight size={16} />
            </Link>
          </div>

          {/* Software */}
          <div className={styles.worldCard}>
            <Code className={styles.worldIcon} size={32} />
            <h3 className={styles.worldTitle}>SOFTWARE</h3>
            <p className={styles.worldDesc}>
              Digital products built to solve real problems. SHIV Launcher, JEE Practice and SHIV AI.
            </p>
            <Link href="/software" className={styles.worldLink}>
              Explore Software <ArrowRight size={16} />
            </Link>
          </div>

          {/* Business */}
          <div className={styles.worldCard}>
            <Building2 className={styles.worldIcon} size={32} />
            <h3 className={styles.worldTitle}>BUSINESS</h3>
            <p className={styles.worldDesc}>
              Technology and digital solutions built around businesses. Websites, automation and custom software.
            </p>
            <Link href="/business" className={styles.worldLink}>
              Work With SHIV <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Limited Time.<br /><span className="gradient-text">Lasting Style.</span></h2>
        </div>

        <div className={styles.productsGrid}>
          {featuredProducts.map((product) => (
            <Link href={`/products/${product.slug}`} key={product.id} className={styles.productCard}>
              <div className={styles.productImage} style={{ position: 'relative' }}>
                {product.imageUrl ? (
                  <Image src={product.imageUrl} alt={product.name} fill style={{ objectFit: 'cover' }} />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                    SHIV {product.name}
                  </div>
                )}
              </div>
              <div className={styles.productInfo}>
                <h4 className={styles.productName}>{product.name}</h4>
                <div className={styles.productPrice}>{product.priceFormatted}</div>
                <div className={styles.productAction}>View Product</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      {featuredReviews && featuredReviews.length > 0 && (
        <section className={styles.section} style={{ backgroundColor: '#111', borderTop: '1px solid #222', borderBottom: '1px solid #222' }}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Built for Ambition.<br /><span className="gradient-text">Loved by Doers.</span></h2>
          </div>
          
          <div className={styles.reviewsGrid}>
            {featuredReviews.map((review) => (
              <div key={review.id} className={styles.reviewCard}>
                <div style={{ display: 'flex', color: '#ffd700', gap: '2px', marginBottom: '1rem' }}>
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className={styles.reviewText}>"{review.review}"</p>
                <div className={styles.reviewAuthor}>
                  <strong>{review.customerName}</strong>
                  {review.company && <span> • {review.company}</span>}
                </div>
                {review.productProject && (
                  <div className={styles.reviewProject}>For {review.productProject}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
