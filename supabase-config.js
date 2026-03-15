// ============================================================
//  supabase-config.js — BGHQ Supabase Client
//  Imported as an ES module on all pages.
//  The anon key is safe for client-side use with proper RLS.
// ============================================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const supabase = createClient(
    "https://vimxwfrnoctujxfhiieb.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpbXh3ZnJub2N0dWp4ZmhpaWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NTExMjgsImV4cCI6MjA4OTEyNzEyOH0.gWYEz664om3tXszv69f0baZ29kxsw0LAYEV82uCal84"
);

// ── Helper: get current logged-in user's profile from `users` table ──────────
export async function getCurrentUserProfile() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

    if (error) {
        console.error('[BGHQ] Profile fetch error:', error.message);
        return null;
    }
    return data;
}

// ── Helper: redirect to login if no session ───────────────────────────────────
export async function requireAuth(redirectTo = 'login.html') {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = redirectTo;
        return null;
    }
    return session;
}

// ── Helper: compute days left from end date string ────────────────────────────
export function computeDaysLeft(endDateStr) {
    if (!endDateStr) return 0;
    const end  = new Date(endDateStr);
    const now  = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
}

// ── Helper: returns CSS class for days-left colouring ─────────────────────────
export function daysLeftClass(days) {
    if (days > 7)  return 'days-good';
    if (days >= 3) return 'days-warn';
    return 'days-danger';
}
