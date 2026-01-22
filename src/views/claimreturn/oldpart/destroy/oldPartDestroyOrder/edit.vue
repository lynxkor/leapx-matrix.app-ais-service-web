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
        :showEditBtn="false"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
        </template>
        <template #extraButtons>
          <el-button v-if="canDelete" @click="onRemove" size="small">删除</el-button>
          <el-button @click="checkDestroy" size="small">销毁</el-button>
          <el-button size="small">销毁审批通过</el-button>
          <el-button size="small">销毁审批驳回</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form label-width="150px" :inline="true" class="form-detail">
                <el-form-item label="旧件销毁单号：" prop="destroyOrderNo">
                  {{ form.destroyOrderNo }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="销毁单状态：" prop="destroyStatusLabel">
                  {{ form.destroyStatusLabel }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>销毁审批信息</h2>
            </div>
            <div class="common-section-body">
              <el-form label-width="150px" :inline="true" class="form-detail">
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
              <h2>旧件销毁明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :defaultNewRow="null"
                  :show-toolbar="false"
                  :options="options"
                  :checkbox="true"
                  :auth="{ edit: false, delete: false }"
                  :columns="columns"
                  :data="tableData"
                />
              </div>
            </div>
          </section>
        </el-main>
      </edit-base-container>
      <el-dialog title="" :visible.sync="dialogFormVisible">
        <el-form :model="dialogForm" ref="dialogRuleForm" :rules="dialogRules" label-width="150px" class="form-edit">
          <el-form-item label="请输入销毁说明:" :label-width="150">
            <el-input type="textarea" :maxlength="1000" v-model="dialogForm.destroyRemark" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="applyDestory">确 定</el-button>
        </div>
      </el-dialog>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, deleteItem, checkDestroy, executeDestroy } from '@/api/claimreturn/oldpart/destroy/oldPartDestroyOrder/index';
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
      tableData: [],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'warrantyMonth',
          title: '保修月份',
          width: '160'
        },
        {
          field: 'repairOrderNo',
          title: '接车施工单',
          width: '160'
        },
        {
          field: 'approval',
          title: '保修申请单',
          width: '180'
        },
        {
          field: 'approvalTime',
          title: '审批通过时间(保修申请单)',
          width: '180'
        },
        {
          field: 'oldPartUniqueCode',
          title: '旧件唯一码',
          width: '160'
        },
        {
          field: 'dealerName',
          title: '门店名称',
          width: '150'
        },
        {
          field: 'isMainPartLabel',
          title: '是否主因零部件',
          width: '140'
        },
        {
          field: 'vin',
          title: 'VIN',
          width: '180'
        },
        {
          field: 'oldPartSupplierName',
          title: '旧件供应商',
          width: '150'
        },
        {
          field: 'mainPartSupplierName',
          title: '主因件供应商',
          width: '150'
        },
        {
          field: 'oldPartCode',
          title: '旧件编码',
          width: '140'
        },
        {
          field: 'oldPartName',
          title: '旧件名称',
          width: '160'
        },
        {
          field: 'partCode',
          title: '换上零件编码',
          width: '140'
        },
        {
          field: 'partName',
          title: '换上零件名称',
          width: '160'
        },
        {
          field: 'oemInventoryStatus',
          title: '主机厂库存状态',
          width: '150'
        },
        {
          field: 'dealerInboundTime',
          title: '门店入库时间',
          width: '150'
        },
        {
          field: 'dealerOutTime',
          title: '门店出库时间',
          width: '150'
        },
        {
          field: 'xx',
          title: '主机厂入库时间',
          width: '150'
        },
        {
          field: 'oemCheckTime',
          title: '主机厂验收时间',
          width: '150'
        },
        {
          field: 'oemOutboundOrderNo',
          title: '主机厂出库单',
          width: '150'
        },
        {
          field: 'oemOutTime',
          title: '主机厂出库时间',
          width: '150'
        },
        {
          field: 'returnTypeLabel',
          title: '旧件返还类型',
          width: '140'
        },
        {
          field: 'remark',
          title: '备注',
          width: '120'
        },
        {
          field: 'checkRemark',
          title: '验收备注',
          width: '120'
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '150'
        }
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
      },
      // 销毁说明
      dialogForm: {
        destroyRemark: '',
      },
      dialogFormVisible: false,
      dialogRules: {
        destroyRemark: [
          { required: true, message: '请输入销毁说明', trigger: 'blur' }
        ]
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
    },
    onRemove () {
      // 删除操作
      this.$confirm('确定要删除该销毁单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteItem([this._id]).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.onBack();
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        });
      });
    },
    checkDestroy () {
      // if (!this._id) {
      //   this.$message.warning('请上传销毁附件信息后，再申请销毁，谢谢');
      //   return;
      // }
      // 销毁审核操作
      checkDestroy(this._id).then((res) => {
        console.log(res);
        this.applyDestory();
      }).catch(() => {
      });
    },
    applyDestory () {
      executeDestroy();
    },
    onBack () {
      this.$router.back();
    },
  }
};
</script>
