'use client';

import { useState } from "react";
import { toggleWishlist } from "@/app/actions/customer";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RemoveFromWishlistButton({ userId, productId }: { userId: string, productId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    setLoading(true);
    await toggleWishlist(userId, productId);
    setLoading(false);
    router.refresh();
  };

  return (
    <button 
      onClick={handleRemove}
      disabled={loading}
      style={{ 
        width: '100%', 
        padding: '0.75rem', 
        backgroundColor: '#222', 
        color: '#ff4444', 
        border: 'none', 
        borderRadius: '4px', 
        cursor: loading ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        opacity: loading ? 0.5 : 1
      }}
    >
      <Trash2 size={16} />
      {loading ? "Removing..." : "Remove"}
    </button>
  );
}
