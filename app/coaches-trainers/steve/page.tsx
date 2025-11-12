import Image from "next/image";

export default function StevePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
            Steve
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
            About Steve
          </h2>

          {/* Profile Image */}
          <div className="mb-8 w-full">
            <div className="relative w-full overflow-hidden rounded-lg">
              <Image
                src="/img/team/steve.png"
                alt="Steve - HIIT and Tabata Coach"
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
              Sample bio.</p>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Summary
            </h3>
            <p className="mb-4 text-gray-600">
              I deliver high-energy HIIT and Tabata sessions that are designed to push limits, build endurance, and leave people feeling stronger, fitter, and more alive. My classes blend discipline with encouragement, ensuring everyone—whether a beginner or experienced athlete—finds their edge while training safely.
            </p>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Services
            </h3>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li><strong>HIIT Classes:</strong> Fast-paced sessions combining strength, cardio, and endurance.</li>
              <li><strong>Tabata Training:</strong> Intense, time-based intervals to burn fat and boost stamina.</li>
              <li><strong>Breathwork &amp; Ice Bath Integration:</strong> Optional add-ons to enhance recovery, resilience, and nervous system regulation.</li>
              <li><strong>One-to-One Coaching:</strong> Personalized fitness and wellbeing plans tailored to individual goals.</li>
            </ul>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Experience
            </h3>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>Over a decade of delivering wellbeing training, fitness workshops, and resilience coaching.</li>
              <li>Regular group sessions at gyms and wellness venues across Ko Phangan.</li>
              <li>International speaker on resilience, recovery, and performance—bringing these lessons directly into physical training.</li>
              <li>Proven experience working with corporate teams, retreats, and individuals seeking transformation.</li>
            </ul>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Certificates
            </h3>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>REPS level 2 &amp; 3 Personal Trainer</li>
              <li>Group Fitness Facilitator</li>
              <li>Certified First Aid Instructor</li>
              <li>First Aid Trainer</li>
              <li>Accredited Life Coach</li>
              <li>Ongoing professional development in breathwork and nervous system regulation</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Join a Class
            </h3>
            <p className="mb-4 text-gray-600">
              Ready to take your fitness to the next level with Steve?
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
