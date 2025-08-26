<template>
  <div class="table-view">
    <div class="page-header">
      <h1>表格组件</h1>
      <p>功能强大的数据表格组件，支持排序、筛选、分页等功能</p>
    </div>
    
    <!-- 基础表格 -->
    <a-card title="基础表格" class="demo-card">
      <a-table
        :columns="basicColumns"
        :data-source="basicData"
        :pagination="false"
        bordered
      />
    </a-card>
    
    <!-- 带分页的表格 -->
    <a-card title="带分页的表格" class="demo-card">
      <a-table
        :columns="paginationColumns"
        :data-source="paginationData"
        :pagination="{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          onChange: handlePageChange,
          onShowSizeChange: handleSizeChange
        }"
        :loading="loading"
        bordered
      />
    </a-card>
    
    <!-- 可选择表格 -->
    <a-card title="可选择表格" class="demo-card">
      <div class="table-operations">
        <a-button type="primary" :disabled="!hasSelected" @click="handleBatchDelete">
          批量删除
        </a-button>
        <span style="margin-left: 8px;" v-if="hasSelected">
          已选择 {{ selectedRowKeys.length }} 项
        </span>
      </div>
      
      <a-table
        :columns="selectableColumns"
        :data-source="selectableData"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          onSelectAll: onSelectAll
        }"
        :pagination="false"
        bordered
        style="margin-top: 16px;"
      />
    </a-card>
    
    <!-- 可编辑表格 -->
    <a-card title="可编辑表格" class="demo-card">
      <a-button type="primary" @click="handleAdd" style="margin-bottom: 16px;">
        <plus-outlined />
        添加行
      </a-button>
      
      <a-table
        :columns="editableColumns"
        :data-source="editableData"
        :pagination="false"
        bordered
      >
        <template #bodyCell="{ column, text, record, index }">
          <template v-if="column.dataIndex === 'name'">
            <div v-if="editingKey === record.key">
              <a-input v-model:value="record.name" />
            </div>
            <div v-else>
              {{ text }}
            </div>
          </template>
          
          <template v-else-if="column.dataIndex === 'age'">
            <div v-if="editingKey === record.key">
              <a-input-number v-model:value="record.age" :min="1" :max="100" />
            </div>
            <div v-else>
              {{ text }}
            </div>
          </template>
          
          <template v-else-if="column.dataIndex === 'operation'">
            <div class="editable-row-operations">
              <span v-if="editingKey === record.key">
                <a @click="save(record.key)" style="margin-right: 8px;">保存</a>
                <a @click="cancel(record.key)">取消</a>
              </span>
              <span v-else>
                <a @click="edit(record.key)" style="margin-right: 8px;">编辑</a>
                <a @click="deleteRow(record.key)">删除</a>
              </span>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'

// 基础表格数据
const basicColumns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
  },
]

const basicData = [
  {
    key: '1',
    name: '张三',
    age: 32,
    address: '北京市朝阳区',
  },
  {
    key: '2',
    name: '李四',
    age: 28,
    address: '上海市浦东新区',
  },
  {
    key: '3',
    name: '王五',
    age: 35,
    address: '广州市天河区',
  },
]

// 分页表格
const paginationColumns = [
  {
    title: '编号',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text }: { text: string }) => {
      return text === 'active' ? '活跃' : '禁用'
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
]

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(50)
const loading = ref(false)

// 生成分页数据
const generatePaginationData = (page: number, size: number) => {
  const data = []
  const start = (page - 1) * size
  for (let i = 1; i <= size; i++) {
    const id = start + i
    data.push({
      key: id.toString(),
      id,
      username: `user${id}`,
      email: `user${id}@example.com`,
      status: Math.random() > 0.5 ? 'active' : 'inactive',
      createTime: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
    })
  }
  return data
}

const paginationData = ref(generatePaginationData(1, 10))

const handlePageChange = (page: number, size: number) => {
  loading.value = true
  currentPage.value = page
  pageSize.value = size
  
  // 模拟API调用
  setTimeout(() => {
    paginationData.value = generatePaginationData(page, size)
    loading.value = false
  }, 500)
}

const handleSizeChange = (current: number, size: number) => {
  handlePageChange(1, size)
}

// 可选择表格
const selectableColumns = [
  {
    title: '产品名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '价格',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: '库存',
    dataIndex: 'stock',
    key: 'stock',
  },
  {
    title: '分类',
    dataIndex: 'category',
    key: 'category',
  },
]

const selectableData = [
  {
    key: '1',
    name: 'iPhone 15',
    price: '¥7999',
    stock: 100,
    category: '手机',
  },
  {
    key: '2',
    name: 'MacBook Pro',
    price: '¥15999',
    stock: 50,
    category: '电脑',
  },
  {
    key: '3',
    name: 'AirPods Pro',
    price: '¥1999',
    stock: 200,
    category: '耳机',
  },
  {
    key: '4',
    name: 'iPad Air',
    price: '¥4999',
    stock: 80,
    category: '平板',
  },
]

const selectedRowKeys = ref<string[]>([])
const hasSelected = computed(() => selectedRowKeys.value.length > 0)

const onSelectChange = (keys: string[]) => {
  selectedRowKeys.value = keys
}

const onSelectAll = (selected: boolean, selectedRows: any[], changeRows: any[]) => {
  console.log('onSelectAll', selected, selectedRows, changeRows)
}

const handleBatchDelete = () => {
  message.success(`删除了 ${selectedRowKeys.value.length} 项`)
  selectedRowKeys.value = []
}

// 可编辑表格
const editableColumns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: '25%',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: '15%',
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
    width: '40%',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    width: '20%',
  },
]

const editableData = ref([
  {
    key: '1',
    name: '张三',
    age: 32,
    address: '北京市朝阳区',
  },
  {
    key: '2',
    name: '李四',
    age: 28,
    address: '上海市浦东新区',
  },
])

const editingKey = ref('')
const originalData = ref<any>({})

const edit = (key: string) => {
  const record = editableData.value.find(item => item.key === key)
  if (record) {
    originalData.value[key] = { ...record }
    editingKey.value = key
  }
}

const save = (key: string) => {
  editingKey.value = ''
  delete originalData.value[key]
  message.success('保存成功')
}

const cancel = (key: string) => {
  const record = editableData.value.find(item => item.key === key)
  if (record && originalData.value[key]) {
    Object.assign(record, originalData.value[key])
  }
  editingKey.value = ''
  delete originalData.value[key]
}

const deleteRow = (key: string) => {
  editableData.value = editableData.value.filter(item => item.key !== key)
  message.success('删除成功')
}

const handleAdd = () => {
  const newKey = (editableData.value.length + 1).toString()
  editableData.value.push({
    key: newKey,
    name: '新用户',
    age: 25,
    address: '新地址',
  })
  edit(newKey)
}
</script>

<style scoped>
.table-view {
  padding: 0;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 8px;
}

.page-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.demo-card {
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-operations {
  margin-bottom: 16px;
}

.editable-row-operations a {
  margin-right: 8px;
}
</style>