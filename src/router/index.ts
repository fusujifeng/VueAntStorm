import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { PermissionLevel } from '@/types/auth'
import { setupRouterGuards, registerDynamicRoutes } from './guards'

// 基础静态路由配置
const routes: RouteRecordRaw[] = [
  // 认证相关路由
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: {
      title: '用户登录',
      permission: PermissionLevel.PUBLIC,
      requiresAuth: false
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/RegisterView.vue'),
    meta: {
      title: '用户注册',
      permission: PermissionLevel.PUBLIC,
      requiresAuth: false
    }
  },
  
  // 错误页面路由
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('../views/error/ForbiddenView.vue'),
    meta: {
      title: '访问被拒绝',
      permission: PermissionLevel.PUBLIC,
      requiresAuth: false
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      title: '页面未找到',
      permission: PermissionLevel.PUBLIC,
      requiresAuth: false
    }
  },
  {
    path: '/500',
    name: 'ServerError',
    component: () => import('../views/error/ServerErrorView.vue'),
    meta: {
      title: '服务器错误',
      permission: PermissionLevel.PUBLIC,
      requiresAuth: false
    }
  },
  
  // 主应用路由
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    meta: {
      permission: PermissionLevel.AUTHENTICATED,
      requiresAuth: true
    },
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/DashboardView.vue'),
        meta: {
          title: '仪表盘',
          permission: PermissionLevel.AUTHENTICATED,
          requiresAuth: true
        }
      },
      {
        path: 'components/table',
        name: 'TableComponent',
        component: () => import('../views/components/TableView.vue'),
        meta: {
          title: '表格组件',
          permission: PermissionLevel.AUTHENTICATED,
          requiresAuth: true
        }
      },
      {
        path: 'components/form',
        name: 'FormComponent',
        component: () => import('../views/components/FormView.vue'),
        meta: {
          title: '表单组件',
          permission: PermissionLevel.AUTHENTICATED,
          requiresAuth: true
        }
      },
      {
        path: 'components/charts',
        name: 'ChartsComponent',
        component: () => import('../views/components/ChartsView.vue'),
        meta: {
          title: '图表组件',
          permission: PermissionLevel.AUTHENTICATED,
          requiresAuth: true
        }
      },
      {
        path: 'docs',
        name: 'Docs',
        component: () => import('../views/DocsView.vue'),
        meta: {
          title: '组件文档',
          permission: PermissionLevel.PUBLIC,
          requiresAuth: false
        }
      },
      // 权限管理相关路由
      {
        path: 'system/roles',
        name: 'RoleManagement',
        component: () => import('../views/auth/RoleManagement.vue'),
        meta: {
          title: '角色管理',
          permission: PermissionLevel.ROLE_BASED, // 将 ADMIN 改为 ROLE_BASED
          requiresAuth: true
        }
      },
      {
        path: 'auth/permission-test',
        name: 'PermissionTest',
        component: () => import('../views/auth/PermissionTest.vue'),
        meta: {
          title: '权限测试',
          permission: PermissionLevel.AUTHENTICATED,
          requiresAuth: true
        }
      }
    ]
  },
  
  // 通配符路由，必须放在最后
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 路由配置选项
  scrollBehavior(to, from, savedPosition) {
    // 路由切换时的滚动行为
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 初始化路由守卫
setupRouterGuards(router)

// 路由器准备就绪后注册动态路由
router.isReady().then(() => {
  registerDynamicRoutes(router)
})

export default router
export { registerDynamicRoutes, setupRouterGuards }
