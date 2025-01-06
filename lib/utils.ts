import { clsx, type ClassValue } from "clsx"
import { Metadata } from "next"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface GetMetadataProps {
  routeName: string
}

export function getMetadata({ routeName }: GetMetadataProps): Metadata {
  const siteName = "Gym";
  const baseUrl = "https://gym-kappa-pied.vercel.app/"

  return {
    title: `${siteName} - ${routeName}`,
    description: "Empower your fitness journey with Gym.",
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: `${siteName} - ${routeName}`,
      description: "Empower your fitness journey with Gym.",
      url: `${baseUrl}/${routeName.toLowerCase().replace(/\s/g, "-")}`,
      siteName,
      images: [
        {
          url: `${baseUrl}/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: `${siteName} - ${routeName}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} - ${routeName}`,
      description: "Empower your fitness journey with Gym.",
      images: [`${baseUrl}/twitter-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-snippet": -1,
        "max-video-preview": -1,
        "max-image-preview": "large",
      },
    },
    icons: {
      icon: `${baseUrl}/favicon.ico`,
      shortcut: `${baseUrl}/favicon.ico`,
      apple: `${baseUrl}/apple-touch-icon.png`,
    },
    alternates: {
      canonical: `${baseUrl}/${routeName.toLowerCase().replace(/\s/g, "-")}`,
      languages: {
        "en-US": `${baseUrl}/en-us/${routeName.toLowerCase().replace(/\s/g, "-")}`,
      },
    },
  };
}