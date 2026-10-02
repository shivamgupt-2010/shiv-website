'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { submitReview } from '@/app/actions/publicReviews';

type Review = {
  id: string;
  customerName: string;
  company: string | null;
  review: string;
  rating: number;
  productProject: string | null;
};

export default function ReviewsClient({ initialReviews }: { initialReviews: Review[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    try {
      await submitReview(formData);
      setSubmitted(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Customer Reviews</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>See what others are saying about SHIV products and services.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ padding: '0.75rem 1.5rem', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '0.25rem', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Write a Review
        </button>
      </div>

      {initialReviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
          No reviews found. Be the first to leave a review!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {initialReviews.map((review) => (
            <div key={review.id} style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #222' }}>
              <div style={{ display: 'flex', color: '#ffd700', gap: '2px', marginBottom: '1rem' }}>
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p style={{ color: '#fff', marginBottom: '1.5rem', lineHeight: '1.6' }}>"{review.review}"</p>
              <div>
                <strong style={{ color: '#fff' }}>{review.customerName}</strong>
                {review.company && <span style={{ color: '#888' }}> • {review.company}</span>}
              </div>
              {review.productProject && (
                <div style={{ color: '#888', fontSize: '0.875rem', marginTop: '0.25rem' }}>For {review.productProject}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ backgroundColor: '#111', padding: '2rem', borderRadius: '0.5rem', width: '100%', maxWidth: '500px', border: '1px solid #333', position: 'relative' }}
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>

              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Write a Review</h2>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: '#00ff00' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Thank You!</h3>
                  <p>Your review has been submitted and is pending approval.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="customerName" style={{ color: '#888', fontSize: '0.875rem' }}>Your Name *</label>
                    <input type="text" id="customerName" name="customerName" required style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="company" style={{ color: '#888', fontSize: '0.875rem' }}>Company (Optional)</label>
                    <input type="text" id="company" name="company" style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="productProject" style={{ color: '#888', fontSize: '0.875rem' }}>Product or Service (Optional)</label>
                    <input type="text" id="productProject" name="productProject" placeholder="e.g. SHIV Wear or Custom Website" style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="rating" style={{ color: '#888', fontSize: '0.875rem' }}>Rating (1-5) *</label>
                    <select id="rating" name="rating" defaultValue="5" required style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }}>
                      <option value="5">5 Stars - Excellent</option>
                      <option value="4">4 Stars - Good</option>
                      <option value="3">3 Stars - Average</option>
                      <option value="2">2 Stars - Poor</option>
                      <option value="1">1 Star - Terrible</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="review" style={{ color: '#888', fontSize: '0.875rem' }}>Your Review *</label>
                    <textarea id="review" name="review" required rows={4} style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    style={{ padding: '0.75rem', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '0.25rem', fontWeight: 'bold', marginTop: '1rem', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
