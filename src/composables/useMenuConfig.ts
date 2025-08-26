/**
 * 菜单配置管理组合式函数
 * 提供菜单的动态配置、生成和管理功能
 */

import { ref, computed, watch, readonly } from 'vue'
import type {
  MenuItem,
  MenuType,
  RouteSource,
  UserInfo,
  PermissionLevel
} from '@/types/auth'
import {
  filterMenus,
  findMenuByPath,
  findMenuByKey,
  getMenuParentKeys,
  generateBreadcrumb
} from '@/utils/auth'
import { useAuthStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/menu'

// 菜单配置接口
interface MenuConfig {
  // 菜单来源
  source: RouteSource
  // 是否启用缓存
  enableCache: boolean
  // 缓存时间（分钟）
  cacheTime: number
  // 是否启用动态加载
  enableDynamicLoad: boolean
  // 菜单刷新间隔（分钟）
  refreshInterval: number
  // 是否显示图标
  showIcon: boolean
  // 是否显示徽章
  showBadge: boolean
  // 默认展开级别
  defaultOpenLevel: number
  // 是否启用搜索
  enableSearch: boolean
  // 搜索占位符
  searchPlaceholder: string
}

// 默认菜单配置
const DEFAULT_MENU_CONFIG: MenuConfig = {
  source: 'mixed',
  enableCache: true,
  cacheTime: 30,
  enableDynamicLoad: true,
  refreshInterval: 60,
  showIcon: true,
  showBadge: true,
  defaultOpenLevel: 1,
  enableSearch: true,
  searchPlaceholder: '搜索菜单...'
}

// 菜单缓存键
const MENU_CACHE_KEY = 'menu_cache'
const MENU_CONFIG_KEY = 'menu_config'

export function useMenuConfig() {
  const authStore = useAuthStore()
  const menuStore = useMenuStore()
  
  // 菜单配置
  const config = ref<MenuConfig>({ ...DEFAULT_MENU_CONFIG })
  
  // 菜单搜索关键词
  const searchKeyword = ref<string>('')
  
  // 菜单加载状态
  const loading = ref<boolean>(false)
  
  // 菜单缓存
  const menuCache = ref<Map<string, { data: MenuItem[]; timestamp: number }>>(new Map())
  
  // 定时器引用
  let refreshTimer: NodeJS.Timeout | null = null
  
  // ==================== 计算属性 ====================
  
  // 过滤后的侧边菜单
  const filteredSideMenus = computed(() => {
    let menus = menuStore.filteredSideMenus
    
    // 搜索过滤
    if (searchKeyword.value) {
      menus = searchMenus(menus, searchKeyword.value)
    }
    
    return menus
  })
  
  // 过滤后的顶部菜单
  const filteredHeadMenus = computed(() => {
    let menus = menuStore.filteredHeadMenus
    
    // 搜索过滤
    if (searchKeyword.value) {
      menus = searchMenus(menus, searchKeyword.value)
    }
    
    return menus
  })
  
  // 菜单统计信息
  const menuStats = computed(() => {
    const sideMenus = menuStore.filteredSideMenus
    const headMenus = menuStore.filteredHeadMenus
    
    const countMenus = (menus: MenuItem[]): { total: number; withChildren: number; leafNodes: number } => {
      let total = 0
      let withChildren = 0
      let leafNodes = 0
      
      const count = (items: MenuItem[]) => {
        items.forEach(item => {
          total++
          if (item.children && item.children.length > 0) {
            withChildren++
            count(item.children)
          } else {
            leafNodes++
          }
        })
      }
      
      count(menus)
      return { total, withChildren, leafNodes }
    }
    
    const sideStats = countMenus(sideMenus)
    const headStats = countMenus(headMenus)
    
    return {
      side: sideStats,
      head: headStats,
      total: {
        total: sideStats.total + headStats.total,
        withChildren: sideStats.withChildren + headStats.withChildren,
        leafNodes: sideStats.leafNodes + headStats.leafNodes
      }
    }
  })
  
  // ==================== 菜单搜索 ====================
  
  /**
   * 搜索菜单
   */
  const searchMenus = (menus: MenuItem[], keyword: string): MenuItem[] => {
    if (!keyword.trim()) return menus
    
    const searchTerm = keyword.toLowerCase()
    
    const filterMenu = (menu: MenuItem): MenuItem | null => {
      // 检查当前菜单是否匹配
      const titleMatch = menu.title.toLowerCase().includes(searchTerm)
      const pathMatch = menu.path?.toLowerCase().includes(searchTerm)
      const keyMatch = menu.key.toLowerCase().includes(searchTerm)
      
      // 递归检查子菜单
      let filteredChildren: MenuItem[] = []
      if (menu.children && menu.children.length > 0) {
        filteredChildren = menu.children
          .map(child => filterMenu(child))
          .filter(child => child !== null) as MenuItem[]
      }
      
      // 如果当前菜单匹配或有匹配的子菜单，则保留
      if (titleMatch || pathMatch || keyMatch || filteredChildren.length > 0) {
        return {
          ...menu,
          children: filteredChildren
        }
      }
      
      return null
    }
    
    return menus
      .map(menu => filterMenu(menu))
      .filter(menu => menu !== null) as MenuItem[]
  }
  
  /**
   * 清除搜索
   */
  const clearSearch = () => {
    searchKeyword.value = ''
  }
  
  // ==================== 菜单缓存管理 ====================
  
  /**
   * 获取缓存的菜单
   */
  const getCachedMenus = (cacheKey: string): MenuItem[] | null => {
    if (!config.value.enableCache) return null
    
    const cached = menuCache.value.get(cacheKey)
    if (!cached) return null
    
    const now = Date.now()
    const cacheExpiry = cached.timestamp + config.value.cacheTime * 60 * 1000
    
    if (now > cacheExpiry) {
      menuCache.value.delete(cacheKey)
      return null
    }
    
    return cached.data
  }
  
  /**
   * 缓存菜单
   */
  const setCachedMenus = (cacheKey: string, menus: MenuItem[]): void => {
    if (!config.value.enableCache) return
    
    menuCache.value.set(cacheKey, {
      data: menus,
      timestamp: Date.now()
    })
    
    // 持久化到localStorage
    try {
      const cacheData = Array.from(menuCache.value.entries())
      localStorage.setItem(MENU_CACHE_KEY, JSON.stringify(cacheData))
    } catch (error) {
      console.warn('菜单缓存保存失败:', error)
    }
  }
  
  /**
   * 清除菜单缓存
   */
  const clearMenuCache = (): void => {
    menuCache.value.clear()
    localStorage.removeItem(MENU_CACHE_KEY)
  }
  
  /**
   * 加载缓存
   */
  const loadMenuCache = (): void => {
    try {
      const cacheData = localStorage.getItem(MENU_CACHE_KEY)
      if (cacheData) {
        const entries = JSON.parse(cacheData)
        menuCache.value = new Map(entries)
      }
    } catch (error) {
      console.warn('菜单缓存加载失败:', error)
    }
  }
  
  // ==================== 菜单配置管理 ====================
  
  /**
   * 更新菜单配置
   */
  const updateConfig = (newConfig: Partial<MenuConfig>): void => {
    config.value = { ...config.value, ...newConfig }
    saveConfig()
    
    // 如果更改了来源，重新加载菜单
    if (newConfig.source) {
      menuStore.setRouteSource(newConfig.source)
      refreshMenus()
    }
    
    // 如果更改了刷新间隔，重新设置定时器
    if (newConfig.refreshInterval !== undefined) {
      setupRefreshTimer()
    }
  }
  
  /**
   * 重置配置为默认值
   */
  const resetConfig = (): void => {
    config.value = { ...DEFAULT_MENU_CONFIG }
    saveConfig()
    clearMenuCache()
    refreshMenus()
  }
  
  /**
   * 保存配置
   */
  const saveConfig = (): void => {
    try {
      localStorage.setItem(MENU_CONFIG_KEY, JSON.stringify(config.value))
    } catch (error) {
      console.warn('菜单配置保存失败:', error)
    }
  }
  
  /**
   * 加载配置
   */
  const loadConfig = (): void => {
    try {
      const savedConfig = localStorage.getItem(MENU_CONFIG_KEY)
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig)
        config.value = { ...DEFAULT_MENU_CONFIG, ...parsed }
      }
    } catch (error) {
      console.warn('菜单配置加载失败:', error)
    }
  }
  
  // ==================== 菜单刷新 ====================
  
  /**
   * 刷新菜单
   */
  const refreshMenus = async (): Promise<void> => {
    loading.value = true
    
    try {
      await menuStore.initMenus()
      
      // 如果启用了动态加载且用户已登录
      if (config.value.enableDynamicLoad && authStore.user) {
        await menuStore.loadDynamicMenus(authStore.user.id)
      }
      
      console.log('菜单刷新完成')
    } catch (error) {
      console.error('菜单刷新失败:', error)
    } finally {
      loading.value = false
    }
  }
  
  /**
   * 设置自动刷新定时器
   */
  const setupRefreshTimer = (): void => {
    // 清除现有定时器
    if (refreshTimer) {
      clearInterval(refreshTimer)
    }
    
    // 如果刷新间隔大于0，设置新定时器
    if (config.value.refreshInterval > 0) {
      refreshTimer = setInterval(() => {
        if (authStore.isLoggedIn) {
          refreshMenus()
        }
      }, config.value.refreshInterval * 60 * 1000)
    }
  }
  
  /**
   * 清除刷新定时器
   */
  const clearRefreshTimer = (): void => {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }
  
  // ==================== 菜单操作 ====================
  
  /**
   * 生成菜单树
   */
  const generateMenuTree = (menus: MenuItem[]): MenuItem[] => {
    // 按order排序
    const sortedMenus = [...menus].sort((a, b) => (a.order || 0) - (b.order || 0))
    
    // 递归处理子菜单
    return sortedMenus.map(menu => {
      if (menu.children && menu.children.length > 0) {
        return {
          ...menu,
          children: generateMenuTree(menu.children)
        }
      }
      return menu
    })
  }
  
  /**
   * 获取菜单路径
   */
  const getMenuPath = (menuKey: string): string[] => {
    const findPath = (menus: MenuItem[], key: string, path: string[] = []): string[] | null => {
      for (const menu of menus) {
        const currentPath = [...path, menu.key]
        
        if (menu.key === key) {
          return currentPath
        }
        
        if (menu.children && menu.children.length > 0) {
          const result = findPath(menu.children, key, currentPath)
          if (result) {
            return result
          }
        }
      }
      return null
    }
    
    const sideMenuPath = findPath(menuStore.filteredSideMenus, menuKey)
    if (sideMenuPath) return sideMenuPath
    
    const headMenuPath = findPath(menuStore.filteredHeadMenus, menuKey)
    return headMenuPath || []
  }
  
  /**
   * 检查菜单权限
   */
  const checkMenuPermission = (menu: MenuItem): boolean => {
    if (!menu.permission) return true
    
    return authStore.checkAccess(
      menu.permission as PermissionLevel,
      menu.roles,
      menu.permissions
    )
  }
  
  // ==================== 生命周期 ====================
  
  /**
   * 初始化
   */
  const init = (): void => {
    loadConfig()
    loadMenuCache()
    setupRefreshTimer()
  }
  
  /**
   * 销毁
   */
  const destroy = (): void => {
    clearRefreshTimer()
  }
  
  // 监听用户登录状态变化
  watch(
    () => authStore.isLoggedIn,
    (isLoggedIn) => {
      if (isLoggedIn) {
        refreshMenus()
      } else {
        clearMenuCache()
      }
    }
  )
  
  // 监听配置变化
  watch(
    () => config.value,
    () => {
      saveConfig()
    },
    { deep: true }
  )
  
  return {
    // 状态
    config: readonly(config),
    searchKeyword,
    loading: readonly(loading),
    menuCache: readonly(menuCache),
    
    // 计算属性
    filteredSideMenus,
    filteredHeadMenus,
    menuStats,
    
    // 搜索方法
    searchMenus,
    clearSearch,
    
    // 缓存方法
    getCachedMenus,
    setCachedMenus,
    clearMenuCache,
    
    // 配置方法
    updateConfig,
    resetConfig,
    
    // 菜单操作方法
    refreshMenus,
    generateMenuTree,
    getMenuPath,
    checkMenuPermission,
    
    // 生命周期方法
    init,
    destroy
  }
}

// 导出类型
export type { MenuConfig }
export { DEFAULT_MENU_CONFIG }