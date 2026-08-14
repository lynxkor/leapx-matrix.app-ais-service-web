<template>
  <div class="page-common m-shared-transfer-inbound-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="调拨入库单号">
        <tag-input v-model="form.codeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="出库门店">
        <fetch-select
          :remote-method="getDealerList"
          remote
          v-model="form.outboundDealerCodeList"
          placeholder="请输出门店编码或名称"
          labelKey="orgName"
          valueKey="orgCode"
          subLabelKey="orgCode"
          clearable
          multiple
          collapseTags
          filterable
            />
      </el-form-item>
      <el-form-item label="调拨出库单号" v-show="this.visibleCount === 3 || show">
        <tag-input v-model="form.transferOutboundCodeList" placeholder="请输入" />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="入库门店">
          <fetch-select
            :remote-method="getDealerList"
            remote
            v-model="form.inboundDealerCodeList"
            placeholder="请输出门店编码或名称"
            labelKey="orgName"
            valueKey="orgCode"
            subLabelKey="orgCode"
            clearable
            multiple
            collapseTags
            filterable
              />
        </el-form-item>
        <el-form-item label="签收状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="SharedTransferInboundSignStatusEnum"
            v-model="form.signStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="订单创建时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.createTime"
            type="daterange"
            unlink-panels
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
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
        <!-- ===== 全部备件 tab 专用 ===== -->
        <el-form-item label="备件编码" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <tag-input v-model="form.sparePartCodeList" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="备件名称" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <el-input placeholder="请输入" v-model="form.sparePartName" clearable />
        </el-form-item>
        <el-form-item label="库位" v-if="activeName === 'allSpareParts'" v-show="this.visibleCount === 3 || show">
          <el-input placeholder="请输入" v-model="form.locationNameLike" clearable />
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
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <!-- <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button> -->
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部订单" name="homePage"></el-tab-pane>
      <el-tab-pane label="全部备件" name="allSpareParts"></el-tab-pane>
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
        @sortChange="handleSortChange"
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
        @sortChange="handleSortChange"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      :id="'1'"
      @close="handleUploadDialogClose"
      @getData="getData"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, detailPage, deleteItem, enableItem, getSign } from '@/api/sparepart/transfer/sharedTransferInbound/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, getUserByNameOrNo, listOrgStoreInfoByParam, getSparePartCompany, listWarehouse, getPartDealer, getLoginUser } from '@/api/common';
import TagInput from '@/libs/components/TagInput';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';

const defaultForm = {
  // 注意：被 <tag-input> 绑定的字段必须用 [] 而非 null，否则 reset 时
  // TagInput 内部 tagList = null 会导致 slice()/length 抛错，UI 无法清空。
  codeList: [],
  outboundDealerCodeList: null,
  createTime: '',
  updateTime: '',

  transferOutboundCodeList: [],
  inboundDealerCodeList: null,
  signStatusList: null,

  sparePartCodeList: [],
  sparePartName: '',
  locationNameLike: '',
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
    Upload,
    TagInput
  },
  data () {
    return {
      pageTitle: '共享备件调拨入库',
      pageType: 'list',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-sharedTransferInbound',
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
        id: 'sharedTransferInboundTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '调拨入库单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/transfer/sharedTransferInbound/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'sharedTransferOutboundCode',
            label: '调拨出库单号',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/transfer/sharedTransferOutbound/edit',
                  query: {
                    id: row.sharedTransferOutboundId
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'inboundDealerCode', label: '入库门店编码', visible: true, width: 180 },
          { props: 'inboundDealerName', label: '入库门店名称', visible: true, width: 200 },
          { props: 'inboundWarehouseName', label: '入库仓库', visible: true, width: 200 },
          { props: 'outboundDealerCode', label: '出库门店编码', visible: true, width: 180 },
          { props: 'outboundDealerName', label: '出库门店名称', visible: true, width: 200 },
          { props: 'signStatusLabel', label: '签收状态', visible: true, width: 120 },
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
              name: '编辑',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/transfer/sharedTransferInbound/edit',
                  query: {
                    id: row.id,
                    isEditing: true
                  }
                });
              },
              type: 'info'
            }, {
              name: '签收',
              show: (row) => {
                return row.signStatus === '0' && this.permissions.has('AISPART-sharedTransferInbound-sign');
              },
              popconfirmTitle: '确定签收吗?',
              click: (rowIndex, row) => {
                getSign({ id: row.id }).then(() => {
                  this.$message({
                    type: 'success',
                    message: '签收成功!'
                  });
                  this.getData();
                }).catch(() => {
                  this.$message({
                    type: 'error',
                    message: '签收失败!'
                  });
                });
              },
              type: 'info'
            },
            {
              name: '打印',
              show: (row) => this.permissions.has('AISPART-sharedTransferInbound-print'),
              click: (rowIndex, row) => {
                this.handlePrint(row);
              },
              type: 'info'
            }
            //  {
            //   name: '删除',
            //   popconfirmTitle: '此操作将永久删除, 是否继续?',
            //   popconfirmConfirmButtonText: '删除',
            //   popconfirmConfirmButtonType: 'danger',
            //   click: (rowIndex, row) => {
            //     deleteItem([row.id]).then(() => {
            //       this.$message({
            //         type: 'success',
            //         message: '删除成功!'
            //       });
            //       this.getData();
            //     }).catch(() => {
            //       this.$message({
            //         type: 'error',
            //         message: '删除失败!'
            //       });
            //     });
            //   },
            //   type: 'danger'
            // }
            ]
          }
        ],
        total: 0
      },
      optionObjAll: {
        id: 'sharedTransferInboundTableAll',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          /* ========== 订单维度 ========== */
          {
            props: 'code',
            label: '调拨入库单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{ click: (rowIndex, row) => { this.$router.push({ path: '/sparepart/transfer/sharedTransferInbound/edit', query: { id: row.sharedTransferInboundId || row.id } }); }, type: 'primary' }]
          },
          { props: 'transferOutboundCode', label: '调拨出库单号', visible: true, width: 200, buttons: [{ click: (rowIndex, row) => { this.$router.push({ path: '/sparepart/transfer/sharedTransferOutbound/edit', query: { id: row.transferOutboundId } }); }, type: 'primary' }] },
          { props: 'inboundDealerCode', label: '入库门店编码', visible: true, width: 180, buttons: [{ click: (rowIndex, row) => { window.open(`/partner/channelManagement/shopDetail?dealerCode=${row.inboundDealerCode}`, '_blank'); }, type: 'primary' }] },
          { props: 'inboundDealerName', label: '入库门店名称', visible: true, width: 200 },
          { props: 'inboundWarehouseName', label: '入库仓库', visible: true, width: 200 },
          { props: 'outboundDealerCode', label: '出库门店编码', visible: true, width: 180 },
          { props: 'outboundDealerName', label: '出库门店名称', visible: true, width: 200 },
          { props: 'signStatusLabel', label: '签收状态', visible: true, width: 120 },
          { props: 'remark', label: '订单备注', visible: true, width: 200 },
          { props: 'createTime', label: '订单创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '订单修改时间', visible: true, width: 200 },

          /* ========== 明细维度 ========== */
          { props: 'sparePartCode', label: '备件编码', visible: true, width: 180, buttons: [{ click: (rowIndex, row) => { this.$router.push({ path: '/sparepart/basic/sparePart/edit', query: { id: row.sparePartId } }); }, type: 'primary' }] },
          { props: 'sparePartName', label: '备件名称', visible: true, width: 200 },
          { props: 'locationName', label: '库位', visible: true, width: 120 },
          { props: 'availableQty', label: '可用库存', visible: true, width: 120, align: 'right' },
          { props: 'transferPriceTaxIncluded', label: '采购价格(含税)', visible: true, width: 140, align: 'right' },
          { props: 'transferPriceTaxExcluded', label: '采购价格(不含税)', visible: true, width: 160, align: 'right' },
          { props: 'taxAmount', label: '金额（含税）', visible: true, width: 140, align: 'right' },
          { props: 'transferQty', label: '调拨数量', visible: true, width: 120, align: 'right' },
          { props: 'detailRemark', label: '明细备注', visible: true, width: 200 },
        ],
        total: 0
      },
      sortColumns: [
        // {
        // column: 'create_time',
        // sort: 'DESC'
        // }
      ]
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    async getUser (query) {
      try {
        const res = await getUserByNameOrNo({ name: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query, authority: false });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
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
    async getWarehouse (query) {
      try {
        const res = await listWarehouse({ codeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async initDealerUser () {
      // 查询是否店端 true为门店  false为厂端
      const res = await getLoginUser();
      this.accountFlag = res.accountFlag;
      this.currentDealerCode = res.currentDealerCode;// 当前门店code
      this.currentDealerName = res.currentDealerName;// 当前门店名称

      if (this.accountFlag === true) {
        const res = await getPartDealer({ code: this.currentDealerCode });
        this.isPartOrder = res.isPartOrder;
      }
      if (this.accountFlag === false) {
        this.isPartOrder = true;
      }
    },
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
        path: '/sparepart/transfer/sharedTransferInbound/edit'
      });
    },
    onSubmit () {
      const optionObj = this.getOptionObj();
      optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      // 全部备件 tab：默认创建时间 = 最近一个月（end 用 23:59:59）
      const extraDefaults = this.activeName === 'allSpareParts'
        ? { createTime: this.getLastMonthRange() }
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
      const reqParams = this.getFormData() || {};
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      const fetchPath = this.activeName === 'allSpareParts'
        ? 'sp/web/dealer/sharedTransferInbound/detailPage'
        : 'sp/web/dealer/sharedTransferInbound/page';
      const tableRef = this.activeName === 'allSpareParts'
        ? this.$refs.tableRefAll
        : this.$refs.tableRef;
      exportTable({
        businessType: '共享备件调拨入库',
        dataFetchPath: fetchPath,
        reqParams,
        titleMap: tableRef && tableRef.getVisibleCols ? Object.fromEntries(tableRef.getVisibleCols()) : {},
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '共享备件调拨入库.xlsx');
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
          console.log(res);
          optionObj.dataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          optionObj.total = res.total;
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

      // 全部备件 tab: 【调拨入库单号】【订单创建时间】【调拨出库单号】至少一个
      if (this.activeName === 'allSpareParts') {
        const hasCode = !!(data.codeList && data.codeList.length);
        const hasCreateTime = !!(data.createTimeStart && data.createTimeEnd);
        const hasOutCode = !!(data.transferOutboundCodeList && data.transferOutboundCodeList.length);
        if (!hasCode && !hasCreateTime && !hasOutCode) {
          this.$message.warning('请至少填写【调拨入库单号】【订单创建时间】【调拨出库单号】中的任意一个');
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
    // 打印备件调拨入库单
    handlePrint (val) {
      this.$print.show({
        id: val.id, // 必选，对应数据id
        template: 'SharedTransferReceipt', // 必选，对应 ./template/文件名.vue
        title: `${val.dealerName}厅店共享备件调拨入库单`// 可选，打印标题
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.m-shared-transfer-inbound-list {
}
</style>
