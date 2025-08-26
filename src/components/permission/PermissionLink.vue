<template>
  <PermissionWrapper
    :permission="permission"
    :role="role"
    :permissions="permissions"
    :roles="roles"
    :action="action"
    :reverse="reverse"
    :show-no-permission-tip="showNoPermissionTip"
    :no-permission-text="noPermissionText"
    :show-disabled="showDisabled"
    :disabled-text="disabledText"
    :show-fallback="showFallback"
    :debug="debug"
    @permission-change="handlePermissionChange"
    @access-denied="handleAccessDenied"
  >
    <component
      :is="linkComponent"
      v-bind="linkProps"
      :class="linkClass"
      @click="handleClick"
    >
      <template v-if="$slots.icon" #icon>
        <slot name="icon" />
      </template>
      <slot>{{ text }}</slot>
    </component>
    
    <template #disabled>
      <span
        :class="[linkClass, 'permission-link--disabled']"
        :title="disabledText || noPermissionText"
      >
        <template v-if="$slots.icon">
          <slot name="icon" />
        </template>
        <slot name="disabled-content">
          {{ disabledText || text }}
        </slot>
      </span>
    </template>
    
    <template #fallback>
      <slot name="fallback">
        <span
          v-if="showFallbackText"
          :class="[linkClass, 'permission-link--fallback']"
          :title="fallbackText"
          @click="handleFallbackClick"
        >
          <LockOutlined />
          {{ fallbackText }}
        </span>
      </slot>
    </template>
  </PermissionWrapper>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { LockOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { UserRole, PermissionLevel } from '@/types/auth'
import PermissionWrapper from './PermissionWrapper.vue'

// Props
interface Props {
  // 权限相关
  permission?: PermissionLevel
  role?: UserRole | UserRole[]
  permissions?: string[]
  roles?: UserRole[]
  action?: 'hide' | 'disable' | 'remove'
  reverse?: boolean
  
  // 链接相关
  to?: string | object
  href?: string
  text?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  external?: boolean
  
  // 权限控制相关
  showNoPermissionTip?: boolean
  noPermissionText?: string
  showDisabled?: boolean
  disabledText?: string
  showFallback?: boolean
  showFallbackText?: boolean
  fallbackText?: string
  
  // 自定义类名
  customClass?: string
  
  // 调试模式
  debug?: boolean
  
  // 权限检查失败时的行为
  onAccessDenied?: 'message' | 'console' | 'silent'
}

const props = withDefaults(defineProps<Props>(), {
  action: 'disable',
  reverse: false,
  target: '_self',
  external: false,
  showNoPermissionTip: false,
  noPermissionText: '暂无权限',
  showDisabled: true,
  disabledText: '无权限访问',
  showFallback: false,
  showFallbackText: false,
  fallbackText: '权限不足',
  debug: false,
  onAccessDenied: 'message'
})

// Emits
interface Emits {
  (e: 'click', event: MouseEvent): void
  (e: 'permission-change', hasAccess: boolean): void
  (e: 'access-denied', reason: string): void
  (e: 'fallback-click', event: MouseEvent): void
}

const emit = defineEmits<Emits>()

// 获取attrs，用于传递给链接
const attrs = useAttrs()

// 响应式数据
const hasPermission = ref(true)

// 计算属性

/**
 * 链接组件类型
 */
const linkComponent = computed(() => {
  if (props.external || props.href) {
    return 'a'
  }
  if (props.to) {
    return 'router-link'
  }
  return 'a'
})

/**
 * 链接属性
 */
const linkProps = computed(() => {
  const { 
    permission, role, permissions, roles, action, reverse,
    showNoPermissionTip, noPermissionText, showDisabled, disabledText,
    showFallback, showFallbackText, fallbackText,
    customClass, debug, onAccessDenied, text,
    ...restProps 
  } = props
  
  const baseProps = {
    ...attrs,
    ...restProps
  }
  
  if (props.external || props.href) {
    return {
      ...baseProps,
      href: props.href,
      target: props.target,
      rel: props.target === '_blank' ? 'noopener noreferrer' : undefined
    }
  }
  
  if (props.to) {
    return {
      ...baseProps,
      to: props.to,
      target: props.target
    }
  }
  
  return baseProps
})

/**
 * 链接CSS类
 */
const linkClass = computed(() => {
  const classes = ['permission-link']
  
  if (props.customClass) {
    classes.push(props.customClass)
  }
  
  if (!hasPermission.value) {
    classes.push('permission-link--no-access')
  }
  
  if (props.external) {
    classes.push('permission-link--external')
  }
  
  return classes
})

// 方法

/**
 * 处理链接点击
 */
const handleClick = (event: MouseEvent) => {
  if (hasPermission.value) {
    emit('click', event)
  } else {
    // 无权限时的处理
    event.preventDefault()
    event.stopPropagation()
    
    if (props.onAccessDenied === 'message') {
      message.warning(props.noPermissionText)
    }
  }
}

/**
 * 处理权限变化
 */
const handlePermissionChange = (access: boolean) => {
  hasPermission.value = access
  emit('permission-change', access)
}

/**
 * 处理权限拒绝
 */
const handleAccessDenied = (reason: string) => {
  emit('access-denied', reason)
  
  switch (props.onAccessDenied) {
    case 'message':
      message.warning(`权限不足: ${reason}`)
      break
    case 'console':
      console.warn(`[PermissionLink] 权限不足: ${reason}`)
      break
    case 'silent':
      // 静默处理
      break
  }
}

/**
 * 处理回退链接点击
 */
const handleFallbackClick = (event: MouseEvent) => {
  event.preventDefault()
  emit('fallback-click', event)
  
  // 默认行为：显示权限不足提示
  if (props.onAccessDenied === 'message') {
    message.warning(props.fallbackText)
  }
}
</script>

<script lang="ts">
import { ref } from 'vue'

export default {
  name: 'PermissionLink'
}
</script>

<style lang="scss" scoped>
.permission-link {
  color: #1890ff;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: #40a9ff;
  }
  
  &--no-access {
    // 无权限时的样式
  }
  
  &--disabled {
    color: #d9d9d9;
    cursor: not-allowed;
    
    &:hover {
      color: #d9d9d9;
    }
  }
  
  &--fallback {
    color: #999;
    cursor: help;
    border-bottom: 1px dashed #ccc;
    
    &:hover {
      color: #666;
      border-bottom-color: #999;
    }
    
    .anticon {
      margin-right: 4px;
    }
  }
  
  &--external {
    &::after {
      content: '↗';
      margin-left: 4px;
      font-size: 12px;
      opacity: 0.6;
    }
  }
}

// 权限链接动画
.permission-link {
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 0;
    height: 1px;
    background-color: currentColor;
    transition: width 0.3s ease;
  }
  
  &:hover::before {
    width: 100%;
  }
  
  &--disabled::before,
  &--fallback::before {
    display: none;
  }
}
</style>