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
              <el-form-item label="仓库名称" prop="warehouseName">
                <el-input
                  placeholder="请输入"
                  v-model="form.warehouseName"
                  maxlength="100"
                  clearable
                />
              </el-form-item>
              <el-form-item label="仓库编码" prop="warehouseCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.warehouseCode"
                  maxlength="100"
                  :disabled="form.id!==''"
                  clearable
                />
              </el-form-item>
              <el-form-item label="社会统一信用代码" prop="creditCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.creditCode"
                  maxlength="100"
                  clearable
                />
              </el-form-item>
              <el-form-item label="省市区" prop="provinceCode">
                <el-cascader
                  placeholder="请选择省市区"
                  v-model="form.districtCode"
                  :props="orgProps"
                  :options="areaOptions"
                  filterable
                  @change="handleCascaderChange"
                  clearable>
                </el-cascader>
              </el-form-item>
              <el-form-item label="地址" prop="address">
                <el-input
                  placeholder="请输入"
                  v-model="form.address"
                  maxlength="200"
                  clearable
                />
              </el-form-item>
              <el-form-item label="收货联系人" prop="receiverContact">
                <el-input
                  placeholder="请输入"
                  v-model="form.receiverContact"
                  maxlength="100"
                  clearable
                />
              </el-form-item>
              <el-form-item label="收货电话" prop="receiverPhone">
                <el-input
                  placeholder="请输入"
                  v-model="form.receiverPhone"
                  maxlength="11"
                  clearable
                />
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input
                  placeholder="请输入"
                  type="textarea"
                  v-model="form.remark"
                  maxlength="500"
                  clearable
                />
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="StatusEnum"
                  v-model="form.status"
                  placeholder="请选择"
                  disabled="disabled"
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
import { getDetail, addOrUpdate } from '@/api/claimreturn/oldpart/basic/oldPartOemWarehouse';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getAreaInfo } from '@/utils';

const defaultForm = {
  // 多选时字段有变化，自行修复
  warehouseName: '',
  warehouseCode: '',
  creditCode: '',
  provinceName: '',
  cityName: '',
  districtName: '',
  address: '',
  remark: '',
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  status: '1',
  statusDesc: '',
  dataSource: '',
  provinceCode: '',
  cityCode: '',
  districtCode: '',
  receiverContact: '',
  receiverPhone: ''

};

export default {
  name: 'pageEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
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
        if (val) {
          this.getDetailData();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      areaOptions: JSON.parse(localStorage.areaTree),
      pageTitle: '主机厂旧件仓库',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-oldPartOemWarehouse',
      isEditing: false,
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      orgProps: {
        checkStrictly: true,
        emitPath: false,
        label: 'name',
        value: 'code',
        children: 'child'
      },
      rules: {
        address: [
          { required: true, message: '请输入详细地址', trigger: 'change' }
        ],
        warehouseName: [
          { required: true, message: '请输入仓库名称', trigger: 'change' }
        ],
        warehouseCode: [
          { required: true, message: '请输入仓库编码', trigger: 'change' }
        ],
        districtCode: [
          { required: true, message: '请选择省市区', trigger: 'change' }
        ],
        receiverPhone: [
          { required: true, message: '请选择收货电话', trigger: 'change' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ],
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
      const id = this._id;
      if (!this.id) {
        this.$store.commit('SET_ACTIVE_BREADCRUMB', ['主机厂旧件仓库', `${id ? '详情' : '新建'}`]);
      }
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
        });
      }
    },
    submitForm (formName, rest = false) {
      let areaInfo = getAreaInfo(this.form.districtCode);
      Object.assign(this.form, areaInfo);
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
    handleCascaderChange (value) {
      console.log(value);
    }
  }
};
</script>
