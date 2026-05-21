import express from "express";
import cors from "cors";
import { crawlJobs, listSources } from "./crawlers.js";
import {
  getJobs,
  getMeta,
  upsertJobs,
  updateCrawlMeta,
  getLocations,
  getCompanies,
  getStats,
  getGlobalMetaValue,
  setGlobalMetaValue,
  getAllJobs,
} from "./db.js";

const app = express();
const PORT = process.env.PORT || 4000;
const REFRESH_MIN_INTERVAL_MS = Math.max(
  Number(process.env.REFRESH_MIN_INTERVAL_SECONDS || 900) * 1000,
  60 * 1000
);
const AUTO_REFRESH_INTERVAL_MS = Math.max(
  Number(process.env.AUTO_REFRESH_INTERVAL_MINUTES || 30) * 60 * 1000,
  15 * 60 * 1000
);
const AUTO_REFRESH_ENABLED = process.env.AUTO_REFRESH_ENABLED !== "false";
const ADMIN_REFRESH_TOKEN = process.env.ADMIN_REFRESH_TOKEN || "";

let refreshInProgress = false;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/sources", (_req, res) => {
  res.json({ sources: listSources() });
});

// Get jobs with pagination and filtering
app.get("/api/jobs", async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || 50), 500); // Max 500 per page
  const page = Math.max(parseInt(req.query.page || 1), 1);
  const offset = (page - 1) * limit;

  const company = req.query.company?.toString().trim() || null;
  const title = req.query.title?.toString().trim() || null;
  const location = req.query.location?.toString().trim() || null;
  const daysAgo = req.query.daysAgo?.toString().trim() || null;
  const sort = ["newest", "mixed"].includes(req.query.sort) ? req.query.sort : "mixed";

  const result = await getJobs({
    limit,
    offset,
    company,
    title,
    location,
    daysAgo,
    sort,
  });

  const meta = await getMeta();

  res.json({
    jobs: result.jobs,
    pagination: {
      page,
      limit,
      total: result.total,
      hasMore: result.hasMore,
      pages: Math.ceil(result.total / limit),
    },
    meta,
  });
});

// Get job statistics and metadata
app.get("/api/stats", async (_req, res) => {
  const stats = await getStats();
  const meta = await getMeta();

  res.json({
    ...stats,
    ...meta,
  });
});

// Get filter options
app.get("/api/filters", async (_req, res) => {
  try {
    const [locationsData, companiesData] = await Promise.all([getLocations(), getCompanies()]);
    res.json({
      locations: locationsData.map((l) => l.location),
      companies: companiesData.map((c) => c.company),
    });
  } catch (err) {
    console.error("GET /api/filters error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Refresh jobs from sources
app.post("/api/refresh", async (req, res) => {
  if (refreshInProgress) {
    res.status(409).json({
      refreshed: false,
      message: "Refresh already in progress. Try again shortly.",
    });
    return;
  }

  const force = req.body?.force === true;
  const providedToken = req.headers["x-admin-token"]?.toString() || req.body?.adminToken || "";
  const isAdminBypass = Boolean(ADMIN_REFRESH_TOKEN) && providedToken === ADMIN_REFRESH_TOKEN;

  if (force && !isAdminBypass) {
    res.status(403).json({
      refreshed: false,
      message: "Force refresh requires a valid admin token.",
    });
    return;
  }

  try {
    const lastManualRefreshAt = await getGlobalMetaValue("lastManualRefreshAt");
    const now = Date.now();
    if (!isAdminBypass && lastManualRefreshAt) {
      const diff = now - new Date(lastManualRefreshAt).getTime();
      if (diff < REFRESH_MIN_INTERVAL_MS) {
        const retryAfterMs = REFRESH_MIN_INTERVAL_MS - diff;
        res.status(429).json({
          refreshed: false,
          message: "Refresh throttled to protect upstream APIs. Please try again later.",
          retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
        });
        return;
      }
    }

    refreshInProgress = true;
    console.log("📡 Starting refresh...");
    const keys = Array.isArray(req.body?.sourceKeys) ? req.body.sourceKeys : [];
    const result = await crawlJobs(keys);

    if (result.jobs.length > 0) {
      // Upsert jobs to database
      await upsertJobs(result.jobs);

      // Update crawl metadata for each source
      if (keys.length === 0) {
        // If no specific keys, update all sources
        await Promise.all(listSources().map(async (source) => {
          const sourceJobs = result.jobs.filter((j) => j.source_key === source.key);
          if (sourceJobs.length > 0) {
            await updateCrawlMeta(source.key, sourceJobs.length);
          }
        }));
      } else {
        // Update only the crawled sources
        await Promise.all(keys.map(async (key) => {
          const sourceJobs = result.jobs.filter((j) => j.source_key === key);
          await updateCrawlMeta(key, sourceJobs.length);
        }));
      }
    }

    await setGlobalMetaValue("lastManualRefreshAt", new Date().toISOString());

    const [meta, stats] = await Promise.all([getMeta(), getStats()]);

    res.json({
      refreshed: true,
      jobs_crawled: result.stats.totalCrawled,
      crawledSources: result.crawledSources,
      errors: result.errors,
      meta,
      stats,
    });
  } catch (error) {
    console.error("❌ Refresh failed:", error);
    res.status(500).json({
      refreshed: false,
      message: error?.message || "Failed to refresh jobs",
    });
  } finally {
    refreshInProgress = false;
  }
});

// SEO: robots.txt
app.get("/robots.txt", (_req, res) => {
  res.type("text/plain");
  res.send(`# SeekRemoteJobs robots.txt
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 0

User-agent: *
Allow: /
Allow: /api/jobs
Allow: /api/sources
Allow: /api/stats
Allow: /api/filters
Disallow: /admin
Disallow: /*.json$
Crawl-delay: 1

Sitemap: https://seekremotejobs.com/sitemap.xml
Sitemap: https://seekremotejobs.com/sitemap-jobs.xml`);
});

// SEO: Main Sitemap (key pages and filters)
app.get("/sitemap.xml", async (_req, res) => {
  const companies = await getCompanies();
  const today = new Date().toISOString().split("T")[0];
  const jobRoles = ["engineering", "design", "product", "marketing", "data", "devops"];
  const locations = ["Remote", "US", "Europe", "Worldwide"];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://seekremotejobs.com</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://seekremotejobs.com#jobs</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>https://seekremotejobs.com#how-it-works</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://seekremotejobs.com#why-remote</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;

  // Add role-based pages
  jobRoles.forEach((role) => {
    xml += `
  <url>
    <loc>https://seekremotejobs.com?title=${encodeURIComponent(role)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>`;
  });

  // Add location-based pages
  locations.forEach((location) => {
    xml += `
  <url>
    <loc>https://seekremotejobs.com?location=${encodeURIComponent(location)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  // Add top company pages
  companies.slice(0, 25).forEach((c) => {
    xml += `
  <url>
    <loc>https://seekremotejobs.com?company=${encodeURIComponent(c.company)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.75</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  res.type("application/xml");
  res.send(xml);
});

// SEO: Job Listings Sitemap
app.get("/sitemap-jobs.xml", async (_req, res) => {
  try {
    const allJobs = await getAllJobs();
    const today = new Date().toISOString().split("T")[0];
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    allJobs.slice(0, 5000).forEach((job) => {
      if (!job.url) return; // Skip jobs without URLs
      const lastmod = ((job.updatedAt instanceof Date ? job.updatedAt.toISOString() : job.updatedAt) || new Date().toISOString()).split("T")[0];
      const safeUrl = (job.url || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      xml += `  <url>
    <loc>${safeUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
    });

    xml += `</urlset>`;
    res.type("application/xml");
    res.send(xml);
  } catch (err) {
    console.error("Sitemap jobs error:", err);
    res.status(500).send("Error generating job listings sitemap");
  }
});

// SEO: JSON-LD for job listings
app.get("/api/jobs-schema.json", async (_req, res) => {
  const result = await getJobs({ limit: 100 });
  const jobs = result.jobs;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://seekremotejobs.com",
    name: "SeekRemoteJobs - Remote Tech Jobs Board",
    description: "Browse and search thousands of remote tech jobs from 40+ leading companies. Updated daily. Free to use.",
    url: "https://seekremotejobs.com",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: jobs.slice(0, 20).map((job, idx) => ({
        "@type": "JobPosting",
        position: idx + 1,
        title: job.title,
        description: `${job.title} at ${job.company}. Location: ${job.location || 'Remote'}.`,
        url: job.url,
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.location,
            addressCountry: "US",
          },
        },
        hiringOrganization: {
          "@type": "Organization",
          name: job.company,
          sameAs: job.careersUrl || job.url,
          logo: `https://logo.clearbit.com/${new URL(job.careersUrl || job.url).hostname}`,
        },
        datePosted: job.updatedAt,
        validThrough: new Date(new Date(job.updatedAt).getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        employmentType: job.location?.toLowerCase().includes('hybrid') ? 'FULL_TIME' : 'FULL_TIME',
        applicantLocationRequirements: {
          "@type": "Country",
          name: "Worldwide",
        },
      })),
    },
  };

  res.json(schema);
});

async function bootstrap() {
  try {
    console.log("🚀 Starting initial crawl...");
    refreshInProgress = true;
    const initial = await crawlJobs();
    
    if (initial.jobs.length > 0) {
      console.log(`📥 Saving ${initial.jobs.length} jobs to database...`);
      await upsertJobs(initial.jobs);
      
      // Update crawl metadata
      await Promise.all(listSources().map(async (source) => {
        const sourceJobs = initial.jobs.filter((j) => j.source_key === source.key);
        if (sourceJobs.length > 0) {
          await updateCrawlMeta(source.key, sourceJobs.length);
        }
      }));
      
      const stats = await getStats();
      console.log(`✅ Ready! Database has ${stats.totalJobs} jobs from ${stats.totalCompanies} companies`);
    }

    if (initial.errors.length) {
      console.warn("⚠️  Some sources failed:", initial.errors);
    }
  } catch (error) {
    console.error("❌ Initial crawl failed:", error);
  } finally {
    refreshInProgress = false;
  }

  if (AUTO_REFRESH_ENABLED) {
    setInterval(async () => {
      if (refreshInProgress) {
        return;
      }
      try {
        refreshInProgress = true;
        console.log("⏱️ Running scheduled refresh...");
        const result = await crawlJobs();
        if (result.jobs.length > 0) {
          await upsertJobs(result.jobs);
          await setGlobalMetaValue("lastScheduledRefreshAt", new Date().toISOString());
        }
      } catch (error) {
        console.error("❌ Scheduled refresh failed:", error);
      } finally {
        refreshInProgress = false;
      }
    }, AUTO_REFRESH_INTERVAL_MS);
  }

  app.listen(PORT, () => {
    console.log(`\n🎯 Job crawler API running on http://localhost:${PORT}`);
    console.log(`📊 API Endpoints:`);
    console.log(`   - GET /api/jobs?page=1&limit=50 - Get paginated jobs`);
    console.log(`   - GET /api/stats - Get job statistics`);
    console.log(`   - GET /api/filters - Get filter options`);
    console.log(`   - POST /api/refresh - Refresh jobs from sources`);
    console.log(`   - Refresh throttle: ${Math.round(REFRESH_MIN_INTERVAL_MS / 60000)} min between manual refreshes`);
    if (ADMIN_REFRESH_TOKEN) {
      console.log(`   - Admin bypass: send x-admin-token with force=true`);
    }
    if (AUTO_REFRESH_ENABLED) {
      console.log(`   - Scheduled refresh: every ${Math.round(AUTO_REFRESH_INTERVAL_MS / 60000)} min`);
    }
    console.log(`   - GET /robots.txt - SEO robots file`);
    console.log(`   - GET /sitemap.xml - XML sitemap`);
  });
}

bootstrap().catch((err) => {
  console.error("Bootstrap failed:", err);
  process.exit(1);
});
