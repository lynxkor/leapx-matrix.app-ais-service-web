<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <edit-base-container ref="containerRef" :id="_id" :title="title" :isEditing.sync="isEditing" :form.sync="form"
        :originalForm.sync="originalForm" :submitRequest="submitRequest" :detailRequest="detailRequest">
        <template #status>
          <span v-if="form.status" class="status primary">{{ form.status }}</span>
        </template>
        <template #extraButtons>
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
                  <vxe-column field="partCode" title="备件编码" min-width="10%" />
                  <vxe-column field="partName" title="备件名称" min-width="10%" />
                  <vxe-column field="locationCode" title="库位" min-width="10%" />
                  <vxe-column field="availableQuantity" title="可用库存" min-width="10%" />
                  <vxe-column field="purchasePriceTax" title="采购价格(含税)" min-width="10%" />
                  <vxe-column field="purchasePriceNotax" title="采购价格(不含税)" min-width="10%" />
                  <vxe-column field="costUnitPriceTax" title="金额(含税)" min-width="10%" />
                  <vxe-column field="inboundQty" title="调拨数量" min-width="10%">
                    <template #default="{ row }">
                      <el-input v-model="row.transferQty" type="number" min="1" @blur="handleBlur(row)"/>
                    </template>
                  </vxe-column>
                  <vxe-column field="inboundQty" title="备注" min-width="10%">
                    <template #default="{ row }">
                      <el-input v-model="row.remark" @blur="handleBlur(row)"/>
                    </template>
                  </vxe-column>
                  <vxe-column field="createTime" title="创建时间" min-width="10%" />
                  <vxe-column title="操作" width="100" fixed="right" v-if="canDelete">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确定要删除吗？" confirm-button-text="删除" confirm-button-type="danger" @confirm="handleDeleteRow(rowIndex)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
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
                  <span class="value">{{ logisticsData.waybillNo }}</span>
                  <span class="label">预计送达日期：</span>
                  <span class="value">{{ logisticsData.estimatedArrivalTime }}</span>
                </div>

                <!-- 物流节点 -->
                <el-timeline>
                  <el-timeline-item
                    v-for="(item, index) in logisticsData.trackingList"
                    :key="index"
                    :timestamp="item.time"
                    :color="item.status === 'completed' ? '#007fff' : '#999'"
                    :type="item.status === 'completed' ? 'primary' : 'info'"
                    :size="item.status === 'completed' ? 'large' : 'normal'"
                  >
                    <div class="timeline-content">
                      <strong>{{ item.description }}</strong>
                      <p v-if="item.phone">{{ item.phone }}</p>
                      <p v-if="item.plateNumber">{{ item.plateNumber }}</p>
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
    EditBaseContainer
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
      rules: {}
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
      this.loadingLogistics = true;
      try {
        // const res = await getLogisticsInfo(this._id); // 假设接口为 getLogisticsInfo
        // this.logisticsData = res.data;
        this.logisticsData = {
          waybillNo: 'JDV23178368877',
          estimatedArrivalTime: '2025-09-30 23:59:59',
          trackingList: [
            {
              time: '2025-09-30 17:46:54',
              description: '您的快件已送达，感谢您使用京东物流，期待再次为您服务。',
              status: 'completed'
            },
            {
              time: '2025-09-30 17:46:30',
              description: '司机已到达目的城市-天津 西青区，请您准备签收，司机电话：15957537605，车牌号：浙G98571',
              status: 'completed'
            },
            {
              time: '2025-09-27 21:19:14',
              description: '司机正在装车中，请耐心等待',
              status: 'pending'
            },
            {
              time: '2025-09-27 21:14:13',
              description: '京东快递已收取快件',
              status: 'completed'
            }
          ]
        };
      } catch (error) {
        console.error('获取物流信息失败:', error);
      } finally {
        this.loadingLogistics = false;
      }
    }
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
