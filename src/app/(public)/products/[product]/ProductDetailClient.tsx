'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';
import WishlistButton from './WishlistButton';

type ProductProps = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  priceFormatted: string;
  price: number;
  status: string;
  isCustomizable: boolean;
  sizes: string[];
  variants: string[];
  images: string[];
};

export default function ProductDetailClient({ product, userId, isWishlisted }: { product: ProductProps, userId?: string, isWishlisted?: boolean }) {
  const [activeSize, setActiveSize] = useState<string | null>(product.sizes?.[0] || null);
  const [activeVariant, setActiveVariant] = useState<string | null>(product.variants?.[0] || null);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${activeSize || ''}-${activeVariant || ''}`,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price, // ensure price exists in ProductProps
      quantity: 1,
      size: activeSize || undefined,
      variant: activeVariant || undefined,
    });
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className={styles.container}>
      <Link href="/products" className={styles.backLink}>
        <ArrowLeft size={16} /> Back to Products
      </Link>
      
      <div className={styles.layout}>
        <motion.div 
          className={styles.imageGallery}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className={styles.mainImage} style={{ position: 'relative' }}>
            {product.images?.[0] ? (
              <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'cover' }} />
            ) : (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                SHIV {product.name}
              </div>
            )}
          </div>
        </motion.div>
        
        <motion.div 
          className={styles.productDetails}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <span className={styles.category}>{product.category}</span>
          <h1 className={styles.title}>{product.name}</h1>
          <div className={styles.price}>{product.priceFormatted}</div>
          <p className={styles.description}>{product.description}</p>
          
          {product.sizes.length > 0 && (
            <div className={styles.optionsGroup}>
              <span className={styles.optionsLabel}>Size</span>
              <div className={styles.pills}>
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    className={`${styles.pill} ${activeSize === size ? styles.active : ''}`}
                    onClick={() => setActiveSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {product.variants.length > 0 && (
            <div className={styles.optionsGroup}>
              <span className={styles.optionsLabel}>Variant</span>
              <div className={styles.pills}>
                {product.variants.map(variant => (
                  <button 
                    key={variant}
                    className={`${styles.pill} ${activeVariant === variant ? styles.active : ''}`}
                    onClick={() => setActiveVariant(variant)}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.isCustomizable && (
            <div className={styles.optionsGroup}>
              <span className={styles.optionsLabel}>Customization Available</span>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                You will be able to customize this product during checkout.
              </p>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className={styles.addToCart} 
              style={{ flex: 1 }}
              disabled={product.status === 'OUT_OF_STOCK' || added}
              onClick={handleAddToCart}
            >
              {product.status === 'OUT_OF_STOCK' 
                ? 'Out of Stock' 
                : added 
                  ? <><Check size={20} style={{ marginRight: 8, display: 'inline' }} /> Added</>
                  : 'Add to Cart'}
            </button>
            
            {userId && (
              <WishlistButton userId={userId} productId={product.id} isWishlisted={isWishlisted} />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
