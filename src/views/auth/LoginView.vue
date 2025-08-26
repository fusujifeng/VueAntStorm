<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>VueAntStorm</h1>
        <p>欢迎登录组件库管理系统</p>
      </div>
      
      <a-form
        :model="formState"
        :rules="rules"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
        layout="vertical"
        class="login-form"
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
        
        <a-form-item>
          <div class="login-options">
            <a-checkbox v-model:checked="formState.remember">
              记住我
            </a-checkbox>
            <a class="login-form-forgot" href="#">忘记密码？</a>
          </div>
        </a-form-item>
        
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            :loading="loading"
            class="login-form-button"
          >
            登录
          </a-button>
        </a-form-item>
        
        <div class="login-footer">
          还没有账号？ <router-link to="/register">立即注册</router-link>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form'

const router = useRouter()
const loading = ref(false)

interface FormState {
  username: string
  password: string
  remember: boolean
}

const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true,
})

const rules: Record<string, Rule[]> = {
  username: [
    { required: true, message: '请输入用户名!', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码!', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
}

const onFinish = async (values: FormState) => {
  loading.value = true
  
  try {
    // 模拟登录API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 简单的模拟登录验证
    if (values.username === 'admin' && values.password === '123456') {
      // 保存token到localStorage
      localStorage.setItem('token', 'mock-jwt-token')
      localStorage.setItem('userInfo', JSON.stringify({
        username: values.username,
        nickname: '管理员',
        avatar: ''
      }))
      
      message.success('登录成功！')
      router.push('/dashboard')
    } else {
      message.error('用户名或密码错误！')
    }
  } catch (error) {
    message.error('登录失败，请重试！')
  } finally {
    loading.value = false
  }
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 8px;
}

.login-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.login-form {
  width: 100%;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.login-form-forgot {
  color: #1890ff;
  text-decoration: none;
}

.login-form-forgot:hover {
  text-decoration: underline;
}

.login-form-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  color: #666;
}

.login-footer a {
  color: #1890ff;
  text-decoration: none;
}

.login-footer a:hover {
  text-decoration: underline;
}

.site-form-item-icon {
  color: rgba(0, 0, 0, 0.25);
}
</style>