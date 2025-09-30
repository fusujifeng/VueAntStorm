<template>
  <div class="modal-demo">
    <div class="demo-header">
      <h1>useModal 组合式API演示</h1>
      <p>这个页面展示了如何使用 useModal 组合式API来简化模态框的管理</p>
    </div>

    <div class="demo-section">
      <h2>基础用法</h2>
      <div class="demo-buttons">
        <a-button type="primary" @click="basicModal.open">
          打开基础模态框
        </a-button>
        <a-button @click="basicModal.toggle">
          切换模态框状态
        </a-button>
      </div>
      
      <a-modal
        title="基础模态框"
        v-model:open="basicModal.visible.value"
        :mask-closable="false"
        @ok="basicModal.handleOk"
        @cancel="basicModal.handleCancel"
      >
        <a-divider style="margin: 12px 0 24px 0"/>
        <p>这是一个基础的模态框示例</p>
        <p>使用 useModal 可以轻松管理模态框的状态</p>
        <p>点击确定或取消按钮来关闭模态框</p>
      </a-modal>
    </div>

    <div class="demo-section">
      <h2>带确认回调的模态框</h2>
      <div class="demo-buttons">
        <a-button type="primary" @click="confirmModal.open">
          打开确认模态框
        </a-button>
      </div>
      
      <a-modal
        title="确认操作"
        v-model:open="confirmModal.visible.value"
        :mask-closable="false"
        @ok="confirmModal.handleOk"
        @cancel="confirmModal.handleCancel"
      >
        <a-divider style="margin: 12px 0 24px 0"/>
        <p>这个模态框演示了如何在确认时执行特定的操作</p>
        <p>点击确定按钮会触发确认回调函数</p>
        <p>{{ confirmMessage }}</p>
      </a-modal>
    </div>

    <div class="demo-section">
      <h2>表单模态框</h2>
      <div class="demo-buttons">
        <a-button type="primary" @click="formModal.open">
          打开表单模态框
        </a-button>
      </div>
      
      <a-modal
        title="用户信息表单"
        v-model:open="formModal.visible.value"
        :mask-closable="false"
        @ok="formModal.handleOk"
        @cancel="formModal.handleCancel"
      >
        <a-divider style="margin: 12px 0 24px 0"/>
        <a-form :model="formData" layout="vertical">
          <a-form-item label="用户名" required>
            <a-input v-model:value="formData.username" placeholder="请输入用户名" />
          </a-form-item>
          <a-form-item label="邮箱" required>
            <a-input v-model:value="formData.email" placeholder="请输入邮箱" />
          </a-form-item>
          <a-form-item label="描述">
            <a-textarea v-model:value="formData.description" placeholder="请输入描述" :rows="3" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>

    <div class="demo-section">
      <h2>文件上传模态框（解决change事件多次触发问题）</h2>
      <div class="demo-buttons">
        <a-button type="primary" @click="uploadModal1.open">
          方案1：状态过滤上传
        </a-button>
        <a-button type="primary" @click="uploadModal2.open">
          方案2：手动上传控制
        </a-button>
        <a-button type="primary" @click="uploadModal3.open">
          方案3：beforeUpload处理
        </a-button>
        <a-button type="primary" @click="uploadModal4.open">
          方案4：beforeUpload传参上传
        </a-button>
      </div>
      
      <!-- 方案1：通过状态过滤 -->
      <a-modal
        title="方案1：状态过滤上传"
        v-model:open="uploadModal1.visible.value"
        :mask-closable="false"
        @ok="uploadModal1.handleOk"
        @cancel="uploadModal1.handleCancel"
      >
        <a-divider style="margin: 12px 0 24px 0"/>
        <p>通过判断文件状态，只在特定状态时上传</p>
        <a-upload
          :action="false"
          :file-list="fileList1"
          @change="handleUploadChange1"
          @remove="handleRemove1"
        >
          <a-button>
            <upload-outlined />
            选择文件
          </a-button>
        </a-upload>
        <div v-if="uploadStatus1" style="margin-top: 12px; color: #1890ff;">
          {{ uploadStatus1 }}
        </div>
      </a-modal>

      <!-- 方案2：手动上传控制 -->
      <a-modal
        title="方案2：手动上传控制"
        v-model:open="uploadModal2.visible.value"
        :mask-closable="false"
        @ok="uploadModal2.handleOk"
        @cancel="uploadModal2.handleCancel"
      >
        <a-divider style="margin: 12px 0 24px 0"/>
        <p>选择文件后手动点击上传按钮</p>
        <a-upload
          :action="false"
          :file-list="fileList2"
          @change="handleFileSelect2"
          @remove="handleRemove2"
        >
          <a-button>
            <upload-outlined />
            选择文件
          </a-button>
        </a-upload>
        <a-button 
          v-if="fileList2.length > 0" 
          type="primary" 
          :loading="uploading2"
          @click="handleManualUpload2"
          style="margin-top: 12px;"
        >
          {{ uploading2 ? '上传中...' : '开始上传' }}
        </a-button>
        <div v-if="uploadStatus2" style="margin-top: 12px; color: #1890ff;">
          {{ uploadStatus2 }}
        </div>
      </a-modal>

      <!-- 方案3：beforeUpload处理 -->
      <a-modal
        title="方案3：beforeUpload处理"
        v-model:open="uploadModal3.visible.value"
        :mask-closable="false"
        @ok="uploadModal3.handleOk"
        @cancel="uploadModal3.handleCancel"
      >
        <a-divider style="margin: 12px 0 24px 0"/>
        <p>在beforeUpload中直接处理上传，阻止默认行为</p>
        <a-upload
          :action="false"
          :file-list="fileList3"
          :before-upload="handleBeforeUpload3"
          @remove="handleRemove3"
        >
          <a-button>
            <upload-outlined />
            选择文件
          </a-button>
        </a-upload>
        <div v-if="uploadStatus3" style="margin-top: 12px; color: #1890ff;">
          {{ uploadStatus3 }}
        </div>
      </a-modal>

      <!-- 方案4：beforeUpload传参上传 -->
      <a-modal
        title="方案4：beforeUpload传参上传"
        v-model:open="uploadModal4.visible.value"
        :mask-closable="false"
        @ok="uploadModal4.handleOk"
        @cancel="uploadModal4.handleCancel"
      >
        <a-divider style="margin: 12px 0 24px 0"/>
        <p>在beforeUpload中传递额外参数，支持不同的上传类型</p>
        
        <!-- 上传类型选择 -->
        <div style="margin-bottom: 16px;">
          <span style="margin-right: 12px;">上传类型：</span>
          <a-radio-group v-model:value="uploadType" @change="handleUploadTypeChange">
            <a-radio :value="1">类型1 - 普通上传</a-radio>
            <a-radio :value="2">类型2 - 压缩上传</a-radio>
          </a-radio-group>
        </div>
        
        <a-upload
          :action="false"
          :file-list="fileList4"
          :before-upload="(file) => handleBeforeUpload4(file, uploadType)"
          @remove="handleRemove4"
        >
          <a-button>
            <upload-outlined />
            选择文件 (当前类型: {{ uploadType === 1 ? '普通上传' : '压缩上传' }})
          </a-button>
        </a-upload>
        <div v-if="uploadStatus4" style="margin-top: 12px; color: #1890ff;">
          {{ uploadStatus4 }}
        </div>
      </a-modal>
    </div>

    <div class="demo-section">
      <h2>代码示例</h2>
      <div class="code-example">
        <pre><code>{{ codeExample }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { useModal, useConfirmModal, useFormModal } from '@/composables/useModal'
import type { UploadProps } from 'ant-design-vue'

// 基础模态框
const basicModal = useModal()

// 确认模态框
const confirmMessage = ref('等待确认操作...')
const confirmModal = useConfirmModal(async () => {
  confirmMessage.value = '确认操作已执行！'
  message.success('操作已确认')
  // 模拟异步操作
  await new Promise(resolve => setTimeout(resolve, 1000))
})

// 表单数据
const formData = reactive({
  username: '',
  email: '',
  description: ''
})

// 表单模态框
const formModal = useFormModal(async () => {
  if (!formData.username || !formData.email) {
    message.error('请填写必填字段')
    throw new Error('表单验证失败')
  }
  
  message.success('表单提交成功')
  console.log('提交的表单数据:', formData)
  
  // 清空表单
  Object.assign(formData, {
    username: '',
    email: '',
    description: ''
  })
})

// IP匹配表上传模态框
const fileList = ref<any[]>([])
const ipMatchModal = useModal({
  onOk: async () => {
    if (fileList.value.length === 0) {
      message.error('请选择要上传的文件')
      throw new Error('未选择文件')
    }
    
    message.success('IP匹配表上传成功')
    fileList.value = []
  }
})

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isValidType = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain'].includes(file.type)
  if (!isValidType) {
    message.error('只能上传 CSV、Excel 或 TXT 文件!')
    return false
  }
  
  fileList.value = [file]
  return false // 阻止自动上传
}

const handleRemove = () => {
  fileList.value = []
}

// ===== 文件上传解决方案演示 =====

// 方案1：状态过滤上传
const fileList1 = ref<any[]>([])
const uploadStatus1 = ref('')
const uploadModal1 = useModal({
  onOk: async () => {
    fileList1.value = []
    uploadStatus1.value = ''
  }
})

const handleUploadChange1 = async (info: any) => {
  const { file, fileList } = info
  
  // 关键：只在文件状态为 'done' 或刚添加时处理
  if (file.status === 'uploading' || file.status === 'removed') {
    return
  }
  
  // 更新文件列表
  fileList1.value = [...fileList]
  
  // 只在文件刚添加时上传（没有status或status为undefined）
  if (!file.status && file.originFileObj) {
    uploadStatus1.value = '正在上传...'
    try {
      // 模拟上传API调用
      await uploadFileToServer(file.originFileObj)
      uploadStatus1.value = '上传成功！'
      
      // 更新文件状态
      file.status = 'done'
      file.response = { success: true }
    } catch (error) {
      uploadStatus1.value = '上传失败'
      file.status = 'error'
    }
  }
}

const handleRemove1 = (file: any) => {
  fileList1.value = fileList1.value.filter(item => item.uid !== file.uid)
}

// 方案2：手动上传控制
const fileList2 = ref<any[]>([])
const uploadStatus2 = ref('')
const uploading2 = ref(false)
const uploadModal2 = useModal({
  onOk: async () => {
    fileList2.value = []
    uploadStatus2.value = ''
    uploading2.value = false
  }
})

const handleFileSelect2 = (info: any) => {
  // 只更新文件列表，不触发上传
  fileList2.value = [...info.fileList]
}

const handleManualUpload2 = async () => {
  if (fileList2.value.length === 0) return
  
  uploading2.value = true
  uploadStatus2.value = '正在上传...'
  
  try {
    // 上传所有文件
    for (const file of fileList2.value) {
      if (file.originFileObj) {
        await uploadFileToServer(file.originFileObj)
      }
    }
    uploadStatus2.value = '所有文件上传成功！'
  } catch (error) {
    uploadStatus2.value = '上传失败'
  } finally {
    uploading2.value = false
  }
}

const handleRemove2 = (file: any) => {
  fileList2.value = fileList2.value.filter(item => item.uid !== file.uid)
}

// 方案3：beforeUpload处理
const fileList3 = ref<any[]>([])
const uploadStatus3 = ref('')
const uploadModal3 = useModal({
  onOk: async () => {
    fileList3.value = []
    uploadStatus3.value = ''
  }
})

const handleBeforeUpload3 = async (file: any) => {
  uploadStatus3.value = '正在上传...'
  
  try {
    // 直接在beforeUpload中处理上传
    await uploadFileToServer(file)
    
    // 手动添加到文件列表
    fileList3.value = [{
      uid: file.uid,
      name: file.name,
      status: 'done',
      response: { success: true }
    }]
    
    uploadStatus3.value = '上传成功！'
  } catch (error) {
    uploadStatus3.value = '上传失败'
    
    fileList3.value = [{
      uid: file.uid,
      name: file.name,
      status: 'error'
    }]
  }
  
  // 返回false阻止默认上传行为
  return false
}

const handleRemove3 = (file: any) => {
  fileList3.value = fileList3.value.filter(item => item.uid !== file.uid)
}

// 方案4：beforeUpload传参上传（推荐）
const fileList4 = ref<any[]>([])
const uploadStatus4 = ref('')
const uploadType = ref<1 | 2>(1) // 上传类型：1-普通上传，2-压缩上传
const uploadModal4 = useModal({
  onOk: async () => {
    fileList4.value = []
    uploadStatus4.value = ''
  }
})

// 上传类型改变处理
const handleUploadTypeChange = () => {
  uploadStatus4.value = `已切换到${uploadType.value === 1 ? '普通上传' : '压缩上传'}模式`
}

// beforeUpload传参处理
const handleBeforeUpload4 = async (file: any, type: 1 | 2) => {
  uploadStatus4.value = `正在${type === 1 ? '普通' : '压缩'}上传...`
  
  try {
    // 根据类型调用不同的上传方法
    const result = await uploadFileWithType(file, type)
    
    // 手动添加到文件列表
    fileList4.value = [{
      uid: file.uid,
      name: file.name,
      status: 'done',
      response: result,
      uploadType: type
    }]
    
    uploadStatus4.value = `${type === 1 ? '普通' : '压缩'}上传成功！文件大小：${result.size}`
  } catch (error) {
    uploadStatus4.value = `${type === 1 ? '普通' : '压缩'}上传失败`
    
    fileList4.value = [{
      uid: file.uid,
      name: file.name,
      status: 'error',
      uploadType: type
    }]
  }
  
  // 返回false阻止默认上传行为
  return false
}

const handleRemove4 = (file: any) => {
  fileList4.value = fileList4.value.filter(item => item.uid !== file.uid)
}

// 根据类型上传文件的API
const uploadFileWithType = async (file: File, type: 1 | 2): Promise<any> => {
  return new Promise((resolve, reject) => {
    // 模拟网络延迟
    setTimeout(() => {
      // 模拟90%成功率
      if (Math.random() > 0.1) {
        const originalSize = (file.size / 1024).toFixed(2) + 'KB'
        let processedSize = originalSize
        
        // 模拟压缩效果
        if (type === 2) {
          const compressedSize = (file.size * 0.6 / 1024).toFixed(2) + 'KB'
          processedSize = compressedSize
        }
        
        console.log(`文件${type === 1 ? '普通' : '压缩'}上传成功:`, file.name, `处理后大小: ${processedSize}`)
        resolve({ 
          success: true, 
          url: 'https://example.com/uploaded-file',
          type: type,
          size: processedSize,
          originalSize: originalSize
        })
      } else {
        reject(new Error(`${type === 1 ? '普通' : '压缩'}上传失败`))
      }
    }, 1000 + Math.random() * 2000) // 1-3秒随机延迟
  })
}

// 模拟上传API
const uploadFileToServer = async (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    // 模拟网络延迟
    setTimeout(() => {
      // 模拟90%成功率
      if (Math.random() > 0.1) {
        console.log('文件上传成功:', file.name)
        resolve({ success: true, url: 'https://example.com/uploaded-file' })
      } else {
        reject(new Error('上传失败'))
      }
    }, 1000 + Math.random() * 2000) // 1-3秒随机延迟
  })
}

// 代码示例
const codeExample = `// 解决 a-upload change 事件多次触发的方案 + beforeUpload传参

// 方案4：beforeUpload传参上传（推荐）
const uploadType = ref<1 | 2>(1) // 上传类型

// 在模板中使用箭头函数传参
<a-upload 
  :action="false"
  :before-upload="(file) => handleBeforeUpload(file, uploadType)"
>
  <a-button>选择文件</a-button>
</a-upload>

// beforeUpload处理函数
const handleBeforeUpload = async (file: File, type: 1 | 2) => {
  try {
    // 根据type调用不同的上传API
    const result = await uploadFileWithType(file, type)
    
    // 手动更新文件列表
    fileList.value = [{
      uid: file.uid,
      name: file.name,
      status: 'done',
      response: result
    }]
    
    message.success(\`\${type === 1 ? '普通' : '压缩'}上传成功！\`)
  } catch (error) {
    message.error('上传失败')
  }
  
  return false // 阻止默认上传
}

// 根据类型上传的API
const uploadFileWithType = async (file: File, type: 1 | 2) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type.toString())
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
  
  return response.json()
}

// 动态切换上传类型
const changeUploadType = (newType: 1 | 2) => {
  uploadType.value = newType
  // 可以清空已选文件，重新选择
  fileList.value = []
}`
</script>

<style scoped>
.modal-demo {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 40px;
}

.demo-header h1 {
  color: #1890ff;
  margin-bottom: 16px;
}

.demo-header p {
  color: #666;
  font-size: 16px;
}

.demo-section {
  margin-bottom: 40px;
  padding: 24px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.demo-section h2 {
  color: #333;
  margin-bottom: 16px;
  font-size: 18px;
}

.demo-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.code-example {
  background: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
}

.code-example pre {
  margin: 0;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #24292e;
}

.code-example code {
  background: none;
  padding: 0;
  font-size: inherit;
  color: inherit;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-demo {
    padding: 16px;
  }
  
  .demo-section {
    padding: 16px;
  }
  
  .demo-buttons {
    flex-direction: column;
  }
  
  .demo-buttons .ant-btn {
    width: 100%;
  }
}
</style>