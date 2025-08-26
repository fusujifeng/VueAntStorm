/**
 * 菜单生成器工具
 * 提供菜单的动态生成、转换和处理功能
 */

import type {
  MenuItem,
  MenuType,
  RouteSource,
  UserInfo,
  PermissionLevel,
  DynamicRoute
} from '@/types/auth'
import { hasPermission, hasRole, canAccessMenu } from '@/utils/auth'
import { h } from 'vue'

// 图标映射
const ICON_MAP: Record<string, any> = {
  // Ant Design Vue 图标
  'dashboard': () => import('@ant-design/icons-vue/DashboardOutlined'),
  'table': () => import('@ant-design/icons-vue/TableOutlined'),
  'form': () => import('@ant-design/icons-vue/FormOutlined'),
  'chart': () => import('@ant-design/icons-vue/BarChartOutlined'),
  'user': () => import('@ant-design/icons-vue/UserOutlined'),
  'setting': () => import('@ant-design/icons-vue/SettingOutlined'),
  'file': () => import('@ant-design/icons-vue/FileOutlined'),
  'folder': () => import('@ant-design/icons-vue/FolderOutlined'),
  'home': () => import('@ant-design/icons-vue/HomeOutlined'),
  'menu': () => import('@ant-design/icons-vue/MenuOutlined'),
  'search': () => import('@ant-design/icons-vue/SearchOutlined'),
  'plus': () => import('@ant-design/icons-vue/PlusOutlined'),
  'edit': () => import('@ant-design/icons-vue/EditOutlined'),
  'delete': () => import('@ant-design/icons-vue/DeleteOutlined'),
  'eye': () => import('@ant-design/icons-vue/EyeOutlined'),
  'lock': () => import('@ant-design/icons-vue/LockOutlined'),
  'unlock': () => import('@ant-design/icons-vue/UnlockOutlined'),
  'star': () => import('@ant-design/icons-vue/StarOutlined'),
  'heart': () => import('@ant-design/icons-vue/HeartOutlined'),
  'bell': () => import('@ant-design/icons-vue/BellOutlined'),
  'mail': () => import('@ant-design/icons-vue/MailOutlined'),
  'phone': () => import('@ant-design/icons-vue/PhoneOutlined'),
  'calendar': () => import('@ant-design/icons-vue/CalendarOutlined'),
  'clock': () => import('@ant-design/icons-vue/ClockCircleOutlined'),
  'tag': () => import('@ant-design/icons-vue/TagOutlined'),
  'flag': () => import('@ant-design/icons-vue/FlagOutlined'),
  'book': () => import('@ant-design/icons-vue/BookOutlined'),
  'picture': () => import('@ant-design/icons-vue/PictureOutlined'),
  'video': () => import('@ant-design/icons-vue/VideoCameraOutlined'),
  'audio': () => import('@ant-design/icons-vue/AudioOutlined'),
  'download': () => import('@ant-design/icons-vue/DownloadOutlined'),
  'upload': () => import('@ant-design/icons-vue/UploadOutlined'),
  'share': () => import('@ant-design/icons-vue/ShareAltOutlined'),
  'copy': () => import('@ant-design/icons-vue/CopyOutlined'),
  'link': () => import('@ant-design/icons-vue/LinkOutlined'),
  'code': () => import('@ant-design/icons-vue/CodeOutlined'),
  'bug': () => import('@ant-design/icons-vue/BugOutlined'),
  'tool': () => import('@ant-design/icons-vue/ToolOutlined'),
  'api': () => import('@ant-design/icons-vue/ApiOutlined'),
  'database': () => import('@ant-design/icons-vue/DatabaseOutlined'),
  'server': () => import('@ant-design/icons-vue/CloudServerOutlined'),
  'cloud': () => import('@ant-design/icons-vue/CloudOutlined'),
  'mobile': () => import('@ant-design/icons-vue/MobileOutlined'),
  'desktop': () => import('@ant-design/icons-vue/DesktopOutlined'),
  'laptop': () => import('@ant-design/icons-vue/LaptopOutlined'),
  'tablet': () => import('@ant-design/icons-vue/TabletOutlined'),
  'printer': () => import('@ant-design/icons-vue/PrinterOutlined'),
  'camera': () => import('@ant-design/icons-vue/CameraOutlined'),
  'scan': () => import('@ant-design/icons-vue/ScanOutlined'),
  'qrcode': () => import('@ant-design/icons-vue/QrcodeOutlined'),
  'barcode': () => import('@ant-design/icons-vue/BarcodeOutlined'),
  'wifi': () => import('@ant-design/icons-vue/WifiOutlined'),
  'bluetooth': () => import('@ant-design/icons-vue/ApiOutlined'),
  'usb': () => import('@ant-design/icons-vue/UsbOutlined'),
  'safety': () => import('@ant-design/icons-vue/SafetyOutlined'),
  'security': () => import('@ant-design/icons-vue/SecurityScanOutlined'),
  'shield': () => import('@ant-design/icons-vue/SafetyCertificateOutlined'),
  'key': () => import('@ant-design/icons-vue/KeyOutlined'),
  'idcard': () => import('@ant-design/icons-vue/IdcardOutlined'),
  'credit': () => import('@ant-design/icons-vue/CreditCardOutlined'),
  'wallet': () => import('@ant-design/icons-vue/WalletOutlined'),
  'bank': () => import('@ant-design/icons-vue/BankOutlined'),
  'shop': () => import('@ant-design/icons-vue/ShopOutlined'),
  'shopping': () => import('@ant-design/icons-vue/ShoppingOutlined'),
  'car': () => import('@ant-design/icons-vue/CarOutlined'),
  'rocket': () => import('@ant-design/icons-vue/RocketOutlined'),
  'trophy': () => import('@ant-design/icons-vue/TrophyOutlined'),
  'gift': () => import('@ant-design/icons-vue/GiftOutlined'),
  'fire': () => import('@ant-design/icons-vue/FireOutlined'),
  'thunderbolt': () => import('@ant-design/icons-vue/ThunderboltOutlined'),
  'bulb': () => import('@ant-design/icons-vue/BulbOutlined'),
  'experiment': () => import('@ant-design/icons-vue/ExperimentOutlined'),
  'build': () => import('@ant-design/icons-vue/BuildOutlined'),
  'control': () => import('@ant-design/icons-vue/ControlOutlined'),
  'sliders': () => import('@ant-design/icons-vue/SlidersOutlined'),
  'branches': () => import('@ant-design/icons-vue/BranchesOutlined'),
  'fork': () => import('@ant-design/icons-vue/ForkOutlined'),
  'merge': () => import('@ant-design/icons-vue/MergeCellsOutlined'),
  'split': () => import('@ant-design/icons-vue/SplitCellsOutlined'),
  'compress': () => import('@ant-design/icons-vue/CompressOutlined'),
  'expand': () => import('@ant-design/icons-vue/ExpandOutlined'),
  'fullscreen': () => import('@ant-design/icons-vue/FullscreenOutlined'),
  'layout': () => import('@ant-design/icons-vue/LayoutOutlined'),
  'appstore': () => import('@ant-design/icons-vue/AppstoreOutlined'),
  'unorderedlist': () => import('@ant-design/icons-vue/UnorderedListOutlined'),
  'orderedlist': () => import('@ant-design/icons-vue/OrderedListOutlined'),
  'bars': () => import('@ant-design/icons-vue/BarsOutlined'),
  'border': () => import('@ant-design/icons-vue/BorderOutlined'),
  'pic': () => import('@ant-design/icons-vue/PicCenterOutlined'),
  'font': () => import('@ant-design/icons-vue/FontSizeOutlined'),
  'bold': () => import('@ant-design/icons-vue/BoldOutlined'),
  'italic': () => import('@ant-design/icons-vue/ItalicOutlined'),
  'underline': () => import('@ant-design/icons-vue/UnderlineOutlined'),
  'strikethrough': () => import('@ant-design/icons-vue/StrikethroughOutlined'),
  'redo': () => import('@ant-design/icons-vue/RedoOutlined'),
  'undo': () => import('@ant-design/icons-vue/UndoOutlined'),
  'zoom': () => import('@ant-design/icons-vue/ZoomInOutlined'),
  'aim': () => import('@ant-design/icons-vue/AimOutlined'),
  'apartment': () => import('@ant-design/icons-vue/ApartmentOutlined'),
  'audit': () => import('@ant-design/icons-vue/AuditOutlined'),
  'contacts': () => import('@ant-design/icons-vue/ContactsOutlined'),
  'container': () => import('@ant-design/icons-vue/ContainerOutlined'),
  'crown': () => import('@ant-design/icons-vue/CrownOutlined'),
  'customer': () => import('@ant-design/icons-vue/CustomerServiceOutlined'),
  'deployment': () => import('@ant-design/icons-vue/DeploymentUnitOutlined'),
  'disconnect': () => import('@ant-design/icons-vue/DisconnectOutlined'),
  'environment': () => import('@ant-design/icons-vue/EnvironmentOutlined'),
  'exception': () => import('@ant-design/icons-vue/ExceptionOutlined'),
  'export': () => import('@ant-design/icons-vue/ExportOutlined'),
  'field': () => import('@ant-design/icons-vue/FieldTimeOutlined'),
  'filter': () => import('@ant-design/icons-vue/FilterOutlined'),
  'fund': () => import('@ant-design/icons-vue/FundOutlined'),
  'funnel': () => import('@ant-design/icons-vue/FunnelPlotOutlined'),
  'global': () => import('@ant-design/icons-vue/GlobalOutlined'),
  'gold': () => import('@ant-design/icons-vue/GoldOutlined'),
  'group': () => import('@ant-design/icons-vue/GroupOutlined'),
  'hdd': () => import('@ant-design/icons-vue/HddOutlined'),
  'history': () => import('@ant-design/icons-vue/HistoryOutlined'),
  'hourglass': () => import('@ant-design/icons-vue/HourglassOutlined'),
  'import': () => import('@ant-design/icons-vue/ImportOutlined'),
  'inbox': () => import('@ant-design/icons-vue/InboxOutlined'),
  'insurance': () => import('@ant-design/icons-vue/InsuranceOutlined'),
  'interaction': () => import('@ant-design/icons-vue/InteractionOutlined'),
  'issues': () => import('@ant-design/icons-vue/IssuesCloseOutlined'),
  'loading': () => import('@ant-design/icons-vue/LoadingOutlined'),
  'medicine': () => import('@ant-design/icons-vue/MedicineBoxOutlined'),
  'monitor': () => import('@ant-design/icons-vue/MonitorOutlined'),
  'notification': () => import('@ant-design/icons-vue/NotificationOutlined'),
  'paper': () => import('@ant-design/icons-vue/PaperClipOutlined'),
  'partition': () => import('@ant-design/icons-vue/PartitionOutlined'),
  'percentage': () => import('@ant-design/icons-vue/PercentageOutlined'),
  'profile': () => import('@ant-design/icons-vue/ProfileOutlined'),
  'project': () => import('@ant-design/icons-vue/ProjectOutlined'),
  'property': () => import('@ant-design/icons-vue/PropertySafetyOutlined'),
  'pushpin': () => import('@ant-design/icons-vue/PushpinOutlined'),
  'read': () => import('@ant-design/icons-vue/ReadOutlined'),
  'reconciliation': () => import('@ant-design/icons-vue/ReconciliationOutlined'),
  'red': () => import('@ant-design/icons-vue/RedEnvelopeOutlined'),
  'reload': () => import('@ant-design/icons-vue/ReloadOutlined'),
  'rest': () => import('@ant-design/icons-vue/RestOutlined'),
  'robot': () => import('@ant-design/icons-vue/RobotOutlined'),
  'save': () => import('@ant-design/icons-vue/SaveOutlined'),
  'schedule': () => import('@ant-design/icons-vue/ScheduleOutlined'),
  'select': () => import('@ant-design/icons-vue/SelectOutlined'),
  'send': () => import('@ant-design/icons-vue/SendOutlined'),
  'sketch': () => import('@ant-design/icons-vue/SketchOutlined'),
  'skin': () => import('@ant-design/icons-vue/SkinOutlined'),
  'solution': () => import('@ant-design/icons-vue/SolutionOutlined'),
  'sound': () => import('@ant-design/icons-vue/SoundOutlined'),
  'stock': () => import('@ant-design/icons-vue/StockOutlined'),
  'switcher': () => import('@ant-design/icons-vue/SwitcherOutlined'),
  'sync': () => import('@ant-design/icons-vue/SyncOutlined'),
  'team': () => import('@ant-design/icons-vue/TeamOutlined'),
  'trademark': () => import('@ant-design/icons-vue/TrademarkOutlined'),
  'transaction': () => import('@ant-design/icons-vue/TransactionOutlined'),
  'translation': () => import('@ant-design/icons-vue/TranslationOutlined'),
  'unit': () => import('@ant-design/icons-vue/GlobalOutlined'),
  'verified': () => import('@ant-design/icons-vue/CheckCircleOutlined'),
  'version': () => import('@ant-design/icons-vue/TagOutlined'),
  'vertical': () => import('@ant-design/icons-vue/VerticalAlignTopOutlined'),
  'warning': () => import('@ant-design/icons-vue/WarningOutlined')
}

// 菜单生成选项
interface MenuGeneratorOptions {
  // 是否显示图标
  showIcon?: boolean
  // 是否显示徽章
  showBadge?: boolean
  // 默认图标
  defaultIcon?: string
  // 图标前缀
  iconPrefix?: string
  // 是否启用国际化
  enableI18n?: boolean
  // 国际化前缀
  i18nPrefix?: string
  // 是否启用缓存
  enableCache?: boolean
  // 排序字段
  sortField?: keyof MenuItem
  // 排序方向
  sortOrder?: 'asc' | 'desc'
  // 最大深度
  maxDepth?: number
  // 过滤函数
  filter?: (menu: MenuItem) => boolean
  // 转换函数
  transform?: (menu: MenuItem) => MenuItem
}

// 默认选项
const DEFAULT_OPTIONS: Required<MenuGeneratorOptions> = {
  showIcon: true,
  showBadge: true,
  defaultIcon: 'menu',
  iconPrefix: '',
  enableI18n: false,
  i18nPrefix: 'menu',
  enableCache: true,
  sortField: 'order',
  sortOrder: 'asc',
  maxDepth: 10,
  filter: () => true,
  transform: (menu) => menu
}

/**
 * 菜单生成器类
 */
export class MenuGenerator {
  private options: Required<MenuGeneratorOptions>
  private iconCache = new Map<string, any>()
  private menuCache = new Map<string, MenuItem[]>()
  
  constructor(options: MenuGeneratorOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
  }
  
  /**
   * 更新选项
   */
  updateOptions(options: Partial<MenuGeneratorOptions>): void {
    this.options = { ...this.options, ...options }
    
    // 清除缓存
    if (!this.options.enableCache) {
      this.clearCache()
    }
  }
  
  /**
   * 生成菜单
   */
  async generateMenus(
    rawMenus: any[],
    user?: UserInfo,
    menuType?: MenuType
  ): Promise<MenuItem[]> {
    const cacheKey = this.getCacheKey(rawMenus, user, menuType)
    
    // 检查缓存
    if (this.options.enableCache && this.menuCache.has(cacheKey)) {
      return this.menuCache.get(cacheKey)!
    }
    
    // 转换原始菜单数据
    const menus = await this.transformRawMenus(rawMenus)
    
    // 过滤菜单
    const filteredMenus = this.filterMenus(menus, user)
    
    // 排序菜单
    const sortedMenus = this.sortMenus(filteredMenus)
    
    // 构建菜单树
    const menuTree = this.buildMenuTree(sortedMenus)
    
    // 处理图标
    const menusWithIcons = await this.processIcons(menuTree)
    
    // 应用转换
    const transformedMenus = this.applyTransform(menusWithIcons)
    
    // 缓存结果
    if (this.options.enableCache) {
      this.menuCache.set(cacheKey, transformedMenus)
    }
    
    return transformedMenus
  }
  
  /**
   * 转换原始菜单数据
   */
  private async transformRawMenus(rawMenus: any[]): Promise<MenuItem[]> {
    return rawMenus.map(raw => this.transformRawMenu(raw))
  }
  
  /**
   * 转换单个原始菜单
   */
  private transformRawMenu(raw: any): MenuItem {
    const menu: MenuItem = {
      key: raw.key || raw.id || raw.name,
      title: raw.title || raw.label || raw.name,
      path: raw.path || raw.route || raw.url,
      icon: raw.icon,
      order: raw.order || raw.sort || 0,
      type: raw.type || 'item',
      permission: raw.permission || 'public',
      roles: raw.roles || [],
      permissions: raw.permissions || [],
      hidden: raw.hidden || false,
      disabled: raw.disabled || false,
      badge: raw.badge,
      target: raw.target,
      external: raw.external || false,
      keepAlive: raw.keepAlive,
      affix: raw.affix,
      breadcrumb: raw.breadcrumb !== false,
      activeMenu: raw.activeMenu,
      noCache: raw.noCache,
      meta: raw.meta || {},
      children: raw.children ? raw.children.map((child: any) => this.transformRawMenu(child)) : undefined
    }
    
    return menu
  }
  
  /**
   * 过滤菜单
   */
  private filterMenus(menus: MenuItem[], user?: UserInfo): MenuItem[] {
    return menus
      .filter(menu => {
        // 应用自定义过滤器
        if (!this.options.filter(menu)) {
          return false
        }
        
        // 检查是否隐藏
        if (menu.hidden) {
          return false
        }
        
        // 检查权限
        if (user && !canAccessMenu(menu, user)) {
          return false
        }
        
        return true
      })
      .map(menu => {
        // 递归过滤子菜单
        if (menu.children && menu.children.length > 0) {
          const filteredChildren = this.filterMenus(menu.children, user)
          return {
            ...menu,
            children: filteredChildren.length > 0 ? filteredChildren : undefined
          }
        }
        return menu
      })
  }
  
  /**
   * 排序菜单
   */
  private sortMenus(menus: MenuItem[]): MenuItem[] {
    const sorted = [...menus].sort((a, b) => {
      const aValue = a[this.options.sortField] || 0
      const bValue = b[this.options.sortField] || 0
      
      if (this.options.sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1
      }
      return aValue > bValue ? 1 : -1
    })
    
    // 递归排序子菜单
    return sorted.map(menu => {
      if (menu.children && menu.children.length > 0) {
        return {
          ...menu,
          children: this.sortMenus(menu.children)
        }
      }
      return menu
    })
  }
  
  /**
   * 构建菜单树
   */
  private buildMenuTree(menus: MenuItem[], depth = 0): MenuItem[] {
    if (depth >= this.options.maxDepth) {
      return []
    }
    
    return menus.map(menu => {
      if (menu.children && menu.children.length > 0) {
        return {
          ...menu,
          children: this.buildMenuTree(menu.children, depth + 1)
        }
      }
      return menu
    })
  }
  
  /**
   * 处理图标
   */
  private async processIcons(menus: MenuItem[]): Promise<MenuItem[]> {
    const processMenu = async (menu: MenuItem): Promise<MenuItem> => {
      let processedMenu = { ...menu }
      
      if (this.options.showIcon) {
        // 处理图标
        if (menu.icon) {
          processedMenu.icon = await this.resolveIcon(menu.icon)
        } else if (this.options.defaultIcon) {
          processedMenu.icon = await this.resolveIcon(this.options.defaultIcon)
        }
      }
      
      // 递归处理子菜单
      if (menu.children && menu.children.length > 0) {
        processedMenu.children = await Promise.all(
          menu.children.map(child => processMenu(child))
        )
      }
      
      return processedMenu
    }
    
    return Promise.all(menus.map(menu => processMenu(menu)))
  }
  
  /**
   * 解析图标
   */
  private async resolveIcon(iconName: string): Promise<any> {
    if (!iconName) return null
    
    // 检查缓存
    if (this.iconCache.has(iconName)) {
      return this.iconCache.get(iconName)
    }
    
    try {
      // 添加前缀
      const fullIconName = this.options.iconPrefix + iconName
      
      // 从图标映射中获取
      const iconLoader = ICON_MAP[fullIconName] || ICON_MAP[iconName]
      
      if (iconLoader) {
        const IconComponent = await iconLoader()
        const icon = h(IconComponent.default || IconComponent)
        
        // 缓存图标
        this.iconCache.set(iconName, icon)
        return icon
      }
      
      // 如果没有找到，尝试直接使用字符串
      console.warn(`图标 "${iconName}" 未找到，使用默认图标`)
      return iconName
    } catch (error) {
      console.error(`加载图标 "${iconName}" 失败:`, error)
      return null
    }
  }
  
  /**
   * 应用转换
   */
  private applyTransform(menus: MenuItem[]): MenuItem[] {
    return menus.map(menu => {
      let transformedMenu = this.options.transform(menu)
      
      // 处理国际化
      if (this.options.enableI18n) {
        transformedMenu = {
          ...transformedMenu,
          title: `${this.options.i18nPrefix}.${transformedMenu.key}`
        }
      }
      
      // 递归处理子菜单
      if (transformedMenu.children && transformedMenu.children.length > 0) {
        transformedMenu.children = this.applyTransform(transformedMenu.children)
      }
      
      return transformedMenu
    })
  }
  
  /**
   * 生成缓存键
   */
  private getCacheKey(rawMenus: any[], user?: UserInfo, menuType?: MenuType): string {
    const menuHash = JSON.stringify(rawMenus)
    const userHash = user ? `${user.id}_${user.roles.join('_')}` : 'anonymous'
    const typeHash = menuType || 'default'
    const optionsHash = JSON.stringify(this.options)
    
    return `${menuHash}_${userHash}_${typeHash}_${optionsHash}`
  }
  
  /**
   * 清除缓存
   */
  clearCache(): void {
    this.menuCache.clear()
    this.iconCache.clear()
  }
  
  /**
   * 获取缓存统计
   */
  getCacheStats(): { menuCache: number; iconCache: number } {
    return {
      menuCache: this.menuCache.size,
      iconCache: this.iconCache.size
    }
  }
}

// 导出工具函数

/**
 * 创建菜单生成器实例
 */
export function createMenuGenerator(options?: MenuGeneratorOptions): MenuGenerator {
  return new MenuGenerator(options)
}

/**
 * 快速生成菜单
 */
export async function generateMenus(
  rawMenus: any[],
  user?: UserInfo,
  menuType?: MenuType,
  options?: MenuGeneratorOptions
): Promise<MenuItem[]> {
  const generator = createMenuGenerator(options)
  return generator.generateMenus(rawMenus, user, menuType)
}

/**
 * 从路由生成菜单
 */
export function generateMenusFromRoutes(
  routes: DynamicRoute[],
  options?: MenuGeneratorOptions
): Promise<MenuItem[]> {
  const rawMenus = routes
    .filter(route => route.meta?.menu !== false)
    .map(route => ({
      key: route.name || route.path,
      title: route.meta?.title || route.name,
      path: route.path,
      icon: route.meta?.icon,
      order: route.meta?.order || 0,
      permission: route.meta?.permission || 'public',
      roles: route.meta?.roles || [],
      permissions: route.meta?.permissions || [],
      hidden: route.meta?.hidden || false,
      badge: route.meta?.badge,
      meta: route.meta
    }))
  
  return generateMenus(rawMenus, undefined, undefined, options)
}

/**
 * 扁平化菜单
 */
export function flattenMenus(menus: MenuItem[]): MenuItem[] {
  const result: MenuItem[] = []
  
  const flatten = (items: MenuItem[]) => {
    items.forEach(item => {
      result.push({ ...item, children: undefined })
      if (item.children && item.children.length > 0) {
        flatten(item.children)
      }
    })
  }
  
  flatten(menus)
  return result
}

/**
 * 查找菜单项
 */
export function findMenuItem(
  menus: MenuItem[],
  predicate: (menu: MenuItem) => boolean
): MenuItem | null {
  for (const menu of menus) {
    if (predicate(menu)) {
      return menu
    }
    
    if (menu.children && menu.children.length > 0) {
      const found = findMenuItem(menu.children, predicate)
      if (found) {
        return found
      }
    }
  }
  
  return null
}

/**
 * 获取菜单路径
 */
export function getMenuPath(
  menus: MenuItem[],
  targetKey: string
): MenuItem[] {
  const path: MenuItem[] = []
  
  const findPath = (items: MenuItem[], target: string): boolean => {
    for (const item of items) {
      path.push(item)
      
      if (item.key === target) {
        return true
      }
      
      if (item.children && item.children.length > 0) {
        if (findPath(item.children, target)) {
          return true
        }
      }
      
      path.pop()
    }
    
    return false
  }
  
  findPath(menus, targetKey)
  return path
}

/**
 * 验证菜单结构
 */
export function validateMenus(menus: MenuItem[]): { valid: boolean; errors: string[] } {
  const errors: string[] = []
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
      
      // 检查类型
      if (item.type && !['item', 'group', 'divider'].includes(item.type)) {
        errors.push(`${currentPath}: 无效的 type "${item.type}"`)
      }
      
      // 检查权限级别
      if (item.permission && !['public', 'auth', 'role'].includes(item.permission)) {
        errors.push(`${currentPath}: 无效的 permission "${item.permission}"`)
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
    errors
  }
}

/**
 * 解析图标
 * @param iconName 图标名称
 * @returns 图标组件或默认图标
 */
export async function parseIcon(iconName: string): Promise<any> {
  if (!iconName) {
    // 返回默认图标
    const defaultIconLoader = ICON_MAP['menu']
    if (defaultIconLoader) {
      const iconModule = await defaultIconLoader()
      return iconModule.default
    }
    return null
  }

  // 查找对应的图标加载器
  const iconLoader = ICON_MAP[iconName.toLowerCase()]
  if (iconLoader) {
    try {
      const iconModule = await iconLoader()
      return iconModule.default
    } catch (error) {
      console.warn(`Failed to load icon: ${iconName}`, error)
      // 加载失败时返回默认图标
      const defaultIconLoader = ICON_MAP['menu']
      if (defaultIconLoader) {
        const iconModule = await defaultIconLoader()
        return iconModule.default
      }
    }
  } else {
    console.warn(`Icon not found: ${iconName}`)
    // 图标不存在时返回默认图标
    const defaultIconLoader = ICON_MAP['menu']
    if (defaultIconLoader) {
      const iconModule = await defaultIconLoader()
      return iconModule.default
    }
  }
  
  return null
}

// 导出类型和常量
export type { MenuGeneratorOptions }
export { ICON_MAP, DEFAULT_OPTIONS }