<template>
  <div class="forbidden-container">
    <a-result
      status="403"
      title="403"
      sub-title="抱歉，您没有权限访问此页面。"
    >
      <template #icon>
        <StopOutlined class="forbidden-icon" />
      </template>
      
      <template #extra>
        <div class="forbidden-actions">
          <a-space direction="vertical" size="large">
            <a-space>
              <a-button type="primary" @click="goBack">
                <LeftOutlined />
                返回上页
              </a-button>
              <a-button @click="goHome">
                <HomeOutlined />
                返回首页
              </a-button>
            </a-space>
            
            <a-divider />
            
            <div class="suggestions">
              <h4>可能的原因：</h4>
              <ul>
                <li>您的账户权限不足</li>
                <li>页面需要特定角色才能访问</li>
                <li>您的登录状态已过期</li>
                <li>页面地址输入错误</li>
              </ul>
            </div>
            
            <div class="help-actions">
              <a-space>
                <a-button type="link" @click="contactSupport">
                  <CustomerServiceOutlined />
                  联系客服
                </a-button>
                <a-button type="link" @click="refreshPage">
                  <ReloadOutlined />
                  刷新页面
                </a-button>
                <a-button type="link" @click="logout">
                  <LogoutOutlined />
                  重新登录
                </a-button>
              </a-space>
            </div>
          </a-space>
        </div>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import {
  StopOutlined,
  LeftOutlined,
  HomeOutlined,
  CustomerServiceOutlined,
  ReloadOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

/**
 * 返回上一页
 */
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    goHome()
  }
}

/**
 * 返回首页
 */
const goHome = () => {
  router.push('/dashboard')
}

/**
 * 联系客服
 */
const contactSupport = () => {
  Modal.info({
    title: '联系客服',
    content: [
      '如需帮助，请通过以下方式联系我们：',
      '',
      '📧 邮箱：support@example.com',
      '📞 电话：400-123-4567',
      '💬 在线客服：工作日 9:00-18:00',
      '',
      '我们会尽快为您解决问题。'
    ].join('\n'),
    okText: '知道了'
  })
}

/**
 * 刷新页面
 */
const refreshPage = () => {
  window.location.reload()
}

/**
 * 退出登录
 */
const logout = async () => {
  Modal.confirm({
    title: '确认退出',
    content: '退出登录后需要重新输入账号密码，确定要退出吗？',
    okText: '确定退出',
    cancelText: '取消',
    onOk: async () => {
      try {
        await authStore.logout()
        message.success('已退出登录')
        router.push('/login')
      } catch (error) {
        console.error('退出登录失败:', error)
        message.error('退出登录失败')
      }
    }
  })
}
</script>

<style scoped>
.forbidden-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.forbidden-icon {
  font-size: 72px;
  color: #ff4d4f;
}

.forbidden-actions {
  max-width: 500px;
  text-align: center;
}

.suggestions {
  text-align: left;
  background: #fafafa;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #d9d9d9;
}

.suggestions h4 {
  margin: 0 0 12px 0;
  color: #262626;
  font-weight: 600;
}

.suggestions ul {
  margin: 0;
  padding-left: 20px;
  color: #595959;
}

.suggestions li {
  margin-bottom: 4px;
  line-height: 1.5;
}

.help-actions {
  margin-top: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .forbidden-container {
    padding: 16px;
  }
  
  .forbidden-actions {
    max-width: 100%;
  }
  
  .suggestions {
    padding: 12px;
  }
  
  .forbidden-icon {
    font-size: 48px;
  }
}

/* 动画效果 */
.forbidden-container {
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 按钮悬停效果 */
.ant-btn {
  transition: all 0.3s ease;
}

.ant-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>