<template>
  <div class="role-management">
    <a-card title="角色管理" :bordered="false">
      <!-- 操作栏 -->
      <template #extra>
        <a-space>
          <a-input-search
            v-model:value="searchText"
            placeholder="搜索角色名称或描述"
            style="width: 250px"
            @search="handleSearch"
          />
          <PermissionButton
            type="primary"
            :permission="3"
            text="新增角色"
            @click="handleAdd"
          >
            <template #icon>
              <PlusOutlined />
            </template>
          </PermissionButton>
        </a-space>
      </template>

      <!-- 角色列表 -->
      <a-table
        :columns="columns"
        :data-source="filteredRoles"
        :loading="loading"
        :pagination="paginationConfig"
        row-key="id"
        @change="handleTableChange"
      >
        <!-- 角色名称 -->
        <template #name="{ record }">
          <a-tag :color="getRoleColor(record.level)">
            {{ record.name }}
          </a-tag>
        </template>

        <!-- 权限级别 -->
        <template #level="{ record }">
          <a-badge
            :status="getLevelStatus(record.level)"
            :text="getLevelText(record.level)"
          />
        </template>

        <!-- 权限列表 -->
        <template #permissions="{ record }">
          <a-space wrap>
            <a-tag
              v-for="permission in record.permissions.slice(0, 3)"
              :key="permission"
              size="small"
            >
              {{ permission }}
            </a-tag>
            <a-tag
              v-if="record.permissions.length > 3"
              size="small"
              color="blue"
            >
              +{{ record.permissions.length - 3 }}
            </a-tag>
          </a-space>
        </template>

        <!-- 状态 -->
        <template #status="{ record }">
          <a-switch
            v-model:checked="record.enabled"
            :disabled="!hasPermission(3)"
            @change="(checked) => handleStatusChange(record, checked)"
          />
        </template>

        <!-- 操作 -->
        <template #action="{ record }">
          <a-space>
            <PermissionButton
              type="link"
              size="small"
              :permission="2"
              text="查看"
              @click="handleView(record)"
            >
              <template #icon>
                <EyeOutlined />
              </template>
            </PermissionButton>
            <PermissionButton
              type="link"
              size="small"
              :permission="3"
              text="编辑"
              @click="handleEdit(record)"
            >
              <template #icon>
                <EditOutlined />
              </template>
            </PermissionButton>
            <PermissionButton
              type="link"
              size="small"
              danger
              :permission="4"
              text="删除"
              :disabled="record.level >= 4"
              @click="handleDelete(record)"
            >
              <template #icon>
                <DeleteOutlined />
              </template>
            </PermissionButton>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <!-- 角色表单弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalTitle"
      :width="600"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <PermissionForm
        ref="formRef"
        :model="formData"
        :rules="formRules"
        layout="vertical"
        :permission="modalMode === 'view' ? 1 : 3"
        :action="modalMode === 'view' ? 'disable' : 'hide'"
      >
        <a-form-item label="角色名称" name="name">
          <a-input
            v-model:value="formData.name"
            placeholder="请输入角色名称"
            :disabled="modalMode === 'view'"
          />
        </a-form-item>

        <a-form-item label="角色描述" name="description">
          <a-textarea
            v-model:value="formData.description"
            placeholder="请输入角色描述"
            :rows="3"
            :disabled="modalMode === 'view'"
          />
        </a-form-item>

        <a-form-item label="权限级别" name="level">
          <a-select
            v-model:value="formData.level"
            placeholder="请选择权限级别"
            :disabled="modalMode === 'view'"
          >
            <a-select-option :value="1">访客 (Guest)</a-select-option>
            <a-select-option :value="2">用户 (User)</a-select-option>
            <a-select-option :value="3">管理员 (Admin)</a-select-option>
            <a-select-option :value="4">超级管理员 (Super Admin)</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="权限列表" name="permissions">
          <a-select
            v-model:value="formData.permissions"
            mode="multiple"
            placeholder="请选择权限"
            :options="permissionOptions"
            :disabled="modalMode === 'view'"
          />
        </a-form-item>

        <a-form-item label="状态" name="enabled">
          <a-switch
            v-model:checked="formData.enabled"
            :disabled="modalMode === 'view'"
          />
          <span class="ml-2">
            {{ formData.enabled ? '启用' : '禁用' }}
          </span>
        </a-form-item>
      </PermissionForm>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import type { TableColumnsType, TableProps } from 'ant-design-vue'
import { useAuthStore } from '@/stores/auth'
import { PermissionButton, PermissionForm } from '@/components/permission'
import type { UserRole, PermissionLevel } from '@/types/auth'

// 角色数据接口
interface RoleData {
  id: string
  name: string
  description: string
  level: PermissionLevel
  permissions: string[]
  enabled: boolean
  createdAt: string
  updatedAt: string
}

// 响应式数据
const authStore = useAuthStore()
const loading = ref(false)
const searchText = ref('')
const modalVisible = ref(false)
const modalMode = ref<'add' | 'edit' | 'view'>('add')
const formRef = ref()

// 角色列表数据
const roles = ref<RoleData[]>([
  {
    id: '1',
    name: '超级管理员',
    description: '拥有系统所有权限',
    level: 4,
    permissions: ['user:read', 'user:write', 'user:delete', 'role:read', 'role:write', 'role:delete', 'system:config'],
    enabled: true,
    createdAt: '2024-01-01 10:00:00',
    updatedAt: '2024-01-01 10:00:00'
  },
  {
    id: '2',
    name: '管理员',
    description: '拥有用户管理和部分系统权限',
    level: 3,
    permissions: ['user:read', 'user:write', 'role:read'],
    enabled: true,
    createdAt: '2024-01-02 10:00:00',
    updatedAt: '2024-01-02 10:00:00'
  },
  {
    id: '3',
    name: '普通用户',
    description: '基础用户权限',
    level: 2,
    permissions: ['user:read'],
    enabled: true,
    createdAt: '2024-01-03 10:00:00',
    updatedAt: '2024-01-03 10:00:00'
  },
  {
    id: '4',
    name: '访客',
    description: '只读权限',
    level: 1,
    permissions: [],
    enabled: false,
    createdAt: '2024-01-04 10:00:00',
    updatedAt: '2024-01-04 10:00:00'
  }
])

// 表单数据
const formData = ref<Partial<RoleData>>({
  name: '',
  description: '',
  level: 2,
  permissions: [],
  enabled: true
})

// 权限选项
const permissionOptions = ref([
  { label: '用户查看', value: 'user:read' },
  { label: '用户编辑', value: 'user:write' },
  { label: '用户删除', value: 'user:delete' },
  { label: '角色查看', value: 'role:read' },
  { label: '角色编辑', value: 'role:write' },
  { label: '角色删除', value: 'role:delete' },
  { label: '系统配置', value: 'system:config' },
  { label: '数据导出', value: 'data:export' },
  { label: '日志查看', value: 'log:read' }
])

// 计算属性

/**
 * 过滤后的角色列表
 */
const filteredRoles = computed(() => {
  if (!searchText.value) {
    return roles.value
  }
  
  const keyword = searchText.value.toLowerCase()
  return roles.value.filter(role => 
    role.name.toLowerCase().includes(keyword) ||
    role.description.toLowerCase().includes(keyword)
  )
})

/**
 * 弹窗标题
 */
const modalTitle = computed(() => {
  switch (modalMode.value) {
    case 'add':
      return '新增角色'
    case 'edit':
      return '编辑角色'
    case 'view':
      return '查看角色'
    default:
      return '角色信息'
  }
})

/**
 * 分页配置
 */
const paginationConfig = computed(() => ({
  current: 1,
  pageSize: 10,
  total: filteredRoles.value.length,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number, range: [number, number]) => 
    `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
}))

// 表格列配置
const columns: TableColumnsType = [
  {
    title: '角色名称',
    dataIndex: 'name',
    key: 'name',
    slots: { customRender: 'name' },
    sorter: (a: RoleData, b: RoleData) => a.name.localeCompare(b.name)
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true
  },
  {
    title: '权限级别',
    dataIndex: 'level',
    key: 'level',
    slots: { customRender: 'level' },
    sorter: (a: RoleData, b: RoleData) => a.level - b.level
  },
  {
    title: '权限列表',
    dataIndex: 'permissions',
    key: 'permissions',
    slots: { customRender: 'permissions' }
  },
  {
    title: '状态',
    dataIndex: 'enabled',
    key: 'enabled',
    slots: { customRender: 'status' },
    width: 80
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    sorter: (a: RoleData, b: RoleData) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  },
  {
    title: '操作',
    key: 'action',
    slots: { customRender: 'action' },
    width: 200
  }
]

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '角色名称长度为2-20个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入角色描述', trigger: 'blur' },
    { max: 200, message: '描述不能超过200个字符', trigger: 'blur' }
  ],
  level: [
    { required: true, message: '请选择权限级别', trigger: 'change' }
  ],
  permissions: [
    { required: true, message: '请选择至少一个权限', trigger: 'change' }
  ]
}

// 方法

/**
 * 检查权限
 */
const hasPermission = (level: PermissionLevel): boolean => {
  return authStore.hasPermission(level)
}

/**
 * 获取角色颜色
 */
const getRoleColor = (level: PermissionLevel): string => {
  const colors = {
    1: 'default',
    2: 'blue',
    3: 'orange',
    4: 'red'
  }
  return colors[level] || 'default'
}

/**
 * 获取级别状态
 */
const getLevelStatus = (level: PermissionLevel): string => {
  const status = {
    1: 'default',
    2: 'processing',
    3: 'warning',
    4: 'error'
  }
  return status[level] || 'default'
}

/**
 * 获取级别文本
 */
const getLevelText = (level: PermissionLevel): string => {
  const texts = {
    1: '访客',
    2: '用户',
    3: '管理员',
    4: '超级管理员'
  }
  return texts[level] || '未知'
}

/**
 * 搜索处理
 */
const handleSearch = (value: string) => {
  searchText.value = value
}

/**
 * 表格变化处理
 */
const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
  console.log('Table changed:', { pagination, filters, sorter })
}

/**
 * 新增角色
 */
const handleAdd = () => {
  modalMode.value = 'add'
  formData.value = {
    name: '',
    description: '',
    level: 2,
    permissions: [],
    enabled: true
  }
  modalVisible.value = true
}

/**
 * 查看角色
 */
const handleView = (record: RoleData) => {
  modalMode.value = 'view'
  formData.value = { ...record }
  modalVisible.value = true
}

/**
 * 编辑角色
 */
const handleEdit = (record: RoleData) => {
  modalMode.value = 'edit'
  formData.value = { ...record }
  modalVisible.value = true
}

/**
 * 删除角色
 */
const handleDelete = (record: RoleData) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除角色 "${record.name}" 吗？此操作不可恢复。`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        loading.value = true
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const index = roles.value.findIndex(role => role.id === record.id)
        if (index > -1) {
          roles.value.splice(index, 1)
          message.success('删除成功')
        }
      } catch (error) {
        message.error('删除失败')
      } finally {
        loading.value = false
      }
    }
  })
}

/**
 * 状态变化处理
 */
const handleStatusChange = async (record: RoleData, checked: boolean) => {
  try {
    loading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    record.enabled = checked
    record.updatedAt = new Date().toLocaleString()
    message.success(`角色已${checked ? '启用' : '禁用'}`)
  } catch (error) {
    message.error('状态更新失败')
    record.enabled = !checked // 回滚状态
  } finally {
    loading.value = false
  }
}

/**
 * 弹窗确定
 */
const handleModalOk = async () => {
  if (modalMode.value === 'view') {
    modalVisible.value = false
    return
  }
  
  try {
    await formRef.value?.validate()
    loading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (modalMode.value === 'add') {
      const newRole: RoleData = {
        ...formData.value as RoleData,
        id: Date.now().toString(),
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      }
      roles.value.unshift(newRole)
      message.success('新增成功')
    } else if (modalMode.value === 'edit') {
      const index = roles.value.findIndex(role => role.id === formData.value.id)
      if (index > -1) {
        roles.value[index] = {
          ...roles.value[index],
          ...formData.value,
          updatedAt: new Date().toLocaleString()
        } as RoleData
        message.success('编辑成功')
      }
    }
    
    modalVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    loading.value = false
  }
}

/**
 * 弹窗取消
 */
const handleModalCancel = () => {
  modalVisible.value = false
}

// 生命周期
onMounted(() => {
  // 初始化数据
  console.log('角色管理页面已加载')
})
</script>

<style lang="scss" scoped>
.role-management {
  padding: 24px;
  
  .ml-2 {
    margin-left: 8px;
  }
  
  :deep(.ant-table) {
    .ant-table-tbody > tr > td {
      vertical-align: top;
    }
  }
}
</style>