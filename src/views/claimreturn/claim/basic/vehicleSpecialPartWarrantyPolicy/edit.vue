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
              <el-form-item label="政策名称" prop="policyName">
                <el-input
                  placeholder="请输入"
                  v-model="form.policyName"
                  maxlength="100"
                  clearable
                />
              </el-form-item>
              <el-form-item label="零件编码" prop="partId">
                <list-select
                  v-if="!this.$route.query.id||form.id"
                  listUrl="/sp/web/basic/sparePart/list"
                  placeholder="请选择"
                  v-model="form.partId"
                  query-key="partCodeOrNameLike"
                  auto-load-options
                  no-param-load
                  :disabled="form.id!==''"
                  filterable
                  clearable
                  label-key="code"
                  second-line-key="name"
                  @change="handlePartChange"
                  :params="{oemPart: 1}" />
              </el-form-item>
              <el-form-item label="零件名称">
                <el-input
                  placeholder="请输入"
                  v-model="form.partName"
                  maxlength="100"
                  clearable
                  disabled
                />
              </el-form-item>
              <el-form-item label="车系名称" prop="seriesId">
                <list-select
                  v-if="!this.$route.query.id||form.id"
                  listUrl="/datacenter/web/materials/vehicleSeries/list"
                  placeholder="请选择"
                  v-model="form.seriesId"
                  query-key="seriesNameLike"
                  auto-load-options
                  no-param-load
                  :disabled="form.id!==''"
                  filterable
                  clearable
                  :params="{}" />
              </el-form-item>
              <el-form-item label="车型名称" prop="modelId">
                <list-select
                  v-if="!this.$route.query.id||form.id"
                  listUrl="/datacenter/web/materials/vehicleModel/list"
                  placeholder="请选择"
                  v-model="form.modelId"
                  query-key="modelNameLike"
                  auto-load-options
                  :disabled="form.id!==''"

                  collapseTags
                  filterable
                  clearable
                  :params="{seriesIdList: form.seriesId?[form.seriesId]:[]}" />
              </el-form-item>

              <el-form-item label="车辆年款" prop="yearTypeId">
                <list-select
                  v-if="!this.$route.query.id||form.id"
                  listUrl="/datacenter/web/materials/vehicleYearType/list"
                  placeholder="请选择"
                  v-model="form.yearTypeId"
                  :disabled="form.id!==''"

                  collapseTags
                  auto-load-options
                  filterable
                  :params="{modelIdList: form.modelId?[form.modelId]:[]}" />
              </el-form-item>
              <el-form-item label="车辆属性" prop="vehicleProperty">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="claim_vehicle_property"
                  v-model="form.vehicleProperty"
                  placeholder="请选择"
                  :disabled="form.id!==''"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="里程数（KM）" prop="mileage">
                <el-input-number
                  placeholder="请输入"
                  v-model="form.mileage"
                  :controls="false"
                  :precision="0"
                  :min="0"
                  :max="999999999"
                  clearable
                />
              </el-form-item>

              <el-form-item label="保修期（月）" prop="warrantyPeriod">
                <el-input-number
                  placeholder="请输入"
                  v-model="form.warrantyPeriod"
                  :controls="false"
                  :precision="0"
                  :min="0"
                  :max="999999999"
                  clearable
                />
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input
                  type="textarea"
                  placeholder="请输入"
                  v-model="form.remark"
                  maxlength="500"
                  show-word-limit
                  clearable
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
import { getDetail, addOrUpdate } from '@/api/claimreturn/claim/basic/vehicleSpecialPartWarrantyPolicy';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import ListSelect from '@/libs/components/list-select/index.vue';

const defaultForm = {
  // 多选时字段有变化，自行修复
  policyName: '',
  seriesName: '',
  modelName: '',
  yearTypeName: '',
  vehicleProperty: '',
  mileage: '',
  updateTime: '',
  warrantyPeriod: '',
  remark: '',
  createTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  partId: '',
  partCode: '',
  partName: '',
  seriesId: '',
  modelId: '',
  yearTypeId: '',
};

export default {
  name: 'vehicleSpecialPartWarrantyPolicyEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions],
  components: {
    ListSelect,
    FetchSelect,
  },
  data () {
    const form = this.getDefautlForm();
    return {
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-vehicleSpecialPartWarrantyPolicy',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        policyName: [
          { required: true, message: '请输入政策名称', trigger: 'blur' }
        ],
        seriesId: [
          { required: true, message: '请输入车系名称', trigger: 'blur' }
        ],
        vehicleProperty: [
          { required: true, message: '请输入车辆属性', trigger: 'blur' }
        ],
        mileage: [
          { required: true, message: '请输入里程数（KM）', trigger: 'blur' }
        ],
        warrantyPeriod: [
          { required: true, message: '请选择保修期（月）', trigger: 'change' }
        ],
        partId: [
          { required: true, message: '请输入零件编码', trigger: 'blur' }
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
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['整车特殊零件保修政策设置', `${id ? '编辑' : '新建'}`]);
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
    handlePartChange (val, item) {
      console.log(val, item);
      if (val) {
        this.form.partName = item.name;
      } else {
        this.form.partName = '';
      }
    }
  }
};
</script>
