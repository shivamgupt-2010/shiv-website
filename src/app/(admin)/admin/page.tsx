import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import Link from "next/link";
import { format } from "date-fns";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  if (!cookieStore.has("admin_token")) {
    redirect("/admin/login");
  }

  let totalOrders = 0;
  let totalProducts = 0;
  let totalRevenue = 0;
  let pendingLeads = 0;
  let recentOrders: any[] = [];
  let recentCustomers: any[] = [];

  try {
    const [ordersCount, productsCount, revenueAgg, leadsCount] = await Promise.all([
      db.order.count(),
      db.product.count(),
      db.order.aggregate({
        _sum: { total: true },
        where: { status: { notIn: ["CANCELLED", "REFUNDED", "PENDING"] } }
      }),
      db.businessLead.count({ where: { status: "NEW" } }),
    ]);

    totalOrders = ordersCount;
    totalProducts = productsCount;
    totalRevenue = revenueAgg._sum.total || 0;
    pendingLeads = leadsCount;

    recentOrders = await db.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    });

    recentCustomers = await db.user.findMany({
      where: { role: 'CUSTOMER' },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div style={{ padding: '1.5rem', backgroundColor: '#111', borderRadius: '8px', border: '1px solid #222' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#888', marginBottom: '0.5rem' }}>Total Revenue</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹{totalRevenue.toLocaleString()}</p>
        </div>
        
        <div style={{ padding: '1.5rem', backgroundColor: '#111', borderRadius: '8px', border: '1px solid #222' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#888', marginBottom: '0.5rem' }}>Total Orders</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalOrders}</p>
        </div>
        
        <div style={{ padding: '1.5rem', backgroundColor: '#111', borderRadius: '8px', border: '1px solid #222' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#888', marginBottom: '0.5rem' }}>Products</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalProducts}</p>
        </div>
        
        <div style={{ padding: '1.5rem', backgroundColor: '#111', borderRadius: '8px', border: '1px solid #222' }}>
          <h3 style={{ fontSize: '0.875rem', color: '#888', marginBottom: '0.5rem' }}>New Leads</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{pendingLeads}</p>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Recent Orders</h2>
            <Link href="/admin/orders" style={{ color: '#4da3ff', fontSize: '0.875rem' }}>View All</Link>
          </div>
          
          <div style={{ backgroundColor: '#111', borderRadius: '8px', border: '1px solid #222', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333', backgroundColor: '#0a0a0a', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 1rem', color: '#888', fontWeight: 'normal' }}>Order</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#888', fontWeight: 'normal' }}>Customer</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#888', fontWeight: 'normal' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#888', fontWeight: 'normal' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace' }}>#{order.orderNumber}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{order.customerName}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ 
                        fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px',
                        backgroundColor: order.status === 'CONFIRMED' || order.status === 'DELIVERED' ? 'rgba(0,255,0,0.1)' : 'rgba(255,255,255,0.1)',
                        color: order.status === 'CONFIRMED' || order.status === 'DELIVERED' ? '#4ade80' : '#fff'
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>₹{order.total.toLocaleString()}</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No recent orders.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>New Customers</h2>
            <Link href="/admin/customers" style={{ color: '#4da3ff', fontSize: '0.875rem' }}>View All</Link>
          </div>
          
          <div style={{ backgroundColor: '#111', borderRadius: '8px', border: '1px solid #222', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333', backgroundColor: '#0a0a0a', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 1rem', color: '#888', fontWeight: 'normal' }}>Name</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#888', fontWeight: 'normal' }}>Email</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#888', fontWeight: 'normal' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentCustomers.map(customer => (
                  <tr key={customer.id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '500' }}>{customer.name}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#aaa', fontSize: '0.875rem' }}>{customer.email}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#aaa', fontSize: '0.875rem' }}>{format(new Date(customer.createdAt), 'MMM d, yyyy')}</td>
                  </tr>
                ))}
                {recentCustomers.length === 0 && (
                  <tr><td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No recent customers.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
