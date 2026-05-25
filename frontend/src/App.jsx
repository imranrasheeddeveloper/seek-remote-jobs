import React, { useEffect, useState, useRef } from "react";
import "./styles.css";

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
const DEFAULT_CONSENT = {
  ad_storage: false,
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
  { label: "All Roles", value: "" },
  { label: "Engineering", value: "engineer" },
  { label: "Design", value: "design" },
  { label: "Product", value: "product" },
  { label: "Marketing", value: "marketing" },
  { label: "Data / ML", value: "data" },
  { label: "DevOps", value: "devops" },
  { label: "Sales", value: "sales" },
  { label: "Operations", value: "operations" },
];

const COMPANIES_SHOWCASE = [
  "Stripe", "GitHub", "Figma", "Airbnb", "Slack", "Shopify", "Notion", "Linear",
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

function getWorkType(location) {
  if (!location) return "remote";
  const l = location.toLowerCase();
  if (l.includes("hybrid")) return "hybrid";
  if (l.includes("onsite") || l.includes("on-site") || l.includes("in-office")) return "onsite";
  return "remote";
}

function JobSheet({ job, onClose }) {
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
  const [jobs, setJobs] = useState([]);
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
    setCurrentPage(1);
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
            <a href="#jobs" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToJobs(); }}>Browse Jobs</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#why-remote" className="nav-link">Why Remote</a>
          </nav>
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
            <a href="#jobs" onClick={() => { scrollToJobs(); setMobileMenuOpen(false); }}>Browse Jobs</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#why-remote" onClick={() => setMobileMenuOpen(false)}>Why Remote</a>
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
            <Icons.CheckCircle /> Updated daily &nbsp;·&nbsp; 100% free &nbsp;·&nbsp; No sign-up needed
          </div>
          <h1 className="hero-title">
            Find Your Next<br />
            <span className="hero-gradient">Remote Job</span>
          </h1>
          <p className="hero-subtitle">
            Browse <strong>{stats.totalJobs.toLocaleString()}+</strong> remote opportunities from{" "}
            <strong>{stats.totalCompanies}+</strong> top tech companies.
            Work from anywhere, on your terms.
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
          {ADSENSE_SLOTS.hero && (
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
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No remote jobs found</h3>
              <p>Try adjusting your search or clearing filters.</p>
              <button className="btn-primary" onClick={clearAllFilters}>Clear All Filters</button>
            </div>
          ) : (
            <div className="jobs-list" role="list">
              {jobs.reduce((acc, job, idx) => {
                const wt = getWorkType(job.location);
                const worldwide = isWorldwideRemote(job.location);
                acc.push(
                  <article
                    className="job-card"
                    key={job.id}
                    role="listitem"
                    onClick={() => setSelectedJob(job)}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedJob(job)}
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
                if (ADSENSE_SLOTS.inFeed && (idx + 1) % 5 === 0 && idx !== jobs.length - 1) {
                  acc.push(
                    <div className="infeed-ad" key={`ad-${idx}`}>
                      <AdSenseAd slot={ADSENSE_SLOTS.inFeed} format="fluid" style={{ display: "block" }} />
                    </div>
                  );
                }
                return acc;
              }, [])}
            </div>
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
              <p>SeekRemoteJobs aggregates remote roles from top company career pages, so you can browse fresh openings in one place.</p>
            </details>
            <details className="faq-item">
              <summary>Are these jobs fully remote?</summary>
              <p>Most listings are remote-first. You can also see hybrid and onsite listings when companies publish those roles.</p>
            </details>
            <details className="faq-item">
              <summary>Is SeekRemoteJobs free to use?</summary>
              <p>Yes. It is completely free for job seekers, with direct links to official company application pages.</p>
            </details>
            <details className="faq-item">
              <summary>How often are jobs updated?</summary>
              <p>Jobs are refreshed daily from supported sources, and stale postings are removed over time.</p>
            </details>
            <details className="faq-item">
              <summary>Can I filter by role and location?</summary>
              <p>Yes. Use filters for title, company, location, posted date, and sort order to narrow results quickly.</p>
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
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} SeekRemoteJobs — <strong>{stats.totalJobs.toLocaleString()}+ remote jobs</strong> from <strong>{stats.totalCompanies}+ companies</strong>. Updated daily.</p>
        </div>
      </footer>

      {selectedJob && (
        <JobSheet job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}

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
