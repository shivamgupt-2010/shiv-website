'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Image as ImageIcon, Heart, ShoppingBag, Sparkles, X, ExternalLink, Play } from 'lucide-react';

interface ShowcaseItem {
  id: string;
  title: string;
  description: string | null;
  type: string; // REEL, PHOTO, VIDEO
  mediaUrl: string;
  thumbnailUrl: string | null;
  aspectRatio: string;
  category: string;
  tags: string | null;
  productLink: string | null;
  likes: number;
  featured: boolean;
}

interface ShowcaseClientProps {
  initialItems: ShowcaseItem[];
}

function getEmbedUrl(url: string, type: string): { isIframe: boolean; embedUrl: string } {
  try {
    const u = new URL(url);

    if (u.hostname.includes('youtube.com') || u.hostname === 'youtu.be') {
      let videoId = '';
      if (u.hostname === 'youtu.be') {
        videoId = u.pathname.slice(1).split('?')[0];
      } else if (u.pathname.startsWith('/shorts/')) {
        videoId = u.pathname.replace('/shorts/', '').split('?')[0];
      } else if (u.searchParams.has('v')) {
        videoId = u.searchParams.get('v') || '';
      }
      if (videoId) {
        return { isIframe: true, embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0` };
      }
    }

    if (u.hostname.includes('instagram.com')) {
      return { isIframe: true, embedUrl: url.replace(/\/$/, '') + '/embed/' };
    }
  } catch {}

  // Check if it's direct video file
  if (url.endsWith('.mp4') || url.endsWith('.webm') || type === 'REEL' || type === 'VIDEO') {
    return { isIframe: false, embedUrl: url };
  }

  return { isIframe: false, embedUrl: url };
}

export default function ShowcaseClient({ initialItems }: ShowcaseClientProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'reels' | 'photos' | 'clothes' | 'decor' | 'software'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<ShowcaseItem | null>(null);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [userLiked, setUserLiked] = useState<Record<string, boolean>>({});

  const filterTabs = [
    { id: 'all', label: 'All Showcase' },
    { id: 'reels', label: 'Reels (Videos)' },
    { id: 'photos', label: 'Photo Drops' },
    { id: 'clothes', label: 'Clothes & Shoes' },
    { id: 'decor', label: 'Decor & Paintings' },
    { id: 'software', label: 'Software' },
  ];

  const handleLike = (id: string, baseLikes: number) => {
    if (userLiked[id]) return;
    setUserLiked((prev) => ({ ...prev, [id]: true }));
    setLikesMap((prev) => ({ ...prev, [id]: (prev[id] ?? baseLikes) + 1 }));
  };

  const filteredItems = initialItems.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'reels') return item.type === 'REEL' || item.type === 'VIDEO';
    if (activeFilter === 'photos') return item.type === 'PHOTO';
    if (activeFilter === 'clothes') return item.category.toLowerCase().includes('clothes') || item.category.toLowerCase().includes('shoes') || item.category.toLowerCase().includes('apparel');
    if (activeFilter === 'decor') return item.category.toLowerCase().includes('decor') || item.category.toLowerCase().includes('painting') || item.category.toLowerCase().includes('canvas');
    if (activeFilter === 'software') return item.category.toLowerCase().includes('software');
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#07090e', color: '#f8fafc', padding: '6.5rem 5% 6rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Header Hero */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '9999px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
            <Sparkles size={14} /> Visual drops &amp; motion
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.25rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '1rem', fontFamily: 'var(--font-display, "Sora", sans-serif)' }}>
            Reels, Photography &amp; Art
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.6 }}>
            Immerse yourself in our creative showcase: vertical streetwear styling reels, handcrafted room decor, original canvas paintings, and software previews.
          </p>
        </div>

        {/* Filter Navigation */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', justifyContent: 'center', marginBottom: '3.5rem' }}>
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '9999px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: isActive ? '#38bdf8' : 'rgba(255, 255, 255, 0.06)',
                  color: isActive ? '#000' : '#cbd5e1',
                  border: isActive ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Showcase Grid */}
        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#0f1422', borderRadius: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Film size={48} style={{ color: '#64748b', margin: '0 auto 1.25rem' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>No showcase media in this filter yet</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto' }}>
              Check back soon as our team and marketers upload new reels and photo drops.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '2rem' }}>
            {filteredItems.map((item) => {
              const isReel = item.type === 'REEL' || item.type === 'VIDEO';
              const { isIframe, embedUrl } = getEmbedUrl(item.mediaUrl, item.type);
              const currentLikes = likesMap[item.id] ?? item.likes;
              const hasLiked = userLiked[item.id];

              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#0d121f',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '1.25rem',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  {/* Media Display */}
                  <div
                    style={{
                      position: 'relative',
                      aspectRatio: isReel ? '9/16' : '1/1',
                      background: '#000',
                      overflow: 'hidden',
                    }}
                  >
                    {isReel ? (
                      isIframe ? (
                        <iframe
                          src={embedUrl}
                          title={item.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ width: '100%', height: '100%', border: 'none' }}
                        />
                      ) : (
                        <video
                          src={item.mediaUrl}
                          controls
                          playsInline
                          poster={item.thumbnailUrl || undefined}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )
                    ) : (
                      <div
                        onClick={() => setSelectedPhoto(item)}
                        style={{ width: '100%', height: '100%', cursor: 'pointer', overflow: 'hidden' }}
                      >
                        <img
                          src={item.mediaUrl}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        />
                      </div>
                    )}

                    {/* Format Badge */}
                    <span
                      style={{
                        position: 'absolute',
                        top: '0.75rem',
                        left: '0.75rem',
                        background: isReel ? 'rgba(236, 72, 153, 0.85)' : 'rgba(56, 189, 248, 0.85)',
                        backdropFilter: 'blur(4px)',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {item.type}
                    </span>

                    {/* Category Pill */}
                    <span
                      style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        background: 'rgba(0, 0, 0, 0.65)',
                        backdropFilter: 'blur(4px)',
                        color: '#cbd5e1',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                      }}
                    >
                      {item.category}
                    </span>
                  </div>

                  {/* Card Content & Action Info */}
                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>
                      {item.title}
                    </h3>

                    {item.description && (
                      <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.45, marginBottom: '1rem', flex: 1 }}>
                        {item.description}
                      </p>
                    )}

                    {/* Bottom Actions Row */}
                    <div style={{ marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {/* Product Link if specified */}
                      {item.productLink ? (
                        <Link
                          href={item.productLink}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            color: '#38bdf8',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                          }}
                        >
                          <ShoppingBag size={14} /> Shop This Drop &rarr;
                        </Link>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>SHIV Official</span>
                      )}

                      {/* Interactive Like Button */}
                      <button
                        type="button"
                        onClick={() => handleLike(item.id, item.likes)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: 'none',
                          border: 'none',
                          color: hasLiked ? '#ec4899' : '#94a3b8',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <Heart size={15} fill={hasLiked ? '#ec4899' : 'none'} />
                        <span>{currentLikes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Photo Lightbox Modal */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                backgroundColor: 'rgba(0, 0, 0, 0.92)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#fff',
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>

              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: '900px',
                  maxHeight: '90vh',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <img
                  src={selectedPhoto.mediaUrl}
                  alt={selectedPhoto.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '75vh',
                    objectFit: 'contain',
                    borderRadius: '1rem',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
                  }}
                />
                <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: '0 0 0.5rem' }}>
                    {selectedPhoto.title}
                  </h3>
                  {selectedPhoto.description && (
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '600px', margin: '0 auto 1rem' }}>
                      {selectedPhoto.description}
                    </p>
                  )}
                  {selectedPhoto.productLink && (
                    <Link
                      href={selectedPhoto.productLink}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.65rem 1.5rem',
                        borderRadius: '0.5rem',
                        background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        textDecoration: 'none',
                      }}
                    >
                      <ShoppingBag size={15} /> Shop This Product
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
