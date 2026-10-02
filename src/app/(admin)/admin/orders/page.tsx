import db from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Orders</h1>

      <div style={{ backgroundColor: '#111', borderRadius: '0.5rem', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333', backgroundColor: '#1a1a1a' }}>
              <th style={{ padding: '1rem' }}>Order Number</th>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Customer</th>
              <th style={{ padding: '1rem' }}>Total</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{order.orderNumber}</td>
                <td style={{ padding: '1rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '1rem' }}>
                  <div>{order.customerName}</div>
                  <div style={{ fontSize: '0.875rem', color: '#888' }}>{order.customerEmail}</div>
                </td>
                <td style={{ padding: '1rem' }}>₹{order.total.toFixed(2)}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem', 
                    fontSize: '0.875rem',
                    backgroundColor: 
                      order.status === 'PENDING' ? 'rgba(255, 165, 0, 0.1)' : 
                      order.status === 'CONFIRMED' ? 'rgba(0, 100, 255, 0.1)' : 
                      order.status === 'SHIPPED' ? 'rgba(200, 0, 255, 0.1)' :
                      order.status === 'DELIVERED' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                    color: 
                      order.status === 'PENDING' ? '#ffa500' : 
                      order.status === 'CONFIRMED' ? '#00aaff' : 
                      order.status === 'SHIPPED' ? '#c800ff' :
                      order.status === 'DELIVERED' ? '#00ff00' : '#ff4a4a'
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <Link 
                    href={`/admin/orders/${order.id}`}
                    style={{ 
                      padding: '0.5rem 1rem', 
                      backgroundColor: '#333', 
                      color: '#fff', 
                      textDecoration: 'none', 
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
