<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="`主机厂出库单号:${form.outboundOrderNo}`"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :showEditBtn="form.outboundStatus !== '20'"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <span v-if="form.outboundStatus === '10'" class="status primary">{{ form.outboundStatusLabel }}</span>
          <span v-else-if="form.outboundStatus === '20'" class="status success">{{ form.outboundStatusLabel }}</span>
        </template>
        <template #extraButtons>
          <el-button v-if="form.outboundStatus === '10'" size="small" @click="outboundConfirm">确认出库</el-button>
          <el-button v-if="form.outboundStatus === '20' && form.syncStatus === '30'" size="small" @click="syncConfirm">同步</el-button>
          <el-button size="small" @click="printOutbound">打印出库单</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="主机厂出库单号：" prop="outboundOrderNo">
                  <el-input
                    v-model="form.outboundOrderNo"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="发运状态：" prop="outboundStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="old_part_outbound_status"
                    v-model="form.outboundStatus"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="出库类型：" prop="outboundType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="old_part_outbound_type"
                    v-model="form.outboundType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="仓库代码：" prop="warehouseCode">
                  <list-select
                    listUrl="/claimreturn/oldpart/web/basic/oldPartOemWarehouse/list"
                    placeholder="请选择"
                    v-model="form.warehouseId"
                    query-key="warehouseCodeLike"
                    auto-load-options
                    no-param-load
                    clearable
                    filterable
                    :params="{}" />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerCode">
                  <dealer-select
                    v-model="form.dealerCode"
                    :defaultDealerName="form.dealerName"/>
                </el-form-item>
                <el-form-item label="收货供应商：" prop="supplierId">
                  <list-select
                    listUrl="/sp/web/basic/supplierInfo/list"
                    placeholder="请选择"
                    v-model="form.supplierId"
                    query-key="supplierCodeOrNameLike"
                    auto-load-options
                    no-param-load
                    clearable
                    filterable
                    :params="{}" />
                </el-form-item>
                <el-form-item label="物流商：" prop="logisticsCompany">
                  <el-input
                    placeholder="请输入"
                    v-model="form.logisticsCompany"
                    clearable
                    maxLength="50"
                  />
                </el-form-item>
                <el-form-item label="物流单号：" prop="logisticsTrackingNo">
                  <el-input
                    placeholder="请输入"
                    v-model="form.logisticsTrackingNo"
                    clearable
                    maxLength="50"
                  />
                </el-form-item>
                <el-form-item label="出库时间：" prop="outboundTime">
                  <el-date-picker
                    v-model="form.outboundTime"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请输入"
                    clearable>
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="预计到达日期：" prop="estimatedArrivalDate">
                  <el-date-picker
                    v-model="form.estimatedArrivalDate"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请输入"
                    clearable>
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="同步状态：" prop="syncStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="old_part_sync_status"
                    v-model="form.syncStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="同步信息：" prop="syncMessage">
                  <el-input
                    placeholder="请输入"
                    v-model="form.syncMessage"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item class="form-item-full" label="备注：" prop="remark">
                  <el-input
                    type="textarea"
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                    maxLength="1000"
                  />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="主机厂出库单号：" prop="outboundOrderNo">
                  {{ form.outboundOrderNo }}
                </el-form-item>
                <el-form-item label="发运状态：" prop="outboundStatusLabel">
                  {{ form.outboundStatusLabel }}
                </el-form-item>
                <el-form-item label="出库类型：" prop="outboundTypeLabel">
                  {{ form.outboundTypeLabel }}
                </el-form-item>
                <el-form-item label="仓库代码：" prop="warehouseCode">
                  <el-button class="link" @click="$router.push('/claimreturn/oldpart/basic/oldPartOemWarehouse/edit?id=' + form.warehouseId)" type="text">{{ form.warehouseCode }}</el-button>
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-button
                    class="link"
                    @click="navigateToRoute({
                      path: '/partner/channelManagement/shopDetail',
                      query: {
                        dealerCode: form.dealerCode,
                      },
                    })"
                    type="text">{{form.dealerName}}</el-button>
                </el-form-item>
                <el-form-item label="收货供应商：" prop="supplierName">
                  <el-button class="link" @click="$router.push('/sparepart/basic/supplierInfo/detail?id=' + form.supplierId)" type="text">{{ form.supplierName }}</el-button>
                </el-form-item>
                <el-form-item label="物流商：" prop="logisticsCompany">
                  {{ form.logisticsCompany }}
                </el-form-item>
                <el-form-item label="物流单号：" prop="logisticsTrackingNo">
                  {{ form.logisticsTrackingNo }}
                </el-form-item>
                <el-form-item label="出库时间：" prop="outboundTime">
                  {{ form.outboundTime }}
                </el-form-item>
                <el-form-item label="预计到达日期：" prop="estimatedArrivalDate">
                  {{ form.estimatedArrivalDate }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="同步状态：" prop="syncStatus">
                  {{ form.syncStatusLabel }}
                </el-form-item>
                <el-form-item label="同步信息：" class="form-item-full" prop="syncMessage">
                  {{ form.syncMessage }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <ReturnOrderTable
            ref="returntable"
            :canAddOrUpdate="canAddOrUpdate"
            :_id="_id"
            :outboundStatus="form.outboundStatus"
            :dealerCode="dealerCode"
            @getTableData="getTableData"
            @checkboxChange="checkboxChange"
          />
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
import { getDetail, addOrUpdate, confirmOutbound, sync } from '@/api/claimreturn/oldpart/outbound/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import ListSelect from '@/libs/components/list-select/index.vue';
import DealerSelect from '@/components/dealer-select/index.vue';
import ReturnOrderTable from './ReturnOrderTable.vue';

const defaultForm = {
  // 多选时字段有变化，自行修复
  outboundOrderNo: '',
  outboundStatus: '10',
  supplierName: '',
  remark: '',
  logisticsTrackingNo: '',
  logisticsCompany: '',
  estimatedArrivalDate: '',
  createTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  warehouseId: '',
  warehouseCode: '',
  warehouseName: '',
  supplierId: '',
  supplierCode: '',
  dealerCode: '',
  dealerName: '',
  outboundType: '',
  outboundTime: '',
  syncStatus: '',
  syncMessage: '',
  ownerUserId: '',
  ownerUserName: '',
};

export default {
  name: 'outboundEdit',
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
    ListSelect,
    EditBaseContainer,
    FetchSelect,
    DealerSelect,
    ReturnOrderTable,
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
          this.updateDetail();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '主机厂旧件出库',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-oldPartOemOutboundOrder',
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
        dealerCode: [
          { required: true, message: '请选择门店名称', trigger: 'change' }
        ],
        supplierId: [
          { required: true, message: '请输入收货供应商', trigger: 'change' }
        ],
        outboundType: [
          { required: true, message: '请选择出库类型', trigger: 'change' }
        ],
        outboundTime: [
          { required: true, message: '请选择出库时间', trigger: 'change' }
        ],
      },
      // ------------ 表格
      dealerCode: '',
      existTableData: false,
      selectedRows: [],
      // --
      uploadDialogVisible: true,
    };
  },
  mounted () {
  },
  methods: {
    updateDetail () {
      this.$refs.containerRef?.loadDetail();
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(data => {
          this.dealerCode = data.dealerCode;
          return data;
        });
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
    },
    // ---------------------------------------------------- 表格 --
    getTableData (data) {
      this.existTableData = Boolean(data?.length > 0);
    },
    checkboxChange (records) {
      this.selectedRows = records;
    },
    outboundConfirm () {
      if (!this.existTableData) {
        this.$message.warning('没有旧件出库单明细无法进行出库');
        return;
      }
      //
      this.$confirm('您确定要进行出库操作吗？', '确认出库', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        confirmOutbound(this._id).then(res => {
          this.$message.success('出库成功');
          this.updateDetail();
        });
      });
    },
    syncConfirm () {
      sync(this._id).then(res => {
        this.updateDetail();
        this.$message.success('同步成功');
      });
    },
    printOutbound () {
      this.$print.show({
        id: this._id, // 必选，对应数据id
        template: 'Outbound',
        title: `旧件出库单(中心库): ${this.form.outboundOrderNo}`,
        width: 1122,
      });
    }
  }
};
</script>
