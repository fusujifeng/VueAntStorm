<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="not-found-image">
        <svg width="252" height="294" viewBox="0 0 252 294" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient x1="0%" y1="0%" x2="100%" y2="100%" id="gradient">
              <stop offset="0%" stop-color="#667eea" />
              <stop offset="100%" stop-color="#764ba2" />
            </linearGradient>
          </defs>
          <g fill="none" fill-rule="evenodd">
            <g transform="translate(0 8)">
              <ellipse fill="url(#gradient)" opacity=".8" cx="126" cy="143" rx="126" ry="143" />
              <g transform="translate(49 50)">
                <path d="M0 128h154v17H0z" fill="#FFF" opacity=".3" />
                <path d="M0 145h154v17H0z" fill="#FFF" opacity=".3" />
                <path d="M0 162h154v17H0z" fill="#FFF" opacity=".3" />
                <path d="M0 179h154v17H0z" fill="#FFF" opacity=".3" />
                <path d="M0 111h154v17H0z" fill="#FFF" opacity=".3" />
                <path d="M0 94h154v17H0z" fill="#FFF" opacity=".3" />
                <path d="M0 77h154v17H0z" fill="#FFF" opacity=".3" />
                <path d="M0 60h154v17H0z" fill="#FFF" opacity=".3" />
                <path d="M0 43h154v17H0z" fill="#FFF" opacity=".3" />
                <path d="M0 26h154v17H0z" fill="#FFF" opacity=".3" />
                <path d="M0 9h154v17H0z" fill="#FFF" opacity=".3" />
                <path d="M0-8h154v17H0z" fill="#FFF" opacity=".3" />
              </g>
            </g>
            <g transform="translate(78 0)">
              <rect fill="#667eea" width="96" height="34" rx="17" />
              <text font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFF">
                <tspan x="20" y="24">404</tspan>
              </text>
            </g>
          </g>
        </svg>
      </div>
      
      <div class="not-found-text">
        <h1>页面未找到</h1>
        <p>抱歉，您访问的页面不存在或已被移除。</p>
        
        <div class="not-found-actions">
          <a-button type="primary" size="large" @click="goHome">
            <home-outlined />
            返回首页
          </a-button>
          <a-button size="large" @click="goBack" style="margin-left: 16px">
            <arrow-left-outlined />
            返回上页
          </a-button>
        </div>
        
        <div class="not-found-suggestions">
          <h3>您可以尝试：</h3>
          <ul>
            <li>检查网址是否正确</li>
            <li>返回上一页面</li>
            <li>访问我们的首页</li>
            <li>联系管理员获取帮助</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.not-found-content {
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.not-found-image {
  margin-bottom: 40px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.not-found-text h1 {
  font-size: 48px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 16px;
  animation: fadeInUp 0.8s ease-out;
}

.not-found-text p {
  font-size: 18px;
  color: #666;
  margin-bottom: 32px;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.not-found-actions {
  margin-bottom: 48px;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.not-found-suggestions {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: left;
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.not-found-suggestions h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 16px;
  text-align: center;
}

.not-found-suggestions ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.not-found-suggestions li {
  padding: 8px 0;
  color: #666;
  position: relative;
  padding-left: 20px;
}

.not-found-suggestions li::before {
  content: '•';
  color: #1890ff;
  font-weight: bold;
  position: absolute;
  left: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .not-found-text h1 {
    font-size: 36px;
  }
  
  .not-found-text p {
    font-size: 16px;
  }
  
  .not-found-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .not-found-actions .ant-btn {
    margin-left: 0 !important;
  }
}
</style>