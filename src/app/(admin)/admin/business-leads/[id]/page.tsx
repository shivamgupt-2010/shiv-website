import db from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { updateLeadStatus, updateLeadNotes, archiveLead } from '@/app/actions/adminLeads';

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await db.businessLead.findUnique({
    where: { id },
  });

  if (!lead) {
    notFound();
  }

  const LEAD_STATUSES = [
    'NEW', 'CONTACTED', 'DISCUSSION', 'PROPOSAL', 'ACCEPTED', 'IN_DEVELOPMENT', 'COMPLETED', 'LOST'
  ];

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/business-leads" style={{ color: '#888', textDecoration: 'none' }}>&larr; Back to Leads</Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Lead: {lead.name}</h1>
        {lead.archived && (
          <span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.875rem', backgroundColor: '#333' }}>Archived</span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Project Message</h2>
            <div style={{ color: '#888', marginBottom: '1rem' }}>
              <strong>Type:</strong> {lead.projectType}
            </div>
            <div style={{ backgroundColor: '#222', padding: '1rem', borderRadius: '0.25rem', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {lead.message}
            </div>
          </div>

          <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Internal Notes</h2>
            
            <form action={async (formData: FormData) => {
              'use server';
              const notes = formData.get('notes') as string;
              await updateLeadNotes(lead.id, notes);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <textarea 
                name="notes" 
                defaultValue={lead.notes || ''} 
                placeholder="Add private notes about this lead here..."
                rows={6}
                style={{ padding: '1rem', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '0.25rem', resize: 'vertical' }}
              />
              <div style={{ alignSelf: 'flex-end' }}>
                <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
                  Save Notes
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Status</h2>
            
            <form action={async (formData: FormData) => {
              'use server';
              const status = formData.get('status') as string;
              if (status) await updateLeadStatus(lead.id, status);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <select 
                name="status" 
                defaultValue={lead.status}
                style={{ padding: '0.75rem', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '0.25rem' }}
              >
                {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#fff', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
                Update Status
              </button>
            </form>

            <form action={async () => {
              'use server';
              await archiveLead(lead.id, !lead.archived);
            }} style={{ marginTop: '1.5rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
              <button type="submit" style={{ width: '100%', padding: '0.5rem', backgroundColor: 'transparent', color: lead.archived ? '#888' : '#ff4a4a', border: `1px solid ${lead.archived ? '#333' : '#ff4a4a'}`, borderRadius: '0.25rem', cursor: 'pointer' }}>
                {lead.archived ? 'Unarchive Lead' : 'Archive Lead'}
              </button>
            </form>
          </div>

          <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Contact Info</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#bbb' }}>
              <div><strong>Name:</strong> {lead.name}</div>
              <div><strong>Company:</strong> {lead.company || '-'}</div>
              <div><strong>Email:</strong> <a href={`mailto:${lead.email}`} style={{ color: '#00aaff' }}>{lead.email}</a></div>
              <div><strong>Phone:</strong> {lead.phone || '-'}</div>
              <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
                Received on: {new Date(lead.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
