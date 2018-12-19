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
      const typescriptFilesRegExp = /\.(ts|tsx)$/;
      config.resolve.extensions.push(".ts", ".tsx");

      // Next.js will automatically apply hot-self-accept-loader for all extensions in `pageExtensions` .
      if (!defaultLoaders.hotSelfAccept) {
        if (dev && !isServer) {
          const path = require("path");

          config.module.rules.push({
            test: /\.(ts|tsx)$/,
            loader: "hot-self-accept-loader",
            include: [path.join(dir, "pages")],
            options: { extensions: /\.(ts|tsx)$/ },
          });
        }
      }

      config.module.rules.push({
        test: typescriptFilesRegExp,
        include: [dir],
        exclude: /node_modules/,
        use: [
          defaultLoaders.babel,
          {
            loader: "ts-loader",
            options: { ...nextConfig.tsLoaderOptions, transpileOnly: false },
          },
        ],
      });

      if (typeof nextConfig.webpack === "function") return nextConfig.webpack(config, options);

      return config;
    },
  };
};
