import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
            Contact Us
          </h1>
          <p className="max-w-2xl text-xl text-gray-200">
            Get in touch with our team for inquiries about our programs and services
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Gym Contact */}
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">The Gym</h2>
            <p className="mb-6 text-gray-600">
              For general gym inquiries, memberships, and facilities
            </p>
            <Link
              href="/contact-gym"
              className="inline-block rounded-lg bg-brand-orange px-6 py-3 text-white transition-colors hover:bg-orange-600"
            >
              Contact Gym
            </Link>
          </div>

          {/* Reformer Pilates Contact */}
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Reformer Pilates
            </h2>
            <p className="mb-6 text-gray-600">
              Questions about Reformer Pilates classes and bookings
            </p>
            <Link
              href="/reformer-pilates"
              className="inline-block rounded-lg bg-brand-orange px-6 py-3 text-white transition-colors hover:bg-orange-600"
            >
              Pilates Info
            </Link>
          </div>

          {/* Fitness Classes Contact */}
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Fitness Classes
            </h2>
            <p className="mb-6 text-gray-600">
              Inquiries about HIIT, Tabata, Boot Camp, and other fitness classes
            </p>
            <Link
              href="/classes"
              className="inline-block rounded-lg bg-brand-orange px-6 py-3 text-white transition-colors hover:bg-orange-600"
            >
              Class Info
            </Link>
          </div>

          {/* CrossFit Contact */}
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">CrossFit</h2>
            <p className="mb-6 text-gray-600">
              Questions about CrossFit and Hyrox programs
            </p>
            <Link
              href="/contact-crossfit"
              className="inline-block rounded-lg bg-brand-orange px-6 py-3 text-white transition-colors hover:bg-orange-600"
            >
              Contact CrossFit
            </Link>
          </div>

          {/* Brazilian Jiu-Jitsu Contact */}
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Brazilian Jiu-Jitsu
            </h2>
            <p className="mb-6 text-gray-600">
              Starting October 1st - Get in touch for more information
            </p>
            <Link
              href="/brazilian-jiu-jitsu"
              className="inline-block rounded-lg bg-brand-orange px-6 py-3 text-white transition-colors hover:bg-orange-600"
            >
              BJJ Info
            </Link>
          </div>

          {/* Pravilo Contact */}
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Pravilo</h2>
            <p className="mb-6 text-gray-600">
              Starting December 1st - Contact us for early registration
            </p>
            <Link
              href="/pravilo"
              className="inline-block rounded-lg bg-brand-orange px-6 py-3 text-white transition-colors hover:bg-orange-600"
            >
              Pravilo Info
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
