<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <edit-base-container ref="containerRef" :id="_id" :title="title" :isEditing.sync="isEditing" :form.sync="form"
        :originalForm.sync="originalForm" :submitRequest="submitRequest" :detailRequest="detailRequest">
        <template #status>
          <span v-if="form.status" class="status primary">{{ form.outboundStatusLabel }}</span>
        </template>
        <template #extraButtons>
          <el-button v-if="_id && form.outboundStatus === '0' && permissions.has('AISPART-sharedTransferOutbound-print')" plain size="small" @click="handleShipment">发运</el-button>
          <el-button v-if="_id" type="primary" size="small" @click="handlePrint">打印</el-button>
        </template>
        <el-main>
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="共享调拨出库单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="出库门店编码：" prop="outboundDealerCode">
                  {{ form.outboundDealerCode }}
                </el-form-item>
                <el-form-item label="出库门店名称：" prop="outboundDealerName">
                  {{ form.outboundDealerName }}
                </el-form-item>
                <el-form-item label="出库方仓库：" prop="outboundWarehouseName">
                  {{ form.outboundWarehouseName }}
                </el-form-item>
                <el-form-item label="缺货单号：" prop="backOrderCode">
                  {{ form.backOrderCode }}
                </el-form-item>
                <el-form-item label="入库门店编码：" prop="inboundDealerCode">
                  {{ form.inboundDealerCode }}
                </el-form-item>
                <el-form-item label="入库门店名称：" prop="inboundDealerName">
                  {{ form.inboundDealerName }}
                </el-form-item>
                <el-form-item label="入库方联系人：" prop="inboundContactPerson">
                  {{ form.inboundContactPerson }}
                </el-form-item>
                <el-form-item label="入库方手机：" prop="inboundContactPhone">
                  {{ form.inboundContactPhone }}
                </el-form-item>
                <el-form-item label="物流商：" prop="logisticsProvider">
                  {{ form.logisticsProvider }}
                </el-form-item>
                <el-form-item label="物流单号：" prop="logisticsOrderNo">
                  {{ form.logisticsOrderNo }}
                </el-form-item>
                <el-form-item label="预计送达时间：" prop="expectedArrivalTime">
                  {{ form.expectedArrivalTime }}
                </el-form-item>
                <el-form-item label="预计揽收时间：" prop="expectedPickupTime">
                  {{ form.expectedPickupTime }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
                  <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" maxlength="500"
                    show-word-limit></el-input>
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header">
              <h2>出库信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="出库操作人：" prop="outboundOperatorName">
                  {{ form.outboundOperatorName }}
                </el-form-item>
                <el-form-item label="出库操作时间：" prop="outboundTime">
                  {{ form.outboundTime }}
                </el-form-item>
                <el-form-item label="出库状态：" prop="outboundStatus">
                  {{ form.outboundStatusLabel }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="!(isEditing || !_id)">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="共享调拨出库单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="出库门店编码：" prop="outboundDealerCode">
                  {{ form.outboundDealerCode }}
                </el-form-item>
                <el-form-item label="出库门店名称：" prop="outboundDealerName">
                  {{ form.outboundDealerName }}
                </el-form-item>
                <el-form-item label="出库方仓库：" prop="outboundWarehouseName">
                  {{ form.outboundWarehouseName }}
                </el-form-item>
                <el-form-item label="缺货单号：" prop="backOrderCode">
                  {{ form.backOrderCode }}
                </el-form-item>
                <el-form-item label="入库门店编码：" prop="inboundDealerCode">
                  {{ form.inboundDealerCode }}
                </el-form-item>
                <el-form-item label="入库门店名称：" prop="inboundDealerName">
                  {{ form.inboundDealerName }}
                </el-form-item>
                <el-form-item label="入库方联系人：" prop="inboundContactPerson">
                  {{ form.inboundContactPerson }}
                </el-form-item>
                <el-form-item label="入库方手机：" prop="inboundContactPhone">
                  {{ form.inboundContactPhone }}
                </el-form-item>
                <el-form-item label="物流商：" prop="logisticsProvider">
                  {{ form.logisticsProvider }}
                </el-form-item>
                <el-form-item label="物流单号：" prop="logisticsOrderNo">
                  {{ form.logisticsOrderNo }}
                </el-form-item>
                <el-form-item label="预计送达时间：" prop="expectedArrivalTime">
                  {{ form.expectedArrivalTime }}
                </el-form-item>
                <el-form-item label="预计揽收时间：" prop="expectedPickupTime">
                  {{ form.expectedPickupTime }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="!(isEditing || !_id)">
            <div class="common-section-header">
              <h2>出库信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="出库操作人：" prop="outboundOperatorName">
                  {{ form.outboundOperatorName }}
                </el-form-item>
                <el-form-item label="出库操作时间：" prop="outboundTime">
                  {{ form.outboundTime }}
                </el-form-item>
                <el-form-item label="出库状态：" prop="outboundStatus">
                  {{ form.outboundStatusLabel }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>调拨明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table ref="tableRef" stripe :data="tableData" show-overflow resizable border="inner" size="medium"
                  min-height="0" max-height="400px">
                  <vxe-column field="sparePartCode" title="备件编码" min-width="10%" />
                  <vxe-column field="sparePartName" title="备件名称" min-width="10%" />
                  <vxe-column field="locationName" title="库位" min-width="10%" />
                  <vxe-column field="availableQty" title="可用库存" min-width="10%" />
                  <vxe-column field="purchasePriceTax" title="采购价格(含税)" min-width="10%" />
                  <vxe-column field="purchasePriceNotax" title="采购价格(不含税)" min-width="10%" />
                  <vxe-column field="purchaseAmountTax" title="金额（含税）" min-width="10%" />
                  <vxe-column field="transferQty" title="调拨数量" min-width="10%">
                    <!-- <template #default="{ row }">
                      <el-input v-model="row.transferQty" type="number" min="1" @blur="handleBlur(row)"/>
                    </template> -->
                  </vxe-column>
                  <vxe-column field="remark" title="备注" min-width="10%">
                    <!-- <template #default="{ row }">
                      <el-input v-model="row.remark" @blur="handleBlur(row)"/>
                    </template> -->
                  </vxe-column>
                  <vxe-column field="createTime" title="创建时间" min-width="10%" />
                  <!-- <vxe-column title="操作" width="100" fixed="right" v-if="canDelete">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确定要删除吗？" confirm-button-text="删除" confirm-button-type="danger" @confirm="handleDeleteRow(rowIndex)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column> -->
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{ emptyText }}</div>
                  </template>
                </vxe-table>
                <div class="table-pagination">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                  >
                  </el-pagination>
                </div>
              </div>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>物流详情</h2>
            </div>
            <div class="common-section-body">
              <div v-if="loadingLogistics" class="loading">
                <el-loading-spinner></el-loading-spinner>
                正在加载物流信息...
              </div>
              <div v-else-if="!logisticsData" class="no-data">
                暂无物流信息
              </div>
              <div v-else class="logistics-container">
                <!-- 运单号和预计送达时间 -->
                <div class="logistics-header">
                  <span class="label">运单号：</span>
                  <span class="value">{{ logisticsData.waybillCode }}</span>
                  <span class="label">预计送达日期：</span>
                  <span class="value">{{ logisticsData.promiseAgingDate }}</span>
                </div>

                <!-- 物流节点 -->
                <el-timeline>
                  <el-timeline-item
                    v-for="(item, index) in logisticsData.traceDetails"
                    :key="index"
                    :timestamp="item.time"
                    :color="'#007fff'"
                    :type="'info'"
                  >
                    <div class="timeline-content">
                      <strong>{{ item.context }}</strong>
                    </div>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
      </div>
    </template>
    <!-- 发运弹窗 -->
    <ShipmentDialog
      :visible="shipmentDialogVisible"
      :id="shipmentId"
      @update:visible="val => shipmentDialogVisible = val"
      @success="handleRefresh"
    />
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, sharedTransferOutboundDetailPage } from '@/api/sparepart/transfer/sharedTransferOutbound/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, getLogistics } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import ShipmentDialog from './ShipmentDialog.vue';

const defaultForm = {
  code: '',
  outboundDealerCode: '',
  outboundDealerName: '',
  outboundWarehouseId: '',
  inboundDealerCode: '',
  inboundDealerName: '',
  inboundContactPerson: '',
  inboundContactPhone: '',
  outboundStatus: '',
  remark: '',
  createTime: '',
  updateTime: '',
  expectedArrivalTime: '',
  expectedPickupTime: '',
  outboundTime: '',
};

export default {
  name: 'sharedTransferOutboundEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    ShipmentDialog
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '共享调拨出库单号：' + this.form.code;
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    },
    'form.code': {
      handler (val) {
        if (val) {
          this.getLogisticsInfo();
          this.getData();
        }
      }
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '共享备件调拨出库',
      pageType: 'edit',
      moduleKey: 'AISPART-sharedTransferOutbound',
      loading: false,
      submitLoading: false,
      loadingLogistics: false, // 物流信息加载状态
      logisticsData: null, // 物流信息
      pageNum: 1,
      pageSize: 10,
      total: 0,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [],
      rules: {},
      shipmentDialogVisible: false, // 发运弹窗
      shipmentId: '',
    };
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    openPane () {
      this.$refs.editLayout.openPane();
    },
    queryListData (queryString) {
      return new Promise(resolve => {
        resolve([]);
      });
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 获取调拨明细
    async getData () {
      const params = {
        sharedTransferOutboundId: this._id,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await sharedTransferOutboundDetailPage(params);
      this.total = res.total || 0;
      this.tableData = res.records || [];
    },
    handleCurrentChange (pageNum) {
      this.pageNum = pageNum;
      this.getData();
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.pageNum = 1;
      this.getData();
    },
    // 物流信息接口
    async getLogisticsInfo () {
      if (!this.form.logisticsOrderNo) {
        return;
      }
      this.loadingLogistics = true;
      const params = {
        waybillCode: this.form.logisticsOrderNo,
        logisticsType: this.form.logisticsProvider,
      };
      try {
        const res = await getLogistics(params);
        this.logisticsData = res;
      } catch (error) {
        console.error('获取物流信息失败:', error);
      } finally {
        this.loadingLogistics = false;
      }
    },
    // 刷新接口
    handleRefresh () {
      this.$refs.containerRef.loadDetail();
      this.getData();
    },
    // 打印备件调拨出库单
    handlePrint () {
      this.$print.show({
        id: this._id, // 必选，对应数据id
        template: 'SharedTransferOutbound', // 必选，对应 ./template/文件名.vue
        title: `${this.form.dealerName}厅店共享备件调拨出库单`// 可选，打印标题
      });
    },
    // 发运
    handleShipment () {
      this.shipmentId = this._id;
      this.shipmentDialogVisible = true;
    },
  }
};
</script>
<style lang="scss" scoped>

.logistics-container {
  margin-top: 16px;
}

.logistics-header {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 14px;
}

.label {
  font-weight: bold;
  color: #333;
}

.value {
  color: #666;
}

.timeline-content {
  strong {
    display: block;
    margin-bottom: 4px;
  }
  p {
    font-size: 12px;
    color: #999;
  }
}

</style>
