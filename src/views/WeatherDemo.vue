<template>
  <div class="weather-demo">
    <div class="demo-container">
      <h1>🌤️ 百度地图天气查询演示</h1>
      
      <div class="weather-section">
        <div class="input-group">
          <div class="input-item">
            <label>经度:</label>
            <a-input-number 
              v-model:value="coordinates.longitude" 
              :precision="6"
              :step="0.000001"
              placeholder="请输入经度"
              style="width: 200px;"
            />
          </div>
          <div class="input-item">
            <label>纬度:</label>
            <a-input-number 
              v-model:value="coordinates.latitude" 
              :precision="6"
              :step="0.000001"
              placeholder="请输入纬度"
              style="width: 200px;"
            />
          </div>
          <a-button 
            type="primary" 
            size="large"
            @click="queryWeather"
            :loading="weatherLoading"
            style="min-width: 120px;"
          >
            查询天气
          </a-button>
        </div>
        
        <!-- 天气信息展示 -->
        <div v-if="weatherData" class="weather-result">
          <h3>📍 {{ weatherData.city }} - 天气信息</h3>
          <div class="weather-cards">
            <div class="weather-card">
              <div class="weather-icon">🌤️</div>
              <div class="weather-label">天气状况</div>
              <div class="weather-value">{{ weatherData.weather }}</div>
            </div>
            <div class="weather-card">
              <div class="weather-icon">🌡️</div>
              <div class="weather-label">温度</div>
              <div class="weather-value">{{ weatherData.temperature }}°C</div>
            </div>
            <div class="weather-card">
              <div class="weather-icon">💧</div>
              <div class="weather-label">湿度</div>
              <div class="weather-value">{{ weatherData.humidity }}%</div>
            </div>
            <div class="weather-card">
              <div class="weather-icon">🧭</div>
              <div class="weather-label">风向</div>
              <div class="weather-value">{{ weatherData.windDirection }}</div>
            </div>
            <div class="weather-card">
              <div class="weather-icon">💨</div>
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
        
        <!-- 使用说明 -->
        <div class="usage-info">
          <h3>📖 使用说明</h3>
          <ul>
            <li>输入经纬度坐标，点击"查询天气"按钮</li>
            <li>系统会根据坐标查询对应位置的天气信息</li>
            <li>默认坐标为北京（经度：116.404，纬度：39.915）</li>
            <li>由于演示环境，当前使用模拟数据展示功能</li>
          </ul>
          
          <h4>🌍 推荐测试坐标：</h4>
          <div class="coordinate-examples">
            <div class="coord-item" @click="setCoordinates(116.404, 39.915)">
              <strong>北京</strong> - 经度: 116.404, 纬度: 39.915
            </div>
            <div class="coord-item" @click="setCoordinates(121.473, 31.230)">
              <strong>上海</strong> - 经度: 121.473, 纬度: 31.230
            </div>
            <div class="coord-item" @click="setCoordinates(113.264, 23.129)">
              <strong>广州</strong> - 经度: 113.264, 纬度: 23.129
            </div>
            <div class="coord-item" @click="setCoordinates(114.057, 22.543)">
              <strong>深圳</strong> - 经度: 114.057, 纬度: 22.543
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, InputNumber, Alert } from 'ant-design-vue'
import { getWeatherByCoordinates, checkBaiduMapAPI, type WeatherInfo } from '@/utils/baiduWeather'

// 天气查询相关状态
const coordinates = ref({
  longitude: 116.404,  // 默认北京经度
  latitude: 39.915     // 默认北京纬度
})
const weatherData = ref<WeatherInfo | null>(null)
const weatherLoading = ref(false)
const weatherError = ref('')

// 天气查询方法
const queryWeather = async () => {
  if (!coordinates.value.longitude || !coordinates.value.latitude) {
    weatherError.value = '请输入有效的经纬度'
    return
  }

  // 检查百度地图API是否可用
  if (!checkBaiduMapAPI()) {
    console.warn('百度地图API未完全加载，使用模拟数据')
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

// 设置坐标
const setCoordinates = (longitude: number, latitude: number) => {
  coordinates.value.longitude = longitude
  coordinates.value.latitude = latitude
}
</script>

<style scoped>
/* 全局禁用所有元素的悬浮效果 */
* {
  transition: none !important;
  transform: none !important;
}

*:hover {
  transition: none !important;
  transform: none !important;
}

.weather-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-container {
  background: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 28px;
}

.weather-section {
  margin-top: 20px;
}

.input-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.input-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-item label {
  font-weight: 500;
  color: #333;
  min-width: 50px;
}

.weather-result {
  margin-top: 30px;
  text-align: center;
}

.weather-result h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 20px;
}

.weather-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.weather-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.weather-card:hover {
  /* 明确禁用所有悬浮效果 */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: none;
  transition: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.weather-icon {
  font-size: 24px;
  margin-bottom: 10px;
}

.weather-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.weather-value {
  font-size: 18px;
  font-weight: 600;
}

.weather-error {
  margin-top: 20px;
}

.usage-info {
  margin-top: 40px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.usage-info h3 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.usage-info h4 {
  color: #2c3e50;
  margin: 20px 0 10px 0;
}

.usage-info ul {
  margin-bottom: 20px;
}

.usage-info li {
  margin-bottom: 8px;
  color: #666;
}

.coordinate-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 10px;
}

.coord-item {
  padding: 12px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
}

.coord-item:hover {
  /* 明确禁用所有悬浮效果 */
  background: white;
  border-color: #e0e0e0;
  transform: none;
  transition: none;
}

.coord-item strong {
  color: #1890ff;
}

@media (max-width: 768px) {
  .input-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .input-item {
    justify-content: space-between;
  }
  
  .weather-cards {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }
  
  .coordinate-examples {
    grid-template-columns: 1fr;
  }
}
</style>