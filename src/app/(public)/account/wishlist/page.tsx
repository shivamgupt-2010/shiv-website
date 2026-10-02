import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import RemoveFromWishlistButton from "./RemoveFromWishlistButton";

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const wishlistItems = await db.wishlistItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          images: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', letterSpacing: '0.05em' }}>My Wishlist</h1>
      
      {wishlistItems.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#111', borderRadius: '8px', border: '1px solid #333' }}>
          <p style={{ color: '#888', marginBottom: '1rem' }}>Your wishlist is empty.</p>
          <Link href="/products" style={{ color: '#fff', textDecoration: 'underline' }}>Discover Products</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {wishlistItems.map((item) => (
            <div key={item.id} style={{ backgroundColor: '#111', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden', position: 'relative' }}>
              <Link href={`/products/${item.product.slug}`} style={{ display: 'block' }}>
                <div style={{ position: 'relative', width: '100%', height: '250px', backgroundColor: '#000' }}>
                  {item.product.images[0] ? (
                    <Image 
                      src={item.product.images[0].url} 
                      alt={item.product.name} 
                      fill 
                      style={{ objectFit: 'cover' }} 
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>No Image</div>
                  )}
                </div>
              </Link>
              
              <div style={{ padding: '1rem' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                  <Link href={`/products/${item.product.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>
                    {item.product.name}
                  </Link>
                </h3>
                <div style={{ color: '#888', marginBottom: '1rem' }}>₹{item.product.price.toLocaleString()}</div>
                
                <RemoveFromWishlistButton userId={userId} productId={item.product.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
