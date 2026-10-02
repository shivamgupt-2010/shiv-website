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
        <div className={styles.heroBackground}>
          <div className={styles.ambientOrb1} />
          <div className={styles.ambientOrb2} />
        </div>
        <div className={styles.heroContent}>
          <motion.div 
            className={styles.heroBadge}
            initial={{ opacity: 0, y: -15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className={styles.badgePulse} />
            <span>⚡ NEXT-GEN COMMERCE & SOFTWARE</span>
          </motion.div>

          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >
            BUILD. DESIGN. <span className="gradient-text-hero">EVOLVE.</span>
          </motion.h1>
          
          <motion.p 
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
          >
            SHIV crafts physical products, high-performance software, and custom digital solutions engineered to push ideas beyond limits.
          </motion.p>
          
          <motion.div 
            className={styles.heroActions}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link href="#explore" className={styles.btnPrimary}>
                Explore Ecosystem <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link href="/contact" className={styles.btnSecondary}>
                Start a Project
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Three Worlds Section */}
      <section id="explore" className={styles.section}>
        <motion.div 
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className={styles.sectionBadge}>EXPLORE THE ECOSYSTEM</span>
          <h2 className={styles.sectionTitle}>One brand.<br /><span className="gradient-text-azure">Multiple ways to build.</span></h2>
        </motion.div>
        
        <div className={styles.worldsGrid}>
          {/* Products */}
          <motion.div 
            className={`${styles.worldCard} ${styles.worldCardProducts}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className={`${styles.iconWrap} ${styles.iconProducts}`}>
              <Package size={26} />
            </div>
            <h3 className={styles.worldTitle}>PRODUCTS</h3>
            <p className={styles.worldDesc}>
              Physical goods designed with high-grade utility and bold aesthetics. SHIV Wear, accessories, tech skins, and limited drops.
            </p>
            <Link href="/products" className={styles.worldLink}>
              Explore Products <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Software */}
          <motion.div 
            className={`${styles.worldCard} ${styles.worldCardSoftware}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className={`${styles.iconWrap} ${styles.iconSoftware}`}>
              <Code size={26} />
            </div>
            <h3 className={styles.worldTitle}>SOFTWARE</h3>
            <p className={styles.worldDesc}>
              High-performance digital engines built to solve problems fast. SHIV Launcher, JEE Practice platforms, and AI tools.
            </p>
            <Link href="/software" className={styles.worldLink}>
              Explore Software <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Business */}
          <motion.div 
            className={`${styles.worldCard} ${styles.worldCardBusiness}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className={`${styles.iconWrap} ${styles.iconBusiness}`}>
              <Building2 size={26} />
            </div>
            <h3 className={styles.worldTitle}>BUSINESS</h3>
            <p className={styles.worldDesc}>
              Tailored technology infrastructure built around scaling enterprises. Custom web applications, workflow automation, and consulting.
            </p>
            <Link href="/business" className={styles.worldLink}>
              Work With SHIV <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className={styles.section}>
        <motion.div 
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className={styles.sectionBadge}>CURATED DROPS</span>
          <h2 className={styles.sectionTitle}>Limited Time.<br /><span className="gradient-text-sunset">Lasting Style.</span></h2>
        </motion.div>

        <div className={styles.productsGrid}>
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <Link href={`/products/${product.slug}`} className={styles.productCard}>
                <div className={styles.productImage}>
                  {product.imageUrl ? (
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      fill 
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      style={{ objectFit: 'cover' }} 
                      className={styles.productImgElement}
                    />
                  ) : (
                    <div className={styles.productPlaceholder}>
                      <span>SHIV</span>
                    </div>
                  )}
                  <div className={styles.productTag}>FEATURED</div>
                </div>
                <div className={styles.productInfo}>
                  <h4 className={styles.productName}>{product.name}</h4>
                  <div className={styles.productPrice}>{product.priceFormatted}</div>
                  <div className={styles.productAction}>
                    <span>View Product</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      {featuredReviews && featuredReviews.length > 0 && (
        <section className={styles.testimonialsSection}>
          <div className={styles.section}>
            <motion.div 
              className={styles.sectionHeader}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className={styles.sectionBadge}>USER TESTIMONIALS</span>
              <h2 className={styles.sectionTitle}>Built for Ambition.<br /><span className="gradient-text-emerald">Loved by Doers.</span></h2>
            </motion.div>
            
            <div className={styles.reviewsGrid}>
              {featuredReviews.map((review, idx) => (
                <motion.div 
                  key={review.id} 
                  className={styles.reviewCard}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className={styles.reviewStars}>
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <p className={styles.reviewText}>"{review.review}"</p>
                  <div className={styles.reviewAuthor}>
                    <strong>{review.customerName}</strong>
                    {review.company && <span> • {review.company}</span>}
                  </div>
                  {review.productProject && (
                    <div className={styles.reviewProject}>Verified for {review.productProject}</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
