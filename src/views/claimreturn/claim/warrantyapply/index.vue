<template>
  <div class="page-common m-warranty-apply-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <!-- 基础查询条件 -->
      <el-form-item label="保修申请单号：">
        <tag-input v-model="form.applyNoList" placeholder="请输入保修申请单号，多个用回车分隔" />
      </el-form-item>
      <el-form-item label="VIN：">
        <tag-input v-model="form.vinList" placeholder="请输入VIN，多个用回车分隔" />
      </el-form-item>

      <!-- 扩展查询条件 -->
      <template v-if="show">
      <el-form-item label="三包预警：">
        <fetch-select
          :request="fetchOptions"
          enumCode=""
          v-model="form.alarmLevel"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="施工单号：">
        <tag-input v-model="form.serviceProxyNoList" placeholder="请输入施工单号，多个用回车分隔" />
      </el-form-item>
      <el-form-item label="结算单号：">
        <tag-input v-model="form.statementCodeList" placeholder="请输入结算单号，多个用回车分隔" />
      </el-form-item>
      <el-form-item label="保修单状态：">
        <fetch-select
          :request="fetchOptions"
          enumCode="claim_warranty_apply_status"
          v-model="form.applyStatusList"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="保修类型：">
        <fetch-select
          :request="fetchOptions"
          enumCode=""
          v-model="form.repairItemTypeName"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="门店编码：">
        <dealer-select v-model="form.dealerCodeList" multiple/>
      </el-form-item>
      <el-form-item label="门店名称：">
        <dealer-select v-model="form.dealerNameList" multiple show-name/>
      </el-form-item>
      <el-form-item label="门店所属区域：">
        <fetch-select
          :request="fetchOptions"
          enumCode=""
          v-model="form.dealerRegionName"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="当前提交时间：">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="form.currentSubmitTime"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="车牌号：">
        <tag-input v-model="form.vehiclePlateNoList" placeholder="请输入车牌号，多个用回车分隔" />
      </el-form-item>
      <el-form-item label="车主姓名：">
        <tag-input v-model="form.ownerNameList" placeholder="请输入车主姓名，多个用回车分隔" />
      </el-form-item>
      <el-form-item label="车型：">
        <fetch-select
          :request="fetchOptions"
          enumCode=""
          v-model="form.vehicleModelName"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="保修开始日期：">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="form.warrantyStartdate"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="维修开始日期：">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="form.repairStartTime"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="主因件编码：">
        <tag-input v-model="form.mainPartCodeList" placeholder="请输入主因件编码，多个用回车分隔" />
      </el-form-item>
      <el-form-item label="主因件名称：">
        <tag-input v-model="form.mainPartNameList" placeholder="请输入主因件名称，多个用回车分隔" />
      </el-form-item>
      <el-form-item label="服务月份：">
        <el-input v-model="form.serviceMonth" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="工时分担比例：">
        <el-input v-model="form.laborShareRatio" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="备件分担比例：">
        <el-input v-model="form.partsShareRatio" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="其他分担比例：">
        <el-input v-model="form.otherShareRatio" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="创建时间：">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="form.createTime"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="修改时间：">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="form.updateTime"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      </template>
      <page-search-action
        v-if="canList"
        v-model="show"
        is-expandable
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button size="small" @click="handleWithdraw">批量撤回</el-button>
      <el-button size="small" @click="handleReject">批量驳回</el-button>
      <el-button size="small" @click="handleApprove">批量同意</el-button>
      <el-button size="small" @click="handleXXX">批量作废</el-button>
      <el-button size="small" @click="handleMark">打印标签</el-button>
    </div>
    <div
      class="ais-table-c"
    >
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-checkbox
        is-page
        checkboxFixed
        centralized
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
        @listSelect="handleListSelect"
        @sortChange="handleSortChange"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import {
  getList,
  submit,
  withdraw,
  approve,
} from '@/api/claimreturn/claim/warrantyapply/index';
import { getTableConfig, tableAddOrUpdate, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
// import ListSelect from '@/libs/components/list-select/index.vue';
import TagInput from '@/libs/components/TagInput';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  applyNo: '',
  vin: '',
  alarmLevel: '',
  serviceProxyNo: '',
  statementCode: '',
  applyStatus: '',
  repairItemTypeName: '',
  dealerCode: '',
  dealerName: '',
  dealerRegionName: '',
  currentSubmitTime: '',
  vehiclePlateNo: '',
  ownerName: '',
  vehicleModelName: '',
  warrantyStartdate: '',
  repairStartTime: '',
  mainPartCode: '',
  mainPartName: '',
  serviceMonth: '',
  laborShareRatio: '',
  partsShareRatio: '',
  otherShareRatio: '',
  createTime: '',
  updateTime: '',
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    EditPage,
    // ListSelect,
    TagInput,
  },
  data () {
    return {
      pageTitle: '新页面',
      pageType: 'list',
      // TIPS: 权限前缀 AISCR，根据实际情况修改
      moduleKey: 'AISCR-warrantyApply',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      clickItemId: '',
      //
      tableDataList: [],
      tableTotal: 0,
      tableForm: { page: 1, size: pageSize },
      //
      sortColumns: [
        // {
        // column: 'create_time',
        // sort: 'DESC'
        // }
      ],
    };
  },
  computed: {
    optionObj () {
      return {
        id: 'warrantyApplyTable',
        dataList: this.tableDataList,
        form: this.tableForm,
        dataProp: [
          {
            props: 'alarmLevelLabel',
            label: '三包预警',
            visible: true,
            width: 200,
          },
          {
            props: 'applyNo',
            label: '保修申请单',
            visible: true,
            width: 200,
            buttons: [{
              type: 'primary',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/claimreturn/claim/warrantyApply/edit',
                  query: {
                    id: row.id
                  }
                });
              }
            }]
          },
          {
            props: 'vin',
            label: 'VIN',
            visible: true,
            width: 200,
            buttons: [{
              type: 'primary',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/datacenter/vehicle/vehicleProfile/edit',
                  query: {
                    // TODO
                    id: row.id
                  }
                });
              }
            }]
          },
          {
            props: 'serviceProxyNo',
            label: '施工单',
            visible: true,
            width: 200,
            buttons: [{
              type: 'primary',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/maintain/sp/serviceProxy/edit',
                  query: {
                    id: row.serviceProxyId
                  }
                });
              }
            }]
          },
          {
            props: 'statementCode',
            label: '结算单号',
            visible: true,
            width: 200,
            buttons: [{
              type: 'primary',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/maintain/sp/serviceStatement/edit',
                  query: {
                    id: row.statementId
                  }
                });
              }
            }]
          },
          { props: 'applyStatusLabel', label: '保修单状态', visible: true, width: 200 },
          { props: 'repairItemTypeName', label: '保修类型', visible: true, width: 200 },
          { props: 'dealerCode', label: '门店编码', visible: true, width: 200 },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'dealerRegionName', label: '门店所属区域', visible: true, width: 200 },
          { props: 'currentSubmitTime', label: '当前提交时间', visible: true, width: 200 },
          { props: 'vehiclePlateNo', label: '车牌号', visible: true, width: 200 },
          { props: 'ownerName', label: '车主姓名', visible: true, width: 200 },
          { props: 'vehicleModelName', label: '车型', visible: true, width: 200 },
          { props: 'warrantyStartdate', label: '保修开始日期', visible: true, width: 200 },
          { props: 'repairStartTime', label: '维修开始日期', visible: true, width: 200 },
          { props: 'mainPartCode', label: '主因件编码', visible: true, width: 200 },
          { props: 'mainPartName', label: '主因件名称', visible: true, width: 200 },
          { props: 'mileage', label: '进店里程 KM', visible: true, width: 200 },
          { props: 'serviceMonth', label: '服务月份', visible: true, width: 200 },
          { props: 'laborClaimTotal', label: '工时索赔小计', visible: true, width: 200 },
          { props: 'partsClaimTotal', label: '备件索赔小计', visible: true, width: 200 },
          { props: 'otherClaimTotal', label: '其他索赔小计', visible: true, width: 200 },
          { props: 'totalClaimAmount', label: '索赔总金额', visible: true, width: 200 },
          { props: 'workCostCount', label: '工时费用小计', visible: true, width: 200 },
          { props: 'partsCostTotal', label: '备件费用小计', visible: true, width: 200 },
          { props: 'otherCostTotal', label: '其他费用小计', visible: true, width: 200 },
          { props: 'laborShareRatio', label: '工时分担比例', visible: true, width: 200 },
          { props: 'partsShareRatio', label: '备件分担比例', visible: true, width: 200 },
          { props: 'otherShareRatio', label: '其他分担比例', visible: true, width: 200 },
          { props: 'faultPhenomenon', label: '故障信息描述', visible: true, width: 200 },
          { props: 'troubleshootingFlow', label: '故障流程排查', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [
              {
                name: '提交',
                // popconfirmTitle: '确认提交?',
                click: (rowIndex, row) => {
                  submit({
                    id: row.id,
                  }).then(res => {
                    this.$message.success('提交成功');
                    this.getData();
                  });
                },
                type: 'info',
                show: (row) => {
                  // 未提交，已驳回
                  if (row.applyStatus === '10' || row.applyStatus === '40') {
                    return true;
                  }
                  return false;
                },
              },
              {
                name: '同意',
                click: (rowIndex, row) => {
                  approve({
                    id: row.id,
                  }).then(res => {
                    this.$message.success('提交成功');
                    this.getData();
                  });
                },
                type: 'info',
                show: (row) => {
                  // 【保修单状态】为审核中，待保修经理审核，待总经理审核显示此按钮
                  if (['20', '25', '30'].includes(row.applyStatus)) {
                    return true;
                  }
                  return false;
                },
              },
            ]
          }
        ],
        total: this.tableTotal
      };
    },
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    // 排序
    handleSortChange (value) {
      this.sortColumns = (value || []).map(item => {
        return {
          column: (item.field || '').replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
          sort: (item.order || '').toUpperCase()
        };
      });
      this.getData();
    },
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    handleReject () {},
    handleApprove () {
      if (!this.selectionList.length) {
        this.$message({
          type: 'warning',
          message: '请选择数据'
        });
        return;
      }
      this.$prompt('同意', '审批说明', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入审批说明',
        // inputValidator: (value) => {
        //   if (!value || value.trim() === '') {
        //     return '请输入审批说明';
        //   }
        //   return true;
        // }
      }).then(({ value }) => {
        const ids = this.selectionList.map(item => item.id);
        approve({
          ids,
          approvalRemark: value
        }).then(() => {
          this.$message({
            type: 'success',
            message: '审批成功!'
          });
          this.getData();
        }).catch(() => {
        });
      }).catch(() => {});
    },
    handleXXX () {},
    handleWithdraw () {
      if (!this.selectionList.length) {
        this.$message({
          type: 'warning',
          message: '请选择数据'
        });
        return;
      }
      this.$prompt('审核撤回', '撤回说明', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入撤回说明',
        inputValidator: (value) => {
          if (!value || value.trim() === '') {
            return '请输入撤回说明';
          }
          return true;
        }
      }).then(({ value }) => {
        const ids = this.selectionList.map(item => item.id);
        withdraw({
          ids,
          withdrawRemark: value
        }).then(() => {
          this.$message({
            type: 'success',
            message: '撤回成功!'
          });
          this.getData();
        }).catch(() => {
        });
      }).catch(() => {});
    },
    handleMark () {

    },
    handleAdd () {
      this.$router.push({
        path: '/claimreturn/claim/warrantyApply/edit'
      });
    },
    onSubmit () {
      this.tableForm.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.tableForm.page = 1;
      this.tableForm.pageSize = pageSize;
      this.getData();
    },
    getData () {
      this.loading = true;
      this.selectionList = [];

      getList({ ...this.getFormData(), pageNum: this.tableForm.page, pageSize: this.tableForm.size })
        .then(res => {
          this.tableDataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.tableTotal = res.total;
        }).finally(() => {
          this.loading = false;
        });
    },
    // 需要防抖场景时使用
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      return new Promise((resolve, reject) => {
        getTableConfig(this.optionObj.id).then(data => {
          resolve({ data });
        }).catch(err => {
          // 容错：此处如果接口挂了，也不应该影响正常使用
          console.error(err);
          resolve(mockConfig);
        });
      });
    },
    saveOrUpdate (data) {
      return tableAddOrUpdate(data);
    },
    paginationChange (type, num) {
      if (type === 'page') {
        this.tableForm.page = num;
      } else {
        this.tableForm.size = num;
      }
      this.debouncedGetData();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectionList = selection;
    },
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });

      // 动态处理所有日期范围字段
      if (this.form.currentSubmitTime) {
        delete data.currentSubmitTime;
        if (this.form.currentSubmitTime.length > 1) {
          data.currentSubmitTimeStart = this.form.currentSubmitTime[0];
          data.currentSubmitTimeEnd = this.form.currentSubmitTime[1];
        }
      }
      if (this.form.warrantyStartdate) {
        delete data.warrantyStartdate;
        if (this.form.warrantyStartdate.length > 1) {
          data.warrantyStartdateStart = this.form.warrantyStartdate[0];
          data.warrantyStartdateEnd = this.form.warrantyStartdate[1];
        }
      }
      if (this.form.repairStartTime) {
        delete data.repairStartTime;
        if (this.form.repairStartTime.length > 1) {
          data.repairStartTimeStart = this.form.repairStartTime[0];
          data.repairStartTimeEnd = this.form.repairStartTime[1];
        }
      }
      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = this.form.createTime[1];
        }
      }
      if (this.form.updateTime) {
        delete data.updateTime;
        if (this.form.updateTime.length > 1) {
          data.updateTimeStart = this.form.updateTime[0];
          data.updateTimeEnd = this.form.updateTime[1];
        }
      }

      // 排序字段
      data.sortColumns = this.sortColumns;
      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
  }
};
</script>

<style lang="scss" scoped>
.m-warranty-apply-list {
}
</style>
