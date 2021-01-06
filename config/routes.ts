export default [
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
    name: 'TSP',
    icon: 'nodeIndex',
    path: '/TSP',
    component: './TSP',
  },
  {
    name: 'VRP',
    icon: 'nodeIndex',
    path: '/VRP',
    component: './TSP',
  },
  {
    component: './404',
  },
];
