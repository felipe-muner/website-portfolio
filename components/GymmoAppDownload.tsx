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
      <Link
        href="https://www.gymmo.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:opacity-90 transition-opacity"
      >
        <Image
          src="/gymmo-app-download.png"
          alt="Download Gymmo App - Scan QR code for Google Play or App Store"
          width={1280}
          height={720}
          className="w-full h-auto rounded-lg"
        />
      </Link>
    </div>
  );
}
