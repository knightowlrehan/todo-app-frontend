import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: ".",
  },
  output: "export", // export static file for s3 bucket
};

export default nextConfig;
