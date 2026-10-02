import db from '@/lib/db';
import GalleryForm from './GalleryForm';
import { deleteGalleryItem, toggleGalleryItemActive } from '@/app/actions/adminGallery';

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage() {
  const items = await db.galleryItem.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Gallery Management</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div>
          <GalleryForm />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.length === 0 ? (
            <div style={{ backgroundColor: '#111', padding: '2rem', borderRadius: '0.5rem', textAlign: 'center', color: '#888' }}>
              No gallery items found.
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111', padding: '1rem', borderRadius: '0.5rem', borderLeft: `4px solid ${item.active ? '#00ff00' : '#ff0000'}` }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.title}</h3>
                  <div style={{ fontSize: '0.875rem', color: '#888', marginBottom: '0.25rem' }}>{item.type}</div>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem', color: '#00aaff' }}>{item.url}</a>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <form action={async () => {
                    'use server';
                    await toggleGalleryItemActive(item.id, !item.active);
                  }}>
                    <button 
                      type="submit"
                      style={{ 
                        padding: '0.5rem 1rem', 
                        backgroundColor: '#333', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '0.25rem',
                        cursor: 'pointer'
                      }}
                    >
                      {item.active ? 'Disable' : 'Enable'}
                    </button>
                  </form>
                  <form action={async () => {
                    'use server';
                    await deleteGalleryItem(item.id);
                  }}>
                    <button 
                      type="submit"
                      style={{ 
                        padding: '0.5rem 1rem', 
                        backgroundColor: 'rgba(255, 0, 0, 0.1)', 
                        color: '#ff4a4a', 
                        border: 'none', 
                        borderRadius: '0.25rem',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
