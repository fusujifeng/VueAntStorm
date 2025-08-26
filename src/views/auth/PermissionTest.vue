<template>
  <div class="permission-test">
    <a-row :gutter="[24, 24]">
      <!-- 用户信息卡片 -->
      <a-col :span="24">
        <a-card title="当前用户信息" :bordered="false">
          <a-descriptions :column="3" bordered>
            <a-descriptions-item label="用户名">
              {{ currentUser?.username || '未登录' }}
            </a-descriptions-item>
            <a-descriptions-item label="角色">
              <a-tag :color="getRoleColor(currentUser?.role)">
                {{ getRoleText(currentUser?.role) }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="权限级别">
              <a-badge
                :status="getLevelStatus(currentUser?.permissionLevel)"
                :text="`Level ${currentUser?.permissionLevel || 0}`"
              />
            </a-descriptions-item>
            <a-descriptions-item label="权限列表" :span="3">
              <a-space wrap>
                <a-tag
                  v-for="permission in currentUser?.permissions || []"
                  :key="permission"
                  size="small"
                >
                  {{ permission }}
                </a-tag>
                <a-tag v-if="!currentUser?.permissions?.length" color="red">
                  无权限
                </a-tag>
              </a-space>
            </a-descriptions-item>
          </a-descriptions>
          
          <div class="mt-4">
            <a-space>
              <a-button @click="switchUser('guest')">
                切换为访客 (Level 1)
              </a-button>
              <a-button @click="switchUser('user')">
                切换为用户 (Level 2)
              </a-button>
              <a-button @click="switchUser('admin')">
                切换为管理员 (Level 3)
              </a-button>
              <a-button @click="switchUser('superAdmin')">
                切换为超级管理员 (Level 4)
              </a-button>
            </a-space>
          </div>
        </a-card>
      </a-col>

      <!-- 权限指令测试 -->
      <a-col :span="12">
        <a-card title="权限指令测试" :bordered="false">
          <a-space direction="vertical" style="width: 100%" :size="16">
            <!-- v-permission 指令测试 -->
            <div>
              <h4>v-permission 指令测试</h4>
              <a-space wrap>
                <a-button v-permission="1" type="primary">
                  Level 1+ 可见
                </a-button>
                <a-button v-permission="2" type="primary">
                  Level 2+ 可见
                </a-button>
                <a-button v-permission="3" type="primary">
                  Level 3+ 可见
                </a-button>
                <a-button v-permission="4" type="primary">
                  Level 4+ 可见
                </a-button>
              </a-space>
            </div>

            <!-- v-role 指令测试 -->
            <div>
              <h4>v-role 指令测试</h4>
              <a-space wrap>
                <a-button v-role="'guest'" type="default">
                  访客可见
                </a-button>
                <a-button v-role="'user'" type="default">
                  用户可见
                </a-button>
                <a-button v-role="'admin'" type="default">
                  管理员可见
                </a-button>
                <a-button v-role="'superAdmin'" type="default">
                  超级管理员可见
                </a-button>
              </a-space>
            </div>

            <!-- 权限指令 - 禁用模式 -->
            <div>
              <h4>权限指令 - 禁用模式</h4>
              <a-space wrap>
                <a-button v-permission:disable="2">
                  Level 2+ 可用
                </a-button>
                <a-button v-permission:disable="3">
                  Level 3+ 可用
                </a-button>
                <a-button v-permission:disable="4">
                  Level 4+ 可用
                </a-button>
              </a-space>
            </div>

            <!-- 反向权限测试 -->
            <div>
              <h4>反向权限测试</h4>
              <a-space wrap>
                <a-button v-permission:reverse="4" type="dashed">
                  非超级管理员可见
                </a-button>
                <a-button v-role:reverse="'guest'" type="dashed">
                  非访客可见
                </a-button>
              </a-space>
            </div>
          </a-space>
        </a-card>
      </a-col>

      <!-- 权限组件测试 -->
      <a-col :span="12">
        <a-card title="权限组件测试" :bordered="false">
          <a-space direction="vertical" style="width: 100%" :size="16">
            <!-- PermissionButton 测试 -->
            <div>
              <h4>PermissionButton 组件</h4>
              <a-space wrap>
                <PermissionButton
                  :permission="2"
                  text="Level 2+ 按钮"
                  type="primary"
                  @click="handleButtonClick"
                />
                <PermissionButton
                  :permission="3"
                  text="Level 3+ 按钮"
                  type="primary"
                  action="disable"
                  @click="handleButtonClick"
                />
                <PermissionButton
                  :permission="4"
                  text="Level 4+ 按钮"
                  type="primary"
                  show-fallback
                  @click="handleButtonClick"
                />
              </a-space>
            </div>

            <!-- PermissionLink 测试 -->
            <div>
              <h4>PermissionLink 组件</h4>
              <a-space wrap>
                <PermissionLink
                  :permission="2"
                  text="Level 2+ 链接"
                  href="#"
                  @click="handleLinkClick"
                />
                <PermissionLink
                  :permission="3"
                  text="Level 3+ 链接"
                  to="/dashboard"
                  action="disable"
                  @click="handleLinkClick"
                />
                <PermissionLink
                  :permission="4"
                  text="Level 4+ 外部链接"
                  href="https://example.com"
                  external
                  target="_blank"
                  show-fallback
                  @click="handleLinkClick"
                />
              </a-space>
            </div>

            <!-- PermissionWrapper 测试 -->
            <div>
              <h4>PermissionWrapper 组件</h4>
              <PermissionWrapper :permission="3" action="hide">
                <a-alert
                  message="Level 3+ 可见内容"
                  description="这是一个需要管理员权限才能看到的提示信息。"
                  type="info"
                  show-icon
                />
              </PermissionWrapper>
              
              <PermissionWrapper :permission="4" action="disable" show-fallback>
                <a-alert
                  message="Level 4+ 内容"
                  description="这是一个需要超级管理员权限的内容。"
                  type="warning"
                  show-icon
                  class="mt-2"
                />
                <template #fallback>
                  <a-alert
                    message="权限不足"
                    description="您需要超级管理员权限才能查看此内容。"
                    type="error"
                    show-icon
                    class="mt-2"
                  />
                </template>
              </PermissionWrapper>
            </div>
          </a-space>
        </a-card>
      </a-col>

      <!-- 权限表单测试 -->
      <a-col :span="24">
        <a-card title="权限表单测试" :bordered="false">
          <a-row :gutter="24">
            <a-col :span="12">
              <h4>Level 2+ 表单 (禁用模式)</h4>
              <PermissionForm
                :permission="2"
                action="disable"
                :model="formData"
                :rules="formRules"
                show-submit-button
                submit-text="提交表单"
                @finish="handleFormSubmit"
              >
                <a-form-item label="用户名" name="username">
                  <a-input v-model:value="formData.username" placeholder="请输入用户名" />
                </a-form-item>
                <a-form-item label="邮箱" name="email">
                  <a-input v-model:value="formData.email" placeholder="请输入邮箱" />
                </a-form-item>
                <a-form-item label="角色" name="role">
                  <a-select v-model:value="formData.role" placeholder="请选择角色">
                    <a-select-option value="user">用户</a-select-option>
                    <a-select-option value="admin">管理员</a-select-option>
                  </a-select>
                </a-form-item>
              </PermissionForm>
            </a-col>
            
            <a-col :span="12">
              <h4>Level 4+ 表单 (隐藏模式)</h4>
              <PermissionForm
                :permission="4"
                action="hide"
                :model="adminFormData"
                show-submit-button
                submit-text="管理员操作"
                show-fallback
                @finish="handleAdminFormSubmit"
              >
                <a-form-item label="系统配置" name="config">
                  <a-textarea v-model:value="adminFormData.config" placeholder="系统配置" :rows="3" />
                </a-form-item>
                <a-form-item label="危险操作" name="dangerous">
                  <a-switch v-model:checked="adminFormData.dangerous" />
                  <span class="ml-2">启用危险操作</span>
                </a-form-item>
              </PermissionForm>
            </a-col>
          </a-row>
        </a-card>
      </a-col>

      <!-- 权限测试结果 -->
      <a-col :span="24">
        <a-card title="权限测试日志" :bordered="false">
          <a-list
            :data-source="testLogs"
            size="small"
            :pagination="{ pageSize: 5 }"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>
                    <a-space>
                      <a-tag :color="item.type === 'success' ? 'green' : item.type === 'error' ? 'red' : 'blue'">
                        {{ item.type.toUpperCase() }}
                      </a-tag>
                      {{ item.action }}
                    </a-space>
                  </template>
                  <template #description>
                    {{ item.message }} - {{ item.timestamp }}
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useAuthStore } from '@/stores/auth'
import {
  PermissionButton,
  PermissionLink,
  PermissionWrapper,
  PermissionForm
} from '@/components/permission'
import type { UserRole, PermissionLevel } from '@/types/auth'

// 测试日志接口
interface TestLog {
  id: string
  type: 'success' | 'error' | 'info'
  action: string
  message: string
  timestamp: string
}

// 响应式数据
const authStore = useAuthStore()
const testLogs = ref<TestLog[]>([])

// 表单数据
const formData = ref({
  username: '',
  email: '',
  role: ''
})

const adminFormData = ref({
  config: '',
  dangerous: false
})

// 表单验证规则
const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 计算属性

/**
 * 当前用户
 */
const currentUser = computed(() => authStore.user)

// 方法

/**
 * 获取角色颜色
 */
const getRoleColor = (role?: UserRole): string => {
  const colors = {
    guest: 'default',
    user: 'blue',
    admin: 'orange',
    superAdmin: 'red'
  }
  return colors[role || 'guest']
}

/**
 * 获取角色文本
 */
const getRoleText = (role?: UserRole): string => {
  const texts = {
    guest: '访客',
    user: '用户',
    admin: '管理员',
    superAdmin: '超级管理员'
  }
  return texts[role || 'guest']
}

/**
 * 获取级别状态
 */
const getLevelStatus = (level?: PermissionLevel): string => {
  const status = {
    1: 'default',
    2: 'processing',
    3: 'warning',
    4: 'error'
  }
  return status[level || 1]
}

/**
 * 添加测试日志
 */
const addTestLog = (type: TestLog['type'], action: string, message: string) => {
  const log: TestLog = {
    id: Date.now().toString(),
    type,
    action,
    message,
    timestamp: new Date().toLocaleString()
  }
  testLogs.value.unshift(log)
  
  // 限制日志数量
  if (testLogs.value.length > 50) {
    testLogs.value = testLogs.value.slice(0, 50)
  }
}

/**
 * 切换用户
 */
const switchUser = async (role: UserRole) => {
  try {
    await authStore.switchUserRole(role)
    addTestLog('success', '切换用户', `成功切换为${getRoleText(role)}`)
    message.success(`已切换为${getRoleText(role)}`)
  } catch (error) {
    addTestLog('error', '切换用户', `切换失败: ${error}`)
    message.error('切换用户失败')
  }
}

/**
 * 处理按钮点击
 */
const handleButtonClick = () => {
  addTestLog('info', '按钮点击', '权限按钮被点击')
  message.info('权限按钮被点击')
}

/**
 * 处理链接点击
 */
const handleLinkClick = (event: MouseEvent) => {
  event.preventDefault()
  addTestLog('info', '链接点击', '权限链接被点击')
  message.info('权限链接被点击')
}

/**
 * 处理表单提交
 */
const handleFormSubmit = (values: any) => {
  addTestLog('success', '表单提交', `表单数据: ${JSON.stringify(values)}`)
  message.success('表单提交成功')
  console.log('表单数据:', values)
}

/**
 * 处理管理员表单提交
 */
const handleAdminFormSubmit = (values: any) => {
  addTestLog('success', '管理员操作', `管理员表单数据: ${JSON.stringify(values)}`)
  message.success('管理员操作成功')
  console.log('管理员表单数据:', values)
}

// 生命周期
onMounted(() => {
  addTestLog('info', '页面加载', '权限测试页面已加载')
})
</script>

<style lang="scss" scoped>
.permission-test {
  padding: 24px;
  
  .mt-2 {
    margin-top: 8px;
  }
  
  .mt-4 {
    margin-top: 16px;
  }
  
  .ml-2 {
    margin-left: 8px;
  }
  
  h4 {
    margin-bottom: 12px;
    color: #1890ff;
    font-weight: 600;
  }
  
  :deep(.ant-card-head-title) {
    font-weight: 600;
  }
  
  :deep(.ant-descriptions-item-label) {
    font-weight: 500;
  }
}
</style>