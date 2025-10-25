export default function BrazilianJiuJitsuPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
            Brazilian Jiu-Jitsu
          </h1>
          <p className="max-w-2xl text-xl text-gray-200">
            Starting October 1st
          </p>
          <p className="mt-4 max-w-3xl text-lg text-gray-300">
            The gentle art of Brazilian Jiu-Jitsu is coming to Summit Gym. Master the fundamentals of ground fighting, self-defense, and sport grappling.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            What is Brazilian Jiu-Jitsu?
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Brazilian Jiu-Jitsu (BJJ) is a martial art and combat sport that focuses on ground fighting and submission holds.
            It emphasizes technique and leverage over strength, making it accessible to practitioners of all sizes and fitness levels.
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            Benefits of BJJ
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Self-Defense
              </h3>
              <p className="text-gray-600">
                Learn practical self-defense techniques that work in real-world situations.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Full Body Workout
              </h3>
              <p className="text-gray-600">
                Improve strength, flexibility, endurance, and overall fitness.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Mental Discipline
              </h3>
              <p className="text-gray-600">
                Develop focus, problem-solving skills, and mental toughness.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Community
              </h3>
              <p className="text-gray-600">
                Join a supportive community of practitioners from all backgrounds.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Stress Relief
              </h3>
              <p className="text-gray-600">
                Release tension and clear your mind through focused training.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Sport & Competition
              </h3>
              <p className="text-gray-600">
                Opportunities to compete at local, national, and international levels.
              </p>
            </div>
          </div>
        </div>

        {/* Classes Info */}
        <div className="mb-16 rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Class Schedule
          </h2>
          <p className="mb-4 text-lg text-gray-600">
            Classes start October 1st. Schedule details coming soon.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Fundamentals
              </h3>
              <p className="text-gray-600">
                Perfect for beginners. Learn the basics of positions, submissions, and escapes.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                All Levels
              </h3>
              <p className="text-gray-600">
                Open to practitioners of all skill levels. Refine techniques and roll with training partners.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Competition Team
              </h3>
              <p className="text-gray-600">
                For those interested in competing. Advanced techniques and intensive training.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Ready to Start Your BJJ Journey?
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            Contact us for more information and early registration
          </p>
          <a
            href="/contact"
            className="inline-block rounded-lg bg-brand-orange px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Get Started
          </a>
        </div>
      </section>
    </div>
  );
}
