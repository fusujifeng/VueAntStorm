/**
 * 用户认证和权限状态管理
 * 使用 Pinia 管理用户登录状态、权限信息和相关操作
 */

import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'
import type {
  UserInfo,
  LoginRequest,
  LoginResponse,
  AuthState,
  UserRole
} from '@/types/auth'
import { PermissionLevel } from '@/types/auth'
import {
  getToken,
  setToken,
  removeToken,
  getStoredUser,
  setStoredUser,
  hasPermission,
  hasRole,
  isTokenExpired
} from '@/utils/auth'

// 模拟API调用
const mockApi = {
  // 模拟登录接口
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟用户数据
    const mockUsers = {
      'guest': {
        id: 'guest',
        username: 'guest',
        email: 'guest@example.com',
        nickname: '游客用户',
        avatar: '',
        roles: ['guest'] as UserRole[],
        permissions: [
          'dashboard:read',
          'docs:read'
        ],
        status: 'active' as const,
        lastLoginTime: Date.now(),
        createdAt: Date.now()
      },
      'admin@example.com': {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        nickname: '系统管理员',
        avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
        roles: ['admin', 'user'] as UserRole[],
        permissions: [
          'user:read', 'user:write', 'user:delete',
          'role:read', 'role:write', 'role:delete',
          'system:read', 'system:write',
          'dashboard:read', 'analytics:read'
        ],
        status: 'active' as const,
        lastLoginTime: Date.now(),
        createdAt: Date.now() - 86400000 * 30
      },
      'manager@example.com': {
        id: '2',
        username: 'manager',
        email: 'manager@example.com',
        nickname: '部门经理',
        avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
        roles: ['manager', 'user'] as UserRole[],
        permissions: [
          'user:read', 'user:write',
          'dashboard:read', 'analytics:read',
          'report:read', 'report:write'
        ],
        status: 'active' as const,
        lastLoginTime: Date.now(),
        createdAt: Date.now() - 86400000 * 15
      },
      'user@example.com': {
        id: '3',
        username: 'user',
        email: 'user@example.com',
        nickname: '普通用户',
        avatar: 'https://avatars.githubusercontent.com/u/3?v=4',
        roles: ['user'] as UserRole[],
        permissions: [
          'dashboard:read',
          'profile:read', 'profile:write'
        ],
        status: 'active' as const,
        lastLoginTime: Date.now(),
        createdAt: Date.now() - 86400000 * 7
      }
    }
    
    // 支持用户名或邮箱登录
    let user = mockUsers[credentials.email as keyof typeof mockUsers]
    
    // 如果通过邮箱没找到，尝试通过用户名查找
    if (!user) {
      user = Object.values(mockUsers).find(u => u.username === credentials.email)
    }
    
    // 验证密码（游客用户密码为 'guest'，其他用户密码为 '123456'）
    const expectedPassword = credentials.email === 'guest' ? 'guest' : '123456'
    
    if (!user || credentials.password !== expectedPassword) {
      throw new Error('用户名或密码错误')
    }
    
    return {
      success: true,
      message: '登录成功',
      data: {
        token: `mock_token_${user.id}_${Date.now()}`,
        refreshToken: `mock_refresh_token_${user.id}_${Date.now()}`,
        expiresIn: 7200, // 2小时
        user
      }
    }
  },
  
  // 模拟获取用户信息接口
  async getUserInfo(token: string): Promise<{ success: boolean; data: UserInfo }> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 从token中解析用户ID（实际项目中应该通过后端验证）
    const userId = token.split('_')[2]
    
    const mockUsers = {
      '1': {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        nickname: '系统管理员',
        avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
        roles: ['admin', 'user'] as UserRole[],
        permissions: [
          'user:read', 'user:write', 'user:delete',
          'role:read', 'role:write', 'role:delete',
          'system:read', 'system:write',
          'dashboard:read', 'analytics:read'
        ],
        status: 'active' as const,
        lastLoginTime: Date.now(),
        createdAt: Date.now() - 86400000 * 30
      }
    }
    
    const user = mockUsers[userId as keyof typeof mockUsers]
    
    if (!user) {
      throw new Error('用户信息获取失败')
    }
    
    return {
      success: true,
      data: user
    }
  },
  
  // 模拟刷新token接口
  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      success: true,
      message: 'Token刷新成功',
      data: {
        token: `refreshed_token_${Date.now()}`,
        refreshToken: `refreshed_refresh_token_${Date.now()}`,
        expiresIn: 7200,
        user: getStoredUser()!
      }
    }
  }
}

export const useAuthStore = defineStore('auth', () => {
  // ==================== 状态定义 ====================
  
  // 用户信息
  const user = ref<UserInfo | null>(null)
  
  // 认证token
  const token = ref<string | null>(null)
  
  // 刷新token
  const refreshToken = ref<string | null>(null)
  
  // 登录状态
  const isLoggedIn = ref<boolean>(false)
  
  // 加载状态
  const loading = ref<boolean>(false)
  
  // 登录时间
  const loginTime = ref<number | null>(null)
  
  // token过期时间（秒）
  const expiresIn = ref<number | null>(null)
  
  // ==================== 计算属性 ====================
  
  // 用户角色
  const userRoles = computed<UserRole[]>(() => user.value?.roles || [])
  
  // 用户权限
  const userPermissions = computed<string[]>(() => user.value?.permissions || [])
  
  // 是否是管理员
  const isAdmin = computed<boolean>(() => userRoles.value.includes('admin'))
  
  // 是否是经理
  const isManager = computed<boolean>(() => userRoles.value.includes('manager'))
  
  // 用户显示名称
  const displayName = computed<string>(() => {
    if (!user.value) return ''
    return user.value.nickname || user.value.username || user.value.email
  })
  
  // token是否过期
  const isTokenExpiredComputed = computed<boolean>(() => {
    return isTokenExpired(expiresIn.value, loginTime.value)
  })
  
  // 认证状态
  const authState = computed<AuthState>(() => ({
    isLoggedIn: isLoggedIn.value,
    user: user.value,
    token: token.value,
    loading: loading.value,
    isTokenExpired: isTokenExpiredComputed.value
  }))
  
  // ==================== 权限检查方法 ====================
  
  /**
   * 检查是否拥有指定权限
   */
  const checkPermission = (
    permissions: string | string[],
    requireAll: boolean = false
  ): boolean => {
    return hasPermission(permissions, userPermissions.value, requireAll)
  }
  
  /**
   * 检查是否拥有指定角色
   */
  const checkRole = (
    roles: UserRole | UserRole[],
    requireAll: boolean = false
  ): boolean => {
    return hasRole(roles, userRoles.value, requireAll)
  }
  
  /**
   * 检查是否可以访问指定权限级别的资源
   */
  const checkAccess = (
    permissionLevel: PermissionLevel,
    requiredRoles?: UserRole[],
    requiredPermissions?: string[]
  ): boolean => {
    // 公开资源
    if (permissionLevel === PermissionLevel.PUBLIC) {
      return true
    }
    
    // 需要登录
    if (!isLoggedIn.value) {
      return false
    }
    
    // 只需要登录
    if (permissionLevel === PermissionLevel.AUTHENTICATED) {
      return true
    }
    
    // 基于角色的权限
    if (permissionLevel === PermissionLevel.ROLE_BASED) {
      // 检查角色
      if (requiredRoles && requiredRoles.length > 0) {
        if (!checkRole(requiredRoles)) {
          return false
        }
      }
      
      // 检查权限
      if (requiredPermissions && requiredPermissions.length > 0) {
        if (!checkPermission(requiredPermissions)) {
          return false
        }
      }
      
      return true
    }
    
    return false
  }
  
  // ==================== 认证操作方法 ====================
  
  /**
   * 用户登录
   */
  const login = async (credentials: LoginRequest): Promise<void> => {
    loading.value = true
    
    try {
      const response = await mockApi.login(credentials)
      
      if (response.success && response.data) {
        const { token: newToken, refreshToken: newRefreshToken, expiresIn: newExpiresIn, user: userData } = response.data
        
        // 更新状态
        token.value = newToken
        refreshToken.value = newRefreshToken
        expiresIn.value = newExpiresIn
        user.value = userData
        isLoggedIn.value = true
        loginTime.value = Date.now()
        
        // 持久化存储
        setToken(newToken)
        setStoredUser(userData)
        localStorage.setItem('refreshToken', newRefreshToken)
        localStorage.setItem('loginTime', loginTime.value.toString())
        localStorage.setItem('expiresIn', newExpiresIn.toString())
        
        console.log('登录成功:', userData.nickname)
      } else {
        throw new Error(response.message || '登录失败')
      }
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  /**
   * 用户登出
   */
  const logout = async (): Promise<void> => {
    loading.value = true
    
    try {
      // 清除状态
      user.value = null
      token.value = null
      refreshToken.value = null
      isLoggedIn.value = false
      loginTime.value = null
      expiresIn.value = null
      
      // 清除存储
      removeToken()
      
      console.log('登出成功')
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      loading.value = false
    }
  }
  
  /**
   * 获取用户信息
   */
  const fetchUserInfo = async (): Promise<void> => {
    if (!token.value) {
      throw new Error('未找到认证token')
    }
    
    loading.value = true
    
    try {
      const response = await mockApi.getUserInfo(token.value)
      
      if (response.success) {
        user.value = response.data
        setStoredUser(response.data)
        console.log('用户信息获取成功:', response.data.nickname)
      } else {
        throw new Error('获取用户信息失败')
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      // 如果获取用户信息失败，可能是token无效，执行登出
      await logout()
      throw error
    } finally {
      loading.value = false
    }
  }
  
  /**
   * 刷新认证token
   */
  const refreshAuthToken = async (): Promise<void> => {
    if (!refreshToken.value) {
      throw new Error('未找到刷新token')
    }
    
    loading.value = true
    
    try {
      const response = await mockApi.refreshToken(refreshToken.value)
      
      if (response.success && response.data) {
        const { token: newToken, refreshToken: newRefreshToken, expiresIn: newExpiresIn } = response.data
        
        // 更新token信息
        token.value = newToken
        refreshToken.value = newRefreshToken
        expiresIn.value = newExpiresIn
        loginTime.value = Date.now()
        
        // 更新存储
        setToken(newToken)
        localStorage.setItem('refreshToken', newRefreshToken)
        localStorage.setItem('loginTime', loginTime.value.toString())
        localStorage.setItem('expiresIn', newExpiresIn.toString())
        
        console.log('Token刷新成功')
      } else {
        throw new Error('Token刷新失败')
      }
    } catch (error) {
      console.error('Token刷新失败:', error)
      // 刷新失败，执行登出
      await logout()
      throw error
    } finally {
      loading.value = false
    }
  }
  
  /**
   * 初始化认证状态
   */
  const initAuth = async (): Promise<void> => {
    const storedToken = getToken()
    const storedUser = getStoredUser()
    const storedLoginTime = localStorage.getItem('loginTime')
    const storedExpiresIn = localStorage.getItem('expiresIn')
    const storedRefreshToken = localStorage.getItem('refreshToken')
    
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = storedUser
      refreshToken.value = storedRefreshToken
      loginTime.value = storedLoginTime ? parseInt(storedLoginTime) : null
      expiresIn.value = storedExpiresIn ? parseInt(storedExpiresIn) : null
      isLoggedIn.value = true
      
      // 检查token是否过期
      if (isTokenExpiredComputed.value) {
        console.log('Token已过期，尝试刷新')
        try {
          await refreshAuthToken()
        } catch (error) {
          console.error('Token刷新失败，需要重新登录')
          await logout()
        }
      } else {
        console.log('认证状态初始化成功:', storedUser.nickname)
      }
    }
  }
  
  /**
   * 更新用户信息
   */
  const updateUserInfo = (updates: Partial<UserInfo>): void => {
    if (user.value) {
      user.value = { ...user.value, ...updates }
      setStoredUser(user.value)
    }
  }
  
  /**
   * 切换用户角色（仅用于测试）
   */
  const switchUserRole = async (role: UserRole): Promise<void> => {
    if (!user.value) {
      throw new Error('用户未登录')
    }
    
    // 模拟不同角色的权限配置
    const roleConfigs = {
      guest: {
        roles: ['guest'] as UserRole[],
        permissions: ['dashboard:read', 'docs:read'],
        permissionLevel: 1 as PermissionLevel
      },
      user: {
        roles: ['user'] as UserRole[],
        permissions: ['user:read', 'dashboard:read', 'components:read'],
        permissionLevel: 2 as PermissionLevel
      },
      admin: {
        roles: ['admin', 'user'] as UserRole[],
        permissions: [
          'user:read', 'user:write',
          'role:read', 'role:write',
          'dashboard:read', 'analytics:read'
        ],
        permissionLevel: 3 as PermissionLevel
      },
      superAdmin: {
        roles: ['superAdmin', 'admin', 'user'] as UserRole[],
        permissions: [
          'user:read', 'user:write', 'user:delete',
          'role:read', 'role:write', 'role:delete',
          'system:read', 'system:write',
          'dashboard:read', 'analytics:read'
        ],
        permissionLevel: 4 as PermissionLevel
      }
    }
    
    const config = roleConfigs[role]
    if (!config) {
      throw new Error(`未知角色: ${role}`)
    }
    
    // 更新用户信息
    const updatedUser: UserInfo = {
      ...user.value,
      roles: config.roles,
      permissions: config.permissions,
      permissionLevel: config.permissionLevel,
      lastLoginTime: Date.now()
    }
    
    user.value = updatedUser
    setStoredUser(updatedUser)
  }
  
  // ==================== 返回store接口 ====================
  
  return {
    // 状态
    user: readonly(user),
    token: readonly(token),
    refreshToken: readonly(refreshToken),
    isLoggedIn: readonly(isLoggedIn),
    loading: readonly(loading),
    loginTime: readonly(loginTime),
    expiresIn: readonly(expiresIn),
    
    // 计算属性
    userRoles,
    userPermissions,
    isAdmin,
    isManager,
    displayName,
    isTokenExpired: isTokenExpiredComputed,
    authState,
    
    // 权限检查方法
    checkPermission,
    checkRole,
    checkAccess,
    
    // 认证操作方法
    login,
    logout,
    fetchUserInfo,
    refreshAuthToken,
    initAuth,
    updateUserInfo,
    switchUserRole
  }
})

// 导出类型
export type AuthStore = ReturnType<typeof useAuthStore>