import db from '@/lib/db';
import { createAdminUser, deleteUser } from '@/app/actions/adminUsers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'ADMIN') {
    redirect('/admin');
  }

  const staff = await db.user.findMany({
    where: {
      role: { in: ['ADMIN', 'PRODUCT_MANAGER'] }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Staff & Managers</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Create User Form */}
        <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '0.5rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Add Staff Member</h2>
          
          <form action={createAdminUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="name" style={{ color: '#888', fontSize: '0.875rem' }}>Name</label>
              <input type="text" id="name" name="name" required style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="email" style={{ color: '#888', fontSize: '0.875rem' }}>Email</label>
              <input type="email" id="email" name="email" required style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="password" style={{ color: '#888', fontSize: '0.875rem' }}>Password</label>
              <input type="password" id="password" name="password" required style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="role" style={{ color: '#888', fontSize: '0.875rem' }}>Role</label>
              <select id="role" name="role" style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }}>
                <option value="PRODUCT_MANAGER">Product Manager (Products Only)</option>
                <option value="ADMIN">Super Admin (Full Access)</option>
              </select>
            </div>

            <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '0.25rem', fontWeight: 'bold', marginTop: '1rem', cursor: 'pointer' }}>
              Create User
            </button>
          </form>
        </div>

        {/* Staff List */}
        <div style={{ backgroundColor: '#111', borderRadius: '0.5rem', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333', backgroundColor: '#1a1a1a' }}>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Role</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                  </td>
                  <td style={{ padding: '1rem', color: '#888' }}>{user.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      backgroundColor: user.role === 'ADMIN' ? 'rgba(0, 170, 255, 0.1)' : 'rgba(255, 170, 0, 0.1)',
                      color: user.role === 'ADMIN' ? '#00aaff' : '#ffaa00',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    {user.email !== (session?.user?.email) ? (
                      <form action={async () => {
                        'use server';
                        await deleteUser(user.id);
                      }}>
                        <button 
                          type="submit"
                          style={{ 
                            padding: '0.5rem 1rem', 
                            backgroundColor: 'rgba(255, 0, 0, 0.1)', 
                            color: '#ff4a4a', 
                            border: 'none', 
                            borderRadius: '0.25rem',
                            fontSize: '0.875rem',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </form>
                    ) : (
                      <span style={{ fontSize: '0.875rem', color: '#888' }}>You</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
