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
    <a-form
      v-bind="formProps"
      :class="formClass"
      :disabled="isFormDisabled"
      @finish="handleFinish"
      @finishFailed="handleFinishFailed"
      @fieldsChange="handleFieldsChange"
      @valuesChange="handleValuesChange"
    >
      <slot />
      
      <!-- 权限控制的提交按钮 -->
      <template v-if="showSubmitButton">
        <a-form-item v-if="submitButtonWrapperItem" v-bind="submitButtonWrapperItem">
          <PermissionButton
            :permission="submitPermission || permission"
            :role="submitRole || role"
            :permissions="submitPermissions || permissions"
            :roles="submitRoles || roles"
            :action="submitAction"
            :text="submitText"
            :loading="submitLoading"
            :disabled="submitDisabled"
            v-bind="submitButtonProps"
            @click="handleSubmit"
          />
        </a-form-item>
        <PermissionButton
          v-else
          :permission="submitPermission || permission"
          :role="submitRole || role"
          :permissions="submitPermissions || permissions"
          :roles="submitRoles || roles"
          :action="submitAction"
          :text="submitText"
          :loading="submitLoading"
          :disabled="submitDisabled"
          v-bind="submitButtonProps"
          @click="handleSubmit"
        />
      </template>
    </a-form>
    
    <template #disabled>
      <a-form
        v-bind="formProps"
        :class="[formClass, 'permission-form--disabled']"
        disabled
      >
        <slot name="disabled-content">
          <slot />
        </slot>
        
        <template v-if="showSubmitButton && showDisabledSubmit">
          <a-form-item v-if="submitButtonWrapperItem" v-bind="submitButtonWrapperItem">
            <a-button disabled v-bind="submitButtonProps">
              {{ disabledSubmitText || submitText }}
            </a-button>
          </a-form-item>
          <a-button v-else disabled v-bind="submitButtonProps">
            {{ disabledSubmitText || submitText }}
          </a-button>
        </template>
      </a-form>
    </template>
    
    <template #fallback>
      <slot name="fallback">
        <div :class="[formClass, 'permission-form--fallback']">
          <a-empty
            :description="fallbackText || '暂无权限访问此表单'"
            :image="Empty.PRESENTED_IMAGE_SIMPLE"
          >
            <template v-if="showFallbackAction">
              <a-button type="primary" @click="handleFallbackAction">
                {{ fallbackActionText }}
              </a-button>
            </template>
          </a-empty>
        </div>
      </slot>
    </template>
  </PermissionWrapper>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { Empty, message } from 'ant-design-vue'
import type { FormProps, FormItemProps, ButtonProps } from 'ant-design-vue'
import type { UserRole, PermissionLevel } from '@/types/auth'
import PermissionWrapper from './PermissionWrapper.vue'
import PermissionButton from './PermissionButton.vue'

// Props
interface Props {
  // 权限相关
  permission?: PermissionLevel
  role?: UserRole | UserRole[]
  permissions?: string[]
  roles?: UserRole[]
  action?: 'hide' | 'disable' | 'remove'
  reverse?: boolean
  
  // 表单相关
  model?: Record<string, any>
  rules?: Record<string, any>
  layout?: 'horizontal' | 'vertical' | 'inline'
  labelCol?: object
  wrapperCol?: object
  
  // 提交按钮相关
  showSubmitButton?: boolean
  submitPermission?: PermissionLevel
  submitRole?: UserRole | UserRole[]
  submitPermissions?: string[]
  submitRoles?: UserRole[]
  submitAction?: 'hide' | 'disable' | 'remove'
  submitText?: string
  submitLoading?: boolean
  submitDisabled?: boolean
  submitButtonProps?: Partial<ButtonProps>
  submitButtonWrapperItem?: Partial<FormItemProps>
  
  // 权限控制相关
  showNoPermissionTip?: boolean
  noPermissionText?: string
  showDisabled?: boolean
  disabledText?: string
  showDisabledSubmit?: boolean
  disabledSubmitText?: string
  showFallback?: boolean
  fallbackText?: string
  showFallbackAction?: boolean
  fallbackActionText?: string
  
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
  layout: 'horizontal',
  showSubmitButton: false,
  submitAction: 'disable',
  submitText: '提交',
  submitLoading: false,
  submitDisabled: false,
  showNoPermissionTip: false,
  noPermissionText: '暂无权限',
  showDisabled: true,
  disabledText: '无权限操作此表单',
  showDisabledSubmit: true,
  disabledSubmitText: '无权限提交',
  showFallback: false,
  fallbackText: '暂无权限访问此表单',
  showFallbackAction: false,
  fallbackActionText: '申请权限',
  debug: false,
  onAccessDenied: 'message'
})

// Emits
interface Emits {
  (e: 'finish', values: any): void
  (e: 'finishFailed', errorInfo: any): void
  (e: 'fieldsChange', changedFields: any, allFields: any): void
  (e: 'valuesChange', changedValues: any, allValues: any): void
  (e: 'submit', values: any): void
  (e: 'permission-change', hasAccess: boolean): void
  (e: 'access-denied', reason: string): void
  (e: 'fallback-action'): void
}

const emit = defineEmits<Emits>()

// 获取attrs，用于传递给表单
const attrs = useAttrs()

// 响应式数据
const hasPermission = ref(true)
const formRef = ref()

// 计算属性

/**
 * 表单属性
 */
const formProps = computed(() => {
  const { 
    permission, role, permissions, roles, action, reverse,
    showNoPermissionTip, noPermissionText, showDisabled, disabledText,
    showFallback, fallbackText, showFallbackAction, fallbackActionText,
    showSubmitButton, submitPermission, submitRole, submitPermissions, submitRoles,
    submitAction, submitText, submitLoading, submitDisabled, submitButtonProps,
    submitButtonWrapperItem, showDisabledSubmit, disabledSubmitText,
    customClass, debug, onAccessDenied,
    ...restProps 
  } = props
  
  return {
    ref: formRef,
    ...attrs,
    ...restProps
  }
})

/**
 * 表单是否禁用
 */
const isFormDisabled = computed(() => {
  return props.action === 'disable' && !hasPermission.value
})

/**
 * 表单CSS类
 */
const formClass = computed(() => {
  const classes = ['permission-form']
  
  if (props.customClass) {
    classes.push(props.customClass)
  }
  
  if (!hasPermission.value) {
    classes.push('permission-form--no-access')
  }
  
  return classes
})

// 方法

/**
 * 处理表单提交成功
 */
const handleFinish = (values: any) => {
  if (hasPermission.value) {
    emit('finish', values)
  }
}

/**
 * 处理表单提交失败
 */
const handleFinishFailed = (errorInfo: any) => {
  emit('finishFailed', errorInfo)
}

/**
 * 处理字段变化
 */
const handleFieldsChange = (changedFields: any, allFields: any) => {
  if (hasPermission.value) {
    emit('fieldsChange', changedFields, allFields)
  }
}

/**
 * 处理值变化
 */
const handleValuesChange = (changedValues: any, allValues: any) => {
  if (hasPermission.value) {
    emit('valuesChange', changedValues, allValues)
  }
}

/**
 * 处理提交按钮点击
 */
const handleSubmit = () => {
  if (formRef.value) {
    formRef.value.submit()
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
      console.warn(`[PermissionForm] 权限不足: ${reason}`)
      break
    case 'silent':
      // 静默处理
      break
  }
}

/**
 * 处理回退操作
 */
const handleFallbackAction = () => {
  emit('fallback-action')
  
  // 默认行为：显示申请权限提示
  if (props.onAccessDenied === 'message') {
    message.info('请联系管理员申请相关权限')
  }
}

// 暴露方法给父组件
defineExpose({
  formRef,
  submit: () => formRef.value?.submit(),
  validate: () => formRef.value?.validate(),
  validateFields: (fields?: string[]) => formRef.value?.validateFields(fields),
  resetFields: () => formRef.value?.resetFields(),
  clearValidate: (fields?: string[]) => formRef.value?.clearValidate(fields),
  setFieldsValue: (values: Record<string, any>) => formRef.value?.setFieldsValue(values),
  getFieldsValue: (fields?: string[]) => formRef.value?.getFieldsValue(fields)
})
</script>

<script lang="ts">
import { ref } from 'vue'

export default {
  name: 'PermissionForm'
}
</script>

<style lang="scss" scoped>
.permission-form {
  &--no-access {
    // 无权限时的样式
  }
  
  &--disabled {
    opacity: 0.6;
    
    :deep(.ant-form-item) {
      .ant-form-item-control-input {
        cursor: not-allowed;
      }
    }
  }
  
  &--fallback {
    padding: 40px 20px;
    text-align: center;
    background-color: #fafafa;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
  }
}

// 权限表单动画
.permission-form {
  transition: all 0.3s ease;
}
</style>