'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import { WhatsAppIcon, YouTubeIcon, InstagramIcon, EmailIcon } from '@/components/common/SocialIcons';

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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images/ceo/shivam-gupta-ceo.jpg" 
              alt="Shivam Gupta - Founder and CEO of SHIV" 
              className={styles.founderImgTag}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('.svg')) {
                  target.src = '/images/ceo/shivam-gupta-ceo.svg';
                }
              }}
            />
          </div>
          
          <div>
            <div className={styles.founderRole}>Founder, Owner &amp; CEO</div>
            <h2 className={styles.founderName}>Shivam Gupta</h2>
            <p className={styles.founderBio}>
              Driven by a passion for technology, mathematics, and design, Shivam founded SHIV with the 
              vision of creating an ambitious digital ecosystem bridging intelligent AI, developer tooling, 
              minimal physical craftsmanship, and business acceleration.
            </p>

            <div style={{ marginTop: '1rem', marginBottom: '1.25rem' }}>
              <Link href="/ceo" className={styles.ceoProfileCta}>
                View Full Executive Profile &amp; Roadmap &rarr;
              </Link>
            </div>

            <div className={styles.founderLinks}>
              <a
                href="https://wa.me/916266865755"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.founderLink} ${styles.founderWhatsApp}`}
                title="WhatsApp: +91 62668 65755"
              >
                <WhatsAppIcon size={16} /> WhatsApp: +91 62668 65755
              </a>
              <a
                href="mailto:admin@shiv.com"
                className={`${styles.founderLink} ${styles.founderEmail}`}
                title="Email: admin@shiv.com"
              >
                <EmailIcon size={16} /> admin@shiv.com
              </a>
              <a
                href="https://www.youtube.com/@shivam13gupta"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.founderLink} ${styles.founderYoutube}`}
                title="YouTube: @shivam13gupta"
              >
                <YouTubeIcon size={16} /> @shivam13gupta
              </a>
              <a
                href="https://www.instagram.com/shivam_gupta0310/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.founderLink} ${styles.founderInstagram}`}
                title="Instagram: @shivam_gupta0310"
              >
                <InstagramIcon size={16} /> @shivam_gupta0310
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
