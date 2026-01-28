<template>
    <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
      <template #left>
        <div class="page-common-edit">
          <el-container>
            <el-main>
              <section class="common-title" v-if="_id">
                <div>
                  <h2>出库单号：{{ form.code }}</h2>
                  <!-- TIPS: 子标题格式如下 -->
                  <!-- <h5>活动编码：{{ form.activityCode }}</h5> -->
                </div>
                <!-- <div v-if="isEditing">
                  <el-button size="small" @click="handleCancel">取消</el-button>
                  <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
                </div>
                <div v-else>
                  <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
                </div> -->
              </section>
              <section class="common-section">
                <div class="common-section-header">
                  <h2>基础信息</h2>
                </div>
                <div class="common-section-body">
                  <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
                  <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-if="isEditing || !_id">
                    <el-form-item label="出库单号：" prop="code">
                      <el-input
                        placeholder="请输入"
                        v-model="form.code"
                        clearable
                        disabled
                      />
                    </el-form-item>
                    <el-form-item label="门店编码：" prop="dealerCode">
                      <el-input
                        placeholder="请输入"
                        v-model="form.dealerCode"
                        clearable
                      />
                    </el-form-item>
                    <el-form-item label="入库状态：" prop="returnMaterialStatus">
                      <fetch-select
                        :request="fetchOptions"
                        enumCode="xxx"
                        v-model="form.returnMaterialStatus"
                        placeholder="请选择"
                        clearable
                        filterable
                      />
                    </el-form-item>
                    <el-form-item label="门店名称：" prop="dealerName">
                      <el-input
                        placeholder="请输入"
                        v-model="form.dealerName"
                        clearable
                      />
                    </el-form-item>
                    <el-form-item label="备件仓库：" prop="warehouseId">
                      <el-input
                        placeholder="请输入"
                        v-model="form.warehouseId"
                        clearable
                      />
                    </el-form-item>
                    <el-form-item label="接车施工单：" prop="serviceProxyCode">
                      <el-input
                        placeholder="请输入"
                        v-model="form.serviceProxyCode"
                        clearable
                      />
                    </el-form-item>
                    <el-form-item label="备注：" prop="remark">
                      <el-input
                        placeholder="请输入"
                        v-model="form.remark"
                        clearable
                      />
                    </el-form-item>
                  </el-form>
                  <el-form :inline="true" class="form-detail" v-else>
                    <el-form-item label="出库单号：" prop="code">
                      {{ form.code }}
                    </el-form-item>
                    <el-form-item label="门店编码：" prop="dealerCode">
                      {{ form.dealerCode }}
                    </el-form-item>
                    <el-form-item label="入库状态：" prop="returnMaterialStatusLabel">
                      {{ form.returnMaterialStatusLabel }}
                    </el-form-item>
                    <el-form-item label="门店名称：" prop="dealerName">
                      {{ form.dealerName }}
                    </el-form-item>
                    <el-form-item label="备件仓库：" prop="warehouseName">
                      {{ form.warehouseName }}
                    </el-form-item>
                    <el-form-item label="接车施工单：" prop="serviceProxyId">
                      {{ form.serviceProxyId }}
                    </el-form-item>
                    <el-form-item label="备注：" prop="remark">
                      {{ form.remark }}
                    </el-form-item>
                    <el-form-item label="客户经理：" prop="remark">
                      {{ form.username }}
                    </el-form-item>
                  </el-form>
                </div>
              </section>
              <section class="common-section">
                <div class="common-section-header">
                  <h2>退料明细信息</h2>
                </div>
                <div class="common-section-body">
                  <div class="common-section-table">
                    <edit-table
                      ref="editTable"
                      :columns="columnsTl"
                      :data="goTableData"
                      :show-toolbar="false"
                      :isFocusNewRow="false"
                      :showPagination="true"
                      :current="goParams.current"
                      :pageSize="goParams.pageSize"
                      :total="goParams.total"
                      @page-size-change="goPageSize"
                      @current-page-change="goCurrentPage"
                    />
                  </div>
                </div>
              </section>
              <section class="common-section">
                <div class="common-section-header">
                  <h2>出库明细信息</h2>
                </div>
                <div class="common-section-body">
                  <div class="common-section-table">
                    <edit-table
                      ref="editTable"
                      :columns="columns"
                      :data="tableData"
                      :show-toolbar="false"
                      :isFocusNewRow="false"
                      :showPagination="true"
                      :current="collarParams.current"
                      :pageSize="collarParams.pageSize"
                      :total="collarParams.total"
                      @page-size-change="pageSizeChange"
                      @current-page-change="currentPageChange"
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
import { getDetail, addOrUpdate, collarPage, goPage } from '@/api/sparepart/inbound/maintenanceReturnInbound/index';
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
  maintenanceOutboundOrderCode: '',
  dealerCode: '',
  dealerName: '',
  warehouseId: '',
  serviceProxyId: '',
  vehProfileVin: '',
  carPlate: '',
  outboundStatus: '',
  remark: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  returnMaterialStatus: '',
};

export default {
  name: 'maintenanceReturnInboundEdit',
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
      pageTitle: '维修退料入库',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-maintenanceReturnInbound',
      isEditing: false,
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      // 退料列表
      goTableData: [],
      goParams: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      // 出库列表
      collarParams: {
        current: 1,
        pageSize: 10,
        total: 0,
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
          field: 'sparePartCode',
          title: '备件编码',
          width: '8%',
        },
        {
          field: 'sparePartName',
          title: '备件名称',
          width: '8%',
        },
        {
          field: 'locationName',
          title: '库位',
          width: '8%',
        },
        {
          field: 'availableQty',
          title: '可用库存',
          width: '8%',
        },
        {
          field: 'outboundQty',
          title: '出库数量',
          width: '8%',
        },
        {
          field: 'price',
          title: '单价',
          width: '8%',
        },
        {
          field: 'discountAmount',
          title: '优惠金额',
          width: '8%',
        },
        {
          field: 'partsAmount',
          title: '应付金额',
          width: '8%',
        },
        {
          field: 'costUnitPrice',
          title: '成本价格',
          width: '8%',
        },
        {
          field: 'outboundIsLabel',
          title: '是否出库',
          width: '8%',
        },
        {
          field: 'picker',
          title: '领料人',
          width: '8%',
        },
        {
          field: 'pickTime',
          title: '领料日期',
          width: '8%',
        },
        {
          field: 'remark',
          title: '备注',
          width: '8%',
        },
      ],
      columnsTl: [
        {
          field: 'sparePartCode',
          title: '备件编码',
          width: '9%',
        },
        {
          field: 'sparePartName',
          title: '备件名称',
          width: '9%',
        },
        {
          field: 'locationName',
          title: '库位',
          width: '9%',
        },
        {
          field: 'returnApplicationQty',
          title: '退料申请数量',
          width: '9%',
        },
        {
          field: 'returnApplicationReason',
          title: '退料原申请因',
          width: '9%',
        },
        {
          field: 'returnApplicant',
          title: '退料申请人',
          width: '9%',
        },
        {
          field: 'returnApplicationTime',
          title: '退料申请时间',
          width: '9%',
        },
        {
          field: 'inboundIsLabel',
          title: '是否已入库',
          width: '9%',
        },
        {
          field: 'returnWarehousingOperator',
          title: '退料入库人',
          width: '9%',
        },
        {
          field: 'returnWarehousingTime',
          title: '退料入库时间',
          width: '9%',
        },
        {
          field: 'remark',
          title: '备注',
          width: '9%',
        },
      ],
      rules: {
        maintenanceOutboundOrderCode: [
          { required: true, message: '请输入维修出库单编号', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'change' }
        ],
        warehouseId: [
          { required: true, message: '请输入仓库ID', trigger: 'change' }
        ],
        serviceProxyId: [
          { required: true, message: '请输入接车施工单ID', trigger: 'change' }
        ],
        vehProfileVin: [
          { required: true, message: '请输入vin码', trigger: 'change' }
        ],
        carPlate: [
          { required: true, message: '请输入车牌号', trigger: 'change' }
        ],
        outboundStatus: [
          { required: true, message: '请选择出库状态', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    this.getDetailData();
    this.getCollar();
    this.getOut();
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
                    path: '/sparepart/outbound/maintenanceOutboundOrder/edit',
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
    },
    // 入库明细信息
    async getCollar () {
      const params = {
        pageNum: this.collarParams.current,
        pageSize: this.collarParams.pageSize,
        maintenanceOutboundOrderId: this.$route.query.id
      };
      const res = await collarPage(params);
      this.tableData = res.records || [];
      this.total = res.total || 0;
    },
    pageSizeChange (pageSize) { // 多个相同方法 没优化 等后端给我提供数据 再来优化
      this.collarParams.pageSize = pageSize;
      this.collarParams.current = 1;
      this.getCollar();
    },
    currentPageChange (current) {
      this.collarParams.current = current;
      this.getCollar();
    },
    // 出库明细信息
    async getOut () {
      const params = {
        pageNum: this.goParams.current,
        pageSize: this.goParams.pageSize,
        maintenanceOutboundOrderId: this.$route.query.id
      };
      const res = await goPage(params);
      this.goTableData = res.records || [];
      this.total = res.total || 0;
    },
    goPageSize (pageSize) {
      this.goParams.pageSize = pageSize;
      this.goParams.current = 1;
      this.getOut();
    },
    goCurrentPage (current) {
      this.goParams.current = current;
      this.getOut();
    },
  }
};
</script>
