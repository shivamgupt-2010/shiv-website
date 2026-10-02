'use client';

import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense, useRef } from 'react';
import { submitContactForm } from '@/app/actions/publicContact';
import styles from './page.module.css';
import { WhatsAppIcon, YouTubeIcon, InstagramIcon, EmailIcon } from '@/components/common/SocialIcons';

function ContactForm() {
  const searchParams = useSearchParams();
  const [subject, setSubject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const subjectParam = searchParams.get('subject');
    if (subjectParam) {
      setSubject(subjectParam);
    }
  }, [searchParams]);

  const action = async (formData: FormData) => {
    setIsSubmitting(true);
    const result = await submitContactForm(formData);
    setIsSubmitting(false);
    
    if (result.success) {
      setIsSuccess(true);
      formRef.current?.reset();
    } else {
      alert(result.error || 'Something went wrong');
    }
  };

  if (isSuccess) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#111', borderRadius: '0.5rem' }}>
        <h2 style={{ color: '#00ff00', marginBottom: '1rem' }}>Message Sent</h2>
        <p style={{ color: '#888' }}>Thank you for reaching out. We will get back to you shortly.</p>
        <button 
          onClick={() => setIsSuccess(false)}
          style={{ marginTop: '2rem', padding: '0.75rem 1.5rem', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>Name</label>
        <input 
          type="text" 
          id="name" 
          name="name"
          className={styles.input} 
          required 
          placeholder="Your Name"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input 
          type="email" 
          id="email" 
          name="email"
          className={styles.input} 
          required 
          placeholder="your@email.com"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="subject" className={styles.label}>Subject</label>
        <select 
          id="subject" 
          name="subject"
          className={styles.select}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        >
          <option value="">Select a topic</option>
          <option value="business-starter">Business Starter Package</option>
          <option value="business-professional">Business Professional Package</option>
          <option value="business-custom">Custom Business Project</option>
          <option value="software">Software Inquiry</option>
          <option value="products">Physical Products & Bulk Orders</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="message" className={styles.label}>Message</label>
        <textarea 
          id="message" 
          name="message"
          className={styles.textarea} 
          required 
          placeholder="Tell us about your project..."
        ></textarea>
      </div>

      <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

export default function ContactClient() {
  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className={styles.header}>
          <h1 className={styles.title}>Start a Project.</h1>
          <p className={styles.subtitle}>Let's build something extraordinary together.</p>
        </div>

        {/* Direct Channels */}
        <div className={styles.channelsGrid}>
          <a
            href="https://wa.me/91626686575"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.channelCard} ${styles.channelWhatsApp}`}
          >
            <div className={styles.channelIcon}>
              <WhatsAppIcon size={22} />
            </div>
            <div className={styles.channelInfo}>
              <span className={styles.channelLabel}>WhatsApp</span>
              <span className={styles.channelValue}>+91 626686575</span>
            </div>
          </a>

          <a
            href="mailto:shivamgupta@gmail.com"
            className={`${styles.channelCard} ${styles.channelEmail}`}
          >
            <div className={styles.channelIcon}>
              <EmailIcon size={22} />
            </div>
            <div className={styles.channelInfo}>
              <span className={styles.channelLabel}>Email</span>
              <span className={styles.channelValue}>shivamgupta@gmail.com</span>
            </div>
          </a>

          <a
            href="https://youtube.com/@shiv-techofficial?si=waKKCQ642kNOw5Hu"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.channelCard} ${styles.channelYoutube}`}
          >
            <div className={styles.channelIcon}>
              <YouTubeIcon size={22} />
            </div>
            <div className={styles.channelInfo}>
              <span className={styles.channelLabel}>YouTube</span>
              <span className={styles.channelValue}>@shiv-techofficial</span>
            </div>
          </a>

          <a
            href="https://www.instagram.com/shivam_gupta0310/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.channelCard} ${styles.channelInstagram}`}
          >
            <div className={styles.channelIcon}>
              <InstagramIcon size={22} />
            </div>
            <div className={styles.channelInfo}>
              <span className={styles.channelLabel}>Instagram</span>
              <span className={styles.channelValue}>@shivam_gupta0310</span>
            </div>
          </a>
        </div>

        <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>Loading form...</div>}>
          <ContactForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
