<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container ref="containerRef" :id="_id" :title="title" :isEditing.sync="isEditing" :form.sync="form"
        :originalForm.sync="originalForm" :submitRequest="submitRequest" :detailRequest="detailRequest"
        :showEditBtn="orderStatusType">
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <el-button v-if="form.orderStatus === '10' && permissions.has('AISPART-dealerReturnOrder-agree')" plain size="small" :loading="actionLoading" @click="handleAgree">通过</el-button>
          <el-button v-if="form.orderStatus === '10' && permissions.has('AISPART-dealerReturnOrder-cancel')" plain size="small" :loading="actionLoading" @click="handleCancel">作废</el-button>
          <el-button v-if="form.orderStatus === '20' && form.outboundStatus === '10' && permissions.has('AISPART-dealerReturnOrder-outbound')" plain size="small" :loading="actionLoading" @click="handleOutbound">出库</el-button>
          <el-button v-if="permissions.has('AISPART-dealerReturnOrder-outbound')" type="primary" size="small" @click="handlePrint">打印出库单</el-button>
        </template>
        <el-main>
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="外购退货单号：" prop="code">
                  <el-input v-model="form.code" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="备件仓库：" prop="warehouseId">
                  <el-input v-model="form.warehouseName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="订单状态：" prop="orderStatus">
                  <el-input v-model="form.orderStatusLabel" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="外购件入库单：" prop="dealerInboundOrderCode">
                  <el-input v-model="form.dealerInboundOrderCode" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="供应商名称：" prop="supplierInfoId">
                  <el-input v-model="form.supplierName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-input v-model="form.dealerName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
                  <el-input placeholder="请输入" v-model="form.remark" type="textarea" clearable maxLength="500" show-word-limit />
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header">
              <h2>审批信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="提交人：" prop="submitterName">
                  <el-input v-model="form.submitterName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  <el-input v-model="form.submitTime" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="退货说明：" prop="returnDescription">
                  <el-input v-model="form.returnDescription" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="审批人：" prop="approverName">
                  <el-input v-model="form.approverName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="审批时间：" prop="approvalTime">
                  <el-input v-model="form.approvalTime" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="审批说明：" prop="approvalDescription">
                  <el-input v-model="form.approvalDescription" placeholder="请输入" disabled />
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header">
              <h2>出库信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="出库状态：" prop="outboundStatus">
                  <el-input v-model="form.outboundStatusLabel" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="出库操作人：" prop="outboundOperatorName">
                  <el-input v-model="form.outboundOperatorName" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="出库总金额：" prop="totalAmount">
                  <el-input v-model="form.totalAmount" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="出库时间：" prop="outboundTime">
                  <el-input v-model="form.outboundTime" placeholder="请输入" disabled />
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
                <el-form-item label="外购退货单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="备件仓库：" prop="warehouseId">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="订单状态：" prop="orderStatus">
                  {{ form.orderStatusLabel }}
                </el-form-item>
                <el-form-item label="外购件入库单：" prop="dealerInboundOrderCode">
                  {{ form.dealerInboundOrderCode }}
                </el-form-item>
                <el-form-item label="供应商名称：" prop="supplierInfoId">
                  {{ form.supplierName }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-show="!(isEditing || !_id)">
            <div class="common-section-header">
              <h2>审批信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="提交人：" prop="submitterName">
                  {{ form.submitterName }}
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  {{ form.submitTime }}
                </el-form-item>
                <el-form-item label="退货说明：" prop="returnDescription">
                  {{ form.returnDescription }}
                </el-form-item>
                <el-form-item label="审批人：" prop="approverName">
                  {{ form.approverName }}
                </el-form-item>
                <el-form-item label="审批时间：" prop="approvalTime">
                  {{ form.approvalTime }}
                </el-form-item>
                <el-form-item label="审批说明：" prop="approvalDescription">
                  {{ form.approvalDescription }}
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
                <el-form-item label="出库状态：" prop="outboundStatus">
                  {{ form.outboundStatusLabel }}
                </el-form-item>
                <el-form-item label="出库操作人：" prop="outboundOperatorName">
                  {{ form.outboundOperatorName }}
                </el-form-item>
                <el-form-item label="出库总金额：" prop="totalAmount">
                  {{ form.totalAmount }}
                </el-form-item>
                <el-form-item label="出库时间：" prop="outboundTime">
                  {{ form.outboundTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>备件清单</h2>
            </div>
            <div class="common-section-body">
              <!-- <div class="common-section-header">
                <div class="ais-select-group">
                  <fetch-select style="width: 300px;" :remote-method="queryListData" remote placeholder="请选择" clearable
                    value-key="id" label-key="name" @change="handleAddTableData" />
                  <el-button type="primary" size="small">添加</el-button>
                </div>
              </div> -->
              <div class="common-section-table">
                <vxe-table ref="tableRef" stripe :data="tableData" show-overflow resizable border="inner" size="medium"
                  min-height="0" max-height="400px">
                  <vxe-column field="sparePartCode" title="备件编码" min-width="10%" />
                  <vxe-column field="sparePartName" title="备件名称" min-width="10%" />
                  <vxe-column field="locationName" title="库位编码" min-width="10%" />
                  <vxe-column field="availableQty" title="可用库存" min-width="10%" />
                  <vxe-column field="unitPrice" title="单价" min-width="10%" />
                  <vxe-column field="outboundQty" title="出库数量" min-width="10%" />
                  <vxe-column field="outboundAmount" title="出库金额" min-width="10%" />
                  <vxe-column field="createTime" title="创建时间" min-width="10%" />
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
import { getDetail, addOrUpdate, dealerReturnOrderDetailPage, dealerReturnOrderAgree, dealerReturnOrderCancel, dealerReturnOrderOutbound } from '@/api/sparepart/outbound/dealerReturnOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { handleCommonAction } from '@/libs/utils/index';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  dealerInboundOrderId: '',
  dealerInboundOrderCode: '',
  ownerOrgId: '',
  dealerCode: '',
  dealerName: '',
  warehouseId: '',
  supplierInfoId: '',
  outboundStatus: '',
  totalAmount: '',
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
  returnDescription: '',
  submitter: '',
  submitterName: '',
  submitTime: '',
  approver: '',
  approverName: '',
  approvalTime: '',
  approvalDescription: '',
  outboundOperator: '',
  outboundOperatorName: '',
  outboundTime: '',
  orderStatus: '',
};

export default {
  name: 'dealerReturnOrderEdit',
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
      return '外购件退货单号：' + this.form.code;
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
          this.getData();
          if (this.form.orderStatus === '10') {
            this.orderStatusType = true;
          }
        }
      },
      immediate: true
    },
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '外购件退货单',
      pageType: 'edit',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-dealerReturnOrder',
      loading: false,
      submitLoading: false,
      orderStatusType: false, // 是否可编辑
      actionLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      pageNum: 1,
      pageSize: 10,
      total: 0,
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      rules: {
        warehouseId: [
          { required: false, message: '请输入备件仓库', trigger: 'change' }
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
    // 获取备件清单
    async getData () {
      const params = {
        dealerReturnOrderId: this._id,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await dealerReturnOrderDetailPage(params);
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
    // 刷新详情所有数据
    handleRefresh () {
      this.$refs.containerRef.loadDetail();
      this.getData();
    },
    // 打印外购件退货单
    handlePrint () {
      this.$print.show({
        id: this._id, // 必选，对应数据id
        template: 'ReturnOrderPurchased', // 必选，对应 ./template/文件名.vue
        title: `${this.form.dealerName}厅店外购件退货单`// 可选，打印标题
      });
    },
    // 执行通用操作
    _handleAction (apiFn, config) {
      this.actionLoading = true;
      handleCommonAction({
        $confirm: this.$confirm,
        $message: this.$message,
        apiFn,
        id: this._id,
        config,
        onSuccess: () => {
          this.actionLoading = false;
          this.handleRefresh();
        },
        onComplete: () => {
          this.actionLoading = false;
        }
      });
    },
    // 通过
    async handleAgree () {
      await this._handleAction(dealerReturnOrderAgree, { title: '此操作将通过订单, 是否继续?', success: '通过成功' });
    },
    // 作废
    async handleCancel () {
      this.actionLoading = true;
      this.$prompt('请输入审批原因！', '作废', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/, // 校验非空
        inputErrorMessage: '请输入备注',
      }).then(({ value }) => {
        // 调用 API，并传入用户输入的备注
        return dealerReturnOrderCancel({ id: this._id, description: value });
      }).then(() => {
        // 提示成功
        this.$message.success('作废成功');
        // 执行额外回调（比如刷新列表）
        this.handleRefresh();
        this.actionLoading = false;
      }).catch(() => {
        // 用户取消或校验失败，静默处理
        this.actionLoading = false;
      });
    },
    // 出库
    async handleOutbound () {
      await this._handleAction(dealerReturnOrderOutbound, { title: '此操作将出库订单, 是否继续?', success: '出库成功' });
    },
  }
};
</script>
<style lang="scss" scoped>
.table-pagination {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}
</style>
