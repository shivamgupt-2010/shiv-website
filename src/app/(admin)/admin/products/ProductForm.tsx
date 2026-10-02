'use client';

import { createProduct, updateProduct } from '@/app/actions/adminProducts';
import { useRouter } from 'next/navigation';

type Product = {
  id?: string;
  name?: string;
  slug?: string;
  sku?: string;
  description?: string;
  shortDescription?: string;
  price?: number;
  stock?: number;
  status?: string;
};

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    if (product?.id) {
      await updateProduct(product.id, formData);
    } else {
      await createProduct(formData);
    }
  };

  return (
    <form action={handleSubmit} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="name" style={{ color: '#888', fontSize: '0.875rem' }}>Product Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          defaultValue={product?.name || ''} 
          required 
          style={{ padding: '0.75rem', backgroundColor: '#111', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="slug" style={{ color: '#888', fontSize: '0.875rem' }}>Slug (URL-friendly)</label>
        <input 
          type="text" 
          id="slug" 
          name="slug" 
          defaultValue={product?.slug || ''} 
          required 
          style={{ padding: '0.75rem', backgroundColor: '#111', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="sku" style={{ color: '#888', fontSize: '0.875rem' }}>SKU (Leave blank to generate)</label>
        <input 
          type="text" 
          id="sku" 
          name="sku" 
          defaultValue={product?.sku || ''} 
          style={{ padding: '0.75rem', backgroundColor: '#111', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="price" style={{ color: '#888', fontSize: '0.875rem' }}>Price (₹)</label>
        <input 
          type="number" 
          id="price" 
          name="price" 
          step="0.01"
          defaultValue={product?.price || ''} 
          required 
          style={{ padding: '0.75rem', backgroundColor: '#111', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }}
        />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="stock" style={{ color: '#888', fontSize: '0.875rem' }}>Stock Quantity</label>
        <input 
          type="number" 
          id="stock" 
          name="stock"
          defaultValue={product?.stock ?? 0} 
          required 
          style={{ padding: '0.75rem', backgroundColor: '#111', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="status" style={{ color: '#888', fontSize: '0.875rem' }}>Status</label>
        <select 
          id="status" 
          name="status" 
          defaultValue={product?.status || 'ACTIVE'} 
          style={{ padding: '0.75rem', backgroundColor: '#111', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }}
        >
          <option value="DRAFT">Draft</option>
          <option value="ACTIVE">Active</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="shortDescription" style={{ color: '#888', fontSize: '0.875rem' }}>Short Description</label>
        <input 
          type="text" 
          id="shortDescription" 
          name="shortDescription" 
          defaultValue={product?.shortDescription || ''}
          style={{ padding: '0.75rem', backgroundColor: '#111', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="description" style={{ color: '#888', fontSize: '0.875rem' }}>Full Description</label>
        <textarea 
          id="description" 
          name="description" 
          defaultValue={product?.description || ''} 
          required 
          rows={5}
          style={{ padding: '0.75rem', backgroundColor: '#111', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem', resize: 'vertical' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="image" style={{ color: '#888', fontSize: '0.875rem' }}>Product Image</label>
        <input 
          type="file" 
          id="image" 
          name="image" 
          accept="image/*"
          style={{ color: '#fff' }}
        />
        {product?.id && <small style={{ color: '#666' }}>Leave blank to keep existing image</small>}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <button 
          type="submit" 
          style={{ 
            padding: '0.75rem 2rem', 
            backgroundColor: '#fff', 
            color: '#000', 
            border: 'none', 
            borderRadius: '0.25rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {product?.id ? 'Update Product' : 'Create Product'}
        </button>
        <button 
          type="button" 
          onClick={() => router.push('/admin/products')}
          style={{ 
            padding: '0.75rem 2rem', 
            backgroundColor: 'transparent', 
            color: '#888', 
            border: '1px solid #333', 
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
