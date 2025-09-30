<template>
  <div class="composition-demo">
    <div class="demo-header">
      <h1>Vue2 vs Vue3 组合式API对比</h1>
      <p>从Vue2选项式API到Vue3组合式API的进化</p>
    </div>

    <!-- useModal 对比演示 -->
    <div class="comparison-section">
      <h2>模态框管理：Vue2 vs Vue3</h2>
      
      <div class="code-comparison">
        <!-- Vue2 写法 -->
        <div class="vue2-code">
          <h3>Vue2 选项式API写法</h3>
          <pre><code>{{ vue2Code }}</code></pre>
        </div>

        <!-- Vue3 写法 -->
        <div class="vue3-code">
          <h3>Vue3 组合式API写法</h3>
          <pre><code>{{ vue3Code }}</code></pre>
        </div>
      </div>

      <!-- 实际演示 -->
      <div class="demo-buttons">
        <a-button type="primary" @click="userModal.open">
          用户信息模态框
        </a-button>
        <a-button type="primary" @click="uploadModal.open">
          文件上传模态框
        </a-button>
        <a-button type="primary" @click="confirmModal.open">
          确认操作模态框
        </a-button>
      </div>
    </div>

    <!-- 组合式API优势说明 -->
    <div class="advantages-section">
      <h2>组合式API的优势</h2>
      <div class="advantages-grid">
        <div class="advantage-card">
          <h3>🔧 逻辑复用</h3>
          <p>可以将相关逻辑封装成可复用的函数，在多个组件间共享</p>
        </div>
        <div class="advantage-card">
          <h3>📦 更好的组织</h3>
          <p>相关的状态和方法可以组织在一起，而不是分散在data、methods等选项中</p>
        </div>
        <div class="advantage-card">
          <h3>🎯 TypeScript支持</h3>
          <p>更好的类型推断和类型安全，IDE智能提示更准确</p>
        </div>
        <div class="advantage-card">
          <h3>🚀 性能优化</h3>
          <p>更细粒度的响应式系统，按需引入，打包体积更小</p>
        </div>
      </div>
    </div>

    <!-- useModal详细解析 -->
    <div class="usemodal-analysis">
      <h2>useModal 组合式API详解</h2>
      
      <div class="analysis-content">
        <div class="structure-explanation">
          <h3>1. 函数结构</h3>
          <pre><code>{{ useModalStructure }}</code></pre>
        </div>

        <div class="usage-examples">
          <h3>2. 使用示例</h3>
          <pre><code>{{ usageExamples }}</code></pre>
        </div>

        <div class="advanced-usage">
          <h3>3. 高级用法</h3>
          <pre><code>{{ advancedUsage }}</code></pre>
        </div>
      </div>
    </div>

    <!-- 实际模态框演示 -->
    <!-- 用户信息模态框 -->
    <a-modal
      title="用户信息"
      v-model:open="userModal.visible.value"
      @ok="userModal.handleOk"
      @cancel="userModal.handleCancel"
    >
      <a-form :model="userForm" layout="vertical">
        <a-form-item label="用户名">
          <a-input v-model:value="userForm.username" />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-model:value="userForm.email" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 文件上传模态框 -->
    <a-modal
      title="文件上传"
      v-model:open="uploadModal.visible.value"
      @ok="uploadModal.handleOk"
      @cancel="uploadModal.handleCancel"
    >
      <a-upload :file-list="fileList" :before-upload="beforeUpload">
        <a-button>选择文件</a-button>
      </a-upload>
    </a-modal>

    <!-- 确认操作模态框 -->
    <a-modal
      title="确认操作"
      v-model:open="confirmModal.visible.value"
      @ok="confirmModal.handleOk"
      @cancel="confirmModal.handleCancel"
    >
      <p>确定要执行此操作吗？</p>
      <p style="color: #ff4d4f;">此操作不可撤销</p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { useModal, useFormModal, useConfirmModal } from '@/composables/useModal'

// 用户表单数据
const userForm = reactive({
  username: '',
  email: ''
})

// 文件列表
const fileList = ref<any[]>([])

// 使用 useModal 创建不同的模态框
const userModal = useFormModal(async () => {
  if (!userForm.username || !userForm.email) {
    message.error('请填写完整信息')
    throw new Error('表单验证失败')
  }
  
  // 模拟保存用户信息
  await new Promise(resolve => setTimeout(resolve, 1000))
  message.success('用户信息保存成功')
  
  // 清空表单
  userForm.username = ''
  userForm.email = ''
})

const uploadModal = useModal({
  onOk: async () => {
    if (fileList.value.length === 0) {
      message.error('请选择文件')
      throw new Error('未选择文件')
    }
    
    // 模拟文件上传
    await new Promise(resolve => setTimeout(resolve, 1500))
    message.success('文件上传成功')
    fileList.value = []
  }
})

const confirmModal = useConfirmModal(async () => {
  // 模拟执行操作
  await new Promise(resolve => setTimeout(resolve, 800))
  message.success('操作执行成功')
})

const beforeUpload = (file: any) => {
  fileList.value = [file]
  return false
}

// 代码示例
const vue2Code = `// Vue2 选项式API写法
export default {
  data() {
    return {
      // 每个模态框都需要单独的状态
      userModalVisible: false,
      uploadModalVisible: false,
      confirmModalVisible: false,
      
      // 表单数据
      userForm: {
        username: '',
        email: ''
      },
      fileList: []
    }
  },
  methods: {
    // 用户模态框相关方法
    openUserModal() {
      this.userModalVisible = true
    },
    closeUserModal() {
      this.userModalVisible = false
    },
    async submitUserForm() {
      if (!this.userForm.username || !this.userForm.email) {
        this.$message.error('请填写完整信息')
        return
      }
      
      try {
        await this.saveUser()
        this.$message.success('保存成功')
        this.closeUserModal()
      } catch (error) {
        // 错误处理
      }
    },
    
    // 上传模态框相关方法
    openUploadModal() {
      this.uploadModalVisible = true
    },
    closeUploadModal() {
      this.uploadModalVisible = false
    },
    async submitUpload() {
      // 上传逻辑...
    },
    
    // 确认模态框相关方法
    openConfirmModal() {
      this.confirmModalVisible = true
    },
    closeConfirmModal() {
      this.confirmModalVisible = false
    },
    async handleConfirm() {
      // 确认逻辑...
    }
  }
}`

const vue3Code = `// Vue3 组合式API写法
import { ref, reactive } from 'vue'
import { useModal, useFormModal, useConfirmModal } from '@/composables/useModal'

// 表单数据
const userForm = reactive({
  username: '',
  email: ''
})

const fileList = ref([])

// 使用组合式API，一行代码搞定模态框管理
const userModal = useFormModal(async () => {
  if (!userForm.username || !userForm.email) {
    throw new Error('请填写完整信息')
  }
  await saveUser()
  // 自动关闭模态框
})

const uploadModal = useModal({
  onOk: async () => {
    if (fileList.value.length === 0) {
      throw new Error('请选择文件')
    }
    await uploadFiles()
    // 自动关闭模态框
  }
})

const confirmModal = useConfirmModal(async () => {
  await executeOperation()
  // 自动关闭模态框
})

// 在模板中直接使用
// <a-modal v-model:open="userModal.visible.value" @ok="userModal.handleOk">
// <a-modal v-model:open="uploadModal.visible.value" @ok="uploadModal.handleOk">
// <a-modal v-model:open="confirmModal.visible.value" @ok="confirmModal.handleOk">`

const useModalStructure = `// useModal 函数结构
export function useModal(options = {}) {
  // 1. 接收配置参数
  const { initialVisible, onOk, onCancel, beforeClose } = options
  
  // 2. 创建响应式状态
  const visible = ref(initialVisible || false)
  
  // 3. 定义操作方法
  const open = () => visible.value = true
  const close = () => visible.value = false
  const toggle = () => visible.value = !visible.value
  
  // 4. 处理确认和取消逻辑
  const handleOk = async () => {
    try {
      if (onOk) await onOk()
      await close()
    } catch (error) {
      // 出错时不关闭模态框
    }
  }
  
  const handleCancel = () => {
    if (onCancel) onCancel()
    close()
  }
  
  // 5. 返回状态和方法
  return {
    visible,
    open,
    close,
    toggle,
    handleOk,
    handleCancel
  }
}`

const usageExamples = `// 基础用法
const modal = useModal()

// 带回调的用法
const modal = useModal({
  onOk: async () => {
    await submitForm()
  },
  onCancel: () => {
    console.log('用户取消了操作')
  }
})

// 预设配置用法
const confirmModal = useConfirmModal(() => {
  deleteItem()
})

const formModal = useFormModal(async () => {
  await saveForm()
})`

const advancedUsage = `// 高级用法：自定义验证
const modal = useModal({
  beforeClose: async () => {
    // 关闭前验证
    const hasUnsavedChanges = checkUnsavedChanges()
    if (hasUnsavedChanges) {
      const confirmed = await showConfirmDialog()
      return confirmed
    }
    return true
  },
  onOk: async () => {
    // 复杂的提交逻辑
    await validateForm()
    await submitToServer()
    await updateLocalState()
  }
})

// 多个模态框组合使用
const { visible: editVisible, open: openEdit } = useModal()
const { visible: deleteVisible, open: openDelete } = useConfirmModal(deleteItem)

// 条件性使用
const modal = computed(() => {
  return userRole === 'admin' 
    ? useModal({ onOk: adminAction })
    : useModal({ onOk: userAction })
})`
</script>

<style scoped>
.composition-demo {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 40px;
}

.demo-header h1 {
  color: #1890ff;
  margin-bottom: 16px;
  font-size: 28px;
}

.demo-header p {
  color: #666;
  font-size: 16px;
}

.comparison-section {
  margin-bottom: 40px;
}

.comparison-section h2 {
  color: #333;
  margin-bottom: 24px;
  font-size: 24px;
}

.code-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.vue2-code, .vue3-code {
  background: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  padding: 16px;
}

.vue2-code h3 {
  color: #e74c3c;
  margin-bottom: 12px;
}

.vue3-code h3 {
  color: #27ae60;
  margin-bottom: 12px;
}

.vue2-code pre, .vue3-code pre {
  margin: 0;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.4;
  color: #24292e;
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;
}

.demo-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin: 24px 0;
}

.advantages-section {
  margin-bottom: 40px;
}

.advantages-section h2 {
  color: #333;
  margin-bottom: 24px;
  font-size: 24px;
  text-align: center;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.advantage-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.advantage-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.advantage-card h3 {
  color: #1890ff;
  margin-bottom: 12px;
  font-size: 18px;
}

.advantage-card p {
  color: #666;
  line-height: 1.6;
}

.usemodal-analysis {
  margin-bottom: 40px;
}

.usemodal-analysis h2 {
  color: #333;
  margin-bottom: 24px;
  font-size: 24px;
}

.analysis-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.structure-explanation,
.usage-examples,
.advanced-usage {
  background: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  padding: 20px;
}

.structure-explanation h3,
.usage-examples h3,
.advanced-usage h3 {
  color: #1890ff;
  margin-bottom: 16px;
  font-size: 18px;
}

.structure-explanation pre,
.usage-examples pre,
.advanced-usage pre {
  margin: 0;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #24292e;
  overflow-x: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .composition-demo {
    padding: 16px;
  }
  
  .code-comparison {
    grid-template-columns: 1fr;
  }
  
  .demo-buttons {
    flex-direction: column;
  }
  
  .demo-buttons .ant-btn {
    width: 100%;
  }
  
  .advantages-grid {
    grid-template-columns: 1fr;
  }
}
</style>