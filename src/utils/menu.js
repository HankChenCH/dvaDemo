import * as env from './env'

module.exports = [
  {
    id: 1,
    name: '首页',
    icon: 'home',
    auth: env.dashboard,
    router: '/dashboard',
  },
  {
    id: 5,
    bpid: 1,
    name: '分类管理',
    icon: 'bars',
    auth: env.categoryList,
    router: '/category',
  },
  {
    id: 4,
    bpid: 1,
    name: '主题管理',
    icon: 'shop',
    auth: env.themeList,
    router: '/theme',
  },
  {
    id: 3,
    bpid: 1,
    name: '商品管理',
    auth: env.productList,
    icon: 'barcode',
    router: '/product',
  },
  {
    id: 31,
    mpid: -1,
    bpid: 3,
    name: '商品详情',
    auth: env.productDetail,
    router: '/product/:id',
  },
  {
    id: 8,
    bpid: 1,
    name: '快递管理',
    auth: env.expressList,
    icon: 'car',
    router: '/express',
  },
  {
    id: 7,
    bpid: 1,
    name: '订单管理',
    auth: env.orderList,
    icon: 'shopping-cart',
    router: '/order',
  },
  {
    id: 71,
    mpid: -1,
    bpid: 7,
    name: '订单详情',
    auth: env.orderDetail,
    router: '/order/:id',
  },
  {
    id: 2,
    bpid: 1,
    name: '客户管理',
    auth: env.userList,
    icon: 'user',
    router: '/user',
  },
  {
    id: 21,
    mpid: -1,
    bpid: 2,
    name: '客户详情',
    auth: env.userDetail,
    router: '/user/:id',
  },
  {
    id: 6,
    bpid: 1,
    name: '系统管理',
    auth: env.systemList,
    icon: 'setting',
  },
  {
    id: 61,
    bpid: 6,
    mpid: 6,
    name: '菜单管理',
    auth: env.menuList,
    router: '/setting/menu',
  },
  {
    id: 62,
    bpid: 6,
    mpid: 6,
    name: '管理员管理',
    auth: env.adminList,
    router: '/setting/admin',
  },
  {
    id: 63,
    bpid: 6,
    mpid: 6,
    name: '群组管理',
    auth: env.groupList,
    router: '/setting/group',
  },
  {
    id: 64,
    bpid: 6,
    mpid: 6,
    name: '权限管理',
    auth: env.permissionList,
  },
  {
    id: 641,
    bpid: 64,
    mpid: 64,
    name: '角色管理',
    auth: env.roleList,
    router: '/setting/permission/role',
  },
  {
    id: 642,
    bpid: 64,
    mpid: 64,
    name: '资源管理',
    auth: env.resourceList,
    router: '/setting/permission/resource',
  },
  {
    id: 9,
    bpid: 1,
    mpid: -1,
    name: '客服中心',
    auth: env.customerService,
    router: 'https://mpkf.weixin.qq.com/',
  },
  {
    id: 10,
    bpid: 1,
    mpid: -1,
    name: '个人中心',
    auth: env.personalCenter,
    router: '/setting/personal',
  },
]
