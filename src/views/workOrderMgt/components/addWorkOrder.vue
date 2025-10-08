<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import Sortable from 'sortablejs'

// 步骤索引
const current = ref(0)

// 表单模型
const stationInfo = reactive({
  name: '山东泰达长清服务区西区电站',
  stationId: '0000000000000000',
  etoOrderId: '0000000000000000',
  etoProjectName: 'xxxxxxxxxxxx',
  capacity: '50MW',
  inverterModels: [
    { model: 'IES900-X-X', count: 56 },
    { model: 'IES900-X-X', count: 56 },
    { model: 'IES900-X-X', count: 56 },
    { model: 'IES900-X-X', count: 56 }
  ],
  address: '山东省济南市章丘区文祖镇三德范村西南约2公里处',
  contact: '王五-15824561025'
})

const participants = reactive({
  onSite: ['张三', '张三'],
  liaison: ['李四', '王五'],
  submitter: '李四'
})

type TaskItem = { id?: string; title: string; children: string[] }
const demand = reactive({
  arriveDate: undefined as string | undefined,
  departDate: undefined as string | undefined,
  testDays: 5,
  tasks: [
    { id: '1', title: '调试任务1', children: ['阶段任务1 50台', '阶段任务2'] },
    { id: '2', title: '调试任务1', children: ['阶段任务1', '阶段任务2'] }
  ] as TaskItem[],
  acceptWithDelivery: '是',
  deliveryOwner: 'xxxxx',
  remark: ''
})

// 由父级 a-modal 控制显隐；此组件在点击“确定创建”时向外发出 submit 事件
const emit = defineEmits<{ (e: 'submit'): void }>()

const next = () => {
  if (current.value < 2) current.value += 1
}
const prev = () => {
  if (current.value > 0) current.value -= 1
}

// 任务列表操作（仅静态展示，保留按钮交互）
const addTask = () => {
  const newId = Date.now().toString()
  const newTask = { id: newId, title: `调试任务${demand.tasks.length + 1}`, children: [] }
  demand.tasks.push(newTask)
  console.log('添加任务:', newTask, '当前任务列表:', demand.tasks)
  // 重新初始化拖拽
  nextTick(() => {
    initSortable()
  })
}
const addSubTask = (task: TaskItem) => {
  task.children.push(`阶段任务${task.children.length + 1}`)
  // 重新初始化子任务拖拽
  nextTick(() => {
    initSubTaskSortable()
  })
}
const removeTask = (index: number) => {
  demand.tasks.splice(index, 1)
}
const removeSubTask = (task: TaskItem, subIndex: number) => {
  task.children.splice(subIndex, 1)
}

// 拖拽相关
const taskListRef = ref<HTMLElement>()
const subTaskRefs = ref<Map<number, HTMLElement>>(new Map())

const setSubTaskRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    subTaskRefs.value.set(index, el)
  }
}

// 初始化主任务拖拽
const initSortable = () => {
  if (taskListRef.value) {
    new Sortable(taskListRef.value, {
      handle: '.drag-handle',
      animation: 200,
      ghostClass: 'ghost-item',
      onEnd: (evt) => {
        const { oldIndex, newIndex } = evt
        if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== newIndex) {
          const movedItem = demand.tasks.splice(oldIndex, 1)[0]
          demand.tasks.splice(newIndex, 0, movedItem)
        }
      }
    })
  }
}

// 初始化子任务拖拽
const initSubTaskSortable = () => {
  subTaskRefs.value.forEach((el, taskIndex) => {
    if (el) {
      new Sortable(el, {
        handle: '.sub-drag-handle',
        animation: 200,
        ghostClass: 'ghost-sub-item',
        onEnd: (evt) => {
          const { oldIndex, newIndex } = evt
          if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== newIndex) {
            const task = demand.tasks[taskIndex]
            const movedItem = task.children.splice(oldIndex, 1)[0]
            task.children.splice(newIndex, 0, movedItem)
          }
        }
      })
    }
  })
}

// 组件挂载后初始化拖拽
onMounted(() => {
  nextTick(() => {
    initSortable()
    initSubTaskSortable()
  })
})
// 暴露给父组件控制步骤与状态
const isLast = computed(() => current.value >= 2)
defineExpose({ current, next, prev, isLast })
</script>

<template>
  <div class="add-workorder-modal">
    <!-- 步骤条 -->
    <a-flex vertical gap="12">
      <a-steps :current="current">
        <a-step title="电站信息" />
        <a-step title="参与人员" />
        <a-step title="需求内容" />
      </a-steps>

      <!-- 步骤1：电站信息 -->
      <div v-show="current===0">
        <a-form layout="vertical">
          <a-form-item label="电站名称" required>
            <a-input v-model:value="stationInfo.name" placeholder="请输入电站名称" />
          </a-form-item>
          <a-form-item label="电站编号">
            <a-input v-model:value="stationInfo.stationId" />
          </a-form-item>
          <a-form-item label="ETO调试单号">
            <a-input v-model:value="stationInfo.etoOrderId" />
          </a-form-item>
          <a-form-item label="ETO项目名称">
            <a-input v-model:value="stationInfo.etoProjectName" />
          </a-form-item>
          <a-form-item label="电站容量">
            <a-input v-model:value="stationInfo.capacity" />
          </a-form-item>

          <a-form-item label="逆变器信息">
            <a-flex vertical gap="8">
              <a-flex v-for="(inv, idx) in stationInfo.inverterModels" :key="idx" align="center" gap="8">
                <a-input v-model:value="inv.model" style="max-width:240px" />
                <a-input-number v-model:value="inv.count" :min="0" />
                <span>台</span>
              </a-flex>
            </a-flex>
          </a-form-item>

          <a-form-item label="地址位置">
            <a-input v-model:value="stationInfo.address" />
          </a-form-item>
          <a-form-item label="调试联系人">
            <a-input v-model:value="stationInfo.contact" />
          </a-form-item>
        </a-form>
      </div>

      <!-- 步骤2：参与人员 -->
      <div v-show="current===1">
        <a-form layout="vertical">
          <a-form-item label="现场服务" required>
            <a-select v-model:value="participants.onSite" mode="multiple" :options="participants.onSite.map(n=>({label:n,value:n}))" />
          </a-form-item>
          <a-form-item label="联保人员">
            <a-select v-model:value="participants.liaison" mode="multiple" :options="participants.liaison.map(n=>({label:n,value:n}))" />
          </a-form-item>
          <a-form-item label="联保提交人">
            <a-select v-model:value="participants.submitter" :options="[{label:'李四',value:'李四'},{label:'王五',value:'王五'}]" />
          </a-form-item>
        </a-form>
      </div>

      <!-- 步骤3：需求内容 -->
      <div v-show="current===2">
        <a-form layout="vertical">
          <a-flex gap="12">
            <a-form-item label="到场日期">
              <a-date-picker v-model:value="(demand.arriveDate as any)" />
            </a-form-item>
            <a-form-item label="离场日期">
              <a-date-picker v-model:value="(demand.departDate as any)" />
            </a-form-item>
            <a-form-item label="调试周期">
              <a-input-number v-model:value="demand.testDays" :min="0" />
            </a-form-item>
          </a-flex>

          <a-form-item label="调试任务">
            <a-flex vertical gap="12">
              <a-flex align="center" justify="space-between">
                <span>数量：{{ demand.tasks.length }}</span>
                <a-button type="link" @click="addTask">+ 添加调试任务</a-button>
              </a-flex>

              <div ref="taskListRef" class="task-list">
                <div v-for="(task, index) in demand.tasks" :key="task.id || index" class="task-item" :data-id="task.id">
                  <a-card size="small" style="margin-bottom: 8px;">
                    <a-flex align="center" gap="8" style="margin-bottom:8px;">
                      <span class="drag-handle" style="cursor: move; color: #999; font-size: 16px;">⋮⋮</span>
                      <a-input v-model:value="task.title" style="max-width:220px" />
                      <a-space>
                        <a-button size="small" @click="addSubTask(task)">添加阶段任务</a-button>
                        <a-button size="small" danger @click="removeTask(index)">删除</a-button>
                      </a-space>
                    </a-flex>
                    <a-flex vertical gap="8">
                      <div :ref="el => setSubTaskRef(el, index)" class="sub-task-list">
                        <div v-for="(sub, subIdx) in task.children" :key="subIdx" class="sub-task-item" :data-index="subIdx">
                          <a-flex gap="8" align="center" style="margin-left: 20px;">
                            <span class="sub-drag-handle" style="cursor: move; color: #999; font-size: 12px;">⋮</span>
                            <a-input v-model:value="task.children[subIdx]" />
                            <a-button size="small" danger @click="removeSubTask(task, subIdx)">删除</a-button>
                          </a-flex>
                        </div>
                      </div>
                    </a-flex>
                  </a-card>
                </div>
              </div>
            </a-flex>
          </a-form-item>

          <a-flex gap="12">
            <a-form-item label="是否备件发货">
              <a-select v-model:value="demand.acceptWithDelivery" :options="[{label:'是',value:'是'},{label:'否',value:'否'}]" />
            </a-form-item>
            <a-form-item label="发货负责人">
              <a-input v-model:value="demand.deliveryOwner" />
            </a-form-item>
          </a-flex>

          <a-form-item label="关键备注">
            <a-textarea v-model:value="demand.remark" :rows="4" placeholder="请输入内容" />
          </a-form-item>
        </a-form>
      </div>
    </a-flex>
  </div>
</template>

<style scoped>
.add-workorder-modal {
  max-height: 70vh;
  overflow-y: auto;
}

/* 拖拽样式 */
.ghost-item {
  opacity: 0.5;
  background: #f0f0f0;
}

.ghost-sub-item {
  opacity: 0.5;
  background: #f9f9f9;
}

.drag-handle:hover,
.sub-drag-handle:hover {
  color: #1890ff !important;
}
</style>
