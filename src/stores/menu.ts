/**
 * 菜单状态管理
 * 管理侧边菜单和顶部菜单的配置、状态和相关操作
 */

import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type {
  MenuItem,
  MenuType,
  MenuState,
  MenuResponse,
  RouteSource,
  UserInfo
} from '@/types/auth'
import {
  filterMenus,
  findMenuByPath,
  findMenuByKey,
  getMenuParentKeys,
  generateBreadcrumb
} from '@/utils/auth'
import { useAuthStore } from './auth'

// 前端静态菜单配置
const STATIC_SIDE_MENUS: MenuItem[] = [
  {
    key: 'dashboard',
    path: '/dashboard',
    title: '仪表盘',
    icon: 'DashboardOutlined',
    permission: 'authenticated',
    menuType: 'side',
    order: 1
  },
  {
    key: 'components',
    title: '组件示例',
    icon: 'AppstoreOutlined',
    permission: 'authenticated',
    menuType: 'side',
    order: 2,
    children: [
      {
        key: 'components-table',
        path: '/components/table',
        title: '表格组件',
        icon: 'TableOutlined',
        permission: 'authenticated',
        menuType: 'side',
        order: 1
      },
      {
        key: 'components-form',
        path: '/components/form',
        title: '表单组件',
        icon: 'FormOutlined',
        permission: 'authenticated',
        menuType: 'side',
        order: 2
      },
      {
        key: 'components-charts',
        path: '/components/charts',
        title: '图表组件',
        icon: 'BarChartOutlined',
        permission: 'authenticated',
        menuType: 'side',
        order: 3
      }
    ]
  },
  {
    key: 'system',
    title: '系统管理',
    icon: 'SettingOutlined',
    permission: 'role_based',
    roles: ['admin', 'manager'],
    menuType: 'side',
    order: 3,
    children: [
      {
        key: 'system-users',
        path: '/system/users',
        title: '用户管理',
        icon: 'UserOutlined',
        permission: 'role_based',
        roles: ['admin'],
        permissions: ['user:read'],
        menuType: 'side',
        order: 1
      },
      {
        key: 'system-roles',
        path: '/system/roles',
        title: '角色管理',
        icon: 'TeamOutlined',
        permission: 'role_based',
        roles: ['admin'],
        permissions: ['role:read'],
        menuType: 'side',
        order: 2
      },
      {
        key: 'system-permissions',
        path: '/system/permissions',
        title: '权限管理',
        icon: 'SafetyOutlined',
        permission: 'role_based',
        roles: ['admin'],
        permissions: ['system:read'],
        menuType: 'side',
        order: 3
      }
    ]
  },
  {
    key: 'docs',
    path: '/docs',
    title: '文档',
    icon: 'BookOutlined',
    permission: 'public',
    menuType: 'side',
    order: 4
  }
]

const STATIC_HEAD_MENUS: MenuItem[] = [
  {
    key: 'home',
    path: '/dashboard',
    title: '首页',
    icon: 'HomeOutlined',
    permission: 'public',
    menuType: 'head',
    order: 1
  },
  {
    key: 'products',
    title: '产品',
    icon: 'AppstoreOutlined',
    permission: 'public',
    menuType: 'head',
    order: 2,
    children: [
      {
        key: 'products-list',
        path: '/products',
        title: '产品列表',
        permission: 'public',
        menuType: 'head',
        order: 1
      },
      {
        key: 'products-categories',
        path: '/products/categories',
        title: '产品分类',
        permission: 'authenticated',
        menuType: 'head',
        order: 2
      }
    ]
  },
  {
    key: 'about',
    path: '/about',
    title: '关于',
    icon: 'InfoCircleOutlined',
    permission: 'public',
    menuType: 'head',
    order: 3
  }
]

// 模拟后端菜单API
const mockMenuApi = {
  // 获取用户菜单
  async getUserMenus(userId: string, menuType?: MenuType): Promise<MenuResponse> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟根据用户角色返回不同的动态菜单
    const dynamicMenus: MenuItem[] = [
      {
        key: 'analytics',
        path: '/analytics',
        title: '数据分析',
        icon: 'LineChartOutlined',
        permission: 'role_based',
        roles: ['admin', 'manager'],
        permissions: ['analytics:read'],
        menuType: 'side',
        order: 5,
        source: 'backend'
      },
      {
        key: 'reports',
        title: '报表中心',
        icon: 'FileTextOutlined',
        permission: 'role_based',
        roles: ['admin', 'manager'],
        menuType: 'side',
        order: 6,
        source: 'backend',
        children: [
          {
            key: 'reports-sales',
            path: '/reports/sales',
            title: '销售报表',
            permission: 'role_based',
            permissions: ['report:read'],
            menuType: 'side',
            order: 1,
            source: 'backend'
          },
          {
            key: 'reports-financial',
            path: '/reports/financial',
            title: '财务报表',
            permission: 'role_based',
            roles: ['admin'],
            permissions: ['report:read', 'financial:read'],
            menuType: 'side',
            order: 2,
            source: 'backend'
          }
        ]
      }
    ]
    
    let menus = dynamicMenus
    if (menuType) {
      menus = menus.filter(menu => menu.menuType === menuType)
    }
    
    return {
      success: true,
      message: '获取菜单成功',
      data: menus
    }
  }
}

export const useMenuStore = defineStore('menu', () => {
  // ==================== 状态定义 ====================
  
  // 侧边菜单列表
  const sideMenus = ref<MenuItem[]>([])
  
  // 顶部菜单列表
  const headMenus = ref<MenuItem[]>([])
  
  // 当前激活的菜单key
  const activeMenuKey = ref<string>('')
  
  // 当前展开的菜单keys
  const openMenuKeys = ref<string[]>([])
  
  // 面包屑导航
  const breadcrumb = ref<MenuItem[]>([])
  
  // 菜单加载状态
  const loading = ref<boolean>(false)
  
  // 菜单折叠状态
  const collapsed = ref<boolean>(false)
  
  // 路由来源配置
  const routeSource = ref<RouteSource>('frontend')
  
  // ==================== 计算属性 ====================
  
  // 过滤后的侧边菜单（基于用户权限）
  const filteredSideMenus = computed<MenuItem[]>(() => {
    const authStore = useAuthStore()
    return filterMenus(sideMenus.value, authStore.user)
  })
  
  // 过滤后的顶部菜单（基于用户权限）
  const filteredHeadMenus = computed<MenuItem[]>(() => {
    const authStore = useAuthStore()
    return filterMenus(headMenus.value, authStore.user)
  })
  
  // 扁平化的侧边菜单
  const flatSideMenus = computed<MenuItem[]>(() => {
    const flatten = (menus: MenuItem[]): MenuItem[] => {
      const result: MenuItem[] = []
      menus.forEach(menu => {
        result.push(menu)
        if (menu.children && menu.children.length > 0) {
          result.push(...flatten(menu.children))
        }
      })
      return result
    }
    return flatten(filteredSideMenus.value)
  })
  
  // 扁平化的顶部菜单
  const flatHeadMenus = computed<MenuItem[]>(() => {
    const flatten = (menus: MenuItem[]): MenuItem[] => {
      const result: MenuItem[] = []
      menus.forEach(menu => {
        result.push(menu)
        if (menu.children && menu.children.length > 0) {
          result.push(...flatten(menu.children))
        }
      })
      return result
    }
    return flatten(filteredHeadMenus.value)
  })
  
  // 菜单状态
  const menuState = computed<MenuState>(() => ({
    sideMenus: filteredSideMenus.value,
    headMenus: filteredHeadMenus.value,
    activeMenuKey: activeMenuKey.value,
    openMenuKeys: openMenuKeys.value,
    breadcrumb: breadcrumb.value,
    collapsed: collapsed.value,
    loading: loading.value
  }))
  
  // ==================== 菜单操作方法 ====================
  
  /**
   * 初始化菜单
   */
  const initMenus = async (): Promise<void> => {
    loading.value = true
    
    try {
      // 设置静态菜单
      sideMenus.value = [...STATIC_SIDE_MENUS]
      headMenus.value = [...STATIC_HEAD_MENUS]
      
      // 如果配置为后端获取，则合并后端菜单
      if (routeSource.value === 'backend' || routeSource.value === 'mixed') {
        const authStore = useAuthStore()
        if (authStore.user) {
          await loadDynamicMenus(authStore.user.id)
        }
      }
      
      console.log('菜单初始化完成')
    } catch (error) {
      console.error('菜单初始化失败:', error)
    } finally {
      loading.value = false
    }
  }
  
  /**
   * 加载动态菜单
   */
  const loadDynamicMenus = async (userId: string): Promise<void> => {
    try {
      // 获取侧边菜单
      const sideMenuResponse = await mockMenuApi.getUserMenus(userId, 'side')
      if (sideMenuResponse.success) {
        if (routeSource.value === 'backend') {
          sideMenus.value = sideMenuResponse.data
        } else if (routeSource.value === 'mixed') {
          // 合并静态和动态菜单
          sideMenus.value = [...STATIC_SIDE_MENUS, ...sideMenuResponse.data]
            .sort((a, b) => (a.order || 0) - (b.order || 0))
        }
      }
      
      // 获取顶部菜单
      const headMenuResponse = await mockMenuApi.getUserMenus(userId, 'head')
      if (headMenuResponse.success) {
        if (routeSource.value === 'backend') {
          headMenus.value = headMenuResponse.data
        } else if (routeSource.value === 'mixed') {
          headMenus.value = [...STATIC_HEAD_MENUS, ...headMenuResponse.data]
            .sort((a, b) => (a.order || 0) - (b.order || 0))
        }
      }
      
      console.log('动态菜单加载完成')
    } catch (error) {
      console.error('动态菜单加载失败:', error)
    }
  }
  
  /**
   * 设置当前激活的菜单
   */
  const setActiveMenu = (path: string): void => {
    // 在侧边菜单中查找
    let menu = findMenuByPath(flatSideMenus.value, path)
    
    // 如果侧边菜单中没找到，在顶部菜单中查找
    if (!menu) {
      menu = findMenuByPath(flatHeadMenus.value, path)
    }
    
    if (menu) {
      activeMenuKey.value = menu.key
      
      // 更新展开的菜单keys
      const parentKeys = getMenuParentKeys(sideMenus.value, menu.key)
      openMenuKeys.value = [...new Set([...openMenuKeys.value, ...parentKeys])]
      
      // 生成面包屑
      breadcrumb.value = generateBreadcrumb(sideMenus.value, path)
    }
  }
  
  /**
   * 切换菜单展开状态
   */
  const toggleMenuOpen = (key: string): void => {
    const index = openMenuKeys.value.indexOf(key)
    if (index > -1) {
      openMenuKeys.value.splice(index, 1)
    } else {
      openMenuKeys.value.push(key)
    }
  }
  
  /**
   * 设置展开的菜单keys
   */
  const setOpenMenuKeys = (keys: string[]): void => {
    openMenuKeys.value = keys
  }
  
  /**
   * 切换菜单折叠状态
   */
  const toggleCollapsed = (): void => {
    collapsed.value = !collapsed.value
    
    // 折叠时清空展开的菜单
    if (collapsed.value) {
      openMenuKeys.value = []
    }
  }
  
  /**
   * 设置菜单折叠状态
   */
  const setCollapsed = (value: boolean): void => {
    collapsed.value = value
    
    if (value) {
      openMenuKeys.value = []
    }
  }
  
  /**
   * 设置路由来源
   */
  const setRouteSource = (source: RouteSource): void => {
    routeSource.value = source
  }
  
  /**
   * 根据key查找菜单
   */
  const findMenu = (key: string): MenuItem | null => {
    let menu = findMenuByKey(sideMenus.value, key)
    if (!menu) {
      menu = findMenuByKey(headMenus.value, key)
    }
    return menu
  }
  
  /**
   * 根据路径查找菜单
   */
  const findMenuByRoute = (path: string): MenuItem | null => {
    let menu = findMenuByPath(sideMenus.value, path)
    if (!menu) {
      menu = findMenuByPath(headMenus.value, path)
    }
    return menu
  }
  
  /**
   * 添加菜单项
   */
  const addMenuItem = (menu: MenuItem, parentKey?: string): void => {
    const targetMenus = menu.menuType === 'head' ? headMenus.value : sideMenus.value
    
    if (parentKey) {
      // 添加到父菜单的子菜单中
      const parentMenu = findMenuByKey(targetMenus, parentKey)
      if (parentMenu) {
        if (!parentMenu.children) {
          parentMenu.children = []
        }
        parentMenu.children.push(menu)
        parentMenu.children.sort((a, b) => (a.order || 0) - (b.order || 0))
      }
    } else {
      // 添加到根级菜单
      targetMenus.push(menu)
      targetMenus.sort((a, b) => (a.order || 0) - (b.order || 0))
    }
  }
  
  /**
   * 移除菜单项
   */
  const removeMenuItem = (key: string): void => {
    const removeFromMenus = (menus: MenuItem[]): boolean => {
      for (let i = 0; i < menus.length; i++) {
        if (menus[i].key === key) {
          menus.splice(i, 1)
          return true
        }
        if (menus[i].children && removeFromMenus(menus[i].children!)) {
          return true
        }
      }
      return false
    }
    
    removeFromMenus(sideMenus.value) || removeFromMenus(headMenus.value)
  }
  
  /**
   * 更新菜单项
   */
  const updateMenuItem = (key: string, updates: Partial<MenuItem>): void => {
    const updateInMenus = (menus: MenuItem[]): boolean => {
      for (const menu of menus) {
        if (menu.key === key) {
          Object.assign(menu, updates)
          return true
        }
        if (menu.children && updateInMenus(menu.children)) {
          return true
        }
      }
      return false
    }
    
    updateInMenus(sideMenus.value) || updateInMenus(headMenus.value)
  }
  
  /**
   * 重置菜单状态
   */
  const resetMenuState = (): void => {
    activeMenuKey.value = ''
    openMenuKeys.value = []
    breadcrumb.value = []
    collapsed.value = false
  }
  
  // ==================== 返回store接口 ====================
  
  return {
    // 状态
    sideMenus: readonly(sideMenus),
    headMenus: readonly(headMenus),
    activeMenuKey: readonly(activeMenuKey),
    openMenuKeys: readonly(openMenuKeys),
    breadcrumb: readonly(breadcrumb),
    loading: readonly(loading),
    collapsed: readonly(collapsed),
    routeSource: readonly(routeSource),
    
    // 计算属性
    filteredSideMenus,
    filteredHeadMenus,
    flatSideMenus,
    flatHeadMenus,
    menuState,
    
    // 方法
    initMenus,
    initializeMenus: initMenus, // 添加别名方法
    loadDynamicMenus,
    setActiveMenu,
    toggleMenuOpen,
    setOpenMenuKeys,
    toggleCollapsed,
    setCollapsed,
    setRouteSource,
    findMenu,
    findMenuByRoute,
    addMenuItem,
    removeMenuItem,
    updateMenuItem,
    resetMenuState
  }
})

// 导出类型
export type MenuStore = ReturnType<typeof useMenuStore>