<template>
  <div class="upload-demo">
    <h2>AntdVue4 环形进度条上传组件示例</h2>
    
    <!-- 单文件环形进度条上传 -->
    <a-card title="单文件环形进度条上传" style="margin-bottom: 20px;">
      <CircularProgressUpload 
        v-model:file-list="fileList"
        name="file"
        :before-upload="beforeUpload"
      />
      
  
    </a-card>
    
  
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { InboxOutlined } from '@ant-design/icons-vue'
import CircularProgressUpload from '@/components/CircularProgressUpload.vue'
import type { UploadProps } from 'ant-design-vue'

// 单文件上传相关
const fileList = ref<UploadProps['fileList']>([])

// 自定义内容上传相关
const customFileList = ref<UploadProps['fileList']>([])

// 上传前检查
const beforeUpload = (file: File) => {
  const isLt2M = file.size / 1024 / 1024 < 20
  if (!isLt2M) {
    console.error('文件大小不能超过 20MB!')
  }
  return isLt2M
}

// 格式化文件大小
const formatFileSize = (bytes?: number) => {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}



</script>

<style scoped>
.upload-demo {
  padding: 20px;
}
</style>