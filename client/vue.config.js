module.exports = {
  devServer: {
    port: 3000,
  },
  chainWebpack: (config) => {
    // vue-svg-loader configuration
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    svgRule
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  },
};
