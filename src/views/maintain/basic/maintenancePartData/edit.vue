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
        <!-- <template #status>
          <span class="status primary">状态</span>
        </template>
         -->
        <template #extraButtons>
          <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="180px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="保养零件代码：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="保养零件名称：" prop="name">
                  <el-input
                    placeholder="请输入"
                    v-model="form.name"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="里程类型：" prop="mileageType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="MileageTypeEnum"
                    v-model="form.mileageType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="首次保养里程(KM)：" prop="firstServiceMileage">
                  <el-input
                    placeholder="请输入"
                    v-model="form.firstServiceMileage"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="首次保养时间(月)：" prop="firstServiceMonth">
                  <el-input
                    placeholder="请输入"
                    v-model="form.firstServiceMonth"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="定期保养里程间隔(KM)：" prop="mileageInterval">
                  <el-input
                    placeholder="请输入"
                    v-model="form.mileageInterval"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="定期保养时间间隔(月)：" prop="monthInterval">
                  <el-input
                    placeholder="请输入"
                    v-model="form.monthInterval"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="180px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="保养零件代码：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="保养零件名称：" prop="name">
                  {{ form.name }}
                </el-form-item>
                <el-form-item label="里程类型：" prop="mileageType">
                  {{ form.mileageType }}
                </el-form-item>
                <el-form-item label="首次保养里程(KM)：" prop="firstServiceMileage">
                  {{ form.firstServiceMileage }}
                </el-form-item>
                <el-form-item label="首次保养时间(月)：" prop="firstServiceMonth">
                  {{ form.firstServiceMonth }}
                </el-form-item>
                <el-form-item label="定期保养里程间隔(KM)：" prop="mileageInterval">
                  {{ form.mileageInterval }}
                </el-form-item>
                <el-form-item label="定期保养时间间隔(月)：" prop="monthInterval">
                  {{ form.monthInterval }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>保养零件清单</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <div class="ais-select-group">
                  <fetch-select
                    ref="partSelectRef"
                    style="width: 300px;"
                    :remote-method="querySpareParts"
                    remote
                    placeholder="请选择零件"
                    clearable
                    filterable
                    value-key="id"
                    label-key="partName"
                    @change="handlePartSelect"
                  />
                  <el-button
                    type="primary"
                    size="small"
                  >
                    添加
                  </el-button>
                </div>
              </div>
              <div class="common-section-table">
                <vxe-table
                  ref="tablePj"
                  stripe
                  :data="tableDataPj"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="partsName" title="零件名称" min-width="30%" />
                  <vxe-column field="partsCode" title="零件代码" min-width="30%" />
                  <vxe-column field="createTime" title="创建时间" min-width="30%" />
                  <vxe-column title="操作" width="100" v-if="canDelete">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确定要删除该零件吗？" @confirm="handleDeletePartRow(rowIndex)">
                        <span slot="reference" type="text" size="small" :class="['btn-delete']">删除</span>
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
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>适配车型&nbsp;<el-button type="primary" size="small" @click="modelDialogVisible = true">添加</el-button></h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  ref="tableCx"
                  stripe
                  :data="tableDataCx"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="vehModelName" title="车型" min-width="30%" />
                  <vxe-column field="vehYearTypeName" title="年款" min-width="30%" />
                  <vxe-column field="createTime" title="创建时间" min-width="30%" />
                   <vxe-column title="操作" width="100" v-if="canDelete">
                    <template #default="{rowIndex}">
                      <el-popconfirm title="确定要删除该适配车型吗？" @confirm="handleDeleteModelRow(rowIndex)">
                        <span slot="reference" type="text" size="small" :class="['btn-delete']">删除</span>
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
        <ModelDialog :visible="modelDialogVisible" :info="form" @submit="handleVehicleModelSubmit" @close="handleCloseModel" />
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
import { getDetail, addOrUpdate, deletePartItem, addPartItem, addPartVehModel, deletePartVehModel } from '@/api/maintain/basic/maintenancePartData/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, sparePartList } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import ModelDialog from './components/AddVehicleDialog/index.vue';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  name: '',
  mileageType: '',
  status: '',
  firstServiceMileage: '',
  firstServiceMonth: '',
  mileageInterval: '',
  monthInterval: '',
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  statusDesc: '',
  partsList: [],
  vehModelList: [],
};

export default {
  name: 'maintenancePartDataEdit',
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
    ModelDialog
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '保养零件代码：' + this.form.code;
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
      pageTitle: '保养零件提醒表管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-maintenancePartData',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      // 适配车型
      tableDataCx: [],
      emptyText: '若要启用此内容，请创建记录',
      // 保养零件清单
      tableDataPj: [],
      modelData: [], // 车型信息
      modelDialogVisible: false, // 适配车型弹窗
      rules: {
        code: [
          { required: false, message: '请输入保养零件代码', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入保养零件名称', trigger: 'change' }
        ],
        mileageType: [
          { required: true, message: '请选择里程类型', trigger: 'change' }
        ],
        firstServiceMileage: [
          { required: true, message: '请输入首次保养里程', trigger: 'change' }
        ],
        firstServiceMonth: [
          { required: true, message: '请输入首次保养时间', trigger: 'change' }
        ],
        mileageInterval: [
          { required: true, message: '请输入定期保养里程间隔', trigger: 'change' }
        ],
        monthInterval: [
          { required: true, message: '请输入定期保养时间间隔', trigger: 'change' }
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
        return getDetail(id).then(res => {
          // 加载适配车型和零件清单数据
          this.tableDataCx = res.vehModelList || [];
          this.tableDataPj = res.partsList || [];
          return res;
        });
      }
    },
    submitRequest () {
      addOrUpdate({
        ...this.form,
        vehModelList: this.tableDataCx,
        partsList: this.tableDataPj
      }).then(result => {
        this.$message.success('保存成功');
      }).catch(() => {});
    },
    // 添加零件
    handleAddPart (record) {
      if (!record) {
        this.$message.warning('请先选择零件');
        return;
      }
      // 检查是否已存在
      const exists = this.tableDataPj.some(item => item.partCode === record.partCode);
      if (exists) {
        this.$message.warning('该零件已添加');
        return;
      }
      addPartItem({
        maintenancePartId: this._id,
        partsCode: record.partCode,
        partsName: record.partName,
        partsId: record.id,
      }).then(res => {
        this.$message.success('添加成功');
        this.detailRequest();
      });
    },
    // 零件选择变更
    handlePartSelect (val, record) {
      this.handleAddPart(record);
    },
    // 删除单个零件
    handleDeletePartRow (index) {
      const item = this.tableDataPj[index];
      deletePartItem([item.id]).then(res => {
        this.tableDataPj.splice(index, 1);
        this.$message.success('删除成功');
      });
    },
    // 处理关闭弹窗事件
    handleCloseModel () {
      this.modelDialogVisible = false;
    },
    handleVehicleModelSubmit (data) {
      console.log(data);
      const submitData = data.addOrUpdateReqList.map(item => {
        return {
          maintenancePartId: this._id,
          vehModelId: item.vehicleModelId,
          vehModelName: item.vehicleModelName,
          vehYearTypeId: item.vehicleYearTypeId,
          vehYearTypeName: item.vehicleYearTypeName,
        };
      });
      addPartVehModel(submitData).then(res => {
        this.$message.success('保存成功');
        this.detailRequest();
      });
    },
    // 删除单个车型
    handleDeleteModelRow (index) {
      const item = this.tableDataCx[index];
      deletePartVehModel([item.id]).then(res => {
        this.tableDataCx.splice(index, 1);
        this.$message.success('删除成功');
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
    handleJumpAuditLog () {
      this.$auditLog.show({ id: this._id });
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 备件主数据表列表查询
    querySpareParts (queryString) {
      return new Promise(resolve => {
        sparePartList({ partCodeOrNameLike: queryString, status: 1, limitSize: 20 }).then(res => {
          const list = res || [];
          resolve(list);
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
  .m-vxe-table-empty-text {
    text-align: left;
  }
  ::v-deep .vxe-table--empty-content {
    color: var(--leap-color-default-light-2);
    width: 100%;
    padding: 0 16px;
  }
  .btn-delete {
    color: var(--leap-color-danger);
    cursor: pointer;
    &:hover {
      text-decoration: underline;
      color: var(--leap-color-danger-dark-1);
    }
    &.disabled{
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
</style>
