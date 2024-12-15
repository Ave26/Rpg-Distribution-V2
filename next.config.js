/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "unsplash.com",
      "cdn.pixabay.com",
      "www.pexels.com, pixabay.com",
      "res.cloudinary.com",
    ],
  },
};

module.exports = nextConfig;
