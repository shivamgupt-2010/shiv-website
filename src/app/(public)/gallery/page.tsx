import db from '@/lib/db';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

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
                    src={item.url} 
                    title={item.title} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className={styles.iframe}
                  />
                )}
                {item.type === 'INSTAGRAM' && (
                  <iframe 
                    src={item.url.includes('embed') ? item.url : `${item.url}/embed`} 
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
