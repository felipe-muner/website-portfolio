import Image from "next/image";

export default function VanessaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white md:text-6xl">
            Vanessa
          </h1>
          <p className="max-w-2xl text-xl text-gray-200">
            Reformer Pilates / Mat Pilates / Reformer 1-on-1
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            About Vanessa
          </h2>

          {/* Profile Image */}
          <div className="mb-8 flex justify-center">
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src="/img/team/vanessa.png"
                alt="Vanessa - Reformer Pilates Instructor"
                width={400}
                height={400}
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Bio
            </h3>
            <p className="mb-4 text-gray-600">
              With a vast background in holistic bodywork, therapeutic massage, yoga, pilates and conscious living, Vanessa offers an in-depth understanding and intuitive sensitivity to the interconnected mechanisms of body and mind.
            </p>
            <p className="mb-4 text-gray-600">
              With a great emphasis on alignment and functional movement, she guides to overall improved wellbeing and lifestyle awareness, specific to the needs of her clients. Her passion for movement and care for detail is a strong element of her classes, providing a sense of fullfilment on all levels.
            </p>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Summary
            </h3>
            <p className="mb-4 text-gray-600">
              Whether you&apos;re an elite athlete, post-natal or rehabilitating from injury, pilates is your foundation and catalyst to all kinds of movement practices and daily life regimes. With spinal health as a key element, we train the core-&quot;being&quot;, activating body and mind from the-inside-out; strengthening the deeper stabilizing muscles to promote maximum stability, enhanced joint mobility and freedom of movement, whilst toning abdominals, waistline, thighs and buttocks. Further, pilates engages a detoxifying organ massage, especially to the digestive tract, along targeted breath activation and improved muscle function.
            </p>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Services
            </h3>
            <p className="mb-4 text-gray-600">
              Your class will include effective conditioning or rehabilitation exercises, empowering postural alignment, assisted stretches and a great deal of fun and fascination mastering the deeper muscles of your body. Immerse into an all-round embodied experience!
            </p>
            <p className="mb-3 text-gray-600 font-semibold">
              Experience our Mat &amp; Reformer classes for:
            </p>
            <ul className="list-inside list-disc space-y-2 text-gray-600 mb-4">
              <li>Improved mobility, flexibility &amp; spinal alignment</li>
              <li>Overall enhanced strength &amp; stability</li>
              <li>Full body toning &amp; postural balance</li>
              <li>Interactive breathing</li>
              <li>A regulated nervous system</li>
              <li>Deepened body-mind connection &amp; a balanced self</li>
            </ul>
          </div>
          <div className="mb-8">
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Certificate
            </h3>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>Foundation &amp; Basic Mat Pilates by Conscious Movement Education- a training school</li>
              <li>Pilates Equipment / Reformer by Conscious Movement Education- a training school</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-xl font-bold text-gray-900">
              Book a Session
            </h3>
            <p className="mb-4 text-gray-600">
              Ready to start your Pilates journey with Vanessa?
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
