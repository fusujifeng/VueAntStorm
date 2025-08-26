/**
 * 菜单配置文件
 * 定义静态菜单配置和动态菜单API模拟
 */

import type { MenuItem, MenuType, UserInfo } from '@/types/auth'

// ==================== 静态菜单配置 ====================

/**
 * 侧边菜单配置
 */
export const SIDE_MENUS: MenuItem[] = [
  {
    key: 'dashboard',
    title: '仪表盘',
    path: '/dashboard',
    icon: 'dashboard',
    type: 'item',
    permission: 'auth',
    order: 1,
    meta: {
      title: '仪表盘',
      keepAlive: true
    }
  },
  {
    key: 'components',
    title: '组件',
    icon: 'appstore',
    type: 'group',
    permission: 'auth',
    order: 2,
    children: [
      {
        key: 'table',
        title: '表格',
        path: '/components/table',
        icon: 'table',
        type: 'item',
        permission: 'auth',
        order: 1,
        meta: {
          title: '表格组件',
          keepAlive: true
        }
      },
      {
        key: 'form',
        title: '表单',
        path: '/components/form',
        icon: 'form',
        type: 'item',
        permission: 'auth',
        order: 2,
        meta: {
          title: '表单组件',
          keepAlive: true
        }
      },
      {
        key: 'chart',
        title: '图表',
        path: '/components/chart',
        icon: 'chart',
        type: 'item',
        permission: 'auth',
        order: 3,
        meta: {
          title: '图表组件',
          keepAlive: true
        }
      }
    ]
  },
  {
    key: 'system',
    title: '系统管理',
    icon: 'setting',
    type: 'group',
    permission: 'role',
    roles: ['admin', 'manager'],
    order: 3,
    children: [
      {
        key: 'user-management',
        title: '用户管理',
        path: '/system/users',
        icon: 'user',
        type: 'item',
        permission: 'role',
        roles: ['admin'],
        permissions: ['user:read', 'user:write'],
        order: 1,
        meta: {
          title: '用户管理',
          keepAlive: true
        }
      },
      {
        key: 'role-management',
        title: '角色管理',
        path: '/system/roles',
        icon: 'team',
        type: 'item',
        permission: 'role',
        roles: ['admin'],
        permissions: ['role:read', 'role:write'],
        order: 2,
        meta: {
          title: '角色管理',
          keepAlive: true
        }
      },
      {
        key: 'permission-management',
        title: '权限管理',
        path: '/system/permissions',
        icon: 'lock',
        type: 'item',
        permission: 'role',
        roles: ['admin'],
        permissions: ['permission:read', 'permission:write'],
        order: 3,
        meta: {
          title: '权限管理',
          keepAlive: true
        }
      },
      {
        key: 'menu-management',
        title: '菜单管理',
        path: '/system/menus',
        icon: 'menu',
        type: 'item',
        permission: 'role',
        roles: ['admin'],
        permissions: ['menu:read', 'menu:write'],
        order: 4,
        meta: {
          title: '菜单管理',
          keepAlive: true
        }
      },
      {
        key: 'permission-test',
        title: '权限测试',
        path: '/auth/permission-test',
        icon: 'experiment',
        type: 'item',
        permission: 'role',
        roles: ['admin', 'manager'],
        permissions: ['permission:test'],
        order: 5,
        meta: {
          title: '权限测试',
          keepAlive: true
        }
      }
    ]
  },
  {
    key: 'business',
    title: '业务管理',
    icon: 'shop',
    type: 'group',
    permission: 'role',
    roles: ['admin', 'manager', 'employee'],
    order: 4,
    children: [
      {
        key: 'orders',
        title: '订单管理',
        path: '/business/orders',
        icon: 'shopping',
        type: 'item',
        permission: 'role',
        roles: ['admin', 'manager', 'employee'],
        permissions: ['order:read'],
        order: 1,
        meta: {
          title: '订单管理',
          keepAlive: true
        }
      },
      {
        key: 'products',
        title: '商品管理',
        path: '/business/products',
        icon: 'gift',
        type: 'item',
        permission: 'role',
        roles: ['admin', 'manager'],
        permissions: ['product:read'],
        order: 2,
        meta: {
          title: '商品管理',
          keepAlive: true
        }
      },
      {
        key: 'customers',
        title: '客户管理',
        path: '/business/customers',
        icon: 'customer',
        type: 'item',
        permission: 'role',
        roles: ['admin', 'manager', 'employee'],
        permissions: ['customer:read'],
        order: 3,
        meta: {
          title: '客户管理',
          keepAlive: true
        }
      }
    ]
  },
  {
    key: 'reports',
    title: '报表分析',
    icon: 'fund',
    type: 'group',
    permission: 'role',
    roles: ['admin', 'manager'],
    order: 5,
    children: [
      {
        key: 'sales-report',
        title: '销售报表',
        path: '/reports/sales',
        icon: 'chart',
        type: 'item',
        permission: 'role',
        roles: ['admin', 'manager'],
        permissions: ['report:sales'],
        order: 1,
        meta: {
          title: '销售报表',
          keepAlive: true
        }
      },
      {
        key: 'financial-report',
        title: '财务报表',
        path: '/reports/financial',
        icon: 'bank',
        type: 'item',
        permission: 'role',
        roles: ['admin'],
        permissions: ['report:financial'],
        order: 2,
        meta: {
          title: '财务报表',
          keepAlive: true
        }
      },
      {
        key: 'user-report',
        title: '用户报表',
        path: '/reports/users',
        icon: 'user',
        type: 'item',
        permission: 'role',
        roles: ['admin', 'manager'],
        permissions: ['report:users'],
        order: 3,
        meta: {
          title: '用户报表',
          keepAlive: true
        }
      }
    ]
  },
  {
    key: 'tools',
    title: '工具',
    icon: 'tool',
    type: 'group',
    permission: 'auth',
    order: 6,
    children: [
      {
        key: 'file-manager',
        title: '文件管理',
        path: '/tools/files',
        icon: 'folder',
        type: 'item',
        permission: 'auth',
        order: 1,
        meta: {
          title: '文件管理',
          keepAlive: true
        }
      },
      {
        key: 'code-generator',
        title: '代码生成',
        path: '/tools/generator',
        icon: 'code',
        type: 'item',
        permission: 'role',
        roles: ['admin', 'developer'],
        permissions: ['tool:generator'],
        order: 2,
        meta: {
          title: '代码生成器',
          keepAlive: true
        }
      },
      {
        key: 'api-docs',
        title: 'API文档',
        path: '/tools/api-docs',
        icon: 'api',
        type: 'item',
        permission: 'role',
        roles: ['admin', 'developer'],
        order: 3,
        external: true,
        target: '_blank',
        meta: {
          title: 'API文档'
        }
      }
    ]
  },
  {
    key: 'docs',
    title: '文档',
    path: '/docs',
    icon: 'book',
    type: 'item',
    permission: 'public',
    order: 7,
    external: true,
    target: '_blank',
    meta: {
      title: '帮助文档'
    }
  }
]

/**
 * 顶部菜单配置
 */
export const HEAD_MENUS: MenuItem[] = [
  {
    key: 'home',
    title: '首页',
    path: '/dashboard',
    icon: 'home',
    type: 'item',
    permission: 'public',
    order: 1,
    meta: {
      title: '首页'
    }
  },
  {
    key: 'workspace',
    title: '工作台',
    path: '/workspace',
    icon: 'desktop',
    type: 'item',
    permission: 'auth',
    order: 2,
    meta: {
      title: '工作台',
      keepAlive: true
    }
  },
  {
    key: 'projects',
    title: '项目',
    icon: 'project',
    type: 'group',
    permission: 'auth',
    order: 3,
    children: [
      {
        key: 'my-projects',
        title: '我的项目',
        path: '/projects/my',
        icon: 'folder',
        type: 'item',
        permission: 'auth',
        order: 1,
        meta: {
          title: '我的项目',
          keepAlive: true
        }
      },
      {
        key: 'team-projects',
        title: '团队项目',
        path: '/projects/team',
        icon: 'team',
        type: 'item',
        permission: 'auth',
        order: 2,
        meta: {
          title: '团队项目',
          keepAlive: true
        }
      },
      {
        key: 'project-templates',
        title: '项目模板',
        path: '/projects/templates',
        icon: 'copy',
        type: 'item',
        permission: 'role',
        roles: ['admin', 'manager'],
        order: 3,
        meta: {
          title: '项目模板',
          keepAlive: true
        }
      }
    ]
  },
  {
    key: 'analytics',
    title: '分析',
    path: '/analytics',
    icon: 'fund',
    type: 'item',
    permission: 'role',
    roles: ['admin', 'manager'],
    order: 4,
    meta: {
      title: '数据分析',
      keepAlive: true
    }
  },
  {
    key: 'notifications',
    title: '通知',
    path: '/notifications',
    icon: 'bell',
    type: 'item',
    permission: 'auth',
    order: 5,
    badge: {
      count: 3,
      color: 'red'
    },
    meta: {
      title: '消息通知',
      keepAlive: true
    }
  },
  {
    key: 'help',
    title: '帮助',
    icon: 'question',
    type: 'group',
    permission: 'public',
    order: 6,
    children: [
      {
        key: 'user-guide',
        title: '用户指南',
        path: '/help/guide',
        icon: 'book',
        type: 'item',
        permission: 'public',
        order: 1,
        external: true,
        target: '_blank',
        meta: {
          title: '用户指南'
        }
      },
      {
        key: 'faq',
        title: '常见问题',
        path: '/help/faq',
        icon: 'question',
        type: 'item',
        permission: 'public',
        order: 2,
        meta: {
          title: '常见问题'
        }
      },
      {
        key: 'contact',
        title: '联系我们',
        path: '/help/contact',
        icon: 'phone',
        type: 'item',
        permission: 'public',
        order: 3,
        meta: {
          title: '联系我们'
        }
      }
    ]
  }
]

// ==================== 动态菜单API模拟 ====================

/**
 * 模拟动态菜单数据
 */
const DYNAMIC_MENUS_DATA: Record<string, MenuItem[]> = {
  // 管理员动态菜单
  admin: [
    {
      key: 'advanced-system',
      title: '高级系统',
      icon: 'control',
      type: 'group',
      permission: 'role',
      roles: ['admin'],
      order: 10,
      children: [
        {
          key: 'system-monitor',
          title: '系统监控',
          path: '/advanced/monitor',
          icon: 'monitor',
          type: 'item',
          permission: 'role',
          roles: ['admin'],
          permissions: ['system:monitor'],
          order: 1,
          meta: {
            title: '系统监控',
            keepAlive: true
          }
        },
        {
          key: 'system-logs',
          title: '系统日志',
          path: '/advanced/logs',
          icon: 'file',
          type: 'item',
          permission: 'role',
          roles: ['admin'],
          permissions: ['system:logs'],
          order: 2,
          meta: {
            title: '系统日志',
            keepAlive: true
          }
        },
        {
          key: 'system-config',
          title: '系统配置',
          path: '/advanced/config',
          icon: 'setting',
          type: 'item',
          permission: 'role',
          roles: ['admin'],
          permissions: ['system:config'],
          order: 3,
          meta: {
            title: '系统配置',
            keepAlive: true
          }
        }
      ]
    }
  ],
  
  // 经理动态菜单
  manager: [
    {
      key: 'management-tools',
      title: '管理工具',
      icon: 'tool',
      type: 'group',
      permission: 'role',
      roles: ['manager'],
      order: 8,
      children: [
        {
          key: 'team-management',
          title: '团队管理',
          path: '/management/team',
          icon: 'team',
          type: 'item',
          permission: 'role',
          roles: ['manager'],
          permissions: ['team:manage'],
          order: 1,
          meta: {
            title: '团队管理',
            keepAlive: true
          }
        },
        {
          key: 'task-assignment',
          title: '任务分配',
          path: '/management/tasks',
          icon: 'schedule',
          type: 'item',
          permission: 'role',
          roles: ['manager'],
          permissions: ['task:assign'],
          order: 2,
          meta: {
            title: '任务分配',
            keepAlive: true
          }
        }
      ]
    }
  ],
  
  // 员工动态菜单
  employee: [
    {
      key: 'my-workspace',
      title: '我的工作区',
      icon: 'user',
      type: 'group',
      permission: 'role',
      roles: ['employee'],
      order: 9,
      children: [
        {
          key: 'my-tasks',
          title: '我的任务',
          path: '/workspace/tasks',
          icon: 'schedule',
          type: 'item',
          permission: 'role',
          roles: ['employee'],
          permissions: ['task:view'],
          order: 1,
          meta: {
            title: '我的任务',
            keepAlive: true
          }
        },
        {
          key: 'my-schedule',
          title: '我的日程',
          path: '/workspace/schedule',
          icon: 'calendar',
          type: 'item',
          permission: 'role',
          roles: ['employee'],
          permissions: ['schedule:view'],
          order: 2,
          meta: {
            title: '我的日程',
            keepAlive: true
          }
        }
      ]
    }
  ]
}

/**
 * 获取动态菜单
 */
export async function fetchDynamicMenus(
  userId: string,
  menuType: MenuType = 'side'
): Promise<MenuItem[]> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // 模拟根据用户ID获取用户角色
  const userRoles = await getUserRoles(userId)
  
  // 根据角色获取动态菜单
  const dynamicMenus: MenuItem[] = []
  
  for (const role of userRoles) {
    const roleMenus = DYNAMIC_MENUS_DATA[role]
    if (roleMenus) {
      dynamicMenus.push(...roleMenus)
    }
  }
  
  return dynamicMenus
}

/**
 * 获取用户角色（模拟）
 */
async function getUserRoles(userId: string): Promise<string[]> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 200))
  
  // 模拟不同用户的角色
  const userRoleMap: Record<string, string[]> = {
    'admin-001': ['admin'],
    'manager-001': ['manager'],
    'employee-001': ['employee'],
    'user-001': ['admin', 'manager'], // 多角色用户
    'user-002': ['manager', 'employee']
  }
  
  return userRoleMap[userId] || ['employee']
}

/**
 * 创建菜单项（模拟后端创建）
 */
export async function createMenuItem(menuData: Partial<MenuItem>): Promise<MenuItem> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const newMenu: MenuItem = {
    key: menuData.key || `menu-${Date.now()}`,
    title: menuData.title || '新菜单',
    path: menuData.path,
    icon: menuData.icon || 'menu',
    type: menuData.type || 'item',
    permission: menuData.permission || 'auth',
    roles: menuData.roles || [],
    permissions: menuData.permissions || [],
    order: menuData.order || 0,
    hidden: menuData.hidden || false,
    disabled: menuData.disabled || false,
    meta: menuData.meta || {}
  }
  
  return newMenu
}

/**
 * 更新菜单项（模拟后端更新）
 */
export async function updateMenuItem(
  menuKey: string,
  menuData: Partial<MenuItem>
): Promise<MenuItem> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // 这里应该是实际的更新逻辑
  const updatedMenu: MenuItem = {
    key: menuKey,
    title: menuData.title || '更新菜单',
    path: menuData.path,
    icon: menuData.icon || 'menu',
    type: menuData.type || 'item',
    permission: menuData.permission || 'auth',
    roles: menuData.roles || [],
    permissions: menuData.permissions || [],
    order: menuData.order || 0,
    hidden: menuData.hidden || false,
    disabled: menuData.disabled || false,
    meta: menuData.meta || {}
  }
  
  return updatedMenu
}

/**
 * 删除菜单项（模拟后端删除）
 */
export async function deleteMenuItem(menuKey: string): Promise<boolean> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // 模拟删除成功
  return true
}

/**
 * 获取菜单权限配置（模拟）
 */
export async function fetchMenuPermissions(): Promise<Record<string, string[]>> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 200))
  
  return {
    'user:read': ['查看用户'],
    'user:write': ['编辑用户'],
    'user:delete': ['删除用户'],
    'role:read': ['查看角色'],
    'role:write': ['编辑角色'],
    'role:delete': ['删除角色'],
    'permission:read': ['查看权限'],
    'permission:write': ['编辑权限'],
    'menu:read': ['查看菜单'],
    'menu:write': ['编辑菜单'],
    'order:read': ['查看订单'],
    'order:write': ['编辑订单'],
    'product:read': ['查看商品'],
    'product:write': ['编辑商品'],
    'customer:read': ['查看客户'],
    'customer:write': ['编辑客户'],
    'report:sales': ['销售报表'],
    'report:financial': ['财务报表'],
    'report:users': ['用户报表'],
    'tool:generator': ['代码生成器'],
    'system:monitor': ['系统监控'],
    'system:logs': ['系统日志'],
    'system:config': ['系统配置'],
    'team:manage': ['团队管理'],
    'task:assign': ['任务分配'],
    'task:view': ['查看任务'],
    'schedule:view': ['查看日程']
  }
}

// ==================== 菜单配置工具函数 ====================

/**
 * 获取默认菜单配置
 */
export function getDefaultMenuConfig() {
  return {
    sideMenus: SIDE_MENUS,
    headMenus: HEAD_MENUS,
    enableDynamic: true,
    enableCache: true,
    cacheTime: 30 * 60 * 1000, // 30分钟
    refreshInterval: 5 * 60 * 1000 // 5分钟
  }
}

/**
 * 合并静态和动态菜单
 */
export function mergeMenus(
  staticMenus: MenuItem[],
  dynamicMenus: MenuItem[]
): MenuItem[] {
  const merged = [...staticMenus]
  
  // 添加动态菜单，避免重复
  dynamicMenus.forEach(dynamicMenu => {
    const existingIndex = merged.findIndex(menu => menu.key === dynamicMenu.key)
    if (existingIndex >= 0) {
      // 如果存在，则合并
      merged[existingIndex] = { ...merged[existingIndex], ...dynamicMenu }
    } else {
      // 如果不存在，则添加
      merged.push(dynamicMenu)
    }
  })
  
  // 按order排序
  return merged.sort((a, b) => (a.order || 0) - (b.order || 0))
}

/**
 * 验证菜单配置
 */
export function validateMenuConfig(menus: MenuItem[]): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []
  const keys = new Set<string>()
  
  const validate = (items: MenuItem[], path = '') => {
    items.forEach((item, index) => {
      const currentPath = `${path}[${index}]`
      
      // 检查必需字段
      if (!item.key) {
        errors.push(`${currentPath}: 缺少 key 字段`)
      } else if (keys.has(item.key)) {
        errors.push(`${currentPath}: key "${item.key}" 重复`)
      } else {
        keys.add(item.key)
      }
      
      if (!item.title) {
        errors.push(`${currentPath}: 缺少 title 字段`)
      }
      
      // 检查路径
      if (item.type === 'item' && !item.path && !item.external) {
        warnings.push(`${currentPath}: 菜单项缺少 path 字段`)
      }
      
      // 检查权限配置
      if (item.permission === 'role' && (!item.roles || item.roles.length === 0)) {
        warnings.push(`${currentPath}: 角色权限菜单缺少 roles 配置`)
      }
      
      // 递归验证子菜单
      if (item.children && item.children.length > 0) {
        validate(item.children, `${currentPath}.children`)
      }
    })
  }
  
  validate(menus)
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}