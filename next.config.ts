import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Real dive-gear product photos for the Blue Reef Dive Supply shop,
      // hotlinked from the partner store (WooCommerce media library).
      { protocol: "https", hostname: "www.aquamaster.net", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "aquamaster.net", pathname: "/wp-content/uploads/**" },
    ],
  },
};

export default nextConfig;
