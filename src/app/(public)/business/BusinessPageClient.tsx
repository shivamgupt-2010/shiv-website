'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './page.module.css';

export default function ClientBusinessPage({ packages, projects }: { packages: any[], projects: any[] }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          SHIV BUSINESS
        </motion.h1>
        <motion.p 
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          We build digital solutions that elevate your business. From intelligent web platforms to custom operational software.
        </motion.p>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Digital Solutions</h2>
        <div className={styles.packagesGrid}>
          {packages.map((pkg, index) => (
            <motion.div 
              key={pkg.id} 
              className={styles.packageCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <h3 className={styles.packageName}>{pkg.name} {pkg.featured && <span style={{ color: '#00aaff', fontSize: '0.75rem', marginLeft: '0.5rem' }}>★ POPULAR</span>}</h3>
              <div className={styles.packagePrice}>{pkg.price}</div>
              <p className={styles.packageDesc}>{pkg.description}</p>
              
              <ul className={styles.packageFeatures}>
                {pkg.features.map((feature: string) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              
              <Link href={`/contact?subject=business-${pkg.id}`} className={styles.packageAction}>
                {pkg.cta || 'Get Started'}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={styles.section} style={{ background: '#0a0a0a' }}>
        <h2 className={styles.sectionTitle}>Selected Work</h2>
        <div className={styles.projectsGrid}>
          {projects.map((project, index) => (
            <motion.div 
              key={project.id}
              className={styles.projectCard}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <div className={styles.projectImage}>
                [ {(project.client || project.name).toUpperCase()} PREVIEW ]
              </div>
              <div className={styles.projectInfo}>
                <div className={styles.projectCategory}>{project.category}</div>
                <h3 className={styles.projectClient}>{project.client || project.name}</h3>
                <p className={styles.projectDesc}>{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
