# CircularProgressUpload 组件使用说明

## 概述

CircularProgressUpload 是一个基于 antd-vue 的上传组件封装，提供了环形进度条显示功能。该组件专为单文件上传场景设计，具有以下特性：

1. 单文件上传限制
2. 上传过程中显示环形进度条
3. 上传成功后显示文件名和绿色勾图标
4. 支持 beforeUpload 钩子函数
5. 可自定义上传触发内容

## 基本使用

### 1. 简单使用

```vue
<template>
  <CircularProgressUpload 
    v-model:file-list="fileList"
    name="file"
  />
</template>

<script setup>
import { ref } from 'vue'
import CircularProgressUpload from '@/components/CircularProgressUpload.vue'
import type { UploadProps } from 'ant-design-vue'

const fileList = ref<UploadProps['fileList']>([])
</script>
```

### 2. 带上传前检查

```vue
<template>
  <CircularProgressUpload 
    v-model:file-list="fileList"
    name="file"
    :before-upload="beforeUpload"
  />
</template>

<script setup>
import { ref } from 'vue'
import CircularProgressUpload from '@/components/CircularProgressUpload.vue'
import type { UploadProps } from 'ant-design-vue'

const fileList = ref<UploadProps['fileList']>([])

// 上传前检查文件大小
const beforeUpload = (file) => {
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    console.error('文件大小不能超过 2MB!')
  }
  return isLt2M
}
</script>
```

### 3. 自定义上传触发内容

```vue
<template>
  <CircularProgressUpload 
    v-model:file-list="fileList"
    name="file"
  >
    <div style="padding: 20px; border: 1px dashed #d9d9d9;">
      <p>点击或拖拽文件到此区域上传</p>
    </div>
  </CircularProgressUpload>
</template>

<script setup>
import { ref } from 'vue'
import CircularProgressUpload from '@/components/CircularProgressUpload.vue'
import type { UploadProps } from 'ant-design-vue'

const fileList = ref<UploadProps['fileList']>([])
</script>
```

## 属性说明

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| fileList | UploadProps['fileList'] | [] | 文件列表，支持 v-model 双向绑定 |
| uploadText | string | '选择文件' | 上传按钮文本 |
| strokeWidth | number | 6 | 环形进度条线宽 |
| progressWidth | number | 80 | 环形进度条宽度 |
| beforeUpload | Function | undefined | 上传前检查函数 |
| name | string | - | 上传文件字段名 |
| action | string | - | 上传地址 |
| headers | object | - | 上传请求头部 |
| data | object | - | 上传额外参数 |

## 事件说明

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| update:fileList | UploadProps['fileList'] | 文件列表更新事件 |
| change | UploadChangeParam | 文件状态改变事件 |

## 插槽说明

| 插槽名 | 说明 |
| --- | --- |
| default | 自定义上传触发内容 |

## 样式说明

组件包含以下 CSS 类名，可用于自定义样式：

- `.circular-progress-upload` - 组件根元素
- `.uploaded-file` - 上传成功后的文件显示区域
- `.file-name` - 文件名
- `.success-icon` - 成功图标
- `.uploading-progress` - 上传中进度条区域

## 使用示例

### 在表单中使用

```vue
<template>
  <a-form :model="formState" :rules="rules" ref="formRef">
    <a-form-item label="文件上传" name="file">
      <CircularProgressUpload 
        v-model:file-list="formState.file"
        name="file"
        :before-upload="beforeUpload"
      />
    </a-form-item>
    
    <a-form-item>
      <a-button type="primary" @click="onSubmit">提交</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import CircularProgressUpload from '@/components/CircularProgressUpload.vue'

const formRef = ref()
const formState = reactive({
  file: []
})

const rules = {
  file: [
    {
      required: true,
      validator: (_, value) => {
        if (!value || value.length === 0) {
          return Promise.reject('请上传文件')
        }
        return Promise.resolve()
      }
    }
  ]
}

const beforeUpload = (file) => {
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('文件大小不能超过 2MB!')
  }
  return isLt2M
}

const onSubmit = async () => {
  try {
    await formRef.value.validate()
    // 处理提交逻辑
    console.log('提交数据:', formState)
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>
```

## 注意事项

1. 该组件仅支持单文件上传，会自动限制只保留最后一个上传的文件
2. 上传成功后会显示文件名和绿色勾图标
3. 上传过程中会显示环形进度条
4. 可通过 beforeUpload 函数进行上传前检查
5. 支持所有 antd-vue upload 组件的属性透传