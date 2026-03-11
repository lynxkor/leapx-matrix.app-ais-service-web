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
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="编码：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="年型：" prop="vehYearTypeName">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.vehYearTypeName"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="基本车型：" prop="vehModelName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehModelName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="故障名称：" prop="cccName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cccName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="零件代码：" prop="partsCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.partsCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="零件名称：" prop="partsName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.partsName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="留车范围：" prop="retainedScope">
                  <el-input
                    placeholder="请输入"
                    v-model="form.retainedScope"
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
                <el-form-item label="制造开始日期：" prop="manufactureStartOn">
                  <el-input
                    placeholder="请输入"
                    v-model="form.manufactureStartOn"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="制造结束日期：" prop="manufactureEndOn">
                  <el-input
                    placeholder="请输入"
                    v-model="form.manufactureEndOn"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="配置有效开始日期：" prop="effectiveOn">
                  <el-input
                    placeholder="请输入"
                    v-model="form.effectiveOn"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="配置有效结束日期：" prop="ineffectiveOn">
                  <el-input
                    placeholder="请输入"
                    v-model="form.ineffectiveOn"
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
                <el-form-item label="基本车型id：" prop="vehModelId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehModelId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="年型id：" prop="vehYearTypeId">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.vehYearTypeId"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="车型名称：" prop="modelId">
                  <list-select
                    listUrl="/datacenter/web/materials/vehicleModel/list"
                    placeholder="请选择"
                    v-model="form.vehModelId"
                    query-key="modelNameLike"
                    auto-load-options
                    collapseTags
                    filterable
                    clearable
                    :params="{seriesIdList: form.seriesId?[form.seriesId]:[]}" />
                </el-form-item>
                <el-form-item label="车辆年款：" prop="yearTypeId">
                  <list-select
                    listUrl="/datacenter/web/materials/vehicleYearType/list"
                    placeholder="请选择"
                    v-model="form.vehYearTypeId"
                    query-key="yearTypeNameLike"
                    collapseTags
                    no-param-load
                    auto-load-options
                    filterable
                    :params="{}" />
                </el-form-item>
                <el-form-item label="故障名称id：" prop="cccId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.cccId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="零件代码id：" prop="partsId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.partsId"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="编码：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="年型：" prop="vehYearTypeName">
                  {{ form.vehYearTypeName }}
                </el-form-item>
                <el-form-item label="基本车型：" prop="vehModelName">
                  {{ form.vehModelName }}
                </el-form-item>
                <el-form-item label="故障名称：" prop="cccName">
                  {{ form.cccName }}
                </el-form-item>
                <el-form-item label="零件代码：" prop="partsCode">
                  {{ form.partsCode }}
                </el-form-item>
                <el-form-item label="零件名称：" prop="partsName">
                  {{ form.partsName }}
                </el-form-item>
                <el-form-item label="留车范围：" prop="retainedScope">
                  {{ form.retainedScope }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="制造开始日期：" prop="manufactureStartOn">
                  {{ form.manufactureStartOn }}
                </el-form-item>
                <el-form-item label="制造结束日期：" prop="manufactureEndOn">
                  {{ form.manufactureEndOn }}
                </el-form-item>
                <el-form-item label="配置有效开始日期：" prop="effectiveOn">
                  {{ form.effectiveOn }}
                </el-form-item>
                <el-form-item label="配置有效结束日期：" prop="ineffectiveOn">
                  {{ form.ineffectiveOn }}
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
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="基本车型id：" prop="vehModelId">
                  {{ form.vehModelId }}
                </el-form-item>
                <el-form-item label="年型id：" prop="vehYearTypeId">
                  {{ form.vehYearTypeId }}
                </el-form-item>
                <el-form-item label="故障名称id：" prop="cccId">
                  {{ form.cccId }}
                </el-form-item>
                <el-form-item label="零件代码id：" prop="partsId">
                  {{ form.partsId }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>子表标题</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <div class="ais-select-group">
                  <fetch-select
                    style="width: 300px;"
                    :remote-method="queryListData"
                    remote
                    placeholder="请选择"
                    clearable
                    value-key="id"
                    label-key="name"
                    @change="handleAddTableData"
                  />
                  <el-button type="primary" size="small">添加</el-button>
                </div>
              </div>
              <div class="common-section-table">
                <vxe-table
                  ref="tableRef"
                  stripe
                  :data="tableData"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="name" title="名称" min-width="30%" />
                  <vxe-column field="age" title="年龄" min-width="30%" />
                  <vxe-column field="email" title="邮箱" min-width="30%" />
                  <vxe-column title="操作" width="100" v-if="canDelete">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确定要删除吗？" @confirm="handleDeleteRow(rowIndex)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{emptyText}}</div>
                  </template>
                </vxe-table>
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
import { getDetail, addOrUpdate } from '@/api/maintain/sp/vehRetention/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import ListSelect from '@/libs/components/list-select/index.vue';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  vehYearTypeName: '',
  vehModelName: '',
  cccName: '',
  partsCode: '',
  partsName: '',
  retainedScope: '',
  status: '',
  manufactureStartOn: '',
  manufactureEndOn: '',
  effectiveOn: '',
  ineffectiveOn: '',
  createTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  statusDesc: '',
  vehModelId: '',
  vehYearTypeId: '',
  cccId: '',
  partsId: '',
};

export default {
  name: 'vehRetentionEdit',
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
    FetchSelect,
    ListSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '编码：' + this.form.code;
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
      pageTitle: '新页面',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-vehRetentionConfig',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      rules: {
        code: [
          { required: true, message: '请输入编码', trigger: 'change' }
        ],
        vehYearTypeName: [
          { required: true, message: '请选择年型', trigger: 'change' }
        ],
        vehModelName: [
          { required: true, message: '请输入基本车型', trigger: 'change' }
        ],
        cccName: [
          { required: true, message: '请输入故障名称', trigger: 'change' }
        ],
        partsCode: [
          { required: true, message: '请输入零件代码', trigger: 'change' }
        ],
        partsName: [
          { required: true, message: '请输入零件名称', trigger: 'change' }
        ],
        retainedScope: [
          { required: true, message: '请输入留车范围', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        manufactureStartOn: [
          { required: true, message: '请输入制造开始日期', trigger: 'change' }
        ],
        manufactureEndOn: [
          { required: true, message: '请输入制造结束日期', trigger: 'change' }
        ],
        effectiveOn: [
          { required: true, message: '请输入配置有效开始日期', trigger: 'change' }
        ],
        ineffectiveOn: [
          { required: true, message: '请输入配置有效结束日期', trigger: 'change' }
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
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        vehModelId: [
          { required: true, message: '请输入基本车型id', trigger: 'change' }
        ],
        vehYearTypeId: [
          { required: true, message: '请选择年型id', trigger: 'change' }
        ],
        cccId: [
          { required: true, message: '请输入故障名称id', trigger: 'change' }
        ],
        partsId: [
          { required: true, message: '请输入零件代码id', trigger: 'change' }
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
    // 删除子表数据
    handleDeleteRow (index) {
      const item = this.tableData[index];
      this.tableData.splice(index, 1);
      // 根据需求调用接口
      // deletePartVehModel([item.id]).then(res => {
      //   this.$message.success('删除成功');
      //   this.tableData.splice(index, 1);
      // });
    },
    // 查询新增项的列表
    queryListData (queryString) {
      return new Promise(resolve => {
        // 根据需求调用接口
        // sparePartList({ partCodeOrNameLike: queryString, status: 1, limitSize: 20 }).then(res => {
        //   const list = res || [];
        //   resolve(list);
        // });
        resolve([
          { id: 1, name: 'test', age: 25, email: 'test@example.com' }
        ]);
      });
    },
    // 新增子表数据
    handleAddTableData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      // 检查是否已存在
      const exists = this.tableData.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      // 根据需求调用接口
      this.tableData.push(record);
      // addPartItem({
      //   maintenancePartId: this._id,
      //   partsCode: record.partCode,
      //   partsName: record.partName,
      //   partsId: record.id,
      // }).then(res => {
      //   this.$message.success('添加成功');
      //   this.detailRequest();
      // });
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
