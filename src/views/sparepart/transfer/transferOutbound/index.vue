<template>
  <div class="page-common m-transfer-outbound-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="调拨出库单号">
        <tag-input v-model="form.codeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="入库门店">
        <fetch-select
          :remote-method="getDealerList"
          remote
          v-model="form.inboundDealerCodeList"
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
      <el-form-item label="出库门店" v-show="this.visibleCount === 3 || show">
        <fetch-select
          :remote-method="getDealerList"
          remote
          v-model="form.outboundDealerCodeList"
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
      <template v-if="show">
        <el-form-item label="入库方联系人">
          <el-input
            placeholder="请输入"
            v-model="form.inboundContactName"
            clearable
          />
        </el-form-item>
        <el-form-item label="入库方手机">
          <el-input
            placeholder="请输入"
            v-model="form.inboundContactPhone"
            clearable
          />
        </el-form-item>
        <el-form-item label="调拨状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="TransferOutboundStatusEnum"
            v-model="form.transferStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="出库状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="DealerTransferOutStatusEnum"
            v-model="form.outboundStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="撤销状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="TransferOutboundCancelStatusEnum"
            v-model="form.cancelStatusList"
            placeholder="请选择"
            clearable
            multiple
            filterable
          />
        </el-form-item>
        <el-form-item label="入库状态">
          <fetch-select
            :request="fetchOptions"
            enumCode="TransferOutboundInStatusEnum"
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
        :view-scope="activeName"
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <!-- <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
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
    <!-- 发运弹窗 -->
    <ShipmentDialog
      :visible.sync="shipmentDialogVisible"
      :id="shipmentId"
      @update:visible="val => shipmentDialogVisible = val"
      @success="getData"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import LPVxeTable from '@leapmotor/design/packages/table/index.vue';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, detailPage, deleteItem, enableItem, getSubmit, getApprove, getReject, getRevoke, applyCancel, approveCancel, rejectCancel, getInbound } from '@/api/sparepart/transfer/transferOutbound/index';
import {
  getTableConfig, tableAddOrUpdate, exportTable, getEnum, getUserByNameOrNo, listOrgStoreInfoByParam,
  getSparePartCompany, listWarehouse, getPartDealer, getLoginUser, getDesensitize
} from '@/api/common';
import TagInput from '@/libs/components/TagInput';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';
import ShipmentDialog from './ShipmentDialog.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  // 注意：被 <tag-input> 绑定的字段必须用 [] 而非 null，否则 reset 时
  // TagInput 内部 tagList = null 会导致 slice()/length 抛错，UI 无法清空。
  codeList: [],
  inboundDealerCodeList: null,
  createTime: '',
  updateTime: '',

  // ===== 扩展条件（homePage + allSpareParts） =====
  outboundDealerCodeList: null,
  outboundDealerNameList: null,
  inboundDealerNameList: null,
  inboundContactName: '',
  inboundContactPhone: '',
  transferStatusList: null,
  outboundStatusList: null,
  cancelStatusList: null,
  inboundStatusList: null,

  // ===== 全部备件 tab 专用（仅 allSpareParts 用） =====
  // 注意：被 <tag-input> 绑定的字段必须用 [] 而非 null，否则 reset 时
  // TagInput 内部 tagList = null 会导致 slice()/length 抛错，UI 无法清空。
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
    TagInput,
    ShipmentDialog
  },
  data () {
    return {
      pageTitle: '备件调拨出库',
      pageType: 'list',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-transferOutbound',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      shipmentDialogVisible: false, // 发运弹窗
      shipmentId: '', // 发运弹窗id
      clickItemId: '',
      activeName: 'homePage',
      optionObj: {
        id: 'transferOutboundTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '调拨出库单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/transfer/transferOutbound/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'outboundDealerCode', label: '出库门店编码', visible: true, width: 180, buttons: [{ click: (rowIndex, row) => { window.open(`/partner/channelManagement/shopDetail?dealerCode=${row.outboundDealerCode}`, '_blank'); }, type: 'primary' }] },
          { props: 'outboundDealerName', label: '出库门店名称', visible: true, width: 200 },
          { props: 'outboundWarehouseName', label: '出库方仓库', visible: true, width: 200 },
          { props: 'inboundDealerCode', label: '入库门店编码', visible: true, width: 180, buttons: [{ click: (rowIndex, row) => { window.open(`/partner/channelManagement/shopDetail?dealerCode=${row.inboundDealerCode}`, '_blank'); }, type: 'primary' }] },
          { props: 'inboundDealerName', label: '入库门店名称', visible: true, width: 200 },
          {
            props: 'inboundContactName',
            label: '入库方联系人',
            visible: true,
            width: 160,
            mask: true,
            getValue: (row) => getDesensitize(row.id, 'transferOutbound', 'inboundContactName')
          },
          {
            props: 'inboundContactPhone',
            label: '入库方手机',
            visible: true,
            width: 180,
            mask: true,
            getValue: (row) => getDesensitize(row.id, 'transferOutbound', 'inboundContactPhone')
          },
          { props: 'transferStatusLabel', label: '调拨状态', visible: true, width: 120 },
          { props: 'outboundStatusLabel', label: '出库状态', visible: true, width: 120 },
          { props: 'cancelStatusLabel', label: '撤销状态', visible: true, width: 120 },
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
              name: '编辑',
              show: (row) => {
                return row.transferStatus === '0' || row.transferStatus === '3';
              },
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/sparepart/transfer/transferOutbound/edit',
                  query: {
                    id: row.id,
                    isEditing: true
                  }
                });
              },
              type: 'info'
            }, {
              name: '提交',
              show: (row) => {
                return (row.transferStatus === '0' || row.transferStatus === '3') && this.permissions.has('AISPART-transferOutbound-submit');
              },
              popconfirmTitle: '此操作将提交, 是否继续?',
              click: (rowIndex, row) => {
                getSubmit({ id: row.id }).then(res => {
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                  this.getData();
                });
              },
              type: 'info'
            }, {
              name: '同意',
              show: (row) => {
                return row.transferStatus === '1' && this.permissions.has('AISPART-transferOutbound-approve');
              },
              popconfirmTitle: '此操作将同意, 是否继续?',
              click: (rowIndex, row) => {
                getApprove({ id: row.id }).then(res => {
                  this.$message({
                    message: '同意成功',
                    type: 'success'
                  });
                  this.getData();
                });
              },
              type: 'info'
            }, {
              name: '驳回',
              show: (row) => {
                return row.transferStatus === '1' && this.permissions.has('AISPART-transferOutbound-reject');
              },
              click: (rowIndex, row) => {
                this.$prompt('请输入驳回原因！', '驳回', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                }).then(({ value }) => {
                  // 调用驳回接口
                  getReject({ id: row.id, description: value }).then(() => {
                    this.$message({
                      type: 'success',
                      message: '驳回成功!'
                    });
                    this.getData();
                  });
                });
              },
              type: 'info'
            }, {
              name: '撤回',
              show: (row) => {
                return row.transferStatus === '2' && row.outboundStatus === '0' && this.permissions.has('AISPART-transferOutbound-revoke');
              },
              popconfirmTitle: '此操作将撤回该出库单, 是否继续?',
              click: (rowIndex, row) => {
                getRevoke({ id: row.id }).then(res => {
                  this.$message({
                    message: '撤回成功',
                    type: 'success'
                  });
                  this.getData();
                });
              },
              type: 'info'
            }, {
              name: '发运',
              show: (row) => {
                return row.transferStatus === '2' && row.outboundStatus === '0' && this.permissions.has('AISPART-transferOutbound-ship');
              },
              click: (rowIndex, row) => {
                this.handleShipment(row);
                // getShip({ id: row.id }).then(res => {
                //   this.$message({
                //     message: '发运成功',
                //     type: 'success'
                //   });
                //   this.getData();
                // });
              },
              type: 'info'
            }, {
              name: '打印',
              show: (row) => {
                return this.permissions.has('AISPART-transferOutbound-print');
              },
              click: (rowIndex, row) => {
                this.handlePrint(row);
              },
              type: 'info'
            }, {
              name: '申请撤销',
              show: (row) => {
                return (row.cancelStatus === '10' || row.cancelStatus === '40') && row.outboundStatus === '1' && this.permissions.has('AISPART-transferOutbound-applyCancel');
              },
              click: (rowIndex, row) => {
                this.$prompt('请输入申请撤销原因！', '申请撤销', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                }).then(({ value }) => {
                  applyCancel({ id: row.id, description: value }).then(() => {
                    this.$message({
                      type: 'success',
                      message: '申请撤销成功!'
                    });
                    this.getData();
                  });
                });
              },
              type: 'info'
            }, {
              name: '同意撤销',
              show: (row) => {
                return row.cancelStatus === '20' && this.permissions.has('AISPART-transferOutbound-approveCancel');
              },
              popconfirmTitle: '此操作将同意撤销, 是否继续?',
              click: (rowIndex, row) => {
                approveCancel({ id: row.id }).then(res => {
                  this.$message({
                    message: '同意撤销成功',
                    type: 'success'
                  });
                  this.getData();
                });
              },
              type: 'info'
            }, {
              name: '驳回撤销',
              show: (row) => {
                return row.cancelStatus === '20' && this.permissions.has('AISPART-transferOutbound-rejectCancel');
              },
              click: (rowIndex, row) => {
                this.$prompt('请输入驳回撤销原因！', '驳回撤销', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                }).then(({ value }) => {
                  rejectCancel({ id: row.id, description: value }).then(() => {
                    this.$message({
                      type: 'success',
                      message: '驳回撤销成功!'
                    });
                    this.getData();
                  });
                });
              },
              type: 'info'
            }, {
              name: '入库',
              show: (row) => {
                return row.cancelStatus === '30' && row.inboundStatus === '0' && this.permissions.has('AISPART-transferOutbound-inbound');
              },
              popconfirmTitle: '此操作将入库, 是否继续?',
              click: (rowIndex, row) => {
                getInbound({ id: row.id }).then(res => {
                  this.$message({
                    message: '入库成功',
                    type: 'success'
                  });
                  this.getData();
                });
              },
              type: 'info'
            }
            // {
            //   name: '删除',
            //   popconfirmTitle: '此操作将永久删除, 是否继续?',
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
        id: 'transferOutboundTableAll',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          /* ========== 订单维度 ========== */
          {
            props: 'code',
            label: '调拨出库单号',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{ click: (rowIndex, row) => { this.$router.push({ path: '/sparepart/transfer/transferOutbound/edit', query: { id: row.transferOutboundId || row.id } }); }, type: 'primary' }]
          },
          { props: 'outboundDealerCode', label: '出库门店编码', visible: true, width: 180, buttons: [{ click: (rowIndex, row) => { window.open(`/partner/channelManagement/shopDetail?dealerCode=${row.outboundDealerCode}`, '_blank'); }, type: 'primary' }] },
          { props: 'outboundDealerName', label: '出库门店名称', visible: true, width: 200 },
          { props: 'outboundWarehouseName', label: '出库方仓库', visible: true, width: 200 },
          { props: 'inboundDealerCode', label: '入库门店编码', visible: true, width: 180, buttons: [{ click: (rowIndex, row) => { window.open(`/partner/channelManagement/shopDetail?dealerCode=${row.inboundDealerCode}`, '_blank'); }, type: 'primary' }] },
          { props: 'inboundDealerName', label: '入库门店名称', visible: true, width: 200 },
          {
            props: 'inboundContactName',
            label: '入库方联系人',
            visible: true,
            width: 160,
            mask: true,
            getValue: (row) => getDesensitize(row.transferOutboundId, 'transferOutbound', 'inboundContactName')
          },
          {
            props: 'inboundContactPhone',
            label: '入库方手机',
            visible: true,
            width: 180,
            mask: true,
            getValue: (row) => getDesensitize(row.transferOutboundId, 'transferOutbound', 'inboundContactPhone')
          },
          { props: 'transferStatusLabel', label: '调拨状态', visible: true, width: 120 },
          { props: 'outboundStatusLabel', label: '出库状态', visible: true, width: 120 },
          { props: 'cancelStatusLabel', label: '撤销状态', visible: true, width: 120 },
          { props: 'inboundStatusLabel', label: '入库状态', visible: true, width: 120 },
          { props: 'remark', label: '订单备注', visible: true, width: 200 },
          { props: 'createTime', label: '订单创建时间', visible: true, width: 200 },
          { props: 'updateTime', label: '订单修改时间', visible: true, width: 200 },

          /* ========== 明细维度 ========== */
          { props: 'sparePartCode', label: '备件编码', visible: true, width: 180, buttons: [{ click: (rowIndex, row) => { this.$router.push({ path: '/sparepart/basic/sparePart/edit', query: { id: row.sparePartId } }); }, type: 'primary' }] },
          { props: 'sparePartName', label: '备件名称', visible: true, width: 200 },
          { props: 'locationName', label: '库位', visible: true, width: 120 },
          {
            props: 'availableQty',
            label: '可用库存',
            visible: true,
            width: 120,
            align: 'right'
          },
          {
            props: 'transferPriceTaxIncluded',
            label: '调拨价格(含税)',
            visible: true,
            width: 140,
            align: 'right'
          },
          {
            props: 'transferPriceTaxExcluded',
            label: '调拨价格(不含税)',
            visible: true,
            width: 160,
            align: 'right'
          },
          {
            props: 'taxAmount',
            label: '金额（含税）',
            visible: true,
            width: 140,
            align: 'right'
          },
          {
            props: 'transferQty',
            label: '调拨数量',
            visible: true,
            width: 120,
            align: 'right'
          },
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
        path: '/sparepart/transfer/transferOutbound/edit'
      });
    },
    onSubmit () {
      const optionObj = this.getOptionObj();
      optionObj.form.page = 1;
      this.debouncedGetData();
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
      this.debouncedGetData();
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
      // 按 tab 切换导出接口
      const fetchPath = this.activeName === 'allSpareParts'
        ? 'sp/web/dealer/transferOutbound/detailPage'
        : 'sp/web/dealer/transferOutbound/page';
      const tableRef = this.activeName === 'allSpareParts'
        ? this.$refs.tableRefAll
        : this.$refs.tableRef;
      exportTable({
        businessType: '备件调拨出库',
        dataFetchPath: fetchPath,
        reqParams,
        titleMap: tableRef && tableRef.getVisibleCols ? Object.fromEntries(tableRef.getVisibleCols()) : {},
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '备件调拨出库.xlsx');
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
          const records = res?.records || [];
          optionObj.dataList = records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          optionObj.total = res?.total || 0;
        }).catch(err => {
          console.error('获取调拨出库列表失败:', err);
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

      // 全部备件 tab 默认条件校验
      // 【调拨出库单号】【订单创建时间】不允许全部为空
      if (this.activeName === 'allSpareParts') {
        const hasCode = !!(data.codeList && data.codeList.length);
        const hasCreateTime = !!(data.createTimeStart && data.createTimeEnd);
        if (!hasCode && !hasCreateTime) {
          this.$message.warning('请至少填写【调拨出库单号】【订单创建时间】中的任意一个');
          return null;
        }
        // ===== 全部备件 tab：订单创建时间跨度校验（不超过半年） =====
        if (data.createTimeStart && data.createTimeEnd) {
          const start = new Date(data.createTimeStart);
          const end = new Date(data.createTimeEnd);
          const sixMonthsLater = new Date(start);
          sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
          if (end > sixMonthsLater) {
            this.$message.warning('【订单创建时间】跨度不能超过半年');
            return null;
          }
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
    // 打印调拨出库单
    handlePrint (val) {
      this.$print.show({
        id: val.id, // 必选，对应数据id
        template: 'TransferOutbound', // 必选，对应 ./template/文件名.vue
        title: `${val.dealerName}厅店调拨出库单`// 可选，打印标题
      });
    },
    // 发运
    handleShipment (val) {
      this.shipmentId = val.id;
      this.shipmentDialogVisible = true;
    },
  }
};
</script>

<style lang="scss" scoped>
.m-transfer-outbound-list {
}
</style>
