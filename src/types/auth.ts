/**
 * 权限管理系统类型定义
 * 定义用户、角色、权限、路由和菜单相关的数据结构
 */

// ==================== 用户相关类型 ====================

/**
 * 用户角色枚举
 */
export enum UserRole {
  SUPER_ADMIN = 'super_admin',    // 超级管理员
  ADMIN = 'admin',                // 管理员
  MANAGER = 'manager',            // 经理
  EMPLOYEE = 'employee',          // 员工
  GUEST = 'guest'                 // 访客
}

/**
 * 权限级别枚举
 */
export enum PermissionLevel {
  PUBLIC = 'public',              // 公开访问（无需登录）
  AUTHENTICATED = 'authenticated', // 需要登录
  ROLE_BASED = 'role_based'       // 基于角色的权限
}

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: string | number
  username: string
  email?: string
  avatar?: string
  roles: UserRole[]               // 用户可能有多个角色
  permissions: string[]           // 用户的具体权限列表
  departmentId?: string | number  // 部门ID
  createTime?: string
  lastLoginTime?: string
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
  token: string
  refreshToken?: string
  user: UserInfo
  expiresIn?: number
}

// ==================== 权限相关类型 ====================

/**
 * 权限配置接口
 */
export interface Permission {
  id: string
  name: string
  code: string                    // 权限编码，如 'user:create', 'order:delete'
  description?: string
  category?: string               // 权限分类
  parentId?: string              // 父权限ID（支持权限树结构）
  children?: Permission[]
}

/**
 * 角色权限配置
 */
export interface RolePermission {
  role: UserRole
  permissions: string[]           // 权限编码列表
  routes?: string[]              // 可访问的路由名称列表
  menus?: string[]               // 可见的菜单项列表
}

// ==================== 路由相关类型 ====================

/**
 * 路由元信息扩展
 */
export interface RouteMeta {
  title?: string                  // 页面标题
  icon?: string                  // 图标
  permission?: PermissionLevel   // 权限级别
  roles?: UserRole[]             // 允许访问的角色
  permissions?: string[]         // 需要的具体权限
  hidden?: boolean               // 是否在菜单中隐藏
  keepAlive?: boolean           // 是否缓存页面
  breadcrumb?: boolean          // 是否显示面包屑
  affix?: boolean               // 是否固定在标签页
  noRedirect?: boolean          // 是否禁止重定向
  activeMenu?: string           // 高亮的菜单项
  badge?: string | number       // 徽章内容
  dot?: boolean                 // 是否显示小红点
  order?: number                // 排序权重
}

/**
 * 动态路由配置
 */
export interface DynamicRoute {
  id: string | number
  name: string                   // 路由名称
  path: string                   // 路由路径
  component?: string             // 组件路径
  redirect?: string              // 重定向路径
  meta: RouteMeta
  children?: DynamicRoute[]      // 子路由
  parentId?: string | number     // 父路由ID
  status?: 'active' | 'inactive' // 路由状态
}

/**
 * 路由来源类型
 */
export enum RouteSource {
  STATIC = 'static',             // 前端静态路由
  DYNAMIC = 'dynamic'            // 后端动态路由
}

// ==================== 菜单相关类型 ====================

/**
 * 菜单类型枚举
 */
export enum MenuType {
  SIDE = 'side',                 // 侧边菜单
  HEAD = 'head',                 // 顶部菜单
  BOTH = 'both'                  // 同时显示在两处
}

/**
 * 菜单项配置
 */
export interface MenuItem {
  id: string | number
  key: string                    // 菜单唯一标识
  title: string                  // 菜单标题
  icon?: string                  // 菜单图标
  path?: string                  // 路由路径
  type: MenuType                 // 菜单类型
  permission?: PermissionLevel   // 权限级别
  roles?: UserRole[]             // 允许访问的角色
  permissions?: string[]         // 需要的具体权限
  hidden?: boolean               // 是否隐藏
  disabled?: boolean             // 是否禁用
  external?: boolean             // 是否外部链接
  target?: '_blank' | '_self'    // 链接打开方式
  badge?: string | number        // 徽章内容
  dot?: boolean                  // 是否显示小红点
  order?: number                 // 排序权重
  parentId?: string | number     // 父菜单ID
  children?: MenuItem[]          // 子菜单
  component?: string             // 对应的组件
  keepAlive?: boolean           // 是否缓存
  breadcrumb?: boolean          // 是否显示在面包屑中
}

/**
 * 菜单配置响应
 */
export interface MenuResponse {
  sideMenus: MenuItem[]          // 侧边菜单
  headMenus: MenuItem[]          // 顶部菜单
  permissions: string[]          // 用户权限列表
  routes?: DynamicRoute[]        // 动态路由（可选）
}

// ==================== API 相关类型 ====================

/**
 * 通用API响应格式
 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
  timestamp?: number
}

/**
 * 分页参数
 */
export interface PageParams {
  page: number
  pageSize: number
  keyword?: string
  [key: string]: any
}

/**
 * 分页响应
 */
export interface PageResponse<T = any> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ==================== 状态管理相关类型 ====================

/**
 * 认证状态
 */
export interface AuthState {
  token: string | null
  refreshToken: string | null
  user: UserInfo | null
  permissions: string[]
  roles: UserRole[]
  isLoggedIn: boolean
  loginTime: number | null
  expiresIn: number | null
}

/**
 * 菜单状态
 */
export interface MenuState {
  sideMenus: MenuItem[]
  headMenus: MenuItem[]
  flatMenus: MenuItem[]          // 扁平化的菜单列表（便于查找）
  menuLoaded: boolean
  activeMenu: string
  openKeys: string[]
  selectedKeys: string[]
}

/**
 * 路由状态
 */
export interface RouteState {
  dynamicRoutes: DynamicRoute[]
  staticRoutes: DynamicRoute[]
  routesLoaded: boolean
  cachedViews: string[]          // 缓存的视图
  visitedViews: string[]         // 访问过的视图
}

// ==================== 工具类型 ====================

/**
 * 权限检查函数类型
 */
export type PermissionChecker = (
  requiredPermissions: string | string[],
  userPermissions: string[]
) => boolean

/**
 * 角色检查函数类型
 */
export type RoleChecker = (
  requiredRoles: UserRole | UserRole[],
  userRoles: UserRole[]
) => boolean

/**
 * 菜单过滤函数类型
 */
export type MenuFilter = (
  menus: MenuItem[],
  userRoles: UserRole[],
  userPermissions: string[]
) => MenuItem[]

/**
 * 路由过滤函数类型
 */
export type RouteFilter = (
  routes: DynamicRoute[],
  userRoles: UserRole[],
  userPermissions: string[]
) => DynamicRoute[]

// ==================== 常量定义 ====================

/**
 * 默认权限配置
 */
export const DEFAULT_PERMISSIONS = {
  // 用户管理
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  
  // 角色管理
  ROLE_VIEW: 'role:view',
  ROLE_CREATE: 'role:create',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',
  
  // 菜单管理
  MENU_VIEW: 'menu:view',
  MENU_CREATE: 'menu:create',
  MENU_UPDATE: 'menu:update',
  MENU_DELETE: 'menu:delete',
  
  // 系统管理
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_LOG: 'system:log',
  SYSTEM_MONITOR: 'system:monitor'
} as const

/**
 * 角色权限映射
 */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.SUPER_ADMIN]: Object.values(DEFAULT_PERMISSIONS),
  [UserRole.ADMIN]: [
    DEFAULT_PERMISSIONS.USER_VIEW,
    DEFAULT_PERMISSIONS.USER_CREATE,
    DEFAULT_PERMISSIONS.USER_UPDATE,
    DEFAULT_PERMISSIONS.ROLE_VIEW,
    DEFAULT_PERMISSIONS.MENU_VIEW,
    DEFAULT_PERMISSIONS.SYSTEM_LOG
  ],
  [UserRole.MANAGER]: [
    DEFAULT_PERMISSIONS.USER_VIEW,
    DEFAULT_PERMISSIONS.USER_UPDATE,
    DEFAULT_PERMISSIONS.ROLE_VIEW,
    DEFAULT_PERMISSIONS.MENU_VIEW
  ],
  [UserRole.EMPLOYEE]: [
    DEFAULT_PERMISSIONS.USER_VIEW,
    DEFAULT_PERMISSIONS.MENU_VIEW
  ],
  [UserRole.GUEST]: [
    DEFAULT_PERMISSIONS.MENU_VIEW
  ]
}