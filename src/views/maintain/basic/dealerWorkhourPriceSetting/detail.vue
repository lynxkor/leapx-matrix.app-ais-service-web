<template>
  <div class="page-common-detail m-dealer-workhour-price-setting-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>价格设置代码：{{ info.code }}</h2>
        <el-button size="small" @click="handleEdit" icon="el-icon-edit">编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基本信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="120px">
            <el-form-item label="价格设置代码：" prop="code">
              {{ info.code  }}
            </el-form-item>
            <el-form-item label="门店名称：" prop="dealerName">
              {{ info.dealerName  }}
            </el-form-item>
            <el-form-item label="工时单价：" prop="workhourPrice">
              {{ info.workhourPrice  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>特殊价格</h2>
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
import { getDetail } from '@/api/maintain/basic/dealerWorkhourPriceSetting/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import EditTable from '@/libs/components/EditTable';
export default {
  name: 'dealerWorkhourPriceSettingEdit',
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
          field: 'vehicleModelName',
          title: '基本车型',
          width: '33%',
        },
        {
          field: 'workhourPrice',
          title: '工时单价',
          width: '33%',
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '33%',
        },
      ],
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['工时价格设置管理', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/maintain/basic/dealerWorkhourPriceSetting/edit',
        query: {
          id: this.$route.query.id
        }
      });
    },
    getData () {
      getDetail(this.$route.query.id).then(res => {
        this.loading = false;
        this.info = res;
        this.tableData = res.modelWorkhourPriceRespList || []; // 根据实际情况修改
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>
