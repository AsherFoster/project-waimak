module.exports = {
  publicPath: (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'beta') ? '/app/' : '',
  chainWebpack: config => {
    config.module
      .rule('graphql')
      .test(/\.graphql$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end();
  },
};
