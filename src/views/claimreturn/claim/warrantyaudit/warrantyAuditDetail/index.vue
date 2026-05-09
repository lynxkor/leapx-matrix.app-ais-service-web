<template>
  <div class="page-common m-warranty-audit-detail-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="保修申请单">
        <tag-input
          v-model="form.warrantyApplyCodeList"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="VIN码">
        <tag-input
          v-model="form.vinList"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="保修审计明细" v-show="this.visibleCount === 3 || show">
        <tag-input
          v-model="form.auditDetailCodeList"
          placeholder="请输入"
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="保修审计单">
          <tag-input
            v-model="form.auditCodeList"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="接车施工单">
          <tag-input
            v-model="form.serviceProxyCodeList"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="审计状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="warranty_audit_detail_status"
            v-model="form.auditStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="门店">
          <dealer-select v-model="form.dealerCodeList" multiple/>
        </el-form-item>
        <el-form-item label="保修类型">
          <fetch-select
            :remote-method="getRepairItemTypeList"
            remote
            v-model="form.repairItemTypeIdList"
            placeholder="请选择"
            labelKey="name"
            valueKey="id"
            subLabelKey="code"
            clearable
            multiple
            collapseTags
            filterable
          />
        </el-form-item>
        <el-form-item label="主因零件编码">
          <tag-input
            v-model="form.mainPartCodeList"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="主因零件名称">
          <el-input
            placeholder="请输入"
            v-model="form.mainPartNameLike"
            clearable
          />
        </el-form-item>
        <el-form-item label="错误项">
          <fetch-select
            :remote-method="getErrorItemList"
            remote
            v-model="form.errorTypeList"
            placeholder="请选择"
            labelKey="checkItem"
            valueKey="id"
            subLabelKey="errorCode"
            clearable
            multiple
            collapseTags
            filterable
          />
        </el-form-item>
        <el-form-item label="创建时间">
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
        <el-form-item label="修改时间">
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
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
    </div>
    <div class="ais-table-c">
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
    <!-- 补充材料弹窗 -->
    <SupplyMaterialDialog
      :visible.sync="supplyMaterialDialogVisible"
      :selectionItem="selectionItem"
      @update:visible="supplyMaterialDialogVisible = $event"
      @success="getData"
    />
    <!-- 审计通过弹窗 -->
    <AuditPassDialog
      :visible.sync="auditPassDialogVisible"
      :id="allId"
      @update:visible="auditPassDialogVisible = $event"
      @success="getData"
    />
    <!-- 审计驳回弹窗 -->
    <AuditRejectDialog
      :visible.sync="auditRejectDialogVisible"
      :id="allId"
      @update:visible="auditRejectDialogVisible = $event"
      @success="getData"
    />
    <!-- 申诉弹窗 -->
    <AppealDialog
      :visible.sync="appealDialogVisible"
      :selectionItem="selectionItem"
      @update:visible="appealDialogVisible = $event"
      @success="getData"
    />
    <!-- 同意申诉弹窗 -->
    <AgreeAppealDialog
      :visible.sync="agreeAppealDialogVisible"
      :id="allId"
      @update:visible="agreeAppealDialogVisible = $event"
      @success="getData"
    />
    <!-- 拒绝申诉弹窗 -->
    <RejectAppealDialog
      :visible.sync="rejectAppealDialogVisible"
      :id="allId"
      @update:visible="rejectAppealDialogVisible = $event"
      @success="getData"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import {
  getList as getWarrantyAuditDetailList,
  agree,
  getDecryptField,
} from '@/api/claimreturn/claim/warrantyaudit/warrantyAuditDetail/index';
import { getList as getRepairTypeList } from '@/api/maintain/basic/repairItemType/index';
import { getList as getErrorConfigList } from '@/api/claimreturn/claim/warrantyaudit/warrantyAuditErrorConfig/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';
import DealerSelect from '@/components/dealer-select';
import AuditRejectDialog from './components/AuditRejectDialog.vue';
import AuditPassDialog from './components/AuditPassDialog.vue';
import AgreeAppealDialog from './components/AgreeAppealDialog.vue';
import RejectAppealDialog from './components/RejectAppealDialog.vue';
import SupplyMaterialDialog from './components/SupplyMaterialDialog.vue';
import AppealDialog from './components/AppealDialog.vue';

const defaultForm = {
  warrantyApplyCodeList: [],
  vinList: [],
  auditDetailCodeList: [],
  auditCode: '',
  serviceProxyCodeList: [],
  auditStatusList: [],
  dealerCodeList: [],
  dealerNameList: '',
  repairItemTypeIdList: [],
  mainPartCodeList: [],
  mainPartNameLike: '',
  errorTypeList: '',
  createTime: '',
  updateTime: '',
  auditCodeList: [],
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
    TagInput,
    DealerSelect,
    AppealDialog,
    AuditPassDialog,
    AuditRejectDialog,
    AgreeAppealDialog,
    RejectAppealDialog,
    SupplyMaterialDialog
  },
  data () {
    return {
      pageTitle: '保修审计明细',
      pageType: 'list',
      moduleKey: 'AISCR-warrantyAuditDetail',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      clickItemId: '',
      // 弹窗控制
      supplyMaterialDialogVisible: false, // 补充材料弹窗
      auditPassDialogVisible: false, // 审计通过弹窗
      selectionItem: {}, // 材料弹窗的保修审计明细
      warrantyClaimId: '', // 申诉弹窗的保修单id
      auditRejectDialogVisible: false, // 审计驳回弹窗
      allId: '', // 所有弹窗  审计单id
      appealDialogVisible: false, // 申诉弹窗
      agreeAppealDialogVisible: false, // 同意申诉弹窗
      rejectAppealDialogVisible: false, // 拒绝申诉弹窗
      //
      tableDataList: [],
      tableTotal: 0,
      tableForm: { page: 1, size: pageSize },
      sortColumns: [],
    };
  },
  computed: {
    optionObj () {
      return {
        id: 'warrantyAuditDetailTable',
        dataList: this.tableDataList,
        form: this.tableForm,
        dataProp: [
          {
            props: 'auditDetailCode',
            label: '保修审计明细',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/claimreturn/claim/warrantyAudit/warrantyAuditDetail/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'warrantyApplyCode',
            label: '保修申请单',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/claimreturn/claim/warrantyApply/edit',
                  query: {
                    id: row.warrantyApplyId
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'serviceProxyCode',
            label: '接车施工单',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/maintain/sp/serviceProxy/edit',
                  query: {
                    id: row.serviceProxyId
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'auditCode',
            label: '保修审计单',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/claimreturn/claim/warrantyAudit/edit',
                  query: {
                    id: row.auditId
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'vin',
            label: 'VIN码',
            visible: true,
            width: 200,
            mask: true,
            getValue: (row) => getDecryptField(row.id, 'vin'),
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/datacenter/vehicle/vehicleProfile/edit',
                  query: {
                    vin: row.vin
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'dealerCode', label: '门店编码', visible: true, width: 150 },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'repairItemTypeName', label: '保修类型', visible: true, width: 140 },
          { props: 'totalClaimAmount', label: '索赔总金额', visible: true, width: 120, align: 'right' },
          { props: 'laborClaimTotal', label: '索赔工时小计', visible: true, width: 120, align: 'right' },
          { props: 'partsClaimTotal', label: '索赔备件小计', visible: true, width: 120, align: 'right' },
          { props: 'otherClaimTotal', label: '索赔其他小计', visible: true, width: 120, align: 'right' },
          { props: 'laborDeduct', label: '工时扣款', visible: true, width: 120, align: 'right' },
          { props: 'partDeduct', label: '备件扣款', visible: true, width: 120, align: 'right' },
          { props: 'otherDeduct', label: '其他扣款', visible: true, width: 120, align: 'right' },
          { props: 'planDeductTotal', label: '计划扣款总金额', visible: true, width: 150, align: 'right' },
          { props: 'deductedAmount', label: '已扣款金额', visible: true, width: 120, align: 'right' },
          { props: 'undeductAmount', label: '未扣款金额', visible: true, width: 120, align: 'right' },
          { props: 'auditDesc', label: '审计说明', visible: true, width: 200 },
          { props: 'errorTypeLabel', label: '错误项', visible: true, width: 150 },
          { props: 'createTime', label: '创建时间', visible: true, width: 180 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 180 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '补充材料',
              show: (row) => {
                return row.auditStatus === '20';
              },
              click: (rowIndex, row) => {
                this.handleSupplyMaterial(row);
              },
              type: 'info'
            }, {
              name: '审计通过',
              show: (row) => {
                return row.auditStatus === '30';
              },
              click: (rowIndex, row) => {
                this.handleAuditPass(row);
              },
              type: 'info'
            }, {
              name: '审计驳回',
              show: (row) => {
                return row.auditStatus === '30';
              },
              click: (rowIndex, row) => {
                this.handleAuditReject(row);
              },
              type: 'info'
            }, {
              name: '申述',
              show: (row) => {
                return row.auditStatus === '50';
              },
              click: (rowIndex, row) => {
                this.handleAppeal(row);
              },
              type: 'info'
            }, {
              name: '同意',
              show: (row) => {
                return row.auditStatus === '50';
              },
              popconfirmTitle: '是否同意申述?',
              click: (rowIndex, row) => {
                agree({ detailId: row.id }).then(() => {
                  this.$message({
                    type: 'success',
                    message: '同意成功!'
                  });
                  this.getData();
                }).catch(() => {
                });
              },
              type: 'info'
            }, {
              name: '同意申诉',
              show: (row) => {
                return row.auditStatus === '60';
              },
              click: (rowIndex, row) => {
                this.handleAgreeAppeal(row);
              },
              type: 'info'
            }, {
              name: '拒绝申诉',
              show: (row) => {
                return row.auditStatus === '60';
              },
              click: (rowIndex, row) => {
                this.handleRejectAppeal(row);
              },
              type: 'info'
            }]
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
    // 保修类型处理
    async getRepairItemTypeList (query) {
      try {
        const res = await getRepairTypeList({ nameLike: query || '' });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    // 错误项处理
    async getErrorItemList (query) {
      try {
        const res = await getErrorConfigList({ errorCategoryLike: query || '' });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
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
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '保修审计明细',
        dataFetchPath: 'claimreturn/claim/web/warrantyaudit/warrantyAuditDetail/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '保修审计明细.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$message({
            type: 'info',
            message: '请前往导出列表中查询导出结果'
          });
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    },
    getData () {
      this.loading = true;
      this.selectionList = [];

      getWarrantyAuditDetailList({ ...this.getFormData(), pageNum: this.tableForm.page, pageSize: this.tableForm.size })
        .then(res => {
          this.tableDataList = res.records.map(item => {
            // 格式化错误项列表，将 errorList 转换为 errorTypeLabel 字符串
            let errorTypeLabel = '';
            if (item.errorList && item.errorList.length > 0) {
              errorTypeLabel = item.errorList.map((err, index) => {
                return `${index + 1}) ${err.errorCategory}`;
              }).join(', ');
            }
            return {
              ...item,
              errorTypeLabel,
              deleteLoading: false
            };
          });
          this.tableTotal = res.total;
        }).finally(() => {
          this.loading = false;
        });
    },
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      return new Promise((resolve, reject) => {
        getTableConfig(this.optionObj.id).then(data => {
          resolve({ data });
        }).catch(err => {
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

      // 处理批量输入字段（逗号分隔转为数组）-
      const batchFields = [
        'warrantyApplyCodeList',
        'vinList',
        'auditDetailCodeList',
        'serviceProxyCodeList',
        'dealerCodeList',
        'mainPartCodeList',
        'auditCodeList',
      ];
      batchFields.forEach(field => {
        if (data[field] && typeof data[field] === 'string') {
          data[field] = data[field].split(',').map(s => s.trim()).filter(s => s);
        }
      });

      // 处理日期范围字段
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

      data.sortColumns = this.sortColumns;
      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 补充材料
    handleSupplyMaterial (row) {
      this.selectionItem = row;
      this.supplyMaterialDialogVisible = true;
    },
    // 审计驳回
    handleAuditReject (row) {
      this.allId = row.id;
      this.auditRejectDialogVisible = true;
    },
    // 申诉
    handleAppeal (row) {
      this.selectionItem = row;
      this.appealDialogVisible = true;
    },
    // 同意申诉
    handleAgreeAppeal (row) {
      this.allId = row.id;
      this.agreeAppealDialogVisible = true;
    },
    // 拒绝申诉
    handleRejectAppeal (row) {
      this.allId = row.id;
      this.rejectAppealDialogVisible = true;
    },
    // 审计通过
    handleAuditPass (row) {
      this.allId = row.id;
      this.auditPassDialogVisible = true;
    },
  }
};
</script>

<style lang="scss" scoped>
.m-warranty-audit-detail-list {
}
</style>
