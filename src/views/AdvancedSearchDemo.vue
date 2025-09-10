<template>
  <div class="demo-container">
    <h2>AdvancedSearch 组件演示</h2>
    
    <div class="demo-section">
      <h3>基础用法</h3>
      <AdvancedSearch 
        v-model="searchParams"
        :loading="loading"
        @search="handleSearch"
        @reset="handleReset"
        @change="handleFilterChange"
      />
    </div>
    
    <div class="demo-section">
      <h3>自定义配置</h3>
      <AdvancedSearch 
        v-model="customSearchParams"
        :filter-options="customFilterOptions"
        :loading="customLoading"
        @search="handleCustomSearch"
        @reset="handleCustomReset"
      />
    </div>
    
    <div class="result-section">
      <h3>搜索结果</h3>
      <div class="result-card">
        <h4>基础搜索参数：</h4>
        <pre>{{ JSON.stringify(searchParams, null, 2) }}</pre>
      </div>
      
      <div class="result-card">
        <h4>自定义搜索参数：</h4>
        <pre>{{ JSON.stringify(customSearchParams, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdvancedSearch from '@/components/AdvancedSearch.vue'

// 基础搜索参数
const searchParams = ref({})
const loading = ref(false)

// 自定义搜索参数
const customSearchParams = ref({})
const customLoading = ref(false)

// 自定义筛选配置
const customFilterOptions = ref([
  {
    type: 'input' as const,
    value: 'name',
    placeholder: '请输入用户名',
    required: true
  },
  {
    type: 'number' as const,
    value: 'age',
    placeholder: '请输入年龄'
  },
  {
    type: 'select' as const,
    value: 'department',
    placeholder: '请选择部门',
    options: [
      { key: 'tech', label: '技术部' },
      { key: 'sales', label: '销售部' },
      { key: 'hr', label: '人事部' },
      { key: 'finance', label: '财务部' }
    ]
  },
  {
    type: 'rangePicker' as const,
    value: 'workDateRange',
    placeholder: ['入职开始日期', '入职结束日期']
  }
])

// 处理基础搜索
const handleSearch = (params: Record<string, any>) => {
  loading.value = true
  console.log('基础搜索参数:', params)
  
  // 模拟异步搜索
  setTimeout(() => {
    loading.value = false
    console.log('搜索完成')
  }, 1000)
}

// 处理基础重置
const handleReset = () => {
  console.log('基础搜索已重置')
}

// 处理筛选项变化
const handleFilterChange = (key: string, value: any) => {
  console.log(`筛选项 ${key} 变化:`, value)
}

// 处理自定义搜索
const handleCustomSearch = (params: Record<string, any>) => {
  customLoading.value = true
  console.log('自定义搜索参数:', params)
  
  // 模拟异步搜索
  setTimeout(() => {
    customLoading.value = false
    console.log('自定义搜索完成')
  }, 1500)
}

// 处理自定义重置
const handleCustomReset = () => {
  console.log('自定义搜索已重置')
}
</script>

<style lang="less" scoped>
.demo-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  color: #1890ff;
  margin-bottom: 24px;
  text-align: center;
}

.demo-section {
  margin-bottom: 32px;
  
  h3 {
    color: #333;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid #f0f0f0;
  }
}

.result-section {
  margin-top: 32px;
  
  h3 {
    color: #333;
    margin-bottom: 16px;
  }
}

.result-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  
  h4 {
    color: #495057;
    margin-bottom: 12px;
    font-size: 14px;
  }
  
  pre {
    background: #ffffff;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 12px;
    margin: 0;
    font-size: 12px;
    color: #495057;
    overflow-x: auto;
  }
}
</style>