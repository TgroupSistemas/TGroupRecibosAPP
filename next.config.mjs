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
        // canvas es opcional para pdfjs y no se instala en Node nuevo
        config.resolve.alias.canvas = false;
        return config;
  },
};

export default nextConfig;
