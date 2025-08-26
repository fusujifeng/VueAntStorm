import type { App, DirectiveBinding } from 'vue'
import type { UserRole, PermissionLevel } from '@/types/auth'
import { useAuthStore } from '@/stores/auth'
import { hasPermission, hasRole } from '@/utils/auth'

/**
 * 权限指令参数类型
 */
interface PermissionDirectiveValue {
  // 权限级别
  permission?: PermissionLevel
  // 角色
  role?: UserRole | UserRole[]
  // 权限列表
  permissions?: string[]
  // 角色列表
  roles?: UserRole[]
  // 操作类型：hide(隐藏) | disable(禁用) | remove(移除)
  action?: 'hide' | 'disable' | 'remove'
  // 反向权限检查
  reverse?: boolean
}

/**
 * 权限指令实现
 */
class PermissionDirective {
  private getAuthStore() {
    return useAuthStore()
  }

  /**
   * 检查权限
   */
  private checkPermission(value: PermissionDirectiveValue): boolean {
    const authStore = this.getAuthStore()
    const user = authStore.user
    if (!user) return false

    let hasAccess = true

    // 检查权限级别
    if (value.permission) {
      hasAccess = hasAccess && hasPermission(user, value.permission)
    }

    // 检查单个角色
    if (value.role) {
      const roles = Array.isArray(value.role) ? value.role : [value.role]
      hasAccess = hasAccess && roles.some(role => hasRole(user, role))
    }

    // 检查权限列表
    if (value.permissions && value.permissions.length > 0) {
      hasAccess = hasAccess && value.permissions.every(permission => 
        hasPermission(user, permission as PermissionLevel)
      )
    }

    // 检查角色列表
    if (value.roles && value.roles.length > 0) {
      hasAccess = hasAccess && value.roles.some(role => hasRole(user, role))
    }

    // 反向权限检查
    if (value.reverse) {
      hasAccess = !hasAccess
    }

    return hasAccess
  }

  /**
   * 应用权限控制
   */
  private applyPermissionControl(el: HTMLElement, value: PermissionDirectiveValue, hasAccess: boolean) {
    const action = value.action || 'hide'

    if (hasAccess) {
      // 有权限时恢复元素
      this.restoreElement(el)
    } else {
      // 无权限时根据action处理
      switch (action) {
        case 'hide':
          this.hideElement(el)
          break
        case 'disable':
          this.disableElement(el)
          break
        case 'remove':
          this.removeElement(el)
          break
      }
    }
  }

  /**
   * 隐藏元素
   */
  private hideElement(el: HTMLElement) {
    el.style.display = 'none'
    el.setAttribute('data-permission-hidden', 'true')
  }

  /**
   * 禁用元素
   */
  private disableElement(el: HTMLElement) {
    // 保存原始状态
    if (!el.hasAttribute('data-permission-original-disabled')) {
      el.setAttribute('data-permission-original-disabled', el.getAttribute('disabled') || 'false')
    }
    
    // 禁用元素
    el.setAttribute('disabled', 'true')
    el.style.pointerEvents = 'none'
    el.style.opacity = '0.5'
    el.setAttribute('data-permission-disabled', 'true')
    
    // 对于按钮和输入框特殊处理
    if (el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
      (el as HTMLInputElement).disabled = true
    }
  }

  /**
   * 移除元素
   */
  private removeElement(el: HTMLElement) {
    // 保存原始父节点和位置
    if (!el.hasAttribute('data-permission-removed')) {
      const parent = el.parentNode
      const nextSibling = el.nextSibling
      
      if (parent) {
        // 创建占位符注释节点
        const placeholder = document.createComment('permission-removed-placeholder')
        parent.insertBefore(placeholder, el)
        
        // 保存恢复信息
        el.setAttribute('data-permission-parent', parent.toString())
        el.setAttribute('data-permission-placeholder', placeholder.toString())
        
        // 移除元素
        parent.removeChild(el)
        el.setAttribute('data-permission-removed', 'true')
      }
    }
  }

  /**
   * 恢复元素
   */
  private restoreElement(el: HTMLElement) {
    // 恢复隐藏的元素
    if (el.hasAttribute('data-permission-hidden')) {
      el.style.display = ''
      el.removeAttribute('data-permission-hidden')
    }

    // 恢复禁用的元素
    if (el.hasAttribute('data-permission-disabled')) {
      const originalDisabled = el.getAttribute('data-permission-original-disabled')
      
      if (originalDisabled === 'false' || originalDisabled === null) {
        el.removeAttribute('disabled')
        if (el.tagName === 'BUTTON' || el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
          (el as HTMLInputElement).disabled = false
        }
      }
      
      el.style.pointerEvents = ''
      el.style.opacity = ''
      el.removeAttribute('data-permission-disabled')
      el.removeAttribute('data-permission-original-disabled')
    }

    // 注意：移除的元素无法直接恢复，需要重新渲染组件
  }

  /**
   * 指令绑定时执行
   */
  mounted(el: HTMLElement, binding: DirectiveBinding<PermissionDirectiveValue>) {
    const value = binding.value
    if (!value) return

    const hasAccess = this.checkPermission(value)
    this.applyPermissionControl(el, value, hasAccess)
  }

  /**
   * 指令更新时执行
   */
  updated(el: HTMLElement, binding: DirectiveBinding<PermissionDirectiveValue>) {
    const value = binding.value
    if (!value) return

    const hasAccess = this.checkPermission(value)
    this.applyPermissionControl(el, value, hasAccess)
  }

  /**
   * 指令卸载时执行
   */
  unmounted(el: HTMLElement) {
    // 清理权限相关的属性
    el.removeAttribute('data-permission-hidden')
    el.removeAttribute('data-permission-disabled')
    el.removeAttribute('data-permission-removed')
    el.removeAttribute('data-permission-original-disabled')
    el.removeAttribute('data-permission-parent')
    el.removeAttribute('data-permission-placeholder')
  }
}

// 创建指令实例
const permissionDirective = new PermissionDirective()

/**
 * v-permission 指令
 * 
 * 用法示例：
 * 
 * 1. 基于权限级别：
 * <button v-permission="{ permission: 'admin' }">管理员按钮</button>
 * 
 * 2. 基于角色：
 * <div v-permission="{ role: 'admin' }">管理员内容</div>
 * <div v-permission="{ role: ['admin', 'manager'] }">管理员或经理内容</div>
 * 
 * 3. 基于权限列表：
 * <button v-permission="{ permissions: ['user:create', 'user:edit'] }">用户管理</button>
 * 
 * 4. 基于角色列表：
 * <div v-permission="{ roles: ['admin', 'manager'] }">管理内容</div>
 * 
 * 5. 指定操作类型：
 * <button v-permission="{ role: 'admin', action: 'disable' }">禁用按钮</button>
 * <div v-permission="{ role: 'admin', action: 'remove' }">移除内容</div>
 * 
 * 6. 反向权限检查：
 * <div v-permission="{ role: 'guest', reverse: true }">非访客内容</div>
 * 
 * 7. 组合使用：
 * <button v-permission="{ 
 *   permission: 'write', 
 *   role: ['admin', 'editor'], 
 *   action: 'disable' 
 * }">编辑按钮</button>
 */
export const vPermission = {
  mounted: permissionDirective.mounted.bind(permissionDirective),
  updated: permissionDirective.updated.bind(permissionDirective),
  unmounted: permissionDirective.unmounted.bind(permissionDirective)
}

/**
 * v-role 指令（简化版权限指令）
 * 
 * 用法示例：
 * <div v-role="'admin'">管理员内容</div>
 * <div v-role="['admin', 'manager']">管理员或经理内容</div>
 */
export const vRole = {
  mounted(el: HTMLElement, binding: DirectiveBinding<UserRole | UserRole[]>) {
    const roles = Array.isArray(binding.value) ? binding.value : [binding.value]
    const value: PermissionDirectiveValue = { roles }
    permissionDirective.mounted(el, { ...binding, value })
  },
  updated(el: HTMLElement, binding: DirectiveBinding<UserRole | UserRole[]>) {
    const roles = Array.isArray(binding.value) ? binding.value : [binding.value]
    const value: PermissionDirectiveValue = { roles }
    permissionDirective.updated(el, { ...binding, value })
  },
  unmounted: permissionDirective.unmounted.bind(permissionDirective)
}

/**
 * 权限指令插件
 */
export const PermissionDirectivePlugin = {
  install(app: App) {
    app.directive('permission', vPermission)
    app.directive('role', vRole)
  }
}

// 导出别名，用于 main.ts 中的导入
export const permissionDirectives = PermissionDirectivePlugin

export default PermissionDirectivePlugin