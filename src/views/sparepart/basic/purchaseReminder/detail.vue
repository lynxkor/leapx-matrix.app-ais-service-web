<template>
  <div class="page-common-detail m-purchase-reminder-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>提醒类别：{{ info.reminderCategory }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <!-- TIPS: 根据实际情况调整展示字段和宽度 -->
          <el-form :inline="true" ref="ruleForm" label-width="150px">
            <el-form-item label="提醒类别：" prop="reminderCategory">
              {{ info.reminderCategory  }}
            </el-form-item>
            <el-form-item label="提醒内容：" prop="reminderContent">
              {{ info.reminderContent  }}
            </el-form-item>
            <el-form-item label="是否启用：" prop="status">
              {{ info.statusLabel  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>备件清单</h2>
        </div>
        <div class="common-section-body">
          <div class="common-section-table">
              <el-table
                :data="tableData"
                style="width: 100%"
                fit
                stripe
                highlight-current-row
              >
                <el-table-column prop="sparePartCode" label="零件编码" width="280">
                  <template #default="{ row }">
                    <el-link type="success" :href="'/service/sparepart/basic/sparePart/detail?id=' + row.sparePartId" target="_blank">{{ row.sparePartCode }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="sparePartName" label="零件名称" width="280"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="280"></el-table-column>
              </el-table>
            </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail, getPartDetailPage } from '@/api/sparepart/basic/purchaseReminder/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

export default {
  name: 'purchaseReminderDetail',
  mixins: [permissions, commonMixins],
  components: {
  },
  data () {
    return {
      pageTitle: '详情',
      pageType: 'detail',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-purchaseReminder',
      loading: true,
      info: {},
      tableData: [],
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['备件采购提醒设置', '详情']);
    this.getData();
    this.partDetailPage();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/sparepart/basic/purchaseReminder/edit',
        query: {
          id: this.$route.query.id
        }
      });
    },
    getData () {
      getDetail(this.$route.query.id).then(res => {
        this.loading = false;
        this.info = res;
      }).catch(() => {
        this.loading = false;
      });
    },
    async partDetailPage () {
      const partRes = await getPartDetailPage({
        purchaseReminderId: this.$route.query.id
      });
      this.tableData = partRes?.records || [];
    },
  }
};
</script>
