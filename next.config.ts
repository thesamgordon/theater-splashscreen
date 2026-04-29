import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

module.exports = {
  allowedDevOrigins: ["192.168.86.22", "172.16.217.27", "192.168.1.220"],
};

export default nextConfig;
