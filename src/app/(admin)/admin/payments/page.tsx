import db from '@/lib/db';
import { createPaymentMethod, deletePaymentMethod, togglePaymentMethodStatus } from '@/app/actions/adminPayments';

export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage() {
  const methods = await db.paymentMethod.findMany({
    orderBy: { displayOrder: 'asc' }
  });

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Payment Methods</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Create Payment Method Form */}
        <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '0.5rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Add Payment Method</h2>
          
          <form action={createPaymentMethod} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="name" style={{ color: '#888', fontSize: '0.875rem' }}>Internal Name</label>
              <input type="text" id="name" name="name" placeholder="e.g. UPI_Razorpay" required style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="provider" style={{ color: '#888', fontSize: '0.875rem' }}>Provider</label>
              <input type="text" id="provider" name="provider" placeholder="e.g. Razorpay, Manual" required style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="displayName" style={{ color: '#888', fontSize: '0.875rem' }}>Display Name (Customer facing)</label>
              <input type="text" id="displayName" name="displayName" placeholder="e.g. Pay via UPI" required style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="description" style={{ color: '#888', fontSize: '0.875rem' }}>Description (Optional)</label>
              <input type="text" id="description" name="description" style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="displayOrder" style={{ color: '#888', fontSize: '0.875rem' }}>Display Order</label>
              <input type="number" id="displayOrder" name="displayOrder" defaultValue={0} style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" id="active" name="active" defaultChecked style={{ width: '1.2rem', height: '1.2rem' }} />
              <label htmlFor="active" style={{ color: '#fff' }}>Active</label>
            </div>

            <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '0.25rem', fontWeight: 'bold', marginTop: '1rem', cursor: 'pointer' }}>
              Add Payment Method
            </button>
          </form>
        </div>

        {/* Payment Methods List */}
        <div style={{ backgroundColor: '#111', borderRadius: '0.5rem', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333', backgroundColor: '#1a1a1a' }}>
                <th style={{ padding: '1rem' }}>Display Name</th>
                <th style={{ padding: '1rem' }}>Provider</th>
                <th style={{ padding: '1rem' }}>Order</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {methods.map((method) => (
                <tr key={method.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                    {method.displayName}
                    {method.description && <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 'normal' }}>{method.description}</div>}
                  </td>
                  <td style={{ padding: '1rem' }}>{method.provider}</td>
                  <td style={{ padding: '1rem' }}>{method.displayOrder}</td>
                  <td style={{ padding: '1rem' }}>
                    <form action={async () => {
                      'use server';
                      await togglePaymentMethodStatus(method.id, !method.active);
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
                      await deletePaymentMethod(method.id);
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
                    No payment methods configured.
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
