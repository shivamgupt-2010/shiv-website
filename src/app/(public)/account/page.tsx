import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', letterSpacing: '0.05em' }}>Profile Information</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
        <div>
          <label style={{ display: 'block', color: '#888', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Name</label>
          <div style={{ padding: '1rem', backgroundColor: '#111', borderRadius: '4px', border: '1px solid #333' }}>
            {session?.user?.name}
          </div>
        </div>
        
        <div>
          <label style={{ display: 'block', color: '#888', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Email</label>
          <div style={{ padding: '1rem', backgroundColor: '#111', borderRadius: '4px', border: '1px solid #333' }}>
            {session?.user?.email}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', color: '#888', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Role</label>
          <div style={{ padding: '1rem', backgroundColor: '#111', borderRadius: '4px', border: '1px solid #333' }}>
            {(session?.user as any)?.role}
          </div>
        </div>
      </div>
    </div>
  );
}
