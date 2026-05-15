<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <!-- <template #extraButtons>
          <el-button size="small">删除</el-button>
          <el-button size="small" type="danger">停用</el-button>
        </template> -->
        <template #status>
          <!-- <span class="status" :class="form.status === 1 ? 'primary' : 'danger'">{{ form.status === 1 ? '启用' : '停用' }}</span> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="180px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="预授权规则编号：" prop="code">
                  <el-input
                    placeholder="自动生成"
                    v-model="form.code"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="有效日期：" prop="startTime">
                  <el-date-picker
                    v-model="dateRange"
                    type="daterange"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="预授权额度(元)：" prop="authAmount">
                  <el-input-number
                    v-model="form.authAmount"
                    size="small"
                    :min="0"
                    :precision="2"
                    :step="100"
                    placeholder="请输入预授权额度"
                  />
                </el-form-item>
                <el-form-item label="启用状态：" prop="status">
                  <el-radio-group v-model="form.status">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="0">停用</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="预授权规则编号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="有效日期：">
                  {{ form.startTime && form.endTime ? `${formatDate(form.startTime)} 至 ${formatDate(form.endTime)}` : '永久有效' }}
                </el-form-item>
                <el-form-item label="预授权额度(元)：" prop="authAmount">
                  {{ form.authAmount }}
                </el-form-item>
                <el-form-item label="启用状态：" prop="status">
                  {{ form.status === 1 ? '启用' : '停用' }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>适配车型</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <el-button type="primary" plain size="small" @click="modelDialogVisible = true">选择适配车型</el-button>
              </div>
              <div class="common-section-table">
                <vxe-table
                  ref="tableModel"
                  stripe
                  :data="tableDataModel"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="vehicleSeriesName" title="车系" min-width="30%" />
                  <vxe-column field="vehicleModelName" title="车型" min-width="30%" />
                  <vxe-column field="vehicleYearType" title="年款" min-width="30%" />
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
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>适配零件</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header" style="justify-content: flex-start;gap: 10px;">
                <base-search
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  :remote-method="querySpareParts"
                  @change="handlePartSelect"
                  value-key="id"
                  label-key="partName"
                  placeholder="请选择零件"
                />
                <el-button type="primary" plain size="small" @click="handleImport">零件导入</el-button>
              </div>
              <div class="common-section-table">
                <vxe-table
                  ref="tablePart"
                  stripe
                  :data="tableDataPart"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="partsCode" title="零件代码" min-width="200">
                    <template #default="{ row }">
                      <el-link type="primary" :href="`/service/sparepart/basic/sparePart/detail?id=${row.partsId}`" target="_blank">{{ row.partsCode }}</el-link>
                    </template>
                  </vxe-column>
                  <vxe-column field="partsName" title="零件名称" min-width="200" />
                  <vxe-column field="remark" title="备注" min-width="200">
                    <template #default="{ row }">
                      <el-input v-if="isEditing" v-model="row.remark" size="small" placeholder="请输入备注" />
                      <span v-else>{{ row.remark || '-' }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column field="creatorName" title="创建人" min-width="200" />
                  <vxe-column field="createTime" title="创建时间" min-width="200" />
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
        </el-main>
        <ModelDialog :visible="modelDialogVisible" :info="form" @submit="handleVehicleModelSubmit" @close="handleCloseModel" />
        <!-- TIPS: 填入项目id即可 -->
        <Upload
          :visible="uploadDialogVisible"
          :id="'importpreauthpart'"
          downloadTitle="批量导入零件模版.xlsx"
          @close="handleUploadDialogClose"
          @getData="detailRequest"
          :businessParams="_id"
        />
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
import { getDetail, addOrUpdate, addPartItem, deletePartItem, deleteModelItem } from '@/api/maintain/sp/preAuthRule/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, sparePartList } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import ModelDialog from '@/views/maintain/basic/maintenancePartData/components/AddVehicleDialog/index.vue';
import Upload from '@/libs/components/UploadDialog';
import BaseSearch from '@/libs/components/BaseSearch';
import moment from 'moment';

const defaultForm = {
  code: '',
  startTime: '',
  endTime: '',
  authAmount: null,
  status: 1,
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  statusDesc: '',
  vehicleSeriesIds: '',
  vehicleModelNames: '',
  vehicleSeriesNames: '',
  vehicleModels: [],
  partsResps: []
};

export default {
  name: 'preAuthRuleEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    BaseSearch,
    ModelDialog,
    Upload
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    isReadonly () {
      return this.$route.query.readonly === 'true';
    },
    title () {
      return '预授权规则编号：' + (this.form.code || '新增');
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
    },
    // 同步日期范围到表单字段
    dateRange (val) {
      if (val && val.length === 2) {
        this.form.startTime = val[0];
        this.form.endTime = val[1];
      } else {
        this.form.startTime = '';
        this.form.endTime = '';
      }
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '预授权参数设置',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-preAuthRule',
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      // 适配车型
      tableDataModel: [],
      // 适配零件
      tableDataPart: [],
      modelDialogVisible: false, // 适配车型弹窗
      uploadDialogVisible: false,
      dateRange: [],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      rules: {
        code: [
          { required: false, message: '请输入预授权规则编号', trigger: 'change' }
        ],
        startTime: [
          {
            validator: (rule, value, callback) => {
              if (this.dateRange && this.dateRange.length === 2) {
                const startTime = new Date(this.dateRange[0]).getTime();
                const endTime = new Date(this.dateRange[1]).getTime();
                if (startTime > endTime) {
                  callback(new Error('开始日期不能大于结束日期'));
                } else {
                  callback();
                }
              } else {
                callback();
              }
            },
            trigger: 'change'
          }
        ],
        authAmount: [
          { required: true, message: '请输入预授权额度', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (value !== null && value !== undefined && value <= 0) {
                callback(new Error('预授权额度必须大于0'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        status: [
          { required: true, message: '请选择启用状态', trigger: 'change' }
        ]
      }
    };
  },
  mounted () {
    // 如果是只读模式，禁止编辑
    if (this.isReadonly) {
      this.isEditing = false;
    }
  },
  methods: {
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          // 加载适配车型和零件数据
          this.tableDataModel = res.vehicleModels || [];
          this.tableDataPart = res.partsResps || [];
          // 同步日期范围
          if (res.startTime && res.endTime) {
            this.dateRange = [res.startTime, res.endTime];
          } else {
            this.dateRange = [];
          }
          return res;
        });
      }
    },
    submitRequest () {
      return addOrUpdate({
        ...this.form,
        authRuleModelParamList: this.tableDataModel,
        partParamList: this.tableDataPart
      });
    },
    // 删除单个车型
    async handleDeleteModelRow (index) {
      const item = this.tableDataModel[index];
      if (!item || !item.id) {
        this.$message.warning('无法获取车型信息');
        return;
      }

      try {
        await deleteModelItem([item.id]);
        this.tableDataModel.splice(index, 1);
        this.$message.success('删除成功');
        getDetail(this._id);
      } catch (error) {
        console.error('删除失败:', error);
        this.$message.error('删除失败');
      }
    },
    // 添加零件
    handleAddPart (record) {
      if (!record) {
        this.$message.warning('请先选择零件');
        return;
      }
      // 检查是否已存在
      const exists = this.tableDataPart.some(item => item.partsCode === record.partCode);
      if (exists) {
        this.$message.warning('该零件已添加');
        return;
      }
      addPartItem({
        preAuthRuleId: this._id,
        partsCode: record.partCode,
        partsName: record.partName,
        partsId: record.id,
        remark: record.remark
      }).then(res => {
        this.$message.success('添加成功');
        this.$refs.containerRef.loadDetail();
      });
    },
    // 零件选择变更
    handlePartSelect (val, record) {
      this.handleAddPart(record);
    },
    // 删除单个零件
    async handleDeletePartRow (index) {
      const item = this.tableDataPart[index];
      await deletePartItem([item.id]);
      this.tableDataPart.splice(index, 1);
      this.$message.success('删除成功');
    },
    // 处理关闭弹窗事件
    handleCloseModel () {
      this.modelDialogVisible = false;
    },
    // 处理车型提交
    handleVehicleModelSubmit (data) {
      const submitData = data.addOrUpdateReqList || [];
      addOrUpdate({
        ...this.form,
        authRuleModelParamList: [
          ...this.form.vehicleModels,
          ...submitData
        ],
        partParamList: this.tableDataPart
      }).then(res => {
        this.$message.success('保存成功');
        this.$refs.containerRef.loadDetail();
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
    },
    // 格式化日期
    formatDate (date) {
      if (!date) return '';
      return moment(date).format('YYYY-MM-DD');
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
  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>
