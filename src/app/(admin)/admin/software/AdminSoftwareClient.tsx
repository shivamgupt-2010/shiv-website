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
  Download,
  Globe,
} from 'lucide-react';
import { MarketplaceTemplate, TEMPLATE_CATEGORIES } from '@/lib/templatesMarketplaceData';
import { adminUpdateTemplate, adminResetTemplate, adminToggleTemplateActive } from '@/app/actions/adminTemplates';
import { adminSaveSoftwareJSON, deleteSoftwareProduct } from '@/app/actions/adminSoftware';

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
  
  // Modals state
  const [editingTemplate, setEditingTemplate] = useState<MarketplaceTemplate | null>(null);
  const [editingSoftware, setEditingSoftware] = useState<any | null>(null);
  const [isCreatingSoftware, setIsCreatingSoftware] = useState(false);

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

  // Filter software apps
  const filteredSoftware = software.filter((item) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const inName = (item.name || '').toLowerCase().includes(q);
      const inDesc = (item.description || '').toLowerCase().includes(q);
      const inStatus = (item.status || '').toLowerCase().includes(q);
      if (!inName && !inDesc && !inStatus) return false;
    }
    return true;
  });

  const showNotification = (text: string, type: 'success' | 'error') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  /* Template Handlers */
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

  const handleSaveTemplateEdit = (e: React.FormEvent<HTMLFormElement>) => {
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
        showNotification(`Saved changes for "${editingTemplate.name}" in database`, 'success');
      } else {
        showNotification('Failed to save changes', 'error');
      }
    });
  };

  /* Software App Handlers */
  const handleSaveSoftware = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = editingSoftware?.id || null;

    const priceNum = parseFloat(formData.get('price') as string) || 0;
    const priceFormattedInput = (formData.get('priceFormatted') as string).trim();
    const priceFormatted = priceFormattedInput || (priceNum === 0 ? 'Free' : `₹${priceNum.toLocaleString('en-IN')}`);

    const payload = {
      name: (formData.get('name') as string).trim(),
      description: (formData.get('description') as string).trim(),
      price: priceNum,
      priceFormatted,
      version: (formData.get('version') as string).trim() || '1.0.0',
      status: formData.get('status') as string,
      downloadLink: (formData.get('downloadLink') as string).trim() || undefined,
      websiteLink: (formData.get('websiteLink') as string).trim() || undefined,
    };

    startTransition(async () => {
      const res = await adminSaveSoftwareJSON(id, payload);
      if (res.success && res.item) {
        if (id) {
          setSoftware((prev) => prev.map((s) => (s.id === id ? res.item : s)));
          showNotification(`Updated software "${res.item.name}"`, 'success');
        } else {
          setSoftware((prev) => [res.item, ...prev]);
          showNotification(`Added new software "${res.item.name}"`, 'success');
        }
        setEditingSoftware(null);
        setIsCreatingSoftware(false);
      } else {
        showNotification(res.error || 'Failed to save software', 'error');
      }
    });
  };

  const handleDeleteSoftware = (item: any) => {
    if (!confirm(`Are you sure you want to delete software "${item.name}"?`)) return;
    startTransition(async () => {
      await deleteSoftwareProduct(item.id);
      setSoftware((prev) => prev.filter((s) => s.id !== item.id));
      showNotification(`Deleted "${item.name}"`, 'success');
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#fff' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Code size={26} color="#38bdf8" /> Software &amp; Digital Products Manager
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#888', marginTop: '0.35rem' }}>
            Update pricing, descriptions, demo links, versions, and deployment statuses across all digital assets &amp; applications.
          </p>
        </div>

        {/* Tab switchers */}
        <div style={{ display: 'flex', background: '#111', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid #222' }}>
          <button
            type="button"
            onClick={() => { setActiveTab('templates'); setSearchQuery(''); }}
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
            onClick={() => { setActiveTab('apps'); setSearchQuery(''); }}
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
            Standalone Applications ({software.length})
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
                placeholder="Search templates by title, slug, tag..."
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
          <div style={{ background: '#111', borderRadius: '0.75rem', border: '1px solid #222', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem', minWidth: '700px' }}>
              <thead>
                <tr style={{ background: '#161920', borderBottom: '1px solid #282828', color: '#888', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Template &amp; Subcategory</th>
                  <th style={{ padding: '0.85rem' }}>Base Price (INR)</th>
                  <th style={{ padding: '0.85rem' }}>Live Demo URL</th>
                  <th style={{ padding: '0.85rem' }}>Badge</th>
                  <th style={{ padding: '0.85rem', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTemplates.map((template) => {
                  const isActive = template.active !== false;
                  return (
                    <tr key={template.id} style={{ borderBottom: '1px solid #1c1c1c', background: isActive ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 700, color: isActive ? '#fff' : '#777', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {template.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#666', marginTop: '0.2rem' }}>
                          {template.subcategory} • <span style={{ fontFamily: 'monospace' }}>{template.id}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem' }}>
                        <span style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                          ₹{template.basePrice.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem' }}>
                        {template.demoUrl ? (
                          <a
                            href={template.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#60a5fa', textDecoration: 'none', fontSize: '0.75rem' }}
                          >
                            Live Demo <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span style={{ color: '#555', fontSize: '0.72rem' }}>None set</span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem' }}>
                        {template.badge ? (
                          <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', fontWeight: 700 }}>
                            {template.badge}
                          </span>
                        ) : (
                          <span style={{ color: '#555', fontSize: '0.72rem' }}>-</span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(template)}
                          style={{
                            padding: '0.25rem 0.55rem',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer',
                            background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: isActive ? '#34d399' : '#f87171',
                          }}
                        >
                          {isActive ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => setEditingTemplate(template)}
                            style={{ padding: '0.35rem 0.65rem', borderRadius: '4px', background: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            <Edit2 size={13} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleResetToDefault(template)}
                            title="Reset to Master Catalogue default"
                            style={{ padding: '0.35rem 0.5rem', borderRadius: '4px', background: '#222', border: '1px solid #333', color: '#888', cursor: 'pointer' }}
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

      {/* STANDALONE APPS TAB */}
      {activeTab === 'apps' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Action Bar */}
          <div style={{ background: '#111', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ position: 'relative', minWidth: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search standalone apps by name, status..."
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

            <button
              type="button"
              onClick={() => { setEditingSoftware(null); setIsCreatingSoftware(true); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.55rem 1rem',
                borderRadius: '0.4rem',
                background: '#2563eb',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Plus size={16} /> Add Software Application
            </button>
          </div>

          {/* Software Table */}
          <div style={{ background: '#111', borderRadius: '0.75rem', border: '1px solid #222', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem', minWidth: '700px' }}>
              <thead>
                <tr style={{ background: '#161920', borderBottom: '1px solid #282828', color: '#888', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Application Name &amp; Description</th>
                  <th style={{ padding: '0.85rem' }}>Price / Tier</th>
                  <th style={{ padding: '0.85rem' }}>Version</th>
                  <th style={{ padding: '0.85rem' }}>Status</th>
                  <th style={{ padding: '0.85rem' }}>Links</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSoftware.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #1c1c1c' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.9rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.2rem', maxWidth: '340px', lineHeight: 1.4 }}>
                        {item.description}
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem' }}>
                      <span style={{ fontWeight: 800, color: '#34d399', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                        {item.priceFormatted || (item.price === 0 ? 'Free' : `₹${(item.price || 0).toLocaleString('en-IN')}`)}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem', color: '#aaa', fontFamily: 'monospace' }}>
                      v{item.version || '1.0.0'}
                    </td>
                    <td style={{ padding: '0.85rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: item.status === 'AVAILABLE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                        color: item.status === 'AVAILABLE' ? '#34d399' : '#facc15',
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {item.downloadLink && (
                          <a
                            href={item.downloadLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#60a5fa', textDecoration: 'none', fontSize: '0.72rem' }}
                          >
                            <Download size={12} /> App Link
                          </a>
                        )}
                        {item.websiteLink && (
                          <a
                            href={item.websiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#a78bfa', textDecoration: 'none', fontSize: '0.72rem' }}
                          >
                            <Globe size={12} /> Web Link
                          </a>
                        )}
                        {!item.downloadLink && !item.websiteLink && (
                          <span style={{ color: '#555', fontSize: '0.72rem' }}>No links</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => { setEditingSoftware(item); setIsCreatingSoftware(false); }}
                          style={{ padding: '0.35rem 0.65rem', borderRadius: '4px', background: '#1e293b', border: '1px solid #334155', color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSoftware(item)}
                          style={{ padding: '0.35rem 0.5rem', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', cursor: 'pointer' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredSoftware.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: '#666' }}>
                      No software applications found matching filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT TEMPLATE MODAL */}
      {editingTemplate && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '520px', background: '#111', border: '1px solid #333', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}>
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

            <form onSubmit={handleSaveTemplateEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.8rem' }}>
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
                  {isPending ? 'Saving...' : 'Save Template Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT / CREATE SOFTWARE APP MODAL */}
      {(editingSoftware || isCreatingSoftware) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '580px', background: '#111', border: '1px solid #333', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.8)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#fff' }}>
                  {isCreatingSoftware ? 'Add Software Application' : `Edit: ${editingSoftware.name}`}
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#888', margin: 0 }}>
                  Set pricing, versions, descriptions, and distribution links.
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setEditingSoftware(null); setIsCreatingSoftware(false); }}
                style={{ background: '#222', border: 'none', color: '#888', padding: '0.35rem', borderRadius: '4px', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveSoftware} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#aaa', fontWeight: 600, marginBottom: '0.35rem' }}>Software Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingSoftware?.name || ''}
                    placeholder="e.g. SHIV Launcher"
                    required
                    style={{ width: '100%', background: '#0d0d0d', border: '1px solid #333', borderRadius: '0.4rem', padding: '0.5rem', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#aaa', fontWeight: 600, marginBottom: '0.35rem' }}>Version</label>
                  <input
                    type="text"
                    name="version"
                    defaultValue={editingSoftware?.version || '1.0.0'}
                    placeholder="e.g. 1.2.0"
                    style={{ width: '100%', background: '#0d0d0d', border: '1px solid #333', borderRadius: '0.4rem', padding: '0.5rem', color: '#fff', fontFamily: 'monospace' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#aaa', fontWeight: 600, marginBottom: '0.35rem' }}>Numeric Price (INR ₹)</label>
                  <input
                    type="number"
                    name="price"
                    defaultValue={editingSoftware?.price ?? 0}
                    placeholder="0 for Free"
                    style={{ width: '100%', background: '#0d0d0d', border: '1px solid #333', borderRadius: '0.4rem', padding: '0.5rem', color: '#fff', fontFamily: 'monospace' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#aaa', fontWeight: 600, marginBottom: '0.35rem' }}>Display Price Label</label>
                  <input
                    type="text"
                    name="priceFormatted"
                    defaultValue={editingSoftware?.priceFormatted || ''}
                    placeholder="e.g. Free, ₹499, ₹1,499/mo"
                    style={{ width: '100%', background: '#0d0d0d', border: '1px solid #333', borderRadius: '0.4rem', padding: '0.5rem', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: '#aaa', fontWeight: 600, marginBottom: '0.35rem' }}>Lifecycle Status</label>
                <select
                  name="status"
                  defaultValue={editingSoftware?.status || 'AVAILABLE'}
                  style={{ width: '100%', background: '#0d0d0d', border: '1px solid #333', borderRadius: '0.4rem', padding: '0.5rem', color: '#fff' }}
                >
                  <option value="AVAILABLE">AVAILABLE — Publicly released</option>
                  <option value="COMING_SOON">COMING_SOON — Teaser &amp; pre-launch</option>
                  <option value="IN_DEVELOPMENT">IN_DEVELOPMENT — In build pipeline</option>
                  <option value="MAINTENANCE">MAINTENANCE — Under upgrade</option>
                  <option value="ARCHIVED">ARCHIVED — Deprecated</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: '#aaa', fontWeight: 600, marginBottom: '0.35rem' }}>Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingSoftware?.description || ''}
                  required
                  placeholder="Detail key capabilities, system requirements, and target users..."
                  style={{ width: '100%', background: '#0d0d0d', border: '1px solid #333', borderRadius: '0.4rem', padding: '0.5rem', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#aaa', fontWeight: 600, marginBottom: '0.35rem' }}>Download / App URL</label>
                  <input
                    type="text"
                    name="downloadLink"
                    defaultValue={editingSoftware?.downloadLink || ''}
                    placeholder="/software/shiv-launcher or https://..."
                    style={{ width: '100%', background: '#0d0d0d', border: '1px solid #333', borderRadius: '0.4rem', padding: '0.5rem', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#aaa', fontWeight: 600, marginBottom: '0.35rem' }}>Documentation / Web URL</label>
                  <input
                    type="text"
                    name="websiteLink"
                    defaultValue={editingSoftware?.websiteLink || ''}
                    placeholder="https://... or /software/..."
                    style={{ width: '100%', background: '#0d0d0d', border: '1px solid #333', borderRadius: '0.4rem', padding: '0.5rem', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid #222', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => { setEditingSoftware(null); setIsCreatingSoftware(false); }}
                  style={{ padding: '0.5rem 1rem', borderRadius: '0.4rem', background: '#222', border: 'none', color: '#ccc', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{ padding: '0.5rem 1.25rem', borderRadius: '0.4rem', background: '#2563eb', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isPending ? 'Saving...' : (isCreatingSoftware ? 'Create Software' : 'Save Software')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
