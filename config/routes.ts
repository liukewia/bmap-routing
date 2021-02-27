export default [
  // https://github.com/ant-design/ant-design-pro/issues/8009
  
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
    ],
  },
  {
    path: '/welcome',
    name: '欢迎',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    name: '单车辆路径问题（TSP）',
    icon: 'nodeIndex',
    path: '/TSP',
    component: './VRP',
  },
  {
    name: '多车辆路径问题（VRP）',
    icon: 'nodeIndex',
    path: '/VRP',
    component: './VRP',
  },
  {
    component: './404',
  },
];
