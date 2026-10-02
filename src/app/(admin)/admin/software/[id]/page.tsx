import db from '@/lib/db';
import { updateSoftwareProduct } from '@/app/actions/adminSoftware';
import Link from 'next/link';

export default async function EditSoftwarePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const software = await db.softwareProduct.findUnique({ where: { id } });

  if (!software) {
    return <div>Software Product not found</div>;
  }

  const STATUSES = ['COMING_SOON', 'IN_DEVELOPMENT', 'AVAILABLE', 'MAINTENANCE', 'ARCHIVED'];
  const updateSoftwareWithId = updateSoftwareProduct.bind(null, id);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/software" style={{ color: '#888', textDecoration: 'none' }}>&larr; Back</Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Edit Software Product</h1>
      </div>

      <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '0.5rem', maxWidth: '600px' }}>
        <form action={updateSoftwareWithId} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="name" style={{ color: '#888', fontSize: '0.875rem' }}>Name</label>
            <input type="text" id="name" name="name" defaultValue={software.name} required style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="description" style={{ color: '#888', fontSize: '0.875rem' }}>Description</label>
            <textarea id="description" name="description" defaultValue={software.description} required rows={3} style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="version" style={{ color: '#888', fontSize: '0.875rem' }}>Version</label>
            <input type="text" id="version" name="version" defaultValue={software.version || ''} style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="status" style={{ color: '#888', fontSize: '0.875rem' }}>Status</label>
            <select id="status" name="status" defaultValue={software.status} style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="downloadLink" style={{ color: '#888', fontSize: '0.875rem' }}>Download Link (Optional)</label>
            <input type="text" id="downloadLink" name="downloadLink" defaultValue={software.downloadLink || ''} style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="websiteLink" style={{ color: '#888', fontSize: '0.875rem' }}>Website Link (Optional)</label>
            <input type="text" id="websiteLink" name="websiteLink" defaultValue={software.websiteLink || ''} style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
          </div>

          <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '0.25rem', fontWeight: 'bold', marginTop: '1rem', cursor: 'pointer' }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
