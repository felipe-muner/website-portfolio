// Find businesses on Google Maps and collect their contact details.
//
//   npm run leads:find -- "plumber" "ac repair" --in "Tampa, FL" --in "Houston, TX"
//   npm run leads:find -- "gyms in Koh Phangan" --type gym
//
// Each search term is run in each --in area; results are merged and deduped.
// Phone numbers and websites come from the Google Places API (New), kept
// within Google's free monthly usage (see FREE_DETAILS_PER_MONTH).
// Google doesn't expose emails, so we look for them on each place's own
// website (home page, then /contact, /contact-us, /contato, /about).
// We also note why a business might want a new site (no website, only a
// social/booking page, broken, not mobile-friendly, outdated) in the
// site_issue column.
// Results are written to leads/<query>.csv, prospects first; turn them into
// preview sites with `npm run leads:build`.

import { mkdir, readFile, writeFile } from "node:fs/promises";

try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local: GOOGLE_MAPS_API_KEY may come from the shell.
}

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Billing: a Text Search that asks only for place IDs is free and unlimited
// ("Text Search Essentials IDs Only"). Phone, website and rating come from one
// Place Details call per business, billed as "Place Details Enterprise":
// 1,000 free calls a month, then $20 per 1,000. A local counter in
// USAGE_FILE stops us before the free cap, so a run never costs money.
const SEARCH_FIELDS = "places.id,nextPageToken";
const DETAILS_FIELDS = [
  "id",
  "displayName",
  "formattedAddress",
  "internationalPhoneNumber",
  "websiteUri",
  "googleMapsUri",
  "rating",
  "userRatingCount",
  "businessStatus",
].join(",");
const FREE_DETAILS_PER_MONTH = 900; // Google's free cap is 1,000; keep a margin
const USAGE_FILE = "leads/.places-usage.json";

type Place = {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  googleMapsUri?: string;
  rating?: number;
  userRatingCount?: number;
  businessStatus?: string;
};

// Links that are just the business's Google listing.
const NO_SITE_HOSTS = ["g.co", "goo.gl", "google.com", "business.site"];

// Social, link-in-bio and booking pages: the business has no site of its own.
// Not worth fetching for emails (they'd be the platform's, not the business's).
const PROFILE_HOSTS = [
  "instagram.com",
  "facebook.com",
  "fb.com",
  "fb.me",
  "tiktok.com",
  "youtube.com",
  "x.com",
  "twitter.com",
  "linkedin.com",
  "wa.me",
  "whatsapp.com",
  "line.me",
  "t.me",
  "linktr.ee",
  "beacons.ai",
  "bio.link",
  "booksy.com",
  "fresha.com",
  "vagaro.com",
  "styleseat.com",
  "getsquire.com",
  "getsqr.co",
  "wheree.com",
  "setmore.com",
  "schedulicity.com",
  "glossgenius.com",
  "square.site",
  "squareup.com",
  "trinks.com",
];

// Free site-builder addresses — a real site, but an easy upgrade pitch.
const FREE_SITE_HOSTS = [
  "wixsite.com",
  "weebly.com",
  "blogspot.com",
  "wordpress.com",
  "godaddysites.com",
  "webnode.page",
  "webnode.com.br",
  "site123.me",
  "vercel.app",
  "netlify.app",
];

const matchesHost = (host: string, hosts: string[]) =>
  hosts.find((h) => host === h || host.endsWith(`.${h}`));

// Image filenames, placeholders, error-tracker IDs (Wix sites embed Sentry
// DSNs like <hex>@sentry-next.wixpress.com) and Google Calendar embed IDs.
const JUNK_EMAIL =
  /\.(png|jpe?g|gif|svg|webp)$|@(example|domain|email|mysite)\.|(sentry|wixpress)[a-z.-]*$|calendar\.google\.com$/i;

const THIS_YEAR = new Date().getFullYear();

// Calls the Places API. Retries once if Google is slow to answer, so a single
// stuck request can't hang a long run.
async function placesApi<T>(url: string, fieldMask: string, body?: object): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, {
        method: body ? "POST" : "GET",
        signal: AbortSignal.timeout(20000),
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": API_KEY!,
          "X-Goog-FieldMask": fieldMask,
        },
        body: body && JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error(`Places API ${res.status}: ${await res.text()}`);
      }
      return (await res.json()) as T;
    } catch (err) {
      if (attempt >= 2 || (err as Error).name !== "TimeoutError") throw err;
    }
  }
}

// Google caps a search at 60 results, but sometimes keeps handing out
// nextPageTokens for empty pages forever. So stop on an empty page, at 60
// results, or after MAX_PAGES, whichever comes first.
const MAX_PAGES = 4;

async function searchPlaceIds(textQuery: string, includedType?: string) {
  const ids: string[] = [];
  let pageToken: string | undefined;
  for (let page = 1; page <= MAX_PAGES; page++) {
    const data = await placesApi<{ places?: { id: string }[]; nextPageToken?: string }>(
      "https://places.googleapis.com/v1/places:searchText",
      SEARCH_FIELDS,
      { textQuery, includedType, pageSize: 20, pageToken },
    );
    if (!data.places?.length) break;
    ids.push(...data.places.map((p) => p.id));
    pageToken = data.nextPageToken;
    if (!pageToken || ids.length >= 60) break;
  }
  return ids;
}

const getDetails = (id: string) =>
  placesApi<Place>(`https://places.googleapis.com/v1/places/${id}`, DETAILS_FIELDS);

// Google's billing month runs on Pacific time.
const billingMonth = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
  }).format(new Date());

// Books up to `wanted` Place Details calls against this month's free usage,
// before making them, so a crash can never push us over. Returns how many
// we may make.
async function reserveDetails(wanted: number) {
  let usage: Record<string, number> = {};
  try {
    usage = JSON.parse(await readFile(USAGE_FILE, "utf8"));
  } catch {
    // First run: no usage yet.
  }
  const month = billingMonth();
  const used = usage[month] ?? 0;
  const granted = Math.max(0, Math.min(wanted, FREE_DETAILS_PER_MONTH - used));
  usage[month] = used + granted;
  await mkdir("leads", { recursive: true });
  await writeFile(USAGE_FILE, JSON.stringify(usage, null, 2) + "\n");
  return { granted, used: usage[month] };
}

function extractEmails(html: string) {
  const found: string[] = [];
  // Cloudflare hides emails as data-cfemail="<hex>"; the first byte is the XOR key.
  for (const [, hex] of html.matchAll(/data-cfemail="([0-9a-f]+)"/gi)) {
    const key = parseInt(hex.slice(0, 2), 16);
    let email = "";
    for (let i = 2; i < hex.length; i += 2) {
      email += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16) ^ key);
    }
    found.push(email);
  }
  const text = html
    .replace(/\\u[0-9a-f]{4}/gi, " ")
    .replace(/&#64;|&#x40;|%40/gi, "@");
  for (const [email] of text.matchAll(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi)) {
    found.push(email);
  }
  return found.map((e) => e.toLowerCase()).filter((e) => !JUNK_EMAIL.test(e));
}

const BOT_UA = "Mozilla/5.0 (compatible; LeadFinder/1.0)";
const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";

// status 0 means the request failed outright (dead domain, timeout).
async function fetchPage(url: string, timeout = 8000, userAgent = BOT_UA) {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(timeout),
      headers: { "User-Agent": userAgent },
    });
    const isHtml = res.ok && res.headers.get("content-type")?.includes("text/html");
    return { status: res.status, url: res.url, html: isHtml ? await res.text() : "" };
  } catch {
    return { status: 0, url, html: "" };
  }
}

// Collects contact emails from a business's website and notes anything that
// makes it a good prospect for a new site.
async function checkWebsite(website: string | undefined) {
  let url: URL;
  try {
    url = new URL(website ?? "");
  } catch {
    return { emails: [], issue: "no website" };
  }
  const host = url.hostname.replace(/^www\./, "");
  if (matchesHost(host, NO_SITE_HOSTS)) return { emails: [], issue: "no website" };
  const profile = matchesHost(host, PROFILE_HOSTS);
  if (profile) return { emails: [], issue: `only a ${profile} page` };

  let home = await fetchPage(url.href);
  // Slow sites and ones that turn away bots look broken at first; give them a
  // second, browser-like try before we tell an owner their site is down.
  if (home.status === 0 || home.status >= 500) home = await fetchPage(url.href, 15000, BROWSER_UA);
  if (home.status === 0) return { emails: [], issue: "site down" };
  if (home.status === 404 || home.status >= 500) {
    return { emails: [], issue: `site broken (HTTP ${home.status})` };
  }
  // Blocked by bot protection (403) or not HTML: can't tell, so don't pitch.
  if (!home.html) return { emails: [], issue: "" };

  const issues: string[] = [];
  const free = matchesHost(new URL(home.url).hostname, FREE_SITE_HOSTS);
  if (free) issues.push(`free ${free} address`);
  if (home.url.startsWith("http:")) issues.push("no https");
  if (!/<meta[^>]+name=["']?viewport/i.test(home.html)) issues.push("not mobile-friendly");
  const years = [
    ...home.html.matchAll(/(?:©|&copy;|&#169;|copyright)[^<\d]{0,20}(?:\d{4}\s*[-–]\s*)?(\d{4})/gi),
  ].map((m) => Number(m[1]));
  const year = Math.max(...years);
  if (years.length && year >= 1995 && year <= THIS_YEAR - 3) {
    issues.push(`last updated ${year}`);
  }

  const emails = new Set(extractEmails(home.html));
  for (const path of ["/contact", "/contact-us", "/contato", "/about"]) {
    if (emails.size) break;
    const page = await fetchPage(new URL(path, home.url).href);
    for (const email of extractEmails(page.html)) emails.add(email);
  }
  return { emails: [...emails], issue: issues.join("; ") };
}

// Best prospects first; the labels are used for the summary.
const PROSPECT_KINDS = [
  "no website",
  "only a social/booking page",
  "site down or broken",
  "site needs work",
  "site looks fine",
];

function prospectKind(issue: string) {
  if (!issue) return 4;
  if (issue === "no website") return 0;
  if (issue.startsWith("only ")) return 1;
  if (issue.startsWith("site ")) return 2;
  return 3;
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

function parseArgs(argv: string[]) {
  const terms: string[] = [];
  const areas: string[] = [];
  let includedType: string | undefined;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--in") areas.push(argv[++i]);
    else if (argv[i] === "--type") includedType = argv[++i];
    else if (argv[i].trim()) terms.push(argv[i].trim());
  }
  const queries = areas.length
    ? terms.flatMap((t) => areas.map((a) => `${t} in ${a}`))
    : terms;
  const name = areas.length ? `${terms.join(" ")} in ${areas.join(" ")}` : terms.join(" ");
  return { queries, includedType, name };
}

const COLUMNS = [
  "name",
  "search",
  "phone",
  "whatsapp",
  "email",
  "website",
  "site_issue",
  "rating",
  "reviews",
  "address",
  "maps",
] as const;

async function main() {
  const { queries, includedType, name } = parseArgs(process.argv.slice(2));

  if (!queries.length) {
    console.error(
      'Usage: npm run leads:find -- "gyms in Koh Phangan" [--type gym]\n' +
        '       npm run leads:find -- "plumber" "ac repair" --in "Tampa, FL" --in "Houston, TX"',
    );
    process.exit(1);
  }
  if (!API_KEY) {
    console.error("Missing GOOGLE_MAPS_API_KEY in .env.local");
    process.exit(1);
  }

  // A place can match several searches; keep the first one that found it.
  const found = new Map<string, string>();
  let capped = 0;
  for (const query of queries) {
    const ids = await searchPlaceIds(query, includedType);
    if (ids.length >= 60) capped++;
    console.log(`${query}: ${ids.length}${ids.length >= 60 ? " (capped)" : ""}`);
    for (const id of ids) if (!found.has(id)) found.set(id, query);
  }
  if (!found.size) {
    console.log("No places found.");
    return;
  }

  const { granted, used } = await reserveDetails(found.size);
  if (!granted) {
    console.error(
      `This month's ${FREE_DETAILS_PER_MONTH} free detail lookups are used up (see ${USAGE_FILE}). Try again next month.`,
    );
    process.exit(1);
  }
  if (granted < found.size) {
    console.warn(`Only ${granted} of ${found.size} businesses fit in this month's free lookups; skipping the rest.`);
  }
  console.log(
    `${found.size} businesses. Looking up ${granted} (${used}/${FREE_DETAILS_PER_MONTH} free lookups used this month)…`,
  );
  const looked = await mapLimit([...found].slice(0, granted), 5, async ([id, search]) => {
    try {
      return { place: await getDetails(id), search };
    } catch (err) {
      console.warn(`  skipped ${id}: ${(err as Error).message.slice(0, 120)}`);
      return undefined;
    }
  });
  const open = looked.filter(
    (r): r is { place: Place; search: string } =>
      !!r && (!r.place.businessStatus || r.place.businessStatus === "OPERATIONAL"),
  );
  console.log(`${open.length} open businesses. Checking websites…`);

  const rows = await mapLimit(open, 8, async ({ place: p, search }) => {
    const site = await checkWebsite(p.websiteUri);
    return {
      name: p.displayName?.text ?? "",
      search,
      phone: p.internationalPhoneNumber ?? "",
      // Click-to-chat link; only works if the number is on WhatsApp.
      whatsapp: p.internationalPhoneNumber
        ? `https://wa.me/${p.internationalPhoneNumber.replace(/\D/g, "")}`
        : "",
      email: site.emails.join("; "),
      website: p.websiteUri ?? "",
      site_issue: site.issue,
      rating: p.rating?.toString() ?? "",
      reviews: p.userRatingCount?.toString() ?? "",
      address: p.formattedAddress ?? "",
      maps: p.googleMapsUri ?? "",
    };
  });
  rows.sort((a, b) => prospectKind(a.site_issue) - prospectKind(b.site_issue));

  const csv = [
    COLUMNS.join(","),
    ...rows.map((r) => COLUMNS.map((k) => `"${r[k].replace(/"/g, '""')}"`).join(",")),
  ].join("\n");
  const slug = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  const file = `leads/${slug}.csv`;
  await mkdir("leads", { recursive: true });
  await writeFile(file, csv + "\n");

  console.log(`${rows.length} businesses → ${file}`);
  PROSPECT_KINDS.forEach((label, kind) => {
    const group = rows.filter((r) => prospectKind(r.site_issue) === kind);
    const emails = group.filter((r) => r.email).length;
    const phones = group.filter((r) => r.phone).length;
    console.log(`  ${label.padEnd(28)} ${String(group.length).padStart(4)}  (${emails} email, ${phones} phone)`);
  });
  if (capped) {
    console.warn(
      `${capped} search(es) hit Google's 60-result cap — search smaller areas (neighborhoods) to find the rest.`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
