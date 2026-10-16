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
  Settings,
  BookOpen,
  Film,
  ShieldCheck,
  ShoppingBag,
  Megaphone
} from "lucide-react";

interface AdminSidebarProps {
  role?: string;
  userEmail?: string;
}

export default function AdminSidebar({ role = "SUPER_ADMIN", userEmail = "" }: AdminSidebarProps) {
  const pathname = usePathname();
  const roleUpper = (role || "").toUpperCase();
  
  const isSuperAdmin = userEmail.toLowerCase() === 'admin@shiv.com' || roleUpper === 'SUPER_ADMIN' || roleUpper === 'ADMIN';
  const isShopOwner = isSuperAdmin || roleUpper === 'SHOP_OWNER' || roleUpper === 'PRODUCT_MANAGER';
  const isMarketer = isSuperAdmin || roleUpper === 'MARKETER';

  // 1. Commerce links
  const commerceLinks = [
    { href: "/admin", label: "Overview", icon: <LayoutDashboard size={18} />, allowed: true },
    { href: "/admin/orders", label: "Orders", icon: <ShoppingCart size={18} />, allowed: isShopOwner },
    { href: "/admin/products", label: "Products & Stock", icon: <Package size={18} />, allowed: isShopOwner },
    { href: "/admin/software", label: "Software Products", icon: <Code size={18} />, allowed: isShopOwner },
    { href: "/admin/delivery", label: "Delivery & Shipping", icon: <Truck size={18} />, allowed: isShopOwner },
    { href: "/admin/customers", label: "Customers", icon: <Users size={18} />, allowed: isShopOwner },
    { href: "/admin/payments", label: "Payments", icon: <CreditCard size={18} />, allowed: isSuperAdmin },
  ].filter(l => l.allowed);

  // 2. Content & Growth links
  const contentLinks = [
    { href: "/admin/blogs", label: "Blogs CMS", icon: <BookOpen size={18} />, allowed: isMarketer },
    { href: "/admin/showcase", label: "Showcase (Reels/Photos)", icon: <Film size={18} />, allowed: isMarketer },
    { href: "/admin/reviews", label: "Customer Reviews", icon: <Star size={18} />, allowed: isMarketer },
    { href: "/admin/coupons", label: "Coupons & Offers", icon: <Tags size={18} />, allowed: isMarketer },
    { href: "/admin/business-leads", label: "Business Leads", icon: <Briefcase size={18} />, allowed: isMarketer || isSuperAdmin },
    { href: "/admin/business-packages", label: "Service Packages", icon: <Box size={18} />, allowed: isSuperAdmin },
  ].filter(l => l.allowed);

  // 3. Administration (Super Admin only)
  const systemLinks = [
    { href: "/admin/users", label: "Staff & Roles (Super Admin)", icon: <ShieldCheck size={18} />, allowed: isSuperAdmin },
  ].filter(l => l.allowed);

  const navItemStyle = (active: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    color: active ? '#fff' : '#94a3b8',
    backgroundColor: active ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
    border: active ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
    fontSize: '0.85rem',
    fontWeight: active ? 600 : 400,
  });

  let roleBadgeLabel = "Super Admin";
  let roleBadgeColor = "#38bdf8";
  if (roleUpper === "SHOP_OWNER" && !isSuperAdmin) {
    roleBadgeLabel = "Shop Owner";
    roleBadgeColor = "#34d399";
  } else if (roleUpper === "MARKETER" && !isSuperAdmin) {
    roleBadgeLabel = "Marketer";
    roleBadgeColor = "#f472b6";
  }

  return (
    <aside style={{ width: '260px', backgroundColor: '#090d16', borderRight: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, zIndex: 50 }}>
      {/* Brand Header */}
      <div style={{ padding: '1.75rem 1.25rem 1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: '8px', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: '1.1rem' }}>
            S
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '0.08em', color: '#fff' }}>SHIV ADMIN</div>
            <div style={{ display: 'inline-block', fontSize: '0.7rem', fontWeight: 700, color: roleBadgeColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {roleBadgeLabel}
            </div>
          </div>
        </div>
      </div>
      
      {/* Scrollable Navigation */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Commerce Group */}
        <div>
          <h3 style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.65rem', paddingLeft: '0.75rem', fontWeight: 700 }}>
            Commerce &amp; Inventory
          </h3>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            {commerceLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} style={navItemStyle(isActive)}>
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Content & Marketing Group */}
        {contentLinks.length > 0 && (
          <div>
            <h3 style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.65rem', paddingLeft: '0.75rem', fontWeight: 700 }}>
              Content &amp; Marketing
            </h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {contentLinks.map((link) => {
                const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin');
                return (
                  <Link key={link.href} href={link.href} style={navItemStyle(isActive)}>
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Super Admin Control */}
        {systemLinks.length > 0 && (
          <div>
            <h3 style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.65rem', paddingLeft: '0.75rem', fontWeight: 700 }}>
              Administration
            </h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {systemLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href);
                return (
                  <Link key={link.href} href={link.href} style={navItemStyle(isActive)}>
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div style={{ padding: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <Link href="/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.78rem', textDecoration: 'none', padding: '0.5rem 0.75rem' }}>
          <span>&larr; View Live Multipurpose Store</span>
        </Link>
      </div>
    </aside>
  );
}
