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
                redirect: '/analysis',
              },
              // {
              //   path: '/welcome',
              //   name: '欢迎登录',
              //   icon: 'smile',
              //   authority: 'welcome',
              //   component: './Welcome',
              // },
              {
                path: '/analysis',
                name: '数据分析',
                icon: 'smile',
                // authority: 'welcome',
                component: './Analysis',
              },
              {
                name: '今日收入',
                icon: 'table',
                path: '/finance',
                // authority: 'consume',
                component: './Finance',
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
                name: '淘气包会员',
                icon: 'table',
                path: '/vip',
                // authority: 'consume',
                component: './Vip',
              },
              {
                name: '淘气包充值记录',
                icon: 'table',
                path: '/pay-record',
                // authority: 'consume',
                component: './PayRecord',
              },
              {
                name: '淘气包消费记录',
                icon: 'table',
                path: '/consume-record',
                // authority: 'consume',
                component: './ConsumeRecord',
              },
              {
                name: '游戏币会员',
                icon: 'table',
                path: '/game-vip',
                // authority: 'consume',
                component: './GameVip',
              },
              {
                name: '游戏币充值记录',
                icon: 'table',
                path: '/gamebi-record',
                // authority: 'consume',
                component: './GameVipRecord',
              },
              {
                name: '游戏币消费记录',
                icon: 'table',
                path: '/gamebiconsume-record',
                // authority: 'consume',
                component: './GameConsumeRecord',
              },
              {
                name: '短信通知',
                icon: 'table',
                path: '/messageRecord',
                // authority: 'consume',
                component: './MessageRecord',
              },
              {
                name: '短信通知(老会员)',
                icon: 'table',
                path: '/notice',
                // authority: 'consume',
                component: './Notice',
              },
              {
                name: '异常会员',
                icon: 'table',
                path: '/falseVip',
                // authority: 'consume',
                component: './FalseVip',
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
              {
                name: '人员管理',
                icon: 'table',
                path: '/user-list',
                // authority: 'user',
                component: './User/list',
              },
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
