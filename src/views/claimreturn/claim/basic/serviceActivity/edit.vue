<template>
  <!-- TIPS: 如果填写项大于15项，使用类名page-common-edit替换page-common-add -->
  <div class="page-common-add">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <!-- TIPS: 如果填写项大于15项，加上 :inline="true" -->
            <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px">
              <el-form-item label="活动编码" prop="activityCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.activityCode"
                  clearable
                />
              </el-form-item>
              <el-form-item label="活动名称" prop="activityName">
                <el-input
                  placeholder="请输入"
                  v-model="form.activityName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="枚举:claim_activity_type" prop="activityType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.activityType"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="活动状态,（未提交0，提交零配件准备 1，零配件准备完成 2）" prop="activityStatus">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.activityStatus"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="活动开始时间" prop="startTime">
                <el-date-picker
                  v-model="form.startTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="活动结束时间" prop="endTime">
                <el-date-picker
                  v-model="form.endTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="施工单必需上传附件（1&#x3D;是，0&#x3D;否）" prop="attachmentRequired">
                <el-input
                  placeholder="请输入"
                  v-model="form.attachmentRequired"
                  clearable
                />
              </el-form-item>
              <el-form-item label="活动描述" prop="description">
                <el-input
                  placeholder="请输入"
                  v-model="form.description"
                  clearable
                />
              </el-form-item>
              <el-form-item label="活动数量" prop="vehicleCount">
                <el-input
                  placeholder="请输入"
                  v-model="form.vehicleCount"
                  clearable
                />
              </el-form-item>
              <el-form-item label="修改时间" prop="updateTime">
                <el-date-picker
                  v-model="form.updateTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="完成数量" prop="finishedVehicleCount">
                <el-input
                  placeholder="请输入"
                  v-model="form.finishedVehicleCount"
                  clearable
                />
              </el-form-item>
              <el-form-item label="完成情况" prop="finishedPercent">
                <el-input
                  placeholder="请输入"
                  v-model="form.finishedPercent"
                  clearable
                />
              </el-form-item>
              <el-form-item label="创建时间" prop="createTime">
                <el-date-picker
                  v-model="form.createTime"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </el-form-item>
              <el-form-item label="主键" prop="id">
                <el-input
                  placeholder="请输入"
                  v-model="form.id"
                  clearable
                />
              </el-form-item>
              <el-form-item label="创建者" prop="creator">
                <el-input
                  placeholder="请输入"
                  v-model="form.creator"
                  clearable
                />
              </el-form-item>
              <el-form-item label="创建者名称" prop="creatorName">
                <el-input
                  placeholder="请输入"
                  v-model="form.creatorName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="修改者" prop="modifier">
                <el-input
                  placeholder="请输入"
                  v-model="form.modifier"
                  clearable
                />
              </el-form-item>
              <el-form-item label="修改者名称" prop="modifierName">
                <el-input
                  placeholder="请输入"
                  v-model="form.modifierName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input
                  placeholder="请输入"
                  v-model="form.remark"
                  clearable
                />
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.status"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="状态变更描述" prop="statusDesc">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.statusDesc"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="数据来源，140:新销服; 老销服:10" prop="dataSource">
                <el-input
                  placeholder="请输入"
                  v-model="form.dataSource"
                  clearable
                />
              </el-form-item>
              <el-form-item label="是否自动审核（1&#x3D;是，0&#x3D;否）" prop="autoApprove">
                <el-input
                  placeholder="请输入"
                  v-model="form.autoApprove"
                  clearable
                />
              </el-form-item>
              <el-form-item label="活动费用内容" prop="costContent">
                <el-input
                  placeholder="请输入"
                  v-model="form.costContent"
                  clearable
                />
              </el-form-item>
              <el-form-item label="故障现象描述" prop="faultPhenomenon">
                <el-input
                  placeholder="请输入"
                  v-model="form.faultPhenomenon"
                  clearable
                />
              </el-form-item>
              <el-form-item label="故障排查流程" prop="troubleshootingFlow">
                <el-input
                  placeholder="请输入"
                  v-model="form.troubleshootingFlow"
                  clearable
                />
              </el-form-item>
              <el-form-item label="结算类型ID" prop="settlementTypeId">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.settlementTypeId"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="结算类型名称" prop="settlementTypeName">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.settlementTypeName"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="保修类型ID" prop="warrantyTypeId">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.warrantyTypeId"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="保修类型名称" prop="warrantyTypeName">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="xxx"
                  v-model="form.warrantyTypeName"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
            </el-form>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <el-button size="small" @click="handleBack">取消</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/claimreturn/claim/basic/serviceActivity';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  activityCode: '',
  activityName: '',
  activityType: '',
  activityStatus: '',
  startTime: '',
  endTime: '',
  attachmentRequired: '',
  description: '',
  vehicleCount: '',
  updateTime: '',
  finishedVehicleCount: '',
  finishedPercent: '',
  createTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  remark: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  autoApprove: '',
  costContent: '',
  faultPhenomenon: '',
  troubleshootingFlow: '',
  settlementTypeId: '',
  settlementTypeName: '',
  warrantyTypeId: '',
  warrantyTypeName: '',
};

export default {
  name: 'serviceActivityEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '新页面',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-serviceActivity',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        activityCode: [
          { required: true, message: '请输入活动编码', trigger: 'blur' }
        ],
        activityName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        activityType: [
          { required: true, message: '请选择枚举:claim_activity_type', trigger: 'change' }
        ],
        activityStatus: [
          { required: true, message: '请选择活动状态,（未提交0，提交零配件准备 1，零配件准备完成 2）', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择活动开始时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择活动结束时间', trigger: 'change' }
        ],
        attachmentRequired: [
          { required: true, message: '请输入施工单必需上传附件（1&#x3D;是，0&#x3D;否）', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入活动描述', trigger: 'blur' }
        ],
        vehicleCount: [
          { required: true, message: '请输入活动数量', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        finishedVehicleCount: [
          { required: true, message: '请输入完成数量', trigger: 'blur' }
        ],
        finishedPercent: [
          { required: true, message: '请输入完成情况', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'blur' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'blur' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'blur' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'blur' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，140:新销服; 老销服:10', trigger: 'blur' }
        ],
        autoApprove: [
          { required: true, message: '请输入是否自动审核（1&#x3D;是，0&#x3D;否）', trigger: 'blur' }
        ],
        costContent: [
          { required: true, message: '请输入活动费用内容', trigger: 'blur' }
        ],
        faultPhenomenon: [
          { required: true, message: '请输入故障现象描述', trigger: 'blur' }
        ],
        troubleshootingFlow: [
          { required: true, message: '请输入故障排查流程', trigger: 'blur' }
        ],
        settlementTypeId: [
          { required: true, message: '请选择结算类型ID', trigger: 'change' }
        ],
        settlementTypeName: [
          { required: true, message: '请选择结算类型名称', trigger: 'change' }
        ],
        warrantyTypeId: [
          { required: true, message: '请选择保修类型ID', trigger: 'change' }
        ],
        warrantyTypeName: [
          { required: true, message: '请选择保修类型名称', trigger: 'change' }
        ],
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    };
  },
  mounted () {
    this.getDetailData();
  },
  methods: {
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['新页面', `${id ? '编辑' : '新建'}`]);
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
        });
      }
    },
    submitForm (formName, rest = false) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          addOrUpdate({ ...this.form }).then(res => {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            const id = this.$route.query.id;
            if (rest || !id) {
              this.resetForm(formName);
            } else {
              this.getDetailData();
            }
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.tableData = [];
      this.form = this.getDefautlForm();
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
    // handleJumpAuditLog () {
    //   this.$router.push({
    //     path: '/xxx/auditLog',
    //     query: {
    //       tableCode: '',
    //       tableId: ''
    //     }
    //   });
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
