export default function PraviloPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
            Pravilo
          </h1>
          <p className="max-w-2xl text-xl text-gray-200">
            Starting December 1st
          </p>
          <p className="mt-4 max-w-3xl text-lg text-gray-300">
            Experience the ancient Slavic stretching device that improves flexibility, strength, and overall body alignment.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            What is Pravilo?
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Pravilo is a traditional Slavic stretching device designed to improve flexibility, posture, and overall physical health.
            Through controlled stretching and alignment, it helps release tension, improve mobility, and enhance body awareness.
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            Benefits of Pravilo
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Improved Flexibility
              </h3>
              <p className="text-gray-600">
                Safely stretch and lengthen muscles to increase range of motion.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Better Posture
              </h3>
              <p className="text-gray-600">
                Correct alignment issues and develop better postural habits.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Pain Relief
              </h3>
              <p className="text-gray-600">
                Alleviate chronic pain from poor posture and tight muscles.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Spinal Health
              </h3>
              <p className="text-gray-600">
                Decompress the spine and improve overall spinal alignment.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Stress Reduction
              </h3>
              <p className="text-gray-600">
                Experience deep relaxation through controlled stretching.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Enhanced Recovery
              </h3>
              <p className="text-gray-600">
                Speed up recovery from workouts and reduce muscle tension.
              </p>
            </div>
          </div>
        </div>

        {/* Sessions Info */}
        <div className="mb-16 rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Session Schedule
          </h2>
          <p className="mb-4 text-lg text-gray-600">
            Sessions start December 1st. Schedule details coming soon.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Individual Sessions
              </h3>
              <p className="text-gray-600">
                One-on-one guided sessions with our certified Pravilo practitioners.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Group Sessions
              </h3>
              <p className="text-gray-600">
                Small group sessions for a more accessible introduction to Pravilo.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Interested in Pravilo?
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            Contact us for more information and early registration
          </p>
          <a
            href="/contact"
            className="inline-block rounded-lg bg-brand-orange px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}
