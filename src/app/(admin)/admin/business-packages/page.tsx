import db from '@/lib/db';
import { createBusinessPackage, togglePackageStatus, deleteBusinessPackage } from '@/app/actions/adminPackages';

export const dynamic = 'force-dynamic';

export default async function AdminPackagesPage() {
  const packages = await db.businessPackage.findMany({
    orderBy: { displayOrder: 'asc' }
  });

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Business Packages</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Create Package Form */}
        <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '0.5rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Add Package</h2>
          
          <form action={createBusinessPackage} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="name" style={{ color: '#888', fontSize: '0.875rem' }}>Package Name</label>
              <input type="text" id="name" name="name" placeholder="e.g. Starter Pack" required style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="price" style={{ color: '#888', fontSize: '0.875rem' }}>Price Text</label>
              <input type="text" id="price" name="price" placeholder="e.g. ₹24,999 or Custom" required style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="description" style={{ color: '#888', fontSize: '0.875rem' }}>Description</label>
              <input type="text" id="description" name="description" required style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="features" style={{ color: '#888', fontSize: '0.875rem' }}>Features (1 per line)</label>
              <textarea id="features" name="features" required rows={4} placeholder="Custom Website\nSEO Optimized\nAnalytics" style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="cta" style={{ color: '#888', fontSize: '0.875rem' }}>CTA Button Text</label>
              <input type="text" id="cta" name="cta" defaultValue="Get Started" style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="displayOrder" style={{ color: '#888', fontSize: '0.875rem' }}>Display Order</label>
              <input type="number" id="displayOrder" name="displayOrder" defaultValue={0} style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="featured" name="featured" style={{ width: '1.2rem', height: '1.2rem' }} />
                <label htmlFor="featured" style={{ color: '#fff' }}>Featured / Popular</label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="active" name="active" defaultChecked style={{ width: '1.2rem', height: '1.2rem' }} />
                <label htmlFor="active" style={{ color: '#fff' }}>Active</label>
              </div>
            </div>

            <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '0.25rem', fontWeight: 'bold', marginTop: '1rem', cursor: 'pointer' }}>
              Add Package
            </button>
          </form>
        </div>

        {/* Packages List */}
        <div style={{ backgroundColor: '#111', borderRadius: '0.5rem', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333', backgroundColor: '#1a1a1a' }}>
                <th style={{ padding: '1rem' }}>Package</th>
                <th style={{ padding: '1rem' }}>Price</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 'bold' }}>{pkg.name} {pkg.featured && <span style={{ color: '#00aaff', fontSize: '0.75rem', marginLeft: '0.5rem' }}>★ FEATURED</span>}</div>
                    <div style={{ fontSize: '0.875rem', color: '#888' }}>{pkg.description}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>{pkg.price}</td>
                  <td style={{ padding: '1rem' }}>
                    <form action={async () => {
                      'use server';
                      await togglePackageStatus(pkg.id, !pkg.active);
                    }}>
                      <button 
                        type="submit"
                        style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '0.25rem', 
                          fontSize: '0.875rem',
                          backgroundColor: pkg.active ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                          color: pkg.active ? '#00ff00' : '#ff0000',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {pkg.active ? 'Active' : 'Inactive'}
                      </button>
                    </form>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <a 
                        href={`/admin/business-packages/${pkg.id}`}
                        style={{ 
                          padding: '0.5rem 1rem', 
                          backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: '0.25rem',
                          fontSize: '0.875rem',
                          textDecoration: 'none',
                          display: 'inline-block'
                        }}
                      >
                        Edit
                      </a>
                      <form action={async () => {
                        'use server';
                        await deleteBusinessPackage(pkg.id);
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
              {packages.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                    No packages configured.
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
