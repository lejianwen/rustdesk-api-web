import { createRouter, createWebHashHistory } from 'vue-router'

const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    meta: { title: '登录' },
    component: () => import('@/views/login/login.vue'),
  },

  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    hidden: true,
  },
  {
    path: '/oauth/:code',
    component: () => import('@/views/oauth/login.vue'),
    hidden: true,
  },
  {
    path: '/oauth/bind/:code',
    component: () => import('@/views/oauth/bind.vue'),
    hidden: true,
  },
]
export const asyncRoutes = [
  // {
  //   path: '/',
  //   name: 'Index',
  //   redirect: '/Home',
  //   meta: { title: '首页', icon: 'house' },
  //   component: () => import('@/layout/index.vue'),
  //   children: [
  //     {
  //       path: '/Home',
  //       name: 'Home',
  //       meta: { title: '首页', icon: 'house' },
  //       component: () => import('@/views/index/index.vue'),
  //     },
  //
  //   ],
  // },
  {
    path: '/my',
    name: 'My',
    redirect: '/my/info',
    meta: { title: '我的', icon: 'UserFilled' },
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/',
        name: 'MyInfo',
        meta: { title: '个人信息', icon: 'User' /*keepAlive: true*/ },
        component: () => import('@/views/my/info.vue'),
      },
      {
        path: 'address_book',
        name: 'MyAddressBookList',
        meta: { title: '地址簿管理', icon: 'Notebook' /*keepAlive: true*/ },
        component: () => import('@/views/my/address_book/index.vue'),
      },
      {
        path: 'tag',
        name: 'MyTagList',
        meta: { title: '标签管理', icon: 'CollectionTag' /*keepAlive: true*/ },
        component: () => import('@/views/my/tag/index.vue'),
      },
    ],
  },
  {
    path: '/user',
    name: 'User',
    redirect: '/user/index',
    meta: { title: '系统', icon: 'Setting' },
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: 'peer',
        name: 'Peer',
        meta: { title: '设备管理', icon: 'Monitor' /*keepAlive: true*/ },
        component: () => import('@/views/peer/index.vue'),
      },
      {
        path: 'group',
        name: 'UserGroup',
        meta: { title: '群组管理', icon: 'ChatRound' /*keepAlive: true*/ },
        component: () => import('@/views/group/index.vue'),
      },
      {
        path: 'index',
        name: 'UserList',
        meta: { title: '用户列表', icon: 'User' /*keepAlive: true*/ },
        component: () => import('@/views/user/index.vue'),
      },
      {
        path: 'add',
        name: 'UserAdd',
        meta: { title: '用户添加', hide: true },
        component: () => import('@/views/user/edit.vue'),
      },
      {
        path: 'edit/:id',
        name: 'UserEdit',
        meta: { title: '用户编辑', hide: true },
        component: () => import('@/views/user/edit.vue'),
      },

      {
        path: 'addressBook',
        name: 'UserAddressBook',
        meta: { title: '地址簿管理', icon: 'Notebook' /*keepAlive: true*/ },
        component: () => import('@/views/address_book/index.vue'),
      },
      {
        path: 'tag',
        name: 'UserTag',
        meta: { title: '标签管理', icon: 'CollectionTag' /*keepAlive: true*/ },
        component: () => import('@/views/tag/index.vue'),
      },
      {
        path: '/oauth',
        name: 'Oauth',
        meta: { title: 'Oauth管理', icon: 'Link' /*keepAlive: true*/ },
        component: () => import('@/views/oauth/index.vue'),
      },
      {
        path: '/loginLog',
        name: 'LoginLog',
        meta: { title: '登录日志', icon: 'List' /*keepAlive: true*/ },
        component: () => import('@/views/login/log.vue'),
      },
    ],
  },
]
export const lastRoutes = [
  { path: '/:catchAll(.*)', redirect: '/404', meta: { hide: true } },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
})

