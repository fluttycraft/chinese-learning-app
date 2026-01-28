const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  manifest: "/manifest.webmanifest",
  sw: "/service-worker.js",
});

const nextConfig = withPWA({
  // ...other next.js config options
  turbopack: {},
});

export default nextConfig;
