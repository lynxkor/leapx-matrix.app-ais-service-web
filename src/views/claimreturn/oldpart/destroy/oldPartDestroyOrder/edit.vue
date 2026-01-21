<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="`旧件销毁单号：${form.destroyOrderNo}`"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
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
                <el-form-item label="销毁审批人ID：" prop="approverId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.approverId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店销毁单号，DA-默认编码规则，如：DA25112113341772954：" prop="destroyOrderNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.destroyOrderNo"
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
                <el-form-item label="销毁单状态，如：草稿、待审批、已批准、已销毁：" prop="destroyStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.destroyStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="销毁人：" prop="destroyerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.destroyerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销毁日期：" prop="destroyDate">
                  <el-input
                    placeholder="请输入"
                    v-model="form.destroyDate"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销毁说明：" prop="destroyRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.destroyRemark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销毁审批人：" prop="approverName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.approverName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销毁审批说明：" prop="approveRemark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.approveRemark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="销毁审批日期：" prop="approveDate">
                  <el-input
                    placeholder="请输入"
                    v-model="form.approveDate"
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
                <el-form-item label="数据来源，150:新销服; 老销服:10：" prop="dataSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataSource"
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
                <el-form-item label="销毁人ID：" prop="destroyerId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.destroyerId"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="旧件销毁单号：" prop="destroyOrderNo">
                  {{ form.destroyOrderNo }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="销毁单状态：" prop="destroyStatusLabel">
                  {{ form.destroyStatusLabel }}
                </el-form-item>
                <el-form-item label="销毁人：" prop="destroyerName">
                  {{ form.destroyerName }}
                </el-form-item>
                <el-form-item label="销毁日期：" prop="destroyDate">
                  {{ form.destroyDate }}
                </el-form-item>
                <el-form-item label="销毁说明：" prop="destroyRemark">
                  {{ form.destroyRemark }}
                </el-form-item>
                <el-form-item label="销毁审批人：" prop="approverName">
                  {{ form.approverName }}
                </el-form-item>
                <el-form-item label="销毁审批日期：" prop="approveDate">
                  {{ form.approveDate }}
                </el-form-item>
                <el-form-item label="销毁审批说明：" prop="approveRemark">
                  {{ form.approveRemark }}
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
import { getDetail, addOrUpdate } from '@/api/claimreturn/oldpart/destroy/oldPartDestroyOrder/index';
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
  approverId: '',
  destroyOrderNo: '',
  dealerName: '',
  destroyStatus: '',
  destroyerName: '',
  destroyDate: '',
  destroyRemark: '',
  approverName: '',
  approveRemark: '',
  approveDate: '',
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
  dataSource: '',
  dealerCode: '',
  destroyerId: '',
};

export default {
  name: 'oldPartDestroyOrderEdit',
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
      pageTitle: '旧件销毁单',
      pageType: 'edit',
      title: '销毁审批人ID：' + form.approverId,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-oldPartDestroyOrder',
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
        approverId: [
          { required: true, message: '请输入销毁审批人ID', trigger: 'change' }
        ],
        destroyOrderNo: [
          { required: true, message: '请输入门店销毁单号，DA-默认编码规则，如：DA25112113341772954', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入厅店名称', trigger: 'change' }
        ],
        destroyStatus: [
          { required: true, message: '请选择销毁单状态，如：草稿、待审批、已批准、已销毁', trigger: 'change' }
        ],
        destroyerName: [
          { required: true, message: '请输入销毁人', trigger: 'change' }
        ],
        destroyDate: [
          { required: true, message: '请输入销毁日期', trigger: 'change' }
        ],
        destroyRemark: [
          { required: true, message: '请输入销毁说明', trigger: 'change' }
        ],
        approverName: [
          { required: true, message: '请输入销毁审批人', trigger: 'change' }
        ],
        approveRemark: [
          { required: true, message: '请输入销毁审批说明', trigger: 'change' }
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
        approveDate: [
          { required: true, message: '请输入销毁审批日期', trigger: 'change' }
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
        dataSource: [
          { required: true, message: '请输入数据来源，150:新销服; 老销服:10', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        destroyerId: [
          { required: true, message: '请输入销毁人ID', trigger: 'change' }
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
