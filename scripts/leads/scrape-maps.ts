// Find businesses on Google Maps (the public web page, no API key, no cost)
// and collect their contact details.
//
//   npm run leads:scrape -- "plumber" "ac repair" --in "Phoenix, AZ" --in "Dallas, TX"
//
// Each term is searched in each --in area with a headless browser; the results
// feed is scrolled to the end (Google shows at most ~120 per search). Phone and
// website come straight from the result cards. Google doesn't show emails, so
// we look for them on each business's own website (home, /contact, /about),
// and note why the business might want a new site in the site_issue column.
// Output: leads/<query>.csv, same columns as before, prospects first. Turn it
// into preview sites with `npm run leads:build`.

import { mkdir, writeFile } from "node:fs/promises";
import { chromium, type Page } from "playwright";

const MAX_PER_SEARCH = 120;
const CONCURRENCY = Number(process.env.SCRAPE_CONCURRENCY ?? 3);

type Card = {
  name: string;
  maps: string;
  website: string;
  phone: string;
  rating: string;
  reviews: string;
  address: string;
  search: string;
};

// Links that are just the business's Google listing.
const NO_SITE_HOSTS = ["g.co", "goo.gl", "google.com", "business.site"];

// Social, link-in-bio and booking pages: the business has no site of its own.
const PROFILE_HOSTS = [
  "instagram.com", "facebook.com", "fb.com", "fb.me", "tiktok.com", "youtube.com", "x.com",
  "twitter.com", "linkedin.com", "wa.me", "whatsapp.com", "line.me", "t.me", "linktr.ee",
  "beacons.ai", "bio.link", "booksy.com", "fresha.com", "vagaro.com", "styleseat.com",
  "getsquire.com", "getsqr.co", "wheree.com", "setmore.com", "schedulicity.com",
  "glossgenius.com", "square.site", "squareup.com", "trinks.com", "yelp.com", "angi.com",
  "homeadvisor.com", "thumbtack.com", "nextdoor.com", "bark.com", "porch.com",
];

// Free site-builder addresses — a real site, but an easy upgrade pitch.
const FREE_SITE_HOSTS = [
  "wixsite.com", "weebly.com", "blogspot.com", "wordpress.com", "godaddysites.com",
  "webnode.page", "site123.me", "vercel.app", "netlify.app", "mystrikingly.com", "carrd.co",
];

const matchesHost = (host: string, hosts: string[]) =>
  hosts.find((h) => host === h || host.endsWith(`.${h}`));

const JUNK_EMAIL =
  /\.(png|jpe?g|gif|svg|webp)$|@(example|domain|email|mysite|yourdomain|company)\.|(sentry|wixpress)[a-z.-]*$|calendar\.google\.com$|@[0-9.]+$/i;

const THIS_YEAR = new Date().getFullYear();

const BOT_UA = "Mozilla/5.0 (compatible; LeadFinder/1.0)";
const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";

function extractEmails(html: string) {
  const found: string[] = [];
  for (const [, hex] of html.matchAll(/data-cfemail="([0-9a-f]+)"/gi)) {
    const key = parseInt(hex.slice(0, 2), 16);
    let email = "";
    for (let i = 2; i < hex.length; i += 2) email += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key);
    found.push(email);
  }
  const text = html.replace(/\\u[0-9a-f]{4}/gi, " ").replace(/&#64;|&#x40;|%40/gi, "@");
  for (const [email] of text.matchAll(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi)) found.push(email);
  return [...new Set(found.map((e) => e.toLowerCase()))].filter((e) => !JUNK_EMAIL.test(e));
}

async function fetchPage(url: string, timeout = 8000, userAgent = BOT_UA) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeout), headers: { "User-Agent": userAgent } });
    const isHtml = res.ok && res.headers.get("content-type")?.includes("text/html");
    return { status: res.status, url: res.url, html: isHtml ? await res.text() : "" };
  } catch {
    return { status: 0, url, html: "" };
  }
}

async function checkWebsite(website: string) {
  let url: URL;
  try {
    url = new URL(website);
  } catch {
    return { emails: [] as string[], issue: "no website" };
  }
  const host = url.hostname.replace(/^www\./, "");
  if (matchesHost(host, NO_SITE_HOSTS)) return { emails: [], issue: "no website" };
  const profile = matchesHost(host, PROFILE_HOSTS);
  if (profile) return { emails: [], issue: `only a ${profile} page` };

  let home = await fetchPage(url.href);
  if (home.status === 0 || home.status >= 500) home = await fetchPage(url.href, 15000, BROWSER_UA);
  if (home.status === 0) return { emails: [], issue: "site down" };
  if (home.status === 404 || home.status >= 500) return { emails: [], issue: `site broken (HTTP ${home.status})` };
  if (!home.html) return { emails: [], issue: "" };

  const issues: string[] = [];
  const free = matchesHost(new URL(home.url).hostname, FREE_SITE_HOSTS);
  if (free) issues.push(`free ${free} address`);
  if (home.url.startsWith("http:")) issues.push("no https");
  if (!/<meta[^>]+name=["']?viewport/i.test(home.html)) issues.push("not mobile-friendly");
  const years = [...home.html.matchAll(/(?:©|&copy;|&#169;|copyright)[^<\d]{0,20}(?:\d{4}\s*[-–]\s*)?(\d{4})/gi)].map((m) => Number(m[1]));
  const year = Math.max(...years);
  if (years.length && year >= 1995 && year <= THIS_YEAR - 3) issues.push(`last updated ${year}`);

  const emails = new Set(extractEmails(home.html));
  for (const path of ["/contact", "/contact-us", "/about"]) {
    if (emails.size) break;
    const page = await fetchPage(new URL(path, home.url).href);
    for (const email of extractEmails(page.html)) emails.add(email);
  }
  return { emails: [...emails], issue: issues.join("; ") };
}

// Scrolls one search's result feed to the end and reads the cards.
async function scrapeSearch(page: Page, search: string): Promise<Card[]> {
  await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(search)}?hl=en&gl=us`, {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });
  if (page.url().includes("consent.google")) {
    await page.locator('button:has-text("Reject all"), button:has-text("Accept all")').first().click({ timeout: 5000 }).catch(() => {});
    await page.waitForURL(/google\.com\/maps/, { timeout: 15000 }).catch(() => {});
  }
  const feed = page.locator('div[role="feed"]');
  try {
    await feed.waitFor({ timeout: 20000 });
  } catch {
    // A single exact match opens the place page instead of a list; skip it.
    return [];
  }

  let count = 0;
  let stale = 0;
  while (count < MAX_PER_SEARCH && stale < 5) {
    await feed.evaluate((el) => el.scrollTo(0, el.scrollHeight));
    await page.waitForTimeout(1200 + Math.random() * 800);
    const now = await feed.locator('a[href*="/maps/place/"]').count();
    const ended = await page.getByText("You've reached the end of the list").count();
    if (now === count) stale++;
    else stale = 0;
    count = now;
    if (ended) break;
  }

  return feed.evaluate((el, search) => {
    const out: Card[] = [];
    for (const a of el.querySelectorAll<HTMLAnchorElement>('a[href*="/maps/place/"]')) {
      const card = a.parentElement;
      if (!card) continue;
      const name = a.getAttribute("aria-label") ?? "";
      if (!name) continue;
      const text = card.innerText ?? "";
      // Ads link through google.com/aclk, not to the business's site; skip them.
      if (/^Sponsored\b/m.test(text)) continue;
      const stars = card.querySelector('span[role="img"][aria-label*="star" i]')?.getAttribute("aria-label") ?? "";
      const rating = stars.match(/([\d.]+)\s*star/i)?.[1] ?? "";
      const reviews = (stars.match(/([\d,]+)\s*review/i)?.[1] ?? text.match(/\((\d[\d,]*)\)/)?.[1] ?? "").replace(/,/g, "");
      const website = card.querySelector<HTMLAnchorElement>('a[data-value="Website"]')?.href ?? "";
      const phone = text.match(/\(\d{3}\)\s*\d{3}-\d{4}|\+?1?[\s.-]?\d{3}[\s.-]\d{3}[\s.-]\d{4}/)?.[0] ?? "";
      // Lines look like "Plumber · 123 Main St"; keep the part after the dot.
      const addrLine = text.split("\n").find((l) => l.includes(" · ") && !/open|close|\d:\d\d/i.test(l.split(" · ")[0]));
      const address = addrLine?.split(" · ").slice(1).join(" · ") ?? "";
      out.push({ name, maps: a.href.split("?")[0], website, phone, rating, reviews, address, search });
    }
    return out;
  }, search);
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>) {
  const results: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await fn(items[i]);
      }
    }),
  );
  return results;
}

const prospectKind = (issue: string) =>
  !issue ? 4 : issue === "no website" ? 0 : issue.startsWith("only ") ? 1 : issue.startsWith("site ") ? 2 : 3;
const PROSPECT_KINDS = ["no website", "only a social/booking page", "site down or broken", "site needs work", "site looks fine"];

const COLUMNS = ["name", "search", "phone", "whatsapp", "email", "website", "site_issue", "rating", "reviews", "address", "maps"] as const;

function parseArgs(argv: string[]) {
  const terms: string[] = [];
  const areas: string[] = [];
  let out = "";
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--in") areas.push(argv[++i]);
    else if (argv[i] === "--out") out = argv[++i];
    else if (argv[i].trim()) terms.push(argv[i].trim());
  }
  const queries = areas.length ? areas.flatMap((a) => terms.map((t) => `${t} in ${a}`)) : terms;
  const name = out || (areas.length ? `${terms.join(" ")} in ${areas.join(" ")}` : terms.join(" "));
  return { queries, name };
}

async function main() {
  const { queries, name } = parseArgs(process.argv.slice(2));
  if (!queries.length) {
    console.error('Usage: npm run leads:scrape -- "plumber" "ac repair" --in "Phoenix, AZ" [--out name]');
    process.exit(1);
  }

  const browser = await chromium.launch({ headless: true, channel: "chrome", args: ["--lang=en-US"] });
  const found = new Map<string, Card>();
  let done = 0;
  await mapLimit(queries, CONCURRENCY, async (q) => {
    const ctx = await browser.newContext({ locale: "en-US", viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    try {
      const cards = await scrapeSearch(page, q);
      for (const c of cards) if (!found.has(c.maps)) found.set(c.maps, c);
      console.log(`[${++done}/${queries.length}] ${q}: ${cards.length} (${found.size} unique so far)`);
    } catch (err) {
      console.warn(`[${++done}/${queries.length}] ${q}: failed — ${(err as Error).message.slice(0, 100)}`);
    } finally {
      await ctx.close();
    }
  });
  await browser.close();

  console.log(`${found.size} businesses. Checking websites…`);
  const rows = await mapLimit([...found.values()], 32, async (c) => {
    const site = await checkWebsite(c.website);
    const digits = c.phone.replace(/\D/g, "");
    const e164 = digits ? (digits.length === 10 ? `+1 ${digits}` : `+${digits}`) : "";
    return {
      name: c.name,
      search: c.search,
      phone: e164,
      whatsapp: digits ? `https://wa.me/${digits.length === 10 ? "1" + digits : digits}` : "",
      email: site.emails.join("; "),
      website: c.website,
      site_issue: site.issue,
      rating: c.rating,
      reviews: c.reviews,
      address: c.address,
      maps: c.maps,
    };
  });
  rows.sort((a, b) => prospectKind(a.site_issue) - prospectKind(b.site_issue));

  const csv = [COLUMNS.join(","), ...rows.map((r) => COLUMNS.map((k) => `"${r[k].replace(/"/g, '""')}"`).join(","))].join("\n");
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
  const file = `leads/${slug}.csv`;
  await mkdir("leads", { recursive: true });
  await writeFile(file, csv + "\n");

  console.log(`${rows.length} businesses → ${file}`);
  PROSPECT_KINDS.forEach((label, kind) => {
    const group = rows.filter((r) => prospectKind(r.site_issue) === kind);
    console.log(`  ${label.padEnd(28)} ${String(group.length).padStart(4)}  (${group.filter((r) => r.email).length} email, ${group.filter((r) => r.phone).length} phone)`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
