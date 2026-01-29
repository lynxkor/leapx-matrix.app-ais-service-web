<template>
  <!-- TIPS: 如果填写项大于15项，使用类名page-common-edit替换page-common-add -->
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="`仓库名称：${form.warehouseName}`"
        :isEditing.sync="isEditing"
        direction="vertical"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :dataTransform="dataTransform"
      >
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <!-- TIPS: 如果填写项大于15项，加上 :inline="true" -->
            <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
            <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
              <el-form-item label="仓库名称：" prop="warehouseName">
                <el-input
                  placeholder="请输入"
                  v-model="form.warehouseName"
                  maxlength="100"
                  clearable
                />
              </el-form-item>
              <el-form-item label="仓库编码：" prop="warehouseCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.warehouseCode"
                  maxlength="100"
                  :disabled="form.id!==''"
                  clearable
                />
              </el-form-item>
              <el-form-item label="社会统一信用代码：" prop="creditCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.creditCode"
                  maxlength="100"
                  clearable
                />
              </el-form-item>
              <el-form-item label="省市区：" prop="provinceCode">
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
              <el-form-item label="地址：" prop="address">
                <el-input
                  placeholder="请输入"
                  v-model="form.address"
                  maxlength="200"
                  clearable
                />
              </el-form-item>
              <el-form-item label="收货联系人：" prop="receiverContact">
                <el-input
                  placeholder="请输入"
                  v-model="form.receiverContact"
                  maxlength="100"
                  clearable
                />
              </el-form-item>
              <el-form-item label="收货电话：" prop="receiverPhone">
                <el-input
                  placeholder="请输入"
                  v-model="form.receiverPhone"
                  maxlength="11"
                  clearable
                />
              </el-form-item>
              <el-form-item label="备注：" prop="remark">
                <el-input
                  placeholder="请输入"
                  type="textarea"
                  v-model="form.remark"
                  maxlength="500"
                  clearable
                />
              </el-form-item>
              <el-form-item label="状态：" prop="status">
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
            <el-form :inline="true"  label-width="150px" class="form-detail" v-show="!(isEditing || !_id)">
              <el-form-item label="仓库名称：" prop="warehouseName">
                {{ form.warehouseName  }}
              </el-form-item>
              <el-form-item label="仓库编码：" prop="warehouseCode">
                {{ form.warehouseCode  }}
              </el-form-item>
              <el-form-item label="社会统一信用代码：" prop="creditCode">
                {{ form.creditCode  }}
              </el-form-item>
              <el-form-item label="省份名称：" prop="provinceName">
                {{ form.provinceName  }}
              </el-form-item>
              <el-form-item label="城市名称：" prop="cityName">
                {{ form.cityName  }}
              </el-form-item>
              <el-form-item label="区县名称：" prop="districtName">
                {{ form.districtName  }}
              </el-form-item>
              <el-form-item label="详细地址：" prop="address">
                {{ form.address  }}
              </el-form-item>
              <el-form-item label="备注：" prop="remark">
                {{ form.remark  }}
              </el-form-item>
              <el-form-item label="状态：" prop="status">
                {{ form.statusLabel  }}
              </el-form-item>
            </el-form>
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
import { getDetail, addOrUpdate } from '@/api/claimreturn/oldpart/basic/oldPartOemWarehouse';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getAreaInfo } from '@/utils';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';

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
    FetchSelect,
    EditPageLayout,
    EditBaseContainer,
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
      areaOptions: JSON.parse(localStorage.areaTree),
      pageTitle: '主机厂仓库管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-oldPartOemWarehouse',
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
      },
    };
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    dataTransform (data) {
      let areaInfo = getAreaInfo(data.districtCode);
      return Object.assign(data, areaInfo);
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    handleBack () {
      this.$router.back();
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
    },
  }
};
</script>
