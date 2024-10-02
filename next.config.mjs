const isProd = process.env.NODE_ENV === 'production';
const repository = 'professional-portfolio';

const nextConfig = {
  assetPrefix: isProd ? `/${repository}/` : '',
  basePath: isProd ? `/${repository}` : '',
  trailingSlash: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;