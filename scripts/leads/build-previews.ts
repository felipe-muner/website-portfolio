// Turns lead lists (CSV, one business per row) into preview sites and outreach copy.
//
//   npm run leads:build -- leads/plumber-ac-repair-house-cleaning-service-in-tampa-fl-houston-tx.csv
//
// Writes:
//   lib/previews/leads.json   businesses that get a preview at /preview/<slug> (deployed with the site)
//   leads/outreach.html       open locally: who to email or call, and what to say
//   leads/outreach.csv        the same, for a spreadsheet or mail-merge tool
//
// Who gets a preview: businesses where we found their own email address, and
// businesses that clearly need a site (none, broken, outdated) and have a phone.

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const SITE = "https://website-portfolio-felipe-muner.vercel.app";
const PORTFOLIO = `${SITE}/portfolio`;
const PRICE = "$499";
const SENDER = "Felipe";

type Trade = "plumbing" | "hvac" | "cleaning";

// Which trade a lead belongs to, from the search that found it. Labels match
// lib/previews/trades.ts.
const TRADES: Record<Trade, { match: RegExp; label: string; people: string }> = {
  plumbing: { match: /plumb/i, label: "Plumbing", people: "plumbing companies" },
  hvac: { match: /\bac\b|a\/c|hvac|air cond|heating|cooling/i, label: "AC & Heating", people: "AC companies" },
  cleaning: { match: /clean|maid/i, label: "House Cleaning", people: "cleaning companies" },
};

// Franchises and big chains already have corporate websites.
const CHAINS =
  /roto-rooter|mr\.? rooter|benjamin franklin|one hour|ars\b|rescue rooter|aire serv|service experts|mister sparky|molly maid|merry maids|the maids|maid pro|maidpro|home depot|lowe'?s|sears|aspen clean|1-tom-plumber|localpro|cleanzen/i;
// Companies this size have a marketing team; not a $499 customer.
const MAX_REVIEWS = 1500;

// Personal mailboxes small business owners use.
const FREEMAIL =
  /@(gmail|yahoo|ymail|hotmail|outlook|live|msn|icloud|me|aol|comcast|att|sbcglobal|bellsouth|verizon|proton|protonmail)\.[a-z.]+$/i;

type Phone = { display: string; tel: string };
type Location = { latitude: number; longitude: number };

const STATES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado",
  CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho",
  IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana",
  ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota",
  MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada",
  NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina",
  ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas",
  UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia",
  WI: "Wisconsin", WY: "Wyoming", DC: "District of Columbia",
};

// Coordinates for each city (the AC preview's live "outside" temperature), from
// Open-Meteo's free geocoder. One lookup per city per run.
const located = new Map<string, Promise<Location | null>>();
function locate(city: string, state: string) {
  const key = `${city}|${state}`;
  if (!located.has(key)) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?count=10&countryCode=US&name=${encodeURIComponent(city)}`;
    located.set(
      key,
      fetch(url, { signal: AbortSignal.timeout(10000) })
        .then((res) => res.json() as Promise<{ results?: { latitude: number; longitude: number; admin1?: string }[] }>)
        .then(({ results = [] }) => {
          const match = results.find((r) => r.admin1 === STATES[state]) ?? results[0];
          return match ? { latitude: match.latitude, longitude: match.longitude } : null;
        })
        .catch(() => null),
    );
  }
  return located.get(key)!;
}

type Lead = {
  slug: string;
  name: string;
  short: string;
  trade: Trade;
  city: string;
  place: string;
  location: Location | null;
  phone: Phone | null;
  rating: number;
  reviews: number;
  maps: string;
  email: string;
  website: string;
  issue: string;
  channel: "email" | "call";
  url: string;
};

type Outreach = Lead & { subject: string; body: string; script: string; text: string };

function esc(s: string) {
  const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return s.replace(/[&<>"']/g, (c) => entities[c]);
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") field += c;
  }
  if (field || row.length) rows.push([...row, field]);
  const [header, ...body] = rows;
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

const csvCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

// "Joe's Plumbing LLC | Water Heaters Tampa" → "Joe's Plumbing"
function shortName(name: string) {
  return name
    .split(/\s[|–—-]\s|\s\|\s?/)[0]
    .replace(/,?\s+(LLC|L\.L\.C\.|Inc\.?|Corp\.?|Co\.)$/i, "")
    .trim();
}

function formatPhone(international: string): Phone | null {
  const digits = international.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return { display: `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`, tel: `+${digits}` };
  }
  return digits ? { display: international, tel: `+${digits}` } : null;
}

// "123 Main St, Tampa, FL 33602, USA" → { city: "Tampa", state: "FL" }
function cityState(address: string, search: string) {
  const parts = address.split(", ").filter((p) => p !== "USA");
  if (parts.length >= 2) {
    return { city: parts[parts.length - 2], state: parts[parts.length - 1].split(" ")[0] };
  }
  const [city = "", state = ""] = (search.split(" in ")[1] ?? "").split(", ");
  return { city, state };
}

// The business's own address: on its website's domain, or a personal mailbox.
// Anything else on the site is usually the web designer's or a stray widget's.
function ownEmail(emails: string[], website: string) {
  const base = (host: string) => host.toLowerCase().replace(/^www\./, "").split(".").slice(-2).join(".");
  let site = "";
  try {
    site = base(new URL(website).hostname);
  } catch {
    // No website: only personal mailboxes can be theirs.
  }
  return emails.find((e) => FREEMAIL.test(e) || (site && base(e.split("@")[1] ?? "") === site)) ?? "";
}

// Why this business could use a new site, as the end of "I noticed ...".
function reasonText(issue: string) {
  if (issue === "no website") return "you don't have a website yet";
  if (issue.startsWith("only a ")) return `your Google listing only links to ${issue.slice(7).replace(/ page$/, "")}`;
  if (issue === "site down") return "your website isn't loading";
  if (issue.startsWith("site broken")) return "your website is showing an error";
  const notes = issue.split("; ").map((note) => {
    if (note === "not mobile-friendly") return "is hard to use on a phone";
    if (note === "no https") return `shows as "Not secure" in browsers`;
    if (note.startsWith("last updated ")) return `looks like it hasn't been updated since ${note.slice(13)}`;
    if (note.startsWith("free ")) return `is on a free ${note.slice(5, -8)} address`;
    return note;
  });
  return `your website ${notes.join(" and ")}`;
}

function emailFor(l: Lead) {
  const hook =
    l.issue === "no website" || l.issue.startsWith("only a ")
      ? `You don't have one yet, and people in ${l.city} are searching for ${TRADES[l.trade].people} on their phones right now.`
      : l.issue
        ? `Right now ${reasonText(l.issue)}. This one fixes that.`
        : `Your current one works. This one gets people to call.`;
  return {
    subject: `I built ${l.short} a new website`,
    body: `Hi ${l.short},

I built you a new website. It's live, take a look:
${l.url}

${hook}

${PRICE} one-time: your own domain, linked to your Google listing, hosting free for a year. Any changes you want are included.

Want it? Just reply "yes".

${SENDER}
${PORTFOLIO}
Not interested? Reply "no" and that's the last you'll hear from me.`,
  };
}

function callFor(l: Lead) {
  return {
    script: `Hi, is this ${l.short}? My name is ${SENDER}, I build websites for local ${TRADES[l.trade].people}. I noticed ${reasonText(l.issue)}, so I actually built one for you already, free to look at. Could I text you the link?`,
    text: `Hi, it's ${SENDER}. Here's the website I made for ${l.short}:\n${l.url}\nIf you like it, it's yours for ${PRICE} one-time, including your own domain and a year of hosting.`,
  };
}

function outreachPage(leads: Outreach[]) {
  const emails = leads.filter((l) => l.channel === "email");
  const calls = leads.filter((l) => l.channel === "call");
  const row = (l: Outreach) => `
    <article>
      <header>
        <div>
          <h3>${esc(l.name)}</h3>
          <p>${esc(TRADES[l.trade].label)} · ${esc(l.place)} · <span class="tag">${esc(l.issue || "has a website")}</span>${l.rating ? ` · ★ ${l.rating} (${l.reviews})` : ""}</p>
        </div>
        <a class="open" href="${esc(l.url)}" target="_blank" rel="noopener">Open preview ↗</a>
      </header>
      ${
        l.channel === "email"
          ? `<p class="to"><b>To:</b> ${esc(l.email)}</p>
      <p class="to"><b>Subject:</b> ${esc(l.subject)}</p>
      <pre>${esc(l.body)}</pre>
      <button data-copy="${esc(l.body)}">Copy email</button>`
          : `<p class="to"><b>Call:</b> <a href="tel:${esc(l.phone?.tel ?? "")}">${esc(l.phone?.display ?? "")}</a>${l.website ? ` · current link: <a href="${esc(l.website)}" target="_blank" rel="noopener">${esc(l.website.slice(0, 60))}</a>` : ""}</p>
      <pre>${esc(l.script)}</pre>
      <p class="to"><b>Text after they say yes:</b></p>
      <pre>${esc(l.text)}</pre>
      <button data-copy="${esc(l.text)}">Copy text</button>`
      }
    </article>`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Website outreach</title>
<style>
:root{--bg:#f8fafc;--card:#fff;--ink:#0f172a;--muted:#64748b;--line:#e2e8f0;--brand:#2563eb}
@media (prefers-color-scheme:dark){:root{--bg:#0b1120;--card:#111827;--ink:#e5e7eb;--muted:#94a3b8;--line:#1f2937;--brand:#60a5fa}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
main{max-width:900px;margin:0 auto;padding:32px 16px 80px}
h1{margin:0 0 4px;font-size:28px}
h2{margin:40px 0 4px}
.sub{color:var(--muted);margin:0 0 8px}
article{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px;margin-top:14px}
article header{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}
article h3{margin:0;font-size:17px}
article header p{margin:2px 0 0;color:var(--muted);font-size:14px}
.tag{color:var(--ink);font-weight:600}
.open{white-space:nowrap;color:var(--brand);font-weight:600}
.to{margin:10px 0 0}
a{color:var(--brand)}
pre{white-space:pre-wrap;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:12px;font:inherit;margin:8px 0}
button{background:var(--brand);color:#fff;border:0;border-radius:8px;padding:8px 14px;font:inherit;font-weight:600;cursor:pointer}
</style>
</head>
<body>
<main>
<h1>Website outreach</h1>
<p class="sub">${leads.length} previews · ${emails.length} to email · ${calls.length} to call · ${PRICE} one-time · portfolio: <a href="${PORTFOLIO}">${PORTFOLIO}</a></p>
<h2>Email (${emails.length})</h2>
<p class="sub">They have a website we can improve. Replace [YOUR MAILING ADDRESS] before sending (US law requires it). Send 20–30 a day.</p>
${emails.map(row).join("")}
<h2>Call (${calls.length})</h2>
<p class="sub">No website, or only a social/booking page, so there's no email. Call first and ask before texting the link (US rules on cold texts are strict).</p>
${calls.map(row).join("")}
</main>
<script>
document.addEventListener("click", async (e) => {
  const text = e.target.dataset?.copy;
  if (!text) return;
  try { await navigator.clipboard.writeText(text); e.target.textContent = "Copied ✓"; } catch {}
});
</script>
</body>
</html>
`;
}

async function main() {
  const files = process.argv.slice(2);
  if (!files.length) {
    console.error("Usage: npm run leads:build -- leads/<list>.csv [more.csv]");
    process.exit(1);
  }

  const seen = new Set<string>();
  const leads: Outreach[] = [];
  for (const file of files) {
    for (const r of parseCsv(await readFile(file, "utf8"))) {
      const trade = (Object.keys(TRADES) as Trade[]).find((k) => TRADES[k].match.test(r.search));
      if (!trade || CHAINS.test(r.name) || Number(r.reviews) > MAX_REVIEWS || seen.has(r.maps)) continue;
      seen.add(r.maps);

      const issue = r.site_issue;
      const phone = formatPhone(r.phone);
      // Several locations of one business share an inbox: email it once.
      let email = ownEmail(r.email ? r.email.split("; ") : [], r.website);
      if (seen.has(email)) email = "";
      if (email) seen.add(email);
      const hasSite = r.website && !issue.startsWith("only ") && issue !== "no website";
      const channel = email ? "email" : phone && (issue || !hasSite) ? "call" : undefined;
      if (!channel) continue;

      const { city, state } = cityState(r.address, r.search);
      const short = shortName(r.name);
      const slug = `${slugify(short)}-${createHash("sha1").update(r.maps || r.name).digest("hex").slice(0, 5)}`;
      const lead: Lead = {
        slug,
        name: r.name,
        short,
        trade,
        city,
        place: state ? `${city}, ${state}` : city,
        location: await locate(city, state),
        phone,
        rating: Number(r.rating) || 0,
        reviews: Number(r.reviews) || 0,
        maps: r.maps,
        email,
        website: r.website,
        issue,
        channel,
        url: `${SITE}/preview/${slug}`,
      };
      leads.push({
        ...lead,
        ...(channel === "email"
          ? { ...emailFor(lead), script: "", text: "" }
          : { ...callFor(lead), subject: "", body: "" }),
      });
    }
  }

  // Only what the preview page shows goes into the repo (it's public): no emails.
  const previews = leads.map(({ slug, name, short, trade, city, place, location, phone, rating, reviews, maps }) => ({
    slug,
    name,
    short,
    trade,
    city,
    place,
    location,
    phone,
    rating,
    reviews,
    maps,
  }));
  // Keep previews from earlier runs: their links are already in sent emails.
  const existing: typeof previews = await readFile("lib/previews/leads.json", "utf8")
    .then((t) => JSON.parse(t))
    .catch(() => []);
  const bySlug = new Map(existing.map((p) => [p.slug, p]));
  for (const p of previews) bySlug.set(p.slug, p);
  await writeFile("lib/previews/leads.json", JSON.stringify([...bySlug.values()], null, 2) + "\n");

  await mkdir("leads", { recursive: true });
  await writeFile("leads/outreach.html", outreachPage(leads));
  const cols = ["name", "trade", "place", "issue", "channel", "email", "phone", "url", "subject", "body", "script", "text"] as const;
  await writeFile(
    "leads/outreach.csv",
    [
      cols.join(","),
      ...leads.map((l) => cols.map((k) => csvCell(k === "phone" ? (l.phone?.display ?? "") : l[k])).join(",")),
    ].join("\n") + "\n",
  );

  const count = (key: "trade" | "channel") =>
    Object.entries(Object.groupBy(leads, (l) => l[key]))
      .map(([value, group]) => `${value} ${group?.length ?? 0}`)
      .join(", ");
  console.log(`${leads.length} new previews, ${bySlug.size} total → lib/previews/leads.json (${count("trade")})`);
  console.log(`leads/outreach.html: ${count("channel")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
