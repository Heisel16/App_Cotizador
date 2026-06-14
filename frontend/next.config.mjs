/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.BUILD_TARGET === 'capacitor' ? { output: 'export' } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;