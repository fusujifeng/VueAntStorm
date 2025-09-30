import { ref, reactive, type Ref } from 'vue'
import { Form } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'

export interface FormField {
  /** 字段名 */
  name: string
  /** 字段标签 */
  label: string
  /** 字段类型 */
  type: 'input' | 'textarea' | 'select' | 'date' | 'number' | 'password' | 'email'
  /** 验证规则 */
  rules?: Rule[]
  /** 选项（用于select类型） */
  options?: Array<{ label: string; value: any }>
  /** 占位符 */
  placeholder?: string
  /** 是否必填 */
  required?: boolean
  /** 默认值 */
  defaultValue?: any
}

export interface UseFormModalOptions {
  /** 表单字段配置 */
  fields: FormField[]
  /** 初始表单数据 */
  initialValues?: Record<string, any>
  /** 提交回调函数 */
  onSubmit?: (values: Record<string, any>) => void | Promise<void>
  /** 取消回调函数 */
  onCancel?: () => void
  /** 表单验证失败回调 */
  onValidationError?: (errors: any) => void
  /** 是否在提交成功后重置表单 */
  resetOnSuccess?: boolean
  /** 是否在取消时重置表单 */
  resetOnCancel?: boolean
}

export interface UseFormModalReturn {
  /** 模态框显示状态 */
  visible: Ref<boolean>
  /** 表单数据 */
  formData: Record<string, any>
  /** 表单验证规则 */
  formRules: Record<string, Rule[]>
  /** 表单实例引用 */
  formRef: Ref<any>
  /** 提交加载状态 */
  loading: Ref<boolean>
  /** 打开模态框 */
  open: (initialData?: Record<string, any>) => void
  /** 关闭模态框 */
  close: () => void
  /** 重置表单 */
  resetForm: () => void
  /** 验证表单 */
  validateForm: () => Promise<boolean>
  /** 提交表单 */
  handleSubmit: () => Promise<void>
  /** 取消操作 */
  handleCancel: () => void
  /** 设置表单字段值 */
  setFieldValue: (field: string, value: any) => void
  /** 获取表单字段值 */
  getFieldValue: (field: string) => any
  /** 设置表单字段错误 */
  setFieldError: (field: string, error: string) => void
  /** 清除表单字段错误 */
  clearFieldError: (field: string) => void
}

/**
 * 表单模态框组合式API
 * @param options 配置选项
 * @returns 表单模态框相关的状态和方法
 */
export function useFormModal(options: UseFormModalOptions): UseFormModalReturn {
  const {
    fields,
    initialValues = {},
    onSubmit,
    onCancel,
    onValidationError,
    resetOnSuccess = true,
    resetOnCancel = false
  } = options

  // 模态框显示状态
  const visible = ref<boolean>(false)
  
  // 提交加载状态
  const loading = ref<boolean>(false)
  
  // 表单实例引用
  const formRef = ref<any>(null)

  // 初始化表单数据
  const initFormData = () => {
    const data: Record<string, any> = {}
    fields.forEach(field => {
      data[field.name] = initialValues[field.name] ?? field.defaultValue ?? ''
    })
    return data
  }

  // 表单数据
  const formData = reactive<Record<string, any>>(initFormData())

  // 构建表单验证规则
  const formRules = reactive<Record<string, Rule[]>>({})
  fields.forEach(field => {
    const rules: Rule[] = []
    
    // 必填验证
    if (field.required) {
      rules.push({
        required: true,
        message: `请输入${field.label}`,
        trigger: ['blur', 'change']
      })
    }
    
    // 类型验证
    if (field.type === 'email') {
      rules.push({
        type: 'email',
        message: '请输入正确的邮箱格式',
        trigger: ['blur', 'change']
      })
    }
    
    // 自定义规则
    if (field.rules) {
      rules.push(...field.rules)
    }
    
    if (rules.length > 0) {
      formRules[field.name] = rules
    }
  })

  // 打开模态框
  const open = (initialData?: Record<string, any>) => {
    visible.value = true
    
    // 如果提供了初始数据，则填充表单
    if (initialData) {
      Object.keys(initialData).forEach(key => {
        if (formData.hasOwnProperty(key)) {
          formData[key] = initialData[key]
        }
      })
    }
  }

  // 关闭模态框
  const close = () => {
    visible.value = false
    loading.value = false
  }

  // 重置表单
  const resetForm = () => {
    // 重置表单数据
    const initialData = initFormData()
    Object.keys(formData).forEach(key => {
      formData[key] = initialData[key]
    })
    
    // 清除验证错误
    if (formRef.value) {
      formRef.value.clearValidate()
    }
  }

  // 验证表单
  const validateForm = async (): Promise<boolean> => {
    if (!formRef.value) return false
    
    try {
      await formRef.value.validate()
      return true
    } catch (error) {
      if (onValidationError) {
        onValidationError(error)
      }
      return false
    }
  }

  // 提交表单
  const handleSubmit = async () => {
    if (loading.value) return
    
    // 验证表单
    const isValid = await validateForm()
    if (!isValid) return
    
    loading.value = true
    
    try {
      if (onSubmit) {
        await onSubmit({ ...formData })
      }
      
      // 提交成功后的处理
      if (resetOnSuccess) {
        resetForm()
      }
      
      close()
    } catch (error) {
      console.error('Form submission error:', error)
      // 提交失败时不关闭模态框
    } finally {
      loading.value = false
    }
  }

  // 取消操作
  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    
    if (resetOnCancel) {
      resetForm()
    }
    
    close()
  }

  // 设置表单字段值
  const setFieldValue = (field: string, value: any) => {
    if (formData.hasOwnProperty(field)) {
      formData[field] = value
    }
  }

  // 获取表单字段值
  const getFieldValue = (field: string) => {
    return formData[field]
  }

  // 设置表单字段错误
  const setFieldError = (field: string, error: string) => {
    if (formRef.value) {
      formRef.value.setFields([{
        name: field,
        errors: [error]
      }])
    }
  }

  // 清除表单字段错误
  const clearFieldError = (field: string) => {
    if (formRef.value) {
      formRef.value.clearValidate(field)
    }
  }

  return {
    visible,
    formData,
    formRules,
    formRef,
    loading,
    open,
    close,
    resetForm,
    validateForm,
    handleSubmit,
    handleCancel,
    setFieldValue,
    getFieldValue,
    setFieldError,
    clearFieldError
  }
}

// 预设配置：用户信息表单
export const useUserFormModal = (onSubmit?: (values: any) => void | Promise<void>) => {
  return useFormModal({
    fields: [
      {
        name: 'username',
        label: '用户名',
        type: 'input',
        required: true,
        placeholder: '请输入用户名',
        rules: [
          { min: 3, max: 20, message: '用户名长度应在3-20个字符之间' }
        ]
      },
      {
        name: 'email',
        label: '邮箱',
        type: 'email',
        required: true,
        placeholder: '请输入邮箱地址'
      },
      {
        name: 'phone',
        label: '手机号',
        type: 'input',
        required: true,
        placeholder: '请输入手机号',
        rules: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' }
        ]
      },
      {
        name: 'role',
        label: '角色',
        type: 'select',
        required: true,
        options: [
          { label: '管理员', value: 'admin' },
          { label: '普通用户', value: 'user' },
          { label: '访客', value: 'guest' }
        ]
      },
      {
        name: 'description',
        label: '描述',
        type: 'textarea',
        placeholder: '请输入用户描述'
      }
    ],
    onSubmit,
    resetOnSuccess: true
  })
}

// 预设配置：产品信息表单
export const useProductFormModal = (onSubmit?: (values: any) => void | Promise<void>) => {
  return useFormModal({
    fields: [
      {
        name: 'name',
        label: '产品名称',
        type: 'input',
        required: true,
        placeholder: '请输入产品名称'
      },
      {
        name: 'price',
        label: '价格',
        type: 'number',
        required: true,
        placeholder: '请输入价格',
        rules: [
          { type: 'number', min: 0, message: '价格不能小于0' }
        ]
      },
      {
        name: 'category',
        label: '分类',
        type: 'select',
        required: true,
        options: [
          { label: '电子产品', value: 'electronics' },
          { label: '服装', value: 'clothing' },
          { label: '食品', value: 'food' },
          { label: '图书', value: 'books' }
        ]
      },
      {
        name: 'description',
        label: '产品描述',
        type: 'textarea',
        placeholder: '请输入产品描述'
      }
    ],
    onSubmit,
    resetOnSuccess: true
  })
}