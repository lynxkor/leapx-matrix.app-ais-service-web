<template>
  <edit-page-layout ref="editLayout" :title="orderTitle">
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="`${title} ${form.code}`"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :originalForm.sync="originalForm"
      >
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="库存单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="备件编码：" prop="sparePartId">
                  {{ form.partCode }}
                </el-form-item>
                <el-form-item label="备件名称：" prop="sparePartId">
                  {{ form.partName }}
                </el-form-item>
                <el-form-item label="可用数量：" prop="availableQty">
                  {{ form.availableQty }}
                </el-form-item>
                <el-form-item label="冻结数量：" prop="frozenQty">
                  {{ form.frozenQty }}
                </el-form-item>
                <el-form-item label="共享数量：" prop="sharedQty">
                  {{ form.sharedQty }}
                </el-form-item>
                <el-form-item label="库存总数：" prop="totalQty">
                  {{ form.totalQty }}
                </el-form-item>
                <el-form-item label="库存天数：">
                  {{ form.inventoryDays }}
                </el-form-item>
                <el-form-item label="厅店名称：" prop="dealerCode">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="仓库名称：" prop="warehouseId">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="库位：">
                  <fetch-select
                    :remote-method="getLocaltion"
                    remote
                    v-model="form.locationId"
                    placeholder="请输入库位名称"
                    labelKey="name"
                    valueKey="id"
                    clearable
                    collapseTags
                    filterable
                  />
                </el-form-item>
                <el-form-item label="最近入库时间：">
                  {{ form.latestInboundTime }}
                </el-form-item>
                <el-form-item label="成本单价：" prop="costUnitPrice">
                  {{ form.transactionUnitPrice }}
                </el-form-item>
                <el-form-item label="最近出库时间：">
                  {{ form.latestOutboundTime }}
                </el-form-item>
                <el-form-item label="成本金额：" prop="costAmount">
                  {{ form.transactionAmount }}
                </el-form-item>
                <el-form-item label="采购单价：" prop="costAmount">
                  {{ form.purchasePrice }}
                </el-form-item>
                <el-form-item label="在途数量：" prop="inTransitQty">
                  {{ form.inTransitQty }}
                </el-form-item>
                <el-form-item label="销售单价：" prop="costAmount">
                  {{ form.salePrice }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    type="textarea"
                    maxlength="500"
                    show-word-limit
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="库存单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="备件编码：" prop="sparePartId">
                  {{ form.partCode }}
                </el-form-item>
                <el-form-item label="备件名称：" prop="sparePartId">
                  {{ form.partName }}
                </el-form-item>
                <el-form-item label="可用数量：" prop="availableQty">
                  {{ form.availableQty }}
                </el-form-item>
                <el-form-item label="冻结数量：" prop="frozenQty">
                  <div class="el-frozenQty" @click="handleFrozenQtyClick(0)">{{ form.frozenQty }}</div>
                </el-form-item>
                <el-form-item label="共享数量：" prop="sharedQty">
                  {{ form.sharedQty }}
                </el-form-item>
                <el-form-item label="库存总数：" prop="totalQty">
                  {{ form.totalQty }}
                </el-form-item>
                <el-form-item label="库存天数：">
                  {{ form.inventoryDays }}
                </el-form-item>
                <el-form-item label="厅店名称：" prop="dealerCode">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="仓库名称：" prop="warehouseId">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="库位：" prop="locationId">
                  {{ form.locationName }}
                </el-form-item>
                <el-form-item label="最近入库时间：" prop="latestInboundTime">
                  {{ form.latestInboundTime }}
                </el-form-item>
                <el-form-item label="成本单价：" prop="costUnitPrice">
                  {{ form.costUnitPrice }}
                </el-form-item>
                <el-form-item label="最近出库时间：" prop="latestOutboundTime">
                  {{ form.latestOutboundTime }}
                </el-form-item>
                <el-form-item label="成本金额：" prop="costAmount">
                  {{ form.costAmount }}
                </el-form-item>
                <el-form-item label="采购单价：" prop="costAmount">
                  {{ form.purchasePrice }}
                </el-form-item>
                <el-form-item label="在途数量：" prop="inTransitQty">
                  <div class="el-frozenQty" @click="handleFrozenQtyClick(1)">{{ form.inTransitQty }}</div>
                </el-form-item>
                <el-form-item label="销售单价：" prop="costAmount">
                  {{ form.salePrice }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>库存流水</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  ref="inventoryFlowTable"
                  :data="inventoryData"
                  stripe
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                >
                  <vxe-column field="code" title="流水编号" width="9%" />
                  <vxe-column field="outInTypeLabel" title="操作类型" width="9%" />
                  <vxe-column field="businessTypeLabel" title="业务类型" width="9%" />
                  <vxe-column field="businessNo" title="业务单号" width="200">
                    <template #default="{ row }">
                      <div class="href-link" @click="handleJump(row)">{{ row.businessNo }}</div>
                    </template>
                  </vxe-column>
                  <vxe-column field="qty" title="数量" width="9%" />
                  <vxe-column field="costUnitPrice" title="成本单价" width="9%" />
                  <vxe-column field="costAmount" title="成本金额" width="9%" />
                  <vxe-column field="transactionUnitPrice" title="交易单价" width="9%" />
                  <vxe-column field="transactionAmount" title="交易金额" width="9%" />
                  <vxe-column field="operator" title="操作人" width="9%" />
                  <vxe-column field="createTime" title="创建时间" width="9%" />
                </vxe-table>
                <div class="table-pagination">
                  <el-pagination
                    @size-change="(val) => pageSizeChange(val)"
                    @current-change="(val) => currentPageChange(val)"
                    :current-page="inventory.current"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="inventory.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="inventory.total"
                  >
                  </el-pagination>
                </div>
              </div>
            </div>
          </section>
          <section
            v-for="section in sections"
            :key="section.type"
            class="common-section"
          >
            <div class="common-section-header">
              <h2>{{ section.title }}</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  :ref="`${section.type}Table`"
                  :data="section.tableData"
                  stripe
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                >
                  <vxe-column field="inventoryFlowCode" title="流水编号" width="11%" />
                  <vxe-column field="addSubTypeLabel" title="操作类型" width="11%" />
                  <vxe-column field="bizTypeName" title="业务类型" width="11%" />
                  <vxe-column field="businessNo" title="业务单号" width="200">
                    <template #default="{ row }">
                      <div class="href-link" @click="handleJump(row)">{{ row.businessNo }}</div>
                    </template>
                  </vxe-column>
                  <vxe-column field="qty" title="数量" width="11%" />
                  <vxe-column field="oldQty" title="旧值" width="11%" />
                  <vxe-column field="newQty" title="新值" width="11%" />
                  <vxe-column field="operator" title="操作人" width="11%" />
                  <vxe-column field="createTime" title="创建时间" width="11%" />
                </vxe-table>
                <div class="table-pagination">
                  <el-pagination
                    @size-change="(val) => handlePageSizeChange(section.type, val)"
                    @current-change="(val) => handleCurrentPageChange(section.type, val)"
                    :current-page="section.pagination.current"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="section.pagination.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="section.pagination.total"
                  >
                  </el-pagination>
                </div>
              </div>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
        <OrderDetail
          :orderType="orderTitle"
          :id="_id"
        ></OrderDetail>
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, flowPage, operationFlowPage, getBizType } from '@/api/sparepart/warehouse/inventory/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, getSparePartOrderIdByCode } from '@/api/common';
import { locationList } from '@/api/sparepart/warehouse/warehouse/index';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import OrderDetail from './OrderDetail.vue';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  sparePartId: '',
  warehouseId: '',
  status: '',
  locationId: '',
  dealerCode: '',
  inTransitQty: '',
  availableQty: '',
  frozenQty: '',
  sharedQty: '',
  totalQty: '',
  costUnitPrice: '',
  costAmount: '',
  remark: '',
};

export default {
  name: 'inventoryEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    FetchSelect,
    OrderDetail
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    // 表格配置
    sections () {
      return [
        {
          type: 'available',
          title: '可用流水',
          tableData: this.tableData.available,
          pagination: this.pagination.available
        },
        {
          type: 'freeze',
          title: '冻结流水',
          tableData: this.tableData.freeze,
          pagination: this.pagination.freeze
        },
        {
          type: 'transit',
          title: '在途流水',
          tableData: this.tableData.transit,
          pagination: this.pagination.transit
        }
      ];
    },
  },
  watch: {
    id: {
      handler (val) {
        if (val) {
          this.getDetailData();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '门店备件库存',
      pageType: 'edit',
      title: '库存单号：',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-inventory',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      orderTitle: '冻结订单',
      inventoryData: [],
      inventory: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      // 表格数据
      tableData: {
        available: [],
        freeze: [],
        transit: []
      },

      // 分页配置
      pagination: {
        available: { current: 1, pageSize: 10, total: 0 },
        freeze: { current: 1, pageSize: 10, total: 0 },
        transit: { current: 1, pageSize: 10, total: 0 }
      },
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      rules: {
        sparePartId: [
          { required: true, message: '请输入零件ID', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    this.getInventory();
    this.loadAllTableData();
  },
  methods: {
    // 业务单号跳转
    async handleJump (row) {
      const bizType = await getBizType({ code: row.businessType, type: row.type });
      if (!bizType) {
        return;
      }
      const res = await getSparePartOrderIdByCode({ code: row.businessNo, type: bizType });
      const orderTypeMap = {
        // 采购相关
        purchaseOrder: '/sparepart/purchase/purchaseOrder/edit',
        purchaseApply: '/sparepart/purchase/purchaseApply/edit',
        backOrder: '/sparepart/purchase/backOrder/edit',
        inboundOrder: '/sparepart/inbound/inboundOrder/edit',
        returnOrder: '/sparepart/return/returnOrder/edit',
        returnExceptionalOrder: '/sparepart/return/returnException/edit',
        // 外购件相关 (Dealer 前缀)
        dealerInboundOrder: '/sparepart/inbound/dealerInboundOrder/edit',
        dealerReturnOrder: '/sparepart/outbound/dealerReturnOrder/edit',
        dealerOutboundOrder: '/sparepart/outbound/dealerOutboundOrder/edit',
        // 调拨相关
        transferInbound: '/sparepart/transfer/transferInbound/edit',
        transferOutbound: '/sparepart/transfer/transferOutbound/edit',
        shareTransferOutbound: '/sparepart/transfer/sharedTransferOutbound/edit',
        // 维修相关
        maintenanceReturnInbound: '/sparepart/inbound/maintenanceReturnInbound/edit',
        maintenanceOutboundOrder: '/sparepart/outbound/maintenanceOutboundOrder/edit',
        // 零售相关
        retailOrder: '/sparepart/sale/retailOrder/edit',
        // 盘点相关
        stockTaking: '/sparepart/warehouse/stockTaking/edit',
        stockTakingDifferences: '/sparepart/warehouse/stockTakingDifferences/edit',
        // 其他
        claimOrder: '/sparepart/claim/sparePartClaim/edit',
        oemOutboundOrder: '/sparepart/warehouse/oemOutboundOrder/edit'
      };

      const path = orderTypeMap[bizType];
      if (!path) {
        this.$message.warning(`不支持的 bizType: ${bizType}`);
        return;
      }

      this.$router.push({
        path: path,
        query: {
          id: res
        }
      });
    },
    async getLocaltion (query) {
      try {
        const res = await locationList({ codeOrName: query, warehouseId: this.form.warehouseId });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    handleFrozenQtyClick (val) {
      if (val === 0) {
        this.orderTitle = '冻结订单';
      } else {
        this.orderTitle = '在途订单';
      }
      this.openPane();
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 详情表格相关数据
    handleAddRow () {
      // 通过引用直接调用子组件方法
      this.$refs.editTable.addRow();
    },
    handleSaveTable (data) {
      // 调用保存方法并处理结果
      return new Promise((resolve, reject) => {
        this.$refs.editTable.saveAll().then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm
        // ownerId: userInfo.userId,
        // ownerName: userInfo.userName,
      };
    },
    // 审核日志
    // handleJumpAuditLog () {
    //   this.$auditLog.show({ id: 123 });
    // },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    async getInventory () {
      const params = {
        pageNum: this.inventory.current,
        pageSize: this.inventory.pageSize,
        inventoryId: this.$route.query.id
      };
      const res = await flowPage(params);
      this.inventoryData = res.records || [];
      this.inventory.total = res.total;
    },
    pageSizeChange (pageSize) {
      this.inventory.pageSize = pageSize;
      this.inventory.current = 1; // 重置到第一页
      this.getInventory();
    },
    currentPageChange (current) {
      this.inventory.current = current;
      this.getInventory();
    },
    // 统一的分页处理方法
    handlePageSizeChange (type, pageSize) {
      this.pagination[type].pageSize = pageSize;
      this.pagination[type].current = 1; // 重置到第一页
      this.loadTableData(type);
    },

    handleCurrentPageChange (type, current) {
      this.pagination[type].current = current;
      this.loadTableData(type);
    },
    // 统一的加载数据方法
    async loadTableData (type) {
      const { current, pageSize } = this.pagination[type];
      const inventoryId = this.$route.query.id;

      // 参数映射
      const paramMap = {
        available: { type: 'AVAILABLE' },
        freeze: { type: 'FROZEN' },
        transit: { type: 'IN_TRANSIT' }
      };

      // 构建参数
      const params = {
        pageNum: current,
        pageSize,
        inventoryId,
        type: paramMap[type].type
      };

      try {
        const res = await operationFlowPage(params);
        this.$set(this.tableData, type, res.records || []);
        this.pagination[type].total = res.total || 0;
      } catch (error) {
        console.log('Error loading table data:', error);
      }
    },

    // 批量加载所有表格数据
    loadAllTableData () {
      this.sections.forEach(section => {
        this.loadTableData(section.type);
      });
    },

    // 根据类型获取标题
    getSectionTitle (type) {
      const section = this.sections.find(s => s.type === type);
      return section ? section.title : '';
    },
  }
};
</script>
<style lang="scss" scoped>
  .el-frozenQty {
    color: #009100;
    cursor: pointer;
  }
  .table-pagination {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
  }
</style>
