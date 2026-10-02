'use client';

import { createGalleryItem } from '@/app/actions/adminGallery';
import { useState } from 'react';

export default function GalleryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await createGalleryItem(formData);
      (document.getElementById('galleryForm') as HTMLFormElement).reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="galleryForm" action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px', backgroundColor: '#111', padding: '2rem', borderRadius: '0.5rem' }}>
      <h2 style={{ margin: 0, color: '#fff' }}>Add New Gallery Item</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="title" style={{ color: '#888', fontSize: '0.875rem' }}>Title</label>
        <input 
          type="text" 
          id="title" 
          name="title" 
          required 
          style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="url" style={{ color: '#888', fontSize: '0.875rem' }}>Embed URL</label>
        <input 
          type="url" 
          id="url" 
          name="url" 
          placeholder="https://www.youtube.com/embed/..."
          required 
          style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="type" style={{ color: '#888', fontSize: '0.875rem' }}>Type</label>
        <select 
          id="type" 
          name="type" 
          required 
          style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }}
        >
          <option value="YOUTUBE">YouTube</option>
          <option value="INSTAGRAM">Instagram</option>
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input 
          type="checkbox" 
          id="active" 
          name="active" 
          defaultChecked
          style={{ width: '1.2rem', height: '1.2rem' }}
        />
        <label htmlFor="active" style={{ color: '#fff' }}>Active (Visible on public gallery)</label>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        style={{ 
          padding: '0.75rem 2rem', 
          backgroundColor: '#fff', 
          color: '#000', 
          border: 'none', 
          borderRadius: '0.25rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '1rem'
        }}
      >
        {isSubmitting ? 'Adding...' : 'Add Item'}
      </button>
    </form>
  );
}
