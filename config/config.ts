// https://umijs.org/config/
import path from 'path';
import { defineConfig } from '@oula/oula';
import proxy from './proxy';
import routes from './routes';
import theme from './theme';
import BaseSettings from './BaseSettings';

function resolve(dir: string) {
  console.log(path.join(__dirname, '..', dir));
  return path.join(__dirname, '..', dir);
}

const { REACT_APP_ENV } = process.env;
export default defineConfig({
  bundlerConfig: {
    output: {
      filenameHash: true,
      //生产环境下publicPath
      assetPrefix: `/${BaseSettings.appName}/`
    },
    dev: {
      //测试环境下publicPath
      assetPrefix: `/${BaseSettings.appName}/`
    },
    tools: {
      less: {
        lessOptions: {
          modifyVars: theme,
        },
      },
    },
    source: {
      alias: {
        '@config': resolve('config'),
      },
      transformImport: [
        {
          libraryName: '@ht/sprite-ui',
          libraryDirectory: 'es',
          style: true,
        },
      ],
    },
    html: {
      title: '华泰证券',
    },
    performance: {
      removeMomentLocale: true,
    },
    server: {
      proxy: proxy[REACT_APP_ENV || 'dev'],
    },
  },
  dva: {
    hmr: true,
  },
  history: {
    type: 'hash',
  },
  locale: {
    default: 'zh-CN',
    antd: false,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  // 为 hash 路由添加统一前缀，最终格式为 `${hashPrefix}${route.path}`
  // plugins: ['@ht/umi-plugin-hashprefix'],
  // hashPrefix: `/${BaseSettings.appName}`,
  routes,
  // 埋点配置，需先在数据中台接入项目，获取 productName 和 productId
  xlog: {
    appName: 'appName', // 添加对应应用名称，方便定位
    initOption: {
      // xlog的初始化参数
      submitType: 'myTrack',
      from: 'appName', // 添加对应应用名称，方便定位
      types: [
        'consoleMehods',
        'windowError',
        'unhandledrejection',
        'performance',
      ], // 'performance' 性能监控
      routeConfig: {
        routeType: 'hash', // 路由类型'hash' | 'history'，默认为hash
        dynamicRoutes: [], // 动态路由集合，例：/home/:id/detail，当页面url匹配到该路由时，xlog上报的页面path将是动态路由('/home/:id/detail')
        redirectRoute: {}, // 重定向的路由配置，例：{ '/' : '/home/index' }代表首页'/'被重定向到'/home/index'，当页面url匹配到'/'，xlog上报的页面path将是'/home/index'
      },
      consoleMethods: ['error', 'warn', 'info'],
      myTrackConfig: {
        product_id: '286', // 数字中台申请
        product_name: 'product_name', // 数字中台申请
        getEnv: () =>
          window.location.host === 'eip.htsc.com.cn'
            ? 'prd_outer'
            : 'prd_inner_test',
      },
    },
  },
});
