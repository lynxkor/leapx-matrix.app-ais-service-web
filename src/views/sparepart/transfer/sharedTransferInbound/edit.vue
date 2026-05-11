<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #extraButtons>
          <el-button v-if="_id && form.signStatus === '0' && permissions.has('AISPART-sharedTransferInbound-print')" :loading="actionLoading" plain size="small" @click="handleSign">签收</el-button>
          <el-button v-if="_id" type="primary" size="small" @click="handlePrint">打印</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整 label-width="150px"，使得 label 不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="共享调拨入库单号：" prop="code">
                  <el-input v-model="form.code" placeholder="请输入共享调拨入库单号" disabled></el-input>
                </el-form-item>
                <el-form-item label="入库门店编码：" prop="inboundDealerCode">
                  <el-input v-model="form.inboundDealerCode" placeholder="请输入入库门店编码" disabled></el-input>
                </el-form-item>
                <el-form-item label="入库门店名称：" prop="inboundDealerName">
                  <el-input v-model="form.inboundDealerName" placeholder="请输入入库门店名称" disabled></el-input>
                </el-form-item>
                <el-form-item label="入库仓库：" prop="inboundWarehouseName">
                  <el-input v-model="form.inboundWarehouseName" placeholder="请输入入库仓库" disabled></el-input>
                </el-form-item>
                <el-form-item label="出库门店编码：" prop="outboundDealerCode">
                  <el-input v-model="form.outboundDealerCode" placeholder="请输入出库门店编码" disabled></el-input>
                </el-form-item>
                <el-form-item label="出库门店名称：" prop="outboundDealerName">
                  <el-input v-model="form.outboundDealerName" placeholder="请输入出库门店名称" disabled></el-input>
                </el-form-item>
                <el-form-item label="签收状态：" prop="signStatus">
                  <el-input v-model="form.signStatusLabel" placeholder="请输入签收状态" disabled></el-input>
                </el-form-item>
                <el-form-item label="签收人：" prop="signUserName">
                  <el-input v-model="form.signUserName" placeholder="请输入签收人" disabled></el-input>
                </el-form-item>
                <el-form-item label="签收时间：" prop="signTime">
                  <el-input v-model="form.signTime" placeholder="请输入签收时间" disabled></el-input>
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%">
                  <el-input v-model="form.remark" placeholder="请输入备注" type="textarea" :rows="3" maxlength="500" show-word-limit></el-input>
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="共享调拨入库单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="入库门店编码：" prop="inboundDealerCode">
                  {{ form.inboundDealerCode }}
                </el-form-item>
                <el-form-item label="入库门店名称：" prop="inboundDealerName">
                  {{ form.inboundDealerName }}
                </el-form-item>
                <el-form-item label="入库仓库：" prop="inboundWarehouseName">
                  {{ form.inboundWarehouseName }}
                </el-form-item>
                <el-form-item label="出库门店编码：" prop="outboundDealerCode">
                  {{ form.outboundDealerCode }}
                </el-form-item>
                <el-form-item label="出库门店名称：" prop="outboundDealerName">
                  {{ form.outboundDealerName }}
                </el-form-item>
                <el-form-item label="签收状态：" prop="signStatus">
                  {{ form.signStatusLabel }}
                </el-form-item>
                <el-form-item label="签收人：" prop="signUserName">
                  {{ form.signUserName }}
                </el-form-item>
                <el-form-item label="签收时间：" prop="signTime">
                  {{ form.signTime }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%">
                  {{ form.remark }}
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
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, sharedTransferInboundDetailPage, getSign } from '@/api/sparepart/transfer/sharedTransferInbound/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, getLogistics } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  sharedTransferOutboundId: '',
  inboundDealerCode: '',
  inboundDealerName: '',
  inboundWarehouseId: '',
  outboundDealerCode: '',
  outboundDealerName: '',
  signStatus: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  remark: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  shareIs: '',
  sharedTransferOutboundCode: '',
  inboundOwnerOrgId: '',
  outboundOwnerOrgId: '',
  signUser: '',
  signUserName: '',
  signTime: '',
};

export default {
  name: 'sharedTransferInboundEdit',
  // 集中视图预留
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
      return '共享调拨入库单号：' + this.form.code;
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
      pageTitle: '共享备件调拨入库',
      pageType: 'edit',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-sharedTransferInbound',
      loading: false,
      submitLoading: false,
      actionLoading: false, // 操作加载状态
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      pageNum: 1,
      pageSize: 10,
      total: 0,
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      rules: {
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
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
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 删除子表数据
    handleDeleteRow (index) {
      const item = this.tableData[index];
      this.tableData.splice(index, 1);
      // 根据需求调用接口
      // deletePartVehModel([item.id]).then(res => {
      //   this.$message.success('删除成功');
      //   this.tableData.splice(index, 1);
      // });
    },
    // 查询新增项的列表
    queryListData (queryString) {
      return new Promise(resolve => {
        // 根据需求调用接口
        // sparePartList({ partCodeOrNameLike: queryString, status: 1, limitSize: 20 }).then(res => {
        //   const list = res || [];
        //   resolve(list);
        // });
        resolve([
          { id: 1, name: 'test', age: 25, email: 'test@example.com' }
        ]);
      });
    },
    // 新增子表数据
    handleAddTableData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      // 检查是否已存在
      const exists = this.tableData.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      // 根据需求调用接口
      this.tableData.push(record);
      // addPartItem({
      //   maintenancePartId: this._id,
      //   partsCode: record.partCode,
      //   partsName: record.partName,
      //   partsId: record.id,
      // }).then(res => {
      //   this.$message.success('添加成功');
      //   this.detailRequest();
      // });
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
    // 获取调拨明细
    async getData () {
      const params = {
        sharedTransferInboundId: this._id,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await sharedTransferInboundDetailPage(params);
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
    // 打印备件调拨入库单
    handlePrint () {
      this.$print.show({
        id: this._id, // 必选，对应数据id
        template: 'SharedTransferReceipt', // 必选，对应 ./template/文件名.vue
        title: `${this.form.dealerName}厅店共享备件调拨入库单`// 可选，打印标题
      });
    },
    // 签收
    async handleSign () {
      this.actionLoading = true;
      const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>确定签收吗?</div>';
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'ais-leave-tips',
        showClose: false
      }).then(async () => {
        // 调用接口
        await getSign({ id: this._id });
        this.$message({
          type: 'success',
          message: '签收成功!'
        });
        this.actionLoading = false;
        this.$refs.containerRef.loadDetail();
        this.getLogisticsInfo();
        this.getData();
      }).catch(() => {
        this.actionLoading = false;
      });
    },
  }
};
</script>
