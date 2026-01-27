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
                <el-form-item label="作业状态：" prop="status">
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
                <el-form-item label="接车施工单：" prop="serviceProxyId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.serviceProxyId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="编号：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="维修项目ID：" prop="repairItemId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.repairItemId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="维修项目代码：" prop="repairItemCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.repairItemCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="维修项目名称：" prop="repairItemName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.repairItemName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否已派工：" prop="isDispatch">
                  <el-input
                    placeholder="请输入"
                    v-model="form.isDispatch"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="工位id：" prop="dealerStationId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerStationId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="工位：" prop="dealerStationName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerStationName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="班组信息id：" prop="dealerWorkTeamId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerWorkTeamId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="班组信息：" prop="dealerWorkTeamName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerWorkTeamName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="维修技师：" prop="repairTechnicianId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.repairTechnicianId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="维修技师：" prop="repairTechnicianName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.repairTechnicianName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="派工时间：" prop="dispatchTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.dispatchTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="计划作业开始时间：" prop="startAt">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.startAt"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="实际作业时间：" prop="timeSpend">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.timeSpend"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="作业结束时间：" prop="finishAt">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.finishAt"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="是否内返：" prop="rework">
                  <el-input
                    placeholder="请输入"
                    v-model="form.rework"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="返修类型：" prop="reworkType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.reworkType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="质检人：" prop="qualityCheckerId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.qualityCheckerId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="质检人：" prop="qualityCheckerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.qualityCheckerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="质检时间：" prop="qualityCheckAt">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.qualityCheckAt"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="质检状态：" prop="qualityCheckStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.qualityCheckStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="是否已返修：" prop="hasRepaired">
                  <el-input
                    placeholder="请输入"
                    v-model="form.hasRepaired"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="主键：" prop="id">
                  {{ form.id }}
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  {{ form.creator }}
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
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
                <el-form-item label="作业状态：" prop="status">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="接车施工单：" prop="serviceProxyId">
                  {{ form.serviceProxyId }}
                </el-form-item>
                <el-form-item label="编号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="维修项目ID：" prop="repairItemId">
                  {{ form.repairItemId }}
                </el-form-item>
                <el-form-item label="维修项目代码：" prop="repairItemCode">
                  {{ form.repairItemCode }}
                </el-form-item>
                <el-form-item label="维修项目名称：" prop="repairItemName">
                  {{ form.repairItemName }}
                </el-form-item>
                <el-form-item label="是否已派工：" prop="isDispatch">
                  {{ form.isDispatch }}
                </el-form-item>
                <el-form-item label="工位id：" prop="dealerStationId">
                  {{ form.dealerStationId }}
                </el-form-item>
                <el-form-item label="工位：" prop="dealerStationName">
                  {{ form.dealerStationName }}
                </el-form-item>
                <el-form-item label="班组信息id：" prop="dealerWorkTeamId">
                  {{ form.dealerWorkTeamId }}
                </el-form-item>
                <el-form-item label="班组信息：" prop="dealerWorkTeamName">
                  {{ form.dealerWorkTeamName }}
                </el-form-item>
                <el-form-item label="维修技师：" prop="repairTechnicianId">
                  {{ form.repairTechnicianId }}
                </el-form-item>
                <el-form-item label="维修技师：" prop="repairTechnicianName">
                  {{ form.repairTechnicianName }}
                </el-form-item>
                <el-form-item label="派工时间：" prop="dispatchTime">
                  {{ form.dispatchTime }}
                </el-form-item>
                <el-form-item label="计划作业开始时间：" prop="startAt">
                  {{ form.startAt }}
                </el-form-item>
                <el-form-item label="实际作业时间：" prop="timeSpend">
                  {{ form.timeSpend }}
                </el-form-item>
                <el-form-item label="作业结束时间：" prop="finishAt">
                  {{ form.finishAt }}
                </el-form-item>
                <el-form-item label="是否内返：" prop="rework">
                  {{ form.rework }}
                </el-form-item>
                <el-form-item label="返修类型：" prop="reworkType">
                  {{ form.reworkType }}
                </el-form-item>
                <el-form-item label="质检人：" prop="qualityCheckerId">
                  {{ form.qualityCheckerId }}
                </el-form-item>
                <el-form-item label="质检人：" prop="qualityCheckerName">
                  {{ form.qualityCheckerName }}
                </el-form-item>
                <el-form-item label="质检时间：" prop="qualityCheckAt">
                  {{ form.qualityCheckAt }}
                </el-form-item>
                <el-form-item label="质检状态：" prop="qualityCheckStatus">
                  {{ form.qualityCheckStatus }}
                </el-form-item>
                <el-form-item label="是否已返修：" prop="hasRepaired">
                  {{ form.hasRepaired }}
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
import { getDetail, addOrUpdate } from '@/api/maintain/sp/spRepairWorkRecord/index';
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
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  serviceProxyId: '',
  code: '',
  repairItemId: '',
  repairItemCode: '',
  repairItemName: '',
  isDispatch: '',
  dealerStationId: '',
  dealerStationName: '',
  dealerWorkTeamId: '',
  dealerWorkTeamName: '',
  repairTechnicianId: '',
  repairTechnicianName: '',
  dispatchTime: '',
  startAt: '',
  timeSpend: '',
  finishAt: '',
  rework: '',
  reworkType: '',
  qualityCheckerId: '',
  qualityCheckerName: '',
  qualityCheckAt: '',
  qualityCheckStatus: '',
  hasRepaired: '',
};

export default {
  name: 'spRepairWorkRecordEdit',
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
      pageTitle: '接车施工单-维修作业记录表管理',
      pageType: 'edit',
      title: '主键：' + form.id,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-spRepairWorkRecord',
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
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
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
          { required: true, message: '请选择作业状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        serviceProxyId: [
          { required: true, message: '请输入接车施工单', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入编号', trigger: 'change' }
        ],
        repairItemId: [
          { required: true, message: '请输入维修项目ID', trigger: 'change' }
        ],
        repairItemCode: [
          { required: true, message: '请输入维修项目代码', trigger: 'change' }
        ],
        repairItemName: [
          { required: true, message: '请输入维修项目名称', trigger: 'change' }
        ],
        isDispatch: [
          { required: true, message: '请输入是否已派工', trigger: 'change' }
        ],
        dealerStationId: [
          { required: true, message: '请输入工位id', trigger: 'change' }
        ],
        dealerStationName: [
          { required: true, message: '请输入工位', trigger: 'change' }
        ],
        dealerWorkTeamId: [
          { required: true, message: '请输入班组信息id', trigger: 'change' }
        ],
        dealerWorkTeamName: [
          { required: true, message: '请输入班组信息', trigger: 'change' }
        ],
        repairTechnicianId: [
          { required: true, message: '请输入维修技师', trigger: 'change' }
        ],
        repairTechnicianName: [
          { required: true, message: '请输入维修技师', trigger: 'change' }
        ],
        dispatchTime: [
          { required: true, message: '请选择派工时间', trigger: 'change' }
        ],
        startAt: [
          { required: true, message: '请选择计划作业开始时间', trigger: 'change' }
        ],
        timeSpend: [
          { required: true, message: '请选择实际作业时间', trigger: 'change' }
        ],
        finishAt: [
          { required: true, message: '请选择作业结束时间', trigger: 'change' }
        ],
        rework: [
          { required: true, message: '请输入是否内返', trigger: 'change' }
        ],
        reworkType: [
          { required: true, message: '请选择返修类型', trigger: 'change' }
        ],
        qualityCheckerId: [
          { required: true, message: '请输入质检人', trigger: 'change' }
        ],
        qualityCheckerName: [
          { required: true, message: '请输入质检人', trigger: 'change' }
        ],
        qualityCheckAt: [
          { required: true, message: '请选择质检时间', trigger: 'change' }
        ],
        qualityCheckStatus: [
          { required: true, message: '请选择质检状态', trigger: 'change' }
        ],
        hasRepaired: [
          { required: true, message: '请输入是否已返修', trigger: 'change' }
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
