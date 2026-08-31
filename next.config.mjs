// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['127.0.0.1'],
  // Quita o comenta la sección de images para usar los valores por defecto optimizados
  // images: {
  //   unoptimized: true,
  // },
};

export default nextConfig;
