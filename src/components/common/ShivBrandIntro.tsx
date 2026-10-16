'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShivBrandSignature from './ShivBrandSignature';
import styles from './ShivBrandIntro.module.css';

interface ShivBrandIntroProps {
  forceShow?: boolean;
  onFinish?: () => void;
}

const STORAGE_KEY = 'shiv_brand_intro_seen';

export default function ShivBrandIntro({ forceShow = false, onFinish }: ShivBrandIntroProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dismiss = useCallback(() => {
    setIsVisible(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Ignore storage errors in private browsing / sandboxes
    }
    if (onFinish) {
      onFinish();
    }
  }, [onFinish]);

  useEffect(() => {
    setMounted(true);

    // Check if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && !forceShow) {
      return;
    }

    // Check session storage
    let hasSeenIntro = false;
    try {
      hasSeenIntro = sessionStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      hasSeenIntro = false;
    }

    if (forceShow || !hasSeenIntro) {
      setIsVisible(true);
    }
  }, [forceShow]);

  // Handle Escape key to skip
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, dismiss]);

  // Prevent scrolling while intro is active
  useEffect(() => {
    if (isVisible) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isVisible]);

  // Auto-dismiss after 2.4s if not already dismissed
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      dismiss();
    }, 2400);

    return () => clearTimeout(timer);
  }, [isVisible, dismiss]);

  if (!mounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="shiv-brand-intro-overlay"
          className={styles.overlay}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-label="SHIV Brand Introduction"
        >
          <div className={styles.backgroundGradients} />

          <button
            type="button"
            onClick={dismiss}
            className={styles.skipBtn}
            aria-label="Skip intro animation"
          >
            <span>Skip</span>
            <kbd className={styles.skipKbd}>Esc</kbd>
          </button>

          <div className={styles.contentWrapper}>
            <ShivBrandSignature
              size={180}
              showTagline={true}
              onAnimationComplete={() => {
                // Intro signature finished, allow a brief lingering moment then dismiss
                setTimeout(dismiss, 350);
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
