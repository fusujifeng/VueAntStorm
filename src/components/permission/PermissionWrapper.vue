<template>
  <div v-if="hasAccess && action !== 'remove'" :class="wrapperClass">
    <slot v-if="!isDisabled" />
    <div v-else class="permission-disabled-content">
      <slot name="disabled">
        <div class="permission-disabled-placeholder">
          <ExclamationCircleOutlined class="permission-disabled-icon" />
          <span class="permission-disabled-text">{{ disabledText }}</span>
        </div>
      </slot>
    </div>
  </div>
  
  <!-- 无权限时的占位内容 -->
  <div v-else-if="showFallback" class="permission-fallback">
    <slot name="fallback">
      <div v-if="showNoPermissionTip" class="permission-no-access">
        <LockOutlined class="permission-no-access-icon" />
        <span class="permission-no-access-text">{{ noPermissionText }}</span>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { ExclamationCircleOutlined, LockOutlined } from '@ant-design/icons-vue'
import type { UserRole, PermissionLevel } from '@/types/auth'
import { useAuthStore } from '@/stores/auth'
import { hasPermission, hasRole } from '@/utils/auth'

// Props
interface Props {
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
  // 是否显示无权限提示
  showNoPermissionTip?: boolean
  // 无权限提示文本
  noPermissionText?: string
  // 是否显示禁用状态
  showDisabled?: boolean
  // 禁用状态文本
  disabledText?: string
  // 是否显示回退内容
  showFallback?: boolean
  // 自定义CSS类
  customClass?: string
  // 是否启用调试模式
  debug?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  action: 'hide',
  reverse: false,
  showNoPermissionTip: false,
  noPermissionText: '暂无权限访问',
  showDisabled: true,
  disabledText: '功能已禁用',
  showFallback: false,
  debug: false
})

// Emits
interface Emits {
  (e: 'permission-change', hasAccess: boolean): void
  (e: 'access-denied', reason: string): void
}

const emit = defineEmits<Emits>()

// Composables
const authStore = useAuthStore()

// 计算属性
const user = computed(() => authStore.user)

/**
 * 检查权限
 */
const hasAccess = computed(() => {
  if (!user.value) {
    if (props.debug) {
      console.log('[PermissionWrapper] 用户未登录')
    }
    return false
  }

  let access = true
  const reasons: string[] = []

  // 检查权限级别
  if (props.permission) {
    const hasPermissionAccess = hasPermission(user.value, props.permission)
    if (!hasPermissionAccess) {
      reasons.push(`缺少权限: ${props.permission}`)
    }
    access = access && hasPermissionAccess
  }

  // 检查单个角色
  if (props.role) {
    const roles = Array.isArray(props.role) ? props.role : [props.role]
    const hasRoleAccess = roles.some(role => hasRole(user.value!, role))
    if (!hasRoleAccess) {
      reasons.push(`缺少角色: ${roles.join(' 或 ')}`)
    }
    access = access && hasRoleAccess
  }

  // 检查权限列表
  if (props.permissions && props.permissions.length > 0) {
    const missingPermissions: string[] = []
    for (const permission of props.permissions) {
      if (!hasPermission(user.value, permission as PermissionLevel)) {
        missingPermissions.push(permission)
      }
    }
    if (missingPermissions.length > 0) {
      reasons.push(`缺少权限: ${missingPermissions.join(', ')}`)
      access = false
    }
  }

  // 检查角色列表
  if (props.roles && props.roles.length > 0) {
    const hasRoleAccess = props.roles.some(role => hasRole(user.value!, role))
    if (!hasRoleAccess) {
      reasons.push(`缺少角色: ${props.roles.join(' 或 ')}`)
    }
    access = access && hasRoleAccess
  }

  // 反向权限检查
  if (props.reverse) {
    access = !access
    if (props.debug) {
      console.log('[PermissionWrapper] 反向权限检查，结果取反')
    }
  }

  // 调试信息
  if (props.debug) {
    console.log('[PermissionWrapper] 权限检查结果:', {
      access,
      reasons,
      user: user.value,
      props: {
        permission: props.permission,
        role: props.role,
        permissions: props.permissions,
        roles: props.roles,
        reverse: props.reverse
      }
    })
  }

  // 发射权限变化事件
  if (!access && reasons.length > 0) {
    emit('access-denied', reasons.join('; '))
  }

  return access
})

/**
 * 是否禁用状态
 */
const isDisabled = computed(() => {
  return !hasAccess.value && props.action === 'disable' && props.showDisabled
})

/**
 * 包装器CSS类
 */
const wrapperClass = computed(() => {
  const classes: string[] = ['permission-wrapper']
  
  if (props.customClass) {
    classes.push(props.customClass)
  }
  
  if (isDisabled.value) {
    classes.push('permission-wrapper--disabled')
  }
  
  if (!hasAccess.value) {
    classes.push('permission-wrapper--no-access')
  }
  
  return classes.join(' ')
})

// 监听权限变化
watchEffect(() => {
  emit('permission-change', hasAccess.value)
})
</script>

<style lang="scss" scoped>
.permission-wrapper {
  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }
  
  &--no-access {
    // 可以添加无权限时的样式
  }
}

.permission-disabled-content {
  position: relative;
}

.permission-disabled-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background-color: #f5f5f5;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  color: #999;
  font-size: 14px;
  
  .permission-disabled-icon {
    font-size: 16px;
    color: #faad14;
  }
  
  .permission-disabled-text {
    user-select: none;
  }
}

.permission-fallback {
  // 回退内容样式
}

.permission-no-access {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background-color: #fff2f0;
  border: 1px dashed #ffccc7;
  border-radius: 6px;
  color: #ff4d4f;
  font-size: 14px;
  
  .permission-no-access-icon {
    font-size: 16px;
  }
  
  .permission-no-access-text {
    user-select: none;
  }
}

// 动画效果
.permission-wrapper {
  transition: opacity 0.3s ease;
}

.permission-disabled-placeholder,
.permission-no-access {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>