/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  // Let phones/tablets on the LAN load dev resources (HMR, chunks).
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  experimental: {
    agentUpgrade: "security",
  },
};

export default config;
