import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import Link from "next/link";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const orders = await db.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        }
      }
    }
  });

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', letterSpacing: '0.05em' }}>Order History</h1>
      
      {orders.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#111', borderRadius: '8px', border: '1px solid #333' }}>
          <p style={{ color: '#888', marginBottom: '1rem' }}>You haven't placed any orders yet.</p>
          <Link href="/products" style={{ color: '#fff', textDecoration: 'underline' }}>Browse Products</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {orders.map((order) => (
            <div key={order.id} style={{ backgroundColor: '#111', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>Order #{order.orderNumber}</div>
                  <div style={{ color: '#888', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold' }}>₹{order.total.toLocaleString()}</div>
                  <div style={{ 
                    display: 'inline-block', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '999px', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold',
                    marginTop: '0.5rem',
                    backgroundColor: 
                      order.status === 'DELIVERED' ? 'rgba(0, 255, 0, 0.1)' :
                      order.status === 'CANCELLED' ? 'rgba(255, 0, 0, 0.1)' : 
                      'rgba(255, 255, 255, 0.1)',
                    color: 
                      order.status === 'DELIVERED' ? '#4ade80' :
                      order.status === 'CANCELLED' ? '#f87171' : 
                      '#fff'
                  }}>
                    {order.status}
                  </div>
                </div>
              </div>
              
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {order.items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontWeight: '500' }}>{item.product.name}</div>
                        {item.variant && (
                          <div style={{ fontSize: '0.875rem', color: '#888' }}>
                            {item.variant.name}: {item.variant.value}
                          </div>
                        )}
                        <div style={{ fontSize: '0.875rem', color: '#888' }}>x{item.quantity}</div>
                      </div>
                      <div>₹{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
