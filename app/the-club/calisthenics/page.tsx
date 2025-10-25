export default function CalisthenicsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
            Calisthenics
          </h1>
          <p className="max-w-2xl text-xl text-gray-200">
            Master bodyweight training and build functional strength
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Bodyweight Training Excellence
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Our dedicated calisthenics area features professional equipment for bodyweight training,
            including bars, rings, and parallel bars to help you master advanced movements and build
            incredible strength using just your bodyweight.
          </p>
        </div>

        {/* Equipment Features */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            Equipment & Features
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Pull-Up Bars
              </h3>
              <p className="text-gray-600">
                Multiple height pull-up bars for various grip positions and exercises.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Gymnastics Rings
              </h3>
              <p className="text-gray-600">
                Professional rings for advanced movements and skill development.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Parallel Bars
              </h3>
              <p className="text-gray-600">
                Dip bars and parallettes for upper body strength work.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Wall Bars
              </h3>
              <p className="text-gray-600">
                Swedish wall bars for stretching, core work, and mobility exercises.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Monkey Bars
              </h3>
              <p className="text-gray-600">
                Overhead bars for grip strength and traversing movements.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Open Training Space
              </h3>
              <p className="text-gray-600">
                Dedicated floor space for skills practice and bodyweight movements.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16 rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Benefits of Calisthenics
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Functional Strength
              </h3>
              <p className="text-gray-600">
                Build real-world strength that translates to everyday movements and sports.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Body Control
              </h3>
              <p className="text-gray-600">
                Develop exceptional body awareness and movement control.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Flexibility & Mobility
              </h3>
              <p className="text-gray-600">
                Improve joint mobility and muscle flexibility through full range of motion exercises.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Progressive Training
              </h3>
              <p className="text-gray-600">
                Scale exercises from beginner to advanced progressions.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Start Your Calisthenics Journey
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            Visit our gym to experience our calisthenics training area
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
