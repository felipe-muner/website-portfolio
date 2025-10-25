export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
            Class Schedule
          </h1>
          <p className="max-w-2xl text-xl text-gray-200">
            Plan your week with our comprehensive schedule of classes, training sessions, and programs
          </p>
        </div>
      </section>

      {/* Schedule Content */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Weekly Schedule
          </h2>
          <p className="text-lg text-gray-600">
            All classes and training sessions at Summit Gym
          </p>
        </div>

        {/* Schedule Grid - Placeholder for actual schedule */}
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-8">
            <h3 className="mb-4 text-2xl font-bold text-gray-900">
              Fitness Classes
            </h3>
            <p className="text-gray-600">
              Check our fitness class schedule for Pilates Mobility, HIIT, Boot Camp, Tabata, and more.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="mb-4 text-2xl font-bold text-gray-900">
              CrossFit & Hyrox
            </h3>
            <p className="text-gray-600">
              View the CrossFit and Hyrox training schedule including WOD, Team WOD, Gymnastics, and more.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="mb-4 text-2xl font-bold text-gray-900">
              Reformer Pilates
            </h3>
            <p className="text-gray-600">
              Book your Reformer Pilates sessions online.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="mb-4 text-2xl font-bold text-gray-900">
              Brazilian Jiu-Jitsu
            </h3>
            <p className="text-gray-600">
              Starting October 1st - Check the schedule for training times.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-2xl font-bold text-gray-900">
              Pravilo
            </h3>
            <p className="text-gray-600">
              Starting December 1st - Schedule coming soon.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
