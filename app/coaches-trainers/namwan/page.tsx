export default function NamwanPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
            Namwan
          </h1>
          <p className="max-w-2xl text-xl text-gray-200">
            1-on-1 Coach
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            About Namwan
          </h2>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Bio
            </h3>
            <p className="mb-4 text-gray-600">
              With a strong background in strength training, functional fitness, and weight-loss coaching, Namwan brings not only technical knowledge but also a deep sense of empathy and personal understanding to her clients. Growing up between cultures and developing resilience through sport and life experience, she offers a holistic approach to movement, mindset, and lifestyle.
            </p>
            <p className="mb-4 text-gray-600">
              Her philosophy is rooted in the belief that fitness is more than just physical, it is about discipline, emotional release, and building inner strength. Combining structured programming with creativity and attention to detail, Namwan guides her clients toward long-term results, greater self-confidence, and a deeper connection between body and mind.
            </p>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Summary
            </h3>
            <p className="mb-4 text-gray-600">
              Whether you&apos;re a beginner, an experienced athlete, or someone starting over after setbacks, Namwan provides clear guidance and a supportive space to grow. Her coaching combines strength training, functional conditioning, and weight-loss strategies with mindful awareness of posture and alignment.
            </p>
            <p className="mb-4 text-gray-600">
              Her programs emphasize building strong foundations, developing strength, balance, and endurance while also cultivating discipline and self-awareness. Beyond the physical results, her sessions are a place for stress release and emotional resilience, teaching that fitness is not just about looking good, but about feeling empowered and capable in daily life.
            </p>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Services
            </h3>
            <p className="mb-3 text-gray-600">
              Your training with Namwan will include:
            </p>
            <ul className="list-inside list-disc space-y-2 text-gray-600 mb-4">
              <li>Strength and conditioning workouts tailored to your goals</li>
              <li>Weight-loss strategies through training and nutrition guidance</li>
              <li>Postural alignment and corrective exercises</li>
              <li>One-on-one personal training and online coaching</li>
              <li>Mobility and functional movement drills for injury prevention</li>
              <li>Motivation and accountability to build lasting habits</li>
            </ul>
            <p className="text-gray-600 italic">
              Immerse into a training experience that challenges you physically, supports you mentally, and empowers you to grow in every aspect of life.
            </p>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Experience Benefits of Training with Namwan
            </h3>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>Improved strength, stability, and endurance</li>
              <li>Weight-loss results built on healthy habits</li>
              <li>Enhanced posture and joint mobility</li>
              <li>Emotional release through movement</li>
              <li>Increased confidence and self-discipline</li>
              <li>A deeper connection between mind and body</li>
            </ul>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Certificate
            </h3>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>7+ years training experience in strength &amp; functional fitness</li>
              <li>Weight-loss &amp; Body Recomposition Coaching</li>
              <li>Strength Training &amp; Conditioning Specialization</li>
              <li>CrossFit &amp; Functional Movement</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Book a Session
            </h3>
            <p className="mb-4 text-gray-600">
              Ready to start your fitness journey with Namwan?
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
