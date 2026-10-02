'use client';

import { motion } from 'framer-motion';
import styles from './page.module.css';

export default function AboutClient() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Technology and Design.
          <br />
          Built for the future.
        </motion.h1>
        
        <motion.p 
          className={styles.mission}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          SHIV is a brand focused on creating premium products, software, and business solutions. 
          We believe in combining intelligent design with robust technology to create 
          tools and experiences that move ideas forward.
        </motion.p>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionContent}>
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Philosophy
          </motion.h2>
          
          <div className={styles.philosophyGrid}>
            <motion.div 
              className={styles.philosophyItem}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className={styles.philosophyTitle}>Build</h3>
              <p className={styles.philosophyDesc}>
                We build real things. Whether physical or digital, we focus on craftsmanship, 
                durability, and utility. We engineer solutions that last.
              </p>
            </motion.div>
            
            <motion.div 
              className={styles.philosophyItem}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className={styles.philosophyTitle}>Design</h3>
              <p className={styles.philosophyDesc}>
                Design is not just how it looks, but how it works. We prioritize clarity, 
                minimalism, and user experience in every touchpoint.
              </p>
            </motion.div>
            
            <motion.div 
              className={styles.philosophyItem}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className={styles.philosophyTitle}>Evolve</h3>
              <p className={styles.philosophyDesc}>
                We iterate relentlessly. We learn, adapt, and improve, pushing the boundaries 
                of what is possible with every new version.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className={styles.founderSection}>
        <motion.div 
          className={styles.founderGrid}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.founderImage}>
            [ FOUNDER PORTRAIT ]
          </div>
          
          <div>
            <div className={styles.founderRole}>Founder, Owner & CEO</div>
            <h2 className={styles.founderName}>Shivam Gupta</h2>
            <p className={styles.founderBio}>
              Driven by a passion for technology and design, Shivam founded SHIV with the 
              vision of creating a brand that bridges the gap between digital innovation 
              and physical craftsmanship. With a focus on quality and minimal aesthetics, 
              he leads the creative and technical direction of the company.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
