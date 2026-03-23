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
        <template #status>
          <!-- 支持 primary,warning,success,danger 等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮 1</el-button>
          <el-button size="small">按钮 2</el-button> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整 label-width="150px"，使得 label 不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="索赔追溯单号：" prop="claimTraceCode">
                  <el-input
                    placeholder="系统自动生成"
                    v-model="form.claimTraceCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="追溯状态：" prop="traceStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="claim_trace_status"
                    v-model="form.traceStatus"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerCode">
                    <dealer-select v-model="form.dealerCode" :disabled="!canEditOtherFields" />
                  </el-form-item>
                  <el-form-item label="门店编码：" prop="dealerCode">
                    <el-input v-model="form.dealerCode" disabled />
                  </el-form-item>
                <el-form-item label="保修申请单：" prop="warrantyCode">
                  <list-select
                    listUrl="claimreturn/claim/web/warrantyapply/warrantyApply/selectableList"
                    placeholder="请输入保修申请单"
                    v-model="form.warrantyCode"
                    :disabled="Boolean(_id)"
                    query-key="applyNo"
                    filterable
                    clearable
                    label-key="applyNo"
                    value-key="applyNo"
                    @change="handleWarrantyApplyChange"
                    :params="{}" />
                </el-form-item>
                <el-form-item label="追溯说明：" prop="traceDesc">
                  <el-input
                    placeholder="请输入"
                    v-model="form.traceDesc"
                    clearable
                    type="textarea"
                    :rows="2"
                    :disabled="!canEditOtherFields"
                  />
                </el-form-item>
                <el-form-item label="VIN：" prop="vin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vin"
                    clearable
                    :disabled="!canEditOtherFields"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                    type="textarea"
                    :rows="2"
                    :disabled="!canEditRemark"
                  />
                </el-form-item>
              </el-form>
              <!-- 详情页：基础信息 -->
              <el-form :inline="true" class="form-detail" v-show="!isEditing && _id">
                <el-form-item label="索赔追溯单号：" prop="claimTraceCode">
                  {{ form.claimTraceCode }}
                </el-form-item>
                <el-form-item label="追溯状态：" prop="traceStatus">
                  {{ form.traceStatus }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="保修申请单：" prop="warrantyCode">
                  {{ form.warrantyCode }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="首次下发时间：" prop="firstIssueTime">
                  {{ form.firstIssueTime }}
                </el-form-item>
                <el-form-item label="追溯说明：" prop="traceDesc">
                  {{ form.traceDesc }}
                </el-form-item>
                <el-form-item label="VIN：" prop="vin">
                  {{ form.vin }}
                </el-form-item>
                <el-form-item label="最新下发时间：" prop="latestIssueTime">
                  {{ form.latestIssueTime }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="系统自动同意时间：" prop="sysAutoAgreeDate">
                  {{ form.sysAutoAgreeDate }}
                </el-form-item>
                <el-form-item label="审核人：" prop="auditor">
                  {{ form.auditor }}
                </el-form-item>
                <el-form-item label="审核意见：" prop="auditOpinion">
                  {{ form.auditOpinion }}
                </el-form-item>
              </el-form>
              <!-- 详情页：处理信息 -->
              <el-form :inline="true" class="form-detail" v-show="!isEditing && _id">
                <el-form-item label="门店处理意见：" prop="dealerProcessOpinion">
                  {{ form.dealerProcessOpinion }}
                </el-form-item>
                <el-form-item label="同意追溯时间：" prop="agreeTraceTime">
                  {{ form.agreeTraceTime }}
                </el-form-item>
                <el-form-item label="追溯金调整人：" prop="traceAmountAdjuster">
                  {{ form.traceAmountAdjuster }}
                </el-form-item>
                <el-form-item label="申诉审核意见：" prop="appealAuditOpinion">
                  {{ form.appealAuditOpinion }}
                </el-form-item>
                <el-form-item label="计划追溯金额：" prop="planTraceAmount">
                  {{ form.planTraceAmount }}
                </el-form-item>
                <el-form-item label="追溯金额调整原因：" prop="traceAmountAdjustReason">
                  {{ form.traceAmountAdjustReason }}
                </el-form-item>
                <el-form-item label="保修工时金额：" prop="warrantyLaborAmount">
                  {{ form.warrantyLaborAmount }}
                </el-form-item>
                <el-form-item label="已追溯金额：" prop="tracedAmount">
                  {{ form.tracedAmount }}
                </el-form-item>
                <el-form-item label="作废人：" prop="canceller">
                  {{ form.canceller }}
                </el-form-item>
                <el-form-item label="保修零件金额：" prop="warrantyPartAmount">
                  {{ form.warrantyPartAmount }}
                </el-form-item>
                <el-form-item label="未追溯金额：" prop="unTraceAmount">
                  {{ form.unTraceAmount }}
                </el-form-item>
                <el-form-item label="保修工时金额：" prop="laborClaimTotal">
                  {{ form.laborClaimTotal }}
                </el-form-item>
                <el-form-item label="保修备件金额：" prop="partsClaimTotal">
                  {{ form.partsClaimTotal }}
                </el-form-item>
                <el-form-item label="保修其他金额：" prop="otherClaimTotal">
                  {{ form.otherClaimTotal }}
                </el-form-item>
                <el-form-item label="作废说明：" prop="cancelDesc">
                  {{ form.cancelDesc }}
                </el-form-item>
                <el-form-item label="保修其他金额：" prop="warrantyOtherAmount">
                  {{ form.warrantyOtherAmount }}
                </el-form-item>
                <el-form-item label="作废时间：" prop="cancelTime">
                  {{ form.cancelTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>子表标题</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <div class="ais-select-group">
                  <fetch-select
                    style="width: 300px;"
                    :remote-method="queryListData"
                    remote
                    placeholder="请选择"
                    clearable
                    value-key="id"
                    label-key="name"
                    @change="handleAddTableData"
                  />
                  <el-button type="primary" size="small">添加</el-button>
                </div>
              </div>
              <div class="common-section-table">
                <vxe-table
                  ref="tableRef"
                  stripe
                  :data="tableData"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="name" title="名称" min-width="30%" />
                  <vxe-column field="age" title="年龄" min-width="30%" />
                  <vxe-column field="email" title="邮箱" min-width="30%" />
                  <vxe-column title="操作" width="100" v-if="canDelete">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确定要删除吗？" @confirm="handleDeleteRow(rowIndex)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{emptyText}}</div>
                  </template>
                </vxe-table>
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
import { getDetail, addOrUpdate } from '@/api/claimreturn/claim/claimtrace/claimTraceOrder/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listOrgStoreInfo } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import FetchSelect from '@/libs/components/FetchSelect';
import DealerSelect from '@/components/dealer-select/index.vue';
import ListSelect from '@/libs/components/list-select/index.vue';
const defaultForm = {
  claimTraceCode: '', // 索赔追溯单号
  traceStatus: '10', // 追溯状态：10=草稿
  dealerCode: '', // 门店编码
  warrantyId: '', // 保修申请单ID
  warrantyCode: '', // 保修申请单
  dealerName: '', // 门店名称
  traceDesc: '', // 追溯说明
  vin: '', // VIN
  remark: '', // 备注
  // 详情页基础信息字段
  firstIssueTime: '', // 首次下发时间
  latestIssueTime: '', // 最新下发时间
  sysAutoAgreeDate: '', // 系统自动同意时间
  auditor: '', // 审核人
  auditOpinion: '', // 审核意见
  // 详情页处理信息字段
  dealerProcessOpinion: '', // 门店处理意见
  agreeTraceTime: '', // 同意追溯时间
  traceAmountAdjuster: '', // 追溯金调整人
  appealAuditOpinion: '', // 申诉审核意见
  planTraceAmount: '', // 计划追溯金额
  traceAmountAdjustReason: '', // 追溯金额调整原因
  warrantyLaborAmount: '', // 保修工时金额
  tracedAmount: '', // 已追溯金额
  canceller: '', // 作废人
  warrantyPartAmount: '', // 保修零件金额
  unTraceAmount: '', // 未追溯金额
  cancelDesc: '', // 作废说明
  warrantyOtherAmount: '', // 保修其他金额
  cancelTime: '', // 作废时间
};

export default {
  name: 'claimTraceOrderEdit',
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
    FetchSelect,
    DealerSelect,
    ListSelect,
    EditBaseContainer
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '索赔追溯单号：' + this.form.claimTraceCode;
    },
    // 其他字段是否可编辑：仅新增时可编辑
    canEditOtherFields () {
      return !this._id;
    },
    // 备注是否可编辑：草稿、审核中、已驳回可以修改
    canEditRemark () {
      // 编辑模式下且有 ID 时，根据追溯状态判断
      if (this._id && this.isEditing) {
        const editableStatus = ['10', '20', '30']; // 10=草稿，20=审核中，30=已驳回
        return editableStatus.includes(this.form.traceStatus);
      }
      // 新增模式或查看模式，保持可编辑或只读
      return !this._id;
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
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '索赔追溯单',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-claimTraceOrder',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      rules: {
        dealerCode: [
          { required: true, message: '请输入门店编码或名称', trigger: 'change' }
        ],
        warrantyCode: [
          { required: true, message: '请输入保修申请单', trigger: 'change' }
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
    handleWarrantyApplyChange (val, record) {
      if (record) {
        this.form.warrantyId = record.id;
      } else {
        this.form.warrantyId = '';
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
    }
  }
};
</script>
