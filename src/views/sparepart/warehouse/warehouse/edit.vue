<template>
  <edit-page-layout ref="editLayout" title="库位详情" showPaneFooter @save="handleSave">
    <template #left>
      <edit-base-container :id="_id" :title="`仓库名称：${form.warehouseName}`" :isEditing.sync="isEditing" :form.sync="form"
        :submitRequest="submitRequest" :detailRequest="detailRequest">
        <template>
          <el-main>
            <section class="common-section">
              <div class="common-section-header">
                <h2>仓库信息</h2>
              </div>
              <div class="common-section-body">
                <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
                <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px"
                  class="form-edit" v-if="isEditing || !_id">
                  <el-form-item label="仓库名称：" prop="warehouseName">
                    {{ form.warehouseName }}
                  </el-form-item>
                  <el-form-item label="仓库编码：" prop="warehouseCode">
                    {{ form.warehouseCode }}
                  </el-form-item>
                  <el-form-item label="省市区：" prop="provinceCode">
                    <el-cascader
                      placeholder="请选择省市区"
                      v-model="form.provinceCityCountyCode"
                      :props="orgProps"
                      :options="areaOptions"
                      filterable
                      clearable>
                    </el-cascader>
                  </el-form-item>
                  <el-form-item label="详细地址：" prop="address">
                    <el-input placeholder="请输入" v-model="form.address" clearable />
                  </el-form-item>
                  <el-form-item label="门店名称：" prop="dealerName">
                    {{ form.dealerName }}
                  </el-form-item>
                  <el-form-item label="是否启用：">
                    {{ form.statusLabel }}
                  </el-form-item>
                  <el-form-item label="停用原因：">
                    {{ form.statusDesc }}
                  </el-form-item>
                  <el-form-item label="备注：" prop="remark">
                    <el-input placeholder="请输入" v-model="form.remark" clearable />
                  </el-form-item>
                </el-form>
                <el-form :inline="true" class="form-detail" v-else>
                  <el-form-item label="仓库名称：" prop="warehouseName">
                    {{ form.warehouseName }}
                  </el-form-item>
                  <el-form-item label="仓库编码：" prop="warehouseCode">
                    {{ form.warehouseCode }}
                  </el-form-item>
                  <el-form-item label="省：" prop="provinceName">
                    {{ form.provinceName }}
                  </el-form-item>
                  <el-form-item label="市：" prop="cityName">
                    {{ form.cityName }}
                  </el-form-item>
                  <el-form-item label="区：" prop="districtName">
                    {{ form.districtName }}
                  </el-form-item>
                  <el-form-item label="详细地址：" prop="address">
                    {{ form.address }}
                  </el-form-item>
                  <el-form-item label="门店名称：" prop="dealerName">
                    {{ form.dealerName }}
                  </el-form-item>
                  <el-form-item label="是否启用：" >
                    {{ form.statusLabel }}
                  </el-form-item>
                  <el-form-item label="停用原因：">
                    {{ form.statusDesc }}
                  </el-form-item>
                  <el-form-item label="备注：" prop="remark">
                    {{ form.remark }}
                  </el-form-item>
                </el-form>
              </div>
            </section>
            <section class="common-section" v-if="_id">
              <div class="common-section-header">
                <h2>库位信息</h2>
              </div>
              <div class="common-section-body">
                <div class="ais-select-group" v-if="canAddOrUpdate">
                  <el-input placeholder="请输入" style="width: 305px;" v-model="locationName" clearable />
                  <el-button type="primary" @click="addLocation" size="small">
                    添加
                  </el-button>
                </div>
                <div class="common-section-table">
                  <part-table
                    :moduleKey="moduleKey"
                    ref="partTable"
                    :id="id"
                    @openPane="openPane"
                    >
                  </part-table>
                </div>
              </div>
            </section>
          </el-main>
        </template>
      </edit-base-container>
    </template>
    <template #right>
      <!-- 右侧栏组件，自行开发 -->
      <div class="page-common-edit">
        <replace-table
          :moduleKey="moduleKey"
          ref="replaceTable"
          :id="id"
          :replaceData="replaceData"
          >
        </replace-table>
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, locationOrUpdate } from '@/api/sparepart/warehouse/warehouse/index';
// import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import { getEnum, listOrgStoreInfo } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import EditBaseContainer from '@/components/EditBaseContainer';
import PartTable from './PartTable.vue';
import ReplaceTable from './ReplaceTable.vue';

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
  status: null,
  remark: '',
  id: '',
  provinceCityCountyCode: ''
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
    // EditTable,
    // FetchSelect,
    EditBaseContainer,
    PartTable,
    ReplaceTable
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
    },
    'form.status': {
      handler (newVal) {
        if (Number(newVal) === 0) {
          this.rules.disableReason[0].required = true;
        } else {
          // 状态变为1时清除验证信息
          this.rules.disableReason[0].required = false;
          this.$nextTick(() => {
            this.$refs.ruleForm?.clearValidate?.();
          });
        }
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      // 省市区
      areaOptions: JSON.parse(localStorage.areaTree),
      orgProps: {
        checkStrictly: true,
        emitPath: false,
        label: 'name',
        value: 'code',
        children: 'child'
      },
      pageTitle: '门店仓库',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-warehouse',
      isEditing: false,
      loading: false,
      submitLoading: false,
      locationName: '', // 库位信息
      replaceData: {}, // 库位当行信息
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
          field: 'locationName',
          title: '席位名称',
          width: '20%',
          editable: true,
          editRender: { name: 'ElInput' },
          rules: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'remark',
          title: '备注',
          editable: true,
          width: '20%',
          editRender: { name: 'ElInput', props: { type: 'number' } }
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '20%',
          editRender: { name: 'ElInput' }
        },
        {
          field: 'updateTime',
          title: '修改时间',
          width: '20%',
          editRender: { name: 'ElInput' }
        },
      ],
      rules: {
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        disableReason: [
          { required: false, message: '请填写停用原因', trigger: 'blur' }
        ]
      }
    };
  },
  mounted () {
    this.getDetailData();
  },
  methods: {
    // 打开侧边栏
    openPane (val, idx) {
      this.replaceData = val;
      this.$refs.editLayout.openPane();
    },
    handleCancel () {
      this.$refs.ruleForm?.clearValidate?.();
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
        this.$store.commit('SET_ACTIVE_BREADCRUMB', ['门店仓库', `${id ? '详情' : '新建'}`]);
      }
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
          this.tableData = this.form.locationRespList;
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
            addOrUpdate({ ...this.form, locationRespList: tableData }).then(res => {
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
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    async submitRequest () {
      return addOrUpdate({ ...this.form });
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
    },
    // 门店
    async getDealerList (query) {
      const res = await listOrgStoreInfo({ name: query });
      return res;
    },
    // 点击门店 赋值
    categorySpareSalesChange (val, all) {
      this.form.dealerCode = all.orgCode;
      this.form.dealerName = all.orgName;
    },
    // 库位信息添加
    async addLocation () {
      if (!this.locationName) {
        this.$message.error('请输入席位名称,再添加!');
        return;
      };
      const params = {
        warehouseId: this.$route.query.id,
        locationName: this.locationName
      };
      await locationOrUpdate(params);
      this.$refs.partTable.getDetailPageApi();
      this.locationName = '';
      this.$message.success('添加成功');
    },
    // 编辑行信息
    async handleSave () {
      try {
        // 等待 saveRowEdit 完成
        await this.$refs.replaceTable?.saveRowEdit();
        // 然后执行 getDetailPageApi
        // this.$refs.partTable.getDetailPageApi();
      } catch (error) {
        console.error('保存失败:', error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.ais-select-group {
  margin-bottom: 12px;
}
</style>
