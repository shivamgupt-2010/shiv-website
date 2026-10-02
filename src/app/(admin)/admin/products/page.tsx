import db from '@/lib/db';
import Link from 'next/link';
import { deleteProduct } from '@/app/actions/adminProducts';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Products</h1>
        <Link 
          href="/admin/products/new" 
          style={{ 
            backgroundColor: '#fff', 
            color: '#000', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          + Add Product
        </Link>
      </div>

      <div style={{ backgroundColor: '#111', borderRadius: '0.5rem', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333', backgroundColor: '#1a1a1a' }}>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Slug</th>
              <th style={{ padding: '1rem' }}>SKU</th>
              <th style={{ padding: '1rem' }}>Price</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '1rem' }}>{product.name}</td>
                <td style={{ padding: '1rem', color: '#888' }}>{product.slug}</td>
                <td style={{ padding: '1rem' }}>{product.sku}</td>
                <td style={{ padding: '1rem' }}>₹{Number(product.price).toFixed(2)}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem', 
                    fontSize: '0.875rem',
                    backgroundColor: product.status === 'ACTIVE' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                    color: product.status === 'ACTIVE' ? '#00ff00' : '#ff0000'
                  }}>
                    {product.status === 'ACTIVE' ? 'Active' : product.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <Link 
                      href={`/admin/products/${product.id}/edit`}
                      style={{ 
                        padding: '0.5rem 1rem', 
                        backgroundColor: '#333', 
                        color: '#fff', 
                        textDecoration: 'none', 
                        borderRadius: '0.25rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      Edit
                    </Link>
                    <form action={async () => {
                      'use server';
                      await deleteProduct(product.id);
                    }}>
                      <button 
                        type="submit"
                        style={{ 
                          padding: '0.5rem 1rem', 
                          backgroundColor: 'rgba(255, 0, 0, 0.1)', 
                          color: '#ff4a4a', 
                          border: 'none', 
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
