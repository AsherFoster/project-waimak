module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/app/' : '',
  chainWebpack: config => {
    config.module
      .rule('graphql')
      .test(/\.graphql$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end();
  },
};
