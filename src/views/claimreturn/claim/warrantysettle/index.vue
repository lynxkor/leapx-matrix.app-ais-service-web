<template>
  <div class="page-common m-warranty-settle-list">
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="保修结算单">
        <tag-input
          v-model="form.settleCodeList"
          placeholder="请输入保修结算单号"
        />
      </el-form-item>
      <el-form-item label="门店">
        <fetch-select
          :remote-method="getDealerList"
          remote
          v-model="form.dealerCodeList"
          placeholder="请输入门店编码或名称"
          labelKey="orgName"
          valueKey="orgCode"
          subLabelKey="orgCode"
          clearable
          filterable
          multiple
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="月度">
          <el-input v-model="form.month" placeholder="请输入" clearable/>
        </el-form-item>
        <el-form-item label="门店状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="DealerStatusEnum"
            v-model="form.storeStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="通知书状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="settle_status"
            v-model="form.settleStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="银行户主">
          <el-input
            v-model="form.invoiceAccountNameLike"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
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
import { getList, confirm, complete, invoiceAccept, invoiceReturn, payConfirm } from '@/api/claimreturn/claim/warrantysettle/index';
import { getTableConfig, tableAddOrUpdate, getEnum, listOrgStoreInfo } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import TagInput from '@/libs/components/TagInput';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getEndOfDayString } from '@/libs/utils';
import EditPage from './edit.vue';

const defaultForm = {
  settleCodeList: [],
  dealerCodeList: [],
  month: '',
  dealerNameList: [],
  storeStatusList: [],
  settleStatusList: [],
  invoiceAccountNameLike: '',
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
    TagInput,
    EditPage
  },
  data () {
    return {
      pageTitle: '保修结算通知书',
      pageType: 'list',
      moduleKey: 'AISCR-warrantySettle',
      form: {
        ...defaultForm
      },
      selectionList: [],
      show: false,
      loading: false,
      clickItemId: '',
      tableDataList: [],
      tableTotal: 0,
      tableForm: { page: 1, size: pageSize },
      // 操作按钮权限
      canConfirm: false,
      canComplete: false,
      canInvoiceAccept: false,
      canInvoiceReturn: false,
      canPayConfirm: false,
    };
  },
  computed: {
    optionObj () {
      return {
        id: 'warrantySettleTable',
        dataList: this.tableDataList,
        form: this.tableForm,
        dataProp: [
          {
            props: 'settleCode',
            label: '保修结算单',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              type: 'primary',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/claimreturn/claim/warrantySettle/edit',
                  query: {
                    id: row.id
                  }
                });
              }
            }]
          },
          { props: 'month', label: '月度', visible: true, width: 120 },
          { props: 'dealerCode', label: '门店编码', visible: true, width: 120 },
          { props: 'dealerName', label: '门店名称', visible: true, width: 180 },
          { props: 'storeStatusLabel', label: '门店状态', visible: true, width: 120 },
          { props: 'settleStatusLabel', label: '通知书状态', visible: true, width: 120 },
          { props: 'invoiceAccountName', label: '银行户主', visible: true, width: 150 },
          {
            props: 'workHourTotal',
            label: '工时总额',
            visible: true,
            width: 150,
            formatter: (row) => this.formatAmount(row.workHourTotal)
          },
          {
            props: 'partTotal',
            label: '备件总额',
            visible: true,
            width: 150,
            formatter: (row) => this.formatAmount(row.partTotal)
          },
          {
            props: 'otherTotal',
            label: '其他总额',
            visible: true,
            width: 150,
            formatter: (row) => this.formatAmount(row.otherTotal)
          },
          {
            props: 'totalAmount',
            label: '总金额',
            visible: true,
            width: 150,
            formatter: (row) => this.formatAmount(row.totalAmount)
          },
          {
            props: 'tracebackAmount',
            label: '追溯金额',
            visible: true,
            width: 150,
            formatter: (row) => this.formatAmount(row.tracebackAmount)
          },
          {
            props: 'determineAmount',
            label: '判定金额',
            visible: true,
            width: 150,
            formatter: (row) => this.formatAmount(row.determineAmount)
          },
          {
            props: 'invoiceAmount13',
            label: '开票金额一 （13%）',
            visible: true,
            width: 160,
            formatter: (row) => this.formatAmount(row.invoiceAmount13)
          },
          {
            props: 'invoiceAmount6',
            label: '开票金额二 （6%）',
            visible: true,
            width: 160,
            formatter: (row) => this.formatAmount(row.invoiceAmount6)
          },
          { props: 'createTime', label: '创建时间', visible: true, width: 180 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 180 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            width: 280,
            buttons: [
              {
                name: '确认',
                click: (rowIndex, row) => {
                  this.handleConfirm(row);
                },
                type: 'info',
                show: (row) => {
                  return this.canConfirm && row.settleStatus === '10';
                }
              },
              {
                name: '开票完成',
                click: (rowIndex, row) => {
                  this.handleComplete(row);
                },
                type: 'info',
                show: (row) => {
                  return this.canComplete && (row.settleStatus === '60' || row.settleStatus === '110');
                }
              },
              {
                name: '发票验收',
                click: (rowIndex, row) => {
                  this.handleInvoiceAccept(row);
                },
                type: 'info',
                show: (row) => {
                  return this.canInvoiceAccept && row.settleStatus === '65';
                }
              },
              {
                name: '发票退回',
                click: (rowIndex, row) => {
                  this.handleInvoiceReturn(row);
                },
                type: 'info',
                show: (row) => {
                  return this.canInvoiceReturn && row.settleStatus === '65';
                }
              },
              {
                name: '确认付款',
                click: (rowIndex, row) => {
                  this.handlePayConfirm(row);
                },
                type: 'info',
                show: (row) => {
                  return this.canPayConfirm && row.settleStatus === '90';
                }
              }
            ]
          }
        ],
        total: this.tableTotal
      };
    }
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
    this.canConfirm = this.permissions.has(`${this.moduleKey}-confirm`);
    this.canComplete = this.permissions.has(`${this.moduleKey}-complete`);
    this.canInvoiceAccept = this.permissions.has(`${this.moduleKey}-invoiceAccept`);
    this.canInvoiceReturn = this.permissions.has(`${this.moduleKey}-invoiceReturn`);
    this.canPayConfirm = this.permissions.has(`${this.moduleKey}-payConfirm`);
    console.log(this.permissions);
  },
  methods: {
    // 格式化金额
    formatAmount (amount) {
      if (amount === null || amount === undefined) {
        return '0.00';
      }
      return Number(amount).toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    // 确认
    handleConfirm (row) {
      this.$confirm('确认保修结算通知书?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        confirm(row.id).then(() => {
          this.$message.success('确认成功');
          this.getData();
        });
      }).catch(() => {});
    },
    // 开票完成
    handleComplete (row) {
      this.$confirm('确认开票完成?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        complete({ id: row.id }).then(() => {
          this.$message.success('开票完成');
          this.getData();
        });
      }).catch(() => {});
    },
    // 发票验收
    handleInvoiceAccept (row) {
      this.$confirm('确认发票验收?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        invoiceAccept({ id: row.id }).then(() => {
          this.$message.success('发票验收成功');
          this.getData();
        });
      }).catch(() => {});
    },
    // 发票退回
    handleInvoiceReturn (row) {
      this.$prompt('发票退回', '请输入退回原因', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入退回原因',
        inputValidator: (value) => {
          if (!value || value.trim() === '') {
            return '请输入退回原因';
          }
          return true;
        }
      }).then(({ value }) => {
        invoiceReturn({
          id: row.id,
          returnReason: value
        }).then(() => {
          this.$message.success('发票退回成功');
          this.getData();
        });
      }).catch(() => {});
    },
    // 确认付款
    handlePayConfirm (row) {
      this.$prompt('确认付款', '请输入付款说明', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入付款说明'
      }).then(({ value }) => {
        payConfirm({
          id: row.id,
          payRemark: value
        }).then(() => {
          this.$message.success('确认付款成功');
          this.getData();
        });
      }).catch(() => {});
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
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null || (Array.isArray(data[key]) && data[key].length === 0)) {
          delete data[key];
        }
      });

      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = getEndOfDayString(this.form.createTime[1]);
        }
      }
      if (this.form.updateTime) {
        delete data.updateTime;
        if (this.form.updateTime.length > 1) {
          data.updateTimeStart = this.form.updateTime[0];
          data.updateTimeEnd = getEndOfDayString(this.form.updateTime[1]);
        }
      }

      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    getDealerList (query) {
      return listOrgStoreInfo({
        name: query,
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.m-warranty-settle-list {
}
</style>
