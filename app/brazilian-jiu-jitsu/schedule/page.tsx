export default function BJJSchedulePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
            BJJ Schedule
          </h1>
          <p className="max-w-2xl text-xl text-gray-200">
            Brazilian Jiu-Jitsu Class Schedule
          </p>
        </div>
      </section>

      {/* Schedule Content */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            Coming Soon
          </h2>
          <p className="mb-4 text-lg text-gray-600">
            Brazilian Jiu-Jitsu classes start October 1st. Check back soon for the complete schedule.
          </p>
          <p className="text-gray-600">
            For early registration and more information, please contact us.
          </p>
        </div>
      </section>
    </div>
  );
}
