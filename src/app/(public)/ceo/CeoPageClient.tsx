'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  MapPin,
  ExternalLink,
  Code,
  Sparkles,
  Bot,
  Smartphone,
  Layers,
  Shirt,
  Database,
  ArrowRight,
  Music,
  GraduationCap,
  Briefcase,
  Mail,
  MessageCircle,
  Cpu,
  Target,
  Award,
} from 'lucide-react';
import { YouTubeIcon, InstagramIcon, WhatsAppIcon, EmailIcon } from '@/components/common/SocialIcons';
import styles from './page.module.css';

interface PhotoPerspective {
  id: 'portrait' | 'candid';
  label: string;
  badge: string;
  sub: string;
  primarySrc: string;
  alt: string;
}

const photoPerspectives: PhotoPerspective[] = [
  {
    id: 'portrait',
    label: 'Official Portrait',
    badge: 'SHIV / FOUNDER & CEO',
    sub: 'SHIVAM GUPTA • @shivam',
    primarySrc: '/images/ceo/shivam-gupta-portrait.png',
    alt: 'Shivam Gupta — Founder and CEO of SHIV (Official Portrait)',
  },
  {
    id: 'candid',
    label: 'Candid & Lifestyle',
    badge: 'FOUNDER & ARCHITECT',
    sub: 'SHIVAM GUPTA • BURHAR, MP',
    primarySrc: '/images/ceo/shivam-gupta-candid.jpg',
    alt: 'Shivam Gupta — Founder and CEO of SHIV (Candid & Lifestyle)',
  },
];

export default function CeoPageClient() {
  const [activePerspective, setActivePerspective] = useState<PhotoPerspective>(photoPerspectives[0]);

  return (
    <div className={styles.container}>
      <div className={styles.bgGlowTop} />
      <div className={styles.bgGrid} />

      <main className={styles.contentWrapper}>
        {/* ================================================================= */}
        {/* 1. HERO SECTION */}
        {/* ================================================================= */}
        <section className={styles.heroSection}>
          <motion.div
            className={styles.heroLeft}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className={styles.badgeRow}>
              <div className={styles.verifiedPill}>
                <span className={styles.verifiedDot} />
                <span>SHIV Identity: @shivam</span>
              </div>
              <div className={styles.locationPill}>
                <MapPin size={13} color="#38bdf8" />
                <span>Burhar, Madhya Pradesh, India</span>
              </div>
            </div>

            <div>
              <h1 className={styles.ceoTitle}>Shivam Gupta</h1>
              <div className={styles.ceoRole}>Founder &amp; Chief Executive Officer, SHIV</div>
            </div>

            <p className={styles.ceoTagline}>
              Technologist, software architect, and polymath builder. Driven by first-principles engineering
              to create autonomous AI tools, minimal operating environments, and high-velocity digital products.
            </p>

            {/* Key Executive Metrics */}
            <div className={styles.executiveMetrics}>
              <div className={styles.metricItem}>
                <span className={styles.metricValue}>SHIV Core</span>
                <span className={styles.metricLabel}>Unified Ecosystem</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricValue}>95+ Assets</span>
                <span className={styles.metricLabel}>Templates &amp; UI Tools</span>
              </div>
              <div className={styles.metricItem}>
                <span className={styles.metricValue}>JEE 2028</span>
                <span className={styles.metricLabel}>AIR 1 Ambition</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className={styles.heroActions}>
              <a
                href="https://www.youtube.com/@shivam13gupta"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primaryBtn}
              >
                <YouTubeIcon size={16} />
                <span>YouTube @shivam13gupta</span>
                <ExternalLink size={13} />
              </a>

              <a
                href="https://www.instagram.com/shivam_gupta0310/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryBtn}
              >
                <InstagramIcon size={16} />
                <span>Instagram @shivam_gupta0310</span>
                <ExternalLink size={13} />
              </a>

              <a
                href="https://wa.me/916267686575?text=Hello%20Shivam,%20reaching%20out%20via%20SHIV%20CEO%20page."
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryBtn}
                title="Direct WhatsApp"
              >
                <WhatsAppIcon size={16} />
                <span>+91 62676 86575</span>
                <ExternalLink size={13} />
              </a>

              <a
                href="mailto:admin@shiv.com"
                className={styles.secondaryBtn}
                title="Direct Inquiries"
              >
                <EmailIcon size={16} />
                <span>admin@shiv.com</span>
              </a>
            </div>
          </motion.div>

          {/* Photo Showcase Frame */}
          <motion.div
            className={styles.photoContainer}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          >
            <div className={styles.photoFrame}>
              <div 
                className={styles.photoBlurBg} 
                style={{ backgroundImage: `url(${activePerspective.primarySrc})` }} 
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={activePerspective.id}
                src={activePerspective.primarySrc}
                alt={activePerspective.alt}
                title={activePerspective.alt}
                loading="eager"
                fetchPriority="high"
                itemProp="image"
                className={styles.photoMainImg}
              />

              <div className={styles.photoOverlayBadge}>
                <div>
                  <div className={styles.photoBadgeTitle}>{activePerspective.badge}</div>
                  <div className={styles.photoBadgeSub}>{activePerspective.sub}</div>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 10px #38bdf8' }} />
              </div>
            </div>

            {/* Perspective Switcher */}
            <div className={styles.perspectiveRow}>
              {photoPerspectives.map((p) => {
                const isActive = activePerspective.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActivePerspective(p)}
                    className={`${styles.perspectiveBtn} ${isActive ? styles.perspectiveBtnActive : ''}`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* ================================================================= */}
        {/* 2. EXECUTIVE VISION & PHILOSOPHY */}
        {/* ================================================================= */}
        <section style={{ marginBottom: '4.5rem' }}>
          <div style={{
            background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.75), rgba(7, 9, 14, 0.9))',
            border: '1px solid rgba(56, 189, 248, 0.15)',
            borderRadius: '1.25rem',
            padding: '2.25rem',
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)',
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Foundational Distinction
            </span>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', margin: '0.35rem 0 1rem' }}>
              &ldquo;My name is Shivam Gupta. SHIV is the company.&rdquo;
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.7, margin: 0, maxWidth: '960px' }}>
              SHIV is not merely a brand—it is a unified technology, software, and creative enterprise designed to
              transform ideas into tangible impact. As Founder and CEO, Shivam leads with an engineering-first philosophy:
              crafting systems that are technically deep, visually restrained, and functionally uncompromising.
              From autonomous AI backends to minimal launchers and handcrafted physical products, every creation reflects
              an obsession with quality and continuous evolution.
            </p>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 3. CONTRIBUTIONS & LEADERSHIP AT SHIV */}
        {/* ================================================================= */}
        <section style={{ marginBottom: '5rem' }}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionPretitle}>Architectural Leadership</span>
            <h2 className={styles.sectionMainTitle}>Contributions &amp; Ecosystem Vision</h2>
            <p className={styles.sectionSubtitle}>
              Directly conceiving, engineering, and directing the interconnected pillars of the SHIV enterprise.
            </p>
          </div>

          <div className={styles.ecosystemGrid}>
            {/* SHIV AI */}
            <div className={styles.ecosystemCard}>
              <div>
                <div className={styles.ecoHeader}>
                  <div className={styles.ecoIconBox} style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                    <Bot size={22} />
                  </div>
                  <span className={styles.ecoTag}>AI Systems</span>
                </div>
                <h3 className={styles.ecoTitle}>SHIV AI</h3>
                <p className={styles.ecoDesc}>
                  Autonomous AI infrastructure featuring multi-agent orchestration, FastAPI backends, Server-Sent Events (SSE)
                  streaming, multi-key provider fallback, and tools designed to execute complex research and automation tasks.
                </p>
              </div>
              <div className={styles.ecoPills}>
                <span className={styles.ecoPill}>FastAPI</span>
                <span className={styles.ecoPill}>Agents</span>
                <span className={styles.ecoPill}>Multi-Key Routing</span>
                <span className={styles.ecoPill}>Gemini &amp; Groq</span>
              </div>
            </div>

            {/* SHIV-OS & Launcher */}
            <div className={styles.ecosystemCard}>
              <div>
                <div className={styles.ecoHeader}>
                  <div className={styles.ecoIconBox} style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                    <Smartphone size={22} />
                  </div>
                  <span className={styles.ecoTag}>OS &amp; Mobile</span>
                </div>
                <h3 className={styles.ecoTitle}>SHIV Launcher</h3>
                <p className={styles.ecoDesc}>
                  Distraction-free Android interface designed for students, developers, and creators. Features minimal layouts,
                  app locking, digital wellbeing controls, and deep integration with SHIV Identity and AI assistance.
                </p>
              </div>
              <div className={styles.ecoPills}>
                <span className={styles.ecoPill}>Kotlin</span>
                <span className={styles.ecoPill}>Android SDK</span>
                <span className={styles.ecoPill}>PKCE OAuth</span>
                <span className={styles.ecoPill}>Zero Telemetry</span>
              </div>
            </div>

            {/* SHIV Shop & Digital Assets */}
            <div className={styles.ecosystemCard}>
              <div>
                <div className={styles.ecoHeader}>
                  <div className={styles.ecoIconBox} style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>
                    <Layers size={22} />
                  </div>
                  <span className={styles.ecoTag}>Digital Commerce</span>
                </div>
                <h3 className={styles.ecoTitle}>SHIV Marketplace</h3>
                <p className={styles.ecoDesc}>
                  Curated digital product catalogue offering 95+ production Next.js website templates, React UI components,
                  kinetic animations, and developer starter kits that accelerate high-velocity software production.
                </p>
              </div>
              <div className={styles.ecoPills}>
                <span className={styles.ecoPill}>Next.js 16</span>
                <span className={styles.ecoPill}>React 19</span>
                <span className={styles.ecoPill}>Turbopack</span>
                <span className={styles.ecoPill}>Prisma</span>
              </div>
            </div>

            {/* SHIV Identity & DB */}
            <div className={styles.ecosystemCard}>
              <div>
                <div className={styles.ecoHeader}>
                  <div className={styles.ecoIconBox} style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
                    <Database size={22} />
                  </div>
                  <span className={styles.ecoTag}>Auth Protocol</span>
                </div>
                <h3 className={styles.ecoTitle}>SHIV Identity</h3>
                <p className={styles.ecoDesc}>
                  Unified identity layer and account protocol that seamlessly connects users, devices, and permissions across
                  SHIV Launcher, SHIV AI, the digital storefront, and developer endpoints with single-token simplicity.
                </p>
              </div>
              <div className={styles.ecoPills}>
                <span className={styles.ecoPill}>RFC 7636 PKCE</span>
                <span className={styles.ecoPill}>RBAC</span>
                <span className={styles.ecoPill}>Supabase</span>
                <span className={styles.ecoPill}>@shivam</span>
              </div>
            </div>

            {/* SHIV Wear */}
            <div className={styles.ecosystemCard}>
              <div>
                <div className={styles.ecoHeader}>
                  <div className={styles.ecoIconBox} style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#fb923c' }}>
                    <Shirt size={22} />
                  </div>
                  <span className={styles.ecoTag}>Apparel &amp; Gear</span>
                </div>
                <h3 className={styles.ecoTitle}>SHIV Wear</h3>
                <p className={styles.ecoDesc}>
                  Physical apparel brand centered on continuous self-mastery and ambition. Heavyweight cyber streetwear
                  engineered for those who refuse to settle. The ethos: <em>Wear Your Journey</em>.
                </p>
              </div>
              <div className={styles.ecoPills}>
                <span className={styles.ecoPill}>Drop 001</span>
                <span className={styles.ecoPill}>Cyber Aesthetics</span>
                <span className={styles.ecoPill}>Streetwear</span>
              </div>
            </div>

            {/* Vertex Automations */}
            <div className={styles.ecosystemCard}>
              <div>
                <div className={styles.ecoHeader}>
                  <div className={styles.ecoIconBox} style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
                    <Briefcase size={22} />
                  </div>
                  <span className={styles.ecoTag}>Growth Agency</span>
                </div>
                <h3 className={styles.ecoTitle}>Vertex Automations</h3>
                <p className={styles.ecoDesc}>
                  Digital services and automation consultancy delivering bespoke high-conversion websites, Google Business
                  discovery setups, WhatsApp marketing funnels, and enterprise workflows for expanding companies.
                </p>
              </div>
              <div className={styles.ecoPills}>
                <span className={styles.ecoPill}>Business Growth</span>
                <span className={styles.ecoPill}>Local SEO</span>
                <span className={styles.ecoPill}>Custom Web</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. THE POLYMATH JOURNEY: MUSICSHIV & ACADEMIC RIGOR */}
        {/* ================================================================= */}
        <section className={styles.polymathSection}>
          {/* Musicshiv Card */}
          <div className={`${styles.polymathCard} ${styles.polymathCardMusic}`}>
            <div>
              <div className={styles.polymathBadge} style={{ background: 'rgba(244, 114, 182, 0.15)', color: '#f472b6', border: '1px solid rgba(244, 114, 182, 0.3)' }}>
                <Music size={14} />
                <span>Creative Identity • Musicshiv</span>
              </div>
              <h3 className={styles.polymathTitle}>Songwriting &amp; Indie-Pop</h3>
              <p className={styles.polymathText}>
                Beyond technology, Shivam creates music as <strong>Musicshiv</strong>. He focuses on warm, guitar-driven
                arrangements, nostalgic Hindi storytelling, and uplifting melodies that explore connection, longing, and hope.
                His artistic philosophy balances mathematical precision with deep emotional resonance.
              </p>

              <div className={styles.trackList}>
                <div className={styles.trackItem}>
                  <span className={styles.trackName}>Adhoora Safar</span>
                  <span className={styles.trackType}>Single • Hindi Indie</span>
                </div>
                <div className={styles.trackItem}>
                  <span className={styles.trackName}>Aahat (The Raah Trilogy)</span>
                  <span className={styles.trackType}>Part I • Story Series</span>
                </div>
                <div className={styles.trackItem}>
                  <span className={styles.trackName}>Darmiyan (The Raah Trilogy)</span>
                  <span className={styles.trackType}>Part II • Acoustic</span>
                </div>
              </div>
            </div>

            <a
              href="https://www.youtube.com/@shivam13gupta"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#f472b6',
                fontWeight: 700,
                fontSize: '0.85rem',
                textDecoration: 'none',
                marginTop: '1rem',
              }}
            >
              <span>Listen on YouTube Channel</span>
              <ArrowRight size={14} />
            </a>
          </div>

          {/* Academic Rigor Card */}
          <div className={`${styles.polymathCard} ${styles.polymathCardAcademic}`}>
            <div>
              <div className={styles.polymathBadge} style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                <GraduationCap size={14} />
                <span>Academic Rigor • JEE 2028</span>
              </div>
              <h3 className={styles.polymathTitle}>First-Principles Engineering</h3>
              <p className={styles.polymathText}>
                Currently pursuing Class 11 and targeting <strong>AIR 1 in JEE Advanced (2028)</strong>, Shivam applies
                the same rigorous problem-solving approach to mathematics and physics that he applies to system architecture.
                He treats scientific fundamentals not merely as an exam syllabus, but as the computational foundation for
                breakthrough software engineering.
              </p>

              <div style={{
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: '0.82rem',
                color: '#cbd5e1',
                lineHeight: 1.6,
              }}>
                <div style={{ fontWeight: 800, color: '#38bdf8', marginBottom: '0.3rem', letterSpacing: '0.04em' }}>
                  THE OPERATING PRINCIPLE:
                </div>
                <div>Deep Conceptual Knowledge → Academic Excellence → Unshakeable Engineering Foundation.</div>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: '#94a3b8' }}>
              Specialization: Advanced Mechanics • Calculus • Chemical Thermodynamics • Algorithms
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 5. VERIFIED SOCIAL MEDIA & IDENTITY CHANNELS */}
        {/* ================================================================= */}
        <section style={{ marginBottom: '5rem' }}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionPretitle}>Official Presence</span>
            <h2 className={styles.sectionMainTitle}>Connect &amp; Follow</h2>
            <p className={styles.sectionSubtitle}>
              Stay updated with software releases, musical journeys, behind-the-scenes engineering, and founder updates.
            </p>
          </div>

          <div className={styles.socialGrid}>
            {/* YouTube */}
            <a
              href="https://www.youtube.com/@shivam13gupta"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialCard}
            >
              <div className={styles.socialLeft}>
                <div className={styles.socialIconBox} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                  <YouTubeIcon size={22} />
                </div>
                <div>
                  <h4 className={styles.socialName}>YouTube</h4>
                  <div className={styles.socialHandle}>@shivam13gupta</div>
                </div>
              </div>
              <div className={styles.socialAction}>
                <ExternalLink size={16} />
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/shivam_gupta0310/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialCard}
            >
              <div className={styles.socialLeft}>
                <div className={styles.socialIconBox} style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
                  <InstagramIcon size={22} />
                </div>
                <div>
                  <h4 className={styles.socialName}>Instagram</h4>
                  <div className={styles.socialHandle}>@shivam_gupta0310</div>
                </div>
              </div>
              <div className={styles.socialAction}>
                <ExternalLink size={16} />
              </div>
            </a>

            {/* SHIV Identity */}
            <div className={styles.socialCard} style={{ cursor: 'default' }}>
              <div className={styles.socialLeft}>
                <div className={styles.socialIconBox} style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h4 className={styles.socialName}>SHIV Identity</h4>
                  <div className={styles.socialHandle}>@shivam (Verified)</div>
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#34d399', background: 'rgba(52, 211, 153, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                ROOT CEO
              </div>
            </div>

            {/* Direct WhatsApp */}
            <a
              href="https://wa.me/916267686575?text=Hello%20Shivam,%20reaching%20out%20via%20SHIV%20CEO%20page."
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialCard}
            >
              <div className={styles.socialLeft}>
                <div className={styles.socialIconBox} style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
                  <WhatsAppIcon size={22} />
                </div>
                <div>
                  <h4 className={styles.socialName}>Direct WhatsApp</h4>
                  <div className={styles.socialHandle}>+91 62676 86575</div>
                </div>
              </div>
              <div className={styles.socialAction}>
                <ExternalLink size={16} />
              </div>
            </a>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 6. EXECUTIVE CONTACT & PARTNERSHIPS */}
        {/* ================================================================= */}
        <section>
          <div className={styles.contactCallout}>
            <h2 className={styles.calloutTitle}>Let&apos;s Build What&apos;s Next</h2>
            <p className={styles.calloutDesc}>
              For strategic enterprise technology inquiries, software partnerships, or executive consultations,
              reach out directly through official channels.
            </p>
            <div className={styles.calloutBtns}>
              <a
                href="mailto:admin@shiv.com"
                className={styles.primaryBtn}
              >
                <EmailIcon size={16} />
                <span>Email: admin@shiv.com</span>
              </a>
              <Link
                href="/products"
                className={styles.secondaryBtn}
              >
                <span>Explore SHIV Store</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
