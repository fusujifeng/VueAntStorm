/**
 * 路由权限守卫
 * 实现路由访问控制、权限验证和动态路由注册
 */

import type { Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import type { DynamicRoute } from '@/types/auth'
import { PermissionLevel } from '@/types/auth'
import { useAuthStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/menu'
import { canAccessRoute, debugPermission } from '@/utils/auth'
import { message } from 'ant-design-vue'

// 白名单路由（无需权限验证）
const WHITE_LIST = [
  '/login',
  '/register',
  '/404',
  '/403',
  '/500',
  '/docs' // 文档页面公开访问
]

// 动态路由配置
const DYNAMIC_ROUTES: DynamicRoute[] = [
  {
    path: '/system',
    name: 'System',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: {
      title: '系统管理',
      permission: PermissionLevel.ROLE_BASED,
      roles: ['admin', 'manager'],
      requiresAuth: true
    },
    children: [
      {
        path: 'users',
        name: 'SystemUsers',
        component: () => import('@/views/auth/RoleManagement.vue'),
        meta: {
          title: '用户管理',
          permission: PermissionLevel.ROLE_BASED,
          roles: ['admin'],
          permissions: ['user:read'],
          requiresAuth: true
        }
      },
      {
        path: 'roles',
        name: 'SystemRoles',
        component: () => import('@/views/auth/RoleManagement.vue'),
        meta: {
          title: '角色管理',
          permission: PermissionLevel.ROLE_BASED,
          roles: ['admin'],
          permissions: ['role:read'],
          requiresAuth: true
        }
      },
      {
        path: 'permissions',
        name: 'SystemPermissions',
        component: () => import('@/views/auth/PermissionTest.vue'),
        meta: {
          title: '权限管理',
          permission: PermissionLevel.ROLE_BASED,
          roles: ['admin'],
          permissions: ['system:read'],
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('@/views/DashboardView.vue'),
    meta: {
      title: '数据分析',
      permission: PermissionLevel.ROLE_BASED,
      roles: ['admin', 'manager'],
      permissions: ['analytics:read'],
      requiresAuth: true
    }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: {
      title: '报表中心',
      permission: PermissionLevel.ROLE_BASED,
      roles: ['admin', 'manager'],
      requiresAuth: true
    },
    children: [
      {
        path: 'sales',
        name: 'ReportsSales',
        component: () => import('@/views/DashboardView.vue'),
        meta: {
          title: '销售报表',
          permission: PermissionLevel.ROLE_BASED,
          permissions: ['report:read'],
          requiresAuth: true
        }
      },
      {
        path: 'financial',
        name: 'ReportsFinancial',
        component: () => import('@/views/DashboardView.vue'),
        meta: {
          title: '财务报表',
          permission: PermissionLevel.ROLE_BASED,
          roles: ['admin'],
          permissions: ['report:read', 'financial:read'],
          requiresAuth: true
        }
      }
    ]
  }
]

/**
 * 检查路由是否在白名单中
 */
function isWhiteList(path: string): boolean {
  return WHITE_LIST.some(whitePath => {
    if (whitePath === path) return true
    // 支持通配符匹配
    if (whitePath.endsWith('*')) {
      const prefix = whitePath.slice(0, -1)
      return path.startsWith(prefix)
    }
    return false
  })
}

/**
 * 动态添加路由
 */
function addDynamicRoutes(router: Router, routes: DynamicRoute[]): void {
  routes.forEach(route => {
    try {
      router.addRoute(route)
      console.log(`动态路由已添加: ${route.path}`)
    } catch (error) {
      console.error(`添加动态路由失败: ${route.path}`, error)
    }
  })
}

/**
 * 过滤用户可访问的动态路由
 */
function filterAccessibleRoutes(routes: DynamicRoute[], authStore: any): DynamicRoute[] {
  return routes.filter(route => {
    const hasAccess = canAccessRoute(route, authStore.user)
    
    if (process.env.NODE_ENV === 'development') {
      debugPermission(
        authStore.user,
        route.meta?.permissions,
        route.meta?.roles
      )
    }
    
    return hasAccess
  }).map(route => {
    // 递归过滤子路由
    if (route.children && route.children.length > 0) {
      return {
        ...route,
        children: filterAccessibleRoutes(route.children, authStore)
      }
    }
    return route
  })
}

/**
 * 前置路由守卫
 */
export function createBeforeEachGuard(router: Router) {
  return async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore()
    const menuStore = useMenuStore()
    
    // 开发环境下打印路由信息
    if (process.env.NODE_ENV === 'development') {
      console.group('🚀 路由守卫')
      console.log('目标路由:', to.path)
      console.log('来源路由:', from.path)
      console.log('用户登录状态:', authStore.isLoggedIn)
      console.log('用户信息:', authStore.user)
      console.groupEnd()
    }
    
    // 1. 检查是否在白名单中
    if (isWhiteList(to.path)) {
      // 如果已登录用户访问登录页，重定向到首页
      if (to.path === '/login' && authStore.isLoggedIn) {
        next('/dashboard')
        return
      }
      next()
      return
    }
    
    // 2. 检查用户是否已登录
    if (!authStore.isLoggedIn) {
      // 未登录，重定向到登录页
      message.warning('请先登录')
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 保存目标路由，登录后跳转
      })
      return
    }
    
    // 3. 检查token是否过期
    if (authStore.isTokenExpired) {
      try {
        await authStore.refreshAuthToken()
      } catch (error) {
        console.error('Token刷新失败:', error)
        message.error('登录已过期，请重新登录')
        await authStore.logout()
        next('/login')
        return
      }
    }
    
    // 4. 检查路由权限
    const routeMeta = to.meta
    if (routeMeta) {
      const { permission, roles, permissions, requiresAuth } = routeMeta
      
      // 需要认证但用户未登录
      if (requiresAuth && !authStore.isLoggedIn) {
        next('/login')
        return
      }
      
      // 检查权限级别
      if (permission) {
        const hasAccess = authStore.checkAccess(
          permission as PermissionLevel,
          roles as any,
          permissions as string[]
        )
        
        if (!hasAccess) {
          message.error('您没有权限访问此页面')
          next('/403')
          return
        }
      }
    }
    
    // 5. 更新菜单状态
    menuStore.setActiveMenu(to.path)
    
    // 6. 设置页面标题
    if (to.meta?.title) {
      document.title = `${to.meta.title} - VueAntStorm`
    }
    
    next()
  }
}

/**
 * 后置路由守卫
 */
export function createAfterEachGuard() {
  return (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    // 路由切换完成后的处理
    
    // 滚动到页面顶部
    window.scrollTo(0, 0)
    
    // 关闭可能存在的loading状态
    const loadingElements = document.querySelectorAll('.ant-spin-spinning')
    loadingElements.forEach(el => {
      el.classList.remove('ant-spin-spinning')
    })
    
    // 开发环境下记录路由切换
    if (process.env.NODE_ENV === 'development') {
      console.log(`路由切换完成: ${from.path} -> ${to.path}`)
    }
  }
}

/**
 * 路由错误处理
 */
export function createRouterErrorHandler(router: Router) {
  router.onError((error) => {
    console.error('路由错误:', error)
    
    // 根据错误类型进行不同处理
    if (error.message.includes('Loading chunk')) {
      // 代码分割加载失败，通常是网络问题或版本更新
      message.error('页面加载失败，请刷新页面重试')
      window.location.reload()
    } else if (error.message.includes('Cannot resolve component')) {
      // 组件解析失败
      message.error('页面组件加载失败')
      router.push('/404')
    } else {
      // 其他错误
      message.error('页面访问出现错误')
    }
  })
}

/**
 * 初始化路由守卫
 */
export function setupRouterGuards(router: Router): void {
  // 注册前置守卫
  router.beforeEach(createBeforeEachGuard(router))
  
  // 注册后置守卫
  router.afterEach(createAfterEachGuard())
  
  // 注册错误处理
  createRouterErrorHandler(router)
  
  console.log('路由守卫初始化完成')
}

/**
 * 动态注册路由
 */
export async function registerDynamicRoutes(router: Router): Promise<void> {
  const authStore = useAuthStore()
  
  // 如果用户已登录，注册动态路由
  if (authStore.isLoggedIn && authStore.user) {
    try {
      // 过滤用户可访问的路由
      const accessibleRoutes = filterAccessibleRoutes(DYNAMIC_ROUTES, authStore)
      
      // 添加到路由器
      addDynamicRoutes(router, accessibleRoutes)
      
      console.log('动态路由注册完成')
    } catch (error) {
      console.error('动态路由注册失败:', error)
    }
  }
}

/**
 * 清除动态路由
 */
export function clearDynamicRoutes(router: Router): void {
  // 获取所有路由
  const routes = router.getRoutes()
  
  // 移除动态添加的路由
  DYNAMIC_ROUTES.forEach(route => {
    if (router.hasRoute(route.name!)) {
      router.removeRoute(route.name!)
      console.log(`动态路由已移除: ${route.path}`)
    }
  })
  
  console.log('动态路由清除完成')
}

/**
 * 重新加载动态路由
 */
export async function reloadDynamicRoutes(router: Router): Promise<void> {
  // 先清除现有动态路由
  clearDynamicRoutes(router)
  
  // 重新注册动态路由
  await registerDynamicRoutes(router)
}

/**
 * 检查路由是否存在
 */
export function hasRoute(router: Router, name: string): boolean {
  return router.hasRoute(name)
}

/**
 * 获取用户可访问的路由列表
 */
export function getAccessibleRoutes(authStore: any): DynamicRoute[] {
  return filterAccessibleRoutes(DYNAMIC_ROUTES, authStore)
}

// 导出动态路由配置供其他模块使用
export { DYNAMIC_ROUTES, WHITE_LIST }