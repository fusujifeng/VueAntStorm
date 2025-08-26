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
    <a-button
      v-bind="buttonProps"
      :disabled="isButtonDisabled"
      :loading="loading"
      :class="buttonClass"
      @click="handleClick"
    >
      <template v-if="$slots.icon" #icon>
        <slot name="icon" />
      </template>
      <slot>{{ text }}</slot>
    </a-button>
    
    <template #disabled>
      <a-button
        v-bind="buttonProps"
        disabled
        :class="[buttonClass, 'permission-button--disabled']"
      >
        <template v-if="$slots.icon" #icon>
          <slot name="icon" />
        </template>
        <slot name="disabled-content">
          {{ disabledText || text }}
        </slot>
      </a-button>
    </template>
    
    <template #fallback>
      <slot name="fallback">
        <a-button
          v-if="showFallbackButton"
          v-bind="fallbackButtonProps"
          :class="[buttonClass, 'permission-button--fallback']"
          @click="handleFallbackClick"
        >
          <template #icon>
            <LockOutlined />
          </template>
          {{ fallbackText }}
        </a-button>
      </slot>
    </template>
  </PermissionWrapper>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { LockOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { ButtonProps } from 'ant-design-vue'
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
  
  // 按钮相关
  text?: string
  loading?: boolean
  disabled?: boolean
  
  // 权限控制相关
  showNoPermissionTip?: boolean
  noPermissionText?: string
  showDisabled?: boolean
  disabledText?: string
  showFallback?: boolean
  showFallbackButton?: boolean
  fallbackText?: string
  
  // 回退按钮属性
  fallbackButtonProps?: Partial<ButtonProps>
  
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
  loading: false,
  disabled: false,
  showNoPermissionTip: false,
  noPermissionText: '暂无权限',
  showDisabled: true,
  disabledText: '无权限操作',
  showFallback: false,
  showFallbackButton: false,
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

// 获取attrs，用于传递给按钮
const attrs = useAttrs()

// 响应式数据
const hasPermission = ref(true)

// 计算属性

/**
 * 按钮属性
 */
const buttonProps = computed(() => {
  const { 
    permission, role, permissions, roles, action, reverse,
    showNoPermissionTip, noPermissionText, showDisabled, disabledText,
    showFallback, showFallbackButton, fallbackText, fallbackButtonProps,
    customClass, debug, onAccessDenied, text, loading, disabled,
    ...restProps 
  } = props
  
  return {
    ...attrs,
    ...restProps
  }
})

/**
 * 按钮是否禁用
 */
const isButtonDisabled = computed(() => {
  return props.disabled || (props.action === 'disable' && !hasPermission.value)
})

/**
 * 按钮CSS类
 */
const buttonClass = computed(() => {
  const classes = ['permission-button']
  
  if (props.customClass) {
    classes.push(props.customClass)
  }
  
  if (!hasPermission.value) {
    classes.push('permission-button--no-access')
  }
  
  return classes
})

// 方法

/**
 * 处理按钮点击
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
      console.warn(`[PermissionButton] 权限不足: ${reason}`)
      break
    case 'silent':
      // 静默处理
      break
  }
}

/**
 * 处理回退按钮点击
 */
const handleFallbackClick = (event: MouseEvent) => {
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
  name: 'PermissionButton'
}
</script>

<style lang="scss" scoped>
.permission-button {
  &--no-access {
    // 无权限时的样式
  }
  
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    
    &:hover {
      opacity: 0.6;
    }
  }
  
  &--fallback {
    border-style: dashed;
    color: #999;
    
    &:hover {
      color: #666;
      border-color: #666;
    }
  }
}

// 权限按钮动画
.permission-button {
  transition: all 0.3s ease;
}
</style>