<template>
  <div class="charts-view">
    <div class="page-header">
      <h1>图表组件</h1>
      <p>丰富的数据可视化图表组件，支持多种图表类型</p>
    </div>
    
    <!-- 统计图表 -->
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :lg="12">
        <a-card title="柱状图" class="chart-card">
          <div class="chart-container">
            <div class="chart-placeholder">
              <bar-chart-outlined style="font-size: 48px; color: #1890ff;" />
              <h3>柱状图示例</h3>
              <p>展示不同类别的数据对比</p>
              <div class="mock-chart">
                <div class="bar" style="height: 60%; background: #1890ff;"></div>
                <div class="bar" style="height: 80%; background: #52c41a;"></div>
                <div class="bar" style="height: 45%; background: #fa8c16;"></div>
                <div class="bar" style="height: 70%; background: #eb2f96;"></div>
                <div class="bar" style="height: 90%; background: #722ed1;"></div>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
      
      <a-col :xs="24" :lg="12">
        <a-card title="折线图" class="chart-card">
          <div class="chart-container">
            <div class="chart-placeholder">
              <line-chart-outlined style="font-size: 48px; color: #52c41a;" />
              <h3>折线图示例</h3>
              <p>展示数据随时间的变化趋势</p>
              <div class="mock-line-chart">
                <svg width="100%" height="80" viewBox="0 0 300 80">
                  <polyline
                    points="20,60 60,40 100,50 140,20 180,35 220,15 260,25"
                    fill="none"
                    stroke="#52c41a"
                    stroke-width="2"
                  />
                  <circle cx="20" cy="60" r="3" fill="#52c41a" />
                  <circle cx="60" cy="40" r="3" fill="#52c41a" />
                  <circle cx="100" cy="50" r="3" fill="#52c41a" />
                  <circle cx="140" cy="20" r="3" fill="#52c41a" />
                  <circle cx="180" cy="35" r="3" fill="#52c41a" />
                  <circle cx="220" cy="15" r="3" fill="#52c41a" />
                  <circle cx="260" cy="25" r="3" fill="#52c41a" />
                </svg>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
      
      <a-col :xs="24" :lg="12">
        <a-card title="饼图" class="chart-card">
          <div class="chart-container">
            <div class="chart-placeholder">
              <pie-chart-outlined style="font-size: 48px; color: #fa8c16;" />
              <h3>饼图示例</h3>
              <p>展示各部分占整体的比例</p>
              <div class="mock-pie-chart">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="#1890ff" stroke="white" stroke-width="2" />
                  <path d="M 60,60 L 60,10 A 50,50 0 0,1 95,35 z" fill="#52c41a" stroke="white" stroke-width="2" />
                  <path d="M 60,60 L 95,35 A 50,50 0 0,1 95,85 z" fill="#fa8c16" stroke="white" stroke-width="2" />
                  <path d="M 60,60 L 95,85 A 50,50 0 0,1 60,110 z" fill="#eb2f96" stroke="white" stroke-width="2" />
                </svg>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
      
      <a-col :xs="24" :lg="12">
        <a-card title="面积图" class="chart-card">
          <div class="chart-container">
            <div class="chart-placeholder">
              <area-chart-outlined style="font-size: 48px; color: #722ed1;" />
              <h3>面积图示例</h3>
              <p>展示数据的累积效果</p>
              <div class="mock-area-chart">
                <svg width="100%" height="80" viewBox="0 0 300 80">
                  <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stop-color="#722ed1" stop-opacity="0.8" />
                      <stop offset="100%" stop-color="#722ed1" stop-opacity="0.1" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points="20,60 60,40 100,50 140,20 180,35 220,15 260,25 260,80 20,80"
                    fill="url(#areaGradient)"
                  />
                  <polyline
                    points="20,60 60,40 100,50 140,20 180,35 220,15 260,25"
                    fill="none"
                    stroke="#722ed1"
                    stroke-width="2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    
    <!-- 图表配置 -->
    <a-card title="图表配置" class="demo-card" style="margin-top: 16px;">
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :lg="8">
          <h4>图表类型</h4>
          <a-radio-group v-model:value="chartConfig.type" @change="updateChart">
            <a-radio-button value="bar">柱状图</a-radio-button>
            <a-radio-button value="line">折线图</a-radio-button>
            <a-radio-button value="pie">饼图</a-radio-button>
          </a-radio-group>
        </a-col>
        
        <a-col :xs="24" :lg="8">
          <h4>主题色彩</h4>
          <a-select v-model:value="chartConfig.theme" style="width: 100%;" @change="updateChart">
            <a-select-option value="default">默认主题</a-select-option>
            <a-select-option value="dark">暗色主题</a-select-option>
            <a-select-option value="colorful">彩色主题</a-select-option>
          </a-select>
        </a-col>
        
        <a-col :xs="24" :lg="8">
          <h4>动画效果</h4>
          <a-switch v-model:checked="chartConfig.animation" @change="updateChart" />
          <span style="margin-left: 8px;">{{ chartConfig.animation ? '开启' : '关闭' }}</span>
        </a-col>
      </a-row>
      
      <a-divider />
      
      <div class="chart-preview">
        <h4>图表预览</h4>
        <div class="preview-container">
          <div class="preview-placeholder">
            <component :is="getChartIcon()" style="font-size: 64px; color: #1890ff;" />
            <h3>{{ getChartTitle() }}</h3>
            <p>主题：{{ getThemeName() }} | 动画：{{ chartConfig.animation ? '开启' : '关闭' }}</p>
            <a-button type="primary" @click="generateChart">
              生成图表
            </a-button>
          </div>
        </div>
      </div>
    </a-card>
    
    <!-- 数据源配置 -->
    <a-card title="数据源配置" class="demo-card">
      <a-form layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="数据源类型">
              <a-select v-model:value="dataConfig.sourceType" placeholder="选择数据源类型">
                <a-select-option value="static">静态数据</a-select-option>
                <a-select-option value="api">API接口</a-select-option>
                <a-select-option value="websocket">WebSocket实时数据</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="更新频率">
              <a-select v-model:value="dataConfig.updateFrequency" placeholder="选择更新频率">
                <a-select-option value="realtime">实时</a-select-option>
                <a-select-option value="1min">1分钟</a-select-option>
                <a-select-option value="5min">5分钟</a-select-option>
                <a-select-option value="1hour">1小时</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-form-item label="示例数据">
          <a-textarea
            v-model:value="dataConfig.sampleData"
            :rows="6"
            placeholder="输入JSON格式的示例数据"
          />
        </a-form-item>
        
        <a-form-item>
          <a-button type="primary" @click="validateData">
            验证数据
          </a-button>
          <a-button style="margin-left: 8px;" @click="resetData">
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { message } from 'ant-design-vue'
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  AreaChartOutlined
} from '@ant-design/icons-vue'

// 图表配置
const chartConfig = reactive({
  type: 'bar',
  theme: 'default',
  animation: true
})

// 数据源配置
const dataConfig = reactive({
  sourceType: 'static',
  updateFrequency: '1min',
  sampleData: JSON.stringify({
    categories: ['一月', '二月', '三月', '四月', '五月'],
    series: [
      {
        name: '销售额',
        data: [120, 200, 150, 80, 70]
      },
      {
        name: '利润',
        data: [60, 100, 75, 40, 35]
      }
    ]
  }, null, 2)
})

const getChartIcon = () => {
  const iconMap = {
    bar: BarChartOutlined,
    line: LineChartOutlined,
    pie: PieChartOutlined
  }
  return iconMap[chartConfig.type as keyof typeof iconMap] || BarChartOutlined
}

const getChartTitle = () => {
  const titleMap = {
    bar: '柱状图配置',
    line: '折线图配置',
    pie: '饼图配置'
  }
  return titleMap[chartConfig.type as keyof typeof titleMap] || '图表配置'
}

const getThemeName = () => {
  const themeMap = {
    default: '默认主题',
    dark: '暗色主题',
    colorful: '彩色主题'
  }
  return themeMap[chartConfig.theme as keyof typeof themeMap] || '默认主题'
}

const updateChart = () => {
  message.info('图表配置已更新')
}

const generateChart = () => {
  message.success('图表生成成功！')
}

const validateData = () => {
  try {
    JSON.parse(dataConfig.sampleData)
    message.success('数据格式验证通过！')
  } catch (error) {
    message.error('数据格式错误，请检查JSON格式')
  }
}

const resetData = () => {
  dataConfig.sampleData = JSON.stringify({
    categories: ['一月', '二月', '三月', '四月', '五月'],
    series: [
      {
        name: '销售额',
        data: [120, 200, 150, 80, 70]
      }
    ]
  }, null, 2)
  message.info('数据已重置')
}
</script>

<style scoped>
.charts-view {
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

.chart-card,
.demo-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-container {
  height: 300px;
}

.chart-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fafafa;
  border-radius: 6px;
  padding: 20px;
}

.chart-placeholder h3 {
  margin: 16px 0 8px 0;
  color: #333;
}

.chart-placeholder p {
  color: #666;
  margin-bottom: 16px;
  text-align: center;
}

.mock-chart {
  display: flex;
  align-items: end;
  gap: 8px;
  height: 60px;
  margin-top: 16px;
}

.bar {
  width: 20px;
  border-radius: 2px 2px 0 0;
  transition: all 0.3s;
}

.mock-line-chart,
.mock-area-chart {
  margin-top: 16px;
  width: 100%;
  max-width: 300px;
}

.mock-pie-chart {
  margin-top: 16px;
}

.preview-container {
  margin-top: 16px;
}

.preview-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fafafa;
  border-radius: 6px;
  border: 2px dashed #d9d9d9;
}

.preview-placeholder h3 {
  margin: 16px 0 8px 0;
  color: #333;
}

.preview-placeholder p {
  color: #666;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .chart-container {
    height: 250px;
  }
  
  .chart-placeholder {
    padding: 16px;
  }
  
  .preview-placeholder {
    height: 160px;
  }
}
</style>