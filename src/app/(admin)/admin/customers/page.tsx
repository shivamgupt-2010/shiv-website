import db from "@/lib/db";
import Link from "next/link";
import { Search } from "lucide-react";

export default async function AdminCustomersPage() {
  const customers = await db.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { orders: true }
      },
      orders: {
        select: { total: true }
      }
    }
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Customers</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            <input 
              type="text" 
              placeholder="Search customers..." 
              style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', backgroundColor: '#111', border: '1px solid #333', color: '#fff', borderRadius: '4px', width: '250px' }}
            />
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#111', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333', backgroundColor: '#0a0a0a', textAlign: 'left' }}>
              <th style={{ padding: '1rem', color: '#888', fontWeight: 'normal' }}>Name</th>
              <th style={{ padding: '1rem', color: '#888', fontWeight: 'normal' }}>Email</th>
              <th style={{ padding: '1rem', color: '#888', fontWeight: 'normal' }}>Joined</th>
              <th style={{ padding: '1rem', color: '#888', fontWeight: 'normal' }}>Orders</th>
              <th style={{ padding: '1rem', color: '#888', fontWeight: 'normal' }}>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => {
              const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0);
              
              return (
                <tr key={customer.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '500' }}>{customer.name}</div>
                  </td>
                  <td style={{ padding: '1rem', color: '#aaa' }}>{customer.email}</td>
                  <td style={{ padding: '1rem', color: '#aaa' }}>{new Date(customer.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>{customer._count.orders}</td>
                  <td style={{ padding: '1rem' }}>₹{totalSpent.toLocaleString()}</td>
                </tr>
              );
            })}
            
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
