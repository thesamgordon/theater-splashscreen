import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

module.exports = {
  allowedDevOrigins: ["*.local", "*.lan"],
};

export default nextConfig;
