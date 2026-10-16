'use client';

import React, { useState, useTransition } from 'react';
import {
  Code,
  Sparkles,
  Search,
  ExternalLink,
  Edit2,
  Check,
  X,
  RotateCcw,
  Eye,
  Tag,
  Laptop,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
} from 'lucide-react';
import { MarketplaceTemplate, TEMPLATE_CATEGORIES } from '@/lib/templatesMarketplaceData';
import { adminUpdateTemplate, adminResetTemplate, adminToggleTemplateActive } from '@/app/actions/adminTemplates';

interface AdminSoftwareClientProps {
  initialTemplates: MarketplaceTemplate[];
  initialSoftware: any[];
}

export default function AdminSoftwareClient({ initialTemplates, initialSoftware }: AdminSoftwareClientProps) {
  const [activeTab, setActiveTab] = useState<'templates' | 'apps'>('templates');
  const [templates, setTemplates] = useState<MarketplaceTemplate[]>(initialTemplates);
  const [software, setSoftware] = useState<any[]>(initialSoftware);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingTemplate, setEditingTemplate] = useState<MarketplaceTemplate | null>(null);
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Filter templates
  const filteredTemplates = templates.filter((t) => {
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const inName = t.name.toLowerCase().includes(q);
      const inSub = t.subcategory.toLowerCase().includes(q);
      const inId = t.id.toLowerCase().includes(q);
      if (!inName && !inSub && !inId) return false;
    }
    return true;
  });

  const showNotification = (text: string, type: 'success' | 'error') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleToggleActive = (template: MarketplaceTemplate) => {
    const currentActive = template.active ?? true;
    startTransition(async () => {
      const res = await adminToggleTemplateActive(template.id, currentActive);
      if (res.success) {
        setTemplates((prev) =>
          prev.map((t) => (t.id === template.id ? { ...t, active: res.newStatus } : t))
        );
        showNotification(`Updated status for "${template.name}"`, 'success');
      } else {
        showNotification('Failed to update status', 'error');
      }
    });
  };

  const handleResetToDefault = (template: MarketplaceTemplate) => {
    if (!confirm(`Reset "${template.name}" to master catalogue defaults?`)) return;
    startTransition(async () => {
      const res = await adminResetTemplate(template.id);
      if (res.success) {
        showNotification(`Reset "${template.name}" to defaults`, 'success');
        window.location.reload();
      } else {
        showNotification('Failed to reset template', 'error');
      }
    });
  };

  const handleSaveEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTemplate) return;

    const formData = new FormData(e.currentTarget);
    const updates = {
      basePrice: Number(formData.get('basePrice')),
      demoUrl: (formData.get('demoUrl') as string).trim() || undefined,
      screenshotUrl: (formData.get('screenshotUrl') as string).trim() || undefined,
      description: (formData.get('description') as string).trim(),
      badge: (formData.get('badge') as string).trim() || undefined,
    };

    startTransition(async () => {
      const res = await adminUpdateTemplate(editingTemplate.id, updates);
      if (res.success) {
        setTemplates((prev) =>
          prev.map((t) => (t.id === editingTemplate.id ? { ...t, ...updates } : t))
        );
        setEditingTemplate(null);
        showNotification(`Saved changes for "${editingTemplate.name}"`, 'success');
      } else {
        showNotification('Failed to save changes', 'error');
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#fff' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code size={26} color="#38bdf8" /> Software &amp; Templates Manager
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#888', marginTop: '0.35rem' }}>
            Manage live demo links, screenshot previews, pricing, and active statuses across all ~95 digital marketplace templates.
          </p>
        </div>

        {/* Tab switchers */}
        <div style={{ display: 'flex', background: '#111', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid #222' }}>
          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '0.35rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: activeTab === 'templates' ? '#2563eb' : 'transparent',
              color: activeTab === 'templates' ? '#fff' : '#888',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Marketplace Templates ({templates.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('apps')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '0.35rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: activeTab === 'apps' ? '#2563eb' : 'transparent',
              color: activeTab === 'apps' ? '#fff' : '#888',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Standalone Apps ({software.length})
          </button>
        </div>
      </div>

      {/* Floating Notification */}
      {statusMessage && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${statusMessage.type === 'success' ? '#10b981' : '#ef4444'}`,
            color: statusMessage.type === 'success' ? '#34d399' : '#f87171',
          }}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          {statusMessage.text}
        </div>
      )}

      {/* TEMPLATES TAB */}
      {activeTab === 'templates' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Filter Bar */}
          <div style={{ background: '#111', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            {/* Category Pills */}
            <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', maxWidth: '100%' }}>
              {TEMPLATE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: '0.4rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    background: selectedCategory === cat.id ? '#2563eb' : '#1e1e1e',
                    color: selectedCategory === cat.id ? '#fff' : '#888',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '260px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search template name, ID, subcategory..."
                style={{
                  width: '100%',
                  background: '#0d0d0d',
                  border: '1px solid #333',
                  borderRadius: '0.4rem',
                  padding: '0.5rem 0.75rem 0.5rem 2.2rem',
                  color: '#fff',
                  fontSize: '0.78rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Templates Table */}
          <div style={{ background: '#111', borderRadius: '0.75rem', border: '1px solid #222', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#161920', borderBottom: '1px solid #282828', color: '#888', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Template &amp; Subcategory</th>
                  <th style={{ padding: '0.85rem' }}>Base Price</th>
                  <th style={{ padding: '0.85rem' }}>Live Demo URL</th>
                  <th style={{ padding: '0.85rem' }}>Screenshot URL</th>
                  <th style={{ padding: '0.85rem', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTemplates.map((template) => {
                  const isActive = template.active !== false;
                  return (
                    <tr
                      key={template.id}
                      style={{
                        borderBottom: '1px solid #1a1a1a',
                        opacity: isActive ? 1 : 0.45,
                      }}
                    >
                      {/* Name & Subcategory */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {template.name}
                          {template.badge && (
                            <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem', borderRadius: '3px', background: 'rgba(245, 158, 11, 0.2)', color: '#fcd34d', fontWeight: 800 }}>
                              {template.badge}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#777', marginTop: '0.2rem' }}>
                          {template.subcategory} &bull; <span style={{ fontFamily: 'monospace' }}>{template.id}</span>
                        </div>
                      </td>

                      {/* Base Price */}
                      <td style={{ padding: '0.85rem', fontFamily: 'monospace', fontWeight: 700, color: '#34d399' }}>
                        ₹{template.basePrice.toLocaleString('en-IN')}
                      </td>

                      {/* Live Demo URL */}
                      <td style={{ padding: '0.85rem', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {template.demoUrl ? (
                          <a
                            href={template.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            <ExternalLink size={13} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{template.demoUrl}</span>
                          </a>
                        ) : (
                          <span style={{ color: '#555', fontStyle: 'italic' }}>None set</span>
                        )}
                      </td>

                      {/* Screenshot URL */}
                      <td style={{ padding: '0.85rem', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {template.screenshotUrl ? (
                          <a
                            href={template.screenshotUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#2dd4bf', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            <Eye size={13} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{template.screenshotUrl}</span>
                          </a>
                        ) : (
                          <span style={{ color: '#555', fontStyle: 'italic' }}>None set</span>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td style={{ padding: '0.85rem', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(template)}
                          style={{
                            padding: '0.2rem 0.55rem',
                            borderRadius: '4px',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: isActive ? '#34d399' : '#f87171',
                            border: `1px solid ${isActive ? '#10b981' : '#ef4444'}`,
                            cursor: 'pointer',
                          }}
                        >
                          {isActive ? 'ACTIVE' : 'DISABLED'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                          <button
                            type="button"
                            onClick={() => setEditingTemplate(template)}
                            title="Edit Details, Demos &amp; Pricing"
                            style={{ padding: '0.4rem', borderRadius: '4px', background: '#1e1e1e', border: '1px solid #333', color: '#fff', cursor: 'pointer' }}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleResetToDefault(template)}
                            title="Reset to Master Default"
                            style={{ padding: '0.4rem', borderRadius: '4px', background: '#1e1e1e', border: '1px solid #333', color: '#888', cursor: 'pointer' }}
                          >
                            <RotateCcw size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingTemplate && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '520px', background: '#111', border: '1px solid #333', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#fff' }}>Edit Template Details</h3>
                <p style={{ fontSize: '0.75rem', color: '#888', margin: 0 }}>{editingTemplate.name} ({editingTemplate.id})</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingTemplate(null)}
                style={{ background: '#222', border: 'none', color: '#888', padding: '0.35rem', borderRadius: '4px', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.8rem' }}>
              <div>
                <label style={{ display: 'block', color: '#aaa', fontWeight: 600, marginBottom: '0.35rem' }}>Base Price (INR ₹)</label>
                <input
                  type="number"
                  name="basePrice"
                  defaultValue={editingTemplate.basePrice}
                  required
                  style={{ width: '100%', background: '#0d0d0d', border: '1px solid #333', borderRadius: '0.4rem', padding: '0.5rem', color: '#fff', fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#aaa', fontWeight: 600, marginBottom: '0.35rem' }}>Live Demo URL</label>
                <input
                  type="url"
                  name="demoUrl"
                  placeholder="https://preview.your-domain.com"
                  defaultValue={editingTemplate.demoUrl || ''}
                  style={{ width: '100%', background: '#0d0d0d', border: '1px solid #333', borderRadius: '0.4rem', padding: '0.5rem', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#aaa', fontWeight: 600, marginBottom: '0.35rem' }}>Screenshot / Image Preview URL</label>
                <input
                  type="text"
                  name="screenshotUrl"
                  placeholder="https://... or /images/templates/..."
                  defaultValue={editingTemplate.screenshotUrl || ''}
                  style={{ width: '100%', background: '#0d0d0d', border: '1px solid #333', borderRadius: '0.4rem', padding: '0.5rem', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#aaa', fontWeight: 600, marginBottom: '0.35rem' }}>Badge (Optional)</label>
                <input
                  type="text"
                  name="badge"
                  placeholder="e.g. POPULAR, HOT, BESTSELLER"
                  defaultValue={editingTemplate.badge || ''}
                  style={{ width: '100%', background: '#0d0d0d', border: '1px solid #333', borderRadius: '0.4rem', padding: '0.5rem', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#aaa', fontWeight: 600, marginBottom: '0.35rem' }}>Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingTemplate.description}
                  required
                  style={{ width: '100%', background: '#0d0d0d', border: '1px solid #333', borderRadius: '0.4rem', padding: '0.5rem', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid #222', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  style={{ padding: '0.5rem 1rem', borderRadius: '0.4rem', background: '#222', border: 'none', color: '#ccc', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{ padding: '0.5rem 1rem', borderRadius: '0.4rem', background: '#2563eb', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STANDALONE APPS TAB */}
      {activeTab === 'apps' && (
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '0.75rem', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1rem 0' }}>Database Standalone Software</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: '#161920', borderBottom: '1px solid #282828', color: '#888', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Software Name</th>
                <th style={{ padding: '0.75rem' }}>Version</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {software.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #1c1c1c' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{item.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#777' }}>{item.description}</div>
                  </td>
                  <td style={{ padding: '0.75rem', color: '#888' }}>{item.version || '-'}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: '#222', color: '#ccc', fontSize: '0.72rem' }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                    <a
                      href={`/admin/software/${item.id}`}
                      style={{ padding: '0.35rem 0.75rem', borderRadius: '4px', background: '#222', color: '#fff', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600 }}
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
              {software.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                    No database software records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
