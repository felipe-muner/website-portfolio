export default function CharlenePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
            Charlene
          </h1>
          <p className="max-w-2xl text-xl text-gray-200">
            Personal Trainer - English
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            About Charlene
          </h2>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Languages
            </h3>
            <p className="text-gray-600">English</p>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Specialization
            </h3>
            <p className="text-gray-600">
              Functional fitness, weight loss, and holistic wellness coaching.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Book a Session
            </h3>
            <p className="mb-4 text-gray-600">
              Ready to start your fitness journey with Charlene?
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
