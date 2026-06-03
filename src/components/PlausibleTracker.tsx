import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Plausible auto-capture is disabled in index.html; we fire pageviews manually
// here so ONLY the public, traffic-facing pages are tracked. Internal areas
// (admin/client login, dashboards, settings, contracts, proposals) are never sent.
const PRIVATE_PREFIXES = [
  '/dashboard',
  '/auth',
  '/client',
  '/settings',
  '/tool',
  '/admin', // covers /admin/ and /admins
  '/contracts',
  '/invoices',
  '/order-management',
  '/proposal',
  '/sign/',
  '/signed/',
];

declare global {
  interface Window {
    plausible?: (...args: unknown[]) => void;
  }
}

export default function PlausibleTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    const isPrivate = PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p));
    if (isPrivate) return;
    window.plausible?.('pageview');
  }, [pathname]);
  return null;
}
