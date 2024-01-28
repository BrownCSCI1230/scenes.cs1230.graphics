const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = async (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const commonConfig = {};

  /**
   * @type {import('next').NextConfig}
   */
  const devConfig = {};

  /**
   * @type {import('next').NextConfig}
   */
  const prodConfig = { output: "export", distDir: "out" };

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return { ...defaultConfig, ...commonConfig, ...devConfig };
  }
  return { ...defaultConfig, ...commonConfig, ...prodConfig };
};
