import { ref, type Ref } from 'vue'

export interface UseModalOptions {
  /** 初始状态，默认为false */
  initialVisible?: boolean
  /** 确认回调函数 */
  onOk?: () => void | Promise<void>
  /** 取消回调函数 */
  onCancel?: () => void
  /** 关闭前的回调函数，返回false可阻止关闭 */
  beforeClose?: () => boolean | Promise<boolean>
}

export interface UseModalReturn {
  /** 模态框显示状态 */
  visible: Ref<boolean>
  /** 打开模态框 */
  open: () => void
  /** 关闭模态框 */
  close: () => void
  /** 切换模态框状态 */
  toggle: () => void
  /** 确认处理函数 */
  handleOk: () => Promise<void>
  /** 取消处理函数 */
  handleCancel: () => void
}

/**
 * 模态框组合式API
 * @param options 配置选项
 * @returns 模态框相关的状态和方法
 */
export function useModal(options: UseModalOptions = {}): UseModalReturn {
  const {
    initialVisible = false,
    onOk,
    onCancel,
    beforeClose
  } = options

  // 模态框显示状态
  const visible = ref<boolean>(initialVisible)

  // 打开模态框
  const open = () => {
    visible.value = true
  }

  // 关闭模态框
  const close = async () => {
    // 如果有关闭前的回调，先执行
    if (beforeClose) {
      const canClose = await beforeClose()
      if (!canClose) return
    }
    visible.value = false
  }

  // 切换模态框状态
  const toggle = () => {
    if (visible.value) {
      close()
    } else {
      open()
    }
  }

  // 确认处理函数
  const handleOk = async () => {
    try {
      if (onOk) {
        await onOk()
      }
      await close()
    } catch (error) {
      console.error('Modal ok handler error:', error)
      // 如果确认回调出错，不关闭模态框
    }
  }

  // 取消处理函数
  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    close()
  }

  return {
    visible,
    open,
    close,
    toggle,
    handleOk,
    handleCancel
  }
}

// 导出一些常用的预设配置
export const useConfirmModal = (onConfirm: () => void | Promise<void>) => {
  return useModal({
    onOk: onConfirm
  })
}

export const useFormModal = (onSubmit: () => void | Promise<void>) => {
  return useModal({
    onOk: onSubmit,
    beforeClose: () => {
      // 可以在这里添加表单验证逻辑
      return true
    }
  })
}