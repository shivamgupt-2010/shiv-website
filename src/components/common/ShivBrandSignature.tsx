'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './ShivBrandSignature.module.css';

interface ShivBrandSignatureProps {
  size?: number;
  showTagline?: boolean;
  onAnimationComplete?: () => void;
  speedMultiplier?: number;
}

export default function ShivBrandSignature({
  size = 200,
  showTagline = true,
  onAnimationComplete,
  speedMultiplier = 1,
}: ShivBrandSignatureProps) {
  const baseDuration = 1.0 / speedMultiplier;

  return (
    <div className={styles.container}>
      {/* Ambient Pulsing Glow behind the Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 0.85, 0.6], scale: [0.8, 1.15, 1.05] }}
        transition={{ duration: baseDuration * 1.6, ease: 'easeOut' }}
        className={styles.ambientGlow}
        style={{ width: size * 1.2, height: size * 1.2 }}
      />

      {/* Primary SVG Symbol */}
      <div className={styles.svgWrapper} style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 512 512"
          width="100%"
          height="100%"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Background squircle gradient */}
            <linearGradient id="shivSquircleBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0e131f" />
              <stop offset="100%" stopColor="#07090e" />
            </linearGradient>

            {/* Signature Cyber S Gradient */}
            <linearGradient id="shivSGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f2fe" />
              <stop offset="35%" stopColor="#38bdf8" />
              <stop offset="70%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>

            {/* Connecting Flow Ribbon Gradient */}
            <linearGradient id="flowRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.8" />
            </linearGradient>

            {/* Squircle Border Gradient */}
            <linearGradient id="squircleBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.75" />
            </linearGradient>

            {/* Neon Glow Filter */}
            <filter id="shivNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Sharp Glow Filter for Light Sweeps */}
            <filter id="sweepGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. Base Squircle Badge with Path Drawing */}
          <motion.rect
            x="28"
            y="28"
            width="456"
            height="456"
            rx="118"
            fill="url(#shivSquircleBg)"
            stroke="url(#squircleBorderGrad)"
            strokeWidth="10"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: baseDuration * 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
          />

          {/* 2. Continuous Dynamic Connecting Orbit Flow Beneath the S */}
          <motion.path
            d="M 90 420 C 170 475, 342 475, 422 420 C 460 395, 465 340, 420 300 C 375 260, 260 250, 180 270"
            fill="none"
            stroke="url(#flowRibbonGrad)"
            strokeWidth="16"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.9, 0.7] }}
            transition={{
              duration: baseDuration * 1.1,
              delay: baseDuration * 0.25,
              ease: 'easeInOut',
            }}
            filter="url(#shivNeonGlow)"
          />

          {/* 3. The Iconic Monogram S - Precise SVG Path Draw Animation */}
          <motion.path
            d="M 345 155 L 210 155 C 165 155 140 180 140 220 C 140 260 170 275 220 290 L 292 312 C 342 327 372 345 372 385 C 372 425 345 450 300 450 L 165 450"
            fill="none"
            stroke="url(#shivSGrad)"
            strokeWidth="50"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: baseDuration * 1.1,
              delay: baseDuration * 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            filter="url(#shivNeonGlow)"
          />

          {/* 4. Restrained Light Sweep / Connected Light Beads */}
          {/* Cyan Beacon Point at Top Right */}
          <motion.circle
            cx="375"
            cy="155"
            r="20"
            fill="#00f2fe"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0.95] }}
            transition={{
              duration: baseDuration * 0.5,
              delay: baseDuration * 0.75,
              ease: 'easeOut',
            }}
            filter="url(#sweepGlow)"
          />

          {/* Emerald Terminal Anchor Point at Bottom Left */}
          <motion.circle
            cx="135"
            cy="450"
            r="16"
            fill="#34d399"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0.95] }}
            transition={{
              duration: baseDuration * 0.5,
              delay: baseDuration * 0.95,
              ease: 'easeOut',
            }}
            filter="url(#sweepGlow)"
          />

          {/* Sweeping Light Star Particle along connecting ribbon */}
          <motion.circle
            r="6"
            fill="#ffffff"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              cx: [100, 256, 420],
              cy: [430, 470, 420],
            }}
            transition={{
              duration: baseDuration * 0.9,
              delay: baseDuration * 0.6,
              ease: 'easeInOut',
            }}
            filter="url(#sweepGlow)"
          />
        </svg>
      </div>

      {/* 5. Polished Wordmark Reveal */}
      <motion.div
        className={styles.wordmark}
        initial={{ opacity: 0, y: 15, letterSpacing: '0.08em' }}
        animate={{ opacity: 1, y: 0, letterSpacing: '0.22em' }}
        transition={{
          duration: baseDuration * 0.7,
          delay: baseDuration * 0.85,
          ease: 'easeOut',
        }}
      >
        <span className={styles.wordmarkLetter}>S</span>
        <span className={styles.wordmarkLetter}>H</span>
        <span className={styles.wordmarkLetter}>I</span>
        <span className={styles.wordmarkLetter}>V</span>
      </motion.div>

      {/* 6. Tagline: "Ideas into Impact." */}
      {showTagline && (
        <motion.div
          className={styles.tagline}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: baseDuration * 0.6,
            delay: baseDuration * 1.15,
            ease: 'easeOut',
          }}
          onAnimationComplete={onAnimationComplete}
        >
          <span className={styles.taglineDot} />
          <span className={styles.taglineGradientText}>Ideas into Impact</span>
          <span className={styles.taglineDot} />
        </motion.div>
      )}
    </div>
  );
}
