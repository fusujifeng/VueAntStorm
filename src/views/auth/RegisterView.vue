<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <h1>VueAntStorm</h1>
        <p>创建您的账号</p>
      </div>
      
      <a-form
        :model="formState"
        :rules="rules"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
        layout="vertical"
        class="register-form"
      >
        <a-form-item label="用户名" name="username">
          <a-input
            v-model:value="formState.username"
            size="large"
            placeholder="请输入用户名"
          >
            <template #prefix>
              <user-outlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>
        
        <a-form-item label="邮箱" name="email">
          <a-input
            v-model:value="formState.email"
            size="large"
            placeholder="请输入邮箱地址"
          >
            <template #prefix>
              <mail-outlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>
        
        <a-form-item label="密码" name="password">
          <a-input-password
            v-model:value="formState.password"
            size="large"
            placeholder="请输入密码"
          >
            <template #prefix>
              <lock-outlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        
        <a-form-item label="确认密码" name="confirmPassword">
          <a-input-password
            v-model:value="formState.confirmPassword"
            size="large"
            placeholder="请再次输入密码"
          >
            <template #prefix>
              <lock-outlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        
        <a-form-item name="agreement">
          <a-checkbox v-model:checked="formState.agreement">
            我已阅读并同意 <a href="#">用户协议</a> 和 <a href="#">隐私政策</a>
          </a-checkbox>
        </a-form-item>
        
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            :loading="loading"
            class="register-form-button"
          >
            注册
          </a-button>
        </a-form-item>
        
        <div class="register-footer">
          已有账号？ <router-link to="/login">立即登录</router-link>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'

const router = useRouter()
const loading = ref(false)

interface FormState {
  username: string
  email: string
  password: string
  confirmPassword: string
  agreement: boolean
}

const formState = reactive<FormState>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreement: false,
})

const validatePass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入密码')
  } else {
    if (formState.confirmPassword !== '') {
      // 触发确认密码的验证
    }
    return Promise.resolve()
  }
}

const validatePass2 = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请再次输入密码')
  } else if (value !== formState.password) {
    return Promise.reject('两次输入的密码不一致')
  } else {
    return Promise.resolve()
  }
}

const rules: Record<string, Rule[]> = {
  username: [
    { required: true, message: '请输入用户名!', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱地址!', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式!', trigger: 'blur' },
  ],
  password: [
    { required: true, validator: validatePass, trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, validator: validatePass2, trigger: 'blur' },
  ],
  agreement: [
    {
      validator: (_rule: Rule, value: boolean) => {
        if (!value) {
          return Promise.reject('请阅读并同意用户协议')
        }
        return Promise.resolve()
      },
      trigger: 'change',
    },
  ],
}

const onFinish = async (values: FormState) => {
  loading.value = true
  
  try {
    // 模拟注册API调用
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 模拟注册成功
    message.success('注册成功！请登录')
    router.push('/login')
  } catch (error) {
    message.error('注册失败，请重试！')
  } finally {
    loading.value = false
  }
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.register-box {
  width: 100%;
  max-width: 450px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 8px;
}

.register-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.register-form {
  width: 100%;
}

.register-form-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
}

.register-footer {
  text-align: center;
  margin-top: 24px;
  color: #666;
}

.register-footer a {
  color: #1890ff;
  text-decoration: none;
}

.register-footer a:hover {
  text-decoration: underline;
}

.site-form-item-icon {
  color: rgba(0, 0, 0, 0.25);
}
</style>