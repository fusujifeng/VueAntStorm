/**
 * 权限管理工具函数
 * 提供权限检查、角色验证、菜单过滤等核心功能
 */

import {
  PermissionLevel
} from '@/types/auth'

import type {
  UserRole,
  MenuItem,
  DynamicRoute,
  UserInfo,
  PermissionChecker,
  RoleChecker,
  MenuFilter,
  RouteFilter
} from '@/types/auth'

// ==================== 权限检查函数 ====================

/**
 * 检查用户是否拥有指定权限
 * @param requiredPermissions 需要的权限（字符串或字符串数组）
 * @param userPermissions 用户拥有的权限列表
 * @param requireAll 是否需要拥有所有权限（默认false，即拥有任一权限即可）
 * @returns 是否拥有权限
 */
export const hasPermission: PermissionChecker = (
  requiredPermissions: string | string[],
  userPermissions: string[],
  requireAll: boolean = false
): boolean => {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true
  }
  
  if (!userPermissions || userPermissions.length === 0) {
    return false
  }
  
  const required = Array.isArray(requiredPermissions) 
    ? requiredPermissions 
    : [requiredPermissions]
  
  if (requireAll) {
    // 需要拥有所有权限
    return required.every(permission => userPermissions.includes(permission))
  } else {
    // 拥有任一权限即可
    return required.some(permission => userPermissions.includes(permission))
  }
}

/**
 * 检查用户是否拥有指定角色
 * @param requiredRoles 需要的角色（角色或角色数组）
 * @param userRoles 用户拥有的角色列表
 * @param requireAll 是否需要拥有所有角色（默认false）
 * @returns 是否拥有角色
 */
export const hasRole: RoleChecker = (
  requiredRoles: UserRole | UserRole[],
  userRoles: UserRole[],
  requireAll: boolean = false
): boolean => {
  if (!requiredRoles) {
    return true
  }
  
  if (!userRoles || userRoles.length === 0) {
    return false
  }
  
  const required = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
  
  if (requireAll) {
    return required.every(role => userRoles.includes(role))
  } else {
    return required.some(role => userRoles.includes(role))
  }
}

/**
 * 检查用户是否可以访问指定路由
 * @param route 路由配置
 * @param user 用户信息
 * @returns 是否可以访问
 */
export const canAccessRoute = (
  route: DynamicRoute,
  user: UserInfo | null
): boolean => {
  if (!route.meta) {
    return true
  }
  
  const { permission, roles, permissions } = route.meta
  
  // 公开路由，无需权限
  if (permission === PermissionLevel.PUBLIC) {
    return true
  }
  
  // 需要登录但用户未登录
  if (!user && permission !== PermissionLevel.PUBLIC) {
    return false
  }
  
  // 只需要登录
  if (permission === PermissionLevel.AUTHENTICATED && user) {
    return true
  }
  
  // 基于角色的权限检查
  if (permission === PermissionLevel.ROLE_BASED && user) {
    // 检查角色
    if (roles && roles.length > 0) {
      if (!hasRole(roles, user.roles)) {
        return false
      }
    }
    
    // 检查具体权限
    if (permissions && permissions.length > 0) {
      if (!hasPermission(permissions, user.permissions)) {
        return false
      }
    }
    
    return true
  }
  
  return false
}

/**
 * 检查用户是否可以看到指定菜单项
 * @param menuItem 菜单项配置
 * @param user 用户信息
 * @returns 是否可以看到
 */
export const canAccessMenu = (
  menuItem: MenuItem,
  user: UserInfo | null
): boolean => {
  // 隐藏的菜单项
  if (menuItem.hidden) {
    return false
  }
  
  const { permission, roles, permissions } = menuItem
  
  // 公开菜单
  if (permission === PermissionLevel.PUBLIC) {
    return true
  }
  
  // 需要登录但用户未登录
  if (!user && permission !== PermissionLevel.PUBLIC) {
    return false
  }
  
  // 只需要登录
  if (permission === PermissionLevel.AUTHENTICATED && user) {
    return true
  }
  
  // 基于角色的权限检查
  if (permission === PermissionLevel.ROLE_BASED && user) {
    // 检查角色
    if (roles && roles.length > 0) {
      if (!hasRole(roles, user.roles)) {
        return false
      }
    }
    
    // 检查具体权限
    if (permissions && permissions.length > 0) {
      if (!hasPermission(permissions, user.permissions)) {
        return false
      }
    }
    
    return true
  }
  
  return false
}

// ==================== 菜单和路由过滤函数 ====================

/**
 * 过滤用户可访问的菜单
 * @param menus 菜单列表
 * @param user 用户信息
 * @returns 过滤后的菜单列表
 */
export const filterMenus: MenuFilter = (
  menus: MenuItem[],
  user: UserInfo | null
): MenuItem[] => {
  return menus
    .filter(menu => canAccessMenu(menu, user))
    .map(menu => {
      if (menu.children && menu.children.length > 0) {
        const filteredChildren = filterMenus(menu.children, user)
        return {
          ...menu,
          children: filteredChildren
        }
      }
      return menu
    })
    .filter(menu => {
      // 如果父菜单没有子菜单且没有路径，则过滤掉
      if (menu.children) {
        return menu.children.length > 0 || menu.path
      }
      return true
    })
}

/**
 * 过滤用户可访问的路由
 * @param routes 路由列表
 * @param user 用户信息
 * @returns 过滤后的路由列表
 */
export const filterRoutes: RouteFilter = (
  routes: DynamicRoute[],
  user: UserInfo | null
): DynamicRoute[] => {
  return routes
    .filter(route => canAccessRoute(route, user))
    .map(route => {
      if (route.children && route.children.length > 0) {
        const filteredChildren = filterRoutes(route.children, user)
        return {
          ...route,
          children: filteredChildren
        }
      }
      return route
    })
}

// ==================== 菜单工具函数 ====================

/**
 * 将菜单树转换为扁平列表
 * @param menus 菜单树
 * @returns 扁平菜单列表
 */
export const flattenMenus = (menus: MenuItem[]): MenuItem[] => {
  const result: MenuItem[] = []
  
  const flatten = (items: MenuItem[]) => {
    items.forEach(item => {
      result.push(item)
      if (item.children && item.children.length > 0) {
        flatten(item.children)
      }
    })
  }
  
  flatten(menus)
  return result
}

/**
 * 根据路径查找菜单项
 * @param menus 菜单列表
 * @param path 路径
 * @returns 找到的菜单项
 */
export const findMenuByPath = (
  menus: MenuItem[],
  path: string
): MenuItem | null => {
  for (const menu of menus) {
    if (menu.path === path) {
      return menu
    }
    if (menu.children && menu.children.length > 0) {
      const found = findMenuByPath(menu.children, path)
      if (found) {
        return found
      }
    }
  }
  return null
}

/**
 * 根据key查找菜单项
 * @param menus 菜单列表
 * @param key 菜单key
 * @returns 找到的菜单项
 */
export const findMenuByKey = (
  menus: MenuItem[],
  key: string
): MenuItem | null => {
  for (const menu of menus) {
    if (menu.key === key) {
      return menu
    }
    if (menu.children && menu.children.length > 0) {
      const found = findMenuByKey(menu.children, key)
      if (found) {
        return found
      }
    }
  }
  return null
}

/**
 * 获取菜单的所有父级keys
 * @param menus 菜单列表
 * @param targetKey 目标菜单key
 * @returns 父级keys数组
 */
export const getMenuParentKeys = (
  menus: MenuItem[],
  targetKey: string
): string[] => {
  const parentKeys: string[] = []
  
  const findParents = (items: MenuItem[], target: string, parents: string[]): boolean => {
    for (const item of items) {
      if (item.key === target) {
        parentKeys.push(...parents)
        return true
      }
      if (item.children && item.children.length > 0) {
        if (findParents(item.children, target, [...parents, item.key])) {
          return true
        }
      }
    }
    return false
  }
  
  findParents(menus, targetKey, [])
  return parentKeys
}

/**
 * 生成面包屑导航
 * @param menus 菜单列表
 * @param currentPath 当前路径
 * @returns 面包屑数组
 */
export const generateBreadcrumb = (
  menus: MenuItem[],
  currentPath: string
): MenuItem[] => {
  const breadcrumb: MenuItem[] = []
  
  const findPath = (items: MenuItem[], path: string, parents: MenuItem[]): boolean => {
    for (const item of items) {
      if (item.path === path) {
        breadcrumb.push(...parents, item)
        return true
      }
      if (item.children && item.children.length > 0) {
        if (findPath(item.children, path, [...parents, item])) {
          return true
        }
      }
    }
    return false
  }
  
  findPath(menus, currentPath, [])
  return breadcrumb.filter(item => item.breadcrumb !== false)
}

// ==================== 存储工具函数 ====================

/**
 * 获取存储的token
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token')
}

/**
 * 设置token
 * @param token token值
 */
export const setToken = (token: string): void => {
  localStorage.setItem('token', token)
}

/**
 * 移除token
 */
export const removeToken = (): void => {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  localStorage.removeItem('permissions')
  localStorage.removeItem('loginTime')
}

/**
 * 获取存储的用户信息
 */
export const getStoredUser = (): UserInfo | null => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      return JSON.parse(userStr)
    } catch (error) {
      console.error('解析用户信息失败:', error)
      return null
    }
  }
  return null
}

/**
 * 存储用户信息
 * @param user 用户信息
 */
export const setStoredUser = (user: UserInfo): void => {
  localStorage.setItem('user', JSON.stringify(user))
}

/**
 * 检查token是否过期
 * @param expiresIn 过期时间（秒）
 * @param loginTime 登录时间戳
 * @returns 是否过期
 */
export const isTokenExpired = (
  expiresIn: number | null,
  loginTime: number | null
): boolean => {
  if (!expiresIn || !loginTime) {
    return false
  }
  
  const now = Date.now()
  const expireTime = loginTime + expiresIn * 1000
  
  return now >= expireTime
}

// ==================== 调试工具函数 ====================

/**
 * 打印权限调试信息
 * @param user 用户信息
 * @param requiredPermissions 需要的权限
 * @param requiredRoles 需要的角色
 */
export const debugPermission = (
  user: UserInfo | null,
  requiredPermissions?: string[],
  requiredRoles?: UserRole[]
): void => {
  if (process.env.NODE_ENV === 'development') {
    console.group('🔐 权限调试信息')
    console.log('用户信息:', user)
    console.log('用户角色:', user?.roles)
    console.log('用户权限:', user?.permissions)
    console.log('需要的角色:', requiredRoles)
    console.log('需要的权限:', requiredPermissions)
    
    if (requiredRoles) {
      console.log('角色检查结果:', hasRole(requiredRoles, user?.roles || []))
    }
    
    if (requiredPermissions) {
      console.log('权限检查结果:', hasPermission(requiredPermissions, user?.permissions || []))
    }
    
    console.groupEnd()
  }
}