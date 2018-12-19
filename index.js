// =============================================================================================================================
// NEXT TSC - INDEX
// =============================================================================================================================
module.exports = (nextConfig = {}) => {
  if (!nextConfig.pageExtensions) {
    nextConfig.pageExtensions = ["jsx", "js"];
  }

  if (!nextConfig.pageExtensions.includes("ts")) {
    nextConfig.pageExtensions.unshift("ts");
  }
  if (!nextConfig.pageExtensions.includes("tsx")) {
    nextConfig.pageExtensions.unshift("tsx");
  }

  return {
    ...nextConfig,
    webpack: (config, options) => {
      if (!options.defaultLoaders) {
        throw new Error("This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade");
      }

      const { dir, defaultLoaders, dev, isServer } = options;
      config.resolve.extensions.push(".ts", ".tsx");

      const typescriptFilesRegExp = /\.(ts|tsx)$/;

      const path = require("path");
      if (dev && !isServer) {
        config.module.rules.push({
          test: typescriptFilesRegExp,
          loader: "hot-self-accept-loader",
          include: [path.join(dir, "pages")],
          options: { extensions: typescriptFilesRegExp },
        });
      }

      config.module.rules.push({
        test: typescriptFilesRegExp,
        include: [dir],
        exclude: /node_modules/,
        use: [
          defaultLoaders.babel,
          {
            loader: "ts-loader",
            options: { transpileOnly: true, ...nextConfig.tsLoaderOptions },
          },
        ],
      });

      if (typeof nextConfig.webpack === "function") return nextConfig.webpack(config, options);

      return config;
    },
  };
};
