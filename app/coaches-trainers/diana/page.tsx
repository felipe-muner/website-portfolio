export default function DianaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
            Diana
          </h1>
          <p className="max-w-2xl text-xl text-gray-200">
            CrossFit &amp; Functional Training Coach (Bootcamp / CrossFit / 1-on-1)
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            About Diana
          </h2>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Bio
            </h3>
            <p className="mb-4 text-gray-600">
              Since Diana needs to move to be happy, she started with athletics at a very young age. Her strength was short-distance sprinting (60m / 100m), which led to her first experience with a barbell and heavier weights at just 14 years old — used to build strength and resilience for her fast sprints.
            </p>
            <p className="mb-4 text-gray-600">
              Over time, athletic competitions became less frequent, but her love for the barbell and heavy weights remained. Throughout the years, Diana focused on Powerlifting, Kettlebell Skills, and Judo — until CrossFit entered the stage. From day one, she fell in love with the world of Functional Training.
            </p>
            <p className="mb-4 text-gray-600">
              Sample bio.</p>
            <p className="mb-4 text-gray-600">
              Sample bio.</p>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Services
            </h3>
            <p className="mb-3 text-gray-600 font-semibold">
              Personal Training with focus on:
            </p>
            <ul className="list-inside list-disc space-y-2 text-gray-600 mb-4">
              <li>Functional Training</li>
              <li>Functional Weightlifting Program for women over 35y</li>
              <li>Injury – related, individual recovery program</li>
              <li>Functional Training/Crossfit – Classes</li>
            </ul>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Experiences
            </h3>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>Athletics – since 40y</li>
              <li>Barbell Training, Classic Weightlifting – since 38y</li>
              <li>Functional Training – since 20y</li>
              <li>Animal Flow, Kettlebell Skills, Mobility – since 12y</li>
              <li>Next step: Trauma Informed Weightlifting Coach</li>
            </ul>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Certificates
            </h3>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>Bachelor of science (B.Sc.) with focus of Hospitality and Management</li>
              <li>Diploma of Sports Science</li>
              <li>Diploma Median Business Economist</li>
              <li>Crossfit Trainer Certificate Level 1 and Level 2</li>
              <li>Crossfit Trainer Certificate Weightlifting</li>
              <li>Crossfit Trainer Certificate Gymnastics</li>
              <li>Exercise Specialist</li>
              <li>Ongoing: Trauma Informed Weightlifting Coach</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Book a Session
            </h3>
            <p className="mb-4 text-gray-600">
              Ready to train with Diana?
            </p>
            <a
              href="/contact"
              className="inline-block rounded-lg bg-brand-orange px-6 py-3 text-white transition-colors hover:bg-orange-600"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
