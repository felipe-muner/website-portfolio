import Link from "next/link";

export default function CoachesTrainersPage() {
  const personalTrainers = [
    { name: "Noah", specialty: "Gym", languages: "🇬🇧 English", href: "/coaches-trainers/noah" },
    { name: "Clara", specialty: "Hyrox & Gym", languages: "🇬🇧 English", href: "/coaches-trainers/clara" },
    { name: "Kai", specialty: "Gym", languages: "🇹🇭 Thai", href: "/coaches-trainers/kai" },
    { name: "Leo", specialty: "CrossFit", languages: "🇮🇱 Hebrew / 🇬🇧 English", href: "/coaches-trainers/leo" },
    { name: "Mara", specialty: "Gym & CrossFit", languages: "🇩🇪 German / 🇬🇧 English", href: "/coaches-trainers/mara" },
    { name: "Oskar", specialty: "Gym", languages: "🇵🇱 Polish", href: "/coaches-trainers/oskar" },
    { name: "Ivan", specialty: "Gym", languages: "🇷🇺 Russian", href: "/coaches-trainers/ivan" },
    { name: "Rhys", specialty: "BJJ", languages: "🇬🇧 English", href: "/coaches-trainers/rhys" },
    { name: "Nina", specialty: "CrossFit & Gym", languages: "🇹🇭 Thai / 🇬🇧 English", href: "/coaches-trainers/nina" },
    { name: "Yuri", specialty: "Právílo", languages: "🇷🇺 Russian", href: "/coaches-trainers/yuri" },
    { name: "Elena", specialty: "Reformer Pilates", languages: "🇬🇧 English", href: "/coaches-trainers/elena" },
    { name: "Fah", specialty: "Gym", languages: "🇹🇭 Thai / 🇬🇧 English", href: "/coaches-trainers/fah" },
    { name: "Sofia", specialty: "Reformer Pilates", languages: "🇬🇧 English / Afrikaans", href: "/coaches-trainers/sofia" },
  ];

  const groupClasses = {
    "Reformer Pilates": [
      { name: "Elena", href: "/coaches-trainers/elena" },
      { name: "Ploy", href: "/coaches-trainers/ploy" },
      { name: "Sofia", href: "/coaches-trainers/sofia" },
    ],
    "CrossFit & Hyrox": [
      { name: "Clara", href: "/coaches-trainers/clara" },
      { name: "Leo", href: "/coaches-trainers/leo" },
      { name: "Mara", href: "/coaches-trainers/mara" },
      { name: "Nina", href: "/coaches-trainers/nina" },
    ],
    "Fitness Classes": [
      { name: "Clara — Maximum Mobility", href: "/coaches-trainers/clara" },
      { name: "Mara — Boot Camp", href: "/coaches-trainers/mara" },
      { name: "Theo — Primal Moves", href: "/coaches-trainers/theo" },
      { name: "Owen — HIIT & Tabata", href: "/coaches-trainers/owen" },
      { name: "Sofia — Pilates Mobility", href: "/coaches-trainers/sofia" },
    ],
    "BJJ": [
      { name: "Rhys", href: "/coaches-trainers/rhys" },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
            Our Coaches & Trainers
          </h1>
          <p className="max-w-3xl text-lg text-gray-200">
            Meet our world-class team of certified coaches and personal trainers dedicated to helping you achieve your fitness goals.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        {/* Personal Trainers Section */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            🏋️ Personal Trainers (1-on-1)
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {personalTrainers.map((trainer) => (
              <Link
                key={trainer.name}
                href={trainer.href}
                className="rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-105"
              >
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  {trainer.name}
                </h3>
                <p className="mb-1 text-gray-600">
                  <strong>Specialty:</strong> {trainer.specialty}
                </p>
                <p className="text-gray-600">
                  <strong>Languages:</strong> {trainer.languages}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Group Class Coaches Section */}
        <div>
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            👩‍🏫 Group Class Coaches
          </h2>
          <div className="space-y-8">
            {Object.entries(groupClasses).map(([category, coaches]) => (
              <div key={category}>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  {category}
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {coaches.map((coach) => (
                    <Link
                      key={coach.name}
                      href={coach.href}
                      className="rounded-lg bg-white p-4 shadow transition-transform hover:scale-105"
                    >
                      <p className="font-medium text-gray-900">{coach.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            Contact us to book a session with one of our expert trainers
          </p>
          <a
            href="/contact"
            className="inline-block rounded-lg bg-brand-orange px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
