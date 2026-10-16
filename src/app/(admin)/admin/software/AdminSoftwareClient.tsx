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
import { updateSoftwareStatus, deleteSoftwareProduct } from '@/app/actions/adminSoftware';

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
        // Refresh page or state
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
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Code className="w-6 h-6 text-blue-400" /> Software &amp; Templates Manager
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage live demo links, screenshot previews, pricing, and active statuses across the ~95 digital marketplace templates.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'templates'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Marketplace Templates ({templates.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('apps')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'apps'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Standalone Apps ({software.length})
          </button>
        </div>
      </div>

      {/* Floating Notification */}
      {statusMessage && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-400" />
          )}
          {statusMessage.text}
        </div>
      )}

      {/* TEMPLATES TAB */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/70 p-4 rounded-xl border border-zinc-800">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {TEMPLATE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search template name, ID, subcategory..."
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Templates Table */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-400 uppercase tracking-wider font-semibold text-[10px]">
                    <th className="py-3 px-4">Template &amp; Subcategory</th>
                    <th className="py-3 px-3">Base Price</th>
                    <th className="py-3 px-3">Live Demo URL</th>
                    <th className="py-3 px-3">Screenshot URL</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredTemplates.map((template) => {
                    const isActive = template.active ?? true;
                    return (
                      <tr
                        key={template.id}
                        className={`hover:bg-zinc-800/40 transition-colors ${
                          !isActive ? 'opacity-50 bg-zinc-950/40' : ''
                        }`}
                      >
                        {/* Name & Subcategory */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            {template.name}
                            {template.badge && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                                {template.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-zinc-400 mt-0.5">
                            {template.subcategory} &bull; <span className="font-mono text-zinc-500">{template.id}</span>
                          </div>
                          <div className="flex gap-1 mt-1">
                            {template.techStack.slice(0, 3).map((tech) => (
                              <span key={tech} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Base Price */}
                        <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                          ₹{template.basePrice.toLocaleString('en-IN')}
                        </td>

                        {/* Live Demo URL */}
                        <td className="py-3 px-3 max-w-[180px] truncate">
                          {template.demoUrl ? (
                            <a
                              href={template.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline flex items-center gap-1 truncate"
                            >
                              <ExternalLink className="w-3 h-3 shrink-0" />
                              <span className="truncate">{template.demoUrl}</span>
                            </a>
                          ) : (
                            <span className="text-zinc-600 italic">None set</span>
                          )}
                        </td>

                        {/* Screenshot URL */}
                        <td className="py-3 px-3 max-w-[160px] truncate">
                          {template.screenshotUrl ? (
                            <a
                              href={template.screenshotUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:underline flex items-center gap-1 truncate"
                            >
                              <Eye className="w-3 h-3 shrink-0" />
                              <span className="truncate">{template.screenshotUrl}</span>
                            </a>
                          ) : (
                            <span className="text-zinc-600 italic">None set</span>
                          )}
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(template)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                              isActive
                                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400 hover:bg-rose-950/60 hover:text-rose-400'
                                : 'bg-rose-950/60 border-rose-500/40 text-rose-400 hover:bg-emerald-950/60 hover:text-emerald-400'
                            }`}
                          >
                            {isActive ? 'ACTIVE' : 'DISABLED'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingTemplate(template)}
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                              title="Edit Details, Demos &amp; Pricing"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleResetToDefault(template)}
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-500 hover:text-amber-400 transition-colors"
                              title="Reset to Master Default"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
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
        </div>
      )}

      {/* EDIT MODAL */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Edit Template Details</h3>
                <p className="text-xs text-zinc-400">{editingTemplate.name} ({editingTemplate.id})</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingTemplate(null)}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Base Price (INR ₹)</label>
                <input
                  type="number"
                  name="basePrice"
                  defaultValue={editingTemplate.basePrice}
                  required
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Live Demo URL</label>
                <input
                  type="url"
                  name="demoUrl"
                  placeholder="https://preview.your-domain.com"
                  defaultValue={editingTemplate.demoUrl || ''}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white"
                />
                <span className="text-[10px] text-zinc-500 mt-0.5 block">
                  Provide your hosted website or demo preview link.
                </span>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Screenshot / Image Preview URL</label>
                <input
                  type="text"
                  name="screenshotUrl"
                  placeholder="https://... or /images/templates/..."
                  defaultValue={editingTemplate.screenshotUrl || ''}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Badge (Optional)</label>
                <input
                  type="text"
                  name="badge"
                  placeholder="e.g. POPULAR, HOT, BESTSELLER"
                  defaultValue={editingTemplate.badge || ''}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingTemplate.description}
                  required
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
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
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Database Standalone Software</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950 text-zinc-400 uppercase tracking-wider font-semibold text-[10px]">
                    <th className="py-3 px-4">Software Name</th>
                    <th className="py-3 px-3">Version</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {software.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-800/40">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{item.name}</div>
                        <div className="text-[11px] text-zinc-400">{item.description}</div>
                      </td>
                      <td className="py-3 px-3 text-zinc-400">{item.version || '-'}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-bold">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={`/admin/software/${item.id}`}
                          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-bold"
                        >
                          Edit
                        </a>
                      </td>
                    </tr>
                  ))}
                  {software.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-zinc-500">
                        No database software records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
