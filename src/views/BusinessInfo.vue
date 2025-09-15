<<template>
  <div class="document-management-page">
    <!-- 顶部信息区域 -->
    <a-flex justify="space-between" gap="8" style="">
      <!-- 合同信息卡片 -->
      <!--      <div class="info-card contract-card">-->
      <!--        <a-flex justify="space-between" align="center" class="block-header-container">-->
      <!--          <a-flex align="center" class="block-title">-->
      <!--            <div class="title-bar"></div>-->
      <!--            <div class="cardTitle">易损部件型号</div>-->
      <!--          </a-flex>-->
      <!--          <a-button type="link" @click="openOrCloseVulnerableModal"><a-space><editSpan/>编辑</a-space></a-button>-->
      <!--        </a-flex>-->
      <!--        <div class="info-content">-->
      <!--          <div class="info-item">-->
      <!--            <span class="info-label">合同编号：</span>-->
      <!--            <span class="info-value">FWH202504060001</span>-->
      <!--          </div>-->
      <!--          <div class="info-item">-->
      <!--            <span class="info-label">公司：</span>-->
      <!--            <span class="info-value">XXXX公司</span>-->
      <!--          </div>-->
      <!--          <div class="info-item">-->
      <!--            <span class="info-label">联系电话：</span>-->
      <!--            <span class="info-value">15749857561</span>-->
      <!--          </div>-->
      <!--          <div class="info-item">-->
      <!--            <span class="info-label">属地用户：</span>-->
      <!--            <span class="info-value">陈六-17625461259</span>-->
      <!--          </div>-->
      <!--          <div class="info-item">-->
      <!--            <span class="info-label">销售负责人：</span>-->
      <!--            <span class="info-value">李四-17625461259</span>-->
      <!--          </div>-->
      <!--          <div class="info-item">-->
      <!--            <span class="info-label">拓展负责人：</span>-->
      <!--            <span class="info-value">王五-17625461259</span>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <EditCard title="合同信息">
        <template #content>
          <a-flex justify="start"  align="center" gap="22" style="height: 66px">
            <a-flex gap="12">
              <a-avatar :size="66" shape="square" :src="contractInformation"></a-avatar>
              <a-flex vertical>
                <div>
                  <a-tag>SS</a-tag><span style="font-size: 16px;line-height: 22px;font-weight: 600">FWH202504060001</span>
                </div>
                <a-flex style="width: 200px" gap="12">
                  <div style="width: 70px"><img :src="iconPersonSvg" style="width: 16px; height: 16px; margin-right: 4px;" /><span>公司</span></div>

                  <a-flex style="width: 70px"><img :src="iconPhoneSvg" style="width: 16px; height: 16px; margin-right: 4px;" /><span>18997656789</span></a-flex>
                </a-flex>
              </a-flex>
            </a-flex>
            <div>
              <a-flex gap="12" align="center">
                <a-avatar :size="45" shape="square" :src="personBlue"></a-avatar>
                <div style="height: 45px">
                  <p style="color:#788295;font-size: 12px;font-weight: 400;line-height: 22px">终端用户</p>
                  <p>陈六-12932892442</p>
                </div>
              </a-flex>

            </div>
            <div style="height: 45px">
              <p style="color:#788295;font-size: 12px;font-weight: 400;line-height: 22px">终端用户</p>
              <p>陈六-12932892442</p>
            </div>
            <div style="height: 45px">
              <p style="color:#788295;font-size: 12px;font-weight: 400;line-height: 22px">终端用户</p>
              <p>陈六-12932892442</p>
            </div>
          </a-flex>
        </template>
      </EditCard>
      <!-- 质保信息卡片 -->
      <div class="info-card warranty-card">
        <h3 class="info-card-title">质保信息</h3>
        <div class="info-content">
          <div class="info-item">
            <span class="info-label">开始时间：</span>
            <span class="info-value">2025/05/26</span>
          </div>
          <div class="info-item">
            <span class="info-label">周期：</span>
            <span class="info-value">2年</span>
          </div>
          <div class="info-item">
            <span class="info-label">内容：</span>
            <span class="info-value">xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</span>
          </div>
        </div>
        <button class="edit-btn">编辑</button>
      </div>
    </a-flex>

    <!-- 技术文档列表区域 -->
    <div class="docs-section">
      <h3 class="section-title">技术文档列表</h3>
      <button class="upload-btn">+ 上传技术文档</button>
      <table class="docs-table">
        <thead>
        <tr>
          <th>文档类型</th>
          <th>文档名称</th>
          <th>更新时间</th>
          <th>更新人</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="doc in docsList" :key="doc.id">
          <td>{{ doc.type }}</td>
          <td>{{ doc.name }}</td>
          <td>{{ doc.updateTime }}</td>
          <td>{{ doc.updater }}</td>
          <td class="actions">
            <a href="#" class="action-link">下载</a>
            <a href="#" class="action-link">重新上传</a>
            <span class="more-btn">···</span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import EditCard from '@/components/EditCard.vue';
import contractInformation from '@/assets/images/plant/contractInformation.png'
import iconPersonSvg from '@/assets/icons/aiopsSvg/iconPerson.svg?url'
import iconPhoneSvg from '@/assets/icons/aiopsSvg/iconPhone.svg?url'
import personBlue from '@/assets/images/plant/personBlue.png'
// 模拟技术文档列表数据
const docsList = ref([
  {
    id: 1,
    type: '技术协议',
    name: '储能升压一体机技术协议',
    updateTime: '2025-05-23 00:00:00',
    updater: 'xxxx'
  },
  {
    id: 2,
    type: '通讯架构图',
    name: 'PSC-IES900-07-25技术协议',
    updateTime: '2025-05-23 00:00:00',
    updater: 'xxxx'
  },
  {
    id: 3,
    type: 'BMS通讯协议',
    name: '储能升压一体机通讯架构图',
    updateTime: '2025-05-23 00:00:00',
    updater: 'xxxx'
  }
]);
</script>

<style lang="less" scoped>
// 全局变量定义
@primary-color: #409eff;   // 主色调（蓝色，用于可点击元素）
@border-color: #e4e7ed;    // 边框色
@text-color: #333;         // 主文字色
@light-text: #666;         // 次要文字色
@hover-bg: #f5f7fa;        //  hover 背景色

.document-management-page {
  height: calc(100vh - 100px);
}



/* 信息卡片通用样式 */
.info-card {
  flex: 1;
  height: 140px;
  border: 1px solid @border-color;
  border-radius: 4px;
  padding: 15px;
  background: #fff;
  position: relative;

  .info-card-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 15px;
    color: @text-color;
  }

  .info-content {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;

    .info-item {
      display: flex;
      align-items: center;
      min-width: 200px;

      .info-label {
        color: @light-text;
        margin-right: 5px;
      }

      .info-value {
        color: @text-color;
      }
    }
  }

  .edit-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    color: @primary-color;
    cursor: pointer;
    font-size: 14px;
  }
}

/* 技术文档区域 */
.docs-section {
  height: calc(100vh - 262px);
  background: #fff;
  border: 1px solid @border-color;
  border-radius: 4px;
  padding: 15px;

  .section-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 15px;
    color: @text-color;
  }

  .upload-btn {
    background: none;
    border: none;
    color: @primary-color;
    cursor: pointer;
    font-size: 14px;
    margin-bottom: 15px;
  }

  .docs-table {
    width: 100%;
    border-collapse: collapse;

    th, td {
      border: 1px solid @border-color;
      padding: 10px;
      text-align: left;
    }

    th {
      background-color: @hover-bg;
      font-weight: 600;
    }

    tr:hover {
      background-color: @hover-bg;
    }

    .actions {
      .action-link {
        color: @primary-color;
        text-decoration: none;
        margin-right: 10px;
        cursor: pointer;
      }

      .more-btn {
        cursor: pointer;
        color: @light-text;
      }
    }
  }
}


/* 卡片容器样式 */
.info-block {
  border: 1px solid #ffffff;
  border-radius: 4px;
  padding: 0 10px 10px 10px;
  background-color: #fff;
  margin-bottom: 8px;
}

</style>
