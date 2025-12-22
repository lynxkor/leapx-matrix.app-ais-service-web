<template>
  <!-- TIPS: 如果填写项小于15项，使用类名page-common-add替换page-common-edit -->
  <edit-page-layout ref="editLayout" title="标题" showPaneFooter>
    <template #left>
      <div class="page-common-edit">
        <el-container>
          <el-main>
            <section class="common-section">
              <div class="common-section-header">
                <h2>基础信息</h2>
              </div>
              <div class="common-section-body">
                <!-- TIPS: 如果填写项小于15项，去掉 :inline="true" -->
                <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
                <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px">
                  <el-form-item label="政策名称" prop="policyName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.policyName"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="政策类型" prop="policyType">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="claim_free_maintenance_policy_type"
                      v-model="form.policyType"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="维修项目代码" prop="repairItemId">
                    <fetch-select
                      filterable
                      clearable
                      remote
                      reserve-keyword
                      v-model="form.repairItemId"
                      :remote-method="repairItemSearch"
                      :params="form.repairItemCode"
                      @change="handleRepairItemChange"
                      value-key="id"
                      label-key="code"
                    />
                  </el-form-item>
                  <el-form-item label="维修项目名称" prop="repairItemName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.repairItemName"
                      clearable
                      maxLength="100"
                      disabled
                    />
                  </el-form-item>
                  <el-form-item label="工时数" prop="workhour">
                    <el-input
                      placeholder="请输入"
                      v-model="form.workhour"
                      clearable
                      maxLength="100"
                      disabled
                    />
                  </el-form-item>
                  <el-form-item label="免保时间" prop="freePeriod">
                    <el-input
                      placeholder="请输入"
                      v-model="form.freePeriod"
                      clearable
                      maxLength="100"
                    >
                      <template slot="append">月</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="里程" prop="mileage">
                    <el-input
                      placeholder="请输入"
                      v-model="form.mileage"
                      clearable
                      maxLength="100"
                    >
                      <template slot="append">公里</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="延后天数" prop="delayDays">
                    <el-input
                      placeholder="请输入"
                      v-model="form.delayDays"
                      clearable
                      maxLength="100"
                    >
                      <template slot="append">天</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="延后里程" prop="delayMileage">
                    <el-input
                      placeholder="请输入"
                      v-model="form.delayMileage"
                      clearable
                      maxLength="100"
                    >
                      <template slot="append">公里</template>
                    </el-input>
                  </el-form-item>
                </el-form>
              </div>
            </section>
            <section class="common-section">
              <div class="common-section-header common-section-tip">
                <h2>零件信息</h2><span class="p-1">个别公告车型使用不同零件时可以添加多套方案，常规只需使用默认方案即可。</span>
              </div>
              <div class="common-section-body">
                <leap-tabs
                  :items="items"
                  :value="vehicleRegisteredModelId"
                  closeTip="确定删除该公共车型吗？"
                  @change="onTabChange"
                  @close="onTabClose"
                  @add="onTabAdd"
                  >
                  <template slot="add-popover">
                    <fetch-select
                      filterable
                      clearable
                      remote
                      reserve-keyword
                      v-model="tabValue"
                      :remote-method="tabValueRemote"
                      @change="handleTabValueChange"
                      value-key="id"
                      label-key="registeredModelName"
                      placeholder="请输入公告车型代码/名称"
                    />
                  </template>
                </leap-tabs>
              </div>
            </section>
            <section class="common-section">
              <div
                v-if="canAddOrUpdate"
                class="common-section-header"
              >
                <fetch-box>
                  <fetch-select
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    v-model="part"
                    :remote-method="partRemote"
                    @change="handlePartChange"
                    value-key="id"
                    label-key="partName"
                    placeholder="请输入零件编码/名称"
                  />
                  <el-button
                    type="primary"
                    size="small"
                    @click="handleAddPart"
                    >
                    添加
                  </el-button>
                </fetch-box>
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
                    :auth="{ edit: canAddOrUpdate, delete: canAddOrUpdate }"
                    :isFocusNewRow="false"
                    :enableSingleRowSave="true"
                    :showPagination="true"
                    :current="current"
                    :pageSize="pageSize"
                    :total="total"
                    @save-row-edit="saveRowEdit"
                    @remove-row="handleRemoveRow"
                    @page-size-change="pageSizeChange"
                    @current-page-change="currentPageChange"
                  />
                </div>
              </div>
            </section>
          </el-main>
          <el-footer height="60px">
            <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
            <el-button
              size="small"
              @click="handleBack"
              >取消</el-button
            >
          </el-footer>
        </el-container>
      </div>
     </template>
    <template #right>
      test
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, detailList } from '@/api/claimreturn/claim/basic/freeMaintenancePolicy';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import FetchBox from '@/libs/components/FetchBox';
import { getEnum, vehicleSalesVersionList, sparePartList } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getList } from '@/api/maintain/basic/repairItem';
import LeapTabs from '@/libs/components/LeapTabs/index.vue';
import { debounce } from 'lodash';
import tableMixin from './tableMixin';
import { uIntRule } from '@/validation/rule';

const defaultForm = {
  // 多选时字段有变化，自行修复
  policyName: '',
  repairItemCode: '',
  repairItemName: '',
  policyType: '',
  freePeriod: '',
  mileage: '',
  delayDays: '',
  delayMileage: '',
  workhour: '',
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
  dataSource: '',
  repairItemId: '',
  parts: '',
};

export default {
  name: 'freeMaintenancePolicyEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins, tableMixin],
  components: {
    FetchSelect,
    EditTable,
    EditPageLayout,
    LeapTabs,
    FetchBox,
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '新页面',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-freeMaintenancePolicy',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
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
      },
      rules: {
        policyName: [
          { required: true, message: '请输入政策名称', trigger: 'blur' }
        ],
        repairItemId: [
          { required: true, message: '请输入维修项目代码', trigger: 'blur' }
        ],
        policyType: [
          { required: true, message: '请选择政策类型（免费保养，终身免费保养）', trigger: 'change' }
        ],
        freePeriod: [
          { required: true, message: '请输入免保时间（月）（最小为0）', trigger: 'blur' },
          uIntRule,
        ],
        mileage: [
          { required: true, message: '请输入里程（最小为0）', trigger: 'blur' },
          uIntRule,
        ],
      },
      items: [],
      // 公告车型id
      vehicleRegisteredModelId: '',
      tabValue: '',
      //
      part: '',
      curPart: null,
    };
  },
  mounted () {
    this.getDetailData();
    // 免保零件明细 PC端接口
    this.getPartDetail();
  },
  methods: {
    getId () {
      const id = this.id || this.$route.query.id;
      return id;
    },
    // 项目维修代码
    handleRepairItemChange (val, record) {
      if (record) {
        this.form.repairItemId = record.id;
        this.form.repairItemCode = record.code;
        this.form.repairItemName = record.name;
        this.form.workhour = record.workhour;
      }
    },
    // 项目维修代码
    async repairItemSearch (query) {
      return getList({
        maintenanceItemTypes: [],
        codeLike: query,
        pageSize: 20,
        pageNum: 1,
      });
    },
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this.getId();
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['免费保养政策', `${id ? '编辑' : '新建'}`]);
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
        // const tableData = await this.handleSaveTable();
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            // TIPS: customKey 根据接口格式修改
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
    // handleJumpAuditLog () {
    //   this.$router.push({
    //     path: '/xxx/auditLog',
    //     query: {
    //       tableCode: '',
    //       tableId: ''
    //     }
    //   });
    // },
    // 详情表格相关数据
    handleAddPart: debounce(function () {
      // 通过引用直接调用子组件方法
      // this.$refs.editTable.addRow();
      // this.$refs.editLayout.openPane();
      if (!this.part) {
        this.$message.error('请选择零件');
        return null;
      }
      const partId = this.part;
      const cur = this.curPart;
      this.part = '';
      this.tableData.unshift({
        partId: partId,
        partCode: cur.partCode,
        partName: cur.partName,
        purchasePrice: cur.purchasePrice,
        partQuantity: '',
      });
    }, 200),
    handleSaveTable (data) {
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
    onTabChange (item) {
      this.vehicleRegisteredModelId = item.value;
    },
    onTabClose (item, index) {
      this.items.splice(index, 1);
      if (item === this.vehicleRegisteredModelId && this.items.length) {
        this.vehicleRegisteredModelId = this.items[0];
      }
    },
    onTabAdd () {
      console.log('sfd');
    },
    // 公告车型
    tabValueRemote (query) {
      return vehicleSalesVersionList({
        registeredModelNameLike: query,
        pageSize: 20,
        pageNum: 1,
      });
    },
    // 公告车型
    handleTabValueChange (val, record) {
      if (val) {
        const fItem = this.items.find(item => item.value === val);
        if (fItem) {
          this.tabValue = '';
          this.$message.error('公告车型重复添加');
          return;
        }
        this.items.push({
          ...record,
          label: record.registeredModelName,
          value: record.id,
        });
      }
      this.tabValue = '';
    },
    // 公告车型列表
    getPartDetail () {
      const id = this.getId();
      detailList({
        freeMaintenancePolicyId: id,
      }).then(data => {
        this.items = (data || []).map((item, index) => {
          if (index === 0) {
            this.vehicleRegisteredModelId = item.vehicleRegisteredModelId;
          }
          return {
            disableClose: index === 0,
            value: item.vehicleRegisteredModelId, // 公告车型id
            label: item.vehicleRegisteredModelName,
          };
        });
      });
      //
    },
    // 零件
    partRemote (query) {
      // 是否OEM, 是否启用
      return sparePartList({ partCodeOrNameLike: query, oemPart: 1, status: 1 });
    },
    handlePartChange (val, record) {
      this.curPart = record;
    }
  }
};
</script>
<style lang="scss" scoped>
  .common-section{
    .common-section-tip{
      justify-content: flex-start;
      .p-1{
        padding-left: 4px;
        color: #9D9F9D;
      }
    }
  }

</style>
