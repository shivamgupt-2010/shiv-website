import db from '@/lib/db';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

/**
 * Converts any YouTube URL to the correct embed URL.
 * YouTube REFUSES iframe connections for non-embed URLs.
 *
 * Handles:
 *  - https://www.youtube.com/watch?v=VIDEO_ID
 *  - https://youtu.be/VIDEO_ID
 *  - https://www.youtube.com/shorts/VIDEO_ID
 *  - https://www.youtube.com/embed/VIDEO_ID  (already correct)
 */
function toYouTubeEmbedUrl(url: string): string {
  try {
    const u = new URL(url);

    // Already an embed URL
    if (u.pathname.startsWith('/embed/')) return url;

    let videoId: string | null = null;

    if (u.hostname === 'youtu.be') {
      // https://youtu.be/VIDEO_ID
      videoId = u.pathname.slice(1).split('?')[0];
    } else if (u.pathname.startsWith('/shorts/')) {
      // https://www.youtube.com/shorts/VIDEO_ID
      videoId = u.pathname.replace('/shorts/', '').split('?')[0];
    } else if (u.searchParams.has('v')) {
      // https://www.youtube.com/watch?v=VIDEO_ID
      videoId = u.searchParams.get('v');
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  } catch (_) {
    // Malformed URL — return as-is and let the browser show the error
  }
  return url;
}

/**
 * Converts an Instagram post/reel URL to the embed URL.
 * Handles: https://www.instagram.com/reel/CODE/
 */
function toInstagramEmbedUrl(url: string): string {
  if (url.includes('/embed')) return url;
  // Strip trailing slash then append /embed/
  return url.replace(/\/$/, '') + '/embed/';
}

export default async function GalleryPage() {
  const items = await db.galleryItem.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gallery</h1>
      <p className={styles.subtitle}>Watch our latest videos and reels</p>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <p>No gallery items available yet. Check back later!</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {items.map((item) => (
            <div key={item.id} className={styles.item}>
              <h3 className={styles.itemTitle}>{item.title}</h3>
              <div className={styles.iframeContainer}>
                {item.type === 'YOUTUBE' && (
                  <iframe
                    src={toYouTubeEmbedUrl(item.url)}
                    title={item.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className={styles.iframe}
                  />
                )}
                {item.type === 'INSTAGRAM' && (
                  <iframe
                    src={toInstagramEmbedUrl(item.url)}
                    title={item.title}
                    frameBorder="0"
                    scrolling="no"
                    allowTransparency
                    className={styles.iframe}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

