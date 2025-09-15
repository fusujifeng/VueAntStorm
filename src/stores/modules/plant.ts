import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlantsStore = defineStore('plants', () => {
  const plantInfo = ref({
    id: '1',
    eto_name: 'ETO名称',
    name: '华北电站',
    power_gen_type: '发电类型',
    energy_type: '储能类型',
    plant_capacity: 5000,
    belong_year: 2024,
    ino_device: '是汇川设备',
    is_warranty: '在质保',
    timezone: '中国',
    country: '中国',
    province: '云南',
    city: '大理',
    county: '西区',
    address: '洱海',
    longitude: 777.43,
    latitude: 888.43,
    elevation: 1000
  })

  return {
    plantInfo
  }
})