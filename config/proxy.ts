/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/api/': {
      // 使用goapi 进行接口数据定义mock
      // http://goapi.htsc/goapi/web/#/home/project/api?projectId=10002065&moduleid=129331
      target: 'http://mock.htsc/goapi/WEBFE/',
      changeOrigin: true,
    },
  }
};
