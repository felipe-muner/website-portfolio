import Image from "next/image";

export default function OwenPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
            Owen
          </h1>
          <p className="max-w-2xl text-xl text-gray-200">
            HIIT and Tabata Coach
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            About Owen
          </h2>

          {/* Profile Image */}
          <div className="mb-8 w-full">
            <div className="relative w-full overflow-hidden rounded-lg">
              <Image
                src="/img/team/team-2.jpg"
                alt="Owen - HIIT and Tabata Coach"
                width={1200}
                height={800}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Bio
            </h3>
            <p className="mb-4 text-gray-600">
              A certified coach with years of group and one-to-one experience, focused on good technique, steady progression and training safely at any level.
            </p>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Summary
            </h3>
            <p className="mb-4 text-gray-600">
              A certified coach with years of group and one-to-one experience, focused on good technique, steady progression and training safely at any level.
            </p>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Services
            </h3>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>Certified coach with group and one-to-one experience</li>
              <li>Technique, progression and training safely at any level</li>
            </ul>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Experience
            </h3>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>Certified coach with group and one-to-one experience</li>
              <li>Technique, progression and training safely at any level</li>
            </ul>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Certificates
            </h3>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>Certified coach with group and one-to-one experience</li>
              <li>Technique, progression and training safely at any level</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Join a Class
            </h3>
            <p className="mb-4 text-gray-600">
              A certified coach with years of group and one-to-one experience, focused on good technique, steady progression and training safely at any level.
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
