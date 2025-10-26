<template>
  <div class="circular-progress-upload">
    <a-upload
      v-model:file-list="innerFileList"
      v-bind="uploadProps"
      :customRequest="handleCustomRequest"
      :showUploadList="false"
      :multiple="false"
      :before-upload="beforeUpload"
      @change="handleChange"
    >
      <slot>
        <div class="upload-trigger">
          <a-button>
            <upload-outlined />
            {{ uploadText }}
          </a-button>
        </div>
      </slot>
    </a-upload>
    
    <!-- 上传成功后的显示 -->
    <div v-if="uploadedFile" class="uploaded-file">
      <span class="file-name">{{ uploadedFile.name }}</span>
      <check-circle-outlined class="success-icon" />
    </div>
    
    <!-- 上传中的环形进度条 -->
    <div v-if="uploadingFile" class="uploading-progress">
      <a-progress 
        type="circle" 
        :percent="getFileProgress(uploadingFile.uid)" 
        :status="getFileStatus(uploadingFile.status)"
        :stroke-width="strokeWidth"
        :width="progressWidth"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { UploadOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'
import type { UploadProps } from 'ant-design-vue'
import type { UploadChangeParam } from 'ant-design-vue/es/upload/interface'

// 定义组件属性
interface Props {
  fileList?: UploadProps['fileList']
  uploadText?: string
  strokeWidth?: number
  progressWidth?: number
  beforeUpload?: (file: File, fileList: File[]) => boolean | Promise<boolean>
  // 透传给 a-upload 的其他属性
  [key: string]: any
}

// 定义事件
interface Emits {
  (e: 'update:fileList', value: UploadProps['fileList']): void
  (e: 'change', value: UploadChangeParam): void
}

// 默认属性
const props = withDefaults(defineProps<Props>(), {
  fileList: () => [],
  uploadText: '选择文件',
  strokeWidth: 14,
  progressWidth: 30,
  beforeUpload: undefined
})

const emit = defineEmits<Emits>()

// 内部文件列表
const innerFileList = ref<UploadProps['fileList']>([...props.fileList || []])

// 文件进度存储
const fileProgressMap = reactive<Record<string, number>>({})

// 上传属性（透传给 a-upload）
const uploadProps = computed(() => {
  const { fileList, uploadText, strokeWidth, progressWidth, beforeUpload, ...rest } = props
  return rest
})

// 监听外部文件列表变化
watch(() => props.fileList, (newVal) => {
  innerFileList.value = [...newVal || []]
}, { deep: true })

// 计算属性：正在上传的文件
const uploadingFile = computed(() => {
  return innerFileList.value?.find(file => file.status === 'uploading')
})

// 计算属性：已上传成功的文件
const uploadedFile = computed(() => {
  return innerFileList.value?.find(file => file.status === 'done')
})

// 处理文件列表变化
const handleChange = (info: UploadChangeParam) => {
  innerFileList.value = info.fileList.slice(-1) // 只保留最后一个文件
  emit('update:fileList', innerFileList.value)
  emit('change', info)
}

// 自定义上传请求
const handleCustomRequest = (options: any) => {
  const { file, onSuccess, onError, onProgress } = options
  
  // 初始化进度
  fileProgressMap[file.uid] = 0
  
  // 模拟上传过程
  const interval = setInterval(() => {
    const currentProgress = fileProgressMap[file.uid] || 0
    const newProgress = Math.min(currentProgress + 10, 100)
    fileProgressMap[file.uid] = newProgress
    
    onProgress({ percent: newProgress }, file)
    
    if (newProgress >= 100) {
      clearInterval(interval)
      onSuccess(null, file)
    }
    
    // 模拟上传失败情况（10%概率）
    if (newProgress === 70 && Math.random() < 0.1) {
      clearInterval(interval)
      onError(new Error('上传失败'), null, file)
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
.circular-progress-upload {
  width: 100%;
}

.upload-trigger {
  display: inline-block;
}

.uploaded-file {
  display: flex;
  align-items: center;
  margin-top: 8px;
  padding: 8px;
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 4px;
}

.file-name {
  flex: 1;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;
}

.success-icon {
  color: #52c41a;
  font-size: 16px;
}

.uploading-progress {
  margin-top: 8px;
  
  align-items: center;
  padding: 8px;
  background-color: #f0f2f5;
  border-radius: 4px;
  height: 60px;
}

:deep(.ant-progress-circle) {
  width: 16px !important;
  height: 16px !important;
  font-size: 16px !important;
}

:deep(.ant-progress-circle .ant-progress-inner) {
  width: 16px !important;
  height: 16px !important;
  min-width: 16px !important;
  min-height: 16px !important;
}

:deep(.ant-progress-text) {
  display: none;
}

:deep(.ant-progress-circle-path) {
  stroke-width: 3px !important;
}
</style>