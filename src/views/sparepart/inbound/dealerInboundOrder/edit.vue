<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container ref="containerRef" :id="_id" :title="title" :isEditing.sync="isEditing" :form.sync="form"
        :originalForm.sync="originalForm" :submitRequest="submitRequest" :detailRequest="detailRequest" :showEditBtn="orderStatusType">
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
        </template>
        <el-main>
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="外购入库单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="备件仓库：" prop="warehouseId">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="供应商名称：">
                  <fetch-select :remote-method="getSupplierList" remote v-model="form.supplierInfoId"
                    placeholder="请输入供应商编码或名称" labelKey="name" valueKey="id" subLabelKey="code" clearable collapseTags
                    filterable />
                </el-form-item>
                <el-form-item label="订单状态：" prop="orderStatus">
                  {{ form.orderStatusLabel }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%">
                  <el-input placeholder="请输入" v-model="form.remark" clearable type="textarea" maxLength="500" show-word-limit />
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
                  {{ form.submitterName }}
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  {{ form.submitTime }}
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
          <section class="common-section" v-show="isEditing || !_id">
            <div class="common-section-header">
              <h2>入库信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit">
                <el-form-item label="入库操作人：" prop="inboundOperatorName">
                  {{ form.inboundOperatorName }}
                </el-form-item>
                <el-form-item label="入库状态：" prop="inboundStatus">
                  {{ form.inboundStatusLabel }}
                </el-form-item>
                <el-form-item label="入库总金额：" prop="totalAmount">
                  {{ form.totalAmount }}
                </el-form-item>
                <el-form-item label="入库时间：" prop="inboundTime">
                  {{ form.inboundTime }}
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
                <el-form-item label="外购入库单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="备件仓库：" prop="warehouseId">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="供应商名称：" prop="supplierInfoId">
                  {{ form.supplierInfoName }}
                </el-form-item>
                <el-form-item label="订单状态：" prop="orderStatus">
                  {{ form.orderStatusLabel }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%">
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
              <h2>入库信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
                <el-form-item label="入库操作人：" prop="inboundOperatorName">
                  {{ form.inboundOperatorName }}
                </el-form-item>
                <el-form-item label="入库状态：" prop="inboundStatus">
                  {{ form.inboundStatusLabel }}
                </el-form-item>
                <el-form-item label="入库总金额：" prop="totalAmount">
                  {{ form.totalAmount }}
                </el-form-item>
                <el-form-item label="入库时间：" prop="inboundTime">
                  {{ form.inboundTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>备件清单</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <div class="ais-select-group">
                  <fetch-select style="width: 300px;" :remote-method="queryListData" remote placeholder="请选择" clearable
                    value-key="id" label-key="name" @change="handleAddTableData" />
                  <el-button type="primary" size="small">添加</el-button>
                </div>
              </div>
              <div class="common-section-table">
                <vxe-table ref="tableRef" stripe :data="tableData" show-overflow resizable border="inner" size="medium"
                  min-height="0" max-height="400px">
                  <vxe-column field="partCode" title="备件编码" min-width="10%" />
                  <vxe-column field="partName" title="备件名称" min-width="10%" />
                  <vxe-column field="locationCode" title="库位编码" min-width="10%" />
                  <vxe-column field="availableQuantity" title="可用库存" min-width="10%" />
                  <vxe-column field="returnableQuantity" title="可退数量" min-width="10%" />
                  <vxe-column field="purchaseUnitPrice" title="采购单价" min-width="10%" />
                  <vxe-column field="inboundQty" title="入库数量" min-width="10%">
                    <template #default="{ row }">
                      <el-input v-model="row.inboundQuantity" type="number" min="1" />
                    </template>
                  </vxe-column>
                  <vxe-column field="inboundAmount" title="入库金额" min-width="10%" />
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
import { getDetail, addOrUpdate, dealerInboundOrderDetailPage } from '@/api/sparepart/inbound/dealerInboundOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, getSupplierInfo, getLoginUser, getPartDealer, sparePartList } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  dealerCode: '',
  dealerName: '',
  warehouseId: '',
  supplierInfoId: '',
  orderStatus: '',
  inboundStatus: '',
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
  ownerOrgId: '',
  submitter: '',
  submitterName: '',
  submitTime: '',
  approver: '',
  approverName: '',
  approvalTime: '',
  approvalDescription: '',
  inboundOperator: '',
  inboundOperatorName: '',
  inboundTime: '',
  warehouseName: '',
};

export default {
  name: 'dealerInboundOrderEdit',
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
    EditBaseContainer,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '外购入库单号，开头OPO：' + this.form.code;
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
          if (this.form.orderStatus === '10' || this.form.orderStatus === '40') {
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
      pageTitle: '外购件入库单',
      pageType: 'edit',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-dealerInboundOrder',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '暂无数据',
      orderStatusType: false, // 订单状态 是否可编辑
      pageNum: 1,
      pageSize: 10,
      total: 0,
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      rules: {
        code: [
          { required: false, message: '请输入外购入库单号', trigger: 'change' }
        ],
        dealerCode: [
          { required: false, message: '请输入门店编码', trigger: 'change' }
        ],
        dealerName: [
          { required: false, message: '请输入门店名称', trigger: 'change' }
        ],
        warehouseId: [
          { required: true, message: '请输入备件仓库', trigger: 'change' }
        ],
        supplierInfoId: [
          { required: false, message: '请输入供应商', trigger: 'change' }
        ]
      },
    };
  },
  mounted () {
    this.getLoginUser();
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
    async getSupplierList (query) {
      try {
        const res = await getSupplierInfo({ supplierCodeOrNameLike: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    // 获取备件清单
    async getData () {
      const params = {
        dealerInboundOrderId: this._id,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await dealerInboundOrderDetailPage(params);
      this.total = res.total || 0;
      this.tableData = res.records || [];
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
        // sparePartList({ partCodeOrNameLike: queryString, status: 1, oemPart: 1, }).then(res => {
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
    // 查询账号信息
    async getLoginUser () {
      try {
        const res = await getLoginUser();
        this.form.dealerCode = res.currentDealerCode;
        this.form.dealerName = res.currentDealerName;
        this.accountPermissions = res.accountFlag;
        if (this.form.dealerCode) {
          this.getPartDealer(this.form.dealerCode);
        }
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    // 获取门店信息
    async getPartDealer (query) {
      try {
        const res = await getPartDealer({ code: query });
        this.form.companyCode = res.parentCompanyCode;
        this.form.companyName = res.parentCompanyName;
        this.form.warehouseId = res.warehouseId;
        this.form.warehouseCode = res.warehouseCode;
        this.form.warehouseName = res.warehouseName;
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
    handleCurrentChange (pageNum) {
      this.pageNum = pageNum;
      this.getData();
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.pageNum = 1;
      this.getData();
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
