<template>
  <div class="form-view">
    <div class="page-header">
      <h1>表单组件</h1>
      <p>灵活的表单构建器，支持各种表单控件和验证规则</p>
    </div>
    
    <!-- 基础表单 -->
    <a-card title="基础表单" class="demo-card">
      <a-form
        :model="basicForm"
        :rules="basicRules"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        @finish="onBasicFinish"
        @finishFailed="onBasicFinishFailed"
      >
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="basicForm.username" placeholder="请输入用户名" />
        </a-form-item>
        
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="basicForm.email" placeholder="请输入邮箱" />
        </a-form-item>
        
        <a-form-item label="密码" name="password">
          <a-input-password v-model:value="basicForm.password" placeholder="请输入密码" />
        </a-form-item>
        
        <a-form-item label="性别" name="gender">
          <a-radio-group v-model:value="basicForm.gender">
            <a-radio value="male">男</a-radio>
            <a-radio value="female">女</a-radio>
          </a-radio-group>
        </a-form-item>
        
        <a-form-item label="爱好" name="hobbies">
          <a-checkbox-group v-model:value="basicForm.hobbies">
            <a-checkbox value="reading">阅读</a-checkbox>
            <a-checkbox value="music">音乐</a-checkbox>
            <a-checkbox value="sports">运动</a-checkbox>
            <a-checkbox value="travel">旅行</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        
        <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
          <a-button type="primary" html-type="submit" :loading="basicLoading">
            提交
          </a-button>
          <a-button style="margin-left: 10px;" @click="resetBasicForm">
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    
    <!-- 高级表单 -->
    <a-card title="高级表单" class="demo-card">
      <a-form
        :model="advancedForm"
        :rules="advancedRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        @finish="onAdvancedFinish"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="项目名称" name="projectName">
              <a-input v-model:value="advancedForm.projectName" placeholder="请输入项目名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="项目类型" name="projectType">
              <a-select v-model:value="advancedForm.projectType" placeholder="请选择项目类型">
                <a-select-option value="web">Web应用</a-select-option>
                <a-select-option value="mobile">移动应用</a-select-option>
                <a-select-option value="desktop">桌面应用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="开始日期" name="startDate">
              <a-date-picker
                v-model:value="advancedForm.startDate"
                style="width: 100%;"
                placeholder="选择开始日期"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="结束日期" name="endDate">
              <a-date-picker
                v-model:value="advancedForm.endDate"
                style="width: 100%;"
                placeholder="选择结束日期"
              />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-form-item label="预算范围" name="budget">
          <a-slider
            v-model:value="advancedForm.budget"
            :min="0"
            :max="1000000"
            :step="10000"
            :tooltip-formatter="(value) => `¥${value.toLocaleString()}`"
          />
          <div style="text-align: center; margin-top: 8px;">
            预算：¥{{ advancedForm.budget.toLocaleString() }}
          </div>
        </a-form-item>
        
        <a-form-item label="技术栈" name="technologies">
          <a-select
            v-model:value="advancedForm.technologies"
            mode="multiple"
            placeholder="请选择技术栈"
            style="width: 100%;"
          >
            <a-select-option value="vue">Vue.js</a-select-option>
            <a-select-option value="react">React</a-select-option>
            <a-select-option value="angular">Angular</a-select-option>
            <a-select-option value="nodejs">Node.js</a-select-option>
            <a-select-option value="python">Python</a-select-option>
            <a-select-option value="java">Java</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="项目描述" name="description">
          <a-textarea
            v-model:value="advancedForm.description"
            :rows="4"
            placeholder="请输入项目描述"
          />
        </a-form-item>
        
        <a-form-item label="优先级" name="priority">
          <a-rate v-model:value="advancedForm.priority" :count="5" />
        </a-form-item>
        
        <a-form-item label="是否紧急" name="urgent">
          <a-switch v-model:checked="advancedForm.urgent" />
        </a-form-item>
        
        <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
          <a-button type="primary" html-type="submit" :loading="advancedLoading">
            创建项目
          </a-button>
          <a-button style="margin-left: 10px;" @click="resetAdvancedForm">
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    
    <!-- 动态表单 -->
    <a-card title="动态表单" class="demo-card">
      <a-form
        :model="dynamicForm"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        @finish="onDynamicFinish"
      >
        <a-form-item
          v-for="(item, index) in dynamicForm.items"
          :key="item.key"
          :label="`项目 ${index + 1}`"
          :name="['items', index, 'value']"
          :rules="[{ required: true, message: '请输入项目内容' }]"
        >
          <a-input
            v-model:value="item.value"
            placeholder="请输入项目内容"
            style="width: 60%; margin-right: 8px;"
          />
          <a-button
            type="text"
            danger
            @click="removeDynamicItem(item.key)"
            :disabled="dynamicForm.items.length === 1"
          >
            <delete-outlined />
          </a-button>
        </a-form-item>
        
        <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
          <a-button type="dashed" @click="addDynamicItem" style="width: 60%;">
            <plus-outlined />
            添加项目
          </a-button>
        </a-form-item>
        
        <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
          <a-button type="primary" html-type="submit" :loading="dynamicLoading">
            提交
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { Dayjs } from 'dayjs'

// 基础表单
const basicForm = reactive({
  username: '',
  email: '',
  password: '',
  gender: 'male',
  hobbies: ['reading'],
})

const basicRules: Record<string, Rule[]> = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' },
  ],
}

const basicLoading = ref(false)

const onBasicFinish = async (values: any) => {
  basicLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    message.success('基础表单提交成功！')
    console.log('基础表单数据:', values)
  } finally {
    basicLoading.value = false
  }
}

const onBasicFinishFailed = (errorInfo: any) => {
  console.log('基础表单验证失败:', errorInfo)
}

const resetBasicForm = () => {
  Object.assign(basicForm, {
    username: '',
    email: '',
    password: '',
    gender: 'male',
    hobbies: ['reading'],
  })
}

// 高级表单
const advancedForm = reactive({
  projectName: '',
  projectType: undefined,
  startDate: undefined as Dayjs | undefined,
  endDate: undefined as Dayjs | undefined,
  budget: 100000,
  technologies: [],
  description: '',
  priority: 3,
  urgent: false,
})

const advancedRules: Record<string, Rule[]> = {
  projectName: [
    { required: true, message: '请输入项目名称', trigger: 'blur' },
  ],
  projectType: [
    { required: true, message: '请选择项目类型', trigger: 'change' },
  ],
  startDate: [
    { required: true, message: '请选择开始日期', trigger: 'change' },
  ],
  endDate: [
    { required: true, message: '请选择结束日期', trigger: 'change' },
  ],
  technologies: [
    { required: true, message: '请选择至少一个技术栈', trigger: 'change' },
  ],
  description: [
    { required: true, message: '请输入项目描述', trigger: 'blur' },
    { min: 10, message: '项目描述至少10个字符', trigger: 'blur' },
  ],
}

const advancedLoading = ref(false)

const onAdvancedFinish = async (values: any) => {
  advancedLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    message.success('高级表单提交成功！')
    console.log('高级表单数据:', values)
  } finally {
    advancedLoading.value = false
  }
}

const resetAdvancedForm = () => {
  Object.assign(advancedForm, {
    projectName: '',
    projectType: undefined,
    startDate: undefined,
    endDate: undefined,
    budget: 100000,
    technologies: [],
    description: '',
    priority: 3,
    urgent: false,
  })
}

// 动态表单
interface DynamicItem {
  key: number
  value: string
}

const dynamicForm = reactive({
  items: [
    { key: 1, value: '' }
  ] as DynamicItem[]
})

const dynamicLoading = ref(false)
let dynamicKeyCounter = 1

const addDynamicItem = () => {
  dynamicKeyCounter++
  dynamicForm.items.push({
    key: dynamicKeyCounter,
    value: ''
  })
}

const removeDynamicItem = (key: number) => {
  const index = dynamicForm.items.findIndex(item => item.key === key)
  if (index > -1) {
    dynamicForm.items.splice(index, 1)
  }
}

const onDynamicFinish = async (values: any) => {
  dynamicLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    message.success('动态表单提交成功！')
    console.log('动态表单数据:', values)
  } finally {
    dynamicLoading.value = false
  }
}
</script>

<style scoped>
.form-view {
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

.demo-card :deep(.ant-card-body) {
  padding: 24px;
}
</style>