import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Package, Heart, LogOut } from "lucide-react";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem', display: 'flex', gap: '3rem', minHeight: '80vh' }}>
      <aside style={{ width: '250px', flexShrink: 0 }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>My Account</h2>
          <p style={{ color: '#888', fontSize: '0.875rem' }}>{session.user?.email}</p>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/account" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '4px', backgroundColor: '#111', color: '#fff', textDecoration: 'none' }}>
            <User size={18} />
            Profile
          </Link>
          <Link href="/account/orders" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '4px', color: '#888', textDecoration: 'none' }}>
            <Package size={18} />
            Orders
          </Link>
          <Link href="/account/wishlist" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '4px', color: '#888', textDecoration: 'none' }}>
            <Heart size={18} />
            Wishlist
          </Link>
          <Link href="/api/auth/signout" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '4px', color: '#ff4444', textDecoration: 'none', marginTop: '1rem' }}>
            <LogOut size={18} />
            Logout
          </Link>
        </nav>
      </aside>
      
      <main style={{ flexGrow: 1, backgroundColor: '#050505', borderRadius: '8px', padding: '2rem', border: '1px solid #222' }}>
        {children}
      </main>
    </div>
  );
}
