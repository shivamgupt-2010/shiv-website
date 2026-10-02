import db from '@/lib/db';
import { createCoupon, deleteCoupon, toggleCouponStatus } from '@/app/actions/adminCoupons';

export const dynamic = 'force-dynamic';

export default async function AdminCouponsPage() {
  const coupons = await db.coupon.findMany();

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Coupons & Discounts</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Create Coupon Form */}
        <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '0.5rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Create Coupon</h2>
          
          <form action={createCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="code" style={{ color: '#888', fontSize: '0.875rem' }}>Coupon Code</label>
              <input type="text" id="code" name="code" required style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem', textTransform: 'uppercase' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="discountType" style={{ color: '#888', fontSize: '0.875rem' }}>Type</label>
              <select id="discountType" name="discountType" required style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }}>
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (₹)</option>
                <option value="FREE_DELIVERY">Free Delivery</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="discountValue" style={{ color: '#888', fontSize: '0.875rem' }}>Discount Value</label>
              <input type="number" id="discountValue" name="discountValue" step="0.01" required style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="minOrderValue" style={{ color: '#888', fontSize: '0.875rem' }}>Min Order Value (Optional)</label>
              <input type="number" id="minOrderValue" name="minOrderValue" step="0.01" style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" id="active" name="active" defaultChecked style={{ width: '1.2rem', height: '1.2rem' }} />
              <label htmlFor="active" style={{ color: '#fff' }}>Active</label>
            </div>

            <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '0.25rem', fontWeight: 'bold', marginTop: '1rem', cursor: 'pointer' }}>
              Create Coupon
            </button>
          </form>
        </div>

        {/* Coupon List */}
        <div style={{ backgroundColor: '#111', borderRadius: '0.5rem', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333', backgroundColor: '#1a1a1a' }}>
                <th style={{ padding: '1rem' }}>Code</th>
                <th style={{ padding: '1rem' }}>Discount</th>
                <th style={{ padding: '1rem' }}>Min Order</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold', fontFamily: 'monospace' }}>{coupon.code}</td>
                  <td style={{ padding: '1rem' }}>
                    {coupon.discountType === 'PERCENTAGE' && `${coupon.discountValue}%`}
                    {coupon.discountType === 'FIXED' && `₹${coupon.discountValue.toFixed(2)}`}
                    {coupon.discountType === 'FREE_DELIVERY' && `Free Delivery`}
                  </td>
                  <td style={{ padding: '1rem', color: '#888' }}>
                    {coupon.minOrderValue ? `₹${coupon.minOrderValue.toFixed(2)}` : 'None'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <form action={async () => {
                      'use server';
                      await toggleCouponStatus(coupon.id, !coupon.active);
                    }}>
                      <button 
                        type="submit"
                        style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '0.25rem', 
                          fontSize: '0.875rem',
                          backgroundColor: coupon.active ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                          color: coupon.active ? '#00ff00' : '#ff0000',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {coupon.active ? 'Active' : 'Inactive'}
                      </button>
                    </form>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <form action={async () => {
                      'use server';
                      await deleteCoupon(coupon.id);
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
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                    No coupons found.
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
