import Link from 'next/link';
import styles from './Footer.module.css';
import { YouTubeIcon, InstagramIcon, WhatsAppIcon, EmailIcon } from '@/components/common/SocialIcons';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.logo}>SHIV</div>
          <p className={styles.tagline}>
            BUILD. DESIGN. EVOLVE.
          </p>
        </div>

        <div>
          <h3 className={styles.title}>Explore</h3>
          <div className={styles.links}>
            <Link href="/products" className={styles.link}>Products</Link>
            <Link href="/business/services" className={styles.link}>Services Price Catalogue</Link>
            <Link href="/software" className={styles.link}>Software</Link>
            <Link href="/business" className={styles.link}>Business Solutions</Link>
          </div>
        </div>

        <div>
          <h3 className={styles.title}>Company</h3>
          <div className={styles.links}>
            <Link href="/about" className={styles.link}>About SHIV</Link>
            <Link href="/ceo" className={styles.link} style={{ color: '#38bdf8', fontWeight: 600 }}>Founder &amp; CEO</Link>
            <Link href="/contact" className={styles.link}>Contact</Link>
          </div>
        </div>

        <div>
          <h3 className={styles.title}>Connect</h3>
          <div className={styles.links}>
            <a
              href="https://www.youtube.com/@shivam13gupta"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              title="YouTube @shivam13gupta"
            >
              <span className={styles.linkWithIcon}>
                <YouTubeIcon size={16} /> @shivam13gupta
              </span>
            </a>
            <a
              href="https://www.instagram.com/shivam_gupta0310/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              title="Instagram @shivam_gupta0310"
            >
              <span className={styles.linkWithIcon}>
                <InstagramIcon size={16} /> @shivam_gupta0310
              </span>
            </a>
            <a
              href="https://wa.me/916267686575"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              title="WhatsApp: +91 62676 86575"
            >
              <span className={styles.linkWithIcon}>
                <WhatsAppIcon size={16} /> WhatsApp: 6267686575
              </span>
            </a>
            <a
              href="mailto:admin@shiv.com"
              className={styles.link}
              title="Email"
            >
              <span className={styles.linkWithIcon}>
                <EmailIcon size={16} /> admin@shiv.com
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className={`${styles.container} ${styles.bottom}`}>
        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} SHIV. All rights reserved.
        </div>
        <div className={styles.legal}>
          <Link href="#" className={styles.legalLink}>Privacy Policy</Link>
          <Link href="#" className={styles.legalLink}>Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
