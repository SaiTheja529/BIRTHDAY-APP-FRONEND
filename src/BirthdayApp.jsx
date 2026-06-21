import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   DESIGN TOKENS
   Palette: Deep cosmic navy + violet + rose gold
   Type: Bricolage Grotesque (display) + Inter (body)
───────────────────────────────────────────────*/
const G = {
  import: `@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700&family=Inter:wght@400;500;600&display=swap');`,
  bg: "#080614",
  bg2: "#10082a",
  bg3: "#0c1528",
  surface: "rgba(255,255,255,0.055)",
  surfaceHover: "rgba(255,255,255,0.09)",
  border: "rgba(255,255,255,0.10)",
  borderHover: "rgba(192,132,252,0.45)",
  text: "#EDE9FF",
  muted: "rgba(237,233,255,0.5)",
  accent: "#A78BFA",
  accentBright: "#C084FC",
  rose: "#F472B6",
  amber: "#FBBF24",
  green: "#34D399",
  red: "#F87171",
};

const AVATAR_COLORS = [
  ["rgba(167,139,250,0.22)","#C084FC"],
  ["rgba(244,114,182,0.22)","#F472B6"],
  ["rgba(251,191,36,0.22)","#FBBF24"],
  ["rgba(52,211,153,0.20)","#34D399"],
  ["rgba(96,165,250,0.22)","#60A5FA"],
  ["rgba(251,146,60,0.22)","#FB923C"],
];

function avatarColor(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}

function initials(name) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function formatDate(d) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

function daysLabel(days) {
  if (days === 0) return { label: "🎂 Today!", cls: "today" };
  if (days <= 7) return { label: `in ${days}d`, cls: "soon" };
  return null;
}

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────*/
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700&family=Inter:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #080614; --bg2: #10082a; --bg3: #0c1528;
  --surface: rgba(255,255,255,0.055); --surface-h: rgba(255,255,255,0.09);
  --border: rgba(255,255,255,0.10); --border-h: rgba(192,132,252,0.45);
  --text: #EDE9FF; --muted: rgba(237,233,255,0.5);
  --accent: #A78BFA; --accent-b: #C084FC;
  --rose: #F472B6; --amber: #FBBF24; --green: #34D399; --red: #F87171;
  --r-sm: 10px; --r-md: 14px; --r-lg: 20px; --r-xl: 28px;
  --shadow-card: 0 8px 40px rgba(0,0,0,0.45);
  --shadow-glow: 0 0 40px rgba(167,139,250,0.12);
}

body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); -webkit-font-smoothing: antialiased; }

/* SCROLLBAR */
::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(167,139,250,0.3); border-radius: 99px; }

/* ── NAVBAR ─────────────────────────────────── */
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  background: rgba(8,6,20,0.82);
  backdrop-filter: blur(20px) saturate(1.4);
  border-bottom: 0.5px solid var(--border);
  padding: 0 2rem;
  height: 68px;
  display: flex; align-items: center; gap: 1.5rem;
}

.nav-logo {
  display: flex; align-items: center; gap: 10px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1.25rem; font-weight: 700; color: var(--text);
  text-decoration: none; white-space: nowrap; flex-shrink: 0;
}
.nav-logo-icon {
  width: 36px; height: 36px; border-radius: var(--r-sm);
  background: linear-gradient(135deg, #7C3AED, #EC4899);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; flex-shrink: 0;
}

.nav-links {
  display: flex; align-items: center; gap: 4px;
  list-style: none; flex-shrink: 0;
}
.nav-links button {
  background: none; border: none; cursor: pointer;
  font-family: 'Inter', sans-serif; font-size: 0.88rem; font-weight: 500;
  color: var(--muted); padding: 7px 14px; border-radius: var(--r-sm);
  transition: all 0.18s; display: flex; align-items: center; gap: 6px;
}
.nav-links button:hover { background: var(--surface); color: var(--text); }
.nav-links button.active { background: rgba(167,139,250,0.15); color: var(--accent-b); }

.nav-search {
  flex: 1; position: relative; max-width: 360px;
}
.nav-search input {
  width: 100%; background: rgba(255,255,255,0.06);
  border: 0.5px solid var(--border); border-radius: 99px;
  padding: 9px 16px 9px 40px;
  color: var(--text); font-size: 0.88rem; font-family: 'Inter', sans-serif;
  outline: none; transition: all 0.2s;
}
.nav-search input:focus { border-color: var(--border-h); background: rgba(167,139,250,0.08); }
.nav-search input::placeholder { color: var(--muted); }
.nav-search-icon {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  color: var(--muted); font-size: 15px; pointer-events: none;
}
.nav-search-shortcut {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  font-size: 0.7rem; color: var(--muted); background: rgba(255,255,255,0.07);
  padding: 2px 7px; border-radius: 5px; pointer-events: none; letter-spacing: 0.02em;
}

.nav-right { display: flex; align-items: center; gap: 10px; margin-left: auto; flex-shrink: 0; }

.nav-icon-btn {
  width: 38px; height: 38px; border-radius: var(--r-sm);
  background: var(--surface); border: 0.5px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--muted); font-size: 16px; transition: all 0.18s;
}
.nav-icon-btn:hover { background: var(--surface-h); color: var(--text); border-color: var(--border-h); }

.status-pill {
  display: flex; align-items: center; gap: 7px;
  background: var(--surface); border: 0.5px solid var(--border);
  border-radius: 99px; padding: 6px 14px;
  font-size: 0.78rem; font-weight: 500; color: var(--muted); cursor: pointer;
  transition: all 0.2s; white-space: nowrap;
}
.status-pill:hover { border-color: var(--border-h); color: var(--text); }
.status-pill .dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.dot-green { background: var(--green); box-shadow: 0 0 8px var(--green); }
.dot-amber { background: var(--amber); box-shadow: 0 0 8px var(--amber); }
.dot-red { background: var(--red); box-shadow: 0 0 8px var(--red); }

.btn-add-nav {
  display: flex; align-items: center; gap: 6px;
  background: linear-gradient(135deg, #7C3AED, #DB2777);
  border: none; border-radius: 99px; padding: 8px 18px;
  color: white; font-size: 0.86rem; font-weight: 600;
  font-family: 'Inter', sans-serif; cursor: pointer; transition: opacity 0.18s; white-space: nowrap;
}
.btn-add-nav:hover { opacity: 0.88; }

/* ── LAYOUT ────────────────────────────────── */
.app-shell {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 80% 50% at 20% 0%, rgba(124,58,237,0.12) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 80% 100%, rgba(236,72,153,0.09) 0%, transparent 60%),
    linear-gradient(160deg, var(--bg) 0%, var(--bg2) 50%, var(--bg3) 100%);
}

.page-content { padding: 100px 2rem 3rem; max-width: 1200px; margin: 0 auto; }

/* ── HERO ──────────────────────────────────── */
.hero { text-align: center; padding: 2.5rem 0 2rem; }
.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 0.78rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--accent-b); background: rgba(192,132,252,0.1);
  border: 0.5px solid rgba(192,132,252,0.25); border-radius: 99px; padding: 5px 14px;
  margin-bottom: 1.2rem;
}
.hero h1 {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 700; line-height: 1.1;
  letter-spacing: -0.02em; margin-bottom: 1rem;
}
.hero h1 span {
  background: linear-gradient(135deg, #C084FC 0%, #F472B6 50%, #FB923C 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.hero-sub { font-size: 1.05rem; color: var(--muted); max-width: 500px; margin: 0 auto 1.8rem; line-height: 1.65; }

/* ── STAT CARDS ────────────────────────────── */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 2.5rem; }

.stat-card {
  background: var(--surface); border: 0.5px solid var(--border);
  border-radius: var(--r-lg); padding: 1.4rem 1.2rem;
  position: relative; overflow: hidden; transition: all 0.25s;
  transform-style: preserve-3d;
}
.stat-card::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%);
  pointer-events: none;
}
.stat-card:hover {
  transform: translateY(-4px) perspective(600px) rotateX(2deg);
  border-color: var(--border-h); box-shadow: var(--shadow-glow);
}
.stat-icon {
  width: 38px; height: 38px; border-radius: var(--r-sm);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; margin-bottom: 0.9rem;
}
.stat-num {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 2rem; font-weight: 700; line-height: 1; margin-bottom: 4px;
}
.stat-label { font-size: 0.8rem; color: var(--muted); font-weight: 500; }
.stat-trend { font-size: 0.75rem; margin-top: 6px; color: var(--green); }

/* ── SECTION HEADER ─────────────────────────── */
.section-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1.2rem;
}
.section-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 1.1rem; font-weight: 600; color: var(--text);
}
.section-badge {
  font-size: 0.72rem; font-weight: 600; padding: 3px 10px;
  border-radius: 99px; background: rgba(167,139,250,0.12);
  color: var(--accent-b); border: 0.5px solid rgba(167,139,250,0.25);
}

/* ── PERSON CARDS ───────────────────────────── */
.people-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }

.person-card {
  background: var(--surface); border: 0.5px solid var(--border);
  border-radius: var(--r-lg); padding: 1.3rem;
  position: relative; overflow: hidden; transition: all 0.28s;
  transform-style: preserve-3d; cursor: default;
}
.person-card::after {
  content: ''; position: absolute; inset: 0; border-radius: var(--r-lg);
  background: linear-gradient(135deg, rgba(255,255,255,0.035) 0%, transparent 50%);
  pointer-events: none;
}
.person-card:hover {
  transform: translateY(-5px) perspective(800px) rotateX(2deg) rotateY(-1deg);
  border-color: var(--border-h);
  box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(167,139,250,0.1);
}
.person-card.today-card {
  border-color: rgba(251,191,36,0.5);
  background: rgba(251,191,36,0.05);
  animation: cardGlow 2.5s ease-in-out infinite;
}
@keyframes cardGlow {
  0%,100% { box-shadow: 0 0 0 rgba(251,191,36,0); }
  50% { box-shadow: 0 0 30px rgba(251,191,36,0.15); }
}
.person-card.soon-card { border-color: rgba(52,211,153,0.35); }

.card-top { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 1rem; }
.avatar {
  width: 46px; height: 46px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Bricolage Grotesque', sans-serif; font-size: 1rem; font-weight: 700;
}
.card-info { flex: 1; min-width: 0; }
.card-name { font-weight: 600; font-size: 0.98rem; color: var(--text); margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-email { font-size: 0.78rem; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-badge { flex-shrink: 0; }

.badge {
  font-size: 0.7rem; font-weight: 600; padding: 3px 10px;
  border-radius: 99px; white-space: nowrap;
}
.badge.today { background: rgba(251,191,36,0.18); color: var(--amber); border: 0.5px solid rgba(251,191,36,0.4); }
.badge.soon { background: rgba(52,211,153,0.14); color: var(--green); border: 0.5px solid rgba(52,211,153,0.35); }
.badge.rel { background: rgba(167,139,250,0.12); color: var(--accent-b); border: 0.5px solid rgba(167,139,250,0.28); }

.card-divider { border: none; border-top: 0.5px solid var(--border); margin: 0.8rem 0; }

.card-meta { display: flex; align-items: center; justify-content: space-between; }
.card-date { font-size: 0.82rem; color: var(--muted); display: flex; align-items: center; gap: 6px; }
.card-actions { display: flex; gap: 6px; }
.card-action-btn {
  width: 30px; height: 30px; border-radius: var(--r-sm);
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.05); border: 0.5px solid var(--border);
  color: var(--muted); cursor: pointer; font-size: 13px; transition: all 0.18s;
}
.card-action-btn:hover { background: rgba(248,113,113,0.12); color: var(--red); border-color: rgba(248,113,113,0.3); }

/* ── EMPTY STATE ─────────────────────────────── */
.empty { text-align: center; padding: 4rem 1rem; }
.empty-icon { font-size: 3rem; margin-bottom: 1rem; }
.empty h3 { font-family: 'Bricolage Grotesque', sans-serif; font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem; }
.empty p { font-size: 0.9rem; color: var(--muted); line-height: 1.6; }

/* ── MODAL ───────────────────────────────────── */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(0,0,0,0.75); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; padding: 1.5rem;
}
.modal {
  background: linear-gradient(135deg, #12082e, #0d1528);
  border: 0.5px solid rgba(255,255,255,0.14);
  border-radius: var(--r-xl); padding: 2rem; width: 100%; max-width: 480px;
  box-shadow: 0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(124,58,237,0.15);
  animation: modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1);
  max-height: 90vh; overflow-y: auto;
}
@keyframes modalIn { from { opacity:0; transform:scale(0.92) translateY(12px); } }
.modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.6rem; }
.modal-title { font-family: 'Bricolage Grotesque', sans-serif; font-size: 1.3rem; font-weight: 700; }
.modal-close {
  width: 32px; height: 32px; border-radius: var(--r-sm); border: 0.5px solid var(--border);
  background: var(--surface); color: var(--muted); cursor: pointer; font-size: 16px;
  display: flex; align-items: center; justify-content: center; transition: all 0.18s;
}
.modal-close:hover { background: var(--surface-h); color: var(--text); }

/* ── FORMS ─────────────────────────────────────*/
.field-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
label.field-label { font-size: 0.78rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.06em; }
.field-input {
  background: rgba(255,255,255,0.05); border: 0.5px solid var(--border);
  border-radius: var(--r-sm); padding: 10px 14px;
  color: var(--text); font-size: 0.93rem; font-family: 'Inter', sans-serif;
  width: 100%; outline: none; transition: all 0.2s;
}
.field-input:focus { border-color: var(--accent-b); background: rgba(167,139,250,0.07); box-shadow: 0 0 0 3px rgba(167,139,250,0.12); }
.field-input::placeholder { color: var(--muted); }
select.field-input option { background: #12082e; }
textarea.field-input { resize: vertical; min-height: 90px; }

/* ── BUTTONS ─────────────────────────────────── */
.btn-primary {
  width: 100%; padding: 12px; border: none; border-radius: var(--r-md);
  background: linear-gradient(135deg, #7C3AED, #DB2777);
  color: white; font-size: 0.95rem; font-weight: 600;
  font-family: 'Inter', sans-serif; cursor: pointer; transition: all 0.18s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
.btn-primary:active { transform: scale(0.98); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.btn-ghost {
  flex: 1; padding: 11px; border: 0.5px solid var(--border); border-radius: var(--r-md);
  background: var(--surface); color: var(--muted); font-size: 0.93rem;
  font-family: 'Inter', sans-serif; cursor: pointer; transition: all 0.18s;
}
.btn-ghost:hover { background: var(--surface-h); color: var(--text); }
.btn-row { display: flex; gap: 10px; margin-top: 4px; }

/* ── ALERTS ─────────────────────────────────── */
.alert-box {
  border-radius: var(--r-md); padding: 12px 16px; margin-bottom: 10px;
  display: flex; gap: 10px; align-items: flex-start; font-size: 0.87rem;
  border: 0.5px solid;
}
.alert-success { background: rgba(52,211,153,0.08); border-color: rgba(52,211,153,0.3); color: #a7f3d0; }
.alert-error { background: rgba(248,113,113,0.08); border-color: rgba(248,113,113,0.3); color: #fecaca; }
.alert-info { background: rgba(167,139,250,0.08); border-color: rgba(167,139,250,0.3); color: #ddd6fe; }

.alert-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 1px; }
.alert-body strong { display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 2px; }
.alert-body p { font-size: 0.82rem; opacity: 0.85; line-height: 1.5; }

/* ── LOGS ───────────────────────────────────── */
.log-row {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 0; border-bottom: 0.5px solid var(--border);
  font-size: 0.86rem;
}
.log-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

/* ── TOAST ──────────────────────────────────── */
.toast {
  position: fixed; bottom: 28px; right: 28px; z-index: 300;
  background: linear-gradient(135deg, #7C3AED, #DB2777);
  color: white; padding: 12px 20px; border-radius: var(--r-md);
  font-size: 0.88rem; font-weight: 500; font-family: 'Inter', sans-serif;
  box-shadow: 0 8px 30px rgba(124,58,237,0.4);
  animation: toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
  max-width: 320px;
}
@keyframes toastIn { from { opacity:0; transform:translateY(20px) scale(0.95); } }

/* ── SPINNER ─────────────────────────────────── */
.spinner {
  display: inline-block; width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── PROGRESS BAR ───────────────────────────── */
.progress-bar { height: 3px; background: rgba(255,255,255,0.08); border-radius: 99px; overflow: hidden; margin-top: 8px; }
.progress-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, #7C3AED, #DB2777); transition: width 0.3s; }

/* ── STARS ──────────────────────────────────── */
.star-field { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.star { position: absolute; background: white; border-radius: 50%; animation: twinkle var(--d,3s) ease-in-out infinite var(--dl,0s); }
@keyframes twinkle { 0%,100%{opacity:.15;transform:scale(1)} 50%{opacity:.9;transform:scale(1.5)} }

/* ── FLOATING ELEMENTS ──────────────────────── */
.floater { position: fixed; font-size: 22px; animation: float var(--d,8s) ease-in-out infinite var(--dl,0s); pointer-events: none; opacity: 0.08; z-index: 0; }
@keyframes float { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-40px) rotate(15deg)} }

/* ── RESPONSIVE ─────────────────────────────── */
@media (max-width: 900px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .nav-search { max-width: 220px; }
  .nav-search-shortcut { display: none; }
}
@media (max-width: 640px) {
  .navbar { padding: 0 1rem; gap: 1rem; }
  .nav-links { display: none; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .page-content { padding: 86px 1rem 2rem; }
  .people-grid { grid-template-columns: 1fr; }
  .field-row { grid-template-columns: 1fr; }
}

/* ── URL BAR ─────────────────────────────────── */
.url-bar {
  background: rgba(251,191,36,0.06); border: 0.5px solid rgba(251,191,36,0.25);
  border-radius: var(--r-md); padding: 12px 16px; margin-bottom: 2rem;
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
}
.url-bar label { font-size: 0.78rem; font-weight: 600; color: var(--amber); white-space: nowrap; }
.url-bar input {
  flex: 1; min-width: 200px; background: rgba(0,0,0,0.3);
  border: 0.5px solid rgba(251,191,36,0.3); border-radius: var(--r-sm);
  padding: 8px 12px; color: var(--text); font-size: 0.88rem;
  font-family: 'Inter', sans-serif; outline: none;
}
.url-bar input:focus { border-color: var(--amber); }
.url-test-btn {
  padding: 8px 16px; background: rgba(251,191,36,0.12); border: 0.5px solid rgba(251,191,36,0.35);
  border-radius: var(--r-sm); color: var(--amber); font-size: 0.84rem; font-weight: 600;
  font-family: 'Inter', sans-serif; cursor: pointer; transition: all 0.18s; white-space: nowrap;
}
.url-test-btn:hover { background: rgba(251,191,36,0.22); }

/* ── TABS (alerts page) ─────────────────────── */
.inner-tabs { display: flex; gap: 6px; margin-bottom: 1.4rem; }
.inner-tab {
  padding: 8px 16px; border: 0.5px solid var(--border); border-radius: var(--r-sm);
  background: var(--surface); color: var(--muted); font-size: 0.86rem; font-weight: 500;
  font-family: 'Inter', sans-serif; cursor: pointer; transition: all 0.18s;
}
.inner-tab.active { background: rgba(167,139,250,0.15); color: var(--accent-b); border-color: rgba(167,139,250,0.35); }
`;

/* ─────────────────────────────────────────────
   STAR FIELD
───────────────────────────────────────────────*/
function StarField() {
  const stars = Array.from({ length: 55 }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 0.8,
    x: Math.random() * 100,
    y: Math.random() * 100,
    d: `${2 + Math.random() * 4}s`,
    dl: `${Math.random() * 4}s`,
  }));
  return (
    <div className="star-field" aria-hidden>
      {stars.map(s => (
        <div key={s.id} className="star" style={{ width: s.size, height: s.size, left: `${s.x}%`, top: `${s.y}%`, "--d": s.d, "--dl": s.dl }} />
      ))}
      {["🎂","🎉","🎈","✨","🎁","🥳"].map((e,i) => (
        <div key={e} className="floater" style={{ left:`${10+i*14}%`, top:`${15+i*10}%`, "--d":`${7+i}s`, "--dl":`${i*1.2}s` }}>{e}</div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TOAST
───────────────────────────────────────────────*/
function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
  return <div className="toast" role="status">{msg}</div>;
}

/* ─────────────────────────────────────────────
   ADD PERSON MODAL
───────────────────────────────────────────────*/
function AddModal({ onClose, onSave, loading }) {
  const [form, setForm] = useState({ name:"", email:"", birthday:"", relationship:"friend" });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const submit = e => { e.preventDefault(); onSave(form); };
  return (
    <div className="modal-backdrop" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-labelledby="modal-title">
        <div className="modal-header">
          <div className="modal-title" id="modal-title">🎂 Add a birthday</div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <form onSubmit={submit}>
          <div className="field-row">
            <div className="field-group">
              <label className="field-label">Full name</label>
              <input className="field-input" required value={form.name} onChange={set("name")} placeholder="Theja Kumar" />
            </div>
            <div className="field-group">
              <label className="field-label">Email</label>
              <input className="field-input" type="email" required value={form.email} onChange={set("email")} placeholder="they@example.com" />
            </div>
          </div>
          <div className="field-row">
            <div className="field-group">
              <label className="field-label">Birthday</label>
              <input className="field-input" type="date" required value={form.birthday} onChange={set("birthday")} />
            </div>
            <div className="field-group">
              <label className="field-label">Relationship</label>
              <select className="field-input" value={form.relationship} onChange={set("relationship")}>
                <option value="friend">Friend</option>
                <option value="family">Family</option>
                <option value="colleague">Colleague</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="btn-row">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading} style={{flex:2}}>
              {loading ? <><span className="spinner" /> Saving...</> : "Save birthday"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEEDBACK MODAL
───────────────────────────────────────────────*/
function FeedbackModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ type:"suggestion", message:"", email:"" });
  const [sent, setSent] = useState(false);
  const set = k => e => setForm(f => ({...f, [k]: e.target.value}));
  const submit = e => {
    e.preventDefault();
    onSubmit(form);
    setSent(true);
  };
  return (
    <div className="modal-backdrop" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-labelledby="fb-title">
        <div className="modal-header">
          <div className="modal-title" id="fb-title">💬 Send feedback</div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {sent ? (
          <div style={{textAlign:"center",padding:"2rem 0"}}>
            <div style={{fontSize:"2.5rem",marginBottom:"1rem"}}>🙏</div>
            <div style={{fontFamily:"'Bricolage Grotesque',sans-serif",fontSize:"1.2rem",fontWeight:600,marginBottom:".5rem"}}>Thanks for your feedback!</div>
            <div style={{fontSize:".9rem",color:"var(--muted)",marginBottom:"1.5rem"}}>We read every message and use it to improve the product.</div>
            <button className="btn-primary" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="field-group">
              <label className="field-label">Type</label>
              <select className="field-input" value={form.type} onChange={set("type")}>
                <option value="suggestion">Suggestion</option>
                <option value="bug">Bug report</option>
                <option value="compliment">Compliment</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="field-group">
              <label className="field-label">Your message</label>
              <textarea className="field-input" required value={form.message} onChange={set("message")} placeholder="Tell us what you think or what you'd like to see improved..." rows={4} />
            </div>
            <div className="field-group">
              <label className="field-label">Your email (optional)</label>
              <input className="field-input" type="email" value={form.email} onChange={set("email")} placeholder="For a reply — optional" />
            </div>
            <div className="btn-row">
              <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-primary" style={{flex:2}}>Send feedback</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PERSON CARD
───────────────────────────────────────────────*/
function PersonCard({ person, onDelete }) {
  const [bg, fg] = avatarColor(person.name);
  const days = person.daysUntilBirthday ?? 999;
  const isToday = person.birthdayToday || days === 0;
  const isSoon = days > 0 && days <= 7;
  const badge = daysLabel(days);
  return (
    <div className={`person-card ${isToday ? "today-card" : ""} ${isSoon ? "soon-card" : ""}`}>
      <div className="card-top">
        <div className="avatar" style={{ background: bg, color: fg }}>{initials(person.name)}</div>
        <div className="card-info">
          <div className="card-name">{person.name}</div>
          <div className="card-email">{person.email}</div>
        </div>
        {badge && <div className="card-badge"><span className={`badge ${badge.cls}`}>{badge.label}</span></div>}
      </div>
      <hr className="card-divider" />
      <div className="card-meta">
        <div className="card-date">
          <span>📅</span>
          <span>{formatDate(person.birthday)}</span>
          <span className="badge rel" style={{marginLeft:4}}>{person.relationship}</span>
        </div>
        <div className="card-actions">
          <button className="card-action-btn" onClick={() => onDelete(person.id, person.name)} aria-label={`Remove ${person.name}`} title="Delete">🗑</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────────*/
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [people, setPeople] = useState([]);
  const [search, setSearch] = useState("");
  const [apiBase, setApiBase] = useState("http://localhost:8080");
  const [connStatus, setConnStatus] = useState("idle"); // idle | ok | err
  const [showAdd, setShowAdd] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [toast, setToast] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const searchRef = useRef();

  const showToast = msg => { setToast(msg); };
  const base = () => apiBase.trim().replace(/\/$/, "");

  /* keyboard shortcut: / focuses search */
  useEffect(() => {
    const handler = e => { if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") { e.preventDefault(); searchRef.current?.focus(); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const testConn = async () => {
    setConnStatus("idle");
    try {
      const r = await fetch(base() + "/api/people");
      if (!r.ok) throw new Error("HTTP " + r.status);
      const data = await r.json();
      setPeople(data);
      setConnStatus("ok");
      showToast("✅ Connected to backend!");
    } catch (e) {
      setConnStatus("err");
      showToast("❌ Cannot reach backend — is Spring Boot running?");
    }
  };

  const loadPeople = async () => {
    try {
      const r = await fetch(base() + "/api/people");
      if (!r.ok) throw new Error();
      setPeople(await r.json());
    } catch {}
  };

  const addPerson = async form => {
    setAddLoading(true);
    try {
      const r = await fetch(base() + "/api/people", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, birthday: form.birthday, relationship: form.relationship }),
      });
      if (!r.ok) { const e = await r.json(); throw new Error(e.error || "Error"); }
      showToast("🎂 Birthday saved!");
      setShowAdd(false);
      await loadPeople();
    } catch (e) { showToast("Error: " + e.message); }
    finally { setAddLoading(false); }
  };

  const deletePerson = async (id, name) => {
    if (!confirm(`Remove ${name}?`)) return;
    try {
      await fetch(base() + "/api/people/" + id, { method: "DELETE" });
      showToast("Removed");
      await loadPeople();
    } catch { showToast("Delete failed"); }
  };

  const triggerCheck = async () => {
    setCheckLoading(true); setCheckResult(null);
    try {
      const r = await fetch(base() + "/api/admin/check", { method: "POST" });
      if (!r.ok) throw new Error("HTTP " + r.status);
      const data = await r.json();
      setCheckResult({ ok: true, msg: data.message });
      showToast("🎉 Check done!");
      await loadLogs();
    } catch (e) { setCheckResult({ ok: false, msg: e.message }); }
    finally { setCheckLoading(false); }
  };

  const loadLogs = async () => {
    setLogsLoading(true);
    try {
      const r = await fetch(base() + "/api/admin/logs");
      if (!r.ok) throw new Error();
      setLogs(await r.json());
    } catch {}
    finally { setLogsLoading(false); }
  };

  useEffect(() => { if (page === "alerts" && connStatus === "ok") loadLogs(); }, [page]);

  const filtered = people.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase()) ||
    p.relationship.toLowerCase().includes(search.toLowerCase())
  );

  const todayCount = people.filter(p => p.birthdayToday || p.daysUntilBirthday === 0).length;
  const soonCount = people.filter(p => p.daysUntilBirthday > 0 && p.daysUntilBirthday <= 7).length;
  const thisMonthCount = people.filter(p => {
    const d = new Date(p.birthday + "T00:00:00");
    return d.getMonth() === new Date().getMonth();
  }).length;

  const dotClass = connStatus === "ok" ? "dot-green" : connStatus === "err" ? "dot-red" : "dot-amber";
  const dotLabel = connStatus === "ok" ? "Connected" : connStatus === "err" ? "Disconnected" : "Not connected";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <StarField />

      {/* ── NAVBAR ── */}
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="nav-logo">
          <div className="nav-logo-icon" aria-hidden>🎂</div>
          <span>BirthdayWishes</span>
        </div>

        <ul className="nav-links" role="list">
          {[
            { id:"dashboard", icon:"📊", label:"Dashboard" },
            { id:"alerts",    icon:"🔔", label:"Alerts" },
            { id:"settings",  icon:"⚙️",  label:"Settings" },
          ].map(n => (
            <li key={n.id}>
              <button className={page === n.id ? "active" : ""} onClick={() => setPage(n.id)} aria-current={page===n.id?"page":undefined}>
                <span aria-hidden>{n.icon}</span>{n.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="nav-search" role="search">
          <span className="nav-search-icon" aria-hidden>🔍</span>
          <input
            ref={searchRef}
            type="search"
            placeholder="Search people, dates, relationships…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search birthdays"
          />
          <span className="nav-search-shortcut" aria-hidden>/</span>
        </div>

        <div className="nav-right">
          <button
            className="status-pill"
            onClick={testConn}
            aria-label={`Backend status: ${dotLabel}. Click to test connection.`}
            title="Click to test backend connection"
          >
            <div className={`dot ${dotClass}`} aria-hidden />
            {dotLabel}
          </button>

          <button className="nav-icon-btn" onClick={() => setShowFeedback(true)} aria-label="Send feedback" title="Feedback">💬</button>

          <button className="btn-add-nav" onClick={() => setShowAdd(true)} aria-label="Add a birthday">
            <span aria-hidden>+</span> Add birthday
          </button>
        </div>
      </nav>

      {/* ── PAGE ── */}
      <div className="app-shell">
        <main className="page-content" id="main-content">

          {/* DASHBOARD */}
          {page === "dashboard" && (
            <>
              <section className="hero" aria-labelledby="hero-title">
                <div className="hero-eyebrow">✨ Birthday Reminder System</div>
                <h1 id="hero-title">Never miss a <span>celebration</span><br />that matters</h1>
                <p className="hero-sub">
                  Store birthdays, send warm greetings automatically, and alert the admin — all powered by your Spring Boot backend.
                </p>
              </section>

              {/* API URL BAR */}
              <div className="url-bar" role="region" aria-label="Backend connection">
                <label htmlFor="api-url">🔌 Backend URL</label>
                <input id="api-url" value={apiBase} onChange={e => setApiBase(e.target.value)} placeholder="http://localhost:8080" />
                <button className="url-test-btn" onClick={testConn}>Test connection</button>
              </div>

              {/* STATS */}
              <div className="stats-grid" role="region" aria-label="Statistics">
                {[
                  { icon:"👥", color:"rgba(167,139,250,0.18)", fg:"#C084FC", num: people.length, label:"People tracked", trend: people.length > 0 ? `${people.length} stored` : "Add someone!" },
                  { icon:"🎂", color:"rgba(251,191,36,0.18)",  fg:"#FBBF24", num: todayCount,     label:"Birthdays today",   trend: todayCount > 0 ? "🎉 Time to celebrate!" : "None today" },
                  { icon:"📅", color:"rgba(52,211,153,0.18)",  fg:"#34D399", num: soonCount,      label:"Coming this week",  trend: soonCount > 0 ? "Greetings queued" : "All clear" },
                  { icon:"🗓", color:"rgba(244,114,182,0.18)", fg:"#F472B6", num: thisMonthCount,  label:"This month",        trend: `In ${new Date().toLocaleString("en",{month:"long"})}` },
                ].map((s,i) => (
                  <div key={i} className="stat-card">
                    <div className="stat-icon" style={{ background: s.color, color: s.fg }}>{s.icon}</div>
                    <div className="stat-num" style={{ background:`linear-gradient(135deg,${s.fg},#fff)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>{s.num}</div>
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-trend">{s.trend}</div>
                  </div>
                ))}
              </div>

              {/* PEOPLE LIST */}
              <div className="section-header">
                <div className="section-title">All people</div>
                <span className="section-badge">{filtered.length} shown</span>
              </div>

              {connStatus !== "ok" ? (
                <div className="empty">
                  <div className="empty-icon">🔌</div>
                  <h3>Connect to your backend</h3>
                  <p>Enter your Spring Boot URL above and click <strong>Test connection</strong> to load your birthday list.</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">{search ? "🔍" : "🎈"}</div>
                  <h3>{search ? "No results found" : "No birthdays yet"}</h3>
                  <p>{search ? `Nothing matches "${search}". Try a different search.` : 'Click "+ Add birthday" to add the first person.'}</p>
                </div>
              ) : (
                <div className="people-grid" role="list" aria-label="Birthday list">
                  {filtered.map(p => <PersonCard key={p.id} person={p} onDelete={deletePerson} />)}
                </div>
              )}
            </>
          )}

          {/* ALERTS */}
          {page === "alerts" && (
            <>
              <section className="hero" aria-labelledby="alerts-title">
                <div className="hero-eyebrow">🔔 Greeting Engine</div>
                <h1 id="alerts-title">Trigger & <span>monitor</span><br />birthday greetings</h1>
                <p className="hero-sub">Manually fire the birthday check or monitor the last 20 sent greeting emails and admin alerts.</p>
              </section>

              {/* Trigger card */}
              <div style={{ background:"var(--surface)", border:"0.5px solid var(--border)", borderRadius:"var(--r-lg)", padding:"1.8rem", marginBottom:"1.2rem" }}>
                <div className="section-header" style={{marginBottom:"0.8rem"}}>
                  <div className="section-title">🚀 Birthday checker</div>
                </div>
                <p style={{fontSize:".88rem", color:"var(--muted)", lineHeight:1.6, marginBottom:"1.2rem"}}>
                  Calls <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 8px",borderRadius:6,fontSize:".82rem"}}>POST /api/admin/check</code> — triggers the email scheduler immediately so you don't have to wait for midnight.
                </p>
                <button
                  style={{padding:"12px 28px",background:"linear-gradient(135deg,#7C3AED,#DB2777)",border:"none",borderRadius:"var(--r-md)",color:"white",fontSize:".95rem",fontWeight:600,fontFamily:"'Inter',sans-serif",cursor:"pointer",display:"flex",alignItems:"center",gap:8,transition:"all .18s",opacity:checkLoading?.5:1}}
                  onClick={triggerCheck} disabled={checkLoading} aria-busy={checkLoading}
                >
                  {checkLoading ? <><span className="spinner" /> Checking...</> : "Check birthdays now"}
                </button>

                {checkResult && (
                  <div className={`alert-box ${checkResult.ok ? "alert-success" : "alert-error"}`} style={{marginTop:14,marginBottom:0}}>
                    <span className="alert-icon">{checkResult.ok ? "✅" : "❌"}</span>
                    <div className="alert-body"><strong>{checkResult.ok ? "Check complete" : "Error"}</strong><p>{checkResult.msg}</p></div>
                  </div>
                )}
              </div>

              {/* Logs */}
              <div style={{ background:"var(--surface)", border:"0.5px solid var(--border)", borderRadius:"var(--r-lg)", padding:"1.8rem" }}>
                <div className="section-header">
                  <div className="section-title">📋 Greeting log</div>
                  <button style={{padding:"7px 14px",background:"rgba(167,139,250,0.12)",border:"0.5px solid rgba(167,139,250,0.3)",borderRadius:"var(--r-sm)",color:"var(--accent-b)",fontSize:".82rem",fontWeight:600,fontFamily:"'Inter',sans-serif",cursor:"pointer"}} onClick={loadLogs}>
                    Refresh
                  </button>
                </div>

                {logsLoading ? (
                  <div style={{textAlign:"center",padding:"2rem",color:"var(--muted)"}}>
                    <span className="spinner" style={{borderTopColor:"var(--accent)",borderColor:"rgba(167,139,250,0.3)"}} /> Loading logs…
                  </div>
                ) : logs.length === 0 ? (
                  <div className="empty" style={{padding:"2rem 0"}}>
                    <div className="empty-icon">📭</div>
                    <p>No greetings sent yet. Run the checker above!</p>
                  </div>
                ) : (
                  logs.map((l, i) => (
                    <div key={i} className="log-row">
                      <div className={`log-dot ${l.status === "SENT" ? "dot-green" : "dot-red"}`} aria-hidden />
                      <div style={{flex:1}}>
                        <span>Sent to <strong>{l.sentTo}</strong></span>
                        {l.adminAlerted && <span style={{fontSize:".76rem",color:"var(--muted)",marginLeft:8}}>+ admin alerted</span>}
                      </div>
                      <span style={{fontSize:".75rem",color:"var(--muted)"}}>{new Date(l.sentAt).toLocaleString()}</span>
                      <span className={`badge ${l.status==="SENT"?"soon":"today"}`} style={l.status!=="SENT"?{background:"rgba(248,113,113,.12)",color:"var(--red)",borderColor:"rgba(248,113,113,.3)"}:{}}>{l.status}</span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* SETTINGS */}
          {page === "settings" && (
            <>
              <section className="hero" aria-labelledby="settings-title">
                <div className="hero-eyebrow">⚙️ Configuration</div>
                <h1 id="settings-title"><span>Settings</span> &amp; backend<br />configuration</h1>
                <p className="hero-sub">Configure your Spring Boot connection, email setup, and CORS origins.</p>
              </section>

              {[
                { title:"🔌 Backend connection", items:[
                  { label:"API base URL", val: apiBase, hint:"The root URL of your running Spring Boot app" },
                  { label:"Test endpoint", val: apiBase + "/api/people", hint:"GET request to verify connection" },
                ]},
                { title:"📧 Email (application.properties)", items:[
                  { label:"spring.mail.host", val:"smtp.gmail.com", hint:"SMTP host" },
                  { label:"spring.mail.port", val:"587", hint:"SMTP port with STARTTLS" },
                  { label:"spring.mail.username", val:"your-gmail@gmail.com", hint:"Gmail address" },
                  { label:"spring.mail.password", val:"your-app-password", hint:"Gmail App Password (not your real password)" },
                ]},
                { title:"🕛 Scheduler", items:[
                  { label:"Cron expression", val:"0 0 0 * * *", hint:"Fires daily at midnight — change to 0 * * * * * for every-minute testing" },
                  { label:"Manual trigger", val:"POST /api/admin/check", hint:"Hit this endpoint to run the check immediately" },
                ]},
                { title:"🌐 CORS (application.properties)", items:[
                  { label:"app.cors.allowed-origins", val:"http://localhost:3000,http://localhost:5173", hint:"Comma-separated list of allowed frontend origins" },
                ]},
              ].map(section => (
                <div key={section.title} style={{background:"var(--surface)",border:"0.5px solid var(--border)",borderRadius:"var(--r-lg)",padding:"1.6rem",marginBottom:"1rem"}}>
                  <div className="section-title" style={{marginBottom:"1.2rem"}}>{section.title}</div>
                  {section.items.map(item => (
                    <div key={item.label} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"10px 0",borderBottom:"0.5px solid var(--border)",gap:16}}>
                      <div>
                        <div style={{fontSize:".88rem",fontWeight:600,color:"var(--text)",marginBottom:3}}>{item.label}</div>
                        <div style={{fontSize:".78rem",color:"var(--muted)"}}>{item.hint}</div>
                      </div>
                      <code style={{fontSize:".78rem",background:"rgba(255,255,255,0.07)",border:"0.5px solid var(--border)",borderRadius:6,padding:"4px 10px",color:"var(--accent-b)",whiteSpace:"nowrap",flexShrink:0}}>{item.val}</code>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}

        </main>
      </div>

      {/* ── MODALS ── */}
      {showAdd && <AddModal onClose={() => setShowAdd(false)} onSave={addPerson} loading={addLoading} />}
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} onSubmit={form => console.log("Feedback:", form)} />}

      {/* ── TOAST ── */}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </>
  );
}
