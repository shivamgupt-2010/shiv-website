import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Package, Heart, LogOut } from "lucide-react";
import styles from "./layout.module.css";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className={styles.container}>
      <aside className={styles.aside}>
        <div className={styles.userInfo}>
          <h2 className={styles.title}>My Account</h2>
          <p className={styles.email}>{session.user?.email}</p>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/account" className={styles.navLink}>
            <User size={18} />
            Profile
          </Link>
          <Link href="/account/orders" className={styles.navLink}>
            <Package size={18} />
            Orders
          </Link>
          <Link href="/account/wishlist" className={styles.navLink}>
            <Heart size={18} />
            Wishlist
          </Link>
          <Link href="/api/auth/signout" className={styles.logoutLink}>
            <LogOut size={18} />
            Logout
          </Link>
        </nav>
      </aside>
      
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
