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

      {/* Contact Information */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="space-y-12">
          {/* Reception — Memberships & General Enquiries */}
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              🧾 Reception — Memberships &amp; General Enquiries
            </h2>
            <p className="mb-6 text-gray-600">
              For all enquiries regarding membership pauses, pricing, schedules, and general information:
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-lg">📧</span>
                <a
                  href="mailto:reception@summitgym.example.com"
                  className="text-brand-orange hover:underline"
                >
                  reception@summitgym.example.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">📱</span>
                <span className="text-gray-700">WhatsApp:</span>
                <a
                  href="https://wa.me/15550100001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-orange hover:underline"
                >
                  +66 (0)82-845-4756
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center">
            <div className="h-px w-full bg-gray-300"></div>
            <span className="px-4 text-gray-400">⸻</span>
            <div className="h-px w-full bg-gray-300"></div>
          </div>

          {/* CrossFit Classes & Content */}
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              💪 CrossFit Classes &amp; Content
            </h2>
            <p className="mb-6 text-gray-600">
              For all questions about CrossFit programming, class content, and coaching:
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-lg">📱</span>
                <span className="text-gray-700">WhatsApp:</span>
                <a
                  href="https://wa.me/15550100002"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-orange hover:underline"
                >
                  +972 54-648-1186
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">📷</span>
                <span className="text-gray-700">Instagram:</span>
                <a
                  href="https://instagram.com/summit.crossfit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-orange hover:underline"
                >
                  @summit.crossfit
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center">
            <div className="h-px w-full bg-gray-300"></div>
            <span className="px-4 text-gray-400">⸻</span>
            <div className="h-px w-full bg-gray-300"></div>
          </div>

          {/* Brazilian Jiu-Jitsu (BJJ) */}
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              🥋 Brazilian Jiu-Jitsu (BJJ)
            </h2>
            <p className="mb-6 text-gray-600">
              For everything related to BJJ classes, schedule, and memberships:
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-lg">📱</span>
                <span className="text-gray-700">WhatsApp:</span>
                <a
                  href="https://wa.me/15550100003"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-orange hover:underline"
                >
                  +66 (0)99 424 4784
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">📷</span>
                <span className="text-gray-700">Instagram:</span>
                <a
                  href="https://instagram.com/summit.bjj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-orange hover:underline"
                >
                  @summit.bjj
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center">
            <div className="h-px w-full bg-gray-300"></div>
            <span className="px-4 text-gray-400">⸻</span>
            <div className="h-px w-full bg-gray-300"></div>
          </div>

          {/* Management — Specific Enquiries */}
          <div className="rounded-lg bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              💬 Management — Specific Enquiries
            </h2>
            <p className="mb-6 text-gray-600">
              For job applications or any specific enquiries:
            </p>
            <div className="flex items-center gap-3">
              <span className="text-lg">📧</span>
              <a
                href="mailto:gm@summitgym.example.com"
                className="text-brand-orange hover:underline"
              >
                gm@summitgym.example.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
