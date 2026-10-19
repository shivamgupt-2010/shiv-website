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
  Briefcase,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { PackageItem, PackageCategory } from '@/lib/businessPackagesData';
import { ServiceItem, ServiceCategory } from '@/lib/businessServicesData';
import {
  adminUpdateMasterPackage,
  adminResetMasterPackage,
  adminToggleMasterPackageActive,
  createBusinessPackage,
} from '@/app/actions/adminPackages';
import {
  adminUpdateService,
  adminResetService,
  adminToggleServiceActive,
} from '@/app/actions/adminServiceManager';

interface Props {
  initialPackages: PackageItem[];
  categories: PackageCategory[];
  initialServices?: ServiceItem[];
  serviceCategories?: ServiceCategory[];
}

export default function AdminPackagesClient({
  initialPackages,
  categories,
  initialServices = [],
  serviceCategories = [],
}: Props) {
  const [activeTab, setActiveTab] = useState<'packages' | 'services'>('packages');

  // Package state
  const [packages, setPackages] = useState<PackageItem[]>(initialPackages);
  const [packageSearch, setPackageSearch] = useState('');
  const [selectedPackageCat, setSelectedPackageCat] = useState<number>(0);
  const [billingFilter, setBillingFilter] = useState<'ALL' | 'ONE_TIME' | 'MONTHLY'>('ALL');

  // Service state
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [serviceSearch, setServiceSearch] = useState('');
  const [selectedServiceCat, setSelectedServiceCat] = useState<string>('ALL');

  // Package Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editPriceFormatted, setEditPriceFormatted] = useState('');
  const [editBadge, setEditBadge] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDeliverablesText, setEditDeliverablesText] = useState('');
  const [editScopeNotes, setEditScopeNotes] = useState('');
  const [editFeatured, setEditFeatured] = useState(false);

  // Service Editing state
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editServicePrice, setEditServicePrice] = useState<number>(0);
  const [editServiceTurnaround, setEditServiceTurnaround] = useState<string>('');
  const [editServiceDeliverable, setEditServiceDeliverable] = useState<string>('');
  const [editServiceScopeRules, setEditServiceScopeRules] = useState<string>('');

  const [savingId, setSavingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; success: boolean } | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return packages.filter((p) => {
      if (selectedPackageCat !== 0 && p.categoryCode !== selectedPackageCat) return false;
      if (billingFilter !== 'ALL' && p.billingType !== billingFilter) return false;

      if (packageSearch.trim()) {
        const q = packageSearch.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesCat = p.categoryName.toLowerCase().includes(q);
        const matchesDeliverable = p.deliverables.some((d) => d.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesCat && !matchesDeliverable) return false;
      }
      return true;
    });
  }, [packages, selectedPackageCat, billingFilter, packageSearch]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      if (selectedServiceCat !== 'ALL' && s.categoryCode !== selectedServiceCat) return false;

      if (serviceSearch.trim()) {
        const q = serviceSearch.toLowerCase().trim();
        const matchesName = (s.title || '').toLowerCase().includes(q);
        const matchesDesc = (s.deliverable || '').toLowerCase().includes(q);
        const matchesCat = s.categoryName.toLowerCase().includes(q);
        const matchesScope = (s.scopeRules || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat && !matchesScope) return false;
      }
      return true;
    });
  }, [services, selectedServiceCat, serviceSearch]);

  const showToast = (text: string, success: boolean) => {
    setToast({ text, success });
    setTimeout(() => setToast(null), 3500);
  };

  /* Package Handlers */
  const handleStartEditPackage = (pkg: PackageItem) => {
    setEditingId(pkg.id);
    setEditName(pkg.name);
    setEditPrice(pkg.price);
    setEditPriceFormatted(pkg.priceFormatted);
    setEditBadge(pkg.badge || '');
    setEditDescription(pkg.description);
    setEditDeliverablesText(pkg.deliverables.join('\n'));
    setEditScopeNotes(pkg.scopeNotes || '');
    setEditFeatured(pkg.featured || false);
  };

  const handleSavePackageEdit = async (pkgId: string) => {
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
        showToast('Package updated successfully in database!', true);
      } else {
        showToast('Failed to update package', false);
      }
    } catch (err: any) {
      showToast(err.message, false);
    } finally {
      setSavingId(null);
    }
  };

  const handleTogglePackageActive = async (pkg: PackageItem) => {
    const currentActive = pkg.active !== false;
    setSavingId(pkg.id);
    try {
      const res = await adminToggleMasterPackageActive(pkg.id, currentActive);
      if (res.success && res.newStatus !== undefined) {
        setPackages((prev) =>
          prev.map((p) => (p.id === pkg.id ? { ...p, active: res.newStatus } : p))
        );
        showToast(res.newStatus ? 'Package activated' : 'Package deactivated', true);
      }
    } catch (err: any) {
      showToast(err.message, false);
    } finally {
      setSavingId(null);
    }
  };

  const handleResetPackage = async (pkgId: string) => {
    if (!confirm('Reset this package to default master specifications?')) return;
    setSavingId(pkgId);
    try {
      const res = await adminResetMasterPackage(pkgId);
      if (res.success) {
        const defaultPkg = initialPackages.find((p) => p.id === pkgId);
        if (defaultPkg) {
          setPackages((prev) => prev.map((p) => (p.id === pkgId ? { ...defaultPkg } : p)));
        }
        showToast('Package reset to defaults!', true);
      }
    } catch (err: any) {
      showToast(err.message, false);
    } finally {
      setSavingId(null);
    }
  };

  /* Service Handlers */
  const handleStartEditService = (service: ServiceItem) => {
    setEditingService(service);
    setEditServicePrice(service.price);
    setEditServiceTurnaround(service.turnaround || '');
    setEditServiceDeliverable(service.deliverable || '');
    setEditServiceScopeRules(service.scopeRules || '');
  };

  const handleSaveServiceEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setSavingId(editingService.id);
    try {
      const updates = {
        price: editServicePrice,
        turnaround: editServiceTurnaround.trim(),
        deliverable: editServiceDeliverable.trim(),
        scopeRules: editServiceScopeRules.trim(),
      };

      const res = await adminUpdateService(editingService.id, updates);
      if (res.success) {
        setServices((prev) =>
          prev.map((s) => (s.id === editingService.id ? { ...s, ...updates } : s))
        );
        setEditingService(null);
        showToast(`Saved service "${editingService.title}" in database!`, true);
      } else {
        showToast(res.error || 'Failed to update service', false);
      }
    } catch (err: any) {
      showToast(err.message, false);
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleServiceActive = async (service: ServiceItem) => {
    const currentActive = service.active !== false;
    setSavingId(service.id);
    try {
      const res = await adminToggleServiceActive(service.id, currentActive);
      if (res.success && res.newStatus !== undefined) {
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? { ...s, active: res.newStatus } : s))
        );
        showToast(res.newStatus ? 'Service activated' : 'Service deactivated', true);
      }
    } catch (err: any) {
      showToast(err.message, false);
    } finally {
      setSavingId(null);
    }
  };

  const handleResetService = async (serviceId: string) => {
    if (!confirm('Reset this service to default master catalogue specs?')) return;
    setSavingId(serviceId);
    try {
      const res = await adminResetService(serviceId);
      if (res.success) {
        const defaultService = initialServices.find((s) => s.id === serviceId);
        if (defaultService) {
          setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...defaultService } : s)));
        }
        showToast('Service reset to master catalogue defaults!', true);
      }
    } catch (err: any) {
      showToast(err.message, false);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 0.35rem 0', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Briefcase size={26} color="#38bdf8" /> Services &amp; Packages Manager
          </h1>
          <p style={{ color: '#888', margin: 0, fontSize: '0.85rem' }}>
            Live control over all service packages, custom deliverables, fixed pricing, turnaround times, and scope rules.
          </p>
        </div>

        {/* Tab switchers & Store link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: '#111', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid #222' }}>
            <button
              type="button"
              onClick={() => setActiveTab('packages')}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '0.35rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                background: activeTab === 'packages' ? '#2563eb' : 'transparent',
                color: activeTab === 'packages' ? '#fff' : '#888',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Service Packages ({packages.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('services')}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '0.35rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                background: activeTab === 'services' ? '#2563eb' : 'transparent',
                color: activeTab === 'services' ? '#fff' : '#888',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Individual Services ({services.length})
            </button>
          </div>

          <Link
            href="/business/services"
            target="_blank"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              padding: '0.55rem 0.9rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: 600,
            }}
          >
            <span>Live Catalogue</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {/* Floating Toast Message */}
      {toast && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.25rem',
            fontSize: '0.82rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: toast.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${toast.success ? '#10b981' : '#ef4444'}`,
            color: toast.success ? '#34d399' : '#f87171',
          }}
        >
          {toast.success ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          {toast.text}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: SERVICE PACKAGES */}
      {/* ========================================================================= */}
      {activeTab === 'packages' && (
        <div>
          {/* Filter Bar */}
          <div style={{ backgroundColor: '#0d1117', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #222', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <select
                value={selectedPackageCat}
                onChange={(e) => setSelectedPackageCat(Number(e.target.value))}
                style={{ padding: '0.55rem 0.85rem', background: '#161b22', border: '1px solid #30363d', color: '#fff', borderRadius: '0.4rem', fontSize: '0.82rem' }}
              >
                <option value={0}>All Package Categories ({categories.length})</option>
                {categories.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}. {c.name}
                  </option>
                ))}
              </select>

              <div style={{ display: 'flex', background: '#161b22', borderRadius: '0.4rem', border: '1px solid #30363d', padding: '0.2rem' }}>
                {(['ALL', 'ONE_TIME', 'MONTHLY'] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBillingFilter(b)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '0.3rem',
                      border: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: billingFilter === b ? '#2563eb' : 'transparent',
                      color: billingFilter === b ? '#fff' : '#888',
                      cursor: 'pointer',
                    }}
                  >
                    {b === 'ALL' ? 'All Billing' : b === 'ONE_TIME' ? 'One-time' : 'Monthly'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ position: 'relative', minWidth: '260px' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input
                type="text"
                value={packageSearch}
                onChange={(e) => setPackageSearch(e.target.value)}
                placeholder="Search packages by title or deliverable..."
                style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2.2rem', background: '#161b22', border: '1px solid #30363d', color: '#fff', borderRadius: '0.4rem', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          {/* Packages Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {filteredPackages.map((pkg) => {
              const isEditing = editingId === pkg.id;
              const isSaving = savingId === pkg.id;
              const isActive = pkg.active !== false;

              return (
                <div
                  key={pkg.id}
                  style={{
                    backgroundColor: isActive ? '#0d1117' : '#080a0f',
                    border: isEditing ? '1px solid #38bdf8' : isActive ? '1px solid #222' : '1px dashed #333',
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    opacity: isActive ? 1 : 0.6,
                    position: 'relative',
                  }}
                >
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>EDITING PACKAGE ({pkg.id})</span>
                        <button type="button" onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
                          <X size={16} />
                        </button>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.7rem', color: '#aaa' }}>Name</label>
                        <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} style={{ width: '100%', padding: '0.45rem', background: '#161b22', border: '1px solid #30363d', color: '#fff', borderRadius: '0.3rem', fontSize: '0.82rem' }} />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <div>
                          <label style={{ fontSize: '0.7rem', color: '#aaa' }}>Numeric Price (₹)</label>
                          <input type="number" value={editPrice} onChange={(e) => setEditPrice(Number(e.target.value))} style={{ width: '100%', padding: '0.45rem', background: '#161b22', border: '1px solid #30363d', color: '#fff', borderRadius: '0.3rem', fontSize: '0.82rem', fontFamily: 'monospace' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.7rem', color: '#aaa' }}>Display Label</label>
                          <input type="text" value={editPriceFormatted} onChange={(e) => setEditPriceFormatted(e.target.value)} placeholder="e.g. ₹3,990" style={{ width: '100%', padding: '0.45rem', background: '#161b22', border: '1px solid #30363d', color: '#fff', borderRadius: '0.3rem', fontSize: '0.82rem' }} />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.7rem', color: '#aaa' }}>Badge</label>
                        <input type="text" value={editBadge} onChange={(e) => setEditBadge(e.target.value)} placeholder="e.g. POPULAR, BEST VALUE" style={{ width: '100%', padding: '0.45rem', background: '#161b22', border: '1px solid #30363d', color: '#fff', borderRadius: '0.3rem', fontSize: '0.82rem' }} />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.7rem', color: '#aaa' }}>Description</label>
                        <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={2} style={{ width: '100%', padding: '0.45rem', background: '#161b22', border: '1px solid #30363d', color: '#fff', borderRadius: '0.3rem', fontSize: '0.82rem' }} />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.7rem', color: '#aaa' }}>Deliverables (1 per line)</label>
                        <textarea value={editDeliverablesText} onChange={(e) => setEditDeliverablesText(e.target.value)} rows={4} style={{ width: '100%', padding: '0.45rem', background: '#161b22', border: '1px solid #30363d', color: '#fff', borderRadius: '0.3rem', fontSize: '0.78rem' }} />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button type="button" onClick={() => setEditingId(null)} style={{ padding: '0.4rem 0.8rem', background: '#222', border: 'none', color: '#ccc', borderRadius: '0.3rem', fontSize: '0.75rem', cursor: 'pointer' }}>Cancel</button>
                        <button type="button" disabled={isSaving} onClick={() => handleSavePackageEdit(pkg.id)} style={{ padding: '0.4rem 0.9rem', background: '#2563eb', border: 'none', color: '#fff', borderRadius: '0.3rem', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                          {isSaving ? 'Saving...' : 'Save to Database'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                            Cat {pkg.categoryCode} • {pkg.billingType === 'MONTHLY' ? 'Monthly Retainer' : 'One-time'}
                          </span>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0.2rem 0', color: '#fff' }}>{pkg.name}</h3>
                        </div>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', fontFamily: 'monospace' }}>
                          {pkg.priceFormatted || `₹${pkg.price.toLocaleString('en-IN')}`}
                        </span>
                      </div>

                      {pkg.badge && (
                        <span style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', marginBottom: '0.5rem' }}>
                          {pkg.badge}
                        </span>
                      )}

                      <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4, margin: '0.25rem 0 0.75rem' }}>{pkg.description}</p>

                      <div style={{ borderTop: '1px solid #1f242e', paddingTop: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                          Included Deliverables ({pkg.deliverables.length})
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                          {pkg.deliverables.slice(0, 4).map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                          {pkg.deliverables.length > 4 && (
                            <li style={{ color: '#64748b', listStyleType: 'none', marginLeft: '-0.5rem' }}>+{pkg.deliverables.length - 4} more deliverables...</li>
                          )}
                        </ul>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1f242e', paddingTop: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => handleTogglePackageActive(pkg)}
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
                          <button
                            type="button"
                            onClick={() => handleResetPackage(pkg.id)}
                            title="Reset to default"
                            style={{ padding: '0.25rem 0.45rem', borderRadius: '4px', background: '#1c2129', border: '1px solid #282f3a', color: '#888', cursor: 'pointer' }}
                          >
                            <RotateCcw size={12} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleStartEditPackage(pkg)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '4px',
                            background: '#1e293b',
                            border: '1px solid #334155',
                            color: '#fff',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <Edit2 size={12} /> Edit Package
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: INDIVIDUAL SERVICES (MASTER CATALOGUE) */}
      {/* ========================================================================= */}
      {activeTab === 'services' && (
        <div>
          {/* Service Filters */}
          <div style={{ backgroundColor: '#0d1117', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #222', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', maxWidth: '100%', paddingBottom: '0.25rem' }}>
              <button
                type="button"
                onClick={() => setSelectedServiceCat('ALL')}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '0.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  background: selectedServiceCat === 'ALL' ? '#2563eb' : '#161b22',
                  color: selectedServiceCat === 'ALL' ? '#fff' : '#888',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                All Categories ({services.length})
              </button>
              {serviceCategories.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setSelectedServiceCat(c.code)}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: '0.4rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    background: selectedServiceCat === c.code ? '#2563eb' : '#161b22',
                    color: selectedServiceCat === c.code ? '#fff' : '#888',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Cat {c.code}: {c.name.split('—')[0].trim()}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', minWidth: '260px' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input
                type="text"
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                placeholder="Search service name, scope, keyword..."
                style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2.2rem', background: '#161b22', border: '1px solid #30363d', color: '#fff', borderRadius: '0.4rem', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          {/* Services Table */}
          <div style={{ background: '#0d1117', borderRadius: '0.75rem', border: '1px solid #222', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem', minWidth: '850px' }}>
              <thead>
                <tr style={{ background: '#161b22', borderBottom: '1px solid #30363d', color: '#888', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Category &amp; Service Name</th>
                  <th style={{ padding: '0.85rem' }}>Fixed Price (INR)</th>
                  <th style={{ padding: '0.85rem' }}>Turnaround</th>
                  <th style={{ padding: '0.85rem' }}>Deliverable Scope</th>
                  <th style={{ padding: '0.85rem', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => {
                  const isActive = service.active !== false;
                  return (
                    <tr key={service.id} style={{ borderBottom: '1px solid #1a1f29', background: isActive ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 700, color: isActive ? '#fff' : '#777' }}>{service.title}</div>
                        <div style={{ fontSize: '0.7rem', color: '#38bdf8', marginTop: '0.15rem' }}>
                          Cat {service.categoryCode}: {service.categoryName}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem' }}>
                        <span style={{ fontWeight: 800, color: '#34d399', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                          ₹{service.price.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem', color: '#aaa', fontSize: '0.78rem' }}>
                        {service.turnaround || '2-4 days'}
                      </td>
                      <td style={{ padding: '0.85rem', color: '#94a3b8', fontSize: '0.75rem', maxWidth: '320px', lineHeight: 1.4 }}>
                        {service.deliverable}
                      </td>
                      <td style={{ padding: '0.85rem', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleServiceActive(service)}
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
                            onClick={() => handleStartEditService(service)}
                            style={{
                              padding: '0.35rem 0.65rem',
                              borderRadius: '4px',
                              background: '#1e293b',
                              border: '1px solid #334155',
                              color: '#fff',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <Edit2 size={12} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleResetService(service.id)}
                            title="Reset to master catalogue default"
                            style={{ padding: '0.35rem 0.5rem', borderRadius: '4px', background: '#1c2129', border: '1px solid #282f3a', color: '#888', cursor: 'pointer' }}
                          >
                            <RotateCcw size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredServices.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: '#666' }}>
                      No individual services found matching filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT SERVICE MODAL */}
      {/* ========================================================================= */}
      {editingService && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '560px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.85)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#fff' }}>Edit Service Details</h3>
                <p style={{ fontSize: '0.75rem', color: '#38bdf8', margin: '0.2rem 0 0' }}>
                  Cat {editingService.categoryCode}: {editingService.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                style={{ background: '#161b22', border: 'none', color: '#888', padding: '0.35rem', borderRadius: '4px', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveServiceEdit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#aaa', fontWeight: 600, marginBottom: '0.35rem' }}>Fixed Price (INR ₹)</label>
                  <input
                    type="number"
                    value={editServicePrice}
                    onChange={(e) => setEditServicePrice(Number(e.target.value))}
                    required
                    style={{ width: '100%', background: '#161b22', border: '1px solid #30363d', borderRadius: '0.4rem', padding: '0.5rem', color: '#fff', fontFamily: 'monospace', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#aaa', fontWeight: 600, marginBottom: '0.35rem' }}>Turnaround Time</label>
                  <input
                    type="text"
                    value={editServiceTurnaround}
                    onChange={(e) => setEditServiceTurnaround(e.target.value)}
                    placeholder="e.g. 24-48 hours or 3-5 days"
                    style={{ width: '100%', background: '#161b22', border: '1px solid #30363d', borderRadius: '0.4rem', padding: '0.5rem', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: '#aaa', fontWeight: 600, marginBottom: '0.35rem' }}>Deliverable Scope</label>
                <textarea
                  value={editServiceDeliverable}
                  onChange={(e) => setEditServiceDeliverable(e.target.value)}
                  rows={3}
                  required
                  placeholder="Clear description of the exact deliverable..."
                  style={{ width: '100%', background: '#161b22', border: '1px solid #30363d', borderRadius: '0.4rem', padding: '0.5rem', color: '#fff', fontSize: '0.82rem', lineHeight: 1.4 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#aaa', fontWeight: 600, marginBottom: '0.35rem' }}>Scope Rules &amp; Limits (Optional)</label>
                <textarea
                  value={editServiceScopeRules}
                  onChange={(e) => setEditServiceScopeRules(e.target.value)}
                  rows={2}
                  placeholder="Define revision limits, exclusions, hosting/domain rules..."
                  style={{ width: '100%', background: '#161b22', border: '1px solid #30363d', borderRadius: '0.4rem', padding: '0.5rem', color: '#fff', fontSize: '0.82rem', lineHeight: 1.4 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid #222', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  style={{ padding: '0.5rem 1rem', borderRadius: '0.4rem', background: '#1c2129', border: 'none', color: '#ccc', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingId === editingService.id}
                  style={{ padding: '0.5rem 1.25rem', borderRadius: '0.4rem', background: '#2563eb', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  {savingId === editingService.id ? 'Saving...' : 'Save Service Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
