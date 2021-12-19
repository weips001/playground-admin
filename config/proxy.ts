/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/api': {
      target: 'http://39.99.228.79:7006',
      // target: 'http://127.0.0.1:7006',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/aaa': {
      target: 'http://39.99.228.79:7777',
      // target: 'http://127.0.0.1:7006',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  // test: {
  //   '/api/': {
  //     target: 'https://preview.pro.ant.design',
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  // },
  // pre: {
  //   '/api/': {
  //     target: 'your pre url',
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  // },
};
