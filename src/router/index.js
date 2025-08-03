import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Fullpage.vue';
import NotFound from '../views/404.vue';

// 使用懒加载提高性能
const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Dawnight-天气预报'
    }
  },
  // 添加常见重定向
  {
    path: '/',
    redirect: '/home'
  },
  // 404处理
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'Page Not Found'
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 添加滚动行为控制
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// 路由守卫 - 添加安全控制
router.beforeEach((to, from, next) => {
  // 在这里可以添加权限验证逻辑
  // 例如：
  // if (to.meta.requiresAuth && !isAuthenticated()) {
  //   next('/login');
  // } else {
  //   next();
  // }

  // 设置页面标题
  document.title = to.meta.title || 'Default Title';

  next();
});

// 错误处理
router.onError((error) => {
  console.error('路由错误:', error);
  // 可以在这里添加错误上报逻辑
});

export default router;
