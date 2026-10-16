import type { Metadata } from 'next';
import db from '@/lib/db';
import Link from 'next/link';
import { BookOpen, Calendar, Clock, ArrowRight, Sparkles, Tag } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog & Insights | SHIV Technologies & Multipurpose Store',
  description: 'Read the latest stories on streetwear apparel, interior decor, software architecture, website templates, and business growth by SHIV.',
  keywords: ['SHIV blog', 'SHIV articles', 'tech insights', 'streetwear design', 'art decor stories', 'software engineering'],
};

interface BlogPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams;
  const selectedCat = resolvedParams.category || 'all';
  const query = resolvedParams.q?.toLowerCase().trim() || '';

  const whereClause: any = {
    published: true,
  };

  if (selectedCat !== 'all') {
    whereClause.category = selectedCat;
  }

  let posts = await db.blogPost.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });

  if (query) {
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query) ||
        p.content.toLowerCase().includes(query)
    );
  }

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'Design & Tech', label: 'Design & Tech' },
    { id: 'Apparel & Style', label: 'Apparel & Style' },
    { id: 'Living & Decor', label: 'Living & Decor' },
    { id: 'Software & Engineering', label: 'Software' },
    { id: 'Business Growth', label: 'Business Growth' },
  ];

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#07090e', color: '#f8fafc', padding: '6.5rem 5% 5rem' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Header Hero */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '9999px', background: 'rgba(236, 72, 153, 0.12)', border: '1px solid rgba(236, 72, 153, 0.25)', color: '#f472b6', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
            <Sparkles size={14} /> The SHIV Journal
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.25rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '1rem', fontFamily: 'var(--font-display, "Sora", sans-serif)' }}>
            Ideas, Craft &amp; Innovation
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.6 }}>
            Explore essays, design breakdowns, tech tutorials, and behind-the-scenes stories on our physical drops, software tools, and business solutions.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', justifyContent: 'center', marginBottom: '3.5rem' }}>
          {categories.map((cat) => {
            const isActive = selectedCat === cat.id;
            return (
              <Link
                key={cat.id}
                href={cat.id === 'all' ? '/blog' : `/blog?category=${encodeURIComponent(cat.id)}`}
                style={{
                  padding: '0.5rem 1.15rem',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  backgroundColor: isActive ? '#f472b6' : 'rgba(255, 255, 255, 0.06)',
                  color: isActive ? '#000' : '#cbd5e1',
                  border: isActive ? '1px solid #f472b6' : '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

        {/* If no articles exist yet */}
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#0f1422', borderRadius: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <BookOpen size={48} style={{ color: '#64748b', margin: '0 auto 1.25rem' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>No articles published in this category yet</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
              Check back soon as our team and marketers publish new articles and guides.
            </p>
            <Link href="/blog" style={{ color: '#38bdf8', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
              &larr; View all articles
            </Link>
          </div>
        ) : (
          <div>
            {/* Featured Post Hero */}
            {featuredPost && (
              <div style={{ marginBottom: '3.5rem' }}>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: featuredPost.coverImage ? '1.2fr 1fr' : '1fr',
                    gap: '2.5rem',
                    backgroundColor: '#0d121f',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '1.5rem',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  {featuredPost.coverImage && (
                    <div style={{ position: 'relative', minHeight: '340px', background: '#090d16', overflow: 'hidden' }}>
                      <img
                        src={featuredPost.coverImage}
                        alt={featuredPost.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#f472b6', background: 'rgba(236, 72, 153, 0.15)', padding: '0.25rem 0.65rem', borderRadius: '4px' }}>
                        {featuredPost.category}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={13} /> {featuredPost.readTime}
                      </span>
                    </div>

                    <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: '1rem', fontFamily: 'var(--font-display, "Sora", sans-serif)' }}>
                      {featuredPost.title}
                    </h2>

                    <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '0.98rem', marginBottom: '1.75rem' }}>
                      {featuredPost.excerpt}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 700, fontSize: '0.9rem' }}>
                      <span>Read Full Story</span>
                      <ArrowRight size={15} />
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Remaining Posts Grid */}
            {remainingPosts.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
                {remainingPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    style={{
                      backgroundColor: '#0d121f',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '1.25rem',
                      overflow: 'hidden',
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {post.coverImage && (
                      <div style={{ aspectRatio: '16/9', background: '#090d16', overflow: 'hidden' }}>
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                          {post.category}
                        </span>
                        <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                          {post.readTime}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', lineHeight: 1.35, marginBottom: '0.75rem' }}>
                        {post.title}
                      </h3>

                      <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.5rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {post.excerpt}
                      </p>

                      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>By {post.author}</span>
                        <span style={{ color: '#38bdf8', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          Read <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
