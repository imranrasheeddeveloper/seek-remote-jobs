const DEFAULT_SOURCES = [
  // INTERNET-WIDE FEEDS (discover startups beyond hardcoded company lists)
  {
    key: "internet-remotive",
    company: "Internet Startup Feed",
    type: "feed-remotive",
    careersUrl: "https://remotive.com/remote-jobs",
  },
  {
    key: "internet-remoteok",
    company: "Internet Remote Feed",
    type: "feed-remoteok",
    careersUrl: "https://remoteok.com/remote-jobs",
  },
  {
    key: "internet-jobicy",
    company: "Internet Startup Feed 2",
    type: "feed-jobicy",
    careersUrl: "https://jobicy.com/api/v2/remote-jobs",
  },

  // GREENHOUSE SOURCES (100+ job postings per company)
  {
    key: "airbnb",
    company: "Airbnb",
    type: "greenhouse",
    boardToken: "airbnb",
    careersUrl: "https://careers.airbnb.com/",
  },
  {
    key: "stripe",
    company: "Stripe",
    type: "greenhouse",
    boardToken: "stripe",
    careersUrl: "https://stripe.com/jobs",
  },
  {
    key: "figma",
    company: "Figma",
    type: "greenhouse",
    boardToken: "figma",
    careersUrl: "https://fig.co/careers",
  },
  {
    key: "notion",
    company: "Notion",
    type: "ashby",
    ashbyBoard: "notion",
    careersUrl: "https://www.notion.so/careers",
  },
  {
    key: "gitlab",
    company: "GitLab",
    type: "greenhouse",
    boardToken: "gitlab",
    careersUrl: "https://about.gitlab.com/jobs/",
  },
  {
    key: "shopify",
    company: "Shopify",
    type: "greenhouse",
    boardToken: "shopify",
    careersUrl: "https://www.shopify.com/careers",
  },
  {
    key: "twilio",
    company: "Twilio",
    type: "greenhouse",
    boardToken: "twilio",
    careersUrl: "https://www.twilio.com/en-us/company/careers",
  },
  {
    key: "datadog",
    company: "Datadog",
    type: "greenhouse",
    boardToken: "datadog",
    careersUrl: "https://www.datadoghq.com/careers/",
  },
  {
    key: "canva",
    company: "Canva",
    type: "greenhouse",
    boardToken: "canva",
    careersUrl: "https://www.canva.com/careers/",
  },
  {
    key: "docker",
    company: "Docker",
    type: "greenhouse",
    boardToken: "docker",
    careersUrl: "https://www.docker.com/company/careers",
  },
  {
    key: "cloudflare",
    company: "Cloudflare",
    type: "greenhouse",
    boardToken: "cloudflare",
    careersUrl: "https://www.cloudflare.com/careers/",
  },
  {
    key: "hashicorp",
    company: "HashiCorp",
    type: "greenhouse",
    boardToken: "hashicorp",
    careersUrl: "https://www.hashicorp.com/careers",
  },
  {
    key: "supabase",
    company: "Supabase",
    type: "greenhouse",
    boardToken: "supabase",
    careersUrl: "https://supabase.com/careers",
  },
  {
    key: "vercel",
    company: "Vercel",
    type: "greenhouse",
    boardToken: "vercel",
    careersUrl: "https://vercel.com/careers",
  },
  {
    key: "discord",
    company: "Discord",
    type: "greenhouse",
    boardToken: "discord",
    careersUrl: "https://discord.com/careers",
  },
  {
    key: "dropbox",
    company: "Dropbox",
    type: "greenhouse",
    boardToken: "dropbox",
    careersUrl: "https://www.dropbox.com/jobs",
  },
  {
    key: "asana",
    company: "Asana",
    type: "greenhouse",
    boardToken: "asana",
    careersUrl: "https://asana.com/careers",
  },
  // ── ADDITIONAL GREENHOUSE (replacing broken Workable) ──
  {
    key: "automattic",
    company: "Automattic",
    type: "greenhouse",
    boardToken: "automattic",
    careersUrl: "https://automattic.com/work-with-us/",
  },
  {
    key: "fastly",
    company: "Fastly",
    type: "greenhouse",
    boardToken: "fastly",
    careersUrl: "https://www.fastly.com/about/careers",
  },
  {
    key: "robinhood",
    company: "Robinhood",
    type: "greenhouse",
    boardToken: "robinhood",
    careersUrl: "https://careers.robinhood.com",
  },
  {
    key: "intercom",
    company: "Intercom",
    type: "greenhouse",
    boardToken: "intercom",
    careersUrl: "https://www.intercom.com/careers",
  },
  {
    key: "typeform",
    company: "Typeform",
    type: "greenhouse",
    boardToken: "typeform",
    careersUrl: "https://www.typeform.com/careers/",
  },
  {
    key: "revolut",
    company: "Revolut",
    type: "greenhouse",
    boardToken: "revolut",
    careersUrl: "https://www.revolut.com/careers",
  },
  {
    key: "deel",
    company: "Deel",
    type: "greenhouse",
    boardToken: "deel",
    careersUrl: "https://www.deel.com/careers",
  },
  {
    key: "wise",
    company: "Wise",
    type: "greenhouse",
    boardToken: "wise",
    careersUrl: "https://wise.com/careers",
  },
  {
    key: "calendly",
    company: "Calendly",
    type: "greenhouse",
    boardToken: "calendly",
    careersUrl: "https://calendly.com/careers",
  },
  {
    key: "zapier",
    company: "Zapier",
    type: "greenhouse",
    boardToken: "zapier",
    careersUrl: "https://zapier.com/jobs",
  },
  // ── GREENHOUSE (additional companies) ──
  {
    key: "lyft",
    company: "Lyft",
    type: "greenhouse",
    boardToken: "lyft",
    careersUrl: "https://www.lyft.com/careers",
  },
  {
    key: "coinbase",
    company: "Coinbase",
    type: "greenhouse",
    boardToken: "coinbase",
    careersUrl: "https://www.coinbase.com/careers",
  },
  {
    key: "databricks",
    company: "Databricks",
    type: "greenhouse",
    boardToken: "databricks",
    careersUrl: "https://www.databricks.com/company/careers",
  },
  {
    key: "mongodb",
    company: "MongoDB",
    type: "greenhouse",
    boardToken: "mongodb",
    careersUrl: "https://www.mongodb.com/company/careers",
  },
  {
    key: "reddit",
    company: "Reddit",
    type: "greenhouse",
    boardToken: "reddit",
    careersUrl: "https://www.redditinc.com/careers",
  },
  {
    key: "duolingo",
    company: "Duolingo",
    type: "greenhouse",
    boardToken: "duolingo",
    careersUrl: "https://careers.duolingo.com",
  },
  {
    key: "instacart",
    company: "Instacart",
    type: "greenhouse",
    boardToken: "instacart",
    careersUrl: "https://instacart.careers",
  },
  {
    key: "pagerduty",
    company: "PagerDuty",
    type: "greenhouse",
    boardToken: "pagerduty",
    careersUrl: "https://www.pagerduty.com/careers/",
  },
  {
    key: "elastic",
    company: "Elastic",
    type: "greenhouse",
    boardToken: "elastic",
    careersUrl: "https://www.elastic.co/about/careers",
  },
  {
    key: "newrelic",
    company: "New Relic",
    type: "greenhouse",
    boardToken: "newrelic",
    careersUrl: "https://newrelic.com/about/careers",
  },
  {
    key: "snyk",
    company: "Snyk",
    type: "greenhouse",
    boardToken: "snyk",
    careersUrl: "https://snyk.io/careers/",
  },
  {
    key: "postman",
    company: "Postman",
    type: "greenhouse",
    boardToken: "postman",
    careersUrl: "https://www.postman.com/company/careers/",
  },
  {
    key: "retool",
    company: "Retool",
    type: "greenhouse",
    boardToken: "retool",
    careersUrl: "https://retool.com/careers",
  },
  {
    key: "fivetran",
    company: "Fivetran",
    type: "greenhouse",
    boardToken: "fivetran",
    careersUrl: "https://www.fivetran.com/careers",
  },
  {
    key: "klaviyo",
    company: "Klaviyo",
    type: "greenhouse",
    boardToken: "klaviyo",
    careersUrl: "https://www.klaviyo.com/careers",
  },
  {
    key: "rippling",
    company: "Rippling",
    type: "greenhouse",
    boardToken: "rippling",
    careersUrl: "https://www.rippling.com/careers",
  },
  {
    key: "lattice",
    company: "Lattice",
    type: "greenhouse",
    boardToken: "lattice",
    careersUrl: "https://lattice.com/careers",
  },
  {
    key: "gusto",
    company: "Gusto",
    type: "greenhouse",
    boardToken: "gusto",
    careersUrl: "https://gusto.com/about/careers",
  },
  {
    key: "okta",
    company: "Okta",
    type: "greenhouse",
    boardToken: "okta",
    careersUrl: "https://www.okta.com/company/careers/",
  },
  {
    key: "amplitude",
    company: "Amplitude",
    type: "greenhouse",
    boardToken: "amplitude",
    careersUrl: "https://amplitude.com/careers",
  },
  {
    key: "sourcegraph",
    company: "Sourcegraph",
    type: "greenhouse",
    boardToken: "sourcegraph",
    careersUrl: "https://about.sourcegraph.com/jobs/",
  },
  {
    key: "hubspot",
    company: "HubSpot",
    type: "greenhouse",
    boardToken: "hubspot",
    careersUrl: "https://www.hubspot.com/careers",
  },
  {
    key: "zendesk",
    company: "Zendesk",
    type: "greenhouse",
    boardToken: "zendesk",
    careersUrl: "https://www.zendesk.com/jobs/",
  },
  {
    key: "grafana",
    company: "Grafana Labs",
    type: "greenhouse",
    boardToken: "grafanalabs",
    careersUrl: "https://grafana.com/about/careers/",
  },
  {
    key: "miro",
    company: "Miro",
    type: "greenhouse",
    boardToken: "miro",
    careersUrl: "https://miro.com/careers/",
  },
  {
    key: "algolia",
    company: "Algolia",
    type: "greenhouse",
    boardToken: "algolia",
    careersUrl: "https://www.algolia.com/careers/",
  },
  {
    key: "samsara",
    company: "Samsara",
    type: "greenhouse",
    boardToken: "samsara",
    careersUrl: "https://www.samsara.com/company/careers",
  },
  {
    key: "chainalysis",
    company: "Chainalysis",
    type: "greenhouse",
    boardToken: "chainalysis",
    careersUrl: "https://www.chainalysis.com/careers/",
  },
  {
    key: "airbyte",
    company: "Airbyte",
    type: "greenhouse",
    boardToken: "airbyte",
    careersUrl: "https://airbyte.com/careers",
  },
  {
    key: "dbtlabs",
    company: "dbt Labs",
    type: "greenhouse",
    boardToken: "dbtlabs",
    careersUrl: "https://www.getdbt.com/dbt-labs/open-roles/",
  },
  {
    key: "vanta",
    company: "Vanta",
    type: "greenhouse",
    boardToken: "vanta",
    careersUrl: "https://www.vanta.com/careers",
  },
  {
    key: "drata",
    company: "Drata",
    type: "greenhouse",
    boardToken: "drata",
    careersUrl: "https://drata.com/careers",
  },
  {
    key: "hightouch",
    company: "Hightouch",
    type: "greenhouse",
    boardToken: "hightouch",
    careersUrl: "https://hightouch.com/careers",
  },
  {
    key: "census",
    company: "Census",
    type: "greenhouse",
    boardToken: "census",
    careersUrl: "https://www.getcensus.com/careers",
  },
  {
    key: "braintrust",
    company: "Braintrust",
    type: "greenhouse",
    boardToken: "braintrust",
    careersUrl: "https://www.usebraintrust.com/careers",
  },
  {
    key: "lacework",
    company: "Lacework",
    type: "greenhouse",
    boardToken: "lacework",
    careersUrl: "https://www.lacework.com/careers/",
  },
  {
    key: "wrike",
    company: "Wrike",
    type: "greenhouse",
    boardToken: "wrike",
    careersUrl: "https://www.wrike.com/careers/",
  },
  {
    key: "front",
    company: "Front",
    type: "greenhouse",
    boardToken: "front",
    careersUrl: "https://front.com/careers",
  },
  {
    key: "replit",
    company: "Replit",
    type: "greenhouse",
    boardToken: "replit",
    careersUrl: "https://replit.com/site/careers",
  },
  {
    key: "linear",
    company: "Linear",
    type: "ashby",
    ashbyBoard: "linear",
    careersUrl: "https://linear.app/careers",
  },
  {
    key: "airtable-gh",
    company: "Airtable",
    type: "greenhouse",
    boardToken: "airtable",
    careersUrl: "https://airtable.com/careers",
  },
  {
    key: "hex",
    company: "Hex",
    type: "greenhouse",
    boardToken: "hex",
    careersUrl: "https://hex.tech/company/careers",
  },
  {
    key: "sentry",
    company: "Sentry",
    type: "ashby",
    ashbyBoard: "sentry",
    careersUrl: "https://sentry.io/careers/",
  },
  {
    key: "launchdarkly",
    company: "LaunchDarkly",
    type: "greenhouse",
    boardToken: "launchdarkly",
    careersUrl: "https://launchdarkly.com/careers/",
  },
  {
    key: "verkada",
    company: "Verkada",
    type: "greenhouse",
    boardToken: "verkada",
    careersUrl: "https://www.verkada.com/careers/",
  },
  {
    key: "figma-2",
    company: "Abnormal Security",
    type: "greenhouse",
    boardToken: "abnormalsecurity",
    careersUrl: "https://abnormalsecurity.com/careers",
  },
  {
    key: "navan",
    company: "Navan",
    type: "greenhouse",
    boardToken: "navan",
    careersUrl: "https://navan.com/careers",
  },
  {
    key: "anthropic",
    company: "Anthropic",
    type: "greenhouse",
    boardToken: "anthropic",
    careersUrl: "https://www.anthropic.com/careers",
  },
  {
    key: "openai",
    company: "OpenAI",
    type: "ashby",
    ashbyBoard: "openai",
    careersUrl: "https://openai.com/careers",
  },
  {
    key: "perplexity",
    company: "Perplexity AI",
    type: "greenhouse",
    boardToken: "perplexityai",
    careersUrl: "https://www.perplexity.ai/hub/careers",
  },
  {
    key: "mixpanel-gh",
    company: "Mixpanel",
    type: "greenhouse",
    boardToken: "mixpanel",
    careersUrl: "https://mixpanel.com/jobs/",
  },
  // ── LEVER (additional companies) ──
  {
    key: "benchling",
    company: "Benchling",
    type: "ashby",
    ashbyBoard: "benchling",
    careersUrl: "https://benchling.com/careers",
  },
  {
    key: "cohere",
    company: "Cohere",
    type: "ashby",
    ashbyBoard: "cohere",
    careersUrl: "https://cohere.com/careers",
  },
  // ── ASHBY SOURCES ──
  {
    key: "ramp",
    company: "Ramp",
    type: "ashby",
    ashbyBoard: "ramp",
    careersUrl: "https://ramp.com/careers",
  },
  {
    key: "plaid-ashby",
    company: "Plaid",
    type: "ashby",
    ashbyBoard: "plaid",
    careersUrl: "https://plaid.com/careers",
  },
  {
    key: "cursor-ashby",
    company: "Cursor",
    type: "ashby",
    ashbyBoard: "cursor",
    careersUrl: "https://www.cursor.com/careers",
  },
  {
    key: "baseten",
    company: "Baseten",
    type: "ashby",
    ashbyBoard: "baseten",
    careersUrl: "https://www.baseten.co/careers",
  },
  {
    key: "modal-ashby",
    company: "Modal",
    type: "ashby",
    ashbyBoard: "modal",
    careersUrl: "https://modal.com/careers",
  },
  {
    key: "wealthsimple",
    company: "Wealthsimple",
    type: "ashby",
    ashbyBoard: "wealthsimple",
    careersUrl: "https://www.wealthsimple.com/en-ca/careers",
  },
  {
    key: "persona-ashby",
    company: "Persona",
    type: "ashby",
    ashbyBoard: "persona",
    careersUrl: "https://withpersona.com/careers",
  },
  {
    key: "plain-ashby",
    company: "Plain",
    type: "ashby",
    ashbyBoard: "plain",
    careersUrl: "https://plain.com/careers",
  },
  {
    key: "substack-ashby",
    company: "Substack",
    type: "ashby",
    ashbyBoard: "substack",
    careersUrl: "https://substack.com/careers",
  },
  {
    key: "moderntreasury",
    company: "Modern Treasury",
    type: "ashby",
    ashbyBoard: "moderntreasury",
    careersUrl: "https://www.moderntreasury.com/careers",
  },
  {
    key: "runway-ashby",
    company: "Runway",
    type: "ashby",
    ashbyBoard: "runway",
    careersUrl: "https://runwayml.com/careers",
  },
  {
    key: "warp-ashby",
    company: "Warp",
    type: "ashby",
    ashbyBoard: "warp",
    careersUrl: "https://www.warp.dev/careers",
  },
  {
    key: "apify-ashby",
    company: "Apify",
    type: "ashby",
    ashbyBoard: "apify",
    careersUrl: "https://apify.com/careers",
  },
  {
    key: "railway-ashby",
    company: "Railway",
    type: "ashby",
    ashbyBoard: "railway",
    careersUrl: "https://railway.app/careers",
  },
  {
    key: "neon-ashby",
    company: "Neon",
    type: "ashby",
    ashbyBoard: "neon",
    careersUrl: "https://neon.tech/careers",
  },
  {
    key: "stytch-ashby",
    company: "Stytch",
    type: "ashby",
    ashbyBoard: "stytch",
    careersUrl: "https://stytch.com/careers",
  },
  {
    key: "inngest-ashby",
    company: "Inngest",
    type: "ashby",
    ashbyBoard: "inngest",
    careersUrl: "https://www.inngest.com/careers",
  },
  {
    key: "resend-ashby",
    company: "Resend",
    type: "ashby",
    ashbyBoard: "resend",
    careersUrl: "https://resend.com/careers",
  },
  {
    key: "clerk-ashby",
    company: "Clerk",
    type: "ashby",
    ashbyBoard: "clerk",
    careersUrl: "https://clerk.com/careers",
  },
  // ── ASHBY — worldwide-remote small companies ──
  {
    key: "posthog-ashby",
    company: "PostHog",
    type: "ashby",
    ashbyBoard: "posthog",
    careersUrl: "https://posthog.com/careers",
  },
  {
    key: "helpscout-ashby",
    company: "Help Scout",
    type: "ashby",
    ashbyBoard: "helpscout",
    careersUrl: "https://www.helpscout.com/company/careers/",
  },
  {
    key: "zed-ashby",
    company: "Zed",
    type: "ashby",
    ashbyBoard: "zed",
    careersUrl: "https://zed.dev/jobs",
  },
  {
    key: "mintlify-ashby",
    company: "Mintlify",
    type: "ashby",
    ashbyBoard: "mintlify",
    careersUrl: "https://mintlify.com/careers",
  },
  {
    key: "livekit-ashby",
    company: "LiveKit",
    type: "ashby",
    ashbyBoard: "livekit",
    careersUrl: "https://livekit.io/careers",
  },
  // ── GREENHOUSE — worldwide remote-first companies ──
  {
    key: "gitlab-gh",
    company: "GitLab",
    type: "greenhouse",
    boardToken: "gitlab",
    careersUrl: "https://about.gitlab.com/jobs/",
  },
  {
    key: "duckduckgo",
    company: "DuckDuckGo",
    type: "greenhouse",
    boardToken: "duckduckgo",
    careersUrl: "https://duckduckgo.com/hiring",
  },
  {
    key: "semrush",
    company: "Semrush",
    type: "greenhouse",
    boardToken: "semrush",
    careersUrl: "https://www.semrush.com/company/careers/",
  },
  {
    key: "gumroad",
    company: "Gumroad",
    type: "greenhouse",
    boardToken: "gumroad",
    careersUrl: "https://gumroad.com/jobs",
  },
  {
    key: "close",
    company: "Close",
    type: "greenhouse",
    boardToken: "close",
    careersUrl: "https://jobs.close.com/",
  },
  {
    key: "remote-com",
    company: "Remote",
    type: "greenhouse",
    boardToken: "remotecom",
    careersUrl: "https://remote.com/careers",
  },
  {
    key: "descript-gh",
    company: "Descript",
    type: "greenhouse",
    boardToken: "descript",
    careersUrl: "https://www.descript.com/careers",
  },
  {
    key: "coda-gh",
    company: "Coda",
    type: "greenhouse",
    boardToken: "coda",
    careersUrl: "https://coda.io/careers",
  },
  {
    key: "pitch-gh",
    company: "Pitch",
    type: "greenhouse",
    boardToken: "pitch",
    careersUrl: "https://pitch.com/jobs",
  },
  {
    key: "superhuman-gh",
    company: "Superhuman",
    type: "greenhouse",
    boardToken: "superhuman",
    careersUrl: "https://superhuman.com/careers",
  },
];

const FEED_CACHE_TTL_MS = Math.max(
  Number(process.env.FEED_CACHE_TTL_MINUTES || 30) * 60 * 1000,
  5 * 60 * 1000
);
const SOURCE_MAX_RETRIES = Math.max(Number(process.env.SOURCE_MAX_RETRIES || 2), 0);
const SOURCE_BACKOFF_BASE_MS = Math.max(Number(process.env.SOURCE_BACKOFF_BASE_MS || 600), 100);
const SOURCE_CIRCUIT_FAIL_THRESHOLD = Math.max(Number(process.env.SOURCE_CIRCUIT_FAIL_THRESHOLD || 3), 1);
const SOURCE_CIRCUIT_OPEN_MS = Math.max(Number(process.env.SOURCE_CIRCUIT_OPEN_SECONDS || 900) * 1000, 30 * 1000);

const feedCache = new Map();
const sourceHealth = new Map();

function getSourceHealth(sourceKey) {
  if (!sourceHealth.has(sourceKey)) {
    sourceHealth.set(sourceKey, {
      consecutiveFailures: 0,
      circuitOpenUntil: 0,
      lastError: null,
    });
  }
  return sourceHealth.get(sourceKey);
}

function markSourceSuccess(sourceKey) {
  const state = getSourceHealth(sourceKey);
  state.consecutiveFailures = 0;
  state.circuitOpenUntil = 0;
  state.lastError = null;
}

function markSourceFailure(sourceKey, errorMessage) {
  const state = getSourceHealth(sourceKey);
  state.consecutiveFailures += 1;
  state.lastError = errorMessage;
  if (state.consecutiveFailures >= SOURCE_CIRCUIT_FAIL_THRESHOLD) {
    state.circuitOpenUntil = Date.now() + SOURCE_CIRCUIT_OPEN_MS;
  }
}

function isCircuitOpen(sourceKey) {
  const state = getSourceHealth(sourceKey);
  return state.circuitOpenUntil > Date.now();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withSourceResilience(source, work) {
  const sourceKey = source.key;
  if (isCircuitOpen(sourceKey)) {
    const state = getSourceHealth(sourceKey);
    const retryAfterSec = Math.ceil((state.circuitOpenUntil - Date.now()) / 1000);
    throw new Error(`${source.company}: circuit open after repeated failures. Retry in ${retryAfterSec}s`);
  }

  let lastError = null;
  for (let attempt = 0; attempt <= SOURCE_MAX_RETRIES; attempt += 1) {
    try {
      const jobs = await work();
      markSourceSuccess(sourceKey);
      return jobs;
    } catch (error) {
      lastError = error;
      if (attempt < SOURCE_MAX_RETRIES) {
        const jitter = Math.floor(Math.random() * 120);
        const backoff = SOURCE_BACKOFF_BASE_MS * (2 ** attempt) + jitter;
        await sleep(backoff);
      }
    }
  }

  const msg = lastError?.message || "Fetch failed";
  markSourceFailure(sourceKey, msg);
  throw new Error(`${source.company}: ${msg} (attempts=${SOURCE_MAX_RETRIES + 1})`);
}

function getFeedCache(sourceKey) {
  const hit = feedCache.get(sourceKey);
  if (!hit) {
    return null;
  }
  if (Date.now() - hit.at > FEED_CACHE_TTL_MS) {
    feedCache.delete(sourceKey);
    return null;
  }
  return hit.jobs;
}

function setFeedCache(sourceKey, jobs) {
  feedCache.set(sourceKey, { at: Date.now(), jobs });
}

function normalizeGreenhouseJob(source, job) {
  const location = job.location?.name || "Unknown";
  return {
    id: `${source.key}:${job.id}`,
    title: job.title,
    company: source.company,
    location,
    url: job.absolute_url,
    updatedAt: job.updated_at || new Date().toISOString(),
    sourceLabel: "Greenhouse",
    careersUrl: source.careersUrl,
    source_key: source.key,
  };
}

function normalizeLeverJob(source, job) {
  const location = job.categories?.location || "Unknown";
  return {
    id: `${source.key}:${job.id || job.text}`,
    title: job.text,
    company: source.company,
    location,
    url: job.hostedUrl,
    updatedAt: job.createdAt ? new Date(job.createdAt).toISOString() : new Date().toISOString(),
    sourceLabel: "Lever",
    careersUrl: source.careersUrl,
    source_key: source.key,
  };
}

function normalizeAshbyJob(source, job) {
  const location =
    job.location ||
    job.secondaryLocations?.[0]?.location ||
    (job.isRemote ? "Remote" : "Unknown");
  return {
    id: `${source.key}:${job.id}`,
    title: job.title?.trim(),
    company: source.company,
    location,
    url: job.jobUrl || job.applyUrl || source.careersUrl,
    updatedAt: job.publishedAt ? new Date(job.publishedAt).toISOString() : new Date().toISOString(),
    sourceLabel: "Ashby",
    careersUrl: source.careersUrl,
    source_key: source.key,
  };
}

function normalizeWorkableJob(source, job) {
  const location = job.location?.location_str || "Unknown";
  const updatedAt = job.updated_at || job.created_at || new Date().toISOString();
  const slug = job.shortcode || job.code || "";
  const url = job.url || (slug ? `https://apply.workable.com/${source.workableAccount}/j/${slug}/` : source.careersUrl);

  return {
    id: `${source.key}:${job.id || slug || job.title}`,
    title: job.title || "Untitled role",
    company: source.company,
    location,
    url,
    updatedAt: new Date(updatedAt).toISOString(),
    sourceLabel: "Workable",
    careersUrl: source.careersUrl,
    source_key: source.key,
  };
}

function normalizeFeedJob(source, job) {
  const title = (job.title || "").trim() || "Untitled role";
  const company = (job.company || "Unknown Startup").trim() || "Unknown Startup";
  const location = (job.location || "Worldwide / Remote").trim() || "Worldwide / Remote";
  const url = job.url || source.careersUrl;

  // Keep IDs deterministic so upserts update existing feed jobs instead of duplicating.
  const rawId = `${source.key}:${company}:${title}:${url}`;
  const safeId = rawId.replace(/\s+/g, " ").slice(0, 280);

  return {
    id: safeId,
    title,
    company,
    location,
    url,
    updatedAt: job.updatedAt || new Date().toISOString(),
    sourceLabel: job.sourceLabel || source.company,
    careersUrl: job.careersUrl || source.careersUrl,
    source_key: source.key,
  };
}

async function fetchWithTimeout(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; JobBot/1.0)",
        "Accept": "application/json",
      },
    });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function crawlGreenhouse(source) {
  try {
    const endpoint = `https://boards-api.greenhouse.io/v1/boards/${source.boardToken}/jobs`;
    const res = await fetchWithTimeout(endpoint);
    if (!res.ok) {
      throw new Error(`${source.company}: Greenhouse fetch failed (${res.status})`);
    }

    const data = await res.json();
    const jobs = Array.isArray(data.jobs) ? data.jobs : [];
    return jobs.map((job) => normalizeGreenhouseJob(source, job));
  } catch (error) {
    throw new Error(`${source.company}: ${error.message || 'Fetch failed'}`);
  }
}

async function crawlLever(source) {
  try {
    const endpoint = `https://api.lever.co/v0/postings/${source.leverHandle}?mode=json`;
    const res = await fetchWithTimeout(endpoint);
    if (!res.ok) {
      throw new Error(`${source.company}: Lever fetch failed (${res.status})`);
    }

    const jobs = await res.json();
    if (!Array.isArray(jobs)) {
      return [];
    }

    return jobs.map((job) => normalizeLeverJob(source, job));
  } catch (error) {
    throw new Error(`${source.company}: ${error.message || 'Fetch failed'}`);
  }
}

async function crawlAshby(source) {
  try {
    const endpoint = `https://api.ashbyhq.com/posting-api/job-board/${source.ashbyBoard}`;
    const res = await fetchWithTimeout(endpoint);
    if (!res.ok) {
      throw new Error(`${source.company}: Ashby fetch failed (${res.status})`);
    }
    const data = await res.json();
    const jobs = Array.isArray(data.jobs) ? data.jobs : [];
    return jobs.filter((j) => j.isListed !== false).map((job) => normalizeAshbyJob(source, job));
  } catch (error) {
    throw new Error(`${source.company}: ${error.message || 'Fetch failed'}`);
  }
}

async function crawlWorkable(source) {
  try {
    const endpoint = `https://apply.workable.com/api/v1/widget/accounts/${source.workableAccount}?details=true`;
    const res = await fetchWithTimeout(endpoint);
    if (!res.ok) {
      throw new Error(`${source.company}: Workable fetch failed (${res.status})`);
    }

    const data = await res.json();
    const jobs = Array.isArray(data.jobs) ? data.jobs : [];
    return jobs.map((job) => normalizeWorkableJob(source, job));
  } catch (error) {
    throw new Error(`${source.company}: ${error.message || 'Fetch failed'}`);
  }
}

async function crawlRemotiveFeed(source) {
  try {
    const cached = getFeedCache(source.key);
    if (cached) {
      return cached;
    }

    const endpoint = "https://remotive.com/api/remote-jobs";
    const res = await fetchWithTimeout(endpoint);
    if (!res.ok) {
      throw new Error(`${source.company}: Remotive fetch failed (${res.status})`);
    }

    const data = await res.json();
    const items = Array.isArray(data.jobs) ? data.jobs : [];

    const mapped = items.map((item) => {
      const loc = (item.candidate_required_location || "").trim();
      const isWorldwide = /worldwide|anywhere|global/i.test(loc);
      return normalizeFeedJob(source, {
        title: item.title,
        company: item.company_name,
        location: isWorldwide ? "Worldwide / Remote" : (loc || "Remote"),
        url: item.url,
        updatedAt: item.publication_date ? new Date(item.publication_date).toISOString() : new Date().toISOString(),
        sourceLabel: "Remotive",
        careersUrl: item.url,
      });
    });

    setFeedCache(source.key, mapped);
    return mapped;
  } catch (error) {
    throw new Error(`${source.company}: ${error.message || "Fetch failed"}`);
  }
}

async function crawlRemoteOkFeed(source) {
  try {
    const cached = getFeedCache(source.key);
    if (cached) {
      return cached;
    }

    const endpoint = "https://remoteok.com/api";
    const res = await fetchWithTimeout(endpoint);
    if (!res.ok) {
      throw new Error(`${source.company}: RemoteOK fetch failed (${res.status})`);
    }

    const data = await res.json();
    const rows = Array.isArray(data) ? data : [];
    const jobs = rows.filter((row) => row && typeof row === "object" && row.id && row.position);

    const mapped = jobs.map((job) => {
      const location =
        job.location ||
        (job.worldwide ? "Worldwide / Remote" : "Remote") ||
        "Remote";
      return normalizeFeedJob(source, {
        title: job.position,
        company: job.company || "Unknown Startup",
        location,
        url: job.url || `https://remoteok.com/remote-jobs/${job.id}`,
        updatedAt: job.date ? new Date(job.date).toISOString() : new Date().toISOString(),
        sourceLabel: "RemoteOK",
        careersUrl: job.url,
      });
    });

    setFeedCache(source.key, mapped);
    return mapped;
  } catch (error) {
    throw new Error(`${source.company}: ${error.message || "Fetch failed"}`);
  }
}

async function crawlJobicyFeed(source) {
  try {
    const cached = getFeedCache(source.key);
    if (cached) {
      return cached;
    }

    const endpoint = "https://jobicy.com/api/v2/remote-jobs";
    const res = await fetchWithTimeout(endpoint);
    if (!res.ok) {
      throw new Error(`${source.company}: Jobicy fetch failed (${res.status})`);
    }

    const data = await res.json();
    const jobs = Array.isArray(data.jobs) ? data.jobs : [];

    const mapped = jobs.map((job) => {
      const loc = (job.jobGeo || "").trim();
      const isWorldwide = /worldwide|anywhere|global|remote/i.test(loc);
      return normalizeFeedJob(source, {
        title: job.jobTitle,
        company: job.companyName || "Unknown Startup",
        location: isWorldwide ? "Worldwide / Remote" : (loc || "Remote"),
        url: job.url,
        updatedAt: job.pubDate ? new Date(job.pubDate).toISOString() : new Date().toISOString(),
        sourceLabel: "Jobicy",
        careersUrl: job.url,
      });
    });

    setFeedCache(source.key, mapped);
    return mapped;
  } catch (error) {
    throw new Error(`${source.company}: ${error.message || "Fetch failed"}`);
  }
}

async function crawlOne(source) {
  if (source.type === "greenhouse") {
    return crawlGreenhouse(source);
  }

  if (source.type === "lever") {
    return crawlLever(source);
  }

  if (source.type === "ashby") {
    return crawlAshby(source);
  }

  if (source.type === "workable") {
    return crawlWorkable(source);
  }

  if (source.type === "feed-remotive") {
    return crawlRemotiveFeed(source);
  }

  if (source.type === "feed-remoteok") {
    return crawlRemoteOkFeed(source);
  }

  if (source.type === "feed-jobicy") {
    return crawlJobicyFeed(source);
  }

  throw new Error(`${source.company}: unsupported source type ${source.type}`);
}

export function listSources() {
  return DEFAULT_SOURCES.map((source) => ({
    key: source.key,
    company: source.company,
    type: source.type,
    careersUrl: source.careersUrl,
  }));
}

export async function crawlJobs(selectedSourceKeys = [], db = null) {
  const activeSources = selectedSourceKeys.length
    ? DEFAULT_SOURCES.filter((source) => selectedSourceKeys.includes(source.key))
    : DEFAULT_SOURCES;

  console.log(`🔄 Crawling ${activeSources.length} sources...`);
  const settled = await Promise.allSettled(
    activeSources.map((source) => withSourceResilience(source, () => crawlOne(source)))
  );

  const jobs = [];
  const errors = [];
  const stats = {
    totalCrawled: 0,
    newJobs: 0,
    updatedJobs: 0,
  };

  settled.forEach((result, index) => {
    const source = activeSources[index];
    if (result.status === "fulfilled") {
      const sourceJobs = result.value;
      jobs.push(...sourceJobs);
      stats.totalCrawled += sourceJobs.length;
      console.log(`✅ ${source.company}: ${sourceJobs.length} jobs`);
      return;
    }

    errors.push({
      source: source.company,
      message: result.reason?.message || "Unknown crawl error",
    });
    console.warn(`❌ ${source.company}: ${result.reason?.message || "Failed"}`);
  });

  return {
    jobs,
    errors,
    crawledSources: activeSources.length,
    stats,
  };
}
