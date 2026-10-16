import db from '@/lib/db';
import { createAdminUser, deleteUser, updateUserRole } from '@/app/actions/adminUsers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Shield, ShieldAlert, UserCheck, ShoppingBag, Megaphone, Trash2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  const userEmail = (session?.user?.email || '').toLowerCase().trim();
  const userRole = ((session?.user as any)?.role || '').toUpperCase();

  const isSuperAdmin = userEmail === 'admin@shiv.com' || userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';

  // If not Super Admin, show strict access restriction notice
  if (!isSuperAdmin) {
    return (
      <div style={{ padding: '3rem 1.5rem', maxWidth: '650px', margin: '4rem auto', textAlign: 'center', backgroundColor: '#111', borderRadius: '1rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
        <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', marginBottom: '1.25rem' }}>
          <ShieldAlert size={42} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
          Super Admin Access Required
        </h2>
        <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          All administrative roles and staff permissions are assigned exclusively by the Super Admin (<strong>admin@shiv.com</strong>).
        </p>
        <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: '#1c1917', border: '1px solid #292524', borderRadius: '0.5rem', color: '#f59e0b', fontSize: '0.85rem' }}>
          Current Account: {userEmail || 'Unauthenticated'} ({userRole || 'No Role'})
        </div>
      </div>
    );
  }

  // Fetch all staff users
  const staff = await db.user.findMany({
    where: {
      role: { in: ['SUPER_ADMIN', 'ADMIN', 'SHOP_OWNER', 'MARKETER', 'PRODUCT_MANAGER'] }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '9999px', color: '#38bdf8', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          <Shield size={14} /> Super Admin Control Center
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Staff Roles &amp; Permissions
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          All administrative roles are assigned exclusively by <strong>admin@shiv.com</strong>. Manage access for Super Admins, Shop Owners, and Marketers.
        </p>
      </div>

      {/* Role Breakdown Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{ background: '#111827', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '0.85rem', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem', color: '#38bdf8' }}>
            <UserCheck size={20} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>Super Admin</h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
            Master access across the entire platform. Can assign roles, manage staff, physical products, software, services, blogs, reels, and finances.
          </p>
        </div>

        <div style={{ background: '#111827', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '0.85rem', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem', color: '#34d399' }}>
            <ShoppingBag size={20} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>Shop Owner</h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
            Manages physical products (clothes, shoes, decor, paintings), digital templates, inventory, orders, customer shipments, and delivery.
          </p>
        </div>

        <div style={{ background: '#111827', border: '1px solid rgba(236, 72, 153, 0.2)', borderRadius: '0.85rem', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem', color: '#f472b6' }}>
            <Megaphone size={20} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>Marketer</h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
            Manages content and engagement: writes and publishes blogs, uploads showcase reels &amp; photos, oversees customer reviews, and creates coupons.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
        {/* Create User Form */}
        <div style={{ backgroundColor: '#111827', padding: '1.75rem', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Assign New Staff Role</h2>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
            Enter credentials and designate access role.
          </p>
          
          <form action={createAdminUser} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div>
              <label htmlFor="name" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Staff Name</label>
              <input type="text" id="name" name="name" required placeholder="e.g. Rahul Sharma" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', borderRadius: '0.5rem', fontSize: '0.9rem' }} />
            </div>

            <div>
              <label htmlFor="email" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Email Address</label>
              <input type="email" id="email" name="email" required placeholder="staff@shiv.com" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', borderRadius: '0.5rem', fontSize: '0.9rem' }} />
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Password</label>
              <input type="password" id="password" name="password" required placeholder="••••••••" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', borderRadius: '0.5rem', fontSize: '0.9rem' }} />
            </div>

            <div>
              <label htmlFor="role" style={{ display: 'block', color: '#cbd5e1', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Designated Role</label>
              <select id="role" name="role" required style={{ width: '100%', padding: '0.75rem', backgroundColor: '#090d16', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', borderRadius: '0.5rem', fontSize: '0.9rem' }}>
                <option value="SHOP_OWNER">Shop Owner (Products, Orders, Deliveries)</option>
                <option value="MARKETER">Marketer (Blogs, Reels + Photos, Coupons, Reviews)</option>
                <option value="SUPER_ADMIN">Super Admin (Full Unrestricted Access)</option>
              </select>
            </div>

            <button type="submit" style={{ padding: '0.85rem', background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.92rem', marginTop: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)' }}>
              Create Staff &amp; Assign Role
            </button>
          </form>
        </div>

        {/* Staff Members List */}
        <div style={{ backgroundColor: '#111827', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: 0 }}>Active Administrative Staff</h3>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{staff.length} staff members</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: '#0c101b' }}>
                <th style={{ padding: '0.9rem 1.25rem', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Member</th>
                <th style={{ padding: '0.9rem 1.25rem', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Email</th>
                <th style={{ padding: '0.9rem 1.25rem', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Current Role</th>
                <th style={{ padding: '0.9rem 1.25rem', fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((user) => {
                const isRoot = user.email.toLowerCase() === 'admin@shiv.com';
                const roleUpper = user.role.toUpperCase();

                let badgeBg = 'rgba(56, 189, 248, 0.12)';
                let badgeColor = '#38bdf8';
                let roleLabel = 'Super Admin';

                if (roleUpper === 'SHOP_OWNER' || roleUpper === 'PRODUCT_MANAGER') {
                  badgeBg = 'rgba(16, 185, 129, 0.12)';
                  badgeColor = '#34d399';
                  roleLabel = 'Shop Owner';
                } else if (roleUpper === 'MARKETER') {
                  badgeBg = 'rgba(236, 72, 153, 0.12)';
                  badgeColor = '#f472b6';
                  roleLabel = 'Marketer';
                }

                return (
                  <tr key={user.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.92rem' }}>{user.name}</div>
                      {isRoot && <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>Master Super Admin</span>}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: '#cbd5e1', fontSize: '0.88rem' }}>{user.email}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ 
                        display: 'inline-block',
                        padding: '0.3rem 0.65rem', 
                        backgroundColor: badgeBg,
                        color: badgeColor,
                        borderRadius: '0.35rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}>
                        {roleLabel}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      {!isRoot ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                          {/* Role Change Form */}
                          <form action={async (formData: FormData) => {
                            'use server';
                            const newRole = formData.get('newRole') as string;
                            if (newRole) await updateUserRole(user.id, newRole);
                          }}>
                            <select 
                              name="newRole" 
                              defaultValue={roleUpper === 'PRODUCT_MANAGER' ? 'SHOP_OWNER' : roleUpper}
                              onChange={(e) => e.target.form?.requestSubmit()}
                              style={{ 
                                padding: '0.35rem 0.65rem', 
                                backgroundColor: '#090d16', 
                                border: '1px solid rgba(255, 255, 255, 0.15)', 
                                color: '#cbd5e1', 
                                borderRadius: '0.35rem', 
                                fontSize: '0.78rem',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="SHOP_OWNER">Shop Owner</option>
                              <option value="MARKETER">Marketer</option>
                              <option value="SUPER_ADMIN">Super Admin</option>
                            </select>
                          </form>

                          {/* Delete Form */}
                          <form action={async () => {
                            'use server';
                            await deleteUser(user.id);
                          }}>
                            <button 
                              type="submit"
                              title="Remove staff member"
                              style={{ 
                                padding: '0.45rem 0.65rem', 
                                backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                                color: '#ef4444', 
                                border: '1px solid rgba(239, 68, 68, 0.25)', 
                                borderRadius: '0.35rem',
                                fontSize: '0.78rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </form>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic' }}>Protected</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
