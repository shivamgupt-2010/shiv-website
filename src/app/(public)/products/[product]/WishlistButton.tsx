'use client';

import { useState } from "react";
import { toggleWishlist } from "@/app/actions/customer";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WishlistButton({ userId, productId, isWishlisted }: { userId: string, productId: string, isWishlisted?: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setLoading(true);
    await toggleWishlist(userId, productId);
    setLoading(false);
    router.refresh();
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={loading}
      style={{ 
        padding: '0.75rem', 
        backgroundColor: 'transparent', 
        color: isWishlisted ? '#ff4444' : '#fff', 
        border: '1px solid #333', 
        borderRadius: '4px', 
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: loading ? 0.5 : 1
      }}
      title="Toggle Wishlist"
    >
      <Heart size={20} fill={isWishlisted ? '#ff4444' : 'none'} />
    </button>
  );
}
