<template>
  <div class="page-common m-service-proxy-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="缺货单号">
        <tag-input v-model="form.codeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="采购申请单">
        <tag-input v-model="form.purchaseApplyCodeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="备件编码/名称" v-show="this.visibleCount === 3 || show" v-if="activeName === 'outOfStock'">
          <fetch-select filterable clearable remote reserve-keyword multiple
              v-model="form.sparePartIdList" :remote-method="listSparePart" labelKey="code" valueKey="id"
              subLabelKey="name" />
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
        <el-form-item label="营销分类名称">
          <fetch-select
            :request="fetchOptions"
            enumCode="SparePartMarketingTypeEnum"
            v-model="form.marketingTypeList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="订单类型">
          <fetch-select
            :request="fetchOptions"
            enumCode="PurchaseOrderTypeEnum"
            v-model="form.purchaseOrderTypeList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="缺货单状态" v-if="activeName === 'homePage'">
          <fetch-select
            :request="fetchOptions"
            enumCode="BackOrderStatusEnum"
            v-model="form.backStatusList"
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
      <el-button v-if="canImport && activeName === 'outOfStock'" size="small" @click="handleImport">预计到货信息导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <!-- <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button> -->
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部订单" name="homePage"></el-tab-pane>
      <el-tab-pane label="缺货明细看板" name="outOfStock"></el-tab-pane>
    </el-tabs>
    <div
      class="ais-table-c"
      v-if="activeName === 'homePage'"
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
    <div
      class="ais-table-c"
      v-if="activeName === 'outOfStock'"
    >
    <!-- <vxe-table
        ref="tableRefAll"
        :data="optionObjStock.dataList"
        v-loading="loading"
        stripe
        resizable
        border="inner"
        size="medium"
        height="auto"
        min-height="200px"
        max-height="600px"
        width="1000px"
        :checkbox-config="{ checkField: 'checked' }"
        @checkbox-change="handleSelectionChangeBatch"
        @checkbox-all="handleSelectionChangeBatch"
      >
        <vxe-column type="checkbox" fixed="left" width="60" align="center" />
        <vxe-column title="缺货单号" fixed="left" field="purchaseOrderCode" width="200">
          <template #default="{ row }">
            <div class="action-button btn-link" @click="handleJump('/sparepart/purchase/backOrder/edit', row.id)">{{ row.purchaseOrderCode }}</div>
          </template>
        </vxe-column>
        <vxe-column title="采购申请单" fixed="left" field="purchaseApplyCode" width="200">
          <template #default="{ row }">
            <div class="action-button btn-link" @click="handleJump('/sparepart/purchase/purchaseApply/edit', row.purchaseApplyId)">{{ row.purchaseApplyCode }}</div>
          </template>
        </vxe-column>
        <vxe-column title="门店编码" field="dealerCode" width="200"></vxe-column>
        <vxe-column title="门店名称" field="dealerName" width="200"></vxe-column>
        <vxe-column title="备件编码" field="sparePartCode" width="200"></vxe-column>
        <vxe-column title="备件名称" field="sparePartName" width="200"></vxe-column>
        <vxe-column title="缺货天数" field="backDays" width="200"></vxe-column>
        <vxe-column title="预计厂端发货时间" field="estimatedFactoryDeliveryTime" width="200"></vxe-column>
        <vxe-column title="预计到店时间" field="estimatedArrivalTime" width="200"></vxe-column>
        <vxe-column title="其他解决方案" field="otherSolution" width="200"></vxe-column>
        <vxe-column title="厂端缺货说明" field="factoryBackDescription" width="200"></vxe-column>
        <vxe-column title="待处理备件数" field="pendingPartQty" width="200"></vxe-column>
        <vxe-column title="采购价" field="purchasePrice" width="200"></vxe-column>
        <vxe-column title="现金单价" field="cashUnitPrice" width="200"></vxe-column>
        <vxe-column title="当店可用库存" field="availableQty" width="200"></vxe-column>
        <vxe-column title="当店共享库存" field="sharedQty" width="200"></vxe-column>
        <vxe-column title="营销分类名称" field="marketingType" width="200"></vxe-column>
        <vxe-column title="备注" field="remark" width="200"></vxe-column>
        <vxe-column title="创建时间" field="createTime" width="200"></vxe-column>
        <vxe-column title="修改时间" field="updateTime" width="200"></vxe-column>
    </vxe-table>
    <div class="table-pagination">
          <el-pagination
              @size-change="(val) => pageSizeChange(val)"
              @current-change="(val) => currentPageChange(val)"
              :current-page="optionObjStock.form.page"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="optionObjStock.form.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="optionObjStock.total"
          >
          </el-pagination>
    </div> -->
    <LPVxeTable
        :key="2"
        ref="tableRefStock"
        v-loading="loading"
        is-checkbox
        is-page
        checkboxFixed
        centralized
        :option-obj="optionObjStock"
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
      id="sparePartBackEstimatedArrivalImport"
      @close="handleUploadDialogClose"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem, reportPage } from '@/api/sparepart/purchase/backOrder/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfoByParam, listWarehouse } from '@/api/common';
import { getSparePart } from '@/api/sparepart/basic/sparePart/index';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import TagInput from '@/libs/components/TagInput';
import LackEditPage from './outOfStock/edit.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  code: '',
  purchaseApplyCode: '',
  dealerCode: '',
  purchaseOrderTypeList: [],
  backStatusList: '',
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
    TagInput
  },
  data () {
    return {
      pageTitle: '备件缺货订单',
      pageType: 'list',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-backOrder',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      activeName: 'homePage',
      clickItemId: '',
      optionObj: {
        id: 'backOrderTable',
        dataList: [],
        form: {
          page: 1,
          size: 20
        },
        dataProp: [
          {
            props: 'code',
            label: '缺货单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/purchase/backOrder/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'purchaseApplyCode',
            label: '采购申请单',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/purchase/purchaseApply/edit',
                  query: {
                    id: row.purchaseApplyId
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
          { props: 'purchaseOrderTypeLabel', label: '订单类型', visible: true, width: 120 },
          { props: 'pendingVarietyCount', label: '待处理品种数', visible: true, align: 'right', width: 140 },
          { props: 'processedVarietyCount', label: '已处理品种数', visible: true, align: 'right', width: 140 },
          { props: 'backStatusLabel', label: '缺货单状态', visible: true, width: 120 },
          { props: 'remark', label: '备注', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '修改时间', visible: true, width: 200 },
        ],
        total: 0
      },
      optionObjStock: {
        id: 'backOrderStockTable',
        dataList: [],
        form: {
          page: 1,
          size: 20
        },
        dataProp: [
          {
            props: 'backOrderCode',
            label: '缺货单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/purchase/backOrder/edit',
                  query: {
                    id: row.backOrderId
                  }
                });
              },
              type: 'primary'
            }]
          },
          {
            props: 'purchaseApplyCode',
            label: '采购申请单',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/purchase/purchaseApply/edit',
                  query: {
                    id: row.purchaseApplyId
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
          { props: 'purchaseOrderTypeLabel', label: '订单类型', visible: true, width: 120 },
          {
            props: 'sparePartCode',
            label: '备件编码',
            visible: true,
            width: 200,
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/basic/sparePart/edit',
                  query: {
                    id: row.sparePartId
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'sparePartName', label: '备件名称', visible: true, width: 200 },
          { props: 'backDays', label: '缺货天数', visible: true, align: 'right', width: 120 },
          { props: 'estimatedFactoryDeliveryTime', label: '预计厂端发货时间', visible: true, width: 200 },
          { props: 'estimatedArrivalTime', label: '预计到店时间', visible: true, width: 200 },
          { props: 'otherSolution', label: '其他解决方案', visible: true, width: 200 },
          { props: 'factoryBackDescription', label: '厂端缺货说明', visible: true, width: 200 },
          { props: 'pendingPartQty', label: '待处理备件数', visible: true, align: 'right', width: 140 },
          { props: 'purchasePrice', label: '采购价', visible: true, align: 'right', width: 120 },
          { props: 'cashUnitPrice', label: '现金单价', visible: true, align: 'right', width: 120 },
          { props: 'availableQty', label: '当店可用库存', visible: true, align: 'right', width: 140 },
          { props: 'sharedQty', label: '当店共享库存', visible: true, align: 'right', width: 140 },
          { props: 'marketingTypeLabel', label: '营销分类名称', visible: true, width: 140 },
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
                  path: '/sparepart/purchase/backOrder/outOfStock/edit',
                  query: {
                    id: row.id,
                    isEditing: true
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
    handleListSelect (row) {
      if (this.activeName === 'homePage') {
        this.clickItemId = row.id;
      } else {
        this.clickItemId = row.backOrderId;
      }
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/sparepart/purchase/backOrder/edit'
      });
    },
    onSubmit () {
      let optionObj = this.optionObj;
      if (this.activeName === 'homePage') {
        optionObj = this.optionObj;
      } else {
        optionObj = this.optionObjStock;
      }
      optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      let optionObj = this.optionObj;
      if (this.activeName === 'homePage') {
        optionObj = this.optionObj;
      } else {
        optionObj = this.optionObjStock;
      }
      optionObj.form.page = 1;
      optionObj.form.size = 20;
      this.getData();
    },
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      let fetchPath = 'sp/web/purchase/backOrder/page';
      let tableRef = this.$refs.tableRef;
      if (this.activeName === 'homePage') {
        tableRef = this.$refs.tableRef;
        fetchPath = 'sp/web/purchase/backOrder/page';
      } else {
        tableRef = this.$refs.tableRefStock;
        fetchPath = 'sp/web/purchase/backOrderDetail/reportPage';
      }
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '备件缺货订单',
        dataFetchPath: fetchPath,
        reqParams,
        titleMap: tableRef && tableRef.getVisibleCols ? Object.fromEntries(tableRef.getVisibleCols()) : {},
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '备件缺货订单.xlsx');
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
      let fetchApi = getList;
      let optionObj = this.optionObj;
      if (this.activeName === 'homePage') {
        fetchApi = getList;
        optionObj = this.optionObj;
      } else {
        fetchApi = reportPage;
        optionObj = this.optionObjStock;
      }
      fetchApi({ ...this.getFormData(), pageNum: optionObj.form.page, pageSize: optionObj.form.size })
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
      let optionObj = this.optionObj;
      if (this.activeName === 'homePage') {
        optionObj = this.optionObj;
      } else {
        optionObj = this.optionObjStock;
      }
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
      let optionObj = this.optionObj;
      if (this.activeName === 'homePage') {
        optionObj = this.optionObj;
      } else {
        optionObj = this.optionObjStock;
      }
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

      return data;
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
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    async listSparePart (query) {
      let res = await getSparePart({ partCodeOrNameLike: query });
      return res;
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
    // 点击tabs栏切换
    handleClick (item) {
      this.activeName = item.name;
      this.show = false;
      this.getData();
    },
    // 跳转详情页
    handleJump (val, ele) {
      this.$router.push({
        path: val,
        query: {
          id: ele
        }
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.m-service-proxy-list {
  ::v-deep .m-vxe-table .m-vxe-table-options {
    top: -96px;
  }
  .ais-actions {
    margin-bottom: 8px;
  }
  .ais-table-c {
    height: calc(100% - 168px);
  }
  .table-pagination {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
