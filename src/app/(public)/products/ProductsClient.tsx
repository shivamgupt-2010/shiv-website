'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

type Category = { name: string };
type ProductProps = {
  id: string;
  name: string;
  slug: string;
  category: string;
  priceFormatted: string;
  status: string;
  imageUrl: string | null;
};

export default function ProductsClient({ products }: { products: ProductProps[] }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.headerBadge}>CATALOGUE & LIMITED DROPS</span>
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          SHIV PRODUCTS
        </motion.h1>
        <motion.p 
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          Physical goods built with purpose. Explore our collection of premium apparel, tech skins, and accessories.
        </motion.p>
      </div>

      <div className={styles.grid}>
        {products.map((product, index) => (
          <Link href={`/products/${product.slug}`} key={product.id}>
            <motion.div 
              className={styles.productCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 * index, ease: "easeOut" }}
              whileHover={{ y: -6 }}
            >
              <div className={styles.imagePlaceholder}>
                {product.imageUrl ? (
                  <Image 
                    src={product.imageUrl} 
                    alt={product.name} 
                    fill 
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    style={{ objectFit: 'cover' }} 
                    className={styles.imageElement}
                  />
                ) : (
                  <div className={styles.fallbackText}>
                    SHIV {product.category}
                  </div>
                )}
              </div>
              <div className={styles.info}>
                <span className={styles.category}>{product.category}</span>
                <h3 className={styles.name}>{product.name}</h3>
                <div className={styles.price}>
                  {product.priceFormatted}
                  <span className={styles.status}>{product.status === 'ACTIVE' ? 'In Stock' : product.status}</span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
