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
              <el-form-item label="活动编码" prop="activityId">
                <list-select
                  v-if="!this.$route.query.id||form.id"
                  listUrl="/claimreturn/claim/web/basic/techServiceActivity/listFull"
                  placeholder="请选择"
                  v-model="form.activityId"
                  query-key="activityCodeLike"
                  clearable
                  :disabled="this.$route.query.id!=null"
                  auto-load-options
                  collapseTags
                  no-param-load
                  labelKey="activityCode"
                  @change="handleActivityChange"
                  filterable
                />
              </el-form-item>
              <el-form-item label="活动名称" prop="activityName">
                {{ form.activityName }}
              </el-form-item>
              <el-form-item label="VIN" prop="vin">
                <!-- todo 车辆档案 -->
                <el-input
                  placeholder="请输入"
                  v-model="form.vin"
                  :disabled="this.$route.query.id!=null"
                  clearable
                />
              </el-form-item>
              <el-form-item label="计划实施门店名称" prop="plannedDealerCode">
                <dealer-select
                  :disabled="form.finished==='1'"
                  v-model="form.plannedDealerCode"
                  :defaultDealerName="form.plannedDealerName"
                />
              </el-form-item>
              <el-form-item label="车主姓名" prop="ownerName">
                {{ form.ownerName }}
              </el-form-item>
              <el-form-item label="车主手机号码" prop="ownerPhone">
                {{ form.ownerPhone }}
              </el-form-item>
              <el-form-item label="是否完成" prop="finished">
                {{ form.finishedLabel }}
              </el-form-item>
              <el-form-item label="完成时间" prop="finishTime">
                {{ form.finishTime }}
              </el-form-item>
              <el-form-item label="实际施工门店名称" prop="actualDealerName">
                {{ form.actualDealerName }}
              </el-form-item>
              <el-form-item label="施工单号" prop="workOrderNo">
                {{ form.workOrderNo }}
              </el-form-item>

              <el-form-item label="施工方案" prop="schemeName">
                {{ form.schemeName }}
              </el-form-item>
            </el-form>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button v-if="canAddOrUpdate && form.finished!=='1'" size="small" type="primary" @click="submitForm('ruleForm')"
                   :loading="submitLoading">保存
        </el-button>
        <el-button size="small" @click="handleBack">取消</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/claimreturn/claim/basic/serviceActivityVehicle';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import ListSelect from '@/libs/components/list-select/index.vue';
import DealerSelect from '@/components/dealer-select/index.vue';

const defaultForm = {
  // 多选时字段有变化，自行修复
  activityCode: '',
  vin: '',
  activityName: '',
  activityType: '',
  activityStatus: '',
  startTime: '',
  endTime: '',
  plannedDealerName: '',
  finished: '',
  actualDealerName: '',
  finishTime: '',
  workOrderNo: '',
  ownerPhone: '',
  schemeName: '',
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
  autoApprove: '',
  attachmentRequired: '',
  description: '',
  costContent: '',
  faultPhenomenon: '',
  troubleshootingFlow: '',
  settlementTypeId: '',
  settlementTypeName: '',
  warrantyTypeId: '',
  warrantyTypeName: '',
  plannedDealerId: null,
  plannedDealerCode: '',
  manualCompletionNote: '',
  manualOperatorId: '',
  manualOperatorName: '',
  manualOperationTime: '',
  actualDealerId: '',
  actualDealerCode: '',
  workOrderId: '',
  schemeId: '',
  ownerName: '',
};

export default {
  name: 'serviceActivityVehicleEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    DealerSelect,
    ListSelect,
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '服务活动车辆',
      pageType: 'edit',
      moduleKey: 'AISCR-serviceActivityVehicle',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        activityId: [
          { required: true, message: '请输入活动编码', trigger: 'blur' }
        ],
        vin: [
          { required: true, message: '请输入VIN', trigger: 'blur' }
        ]
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
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['服务活动车辆', `${id ? '编辑' : '新建'}`]);
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
    },
    handleActivityChange (val, selectedItem) {
      console.log('handleActivityChange', val, selectedItem);
      if (!val) {
        this.form.activityName = null;
      } else {
        this.form.activityName = selectedItem.activityName;
      }
    }
  }
};
</script>
