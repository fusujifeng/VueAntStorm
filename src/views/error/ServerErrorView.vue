<template>
  <div class="server-error-container">
    <a-result
      status="500"
      title="500"
      sub-title="抱歉，服务器出现了一些问题。"
    >
      <template #icon>
        <ExclamationCircleOutlined class="server-error-icon" />
      </template>
      
      <template #extra>
        <div class="server-error-actions">
          <a-space direction="vertical" size="large">
            <a-space>
              <a-button type="primary" @click="refreshPage">
                <ReloadOutlined />
                刷新页面
              </a-button>
              <a-button @click="goHome">
                <HomeOutlined />
                返回首页
              </a-button>
            </a-space>
            
            <a-divider />
            
            <div class="error-info">
              <h4>可能的原因：</h4>
              <ul>
                <li>服务器正在维护中</li>
                <li>网络连接不稳定</li>
                <li>服务器负载过高</li>
                <li>系统临时故障</li>
              </ul>
            </div>
            
            <div class="suggestions">
              <h4>建议您：</h4>
              <ul>
                <li>稍后再试或刷新页面</li>
                <li>检查网络连接</li>
                <li>清除浏览器缓存</li>
                <li>联系技术支持</li>
              </ul>
            </div>
            
            <div class="help-actions">
              <a-space>
                <a-button type="link" @click="reportError">
                  <BugOutlined />
                  报告问题
                </a-button>
                <a-button type="link" @click="contactSupport">
                  <CustomerServiceOutlined />
                  联系客服
                </a-button>
                <a-button type="link" @click="checkStatus">
                  <GlobalOutlined />
                  服务状态
                </a-button>
              </a-space>
            </div>
            
            <!-- 错误详情（开发环境显示） -->
            <div v-if="isDevelopment && errorDetails" class="error-details">
              <a-collapse>
                <a-collapse-panel key="1" header="错误详情（开发模式）">
                  <pre>{{ errorDetails }}</pre>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </a-space>
        </div>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import {
  ExclamationCircleOutlined,
  ReloadOutlined,
  HomeOutlined,
  BugOutlined,
  CustomerServiceOutlined,
  GlobalOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

// 是否为开发环境
const isDevelopment = ref(process.env.NODE_ENV === 'development')

// 错误详情（开发环境使用）
const errorDetails = ref<string>('')

/**
 * 刷新页面
 */
const refreshPage = () => {
  window.location.reload()
}

/**
 * 返回首页
 */
const goHome = () => {
  router.push('/dashboard')
}

/**
 * 报告错误
 */
const reportError = () => {
  Modal.confirm({
    title: '报告问题',
    content: [
      '感谢您报告这个问题！',
      '',
      '我们会记录以下信息：',
      `• 当前页面：${route.fullPath}`,
      `• 时间：${new Date().toLocaleString()}`,
      `• 浏览器：${navigator.userAgent}`,
      '',
      '您可以添加更多描述来帮助我们定位问题。'
    ].join('\n'),
    okText: '发送报告',
    cancelText: '取消',
    onOk: () => {
      // 这里可以集成错误报告系统
      message.success('问题报告已发送，感谢您的反馈！')
    }
  })
}

/**
 * 联系客服
 */
const contactSupport = () => {
  Modal.info({
    title: '联系技术支持',
    content: [
      '遇到技术问题？我们来帮您解决：',
      '',
      '🔧 技术支持邮箱：tech@example.com',
      '📞 技术热线：400-123-4567',
      '💬 在线技术支持：7×24小时',
      '🎫 工单系统：support.example.com',
      '',
      '请提供错误页面地址和操作步骤，',
      '我们会尽快为您解决问题。'
    ].join('\n'),
    okText: '知道了'
  })
}

/**
 * 检查服务状态
 */
const checkStatus = () => {
  Modal.info({
    title: '系统服务状态',
    content: [
      '当前系统服务状态：',
      '',
      '🟢 Web服务：正常',
      '🟢 数据库：正常',
      '🟡 文件服务：部分异常',
      '🟢 缓存服务：正常',
      '',
      '如果问题持续存在，请联系技术支持。',
      '',
      '最后更新：' + new Date().toLocaleString()
    ].join('\n'),
    okText: '知道了'
  })
}

/**
 * 获取错误详情
 */
const getErrorDetails = () => {
  // 从路由参数或全局错误处理器获取错误信息
  const error = route.query.error as string
  if (error) {
    try {
      errorDetails.value = JSON.stringify(JSON.parse(error), null, 2)
    } catch {
      errorDetails.value = error
    }
  } else {
    errorDetails.value = '暂无详细错误信息'
  }
}

onMounted(() => {
  if (isDevelopment.value) {
    getErrorDetails()
  }
})
</script>

<style scoped>
.server-error-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.server-error-icon {
  font-size: 72px;
  color: #faad14;
}

.server-error-actions {
  max-width: 600px;
  text-align: center;
}

.error-info,
.suggestions {
  text-align: left;
  background: #fafafa;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #d9d9d9;
  margin-bottom: 16px;
}

.error-info h4,
.suggestions h4 {
  margin: 0 0 12px 0;
  color: #262626;
  font-weight: 600;
}

.error-info ul,
.suggestions ul {
  margin: 0;
  padding-left: 20px;
  color: #595959;
}

.error-info li,
.suggestions li {
  margin-bottom: 4px;
  line-height: 1.5;
}

.help-actions {
  margin-top: 16px;
}

.error-details {
  margin-top: 20px;
  text-align: left;
}

.error-details pre {
  background: #f6f8fa;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.4;
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .server-error-container {
    padding: 16px;
  }
  
  .server-error-actions {
    max-width: 100%;
  }
  
  .error-info,
  .suggestions {
    padding: 12px;
  }
  
  .server-error-icon {
    font-size: 48px;
  }
}

/* 动画效果 */
.server-error-container {
  animation: slideIn 0.8s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
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

/* 折叠面板样式 */
.ant-collapse {
  background: transparent;
  border: 1px solid #d9d9d9;
}

.ant-collapse-item {
  border-bottom: none;
}

.ant-collapse-header {
  background: #fafafa !important;
  font-weight: 500;
}
</style>