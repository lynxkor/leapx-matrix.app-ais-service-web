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
                <el-form-item label="监控代码：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="场所ID：" prop="venueId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.venueId"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="设备名称：" prop="deviceSerialName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deviceSerialName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="设备序列号：" prop="deviceSerialNumber">
                  <el-input
                    placeholder="请输入"
                    v-model="form.deviceSerialNumber"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="通道名称：" prop="channelName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.channelName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="通道号：" prop="channelNumber">
                  <el-input
                    placeholder="请输入"
                    v-model="form.channelNumber"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="设备用途：" prop="devicePurpose">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="maintain_device_purpose"
                    v-model="form.devicePurpose"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="工位名称：" prop="dealerStationName">
                  <fetch-select
                    v-model="form.dealerStationName"
                    placeholder="请选择工位"
                    filterable
                    remote
                    :remote-method="queryDealerStations"
                    :params="form.dealerStationName"
                    clearable
                    value-key="id"
                    label-key="name"
                    @change="handleStationChange"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                    limit="500"
                    show-word-limit
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="监控代码：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="场所ID：" prop="venueId">
                  {{ form.venueId }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="设备名称：" prop="deviceSerialName">
                  {{ form.deviceSerialName }}
                </el-form-item>
                <el-form-item label="设备序列号：" prop="deviceSerialNumber">
                  {{ form.deviceSerialNumber }}
                </el-form-item>
                <el-form-item label="通道名称：" prop="channelName">
                  {{ form.channelName }}
                </el-form-item>
                <el-form-item label="通道号：" prop="channelNumber">
                  {{ form.channelNumber }}
                </el-form-item>
                <el-form-item label="设备用途：" prop="devicePurpose">
                  {{ form.devicePurposeLabel }}
                </el-form-item>
                <el-form-item label="工位名称：" prop="dealerStationName">
                  {{ form.dealerStationName }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
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
import { getDetail, addOrUpdate } from '@/api/maintain/basic/monitoringEquipmentConfig/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getList as getDealerStationList } from '@/api/maintain/basic/dealerStation/index';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  venueId: '',
  dealerName: '',
  status: '',
  deviceSerialName: '',
  deviceSerialNumber: '',
  channelNumber: '',
  devicePurpose: '',
  dealerStationName: '',
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
  dealerStationId: '',
};

export default {
  name: 'monitoringEquipmentConfigEdit',
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
      pageTitle: '监控设备用途-配置表管理',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-monitoringEquipmentConfig',
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
        venueId: [
          { required: true, message: '请输入场所ID', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        deviceSerialName: [
          { required: true, message: '请输入设备序列名称', trigger: 'change' }
        ],
        deviceSerialNumber: [
          { required: true, message: '请输入设备序列号', trigger: 'change' }
        ],
        channelNumber: [
          { required: true, message: '请输入通道号', trigger: 'change' }
        ],
        devicePurpose: [
          { required: true, message: '请输入设备用途', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
  },
  methods: {
    async queryDealerStations (query) {
      return await getDealerStationList({ name: query });
    },
    handleStationChange (data, obj) {
      this.form.dealerStationId = data;
      this.form.dealerStationName = obj.name;
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
