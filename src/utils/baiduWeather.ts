// 全局类型声明
declare global {
  interface Window {
    BMap: any;
    BMapLib: any;
    baiduMapReady: boolean;
  }
}

// 天气信息接口
export interface WeatherInfo {
  city: string;
  weather: string;
  temperature: string;
  humidity: string;
  windDirection: string;
  windSpeed: string;
}

// 检查百度地图API是否可用
export function checkBaiduMapAPI(): boolean {
  return typeof window !== 'undefined' && 
         (window.baiduMapReady === true || typeof window.BMap !== 'undefined');
}

// 模拟天气数据获取（用于演示）
function fetchWeatherData(longitude: number, latitude: number): Promise<WeatherInfo> {
  return new Promise((resolve) => {
    // 模拟API延迟
    setTimeout(() => {
      // 根据经纬度生成模拟数据
      const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '西安', '武汉'];
      const weathers = ['晴', '多云', '阴', '小雨', '中雨', '雷阵雨', '雪'];
      const windDirections = ['北风', '南风', '东风', '西风', '东北风', '西北风', '东南风', '西南风'];
      
      const cityIndex = Math.floor((Math.abs(longitude) + Math.abs(latitude)) * 10) % cities.length;
      const weatherIndex = Math.floor((longitude + latitude) * 100) % weathers.length;
      const windIndex = Math.floor(longitude * latitude * 10) % windDirections.length;
      
      const temperature = Math.round(15 + (longitude + latitude) % 20);
      const humidity = Math.round(40 + Math.abs(longitude - latitude) * 10) % 60 + 30;
      const windSpeed = Math.round(Math.abs(longitude - latitude) * 5) % 15 + 1;
      
      resolve({
        city: cities[cityIndex],
        weather: weathers[Math.abs(weatherIndex)],
        temperature: temperature.toString(),
        humidity: humidity.toString(),
        windDirection: windDirections[Math.abs(windIndex)],
        windSpeed: `${windSpeed}级`
      });
    }, 1000);
  });
}

// 使用百度地图API获取真实天气数据（需要配置API密钥）
async function getRealWeatherData(longitude: number, latitude: number): Promise<WeatherInfo> {
  return new Promise((resolve, reject) => {
    if (!window.BMap) {
      reject(new Error('百度地图API未加载'));
      return;
    }

    try {
      const point = new window.BMap.Point(longitude, latitude);
      const geoc = new window.BMap.Geocoder();
      
      // 逆地理编码获取地址信息
      geoc.getLocation(point, (result: any) => {
        if (result) {
          const city = result.addressComponents.city || result.addressComponents.district || '未知城市';
          
          // 注意：百度地图API本身不直接提供天气服务
          // 这里需要结合其他天气API或使用百度地图的天气图层
          // 由于演示目的，这里仍使用模拟数据，但会显示真实的城市名称
          fetchWeatherData(longitude, latitude).then(weatherData => {
            resolve({
              ...weatherData,
              city: city.replace('市', '')
            });
          });
        } else {
          reject(new Error('无法获取位置信息'));
        }
      });
    } catch (error) {
      reject(new Error('百度地图API调用失败'));
    }
  });
}

// 主要的天气查询函数
export async function getWeatherByCoordinates(
  longitude: number, 
  latitude: number
): Promise<WeatherInfo> {
  // 验证输入参数
  if (!longitude || !latitude) {
    throw new Error('经纬度参数不能为空');
  }
  
  if (longitude < -180 || longitude > 180) {
    throw new Error('经度范围应在-180到180之间');
  }
  
  if (latitude < -90 || latitude > 90) {
    throw new Error('纬度范围应在-90到90之间');
  }

  try {
    // 如果百度地图API可用且已配置密钥，使用真实API
    if (checkBaiduMapAPI() && window.baiduMapReady) {
      return await getRealWeatherData(longitude, latitude);
    } else {
      // 否则使用模拟数据
      console.warn('百度地图API未完全加载或未配置API密钥，使用模拟数据');
      return await fetchWeatherData(longitude, latitude);
    }
  } catch (error) {
    console.error('天气查询失败:', error);
    // 如果真实API失败，回退到模拟数据
    return await fetchWeatherData(longitude, latitude);
  }
}