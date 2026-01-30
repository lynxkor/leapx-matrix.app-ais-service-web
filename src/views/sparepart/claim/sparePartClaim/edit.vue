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
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="索赔类型：" prop="claimType">
                  {{ form.claimTypeLabel }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="采购订单号：" prop="purchaseOrderCode">
                  {{ form.purchaseOrderCode }}
                </el-form-item>
                <el-form-item label="提交人：" prop="submitter">
                  {{ form.submitter }}
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  {{ form.submitTime }}
                </el-form-item>
                <el-form-item label="确认人：" prop="confirmer">
                  {{ form.confirmer }}
                </el-form-item>
                <el-form-item label="确认时间：" prop="confirmTime">
                  {{ form.confirmTime }}
                </el-form-item>
                <el-form-item label="驳回原因：" prop="rejectionDescription">
                  {{ form.rejectionDescription }}
                </el-form-item>
                <el-form-item label="索赔状态：" prop="claimStatus">
                  {{ form.claimStatusLabel }}
                </el-form-item>
                <el-form-item label="责任方：" prop="responsibleParty">
                  {{ form.responsibleParty }}
                </el-form-item>
                <el-form-item label="审批时间：" prop="approvalTime">
                  {{ form.approvalTime }}
                </el-form-item>
                <el-form-item label="审批说明：" prop="approvalDescription">
                  {{ form.approvalDescription }}
                </el-form-item>
                <el-form-item label="审批节点：" prop="approvalNode">
                  {{ form.approvalNode }}
                </el-form-item>
                <el-form-item label="理赔方式：" prop="compensationMethod">
                  {{ form.compensationMethod }}
                </el-form-item>
                <el-form-item label="备件收货人姓名：" prop="compensationMethod">
                  <el-input
                    placeholder="请输入"
                    v-model="form.receiverName"
                    clearable
                />
                </el-form-item>
                <el-form-item label="备件收货人手机：" prop="compensationMethod">
                  <el-input
                    placeholder="请输入"
                    v-model="form.receiverPhone"
                    clearable
                />
                </el-form-item>
                <el-form-item label="省市区" prop="provinceCode"
                  >
                    <el-cascader
                      placeholder="请选择省市区"
                      v-model="form.provinceCityCountyCode"
                      :props="orgProps"
                      :options="areaOptions"
                      filterable
                      clearable>
                  </el-cascader>
                  </el-form-item>
                <el-form-item label="备件收货地址：" prop="address">
                  {{ form.address }}
                  <el-input
                    placeholder="请输入"
                    v-model="form.address"
                    clearable
                />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="备件索赔单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="索赔类型：" prop="claimType">
                  {{ form.claimTypeLabel }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="采购订单号：" prop="purchaseOrderCode">
                  {{ form.purchaseOrderCode }}
                </el-form-item>
                <el-form-item label="提交人：" prop="submitter">
                  {{ form.submitter }}
                </el-form-item>
                <el-form-item label="提交时间：" prop="submitTime">
                  {{ form.submitTime }}
                </el-form-item>
                <el-form-item label="确认人：" prop="confirmer">
                  {{ form.confirmer }}
                </el-form-item>
                <el-form-item label="确认时间：" prop="confirmTime">
                  {{ form.confirmTime }}
                </el-form-item>
                <el-form-item label="驳回原因：" prop="rejectionDescription">
                  {{ form.rejectionDescription }}
                </el-form-item>
                <el-form-item label="索赔状态：" prop="claimStatus">
                  {{ form.claimStatusLabel }}
                </el-form-item>
                <el-form-item label="责任方：" prop="responsibleParty">
                  {{ form.responsibleParty }}
                </el-form-item>
                <el-form-item label="审批时间：" prop="approvalTime">
                  {{ form.approvalTime }}
                </el-form-item>
                <el-form-item label="审批说明：" prop="approvalDescription">
                  {{ form.approvalDescription }}
                </el-form-item>
                <el-form-item label="审批节点：" prop="approvalNode">
                  {{ form.approvalNode }}
                </el-form-item>
                <el-form-item label="理赔方式：" prop="compensationMethod">
                  {{ form.compensationMethod }}
                </el-form-item>
                <el-form-item label="备件收货人姓名：" prop="compensationMethod">
                  {{ form.receiverName }}
                </el-form-item>
                <el-form-item label="备件收货人手机：" prop="compensationMethod">
                  {{ form.receiverPhone }}
                </el-form-item>
                <el-form-item label="省：" prop="compensationMethod">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="市：" prop="compensationMethod">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="备件收货地址：" prop="compensationMethod">
                  {{ form.address }}
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
      moduleKey: 'AISPART-sparePartClaim',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      areaOptions: JSON.parse(localStorage.areaTree),
      orgProps: {
        checkStrictly: true,
        emitPath: false,
        label: 'name',
        value: 'code',
        children: 'child'
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
          { required: false, message: '请输入备件索赔单号', trigger: 'change' }
        ],
        purchaseOrderCode: [
          { required: false, message: '请输入备件采购单号', trigger: 'change' }
        ],
        dealerCode: [
          { required: false, message: '请输入门店编码（组织code）', trigger: 'change' }
        ],
        dealerName: [
          { required: false, message: '请输入门店名称（组织名称）', trigger: 'change' }
        ],
        submitTime: [
          { required: false, message: '请选择提交时间', trigger: 'change' }
        ],
        submitter: [
          { required: false, message: '请输入提交人', trigger: 'change' }
        ],
        claimType: [
          { required: false, message: '请选择索赔类型:10货损,20货差（少）,30状态不符,40质量问题', trigger: 'change' }
        ],
        claimStatus: [
          { required: false, message: '请选择索赔状态:10草稿,20待确认,30已驳回,40审批中,50已完结', trigger: 'change' }
        ],
        rejectionDescription: [
          { required: false, message: '请输入驳回说明', trigger: 'change' }
        ],
        approvalDescription: [
          { required: false, message: '请输入审批说明', trigger: 'change' }
        ],
        completedIs: [
          { required: false, message: '请输入是否完结', trigger: 'change' }
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'change' }
        ],
        createTime: [
          { required: false, message: '请选择创建时间', trigger: 'change' }
        ],
        updateTime: [
          { required: false, message: '请选择修改时间', trigger: 'change' }
        ],
        id: [
          { required: false, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: false, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: false, message: '请输入创建者名称', trigger: 'change' }
        ],
        modifier: [
          { required: false, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: false, message: '请输入修改者名称', trigger: 'change' }
        ],
        status: [
          { required: false, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: false, message: '请选择状态变更描述', trigger: 'change' }
        ],
        dataSource: [
          { required: false, message: '请输入数据来源，150:零小跑; 10:E10', trigger: 'change' }
        ],
        purchaseOrderId: [
          { required: false, message: '请输入采购订单号ID', trigger: 'change' }
        ],
        confirmer: [
          { required: false, message: '请输入确认人', trigger: 'change' }
        ],
        confirmTime: [
          { required: false, message: '请选择确认时间', trigger: 'change' }
        ],
        approvalTime: [
          { required: false, message: '请选择审批时间', trigger: 'change' }
        ],
        approvalNode: [
          { required: false, message: '请输入审批节点', trigger: 'change' }
        ],
        compensationMethod: [
          { required: false, message: '请输入理赔方式', trigger: 'change' }
        ],
        responsibleParty: [
          { required: false, message: '请输入责任方', trigger: 'change' }
        ],
        receiverName: [
          { required: false, message: '请输入备件收货人姓名', trigger: 'change' }
        ],
        receiverPhone: [
          { required: false, message: '请输入备件收货人手机', trigger: 'change' }
        ],
        provinceId: [
          { required: false, message: '请输入省ID', trigger: 'change' }
        ],
        cityId: [
          { required: false, message: '请输入市ID', trigger: 'change' }
        ],
        deliveryAddress: [
          { required: false, message: '请输入备件收货地址', trigger: 'change' }
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
