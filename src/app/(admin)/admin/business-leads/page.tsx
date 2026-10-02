import db from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminBusinessLeadsPage() {
  const leads = await db.businessLead.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Business Leads (CRM)</h1>

      <div style={{ backgroundColor: '#111', borderRadius: '0.5rem', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333', backgroundColor: '#1a1a1a' }}>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Contact</th>
              <th style={{ padding: '1rem' }}>Project Type</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} style={{ borderBottom: '1px solid #222', opacity: lead.archived ? 0.5 : 1 }}>
                <td style={{ padding: '1rem' }}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 'bold' }}>{lead.name}</div>
                  <div style={{ fontSize: '0.875rem', color: '#888' }}>
                    {lead.company ? `${lead.company} | ` : ''}{lead.email}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>{lead.projectType}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '0.25rem', 
                    fontSize: '0.875rem',
                    backgroundColor: 
                      lead.status === 'NEW' ? 'rgba(0, 100, 255, 0.1)' : 
                      lead.status === 'COMPLETED' ? 'rgba(0, 255, 0, 0.1)' : 
                      lead.status === 'LOST' ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 165, 0, 0.1)',
                    color: 
                      lead.status === 'NEW' ? '#00aaff' : 
                      lead.status === 'COMPLETED' ? '#00ff00' : 
                      lead.status === 'LOST' ? '#ff4a4a' : '#ffa500'
                  }}>
                    {lead.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <Link 
                    href={`/admin/business-leads/${lead.id}`}
                    style={{ 
                      padding: '0.5rem 1rem', 
                      backgroundColor: '#333', 
                      color: '#fff', 
                      textDecoration: 'none', 
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
