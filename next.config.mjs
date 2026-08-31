// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sin output: 'standalone': en Vercel rompe el build con Next 16/Turbopack
  // (busca .next/next-server.js.nft.json). Reañadir solo para self-hosting.
  allowedDevOrigins: ['127.0.0.1'],
};

export default nextConfig;
