/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, options) => {
    config.experiments.asyncWebAssembly = true;
    config.experiments.syncWebAssembly = true;
    return config;
  },
};

export default nextConfig;
