<template>
  <div class="page-common-edit">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px">
              <el-form-item label="维修项目代码" prop="code">
                <el-input
                  placeholder="请输入"
                  v-model="form.code"
                  clearable
                  maxLength="50"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item label="维修项目名称" prop="name">
                <el-input
                  placeholder="请输入"
                  v-model="form.name"
                  clearable
                  maxLength="50"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item label="维修类型" prop="repairItemTypeId">
                <el-select
                  v-model="form.repairItemTypeId"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  @change="handleRepairItemChange"
                  :remote-method="repairItemSearch"
                  :loading="repairItemLoading">
                  <el-option
                    v-for="item in repairItemOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="拼音简码" prop="pinyinCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.pinyinCode"
                  clearable
                  maxLength="50"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item label="工时" prop="workhour">
                <el-input
                  placeholder="请输入"
                  v-model="form.workhour"
                  clearable
                  type="number"
                />
              </el-form-item>
              <el-form-item label="工时单价" prop="workhourPrice">
                <el-input
                  placeholder="请输入"
                  v-model="form.workhourPrice"
                  clearable
                  type="number"
                />
              </el-form-item>
              <el-form-item label="是否活动专用" prop="isActivity">
                <el-radio-group v-model="form.isActivity">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否保修专用" prop="isWarranty">
                <el-radio-group v-model="form.isWarranty">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否电池维修专用" prop="isBatteryRepair">
                <el-radio-group v-model="form.isBatteryRepair">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否生产类专用" prop="isProdType">
                <el-radio-group v-model="form.isProdType">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否预约专用" prop="isReservation">
                <el-radio-group v-model="form.isReservation" @change="handleReservationChange">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="预约项目名称" prop="appointmentItemName">
                <el-input
                  placeholder="请输入"
                  v-model="form.appointmentItemName"
                  clearable
                  maxLength="50"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item label="保养项目分类" prop="maintenanceItemType">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="mc_maintenance_item"
                  v-model="form.maintenanceItemType"
                  placeholder="请选择"
                  clearable
                />
              </el-form-item>
              <el-form-item label="保养时间（月）" prop="maintenanceTime">
                <el-input
                  placeholder="请输入"
                  v-model="form.maintenanceTime"
                  clearable
                  type="number"
                />
              </el-form-item>
              <el-form-item label="保养里程（KM）" prop="maintenanceMileage">
                <el-input
                  placeholder="请输入"
                  v-model="form.maintenanceMileage"
                  clearable
                  type="number"
                />
              </el-form-item>
              <el-form-item label="里程间隔计算标准" prop="mileageInterval">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="mc_mileage_interval"
                  v-model="form.mileageInterval"
                  placeholder="请选择"
                  clearable
                />
              </el-form-item>
              <el-form-item label="时间间隔计算标准" prop="timeInterval">
                <fetch-select
                  :request="fetchOptions"
                  enumCode="mc_time_interval"
                  v-model="form.timeInterval"
                  placeholder="请选择"
                  clearable
                />
              </el-form-item>
              <el-form-item label="下次保养计算里程" prop="nextMaintenanceMileage">
                <el-input
                  placeholder="请输入"
                  v-model="form.nextMaintenanceMileage"
                  clearable
                  type="number"
                />
              </el-form-item>
              <el-form-item label="下次保养计算时间" prop="nextMaintenanceTime">
                <el-input
                  placeholder="请输入"
                  v-model="form.nextMaintenanceTime"
                  clearable
                  type="number"
                />
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input
                  type="textarea"
                  style="width: 100%"
                  placeholder="请输入"
                  v-model="form.remark"
                  clearable
                  maxLength="500"
                  show-word-limit
                />
              </el-form-item>
            </el-form>
          </div>
        </section>
        <section class="common-section">
          <div class="common-section-header">
            <h2>适配车型</h2>
            <el-button size="small" icon="el-icon-plus" @click="handleAddRow('cx')">添加</el-button>
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
                :delTitle="delTitle"
                :auth="{edit: canAddOrUpdate, delete: canDelete}"
              />
            </div>
          </div>
        </section>
        <section class="common-section">
          <div class="common-section-header">
            <h2>适配配件</h2>
            <el-button v-if="canAddOrUpdate" size="small" icon="el-icon-plus" @click="handleAddRow('pj')">添加</el-button>
          </div>
          <div class="common-section-body">
            <div class="common-section-table">
              <edit-table
                ref="editTablePj"
                :columns="columnsPj"
                :data="tableDataPj"
                :defaultNewRow="defaultNewRowPj"
                :show-toolbar="false"
                :options="options"
                :delTitle="delTitlePj"
                :auth="{edit: canAddOrUpdate, delete: canDelete}"
              />
            </div>
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
import { getDetail, addOrUpdate } from '@/api/maintain/basic/repairItem/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import { getEnum, listVehicleYearTypeFull, listVehicleYearType, repairItemType, sparePartList } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  name: '',
  pinyinCode: '',
  workhour: '',
  workhourPrice: '',
  maintenanceItemType: null,
  maintenanceTime: '',
  maintenanceMileage: '',
  isBatteryRepair: 0,
  isActivity: 0,
  isWarranty: 0,
  isProdType: 0,
  isReservation: 0,
  appointmentItemName: '',
  remark: '',
  repairItemTypeId: '',
  mileageInterval: '',
  timeInterval: '',
  nextMaintenanceMileage: '',
  nextMaintenanceTime: '',
};

export default {
  name: 'repairItemEdit',
  // 集中视图预留
  mixins: [routeGuard, permissions],
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  components: {
    FetchSelect,
    EditTable
  },
  data () {
    return {
      moduleKey: 'AISMC-repairItem',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      repairItemLoading: false, // 维修类型搜索加载状态
      repairItemOptions: [], // 维修类型选项列表
      repairItemTimer: null, // 维修类型搜索防抖定时器
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      defaultNewRow: {
        vehicleYearType: '',
        vehicleModelName: '',
        vehicleSeriesName: '',
        vehicleModelDesc: '',
        remark: '',
        createTime: '',
      },
      defaultNewRowPj: {
        partsCode: '',
        partsName: '',
        isOemPart: null,
        createTime: '',
      },
      tableData: [],
      tableDataPj: [],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
        vehicleYearType: [],
        vehicleModelName: [],
        partsCode: [],
      },
      delTitle: '此操作将删除此 维修项目-适配车型 信息，您无法撤消此操作，是否继续？',
      delTitlePj: '此操作将删除此 维修项目-适配配件 信息，您无法撤消此操作，是否继续？',
      columns: [ // 适配车型
        {
          field: 'vehicleYearType',
          title: '年款',
          width: '15%',
          editable: true,
          editRender: {
            name: 'ElSelect',
            props: {
              clearable: true,
              filterable: true,
              remote: true,
              'suffix-icon': 'el-icon-search',
              placeholder: '请选择年款',
              'remote-method': this.queryModelYear
            }
          },
        },
        {
          field: 'vehicleModelName',
          title: '车型',
          width: '15%',
          editable: true,
          editRender: {
            name: 'ElSelect',
            props: {
              clearable: true,
              filterable: true,
              remote: true,
              'suffix-icon': 'el-icon-search',
              placeholder: '请选择车型',
              'remote-method': this.querySearchAsync,
            }
          },
          rules: [
            { required: true, message: '车型不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'vehicleSeriesName',
          title: '车系',
          width: '15%',
          editRender: { name: 'ElInput' }
        },
        {
          field: 'vehicleModelDesc',
          title: '车型描述',
          width: '15%',
          editRender: { name: 'ElInput' }
        },
        {
          field: 'remark',
          title: '备注',
          editable: true,
          width: '15%',
          editRender: { name: 'ElInput' }
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '15%',
          editRender: { name: 'ElInput' }
        },
      ],
      columnsPj: [
        {
          field: 'partsCode',
          title: '零件代码',
          width: '20%',
          editable: true,
          editRender: {
            name: 'ElSelect',
            props: {
              clearable: true,
              filterable: true,
              remote: true,
              'suffix-icon': 'el-icon-search',
              placeholder: '请选择零件代码',
              'remote-method': this.querySpareParts,
            }
          },
          rules: [
            { required: true, message: '车型不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'partsName',
          title: '零件名称',
          width: '20%',
          editRender: { name: 'ElInput' },
        },
        {
          field: 'oemPartLabel',
          title: '是否OEM件',
          width: '20%',
          editRender: { name: 'ElInput' }
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '20%',
          editRender: { name: 'ElInput' }
        }
      ],
      rules: {
        code: [
          { required: true, message: '请输入维修项目代码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入维修项目名称', trigger: 'blur' }
        ],
        pinyinCode: [
          { required: true, message: '请输入拼音简码', trigger: 'blur' }
        ],
        workhour: [
          { required: true, message: '请输入工时', trigger: 'blur' }
        ],
        workhourPrice: [
          { required: true, message: '请输入工时单价', trigger: 'blur' }
        ],
        maintenanceItemType: [
          { required: true, message: '请选择保养项目分类', trigger: 'change' }
        ],
        maintenanceTime: [
          { required: false, message: '请选择保养时间（月）', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              // 非必填，允许为空
              if (value === null || value === undefined || value === '') {
                callback();
                return;
              }
              // 转换为数字
              const num = Number(value);
              // 检查转换是否有效
              if (isNaN(num)) {
                callback(new Error('请输入有效的数字'));
                return;
              }
              // 检查是否为整数
              if (Math.floor(num) !== num) {
                callback(new Error('请输入整数'));
                return;
              }
              // 根据需求选择条件：
              // 1. 大于0的整数：num > 0
              // 2. 大于等于0的整数：num >= 0
              if (num < 0) {
                callback(new Error('请输入大于等于0的整数'));
                return;
              }
              callback();
            },
            trigger: 'blur'
          }
        ],
        maintenanceMileage: [
          { required: false, message: '请输入保养里程（KM）', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              // 非必填，允许为空
              if (value === null || value === undefined || value === '') {
                callback();
                return;
              }
              // 转换为数字
              const num = Number(value);
              // 检查转换是否有效
              if (isNaN(num)) {
                callback(new Error('请输入有效的数字'));
                return;
              }
              // 检查是否为整数
              if (Math.floor(num) !== num) {
                callback(new Error('请输入整数'));
                return;
              }
              // 根据需求选择条件：
              // 1. 大于0的整数：num > 0
              // 2. 大于等于0的整数：num >= 0
              if (num < 0) {
                callback(new Error('请输入大于等于0的整数'));
                return;
              }
              callback();
            },
            trigger: 'blur'
          }
        ],
        isBatteryRepair: [
          { required: true, message: '请输入是否电池维修专用', trigger: 'blur' }
        ],
        isActivity: [
          { required: true, message: '请输入是否活动专用', trigger: 'blur' }
        ],
        isWarranty: [
          { required: true, message: '请输入是否保修专用', trigger: 'blur' }
        ],
        isProdType: [
          { required: true, message: '请选择是否生产类专用', trigger: 'change' }
        ],
        isReservation: [
          { required: true, message: '请输入是否预约专用', trigger: 'blur' }
        ],
        appointmentItemName: [
          { required: false, message: '请输入预约项目名称', trigger: 'blur' }
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'blur' }
        ],
        repairItemTypeId: [
          { required: false, message: '请选择维修项目类型', trigger: 'change' }
        ],
        mileageInterval: [
          { required: false, message: '请输入里程间隔计算标准', trigger: 'blur' }
        ],
        timeInterval: [
          { required: false, message: '请选择时间间隔计算标准', trigger: 'change' }
        ],
        nextMaintenanceMileage: [
          { required: false, message: '请输入下次保养计算里程', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              // 非必填，允许为空
              if (value === null || value === undefined || value === '') {
                callback();
                return;
              }
              // 转换为数字
              const num = Number(value);
              // 检查转换是否有效
              if (isNaN(num)) {
                callback(new Error('请输入有效的数字'));
                return;
              }
              // 检查是否为整数
              if (Math.floor(num) !== num) {
                callback(new Error('请输入整数'));
                return;
              }
              // 根据需求选择条件：
              // 1. 大于0的整数：num > 0
              // 2. 大于等于0的整数：num >= 0
              if (num < 0) {
                callback(new Error('请输入大于等于0的整数'));
                return;
              }
              callback();
            },
            trigger: 'blur'
          }
        ],
        nextMaintenanceTime: [
          { required: false, message: '请选择下次保养计算时间', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              // 非必填，允许为空
              if (value === null || value === undefined || value === '') {
                callback();
                return;
              }
              // 转换为数字
              const num = Number(value);
              // 检查转换是否有效
              if (isNaN(num)) {
                callback(new Error('请输入有效的数字'));
                return;
              }
              // 检查是否为整数
              if (Math.floor(num) !== num) {
                callback(new Error('请输入整数'));
                return;
              }
              // 根据需求选择条件：
              // 1. 大于0的整数：num > 0
              // 2. 大于等于0的整数：num >= 0
              if (num < 0) {
                callback(new Error('请输入大于等于0的整数'));
                return;
              }
              callback();
            },
            trigger: 'blur'
          }
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
  watch: {
    'form.isReservation': {
      handler (newVal) {
        // 动态更新验证规则
        if (Number(newVal) === 1) {
          this.rules.appointmentItemName[0].required = true;
        } else {
          this.rules.appointmentItemName[0].required = false;
          // 清除该字段的验证状态
          this.$nextTick(() => {
            this.$refs.ruleForm.clearValidate('appointmentItemName');
          });
        }
      },
      deep: true,
      immediate: true
    },
    'form.maintenanceItemType': { // 监听保养项目分类如果选择的是否 必填项
      handler (newVal) {
        // 动态更新验证规则
        if (Number(newVal) === 0) { // 后期优化此方法
          this.rules.maintenanceTime[0].required = false;
          this.rules.maintenanceMileage[0].required = false;
          this.rules.mileageInterval[0].required = false;
          this.rules.timeInterval[0].required = false;
          this.rules.nextMaintenanceMileage[0].required = false;
          this.rules.nextMaintenanceTime[0].required = false;
          // 清除该字段的验证状态
          this.$nextTick(() => {
            this.$refs.ruleForm.clearValidate('maintenanceTime');
            this.$refs.ruleForm.clearValidate('maintenanceMileage');
            this.$refs.ruleForm.clearValidate('mileageInterval');
            this.$refs.ruleForm.clearValidate('timeInterval');
            this.$refs.ruleForm.clearValidate('nextMaintenanceMileage');
            this.$refs.ruleForm.clearValidate('nextMaintenanceTime');
          });
        } else {
          this.rules.maintenanceTime[0].required = true;
          this.rules.maintenanceMileage[0].required = true;
          this.rules.mileageInterval[0].required = true;
          this.rules.timeInterval[0].required = true;
          this.rules.nextMaintenanceMileage[0].required = true;
          this.rules.nextMaintenanceTime[0].required = true;
        }
      },
      deep: true,
      immediate: true
    }
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
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['维修项目', `${id ? '编辑' : '新建'}`]);
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
          this.tableData = res.modelRespList || [];
          this.tableDataPj = res.partsRespList || [];
        });
      }
    },
    async submitForm (formName, rest = false) {
      try {
        const tableData = await this.handleSaveTable();
        const tableDataPj = await this.handleSaveTablePj();
        // 判断是否编辑数据 是的话删除详情接口所带的字段数组
        if (this.$route.query.id) {
          this.$delete(this.form, 'partsRespList');
          this.$delete(this.form, 'modelRespList');
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            addOrUpdate({ ...this.form, repairItemVehicleModelList: tableData, repairItemPartsList: tableDataPj }).then(res => {
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
      this.tableDataPj = [];
      this.form = { ...defaultForm };
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
    // 处理维修类型选择变更事件
    handleRepairItemChange (val) {
      const selectedVal = this.repairItemOptions.find(option => option.value === val);
      if (selectedVal) {
        this.form.repairItemTypeName = selectedVal.label;
      }
    },
    // 维修类型模糊搜索方法（带防抖）
    async repairItemSearch (query) {
      if (query !== '' && query.length < 2) {
        this.repairItemOptions = [];
        return;
      }

      // 防抖处理，避免频繁请求
      if (this.repairItemTimer) {
        clearTimeout(this.repairItemTimer);
      }

      this.repairItemTimer = setTimeout(async () => {
        this.repairItemLoading = true;
        try {
          // 调用搜索接口，传递搜索关键词
          const res = await repairItemType({ nameLike: query, categorys: [10] });
          if (res) {
            this.repairItemOptions = res?.map(item => ({
              value: item.id, // 维修类型ID
              label: item.name // 维修类型名称
            }));
          } else {
            this.repairItemOptions = [];
          }
        } catch (error) {
          this.repairItemOptions = [];
          this.$message.error('搜索失败');
        } finally {
          this.repairItemLoading = false;
        }
      }, 300); // 300ms防抖延迟
    },
    // 处理是否预约专用时 选择是 弹窗二次确认
    handleReservationChange (val) {
      if (this.$route.query.id) {
        if (val === 1) {
          this.$confirm('此操作将对C端APP用户预约产生影响，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

          }).catch(() => {

          });
        }
      }
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 详情表格相关数据
    handleAddRow (val) {
      // 通过引用直接调用子组件方法
      if (val === 'cx') {
        this.$refs.editTable.addRow();
      } else {
        this.$refs.editTablePj.addRow();
      }
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
    handleSaveTablePj (data) {
      // 调用保存方法并处理结果
      return new Promise((resolve, reject) => {
        this.$refs.editTablePj.saveAll().then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 年款名称远程搜索
    queryModelYear (name) {
      listVehicleYearType({ yearTypeNameLike: name, status: 1 }).then(res => {
        const list = res?.map(item => {
          return {
            ...item,
            value: item.id,
            label: item.name,
            vehicleYearType: item.name,
            vehicleYearTypeId: item.yearTypeId,
          };
        }) || [];
        this.options.vehicleYearType = list;
      });
    },
    // 车型名称远程搜索
    querySearchAsync (queryString, cb) {
      listVehicleYearTypeFull({ modelNameLike: queryString, status: 1 }).then(res => {
        const list = res?.map(item => {
          return {
            ...item,
            value: item.id,
            label: item.modelName,
            vehicleModelId: item.id,
            vehicleModelName: item.modelName,
            vehicleSeriesId: item.seriesId,
            vehicleSeriesName: item.seriesName,
            vehicleModelDesc: item.remark,
          };
        }) || [];
        this.options.vehicleModelName = list;
      });
    },
    // 备件主数据表列表查询
    querySpareParts (queryString, cb) {
      sparePartList({ partCodeOrNameLike: queryString, status: 1, limitSize: 20 }).then(res => {
        const list = res?.map(item => {
          let label = item.partCode || '';
          if (item.partName) {
            label += `- ${item.partName}`;
          }
          return {
            ...item,
            value: item.id,
            label: label,
            partsId: item.id,
            partsName: item.partName,
            partsCode: item.partCode,
            isOemPart: item.oemPart,
            oemPartLabel: item.oemPartLabel,
          };
        }) || [];
        this.options.partsCode = list;
      });
    },
  }
};
</script>
