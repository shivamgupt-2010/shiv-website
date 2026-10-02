import Link from 'next/link';
import styles from './Footer.module.css';

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
            <a href="#" className={styles.link}>YouTube</a>
            <a href="#" className={styles.link}>Instagram</a>
            <a href="#" className={styles.link}>X</a>
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
