/** @type {import('next').NextConfig} */
const nextConfig = {
    env: { },
    images: {
        domains: ["storage.googleapis.com"],
      },
      webpack: (config) => {
        config.module.rules.push({
          test: /\.node/,
          use: "raw-loader",
        });
        return config;
  },
};

export default nextConfig;
