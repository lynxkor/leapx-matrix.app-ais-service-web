<template>
  <div class="page-common-detail m-three-guarantees-rule-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>三包规则编码：{{ info.ruleCode }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="140px">
            <!-- TIPS: 根据实际情况调整展示字段 -->
            <el-form-item label="三包规则编码：" prop="ruleCode">
              {{ info.ruleCode  }}
            </el-form-item>
            <el-form-item label="判断依据：" prop="judgmentBasis">
              {{ info.judgmentBasis  }}
            </el-form-item>
            <el-form-item label="判断单位：" prop="determineUnitLabel">
              {{ info.determineUnitLabel  }}
            </el-form-item>
            <el-form-item label="累计方式：" prop="accumulationLabel">
              {{ info.accumulationLabel  }}
            </el-form-item>
            <el-form-item label="车辆用途：" prop="vehiclePropertyLabel">
              {{ info.vehiclePropertyLabel  }}
            </el-form-item>
            <el-form-item label="销售开始日期：" prop="saleStartDate">
              {{ info.saleStartDate  }}
            </el-form-item>
            <el-form-item label="销售结束日期：" prop="saleEndDate">
              {{ info.saleEndDate  }}
            </el-form-item>
            <el-form-item label="预警车龄起（天）：" prop="warningVehicleAgeFrom">
              {{ info.warningVehicleAgeFrom  }}
            </el-form-item>
            <el-form-item label="预警车龄止（天）：" prop="warningVehicleAgeTo">
              {{ info.warningVehicleAgeTo  }}
            </el-form-item>
            <el-form-item label="预警里程起（公里）：" prop="warningMileageFrom">
              {{ info.warningMileageFrom  }}
            </el-form-item>
            <el-form-item label="预警里程止（公里）：" prop="warningMileageTo">
              {{ info.warningMileageTo  }}
            </el-form-item>
            <el-form-item label="绿色预警区间1：" prop="greenWarning1">
              {{ info.greenWarning1  }}
            </el-form-item>
            <el-form-item label="绿色预警区间2：" prop="greenWarning2">
              {{ info.greenWarning2  }}
            </el-form-item>
            <el-form-item label="黄色预警区间2：" prop="yellowWarning2">
              {{ info.yellowWarning2  }}
            </el-form-item>
            <el-form-item label="黄色预警区间1：" prop="yellowWarning1">
              {{ info.yellowWarning1  }}
            </el-form-item>
            <el-form-item label="红色预警区间1：" prop="redWarning1">
              {{ info.redWarning1  }}
            </el-form-item>
            <el-form-item label="红色预警区间2：" prop="redWarning2">
              {{ info.redWarning2  }}
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
            <el-form-item label="警示条款：" prop="reminderItem">
              {{ info.reminderItem  }}
            </el-form-item>
            <el-form-item label="警示内容：" prop="reminderContent">
              {{ info.reminderContent  }}
            </el-form-item>
            <el-form-item label="预警内容：" prop="warningContent">
              {{ info.warningContent  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>零件明细</h2>
        </div>
        <div class="common-section-body">
          <div class="common-section-table">
            <edit-table
              ref="editTable"
              :columns="columns"
              :data="tableData"
              :editConfig="false"
              :defaultNewRow="defaultNewRow"
              :show-toolbar="false"
              :options="options"
              :auth="{ edit: canAddOrUpdate, delete: canAddOrUpdate }"
              :isFocusNewRow="false"
              :enableSingleRowSave="true"
              :showPagination="true"
              :current="current"
              :pageSize="pageSize"
              :total="total"
              @save-row-edit="saveRowEdit"
              @remove-row="handleRemoveRow"
              @page-size-change="pageSizeChange"
              @current-page-change="currentPageChange"
              :disabled="true"
            />
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/claimreturn/claim/basic/threeGuaranteesRule';
import EditTable from '@/libs/components/EditTable';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import tableMixin from './tableMixin';

export default {
  name: 'threeGuaranteesRuleDetail',
  mixins: [permissions, commonMixins, tableMixin],
  components: {
    EditTable
  },
  data () {
    return {
      pageTitle: '三包配置规则',
      pageType: 'detail',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-threeGuaranteesRule',
      loading: true,
      info: {},
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['三包配置规则', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/claimreturn/claim/basic/threeGuaranteesRule/edit',
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
