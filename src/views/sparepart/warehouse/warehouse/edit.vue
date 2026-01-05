<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <div class="page-common-edit">
        <el-container>
          <el-main>
            <section class="common-title" v-if="_id">
              <div>
                <h2>仓库名称：{{ form.warehouseName }}</h2>
                <!-- TIPS: 子标题格式如下 -->
                <!-- <h5>活动编码：{{ form.activityCode }}</h5> -->
              </div>
              <div v-if="isEditing">
                <el-button size="small" @click="handleCancel">取消</el-button>
                <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
              </div>
              <div v-else>
                <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
              </div>
            </section>
            <section class="common-section">
              <div class="common-section-header">
                <h2>基础信息</h2>
              </div>
              <div class="common-section-body">
                <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
                <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-if="isEditing || !_id">
                  <el-form-item label="仓库名称" prop="warehouseName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.warehouseName"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="仓库编码" prop="warehouseCode">
                    <el-input
                      placeholder="请输入"
                      v-model="form.warehouseCode"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="门店编码（组织code）" prop="dealerCode">
                    <el-input
                      placeholder="请输入"
                      v-model="form.dealerCode"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="门店名称（组织名称）" prop="dealerName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.dealerName"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="省" prop="provinceName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.provinceName"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="市" prop="cityName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.cityName"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="区&#x2F;县名称" prop="districtName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.districtName"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="详细地址" prop="address">
                    <el-input
                      placeholder="请输入"
                      v-model="form.address"
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
                  <el-form-item label="备注" prop="remark">
                    <el-input
                      placeholder="请输入"
                      v-model="form.remark"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="停用原因" prop="disableReason">
                    <el-input
                      placeholder="请输入"
                      v-model="form.disableReason"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="创建时间" prop="createTime">
                    <el-date-picker
                      :default-time="['00:00:00', '23:59:59']"
                      v-model="form.createTime"
                      :picker-options="pickerOptions"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    />
                  </el-form-item>
                  <el-form-item label="修改时间" prop="updateTime">
                    <el-date-picker
                      :default-time="['00:00:00', '23:59:59']"
                      v-model="form.updateTime"
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
                  <el-form-item label="数据来源，150:新销服; 老销服:10" prop="dataSource">
                    <el-input
                      placeholder="请输入"
                      v-model="form.dataSource"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="省code" prop="provinceCode">
                    <el-input
                      placeholder="请输入"
                      v-model="form.provinceCode"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="市code" prop="cityCode">
                    <el-input
                      placeholder="请输入"
                      v-model="form.cityCode"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="区&#x2F;县编码" prop="districtCode">
                    <el-input
                      placeholder="请输入"
                      v-model="form.districtCode"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="库位列表" prop="locationRespList">
                    <el-input
                      placeholder="请输入"
                      v-model="form.locationRespList"
                      clearable
                    />
                  </el-form-item>
                </el-form>
                <el-form :inline="true" class="form-detail" v-else>
                  <el-form-item label="仓库名称：" prop="warehouseName">
                    {{ form.warehouseName }}
                  </el-form-item>
                  <el-form-item label="仓库编码：" prop="warehouseCode">
                    {{ form.warehouseCode }}
                  </el-form-item>
                  <el-form-item label="门店编码（组织code）：" prop="dealerCode">
                    {{ form.dealerCode }}
                  </el-form-item>
                  <el-form-item label="门店名称（组织名称）：" prop="dealerName">
                    {{ form.dealerName }}
                  </el-form-item>
                  <el-form-item label="省：" prop="provinceName">
                    {{ form.provinceName }}
                  </el-form-item>
                  <el-form-item label="市：" prop="cityName">
                    {{ form.cityName }}
                  </el-form-item>
                  <el-form-item label="区&#x2F;县名称：" prop="districtName">
                    {{ form.districtName }}
                  </el-form-item>
                  <el-form-item label="详细地址：" prop="address">
                    {{ form.address }}
                  </el-form-item>
                  <el-form-item label="状态：" prop="status">
                    {{ form.status }}
                  </el-form-item>
                  <el-form-item label="备注：" prop="remark">
                    {{ form.remark }}
                  </el-form-item>
                  <el-form-item label="停用原因：" prop="disableReason">
                    {{ form.disableReason }}
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
                  <el-form-item label="状态变更描述：" prop="statusDesc">
                    {{ form.statusDesc }}
                  </el-form-item>
                  <el-form-item label="数据来源，150:新销服; 老销服:10：" prop="dataSource">
                    {{ form.dataSource }}
                  </el-form-item>
                  <el-form-item label="省code：" prop="provinceCode">
                    {{ form.provinceCode }}
                  </el-form-item>
                  <el-form-item label="市code：" prop="cityCode">
                    {{ form.cityCode }}
                  </el-form-item>
                  <el-form-item label="区&#x2F;县编码：" prop="districtCode">
                    {{ form.districtCode }}
                  </el-form-item>
                  <el-form-item label="库位列表：" prop="locationRespList">
                    {{ form.locationRespList }}
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
          <el-footer height="60px" v-if="!_id">
            <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
            <el-button size="small" type="primary" @click="submitForm('ruleForm', true)">保存并下一个</el-button>
            <!-- <el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
            <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
          </el-footer>
        </el-container>
      </div>
    </template>
    <template #right>
      <!-- 右侧栏组件，自行开发 -->
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/sparepart/warehouse/warehouse/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  warehouseName: '',
  warehouseCode: '',
  dealerCode: '',
  dealerName: '',
  provinceName: '',
  cityName: '',
  districtName: '',
  address: '',
  status: '',
  remark: '',
  disableReason: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  statusDesc: '',
  dataSource: '',
  provinceCode: '',
  cityCode: '',
  districtCode: '',
  locationRespList: '',
};

export default {
  name: 'warehouseEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
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
      pageTitle: '新页面',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-warehouse',
      isEditing: false,
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
        warehouseName: [
          { required: true, message: '请输入仓库名称', trigger: 'change' }
        ],
        warehouseCode: [
          { required: true, message: '请输入仓库编码', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码（组织code）', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称（组织名称）', trigger: 'change' }
        ],
        provinceName: [
          { required: true, message: '请输入省', trigger: 'change' }
        ],
        cityName: [
          { required: true, message: '请输入市', trigger: 'change' }
        ],
        districtName: [
          { required: true, message: '请输入区&#x2F;县名称', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        disableReason: [
          { required: true, message: '请输入停用原因', trigger: 'change' }
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
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，150:新销服; 老销服:10', trigger: 'change' }
        ],
        provinceCode: [
          { required: true, message: '请输入省code', trigger: 'change' }
        ],
        cityCode: [
          { required: true, message: '请输入市code', trigger: 'change' }
        ],
        districtCode: [
          { required: true, message: '请输入区&#x2F;县编码', trigger: 'change' }
        ],
        locationRespList: [
          { required: true, message: '请输入库位列表', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    this.getDetailData();
  },
  methods: {
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    handleCancel () {
      this.$refs.ruleForm.clearValidate();
      this.isEditing = false;
    },
    handleEdit () {
      this.isEditing = true;
    },
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this._id;
      if (!this.id) {
        this.$store.commit('SET_ACTIVE_BREADCRUMB', ['新页面', `${id ? '详情' : '新建'}`]);
      }
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
        });
      }
    },
    async submitForm (formName, rest = false) {
      try {
        const tableData = await this.handleSaveTable();
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            // TIPS: customKey 根据接口格式修改
            addOrUpdate({ ...this.form, customKey: tableData }).then(res => {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              const id = res;
              if (rest || !id) {
                this.resetForm(formName);
              } else {
                if (this.form.id) {
                  this.getDetailData();
                } else {
                  this.$router.push({
                    path: '/sparepart/warehouse/warehouse/edit',
                    query: {
                      id
                    }
                  });
                }
              }
            }).finally(() => {
              this.submitLoading = false;
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
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
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
