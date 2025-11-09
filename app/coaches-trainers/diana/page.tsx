export default function DianaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
            Diana
          </h1>
          <p className="max-w-2xl text-xl text-gray-200">
            CrossFit Coach, Gym & Boot Camp Trainer
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            About Diana
          </h2>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Bio
            </h3>
            <p className="mb-4 text-gray-600">
              Since Diana needs to move to be happy, she started with athletics in a very young age. Her strength was the short track running (60m/100m). That lead to her first contacts with a barbell and heavier weights already with 14 years as accessories to become stronger and more resilient in her fast sprints.
            </p>
            <p className="mb-4 text-gray-600">
              With the time the athletic competitions became less, but the love for the barbell and heavy weights remained. Over the years Diana focused on PowerLifting, Kettlebell Skills and Judo. Until Crossfit entered the stage. From day one she fell in love with the world of Functional Training.
            </p>
            <p className="mb-4 text-gray-600">
              During a 2.5y battle against an a serious illness in 2012 – she used the sport and the community as medicine and to survive. Especially the mental part helped her so much that she decided to take the chance of a second life to change everything and become a coach. To help others to stay healthy and strong or regain mental and physical power during/after any personal situation.
            </p>
            <p className="mb-4 text-gray-600">
              In 2017 she fulfilled her dream of her own Functional Training Gym in Switzerland which unfortunately she had to give up during Covid. That&apos;s when she made it to Koh Phangan to relax and make a plan what&apos;s next.
            </p>
            <p className="mb-4 text-gray-600">
              She got the offer to coach Crossfit on the island – and she still does. And much more.
            </p>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Certifications
            </h3>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>Diploma of Sports Science</li>
              <li>Crossfit Trainer Certificate Level 1 and Level 2</li>
              <li>Crossfit Trainer Certificate Weightlifting</li>
              <li>Crossfit Trainer Certificate Gymnastics</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Book a Session
            </h3>
            <p className="mb-4 text-gray-600">
              Ready to train with Diana?
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
