'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import styles from './page.module.css';

export default function LauncherPage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.badge}>In Development</div>
          <h1 className={styles.title}>SHIV Launcher</h1>
          <h2 className={styles.subtitle}>Your device. Your way.</h2>
          <p className={styles.description}>
            We are building a launcher designed from the ground up to respect your time and attention. 
            Minimal interface, blazing fast performance, and deeply customizable.
          </p>
          <Link href="#join-waitlist" className={styles.cta}>
            Join the Beta Waitlist
          </Link>
        </motion.div>
      </section>

      <section className={styles.previewSection}>
        <motion.div 
          className={styles.previewContainer}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          [ LAUNCHER UI PREVIEW / DEMO REEL ]
        </motion.div>
      </section>

      <section className={styles.featuresGrid}>
        <motion.div 
          className={styles.featureCard}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className={styles.featureTitle}>Zero Distractions</h3>
          <p className={styles.featureDesc}>
            A home screen that puts you in control. Hide what you don't need, surface what matters most.
          </p>
        </motion.div>
        
        <motion.div 
          className={styles.featureCard}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <h3 className={styles.featureTitle}>Blazing Fast</h3>
          <p className={styles.featureDesc}>
            Optimized for instantaneous response times. Navigating your device has never felt smoother.
          </p>
        </motion.div>

        <motion.div 
          className={styles.featureCard}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h3 className={styles.featureTitle}>Absolute Customization</h3>
          <p className={styles.featureDesc}>
            Every detail is yours to shape. Fonts, colors, icons, and layout density.
          </p>
        </motion.div>
      </section>
      
      <div style={{ textAlign: 'center', padding: '0 5% var(--spacing-2xl)' }}>
        <Link href="/software" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Back to Software
        </Link>
      </div>
    </div>
  );
}
