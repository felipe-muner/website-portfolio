import Image from "next/image";
import Link from "next/link";

export function GymmoAppDownload() {
  return (
    <div className="mt-8 w-full bg-brand-background-1 p-6 rounded-lg border border-brand-gray-darker">
      <h2 className="text-2xl font-semibold text-white mb-4">Book Your Class</h2>
      <p className="text-white mb-2">Drop-ins are welcome, but availability cannot be guaranteed.</p>
      <p className="text-white mb-4">We recommend booking your class in advance through our app.</p>

      <p className="text-white mb-6">
        <Link
          href="https://www.gymmo.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-orange font-semibold hover:underline"
        >
          Download the Gymmo App
        </Link>
        {' '}to reserve your spot and make your payment easily.
      </p>

      {/* QR Codes and App Store Buttons */}
      <div className="relative w-full">
        <Image
          src="/gymmo-app.png"
          alt="Download Gymmo App - Scan QR code for Google Play or App Store"
          width={1280}
          height={720}
          className="w-full h-auto rounded-lg"
        />
        {/* Clickable overlay - Left half for Google Play */}
        <Link
          href="https://play.google.com/store/apps/details"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-0 left-0 w-1/2 h-full hover:opacity-0 hover:bg-white/10 transition-all"
          aria-label="Download on Google Play"
        />
        {/* Clickable overlay - Right half for App Store */}
        <Link
          href="https://apps.apple.com/app/id1446445105"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-0 right-0 w-1/2 h-full hover:opacity-0 hover:bg-white/10 transition-all"
          aria-label="Download on App Store"
        />
      </div>
    </div>
  );
}
