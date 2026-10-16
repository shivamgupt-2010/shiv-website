import type { Metadata } from 'next';
import db from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, User, Share2, Sparkles, ShoppingBag, Code, ArrowRight } from 'lucide-react';
import { getSiteUrl } from '@/lib/siteUrl';

export const dynamic = 'force-dynamic';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const baseUrl = getSiteUrl();

  const post = await db.blogPost.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    return { title: 'Article Not Found | SHIV' };
  }

  const metaTitle = `${post.title} | SHIV Journal`;
  const metaDesc = post.excerpt;

  return {
    title: metaTitle,
    description: metaDesc,
    openGraph: {
      title: metaTitle,
      description: metaDesc,
      url: `${baseUrl}/blog/${post.slug}`,
      siteName: 'SHIV Store',
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDesc,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const post = await db.blogPost.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    notFound();
  }

  // Increment view count in background
  try {
    await db.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });
  } catch {}

  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
  }).format(post.createdAt);

  return (
    <article style={{ minHeight: '100vh', backgroundColor: '#07090e', color: '#f8fafc', padding: '6.5rem 5% 6rem' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        
        {/* Back Link */}
        <Link
          href="/blog"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: '#94a3b8',
            fontSize: '0.85rem',
            textDecoration: 'none',
            marginBottom: '2rem',
            transition: 'color 0.2s',
          }}
        >
          <ArrowLeft size={15} /> Back to all articles
        </Link>

        {/* Category & Metadata Header */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#f472b6', background: 'rgba(236, 72, 153, 0.15)', padding: '0.25rem 0.75rem', borderRadius: '9999px', letterSpacing: '0.04em' }}>
            {post.category}
          </span>
          <span style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={13} /> {post.readTime}
          </span>
          <span style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={13} /> {formattedDate}
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.25rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '1.25rem', fontFamily: 'var(--font-display, "Sora", sans-serif)' }}>
          {post.title}
        </h1>

        {/* Excerpt Lead */}
        <p style={{ fontSize: '1.2rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '2.5rem', fontWeight: 400 }}>
          {post.excerpt}
        </p>

        {/* Author Bio Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff' }}>
              S
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff' }}>{post.author}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>SHIV Editorial &amp; Engineering</div>
            </div>
          </div>

          <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
            {post.views} views
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div style={{ borderRadius: '1.5rem', overflow: 'hidden', marginBottom: '3rem', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)' }}>
            <img src={post.coverImage} alt={post.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} />
          </div>
        )}

        {/* Content Body */}
        <div style={{ fontSize: '1.08rem', lineHeight: 1.85, color: '#e2e8f0', whiteSpace: 'pre-line', marginBottom: '4rem' }}>
          {post.content}
        </div>

        {/* Multipurpose Store Handoff Card */}
        <div style={{ background: '#0d121f', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '1.25rem', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#38bdf8' }}>
            <Sparkles size={20} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>Explore the SHIV Multipurpose Ecosystem</h3>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
            From premium streetwear apparel, canvas paintings, and handcrafted decor to cutting-edge software starters, website templates, and business development services.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Link
              href="/products"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', color: '#fff', borderRadius: '0.5rem', fontSize: '0.84rem', fontWeight: 700, textDecoration: 'none' }}
            >
              <ShoppingBag size={14} /> Shop Physical &amp; Digital Products
            </Link>
            <Link
              href="/showcase"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#cbd5e1', borderRadius: '0.5rem', fontSize: '0.84rem', fontWeight: 700, textDecoration: 'none' }}
            >
              Watch Reels &amp; Showcase <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </article>
  );
}
