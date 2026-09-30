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
        :showEditBtn="form.destroyStatus === '10'"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
        </template>
        <template #extraButtons>
          <!-- 门店可操作：草稿(自建单直接销毁)/待销毁/销毁已驳回，校验和后续流程一致 -->
          <el-button v-if="isDealer && (form.destroyStatus === '10' || form.destroyStatus === '40' || form.destroyStatus === '70')" @click="onDestory" size="small">销毁</el-button>
          <!-- 主机厂可操作 -->
          <el-button v-if="canApprove && !isDealer && form.destroyStatus === '50'" @click="dialogFormVisible2 = true" size="small">审批</el-button>
          <!-- 打印销毁单：所有状态可用 -->
          <el-button @click="onPrintDestroyOrder" size="small">打印销毁单</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑态（新增/草稿编辑）：系统控制字段统一置灰展示（参考快返回运单） -->
              <el-form v-if="isEditing || !_id" label-width="150px" :inline="true" :model="form" :rules="rules" ref="ruleForm" class="form-edit">
                <el-form-item label="旧件销毁单号：" prop="destroyOrderNo">
                  <base-input
                    v-model="form.destroyOrderNo"
                    disabled
                    placeholder="保存后系统自动生成"
                  />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerCode">
                  <!-- 门店操作：置灰，自动带入当前门店名称 -->
                  <base-input
                    v-if="isDealer === true"
                    v-model="form.dealerName"
                    disabled
                    placeholder="保存后自动带入当前门店"
                  />
                  <!-- 主机厂操作：复用门店选择组件（模糊搜索门店编码/名称，与门店旧件回运单列表一致） -->
                  <dealer-select
                    v-else-if="isDealer === false"
                    v-model="form.dealerCode"
                    :default-dealer-name="form.dealerName"
                  />
                  <base-input v-else disabled />
                </el-form-item>
                <el-form-item label="销毁单状态：" prop="destroyStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="old_part_destroy_status"
                    v-model="form.destroyStatus"
                    disabled
                    placeholder="系统自动识别"
                  />
                </el-form-item>
                <el-form-item label="来源：" prop="destroySource">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="old_part_destroy_source"
                    v-model="form.destroySource"
                    disabled
                    placeholder="系统自动识别"
                  />
                </el-form-item>
              </el-form>
              <!-- 详情态 -->
              <el-form v-else :inline="true" class="form-detail">
                <el-form-item label="旧件销毁单号：" prop="destroyOrderNo">
                  {{ form.destroyOrderNo }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="销毁单状态：" prop="destroyStatusLabel">
                  {{ form.destroyStatusLabel }}
                </el-form-item>
                <el-form-item label="来源：" prop="destroySourceLabel">
                  {{ form.destroySourceLabel }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section v-if="_id" class="common-section">
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
              <!-- 快返交互：提交新建后，即可添加 -->
              <template v-if="_id">
                <div class="ais-actions">
                  <el-button v-if="canEditDetail" size="small" plain type="primary" @click="openAdd"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
                  <el-button v-if="canEditDetail" size="small" :disabled="!selectedRows.length" @click="handleRemoveRows">移除</el-button>
                  <el-button size="small" :loading="exportLoading" @click="exportExcel">导出</el-button>
                </div>
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
                    @checkboxChange="checkboxChange"
                    @page-size-change="pageSizeChange"
                    @current-page-change="currentPageChange"
                  >
                    <template v-slot:default="{ row, column, col }">
                      <div class="cell-content">
                        <template v-if="col.click">
                          <el-button class="link btn-text" @click="() => col.click(row)" type="text">{{ row[column.field] }}</el-button>
                        </template>
                        <span v-else class="cell-text">{{ row[column.field] }}</span>
                        <template v-if="col.mask">
                          <span v-if="!row[column.field + 'Mask']" @click="mask(row, column)" class="eye-icon iconfont icon-lxppc-eye"></span>
                          <span v-else @click="mask(row, column)" class="eye-icon iconfont icon-lxppc-eye-off"></span>
                        </template>
                      </div>
                    </template>
                  </edit-table>
                </div>
              </template>
              <div v-else class="empty-tip">提交新建后，即可添加</div>
            </div>
          </section>
          <section v-if="_id" class="common-section">
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
          <el-button size="small" type="primary" @click="approveSubmit" :loading="approveLoading">确定</el-button>
        </div>
      </el-dialog>
      <!-- 添加旧件弹窗（复用快返回运单的旧件库存选择弹窗，type=destroy） -->
      <old-part-dialog
        type="destroy"
        :visible.sync="visibleDestroyDialog"
        :_id="_id"
        :dealerCode="form.dealerCode"
        @update="getTableData"
      />
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, deleteItem, executeDestroy, approve, addDestroyDetail, removeDestroyDetail } from '@/api/claimreturn/oldpart/destroy/oldPartDestroyOrder/index';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import BaseInput from '@/libs/components/BaseInput/index.vue';
import DealerSelect from '@/components/dealer-select/index.vue';
import { getEnum, exportTable } from '@/api/common';
import { downloadExcel } from '@/libs/utils';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getList, getDetailDecryptField } from '../../../../../api/claimreturn/oldpart/inventory/oem';
import AisAttachment from '@/libs/components/AisAttachment';
import { loginUserGet } from '@/libs/api/common';
import OldPartDialog from '../../components/OldPartDialog/index.vue';

const defaultForm = {
  // 多选时字段有变化，自行修复
  approverId: '',
  destroyOrderNo: '',
  dealerName: '',
  destroyStatus: '',
  destroySource: '',
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
    OldPartDialog,
    FetchSelect,
    BaseInput,
    DealerSelect,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    // 明细可维护：销毁单为草稿且拥有新增/编辑权限
    canEditDetail () {
      return this.form.destroyStatus === '10' && this.canAddOrUpdate;
    },
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
    },
    // 保存成功（退出编辑）或进入编辑时，刷新明细列表
    isEditing (val) {
      if (this._id) {
        this.getTableData();
      }
      // 退出编辑态时重置勾选
      if (!val) {
        this.selectedRows = [];
      }
    },
    // 新增保存后跳转编辑（路由query.id变化，组件复用场景）
    '$route.query.id' (val) {
      if (val && !this.id) {
        this.$nextTick(() => {
          if (this.$refs.containerRef) {
            this.$refs.containerRef.loadDetail();
          }
          this.getTableData();
        });
      }
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
      isEditing: false,
      visibleDestroyDialog: false,
      selectedRows: [],
      loading: false,
      submitLoading: false,
      exportLoading: false,
      approveLoading: false,
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
          field: 'serialNo',
          title: '序号',
          width: '60',
        },
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
            this.$router.push(`/maintain/sp/serviceProxy/edit?id=${row.serviceProxyId}`);
          }
        },
        {
          field: 'warrantyNo',
          title: '保修申请单',
          width: '180',
          click: (row) => {
            this.$router.push(`/claimreturn/claim/warrantyApply/edit?id=${row.warrantyId}`);
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
          field: 'partUnitPrice',
          title: '零件单价',
          width: '120'
        },
        {
          field: 'dealerName',
          title: '门店名称',
          width: '150',
          click: (row) => {
            this.navigateToRoute({
              path: '/datacenter/store/store/detail',
              query: {
                storeCode: row.dealerCode,
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
            this.$router.push('/sparepart/basic/supplierInfo/edit?id=' + row.oldPartSupplierId);
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
            this.$router.push('/sparepart/basic/sparePart/edit?id=' + row.oldPartId);
          }
        },
        {
          field: 'oldPartName',
          title: '旧件名称',
          width: '160'
        },
        {
          field: 'oldPartQuantity',
          title: '数量',
          width: '100'
        },
        {
          field: 'partCode',
          title: '换上零件编码',
          width: '140',
          click: (row) => {
            // 点击事件
            this.navigateToRoute({
              path: '/sparepart/basic/sparePart/edit',
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
        dealerCode: [
          {
            // 门店用户门店由后端自动带入当前门店，前端不校验；主机厂用户必选
            validator: (rule, value, callback) => {
              if (this.isDealer || value) {
                callback();
              } else {
                callback(new Error('请选择门店'));
              }
            },
            trigger: 'change'
          }
        ],
        destroyRemark: [
          { required: true, message: '请输入销毁说明', trigger: 'change' }
        ]
      },
      // 销毁说明
      dialogFormVisible: false,
      loadingDialog: false,
      // 审批说明
      dialogFormVisible2: false,
      isPass: true,
      canApprove: true,
    };
  },
  created () {
    this.canApprove = this.permissions.has(`${this.moduleKey}-approve`);
  },
  mounted () {
    // 新增模式（无id）不查明细，避免空条件查询出全量数据
    if (this._id) {
      this.getTableData();
    }
    loginUserGet().then(data => {
      // !! 强转布尔，避免接口返回非严格布尔导致三态分支失效
      this.isDealer = !!data.accountFlag;
      // 新增时预填系统自动识别的字段（保存后以服务端落库为准）
      if (!this._id) {
        this.form.destroyStatus = this.form.destroyStatus || '10';
        this.form.destroySource = this.isDealer ? '10' : '20';
        // 门店用户：自动带入当前门店（需求：不支持编辑；后端保存时仍会以当前登录门店覆盖，双保险）
        if (this.isDealer) {
          this.form.dealerCode = data.currentDealerCode || data.currentOrgCode;
          this.form.dealerName = data.currentDealerName || data.currentOrgName;
          this.form.ownerOrgId = data.currentOrgId;
        }
      }
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
    // 添加明细：打开旧件库存选择弹窗
    openAdd () {
      if (!this.form.dealerCode) {
        this.$message.info('请选择门店');
        return;
      }
      this.visibleDestroyDialog = true;
    },
    // 批量移除选中的明细
    handleRemoveRows () {
      this.$confirm('您确定要移除选择的【' + this.selectedRows.length + '】条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.selectedRows.map(item => item.id);
        removeDestroyDetail({
          id: this._id,
          detailIdList: ids,
        }).then(() => {
          this.$message.success('移除成功');
          this.selectedRows = [];
          this.getTableData();
        });
      }).catch(() => {});
    },
    // 明细表格勾选
    checkboxChange (records) {
      this.selectedRows = records;
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
      this.approveLoading = true;
      approve({
        id: this._id,
        approveRemark: this.form.approveRemark, // 审批说明
        isPass: this.isPass, // 是否通过
      }).then((res) => {
        this.dialogFormVisible2 = false;
        this.$message.success('操作成功');
        this.$refs.containerRef.loadDetail();
      }).catch(() => {
      }).finally(() => {
        this.approveLoading = false;
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
    // 明细排序规则（按需求，固定单一规则）：
    // 添加即保存，详情列表始终按：零件单价倒序 → 旧件唯一码正序 → 添加时间倒序
    // 末位统一追加 id 兜底（唯一键），避免排序键相同的行（如唯一码重复/为空）分页时顺序不稳定
    buildDetailSortColumns () {
      return [
        { column: 'part_unit_price', sort: 'DESC' },
        { column: 'old_part_unique_code', sort: 'ASC' },
        { column: 'update_time', sort: 'DESC' },
        { column: 'id', sort: 'DESC' }
      ];
    },
    // 明细表格
    getTableData () {
      if (!this._id) {
        return;
      }
      getList({
        oldPartDestroyOrderId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current,
        sortColumns: this.buildDetailSortColumns()
      }).then((res) => {
        const records = res.records || [];
        this.tableData = records.map((item, idx) => ({
          ...item,
          serialNo: records.length - idx,
        }));
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
    },
    // 打印销毁单：按打印模板渲染销毁清单（所有状态可用）
    onPrintDestroyOrder () {
      this.$print.show({
        id: this._id,
        template: 'OldPartDestroyOrder',
        title: '打印销毁单',
        width: 1122
      });
    },
    exportExcel () {
      this.exportLoading = true;
      const titleMap = {};
      this.columns.forEach(col => {
        // 序号是前端分页计算的展示字段（后端接口无此字段），导出需剔除避免空列
        if (col.field === 'serialNo') {
          return;
        }
        titleMap[col.field] = col.title;
      });
      exportTable({
        businessType: '旧件销毁明细',
        dataFetchPath: '/claimreturn/oldpart/web/inventory/oldPartOemInventory/page',
        reqParams: {
          oldPartDestroyOrderId: this._id,
          // 导出与列表同排序规则，避免导出顺序与页面不一致
          sortColumns: this.buildDetailSortColumns()
        },
        titleMap,
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '旧件销毁明细.xlsx');
          } catch (error) {
            this.$message({ type: 'error', message: '文件导出失败' });
          }
        } else {
          this.$confirmExport(
            () => window.open('/service/excelManagement/commonDataProcessExcelTask', '_blank'),
            { message: '正在导出中，是否要跳转"系统管理-文件管理-导出任务"中查看？' }
          );
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.btn-text{
  white-space: nowrap!important;
}
.form-static-text{
  color: #606266;
}
.empty-tip{
  padding: 16px 0;
  color: #909399;
  font-size: 13px;
}
.cell-content {
  display: flex;
  align-items: center;
  overflow: hidden;

  .cell-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .eye-icon{
    color: var(--leap-color-primary);
  }
  .link {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }
}
</style>
