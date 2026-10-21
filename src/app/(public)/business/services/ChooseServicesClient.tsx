'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Check,
  Plus,
  Minus,
  Trash2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Layers,
  Package,
  Sliders,
  FileCode2,
  ShoppingCart,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { ServiceItem, ServiceCategory, POPULAR_ADDONS } from '@/lib/businessServicesData';
import { PackageItem, PackageCategory } from '@/lib/businessPackagesData';
import { submitServiceQuotation, QuotationSubmissionData } from '@/app/actions/submitServiceQuotation';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

interface Props {
  initialServices: ServiceItem[];
  categories: ServiceCategory[];
  initialPackages: PackageItem[];
  packageCategories: PackageCategory[];
}

interface CartItemState {
  service: ServiceItem;
  quantity: number;
}

export default function ChooseServicesClient({
  initialServices,
  categories,
  initialPackages,
  packageCategories,
}: Props) {
  const router = useRouter();
  const { addToCart, cartCount } = useCart();

  // Active Mode: 'packages' | 'builder' | 'custom'
  const [activeMode, setActiveMode] = useState<'packages' | 'builder' | 'custom'>('builder');

  // =========================================
  // STATE: OPTION 1 — PACKAGES
  // =========================================
  const [packageSearch, setPackageSearch] = useState('');
  const [selectedPkgCat, setSelectedPkgCat] = useState<number>(0); // 0 = ALL
  const [pkgBillingFilter, setPkgBillingFilter] = useState<'ALL' | 'ONE_TIME' | 'MONTHLY'>('ALL');
  const [addedPackages, setAddedPackages] = useState<{ [id: string]: boolean }>({});

  // =========================================
  // STATE: OPTION 2 — BUILD YOUR OWN
  // =========================================
  const [serviceSearch, setServiceSearch] = useState('');
  const [selectedServiceCat, setSelectedServiceCat] = useState<string>('ALL');
  const [serviceBillingFilter, setServiceBillingFilter] = useState<'ALL' | 'ONE_TIME' | 'MONTHLY'>('ALL');
  const [selectedServices, setSelectedServices] = useState<{ [id: string]: CartItemState }>({});
  const [selectedAddons, setSelectedAddons] = useState<{ [id: string]: boolean }>({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Builder Quotation Form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [timeline, setTimeline] = useState('Standard (1–2 weeks)');
  const [projectNotes, setProjectNotes] = useState('');
  const [exclusionsConfirmed, setExclusionsConfirmed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{
    leadId: string;
    waUrl: string;
  } | null>(null);

  // =========================================
  // STATE: OPTION 3 — CUSTOM SOLUTION
  // =========================================
  const [customScope, setCustomScope] = useState({
    projectType: 'Custom Web Application',
    budgetRange: '₹25,000 – ₹75,000',
    timelineExpectation: '2–4 weeks',
    description: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    clientCompany: '',
  });
  const [customSubmitting, setCustomSubmitting] = useState(false);
  const [customSuccess, setCustomSuccess] = useState<{ leadId: string; waUrl: string } | null>(null);
  const [customError, setCustomError] = useState<string | null>(null);

  // =========================================
  // FILTERING: PACKAGES
  // =========================================
  const filteredPackages = useMemo(() => {
    return initialPackages.filter((pkg) => {
      if (pkg.active === false) return false;
      if (selectedPkgCat !== 0 && pkg.categoryCode !== selectedPkgCat) return false;
      if (pkgBillingFilter !== 'ALL' && pkg.billingType !== pkgBillingFilter) return false;

      if (packageSearch.trim()) {
        const q = packageSearch.toLowerCase().trim();
        const matchesName = pkg.name.toLowerCase().includes(q);
        const matchesDesc = pkg.description.toLowerCase().includes(q);
        const matchesCat = pkg.categoryName.toLowerCase().includes(q);
        const matchesDeliverable = pkg.deliverables.some((d) => d.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesCat && !matchesDeliverable) return false;
      }
      return true;
    });
  }, [initialPackages, selectedPkgCat, pkgBillingFilter, packageSearch]);

  // Package category counts map
  const packageCategoryCounts = useMemo(() => {
    const counts: { [code: number]: number } = { 0: initialPackages.length };
    for (const pkg of initialPackages) {
      counts[pkg.categoryCode] = (counts[pkg.categoryCode] || 0) + 1;
    }
    return counts;
  }, [initialPackages]);

  // Handle Add Package to Cart
  const handleAddPackageToCart = (pkg: PackageItem, redirectToCheckout = false) => {
    addToCart({
      id: pkg.id,
      productId: pkg.id,
      name: pkg.name,
      slug: 'business/services',
      price: pkg.price,
      quantity: 1,
      variant: pkg.billingType === 'MONTHLY' ? 'Monthly Retainer' : 'One-Time Project',
    });

    setAddedPackages((prev) => ({ ...prev, [pkg.id]: true }));
    setTimeout(() => {
      setAddedPackages((prev) => ({ ...prev, [pkg.id]: false }));
    }, 2500);

    if (redirectToCheckout) {
      router.push('/checkout');
    }
  };

  // Pre-filled WhatsApp link for a package
  const getPackageWhatsAppUrl = (pkg: PackageItem) => {
    let msg = `Hi SHIV, I'm interested in booking the *${pkg.name}* (${pkg.priceFormatted}).\n\n`;
    msg += `*Included Scope:*\n`;
    pkg.deliverables.forEach((d) => {
      msg += `• ${d}\n`;
    });
    msg += `\nPlease let me know the onboarding steps and timeline!`;
    return `https://wa.me/916267686575?text=${encodeURIComponent(msg)}`;
  };

  // =========================================
  // FILTERING: SERVICES (BUILD YOUR OWN)
  // =========================================
  const filteredServices = useMemo(() => {
    return initialServices.filter((srv) => {
      if (srv.active === false) return false;
      if (serviceBillingFilter !== 'ALL' && srv.billingType !== serviceBillingFilter) return false;
      if (selectedServiceCat !== 'ALL' && srv.categoryCode !== selectedServiceCat) return false;

      if (serviceSearch.trim()) {
        const q = serviceSearch.toLowerCase().trim();
        const matchesTitle = srv.title.toLowerCase().includes(q);
        const matchesDeliverable = srv.deliverable.toLowerCase().includes(q);
        const matchesCategory = srv.categoryTitle.toLowerCase().includes(q) || srv.categoryName.toLowerCase().includes(q);
        const matchesCode = srv.categoryCode.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDeliverable && !matchesCategory && !matchesCode) return false;
      }
      return true;
    });
  }, [initialServices, serviceBillingFilter, selectedServiceCat, serviceSearch]);

  // Group filtered services by Category Code
  const groupedServices = useMemo(() => {
    const groups: { [catCode: string]: ServiceItem[] } = {};
    for (const srv of filteredServices) {
      if (!groups[srv.categoryCode]) {
        groups[srv.categoryCode] = [];
      }
      groups[srv.categoryCode].push(srv);
    }
    return groups;
  }, [filteredServices]);

  // Category counts map for individual services
  const serviceCategoryCounts = useMemo(() => {
    const counts: { [code: string]: number } = { ALL: initialServices.length };
    for (const srv of initialServices) {
      counts[srv.categoryCode] = (counts[srv.categoryCode] || 0) + 1;
    }
    return counts;
  }, [initialServices]);

  // Running Totals Calculation (Strict Separation of One-Time vs Monthly)
  const { oneTimeTotal, monthlyTotal, totalItemsCount } = useMemo(() => {
    let oneTime = 0;
    let monthly = 0;
    let count = 0;

    Object.values(selectedServices).forEach((item) => {
      const itemSubtotal = item.service.price * item.quantity;
      if (item.service.billingType === 'ONE_TIME') {
        oneTime += itemSubtotal;
      } else {
        monthly += itemSubtotal;
      }
      count += item.quantity;
    });

    POPULAR_ADDONS.forEach((addon) => {
      if (selectedAddons[addon.id]) {
        oneTime += addon.price;
        count += 1;
      }
    });

    return { oneTimeTotal: oneTime, monthlyTotal: monthly, totalItemsCount: count };
  }, [selectedServices, selectedAddons]);

  // Cart operations for builder
  const handleToggleService = (service: ServiceItem) => {
    setSelectedServices((prev) => {
      const existing = prev[service.id];
      if (existing) {
        const next = { ...prev };
        delete next[service.id];
        return next;
      } else {
        return { ...prev, [service.id]: { service, quantity: 1 } };
      }
    });
  };

  const handleUpdateQuantity = (serviceId: string, delta: number) => {
    setSelectedServices((prev) => {
      const existing = prev[serviceId];
      if (!existing) return prev;
      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        const next = { ...prev };
        delete next[serviceId];
        return next;
      }
      return { ...prev, [serviceId]: { ...existing, quantity: newQty } };
    });
  };

  const handleRemoveService = (serviceId: string) => {
    setSelectedServices((prev) => {
      const next = { ...prev };
      delete next[serviceId];
      return next;
    });
  };

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddons((prev) => ({ ...prev, [addonId]: !prev[addonId] }));
  };

  const handleClearAll = () => {
    setSelectedServices({});
    setSelectedAddons({});
  };

  // Add all selected custom items directly to website global Cart
  const handleAddAllSelectedToGlobalCart = () => {
    Object.values(selectedServices).forEach((item) => {
      addToCart({
        id: `custom-${item.service.id}`,
        productId: item.service.id,
        name: item.service.title,
        slug: 'business/services',
        price: item.service.price,
        quantity: item.quantity,
        variant: item.service.billingType === 'MONTHLY' ? 'Monthly' : 'One-Time',
      });
    });

    POPULAR_ADDONS.filter((a) => selectedAddons[a.id]).forEach((addon) => {
      addToCart({
        id: `addon-${addon.id}`,
        productId: addon.id,
        name: addon.title,
        slug: 'business/services',
        price: addon.price,
        quantity: 1,
        variant: 'Project Add-on',
      });
    });

    router.push('/cart');
  };

  // Submit Quotation
  const handleSubmitQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!customerName || !customerPhone || !customerEmail) {
      setSubmitError('Please enter your Name, WhatsApp Phone Number, and Email.');
      return;
    }

    if (!exclusionsConfirmed) {
      setSubmitError('Please acknowledge the scope rules and third-party fee disclosures.');
      return;
    }

    if (totalItemsCount === 0) {
      setSubmitError('Please select at least one service to request a quotation.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: QuotationSubmissionData = {
        customerName,
        customerPhone,
        customerEmail,
        companyName,
        timeline,
        projectNotes,
        selectedServices: Object.values(selectedServices).map((item) => ({
          id: item.service.id,
          title: item.service.title,
          categoryName: item.service.categoryName,
          price: item.service.price,
          billingType: item.service.billingType,
          quantity: item.quantity,
          subtotal: item.service.price * item.quantity,
        })),
        selectedAddons: POPULAR_ADDONS.filter((a) => selectedAddons[a.id]).map((a) => ({
          id: a.id,
          title: a.title,
          price: a.price,
        })),
        oneTimeTotal,
        monthlyTotal,
        exclusionsConfirmed,
      };

      const res = await submitServiceQuotation(payload);

      if (res.success && res.leadId && res.waUrl) {
        setSubmissionResult({ leadId: res.leadId, waUrl: res.waUrl });
      } else {
        setSubmitError(res.error || 'Failed to submit quotation. Please try again.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Custom Solution Request
  const handleCustomSolutionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError(null);

    if (!customScope.clientName || !customScope.clientPhone || !customScope.clientEmail) {
      setCustomError('Please provide your name, WhatsApp phone number, and email.');
      return;
    }

    if (!customScope.description.trim()) {
      setCustomError('Please describe your project scope and objectives.');
      return;
    }

    setCustomSubmitting(true);

    try {
      const formattedMessage = `CUSTOM ENTERPRISE SOLUTION INQUIRY:\n\n` +
        `• Project Type: ${customScope.projectType}\n` +
        `• Target Budget: ${customScope.budgetRange}\n` +
        `• Timeline: ${customScope.timelineExpectation}\n\n` +
        `PROJECT BRIEF:\n${customScope.description}`;

      const payload: QuotationSubmissionData = {
        customerName: customScope.clientName,
        customerPhone: customScope.clientPhone,
        customerEmail: customScope.clientEmail,
        companyName: customScope.clientCompany,
        timeline: customScope.timelineExpectation,
        projectNotes: formattedMessage,
        selectedServices: [
          {
            id: 'custom-scoped-project',
            title: `Custom Solution (${customScope.projectType})`,
            categoryName: 'Custom Solutions',
            price: 14990,
            billingType: 'ONE_TIME',
            quantity: 1,
            subtotal: 14990,
          },
        ],
        selectedAddons: [],
        oneTimeTotal: 14990,
        monthlyTotal: 0,
        exclusionsConfirmed: true,
      };

      const res = await submitServiceQuotation(payload);

      if (res.success && res.leadId && res.waUrl) {
        setCustomSuccess({ leadId: res.leadId, waUrl: res.waUrl });
      } else {
        setCustomError(res.error || 'Failed to submit. Please try again.');
      }
    } catch (err: any) {
      setCustomError(err.message || 'An unexpected error occurred.');
    } finally {
      setCustomSubmitting(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* =========================================
            HERO HEADER
            ========================================= */}
        <header className={styles.hero}>
          <div className={styles.cyberBadge}>
            <span className={styles.pulseDot} />
            <span>SHIV Master Price Catalogue • Transparent Fixed Pricing</span>
          </div>

          <h1 className={styles.title}>
            Choose Your <span className={styles.gradientText}>Digital Growth Stack</span>
          </h1>

          <p className={styles.subtitle}>
            Explore our curated turnkey packages, assemble your custom engineering stack from 295+ deliverables, or request custom architectural scoping.
          </p>

          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>10</span>
              <span className={styles.statLabel}>Turnkey Packages</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>295+</span>
              <span className={styles.statLabel}>Custom Deliverables</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>₹990</span>
              <span className={styles.statLabel}>Starting Price</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>100%</span>
              <span className={styles.statLabel}>Zero Surprise Billing</span>
            </div>
          </div>
        </header>

        {/* =========================================
            3-OPTION SELECTION MODE SWITCHER
            ========================================= */}
        <div className={styles.modeSwitcherContainer}>
          <div className={styles.modeSwitcher}>
            <button
              type="button"
              className={`${styles.modeTab} ${activeMode === 'packages' ? styles.modeTabActive : ''}`}
              onClick={() => setActiveMode('packages')}
            >
              <div className={styles.modeIconWrap}>
                <Package size={18} />
              </div>
              <span className={styles.modeTabTitle}>Choose a Package</span>
              <span className={styles.modeTabSubtitle}>Curated complete turnkey bundles</span>
            </button>

            <button
              type="button"
              className={`${styles.modeTab} ${activeMode === 'builder' ? styles.modeTabActive : ''}`}
              onClick={() => setActiveMode('builder')}
            >
              <div className={styles.modeIconWrap}>
                <Sliders size={18} />
              </div>
              <span className={styles.modeTabTitle}>Build Your Own Package</span>
              <span className={styles.modeTabSubtitle}>Pick from 295+ deliverables</span>
            </button>

            <button
              type="button"
              className={`${styles.modeTab} ${activeMode === 'custom' ? styles.modeTabActive : ''}`}
              onClick={() => setActiveMode('custom')}
            >
              <div className={styles.modeIconWrap}>
                <FileCode2 size={18} />
              </div>
              <span className={styles.modeTabTitle}>Request a Custom Solution</span>
              <span className={styles.modeTabSubtitle}>Bespoke project scoping & quote</span>
            </button>
          </div>
        </div>

        {/* =========================================
            OPTION 1: CHOOSE A PACKAGE
            ========================================= */}
        {activeMode === 'packages' && (
          <div>
            {/* Packages Search & Filter Toolbar */}
            <div className={styles.controlsCard}>
              <div className={styles.searchRow}>
                <div className={styles.searchBox}>
                  <Search className={styles.searchIcon} size={18} />
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search packages by name, deliverables, or keywords (e.g. Website, SEO, Reels, AI, Dashboard)..."
                    value={packageSearch}
                    onChange={(e) => setPackageSearch(e.target.value)}
                  />
                  {packageSearch && (
                    <button
                      type="button"
                      className={styles.clearSearchBtn}
                      onClick={() => setPackageSearch('')}
                      title="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div className={styles.filterGroup}>
                  <button
                    type="button"
                    className={`${styles.filterBtn} ${pkgBillingFilter === 'ALL' ? styles.filterBtnActive : ''}`}
                    onClick={() => setPkgBillingFilter('ALL')}
                  >
                    All Packages ({initialPackages.length})
                  </button>
                  <button
                    type="button"
                    className={`${styles.filterBtn} ${pkgBillingFilter === 'ONE_TIME' ? styles.filterBtnActive : ''}`}
                    onClick={() => setPkgBillingFilter('ONE_TIME')}
                  >
                    One-Time Projects
                  </button>
                  <button
                    type="button"
                    className={`${styles.filterBtn} ${pkgBillingFilter === 'MONTHLY' ? styles.filterBtnActive : ''}`}
                    onClick={() => setPkgBillingFilter('MONTHLY')}
                  >
                    Monthly Retainers
                  </button>
                </div>
              </div>

              {/* Package Categories Horizontal Bar */}
              <div className={styles.categoriesBar}>
                <button
                  type="button"
                  className={`${styles.categoryPill} ${selectedPkgCat === 0 ? styles.categoryPillActive : ''}`}
                  onClick={() => setSelectedPkgCat(0)}
                >
                  All Packages <span className={styles.categoryCount}>{packageCategoryCounts[0] || initialPackages.length}</span>
                </button>
                {packageCategories.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    className={`${styles.categoryPill} ${selectedPkgCat === c.code ? styles.categoryPillActive : ''}`}
                    onClick={() => setSelectedPkgCat(c.code)}
                  >
                    <span>{c.code}. {c.shortName}</span>
                    <span className={styles.categoryCount}>{packageCategoryCounts[c.code] || 0}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Packages Grid */}
            {filteredPackages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#0d1117', borderRadius: '1rem', border: '1px solid #222' }}>
                <Package size={48} style={{ color: '#555', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No packages matched your search</h3>
                <p style={{ color: '#888', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                  Try resetting your category or search filter.
                </p>
                <button
                  type="button"
                  className={styles.filterBtn}
                  onClick={() => {
                    setPackageSearch('');
                    setSelectedPkgCat(0);
                    setPkgBillingFilter('ALL');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className={styles.packagesGrid}>
                {filteredPackages.map((pkg) => {
                  const isAdded = !!addedPackages[pkg.id];
                  const categoryInfo = packageCategories.find((c) => c.code === pkg.categoryCode);

                  return (
                    <div
                      key={pkg.id}
                      className={`${styles.packageCard} ${pkg.featured ? styles.packageCardFeatured : ''}`}
                    >
                      <div>
                        <div className={styles.packageTopRow}>
                          <span
                            className={styles.packageCatPill}
                            style={{ color: categoryInfo?.badgeColor || '#38bdf8' }}
                          >
                            {pkg.categoryName}
                          </span>
                          {pkg.badge && (
                            <span className={styles.packageBadge}>{pkg.badge}</span>
                          )}
                        </div>

                        <h3 className={styles.packageTitle}>{pkg.name}</h3>

                        <div className={styles.packagePriceRow}>
                          <span className={styles.packagePriceAmount}>{pkg.priceFormatted}</span>
                          <span className={styles.packagePriceType}>
                            {pkg.billingType === 'MONTHLY' ? 'Monthly Retainer' : 'One-Time Fixed'}
                          </span>
                        </div>

                        <p className={styles.packageDesc}>{pkg.description}</p>

                        <ul className={styles.packageDeliverables}>
                          {pkg.deliverables.map((del, idx) => (
                            <li key={idx} className={styles.packageDeliverableItem}>
                              <Check size={14} />
                              <span>{del}</span>
                            </li>
                          ))}
                        </ul>

                        {pkg.scopeNotes && (
                          <div className={styles.packageScopeNote}>
                            <strong>Note:</strong> {pkg.scopeNotes}
                          </div>
                        )}
                      </div>

                      <div className={styles.packageActions}>
                        <div className={styles.packageMainActions}>
                          <button
                            type="button"
                            className={`${styles.pkgAddToCartBtn} ${isAdded ? styles.pkgAddToCartBtnAdded : ''}`}
                            onClick={() => handleAddPackageToCart(pkg, false)}
                          >
                            {isAdded ? (
                              <>
                                <Check size={14} />
                                <span>Added!</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart size={14} />
                                <span>Add to Cart</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            className={styles.pkgCheckoutBtn}
                            onClick={() => handleAddPackageToCart(pkg, true)}
                          >
                            <span>Book Now</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>

                        <a
                          href={getPackageWhatsAppUrl(pkg)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.pkgWaInquireBtn}
                        >
                          <MessageSquare size={14} />
                          <span>WhatsApp Inquiry (+91 6267686575)</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================
            OPTION 2: BUILD YOUR OWN PACKAGE
            ========================================= */}
        {activeMode === 'builder' && (
          <div>
            {/* Search & Category Toolbar */}
            <div className={styles.controlsCard}>
              <div className={styles.searchRow}>
                <div className={styles.searchBox}>
                  <Search className={styles.searchIcon} size={18} />
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search 295+ deliverables (e.g. WhatsApp button, Payment gateway, Reels, Logo, Cloud)..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                  />
                  {serviceSearch && (
                    <button
                      type="button"
                      className={styles.clearSearchBtn}
                      onClick={() => setServiceSearch('')}
                      title="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div className={styles.filterGroup}>
                  <button
                    type="button"
                    className={`${styles.filterBtn} ${serviceBillingFilter === 'ALL' ? styles.filterBtnActive : ''}`}
                    onClick={() => setServiceBillingFilter('ALL')}
                  >
                    All Billing
                  </button>
                  <button
                    type="button"
                    className={`${styles.filterBtn} ${serviceBillingFilter === 'ONE_TIME' ? styles.filterBtnActive : ''}`}
                    onClick={() => setServiceBillingFilter('ONE_TIME')}
                  >
                    One-Time Projects
                  </button>
                  <button
                    type="button"
                    className={`${styles.filterBtn} ${serviceBillingFilter === 'MONTHLY' ? styles.filterBtnActive : ''}`}
                    onClick={() => setServiceBillingFilter('MONTHLY')}
                  >
                    Monthly Retainers
                  </button>
                </div>
              </div>

              {/* Category Pills */}
              <div className={styles.categoriesBar}>
                <button
                  type="button"
                  className={`${styles.categoryPill} ${selectedServiceCat === 'ALL' ? styles.categoryPillActive : ''}`}
                  onClick={() => setSelectedServiceCat('ALL')}
                >
                  All Categories <span className={styles.categoryCount}>{serviceCategoryCounts.ALL || 295}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.code}
                    type="button"
                    className={`${styles.categoryPill} ${selectedServiceCat === cat.code ? styles.categoryPillActive : ''}`}
                    onClick={() => setSelectedServiceCat(cat.code)}
                  >
                    <span>Cat {cat.code}: {cat.title}</span>
                    <span className={styles.categoryCount}>{serviceCategoryCounts[cat.code] || 0}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Services Grouped by Category */}
            {Object.keys(groupedServices).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#0d1117', borderRadius: '1rem', border: '1px solid #222' }}>
                <Layers size={48} style={{ color: '#555', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No matching deliverables found</h3>
                <p style={{ color: '#888', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                  Try resetting your category or search filter.
                </p>
                <button
                  type="button"
                  className={styles.filterBtn}
                  onClick={() => {
                    setServiceSearch('');
                    setSelectedServiceCat('ALL');
                    setServiceBillingFilter('ALL');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              categories
                .filter((cat) => groupedServices[cat.code] && groupedServices[cat.code].length > 0)
                .map((cat) => {
                  const servicesInCat = groupedServices[cat.code];
                  return (
                    <section key={cat.code} className={styles.categorySection} id={`cat-${cat.code.toLowerCase()}`}>
                      <div className={styles.categorySectionHeader}>
                        <div className={styles.categoryTitleBlock}>
                          <span className={styles.categoryCodeLabel} style={{ color: cat.color }}>
                            Category {cat.code} • {cat.title}
                          </span>
                          <h2 className={styles.categoryHeading}>{cat.name}</h2>
                        </div>
                        {cat.scopeRules && (
                          <div className={styles.categoryScopeText}>
                            <strong>Scope Rules:</strong> {cat.scopeRules}
                          </div>
                        )}
                      </div>

                      <div className={styles.servicesGrid}>
                        {servicesInCat.map((srv) => {
                          const isSelected = !!selectedServices[srv.id];
                          const currentQty = selectedServices[srv.id]?.quantity || 1;
                          const isVariableQty = srv.unit && srv.unit !== 'fixed' && srv.unit !== 'per_month';

                          return (
                            <div
                              key={srv.id}
                              className={`${styles.serviceCard} ${isSelected ? styles.serviceCardSelected : ''}`}
                            >
                              <div>
                                <div className={styles.cardTop}>
                                  <span className={styles.catBadge} style={{ color: cat.color }}>
                                    Cat {srv.categoryCode}
                                  </span>
                                  {srv.billingType === 'ONE_TIME' ? (
                                    <span className={styles.billingBadgeOneTime}>One-Time</span>
                                  ) : (
                                    <span className={styles.billingBadgeMonthly}>Monthly</span>
                                  )}
                                </div>

                                <h3 className={styles.cardTitle}>{srv.title}</h3>
                                <p className={styles.cardDeliverable}>{srv.deliverable}</p>

                                <div className={styles.turnaroundBadge}>
                                  <Clock size={13} />
                                  <span>{srv.turnaround}</span>
                                </div>
                              </div>

                              <div className={styles.cardBottom}>
                                <div className={styles.priceBlock}>
                                  <span className={styles.priceFormatted}>
                                    ₹{srv.price.toLocaleString('en-IN')}
                                  </span>
                                  <span className={styles.priceUnit}>
                                    {srv.unitLabel || (srv.billingType === 'MONTHLY' ? 'per month' : 'fixed project')}
                                  </span>
                                </div>

                                {isSelected ? (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    {isVariableQty && (
                                      <div className={styles.qtyControls}>
                                        <button
                                          type="button"
                                          className={styles.qtyBtn}
                                          onClick={() => handleUpdateQuantity(srv.id, -1)}
                                          title="Decrease quantity"
                                        >
                                          <Minus size={12} />
                                        </button>
                                        <span className={styles.qtyNum}>{currentQty}</span>
                                        <button
                                          type="button"
                                          className={styles.qtyBtn}
                                          onClick={() => handleUpdateQuantity(srv.id, 1)}
                                          title="Increase quantity"
                                        >
                                          <Plus size={12} />
                                        </button>
                                      </div>
                                    )}
                                    <button
                                      type="button"
                                      className={`${styles.addBtn} ${styles.addBtnActive}`}
                                      onClick={() => handleToggleService(srv)}
                                      title="Remove from selection"
                                    >
                                      <Check size={14} /> Added
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    className={styles.addBtn}
                                    onClick={() => handleToggleService(srv)}
                                  >
                                    <Plus size={14} /> Add to Stack
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })
            )}

            {/* Popular Add-ons Section */}
            <section className={styles.addonsSection}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <Sparkles size={20} style={{ color: '#f59e0b' }} />
                <h2 className={styles.addonsTitle} style={{ margin: 0 }}>
                  Optional Upgrades & Accelerators
                </h2>
              </div>
              <p className={styles.addonsSubtitle}>
                Add high-impact extras to your order. Guaranteed 48-hour prototype delivery, source code handover, or VIP founder support.
              </p>

              <div className={styles.addonsGrid}>
                {POPULAR_ADDONS.map((addon) => {
                  const isChecked = !!selectedAddons[addon.id];
                  return (
                    <div
                      key={addon.id}
                      className={`${styles.addonCard} ${isChecked ? styles.addonCardActive : ''}`}
                      onClick={() => handleToggleAddon(addon.id)}
                    >
                      <input
                        type="checkbox"
                        className={styles.addonCheckbox}
                        checked={isChecked}
                        onChange={() => {}}
                      />
                      <div className={styles.addonContent}>
                        <span className={styles.addonName}>{addon.title}</span>
                        <span className={styles.addonPrice}>+₹{addon.price.toLocaleString('en-IN')}</span>
                        <p className={styles.addonDesc}>{addon.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* =========================================
            OPTION 3: REQUEST A CUSTOM SOLUTION
            ========================================= */}
        {activeMode === 'custom' && (
          <div className={styles.customSolutionCard}>
            <div className={styles.customSolutionHeader}>
              <h2 className={styles.customSolutionTitle}>Request a Custom Scoped Solution</h2>
              <p className={styles.customSolutionSubtitle}>
                Have a large-scale project, enterprise platform, or unique operational requirement? Submit your brief for custom architectural scoping.
              </p>
            </div>

            {customSuccess ? (
              <div className={styles.successCard}>
                <div className={styles.successIcon}>
                  <CheckCircle2 size={36} />
                </div>
                <h4 style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: 0 }}>
                  Custom Solution Request Registered!
                </h4>
                <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                  Thank you, <strong style={{ color: '#fff' }}>{customScope.clientName}</strong>. Your custom project brief has been logged with reference ID:
                </p>
                <div style={{ background: '#111', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontFamily: 'monospace', color: '#38bdf8', fontSize: '1rem', border: '1px dashed #38bdf8' }}>
                  REF: #{customSuccess.leadId.slice(-8).toUpperCase()}
                </div>
                <p style={{ color: '#888', fontSize: '0.85rem' }}>
                  Founder Shivam Gupta will review your architecture requirements. Click below to discuss your project immediately on WhatsApp.
                </p>
                <a
                  href={customSuccess.waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.waSubmitBtn}
                  style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
                >
                  <MessageSquare size={18} />
                  <span>Connect with Founder on WhatsApp (+91 6267686575)</span>
                </a>
              </div>
            ) : (
              <form className={styles.quoteForm} onSubmit={handleCustomSolutionSubmit}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Project Architecture Type *</label>
                    <select
                      className={styles.formSelect}
                      value={customScope.projectType}
                      onChange={(e) => setCustomScope({ ...customScope, projectType: e.target.value })}
                    >
                      <option value="Custom Web Application">Custom Web Application</option>
                      <option value="AI Autonomous Agent / Chatbot Workflow">AI Autonomous Agent / Chatbot Workflow</option>
                      <option value="Multi-Vendor E-Commerce Platform">Multi-Vendor E-Commerce Platform</option>
                      <option value="Mobile Application (Flutter / React Native)">Mobile Application (Flutter / React Native)</option>
                      <option value="Enterprise ERP / Inventory Portal">Enterprise ERP / Inventory Portal</option>
                      <option value="Cloud Architecture & Migration">Cloud Architecture & Migration</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Target Budget Range *</label>
                    <select
                      className={styles.formSelect}
                      value={customScope.budgetRange}
                      onChange={(e) => setCustomScope({ ...customScope, budgetRange: e.target.value })}
                    >
                      <option value="₹15,000 – ₹30,000">₹15,000 – ₹30,000</option>
                      <option value="₹30,000 – ₹75,000">₹30,000 – ₹75,000</option>
                      <option value="₹75,000 – ₹1,50,000">₹75,000 – ₹1,50,000</option>
                      <option value="₹1,50,000+ (Enterprise)">₹1,50,000+ (Enterprise)</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Expected Delivery Timeline</label>
                  <select
                    className={styles.formSelect}
                    value={customScope.timelineExpectation}
                    onChange={(e) => setCustomScope({ ...customScope, timelineExpectation: e.target.value })}
                  >
                    <option value="Urgent (< 2 weeks priority)">Urgent (&lt; 2 weeks priority)</option>
                    <option value="2–4 weeks">2–4 weeks</option>
                    <option value="1–3 months">1–3 months</option>
                    <option value="Ongoing Engineering Retainer">Ongoing Engineering Retainer</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Project Brief & Requirements *</label>
                  <textarea
                    required
                    rows={5}
                    className={styles.formTextarea}
                    placeholder="Describe your workflows, user roles, external API integrations, reference platforms, and expected launch date..."
                    value={customScope.description}
                    onChange={(e) => setCustomScope({ ...customScope, description: e.target.value })}
                  />
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Your Name *</label>
                    <input
                      type="text"
                      required
                      className={styles.formInput}
                      placeholder="e.g. Shivam Gupta"
                      value={customScope.clientName}
                      onChange={(e) => setCustomScope({ ...customScope, clientName: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>WhatsApp / Mobile *</label>
                    <input
                      type="tel"
                      required
                      className={styles.formInput}
                      placeholder="e.g. 6267686575"
                      value={customScope.clientPhone}
                      onChange={(e) => setCustomScope({ ...customScope, clientPhone: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email Address *</label>
                    <input
                      type="email"
                      required
                      className={styles.formInput}
                      placeholder="e.g. admin@shiv.com"
                      value={customScope.clientEmail}
                      onChange={(e) => setCustomScope({ ...customScope, clientEmail: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Company / Business Name</label>
                    <input
                      type="text"
                      className={styles.formInput}
                      placeholder="e.g. SHIV Store"
                      value={customScope.clientCompany}
                      onChange={(e) => setCustomScope({ ...customScope, clientCompany: e.target.value })}
                    />
                  </div>
                </div>

                {customError && (
                  <div style={{ color: '#ff4a4a', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertCircle size={16} />
                    <span>{customError}</span>
                  </div>
                )}

                <div className={styles.submitActions}>
                  <button
                    type="submit"
                    className={styles.primarySubmitBtn}
                    disabled={customSubmitting}
                  >
                    {customSubmitting ? (
                      <span>Submitting Brief...</span>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Submit Project Brief for Scoping</span>
                      </>
                    )}
                  </button>

                  <a
                    href="https://wa.me/916267686575?text=Hi%20SHIV%2C%20I%20have%20a%20custom%20enterprise%20project%20inquiry%20and%20would%20like%20to%20discuss%20architecture%20and%20scoping."
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.waSubmitBtn}
                  >
                    <MessageSquare size={16} />
                    <span>Discuss Directly on WhatsApp (+91 6267686575)</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* =========================================
          FLOATING DOCK FOR OPTION 2 (BUILDER)
          ========================================= */}
      <AnimatePresence>
        {activeMode === 'builder' && totalItemsCount > 0 && (
          <motion.div
            className={styles.floatingDock}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 250 }}
          >
            <div className={styles.dockContainer}>
              <div className={styles.dockLeft}>
                <div className={styles.dockItemsBadge}>
                  <Layers size={14} />
                  <span>{totalItemsCount} item{totalItemsCount > 1 ? 's' : ''} in stack</span>
                </div>

                <div className={styles.dockTotalsGroup}>
                  <div className={styles.dockTotalItem}>
                    <span className={styles.dockTotalLabel}>One-Time Investment</span>
                    <span className={styles.dockTotalValueOneTime}>
                      ₹{oneTimeTotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {monthlyTotal > 0 && (
                    <div className={styles.dockTotalItem}>
                      <span className={styles.dockTotalLabel}>Monthly Retainer</span>
                      <span className={styles.dockTotalValueMonthly}>
                        + ₹{monthlyTotal.toLocaleString('en-IN')}/mo
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.dockRight}>
                <button
                  type="button"
                  className={styles.clearCartBtn}
                  onClick={handleClearAll}
                  title="Clear selection"
                >
                  Clear
                </button>
                <button
                  type="button"
                  className={styles.pkgAddToCartBtn}
                  onClick={handleAddAllSelectedToGlobalCart}
                  title="Add all items to site cart"
                >
                  <ShoppingCart size={15} />
                  <span>Add to Cart ({cartCount})</span>
                </button>
                <button
                  type="button"
                  className={styles.reviewBtn}
                  onClick={() => setIsDrawerOpen(true)}
                >
                  <span>Review & Inquire</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================
          SLIDE-OVER REVIEW DRAWER
          ========================================= */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className={styles.modalOverlay} onClick={() => !isSubmitting && setIsDrawerOpen(false)}>
            <motion.div
              className={styles.drawer}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.drawerHeader}>
                <h3 className={styles.drawerTitle}>
                  {submissionResult ? 'Quotation Confirmed' : 'Your Custom Stack Breakdown'}
                </h3>
                <button
                  type="button"
                  className={styles.closeDrawerBtn}
                  onClick={() => setIsDrawerOpen(false)}
                  disabled={isSubmitting}
                >
                  <X size={18} />
                </button>
              </div>

              <div className={styles.drawerBody}>
                {submissionResult ? (
                  <div className={styles.successCard}>
                    <div className={styles.successIcon}>
                      <CheckCircle2 size={36} />
                    </div>
                    <h4 style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: 0 }}>
                      Quotation Successfully Registered!
                    </h4>
                    <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                      Thank you, <strong style={{ color: '#fff' }}>{customerName}</strong>. Your customized project quotation has been saved under reference:
                    </p>
                    <div style={{ background: '#111', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontFamily: 'monospace', color: '#38bdf8', fontSize: '1rem', border: '1px dashed #38bdf8' }}>
                      REF: #{submissionResult.leadId.slice(-8).toUpperCase()}
                    </div>

                    <div className={styles.quoteSummaryBox} style={{ width: '100%', textAlign: 'left', marginTop: '1rem' }}>
                      <div className={styles.summaryTotalRow}>
                        <span className={styles.summaryTotalLabel}>One-Time Services:</span>
                        <span className={styles.summaryTotalAmount}>₹{oneTimeTotal.toLocaleString('en-IN')}</span>
                      </div>
                      {monthlyTotal > 0 && (
                        <div className={styles.summaryTotalRow} style={{ marginTop: '0.4rem' }}>
                          <span className={styles.summaryTotalLabel}>Monthly Retainer:</span>
                          <span className={styles.summaryMonthlyAmount}>₹{monthlyTotal.toLocaleString('en-IN')}/month</span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', marginTop: '1rem' }}>
                      <a
                        href={submissionResult.waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.waSubmitBtn}
                        style={{ padding: '1rem', fontSize: '1rem' }}
                      >
                        <MessageSquare size={18} />
                        <span>Connect on WhatsApp (+91 6267686575)</span>
                      </a>
                      <button
                        type="button"
                        className={styles.clearCartBtn}
                        onClick={() => {
                          handleClearAll();
                          setSubmissionResult(null);
                          setIsDrawerOpen(false);
                        }}
                      >
                        Close & Start New Selection
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#888', marginBottom: '0.6rem', fontFamily: 'monospace' }}>
                        Selected Deliverables ({Object.keys(selectedServices).length})
                      </h4>
                      <div className={styles.selectedItemsList}>
                        {Object.values(selectedServices).map((item) => (
                          <div key={item.service.id} className={styles.selectedItemRow}>
                            <div className={styles.selectedItemLeft}>
                              <span className={styles.selectedItemTitle}>{item.service.title}</span>
                              <div className={styles.selectedItemMeta}>
                                <span>Cat {item.service.categoryCode}</span>
                                <span>•</span>
                                <span>{item.service.billingType === 'ONE_TIME' ? 'One-Time' : 'Monthly'}</span>
                              </div>
                            </div>

                            <div className={styles.selectedItemRight}>
                              <span className={styles.selectedItemPrice}>
                                ₹{(item.service.price * item.quantity).toLocaleString('en-IN')}
                                {item.service.billingType === 'MONTHLY' ? '/mo' : ''}
                              </span>
                              <button
                                type="button"
                                className={styles.removeItemBtn}
                                onClick={() => handleRemoveService(item.service.id)}
                                title="Remove item"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}

                        {POPULAR_ADDONS.filter((a) => selectedAddons[a.id]).map((addon) => (
                          <div key={addon.id} className={styles.selectedItemRow} style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                            <div className={styles.selectedItemLeft}>
                              <span className={styles.selectedItemTitle}>✨ {addon.title}</span>
                              <div className={styles.selectedItemMeta}>
                                <span style={{ color: '#f59e0b' }}>Project Upgrade Add-on</span>
                              </div>
                            </div>
                            <div className={styles.selectedItemRight}>
                              <span className={styles.selectedItemPrice}>
                                +₹{addon.price.toLocaleString('en-IN')}
                              </span>
                              <button
                                type="button"
                                className={styles.removeItemBtn}
                                onClick={() => handleToggleAddon(addon.id)}
                                title="Remove add-on"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={styles.quoteSummaryBox}>
                      <div className={styles.summaryTotalRow}>
                        <span className={styles.summaryTotalLabel}>Total One-Time Investment:</span>
                        <span className={styles.summaryTotalAmount}>₹{oneTimeTotal.toLocaleString('en-IN')}</span>
                      </div>
                      {monthlyTotal > 0 && (
                        <>
                          <div className={styles.summaryDivider} />
                          <div className={styles.summaryTotalRow}>
                            <span className={styles.summaryTotalLabel}>Ongoing Monthly Retainer:</span>
                            <span className={styles.summaryMonthlyAmount}>₹{monthlyTotal.toLocaleString('en-IN')}/month</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className={styles.exclusionsBox}>
                      <div className={styles.exclusionsTitle}>
                        <ShieldCheck size={16} />
                        <span>Scope & Third-Party Expense Transparency</span>
                      </div>
                      <p style={{ margin: 0 }}>
                        All listed prices cover SHIV development, engineering setup, custom coding, and configuration labor.
                        Third-party subscriptions (custom domains, web servers, official WhatsApp Business API conversation credits,
                        paid Shopify/WooCommerce plugins, ad budgets on Meta/Google) are billed at actuals directly by their providers.
                      </p>
                    </div>

                    <form className={styles.quoteForm} onSubmit={handleSubmitQuotation}>
                      <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Your Name *</label>
                          <input
                            type="text"
                            required
                            className={styles.formInput}
                            placeholder="e.g. Shivam Gupta"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>WhatsApp / Mobile *</label>
                          <input
                            type="tel"
                            required
                            className={styles.formInput}
                            placeholder="e.g. 6267686575"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Email Address *</label>
                          <input
                            type="email"
                            required
                            className={styles.formInput}
                            placeholder="e.g. shivamgupta@gmail.com"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Business / Brand Name</label>
                          <input
                            type="text"
                            className={styles.formInput}
                            placeholder="e.g. SHIV Store"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Project Turnaround Timeline</label>
                        <select
                          className={styles.formSelect}
                          value={timeline}
                          onChange={(e) => setTimeline(e.target.value)}
                        >
                          <option value="Standard (1–2 weeks)">Standard (1–2 weeks)</option>
                          <option value="Urgent (< 48 hours priority)">Urgent (&lt; 48 hours priority)</option>
                          <option value="Within 1 month">Within 1 month</option>
                          <option value="Flexible / Exploration">Flexible / Exploration</option>
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Project Scope & Custom Notes</label>
                        <textarea
                          className={styles.formTextarea}
                          placeholder="Tell us about your target audience, existing accounts, reference websites, or special requirements..."
                          value={projectNotes}
                          onChange={(e) => setProjectNotes(e.target.value)}
                        />
                      </div>

                      <div className={styles.termsCheckRow}>
                        <input
                          type="checkbox"
                          id="exclusionsCheck2"
                          checked={exclusionsConfirmed}
                          onChange={(e) => setExclusionsConfirmed(e.target.checked)}
                          style={{ marginTop: '0.2rem', accentColor: '#38bdf8' }}
                        />
                        <label htmlFor="exclusionsCheck2">
                          I understand that third-party charges (domains, hosting, APIs, ad spend) are billed at actuals directly by their providers.
                        </label>
                      </div>

                      {submitError && (
                        <div style={{ color: '#ff4a4a', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <AlertCircle size={16} />
                          <span>{submitError}</span>
                        </div>
                      )}

                      <div className={styles.submitActions}>
                        <button
                          type="submit"
                          className={styles.primarySubmitBtn}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span>Logging Quotation...</span>
                          ) : (
                            <>
                              <Send size={18} />
                              <span>Submit Quotation Request</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          className={styles.pkgAddToCartBtn}
                          onClick={handleAddAllSelectedToGlobalCart}
                          style={{ padding: '0.85rem', justifyContent: 'center' }}
                        >
                          <ShoppingCart size={16} />
                          <span>Add Selection to Cart & Checkout ({totalItemsCount} items)</span>
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
