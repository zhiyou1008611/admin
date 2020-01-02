import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import home from '@/pages/home'
import TinymceEditor from '@/pages/tinymcs-editor'
import statistics from '@/pages/statistics'
import videoList from '@/pages/videoList'
import userInfo from '@/pages/userInfo'
import inStationManage from '@/pages/inStationManage'
import delvideoList from '@/pages/delvideoList'
import addvideo from '@/pages/addvideo'
import addup from '@/pages/addup'



import login from '@/pages/user/login'
// import regist from '@/pages/user/regist'

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    name: 'home',
    component: home,
    meta: {
      requiresAuth: true
    },
    children: [{
      path: '/home/userInfo',
      name: 'userInfo',
      component: userInfo,
      meta: {
        title: '用户信息',
        requiresAuth: true
      },
    }, {
      path: '/home/statistics',
      name: 'statistics',
      component: statistics,
      meta: {
        title: '首页',
        requiresAuth: true
      },
    }, {
      path: '/home/videoList',
      name: 'videoList',
      component: videoList,
      meta: {
        title: '视频列表',
        requiresAuth: true
      },
    }, {
      path: '/home/TinymceEditor',
      name: 'TinymceEditor',
      component: TinymceEditor,
      meta: {
        title: '首页',
        requiresAuth: true
      },
    }, {
      path: '/home/inStationManage',
      name: 'inStationManage',
      component: inStationManage,
      meta: {
        title: '站内管理',
        requiresAuth: true
      },
    }, {
      path: '/home/delvideoList',
      name: 'delvideoList',
      component: delvideoList,
      meta: {
        title: '已删除视频',
        requiresAuth: true
      },
    }, {
      path: '/home/addvideo',
      name: 'addvideo',
      component: addvideo,
      meta: {
        title: '上传视频',
        requiresAuth: true
      },
    }, {
      path: '/home/addup',
      name: 'addup',
      component: addup,
      meta: {
        title: '添加Up主',
        requiresAuth: true
      },
    }]
  }, {
    path: '/login',
    name: 'login',
    component: login,
    meta: {
      title: '登录',
    },
  }, ]
});
//    path: '/newView/:id',

// //注册全局钩子用来拦截导航
// router.beforeEach((to, from, next) => {
//   //获取store里面的token
//   let token = store.state.token;
//   //判断要去的路由有没有requiresAuth
//   if (to.meta.requiresAuth) {
//     if (token) {
//       next();
//     } else {
//       next({
//         path: '/login',
//       });
//     }
//   } else {
//     next(); //如果无需token,那么随它去吧
//   }
// });
export default router;
