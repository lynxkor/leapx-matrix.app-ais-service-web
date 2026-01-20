<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <span class="status primary">状态</span>
        </template>
        <template #extraButtons>
          <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="接车施工单id：" prop="serviceProxyId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.serviceProxyId"
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
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="开单时间：" prop="orderTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.orderTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="维修完工时间：" prop="repairFinishTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.repairFinishTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="VIN码：" prop="vehProfileVin">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehProfileVin"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车牌号：" prop="carPlate">
                  <el-input
                    placeholder="请输入"
                    v-model="form.carPlate"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="基本车型：" prop="vehModelName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehModelName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="进店里程数：" prop="mileage">
                  <el-input
                    placeholder="请输入"
                    v-model="form.mileage"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车联网里程数（增）：" prop="netMileageExtend">
                  <el-input
                    placeholder="请输入"
                    v-model="form.netMileageExtend"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="客户故障描述：" prop="customerFaultDescription">
                  <el-input
                    placeholder="请输入"
                    v-model="form.customerFaultDescription"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="客户经理建议：" prop="managerSuggestion">
                  <el-input
                    placeholder="请输入"
                    v-model="form.managerSuggestion"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="客户诉求：" prop="customerRequest">
                  <el-input
                    placeholder="请输入"
                    v-model="form.customerRequest"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="整车档案id：" prop="vehProfileId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehProfileId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.createTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="主键：" prop="id">
                  <el-input
                    placeholder="请输入"
                    v-model="form.id"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creatorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifier"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifierName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.updateTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statusDesc"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="归属门店ID（组织ID），当数据权限归属到本组织以及本下级：" prop="ownerOrgId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.ownerOrgId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="基本车型id：" prop="vehModelId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehModelId"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="接车施工单id：" prop="serviceProxyId">
                  {{ form.serviceProxyId }}
                </el-form-item>
                <el-form-item label="接车施工单：" prop="serviceProxyCode">
                  {{ form.serviceProxyCode }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="开单时间：" prop="orderTime">
                  {{ form.orderTime }}
                </el-form-item>
                <el-form-item label="维修完工时间：" prop="repairFinishTime">
                  {{ form.repairFinishTime }}
                </el-form-item>
                <el-form-item label="VIN码：" prop="vehProfileVin">
                  {{ form.vehProfileVin }}
                </el-form-item>
                <el-form-item label="车牌号：" prop="carPlate">
                  {{ form.carPlate }}
                </el-form-item>
                <el-form-item label="基本车型：" prop="vehModelName">
                  {{ form.vehModelName }}
                </el-form-item>
                <el-form-item label="进店里程数：" prop="mileage">
                  {{ form.mileage }}
                </el-form-item>
                <el-form-item label="车联网里程数（增）：" prop="netMileageExtend">
                  {{ form.netMileageExtend }}
                </el-form-item>
                <el-form-item label="客户故障描述：" prop="customerFaultDescription">
                  {{ form.customerFaultDescription }}
                </el-form-item>
                <el-form-item label="客户经理建议：" prop="managerSuggestion">
                  {{ form.managerSuggestion }}
                </el-form-item>
                <el-form-item label="客户诉求：" prop="customerRequest">
                  {{ form.customerRequest }}
                </el-form-item>
                <el-form-item label="整车档案id：" prop="vehProfileId">
                  {{ form.vehProfileId }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
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
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="归属门店ID（组织ID），当数据权限归属到本组织以及本下级：" prop="ownerOrgId">
                  {{ form.ownerOrgId }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="基本车型id：" prop="vehModelId">
                  {{ form.vehModelId }}
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
import { getDetail, addOrUpdate } from '@/api/datacenter/vehicle/serviceProxyHis/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  serviceProxyId: '',
  serviceProxyCode: '',
  dealerName: '',
  orderTime: '',
  repairFinishTime: '',
  vehProfileVin: '',
  carPlate: '',
  vehModelName: '',
  mileage: '',
  netMileageExtend: '',
  customerFaultDescription: '',
  managerSuggestion: '',
  customerRequest: '',
  vehProfileId: '',
  createTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  ownerOrgId: '',
  dealerCode: '',
  vehModelId: '',
};

export default {
  name: 'serviceProxyHisEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
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
      pageTitle: '接车施工单-维修履历信息管理',
      pageType: 'edit',
      title: '接车施工单id：' + form.serviceProxyId,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-serviceProxyHis',
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
        serviceProxyId: [
          { required: true, message: '请输入接车施工单id', trigger: 'change' }
        ],
        serviceProxyCode: [
          { required: true, message: '请输入接车施工单', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'change' }
        ],
        orderTime: [
          { required: true, message: '请选择开单时间', trigger: 'change' }
        ],
        repairFinishTime: [
          { required: true, message: '请选择维修完工时间', trigger: 'change' }
        ],
        vehProfileVin: [
          { required: true, message: '请输入VIN码', trigger: 'change' }
        ],
        carPlate: [
          { required: true, message: '请输入车牌号', trigger: 'change' }
        ],
        vehModelName: [
          { required: true, message: '请输入基本车型', trigger: 'change' }
        ],
        mileage: [
          { required: true, message: '请输入进店里程数', trigger: 'change' }
        ],
        netMileageExtend: [
          { required: true, message: '请输入车联网里程数（增）', trigger: 'change' }
        ],
        customerFaultDescription: [
          { required: true, message: '请输入客户故障描述', trigger: 'change' }
        ],
        managerSuggestion: [
          { required: true, message: '请输入客户经理建议', trigger: 'change' }
        ],
        customerRequest: [
          { required: true, message: '请输入客户诉求', trigger: 'change' }
        ],
        vehProfileId: [
          { required: true, message: '请输入整车档案id', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
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
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        ownerOrgId: [
          { required: true, message: '请输入归属门店ID（组织ID），当数据权限归属到本组织以及本下级', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        vehModelId: [
          { required: true, message: '请输入基本车型id', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
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
    }
  }
};
</script>
