import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { cookies } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has("admin_token");

  if (!isAuthenticated) {
    return (
      <html lang="en">
        <body style={{ margin: 0, padding: 0, backgroundColor: '#000', color: '#fff' }}>
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0a0a0a', color: '#fff' }}>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Sidebar */}
          <AdminSidebar role="ADMIN" />
          
          {/* Main Content */}
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
