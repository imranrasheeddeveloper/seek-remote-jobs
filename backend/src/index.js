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
  getJobById,
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
const SITEMAP_JOB_PAGE_SIZE = 5000;

function xmlEscape(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toDateOnly(value) {
  if (!value) return new Date().toISOString().split("T")[0];
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().split("T")[0];
  return d.toISOString().split("T")[0];
}

function htmlEscape(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// SEO: Indexable job detail landing pages
app.get("/jobs/:id", async (req, res) => {
  try {
    const job = await getJobById(req.params.id);
    if (!job) {
      res.status(404).type("text/plain").send("Job not found");
      return;
    }

    const title = `${job.title} at ${job.company} | Remote Job | SeekRemoteJobs`;
    const description = `${job.title} role at ${job.company}. ${job.location || "Remote"}. View details and apply on the official careers page.`;
    const pageUrl = `https://seekremotejobs.com/jobs/${encodeURIComponent(job.id)}`;
    const applyUrl = job.url || "https://seekremotejobs.com";
    const lastmod = toDateOnly(job.updatedAt);
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: job.title,
      description,
      datePosted: job.updatedAt || new Date().toISOString(),
      hiringOrganization: {
        "@type": "Organization",
        name: job.company,
      },
      jobLocationType: "TELECOMMUTE",
      applicantLocationRequirements: {
        "@type": "Country",
        name: "Worldwide",
      },
      employmentType: "FULL_TIME",
      url: pageUrl,
      directApply: true,
    };

    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${htmlEscape(title)}</title>
    <meta name="description" content="${htmlEscape(description)}" />
    <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
    <link rel="canonical" href="${htmlEscape(pageUrl)}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${htmlEscape(title)}" />
    <meta property="og:description" content="${htmlEscape(description)}" />
    <meta property="og:url" content="${htmlEscape(pageUrl)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${htmlEscape(title)}" />
    <meta name="twitter:description" content="${htmlEscape(description)}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 0; padding: 32px 16px; color: #0f172a; background: #f8fafc; }
      .wrap { max-width: 820px; margin: 0 auto; background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; }
      h1 { margin: 0 0 10px; font-size: 1.85rem; line-height: 1.2; }
      .meta { color: #475569; margin-bottom: 18px; }
      .apply { display: inline-block; margin-top: 12px; background: #0f172a; color: #fff; text-decoration: none; padding: 12px 18px; border-radius: 10px; font-weight: 600; }
      .small { color: #64748b; margin-top: 16px; font-size: 0.92rem; }
      .crumb { margin-bottom: 12px; font-size: 0.92rem; }
      .crumb a { color: #2563eb; text-decoration: none; }
    </style>
  </head>
  <body>
    <main class="wrap">
      <div class="crumb"><a href="https://seekremotejobs.com">SeekRemoteJobs</a> / Job</div>
      <h1>${htmlEscape(job.title)}</h1>
      <p class="meta"><strong>${htmlEscape(job.company)}</strong> · ${htmlEscape(job.location || "Remote")} · Updated ${htmlEscape(lastmod)}</p>
      <p>${htmlEscape(description)}</p>
      <a class="apply" href="${htmlEscape(applyUrl)}" rel="nofollow sponsored noopener noreferrer" target="_blank">Apply on official site</a>
      <p class="small">Source: ${htmlEscape(job.sourceLabel || "Company careers page")}</p>
    </main>
  </body>
</html>`;

    res.type("text/html").send(html);
  } catch (err) {
    console.error("GET /jobs/:id error:", err);
    res.status(500).type("text/plain").send("Failed to load job page");
  }
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

// SEO: Sitemap index (recommended entrypoint)
app.get("/sitemap.xml", async (_req, res) => {
  const allJobs = await getAllJobs();
  const jobsWithId = allJobs.filter((job) => Boolean(job.id));
  const pageCount = Math.max(1, Math.ceil(jobsWithId.length / SITEMAP_JOB_PAGE_SIZE));
  const today = toDateOnly(new Date());

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://seekremotejobs.com/sitemap-main.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://seekremotejobs.com/sitemap-jobs.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`;

  for (let page = 2; page <= pageCount; page += 1) {
    xml += `
  <sitemap>
    <loc>https://seekremotejobs.com/sitemap-jobs-${page}.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`;
  }

  xml += `
</sitemapindex>`;

  res.type("application/xml");
  res.send(xml);
});

// SEO: Main Sitemap (key pages and filters)
app.get("/sitemap-main.xml", async (_req, res) => {
  const companies = await getCompanies();
  const today = toDateOnly(new Date());
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
    <loc>https://seekremotejobs.com?sort=newest</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>https://seekremotejobs.com?title=remote</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://seekremotejobs.com?location=Worldwide</loc>
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

function buildJobSitemapXml(jobs, pageNumber) {
  const start = (pageNumber - 1) * SITEMAP_JOB_PAGE_SIZE;
  const end = start + SITEMAP_JOB_PAGE_SIZE;
  const pageJobs = jobs.slice(start, end);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  pageJobs.forEach((job) => {
    if (!job.id) return;
    const lastmod = toDateOnly(job.updatedAt);
    // Sitemap URLs must remain on the same host as the sitemap file.
    const safeUrl = xmlEscape(`https://seekremotejobs.com/jobs/${encodeURIComponent(job.id)}`);
    xml += `  <url>
    <loc>${safeUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
  });

  xml += `</urlset>`;
  return xml;
}

// SEO: Job Listings Sitemap
app.get("/sitemap-jobs.xml", async (_req, res) => {
  try {
    const allJobs = (await getAllJobs()).filter((job) => Boolean(job.id));
    const xml = buildJobSitemapXml(allJobs, 1);
    res.type("application/xml");
    res.send(xml);
  } catch (err) {
    console.error("Sitemap jobs error:", err);
    res.status(500).send("Error generating job listings sitemap");
  }
});

app.get("/sitemap-jobs-:page.xml", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.params.page || "1", 10), 1);
    const allJobs = (await getAllJobs()).filter((job) => Boolean(job.id));
    const maxPage = Math.max(1, Math.ceil(allJobs.length / SITEMAP_JOB_PAGE_SIZE));

    if (page > maxPage) {
      res.status(404).type("text/plain").send("Sitemap page not found");
      return;
    }

    const xml = buildJobSitemapXml(allJobs, page);
    res.type("application/xml");
    res.send(xml);
  } catch (err) {
    console.error("Sitemap jobs page error:", err);
    res.status(500).send("Error generating paginated job sitemap");
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
