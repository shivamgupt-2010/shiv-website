'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import styles from './page.module.css';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <div className={styles.container}>
      <motion.h1 
        className={styles.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Your Cart
      </motion.h1>

      {items.length === 0 ? (
        <motion.div 
          className={styles.emptyCart}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p>Your cart is currently empty.</p>
          <Link href="/products" className={styles.continueShopping}>
            Continue Shopping
          </Link>
        </motion.div>
      ) : (
        <div className={styles.cartLayout}>
          <div className={styles.cartItems}>
            {items.map((item, index) => (
              <motion.div 
                key={item.id} 
                className={styles.cartItem}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={styles.itemImage}>
                  {/* Placeholder for item image */}
                  SHIV
                </div>
                <div className={styles.itemDetails}>
                  <Link href={`/products/${item.slug}`} className={styles.itemName}>
                    {item.name}
                  </Link>
                  <div className={styles.itemOptions}>
                    {item.size && <span>Size: {item.size}</span>}
                    {item.variant && <span>Variant: {item.variant}</span>}
                  </div>
                  <div className={styles.itemPrice}>
                    ₹{item.price.toLocaleString('en-IN')}
                  </div>
                </div>
                
                <div className={styles.quantityControls}>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Plus size={16} />
                  </button>
                </div>
                
                <div className={styles.itemTotal}>
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
                
                <button 
                  className={styles.removeBtn} 
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove item"
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className={styles.orderSummary}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2>Order Summary</h2>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            
            <Link href="/checkout" className={styles.checkoutBtn}>
              Proceed to Checkout <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );
}
