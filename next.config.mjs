/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'example.com',
      'images.unsplash.com',
      'via.placeholder.com',
      'localhost',
    ],
  },
  // Enable proper handling of external URLs for images
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:5000']
    }
  }
};

export default nextConfig;
