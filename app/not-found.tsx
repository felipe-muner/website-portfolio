import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-background-1 text-brand-gray-light">
      <div className="text-center">
        <h1 className="text-5xl font-oswald font-bold text-brand-orange mb-4">
          Page Not Found
        </h1>
        <p className="text-lg font-mulish text-brand-gray-medium mb-8">
          Sorry, the page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 text-brand-black font-mulish font-medium bg-brand-orange hover:bg-opacity-90 rounded-lg transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
