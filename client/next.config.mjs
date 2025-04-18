/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com", // Allow Unsplash images
      "cdn.pixabay.com",     // Allow Pixabay images
      "ui-avatars.com",       // Allow UI Avatars
      "external-content.duckduckgo.com"   // Allow DuckDuckGo images
    ],
  },
};

export default nextConfig;
