// Shared content + structure for the Jörg Panek coaching template (German).
// Fictional demo content modelled on the real joergpanek.net page structure.

export interface Offering {
  slug: string;
  /** Short label for nav + cards. */
  title: string;
  /** Full heading on the detail page. */
  fullTitle: string;
  tagline: string;
  image: string;
  format: string;
  duration: string;
  price: string;
  intro: string;
  body: readonly string[];
  bullets: readonly string[];
  recommended?: boolean;
}

export const OFFERINGS: readonly Offering[] = [
  {
    slug: "einzel-sitzung",
    title: "Einzel-Sitzung",
    fullTitle: "Einzel-Sitzung",
    tagline: "Behutsame Begleitung im geschützten Einzelraum.",
    image: "/img/layouts/coach-lotus.jpg",
    format: "Online oder in Bamberg",
    duration: "60–90 Minuten",
    price: "ab 95 €",
    intro:
      "Ein ruhiger, wertfreier Raum nur für dich — in dem sich entspannen darf, was lange angespannt war.",
    body: [
      "In der Einzel-Sitzung arbeiten wir nicht gegen deine Symptome, sondern mit deinem Nervensystem. Wir schaffen zuerst Sicherheit, bevor wir gemeinsam dorthin schauen, wo es schwer wird.",
      "Du bestimmst das Tempo. Nichts muss, alles darf da sein. Über die Zeit entsteht so wieder Kontakt zu dir selbst, deinen Bedürfnissen und deiner eigenen Kraft.",
    ],
    bullets: [
      "Traumasensible, körperorientierte Begleitung",
      "Arbeit im Tempo deines Nervensystems",
      "Online oder in der Praxis in Bamberg",
    ],
  },
  {
    slug: "paar-sitzung",
    title: "Paar-Sitzung",
    fullTitle: "Paar-Sitzung",
    tagline: "Wieder in Verbindung kommen — zuhören, verstehen, regulieren.",
    image: "/img/layouts/coach-river.jpg",
    format: "Online oder in Bamberg",
    duration: "90 Minuten",
    price: "ab 140 €",
    intro:
      "Viele Konflikte sind keine Charakterfrage, sondern zwei überforderte Nervensysteme, die sich gegenseitig aktivieren.",
    body: [
      "In der Paar-Sitzung lernt ihr, einander wieder zu hören — nicht über Schuld, sondern über das, was darunter liegt: Bedürfnisse, Schutz und alte Prägungen.",
      "Wir üben gemeinsame Regulation, damit Nähe wieder sicher wird und Gespräche nicht im Streit enden müssen.",
    ],
    bullets: [
      "Aufrichtige, sichere Kommunikation",
      "Co-Regulation statt Eskalation",
      "Für Paare in jeder Phase",
    ],
  },
  {
    slug: "langzeitbegleitung",
    title: "Langzeitbegleitung",
    fullTitle: "Langzeitbegleitung",
    tagline: "Ein verlässlicher Prozess, der Sicherheit und Wachstum trägt.",
    image: "/img/layouts/coach-forest-path.jpg",
    format: "Online & Bamberg",
    duration: "über mehrere Monate",
    price: "individuell",
    intro:
      "Tiefe Veränderung braucht Zeit und Verlässlichkeit. Die Langzeitbegleitung ist mein Herzstück.",
    body: [
      "Über mehrere Monate entsteht ein sicherer Rahmen, in dem dein Nervensystem Schritt für Schritt neue Erfahrungen machen darf. Wir gehen den Weg gemeinsam — ruhig, klar und an deiner Seite.",
      "Inhalt und Frequenz passen wir individuell an deinen Prozess an. So kann sich Heilung in deinem Tempo entfalten.",
    ],
    bullets: [
      "Kontinuierliche Begleitung über Monate",
      "Individuell auf deinen Prozess abgestimmt",
      "Tiefe statt schneller Lösungen",
    ],
    recommended: true,
  },
  {
    slug: "duo-2-1",
    title: "Duo 2:1 Sitzung",
    fullTitle: "Duo 2:1-Sitzung",
    tagline: "Zwei Begleiter, ein Fokus — besonders haltgebend.",
    image: "/img/layouts/coach-forest-mist.jpg",
    format: "Online oder in Bamberg",
    duration: "90–120 Minuten",
    price: "ab 180 €",
    intro:
      "In der Duo-Sitzung wirst du von zwei Begleitenden gehalten — ein besonders sicherer Rahmen für tiefere Prozesse.",
    body: [
      "Manchmal braucht es mehr Halt, als eine einzelne Begleitung geben kann. Im 2:1-Format teilen sich zwei erfahrene Begleitende die Aufmerksamkeit für dich.",
      "Das schafft Sicherheit für Themen, die viel Präsenz brauchen — und ermöglicht eine besonders behutsame Tiefe.",
    ],
    bullets: [
      "Zwei Begleitende, volle Präsenz",
      "Extra haltgebend für tiefe Prozesse",
      "Nach Absprache buchbar",
    ],
  },
  {
    slug: "tre",
    title: "TRE®",
    fullTitle: "Tension & Trauma Release Exercises (TRE®)",
    tagline: "Körperorientierte Übungen, die das Nervensystem entladen.",
    image: "/img/layouts/coach-tree-roots.jpg",
    format: "Einzeln oder in Gruppen",
    duration: "60–75 Minuten",
    price: "ab 85 €",
    intro:
      "TRE® aktiviert das natürliche Zittern des Körpers, über das Säugetiere Stress und Spannung von selbst lösen.",
    body: [
      "Über eine sanfte Übungsfolge lädt der Körper tief gehaltene Spannung aus — ohne die Geschichte erzählen zu müssen. Das Nervensystem reguliert sich auf körperlicher Ebene.",
      "Du lernst die Übungen so, dass du sie sicher auch allein zu Hause anwenden kannst.",
    ],
    bullets: [
      "Selbstregulation über den Körper",
      "Auch ohne Sprechen über Belastendes",
      "Für zu Hause erlernbar",
    ],
  },
];

export const getOffering = (slug: string) =>
  OFFERINGS.find((o) => o.slug === slug);

export interface NavItem {
  label: string;
  href: string;
  children?: readonly { label: string; href: string }[];
}

export const COACH_NAV: readonly NavItem[] = [
  { label: "Startseite", href: "/coaching" },
  {
    label: "Mein Angebot",
    href: "/coaching/angebote",
    children: OFFERINGS.map((o) => ({
      label: o.recommended ? `${o.title} (Empfehlung)` : o.title,
      href: `/coaching/angebote/${o.slug}`,
    })),
  },
  { label: "Aktuelle Termine", href: "/coaching/termine" },
  { label: "Blog", href: "/coaching/blog" },
  { label: "Über mich", href: "/coaching/ueber-mich" },
  { label: "Termin vereinbaren", href: "/coaching/termin" },
];

export interface Termin {
  date: string;
  weekday: string;
  title: string;
  place: string;
  note: string;
  status: "Plätze frei" | "Wenige Plätze" | "Ausgebucht";
}

export const TERMINE: readonly Termin[] = [
  { date: "12. Juli 2026", weekday: "Sonntag", title: "TRE®-Gruppe für Einsteiger:innen", place: "Praxis Bamberg", note: "10–13 Uhr · max. 8 Personen", status: "Plätze frei" },
  { date: "24. Juli 2026", weekday: "Freitag", title: "Abend für Aufrichtige Kommunikation", place: "Online (Zoom)", note: "19–21 Uhr", status: "Wenige Plätze" },
  { date: "9. August 2026", weekday: "Sonntag", title: "Workshop: Das Nervensystem verstehen", place: "Praxis Bamberg", note: "10–16 Uhr · inkl. Pause", status: "Plätze frei" },
  { date: "23. August 2026", weekday: "Sonntag", title: "TRE®-Vertiefung", place: "Praxis Bamberg", note: "10–13 Uhr · Vorerfahrung nötig", status: "Ausgebucht" },
];

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  image: string;
}

export const POSTS: readonly Post[] = [
  { slug: "was-ist-entwicklungstrauma", title: "Was ist Entwicklungstrauma?", excerpt: "Warum vieles, was wir „Persönlichkeit“ nennen, in Wahrheit erlernte Schutzstrategien sind — und was das mit Heilung zu tun hat.", date: "2. Juni 2026", readingTime: "6 Min.", image: "/img/layouts/coach-tree-roots.jpg" },
  { slug: "nervensystem-verstehen", title: "Fight, Flight, Freeze: das Nervensystem verstehen", excerpt: "Ein freundlicher Blick auf die Zustände unseres autonomen Nervensystems und wie wir wieder in Sicherheit finden.", date: "18. Mai 2026", readingTime: "8 Min.", image: "/img/layouts/coach-forest-mist.jpg" },
  { slug: "co-regulation", title: "Co-Regulation: heilen in Verbindung", excerpt: "Wir regulieren uns nicht nur allein. Warum Beziehung der Ort ist, an dem Heilung wirklich geschieht.", date: "30. April 2026", readingTime: "5 Min.", image: "/img/layouts/coach-river.jpg" },
];
