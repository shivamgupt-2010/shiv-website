import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  const hasToken = cookieStore.has("admin_token");

  // Determine user role and email
  const userRole = ((session?.user as any)?.role || cookieStore.get("admin_role")?.value || "").toUpperCase();
  const userEmail = (session?.user?.email || cookieStore.get("admin_email")?.value || "").toLowerCase();

  const isSuperAdmin = userEmail === 'admin@shiv.com' || userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';
  const isShopOwner = isSuperAdmin || userRole === 'SHOP_OWNER' || userRole === 'PRODUCT_MANAGER';
  const isMarketer = isSuperAdmin || userRole === 'MARKETER';

  // Allowed admin roles: Super Admin, Shop Owner, Marketer
  const hasAdminAccess = hasToken || isSuperAdmin || isShopOwner || isMarketer;

  if (!hasAdminAccess) {
    return (
      <html lang="en">
        <body style={{ margin: 0, padding: 0, backgroundColor: '#000', color: '#fff' }}>
          {children}
        </body>
      </html>
    );
  }

  const effectiveRole = isSuperAdmin ? 'SUPER_ADMIN' : (userRole || 'SHOP_OWNER');

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0a0a0a', color: '#fff' }}>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <AdminSidebar role={effectiveRole} userEmail={userEmail} />
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <AdminHeader />
            <main style={{ flex: 1, padding: '2rem', backgroundColor: '#050505', overflowY: 'auto' }}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
