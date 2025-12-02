<template>
  <div class="page-common-detail m-dealer-station-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>工位代码：{{ info.code }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="100px">
            <el-form-item label="工位代码：" prop="code">
              {{ info.code  }}
            </el-form-item>
            <el-form-item label="工位名称：" prop="name">
              {{ info.name  }}
            </el-form-item>
            <el-form-item label="工位类型：" prop="stationType">
              {{ info.stationTypeLabel }}
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerName">
              {{ info.dealerName }}
            </el-form-item>
            <el-form-item label="负责人：" prop="ownerName">
              {{ info.ownerName }}
            </el-form-item>
            <el-form-item label="说明：" prop="remark" class="form-item-full">
              {{ info.remark }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <!-- <section class="common-section">
        <div class="common-section-header">
          <h2>维修工程师</h2>
        </div>
        <div class="common-section-body">
          <div class="common-section-table">
            <edit-table
              ref="editTable"
              :columns="columns"
              :data="tableData"
              :show-toolbar="false"
            />
          </div>
        </div>
      </section> -->
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/maintain/basic/dealerStation/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
// import EditTable from '@/libs/components/EditTable';
import permissions from '@/libs/mixins/permissions';

export default {
  name: 'dealerStationEdit',
  components: {
    // EditTable
  },
  mixins: [permissions],
  data () {
    return {
      moduleKey: 'AISMC-dealerStation',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['厅店工位信息', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/maintain/basic/dealerStation/edit',
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
    }
  }
};
</script>
