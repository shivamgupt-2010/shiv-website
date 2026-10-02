import db from '@/lib/db';
import { createDeliveryMethod, deleteDeliveryMethod, toggleDeliveryMethodStatus } from '@/app/actions/adminDelivery';

export const dynamic = 'force-dynamic';

export default async function AdminDeliveryPage() {
  const methods = await db.deliveryMethod.findMany();

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Delivery Methods</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Create Delivery Method Form */}
        <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '0.5rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Add Delivery Method</h2>
          
          <form action={createDeliveryMethod} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="name" style={{ color: '#888', fontSize: '0.875rem' }}>Name</label>
              <input type="text" id="name" name="name" placeholder="e.g. Standard Shipping" required style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="description" style={{ color: '#888', fontSize: '0.875rem' }}>Description (Optional)</label>
              <input type="text" id="description" name="description" placeholder="e.g. Delivery in 5-7 days" style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="price" style={{ color: '#888', fontSize: '0.875rem' }}>Price (₹)</label>
              <input type="number" id="price" name="price" step="0.01" defaultValue={0} required style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="minOrderValue" style={{ color: '#888', fontSize: '0.875rem' }}>Min Order Value for this method (Optional)</label>
              <input type="number" id="minOrderValue" name="minOrderValue" step="0.01" style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="estimatedDelivery" style={{ color: '#888', fontSize: '0.875rem' }}>Estimated Delivery Time (Optional)</label>
              <input type="text" id="estimatedDelivery" name="estimatedDelivery" placeholder="e.g. 5-7 business days" style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" id="active" name="active" defaultChecked style={{ width: '1.2rem', height: '1.2rem' }} />
              <label htmlFor="active" style={{ color: '#fff' }}>Active</label>
            </div>

            <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '0.25rem', fontWeight: 'bold', marginTop: '1rem', cursor: 'pointer' }}>
              Add Delivery Method
            </button>
          </form>
        </div>

        {/* Delivery Methods List */}
        <div style={{ backgroundColor: '#111', borderRadius: '0.5rem', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333', backgroundColor: '#1a1a1a' }}>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Price</th>
                <th style={{ padding: '1rem' }}>Estimated Time</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {methods.map((method) => (
                <tr key={method.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                    {method.name}
                    {method.description && <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 'normal' }}>{method.description}</div>}
                  </td>
                  <td style={{ padding: '1rem' }}>₹{method.price.toFixed(2)}</td>
                  <td style={{ padding: '1rem' }}>{method.estimatedDelivery || '-'}</td>
                  <td style={{ padding: '1rem' }}>
                    <form action={async () => {
                      'use server';
                      await toggleDeliveryMethodStatus(method.id, !method.active);
                    }}>
                      <button 
                        type="submit"
                        style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '0.25rem', 
                          fontSize: '0.875rem',
                          backgroundColor: method.active ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                          color: method.active ? '#00ff00' : '#ff0000',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {method.active ? 'Active' : 'Inactive'}
                      </button>
                    </form>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <form action={async () => {
                      'use server';
                      await deleteDeliveryMethod(method.id);
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
                  </td>
                </tr>
              ))}
              {methods.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                    No delivery methods configured.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
