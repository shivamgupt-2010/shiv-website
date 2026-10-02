import db from '@/lib/db';
import { updateBusinessPackage } from '@/app/actions/adminPackages';
import Link from 'next/link';

export default async function EditBusinessPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const pkg = await db.businessPackage.findUnique({ where: { id } });

  if (!pkg) {
    return <div>Package not found</div>;
  }

  let featuresStr = '';
  try {
    const arr = JSON.parse(pkg.features);
    if (Array.isArray(arr)) {
      featuresStr = arr.join('\n');
    }
  } catch (e) {
    featuresStr = pkg.features;
  }

  const updatePackageWithId = updateBusinessPackage.bind(null, id);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/business-packages" style={{ color: '#888', textDecoration: 'none' }}>&larr; Back</Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Edit Business Package</h1>
      </div>

      <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '0.5rem', maxWidth: '600px' }}>
        <form action={updatePackageWithId} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="name" style={{ color: '#888', fontSize: '0.875rem' }}>Package Name</label>
            <input type="text" id="name" name="name" defaultValue={pkg.name} required style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="price" style={{ color: '#888', fontSize: '0.875rem' }}>Price Text</label>
            <input type="text" id="price" name="price" defaultValue={pkg.price} required style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="description" style={{ color: '#888', fontSize: '0.875rem' }}>Description</label>
            <input type="text" id="description" name="description" defaultValue={pkg.description} required style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="features" style={{ color: '#888', fontSize: '0.875rem' }}>Features (1 per line)</label>
            <textarea id="features" name="features" defaultValue={featuresStr} required rows={4} style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="cta" style={{ color: '#888', fontSize: '0.875rem' }}>CTA Button Text</label>
            <input type="text" id="cta" name="cta" defaultValue={pkg.cta} style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="displayOrder" style={{ color: '#888', fontSize: '0.875rem' }}>Display Order</label>
            <input type="number" id="displayOrder" name="displayOrder" defaultValue={pkg.displayOrder} style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" id="featured" name="featured" defaultChecked={pkg.featured} style={{ width: '1.2rem', height: '1.2rem' }} />
              <label htmlFor="featured" style={{ color: '#fff' }}>Featured / Popular</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" id="active" name="active" defaultChecked={pkg.active} style={{ width: '1.2rem', height: '1.2rem' }} />
              <label htmlFor="active" style={{ color: '#fff' }}>Active</label>
            </div>
          </div>

          <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '0.25rem', fontWeight: 'bold', marginTop: '1rem', cursor: 'pointer' }}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
