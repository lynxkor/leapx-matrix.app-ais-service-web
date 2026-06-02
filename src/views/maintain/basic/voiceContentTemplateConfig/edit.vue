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
                <el-form-item label="语音代码：" prop="voiceCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.voiceCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="车辆品牌：" prop="vehicleBrand">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="maintain_vehicle_brand"
                    v-model="form.vehicleBrand"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="事件类型：" prop="event">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="maintain_event"
                    v-model="form.event"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="满足条件：" prop="conditions">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="maintain_condition"
                    v-model="form.conditions"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="优先级：" prop="priorityLevel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.priorityLevel"
                    clearable
                    type="number"
                    min="0"
                  />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.dealerCode"
                    :remote-method="getDealerListByName"
                    :param="form.dealerName"
                    value-key="orgCode"
                    label-key="orgName"
                    @change="handleDealerChange"
                  />
                </el-form-item>
                <el-form-item label="开始日期：" prop="startTime">
                  <el-date-picker
                    v-model="form.startTime"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
                <el-form-item label="结束日期：" prop="endTime">
                  <el-date-picker
                    v-model="form.endTime"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
                <el-form-item label="负责人：" prop="creatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creatorName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="内容：" prop="content" class="form-item-full">
                  <el-input
                    placeholder="请输入"
                    v-model="form.content"
                    clearable
                    type="textarea"
                    limit="500"
                    show-word-limit
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark" class="form-item-full">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                    type="textarea"
                    limit="500"
                    show-word-limit
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="语音代码：" prop="voiceCode">
                  {{ form.voiceCode }}
                </el-form-item>
                <el-form-item label="车辆品牌：" prop="vehicleBrand">
                  {{ form.vehicleBrandLabel }}
                </el-form-item>
                <el-form-item label="事件类型：" prop="event">
                  {{ form.eventLabel }}
                </el-form-item>
                <el-form-item label="满足条件：" prop="conditions">
                  {{ form.conditionsLabel }}
                </el-form-item>
                <el-form-item label="优先级：" prop="priorityLevel">
                  {{ form.priorityLevel }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="开始日期：" prop="startTime">
                  {{ form.startTime }}
                </el-form-item>
                <el-form-item label="结束日期：" prop="endTime">
                  {{ form.endTime }}
                </el-form-item>
                <el-form-item label="负责人：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="内容：" prop="content" class="form-item-full">
                  {{ form.content }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark" class="form-item-full">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
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
import { getDetail, addOrUpdate } from '@/api/maintain/basic/voiceContentTemplateConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listOrgStoreInfo } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  voiceCode: '',
  content: '',
  dealerName: '',
  status: '',
  event: '',
  vehicleBrand: '',
  conditions: '',
  priorityLevel: '',
  startTime: '',
  endTime: '',
  remark: '',
  createTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  statusDesc: '',
  ownerOrgId: '',
  dealerCode: '',
};

export default {
  name: 'voiceContentTemplateConfigEdit',
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
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '语音代码：' + this.form.voiceCode;
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
      pageTitle: '语音内容模板配置管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-voiceContentTemplateConfig',
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
        content: [
          { required: true, message: '请输入内容', trigger: 'change' }
        ],
        event: [
          { required: true, message: '请选择事件类型', trigger: 'change' }
        ],
        vehicleBrand: [
          { required: true, message: '请选择车辆品牌', trigger: 'change' }
        ],
        conditions: [
          { required: true, message: '请选择满足条件', trigger: 'change' }
        ],
        priorityLevel: [
          { required: true, message: '请输入优先级', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择结束日期', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
  },
  methods: {
    handleDealerChange (val, obj) {
      this.form.dealerName = obj.orgName;
      this.form.dealerCode = val;
      this.form.ownerOrgId = obj.orgId;
    },
    async getDealerListByName (params) {
      return listOrgStoreInfo({ name: params });
    },
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
