import type { Metadata } from 'next';
import LauncherClient from './LauncherClient';

export const metadata: Metadata = {
  title: 'SHIV Launcher — Minimalist Android Launcher | SHIV Store',
  description: 'SHIV Launcher: Minimal, distraction-free Android launcher designed from the ground up for speed, privacy, and full control. Join the beta waitlist.',
  keywords: ['SHIV launcher', 'minimal android launcher', 'SHIV software', 'SHIV store apps', 'distraction free launcher'],
};

export default function LauncherPage() {
  return <LauncherClient />;
}
