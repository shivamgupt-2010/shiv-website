'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { processCheckout } from '@/app/actions/checkout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import styles from './page.module.css';

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ orderNumber: string } | null>(null);

  const deliveryFee = 0; // Free delivery for now

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);
    
    const result = await processCheckout({
      ...formData,
      subtotal: cartTotal,
      deliveryFee,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        variant: item.variant,
      }))
    });

    if (result.success && result.orderNumber) {
      setSuccess({ orderNumber: result.orderNumber });
      clearCart();
    } else {
      setError(result.error || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <motion.div 
          className={styles.successMessage}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CheckCircle2 size={64} className={styles.successIcon} />
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase.</p>
          <div className={styles.orderNumberBox}>
            Order Number: <strong>{success.orderNumber}</strong>
          </div>
          <p className={styles.nextSteps}>
            We've received your order and will process it shortly. 
            Payment will be collected on delivery (COD).
          </p>
          <Link href="/products" className={styles.btnPrimary}>
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href="/cart" className={styles.backLink}>
        <ArrowLeft size={16} /> Back to Cart
      </Link>
      
      <h1 className={styles.title}>Checkout</h1>

      {items.length === 0 ? (
        <div className={styles.emptyCart}>
          <p>Your cart is empty.</p>
          <Link href="/products" className={styles.btnPrimary}>Return to Shop</Link>
        </div>
      ) : (
        <div className={styles.checkoutLayout}>
          <div className={styles.formSection}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <h2>Contact Information</h2>
              
              <div className={styles.formGroup}>
                <label>Email Address</label>
                <input required type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input required type="text" name="customerName" value={formData.customerName} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                  <label>Phone Number</label>
                  <input required type="tel" name="customerPhone" value={formData.customerPhone} onChange={handleChange} />
                </div>
              </div>

              <h2 style={{ marginTop: '2rem' }}>Shipping Address</h2>
              
              <div className={styles.formGroup}>
                <label>Address Line 1</label>
                <input required type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>City</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                  <label>State</label>
                  <input required type="text" name="state" value={formData.state} onChange={handleChange} />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Postal Code</label>
                  <input required type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                  <label>Country</label>
                  <input required type="text" name="country" value={formData.country} readOnly className={styles.readOnly} />
                </div>
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Complete Order (COD)'}
              </button>
            </form>
          </div>
          
          <div className={styles.summarySection}>
            <h2>Order Summary</h2>
            <div className={styles.itemsList}>
              {items.map(item => (
                <div key={item.id} className={styles.summaryItem}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.name} x {item.quantity}</span>
                    <span className={styles.itemOptions}>
                      {item.size && `Size: ${item.size} `}
                      {item.variant && `Variant: ${item.variant}`}
                    </span>
                  </div>
                  <span className={styles.itemPrice}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            
            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className={`${styles.totalRow} ${styles.finalTotal}`}>
                <span>Total</span>
                <span>₹{(cartTotal + deliveryFee).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
