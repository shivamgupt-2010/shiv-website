"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Tags, 
  CreditCard, 
  Truck, 
  Users, 
  Briefcase, 
  Box,
  Code,
  FolderKanban,
  Star,
  Settings
} from "lucide-react";

export default function AdminSidebar({ role = "ADMIN" }: { role?: string }) {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Overview", icon: <LayoutDashboard size={18} /> },
    { href: "/admin/orders", label: "Orders", icon: <ShoppingCart size={18} /> },
    { href: "/admin/products", label: "Products", icon: <Package size={18} /> },
    { href: "/admin/coupons", label: "Coupons", icon: <Tags size={18} /> },
    { href: "/admin/payments", label: "Payments", icon: <CreditCard size={18} /> },
    { href: "/admin/delivery", label: "Delivery", icon: <Truck size={18} /> },
    { href: "/admin/customers", label: "Customers", icon: <Users size={18} /> },
  ].filter(l => role === "ADMIN" || (role === "PRODUCT_MANAGER" && (l.href === "/admin" || l.href === "/admin/products")));

  const businessLinks = [
    { href: "/admin/business-leads", label: "Business Leads", icon: <Briefcase size={18} /> },
    { href: "/admin/packages", label: "Packages", icon: <Box size={18} /> },
    { href: "/admin/software", label: "Software", icon: <Code size={18} /> },
    { href: "/admin/projects", label: "Projects", icon: <FolderKanban size={18} /> },
    { href: "/admin/reviews", label: "Reviews", icon: <Star size={18} /> },
    { href: "/admin/users", label: "Staff & Managers", icon: <Users size={18} /> },
  ].filter(l => role === "ADMIN");

  const navItemStyle = (active: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    color: active ? '#fff' : '#888',
    backgroundColor: active ? '#222' : 'transparent',
    textDecoration: 'none',
    transition: 'all 0.2s',
  });

  return (
    <aside style={{ width: '250px', backgroundColor: '#111', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
      <div style={{ padding: '2rem 1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.1em', color: '#fff' }}>SHIV ADMIN</h2>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <div>
          <h3 style={{ fontSize: '0.75rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', paddingLeft: '1rem' }}>Commerce</h3>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} style={navItemStyle(isActive)}>
                  {link.icon}
                  <span style={{ fontSize: '0.875rem', fontWeight: isActive ? 500 : 400 }}>{link.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {businessLinks.length > 0 && (
          <div>
            <h3 style={{ fontSize: '0.75rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', paddingLeft: '1rem' }}>Business & Content</h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {businessLinks.map((link) => {
                const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin');
                return (
                  <Link key={link.href} href={link.href} style={navItemStyle(isActive)}>
                    {link.icon}
                    <span style={{ fontSize: '0.875rem', fontWeight: isActive ? 500 : 400 }}>{link.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>

      <div style={{ padding: '1rem' }}>
        <Link href="/admin/settings" style={navItemStyle(pathname === '/admin/settings')}>
          <Settings size={18} />
          <span style={{ fontSize: '0.875rem', fontWeight: pathname === '/admin/settings' ? 500 : 400 }}>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
