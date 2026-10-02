import db from '@/lib/db';
import { createProject, toggleProjectFeatured, deleteProject } from '@/app/actions/adminProjects';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const projects = await db.project.findMany();

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Projects (Portfolio)</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Create Project Form */}
        <div style={{ backgroundColor: '#111', padding: '1.5rem', borderRadius: '0.5rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Add Project</h2>
          
          <form action={createProject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="name" style={{ color: '#888', fontSize: '0.875rem' }}>Project Name</label>
              <input type="text" id="name" name="name" required style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="client" style={{ color: '#888', fontSize: '0.875rem' }}>Client</label>
              <input type="text" id="client" name="client" style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="category" style={{ color: '#888', fontSize: '0.875rem' }}>Category</label>
              <input type="text" id="category" name="category" placeholder="e.g. Web Development" required style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="description" style={{ color: '#888', fontSize: '0.875rem' }}>Description</label>
              <textarea id="description" name="description" required rows={3} style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="liveUrl" style={{ color: '#888', fontSize: '0.875rem' }}>Live URL (Optional)</label>
              <input type="text" id="liveUrl" name="liveUrl" style={{ padding: '0.75rem', backgroundColor: '#222', border: '1px solid #333', color: '#fff', borderRadius: '0.25rem' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" id="featured" name="featured" style={{ width: '1.2rem', height: '1.2rem' }} />
              <label htmlFor="featured" style={{ color: '#fff' }}>Featured on Homepage</label>
            </div>

            <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '0.25rem', fontWeight: 'bold', marginTop: '1rem', cursor: 'pointer' }}>
              Add Project
            </button>
          </form>
        </div>

        {/* Projects List */}
        <div style={{ backgroundColor: '#111', borderRadius: '0.5rem', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333', backgroundColor: '#1a1a1a' }}>
                <th style={{ padding: '1rem' }}>Project</th>
                <th style={{ padding: '1rem' }}>Category</th>
                <th style={{ padding: '1rem' }}>Featured</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 'bold' }}>{project.name}</div>
                    <div style={{ fontSize: '0.875rem', color: '#888' }}>{project.client || '-'}</div>
                  </td>
                  <td style={{ padding: '1rem', color: '#888' }}>{project.category}</td>
                  <td style={{ padding: '1rem' }}>
                    <form action={async () => {
                      'use server';
                      await toggleProjectFeatured(project.id, !project.featured);
                    }}>
                      <button 
                        type="submit"
                        style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '0.25rem', 
                          fontSize: '0.875rem',
                          backgroundColor: project.featured ? 'rgba(0, 100, 255, 0.1)' : 'transparent',
                          color: project.featured ? '#00aaff' : '#888',
                          border: project.featured ? 'none' : '1px solid #333',
                          cursor: 'pointer'
                        }}
                      >
                        {project.featured ? 'Featured' : 'Standard'}
                      </button>
                    </form>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <form action={async () => {
                      'use server';
                      await deleteProject(project.id);
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
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
