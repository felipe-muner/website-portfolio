export default function KatePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
            Kate
          </h1>
          <p className="max-w-2xl text-xl text-gray-200">
            Personal Trainer - English, Thai
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            About Kate
          </h2>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Languages
            </h3>
            <p className="text-gray-600">English, Thai</p>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Specialization
            </h3>
            <p className="text-gray-600">
              Muay Thai fitness, cardio conditioning, and martial arts-inspired training.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Book a Session
            </h3>
            <p className="mb-4 text-gray-600">
              Ready to start your fitness journey with Kate?
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
