
/**
 * !!! 注意: 这里的hash路由，在 umi 编译时会被统一添加上 ./config.ts 中的 hashPrefix 配置项
 */
export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/',
            redirect: '/dashboard',
          },
          {
            path: '/dashboard',
            name: 'Dashboard',
            icon: 'DashboardOutlined',
            component: './dashboard/workplace',
          },
          {
            path: '/list',
            icon: 'BorderlessTableOutlined',
            name: '列表',
            component: './list/table-list',
            keepAlive: true
            // routes: [
            //   {
            //     path: 'test',
            //     name:'列表二级测试',
            //     component:'./list/table-list/test'
            //   }
            // ]
          },
          {
            name: '404',
            icon: 'WarningOutlined',
            path: '/exception',
            component: './exception/404',
          },
          {
            path: '/docs',
            component: './docs/_layout',
            routes: [
              {
                'path': '/docs/a',
                'exact': true,
                'component': './docs/a'
              },
              {
                'path': '/docs',
                'exact': true,
                'component': './docs/index',
                keepAlive:true
              }
            ],
          }
        ],
      },
    ],
  },
];
