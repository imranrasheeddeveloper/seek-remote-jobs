import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is required. Configure a PostgreSQL connection string (for example Neon, Supabase, RDS, or local Postgres)."
  );
}

const ssl = process.env.PGSSL === "disable" ? false : { rejectUnauthorized: false };

const pool = new Pool({
  connectionString,
  ssl,
  max: Number(process.env.PG_POOL_MAX || 20),
  idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT_MS || 30000),
  connectionTimeoutMillis: Number(process.env.PG_CONN_TIMEOUT_MS || 10000),
});

async function exec(text, params = []) {
  return pool.query(text, params);
}

async function initDb() {
  await exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT,
      url TEXT,
      source_label TEXT,
      careers_url TEXT,
      updated_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      source_key TEXT,
      hash TEXT
    )
  `);

  // Some ATS feeds can emit identical URLs for multiple ids; do not fail inserts on URL collisions.
  await exec(`ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_url_key`);
  // Different providers can produce identical content hashes; keep hash as informational only.
  await exec(`ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_hash_key`);

  await exec(`CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company)`);
  await exec(`CREATE INDEX IF NOT EXISTS idx_jobs_title ON jobs(title)`);
  await exec(`CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location)`);
  await exec(`CREATE INDEX IF NOT EXISTS idx_jobs_updated ON jobs(updated_at DESC)`);
  await exec(`CREATE INDEX IF NOT EXISTS idx_jobs_source_key ON jobs(source_key)`);

  await exec(`
    CREATE TABLE IF NOT EXISTS crawl_meta (
      source_key TEXT PRIMARY KEY,
      last_crawl TIMESTAMPTZ,
      job_count INTEGER DEFAULT 0
    )
  `);

  await exec(`
    CREATE TABLE IF NOT EXISTS global_meta (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);

  await exec(
    `INSERT INTO global_meta (key, value) VALUES ($1, $2)
     ON CONFLICT (key) DO NOTHING`,
    ["lastRefresh", null]
  );
}

function generateHash(job) {
  const str = `${job.title}|${job.company}|${job.location}|${job.url}`;
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString();
}

export async function upsertJobs(jobs) {
  if (!Array.isArray(jobs) || jobs.length === 0) {
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const job of jobs) {
      const hash = generateHash(job);
      await client.query(
        `INSERT INTO jobs (
          id, title, company, location, url, source_label, careers_url, updated_at, source_key, hash
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8::timestamptz, $9, $10
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          company = EXCLUDED.company,
          location = EXCLUDED.location,
          url = EXCLUDED.url,
          source_label = EXCLUDED.source_label,
          careers_url = EXCLUDED.careers_url,
          updated_at = EXCLUDED.updated_at,
          source_key = EXCLUDED.source_key,
          hash = EXCLUDED.hash`,
        [
          job.id,
          job.title,
          job.company,
          job.location || "Unknown",
          job.url,
          job.sourceLabel,
          job.careersUrl,
          job.updatedAt || new Date().toISOString(),
          job.source_key || "unknown",
          hash,
        ]
      );
    }

    await client.query("COMMIT");
    await updateLastRefresh();
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Upsert error:", err);
    throw err;
  } finally {
    client.release();
  }
}

export async function getJobs(options = {}) {
  const {
    limit = 50,
    offset = 0,
    company = null,
    title = null,
    location = null,
    daysAgo = null,
    sort = "mixed",
  } = options;

  try {
    const conditions = ["1=1"];
    const params = [];
    let p = 1;

    if (company) {
      conditions.push(`company ILIKE $${p}`);
      params.push(`%${company}%`);
      p += 1;
    }
    if (title) {
      conditions.push(`title ILIKE $${p}`);
      params.push(`%${title}%`);
      p += 1;
    }
    if (location && location !== "Unknown") {
      conditions.push(`location ILIKE $${p}`);
      params.push(`%${location}%`);
      p += 1;
    }
    if (daysAgo) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - Number.parseInt(daysAgo, 10));
      conditions.push(`updated_at >= $${p}::timestamptz`);
      params.push(cutoff.toISOString());
      p += 1;
    }

    const where = `WHERE ${conditions.join(" AND ")}`;

    const countResult = await exec(`SELECT COUNT(*)::int AS count FROM jobs ${where}`, params);
    const total = countResult.rows[0]?.count || 0;

    let jobsQuery = "";
    const queryParams = [...params];

    if (sort === "newest") {
      jobsQuery = `
        SELECT
          id,
          title,
          company,
          location,
          url,
          source_label AS "sourceLabel",
          careers_url AS "careersUrl",
          updated_at AS "updatedAt",
          created_at AS "createdAt",
          source_key,
          hash,
          CASE
            WHEN LOWER(COALESCE(source_label, '')) IN ('greenhouse', 'workable', 'lever', 'ashby') THEN 0
            WHEN LOWER(COALESCE(source_label, '')) IN ('remotive', 'remote ok', 'jobicy')
              OR LOWER(COALESCE(source_key, '')) LIKE 'internet-%'
            THEN 2
            ELSE 1
          END AS source_priority,
          CASE
            WHEN LOWER(company) IN (
              'airbnb','stripe','github','shopify','notion','figma','slack',
              'openai','anthropic','datadog','canva','dropbox','asana',
              'coinbase','mongodb','lyft','reddit','duolingo','twilio',
              'okta','hubspot','zendesk','discord'
            ) THEN 1
            ELSE 0
          END AS is_big_company,
          CASE
            WHEN LOWER(location) LIKE '%worldwide%'
              OR LOWER(location) LIKE '%anywhere%'
              OR LOWER(location) LIKE '%global remote%'
              OR LOWER(location) = 'remote'
              OR LOWER(location) = 'worldwide / remote'
            THEN 0
            ELSE 1
          END AS is_not_worldwide
        FROM jobs
        ${where}
        ORDER BY source_priority, is_big_company, is_not_worldwide, updated_at DESC
        LIMIT $${p} OFFSET $${p + 1}
      `;
      queryParams.push(limit, offset);
    } else {
      jobsQuery = `
        WITH ranked AS (
          SELECT
            *,
            ROW_NUMBER() OVER (PARTITION BY company ORDER BY updated_at DESC) AS rn,
            CASE
              WHEN LOWER(COALESCE(source_label, '')) IN ('greenhouse', 'workable', 'lever', 'ashby') THEN 0
              WHEN LOWER(COALESCE(source_label, '')) IN ('remotive', 'remote ok', 'jobicy')
                OR LOWER(COALESCE(source_key, '')) LIKE 'internet-%'
              THEN 2
              ELSE 1
            END AS source_priority,
            CASE
              WHEN LOWER(company) IN (
                'airbnb','stripe','github','shopify','notion','figma','slack',
                'openai','anthropic','datadog','canva','dropbox','asana',
                'coinbase','mongodb','lyft','reddit','duolingo','twilio',
                'okta','hubspot','zendesk','discord'
              ) THEN 1
              ELSE 0
            END AS is_big_company,
            CASE
              WHEN LOWER(location) LIKE '%worldwide%'
                OR LOWER(location) LIKE '%anywhere%'
                OR LOWER(location) LIKE '%global remote%'
                OR LOWER(location) = 'remote'
                OR LOWER(location) = 'worldwide / remote'
              THEN 0
              ELSE 1
            END AS is_not_worldwide
          FROM jobs
          ${where}
        )
        SELECT
          id,
          title,
          company,
          location,
          url,
          source_label AS "sourceLabel",
          careers_url AS "careersUrl",
          updated_at AS "updatedAt",
          created_at AS "createdAt",
          source_key,
          hash
        FROM ranked
        ORDER BY rn, source_priority, is_big_company, is_not_worldwide, company
        LIMIT $${p} OFFSET $${p + 1}
      `;
      queryParams.push(limit, offset);
    }

    const jobsResult = await exec(jobsQuery, queryParams);

    return {
      jobs: jobsResult.rows,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  } catch (err) {
    console.error("Get jobs error:", err);
    return { jobs: [], total: 0, limit, offset, hasMore: false };
  }
}

export async function getAllJobs() {
  try {
    const result = await exec(`
      SELECT
        id,
        title,
        company,
        location,
        url,
        source_label AS "sourceLabel",
        careers_url AS "careersUrl",
        updated_at AS "updatedAt",
        created_at AS "createdAt",
        source_key,
        hash
      FROM jobs
      ORDER BY updated_at DESC
    `);
    return result.rows;
  } catch (err) {
    console.error("Get all jobs error:", err);
    return [];
  }
}

export async function getJobById(id) {
  try {
    const result = await exec(
      `
        SELECT
          id,
          title,
          company,
          location,
          url,
          source_label AS "sourceLabel",
          careers_url AS "careersUrl",
          updated_at AS "updatedAt",
          created_at AS "createdAt",
          source_key,
          hash
        FROM jobs
        WHERE id = $1
        LIMIT 1
      `,
      [id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error("Get job by id error:", err);
    return null;
  }
}

export async function getJobCount() {
  try {
    const result = await exec("SELECT COUNT(*)::int AS count FROM jobs");
    return result.rows[0]?.count || 0;
  } catch (err) {
    console.error("Get job count error:", err);
    return 0;
  }
}

export async function getLocations() {
  try {
    const result = await exec(`
      SELECT DISTINCT location
      FROM jobs
      WHERE location IS NOT NULL AND location <> 'Unknown'
      ORDER BY location
    `);
    return result.rows;
  } catch (err) {
    console.error("Get locations error:", err);
    return [];
  }
}

export async function getCompanies() {
  try {
    const result = await exec(`SELECT DISTINCT company FROM jobs ORDER BY company`);
    return result.rows;
  } catch (err) {
    console.error("Get companies error:", err);
    return [];
  }
}

export async function getJobsByCompany(company) {
  try {
    const result = await exec(
      `
        SELECT
          id,
          title,
          company,
          location,
          url,
          source_label AS "sourceLabel",
          careers_url AS "careersUrl",
          updated_at AS "updatedAt",
          created_at AS "createdAt",
          source_key,
          hash
        FROM jobs
        WHERE company = $1
        ORDER BY updated_at DESC
      `,
      [company]
    );
    return result.rows;
  } catch (err) {
    console.error("Get jobs by company error:", err);
    return [];
  }
}

export async function updateCrawlMeta(sourceKey, jobCount = 0) {
  try {
    await exec(
      `
        INSERT INTO crawl_meta (source_key, last_crawl, job_count)
        VALUES ($1, NOW(), $2)
        ON CONFLICT (source_key) DO UPDATE SET
          last_crawl = EXCLUDED.last_crawl,
          job_count = EXCLUDED.job_count
      `,
      [sourceKey, jobCount]
    );
  } catch (err) {
    console.error("Update crawl meta error:", err);
  }
}

export async function getLastCrawl(sourceKey) {
  try {
    const result = await exec(
      `SELECT last_crawl FROM crawl_meta WHERE source_key = $1`,
      [sourceKey]
    );
    return result.rows[0]?.last_crawl || null;
  } catch (err) {
    console.error("Get last crawl error:", err);
    return null;
  }
}

export async function updateLastRefresh() {
  try {
    await setGlobalMetaValue("lastRefresh", new Date().toISOString());
  } catch (err) {
    console.error("Update last refresh error:", err);
  }
}

export async function setGlobalMetaValue(key, value) {
  await exec(
    `
      INSERT INTO global_meta (key, value)
      VALUES ($1, $2)
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `,
    [key, value]
  );
}

export async function getGlobalMetaValue(key) {
  const result = await exec(`SELECT value FROM global_meta WHERE key = $1`, [key]);
  return result.rows[0]?.value || null;
}

export async function getMeta() {
  try {
    const count = await getJobCount();
    const lastRefresh = await getGlobalMetaValue("lastRefresh");
    return {
      count,
      lastRefresh,
    };
  } catch (err) {
    console.error("Get meta error:", err);
    return { count: 0, lastRefresh: null };
  }
}

export async function getStats() {
  try {
    const [jobCount, companyResult, locationResult, newestResult] = await Promise.all([
      getJobCount(),
      exec("SELECT COUNT(DISTINCT company)::int AS count FROM jobs"),
      exec("SELECT COUNT(DISTINCT location)::int AS count FROM jobs WHERE location IS NOT NULL AND location <> 'Unknown'"),
      exec("SELECT updated_at FROM jobs ORDER BY updated_at DESC LIMIT 1"),
    ]);

    return {
      totalJobs: jobCount,
      totalCompanies: companyResult.rows[0]?.count || 0,
      totalLocations: locationResult.rows[0]?.count || 0,
      newestJobDate: newestResult.rows[0]?.updated_at || null,
    };
  } catch (err) {
    console.error("Get stats error:", err);
    return { totalJobs: 0, totalCompanies: 0, totalLocations: 0, newestJobDate: null };
  }
}

export async function deleteOldJobs(daysOld = 180) {
  try {
    const result = await exec(
      `DELETE FROM jobs WHERE updated_at < NOW() - ($1::text || ' days')::interval`,
      [daysOld]
    );
    return result.rowCount || 0;
  } catch (err) {
    console.error("Delete old jobs error:", err);
    return 0;
  }
}

export async function query(sql, params = []) {
  try {
    const result = await exec(sql, params);
    return result.rows;
  } catch (err) {
    console.error("Query error:", err);
    return [];
  }
}

export function closeDatabase() {
  return pool.end();
}

await initDb();

export { exec };
export default pool;
