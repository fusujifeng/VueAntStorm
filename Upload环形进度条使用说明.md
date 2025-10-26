# AntdVue4 a-upload 组件环形进度条实现方案

## 概述

本文档介绍了如何在 antdvue4 的 a-upload 组件中实现环形进度条效果。通过自定义上传请求和进度控制，可以实现美观的环形进度展示。

## 基础实现

### 1. 单文件上传环形进度条

```vue
<template>
  <div>
    <a-upload
      v-model:file-list="fileList"
      name="file"
      :multiple="false"
      :customRequest="customUploadRequest"
      :showUploadList="false"
    >
      <a-button>
        <upload-outlined />
        选择文件
      </a-button>
    </a-upload>
    
    <!-- 环形进度条显示 -->
    <div v-if="progressVisible" class="progress-container">
      <a-progress 
        type="circle" 
        :percent="uploadProgress" 
        :status="uploadStatus"
        :stroke-width="6"
      />
      <div class="progress-info">{{ fileName }}</div>
      <a-button 
        v-if="uploadStatus === 'exception'" 
        type="primary" 
        size="small" 
        @click="retryUpload"
      >
        重新上传
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import type { UploadProps } from 'ant-design-vue'

const fileList = ref<UploadProps['fileList']>([])
const progressVisible = ref(false)
const uploadProgress = ref(0)
const uploadStatus = ref<'normal' | 'exception' | 'active' | 'success'>('normal')
const fileName = ref('')

// 自定义上传请求
const customUploadRequest = (options: any) => {
  const { file, onSuccess, onError, onProgress } = options
  
  progressVisible.value = true
  uploadProgress.value = 0
  uploadStatus.value = 'active'
  fileName.value = file.name
  
  // 模拟上传过程
  const interval = setInterval(() => {
    uploadProgress.value += 10
    onProgress({ percent: uploadProgress.value })
    
    if (uploadProgress.value >= 100) {
      clearInterval(interval)
      onSuccess()
      uploadStatus.value = 'success'
    }
    
    // 模拟上传失败情况
    if (uploadProgress.value === 50 && Math.random() < 0.2) {
      clearInterval(interval)
      onError(new Error('上传失败'))
      uploadStatus.value = 'exception'
    }
  }, 300)
}

// 重新上传
const retryUpload = () => {
  if (fileList.value && fileList.value.length > 0) {
    const file = fileList.value[0]
    if (file) {
      customUploadRequest({
        file: file.originFileObj || file,
        onSuccess: () => {
          if (fileList.value && fileList.value[0]) {
            fileList.value[0].status = 'done'
          }
        },
        onError: () => {
          if (fileList.value && fileList.value[0]) {
            fileList.value[0].status = 'error'
          }
        },
        onProgress: (e: { percent: number }) => {
          uploadProgress.value = e.percent
        }
      })
    }
  }
}
</script>

<style scoped>
.progress-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
}

.progress-info {
  font-size: 14px;
  color: #666;
}
</style>
```

### 2. 多文件上传环形进度条

```vue
<template>
  <div>
    <a-upload
      v-model:file-list="multiFileList"
      name="file"
      :multiple="true"
      :customRequest="customMultiUploadRequest"
      :showUploadList="false"
    >
      <a-button>
        <upload-outlined />
        选择多个文件
      </a-button>
    </a-upload>
    
    <!-- 多文件进度条显示 -->
    <div v-for="(file, index) in multiFileList" :key="index" class="multi-progress-item">
      <div class="file-info">
        <span>{{ file.name }}</span>
        <span v-if="file.status === 'done'" class="success-text">上传成功</span>
        <span v-else-if="file.status === 'error'" class="error-text">上传失败</span>
        <span v-else-if="file.status === 'uploading'">上传中...</span>
      </div>
      <a-progress 
        type="circle" 
        :percent="getFileProgress(file.uid)" 
        :status="getFileStatus(file.status)"
        :width="60"
        :stroke-width="4"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import type { UploadProps } from 'ant-design-vue'

const multiFileList = ref<UploadProps['fileList']>([])
const fileProgressMap = reactive<Record<string, number>>({})

// 自定义上传请求（多文件）
const customMultiUploadRequest = (options: any) => {
  const { file, onSuccess, onError, onProgress } = options
  
  // 初始化进度
  fileProgressMap[file.uid] = 0
  
  // 更新文件列表
  if (!multiFileList.value) {
    multiFileList.value = []
  }
  
  // 查找并更新文件状态
  const existingFileIndex = multiFileList.value?.findIndex(f => f.uid === file.uid)
  if (existingFileIndex !== -1 && multiFileList.value) {
    multiFileList.value[existingFileIndex] = {
      ...multiFileList.value[existingFileIndex],
      status: 'uploading'
    }
  }
  
  // 模拟上传过程
  const interval = setInterval(() => {
    const currentProgress = fileProgressMap[file.uid] || 0
    const newProgress = Math.min(currentProgress + 10, 100)
    fileProgressMap[file.uid] = newProgress
    
    onProgress({ percent: newProgress }, file)
    
    if (newProgress >= 100) {
      clearInterval(interval)
      onSuccess(null, file)
      
      // 更新文件状态为完成
      if (multiFileList.value) {
        const fileIndex = multiFileList.value.findIndex(f => f.uid === file.uid)
        if (fileIndex !== -1) {
          multiFileList.value[fileIndex] = {
            ...multiFileList.value[fileIndex],
            status: 'done'
          }
        }
      }
    }
    
    // 模拟上传失败情况
    if (newProgress === 70 && Math.random() < 0.1) {
      clearInterval(interval)
      onError(new Error('上传失败'), null, file)
      
      // 更新文件状态为错误
      if (multiFileList.value) {
        const fileIndex = multiFileList.value.findIndex(f => f.uid === file.uid)
        if (fileIndex !== -1) {
          multiFileList.value[fileIndex] = {
            ...multiFileList.value[fileIndex],
            status: 'error'
          }
        }
      }
    }
  }, 300)
}

// 获取文件进度
const getFileProgress = (uid: string) => {
  return fileProgressMap[uid] || 0
}

// 获取文件状态映射
const getFileStatus = (status?: string) => {
  switch (status) {
    case 'done':
      return 'success'
    case 'error':
      return 'exception'
    case 'uploading':
      return 'active'
    default:
      return 'normal'
  }
}
</script>

<style scoped>
.multi-progress-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.file-info {
  flex: 1;
  font-size: 14px;
}

.success-text {
  color: #52c41a;
}

.error-text {
  color: #ff4d4f;
}
</style>
```

## 核心要点

1. **使用 `customRequest` 属性**：通过自定义上传请求来控制上传过程和进度更新
2. **使用 `a-progress` 组件**：设置 `type="circle"` 来显示环形进度条
3. **状态管理**：通过 `status` 属性控制进度条的状态（normal、active、success、exception）
4. **进度更新**：在上传过程中调用 `onProgress` 回调函数更新进度

## 属性说明

### a-progress 环形进度条属性

- `type="circle"`：设置为环形进度条
- `percent`：进度百分比（0-100）
- `status`：进度状态（'normal' | 'exception' | 'active' | 'success'）
- `width`：环形进度条的宽度（默认80px）
- `stroke-width`：进度条线的宽度
- `stroke-color`：进度条颜色

### a-upload 关键属性

- `customRequest`：自定义上传实现
- `showUploadList`：是否显示默认的上传列表
- `multiple`：是否支持多文件上传

## 使用建议

1. 在实际项目中，将模拟上传逻辑替换为真实的上传API调用
2. 根据UI设计调整进度条的样式和尺寸
3. 添加适当的错误处理和用户提示
4. 考虑添加取消上传的功能