<template>
  <!-- TIPS: 如果填写项小于15项，使用类名page-common-add替换page-common-edit -->
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
                />
              </el-form-item>
              <el-form-item label="判断依据" prop="judgmentBasis">
                <el-input
                  placeholder="请输入"
                  v-model="form.judgmentBasis"
                  clearable
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
                />
              </el-form-item>
              <el-form-item label="预警车龄止（天）" prop="warningVehicleAgeTo">
                <el-input
                  placeholder="请输入"
                  v-model="form.warningVehicleAgeTo"
                  clearable
                />
              </el-form-item>
              <el-form-item label="预警里程起（天）" prop="warningMileageFrom">
                <el-input
                  placeholder="请输入"
                  v-model="form.warningMileageFrom"
                  clearable
                />
              </el-form-item>
              <el-form-item label="预警里程止（天）" prop="warningMileageTo">
                <el-input
                  placeholder="请输入"
                  v-model="form.warningMileageTo"
                  clearable
                />
              </el-form-item>
              <el-form-item label="绿色预警区间1" prop="greenWarning1">
                <el-input
                  placeholder="请输入"
                  v-model="form.greenWarning1"
                  clearable
                />
              </el-form-item>
              <el-form-item label="绿色预警区间2" prop="greenWarning2">
                <el-input
                  placeholder="请输入"
                  v-model="form.greenWarning2"
                  clearable
                />
              </el-form-item>
              <el-form-item label="黄色预警区间2" prop="yellowWarning2">
                <el-input
                  placeholder="请输入"
                  v-model="form.yellowWarning2"
                  clearable
                />
              </el-form-item>
              <el-form-item label="黄色预警区间1" prop="yellowWarning1">
                <el-input
                  placeholder="请输入"
                  v-model="form.yellowWarning1"
                  clearable
                />
              </el-form-item>
              <el-form-item label="红色预警区间1" prop="redWarning1">
                <el-input
                  placeholder="请输入"
                  v-model="form.redWarning1"
                  clearable
                />
              </el-form-item>
              <el-form-item label="红色预警区间2" prop="redWarning2">
                <el-input
                  placeholder="请输入"
                  v-model="form.redWarning2"
                  clearable
                />
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input
                  placeholder="请输入"
                  v-model="form.remark"
                  clearable
                />
              </el-form-item>
              <el-form-item label="警示条款" prop="reminderItem">
                <el-input
                  placeholder="请输入"
                  v-model="form.reminderItem"
                  clearable
                />
              </el-form-item>
              <el-form-item label="警示内容" prop="reminderContent">
                <el-input
                  placeholder="请输入"
                  v-model="form.reminderContent"
                  clearable
                />
              </el-form-item>
              <el-form-item label="预警内容" prop="warningContent">
                <el-input
                  placeholder="请输入"
                  v-model="form.warningContent"
                  clearable
                />
              </el-form-item>
            </el-form>
          </div>
        </section>
        <section class="common-section">
          <div class="common-section-header">
            <h2>零件明细</h2>
            <el-button v-if="canAddOrUpdate" size="small" @click="handleAddRow"
              ><i class="iconfont icon-lxppc-plus"></i>添加</el-button
            >
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
              />
              <!-- :isFocusNewRow="false"
                @remove-row="handleRemoveRow" -->
            </div>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button
          v-if="canAddOrUpdate"
          size="small"
          type="primary"
          @click="submitForm('ruleForm')"
          :loading="submitLoading"
          >保存</el-button
        >
        <el-button
          size="small"
          type="primary"
          @click="submitForm('ruleForm', true)"
          >保存并下一个</el-button
        >
        <!-- <el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
        <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import {
  getDetail,
  addOrUpdate,
  getDetailPage,
} from "@/api/claimreturn/claim/basic/threeGuaranteesRule";
import FetchSelect from "@/libs/components/FetchSelect";
import EditTable from "@/libs/components/EditTable";
import { getEnum, sparePartListShort } from "@/api/common";
import { YES_NO_ENUM } from "@/libs/constants";
import routeGuard from "@/libs/mixins/routeGuard";
import permissions from "@/libs/mixins/permissions";
import commonMixins from "@/libs/mixins/commonMixins";
import { numberRule } from "@/validation/rule";

const defaultForm = {
  // 多选时字段有变化，自行修复
  ruleCode: "",
  judgmentBasis: "",
  determineUnit: "",
  accumulation: "",
  vehicleProperty: "",
  saleStartDate: "",
  saleEndDate: "",
  warningVehicleAgeFrom: "",
  warningVehicleAgeTo: "",
  warningMileageFrom: "",
  warningMileageTo: "",
  greenWarning1: "",
  greenWarning2: "",
  yellowWarning2: "",
  yellowWarning1: "",
  redWarning1: "",
  redWarning2: "",
  status: "",
  createTime: "",
  updateTime: "",
  id: "",
  creator: "",
  creatorName: "",
  modifier: "",
  modifierName: "",
  remark: "",
  statusDesc: "",
  dataSource: "",
  reminderItem: "",
  reminderContent: "",
  warningContent: "",
  details: "",
};

export default {
  name: "threeGuaranteesRuleEdit",
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null,
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
    EditTable,
  },
  data() {
    const form = this.getDefautlForm();
    return {
      pageTitle: "三包配置规则",
      pageType: "edit",
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: "AISCR-threeGuaranteesRule",
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        partId: "", // 零件id
        partName: "", // 零件名称
        remark: "", // 备注
      },
      tableData: [],
      options: {
        partId: [],
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: "partId",
          title: "零件编码",
          width: "33%",
          editable: true,
          editRender: {
            name: "ElSelect",
            multiRow: true,
            props: {
              filterable: true,
              clearable: true,
              remote: true,
              remoteMethod: this.sparePartListApi,
              placeholder: "请选择",
              "suffix-icon": "el-icon-search",
            },
          },
          rules: [
            { required: true, message: "零件编码不能为空", trigger: "blur" },
          ],
        },
        {
          field: "partName",
          title: "零件名称",
          width: "33%",
        },
        {
          field: "remark",
          title: "备注",
          width: "33%",
          editable: true,
          editRender: { name: "ElInput" },
        },
      ],
      rules: {
        ruleCode: [
          { required: true, message: "请输入三包规则编码", trigger: "blur" },
        ],
        judgmentBasis: [
          { required: true, message: "请输入判断依据", trigger: "blur" },
        ],
        determineUnit: [
          {
            required: true,
            message: "请输入判断单位（次数，天数）",
            trigger: "blur",
          },
        ],
        accumulation: [
          {
            required: true,
            message: "请输入累计方式（单一零件，任意零件）",
            trigger: "blur",
          },
        ],
        vehicleProperty: [
          {
            required: true,
            message:
              "请输入车辆属性（家用，营运，B级车，J级车，J1级车，专车，报废灭失）",
            trigger: "blur",
          },
        ],
        saleStartDate: [
          { required: true, message: "请输入销售开始日期", trigger: "blur" },
        ],
        saleEndDate: [
          { required: true, message: "请输入销售结束日期", trigger: "blur" },
        ],
        warningVehicleAgeFrom: [
          { required: true, message: "请输入预警车龄起", trigger: "blur" },
          numberRule,
        ],
        warningVehicleAgeTo: [
          { required: true, message: "请输入预警车龄止", trigger: "blur" },
          numberRule,
        ],
        warningMileageFrom: [
          { required: true, message: "请输入预警里程起", trigger: "blur" },
          numberRule,
        ],
        warningMileageTo: [
          { required: true, message: "请输入预警里程止", trigger: "blur" },
          numberRule,
        ],
        greenWarning1: [
          // { required: true, message: '请输入绿色预警区间1', trigger: 'blur' },
          numberRule,
        ],
        greenWarning2: [
          // { required: true, message: '请输入绿色预警区间2', trigger: 'blur' },
          numberRule,
        ],
        yellowWarning2: [
          // { required: true, message: '请输入黄色预警区间2', trigger: 'blur' },
          numberRule,
        ],
        yellowWarning1: [
          // { required: true, message: '请输入黄色预警区间1', trigger: 'blur' },
          numberRule,
        ],
        redWarning1: [
          // { required: true, message: '请输入红色预警区间1', trigger: 'blur' },
          numberRule,
        ],
        redWarning2: [
          // { required: true, message: '请输入红色预警区间2', trigger: 'blur' },
          numberRule,
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        createTime: [
          { required: true, message: "请选择创建时间", trigger: "change" },
        ],
        updateTime: [
          { required: true, message: "请选择修改时间", trigger: "change" },
        ],
        id: [{ required: true, message: "请输入主键", trigger: "blur" }],
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }],
        statusDesc: [
          { required: true, message: "请选择状态变更描述", trigger: "change" },
        ],
        reminderItem: [
          { required: true, message: "请输入警示条款", trigger: "blur" },
        ],
        reminderContent: [
          { required: true, message: "请输入警示内容", trigger: "blur" },
        ],
        warningContent: [
          { required: true, message: "请输入预警内容", trigger: "blur" },
        ],
        details: [{ required: true, message: "请输入明细", trigger: "blur" }],
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  mounted() {
    this.getDetailData();
  },
  methods: {
    handleBack() {
      this.$router.back();
    },
    getDetailData() {
      const id = this.id || this.$route.query.id;
      this.$store.commit("SET_ACTIVE_BREADCRUMB", [
        "三包配置规则",
        `${id ? "编辑" : "新建"}`,
      ]);
      if (id) {
        getDetail(id).then((res) => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);

          this.getDetailPageApi(this.originalForm.id);
        });
      }
    },
    // 表格数据
    getDetailPageApi(id) {
      if (!id) {
        return;
      }
      getDetailPage({ id }).then((res) => {
        this.tableData = res.records;
        // res =
        //  {
        //   "pageNum": 1,
        //   "pageSize": 10,
        //   "total": 0,
        //   "totalPage": 0,
        //   "code": 200,
        //   "msg": "success",
        //   "records": [],
        //   "totals": 0,
        //   "current": 1
        // },
      });
    },
    // 零件编码名称搜索
    sparePartListApi(query) {
      sparePartListShort({ partCodeOrNameLike: query }).then((data) => {
        const list = data.map((item) => {
          return {
            ...item,
            value: item.id,
            label: item.code,
            labelDesc: item.name,
            partId: item.code,
            partName: item.name,
          };
        });
        this.options.partId = list;
      });
    },
    async submitForm(formName, rest = false) {
      try {
        const tableData = await this.handleSaveTable();
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitLoading = true;
            // TIPS: customKey 根据接口格式修改
            addOrUpdate({ ...this.form, customKey: tableData })
              .then((res) => {
                this.$message({
                  message: "保存成功",
                  type: "success",
                });
                const id = this.$route.query.id;
                if (rest || !id) {
                  this.resetForm(formName);
                } else {
                  this.getDetailData();
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.tableData = [];
      this.form = this.getDefautlForm();
    },
    getDefautlForm() {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm,
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
    handleAddRow() {
      // 通过引用直接调用子组件方法
      this.$refs.editTable.addRow();
    },
    handleRemoveRow(row, index) {
      console.log(row, index);
    },
    handleSaveTable(data) {
      // 调用保存方法并处理结果
      return new Promise((resolve, reject) => {
        this.$refs.editTable
          .saveAll()
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    async fetchOptions(code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // --------------------------------------------------------------
    // 处理更新表格数据事件
    handleUpdateTableData(data) {
      this.tableData = [...data];
    },
  },
};
</script>
