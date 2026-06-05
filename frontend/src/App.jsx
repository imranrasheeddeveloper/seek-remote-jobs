import React, { useEffect, useState, useRef } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./styles.css";
import { OAuthCallback } from "./pages/OAuthCallback.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";

/* ── Lucide-style inline SVG icons ── */
const Icons = {
  Globe: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  MapPin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Briefcase: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="icon-sm">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  RefreshCw: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-sm">
      <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Wifi: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M10.54 16a3 3 0 0 1 2.92 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
    </svg>
  ),
  Building: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M3 9h6"/><path d="M3 15h6"/><path d="M15 3h2v4h-2z"/><path d="M15 11h2v4h-2z"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  Zap: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Leaf: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  ),
  DollarSign: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  Scale: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <line x1="12" y1="3" x2="12" y2="21"/><path d="M3 6l4 6-4 6"/><path d="M21 6l-4 6 4 6"/>
    </svg>
  ),
  Brain: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.97-3 2.5 2.5 0 0 1-1.32-4.24 3 3 0 0 1 .34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.09-1.98z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.97-3 2.5 2.5 0 0 0 1.32-4.24 3 3 0 0 0-.34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.09-1.98z"/>
    </svg>
  ),
  ExternalLink: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-sm">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  ),
};

const ADSENSE_CLIENT = "ca-pub-1140863366083907";
const ADSENSE_SLOTS = {
  hero: import.meta.env.VITE_ADSENSE_SLOT_HERO || "",
  inFeed: import.meta.env.VITE_ADSENSE_SLOT_INFEED || "",
  preFooter: import.meta.env.VITE_ADSENSE_SLOT_PREFOOTER || "",
};
const CONSENT_STORAGE_KEY = "srj_consent_v1";
const SAVED_JOBS_STORAGE_KEY = "srj_saved_jobs_v1";
const RECENT_JOBS_STORAGE_KEY = "srj_recent_jobs_v1";
const DEFAULT_CONSENT = {
  ad_storage: true,
  analytics_storage: false,
  ad_user_data: false,
  ad_personalization: false,
};

function applyGoogleConsent(consent) {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      ad_storage: consent.ad_storage ? "granted" : "denied",
      analytics_storage: consent.analytics_storage ? "granted" : "denied",
      ad_user_data: consent.ad_user_data ? "granted" : "denied",
      ad_personalization: consent.ad_personalization ? "granted" : "denied",
    });
  }

  window.adsbygoogle = window.adsbygoogle || [];
  window.adsbygoogle.requestNonPersonalizedAds = consent.ad_personalization ? 0 : 1;
}

function AdSenseAd({ slot, format = "auto", style = {} }) {
  if (!slot) return null;
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);
  return (
    <div className="adsense-wrap" aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}

const JOB_CATEGORIES = [
  { label: "All Roles",        value: "" },
  // Developer specialisms
  { label: "Full Stack",       value: "full stack" },
  { label: "Frontend",         value: "frontend" },
  { label: "Backend",          value: "backend" },
  { label: "Python",           value: "python" },
  { label: "React / Next.js",  value: "react" },
  { label: "Node.js",          value: "node" },
  { label: "Mobile",           value: "mobile" },
  { label: "iOS",              value: "ios" },
  { label: "Android",          value: "android" },
  // Broader tech
  { label: "Engineering",      value: "engineer" },
  { label: "AI / ML",          value: "machine learning" },
  { label: "Data",             value: "data" },
  { label: "DevOps / SRE",     value: "devops" },
  { label: "Cloud",            value: "cloud" },
  { label: "Security",         value: "security" },
  { label: "QA / Testing",     value: "qa" },
  // Other
  { label: "Design",           value: "design" },
  { label: "Product",          value: "product" },
  { label: "Marketing",        value: "marketing" },
  { label: "Sales",            value: "sales" },
  { label: "Operations",       value: "operations" },
];

const COMPANIES_SHOWCASE = [
  "Stripe", "GitHub", "Figma", "Shopify", "Notion", "Linear",
  "Anthropic", "OpenAI", "Vercel", "Cloudflare", "MongoDB", "Datadog",
];

function BrandMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="brand-mark">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="url(#brandGrad)" />
      <path d="M8 15.5l3-3 2 2 3.5-3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.5 8H18v3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="brandGrad" x1="3" y1="3" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4f46e5" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function CompanyAvatar({ name, size = "sm" }) {
  const colors = [
    "#4f46e5", "#7c3aed", "#db2777", "#dc2626",
    "#d97706", "#059669", "#0284c7", "#0891b2",
  ];
  const index = name ? name.charCodeAt(0) % colors.length : 0;
  const dim = size === "lg" ? 64 : 48;
  const fs  = size === "lg" ? "1.5rem" : "1.25rem";
  const br  = size === "lg" ? "12px" : "8px";
  return (
    <div className="company-avatar" style={{ background: colors[index], width: dim, height: dim, fontSize: fs, borderRadius: br }}>
      {name ? name[0].toUpperCase() : "?"}
    </div>
  );
}

function CompanyLogo({ job, size = "sm" }) {
  const [imgOk, setImgOk] = useState(true);
  let domain = null;
  try {
    const url = new URL(job.careersUrl || job.url || "");
    domain = url.hostname.replace(/^www\./, "");
    // strip common job-board domains that won't have brand logos
    if (["greenhouse.io", "lever.co", "ashbyhq.com", "jobs.ashbyhq.com"].some(d => domain.includes(d))) domain = null;
  } catch (_) {}

  const wrapCls = `co-logo-wrap${size === "lg" ? " co-logo-lg" : ""}`;
  if (domain && imgOk) {
    return (
      <div className={wrapCls}>
        <img
          src={`https://logo.clearbit.com/${domain}`}
          alt={`${job.company} logo`}
          className="co-logo-img"
          onError={() => setImgOk(false)}
          loading="lazy"
        />
      </div>
    );
  }
  return <CompanyAvatar name={job.company} size={size} />;
}

function isWorldwideRemote(location) {
  if (!location) return true;
  const l = location.toLowerCase().trim();
  return (
    l === "remote" ||
    l === "worldwide" ||
    l === "anywhere" ||
    l === "global" ||
    l === "n/a" ||
    l === "na" ||
    l.includes("worldwide") ||
    l.includes("anywhere") ||
    l.includes("global remote") ||
    l.includes("remote worldwide")
  );
}

function copyText(value) {
  if (!value) return false;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(value);
    return true;
  }
  return false;
}

function getWorkType(location) {
  if (!location) return "remote";
  const l = location.toLowerCase();
  if (l.includes("hybrid")) return "hybrid";
  if (l.includes("onsite") || l.includes("on-site") || l.includes("in-office")) return "onsite";
  return "remote";
}

function toPublicUploadPath(filePath) {
  if (!filePath) return "";
  const normalized = String(filePath).replace(/\\/g, "/");
  const marker = "/uploads/";
  const idx = normalized.lastIndexOf(marker);
  if (idx >= 0) return normalized.slice(idx);
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

function JobSheet({ job, onClose, isSaved, onToggleSave, onCopyLink, onTailorResume, isTailoring }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const wt = getWorkType(job.location);
  const wtLabel = wt === "remote" ? "🌐 Remote" : wt === "hybrid" ? "🏠 Hybrid" : "🏢 Onsite";
  const worldwide = isWorldwideRemote(job.location);
  const displayLoc = worldwide ? "Worldwide / Remote" : job.location;
  const postedDate = new Date(job.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="js-overlay" onClick={onClose} role="presentation">
      <div
        className="js-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${job.title} at ${job.company}`}
      >
        <div className="js-handle" aria-hidden="true" />

        <div className="js-header">
          <CompanyLogo job={job} size="lg" />
          <div className="js-header-text">
            <p className="js-co-name">{job.company}</p>
            <h2 className="js-title">{job.title}</h2>
          </div>
          <button className="js-close-btn" onClick={onClose} aria-label="Close job details">
            <Icons.X />
          </button>
        </div>

        <div className="js-badges">
          <span className={`wt-badge wt-${wt}`}>{wtLabel}</span>
          {worldwide && <span className="worldwide-badge">🌍 Worldwide</span>}
        </div>

        <div className="js-info-grid">
          <div className="js-info-item">
            <span className="js-info-icon"><Icons.MapPin /></span>
            <div className="js-info-content">
              <span className="js-info-label">Location</span>
              <span className="js-info-value">{displayLoc}</span>
            </div>
          </div>
          <div className="js-info-item">
            <span className="js-info-icon"><Icons.Calendar /></span>
            <div className="js-info-content">
              <span className="js-info-label">Posted</span>
              <span className="js-info-value">{postedDate}</span>
            </div>
          </div>
          <div className="js-info-item">
            <span className="js-info-icon"><Icons.Briefcase /></span>
            <div className="js-info-content">
              <span className="js-info-label">Company</span>
              <span className="js-info-value">{job.company}</span>
            </div>
          </div>
          {job.careersUrl && (
            <div className="js-info-item">
              <span className="js-info-icon"><Icons.Globe /></span>
              <div className="js-info-content">
                <span className="js-info-label">All openings</span>
                <a
                  href={job.careersUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="js-info-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  {job.company} careers page ↗
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="js-cta">
          <button className="js-save-btn" onClick={() => onToggleSave(job.id)}>
            {isSaved ? "★ Saved" : "☆ Save Job"}
          </button>
          <button className="js-share-btn" onClick={() => onCopyLink(job)}>
            Copy Link
          </button>
          <button className="js-tailor-btn" onClick={() => onTailorResume(job)} disabled={isTailoring}>
            {isTailoring ? "Tailoring..." : "AI Tailor Resume"}
          </button>
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="js-apply-btn"
            onClick={(e) => e.stopPropagation()}
          >
            Apply Now <Icons.ArrowRight />
          </a>
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="js-view-btn"
            onClick={(e) => e.stopPropagation()}
          >
            <Icons.ExternalLink /> View Full Description
          </a>
        </div>
        <p className="js-disclaimer">
          Clicking "Apply Now" opens {job.company}&apos;s official career page.
        </p>
      </div>
    </div>
  );
}

/** Searchable location dropdown */
function SearchableSelect({ options, value, onChange, placeholder = "All Locations", className = "" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  const filtered = query
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  const selectedLabel = value || placeholder;

  // Close on outside click
  useEffect(() => {
    function onDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function select(opt) {
    onChange(opt);
    setOpen(false);
    setQuery("");
  }

  function clear(e) {
    e.stopPropagation();
    onChange("");
    setOpen(false);
    setQuery("");
  }

  return (
    <div className={`ss-wrap ${className}`} ref={wrapRef}>
      <button
        type="button"
        className={`ss-trigger ${open ? "ss-open" : ""} ${value ? "ss-has-value" : ""}`}
        onClick={() => {
          setOpen((v) => !v);
          if (!open) setTimeout(() => inputRef.current?.focus(), 50);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Icons.MapPin />
        <span className="ss-label">{value ? value : <span className="ss-placeholder">{placeholder}</span>}</span>
        {value ? (
          <span className="ss-clear" onClick={clear} title="Clear">
            <Icons.X />
          </span>
        ) : (
          <svg className="ss-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        )}
      </button>

      {open && (
        <div className="ss-dropdown" role="listbox">
          <div className="ss-search-wrap">
            <Icons.Search />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search locations…"
              className="ss-search"
              aria-label="Search locations"
              autoComplete="off"
            />
            {query && (
              <button className="ss-search-clear" onClick={() => setQuery("")} type="button">
                <Icons.X />
              </button>
            )}
          </div>

          <div className="ss-list">
            <button
              type="button"
              className={`ss-option ${value === "" ? "ss-option-active" : ""}`}
              onClick={() => select("")}
              role="option"
              aria-selected={value === ""}
            >
              <span className="ss-all-icon">🌐</span> All Locations
              {value === "" && <span className="ss-check">✓</span>}
            </button>

            {filtered.length === 0 ? (
              <div className="ss-no-results">No locations match "{query}"</div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`ss-option ${value === opt ? "ss-option-active" : ""}`}
                  onClick={() => select(opt)}
                  role="option"
                  aria-selected={value === opt}
                >
                  <Icons.MapPin />
                  <span className="ss-option-text">{opt}</span>
                  {value === opt && <span className="ss-check">✓</span>}
                </button>
              ))
            )}
          </div>
          <div className="ss-footer">
            {filtered.length} location{filtered.length !== 1 ? "s" : ""}
            {query ? ` matching "${query}"` : " available"}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth/callback" element={<OAuthCallback />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/" element={<JobBoardContent />} />
      <Route path="*" element={<JobBoardContent />} />
    </Routes>
  );
}

// JobBoard content component (the original App content)
function JobBoardContent() {
  const [sources, setSources] = useState([]);
  const [stats, setStats] = useState({ totalJobs: 0, totalCompanies: 0, totalLocations: 0 });
  const [status, setStatus] = useState("Loading jobs...");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [companyFilter, setCompanyFilter] = useState("");
  const [titleFilter, setTitleFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [daysAgoFilter, setDaysAgoFilter] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [heroSearch, setHeroSearch] = useState("");
  const [sortBy, setSortBy] = useState("mixed"); // "mixed" | "newest"

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, hasMore: false });
  const [locations, setLocations] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showConsentBanner, setShowConsentBanner] = useState(false);
  const [showConsentManage, setShowConsentManage] = useState(false);
  const [consentPrefs, setConsentPrefs] = useState(DEFAULT_CONSENT);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [toast, setToast] = useState("");
  const [jobs, setJobs] = useState([]);
  const [tailoringJobId, setTailoringJobId] = useState(null);
  const [navUser, setNavUser] = useState(null);
  const [navDropdownOpen, setNavDropdownOpen] = useState(false);
  const navDropdownRef = useRef(null);

  const jobsSectionRef = useRef(null);

  async function loadFilterOptions() {
    try {
      const data = await api("/api/filters");
      setLocations(data.locations || []);
    } catch (e) {
      console.error("Failed to load filter options:", e);
    }
  }

  async function loadJobs(page = 1, overrideTitle) {
    setLoading(true);
    try {
      const title = overrideTitle !== undefined ? overrideTitle : titleFilter;
      const params = new URLSearchParams({
        page,
        limit: pageSize,
        sort: sortBy,
        ...(companyFilter && { company: companyFilter }),
        ...(title && { title }),
        ...(locationFilter && { location: locationFilter }),
        ...(daysAgoFilter && { daysAgo: daysAgoFilter }),
      });
      const data = await api(`/api/jobs?${params}`);
      setJobs(data.jobs || []);
      setPagination(data.pagination || {});
      setCurrentPage(page);
      setStatus("Jobs loaded.");
      setError(null);
      // Scroll to jobs section
      const jobsSection = document.getElementById("jobs");
      if (jobsSection) {
        jobsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (e) {
      const msg = `Failed to load jobs: ${e.message}`;
      setStatus(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const data = await api("/api/stats");
      setStats({
        totalJobs: data.totalJobs || 0,
        totalCompanies: data.totalCompanies || 0,
        totalLocations: data.totalLocations || 0,
        newestJobDate: data.newestJobDate,
      });
    } catch (e) {
      console.error("Failed to load stats:", e);
    }
  }

  async function loadSources() {
    try {
      const data = await api("/api/sources");
      setSources(data.sources || []);
    } catch (e) {
      console.error("Failed to load sources:", e);
    }
  }

  async function refreshJobs() {
    setLoading(true);
    setStatus("Crawling career pages...");
    try {
      const data = await api("/api/refresh", { method: "POST", body: JSON.stringify({}) });
      setStatus(`Refreshed! Added ${data.jobs_crawled} jobs from ${data.crawledSources} sources`);
      await Promise.all([loadStats(), loadJobs(1)]);
    } catch (e) {
      setStatus(`Refresh failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const init = async () => {
      await Promise.all([loadSources(), loadFilterOptions(), loadStats(), loadJobs(1)]);
    };
    init();
  }, []);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      const token = localStorage.getItem("accessToken");
      if (userData && token) setNavUser(JSON.parse(userData));
    } catch (_) {}
  }, []);

  useEffect(() => {
    function handleOutside(e) {
      if (navDropdownRef.current && !navDropdownRef.current.contains(e.target)) {
        setNavDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function handleNavLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setNavUser(null);
    setNavDropdownOpen(false);
  }

  useEffect(() => {
    try {
      const rawSaved = localStorage.getItem(SAVED_JOBS_STORAGE_KEY);
      const rawRecent = localStorage.getItem(RECENT_JOBS_STORAGE_KEY);
      if (rawSaved) {
        const parsed = JSON.parse(rawSaved);
        if (Array.isArray(parsed)) setSavedJobIds(parsed);
      }
      if (rawRecent) {
        const parsed = JSON.parse(rawRecent);
        if (Array.isArray(parsed)) setRecentJobs(parsed);
      }
    } catch (error) {
      console.warn("Could not restore saved jobs state:", error.message);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SAVED_JOBS_STORAGE_KEY, JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  useEffect(() => {
    localStorage.setItem(RECENT_JOBS_STORAGE_KEY, JSON.stringify(recentJobs));
  }, [recentJobs]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!raw) {
        applyGoogleConsent(DEFAULT_CONSENT);
        setShowConsentBanner(true);
        return;
      }
      const saved = JSON.parse(raw);
      const normalized = {
        ad_storage: Boolean(saved.ad_storage),
        analytics_storage: Boolean(saved.analytics_storage),
        ad_user_data: Boolean(saved.ad_user_data),
        ad_personalization: Boolean(saved.ad_personalization),
      };
      setConsentPrefs(normalized);
      applyGoogleConsent(normalized);
    } catch {
      applyGoogleConsent(DEFAULT_CONSENT);
      setShowConsentBanner(true);
    }
  }, []);

  useEffect(() => {
    loadJobs(1);
  }, [companyFilter, locationFilter, daysAgoFilter, sortBy]);

  useEffect(() => {
    const t = setTimeout(() => loadJobs(1), 350);
    return () => clearTimeout(t);
  }, [titleFilter]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (titleFilter) params.set("title", titleFilter);
    if (companyFilter) params.set("company", companyFilter);
    if (locationFilter) params.set("location", locationFilter);
    if (daysAgoFilter) params.set("daysAgo", daysAgoFilter);
    if (sortBy && sortBy !== "mixed") params.set("sort", sortBy);

    const query = params.toString();
    const canonicalUrl = `https://seekremotejobs.com${query ? `?${query}` : ""}`;
    const titleParts = [];
    if (titleFilter) titleParts.push(`${titleFilter} remote jobs`);
    if (companyFilter) titleParts.push(`${companyFilter} hiring`);
    if (locationFilter) titleParts.push(locationFilter);

    const dynamicTitle = titleParts.length
      ? `${titleParts.join(" | ")} | SeekRemoteJobs`
      : "Remote Jobs Board | 100+ Companies Hiring Now | SeekRemoteJobs";

    const dynamicDescription = titleParts.length
      ? `Browse ${titleParts.join(", ")} on SeekRemoteJobs. Updated daily with verified remote roles from top companies.`
      : "Discover fresh remote jobs from 100+ top companies across engineering, product, design, marketing, and data. Updated daily, free to use, and direct apply.";

    document.title = dynamicTitle;

    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) descriptionMeta.setAttribute("content", dynamicDescription);

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) canonicalLink.setAttribute("href", canonicalUrl);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", canonicalUrl);

    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl) twitterUrl.setAttribute("content", canonicalUrl);

    const newUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
    window.history.replaceState({}, "", newUrl);
  }, [titleFilter, companyFilter, locationFilter, daysAgoFilter, sortBy]);

  function clearAllFilters() {
    setCompanyFilter("");
    setTitleFilter("");
    setLocationFilter("");
    setDaysAgoFilter("");
    setActiveCategory("");
    setSortBy("mixed");
    setShowSavedOnly(false);
    setCurrentPage(1);
  }

  function toggleSaveJob(jobId) {
    setSavedJobIds((prev) => {
      const exists = prev.includes(jobId);
      const next = exists ? prev.filter((id) => id !== jobId) : [jobId, ...prev];
      setToast(exists ? "Removed from saved jobs" : "Saved to shortlist");
      return next;
    });
  }

  function openJob(job) {
    setSelectedJob(job);
    setRecentJobs((prev) => {
      const clean = prev.filter((j) => j.id !== job.id);
      return [job, ...clean].slice(0, 6);
    });
  }

  function copyJobLink(job) {
    const base = window.location.origin;
    const shareUrl = `${base}/jobs/${encodeURIComponent(job.id)}`;
    const copied = copyText(shareUrl);
    if (copied) {
      setToast("Job link copied");
    } else {
      setToast("Copy not supported in this browser");
    }
  }

  async function tailorResumeForJob(job) {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setToast("Log in to tailor your resume for this role");
      window.setTimeout(() => {
        window.location.href = "/login";
      }, 700);
      return;
    }

    setTailoringJobId(job.id);
    try {
      const res = await fetch(`/api/resume-tailor/tailor/${encodeURIComponent(job.id)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload.error || "Tailoring failed");
      }

      const compiledPdfPath = payload?.data?.compiledPdfPath;
      if (compiledPdfPath) {
        const openPath = toPublicUploadPath(compiledPdfPath);
        window.open(openPath, "_blank", "noopener,noreferrer");
        setToast("Tailored resume ready. Opened in new tab");
      } else {
        setToast("Resume tailored successfully");
      }
    } catch (error) {
      setToast(error.message || "Could not tailor resume");
    } finally {
      setTailoringJobId(null);
    }
  }

  function handleCategoryClick(value) {
    setActiveCategory(value);
    setTitleFilter(value);
    jobsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleHeroSearch(e) {
    e.preventDefault();
    setTitleFilter(heroSearch);
    jobsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function scrollToJobs() {
    jobsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function persistConsent(next) {
    setConsentPrefs(next);
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
    applyGoogleConsent(next);
    setShowConsentBanner(false);
    setShowConsentManage(false);
  }

  function acceptAllConsent() {
    persistConsent({
      ad_storage: true,
      analytics_storage: true,
      ad_user_data: true,
      ad_personalization: true,
    });
  }

  function denyAllConsent() {
    persistConsent(DEFAULT_CONSENT);
  }

  const totalPages = pagination.pages || 1;
  const displayedJobs = showSavedOnly ? jobs.filter((j) => savedJobIds.includes(j.id)) : jobs;

  function getPaginationPages() {
    const pages = [];
    const range = 2;
    for (let i = Math.max(1, currentPage - range); i <= Math.min(totalPages, currentPage + range); i++) {
      pages.push(i);
    }
    return pages;
  }

  return (
    <div className="app">

      {/* NAVBAR */}
      <header className="navbar">
        <div className="nav-container">
          <a href="/" className="nav-logo">
            <span className="logo-mark"><BrandMark /></span>
            <span className="logo-text">SeekRemote<span className="logo-accent">Jobs</span></span>
          </a>
          <nav className="nav-links" aria-label="Primary navigation">
            <a href="/" className="nav-link">Home</a>
            <a href="#jobs" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToJobs(); }}>Browse Jobs</a>
            <Link to="/dashboard" className="nav-link">Resume Optimizer</Link>
            <a href="#guide" className="nav-link">Blog</a>
          </nav>
          <div className="nav-auth-links" aria-label="Authentication">
            {navUser ? (
              <div className="nav-user-wrap" ref={navDropdownRef}>
                <button
                  className="nav-avatar-btn"
                  onClick={() => setNavDropdownOpen((v) => !v)}
                  aria-label="Account menu"
                  aria-expanded={navDropdownOpen}
                >
                  <div className="nav-avatar-circle">{navUser.name?.charAt(0)?.toUpperCase() || "U"}</div>
                  <span className="nav-avatar-name">{navUser.name?.split(" ")[0]}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="nav-avatar-caret" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {navDropdownOpen && (
                  <div className="nav-avatar-dropdown" role="menu">
                    <div className="nav-dropdown-info">
                      <p className="nav-dropdown-name">{navUser.name}</p>
                      <p className="nav-dropdown-email">{navUser.email}</p>
                    </div>
                    <Link to="/dashboard" className="nav-dropdown-item" role="menuitem" onClick={() => setNavDropdownOpen(false)}>Dashboard</Link>
                    <button className="nav-dropdown-item nav-dropdown-logout" role="menuitem" onClick={handleNavLogout}>Log Out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="nav-auth-btn nav-auth-login">Log In</Link>
                <Link to="/signup" className="nav-auth-btn nav-auth-signup">Sign Up</Link>
              </>
            )}
          </div>
          <button className="btn-refresh-nav" onClick={refreshJobs} disabled={loading}>
            <span className={loading ? "spin" : ""}><Icons.RefreshCw /></span>
            {loading ? "Updating..." : "Refresh Jobs"}
          </button>
          <button className={`hamburger ${mobileMenuOpen ? "open" : ""}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <Icons.X /> : <Icons.Menu />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <a href="/" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#jobs" onClick={() => { scrollToJobs(); setMobileMenuOpen(false); }}>Browse Jobs</a>
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Resume Optimizer</Link>
            <a href="#guide" onClick={() => setMobileMenuOpen(false)}>Blog</a>
            {navUser ? (
              <button onClick={() => { handleNavLogout(); setMobileMenuOpen(false); }}>Log Out</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
              </>
            )}
            <button onClick={() => { refreshJobs(); setMobileMenuOpen(false); }} disabled={loading}>
              {loading ? "Updating..." : "↻ Refresh Jobs"}
            </button>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="hero" aria-label="Remote jobs search">
        <div className="hero-shapes" aria-hidden="true">
          <div className="hs hs1" /><div className="hs hs2" /><div className="hs hs3" />
        </div>
        <div className="hero-container">
          <div className="hero-badge">
            <span className="badge-pulse" />
            <Icons.CheckCircle /> Remote jobs + AI resume builder &nbsp;·&nbsp; 100% free to start
          </div>
          <h1 className="hero-title">
            Find Your Next<br />
            <span className="hero-gradient">Remote Job</span>
          </h1>
          <p className="hero-subtitle">
            Browse <strong>{stats.totalJobs.toLocaleString()}+</strong> remote opportunities from{" "}
            <strong>{stats.totalCompanies}+</strong> top tech companies and optimize applications with AI.
            Upload your resume, get matched jobs, tailor by job description, and apply faster.
          </p>
          <form className="hero-search-bar" onSubmit={handleHeroSearch} role="search">
            <div className="hsb-input-wrap">
              <span className="hsb-icon"><Icons.Search /></span>
              <input
                type="search"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Job title, skill, or keyword…"
                className="hsb-text-input"
                aria-label="Search remote jobs"
              />
            </div>
            <div className="hsb-divider" />
            <SearchableSelect
              options={locations}
              value={locationFilter}
              onChange={(v) => setLocationFilter(v)}
              placeholder="All Locations"
              className="hsb-location-select"
            />
            <button type="submit" className="hsb-btn">Search Jobs</button>
          </form>
          <div className="hero-stats-row">
            <div className="hsr-item"><span className="hsr-num">{stats.totalJobs.toLocaleString()}+</span><span className="hsr-lbl">Remote Jobs</span></div>
            <div className="hsr-sep" />
            <div className="hsr-item"><span className="hsr-num">{stats.totalCompanies}+</span><span className="hsr-lbl">Companies</span></div>
            <div className="hsr-sep" />
            <div className="hsr-item"><span className="hsr-num">Daily</span><span className="hsr-lbl">Updates</span></div>
            <div className="hsr-sep" />
            <div className="hsr-item"><span className="hsr-num">Free</span><span className="hsr-lbl">Always</span></div>
          </div>
          {ADSENSE_SLOTS.hero && !loading && jobs.length > 0 && (
            <div className="hero-ad-wrap">
              <AdSenseAd slot={ADSENSE_SLOTS.hero} format="horizontal" style={{ minHeight: 90 }} />
            </div>
          )}

          <div className="company-strip">
            <span className="cs-label">Featuring jobs from:</span>
            <div className="cs-pills">
              {COMPANIES_SHOWCASE.map((c) => (
                <button key={c} className="cs-pill" onClick={() => { setCompanyFilter(c); scrollToJobs(); }}>{c}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI RESUME BUILDER */}
      <section className="ai-builder-section" id="ai-builder" aria-labelledby="ai-builder-heading">
        <div className="section-wrap">
          <div className="sec-label">AI tools</div>
          <h2 className="sec-heading" id="ai-builder-heading">AI Resume Builder + Job Match Workflow</h2>
          <p className="sec-sub">
            Start with your resume, discover matching roles, then tailor your resume to each job description
            in one guided flow.
          </p>

          <div className="ai-flow-grid">
            <article className="ai-flow-card">
              <div className="ai-step">01</div>
              <h3>Upload or Build Resume</h3>
              <p>Use AI parsing to extract skills, experience, and ATS signals from your resume PDF.</p>
              <Link to="/signup" className="ai-flow-link">Start Builder</Link>
            </article>

            <article className="ai-flow-card">
              <div className="ai-step">02</div>
              <h3>Get Suggested Jobs</h3>
              <p>See role matches based on your resume profile, skills, and experience alignment.</p>
              <a
                href="#jobs"
                className="ai-flow-link"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToJobs();
                }}
              >
                Browse Matched Jobs
              </a>
            </article>

            <article className="ai-flow-card">
              <div className="ai-step">03</div>
              <h3>Tailor to Job Description</h3>
              <p>Paste a target job description and generate a role-specific, remote-optimized resume version.</p>
              <Link to="/login" className="ai-flow-link">Tailor My Resume</Link>
            </article>

            <article className="ai-flow-card">
              <div className="ai-step">04</div>
              <h3>Generate Cover Letter</h3>
              <p>Create personalized cover letters that reflect your resume and each role context.</p>
              <Link to="/login" className="ai-flow-link">Generate with AI</Link>
            </article>
          </div>

          <div className="ai-builder-cta-row">
            <Link to="/signup" className="ai-main-cta">Create Free Account</Link>
            <Link to="/login" className="ai-secondary-cta">Already have an account? Log In</Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how-it-works">
        <div className="section-wrap">
          <div className="sec-label">Simple process</div>
          <h2 className="sec-heading">Land a Remote Job in 3 Steps</h2>
          <div className="steps-grid">
            {[
              { n: "01", icon: <Icons.Search />, t: "Search & Filter", d: "Use smart filters to find remote roles matching your skills, experience level, and timezone preference." },
              { n: "02", icon: <Icons.Briefcase />, t: "Explore Listings", d: "Browse curated remote positions from 40+ companies — Stripe, GitHub, Figma, Notion, Linear, Airbnb, and more." },
              { n: "03", icon: <Icons.Zap />, t: "Apply Directly", d: "Apply straight to company career pages — no middleman, no fake listings, 100% genuine opportunities." },
            ].map((s) => (
              <article className="step-card" key={s.n}>
                <div className="step-num">{s.n}</div>
                <div className="step-icon">{s.icon}</div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* JOB BOARD */}
      <section className="jobs-section" id="jobs" ref={jobsSectionRef}>
        <div className="section-wrap">
          <div className="jobs-top-row">
            <div>
              <h2 className="jobs-heading">
                Remote Jobs
                {pagination.total > 0 && <span className="jobs-count-chip">{pagination.total.toLocaleString()}</span>}
              </h2>
              <p className="jobs-sub">Real-time openings pulled directly from company career pages</p>
            </div>
            <div className="jobs-top-actions">
              <button
                className={`saved-toggle ${showSavedOnly ? "active" : ""}`}
                onClick={() => setShowSavedOnly((v) => !v)}
                title="Show only saved jobs from current results"
              >
                {showSavedOnly ? "★ Saved Only" : `☆ Saved (${savedJobIds.length})`}
              </button>
              <div className="sort-toggle" role="group" aria-label="Sort order">
                <button
                  className={`sort-btn ${sortBy === "mixed" ? "active" : ""}`}
                  onClick={() => setSortBy("mixed")}
                  title="Mix jobs from all companies"
                >⇄ Mixed</button>
                <button
                  className={`sort-btn ${sortBy === "newest" ? "active" : ""}`}
                  onClick={() => setSortBy("newest")}
                  title="Newest jobs first"
                >↓ Newest</button>
              </div>
              <button className="btn-refresh-secondary" onClick={refreshJobs} disabled={loading}>
                <span className={loading ? "spin" : ""}><Icons.RefreshCw /></span> {loading ? "Updating…" : "Refresh"}
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="category-pills" role="tablist">
            {JOB_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                role="tab"
                aria-selected={activeCategory === cat.value}
                className={`cat-pill ${activeCategory === cat.value ? "active" : ""}`}
                onClick={() => handleCategoryClick(cat.value)}
              >{cat.label}</button>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="fb-inputs">
              <div className="fb-input-wrap">
                <Icons.Search />
                <input type="text" value={titleFilter} onChange={(e) => setTitleFilter(e.target.value)} placeholder="Title or keyword…" className="fb-input" aria-label="Search by title" />
              </div>
              <div className="fb-input-wrap">
                <Icons.Briefcase />
                <input type="text" value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} placeholder="Company…" className="fb-input" aria-label="Filter by company" />
              </div>
              <SearchableSelect
                options={locations}
                value={locationFilter}
                onChange={(v) => setLocationFilter(v)}
                placeholder="Location…"
                className="fb-location-select"
              />
              <select value={daysAgoFilter} onChange={(e) => setDaysAgoFilter(e.target.value)} className="fb-select" aria-label="Filter by date posted">
                <option value="">Any time</option>
                <option value="1">Last 24 hours</option>
                <option value="7">Last 7 days</option>
                <option value="14">Last 2 weeks</option>
                <option value="30">Last 30 days</option>
              </select>
            </div>
            <div className="fb-actions">
              {(titleFilter || companyFilter || locationFilter || daysAgoFilter) && (
                <button className="btn-clear" onClick={clearAllFilters}>✕ Clear</button>
              )}
            </div>
          </div>

          {error && <div className="error-banner" role="alert"><strong>⚠️</strong> {error}</div>}

          {loading ? (
            <div className="loading-state" aria-live="polite">
              <div className="loading-dots"><span /><span /><span /></div>
              <p>Finding remote jobs…</p>
            </div>
          ) : displayedJobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>{showSavedOnly ? "No saved jobs in this result set" : "No remote jobs found"}</h3>
              <p>{showSavedOnly ? "Turn off Saved Only or save jobs from the list first." : "Try adjusting your search or clearing filters."}</p>
              <button className="btn-primary" onClick={clearAllFilters}>Clear All Filters</button>
            </div>
          ) : (
            <>
              {recentJobs.length > 0 && (
                <div className="recent-jobs-panel">
                  <div className="recent-header">
                    <h3>Recently Viewed</h3>
                    <button className="recent-clear" onClick={() => setRecentJobs([])}>Clear</button>
                  </div>
                  <div className="recent-list">
                    {recentJobs.map((job) => (
                      <button key={job.id} className="recent-chip" onClick={() => openJob(job)}>
                        <span className="recent-company">{job.company}</span>
                        <span className="recent-title">{job.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="jobs-list" role="list">
                {displayedJobs.reduce((acc, job, idx) => {
                const wt = getWorkType(job.location);
                const worldwide = isWorldwideRemote(job.location);
                acc.push(
                  <article
                    className="job-card"
                    key={job.id}
                    role="listitem"
                    onClick={() => openJob(job)}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && openJob(job)}
                  >
                    <CompanyLogo job={job} />
                    <div className="jc-body">
                      <div className="jc-top">
                        <div className="jc-title-row">
                          <h3 className="jc-title">{job.title}</h3>
                          <div className="jc-tags">
                            <span className={`wt-badge wt-${wt}`}>
                              {worldwide ? "🌍 Worldwide" : wt === "remote" ? "🌐 Remote" : wt === "hybrid" ? "🏠 Hybrid" : "🏢 Onsite"}
                            </span>
                          </div>
                        </div>
                        <p className="jc-company">{job.company}</p>
                      </div>
                      <div className="jc-meta">
                        <span className="jc-meta-item">
                          <Icons.MapPin />
                          {worldwide ? "Worldwide / Remote" : (job.location || "Remote")}
                        </span>
                        <span className="jc-meta-item">
                          <Icons.Calendar />
                          {new Date(job.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                    <div className="jc-action">
                      <button
                        className="tailor-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          tailorResumeForJob(job);
                        }}
                        disabled={tailoringJobId === job.id}
                        aria-label="Tailor resume for this job"
                      >
                        {tailoringJobId === job.id ? "Tailoring..." : "AI Tailor"}
                      </button>
                      <button
                        className={`save-btn ${savedJobIds.includes(job.id) ? "saved" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveJob(job.id);
                        }}
                        aria-label={savedJobIds.includes(job.id) ? "Remove job from saved" : "Save job"}
                      >
                        {savedJobIds.includes(job.id) ? "★ Saved" : "☆ Save"}
                      </button>
                      <button
                        className="share-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyJobLink(job);
                        }}
                        aria-label="Copy job link"
                      >
                        Copy Link
                      </button>
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="apply-btn"
                        aria-label={`Apply for ${job.title} at ${job.company}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Apply Now
                        <Icons.ArrowRight />
                      </a>
                    </div>
                  </article>
                );
                if (ADSENSE_SLOTS.inFeed && (idx + 1) % 5 === 0 && idx !== displayedJobs.length - 1) {
                  acc.push(
                    <div className="infeed-ad" key={`ad-${idx}`}>
                      <AdSenseAd slot={ADSENSE_SLOTS.inFeed} format="fluid" style={{ display: "block" }} />
                    </div>
                  );
                }
                return acc;
                }, [])}
              </div>
            </>
          )}

          {!loading && pagination.pages > 1 && (
            <nav className="pagination" aria-label="Job listing pages">
              <button className="btn-page" onClick={() => loadJobs(currentPage - 1)} disabled={currentPage === 1}>← Prev</button>
              <div className="pagination-nums">
                {currentPage > 3 && <><button className="btn-pnum" onClick={() => loadJobs(1)}>1</button>{currentPage > 4 && <span className="page-dots">…</span>}</>}
                {getPaginationPages().map((p) => (
                  <button key={p} className={`btn-pnum ${p === currentPage ? "active" : ""}`} onClick={() => loadJobs(p)} aria-current={p === currentPage ? "page" : undefined}>{p}</button>
                ))}
                {currentPage < totalPages - 2 && <>{currentPage < totalPages - 3 && <span className="page-dots">…</span>}<button className="btn-pnum" onClick={() => loadJobs(totalPages)}>{totalPages}</button></>}
              </div>
              <button className="btn-page" onClick={() => loadJobs(currentPage + 1)} disabled={!pagination.hasMore}>Next →</button>
            </nav>
          )}
        </div>
      </section>

      {/* REMOTE WORK STATISTICS */}
      <section className="stats-section" aria-labelledby="stats-heading">
        <div className="section-wrap">
          <div className="sec-label">Remote work today</div>
          <h2 className="sec-heading" id="stats-heading">Remote Work by the Numbers</h2>
          <p className="sec-sub">The shift to remote and distributed work is no longer a trend — it is the new standard for top technology companies worldwide.</p>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-num">32%</span>
              <span className="stat-lbl">of all US knowledge-worker jobs are now fully remote, up from 5% in 2019</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">$19K</span>
              <span className="stat-lbl">average annual savings for companies per full-time remote employee in office costs</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">77%</span>
              <span className="stat-lbl">of remote workers report equal or greater productivity compared to working in an office</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">54%</span>
              <span className="stat-lbl">of workers would change jobs for a fully remote role, even without a pay increase</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">16%</span>
              <span className="stat-lbl">of companies worldwide now operate as fully remote organisations with no physical office</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">$5K+</span>
              <span className="stat-lbl">annual savings for remote workers on commuting, clothing, and food costs on average</span>
            </div>
          </div>
          <p className="stats-source">Sources: Owl Labs State of Remote Work, Buffer State of Remote Work, Global Workplace Analytics, McKinsey Global Institute.</p>
        </div>
      </section>

      {/* WHY REMOTE */}
      <section className="why-section" id="why-remote">
        <div className="section-wrap">
          <div className="sec-label">The remote advantage</div>
          <h2 className="sec-heading">Why Work Remotely?</h2>
          <p className="sec-sub">Remote work has transformed how top tech companies operate. Here's why millions of professionals choose remote-first careers.</p>
          <div className="why-grid">
            {[
              { icon: <Icons.Globe />, t: "Work from Anywhere", d: "True location freedom — work from home, a co-working space, or anywhere in the world." },
              { icon: <Icons.Scale />, t: "Better Work-Life Balance", d: "Remote professionals report higher satisfaction, fewer interruptions, and more time for what matters." },
              { icon: <Icons.DollarSign />, t: "Save Thousands Annually", d: "Cut commuting and lunch costs — remote workers save an average of $5,000–$10,000 per year." },
              { icon: <Icons.TrendingUp />, t: "Access Global Opportunities", d: "Remove geographic barriers — apply to world-class companies regardless of where you live." },
              { icon: <Icons.Brain />, t: "Higher Productivity", d: "Studies show remote workers are 13–40% more productive with fewer interruptions and deeper focus." },
              { icon: <Icons.Leaf />, t: "Eco-Friendly Choice", d: "No commute means a lower carbon footprint and a more sustainable way to work." },
            ].map((w) => (
              <article className="why-card" key={w.t}>
                <span className="why-icon" aria-hidden="true">{w.icon}</span>
                <h3>{w.t}</h3>
                <p>{w.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* REMOTE WORK GUIDE */}
      <section className="guide-section" id="guide" aria-labelledby="guide-heading">
        <div className="section-wrap">
          <div className="sec-label">Career resources</div>
          <h2 className="sec-heading" id="guide-heading">The Complete Remote Job Seeker's Guide</h2>
          <p className="sec-sub">Landing a remote job takes more than a great resume. Use this guide to stand out in a competitive, distributed hiring market.</p>

          <div className="guide-grid">
            <article className="guide-card">
              <div className="guide-icon-wrap" aria-hidden="true"><Icons.Briefcase /></div>
              <h3>How to Write a Remote-Ready Resume</h3>
              <p>A remote-optimised resume highlights self-management, async communication, and measurable results. Unlike traditional resumes that focus on in-office duties, yours should show employers you can deliver independently.</p>
              <ul className="guide-list">
                <li>Add a "Remote Work" tag or note to any past remote or hybrid roles</li>
                <li>Highlight tools you have used: Slack, Notion, Jira, Figma, GitHub, Zoom</li>
                <li>Quantify achievements — numbers and outcomes matter more than duties</li>
                <li>Include a strong summary that mentions your timezone and availability</li>
                <li>Show evidence of written communication: documentation, async updates, reports</li>
              </ul>
            </article>

            <article className="guide-card">
              <div className="guide-icon-wrap" aria-hidden="true"><Icons.Wifi /></div>
              <h3>Acing the Remote Job Interview</h3>
              <p>Remote interviews are evaluated differently from in-person ones. Employers are watching not only for technical skills but also for communication clarity, presence, and setup — because those things predict how you will work day-to-day.</p>
              <ul className="guide-list">
                <li>Test your camera, microphone, and internet speed the day before</li>
                <li>Choose a clean, well-lit background — virtual backgrounds can look unprofessional</li>
                <li>Speak clearly and pause briefly to avoid talking over others on video calls</li>
                <li>Prepare examples of projects you completed while working autonomously</li>
                <li>Ask thoughtful questions about how the team communicates asynchronously</li>
                <li>Follow up with a written thank-you note that restates your key qualifications</li>
              </ul>
            </article>

            <article className="guide-card">
              <div className="guide-icon-wrap" aria-hidden="true"><Icons.Zap /></div>
              <h3>Essential Tools for Remote Workers</h3>
              <p>Mastering the right tools is one of the fastest ways to become a high-performing remote employee. Familiarity with widely-used platforms signals to employers that you can integrate into distributed teams without a steep learning curve.</p>
              <ul className="guide-list">
                <li><strong>Communication:</strong> Slack, Microsoft Teams, Discord</li>
                <li><strong>Video calls:</strong> Zoom, Google Meet, Around</li>
                <li><strong>Project management:</strong> Notion, Linear, Jira, Asana, Trello</li>
                <li><strong>Documentation:</strong> Confluence, Notion, Google Docs</li>
                <li><strong>Version control:</strong> GitHub, GitLab, Bitbucket</li>
                <li><strong>Design collaboration:</strong> Figma, Miro, Whimsical</li>
                <li><strong>Time management:</strong> Toggl, Clockify, RescueTime</li>
              </ul>
            </article>

            <article className="guide-card">
              <div className="guide-icon-wrap" aria-hidden="true"><Icons.DollarSign /></div>
              <h3>Remote Job Salary Expectations</h3>
              <p>Remote roles vary widely in compensation depending on the company, role seniority, location, and whether the employer offers location-based or global pay scales. Understanding the landscape helps you negotiate effectively.</p>
              <ul className="guide-list">
                <li><strong>Software Engineer (mid-level):</strong> $90K–$160K USD (US-based remote)</li>
                <li><strong>Product Manager:</strong> $110K–$180K USD depending on company stage</li>
                <li><strong>UX/Product Designer:</strong> $80K–$140K USD for senior roles</li>
                <li><strong>Data Scientist / ML Engineer:</strong> $110K–$200K USD at top companies</li>
                <li><strong>Marketing Manager:</strong> $70K–$130K USD at growth-stage companies</li>
                <li>Global / international remote roles may pay in local cost-of-living bands</li>
                <li>Always research Levels.fyi, Glassdoor, and Blind for the latest data</li>
              </ul>
            </article>

            <article className="guide-card">
              <div className="guide-icon-wrap" aria-hidden="true"><Icons.CheckCircle /></div>
              <h3>Skills Remote Employers Prioritise</h3>
              <p>Companies hiring for distributed teams screen specifically for skills that predict success in an async, low-supervision environment. Candidates who demonstrate these competencies are consistently prioritised over those who do not.</p>
              <ul className="guide-list">
                <li><strong>Written communication:</strong> The ability to write clearly and concisely is critical in async teams</li>
                <li><strong>Self-direction:</strong> Managing your own priorities without constant check-ins</li>
                <li><strong>Over-communication:</strong> Proactively sharing progress, blockers, and decisions</li>
                <li><strong>Documentation habit:</strong> Writing things down so teammates in other timezones stay aligned</li>
                <li><strong>Results orientation:</strong> Defining success by outcomes, not hours logged</li>
                <li><strong>Timezone awareness:</strong> Scheduling consideration and flexibility for global teams</li>
              </ul>
            </article>

            <article className="guide-card">
              <div className="guide-icon-wrap" aria-hidden="true"><Icons.TrendingUp /></div>
              <h3>How to Avoid Remote Job Scams</h3>
              <p>The rise of remote work has unfortunately also increased the prevalence of fraudulent job postings. Knowing the warning signs protects your time and personal information.</p>
              <ul className="guide-list">
                <li>Legitimate employers never ask for payment, equipment deposits, or banking details</li>
                <li>Be sceptical of offers with unusually high salaries for vague or entry-level roles</li>
                <li>Verify the company exists via LinkedIn, Crunchbase, and their official website</li>
                <li>All listings on SeekRemoteJobs link directly to official company career pages</li>
                <li>If an offer arrives unsolicited via WhatsApp or Telegram, treat it as suspicious</li>
                <li>Check if the email domain matches the company — recruiters@real-company.com, not gmail</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="cta-band">
        <div className="cta-inner">
          <h2>Ready to Find Your Remote Job?</h2>
          <p>Browse {stats.totalJobs.toLocaleString()}+ real remote listings from {stats.totalCompanies}+ companies. Free forever, no sign-up required.</p>
          <button className="cta-btn" onClick={scrollToJobs}>Browse Remote Jobs <Icons.ArrowRight /></button>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section" aria-label="Remote jobs frequently asked questions">
        <div className="section-wrap">
          <div className="sec-label">FAQ</div>
          <h2 className="sec-heading">Remote Jobs FAQ</h2>
          <p className="sec-sub">Quick answers to common questions about finding and applying to remote jobs.</p>
          <div className="faq-list">
            <details className="faq-item">
              <summary>Where can I find remote tech jobs?</summary>
              <p>SeekRemoteJobs aggregates remote roles directly from company career pages, so every listing links straight to the employer. We cover roles across engineering, product, design, marketing, data, DevOps, and sales. You can filter by keyword, company name, location region, and how recently the job was posted. New jobs are pulled daily, so checking back regularly ensures you see the freshest openings before they fill.</p>
            </details>
            <details className="faq-item">
              <summary>Are these jobs fully remote?</summary>
              <p>The majority of listings are remote-first or fully distributed. We tag each role with a work-type badge — Remote, Hybrid, or Onsite — based on the information published by the company. If a role says "Worldwide" or "Anywhere," it means the employer explicitly accepts applicants from any country. Some companies list hybrid roles (a mix of remote and in-office days) alongside their remote openings. We include those because many job seekers are open to both, but you can filter by keyword to focus on fully-remote listings.</p>
            </details>
            <details className="faq-item">
              <summary>Is SeekRemoteJobs free to use?</summary>
              <p>Yes — completely free for job seekers. There are no accounts, no paywalls, and no premium tiers. We link you directly to the company's official careers page so you apply there, not through us. The site is supported by non-intrusive display advertising, which keeps the service free for everyone. We never charge companies to list their roles and never accept paid placement, so what you see is a real-time reflection of actual open positions.</p>
            </details>
            <details className="faq-item">
              <summary>How often are jobs updated?</summary>
              <p>Our crawlers run daily to pull new job listings and remove postings that companies have taken down or filled. You can also trigger a manual refresh using the "Refresh Jobs" button to fetch the very latest data from all sources. The "Last updated" timestamp in the footer shows when the most recent crawl ran. If you notice a listing that appears to be closed, the company's careers page is always the authoritative source.</p>
            </details>
            <details className="faq-item">
              <summary>Can I filter by role and location?</summary>
              <p>Yes. Use the search bar to filter by job title or keyword, type a company name to see all their open roles, and use the location dropdown to narrow by country or region. You can also filter by date posted — last 24 hours, last 7 days, last 2 weeks, or last 30 days. Category pills let you jump straight to Engineering, Design, Product, Marketing, Data, DevOps, Sales, or Operations roles. All filters can be combined and cleared with a single click.</p>
            </details>
            <details className="faq-item">
              <summary>What skills do remote employers look for?</summary>
              <p>Beyond the technical requirements of each role, companies hiring for remote positions consistently screen for: strong written communication (because most collaboration happens asynchronously via Slack, email, and documentation), self-management and the ability to set your own priorities, comfort with project management tools like Notion, Linear, or Jira, and the discipline to work independently without constant supervision. Demonstrating these skills in your resume and interview answers significantly increases your chances of advancing in remote hiring processes.</p>
            </details>
            <details className="faq-item">
              <summary>How do I stand out in a remote job application?</summary>
              <p>Tailor your resume to highlight remote-specific experience: mention tools you've used, note any past remote or distributed team roles, and quantify your impact with numbers. Write a focused cover letter that explains why you thrive in async environments and gives a concrete example of a project you managed independently. During interviews, prepare answers that show self-direction, clear communication, and timezone consideration. Following up after an interview with a well-written message is especially impactful in remote hiring because it directly demonstrates your written communication skills.</p>
            </details>
            <details className="faq-item">
              <summary>What are the best remote-friendly companies?</summary>
              <p>Many of the world's top technology companies have adopted remote-first or fully-distributed models. Notable examples include GitLab (fully remote since founding), Automattic (makers of WordPress, fully distributed), Basecamp, Buffer, Zapier, and Doist. Large companies like Stripe, Shopify, GitHub, Figma, and Notion offer significant remote options and regularly post remote roles. You can browse jobs from any of these companies by typing their name into the company filter on SeekRemoteJobs. Companies are added as new career page sources are verified.</p>
            </details>
            <details className="faq-item">
              <summary>Can I apply to jobs outside my home country?</summary>
              <p>Many remote roles are open to international applicants, especially at companies that explicitly say "Worldwide," "Global Remote," or "Anywhere." However, some companies hire remotely only within certain countries or regions due to legal, payroll, or tax constraints. Always check the full job description on the company's careers page before applying — the location requirements are usually stated clearly. Some companies work with Employer of Record (EOR) services like Deel or Remote.com, which allow them to hire internationally without setting up a local entity.</p>
            </details>
            <details className="faq-item">
              <summary>How do I avoid scams when applying for remote jobs?</summary>
              <p>Legitimate employers never ask you to pay for equipment, training, or background checks as part of the hiring process. They also never send unsolicited job offers via WhatsApp, Telegram, or personal email from free email domains. Always verify a company's existence through their official website and LinkedIn page before sharing personal information. On SeekRemoteJobs, every listing links directly to an official company careers page — we do not host user-generated listings and do not accept submissions from unverified sources, which significantly reduces the risk of fraudulent postings.</p>
            </details>
          </div>
        </div>
      </section>

      {/* PRE-FOOTER AD */}
      {ADSENSE_SLOTS.preFooter && (
        <div className="prefooter-ad">
          <AdSenseAd slot={ADSENSE_SLOTS.preFooter} format="horizontal" style={{ minHeight: 90 }} />
        </div>
      )}

      {/* ABOUT SECTION */}
      <section className="about-section" aria-labelledby="about-heading">
        <div className="section-wrap">
          <div className="about-inner">
            <div className="about-text">
              <div className="sec-label">About us</div>
              <h2 className="sec-heading" id="about-heading">About SeekRemoteJobs</h2>
              <p>SeekRemoteJobs is an independent remote job aggregator built for professionals who want to work from anywhere. We crawl the official careers pages of vetted companies daily and surface their open remote, hybrid, and distributed roles in one searchable, ad-free interface.</p>
              <p>Unlike general job boards that rely on employer-submitted listings, every job on SeekRemoteJobs is sourced directly from a verified company career page. That means no duplicate postings, no outdated listings, and no fake opportunities — just real roles from real companies, updated every day.</p>
              <p>We believe job seekers deserve a fast, focused, and free tool that respects their time. There are no accounts to create, no applications to submit through our platform, and no fees. We direct you straight to the employer so you can apply on your terms.</p>
              <p>SeekRemoteJobs is free to use and sustained by non-intrusive advertising. We are constantly expanding the list of verified companies we monitor, with a focus on technology, software, and knowledge-work industries where remote roles are most prevalent.</p>
            </div>
            <div className="about-values">
              <h3>Our values</h3>
              <ul className="about-values-list">
                <li><span className="av-icon"><Icons.CheckCircle /></span><div><strong>Transparency</strong><br />Every listing links to a real company page. No middlemen, no mystery.</div></li>
                <li><span className="av-icon"><Icons.Zap /></span><div><strong>Speed</strong><br />Fresh jobs daily. Our crawlers run round-the-clock so you see openings fast.</div></li>
                <li><span className="av-icon"><Icons.Globe /></span><div><strong>Accessibility</strong><br />Free, no sign-up, no paywall. Remote work should be accessible to everyone.</div></li>
                <li><span className="av-icon"><Icons.TrendingUp /></span><div><strong>Quality</strong><br />We vet sources manually. Spam, fake listings, and unverified boards are excluded.</div></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-logo-wrap"><BrandMark /><span className="logo-text">SeekRemote<span className="logo-accent">Jobs</span></span></span>
            <p>The #1 remote job board aggregating real-time listings directly from top tech company career pages. Updated daily.</p>
            <p className="footer-update">{stats.newestJobDate ? `Last updated: ${new Date(stats.newestJobDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}` : "Updated daily"}</p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h4>Browse by Role</h4>
              {["Engineering", "Design", "Product", "Marketing", "Data"].map((r) => (
                <button key={r} className="footer-link-btn" onClick={() => { setTitleFilter(r.toLowerCase()); scrollToJobs(); }}>Remote {r} Jobs</button>
              ))}
            </div>
            <div className="footer-col">
              <h4>Top Companies</h4>
              {COMPANIES_SHOWCASE.slice(0, 5).map((c) => (
                <button key={c} className="footer-link-btn" onClick={() => { setCompanyFilter(c); scrollToJobs(); }}>{c} Remote Jobs</button>
              ))}
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <a href="#how-it-works" className="footer-link-btn">How It Works</a>
              <a href="#why-remote" className="footer-link-btn">Why Work Remotely?</a>
              <button className="footer-link-btn" onClick={scrollToJobs}>All Remote Jobs</button>
              <button className="footer-link-btn" onClick={() => { setShowConsentBanner(true); setShowConsentManage(true); }}>
                Privacy & Cookie Settings
              </button>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="/about.html" className="footer-link-btn">About SeekRemoteJobs</a>
              <a href="/privacy.html" className="footer-link-btn">Privacy Policy</a>
              <a href="/terms.html" className="footer-link-btn">Terms of Service</a>
              <a href="mailto:hello@seekremotejobs.com" className="footer-link-btn">Contact Us</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} SeekRemoteJobs — <strong>{stats.totalJobs.toLocaleString()}+ remote jobs</strong> from <strong>{stats.totalCompanies}+ companies</strong>. Updated daily.</p>
          <p className="footer-bottom-links">
            <a href="/about.html">About</a>
            <a href="/privacy.html">Privacy Policy</a>
            <a href="/terms.html">Terms of Service</a>
            <a href="mailto:hello@seekremotejobs.com">Contact</a>
          </p>
        </div>
      </footer>

      {selectedJob && (
        <JobSheet
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          isSaved={savedJobIds.includes(selectedJob.id)}
          onToggleSave={toggleSaveJob}
          onCopyLink={copyJobLink}
          onTailorResume={tailorResumeForJob}
          isTailoring={tailoringJobId === selectedJob.id}
        />
      )}

      {toast && <div className="action-toast">{toast}</div>}

      {showConsentBanner && (
        <div className="consent-banner" role="dialog" aria-label="Cookie consent" aria-modal="false">
          <p className="consent-title">Your privacy choices</p>
          <p className="consent-text">
            We use cookies for analytics and advertising. You can consent, do not consent, or manage options.
          </p>

          <div className="consent-actions">
            <button className="consent-btn consent-accept" onClick={acceptAllConsent}>Consent</button>
            <button className="consent-btn consent-deny" onClick={denyAllConsent}>Do not consent</button>
            <button className="consent-btn consent-manage" onClick={() => setShowConsentManage((v) => !v)}>Manage options</button>
          </div>

          {showConsentManage && (
            <div className="consent-manage-panel">
              <label className="consent-option">
                <input
                  type="checkbox"
                  checked={consentPrefs.analytics_storage}
                  onChange={(e) => setConsentPrefs((prev) => ({ ...prev, analytics_storage: e.target.checked }))}
                />
                Analytics cookies
              </label>
              <label className="consent-option">
                <input
                  type="checkbox"
                  checked={consentPrefs.ad_storage}
                  onChange={(e) => setConsentPrefs((prev) => ({ ...prev, ad_storage: e.target.checked }))}
                />
                Ad storage
              </label>
              <label className="consent-option">
                <input
                  type="checkbox"
                  checked={consentPrefs.ad_user_data}
                  onChange={(e) => setConsentPrefs((prev) => ({ ...prev, ad_user_data: e.target.checked }))}
                />
                Ad user data
              </label>
              <label className="consent-option">
                <input
                  type="checkbox"
                  checked={consentPrefs.ad_personalization}
                  onChange={(e) => setConsentPrefs((prev) => ({ ...prev, ad_personalization: e.target.checked }))}
                />
                Ad personalization
              </label>
              <button className="consent-save" onClick={() => persistConsent(consentPrefs)}>Save choices</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
