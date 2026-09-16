<template>
  <div class="page-common m-account-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="账户编号">
        <el-input
          placeholder="请输入"
          v-model="form.code"
          clearable
        />
      </el-form-item>
      <el-form-item label="公司">
        <fetch-select
            :remote-method="getParentCompany"
            remote
            v-model="form.companyCodeList"
            placeholder="请输入公司编码或名称"
            labelKey="companyName"
            valueKey="companyCode"
            subLabelKey="companyCode"
            clearable
            multiple
            collapseTags
            filterable
              />
      </el-form-item>
      <el-form-item label="入账时间" v-show="this.visibleCount === 3 || show">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="form.postingTime"
          type="daterange"
          unlink-panels
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <template v-if="show">
        <template v-if="activeName === 'allSpareParts'">
          <el-form-item label="账户创建时间">
            <el-date-picker
              :default-time="['00:00:00', '23:59:59']"
              v-model="form.createAccountTime"
              type="daterange"
              unlink-panels
              :picker-options="pickerOptions"
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="账户修改时间">
            <el-date-picker
              :default-time="['00:00:00', '23:59:59']"
              v-model="form.updateAccountTime"
              type="daterange"
              unlink-panels
              :picker-options="pickerOptions"
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="交易流水号">
            <tag-input v-model="form.transactionNoList" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="交易类型">
            <fetch-select
              :request="fetchOptions"
              enumCode="AccountTransactionTypeNoFrozenEnum"
              v-model="form.transactionTypeList"
              placeholder="请选择"
              clearable
              multiple
              filterable
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
              multiple
              collapseTags
              filterable
            />
          </el-form-item>
          <el-form-item label="业务类型">
            <fetch-select
              :request="fetchOptions"
              enumCode="AccountBusinessTypeEnum"
              v-model="form.businessTypeList"
              placeholder="请选择"
              clearable
              multiple
              filterable
            />
          </el-form-item>
          <el-form-item label="业务单号">
            <tag-input v-model="form.businessNoList" placeholder="请输入" />
          </el-form-item>
        </template>
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
      <!-- <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button> -->
      <!-- <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button> -->
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <!-- <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button> -->
      <!-- <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button> -->
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="返利账户" name="homePage"></el-tab-pane>
      <el-tab-pane label="账户流水" name="allSpareParts"></el-tab-pane>
    </el-tabs>
    <div
      class="ais-table-c"
      v-if="activeName === 'homePage'"
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
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
    <div
      class="ais-table-c"
      v-if="activeName === 'allSpareParts'"
    >
      <LPVxeTable
        :key="2"
        ref="tableRefAll"
        v-loading="loading"
        is-checkbox
        is-page
        checkboxFixed
        :option-obj="optionObjAll"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
        @listSelect="handleListSelect"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      :id="'1'"
      @close="handleUploadDialogClose"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, detailPage, deleteItem, enableItem } from '@/api/sparepart/fund/account/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, getSparePartCompany, listOrgStoreInfoByParam, getSparePartOrderIdByCode } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import TagInput from '@/libs/components/TagInput';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel, getEndOfDayString } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
// console.log('类型' + this.$route.query.type);
const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  code: '',
  accountType: 'REBATE',
  companyCodeList: [],
  createTime: '',
  updateTime: '',
  postingTime: null,

  // ===== 全部备件 tab 专用（仅 allSpareParts 用） =====
  createAccountTime: null,
  updateAccountTime: null,
  transactionNoList: [],
  transactionTypeList: [],
  dealerCodeList: [],
  businessTypeList: [],
  businessNoList: []
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
    EditPage,
    Upload
  },
  data () {
    return {
      pageTitle: '备件返利账户',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-accountRebate',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      clickItemId: '',
      activeName: 'homePage',
      optionObj: {
        id: 'accountTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '账户编号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/fund/accountRebate/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'companyCode', label: '公司编码', visible: true, width: 180 },
          { props: 'companyName', label: '公司名称', visible: true, width: 200 },
          { props: 'bankName', label: '开户银行', visible: true, width: 200 },
          { props: 'bankAccountHolder', label: '银行户主', visible: true, width: 200 },
          { props: 'bankAccount', label: '开户账户', visible: true, width: 200 },
          { props: 'availableAmount', label: '可用资金', visible: true, align: 'right', width: 120 },
          { props: 'frozenAmount', label: '冻结资金', visible: true, align: 'right', width: 120 },
          { props: 'marginAmount', label: '保证资金', visible: true, align: 'right', width: 120 },
          { props: 'totalAmount', label: '账户总额', visible: true, align: 'right', width: 120 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          // {
          //   props: 'operate',
          //   label: '操作',
          //   type: 'operate',
          //   visible: true,
          //   fixed: 'right',
          //   buttons: [{
          //     name: '编辑',
          //     click: (rowIndex, row) => {
          //       this.$router.push({
          //         path: '/sparepart/fund/account/edit',
          //         query: {
          //           id: row.id
          //         }
          //       });
          //     },
          //     type: 'info'
          //   }, {
          //     name: '删除',
          //     popconfirmTitle: '此操作将永久删除, 是否继续?',
          //     click: (rowIndex, row) => {
          //       deleteItem([row.id]).then(() => {
          //         this.$message({
          //           type: 'success',
          //           message: '删除成功!'
          //         });
          //         this.getData();
          //       }).catch(() => {
          //         this.$message({
          //           type: 'error',
          //           message: '删除失败!'
          //         });
          //       });
          //     },
          //     type: 'danger'
          //   }]
          // }
        ],
        total: 0
      },
      optionObjAll: {
        id: 'accountTableAll',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          /* ========== 账户维度 ========== */
          { props: 'accountCode', label: '账户编号', visible: true, width: 200, buttons: [{ click: (rowIndex, row) => { this.$router.push({ path: '/sparepart/fund/accountRebate/edit', query: { id: row.accountId } }); }, type: 'primary' }] },
          { props: 'companyCode', label: '公司编码', visible: true, width: 180 },
          { props: 'companyName', label: '公司名称', visible: true, width: 200 },
          { props: 'bankName', label: '开户银行', visible: true, width: 200 },
          { props: 'bankAccountName', label: '银行户主', visible: true, width: 200 },
          { props: 'bankAccountNo', label: '开户账户', visible: true, width: 200 },
          { props: 'availableAmount', label: '可用资金', visible: true, width: 140, align: 'right' },
          { props: 'frozenAmount', label: '冻结资金', visible: true, width: 140, align: 'right' },
          { props: 'totalAmount', label: '账户总额', visible: true, width: 140, align: 'right' },
          { props: 'accountCreateTime', label: '账户创建时间', visible: true, width: 200 },
          { props: 'accountUpdateTime', label: '账户修改时间', visible: true, width: 200 },

          /* ========== 流水维度 ========== */
          { props: 'detailCode', label: '交易流水号', visible: true, width: 200 },
          { props: 'transactionAmount', label: '交易金额', visible: true, width: 140, align: 'right' },
          { props: 'transactionTypeLabel', label: '交易类型', visible: true, width: 120 },
          { props: 'accountBalance', label: '账户余额', visible: true, width: 140, align: 'right' },
          { props: 'flowRemark', label: '流水备注', visible: true, width: 200 },
          { props: 'dealerCode', label: '门店编码', visible: true, width: 180 },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'bizTypeLabel', label: '业务类型', visible: true, width: 120 },
          { props: 'bizNo', label: '业务单号', visible: true, width: 200, buttons: [{ click: (rowIndex, row) => { this.handleBizNoJump(row); }, type: 'primary' }] },
          { props: 'postingTime', label: '入账时间', visible: true, width: 200 }
        ],

        total: 0
      },
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    async getParentCompany (query) {
      try {
        const res = await getSparePartCompany({ codeOrNameLike: query });
        res.records = res.records?.map(item => ({
          ...item,
          displayName: item.companyName + `(${item.companyCode})`
        }));
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching dealer list:', error);
      }
    },

    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    getOptionObj () {
      if (this.activeName === 'homePage') {
        return this.optionObj;
      } else if (this.activeName === 'allSpareParts') {
        return this.optionObjAll;
      }
      return this.optionObj;
    },
    handleClick (item) {
      this.activeName = item.name;
      this.show = false;
      // 跨 tab 切换时，把所有 tab 的分页状态都重置为 page 1 + 默认 size
      this.optionObj.form.page = 1;
      this.optionObj.form.size = pageSize;
      this.optionObjAll.form.page = 1;
      this.optionObjAll.form.size = pageSize;
      this.onReset();
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/sparepart/fund/account/edit'
      });
    },
    onSubmit () {
      const optionObj = this.getOptionObj();
      optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      // 全部备件 tab：默认入账时间 = 最近一个月
      const extraDefaults = this.activeName === 'allSpareParts'
        ? { postingTime: this.getLastMonthRange() }
        : {};
      // 注意：不要整体替换 this.form —— 会丢失 Vue 2 响应性，导致子组件 watch 失效。
      // 必须用 Object.assign 原地写入响应式对象，触发 setter 让 watcher 重新执行。
      Object.assign(this.form, defaultForm, extraDefaults);
      const optionObj = this.getOptionObj();
      optionObj.form.page = 1;
      optionObj.form.size = pageSize;
      this.getData();
    },
    getLastMonthRange () {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      const fmt = (d, isEnd) => {
        const pad = (n) => (n < 10 ? `0${n}` : n);
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${isEnd ? '23:59:59' : '00:00:00'}`;
      };
      return [fmt(start, false), fmt(end, true)];
    },
    exportExcel () {
      this.exportLoading = true;
      const formData = this.getFormData();
      if (formData === null) {
        this.exportLoading = false;
        return;
      }
      const reqParams = formData || {};
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      let fetchPath = 'sp/web/fund/account/page';
      let tableRef = this.$refs.tableRef;
      if (this.activeName === 'homePage') {
        tableRef = this.$refs.tableRef;
        fetchPath = 'sp/web/fund/account/page';
      } else {
        tableRef = this.$refs.tableRefAll;
        fetchPath = 'sp/web/fund/account/detailPage';
      }
      exportTable({
        businessType: '备件返利账户',
        dataFetchPath: fetchPath,
        reqParams,
        titleMap: tableRef && tableRef.getVisibleCols ? Object.fromEntries(tableRef.getVisibleCols()) : {},
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '备件返利账户.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelTask', '_blank'),
            { message: '正在导出中，是否要跳转"系统管理-文件管理-导出任务"中查看？' }
          );
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    },
    getData () {
      this.loading = true;
      this.selectionList = [];
      const optionObj = this.getOptionObj();
      const fetchApi = this.activeName === 'allSpareParts' ? detailPage : getList;

      const formData = this.getFormData();
      if (formData === null) {
        this.loading = false;
        return;
      }

      fetchApi({ ...formData, pageNum: optionObj.form.page, pageSize: optionObj.form.size })
        .then(res => {
          if (!res || !res.records) return;
          console.log(res);
          optionObj.dataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          optionObj.total = res.total || 0;
        }).catch(err => {
          console.error('获取列表数据失败:', err);
          optionObj.dataList = [];
          optionObj.total = 0;
        }).finally(() => {
          this.loading = false;
        });
    },
    // 需要防抖场景时使用
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      const optionObj = this.getOptionObj();
      return new Promise((resolve, reject) => {
        getTableConfig(optionObj.id).then(data => {
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
      const optionObj = this.getOptionObj();
      if (type === 'page') {
        optionObj.form.page = num;
      } else {
        optionObj.form.size = num;
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
        if (data[key] === '' || data[key] === null || data[key].length === 0) {
          delete data[key];
        }
      });

      if (this.form.updateTime) {
        delete data.updateTime;
        if (this.form.updateTime.length > 1) {
          data.updateTimeStart = this.form.updateTime[0];
          data.updateTimeEnd = getEndOfDayString(this.form.updateTime[1]);
        }
      }

      // ===== 全部备件 tab：字段映射到 AccountFlowPageParam =====
      if (this.activeName === 'allSpareParts') {
        data.accountType = 'REBATE';
        // 账户编号 form.code -> data.accountCode（homePage API 用 code，detailPage 用 accountCode）
        if (data.code) {
          data.accountCode = data.code;
          delete data.code;
        }
        // 交易流水号批量 form.transactionNoList -> data.detailCodeList
        if (data.transactionNoList) {
          data.detailCodeList = data.transactionNoList;
          delete data.transactionNoList;
        }
        // 入账时间区间 -> postingTimeStart/End（返利账户默认查询条件）
        if (data.postingTime && Array.isArray(data.postingTime) && data.postingTime.length > 1) {
          data.postingTimeStart = data.postingTime[0];
          data.postingTimeEnd = getEndOfDayString(data.postingTime[1]);
          delete data.postingTime;
        } else if (data.postingTime !== undefined) {
          delete data.postingTime;
        }
        // 账户创建时间/修改时间区间
        if (data.createAccountTime && Array.isArray(data.createAccountTime) && data.createAccountTime.length > 1) {
          data.accountCreateTimeStart = data.createAccountTime[0];
          data.accountCreateTimeEnd = getEndOfDayString(data.createAccountTime[1]);
          delete data.createAccountTime;
        } else if (data.createAccountTime !== undefined) {
          delete data.createAccountTime;
        }
        if (data.updateAccountTime && Array.isArray(data.updateAccountTime) && data.updateAccountTime.length > 1) {
          data.accountUpdateTimeStart = data.updateAccountTime[0];
          data.accountUpdateTimeEnd = getEndOfDayString(data.updateAccountTime[1]);
          delete data.updateAccountTime;
        } else if (data.updateAccountTime !== undefined) {
          delete data.updateAccountTime;
        }
      }

      // ===== 全部备件 tab 默认条件校验 =====
      // 【公司】【账户编号】【入账时间】【业务单号】不允许全部为空
      // 注意：账户编号 form.code 已经映射为 data.accountCode，校验检查 data.accountCode。
      if (this.activeName === 'allSpareParts') {
        const hasCompany = !!(data.companyCodeList && data.companyCodeList.length);
        const hasAccountNo = !!(data.accountCode && data.accountCode.trim());
        const hasPostingTime = !!(data.postingTimeStart && data.postingTimeEnd);
        const hasBusinessNo = !!(data.businessNoList && data.businessNoList.length);
        if (!hasCompany && !hasAccountNo && !hasPostingTime && !hasBusinessNo) {
          this.$message.warning('请至少填写【公司】【账户编号】【入账时间】【业务单号】中的任意一个');
          return null;
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
    // 批量删除
    handleBatchDelete () {
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteItem(ids).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getData();
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        });
      }).catch(() => {});
    },
    // 批量启用停用
    handleBatchEnable (status) {
      handleBatchStatusChange.call(this, {
        selectionList: this.selectionList,
        targetStatus: status,
        apiFunc: enableItem,
        refreshFunc: this.getData
      });
    },
    // 业务单号跳转
    async handleBizNoJump (row) {
      let path = '';
      let type = '';
      if (row.bizType === 'SPARE_PART_RETURN') {
        path = '/sparepart/return/returnOrder/edit';
        type = 'returnOrder';
      } else if (row.bizType === 'SPARE_PART_PURCHASE') {
        path = '/sparepart/warehouse/oemOutboundOrder/edit';
        type = 'oemOutboundOrder';
      } else if (row.bizType === 'CUSTOMER_CARE') {
        path = '/sparepart/fund/accountOperateApply/edit';
        type = 'accountOperateApply';
      } else if (row.bizType === 'REBATE_RECHARGE') {
        path = '/sparepart/fund/accountOperateApply/edit';
        type = 'accountOperateApply';
      } else if (row.bizType === 'REBATE_DEDUCTION') {
        path = '/sparepart/fund/accountOperateDeductionApply/edit';
        type = 'accountOperateDeductionApply';
      } else {
        return;
      }
      const res = await getSparePartOrderIdByCode({ code: row.bizNo, type: type });
      this.$router.push({
        path: path,
        query: {
          id: res
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.m-account-list {
}
</style>
