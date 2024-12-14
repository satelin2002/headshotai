import { config } from "process";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "res.cloudinary.com",
      "qup-app-secure-uploads-bucket.s3.amazonaws.com",
    ],
  },
};

export default nextConfig;
