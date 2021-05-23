export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            routes: [
              {
                path: '/',
                redirect: '/welcome',
              },
              {
                path: '/welcome',
                name: '欢迎登录',
                icon: 'smile',
                authority: 'welcome',
                component: './Welcome',
              },
              // {
              //   path: '/admin',
              //   name: 'admin',
              //   icon: 'crown',
              //   component: './Admin',
              //   routes: [
              //     {
              //       path: '/admin/sub-page',
              //       name: 'sub-page',
              //       icon: 'smile',
              //       component: './Welcome',
              //     },
              //   ],
              // },
              // {
              //   name: '公司管理',
              //   icon: 'table',
              //   path: '/company',
              //   authority: 'company',
              //   component: './Company',
              // },
              // // {
              // //   name: 'list.table-list',
              // //   icon: 'table',
              // //   path: '/list',
              // //   component: './TableList',
              // // },
              // {
              //   name: '畅玩消费',
              //   icon: 'table',
              //   path: '/consume',
              //   // authority: 'consume',
              //   component: './Consume',
              // },
              {
                name: '会员列表',
                icon: 'table',
                path: '/vip',
                // authority: 'consume',
                component: './Vip',
              },
              {
                name: '充值记录',
                icon: 'table',
                path: '/pay-record',
                // authority: 'consume',
                component: './PayRecord',
              },
              {
                name: '消费记录',
                icon: 'table',
                path: '/consume-record',
                // authority: 'consume',
                component: './ConsumeRecord',
              },
              // {
              //   name: '付款申请单',
              //   icon: 'table',
              //   path: '/payment-order',
              //   authority: 'paymentOrder',
              //   component: './PaymentOrder/list',
              // },
              // {
              //   name: '付款申请单',
              //   icon: 'table',
              //   path: '/payment-order',
              //   component: './PaymentOrder',
              //   hideInMenu: true,
              //   routes: [
              //     {
              //       path: '/payment-order/create',
              //       name: '创建',
              //       icon: 'smile',
              //       hideInMenu: true,
              //       component: './PaymentOrder/order/create',
              //     },
              //     {
              //       path: '/payment-order/update/:id',
              //       name: '编辑',
              //       icon: 'smile',
              //       hideInMenu: true,
              //       component: './PaymentOrder/order/update',
              //     }
              //   ]
              // },
              // {
              //   name: '发票管理',
              //   icon: 'table',
              //   path: '/bill',
              //   authority: 'bill',
              //   component: './Bill',
              // },
              // {
              //   name: '人员管理',
              //   icon: 'table',
              //   path: '/user-list',
              //   authority: 'user',
              //   component: './User/list',
              // },
              // {
              //   name: '角色管理',
              //   icon: 'table',
              //   path: '/role',
              //   authority: 'role',
              //   component: './Role',
              // },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
