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
              <el-form-item label="供应商编码" prop="supplierCode">
                <fetch-select
                  prop="supplierCode"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  v-model="form.supplierCode"
                  :remote-method="listSupplier"
                  :disabled="this.$route.query.id"
                  value-key="id"
                  label-key="name"
                  @change="listSupplierChange"
                />
              </el-form-item>
              <el-form-item label="供应商名称" prop="supplierName">
                <el-input
                  placeholder="请输入"
                  v-model="form.supplierName"
                  disabled="true"
                  clearable
                />
              </el-form-item>
              <el-form-item label="备件编码" prop="partCode">
                <fetch-select
                  prop="partCode"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  v-model="form.partCode"
                  :remote-method="listSparePart"
                  :disabled="this.$route.query.id"
                  value-key="id"
                  label-key="name"
                  @change="listSparePartChange"
                />
              </el-form-item>
              <el-form-item label="备件名称" prop="partName">
                <el-input
                  placeholder="请输入"
                  v-model="form.partName"
                  disabled="true"
                  clearable
                />
              </el-form-item>
              <el-form-item label="配额数值" prop="quota">
                <el-input
                  placeholder="请输入"
                  v-model="form.quota"
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
import { getDetail, addOrUpdate } from '@/api/sparepart/basic/sparePartSupplier/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import { getSparePart } from '@/api/sparepart/basic/sparePart/index';
import { list as getSupplier } from '@/api/sparepart/basic/supplierInfo/index';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
  supplierInfoId: '',
  supplierCode: '',
  supplierName: '',
  partCode: '',
  partName: '',
  statusDesc: '',
  createTime: '',
  updateTime: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  remark: '',
  status: '',
  dataSource: '',
  sparePartId: '',
  quota: '',
};

export default {
  name: 'sparePartSupplierEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions],
  components: {
    FetchSelect,
  },
  data () {
    const form = this.getDefautlForm();
    return {
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-sparePartSupplier',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        supplierCode: [
          { required: true, message: '请选择供应商', trigger: 'blur' }
        ],
        partCode: [
          { required: true, message: '请选择备件', trigger: 'blur' }
        ],
        quota: [
          { required: false, message: '请输入配额数值', trigger: 'blur' }
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

    async listSupplier (query) {
      console.log('wode');
      var a = await getSupplier({ supplierCodeOrNameLike: query });
      return a;
    },
    listSupplierChange (val, all) {
      console.log(JSON.stringify(all));
      this.form.supplierInfoId = all.id;
      this.form.supplierCode = all.code;
      this.form.supplierName = all.name;
    },
    async listSparePart (query) {
      var a = await getSparePart({ partCodeOrNameLike: query });
      return a;
    },
    listSparePartChange (val, all) {
      this.form.sparePartId = all.id;
      this.form.partCode = all.code;
      this.form.partName = all.name;
    },
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['供应商备件关系', `${id ? '编辑' : '新建'}`]);
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
