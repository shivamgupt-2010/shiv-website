'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Check,
  RotateCcw,
  Power,
  ExternalLink,
  Edit2,
  Save,
  X,
  Plus,
  Package,
  Layers,
  Clock,
  Trash2,
  Star,
} from 'lucide-react';
import { PackageItem, PackageCategory } from '@/lib/businessPackagesData';
import {
  adminUpdateMasterPackage,
  adminResetMasterPackage,
  adminToggleMasterPackageActive,
  createBusinessPackage,
} from '@/app/actions/adminPackages';

interface Props {
  initialPackages: PackageItem[];
  categories: PackageCategory[];
}

export default function AdminPackagesClient({ initialPackages, categories }: Props) {
  const [packages, setPackages] = useState<PackageItem[]>(initialPackages);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<number>(0);
  const [billingFilter, setBillingFilter] = useState<'ALL' | 'ONE_TIME' | 'MONTHLY'>('ALL');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editPriceFormatted, setEditPriceFormatted] = useState('');
  const [editBadge, setEditBadge] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDeliverablesText, setEditDeliverablesText] = useState('');
  const [editScopeNotes, setEditScopeNotes] = useState('');
  const [editFeatured, setEditFeatured] = useState(false);

  const [savingId, setSavingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; success: boolean } | null>(null);

  // New Package Modal / Toggle
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Filtered list
  const filtered = useMemo(() => {
    return packages.filter((p) => {
      if (selectedCat !== 0 && p.categoryCode !== selectedCat) return false;
      if (billingFilter !== 'ALL' && p.billingType !== billingFilter) return false;

      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesCat = p.categoryName.toLowerCase().includes(q);
        const matchesDeliverable = p.deliverables.some((d) => d.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesCat && !matchesDeliverable) return false;
      }
      return true;
    });
  }, [packages, selectedCat, billingFilter, search]);

  const handleStartEdit = (pkg: PackageItem) => {
    setEditingId(pkg.id);
    setEditName(pkg.name);
    setEditPrice(pkg.price);
    setEditPriceFormatted(pkg.priceFormatted);
    setEditBadge(pkg.badge || '');
    setEditDescription(pkg.description);
    setEditDeliverablesText(pkg.deliverables.join('\n'));
    setEditScopeNotes(pkg.scopeNotes || '');
    setEditFeatured(pkg.featured || false);
    setToast(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (pkgId: string) => {
    setSavingId(pkgId);
    try {
      const deliverables = editDeliverablesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await adminUpdateMasterPackage(pkgId, {
        name: editName,
        price: editPrice,
        priceFormatted: editPriceFormatted || `₹${editPrice.toLocaleString('en-IN')}`,
        badge: editBadge,
        description: editDescription,
        deliverables,
        scopeNotes: editScopeNotes,
        featured: editFeatured,
      });

      if (res.success) {
        setPackages((prev) =>
          prev.map((p) =>
            p.id === pkgId
              ? {
                  ...p,
                  name: editName,
                  price: editPrice,
                  priceFormatted: editPriceFormatted || `₹${editPrice.toLocaleString('en-IN')}`,
                  badge: editBadge,
                  description: editDescription,
                  deliverables,
                  scopeNotes: editScopeNotes,
                  featured: editFeatured,
                }
              : p
          )
        );
        setEditingId(null);
        setToast({ text: 'Package updated successfully!', success: true });
      } else {
        setToast({ text: 'Failed to update package', success: false });
      }
    } catch (err: any) {
      setToast({ text: err.message, success: false });
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleActive = async (pkg: PackageItem) => {
    const currentActive = pkg.active !== false;
    setSavingId(pkg.id);
    try {
      const res = await adminToggleMasterPackageActive(pkg.id, currentActive);
      if (res.success && res.newStatus !== undefined) {
        setPackages((prev) =>
          prev.map((p) => (p.id === pkg.id ? { ...p, active: res.newStatus } : p))
        );
        setToast({
          text: res.newStatus ? 'Package activated' : 'Package deactivated',
          success: true,
        });
      }
    } catch (err: any) {
      setToast({ text: err.message, success: false });
    } finally {
      setSavingId(null);
    }
  };

  const handleResetToDefault = async (pkgId: string) => {
    if (!confirm('Reset this package to default master specifications?')) return;
    setSavingId(pkgId);
    try {
      const res = await adminResetMasterPackage(pkgId);
      if (res.success) {
        const defaultPkg = initialPackages.find((p) => p.id === pkgId);
        if (defaultPkg) {
          setPackages((prev) => prev.map((p) => (p.id === pkgId ? { ...defaultPkg } : p)));
        }
        setToast({ text: 'Package reset to default!', success: true });
      }
    } catch (err: any) {
      setToast({ text: err.message, success: false });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.4rem 0', letterSpacing: '-0.02em' }}>
            Business Packages Manager
          </h1>
          <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>
            Live control over all 10 package categories. Edit prices, adjust deliverables, toggle active status, and configure featured packages.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setIsAddingNew(!isAddingNew)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#38bdf8',
              color: '#07090e',
              padding: '0.65rem 1.1rem',
              borderRadius: '0.5rem',
              fontWeight: 700,
              fontSize: '0.88rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Plus size={16} />
            <span>{isAddingNew ? 'Close Form' : 'Add Custom Package'}</span>
          </button>

          <Link
            href="/business/services"
            target="_blank"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              padding: '0.65rem 1rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontSize: '0.88rem',
              fontWeight: 600,
            }}
          >
            <span>View Public Store</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {/* Add Custom Package Drawer / Form */}
      {isAddingNew && (
        <div style={{ backgroundColor: '#141923', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #38bdf8', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#38bdf8' }}>Add New Custom Business Package</h2>
          <form action={createBusinessPackage} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#aaa', textTransform: 'uppercase' }}>Package Name *</label>
              <input type="text" name="name" required placeholder="e.g. VIP Enterprise Retainer" style={{ padding: '0.75rem', background: '#090c12', border: '1px solid #282828', color: '#fff', borderRadius: '0.4rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#aaa', textTransform: 'uppercase' }}>Price Display *</label>
              <input type="text" name="price" required placeholder="e.g. ₹19,990 or ₹4,999/month" style={{ padding: '0.75rem', background: '#090c12', border: '1px solid #282828', color: '#fff', borderRadius: '0.4rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', color: '#aaa', textTransform: 'uppercase' }}>Brief Description *</label>
              <input type="text" name="description" required placeholder="One-line summary of what this package delivers" style={{ padding: '0.75rem', background: '#090c12', border: '1px solid #282828', color: '#fff', borderRadius: '0.4rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.8rem', color: '#aaa', textTransform: 'uppercase' }}>Deliverables (1 bullet per line) *</label>
              <textarea name="features" required rows={4} placeholder="Custom Website&#10;Google Analytics&#10;WhatsApp Auto-replies" style={{ padding: '0.75rem', background: '#090c12', border: '1px solid #282828', color: '#fff', borderRadius: '0.4rem' }} />
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input type="checkbox" name="featured" style={{ width: '16px', height: '16px', accentColor: '#38bdf8' }} />
                <span>Featured / Popular</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <input type="checkbox" name="active" defaultChecked style={{ width: '16px', height: '16px', accentColor: '#10b981' }} />
                <span>Active</span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gridColumn: '1 / -1' }}>
              <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#10b981', color: '#07090e', border: 'none', borderRadius: '0.4rem', fontWeight: 700, cursor: 'pointer' }}>
                Create Package
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toast Feedback */}
      {toast && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            background: toast.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: toast.success ? '#10b981' : '#ef4444',
            fontSize: '0.88rem',
            fontWeight: 600,
          }}
        >
          {toast.text}
        </div>
      )}

      {/* Search & Categories Toolbar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
          <input
            type="text"
            placeholder="Search packages by name, description, deliverables..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              background: '#111',
              border: '1px solid #2a2a2a',
              borderRadius: '0.5rem',
              color: '#fff',
              fontSize: '0.9rem',
            }}
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(Number(e.target.value))}
          style={{
            background: '#111',
            border: '1px solid #2a2a2a',
            color: '#fff',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.88rem',
          }}
        >
          <option value={0}>All 10 Package Categories ({packages.length})</option>
          {categories.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code}. {c.name}
            </option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: '0.3rem' }}>
          <button
            type="button"
            onClick={() => setBillingFilter('ALL')}
            style={{
              padding: '0.6rem 0.9rem',
              background: billingFilter === 'ALL' ? '#38bdf8' : '#141414',
              color: billingFilter === 'ALL' ? '#07090e' : '#888',
              border: '1px solid #282828',
              borderRadius: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setBillingFilter('ONE_TIME')}
            style={{
              padding: '0.6rem 0.9rem',
              background: billingFilter === 'ONE_TIME' ? '#38bdf8' : '#141414',
              color: billingFilter === 'ONE_TIME' ? '#07090e' : '#888',
              border: '1px solid #282828',
              borderRadius: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            One-Time
          </button>
          <button
            type="button"
            onClick={() => setBillingFilter('MONTHLY')}
            style={{
              padding: '0.6rem 0.9rem',
              background: billingFilter === 'MONTHLY' ? '#38bdf8' : '#141414',
              color: billingFilter === 'MONTHLY' ? '#07090e' : '#888',
              border: '1px solid #282828',
              borderRadius: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Packages Table */}
      <div style={{ backgroundColor: '#111', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #222' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #282828', backgroundColor: '#161920', color: '#aaa', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              <th style={{ padding: '1rem', width: '70px' }}>Cat</th>
              <th style={{ padding: '1rem', width: '220px' }}>Package Name</th>
              <th style={{ padding: '1rem', width: '130px' }}>Price</th>
              <th style={{ padding: '1rem' }}>Deliverables & Scope</th>
              <th style={{ padding: '1rem', width: '100px' }}>Status</th>
              <th style={{ padding: '1rem', width: '140px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((pkg) => {
              const isEditing = editingId === pkg.id;
              const isSaving = savingId === pkg.id;
              const isActive = pkg.active !== false;

              return (
                <tr
                  key={pkg.id}
                  style={{
                    borderBottom: '1px solid #1c1c1c',
                    backgroundColor: isEditing ? 'rgba(56, 189, 248, 0.05)' : 'transparent',
                    opacity: isActive ? 1 : 0.45,
                  }}
                >
                  {/* Category Code */}
                  <td style={{ padding: '1rem' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        background: '#1f242e',
                        color: '#38bdf8',
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                      }}
                    >
                      #{pkg.categoryCode}
                    </span>
                  </td>

                  {/* Name & Badge */}
                  <td style={{ padding: '1rem' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          style={{ padding: '0.4rem', background: '#1c1c1c', border: '1px solid #38bdf8', borderRadius: '4px', color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}
                        />
                        <input
                          type="text"
                          value={editBadge}
                          placeholder="Badge (e.g. Starter, Popular)"
                          onChange={(e) => setEditBadge(e.target.value)}
                          style={{ padding: '0.3rem', background: '#1c1c1c', border: '1px solid #333', borderRadius: '4px', color: '#38bdf8', fontSize: '0.75rem' }}
                        />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#f59e0b', cursor: 'pointer' }}>
                          <input type="checkbox" checked={editFeatured} onChange={(e) => setEditFeatured(e.target.checked)} />
                          <span>Featured Package</span>
                        </label>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span>{pkg.name}</span>
                          {pkg.featured && <Star size={13} style={{ color: '#f59e0b', fill: '#f59e0b' }} />}
                        </div>
                        {pkg.badge && (
                          <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700 }}>
                            {pkg.badge}
                          </span>
                        )}
                        <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '0.2rem' }}>{pkg.categoryName}</div>
                      </div>
                    )}
                  </td>

                  {/* Price */}
                  <td style={{ padding: '1rem' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(Number(e.target.value))}
                          style={{ padding: '0.4rem', background: '#1c1c1c', border: '1px solid #38bdf8', borderRadius: '4px', color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}
                        />
                        <input
                          type="text"
                          value={editPriceFormatted}
                          placeholder="Display (e.g. ₹3,990)"
                          onChange={(e) => setEditPriceFormatted(e.target.value)}
                          style={{ padding: '0.3rem', background: '#1c1c1c', border: '1px solid #333', borderRadius: '4px', color: '#888', fontSize: '0.75rem' }}
                        />
                      </div>
                    ) : (
                      <div>
                        <span style={{ fontWeight: 800, color: '#fff', fontSize: '1.05rem', fontFamily: 'monospace' }}>
                          {pkg.priceFormatted}
                        </span>
                        <div style={{ fontSize: '0.7rem', color: pkg.billingType === 'MONTHLY' ? '#f97316' : '#10b981', fontWeight: 600 }}>
                          {pkg.billingType === 'MONTHLY' ? 'MONTHLY' : 'ONE-TIME'}
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Deliverables */}
                  <td style={{ padding: '1rem' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <textarea
                          value={editDeliverablesText}
                          onChange={(e) => setEditDeliverablesText(e.target.value)}
                          rows={4}
                          placeholder="1 deliverable per line"
                          style={{ padding: '0.5rem', background: '#1c1c1c', border: '1px solid #38bdf8', borderRadius: '4px', color: '#fff', fontSize: '0.8rem', width: '100%' }}
                        />
                        <input
                          type="text"
                          value={editScopeNotes}
                          placeholder="Scope notes / exclusions"
                          onChange={(e) => setEditScopeNotes(e.target.value)}
                          style={{ padding: '0.3rem', background: '#1c1c1c', border: '1px solid #333', borderRadius: '4px', color: '#fde68a', fontSize: '0.75rem' }}
                        />
                      </div>
                    ) : (
                      <div>
                        <div style={{ color: '#aaa', fontSize: '0.82rem', marginBottom: '0.3rem' }}>{pkg.description}</div>
                        <ul style={{ paddingLeft: '1.1rem', margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                          {pkg.deliverables.slice(0, 3).map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                          {pkg.deliverables.length > 3 && (
                            <li style={{ color: '#888' }}>+{pkg.deliverables.length - 3} more deliverables</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </td>

                  {/* Active Status */}
                  <td style={{ padding: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(pkg)}
                      disabled={isSaving}
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: '0.3rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: isActive ? '#10b981' : '#ef4444',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <Power size={11} />
                      <span>{isActive ? 'ACTIVE' : 'DISABLED'}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(pkg.id)}
                          disabled={isSaving}
                          style={{
                            padding: '0.4rem 0.7rem',
                            background: '#10b981',
                            color: '#07090e',
                            border: 'none',
                            borderRadius: '0.3rem',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                          }}
                        >
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          style={{
                            padding: '0.4rem 0.5rem',
                            background: '#222',
                            color: '#888',
                            border: 'none',
                            borderRadius: '0.3rem',
                            cursor: 'pointer',
                          }}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(pkg)}
                          style={{
                            padding: '0.4rem 0.7rem',
                            background: '#1c222c',
                            color: '#38bdf8',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            borderRadius: '0.3rem',
                            cursor: 'pointer',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          <Edit2 size={12} />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleResetToDefault(pkg.id)}
                          disabled={isSaving}
                          title="Reset to default master catalogue specs"
                          style={{
                            padding: '0.4rem 0.5rem',
                            background: '#181818',
                            color: '#666',
                            border: '1px solid #282828',
                            borderRadius: '0.3rem',
                            cursor: 'pointer',
                          }}
                        >
                          <RotateCcw size={12} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
                  No matching packages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
