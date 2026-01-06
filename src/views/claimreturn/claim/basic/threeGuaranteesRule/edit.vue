<template>
  <!-- TIPS: 如果填写项小于15项，使用类名page-common-add替换page-common-edit -->
  <div class="page-common-edit">
    <el-container direction="vertical" v-loading="loading">
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <!-- TIPS: 如果填写项小于15项，去掉 :inline="true" -->
            <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
            <el-form
              :inline="true"
              :model="form"
              :rules="rules"
              ref="ruleForm"
              label-width="150px"
            >
              <el-form-item label="三包规则编码" prop="ruleCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.ruleCode"
                  clearable
                  disabled
                  maxLength="100"
                />
              </el-form-item>
              <el-form-item label="判断依据" prop="judgmentBasis">
                <el-input
                  placeholder="请输入"
                  v-model="form.judgmentBasis"
                  clearable
                  maxLength="100"
                />
              </el-form-item>
              <el-form-item label="判断单位" prop="determineUnit">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="claim_determine_unit"
                  v-model="form.determineUnit"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="累计方式" prop="accumulation">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="claim_accumulation"
                  v-model="form.accumulation"
                  placeholder="请选择"
                  clearable
                  filterable
                  @change="accumulationChange"
                />
              </el-form-item>
              <el-form-item label="车辆用途" prop="vehicleProperty">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="claim_vehicle_property"
                  v-model="form.vehicleProperty"
                  placeholder="请选择"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item label="销售开始日期" prop="saleStartDate">
                <el-date-picker
                  v-model="form.saleStartDate"
                  range-separator="至"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  align="right"
                />
              </el-form-item>
              <el-form-item label="销售结束日期" prop="saleEndDate">
                <el-date-picker
                  v-model="form.saleEndDate"
                  range-separator="至"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  align="right"
                />
              </el-form-item>
              <el-form-item
                label="预警车龄起（天）"
                prop="warningVehicleAgeFrom"
              >
                <el-input
                  placeholder="请输入"
                  v-model="form.warningVehicleAgeFrom"
                  clearable
                  maxLength="100"
                />
              </el-form-item>
              <el-form-item label="预警车龄止（天）" prop="warningVehicleAgeTo">
                <el-input
                  placeholder="请输入"
                  v-model="form.warningVehicleAgeTo"
                  clearable
                  maxLength="100"
                />
              </el-form-item>
              <el-form-item label="预警里程起（公里）" prop="warningMileageFrom">
                <el-input
                  placeholder="请输入"
                  v-model="form.warningMileageFrom"
                  clearable
                  maxLength="100"
                />
              </el-form-item>
              <el-form-item label="预警里程止（公里）" prop="warningMileageTo">
                <el-input
                  placeholder="请输入"
                  v-model="form.warningMileageTo"
                  clearable
                  maxLength="100"
                />
              </el-form-item>
              <el-form-item label="绿色预警区间1" prop="greenWarning1">
                <el-input
                  placeholder="请输入"
                  v-model="form.greenWarning1"
                  clearable
                  maxLength="100"
                />
              </el-form-item>
              <el-form-item label="绿色预警区间2" prop="greenWarning2">
                <el-input
                  placeholder="请输入"
                  v-model="form.greenWarning2"
                  clearable
                  maxLength="100"
                />
              </el-form-item>
              <el-form-item label="黄色预警区间2" prop="yellowWarning2">
                <el-input
                  placeholder="请输入"
                  v-model="form.yellowWarning2"
                  clearable
                  maxLength="100"
                />
              </el-form-item>
              <el-form-item label="黄色预警区间1" prop="yellowWarning1">
                <el-input
                  placeholder="请输入"
                  v-model="form.yellowWarning1"
                  clearable
                  maxLength="100"
                />
              </el-form-item>
              <el-form-item label="红色预警区间1" prop="redWarning1">
                <el-input
                  placeholder="请输入"
                  v-model="form.redWarning1"
                  clearable
                  maxLength="100"
                />
              </el-form-item>
              <el-form-item label="红色预警区间2" prop="redWarning2">
                <el-input
                  placeholder="请输入"
                  v-model="form.redWarning2"
                  clearable
                  maxLength="100"
                />
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input
                  placeholder="请输入"
                  v-model="form.remark"
                  clearable
                  maxLength="100"
                />
              </el-form-item>
              <el-form-item label="警示条款" prop="reminderItem">
                <el-input
                  placeholder="请输入"
                  v-model="form.reminderItem"
                  clearable
                  maxLength="100"
                />
              </el-form-item>
              <el-form-item label="警示内容" prop="reminderContent">
                <el-input
                  placeholder="请输入"
                  v-model="form.reminderContent"
                  clearable
                  maxLength="100"
                />
              </el-form-item>
              <el-form-item label="预警内容" prop="warningContent">
                <el-input
                  placeholder="请输入"
                  v-model="form.warningContent"
                  clearable
                  maxLength="100"
                />
              </el-form-item>
            </el-form>
          </div>
        </section>
        <section class="common-section">
          <div class="common-section-header">
            <h2>零件明细</h2>
            <el-button v-if="canAddOrUpdate && _id" size="small" @click="handleAddRow"
              ><i class="iconfont icon-lxppc-plus"></i>添加</el-button
            >
          </div>
          <div class="common-section-body" v-if="_id">
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
          <div class="common-section-body not-commit" v-else>
            提交新建后，即可添加
          </div>
        </section>
      </el-main>
      <edit-base-footer
        :inEditMode="Boolean(_id)"
        :loading="submitLoading"
        @reset="resetForm('ruleForm')"
        @submit="(success) => submitForm('ruleForm', success)"
        @refresh="getDetailData"
      />
    </el-container>
  </div>
</template>

<script>
import {
  getDetail,
  addOrUpdate,
} from '@/api/claimreturn/claim/basic/threeGuaranteesRule';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import tableMixin from './tableMixin';
import EditBaseFooter from '@/components/EditBaseFooter';

const defaultForm = {
  // 多选时字段有变化，自行修复
  ruleCode: '',
  judgmentBasis: '',
  determineUnit: '',
  accumulation: '',
  vehicleProperty: '',
  saleStartDate: '',
  saleEndDate: '',
  warningVehicleAgeFrom: '',
  warningVehicleAgeTo: '',
  warningMileageFrom: '',
  warningMileageTo: '',
  greenWarning1: '',
  greenWarning2: '',
  yellowWarning2: '',
  yellowWarning1: '',
  redWarning1: '',
  redWarning2: '',
  status: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  remark: '',
  statusDesc: '',
  dataSource: '',
  reminderItem: '',
  reminderContent: '',
  warningContent: '',
  details: '',
};

export default {
  name: 'threeGuaranteesRuleEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null,
    },
  },
  mixins: [routeGuard, permissions, commonMixins, tableMixin],
  components: {
    EditBaseFooter,
    FetchSelect,
    EditTable,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '三包配置规则',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-threeGuaranteesRule',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
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
      this.$store.commit('SET_ACTIVE_BREADCRUMB', [
        '三包配置规则',
        `${id ? '编辑' : '新建'}`,
      ]);
      if (id) {
        this.loading = true;
        getDetail(id).then((res) => {
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
        }).finally(() => {
          this.loading = false;
        });
      }
    },
    async submitForm (formName, success) {
      try {
        // const tableData = await this.handleSaveTable();
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            // TIPS: customKey 根据接口格式修改
            addOrUpdate({ ...this.form })
              .then((res) => {
                this.$message({
                  message: '保存成功',
                  type: 'success',
                });
                // 新建保存时需要用到这个id
                let id;
                if (typeof res === 'string') {
                  id = res;
                }

                // 编辑
                if (this.id) {
                  if (success) {
                    success();
                  } else if (this.getDetailData) {
                    this.getDetailData?.();
                  }
                } else if (success) { // 新建
                  success(id);
                }
              })
              .finally(() => {
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
        ...defaultForm,
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    accumulationChange (val) {
      if (val === '2') {
        this.$message.info('切换为任意零件，零件明细将被清空');
      }
    }
  },
};
</script>
