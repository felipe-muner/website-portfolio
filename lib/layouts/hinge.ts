// FICTIONAL content for Hinge Physio (/physio) — an island physiotherapy and
// sports-rehab clinic template in a framed "cell" layout. Every person, price,
// review, number and opening hour here is invented for the demo; the contact
// details come from the shared CONTACT.

export const BRAND = {
  name: "Hinge",
  full: "Hinge Physio & Sports Rehab",
  line: "Physio & sports rehab",
} as const;

export const NAV = [
  { href: "#first-visit", label: "First visit" },
  { href: "#injuries", label: "Injuries" },
  { href: "#movement", label: "Movement lab" },
  { href: "#rehab", label: "Rehab plans" },
  { href: "#prices", label: "Prices" },
  { href: "#contact", label: "Contact" },
] as const;

export const FACTS = [
  { title: "No referral needed", text: "Book straight in. Receipts work with most travel insurers." },
  { title: "Licensed physios", text: "Thai-licensed, with UK and Australian registration on the team." },
  { title: "Seven days a week", text: "Mon to Sat 08:00 – 19:00, Sundays 09:00 – 13:00." },
] as const;

export interface Step {
  n: string;
  title: string;
  text: string;
  image?: string;
}

export const FIRST_VISIT: readonly Step[] = [
  {
    n: "01",
    title: "Tell us what happened",
    text: "Twenty unhurried minutes on the fall, the kick or the dive, plus what your week of training looks like.",
  },
  {
    n: "02",
    title: "We test how you move",
    text: "Range, strength and a few sport-specific moves: a squat, a teep, a duck dive on dry land.",
    image: "/img/layouts/mobility-ball.jpg",
  },
  {
    n: "03",
    title: "Hands-on, same day",
    text: "Soft-tissue work, joint mobilisation or taping, so you walk out moving better than you walked in.",
    image: "/img/layouts/spa-massage.jpg",
  },
  {
    n: "04",
    title: "A plan you can carry",
    text: "Your exercises filmed on your own phone, with sets, reps and the day you can train again.",
  },
];

export interface Region {
  key: string;
  title: string;
  common: string;
  text: string;
  image: string;
}

export const REGIONS: readonly Region[] = [
  {
    key: "neck",
    title: "Neck & shoulders",
    common: "Laptop neck, rotator cuff, a shoulder that pops in the clinch",
    text: "Weeks of coworking on a beanbag catch up with everyone. We free the joint first, then build the muscles that keep it there.",
    image: "/img/layouts/spa-massage.jpg",
  },
  {
    key: "back",
    title: "Lower back",
    common: "Lifting a dive tank, sciatica, the long-tail boat bounce",
    text: "Most backs settle within three sessions with movement, not bed rest. We tell you honestly when a scan is worth it.",
    image: "/img/layouts/fitness-situps.jpg",
  },
  {
    key: "knee",
    title: "Hip & knee",
    common: "Runner's knee, hip flexors, a lotus pose that went too far",
    text: "We look above and below the sore spot: a stiff ankle or a lazy glute is often what the knee is complaining about.",
    image: "/img/layouts/yoga-warrior-class.jpg",
  },
  {
    key: "ankle",
    title: "Ankle & foot",
    common: "Rolled ankles on rocky trails, reef cuts that stiffened, Achilles",
    text: "Sprains heal; weak ankles roll again. Balance and hop work is what stops the second one.",
    image: "/img/layouts/gym-kettlebell-shoe.jpg",
  },
  {
    key: "wrist",
    title: "Wrist & elbow",
    common: "Padwork wrists, handstand practice, scooter falls",
    text: "Taping to keep you training while it heals, then a grip and loading plan so it doesn't come back next camp.",
    image: "/img/layouts/muaythai-4.jpg",
  },
];

export const MOVEMENT_PHASES = [
  { title: "Load", text: "How the joint takes your weight: a slow squat, a single-leg land, a plank under load." },
  { title: "Range", text: "Where you stop and why. Stiff tissue, a guarding muscle or a joint that needs room." },
  { title: "Power", text: "Kicks, jumps and sprints on video at 240 frames a second, side by side with the good side." },
  { title: "Control", text: "Can you hold the position tired? That is when injuries come back, so that is what we test." },
] as const;

export const REHAB_PLAN: readonly { when: string; title: string; text: string; image: string }[] = [
  {
    when: "Day 1",
    title: "Assess",
    text: "The full movement screen and a clear answer: what it is, how long, and what you can still do this week.",
    image: "/img/layouts/mobility-ball.jpg",
  },
  {
    when: "Days 2 to 5",
    title: "Treat",
    text: "Hands-on sessions every other day while pain is high, plus the first exercises at home.",
    image: "/img/layouts/spa-massage.jpg",
  },
  {
    when: "Week 2",
    title: "Load",
    text: "In our training room: weights, bands and sport drills, building back to what you came to the island for.",
    image: "/img/layouts/gym-training-man.jpg",
  },
  {
    when: "Before you fly",
    title: "Hand over",
    text: "A written report for your physio at home, and a plan that fits a hotel gym or a living room.",
    image: "/img/layouts/coast-cliffs.jpg",
  },
];

export const REVIEWS = [
  {
    quote: "I came in limping two days before my fight. They taped it, gave me a plan, and I fought — and won — on Saturday.",
    name: "Kenji, 27",
    detail: "Muay Thai · ankle sprain",
    image: "/img/layouts/muaythai-3.jpg",
  },
  {
    quote: "My ears were fine, my lower back was not. Four sessions and I finished my Divemaster without a single painkiller.",
    name: "Marta, 34",
    detail: "Divemaster trainee · lower back",
    image: "/img/layouts/dive-diver-blue.jpg",
  },
  {
    quote: "Teaching six classes a week had wrecked my wrists. They changed how I load them, not how much I practise.",
    name: "Anna, 41",
    detail: "Yoga teacher · wrists",
    image: "/img/layouts/yoga-backbend.jpg",
  },
] as const;

export const TEAM = [
  {
    name: "Ploy Sriwan",
    role: "Founder · sports physio",
    text: "Twelve years with Thai national boxing teams. Treats in Thai and English.",
    image: "/img/layouts/person-f3.jpg",
  },
  {
    name: "Tom Ashby",
    role: "Physio · back & shoulder",
    text: "Former surf-lifesaver from Cornwall. Keeps a whiteboard of every diver he has sent back underwater.",
    image: "/img/layouts/person-m2.jpg",
  },
  {
    name: "Dr. Mai Linh",
    role: "Physio · yoga & dance",
    text: "Hypermobility, wrists and hips. Taught yoga for six years before retraining.",
    image: "/img/layouts/person-f4.jpg",
  },
] as const;

export const VISIT_CHIPS = ["Muay Thai camps", "Villas & resorts", "Yoga retreats", "Dive schools"] as const;

export const PRICES = [
  { name: "First assessment", detail: "Movement screen, treatment and your plan", time: "60 min", price: "1,800" },
  { name: "Follow-up session", detail: "Hands-on treatment and exercise progression", time: "45 min", price: "1,400" },
  { name: "Sports taping", detail: "For fight night, a dive day or a long ride", time: "15 min", price: "400" },
  { name: "Movement lab", detail: "Video analysis of your kick, run or lift, with a report", time: "75 min", price: "2,500" },
  { name: "Rehab week", detail: "Four sessions plus training-room access", time: "7 days", price: "6,200" },
  { name: "Villa or camp visit", detail: "Any treatment, at your door within 12 km", time: "travel", price: "+500" },
] as const;

export const FAQS = [
  {
    q: "Will my travel insurance pay?",
    a: "Most do. We give you an itemised receipt with the diagnosis code and the physio's licence number, which is what insurers ask for.",
  },
  {
    q: "Can I keep training while I'm being treated?",
    a: "Almost always, just differently. We tell you exactly what to drop, what to keep and what to swap, so you don't lose your camp.",
  },
  {
    q: "Do I need an X-ray or a scan first?",
    a: "No. If we think you need one, we'll say so and send you to the hospital in Thong Sala with a written note.",
  },
  {
    q: "What should I wear?",
    a: "Shorts and a vest or sports top. Bring the shoes you train in if your pain is in the leg or foot.",
  },
  {
    q: "I fly home in four days. Is it worth starting?",
    a: "Yes. Two sessions and a clear plan are worth more than a month of guessing, and we write a report your physio at home can pick up from.",
  },
  {
    q: "Do you treat children?",
    a: "From eight years old, with a parent in the room. Growing-pain knees and sports injuries are the usual reasons.",
  },
] as const;

export const HOURS = [
  { days: "Monday to Friday", time: "08:00 – 19:00" },
  { days: "Saturday", time: "08:00 – 19:00" },
  { days: "Sunday", time: "09:00 – 13:00" },
] as const;

export const TOPICS = ["A new injury", "An old injury that came back", "Movement lab", "Villa or camp visit", "Something else"] as const;
