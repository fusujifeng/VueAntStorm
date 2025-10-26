<template>
  <div class="flex-height-demo">
    <a-flex
      vertical
      style="height: calc(100vh - 64px - 70px); padding: 20px;"
      :gap="16"
    >
      <!-- 固定高度的搜索组件 -->
      <div class="search-section">
        <div class="simple-search">
          <a-flex :gap="16" wrap>
            <a-input
              v-model:value="searchParams.keyword"
              placeholder="请输入设备名称或编号"
              style="width: 200px"
              allow-clear
            />
            <a-select
              v-model:value="searchParams.deviceType"
              placeholder="请选择设备类型"
              style="width: 150px"
              allow-clear
            >
              <a-select-option value="pcs">PCS设备</a-select-option>
              <a-select-option value="transformer">变压器</a-select-option>
              <a-select-option value="switchgear">开关柜</a-select-option>
              <a-select-option value="monitor">监控设备</a-select-option>
            </a-select>
            <a-select
              v-model:value="searchParams.status"
              placeholder="请选择设备状态"
              style="width: 150px"
              allow-clear
            >
              <a-select-option value="running">运行中</a-select-option>
              <a-select-option value="maintenance">维护中</a-select-option>
              <a-select-option value="shutdown">停机</a-select-option>
              <a-select-option value="fault">故障</a-select-option>
            </a-select>
            <a-input
              v-model:value="searchParams.location"
              placeholder="请输入设备位置"
              style="width: 150px"
              allow-clear
            />
            <a-button type="primary" :loading="searchLoading" @click="handleSearch">
              搜索
            </a-button>
            <a-button @click="handleReset">
              重置
            </a-button>
          </a-flex>
        </div>
      </div>

      <!-- EditCard 组件，使用 flexMode 让它占据剩余空间 -->
      <EditCard
        title="设备列表"
        edit-button-text="编辑"
        :edit-function="handleEdit"
        :flex-mode="true"
        style="flex:1;"
      >
        <template #content>
          <MyTable :dataSource="tableData" :columns="columns" style="flex:1" />
          <div style="height: 100px;background-color: yellow;"></div>
        </template>
        
       
        
       
    
      </EditCard>
    </a-flex>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import EditCard from '@/components/EditCard.vue'
import MyTable from '@/components/MyTable.vue'
import MyPagination from '@/components/myPagination.vue'

// 搜索参数
const searchParams = ref({
  keyword: '',
  deviceType: '',
  status: '',
  location: ''
})

// 生成3条模拟数据
const generateMockData = () => {
  const data = []
  for (let i = 1; i <= 3; i++) {
    data.push({
      key: i,
      id: i,
      name: `设备${i.toString().padStart(3, '0')}`,
      type: ['PCS设备', '变压器', '开关柜', '监控设备'][i % 4],
      status: ['运行中', '维护中', '停机', '故障'][i % 4],
      location: `${['A', 'B', 'C', 'D'][i % 4]}区域-${Math.floor(i / 4) + 1}号位`,
      installDate: `2024-${(i % 12 + 1).toString().padStart(2, '0')}-${(i % 28 + 1).toString().padStart(2, '0')}`
    })
  }
  return data
}

// 表格数据
const tableData = ref(generateMockData())

// 表格列定义
const columns = [
  {
    title: '序号',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '设备名称',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: '设备类型',
    dataIndex: 'type',
    key: 'type',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: '位置',
    dataIndex: 'location',
    key: 'location',
    width: 200,
  },
  {
    title: '安装日期',
    dataIndex: 'installDate',
    key: 'installDate',
    width: 120,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    width: 150,
    fixed: 'right'
  }
]

// 搜索加载状态
const searchLoading = ref(false)

// 分页配置
const pagination = ref({
  current: 1,
  pageSize: 20,
  total: 3
})

// 表格容器动态样式


// 搜索处理
const handleSearch = () => {
  searchLoading.value = true
  console.log('搜索参数:', searchParams.value)
  
  // 模拟API调用
  setTimeout(() => {
    searchLoading.value = false
    console.log('搜索完成')
  }, 1000)
}

// 重置处理 
const handleReset = () => {
  searchParams.value = {
    keyword: '',
    deviceType: '',
    status: '',
    location: ''
  }
  console.log('重置搜索条件')
}

// 分页器变化处理
const handlePaginationChange = (current: number, pageSize: number) => {
  pagination.value.current = current
  pagination.value.pageSize = pageSize
  console.log('分页变化:', { current, pageSize })
}

// 编辑处理
const handleEdit = () => {
  console.log('编辑按钮被点击')
}
</script>

<style scoped>
.flex-height-demo {
  background-color: #f0f2f5;
  overflow: hidden; /* 关键：防止外层滚动条 */
}

.search-section {
  flex-shrink: 0; /* 防止搜索区域被压缩 */
}

.simple-search {
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

/* 表格容器样式 - flex模式 */



</style>