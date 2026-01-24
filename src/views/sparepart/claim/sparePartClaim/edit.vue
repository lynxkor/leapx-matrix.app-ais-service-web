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
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <span class="status primary">状态</span>
        </template>
        <template #extraButtons>
          <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="备件索赔单号：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备件采购单号：" prop="purchaseOrderCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.purchaseOrderCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店编码（组织code）：" prop="dealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店名称（组织名称）：" prop="dealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.submitTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="提交人：" prop="submitter">
                  <el-input
                    placeholder="请输入"
                    v-model="form.submitter"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="索赔类型:10货损,20货差（少）,30状态不符,40质量问题：" prop="claimType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.claimType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="索赔状态:10草稿,20待确认,30已驳回,40审批中,50已完结：" prop="claimStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.claimStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="驳回说明：" prop="rejectionDescription">
                  <el-input
                    placeholder="请输入"
                    v-model="form.rejectionDescription"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="审批说明：" prop="approvalDescription">
                  <el-input
                    placeholder="请输入"
                    v-model="form.approvalDescription"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否完结：" prop="completedIs">
                  <el-input
                    placeholder="请输入"
                    v-model="form.completedIs"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.createTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.updateTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="主键：" prop="id">
                  <el-input
                    placeholder="请输入"
                    v-model="form.id"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creatorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifier"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifierName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statusDesc"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="数据来源，150:零小跑; 10:E10：" prop="dataSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataSource"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="采购订单号ID：" prop="purchaseOrderId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.purchaseOrderId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="确认人：" prop="confirmer">
                  <el-input
                    placeholder="请输入"
                    v-model="form.confirmer"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="确认时间：" prop="confirmTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.confirmTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="审批时间：" prop="approvalTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.approvalTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="审批节点：" prop="approvalNode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.approvalNode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="理赔方式：" prop="compensationMethod">
                  <el-input
                    placeholder="请输入"
                    v-model="form.compensationMethod"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="责任方：" prop="responsibleParty">
                  <el-input
                    placeholder="请输入"
                    v-model="form.responsibleParty"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备件收货人姓名：" prop="receiverName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.receiverName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备件收货人手机：" prop="receiverPhone">
                  <el-input
                    placeholder="请输入"
                    v-model="form.receiverPhone"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="省ID：" prop="provinceId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.provinceId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="市ID：" prop="cityId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cityId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备件收货地址：" prop="deliveryAddress">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deliveryAddress"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="备件索赔单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="备件采购单号：" prop="purchaseOrderCode">
                  {{ form.purchaseOrderCode }}
                </el-form-item>
                <el-form-item label="门店编码（组织code）：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称（组织名称）：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  {{ form.submitTime }}
                </el-form-item>
                <el-form-item label="提交人：" prop="submitter">
                  {{ form.submitter }}
                </el-form-item>
                <el-form-item label="索赔类型:10货损,20货差（少）,30状态不符,40质量问题：" prop="claimType">
                  {{ form.claimType }}
                </el-form-item>
                <el-form-item label="索赔状态:10草稿,20待确认,30已驳回,40审批中,50已完结：" prop="claimStatus">
                  {{ form.claimStatus }}
                </el-form-item>
                <el-form-item label="驳回说明：" prop="rejectionDescription">
                  {{ form.rejectionDescription }}
                </el-form-item>
                <el-form-item label="审批说明：" prop="approvalDescription">
                  {{ form.approvalDescription }}
                </el-form-item>
                <el-form-item label="是否完结：" prop="completedIs">
                  {{ form.completedIs }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="主键：" prop="id">
                  {{ form.id }}
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  {{ form.creator }}
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  {{ form.modifier }}
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  {{ form.modifierName }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="数据来源，150:零小跑; 10:E10：" prop="dataSource">
                  {{ form.dataSource }}
                </el-form-item>
                <el-form-item label="采购订单号ID：" prop="purchaseOrderId">
                  {{ form.purchaseOrderId }}
                </el-form-item>
                <el-form-item label="确认人：" prop="confirmer">
                  {{ form.confirmer }}
                </el-form-item>
                <el-form-item label="确认时间：" prop="confirmTime">
                  {{ form.confirmTime }}
                </el-form-item>
                <el-form-item label="审批时间：" prop="approvalTime">
                  {{ form.approvalTime }}
                </el-form-item>
                <el-form-item label="审批节点：" prop="approvalNode">
                  {{ form.approvalNode }}
                </el-form-item>
                <el-form-item label="理赔方式：" prop="compensationMethod">
                  {{ form.compensationMethod }}
                </el-form-item>
                <el-form-item label="责任方：" prop="responsibleParty">
                  {{ form.responsibleParty }}
                </el-form-item>
                <el-form-item label="备件收货人姓名：" prop="receiverName">
                  {{ form.receiverName }}
                </el-form-item>
                <el-form-item label="备件收货人手机：" prop="receiverPhone">
                  {{ form.receiverPhone }}
                </el-form-item>
                <el-form-item label="省ID：" prop="provinceId">
                  {{ form.provinceId }}
                </el-form-item>
                <el-form-item label="市ID：" prop="cityId">
                  {{ form.cityId }}
                </el-form-item>
                <el-form-item label="备件收货地址：" prop="deliveryAddress">
                  {{ form.deliveryAddress }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>区块标题</h2>
              <el-button v-if="canAddOrUpdate" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="tableData"
                  :defaultNewRow="defaultNewRow"
                  :show-toolbar="false"
                  :options="options"
                  :auth="{edit: canAddOrUpdate, delete: canDelete}"
                />
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
import { getDetail, addOrUpdate } from '@/api/sparepart/claim/sparePartClaim/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  purchaseOrderCode: '',
  dealerCode: '',
  dealerName: '',
  submitTime: '',
  submitter: '',
  claimType: '',
  claimStatus: '',
  rejectionDescription: '',
  approvalDescription: '',
  completedIs: '',
  remark: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  purchaseOrderId: '',
  confirmer: '',
  confirmTime: '',
  approvalTime: '',
  approvalNode: '',
  compensationMethod: '',
  responsibleParty: '',
  receiverName: '',
  receiverPhone: '',
  provinceId: '',
  cityId: '',
  deliveryAddress: '',
};

export default {
  name: 'sparePartClaimEdit',
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
    EditTable,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
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
      pageTitle: '新页面',
      pageType: 'edit',
      title: '备件索赔单号：' + form.code,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-sparePartClaim',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'name',
          title: '姓名',
          width: '33%',
          editable: true,
          editRender: { name: 'ElInput' },
          rules: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'age',
          title: '年龄',
          editable: true,
          width: '33%',
          editRender: { name: 'ElInput', props: { type: 'number' } }
        },
        {
          field: 'email',
          title: '邮箱',
          width: '33%',
          editRender: { name: 'ElInput' }
        },
      ],
      rules: {
        code: [
          { required: true, message: '请输入备件索赔单号', trigger: 'change' }
        ],
        purchaseOrderCode: [
          { required: true, message: '请输入备件采购单号', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码（组织code）', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称（组织名称）', trigger: 'change' }
        ],
        submitTime: [
          { required: true, message: '请选择提交时间', trigger: 'change' }
        ],
        submitter: [
          { required: true, message: '请输入提交人', trigger: 'change' }
        ],
        claimType: [
          { required: true, message: '请选择索赔类型:10货损,20货差（少）,30状态不符,40质量问题', trigger: 'change' }
        ],
        claimStatus: [
          { required: true, message: '请选择索赔状态:10草稿,20待确认,30已驳回,40审批中,50已完结', trigger: 'change' }
        ],
        rejectionDescription: [
          { required: true, message: '请输入驳回说明', trigger: 'change' }
        ],
        approvalDescription: [
          { required: true, message: '请输入审批说明', trigger: 'change' }
        ],
        completedIs: [
          { required: true, message: '请输入是否完结', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，150:零小跑; 10:E10', trigger: 'change' }
        ],
        purchaseOrderId: [
          { required: true, message: '请输入采购订单号ID', trigger: 'change' }
        ],
        confirmer: [
          { required: true, message: '请输入确认人', trigger: 'change' }
        ],
        confirmTime: [
          { required: true, message: '请选择确认时间', trigger: 'change' }
        ],
        approvalTime: [
          { required: true, message: '请选择审批时间', trigger: 'change' }
        ],
        approvalNode: [
          { required: true, message: '请输入审批节点', trigger: 'change' }
        ],
        compensationMethod: [
          { required: true, message: '请输入理赔方式', trigger: 'change' }
        ],
        responsibleParty: [
          { required: true, message: '请输入责任方', trigger: 'change' }
        ],
        receiverName: [
          { required: true, message: '请输入备件收货人姓名', trigger: 'change' }
        ],
        receiverPhone: [
          { required: true, message: '请输入备件收货人手机', trigger: 'change' }
        ],
        provinceId: [
          { required: true, message: '请输入省ID', trigger: 'change' }
        ],
        cityId: [
          { required: true, message: '请输入市ID', trigger: 'change' }
        ],
        deliveryAddress: [
          { required: true, message: '请输入备件收货地址', trigger: 'change' }
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
    }
  }
};
</script>
