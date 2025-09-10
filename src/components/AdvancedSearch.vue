<template>
  <a-flex 
    :gap="12" 
    wrap="wrap" 
    class="filterWrap" 
  >
    <template v-for="filter in filterOptions" :key="filter.value">
      <component
        :is="getComponentType(filter.type)"
        v-model:value="filterParams[filter.value]"
        :placeholder="filter.placeholder"
        allow-clear
        v-bind="getComponentProps(filter)"
        @keyup.enter="handleSearch"
        @change="handleFilterChange(filter.value, $event)"
        class="filter-item"
      >
        <template v-if="filter.type === 'select'">
          <a-select-option 
            v-for="option in filter.options" 
            :key="option.key" 
            :value="option.value ?? option.key" 
          >
            {{ option.label }}
          </a-select-option>
        </template>
        <template v-if="filter.type === 'rangePicker'" #suffixIcon>
          <CalendarOutlined />
        </template>
      </component>
    </template>
    
    <div class="filter-actions">
      <a-button 
        type="primary" 
        :loading="loading"
        @click="handleSearch" 
      >
        <template #icon><SearchOutlined /></template>
        搜索
      </a-button>
      <a-button @click="handleReset">
        <template #icon><ReloadOutlined /></template>
        重置
      </a-button>
    </div>
  </a-flex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SearchOutlined, ReloadOutlined, CalendarOutlined } from '@ant-design/icons-vue'

// 定义筛选项类型
type FilterType = 'input' | 'number' | 'select' | 'datePicker' | 'rangePicker'

// 定义选项接口
interface FilterOptionItem {
  key: string
  value?: any
  label: string
}

// 定义筛选配置接口
interface FilterOption {
  type: FilterType
  value: string
  placeholder?: string
  options?: FilterOptionItem[]
  otherConfig?: Record<string, any>
  required?: boolean
  validator?: (value: any) => boolean | string
}

// 定义组件属性接口
interface Props {
  filterOptions: FilterOption[]
  loading?: boolean
}

// 定义事件接口
interface Emits {
  search: [params: Record<string, any>]
  reset: []
  change: [key: string, value: any]
}

const props = withDefaults(defineProps<Props>(), {
  filterOptions: () => [
    {
      type: 'input',
      value: 'keyword',
      placeholder: '请输入关键词'
    },
    {
      type: 'select',
      value: 'status',
      placeholder: '请选择状态',
      options: [
        { key: 'active', label: '启用' },
        { key: 'inactive', label: '禁用' },
        { key: 'pending', label: '待审核' }
      ]
    },
    {
      type: 'datePicker',
      value: 'createDate',
      placeholder: '请选择创建日期'
    },
    {
      type: 'rangePicker',
      value: 'dateRange',
      placeholder: ['开始日期', '结束日期']
    }
  ],
  loading: false
})

const emit = defineEmits<Emits>()

// 双向绑定筛选参数
const filterParams = defineModel<Record<string, any>>('modelValue', {
  default: () => ({})
})

// 组件映射
const componentMap = {
  input: 'a-input',
  number: 'a-input-number', 
  select: 'a-select',
  datePicker: 'a-date-picker',
  rangePicker: 'a-range-picker'
} as const

// 获取组件类型
const getComponentType = (type: FilterType) => {
  return componentMap[type]
}

// 获取组件属性
const getComponentProps = (filter: FilterOption) => {
  const baseProps = {
    ...filter.otherConfig
  }

  switch (filter.type) {
    case 'number':
      return {
        ...baseProps,
        controls: false
      }
    case 'datePicker':
      return {
        ...baseProps,
        valueFormat: 'YYYY-MM-DD'
      }
    case 'rangePicker':
      return {
        ...baseProps,
        placeholder: filter.placeholder ?? ['开始时间', '结束时间']
      }
    default:
      return baseProps
  }
}

// 处理搜索
const handleSearch = () => {
  // 验证必填项
  const requiredFields = props.filterOptions.filter(item => item.required)
  for (const field of requiredFields) {
    if (!filterParams.value[field.value]) {
      console.warn(`字段 ${field.value} 为必填项`)
      return
    }
  }
  
  // 自定义验证
  for (const field of props.filterOptions) {
    if (field.validator && filterParams.value[field.value]) {
      const result = field.validator(filterParams.value[field.value])
      if (result !== true) {
        console.warn(typeof result === 'string' ? result : `字段 ${field.value} 验证失败`)
        return
      }
    }
  }
  
  emit('search', { ...filterParams.value })
}

// 处理重置
const handleReset = () => {
  // 重置所有筛选参数
  const resetParams: Record<string, any> = {}
  props.filterOptions.forEach(option => {
    resetParams[option.value] = undefined
  })
  filterParams.value = resetParams
  emit('reset')
}

// 处理筛选项变化
const handleFilterChange = (key: string, value: any) => {
  emit('change', key, value)
}
</script>

<style lang="less" scoped>
.filterWrap {
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #d9d9d9;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
}

.filter-item {
  min-width: 180px;
  flex-shrink: 0;
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  
  .ant-btn {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .filterWrap {
    padding: 12px;
  }
  
  .filter-item {
    min-width: 140px;
  }
  
  .filter-actions {
    width: 100%;
    justify-content: center;
    
    .ant-btn {
      flex: 1;
      max-width: 120px;
    }
  }
}
</style>