"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, X, Eye, EyeOff, Star } from "lucide-react";
import { createReview, updateReview, deleteReview, toggleReviewVisibility } from "@/app/actions/adminReviews";

type Review = {
  id: string;
  customerName: string;
  company: string | null;
  review: string;
  rating: number;
  image: string | null;
  productProject: string | null;
  featured: boolean;
  hidden: boolean;
};

export default function AdminReviewsClient({ initialReviews }: { initialReviews: Review[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOpenModal = (review?: Review) => {
    if (review) {
      setEditingReview(review);
    } else {
      setEditingReview(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReview(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    let res;
    if (editingReview) {
      res = await updateReview(editingReview.id, formData);
    } else {
      res = await createReview(formData);
    }

    if (res.success) {
      handleCloseModal();
    } else {
      alert(res.error || "Something went wrong.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      const res = await deleteReview(id);
      if (!res.success) alert(res.error);
    }
  };

  const handleToggleVisibility = async (id: string, currentHidden: boolean) => {
    const res = await toggleReviewVisibility(id, !currentHidden);
    if (!res.success) alert(res.error);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Reviews & Testimonials</h1>
        <button 
          onClick={() => handleOpenModal()}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fff', color: '#000', padding: '0.75rem 1.5rem', borderRadius: '4px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
        >
          <Plus size={18} /> Add Review
        </button>
      </div>

      <div style={{ backgroundColor: '#111', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333', backgroundColor: '#0a0a0a', textAlign: 'left' }}>
              <th style={{ padding: '1rem', color: '#888', fontWeight: 'normal', width: '20%' }}>Customer / Company</th>
              <th style={{ padding: '1rem', color: '#888', fontWeight: 'normal', width: '40%' }}>Review</th>
              <th style={{ padding: '1rem', color: '#888', fontWeight: 'normal' }}>Rating</th>
              <th style={{ padding: '1rem', color: '#888', fontWeight: 'normal' }}>Status</th>
              <th style={{ padding: '1rem', color: '#888', fontWeight: 'normal', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialReviews.map((review) => (
              <tr key={review.id} style={{ borderBottom: '1px solid #222', opacity: review.hidden ? 0.5 : 1 }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: '500' }}>{review.customerName}</div>
                  {review.company && <div style={{ fontSize: '0.875rem', color: '#888' }}>{review.company}</div>}
                  {review.productProject && <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>For: {review.productProject}</div>}
                </td>
                <td style={{ padding: '1rem', color: '#aaa', fontSize: '0.875rem' }}>
                  "{review.review.length > 100 ? review.review.substring(0, 100) + '...' : review.review}"
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#ffd700' }}>
                    {review.rating} <Star size={14} fill="currentColor" />
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {review.featured && (
                      <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'rgba(255, 215, 0, 0.1)', color: '#ffd700', borderRadius: '4px' }}>Featured</span>
                    )}
                    {review.hidden ? (
                      <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'rgba(255, 0, 0, 0.1)', color: '#ff4444', borderRadius: '4px' }}>Hidden</span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'rgba(0, 255, 0, 0.1)', color: '#4ade80', borderRadius: '4px' }}>Visible</span>
                    )}
                  </div>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => handleToggleVisibility(review.id, review.hidden)}
                      style={{ padding: '0.5rem', backgroundColor: 'transparent', border: '1px solid #333', color: '#888', borderRadius: '4px', cursor: 'pointer' }}
                      title={review.hidden ? "Show" : "Hide"}
                    >
                      {review.hidden ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button 
                      onClick={() => handleOpenModal(review)}
                      style={{ padding: '0.5rem', backgroundColor: 'transparent', border: '1px solid #333', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(review.id)}
                      style={{ padding: '0.5rem', backgroundColor: 'transparent', border: '1px solid #333', color: '#ff4444', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {initialReviews.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>
                  No reviews added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#111', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '600px', border: '1px solid #333', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{editingReview ? "Edit Review" : "Add Review"}</h2>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#888' }}>Customer Name *</label>
                  <input name="customerName" defaultValue={editingReview?.customerName || ""} required style={{ width: '100%', padding: '0.75rem', backgroundColor: '#000', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#888' }}>Company (Optional)</label>
                  <input name="company" defaultValue={editingReview?.company || ""} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#000', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#888' }}>Review Text *</label>
                <textarea name="review" defaultValue={editingReview?.review || ""} required rows={4} style={{ width: '100%', padding: '0.75rem', backgroundColor: '#000', border: '1px solid #333', color: '#fff', borderRadius: '4px', resize: 'vertical' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#888' }}>Rating (1-5)</label>
                  <input name="rating" type="number" min="1" max="5" defaultValue={editingReview?.rating || 5} required style={{ width: '100%', padding: '0.75rem', backgroundColor: '#000', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#888' }}>Related Product/Project</label>
                  <input name="productProject" defaultValue={editingReview?.productProject || ""} placeholder="e.g. SHIV Obsidian or SHIV Web Services" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#000', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#888' }}>Avatar Image URL (Optional)</label>
                <input name="image" defaultValue={editingReview?.image || ""} placeholder="https://..." style={{ width: '100%', padding: '0.75rem', backgroundColor: '#000', border: '1px solid #333', color: '#fff', borderRadius: '4px' }} />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" name="featured" defaultChecked={editingReview ? editingReview.featured : false} />
                <span>Feature on Homepage</span>
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={handleCloseModal} style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: '#fff', border: '1px solid #333', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? "Saving..." : "Save Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
