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
  FileSpreadsheet,
  Users,
  Settings,
  Clock,
  IndianRupee,
} from 'lucide-react';
import { ServiceItem, ServiceCategory } from '@/lib/businessServicesData';
import { adminUpdateService, adminResetService, adminToggleServiceActive } from '@/app/actions/adminServiceManager';

interface LeadItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  projectType: string;
  status: string;
  quotation?: number | null;
  projectValue?: number | null;
  archived?: boolean | null;
  createdAt: string | Date;
}

interface Props {
  initialLeads: LeadItem[];
  initialServices: ServiceItem[];
  categories: ServiceCategory[];
}

export default function AdminBusinessLeadsClient({
  initialLeads,
  initialServices,
  categories,
}: Props) {
  const [activeTab, setActiveTab] = useState<'leads' | 'services'>('leads');

  // Leads CRM State
  const [leadsSearch, setLeadsSearch] = useState('');
  const [leadsStatusFilter, setLeadsStatusFilter] = useState('ALL');

  // Services Manager State
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [serviceSearch, setServiceSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editTurnaround, setEditTurnaround] = useState<string>('');
  const [editDeliverable, setEditDeliverable] = useState<string>('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ id: string; text: string; success: boolean } | null>(null);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return initialLeads.filter((lead) => {
      if (leadsStatusFilter !== 'ALL' && lead.status !== leadsStatusFilter) {
        return false;
      }
      if (leadsSearch.trim()) {
        const q = leadsSearch.toLowerCase().trim();
        const matchesName = lead.name.toLowerCase().includes(q);
        const matchesEmail = lead.email.toLowerCase().includes(q);
        const matchesCompany = (lead.company || '').toLowerCase().includes(q);
        const matchesType = lead.projectType.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesCompany && !matchesType) {
          return false;
        }
      }
      return true;
    });
  }, [initialLeads, leadsStatusFilter, leadsSearch]);

  // Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      if (selectedCatFilter !== 'ALL' && srv.categoryCode !== selectedCatFilter) {
        return false;
      }
      if (serviceSearch.trim()) {
        const q = serviceSearch.toLowerCase().trim();
        const matchesTitle = srv.title.toLowerCase().includes(q);
        const matchesDeliverable = srv.deliverable.toLowerCase().includes(q);
        const matchesCategory = srv.categoryTitle.toLowerCase().includes(q) || srv.categoryName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDeliverable && !matchesCategory) {
          return false;
        }
      }
      return true;
    });
  }, [services, selectedCatFilter, serviceSearch]);

  // Start Editing Service
  const handleStartEdit = (srv: ServiceItem) => {
    setEditingId(srv.id);
    setEditPrice(srv.price);
    setEditTurnaround(srv.turnaround);
    setEditDeliverable(srv.deliverable);
    setFeedbackMsg(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Save Service Override
  const handleSaveService = async (serviceId: string) => {
    setSavingId(serviceId);
    try {
      const res = await adminUpdateService(serviceId, {
        price: editPrice,
        turnaround: editTurnaround,
        deliverable: editDeliverable,
      });

      if (res.success) {
        setServices((prev) =>
          prev.map((s) =>
            s.id === serviceId
              ? { ...s, price: editPrice, turnaround: editTurnaround, deliverable: editDeliverable }
              : s
          )
        );
        setEditingId(null);
        setFeedbackMsg({ id: serviceId, text: 'Saved successfully!', success: true });
      } else {
        setFeedbackMsg({ id: serviceId, text: res.error || 'Failed to save', success: false });
      }
    } catch (err: any) {
      setFeedbackMsg({ id: serviceId, text: err.message, success: false });
    } finally {
      setSavingId(null);
    }
  };

  // Reset Service to Master Defaults
  const handleResetService = async (serviceId: string) => {
    if (!confirm('Reset this service to default catalogue prices and turnaround?')) return;
    setSavingId(serviceId);
    try {
      const res = await adminResetService(serviceId);
      if (res.success) {
        // Find default from initialServices
        const defaultItem = initialServices.find((s) => s.id === serviceId);
        if (defaultItem) {
          setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...defaultItem } : s)));
        }
        setFeedbackMsg({ id: serviceId, text: 'Reset to default!', success: true });
      } else {
        setFeedbackMsg({ id: serviceId, text: res.error || 'Failed to reset', success: false });
      }
    } catch (err: any) {
      setFeedbackMsg({ id: serviceId, text: err.message, success: false });
    } finally {
      setSavingId(null);
    }
  };

  // Toggle Active/Inactive
  const handleToggleActive = async (srv: ServiceItem) => {
    const current = srv.active !== false;
    setSavingId(srv.id);
    try {
      const res = await adminToggleServiceActive(srv.id, current);
      if (res.success && res.newStatus !== undefined) {
        setServices((prev) =>
          prev.map((s) => (s.id === srv.id ? { ...s, active: res.newStatus } : s))
        );
        setFeedbackMsg({
          id: srv.id,
          text: res.newStatus ? 'Service activated' : 'Service deactivated',
          success: true,
        });
      }
    } catch (err: any) {
      setFeedbackMsg({ id: srv.id, text: err.message, success: false });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.4rem 0', letterSpacing: '-0.02em' }}>
            Business Growth & Services CRM
          </h1>
          <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>
            Manage client quotations, customer leads, and edit master service catalogue prices and availability.
          </p>
        </div>

        <Link
          href="/business/services"
          target="_blank"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            padding: '0.6rem 1.1rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          <span>View Public Services Page</span>
          <ExternalLink size={14} />
        </Link>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #222', marginBottom: '2rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('leads')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1.4rem',
            background: activeTab === 'leads' ? '#181e28' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'leads' ? '2px solid #38bdf8' : '2px solid transparent',
            color: activeTab === 'leads' ? '#fff' : '#888',
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <Users size={16} />
          <span>Leads & Quotations ({initialLeads.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('services')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1.4rem',
            background: activeTab === 'services' ? '#181e28' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'services' ? '2px solid #38bdf8' : '2px solid transparent',
            color: activeTab === 'services' ? '#fff' : '#888',
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <FileSpreadsheet size={16} />
          <span>Master Catalogue Manager ({services.length} Services)</span>
        </button>
      </div>

      {/* =========================================
          TAB 1: LEADS CRM
          ========================================= */}
      {activeTab === 'leads' && (
        <div>
          {/* Controls */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input
                type="text"
                placeholder="Search leads by name, email, company, project type..."
                value={leadsSearch}
                onChange={(e) => setLeadsSearch(e.target.value)}
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

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {['ALL', 'NEW', 'DISCUSSION', 'IN_DEVELOPMENT', 'COMPLETED', 'LOST'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setLeadsStatusFilter(status)}
                  style={{
                    padding: '0.6rem 0.9rem',
                    background: leadsStatusFilter === status ? '#38bdf8' : '#141414',
                    color: leadsStatusFilter === status ? '#07090e' : '#888',
                    border: '1px solid #2a2a2a',
                    borderRadius: '0.4rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Leads Table */}
          <div style={{ backgroundColor: '#111', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #222' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #282828', backgroundColor: '#161920', color: '#aaa', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem' }}>Date</th>
                  <th style={{ padding: '1rem' }}>Client Contact</th>
                  <th style={{ padding: '1rem' }}>Project / Scope</th>
                  <th style={{ padding: '1rem' }}>Quotation Estimate</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid #1c1c1c', opacity: lead.archived ? 0.5 : 1 }}>
                    <td style={{ padding: '1rem', color: '#888', whiteSpace: 'nowrap' }}>
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 700, color: '#fff' }}>{lead.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#888' }}>
                        {lead.company ? `${lead.company} • ` : ''}
                        <a href={`mailto:${lead.email}`} style={{ color: '#38bdf8', textDecoration: 'none' }}>{lead.email}</a>
                        {lead.phone && (
                          <>
                            {' • '}
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#25d366', textDecoration: 'none' }}
                            >
                              WA: {lead.phone}
                            </a>
                          </>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', maxWidth: '320px' }}>
                      <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{lead.projectType}</span>
                    </td>
                    <td style={{ padding: '1rem', fontFamily: 'monospace' }}>
                      {lead.quotation ? (
                        <span style={{ color: '#10b981', fontWeight: 700 }}>
                          ₹{lead.quotation.toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span style={{ color: '#666' }}>Custom</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.55rem',
                          borderRadius: '0.3rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor:
                            lead.status === 'NEW'
                              ? 'rgba(56, 189, 248, 0.15)'
                              : lead.status === 'COMPLETED'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : lead.status === 'LOST'
                              ? 'rgba(239, 68, 68, 0.15)'
                              : 'rgba(245, 158, 11, 0.15)',
                          color:
                            lead.status === 'NEW'
                              ? '#38bdf8'
                              : lead.status === 'COMPLETED'
                              ? '#10b981'
                              : lead.status === 'LOST'
                              ? '#ef4444'
                              : '#f59e0b',
                        }}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <Link
                        href={`/admin/business-leads/${lead.id}`}
                        style={{
                          padding: '0.45rem 0.85rem',
                          backgroundColor: '#222',
                          color: '#fff',
                          textDecoration: 'none',
                          borderRadius: '0.35rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
                      No matching leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================
          TAB 2: MASTER SERVICES CATALOGUE MANAGER
          ========================================= */}
      {activeTab === 'services' && (
        <div>
          {/* Controls */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input
                type="text"
                placeholder="Search services by title, deliverable summary, category..."
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
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
              value={selectedCatFilter}
              onChange={(e) => setSelectedCatFilter(e.target.value)}
              style={{
                background: '#111',
                border: '1px solid #2a2a2a',
                color: '#fff',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.88rem',
              }}
            >
              <option value="ALL">All 15 Categories (295+ Services)</option>
              {categories.map((c) => (
                <option key={c.code} value={c.code}>
                  Category {c.code}: {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Feedback banner */}
          {feedbackMsg && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                background: feedbackMsg.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: feedbackMsg.success ? '#10b981' : '#ef4444',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {/* Services Table */}
          <div style={{ backgroundColor: '#111', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #222' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #282828', backgroundColor: '#161920', color: '#aaa', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem', width: '90px' }}>Cat</th>
                  <th style={{ padding: '1rem', width: '250px' }}>Service Name</th>
                  <th style={{ padding: '1rem' }}>Deliverable Description</th>
                  <th style={{ padding: '1rem', width: '130px' }}>Turnaround</th>
                  <th style={{ padding: '1rem', width: '130px' }}>Price (INR)</th>
                  <th style={{ padding: '1rem', width: '100px' }}>Status</th>
                  <th style={{ padding: '1rem', width: '140px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((srv) => {
                  const isEditing = editingId === srv.id;
                  const isSaving = savingId === srv.id;
                  const isActive = srv.active !== false;

                  return (
                    <tr
                      key={srv.id}
                      style={{
                        borderBottom: '1px solid #1c1c1c',
                        backgroundColor: isEditing ? 'rgba(56, 189, 248, 0.05)' : 'transparent',
                        opacity: isActive ? 1 : 0.45,
                      }}
                    >
                      {/* Category Badge */}
                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            background: '#1f242e',
                            color: '#38bdf8',
                            fontSize: '0.72rem',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                          }}
                        >
                          Cat {srv.categoryCode}
                        </span>
                      </td>

                      {/* Service Title */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 600, color: '#fff', marginBottom: '0.2rem' }}>{srv.title}</div>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '999px',
                            background: srv.billingType === 'ONE_TIME' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(249, 115, 22, 0.1)',
                            color: srv.billingType === 'ONE_TIME' ? '#10b981' : '#f97316',
                            fontWeight: 700,
                            fontFamily: 'monospace',
                          }}
                        >
                          {srv.billingType === 'ONE_TIME' ? 'ONE-TIME' : 'MONTHLY'}
                        </span>
                      </td>

                      {/* Deliverable Description */}
                      <td style={{ padding: '1rem', color: '#aaa', fontSize: '0.82rem', lineHeight: 1.4 }}>
                        {isEditing ? (
                          <textarea
                            value={editDeliverable}
                            onChange={(e) => setEditDeliverable(e.target.value)}
                            rows={3}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              background: '#1a1a1a',
                              border: '1px solid #38bdf8',
                              borderRadius: '0.3rem',
                              color: '#fff',
                              fontSize: '0.82rem',
                            }}
                          />
                        ) : (
                          srv.deliverable
                        )}
                      </td>

                      {/* Turnaround */}
                      <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editTurnaround}
                            onChange={(e) => setEditTurnaround(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.4rem',
                              background: '#1a1a1a',
                              border: '1px solid #38bdf8',
                              borderRadius: '0.3rem',
                              color: '#fff',
                              fontSize: '0.82rem',
                            }}
                          />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#888', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                            <Clock size={12} />
                            <span>{srv.turnaround}</span>
                          </div>
                        )}
                      </td>

                      {/* Price */}
                      <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                        {isEditing ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <span style={{ color: '#888' }}>₹</span>
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(Number(e.target.value))}
                              style={{
                                width: '85px',
                                padding: '0.4rem',
                                background: '#1a1a1a',
                                border: '1px solid #38bdf8',
                                borderRadius: '0.3rem',
                                color: '#fff',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                              }}
                            />
                          </div>
                        ) : (
                          <div style={{ fontFamily: 'monospace', fontWeight: 800, color: '#fff', fontSize: '1rem' }}>
                            ₹{srv.price.toLocaleString('en-IN')}
                            <span style={{ fontSize: '0.7rem', color: '#888', display: 'block', fontWeight: 400 }}>
                              {srv.unitLabel || (srv.billingType === 'MONTHLY' ? '/month' : 'fixed')}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Active Status Toggle */}
                      <td style={{ padding: '1rem' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(srv)}
                          disabled={isSaving}
                          title={isActive ? 'Click to deactivate' : 'Click to activate'}
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
                              onClick={() => handleSaveService(srv.id)}
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
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                              }}
                            >
                              <Save size={13} />
                              <span>{isSaving ? 'Saving...' : 'Save'}</span>
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
                              title="Cancel"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(srv)}
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
                              onClick={() => handleResetService(srv.id)}
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
                {filteredServices.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
                      No matching services found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
