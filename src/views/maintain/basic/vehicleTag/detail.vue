<template>
  <div class="page-common-detail m-vehicle-tag-vin-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>车辆标识代码：{{ info.code }}</h2>
        <el-button size="small" @click="handleEdit" icon="el-icon-edit">编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="120px">
            <el-form-item label="车辆标识代码：" prop="code">
              {{ info.code  }}
            </el-form-item>
            <el-form-item label="车辆标识名称：" prop="name">
              {{ info.name  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>适配车辆</h2>
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
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/maintain/basic/vehicleTag/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import EditTable from '@/libs/components/EditTable';

export default {
  name: 'vehicleTagVinDetail',
  components: {
    EditTable
  },
  data () {
    return {
      loading: true,
      info: {},
      tableData: [],
      columns: [
        // 根据实际情况修改
        {
          field: 'vin',
          title: 'VIN',
          width: '50%',
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '50%',
        },
      ],
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['车辆标识适配VIN管理', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/maintain/basic/vehicleTag/edit',
        query: {
          id: this.$route.query.id
        }
      });
    },
    getData () {
      getDetail(this.$route.query.id).then(res => {
        this.loading = false;
        this.info = res;
        this.tableData = res.vinList || []; // 根据实际情况修改
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>
