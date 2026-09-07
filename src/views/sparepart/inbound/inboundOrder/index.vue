<template>
  <div class="page-common m-inbound-order-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="入库单号">
        <tag-input v-model="form.codeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="业务单号">
        <tag-input v-model="form.businessOrderCodeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="订单创建时间" v-show="this.visibleCount === 3 || show">
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="form.createTime"
          type="daterange"
          unlink-panels
          :picker-options="createTimePickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="门店编码">
          <fetch-select
            :remote-method="getDealerList"
            remote
            v-model="form.dealerCodeList"
            placeholder="请输入门店编码"
            labelKey="orgName"
            valueKey="orgCode"
            subLabelKey="orgCode"
            clearable
            multiple
            collapseTags
            filterable
          />
        </el-form-item>
        <el-form-item label="备件仓库">
          <fetch-select
            :remote-method="getWarehouse"
            remote
            v-model="form.warehouseId"
            placeholder="请选择"
            labelKey="name"
            valueKey="id"
            subLabelKey="code"
            clearable
            collapseTags
            filterable
          />
        </el-form-item>
        <el-form-item label="入库类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="InboundTypeEnum"
            v-model="form.inboundTypeList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="入库状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="InboundStatusEnum"
            v-model="form.inboundStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="订单修改时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.updateTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <!-- 仅「全部备件」tab 展示：备件编码/名称筛选 -->
        <template v-if="activeName === 'allSpareParts'">
          <el-form-item label="备件编码">
            <tag-input v-model="form.sparePartCodeList" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="备件名称">
            <el-input v-model="form.sparePartNameLike" placeholder="请输入" clearable />
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
      <!-- <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button> -->
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button size="small" @click="handlePrintSetting">打印设置</el-button>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部订单" name="homePage"></el-tab-pane>
      <el-tab-pane label="全部备件" name="allSpareParts"></el-tab-pane>
    </el-tabs>
    <!-- 全部订单 tab：订单维度 -->
    <div
      v-if="activeName === 'homePage'"
      class="ais-table-c"
    >
      <LPVxeTable
        :key="1"
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
    <!-- 全部备件 tab：明细维度（一行=一条备件明细 + 所属入库单信息） -->
    <div
      v-else-if="activeName === 'allSpareParts'"
      class="ais-table-c"
    >
      <LPVxeTable
        :key="2"
        ref="tableRefAll"
        v-loading="loading"
        is-page
        :option-obj="optionObjAll"
        :get-config="getConfig"
        @paginationChange="paginationChange"
      />
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      :id="'1'"
      @close="handleUploadDialogClose"
    />
    <!-- 打印设置弹窗 -->
    <PrintSettings
      :visible="printSettingsVisible"
      @close="handlePrintSettingClose"
      @success="handlePrintSettingSuccess"
    />
  </div>
</template>

<script>
import moment from 'moment';
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, pageAll, deleteItem, enableItem, warehousing } from '@/api/sparepart/inbound/inboundOrder/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfoByParam, listWarehouse } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';
import PrintSettings from './PrintSettings.vue';

const defaultForm = {
  // 注意：字段名须与 template 的 v-model、后端 pageAll 入参一致
  codeList: [],
  businessOrderCodeList: [],
  dealerCodeList: [],
  dealerNameList: [],
  warehouseId: '',
  inboundTypeList: [],
  inboundStatusList: [],
  createTime: '',
  updateTime: '',
  sparePartCodeList: [],
  sparePartNameLike: ''
};

const pageSize = 20;
const mockConfig = {
  data: null
};

/**
 * 「全部备件」tab 的默认查询条件：创建时间默认最近一个月，入库状态默认未入库。
 * 注意：仅全部备件 tab 带默认值；全部订单 tab 保持无默认值。
 */
function buildAllSparePartsDefaultForm () {
  const end = moment().endOf('day');
  const start = moment().subtract(29, 'days').startOf('day');
  return {
    inboundStatusList: ['0'], // 未入库
    createTime: [
      start.format('YYYY-MM-DD HH:mm:ss'),
      end.format('YYYY-MM-DD HH:mm:ss')
    ] // 最近一个月
  };
}

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    EditPage,
    Upload,
    TagInput,
    PrintSettings
  },
  data () {
    return {
      pageTitle: '备件入库单',
      pageType: 'list',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-inboundOrder',
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
      // tab：homePage=全部订单（订单维度），allSpareParts=全部备件（明细维度）
      activeName: 'homePage',
      // 打印设置弹窗
      printSettingsVisible: false,
      // 「全部备件」tab 创建时间选择的起始时间（用于限制跨度不超过半年）
      createTimeMinDate: null,
      optionObj: {
        id: 'inboundOrderTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '入库单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/inbound/inboundOrder/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'businessOrderCode',
            label: '业务单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                let myPath = '';
                if (row.inboundType === '0') {
                  myPath = '/sparepart/purchase/purchaseOrder/edit';
                }
                if (row.inboundType === '1') {
                  myPath = '/sparepart/transfer/transferInbound/edit';
                }
                if (row.inboundType === '5') {
                  myPath = '/sparepart/transfer/sharedTransferInbound/edit';
                }
                this.$router.push({
                  path: myPath,
                  query: {
                    id: row.businessOrderId
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'dealerCode',
            label: '门店编码',
            visible: true,
            width: 180,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/service/datacenter/store/store/detail?storeCode=${row.dealerCode}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'warehouseName', label: '备件仓库', visible: true, width: 200 },
          { props: 'inboundTypeLabel', label: '入库类型', visible: true, width: 120 },
          { props: 'inboundStatusLabel', label: '入库状态', visible: true, width: 120 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '打印',
              show: (row) => {
                return this.permissions.has('AISPART-inboundOrder-print');
              },
              click: (rowIndex, row) => {
                this.handlePrint(row);
              },
              type: 'info'
            }, {
              name: '入库',
              show: (row) => {
                return row.inboundStatus === '0' && this.permissions.has('AISPART-inboundOrder-inbound');
              },
              popconfirmTitle: '此操作将入库, 是否继续?',
              click: (rowIndex, row) => {
                warehousing({ id: row.id }).then(() => {
                  this.$message({
                    type: 'success',
                    message: '入库成功!'
                  });
                  this.getData();
                }).catch(() => {
                  this.$message({
                    type: 'error',
                    message: '入库失败!'
                  });
                });
              },
              type: 'info'
            }]
          }
        ],
        total: 0
      },
      // 「全部备件」tab 表格配置（明细维度，一行=一条备件明细 + 所属入库单信息）
      optionObjAll: {
        id: 'inboundOrderTableAll',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '入库单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/inbound/inboundOrder/edit',
                  query: {
                    id: row.inboundOrderId
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'businessOrderCode',
            label: '业务单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                let myPath = '';
                if (row.inboundType === '0') {
                  myPath = '/sparepart/purchase/purchaseOrder/edit';
                }
                if (row.inboundType === '1') {
                  myPath = '/sparepart/transfer/transferInbound/edit';
                }
                if (row.inboundType === '5') {
                  myPath = '/sparepart/transfer/sharedTransferInbound/edit';
                }
                this.$router.push({
                  path: myPath,
                  query: {
                    id: row.businessOrderId
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'dealerCode',
            label: '门店编码',
            visible: true,
            width: 180,
            buttons: [{
              click: (rowIndex, row) => {
                window.open(`/partner/channelManagement/shopDetail?dealerCode=${row.dealerCode}`, '_blank');
              },
              type: 'primary'
            }]
          },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'warehouseName', label: '备件仓库', visible: true, width: 200 },
          { props: 'inboundTypeLabel', label: '入库类型', visible: true, width: 120 },
          { props: 'inboundStatusLabel', label: '入库状态', visible: true, width: 120 },
          { props: 'orderRemark', label: '订单备注', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          { props: 'sparePartCode', label: '备件编码', visible: true, width: 180 },
          { props: 'sparePartName', label: '备件名称', visible: true, width: 200 },
          { props: 'inboundQty', label: '入库数量', visible: true, align: 'right', width: 120 },
          { props: 'price', label: '采购价格', visible: true, align: 'right', width: 120 },
          { props: 'amount', label: '采购金额', visible: true, align: 'right', width: 120 },
          { props: 'cashUnitPrice', label: '现金单价', visible: true, align: 'right', width: 120 },
          { props: 'cashAmount', label: '现金金额', visible: true, align: 'right', width: 120 },
          { props: 'rebateUnitPrice', label: '返利单价', visible: true, align: 'right', width: 120 },
          { props: 'rebateAmount', label: '返利金额', visible: true, align: 'right', width: 120 },
          { props: 'detailRemark', label: '明细备注', visible: true, width: 200 }
        ],
        total: 0
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  computed: {
    // 「全部备件」tab：创建时间最大只能查看半年（约 183 天）的数据
    createTimePickerOptions () {
      if (this.activeName !== 'allSpareParts') {
        return this.pickerOptions;
      }
      // 半年按 183 天计算，避免按月加减在月末被规整导致的边界错乱
      const HALF_YEAR_DAYS = 183;
      return {
        ...this.pickerOptions,
        onPick: ({ minDate, maxDate }) => {
          // 选中起始日期后，锁定可选区间；选中结束日期后，解除锁定以便下次重新选择
          this.createTimeMinDate = maxDate ? null : minDate;
        },
        disabledDate: (time) => {
          const dayStart = moment(time).startOf('day');
          // 不可选择未来日期
          if (dayStart.isAfter(moment().endOf('day'))) {
            return true;
          }
          // 已选起始日期后，可选区间为 [起始-半年, 起始+半年]，且不超过今天
          if (this.createTimeMinDate) {
            const min = moment(this.createTimeMinDate).startOf('day');
            const lower = min.clone().subtract(HALF_YEAR_DAYS, 'days');
            const upper = moment.min(min.clone().add(HALF_YEAR_DAYS, 'days'), moment().endOf('day'));
            return dayStart.isBefore(lower) || dayStart.isAfter(upper);
          }
          return false;
        }
      };
    }
  },
  methods: {
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/sparepart/inbound/inboundOrder/edit'
      });
    },
    // tab 切换：重置搜索条件（全部备件 tab 会自动带上默认值），并重新拉数
    handleClick (item) {
      this.activeName = item.name;
      this.show = false;
      this.onReset();
    },
    // 按 tab 取当前生效的表格配置对象
    getActiveOption () {
      return this.activeName === 'allSpareParts' ? this.optionObjAll : this.optionObj;
    },
    // 打印设置弹窗开关
    handlePrintSetting () {
      this.printSettingsVisible = true;
    },
    handlePrintSettingClose () {
      this.printSettingsVisible = false;
    },
    handlePrintSettingSuccess () {
      this.printSettingsVisible = false;
    },
    onSubmit () {
      this.getActiveOption().form.page = 1;
      this.getData();
    },
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },

    async getWarehouse (query) {
      try {
        const res = await listWarehouse({ codeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    onReset () {
      // 全部备件 tab 重置后带上默认值（入库状态默认未入库、创建时间默认最近一个月）
      if (this.activeName === 'allSpareParts') {
        this.form = { ...defaultForm, ...buildAllSparePartsDefaultForm() };
      } else {
        this.form = { ...defaultForm };
      }
      const option = this.getActiveOption();
      option.form.page = 1;
      option.form.size = pageSize;
      this.getData();
    },
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      const isAllSpareParts = this.activeName === 'allSpareParts';
      if (!isAllSpareParts && this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      const tableRefName = isAllSpareParts ? 'tableRefAll' : 'tableRef';
      exportTable({
        businessType: isAllSpareParts ? '备件入库单-全部备件' : '备件入库单',
        dataFetchPath: isAllSpareParts
          ? 'sp/web/purchase/inboundOrderDetail/pageAll'
          : 'sp/web/purchase/inboundOrder/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs[tableRefName].getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, isAllSpareParts ? '备件入库单-全部备件.xlsx' : '备件入库单.xlsx');
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
      // 全部备件 tab 必填校验：入库单号、订单创建时间、业务单号不能同时为空
      if (this.activeName === 'allSpareParts') {
        const formData = this.getFormData();
        const codeEmpty = !formData.codeList || formData.codeList.length === 0;
        const timeEmpty = !formData.createTimeStart && !formData.createTimeEnd;
        const bizEmpty = !formData.businessOrderCodeList || formData.businessOrderCodeList.length === 0;
        if (codeEmpty && timeEmpty && bizEmpty) {
          this.$message.warning('入库单号、订单创建时间、业务单号不能同时为空');
          return;
        }
      }

      this.loading = true;
      this.selectionList = [];

      const isAllSpareParts = this.activeName === 'allSpareParts';
      const fetchApi = isAllSpareParts ? pageAll : getList;
      const option = this.getActiveOption();

      fetchApi({ ...this.getFormData(), pageNum: option.form.page, pageSize: option.form.size })
        .then(res => {
          option.dataList = (res.records || []).map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          option.total = res.total;
        }).catch(err => {
          console.error('入库单列表加载失败:', err);
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
        getTableConfig(this.getActiveOption().id).then(data => {
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
      const option = this.getActiveOption();
      if (type === 'page') {
        option.form.page = num;
      } else {
        option.form.size = num;
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

      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 打印备件入库单
    handlePrint (val) {
      this.$print.show({
        id: val.id, // 必选，对应数据id
        template: 'SparePartsStorage', // 必选，对应 ./template/文件名.vue
        title: `${val.dealerName}厅店备件入库单`// 可选，打印标题
      });
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
      // const ids = this.selectionList.map(item => item.id) || [];
      // this.$confirm(`此操作将${status ? '启用' : '停用'}选中项，是否继续?`, '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   enableItem({
      //     idSet: ids,
      //     status
      //   }).then(() => {
      //     this.$message({
      //       type: 'success',
      //       message: '操作成功!'
      //     });
      //     this.getData();
      //   }).catch(() => {
      //     this.$message({
      //       type: 'error',
      //       message: '操作失败!'
      //     });
      //   });
      // });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-inbound-order-list {
    ::v-deep .m-vxe-table .m-vxe-table-options {
      top: -96px;
    }
}
</style>
