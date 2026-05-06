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
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :showEditBtn="false"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
        </template>
        <template #extraButtons>
          <!-- 门店可操作 -->
          <el-button v-if="isDealer && (form.destroyStatus === '40' || form.destroyStatus === '70')" @click="onDestory" size="small">销毁</el-button>
          <!-- 主机厂可操作 -->
          <el-button v-if="!isDealer && form.destroyStatus === '50'" @click="dialogFormVisible2 = true" size="small">审批</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" class="form-detail">
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
              <el-form :inline="true" class="form-detail">
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
                  :showPagination="true"
                  :current="current"
                  :pageSize="pageSize"
                  :total="total"
                  :data="tableData"
                  @mask="mask"
                  @page-size-change="pageSizeChange"
                  @current-page-change="currentPageChange"
                >
                  <template v-slot:default="{ row, column, col }">
                    <el-button v-if="col.click" class="link" @click="() => col.click(row)" type="text">{{ row[column.field] }}</el-button>
                    <span v-else>{{ row[column.field] }}</span>
                  </template>
                </edit-table>
              </div>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>销毁申请附件</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <!-- 附件上传组件 -->
                <AisAttachment
                  :businessId="_id"
                  configCode="mcs_spmusedprtdestory_apply"
                  attachType="其他"
                  ref="attachment"
                />
              </div>
            </div>
          </section>
        </el-main>
      </edit-base-container>
      <!-- 旧件销毁申请 -->
      <el-dialog title="旧件销毁申请" :visible.sync="dialogFormVisible">
        <el-form :model="form" ref="dialogRuleForm" :rules="rules" class="form-edit">
          <el-form-item label="请输入销毁说明:" prop="destroyRemark">
            <el-input type="textarea" :maxlength="1000" v-model="form.destroyRemark" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
          <el-button size="small" :loading="loadingDialog" type="primary" @click="executeDestroy">确定</el-button>
        </div>
      </el-dialog>
      <!-- 旧件销毁审批 -->
      <el-dialog title="旧件销毁审批" :visible.sync="dialogFormVisible2">
        <el-form  class="form-edit">
          <el-form-item label="审批结果:">
            <el-radio-group v-model="isPass">
              <el-radio :label="true">通过</el-radio>
              <el-radio :label="false">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="请输入销毁审批说明:">
            <el-input type="textarea" :maxlength="1000" v-model="form.approveRemark" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogFormVisible2 = false">取消</el-button>
          <el-button size="small" type="primary" @click="approveSubmit">确定</el-button>
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
import { getDetail, addOrUpdate, deleteItem, executeDestroy, approve } from '@/api/claimreturn/oldpart/destroy/oldPartDestroyOrder/index';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getList, getDetailDecryptField } from '../../../../../api/claimreturn/oldpart/inventory/oem';
import AisAttachment from '@/libs/components/AisAttachment';
import { loginUserGet } from '@/libs/api/common';

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
  urls: [],
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
    AisAttachment,
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
          this.getTableData();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    const moduleKey = 'AISCR-' + this.$route.meta.moduleKey;
    return {
      pageTitle: this.$route.meta.name,
      pageType: 'edit',
      title: '销毁审批人ID：' + form.approverId,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey,
      // 是否是门店用户
      isDealer: null,
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      current: 1,
      pageSize: 10,
      total: 0,
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
          field: 'serviceProxyNo',
          title: '接车施工单',
          width: '160',
          click: (row) => {
            this.navigateToRoute({
              path: '/maintain/sp/serviceProxy/edit',
              query: {
                id: row.serviceProxyId
              }
            });
            // BUG: 保修申请单跳转路径未设置
            this.$router.push(`/maintain/sp/serviceProxy/edit?id=${row.serviceProxyId}`);
          }
        },
        {
          field: 'warrantyNo',
          title: '保修申请单',
          width: '180',
          click (row) {
            // TODO 这里需要跳转
          }
        },
        {
          field: 'warrantyApproveTime',
          title: '审批通过时间(保修申请单)',
          width: '180'
        },
        {
          field: 'oldPartUniqueCode',
          title: '旧件唯一码',
          width: '160',
          click: (row) => {
            this.$router.push({
              path: '/claimreturn/oldpart/inventory/oem/edit',
              query: {
                id: row.id
              }
            });
          }
        },
        {
          field: 'dealerName',
          title: '门店名称',
          width: '150',
          click: (row) => {
            this.navigateToRoute({
              path: '/partner/channelManagement/shopDetail',
              query: {
                dealerCode: row.dealerCode,
              },
            });
          }
        },
        {
          field: 'isMainPartLabel',
          title: '是否主因零部件',
          width: '140'
        },
        {
          field: 'vin',
          title: 'VIN',
          width: '180',
          mask: true,
        },
        {
          field: 'oldPartSupplierName',
          title: '旧件供应商',
          width: '150',
          click: (row) => {
            // 点击事件
            this.$router.push('/sparepart/basic/supplierInfo/detail?id=' + row.oldPartSupplierId);
          }
        },
        {
          field: 'mainPartSupplierName',
          title: '主因件供应商',
          width: '150'
        },
        {
          field: 'oldPartCode',
          title: '旧件编码',
          width: '140',
          click: (row) => {
            // 点击事件
            this.$router.push('/sparepart/basic/sparePart/detail?id=' + row.oldPartId);
          }
        },
        {
          field: 'oldPartName',
          title: '旧件名称',
          width: '160'
        },
        {
          field: 'partCode',
          title: '换上零件编码',
          width: '140',
          click: (row) => {
            // 点击事件
            this.navigateToRoute({
              path: '/sparepart/basic/sparePart/detail',
              query: {
                id: row.partId,
              },
            });
            console.log('点击了换上零件编码');
          }
        },
        {
          field: 'partName',
          title: '换上零件名称',
          width: '160'
        },
        {
          field: 'oemStatusLabel',
          title: '主机厂库存状态',
          width: '150'
        },
        {
          field: 'dealerInTime',
          title: '门店入库时间',
          width: '150'
        },
        {
          field: 'dealerOutTime',
          title: '门店出库时间',
          width: '150'
        },
        {
          field: 'oemInTime',
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
        urls: [
          { required: true, message: '请上传文件', trigger: 'change' }
        ]
      },
      // 销毁说明
      dialogFormVisible: false,
      loadingDialog: false,
      // 审批说明
      dialogFormVisible2: false,
      isPass: true,
    };
  },
  mounted () {
    this.getTableData();
    loginUserGet().then(data => {
      this.isDealer = data.accountFlag;
    });
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
    executeDestroy () {
      this.$refs.dialogRuleForm.validate((valid) => {
        if (valid) {
          this.loadingDialog = true;
          executeDestroy({
            id: this._id,
            destroyRemark: this.form.destroyRemark, // 销毁说明
          }).then((res) => {
            this.dialogFormVisible = false;
            this.$message.success('旧件销毁提交成功，请等待审批');
            this.$refs.containerRef.loadDetail();
          }).finally(() => {
            this.loadingDialog = false;
          });
        }
      });
    },
    approveSubmit () {
      approve({
        id: this._id,
        approveRemark: this.form.approveRemark, // 审批说明
        isPass: this.isPass, // 是否通过
      }).then((res) => {
        this.dialogFormVisible2 = false;
        this.$message.success('操作成功');
        this.$refs.containerRef.loadDetail();
      }).catch(() => {
      });
    },
    onBack () {
      this.$router.back();
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getTableData();
    },
    currentPageChange (current) {
      this.current = current;
      this.getTableData();
    },
    // 明细表格
    getTableData () {
      getList({
        oldPartDestroyOrderId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records || [];
        this.total = res.total;
      });
    },
    mask (row, column) {
      const field = column.field;
      const rawField = field + 'Raw';
      const maskField = field + 'Mask';
      if (row[rawField]) {
        const temp = row[field];
        row[field] = row[rawField];
        row[rawField] = temp;
        row[maskField] = !row[maskField];
        return;
      }
      getDetailDecryptField(row.id, field).then(data => {
        row[maskField] = true;
        row[rawField] = row[field];
        row[field] = data;
      });
    },
    onDestory () {
      const allFiles = this.$refs.attachment.getFileList();
      if (!allFiles?.length) {
        this.$message.error('请上传销毁附件信息后，再申请销毁，谢谢');
        return;
      }
      this.dialogFormVisible = true;
    }
  }
};
</script>
