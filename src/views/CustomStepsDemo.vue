<template>
  <div class="custom-steps-demo">
    <div class="demo-container">
      <h1>自定义步骤条组件演示</h1>
      
      <div class="demo-section">
        <h2>基础步骤条</h2>
        <CustomSteps 
          ref="stepsRef"
          :steps="demoSteps" 
          :current="currentStep"
        />
        
        <div class="controls">
          <a-button @click="prevStep" :disabled="currentStep === 0">
            上一步
          </a-button>
          <a-button type="primary" @click="nextStep" :disabled="currentStep === demoSteps.length - 1">
            下一步
          </a-button>
          <a-button @click="resetSteps">
            重置
          </a-button>
        </div>
      </div>

      <div class="demo-section">
        <h2>业务流程步骤条</h2>
        <CustomSteps 
          :steps="businessSteps" 
          :current="businessCurrentStep"
        />
        
        <div class="controls">
          <a-button @click="prevBusinessStep" :disabled="businessCurrentStep === 0">
            上一步
          </a-button>
          <a-button type="primary" @click="nextBusinessStep" :disabled="businessCurrentStep === businessSteps.length - 1">
            下一步
          </a-button>
          <a-button @click="resetBusinessSteps">
            重置
          </a-button>
        </div>
      </div>

      <div class="demo-section">
        <h2>当前步骤信息</h2>
        <div class="step-info">
          <p><strong>基础步骤条：</strong>第 {{ currentStep + 1 }} 步 - {{ demoSteps[currentStep]?.title }}</p>
          <p><strong>业务步骤条：</strong>第 {{ businessCurrentStep + 1 }} 步 - {{ businessSteps[businessCurrentStep]?.title }}</p>
        </div>
      </div>

      <div class="demo-section">
        <h2>天气查询功能</h2>
        <div class="weather-query">
          <div class="input-group">
            <a-input-number 
              v-model:value="coordinates.longitude" 
              placeholder="请输入经度" 
              :precision="6"
              style="width: 200px; margin-right: 10px;"
            />
            <a-input-number 
              v-model:value="coordinates.latitude" 
              placeholder="请输入纬度" 
              :precision="6"
              style="width: 200px; margin-right: 10px;"
            />
            <a-button 
              type="primary" 
              @click="queryWeather" 
              :loading="weatherLoading"
            >
              查询天气
            </a-button>
          </div>
          
          <div v-if="weatherData" class="weather-result">
            <h4>天气信息</h4>
            <div class="weather-cards">
              <div class="weather-card">
                <div class="weather-label">城市</div>
                <div class="weather-value">{{ weatherData.city }}</div>
              </div>
              <div class="weather-card">
                <div class="weather-label">天气</div>
                <div class="weather-value">{{ weatherData.weather }}</div>
              </div>
              <div class="weather-card">
                <div class="weather-label">温度</div>
                <div class="weather-value">{{ weatherData.temperature }}</div>
              </div>
              <div class="weather-card">
                <div class="weather-label">湿度</div>
                <div class="weather-value">{{ weatherData.humidity }}</div>
              </div>
              <div class="weather-card">
                <div class="weather-label">风向</div>
                <div class="weather-value">{{ weatherData.windDirection }}</div>
              </div>
              <div class="weather-card">
                <div class="weather-label">风力</div>
                <div class="weather-value">{{ weatherData.windSpeed }}</div>
              </div>
            </div>
          </div>
          
          <div v-if="weatherError" class="weather-error">
            <a-alert 
              :message="weatherError" 
              type="error" 
              show-icon 
              closable 
              @close="weatherError = ''"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 天气查询功能演示 -->
    <div class="demo-section">
      <h2>🌤️ 百度地图天气查询</h2>
      <div class="weather-query">
        <div class="input-group">
          <label style="margin-right: 10px; font-weight: 500;">经度:</label>
          <a-input-number 
            v-model:value="coordinates.longitude" 
            :precision="6"
            :step="0.000001"
            placeholder="请输入经度"
            style="width: 150px; margin-right: 15px;"
          />
          <label style="margin-right: 10px; font-weight: 500;">纬度:</label>
          <a-input-number 
            v-model:value="coordinates.latitude" 
            :precision="6"
            :step="0.000001"
            placeholder="请输入纬度"
            style="width: 150px; margin-right: 15px;"
          />
          <Button 
            type="primary" 
            @click="queryWeather"
            :loading="weatherLoading"
            style="min-width: 100px;"
          >
            查询天气
          </Button>
        </div>
        
        <!-- 天气信息展示 -->
        <div v-if="weatherData" class="weather-result">
          <h4>📍 {{ weatherData.city }} - 天气信息</h4>
          <div class="weather-cards">
            <div class="weather-card">
              <div class="weather-label">天气状况</div>
              <div class="weather-value">{{ weatherData.weather }}</div>
            </div>
            <div class="weather-card">
              <div class="weather-label">温度</div>
              <div class="weather-value">{{ weatherData.temperature }}°C</div>
            </div>
            <div class="weather-card">
              <div class="weather-label">湿度</div>
              <div class="weather-value">{{ weatherData.humidity }}%</div>
            </div>
            <div class="weather-card">
              <div class="weather-label">风向</div>
              <div class="weather-value">{{ weatherData.windDirection }}</div>
            </div>
            <div class="weather-card">
              <div class="weather-label">风速</div>
              <div class="weather-value">{{ weatherData.windSpeed }}</div>
            </div>
          </div>
        </div>
        
        <!-- 错误信息展示 -->
        <a-alert 
          v-if="weatherError" 
          :message="weatherError" 
          type="error" 
          show-icon 
          class="weather-error"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CustomSteps from '@/components/CustomSteps.vue'
import { Button, InputNumber, Alert } from 'ant-design-vue'
import { getWeatherByCoordinates, checkBaiduMapAPI, type WeatherInfo } from '@/utils/baiduWeather'

// 基础演示步骤
const demoSteps = ref([
  { 
    title: '建站申请', 
    dates: '2025/05/23 - 2025/06/23',
    actualStartTime: '2025/05/23'
  },
  { 
    title: '设备装调', 
    dates: '2025/05/23 - 2025/06/23',
    actualStartTime: '2025/05/23'
  },
  { 
    title: '入网测试', 
    dates: '2025/05/23 - 2025/06/23',
    actualStartTime: '2025/05/23'
  },
  { 
    title: '并网调试', 
    dates: '2025/05/23 - 2025/06/23',
    actualStartTime: '2025/05/23'
  },
  { 
    title: '消纳登记', 
    dates: '',
    actualStartTime: ''
  },
  { 
    title: '运行报告', 
    dates: '',
    actualStartTime: ''
  },
  { 
    title: '数据报告', 
    dates: '',
    actualStartTime: ''
  }
])

const currentStep = ref(3) // 默认在第4步（并网调试）

// 业务流程步骤
const businessSteps = ref([
  { title: '项目立项', dates: '2025/01/01 - 2025/01/15' },
  { title: '方案设计', dates: '2025/01/16 - 2025/02/15' },
  { title: '设备采购', dates: '2025/02/16 - 2025/03/15' },
  { title: '施工安装', dates: '2025/03/16 - 2025/04/15' },
  { title: '调试验收', dates: '2025/04/16 - 2025/05/15' },
  { title: '投产运营', dates: '' }
])

const businessCurrentStep = ref(1) // 默认在第2步

const stepsRef = ref()

// 天气查询相关状态
const coordinates = ref({
  longitude: 116.404,  // 默认北京经度
  latitude: 39.915     // 默认北京纬度
})
const weatherData = ref<WeatherInfo | null>(null)
const weatherLoading = ref(false)
const weatherError = ref('')

// 基础步骤条控制方法
const nextStep = () => {
  if (currentStep.value < demoSteps.value.length - 1) {
    currentStep.value++
    stepsRef.value?.setCurrentStep(currentStep.value)
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    stepsRef.value?.setCurrentStep(currentStep.value)
  }
}

const resetSteps = () => {
  currentStep.value = 0
  stepsRef.value?.setCurrentStep(0)
}

// 业务步骤条控制方法
const nextBusinessStep = () => {
  if (businessCurrentStep.value < businessSteps.value.length - 1) {
    businessCurrentStep.value++
  }
}

const prevBusinessStep = () => {
  if (businessCurrentStep.value > 0) {
    businessCurrentStep.value--
  }
}

const resetBusinessSteps = () => {
  businessCurrentStep.value = 0
}

// 天气查询方法
const queryWeather = async () => {
  if (!coordinates.value.longitude || !coordinates.value.latitude) {
    weatherError.value = '请输入有效的经纬度'
    return
  }

  // 检查百度地图API是否可用
  if (!checkBaiduMapAPI()) {
    weatherError.value = '百度地图API未加载，请检查网络连接或API密钥配置'
    return
  }

  weatherLoading.value = true
  weatherError.value = ''
  weatherData.value = null

  try {
    const result = await getWeatherByCoordinates(
      coordinates.value.longitude, 
      coordinates.value.latitude
    )
    weatherData.value = result
  } catch (error) {
    weatherError.value = error instanceof Error ? error.message : '查询天气信息失败'
  } finally {
    weatherLoading.value = false
  }
}
</script>

<style scoped>
.custom-steps-demo {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.demo-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 40px;
  font-size: 28px;
  font-weight: 600;
}

.demo-section {
  margin-bottom: 50px;
  padding: 30px;
  background: #fafbfc;
  border-radius: 8px;
  border: 1px solid #e1e8ed;
}

.demo-section h2 {
  color: #34495e;
  margin-bottom: 25px;
  font-size: 20px;
  font-weight: 500;
  border-bottom: 2px solid #0099F2;
  padding-bottom: 10px;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e1e8ed;
}

.controls .ant-btn {
  min-width: 100px;
  height: 40px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.controls .ant-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.step-info {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #0099F2;
}

.step-info p {
  margin: 10px 0;
  font-size: 16px;
  color: #555;
}

.step-info strong {
  color: #2c3e50;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .demo-container {
    padding: 20px;
  }
  
  .demo-section {
    padding: 20px;
  }
  
  .controls {
    flex-direction: column;
    align-items: center;
  }
  
  .controls .ant-btn {
    width: 100%;
    max-width: 200px;
  }
  
  h1 {
    font-size: 24px;
  }
  
  .demo-section h2 {
    font-size: 18px;
  }
}

/* 天气查询样式 */
.weather-query {
  padding: 20px 0;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.weather-result {
  margin-top: 20px;
}

.weather-result h4 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 600;
}

.weather-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.weather-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.weather-card:hover {
  transform: translateY(-2px);
}

.weather-label {
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 5px;
}

.weather-value {
  font-size: 16px;
  font-weight: 600;
}

.weather-error {
  margin-top: 15px;
}

@media (max-width: 768px) {
  .input-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .input-group .ant-input-number,
  .input-group .ant-btn {
    width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .weather-cards {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 10px;
  }
}
</style>