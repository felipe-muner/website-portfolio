export default function DanielPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
            Daniel
          </h1>
          <p className="max-w-2xl text-xl text-gray-200">
            CrossFit Coach & Personal Trainer
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            About Daniel
          </h2>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Bio
            </h3>
            <p className="mb-4 text-gray-600">
              Management, is a graduate of a sports institute, and is a certified Level 2 CrossFit Trainer.
            </p>
            <p className="mb-4 text-gray-600">
              With over 8 years of hands-on coaching experience, Daniel has dedicated his career to guiding athletes of all levels, from complete beginners to seasoned competitors. His passion lies in creating a positive training environment where people feel challenged, supported, and motivated to push past their limits.
            </p>
            <p className="mb-4 text-gray-600">
              &quot;Teaching CrossFit is my favorite thing to do. Every day I have the opportunity to introduce this sport to new people, helping them build healthy habits, stay consistent, and hopefully carry that strength with them for life.&quot;
            </p>
            <p className="mb-4 text-gray-600">
              Daniel believes CrossFit is more than just fitness, it&apos;s a lifestyle that builds resilience, community, and long-lasting well-being.
            </p>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Education &amp; Certifications
            </h3>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>Graduate of a sports institute</li>
              <li>Certified Level 2 CrossFit Trainer</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Book a Session
            </h3>
            <p className="mb-4 text-gray-600">
              Ready to push your limits with Daniel?
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
