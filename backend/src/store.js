const state = {
  jobs: [],
  lastRefresh: null,
};

export function setJobs(jobs) {
  const deduped = new Map();
  for (const job of jobs) {
    deduped.set(job.id, job);
  }

  state.jobs = Array.from(deduped.values()).sort((a, b) => {
    return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
  });
  state.lastRefresh = new Date().toISOString();
}

export function getJobs() {
  return state.jobs;
}

export function getMeta() {
  return {
    count: state.jobs.length,
    lastRefresh: state.lastRefresh,
  };
}
