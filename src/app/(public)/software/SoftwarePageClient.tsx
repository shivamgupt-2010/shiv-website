'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './page.module.css';

export default function ClientSoftwarePage({ software }: { software: any[] }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          SHIV SOFTWARE
        </motion.h1>
        <motion.p 
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          Digital products built to solve real problems. Simple, fast, and beautifully designed.
        </motion.p>
      </div>

      <div className={styles.productsList}>
        {software.map((product, index) => (
          <motion.div 
            key={product.id}
            className={styles.productCard}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className={styles.imageSection}>
              <div className={styles.imagePlaceholder}>
                [ {product.name.toUpperCase()} PREVIEW ]
              </div>
            </div>
            
            <div className={styles.infoSection}>
              <span className={styles.status}>{product.status.replace('_', ' ')}</span>
              <h2 className={styles.name}>{product.name}</h2>
              <h3 className={styles.headline}>v{product.version || '1.0.0'}</h3>
              <p className={styles.description}>{product.description}</p>
              
              {product.websiteLink ? (
                <a href={product.websiteLink} target="_blank" rel="noopener noreferrer" className={styles.actionLink}>
                  Visit Website <ArrowRight size={18} />
                </a>
              ) : product.downloadLink ? (
                <a href={product.downloadLink} className={styles.actionLink}>
                  Download Now <ArrowRight size={18} />
                </a>
              ) : (
                <div style={{ color: '#888', marginTop: '1rem', fontStyle: 'italic' }}>
                  More details coming soon.
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
