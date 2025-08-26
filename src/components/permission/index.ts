/**
 * 权限组件统一导出
 */

// 权限包装器组件
export { default as PermissionWrapper } from './PermissionWrapper.vue'

// 权限按钮组件
export { default as PermissionButton } from './PermissionButton.vue'

// 权限链接组件
export { default as PermissionLink } from './PermissionLink.vue'

// 权限表单组件
export { default as PermissionForm } from './PermissionForm.vue'

// 权限指令
export * from '@/directives/permission'

// 类型定义
export type {
  UserRole,
  PermissionLevel,
  UserPermissions,
  AuthUser,
  LoginCredentials,
  AuthState
} from '@/types/auth'