<template>
  <div class="form-modal-demo">
    <div class="demo-header">
      <h1>useFormModal 表单模态框演示</h1>
      <p>基于Ant Design Vue 4的带验证表单模态框组合式API</p>
    </div>

    <!-- 功能特性介绍 -->
    <div class="features-section">
      <h2>功能特性</h2>
      <div class="features-grid">
        <div class="feature-card">
          <h3>🔍 自动验证</h3>
          <p>内置表单验证规则，支持必填、格式、长度等多种验证</p>
        </div>
        <div class="feature-card">
          <h3>⚡ 简化配置</h3>
          <p>通过字段配置快速生成表单，减少重复代码</p>
        </div>
        <div class="feature-card">
          <h3>🎯 类型安全</h3>
          <p>完整的TypeScript支持，提供类型提示和检查</p>
        </div>
        <div class="feature-card">
          <h3>🔄 状态管理</h3>
          <p>自动管理加载状态、表单重置、错误处理等</p>
        </div>
      </div>
    </div>

    <!-- 演示按钮 -->
    <div class="demo-section">
      <h2>演示示例</h2>
      <div class="demo-buttons">
        <a-button type="primary" @click="userModal.open">
          用户信息表单
        </a-button>
        <a-button type="primary" @click="productModal.open">
          产品信息表单
        </a-button>
        <a-button type="primary" @click="customModal.open">
          自定义表单
        </a-button>
        <a-button type="primary" @click="editUserModal.open(mockUserData)">
          编辑用户（预填数据）
        </a-button>
      </div>
    </div>

    <!-- 代码示例 -->
    <div class="code-section">
      <h2>使用方法</h2>
      <div class="code-tabs">
        <a-tabs v-model:activeKey="activeTab">
          <a-tab-pane key="basic" tab="基础用法">
            <pre><code>{{ basicUsageCode }}</code></pre>
          </a-tab-pane>
          <a-tab-pane key="advanced" tab="高级配置">
            <pre><code>{{ advancedUsageCode }}</code></pre>
          </a-tab-pane>
          <a-tab-pane key="preset" tab="预设配置">
            <pre><code>{{ presetUsageCode }}</code></pre>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>

    <!-- 用户信息表单模态框 -->
    <a-modal
      title="用户信息"
      v-model:open="userModal.visible.value"
      :confirm-loading="userModal.loading.value"
      @ok="userModal.handleSubmit"
      @cancel="userModal.handleCancel"
      width="600px"
    >
      <a-form
        ref="userModal.formRef.value"
        :model="userModal.formData"
        :rules="userModal.formRules"
        layout="vertical"
      >
        <a-form-item label="用户名" name="username">
          <a-input 
            v-model:value="userModal.formData.username" 
            placeholder="请输入用户名"
          />
        </a-form-item>
        
        <a-form-item label="邮箱" name="email">
          <a-input 
            v-model:value="userModal.formData.email" 
            placeholder="请输入邮箱地址"
          />
        </a-form-item>
        
        <a-form-item label="手机号" name="phone">
          <a-input 
            v-model:value="userModal.formData.phone" 
            placeholder="请输入手机号"
          />
        </a-form-item>
        
        <a-form-item label="角色" name="role">
          <a-select 
            v-model:value="userModal.formData.role" 
            placeholder="请选择角色"
          >
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="user">普通用户</a-select-option>
            <a-select-option value="guest">访客</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="描述" name="description">
          <a-textarea 
            v-model:value="userModal.formData.description" 
            placeholder="请输入用户描述"
            :rows="3"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 产品信息表单模态框 -->
    <a-modal
      title="产品信息"
      v-model:open="productModal.visible.value"
      :confirm-loading="productModal.loading.value"
      @ok="productModal.handleSubmit"
      @cancel="productModal.handleCancel"
      width="600px"
    >
      <a-form
        ref="productModal.formRef.value"
        :model="productModal.formData"
        :rules="productModal.formRules"
        layout="vertical"
      >
        <a-form-item label="产品名称" name="name">
          <a-input 
            v-model:value="productModal.formData.name" 
            placeholder="请输入产品名称"
          />
        </a-form-item>
        
        <a-form-item label="价格" name="price">
          <a-input-number 
            v-model:value="productModal.formData.price" 
            placeholder="请输入价格"
            :min="0"
            :precision="2"
            style="width: 100%"
          />
        </a-form-item>
        
        <a-form-item label="分类" name="category">
          <a-select 
            v-model:value="productModal.formData.category" 
            placeholder="请选择分类"
          >
            <a-select-option value="electronics">电子产品</a-select-option>
            <a-select-option value="clothing">服装</a-select-option>
            <a-select-option value="food">食品</a-select-option>
            <a-select-option value="books">图书</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="产品描述" name="description">
          <a-textarea 
            v-model:value="productModal.formData.description" 
            placeholder="请输入产品描述"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 自定义表单模态框 -->
    <a-modal
      title="自定义表单"
      v-model:open="customModal.visible.value"
      :confirm-loading="customModal.loading.value"
      @ok="customModal.handleSubmit"
      @cancel="customModal.handleCancel"
      width="700px"
    >
      <a-form
        ref="customModal.formRef.value"
        :model="customModal.formData"
        :rules="customModal.formRules"
        layout="vertical"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="姓名" name="name">
              <a-input 
                v-model:value="customModal.formData.name" 
                placeholder="请输入姓名"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="年龄" name="age">
              <a-input-number 
                v-model:value="customModal.formData.age" 
                placeholder="请输入年龄"
                :min="1"
                :max="120"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="邮箱" name="email">
              <a-input 
                v-model:value="customModal.formData.email" 
                placeholder="请输入邮箱"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="密码" name="password">
              <a-input-password 
                v-model:value="customModal.formData.password" 
                placeholder="请输入密码"
              />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-form-item label="生日" name="birthday">
          <a-date-picker 
            v-model:value="customModal.formData.birthday" 
            placeholder="请选择生日"
            style="width: 100%"
          />
        </a-form-item>
        
        <a-form-item label="兴趣爱好" name="hobbies">
          <a-checkbox-group v-model:value="customModal.formData.hobbies">
            <a-checkbox value="reading">阅读</a-checkbox>
            <a-checkbox value="music">音乐</a-checkbox>
            <a-checkbox value="sports">运动</a-checkbox>
            <a-checkbox value="travel">旅行</a-checkbox>
            <a-checkbox value="coding">编程</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        
        <a-form-item label="个人简介" name="bio">
          <a-textarea 
            v-model:value="customModal.formData.bio" 
            placeholder="请输入个人简介"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 编辑用户表单模态框 -->
    <a-modal
      title="编辑用户"
      v-model:open="editUserModal.visible.value"
      :confirm-loading="editUserModal.loading.value"
      @ok="editUserModal.handleSubmit"
      @cancel="editUserModal.handleCancel"
      width="600px"
    >
      <a-form
        ref="editUserModal.formRef.value"
        :model="editUserModal.formData"
        :rules="editUserModal.formRules"
        layout="vertical"
      >
        <a-form-item label="用户名" name="username">
          <a-input 
            v-model:value="editUserModal.formData.username" 
            placeholder="请输入用户名"
          />
        </a-form-item>
        
        <a-form-item label="邮箱" name="email">
          <a-input 
            v-model:value="editUserModal.formData.email" 
            placeholder="请输入邮箱地址"
          />
        </a-form-item>
        
        <a-form-item label="手机号" name="phone">
          <a-input 
            v-model:value="editUserModal.formData.phone" 
            placeholder="请输入手机号"
          />
        </a-form-item>
        
        <a-form-item label="角色" name="role">
          <a-select 
            v-model:value="editUserModal.formData.role" 
            placeholder="请选择角色"
          >
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="user">普通用户</a-select-option>
            <a-select-option value="guest">访客</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="描述" name="description">
          <a-textarea 
            v-model:value="editUserModal.formData.description" 
            placeholder="请输入用户描述"
            :rows="3"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { useFormModal, useUserFormModal, useProductFormModal } from '@/composables/useFormModal'
import type { Dayjs } from 'dayjs'

// 活动标签页
const activeTab = ref('basic')

// 模拟用户数据
const mockUserData = {
  username: 'john_doe',
  email: 'john@example.com',
  phone: '13800138000',
  role: 'admin',
  description: '这是一个测试用户'
}

// 用户信息表单模态框
const userModal = useUserFormModal(async (values) => {
  console.log('提交用户信息:', values)
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 1500))
  message.success('用户信息保存成功！')
})

// 产品信息表单模态框
const productModal = useProductFormModal(async (values) => {
  console.log('提交产品信息:', values)
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 1200))
  message.success('产品信息保存成功！')
})

// 自定义表单模态框
const customModal = useFormModal({
  fields: [
    {
      name: 'name',
      label: '姓名',
      type: 'input',
      required: true,
      placeholder: '请输入姓名'
    },
    {
      name: 'age',
      label: '年龄',
      type: 'number',
      required: true,
      rules: [
        { type: 'number', min: 1, max: 120, message: '年龄必须在1-120之间' }
      ]
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'email',
      required: true
    },
    {
      name: 'password',
      label: '密码',
      type: 'password',
      required: true,
      rules: [
        { min: 6, message: '密码至少6位' },
        { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: '密码必须包含大小写字母和数字' }
      ]
    },
    {
      name: 'birthday',
      label: '生日',
      type: 'date',
      required: false
    },
    {
      name: 'hobbies',
      label: '兴趣爱好',
      type: 'input', // 这里用input类型，实际在模板中用checkbox-group
      required: false,
      defaultValue: []
    },
    {
      name: 'bio',
      label: '个人简介',
      type: 'textarea',
      required: false
    }
  ],
  onSubmit: async (values) => {
    console.log('提交自定义表单:', values)
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    message.success('自定义表单提交成功！')
  },
  onValidationError: (errors) => {
    console.log('表单验证失败:', errors)
    message.error('请检查表单填写是否正确')
  }
})

// 编辑用户表单模态框
const editUserModal = useUserFormModal(async (values) => {
  console.log('更新用户信息:', values)
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 1000))
  message.success('用户信息更新成功！')
})

// 代码示例
const basicUsageCode = `// 基础用法
import { useFormModal } from '@/composables/useFormModal'

const modal = useFormModal({
  fields: [
    {
      name: 'username',
      label: '用户名',
      type: 'input',
      required: true,
      placeholder: '请输入用户名'
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'email',
      required: true
    }
  ],
  onSubmit: async (values) => {
    await saveUser(values)
    message.success('保存成功')
  }
})

// 在模板中使用
<a-modal 
  v-model:open="modal.visible.value"
  :confirm-loading="modal.loading.value"
  @ok="modal.handleSubmit"
  @cancel="modal.handleCancel"
>
  <a-form :model="modal.formData" :rules="modal.formRules">
    <a-form-item label="用户名" name="username">
      <a-input v-model:value="modal.formData.username" />
    </a-form-item>
  </a-form>
</a-modal>`

const advancedUsageCode = `// 高级配置
const modal = useFormModal({
  fields: [
    {
      name: 'password',
      label: '密码',
      type: 'password',
      required: true,
      rules: [
        { min: 6, message: '密码至少6位' },
        { 
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/, 
          message: '密码必须包含大小写字母和数字' 
        }
      ]
    },
    {
      name: 'role',
      label: '角色',
      type: 'select',
      required: true,
      options: [
        { label: '管理员', value: 'admin' },
        { label: '用户', value: 'user' }
      ]
    }
  ],
  initialValues: { role: 'user' }, // 默认值
  resetOnSuccess: true, // 成功后重置表单
  resetOnCancel: false, // 取消时不重置
  onSubmit: async (values) => {
    await submitForm(values)
  },
  onValidationError: (errors) => {
    message.error('请检查表单填写')
  }
})

// 动态操作
modal.setFieldValue('username', 'newValue')
modal.setFieldError('email', '邮箱格式错误')
modal.clearFieldError('email')
const isValid = await modal.validateForm()`

const presetUsageCode = `// 使用预设配置
import { useUserFormModal, useProductFormModal } from '@/composables/useFormModal'

// 用户表单（内置验证规则）
const userModal = useUserFormModal(async (values) => {
  await saveUser(values)
})

// 产品表单（内置验证规则）
const productModal = useProductFormModal(async (values) => {
  await saveProduct(values)
})

// 打开模态框
userModal.open()

// 编辑模式（预填数据）
userModal.open({
  username: 'john',
  email: 'john@example.com',
  role: 'admin'
})`
</script>

<style scoped>
.form-modal-demo {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 40px;
}

.demo-header h1 {
  color: #1890ff;
  margin-bottom: 16px;
  font-size: 28px;
}

.demo-header p {
  color: #666;
  font-size: 16px;
}

.features-section {
  margin-bottom: 40px;
}

.features-section h2 {
  color: #333;
  margin-bottom: 24px;
  font-size: 24px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.feature-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.feature-card h3 {
  color: #1890ff;
  margin-bottom: 12px;
  font-size: 16px;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
  font-size: 14px;
}

.demo-section {
  margin-bottom: 40px;
}

.demo-section h2 {
  color: #333;
  margin-bottom: 24px;
  font-size: 24px;
}

.demo-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.code-section {
  margin-bottom: 40px;
}

.code-section h2 {
  color: #333;
  margin-bottom: 24px;
  font-size: 24px;
}

.code-tabs {
  background: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  padding: 16px;
}

.code-tabs pre {
  margin: 0;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #24292e;
  overflow-x: auto;
  background: none;
}

.code-tabs code {
  background: none;
  padding: 0;
  font-size: inherit;
  color: inherit;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-modal-demo {
    padding: 16px;
  }
  
  .demo-buttons {
    flex-direction: column;
  }
  
  .demo-buttons .ant-btn {
    width: 100%;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>