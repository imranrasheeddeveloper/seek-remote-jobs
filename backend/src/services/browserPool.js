import puppeteer from "puppeteer";

let browserInstance = null;
let activeContexts = 0;
const queue = [];
const maxContexts = Number(process.env.PUPPETEER_MAX_CONTEXTS || 2);

async function getBrowser() {
  if (browserInstance) {
    return browserInstance;
  }

  browserInstance = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--single-process",
    ],
  });

  browserInstance.on("disconnected", () => {
    browserInstance = null;
  });

  return browserInstance;
}

function dequeueNext() {
  if (queue.length === 0 || activeContexts >= maxContexts) {
    return;
  }

  const next = queue.shift();
  if (next) {
    next();
  }
}

async function waitForCapacity() {
  if (activeContexts < maxContexts) {
    return;
  }

  await new Promise((resolve) => {
    queue.push(resolve);
  });
}

export async function withBrowserPage(fn) {
  await waitForCapacity();
  activeContexts += 1;

  let context;
  let page;

  try {
    const browser = await getBrowser();
    context = await browser.createBrowserContext();
    page = await context.newPage();

    await page.setViewport({ width: 1240, height: 1754, deviceScaleFactor: 2 });

    const result = await fn(page);
    return result;
  } finally {
    try {
      if (page) {
        await page.close();
      }
    } catch (error) {
      console.warn("Failed to close Puppeteer page:", error.message);
    }

    try {
      if (context) {
        await context.close();
      }
    } catch (error) {
      console.warn("Failed to close Puppeteer context:", error.message);
    }

    activeContexts = Math.max(0, activeContexts - 1);
    dequeueNext();
  }
}

export async function shutdownBrowserPool() {
  if (!browserInstance) {
    return;
  }

  try {
    await browserInstance.close();
  } finally {
    browserInstance = null;
    activeContexts = 0;
  }
}
