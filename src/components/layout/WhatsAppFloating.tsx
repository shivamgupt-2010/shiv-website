'use client';

import React from 'react';
import styles from './WhatsAppFloating.module.css';
import { WhatsAppIcon } from '@/components/common/SocialIcons';

export default function WhatsAppFloating() {
  return (
    <div className={styles.floatingContainer}>
      <a
        href="https://wa.me/91626686575?text=Hi%20SHIV,%20I'm%20reaching%20out%20from%20the%20SHIV%20Store."
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsappButton}
        aria-label="Chat with SHIV on WhatsApp"
        title="Chat on WhatsApp"
      >
        <span className={styles.pulseRing} />
        <WhatsAppIcon size={26} />
      </a>
      <div className={styles.tooltip}>
        Chat on WhatsApp (+91 626686575)
      </div>
    </div>
  );
}
