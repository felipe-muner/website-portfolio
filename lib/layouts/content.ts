// Shared FICTIONAL content for the portfolio layout previews (/gym/v*,
// /yoga/v*, /villa/v*, /restaurant, /cafe, /barber, /dive, /spa).
// Every brand, person, price and contact detail here is invented — these
// templates are shown to prospective customers and must not leak any real
// business data.

export const CONTACT = {
  name: "Demo Brand Co.",
  shortName: "Demo",
  address: "88/8 Sunset Beach Road, Srithanu, Tropical Island 84280, Thailand",
  area: "Tropical Island · Thailand",
  phone: "+66 99 123 4567",
  phoneHref: "tel:+66991234567",
  email: "hello@yourbrand.com",
  emailHref: "mailto:hello@yourbrand.com",
  facebook: "#",
  instagram: "#",
  instagramHandle: "@yourbrand",
} as const;

export interface LandingClass {
  name: string;
  detail: string;
  href: string;
  image: string;
  coach?: string;
}

export const GYM_CLASSES: readonly LandingClass[] = [
  {
    name: "Cross-Training WOD",
    detail: "The classic workout of the day — strength, skill and a conditioning piece, scaled to every level.",
    href: "#",
    image: "/img/layouts/gym-barbell-floor.jpg",
    coach: "Marco",
  },
  {
    name: "Race Prep",
    detail: "Race-specific engine building: sleds, wall balls, burpee broad jumps and compromised running.",
    href: "#",
    image: "/img/layouts/gym-sled-push.jpg",
    coach: "Lena",
  },
  {
    name: "HIIT & Tabata",
    detail: "Short, sharp intervals that torch the engine — twenty seconds on, ten off, no hiding.",
    href: "#",
    image: "/img/layouts/fitness-situps.jpg",
    coach: "Theo",
  },
  {
    name: "Weightlifting",
    detail: "Snatch and clean & jerk technique under a coach's eye — positions first, kilos second.",
    href: "#",
    image: "/img/layouts/gym-squat-bw.jpg",
    coach: "Nadia",
  },
  {
    name: "Boot Camp",
    detail: "Outdoor-style team training — carries, runs and bodyweight grit in the island heat.",
    href: "#",
    image: "/img/layouts/gym-battle-ropes.jpg",
    coach: "Diana",
  },
  {
    name: "Jiu-Jitsu",
    detail: "Gi and no-gi fundamentals on the mats — technique, leverage and live rolling.",
    href: "#",
    image: "/img/layouts/gym-chalk-hands.jpg",
    coach: "Eli",
  },
] as const;

export const YOGA_CLASSES: readonly LandingClass[] = [
  {
    name: "Power Vinyasa",
    detail: "Primal moves and powerful flows — strength and breath woven into one practice.",
    href: "#",
    image: "/img/layouts/yoga-warrior-class.jpg",
    coach: "Noah",
  },
  {
    name: "Mat Pilates",
    detail: "Slow, precise core work that unlocks hips, spine and shoulders for everything else you do.",
    href: "#",
    image: "/img/layouts/yoga-backbend.jpg",
    coach: "Isla",
  },
  {
    name: "Slow Flow & Balance",
    detail: "A gentle blend of yoga, tai chi and pilates to restore alignment and calm.",
    href: "#",
    image: "/img/layouts/yoga-meditation-studio.jpg",
    coach: "Amara",
  },
  {
    name: "Reformer Pilates",
    detail: "Spring-loaded resistance on the reformer bed — small classes, deep, precise work.",
    href: "#",
    image: "/img/layouts/yoga-props-pink.jpg",
    coach: "Mali & Isla",
  },
  {
    name: "Breathwork & Ice Bath",
    detail: "Guided breathing followed by a cold plunge — nervous-system training for body and mind.",
    href: "#",
    image: "/img/layouts/breathwork-group.jpg",
    coach: "Noah",
  },
  {
    name: "Deep Stretch & Mobility",
    detail: "Loaded stretching and end-range strength to bulletproof your joints.",
    href: "#",
    image: "/img/layouts/mobility-ball.jpg",
    coach: "Lena",
  },
] as const;

export interface LandingPlan {
  name: string;
  price: number;
  unit: string;
  note?: string;
  featured?: boolean;
}

// Demo prices in Thai Baht — round, fictional numbers.
export const GYM_PLANS: readonly LandingPlan[] = [
  { name: "Gym Drop-in", price: 250, unit: "visit" },
  { name: "Gym 5-Pass", price: 1100, unit: "5 visits", note: "Valid 1 month" },
  { name: "Gym 1 Month", price: 1800, unit: "month", featured: true },
  { name: "Gym 3 Months", price: 4800, unit: "3 months" },
  { name: "Gym 6 Months", price: 8500, unit: "6 months" },
  { name: "Gym 12 Months", price: 15000, unit: "year", note: "Best value" },
] as const;

export const CROSSFIT_PLANS: readonly LandingPlan[] = [
  { name: "Class Drop-in", price: 500, unit: "class", note: "Locals save 20%" },
  { name: "10-Class Pass", price: 2800, unit: "10 classes", note: "Valid 1 month" },
  { name: "Unlimited Month", price: 3900, unit: "month", featured: true },
  { name: "3-Month Athlete", price: 9900, unit: "3 months" },
] as const;

export const CLASS_PLANS: readonly LandingPlan[] = [
  { name: "Class Drop-in", price: 300, unit: "class" },
  { name: "Class 5-Pass", price: 1400, unit: "5 classes", note: "Valid 1 month" },
  { name: "Classes 1 Month", price: 2800, unit: "month", featured: true },
  {
    name: "All-Access + Steam & Ice",
    price: 3300,
    unit: "month",
    note: "Full access combo",
  },
] as const;

export interface LandingCoach {
  name: string;
  specialty: string;
  languages: string;
  href: string;
  image: string;
}

export const GYM_COACHES: readonly LandingCoach[] = [
  { name: "Marco", specialty: "Cross-Training", languages: "English / Spanish", href: "#", image: "/img/layouts/person-coach-m1.jpg" },
  { name: "Theo", specialty: "HIIT & Tabata", languages: "English", href: "#", image: "/img/layouts/person-m5.jpg" },
  { name: "Lena", specialty: "Race Prep & Engine", languages: "German / English", href: "#", image: "/img/layouts/person-coach-f2.jpg" },
  { name: "Nadia", specialty: "Weightlifting", languages: "Thai / English", href: "#", image: "/img/layouts/person-coach-f1.jpg" },
  { name: "Diana", specialty: "Boot Camp", languages: "English", href: "#", image: "/img/layouts/person-f3.jpg" },
  { name: "Eli", specialty: "Jiu-Jitsu", languages: "English / Portuguese", href: "#", image: "/img/layouts/person-m7.jpg" },
] as const;

export const YOGA_COACHES: readonly LandingCoach[] = [
  { name: "Isla", specialty: "Pilates & Reformer", languages: "English / Afrikaans", href: "#", image: "/img/layouts/person-f4.jpg" },
  { name: "Noah", specialty: "Power Vinyasa & Breathwork", languages: "English", href: "#", image: "/img/layouts/person-m2.jpg" },
  { name: "Amara", specialty: "Slow Flow & Yin", languages: "English / French", href: "#", image: "/img/layouts/person-f6.jpg" },
  { name: "Mali", specialty: "Reformer Pilates", languages: "Thai / English", href: "#", image: "/img/layouts/person-f8.jpg" },
] as const;

export const FACILITY = [
  { title: "Open-air gym floor", body: "Full free-weight floor, racks, machines and a calisthenics zone built for the island climate.", image: "/img/layouts/gym-dumbbell-rack.jpg" },
  { title: "Ice bath & steam room", body: "Contrast therapy steps from the gym floor — recover hard so you can train harder.", image: "/img/layouts/gym-kettlebell-shoe.jpg" },
  { title: "Reformer studio", body: "A dedicated, quiet studio with professional reformer beds and small class sizes.", image: "/img/layouts/yoga-props-pink.jpg" },
  { title: "Juice & protein bar", body: "Post-session shakes, coffee and snacks at the in-house bar.", image: "/img/layouts/cafe-latte.jpg" },
] as const;
