<template>
  <a-form :model="form" :rules="rules" ref="formRef" layout="vertical">
    <a-form-item label="日志编号" name="id">
      <a-input v-model:value="form.id" placeholder="请输入日志编号" />
    </a-form-item>

    <a-form-item label="关联电站" name="station">
      <a-select v-model:value="form.station" placeholder="请选择关联电站" allow-clear>
        <a-select-option v-for="s in stationOptions" :key="s" :value="s">{{ s }}</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="关联工单" name="workOrder">
      <a-input v-model:value="form.workOrder" placeholder="请输入关联工单编号" />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { reactive, ref, defineExpose } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'

const stationOptions = [
  '山东泰达电站',
  '青岛海上风电场',
  '临沂新能示范电站'
]

const form = reactive({
  id: '',
  station: undefined as string | undefined,
  workOrder: ''
})

const rules: Record<string, Rule[]> = {
  id: [{ required: true, message: '请输入日志编号' }],
  station: [{ required: true, message: '请选择关联电站' }],
  workOrder: [{ required: true, message: '请输入关联工单编号' }]
}

const formRef = ref<any>()

const validate = async () => {
  try {
    await formRef.value?.validate()
    return true
  } catch (e) {
    return false
  }
}

const getValues = () => ({ ...form })

defineExpose({ validate, getValues })
</script>

<style scoped>
</style>