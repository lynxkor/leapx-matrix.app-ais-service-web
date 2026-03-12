<template>
  <div class="page-common m-inventory-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="备件">
        <fetch-select
            :remote-method="getSparePart"
            remote
            v-model="form.sparePartIdList"
            placeholder="请输入编码或名称"
            labelKey="name"
            valueKey="code"
            subLabelKey="code"
            clearable
            multiple
            collapseTags
            filterable
              />
      </el-form-item>
      <el-form-item label="库存单号">
        <tag-input v-model="form.codeList" placeholder="请输入" />
      </el-form-item>
        <el-form-item label="库位"  v-show="this.visibleCount === 3 || show">
          <fetch-select
              :remote-method="getLocaltion"
              remote
              v-model="form.locationIdList"
              placeholder="请输入库位名称"
              labelKey="name"
              valueKey="id"
              clearable
              multiple
              collapseTags
              filterable
                />
        </el-form-item>
        <template v-if="show">
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
        <el-form-item label="是否常备件" v-show="visibleCount === 3 || show">
        <fetch-select
          :request="fetchOptions"
          enumCode="BooleanEnum"
          v-model="form.standingInventoryIs"
          placeholder="请选择"
          clearable
          filterable
          />
        </el-form-item>
        <el-form-item label="最近入库时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.latestInboundTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="最近出库时间">
          <el-date-picker
           :default-time="['00:00:00', '23:59:59']"
            v-model="form.latestOutboundTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
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
        <el-form-item label="备注">
          <el-input
            type="textarea"
            maxlength="500"
            show-word-limit
            placeholder="请输入"
            v-model="form.remarkLike"
            clearable
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
      <el-button size="small" @click="handleTransfer">转移库位</el-button>
      <!-- <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button> -->
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
      :id="'1'"
      @close="handleUploadDialogClose"
    />
    <TransferDialog
      :visible="transferDialog"
      :selectionId="selectionList"
      :warehouseIds="warehouseIds"
      @close="handleTransferDialogClose"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/sparepart/warehouse/inventory/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, sparePartListShort, listOrgStoreInfoByParam } from '@/api/common';
import { locationList } from '@/api/sparepart/warehouse/warehouse/index';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';
import TransferDialog from './TransferDialog.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  sparePartIdList: null,
  codeList: null,
  locationIdList: null,
  dealerCodeList: null,
  remarkLike: '',
  latestInboundTime: '',
  latestOutboundTime: '',
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
    Upload,
    TagInput,
    TransferDialog
  },
  data () {
    return {
      pageTitle: '厅店备件库存',
      pageType: 'list',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-inventory',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      warehouseIds: '', // 转移库位 仓库ID
      transferDialog: false, // 转移库位弹窗
      clickItemId: '',
      optionObj: {
        id: 'inventoryTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '库存单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/warehouse/inventory/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'partCode',
            label: '备件编码',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/basic/sparePart/detail',
                  query: {
                    id: row.sparePartId
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'partName', label: '备件名称', visible: true, width: 200 },
          { props: 'salePrice', label: '销售价格', visible: true, align: 'right', width: 120 },
          { props: 'warehouseName', label: '仓库名称', visible: true, width: 200 },
          { props: 'warehouseStatusLabel', label: '仓库状态', visible: true, width: 120 },
          { props: 'locationName', label: '库位', visible: true, width: 140 },
          { props: 'dealerCode', label: '门店编码', visible: true, width: 200 },
          { props: 'dealerName', label: '门店名称', visible: true, width: 180 },
          { props: 'inTransitQty', label: '在途数量', visible: true, align: 'right', width: 120 },
          { props: 'availableQty', label: '可用数量', visible: true, align: 'right', width: 120 },
          { props: 'frozenQty', label: '冻结数量', visible: true, align: 'right', width: 120 },
          { props: 'sharedQty', label: '共享数量', visible: true, align: 'right', width: 120 },
          { props: 'totalQty', label: '库存总数', visible: true, align: 'right', width: 120 },
          { props: 'inventoryDays', label: '库存天数', visible: true, align: 'right', width: 120 },
          { props: 'purchasePrice', label: '采购价格', visible: true, align: 'right', width: 120 },
          { props: 'costUnitPrice', label: '成本单价', visible: true, align: 'right', width: 120 },
          { props: 'costAmount', label: '成本金额', visible: true, align: 'right', width: 120 },
          { props: 'standingInventoryIsLabel', label: '是否常用件', visible: true, width: 120 },
          { props: 'remarkLike', label: '备注', visible: true, width: 200 },
          { props: 'latestInboundTime', label: '最近入库时间', visible: true, width: 200 },
          { props: 'latestOutboundTime', label: '最近出库时间', visible: true, width: 200 },
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
                  path: '/sparepart/warehouse/inventory/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'info'
            }]
          }
        ],
        total: 0
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
    this.getData();
  },
  methods: {

    async getSparePart (query) {
      try {
        const res = await sparePartListShort({ partCodeLikeOrList: query });
        // res.records = res.records?.map(item => ({
        //   ...item,
        //   displayName: item.companyName + `(${item.companyCode})`
        // }));
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },

    async getLocaltion (query) {
      try {
        const res = await locationList({ codeOrName: query });
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
        console.error('Error fetching series list:', error);
      }
    },

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
        path: '/sparepart/warehouse/inventory/edit'
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
      exportTable({
        businessType: '厅店备件库存',
        dataFetchPath: 'sparepart/web/warehouse/inventory/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '厅店备件库存.xlsx');
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
      console.log('类型' + this.$route.query.type);
      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          console.log(res);
          this.optionObj.dataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = res.total;
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

      if (this.form.latestInboundTime) {
        delete data.latestInboundTime;
        if (this.form.latestInboundTime.length > 1) {
          data.latestInboundTimeStart = this.form.latestInboundTime[0];
          data.latestInboundTimeEnd = this.form.latestInboundTime[1];
        }
      }

      if (this.form.latestOutboundTime) {
        delete data.latestOutboundTime;
        if (this.form.latestOutboundTime.length > 1) {
          data.latestOutboundTimeStart = this.form.latestOutboundTime[0];
          data.latestOutboundTimeEnd = this.form.latestOutboundTime[1];
        }
      }
      // if (Array.isArray(this.form.inventoryNoList) && this.form.inventoryNoList.length <= 1) {
      //   delete data.inventoryNoList;
      //   data.inventoryNoLike = this.form.inventoryNoList[0] || '';
      // }

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
    // 转移库位
    handleTransfer () {
      // 检查是否有选中项
      if (!this.selectionList || this.selectionList.length === 0) {
        this.$message.warning('请先选择要操作的数据');
        return;
      }
      // 如果是单条数据，直接通过
      if (this.selectionList.length === 1) {
        this.warehouseIds = this.selectionList[0].warehouseId;
        this.transferDialog = true;
        return;
      }
      // 提取所有选中项的 warehouseId
      const warehouseIds = this.selectionList.map(item => item.warehouseId);

      // 检查所有 warehouseId 是否相同
      const firstWarehouseId = warehouseIds[0];
      const allSame = warehouseIds.every(id => id === firstWarehouseId);

      if (allSame) {
        // 所有 warehouseId 相同，可以继续操作
        this.transferDialog = true;
      } else {
        this.$message.warning('选中的数据仓库不一致，请选择相同仓库的数据进行操作');
      }
    },
    handleTransferDialogClose () {
      this.transferDialog = false;
      this.getData();
    }
  }
};
</script>

<style lang="scss" scoped>
.m-inventory-list {
}
</style>
