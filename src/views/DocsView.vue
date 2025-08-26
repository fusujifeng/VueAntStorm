<template>
  <div class="docs-view">
    <div class="page-header">
      <h1>组件文档</h1>
      <p>详细的组件使用说明和API文档</p>
    </div>
    
    <!-- 文档导航 -->
    <a-row :gutter="24">
      <a-col :xs="24" :lg="6">
        <a-card title="文档导航" class="nav-card">
          <a-menu
            v-model:selectedKeys="selectedKeys"
            mode="inline"
            @click="scrollToSection"
          >
            <a-menu-item key="getting-started">
              <template #icon>
                <rocket-outlined />
              </template>
              快速开始
            </a-menu-item>
            <a-menu-item key="installation">
              <template #icon>
                <download-outlined />
              </template>
              安装指南
            </a-menu-item>
            <a-sub-menu key="components" title="组件">
              <template #icon>
                <appstore-outlined />
              </template>
              <a-menu-item key="button">Button 按钮</a-menu-item>
              <a-menu-item key="form">Form 表单</a-menu-item>
              <a-menu-item key="table">Table 表格</a-menu-item>
              <a-menu-item key="chart">Chart 图表</a-menu-item>
            </a-sub-menu>
            <a-menu-item key="api">
              <template #icon>
                <api-outlined />
              </template>
              API 参考
            </a-menu-item>
            <a-menu-item key="changelog">
              <template #icon>
                <history-outlined />
              </template>
              更新日志
            </a-menu-item>
          </a-menu>
        </a-card>
      </a-col>
      
      <a-col :xs="24" :lg="18">
        <div class="docs-content">
          <!-- 快速开始 -->
          <section id="getting-started" class="doc-section">
            <a-card title="快速开始" class="doc-card">
              <div class="doc-content">
                <h3>欢迎使用 VueAntStorm 组件库</h3>
                <p>VueAntStorm 是基于 Vue 3 + TypeScript + Ant Design Vue 构建的现代化组件库，为开发者提供高质量的 UI 组件和最佳实践。</p>
                
                <h4>特性</h4>
                <ul>
                  <li>🚀 基于 Vue 3 Composition API</li>
                  <li>📦 开箱即用的高质量组件</li>
                  <li>🎨 现代化的设计语言</li>
                  <li>📱 响应式设计，支持移动端</li>
                  <li>🌍 国际化支持</li>
                  <li>⚡ 按需加载，优化包体积</li>
                </ul>
                
                <h4>快速体验</h4>
                <a-alert
                  message="提示"
                  description="建议使用 pnpm 作为包管理器，它能提供更快的安装速度和更好的依赖管理。"
                  type="info"
                  show-icon
                  style="margin: 16px 0;"
                />
                
                <pre class="code-block"><code># 创建新项目
npm create vue@latest my-project
cd my-project

# 安装依赖
pnpm install

# 安装 VueAntStorm
pnpm add ant-design-vue @ant-design/icons-vue</code></pre>
              </div>
            </a-card>
          </section>
          
          <!-- 安装指南 -->
          <section id="installation" class="doc-section">
            <a-card title="安装指南" class="doc-card">
              <div class="doc-content">
                <h3>环境要求</h3>
                <ul>
                  <li>Node.js >= 16.0.0</li>
                  <li>Vue >= 3.2.0</li>
                  <li>TypeScript >= 4.5.0 (可选)</li>
                </ul>
                
                <h3>包管理器安装</h3>
                <a-tabs v-model:activeKey="installTab">
                  <a-tab-pane key="pnpm" tab="pnpm">
                    <pre class="code-block"><code>pnpm add ant-design-vue @ant-design/icons-vue</code></pre>
                  </a-tab-pane>
                  <a-tab-pane key="npm" tab="npm">
                    <pre class="code-block"><code>npm install ant-design-vue @ant-design/icons-vue</code></pre>
                  </a-tab-pane>
                  <a-tab-pane key="yarn" tab="yarn">
                    <pre class="code-block"><code>yarn add ant-design-vue @ant-design/icons-vue</code></pre>
                  </a-tab-pane>
                </a-tabs>
                
                <h3>全局引入</h3>
                <pre class="code-block"><code>// main.ts
import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'

const app = createApp(App)
app.use(Antd)
app.mount('#app')</code></pre>
                
                <h3>按需引入</h3>
                <pre class="code-block"><code>// 安装 unplugin-vue-components
pnpm add -D unplugin-vue-components

// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false
        })
      ]
    })
  ]
})</code></pre>
              </div>
            </a-card>
          </section>
          
          <!-- 组件示例 -->
          <section id="button" class="doc-section">
            <a-card title="Button 按钮" class="doc-card">
              <div class="doc-content">
                <h3>基础用法</h3>
                <div class="demo-box">
                  <div class="demo">
                    <a-space>
                      <a-button type="primary">Primary</a-button>
                      <a-button>Default</a-button>
                      <a-button type="dashed">Dashed</a-button>
                      <a-button type="text">Text</a-button>
                      <a-button type="link">Link</a-button>
                    </a-space>
                  </div>
                  <div class="demo-code">
                    <a-collapse>
                      <a-collapse-panel key="1" header="查看代码">
                        <pre class="code-block"><code>&lt;template&gt;
  &lt;a-space&gt;
    &lt;a-button type="primary"&gt;Primary&lt;/a-button&gt;
    &lt;a-button&gt;Default&lt;/a-button&gt;
    &lt;a-button type="dashed"&gt;Dashed&lt;/a-button&gt;
    &lt;a-button type="text"&gt;Text&lt;/a-button&gt;
    &lt;a-button type="link"&gt;Link&lt;/a-button&gt;
  &lt;/a-space&gt;
&lt;/template&gt;</code></pre>
                      </a-collapse-panel>
                    </a-collapse>
                  </div>
                </div>
                
                <h3>API</h3>
                <a-table :columns="buttonApiColumns" :data-source="buttonApiData" :pagination="false" size="small">
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'type'">
                      <a-tag color="blue">{{ record.type }}</a-tag>
                    </template>
                    <template v-if="column.key === 'default'">
                      <code>{{ record.default }}</code>
                    </template>
                  </template>
                </a-table>
              </div>
            </a-card>
          </section>
          
          <!-- API 参考 -->
          <section id="api" class="doc-section">
            <a-card title="API 参考" class="doc-card">
              <div class="doc-content">
                <h3>全局配置</h3>
                <p>VueAntStorm 提供了全局配置功能，可以统一设置组件的默认属性。</p>
                
                <pre class="code-block"><code>// main.ts
import { createApp } from 'vue'
import Antd, { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

const app = createApp(App)
app.use(Antd)

// 全局配置
app.provide('configProvider', {
  locale: zhCN,
  theme: {
    token: {
      colorPrimary: '#1890ff'
    }
  }
})</code></pre>
                
                <h3>主题定制</h3>
                <p>支持通过 CSS 变量或 Design Token 的方式定制主题。</p>
                
                <a-tabs v-model:activeKey="themeTab">
                  <a-tab-pane key="css" tab="CSS 变量">
                    <pre class="code-block"><code>/* 自定义主题色 */
:root {
  --ant-primary-color: #1890ff;
  --ant-success-color: #52c41a;
  --ant-warning-color: #faad14;
  --ant-error-color: #f5222d;
}</code></pre>
                  </a-tab-pane>
                  <a-tab-pane key="token" tab="Design Token">
                    <pre class="code-block"><code>// theme.ts
export const theme = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    borderRadius: 6,
    fontSize: 14
  }
}</code></pre>
                  </a-tab-pane>
                </a-tabs>
              </div>
            </a-card>
          </section>
          
          <!-- 更新日志 -->
          <section id="changelog" class="doc-section">
            <a-card title="更新日志" class="doc-card">
              <div class="doc-content">
                <a-timeline>
                  <a-timeline-item color="green">
                    <template #dot>
                      <check-circle-outlined style="color: #52c41a;" />
                    </template>
                    <div class="timeline-content">
                      <h4>v1.0.0 <a-tag color="green">Latest</a-tag></h4>
                      <p class="timeline-date">2024-01-15</p>
                      <ul>
                        <li>🎉 首个正式版本发布</li>
                        <li>✨ 完整的组件库架构</li>
                        <li>📚 完善的文档系统</li>
                        <li>🔧 TypeScript 支持</li>
                      </ul>
                    </div>
                  </a-timeline-item>
                  
                  <a-timeline-item color="blue">
                    <div class="timeline-content">
                      <h4>v0.9.0</h4>
                      <p class="timeline-date">2024-01-10</p>
                      <ul>
                        <li>🚀 性能优化</li>
                        <li>🐛 修复已知问题</li>
                        <li>📱 移动端适配优化</li>
                      </ul>
                    </div>
                  </a-timeline-item>
                  
                  <a-timeline-item>
                    <div class="timeline-content">
                      <h4>v0.8.0</h4>
                      <p class="timeline-date">2024-01-05</p>
                      <ul>
                        <li>✨ 新增图表组件</li>
                        <li>🎨 UI 设计优化</li>
                        <li>🌍 国际化支持</li>
                      </ul>
                    </div>
                  </a-timeline-item>
                </a-timeline>
              </div>
            </a-card>
          </section>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  RocketOutlined,
  DownloadOutlined,
  AppstoreOutlined,
  ApiOutlined,
  HistoryOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue'

const selectedKeys = ref(['getting-started'])
const installTab = ref('pnpm')
const themeTab = ref('css')

// Button API 数据
const buttonApiColumns = [
  { title: '属性', dataIndex: 'prop', key: 'prop' },
  { title: '说明', dataIndex: 'description', key: 'description' },
  { title: '类型', dataIndex: 'type', key: 'type' },
  { title: '默认值', dataIndex: 'default', key: 'default' }
]

const buttonApiData = [
  {
    key: '1',
    prop: 'type',
    description: '设置按钮类型',
    type: 'string',
    default: 'default'
  },
  {
    key: '2',
    prop: 'size',
    description: '设置按钮大小',
    type: 'string',
    default: 'middle'
  },
  {
    key: '3',
    prop: 'disabled',
    description: '按钮失效状态',
    type: 'boolean',
    default: 'false'
  },
  {
    key: '4',
    prop: 'loading',
    description: '设置按钮载入状态',
    type: 'boolean',
    default: 'false'
  }
]

const scrollToSection = ({ key }: { key: string }) => {
  const element = document.getElementById(key)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.docs-view {
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

.nav-card {
  position: sticky;
  top: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.docs-content {
  padding-left: 0;
}

.doc-section {
  margin-bottom: 24px;
}

.doc-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.doc-content {
  line-height: 1.6;
}

.doc-content h3 {
  color: #1890ff;
  margin-top: 24px;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
}

.doc-content h4 {
  color: #333;
  margin-top: 20px;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 500;
}

.doc-content ul {
  padding-left: 20px;
}

.doc-content li {
  margin-bottom: 8px;
}

.code-block {
  background: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 16px;
  margin: 16px 0;
  overflow-x: auto;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 13px;
  line-height: 1.45;
}

.code-block code {
  background: none;
  padding: 0;
  font-size: inherit;
  color: #24292e;
}

.demo-box {
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  margin: 16px 0;
}

.demo {
  padding: 24px;
  border-bottom: 1px solid #e8e8e8;
}

.demo-code {
  background: #fafafa;
}

.timeline-content h4 {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.timeline-date {
  color: #666;
  font-size: 12px;
  margin-bottom: 8px;
}

.timeline-content ul {
  margin-bottom: 0;
}

@media (max-width: 1024px) {
  .nav-card {
    position: static;
    margin-bottom: 24px;
  }
  
  .docs-content {
    padding-left: 0;
  }
}

@media (max-width: 768px) {
  .demo {
    padding: 16px;
  }
  
  .code-block {
    padding: 12px;
    font-size: 12px;
  }
}
</style>