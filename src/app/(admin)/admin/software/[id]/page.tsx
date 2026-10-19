import db from '@/lib/db';
import { updateSoftwareProduct } from '@/app/actions/adminSoftware';
import Link from 'next/link';

export default async function EditSoftwarePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const software = await db.softwareProduct.findUnique({ where: { id } });

  if (!software) {
    return (
      <div style={{ color: '#fff', padding: '2rem' }}>
        <h2>Software Product not found</h2>
        <Link href="/admin/software" style={{ color: '#38bdf8', textDecoration: 'none' }}>&larr; Back to Software List</Link>
      </div>
    );
  }

  const STATUSES = ['AVAILABLE', 'COMING_SOON', 'IN_DEVELOPMENT', 'MAINTENANCE', 'ARCHIVED'];
  const updateSoftwareWithId = updateSoftwareProduct.bind(null, id);

  return (
    <div style={{ color: '#fff', maxWidth: '720px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <Link href="/admin/software" style={{ color: '#888', textDecoration: 'none', fontSize: '0.875rem' }}>&larr; Back to Software Manager</Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Edit Software: {software.name}</h1>
      </div>

      <div style={{ backgroundColor: '#111', padding: '1.75rem', borderRadius: '0.75rem', border: '1px solid #222' }}>
        <form action={updateSoftwareWithId} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="name" style={{ color: '#aaa', fontSize: '0.8rem', fontWeight: 600 }}>Software Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                defaultValue={software.name} 
                required 
                style={{ padding: '0.65rem', backgroundColor: '#181818', border: '1px solid #333', color: '#fff', borderRadius: '0.35rem', fontSize: '0.85rem' }} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="version" style={{ color: '#aaa', fontSize: '0.8rem', fontWeight: 600 }}>Version</label>
              <input 
                type="text" 
                id="version" 
                name="version" 
                defaultValue={software.version || ''} 
                placeholder="e.g. 1.2.0"
                style={{ padding: '0.65rem', backgroundColor: '#181818', border: '1px solid #333', color: '#fff', borderRadius: '0.35rem', fontSize: '0.85rem' }} 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="price" style={{ color: '#aaa', fontSize: '0.8rem', fontWeight: 600 }}>Base Price (INR ₹)</label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                defaultValue={software.price ?? 0} 
                style={{ padding: '0.65rem', backgroundColor: '#181818', border: '1px solid #333', color: '#fff', borderRadius: '0.35rem', fontSize: '0.85rem' }} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="priceFormatted" style={{ color: '#aaa', fontSize: '0.8rem', fontWeight: 600 }}>Display Price Label</label>
              <input 
                type="text" 
                id="priceFormatted" 
                name="priceFormatted" 
                defaultValue={software.priceFormatted || ''} 
                placeholder="e.g. Free, ₹499, or ₹1,499/mo"
                style={{ padding: '0.65rem', backgroundColor: '#181818', border: '1px solid #333', color: '#fff', borderRadius: '0.35rem', fontSize: '0.85rem' }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="description" style={{ color: '#aaa', fontSize: '0.8rem', fontWeight: 600 }}>Description</label>
            <textarea 
              id="description" 
              name="description" 
              defaultValue={software.description} 
              required 
              rows={3} 
              style={{ padding: '0.65rem', backgroundColor: '#181818', border: '1px solid #333', color: '#fff', borderRadius: '0.35rem', fontSize: '0.85rem' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="status" style={{ color: '#aaa', fontSize: '0.8rem', fontWeight: 600 }}>Lifecycle Status</label>
            <select 
              id="status" 
              name="status" 
              defaultValue={software.status} 
              style={{ padding: '0.65rem', backgroundColor: '#181818', border: '1px solid #333', color: '#fff', borderRadius: '0.35rem', fontSize: '0.85rem' }}
            >
              {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="downloadLink" style={{ color: '#aaa', fontSize: '0.8rem', fontWeight: 600 }}>Download / App Link (Optional)</label>
              <input 
                type="text" 
                id="downloadLink" 
                name="downloadLink" 
                defaultValue={software.downloadLink || ''} 
                placeholder="e.g. /software/shiv-launcher or URL"
                style={{ padding: '0.65rem', backgroundColor: '#181818', border: '1px solid #333', color: '#fff', borderRadius: '0.35rem', fontSize: '0.85rem' }} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="websiteLink" style={{ color: '#aaa', fontSize: '0.8rem', fontWeight: 600 }}>Documentation / Web Link (Optional)</label>
              <input 
                type="text" 
                id="websiteLink" 
                name="websiteLink" 
                defaultValue={software.websiteLink || ''} 
                placeholder="e.g. https://... or /software/..."
                style={{ padding: '0.65rem', backgroundColor: '#181818', border: '1px solid #333', color: '#fff', borderRadius: '0.35rem', fontSize: '0.85rem' }} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Link 
              href="/admin/software"
              style={{ padding: '0.65rem 1.25rem', backgroundColor: '#222', color: '#ccc', textDecoration: 'none', borderRadius: '0.35rem', fontWeight: 600, fontSize: '0.85rem' }}
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              style={{ padding: '0.65rem 1.5rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '0.35rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Save Software Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
