import db from '@/lib/db';
import { createShowcaseItem, deleteShowcaseItem, toggleFeaturedShowcase } from '@/app/actions/adminShowcase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { Film, Image as ImageIcon, Plus, Trash2, Star, ExternalLink, ShieldAlert } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminShowcasePage() {
  const session = await getServerSession(authOptions);
  const userEmail = (session?.user?.email || '').toLowerCase().trim();
  const userRole = ((session?.user as any)?.role || '').toUpperCase();

  const isAuthorized = userEmail === 'admin@shiv.com' || userRole === 'SUPER_ADMIN' || userRole === 'ADMIN' || userRole === 'MARKETER';

  if (!isAuthorized) {
    return (
      <div style={{ padding: '3rem 1.5rem', maxWidth: '600px', margin: '4rem auto', textAlign: 'center', backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
        <ShieldAlert size={42} style={{ color: '#ef4444', marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>Marketer Access Required</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Managing showcase reels and photos is restricted to Marketers and Super Admins.
        </p>
      </div>
    );
  }

  const items = await db.showcaseItem.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '9999px', color: '#38bdf8', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          <Film size={14} /> Media &amp; Visual Showcase
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Reels &amp; Photos Showcase
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Upload high-energy reels, styling videos, and photo drops for clothes, shoes, decor, paintings, and software.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2.5rem', alignItems: 'start' }}>
        {/* Create Showcase Item Form */}
        <div style={{ backgroundColor: '#111827', padding: '1.75rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} style={{ color: '#38bdf8' }} /> Add Showcase Media
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
            Choose whether to upload a vertical 9:16 Reel or a high-res Photo drop.
          </p>

          <form action={createShowcaseItem} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label htmlFor="title" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>Media Title</label>
              <input type="text" id="title" name="title" required placeholder="e.g. Cyberpunk Hoodie Streetwear Fit / Minimalist Canvas Art" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', borderRadius: '0.5rem', fontSize: '0.9rem' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="type" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>Format Type</label>
                <select id="type" name="type" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', borderRadius: '0.5rem', fontSize: '0.9rem' }}>
                  <option value="REEL">Reel / Video (Vertical 9:16)</option>
                  <option value="PHOTO">Photo Drop (Image)</option>
                </select>
              </div>

              <div>
                <label htmlFor="category" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>Product Category</label>
                <select id="category" name="category" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', borderRadius: '0.5rem', fontSize: '0.9rem' }}>
                  <option value="Clothes">Clothes &amp; Apparel</option>
                  <option value="Shoes">Shoes &amp; Footwear</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Decor">Decor &amp; Living</option>
                  <option value="Paintings">Paintings &amp; Canvas</option>
                  <option value="Software">Software &amp; Digital</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="mediaUrl" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>Media URL (Video or Photo)</label>
              <input type="url" id="mediaUrl" name="mediaUrl" required placeholder="https://youtube.com/shorts/... or https://images.unsplash.com/..." style={{ width: '100%', padding: '0.75rem', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', borderRadius: '0.5rem', fontSize: '0.9rem' }} />
              <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                Supports YouTube Shorts, Instagram Reels, direct MP4 video URLs, or web images.
              </span>
            </div>

            <div>
              <label htmlFor="productLink" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>Linked Product URL (Optional)</label>
              <input type="text" id="productLink" name="productLink" placeholder="/products/hoodie or https://..." style={{ width: '100%', padding: '0.75rem', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', borderRadius: '0.5rem', fontSize: '0.9rem' }} />
              <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                Shows a "Shop this Product" tag on the reel or photo card.
              </span>
            </div>

            <div>
              <label htmlFor="description" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>Description / Caption</label>
              <textarea id="description" name="description" rows={3} placeholder="Style notes, fabric details, artist inspiration..." style={{ width: '100%', padding: '0.75rem', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', borderRadius: '0.5rem', fontSize: '0.9rem', resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <input type="checkbox" id="featured" name="featured" style={{ width: 18, height: 18, accentColor: '#38bdf8', cursor: 'pointer' }} />
              <label htmlFor="featured" style={{ color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Feature on Storefront Homepage</label>
            </div>

            <button type="submit" style={{ padding: '0.85rem', background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.92rem', marginTop: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(14, 165, 233, 0.35)' }}>
              Add to Showcase
            </button>
          </form>
        </div>

        {/* Existing Showcase Items */}
        <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: 0 }}>Active Showcase Library</h3>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{items.length} items</span>
          </div>

          {items.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <Film size={36} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>No showcase reels or photos yet. Add your first item using the form!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', padding: '1.5rem' }}>
              {items.map((item) => (
                <div key={item.id} style={{ background: '#090d16', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '0.75rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', aspectRatio: item.type === 'REEL' ? '9/16' : '1/1', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {item.type === 'PHOTO' ? (
                      <img src={item.mediaUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8' }}>
                        <Film size={32} style={{ color: '#38bdf8', marginBottom: '0.5rem' }} />
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Reel Video</div>
                        <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{item.mediaUrl}</div>
                      </div>
                    )}
                    <span style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', background: item.type === 'REEL' ? 'rgba(236, 72, 153, 0.85)' : 'rgba(56, 189, 248, 0.85)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                      {item.type}
                    </span>
                  </div>

                  <div style={{ padding: '0.85rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      {item.category}
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.title}
                    </div>
                    {item.productLink && (
                      <div style={{ fontSize: '0.72rem', color: '#34d399', marginBottom: '0.5rem' }}>
                        Linked: {item.productLink}
                      </div>
                    )}

                    <div style={{ marginTop: 'auto', paddingTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Feature toggle */}
                      <form action={async () => {
                        'use server';
                        await toggleFeaturedShowcase(item.id, !item.featured);
                      }}>
                        <button
                          type="submit"
                          title={item.featured ? 'Remove from Featured' : 'Feature on Home'}
                          style={{ background: 'none', border: 'none', color: item.featured ? '#f59e0b' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600 }}
                        >
                          <Star size={13} fill={item.featured ? '#f59e0b' : 'none'} />
                          {item.featured ? 'Featured' : 'Feature'}
                        </button>
                      </form>

                      {/* Delete */}
                      <form action={async () => {
                        'use server';
                        await deleteShowcaseItem(item.id);
                      }}>
                        <button
                          type="submit"
                          title="Delete showcase media"
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
