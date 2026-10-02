import db from "@/lib/db";
import Link from "next/link";
import { ArrowRight, ShoppingCart, User, Package } from "lucide-react";
import { format } from "date-fns";

export default async function AdminSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || "";
  
  if (!q) {
    return (
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Search Results</h1>
        <p style={{ color: '#888' }}>Please enter a search query.</p>
      </div>
    );
  }

  // Perform parallel searches
  const [orders, customers, products] = await Promise.all([
    db.order.findMany({
      where: {
        OR: [
          { orderNumber: { contains: q } },
          { customerName: { contains: q } },
          { customerEmail: { contains: q } },
        ]
      },
      take: 10,
    }),
    db.user.findMany({
      where: {
        role: "CUSTOMER",
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
        ]
      },
      take: 10,
    }),
    db.product.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { sku: { contains: q } },
        ]
      },
      take: 10,
    })
  ]);

  const totalResults = orders.length + customers.length + products.length;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Search Results</h1>
      <p style={{ color: '#888', marginBottom: '2rem' }}>Found {totalResults} results for "{q}"</p>

      {totalResults === 0 ? (
        <div style={{ padding: '3rem', backgroundColor: '#111', borderRadius: '8px', border: '1px solid #222', textAlign: 'center', color: '#888' }}>
          No results found. Try a different search term.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {orders.length > 0 && (
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingCart size={20} /> Orders ({orders.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {orders.map(order => (
                  <Link key={order.id} href={`/admin/orders/${order.id}`} style={{ display: 'block', padding: '1rem', backgroundColor: '#111', borderRadius: '8px', border: '1px solid #222', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>#{order.orderNumber}</span>
                      <span style={{ color: '#4ade80', fontSize: '0.875rem' }}>₹{order.total.toLocaleString()}</span>
                    </div>
                    <div style={{ color: '#888', fontSize: '0.875rem' }}>{order.customerName}</div>
                    <div style={{ color: '#555', fontSize: '0.75rem', marginTop: '0.5rem' }}>{format(new Date(order.createdAt), 'MMM d, yyyy')}</div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {customers.length > 0 && (
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={20} /> Customers ({customers.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {customers.map(customer => (
                  <Link key={customer.id} href={`/admin/customers`} style={{ display: 'block', padding: '1rem', backgroundColor: '#111', borderRadius: '8px', border: '1px solid #222', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{customer.name}</div>
                    <div style={{ color: '#888', fontSize: '0.875rem' }}>{customer.email}</div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {products.length > 0 && (
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={20} /> Products ({products.length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {products.map(product => (
                  <Link key={product.id} href={`/admin/products/${product.id}`} style={{ display: 'block', padding: '1rem', backgroundColor: '#111', borderRadius: '8px', border: '1px solid #222', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 'bold' }}>{product.name}</span>
                      <span style={{ color: '#4da3ff', fontSize: '0.875rem' }}>₹{product.price.toLocaleString()}</span>
                    </div>
                    <div style={{ color: '#888', fontSize: '0.875rem' }}>SKU: {product.sku}</div>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  );
}
