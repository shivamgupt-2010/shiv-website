'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Code,
  Sparkles,
  Layers,
  ExternalLink,
  Eye,
  ShoppingCart,
  Check,
  Zap,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  Tag,
  Laptop,
  Server,
  Terminal,
  PackageCheck,
  AlertCircle,
  FileCode,
  Info,
  CheckCircle2,
  X,
  MessageCircle,
} from 'lucide-react';
import { MarketplaceTemplate, LicenseType, LICENSE_CONFIG, TEMPLATE_CATEGORIES } from '@/lib/templatesMarketplaceData';
import { useCart } from '@/context/CartContext';

interface SoftwarePageClientProps {
  software: any[];
  templates: MarketplaceTemplate[];
}

export default function SoftwarePageClient({ software, templates }: SoftwarePageClientProps) {
  const router = useRouter();
  const { addToCart, items } = useCart();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLicense, setSelectedLicense] = useState<LicenseType>('personal');
  const [previewTemplate, setPreviewTemplate] = useState<MarketplaceTemplate | null>(null);
  const [addedIds, setAddedIds] = useState<{ [key: string]: boolean }>({});

  const licenseInfo = LICENSE_CONFIG[selectedLicense];

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      // Must be active
      if (t.active === false) return false;

      // Category filter
      if (activeCategory !== 'all' && t.category !== activeCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const inName = t.name.toLowerCase().includes(q);
        const inDesc = t.description.toLowerCase().includes(q);
        const inSub = t.subcategory.toLowerCase().includes(q);
        const inTech = t.techStack.some((tech) => tech.toLowerCase().includes(q));
        if (!inName && !inDesc && !inSub && !inTech) return false;
      }

      return true;
    });
  }, [templates, activeCategory, searchQuery]);

  const calculatePrice = (basePrice: number) => {
    return Math.round(basePrice * licenseInfo.multiplier);
  };

  const handleAddToCart = (template: MarketplaceTemplate, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const finalPrice = calculatePrice(template.basePrice);
    const cartItemId = `${template.id}-${selectedLicense}`;

    addToCart({
      id: cartItemId,
      productId: template.id,
      name: template.name,
      slug: template.id,
      price: finalPrice,
      quantity: 1,
      variant: `${licenseInfo.name} (${licenseInfo.multiplier}x)`,
      customization: `Tech: ${template.techStack.slice(0, 3).join(', ')} | Category: ${template.subcategory}`,
    });

    setAddedIds((prev) => ({ ...prev, [cartItemId]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [cartItemId]: false }));
    }, 2200);
  };

  const handleBuyNow = (template: MarketplaceTemplate, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    handleAddToCart(template);
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-blue-600/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Official SHIV Marketplace
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
            Website Templates &amp; Developer Assets
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed">
            Production-ready website templates, UI component kits, backend APIs, and developer toolkits. Built for high performance, modern architecture, and immediate deployment.
          </p>

          {/* Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 text-xs text-zinc-300 font-medium">
            <span className="flex items-center gap-1.5 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant Source Code Delivery
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800">
              <Zap className="w-4 h-4 text-amber-400" /> Clean, Documented Architecture
            </span>
            <span className="flex items-center gap-1.5 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> Free Bug Fix Guarantee
            </span>
          </div>
        </div>

        {/* License Selector & Customization Banner */}
        <div className="mb-10 bg-gradient-to-r from-zinc-900/90 to-zinc-900/50 border border-zinc-800/80 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* License Switcher */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold tracking-wide text-zinc-300 uppercase">
                  Select Your License Tier
                </span>
                <span className="text-[11px] text-zinc-500">
                  (Prices dynamically adjust below)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(['personal', 'commercial', 'extended'] as LicenseType[]).map((type) => {
                  const cfg = LICENSE_CONFIG[type];
                  const isSelected = selectedLicense === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedLicense(type)}
                      className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                        isSelected
                          ? 'bg-blue-600/15 border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                          : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-blue-400' : 'text-zinc-200'}`}>
                          {cfg.name}
                        </span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {cfg.multiplier}x
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-snug line-clamp-2">
                        {cfg.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customization Callout */}
            <div className="lg:max-w-xs flex flex-col justify-between bg-zinc-950/70 border border-blue-500/20 rounded-xl p-3.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
                <MessageCircle className="w-4 h-4" />
                Need Customization by SHIV?
              </div>
              <p className="text-[11px] text-zinc-400 mb-3">
                Want our engineers to customize, integrate your brand, or deploy this template? We provide custom turnkey delivery.
              </p>
              <a
                href="https://wa.me/91626686575?text=Hi%20SHIV,%20I%20am%20interested%20in%20customizing%20a%20website%20template%20for%20my%20business."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
              >
                Chat on WhatsApp <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {TEMPLATE_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px] sm:min-w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, tech, or feature..."
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-6 px-1">
          <span>
            Showing <strong className="text-white">{filteredTemplates.length}</strong> products
            {activeCategory !== 'all' && ` in ${TEMPLATE_CATEGORIES.find((c) => c.id === activeCategory)?.label}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </span>
          <span className="text-zinc-500">
            Active Tier: <strong className="text-blue-400">{licenseInfo.name}</strong>
          </span>
        </div>

        {/* Product Cards Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800/80">
            <FileCode className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-zinc-300">No products found</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              We couldn't find any templates matching your search criteria. Try searching for other keywords like "React", "API", "Landing", or select a different category.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-medium transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => {
              const currentPrice = calculatePrice(template.basePrice);
              const cartItemId = `${template.id}-${selectedLicense}`;
              const isAdded = addedIds[cartItemId];

              return (
                <div
                  key={template.id}
                  className="group relative flex flex-col justify-between bg-zinc-900/60 hover:bg-zinc-900/90 border border-zinc-800/80 hover:border-zinc-700/80 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-black/40"
                >
                  {/* Top Bar: Subcategory & Badge */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-semibold tracking-wide text-blue-400/90 uppercase">
                        {template.subcategory}
                      </span>
                      {template.badge ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 uppercase">
                          {template.badge}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-zinc-500">
                          {template.version}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {template.name}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-xs text-zinc-400 line-clamp-3 leading-relaxed min-h-[50px]">
                      {template.description}
                    </p>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {template.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/50 text-[10px] font-medium text-zinc-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Deliverables snippet */}
                    <div className="mt-3 pt-3 border-t border-zinc-800/60 space-y-1">
                      {template.fileContents.slice(0, 2).map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom: Price, Demo Link, and Purchase */}
                  <div className="mt-5 pt-4 border-t border-zinc-800/80">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <div className="text-xl font-extrabold text-white">
                          ₹{currentPrice.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-zinc-500">
                          {licenseInfo.name} ({licenseInfo.multiplier}x)
                        </div>
                      </div>

                      {/* Live Demo or Preview button */}
                      <div className="flex items-center gap-2">
                        {template.demoUrl ? (
                          <a
                            href={template.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1 rounded-lg border border-blue-500/20"
                          >
                            <Eye className="w-3.5 h-3.5" /> Demo
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPreviewTemplate(template)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-800/70 hover:bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-700/50"
                          >
                            <Info className="w-3.5 h-3.5" /> Details
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Buttons: Add to Cart & Buy Now */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(template, e)}
                        className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 border ${
                          isAdded
                            ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                            : 'bg-zinc-800/90 hover:bg-zinc-700/90 border-zinc-700 text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Added!
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleBuyNow(template, e)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all duration-200"
                      >
                        Buy Now
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Standalone Software Products Section (if any DB software exists) */}
        {software && software.length > 0 && (
          <div className="mt-20 pt-12 border-t border-zinc-800/80">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-blue-400 tracking-wider uppercase">
                Custom Applications &amp; Standalone Software
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                SHIV Desktop &amp; Platform Software
              </h2>
              <p className="text-xs text-zinc-400 mt-2">
                Production-grade applications and utilities maintained by SHIV Technologies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {software.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        {item.status?.replace('_', ' ') || 'AVAILABLE'}
                      </span>
                      <span className="text-xs font-mono text-zinc-500">v{item.version || '1.0.0'}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{item.name}</h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                    {item.websiteLink ? (
                      <a
                        href={item.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300"
                      >
                        Visit Website <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    ) : item.downloadLink ? (
                      <a
                        href={item.downloadLink}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                      >
                        Download Build <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-zinc-500 italic">Available soon</span>
                    )}

                    <a
                      href="https://wa.me/91626686575?text=Hi%20SHIV,%20I%20have%20an%20enquiry%20regarding%20software%20downloads."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-400 hover:text-white"
                    >
                      Enquire via WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Digital Products Policy & Trust Notice */}
        <div className="mt-20 bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 border border-zinc-800/90 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Instant Digital Fulfillment &amp; Licensing Terms
              </div>
              <h3 className="text-lg font-bold text-white">
                All Digital Product Purchases are Final &amp; Backed by Support
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Because digital templates, source code repositories, and UI kits provide immediate and irrevocable intellectual property access, all sales are non-refundable. Please verify tech stack compatibility, documentation, and live preview demos before purchasing. If you encounter any bugs or code errors, our engineering team provides direct support.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href="https://wa.me/91626686575?text=Hi%20SHIV,%20I%20need%20developer%20support%20for%20a%20template%20purchase."
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-xs font-bold text-center transition-colors"
              >
                Developer WhatsApp: 626686575
              </a>
              <Link
                href="/cart"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold text-center shadow-lg shadow-blue-600/30 transition-colors"
              >
                View Cart ({items.length})
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Details & Live Demo Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-950/70">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-blue-400 uppercase">
                      {previewTemplate.subcategory}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      v{previewTemplate.version}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {previewTemplate.name}
                  </h3>
                </div>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs text-zinc-300">
                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Overview
                  </h4>
                  <p className="text-zinc-400 leading-relaxed">
                    {previewTemplate.description}
                  </p>
                </div>

                {/* Tech Stack */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Tech Stack &amp; Compatibility
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {previewTemplate.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-200 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Included Deliverables */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                    Files &amp; Deliverables Included
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800">
                    {previewTemplate.fileContents.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Licensing Breakdown */}
                <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-300">
                      Selected License: {licenseInfo.name}
                    </span>
                    <span className="font-mono text-emerald-400 font-bold text-sm">
                      ₹{calculatePrice(previewTemplate.basePrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    {licenseInfo.description} Includes complete source files, documentation, and free code patches.
                  </p>
                </div>

                {/* Live Demo Link notice */}
                {previewTemplate.demoUrl && (
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
                    <span className="text-zinc-300 font-medium">Interactive Live Preview</span>
                    <a
                      href={previewTemplate.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-bold"
                    >
                      Open Live Demo <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-colors"
                >
                  Close
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart(previewTemplate);
                    }}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold border border-zinc-700 transition-colors flex items-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleBuyNow(previewTemplate);
                    }}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-colors"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
