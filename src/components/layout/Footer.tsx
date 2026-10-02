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
            <Link href="/software" className={styles.link}>Software</Link>
            <Link href="/business" className={styles.link}>Business Solutions</Link>
          </div>
        </div>

        <div>
          <h3 className={styles.title}>Company</h3>
          <div className={styles.links}>
            <Link href="/about" className={styles.link}>About SHIV</Link>
            <Link href="/contact" className={styles.link}>Contact</Link>
          </div>
        </div>

        <div>
          <h3 className={styles.title}>Connect</h3>
          <div className={styles.links}>
            <a
              href="https://youtube.com/@shiv-techofficial?si=waKKCQ642kNOw5Hu"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              title="YouTube"
            >
              <span className={styles.linkWithIcon}>
                <YouTubeIcon size={16} /> YouTube
              </span>
            </a>
            <a
              href="https://www.instagram.com/shivam_gupta0310/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              title="Instagram"
            >
              <span className={styles.linkWithIcon}>
                <InstagramIcon size={16} /> Instagram
              </span>
            </a>
            <a
              href="https://wa.me/91626686575"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              title="WhatsApp"
            >
              <span className={styles.linkWithIcon}>
                <WhatsAppIcon size={16} /> WhatsApp: 626686575
              </span>
            </a>
            <a
              href="mailto:shivamgupta@gmail.com"
              className={styles.link}
              title="Email"
            >
              <span className={styles.linkWithIcon}>
                <EmailIcon size={16} /> shivamgupta@gmail.com
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
