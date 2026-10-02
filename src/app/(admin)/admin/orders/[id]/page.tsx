import db from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { updateOrderStatus, updateOrderTracking } from '@/app/actions/adminOrders';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
          variant: true
        }
      },
      address: true,
      payment: true
    }
  });

  if (!order) {
    notFound();
  }

  const ORDER_STATUSES = [
    'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'
  ];

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/orders" style={{ color: '#888', textDecoration: 'none' }}>&larr; Back to Orders</Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Order {order.orderNumber}</h1>
        <span style={{ 
          padding: '0.25rem 0.5rem', 
          borderRadius: '0.25rem', 
          fontSize: '0.875rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)'
        }}>
          {order.status}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Items</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {order.items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '50px', height: '50px', backgroundColor: '#222', borderRadius: '0.25rem' }}></div>
                    <div>
                      <div style={{ fontWeight: '500' }}>{item.product.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#888' }}>
                        Qty: {item.quantity} 
                        {item.variant ? ` | ${item.variant.name}: ${item.variant.value}` : ''}
                      </div>
                    </div>
                  </div>
                  <div>${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2rem', borderTop: '1px solid #333', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
                <span>Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
                <span>Delivery</span>
                <span>₹{order.deliveryFee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.25rem', marginTop: '0.5rem' }}>
                <span>Total</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Status & Tracking</h2>
            
            <form action={async (formData: FormData) => {
              'use server';
              const status = formData.get('status') as string;
              if (status) await updateOrderStatus(order.id, status);
            }} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
              <label htmlFor="status" style={{ color: '#888' }}>Status:</label>
              <select 
                name="status" 
                defaultValue={order.status}
                style={{ padding: '0.5rem', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '0.25rem' }}
              >
                {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
                Update Status
              </button>
            </form>

            <form action={async (formData: FormData) => {
              'use server';
              const tracking = formData.get('trackingNumber') as string;
              await updateOrderTracking(order.id, tracking);
            }} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <label htmlFor="trackingNumber" style={{ color: '#888' }}>Tracking:</label>
              <input 
                type="text" 
                name="trackingNumber" 
                defaultValue={order.trackingNumber || ''} 
                placeholder="Enter tracking number"
                style={{ padding: '0.5rem', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '0.25rem', flex: 1 }}
              />
              <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
                Save Tracking
              </button>
            </form>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Customer</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div>{order.customerName}</div>
              <div style={{ color: '#888' }}>
                <a href={`mailto:${order.customerEmail}`} style={{ color: '#00aaff' }}>{order.customerEmail}</a>
              </div>
              {order.customerPhone && <div style={{ color: '#888' }}>{order.customerPhone}</div>}
            </div>
          </div>

          <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Shipping Address</h2>
            {order.address ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', color: '#bbb' }}>
                <div>{order.address.line1}</div>
                <div>{order.address.city}, {order.address.state} {order.address.postalCode}</div>
                <div>{order.address.country}</div>
              </div>
            ) : (
              <div style={{ color: '#888' }}>No address provided</div>
            )}
          </div>
          
          <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Payment</h2>
            {order.payment ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div>Method: <strong>{order.payment.method}</strong></div>
                <div>Status: <span style={{ color: order.payment.status === 'CONFIRMED' ? '#00ff00' : '#ffa500' }}>{order.payment.status}</span></div>
              </div>
            ) : (
              <div style={{ color: '#888' }}>No payment info</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
