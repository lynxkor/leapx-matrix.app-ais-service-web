<template>
  <div class="page-common m-spare-part-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="备件编码">
        <tag-input v-model="form.partCodeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="备件名称">
        <el-input
          placeholder="请输入"
          v-model="form.partNameLike"
          clearable
        />
      </el-form-item>
      <el-form-item label="是否可销售" v-show="this.visibleCount === 3 || show">
        <fetch-select
          :request="fetchOptions"
          enumCode="BooleanEnum"
          v-model="form.saleableIs"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <template v-if="show">
        <el-form-item label="是否常备库存件">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.standingInventoryIs"
            placeholder="请选择"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item label="备件工程师">
          <el-input
            placeholder="请输入"
            v-model="form.partsEngineerLike"
            clearable
          />
        </el-form-item>
        <el-form-item label="VFG">
          <fetch-select
            filterable
            clearable
            remote
            reserve-keyword
            v-model="form.vfgId"
            :remote-method="listVfg"
            value-key="id"
            label-key="name"
          />
        </el-form-item>
        <el-form-item label="VRT">
          <fetch-select
            filterable
            clearable
            remote
            reserve-keyword
            v-model="form.vrtId"
            :remote-method="listVrt"
            value-key="id"
            label-key="name"
          />
        </el-form-item>
        <el-form-item label="是否启用">
          <fetch-select
            :request="fetchOptions"
            enumCode="BooleanEnum"
            v-model="form.statusIncludeList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="创建时间">
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
        <el-form-item label="修改时间">
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
        <el-form-item label="备注">
          <el-input
            placeholder="请输入"
            v-model="form.remarkLike"
            clearable
          />
        </el-form-item>
        <el-form-item label="销售物料分类：" prop="categorySpareSalesId">
          <fetch-select
            filterable
            clearable
            remote
            reserve-keyword
            multiple
            v-model="form.categorySpareSalesIdList"
            :remote-method="getSalesList"
            value-key="id"
            label-key="name"
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
      <ButtonGroup maxWidth="90%" collapseDirection="left">
        <!-- <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button> -->
        <el-button v-permission="moduleKey + '-salesImport'" size="small" @click="handleImport('sparePartSalesImport', '销售导入模板')">销售导入</el-button>
        <el-button v-permission="moduleKey + '-transportImport'" size="small" @click="handleImport('sparePartTransportImport', '物流导入模板')">物流导入</el-button>
        <el-button v-permission="moduleKey + '-purchaseImport'" size="small" @click="handleImport('sparePartPurchaseImport', '采购导入模板')">采购导入</el-button>
        <el-button v-permission="moduleKey + '-modelImport'" size="small" @click="handleImport('sparePartModelImport', '车型导入模板')">车型导入</el-button>
        <el-button v-permission="moduleKey + '-vfgImport'" size="small" @click="handleImport('sparePartVfgImport', 'VFG导入模板')">VFG导入</el-button>
        <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
        <el-button v-permission="moduleKey + '-printImport'" size="small">打印报价单</el-button>
        <!-- <el-button v-permission="moduleKey + '-detail'" size="small">集中视图</el-button> -->
        <!-- <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
        <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button> -->
        <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
        <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button>
        <el-button v-permission="moduleKey + '-canBoTransfer'" size="small" @click="handleBatchAllowTransfer" :disabled="selectionList.length === 0">允许BO调拨</el-button>
        <el-button v-permission="moduleKey + '-canBoTransfer'" size="small" @click="handleBatchForbidTransfer" :disabled="selectionList.length === 0">禁止BO调拨</el-button>
        <el-button v-permission="moduleKey + '-canCetail'" size="small" @click="handleBatchAllowSales" :disabled="selectionList.length === 0">允许备附件销售</el-button>
        <el-button v-permission="moduleKey + '-canCetail'" size="small" @click="handleBatchForbidSales" :disabled="selectionList.length === 0">禁止备附件销售</el-button>
      </ButtonGroup>
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
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      :id="importType"
      :downloadTitle="downloadTitle"
      @close="handleUploadDialogClose"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, allowBoTransfer, forbidBoTransfer, allowPartsAttachmentSales, forbidPartsAttachmentSales } from '@/api/sparepart/basic/sparePart';
import { vfglist } from '@/api/claimreturn/claim/basic/vfg';
import { vrtlist } from '@/api/claimreturn/claim/basic/vrt';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, getEndOfDayString, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import TagInput from '@/libs/components/TagInput';
import ButtonGroup from '@/libs/components/ButtonGroup';
import EditPage from './edit.vue';
import { getSalesList } from '@/api/sparepart/basic/spareSalesCategory';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  partCodeList: [],
  partNameLike: '',
  minOrderQuantity: '',
  salePrice: '',
  purchasePrice: '',
  oemPart: '',
  dealerName: '',
  saleableIs: undefined,
  standingInventoryIs: undefined,
  partsEngineerLike: '',
  vfgId: '',
  vrtId: '',
  remark: '',
  createTime: '',
  updateTime: '',
  statusIncludeList: ['1']
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
    Upload,
    TagInput,
    ButtonGroup,
    EditPage
  },
  data () {
    return {
      importType: '', // 导出id
      downloadTitle: '销售导入模板', // 导出标题
      pageTitle: '备件主数据',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-sparePart',
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
      optionObj: {
        id: 'sparePartTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'partCode',
            label: '备件编码',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/basic/sparePart/edit',
                  query: {
                    id: row.id,
                    isEditing: false
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'partName', label: '备件名称', visible: true, width: 200 },
          { props: 'minOrderQuantity', label: '最小订购量', visible: true, align: 'right', width: 120 },
          { props: 'salePrice', label: '销售价格', visible: true, align: 'right', width: 120 },
          { props: 'purchasePrice', label: '采购价格', visible: true, align: 'right', width: 120 },
          { props: 'oemPartLabel', label: '是否OEM件', visible: true, width: 130 },
          { props: 'saleableIsLabel', label: '是否可销售', visible: true, width: 130 },
          { props: 'standingInventoryIsLabel', label: '是否常备库存件', visible: true, width: 150 },
          { props: 'partsEngineer', label: '备件工程师', visible: true, width: 200 },
          { props: 'vfgName', label: 'VFG名称', visible: true, width: 200 },
          { props: 'vrtName', label: 'VRT名称', visible: true, width: 200 },
          { props: 'boTransferIsLabel', label: 'BO调拨', visible: true, width: 200 },
          { props: 'retailIsLabel', label: '备附件销售', visible: true, width: 200 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'statusLabel', label: '是否启用', visible: true, width: 120 },
          { props: 'baseUnitLabel', label: '基本计量单位', visible: true, width: 200 },
          { props: 'marketingTypeLabel', label: '营销分类', visible: true, width: 200 },
          { props: 'categorySpareSalesName', label: '销售物料分类', visible: true, width: 200 },
          { props: 'categorySpareSupplyName', label: '供应物料分类', visible: true, width: 200 },
          { props: 'supplierMinOrderQuantity', label: '供应商起订量', visible: true, width: 200 },
          { props: 'supplierDeliveryPeriod', label: '供应商交货周期', visible: true, width: 200 },
          { props: 'purchaseTypeLabel', label: '采购状态', visible: true, width: 200 },
          { props: 'categorySpareSupplyName', label: '供应物料分类', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '编辑 ',
              disabled: () => {
                const a = this.permissions.has('AISPART-sparePart-vfgImport') || this.permissions.has('AISPART-sparePart-modelImport') || this.permissions.has('AISPART-sparePart-purchaseImport') || this.permissions.has('AISPART-sparePart-transportImport') || this.permissions.has('AISPART-sparePart-salesImport');
                return !a;
              },
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/basic/sparePart/edit',
                  query: {
                    id: row.id,
                    isEditing: true
                  }
                });
              },
              type: 'info'
            }, {
              name: '允许BO调拨',
              show: (row) => {
                return row.boTransferIs === '0' && row.oemPart === '1' && this.permissions.has('AISPART-sparePart-canBoTransfer');
              },
              popconfirmTitle: '此操作将允许BO调拨, 是否继续?',
              click: (rowIndex, row) => {
                allowBoTransfer({
                  id: row.id
                }).then(() => {
                  this.$message.success('操作成功');
                  this.getData();
                });
              },
              type: 'info'
            }, {
              name: '禁止BO调拨',
              show: (row) => {
                return row.boTransferIs === '1' && row.oemPart === '1' && this.permissions.has('AISPART-sparePart-canBoTransfer');
              },
              popconfirmTitle: '此操作将禁止BO调拨, 是否继续?',
              click: (rowIndex, row) => {
                forbidBoTransfer({
                  id: row.id
                }).then(() => {
                  this.$message.success('操作成功');
                  this.getData();
                });
              },
              type: 'info'
            }, {
              name: '允许备附件销售',
              show: (row) => {
                return row.retailIs === '0' && row.oemPart === '1' && this.permissions.has('AISPART-sparePart-canCetail');
              },
              popconfirmTitle: '此操作将允许备附件销售, 是否继续?',
              click: (rowIndex, row) => {
                allowPartsAttachmentSales({
                  id: row.id
                }).then(() => {
                  this.$message.success('操作成功');
                  this.getData();
                });
              },
              type: 'info'
            }, {
              name: '禁止备附件销售',
              show: (row) => {
                return row.retailIs === '1' && row.oemPart === '1' && this.permissions.has('AISPART-sparePart-canCetail');
              },
              popconfirmTitle: '此操作将禁止备附件销售, 是否继续?',
              click: (rowIndex, row) => {
                forbidPartsAttachmentSales({
                  id: row.id
                }).then(() => {
                  this.$message.success('操作成功');
                  this.getData();
                });
              },
              type: 'info'
            }]
          }
        ],
        total: 0
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {
    handleListSelect (row) {
      this.clickItemId = row.id;
    },

    listVfg (query) {
      return vfglist({ vfgNameLike: query });
    },

    listVrt (query) {
      return vrtlist({ vrtNameLike: query });
    },

    handleImport (type, val) {
      this.importType = type;
      this.downloadTitle = val;
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/sparepart/basic/sparePart/edit'
      });
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.optionObj.form.page = 1;
      this.optionObj.form.pageSize = pageSize;
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
        businessType: '备件主数据',
        dataFetchPath: '/sp/web/basic/sparePart/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '备件主数据.xlsx');
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

    async getSalesList (query) {
      const res = await getSalesList({ categoryNameLike: query });
      return res;
    },
    getData () {
      this.loading = true;
      this.selectionList = [];
      console.log(this.permissions.has('AISPART-sparePart-transportImport'));
      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          const records = (res && res.records) || [];
          this.optionObj.dataList = records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = (res && res.total) || 0;
        }).catch(err => {
          console.error('获取备件列表失败:', err);
          this.$message.error('获取列表数据失败，请重试');
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
        this.optionObj.form.page = num;
      } else {
        this.optionObj.form.size = num;
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
        const val = data[key];

        // 情况 A: 值为 null, undefined, 或 空字符串 ''
        if (!val && val !== 0 && val !== false) {
          delete data[key];
          return;
        }

        // 情况 B: 值为空数组 [] 或 空字符串 '' (再次确认 length)
        // 注意：上面 !val 已经处理了 ''，这里主要处理 []
        if (Array.isArray(val) && val.length === 0) {
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

      if (Array.isArray(this.form.partCodeList) && this.form.partCodeList.length <= 1) {
        delete data.partCodeList;
        data.partCodeLike = this.form.partCodeList[0] || '';
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
    /**
   * 通用批量操作执行器
   * @param {Object} options
   * @param {String} options.actionName - 操作名称 (用于弹窗和提示)
   * @param {Function} options.apiFn - 调用的 API 函数
   * @param {Array} options.rules - 校验规则数组 [{ field, validValue, message }]
   */
    async executeBatchAction ({ actionName, apiFn, rules }) {
      if (!this.selectionList || this.selectionList.length === 0) {
        this.$message.warning('请至少选择一条数据');
        return;
      }

      // 1. 执行所有校验规则
      for (const rule of rules) {
        const { field, validValue, message } = rule;
        // 筛选出【不满足】条件的数据 (即 field !== validValue)
        const invalidItems = this.selectionList.filter(item => item[field] !== validValue);

        if (invalidItems.length > 0) {
          const firstCode = invalidItems[0].partCode;
          const countMsg = invalidItems.length > 1 ? `等 ${invalidItems.length} 个` : '';
          this.$message.error(`备件编码: ${firstCode}${countMsg}${message}`);
          return; // 拦截
        }
      }

      // 2. 提取 ID 列表
      const ids = this.selectionList.map(item => item.id);

      // 3. 二次确认
      try {
        await this.$confirm(`此操作将${actionName}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
      } catch {
        return; // 用户取消
      }

      // 4. 执行请求
      try {
        await apiFn({ idList: ids });
        this.$message.success(`${actionName}成功!`);
        this.getData(); // 刷新列表
      } catch (error) {
      }
    },

    // 批量允许 BO 调拨
    handleBatchAllowTransfer () {
      this.executeBatchAction({
        actionName: '批量允许 BO 调拨',
        apiFn: allowBoTransfer,
        rules: [
          { field: 'boTransferIs', validValue: '0', message: '不是禁止调拨状态，不允许执行当前操作!' },
          { field: 'oemPart', validValue: '1', message: '为非 OEM 件，不允许执行当前操作!' }
        ]
      });
    },

    // 批量禁止 BO 调拨
    handleBatchForbidTransfer () {
      this.executeBatchAction({
        actionName: '批量禁止 BO 调拨',
        apiFn: forbidBoTransfer,
        rules: [
          { field: 'boTransferIs', validValue: '1', message: '不是允许调拨状态，不允许执行当前操作!' },
          { field: 'oemPart', validValue: '1', message: '为非 OEM 件，不允许执行当前操作!' }
        ]
      });
    },

    // 批量允许备附件销售
    handleBatchAllowSales () {
      this.executeBatchAction({
        actionName: '批量允许备附件销售',
        apiFn: allowPartsAttachmentSales,
        rules: [
          { field: 'retailIs', validValue: '0', message: '不是禁止销售状态，不允许执行当前操作!' },
          { field: 'oemPart', validValue: '1', message: '为非 OEM 件，不允许执行当前操作!' }
        ]
      });
    },

    // 批量禁止备附件销售
    handleBatchForbidSales () {
      this.executeBatchAction({
        actionName: '批量禁止备附件销售', // 修正了提示语
        apiFn: forbidPartsAttachmentSales,
        rules: [
          { field: 'retailIs', validValue: '1', message: '不是允许销售状态，不允许执行当前操作!' },
          { field: 'oemPart', validValue: '1', message: '为非 OEM 件，不允许执行当前操作!' }
        ]
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-spare-part-list {
}
</style>
