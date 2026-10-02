import db from '@/lib/db';
import { createSoftwareProduct, updateSoftwareStatus, deleteSoftwareProduct } from '@/app/actions/adminSoftware';

export const dynamic = 'force-dynamic';

export default async function AdminSoftwarePage() {
  const products = await db.softwareProduct.findMany();
  const STATUSES = ['COMING_SOON', 'IN_DEVELOPMENT', 'AVAILABLE', 'MAINTENANCE', 'ARCHIVED'];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Software Products</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Create Software Form */}
        <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '0.5rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Add Software Product</h2>
          
          <form action={createSoftwareProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="name" style={{ color: '#888', fontSize: '0.875rem' }}>Name</label>
              <input type="text" id="name" name="name" required style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="description" style={{ color: '#888', fontSize: '0.875rem' }}>Description</label>
              <textarea id="description" name="description" required rows={3} style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="version" style={{ color: '#888', fontSize: '0.875rem' }}>Version</label>
              <input type="text" id="version" name="version" placeholder="e.g. v1.0.0" style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="status" style={{ color: '#888', fontSize: '0.875rem' }}>Status</label>
              <select id="status" name="status" style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="downloadLink" style={{ color: '#888', fontSize: '0.875rem' }}>Download Link (Optional)</label>
              <input type="text" id="downloadLink" name="downloadLink" style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="websiteLink" style={{ color: '#888', fontSize: '0.875rem' }}>Website Link (Optional)</label>
              <input type="text" id="websiteLink" name="websiteLink" style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '0.25rem', fontWeight: 'bold', marginTop: '1rem', cursor: 'pointer' }}>
              Add Software
            </button>
          </form>
        </div>

        {/* Software List */}
        <div style={{ backgroundColor: '#111', borderRadius: '0.5rem', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333', backgroundColor: '#1a1a1a' }}>
                <th style={{ padding: '1rem' }}>Software</th>
                <th style={{ padding: '1rem' }}>Version</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((software) => (
                <tr key={software.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 'bold' }}>{software.name}</div>
                    <div style={{ fontSize: '0.875rem', color: '#888' }}>{software.description}</div>
                  </td>
                  <td style={{ padding: '1rem', color: '#888' }}>{software.version || '-'}</td>
                  <td style={{ padding: '1rem' }}>
                    <form action={async (formData: FormData) => {
                      'use server';
                      const newStatus = formData.get('status') as string;
                      if (newStatus) await updateSoftwareStatus(software.id, newStatus);
                    }} style={{ display: 'flex', gap: '0.5rem' }}>
                      <select 
                        name="status" 
                        defaultValue={software.status} 
                        style={{ padding: '0.25rem', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '0.25rem', fontSize: '0.875rem' }}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button type="submit" style={{ padding: '0.25rem 0.5rem', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '0.25rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                        Update
                      </button>
                    </form>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <a 
                        href={`/admin/software/${software.id}`}
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
                        await deleteSoftwareProduct(software.id);
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
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                    No software products found.
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
