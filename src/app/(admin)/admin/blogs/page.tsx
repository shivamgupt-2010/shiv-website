import db from '@/lib/db';
import { createBlogPost, deleteBlogPost, togglePublishBlog } from '@/app/actions/adminBlogs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { BookOpen, Plus, Eye, Trash2, CheckCircle2, XCircle, ExternalLink, ShieldAlert } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminBlogsPage() {
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
          Writing and publishing blogs is restricted to Marketers and Super Admins.
        </p>
      </div>
    );
  }

  const blogs = await db.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', background: 'rgba(236, 72, 153, 0.12)', border: '1px solid rgba(236, 72, 153, 0.25)', borderRadius: '9999px', color: '#f472b6', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          <BookOpen size={14} /> Content Management
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Blog Publishing &amp; CMS
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Write, edit, and publish stories, style guides, tech updates, and product announcements for the SHIV audience.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2.5rem', alignItems: 'start' }}>
        {/* Blog Creation Form */}
        <div style={{ backgroundColor: '#111827', padding: '1.75rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} style={{ color: '#f472b6' }} /> Write New Article
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
            Articles are immediately published to <code>/blog</code> upon saving.
          </p>

          <form action={createBlogPost} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label htmlFor="title" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>Article Title</label>
              <input type="text" id="title" name="title" required placeholder="e.g. The Craft Behind Hand-Painted Decor and Modern Apparel" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', borderRadius: '0.5rem', fontSize: '0.9rem' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="category" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>Category</label>
                <select id="category" name="category" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', borderRadius: '0.5rem', fontSize: '0.9rem' }}>
                  <option value="Design & Tech">Design &amp; Tech</option>
                  <option value="Apparel & Style">Apparel &amp; Style (Clothes, Shoes)</option>
                  <option value="Living & Decor">Living &amp; Decor (Paintings, Decor)</option>
                  <option value="Software & Engineering">Software &amp; Engineering</option>
                  <option value="Business Growth">Business Growth</option>
                </select>
              </div>

              <div>
                <label htmlFor="readTime" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>Read Time</label>
                <input type="text" id="readTime" name="readTime" defaultValue="5 min read" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', borderRadius: '0.5rem', fontSize: '0.9rem' }} />
              </div>
            </div>

            <div>
              <label htmlFor="excerpt" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>Short Excerpt (Summary)</label>
              <textarea id="excerpt" name="excerpt" rows={2} required placeholder="A brief teaser shown in blog cards and social previews..." style={{ width: '100%', padding: '0.75rem', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', borderRadius: '0.5rem', fontSize: '0.9rem', resize: 'vertical' }} />
            </div>

            <div>
              <label htmlFor="coverImage" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>Cover Image URL (Optional)</label>
              <input type="url" id="coverImage" name="coverImage" placeholder="https://images.unsplash.com/photo-..." style={{ width: '100%', padding: '0.75rem', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', borderRadius: '0.5rem', fontSize: '0.9rem' }} />
            </div>

            <div>
              <label htmlFor="content" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem' }}>Article Content (Markdown supported)</label>
              <textarea id="content" name="content" rows={8} required placeholder="Write the full article content here. You can format with headers, paragraphs, lists, and quotes..." style={{ width: '100%', padding: '0.75rem', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', borderRadius: '0.5rem', fontSize: '0.9rem', resize: 'vertical', fontFamily: 'monospace' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <input type="checkbox" id="published" name="published" defaultChecked style={{ width: 18, height: 18, accentColor: '#f472b6', cursor: 'pointer' }} />
              <label htmlFor="published" style={{ color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Publish Immediately (Visible to Public)</label>
            </div>

            <button type="submit" style={{ padding: '0.85rem', background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.92rem', marginTop: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(236, 72, 153, 0.35)' }}>
              Publish Blog Post
            </button>
          </form>
        </div>

        {/* Existing Blogs List */}
        <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: 0 }}>Published Articles</h3>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{blogs.length} articles</span>
          </div>

          {blogs.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
              <BookOpen size={36} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>No blog posts written yet. Use the form on the left to write your first article!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {blogs.map((blog) => (
                <div key={blog.id} style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f472b6', background: 'rgba(236, 72, 153, 0.12)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {blog.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {blog.readTime}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: blog.published ? '#34d399' : '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                        {blog.published ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#fff', margin: '0 0 0.35rem' }}>
                      {blog.title}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {blog.excerpt}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <Link
                      href={`/blog/${blog.slug}`}
                      target="_blank"
                      title="View Live Article"
                      style={{ padding: '0.45rem', backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#cbd5e1', borderRadius: '0.4rem', display: 'flex', alignItems: 'center' }}
                    >
                      <ExternalLink size={14} />
                    </Link>

                    {/* Toggle Publish Form */}
                    <form action={async () => {
                      'use server';
                      await togglePublishBlog(blog.id, !blog.published);
                    }}>
                      <button
                        type="submit"
                        title={blog.published ? 'Unpublish' : 'Publish'}
                        style={{ padding: '0.45rem 0.75rem', backgroundColor: blog.published ? 'rgba(245, 158, 11, 0.12)' : 'rgba(52, 211, 153, 0.12)', color: blog.published ? '#f59e0b' : '#34d399', border: 'none', borderRadius: '0.4rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        {blog.published ? 'Draft' : 'Publish'}
                      </button>
                    </form>

                    {/* Delete Form */}
                    <form action={async () => {
                      'use server';
                      await deleteBlogPost(blog.id);
                    }}>
                      <button
                        type="submit"
                        title="Delete article"
                        style={{ padding: '0.45rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </form>
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
