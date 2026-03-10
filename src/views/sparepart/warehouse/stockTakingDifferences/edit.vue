<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
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
          <span v-if="form.status" class="status primary">{{ form.status }}</span>
        </template>
        <template #extraButtons>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="差异单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="盘点单号：" prop="stockTakingCode">
                  {{ form.stockTakingCode }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="母公司名称：" prop="companyName">
                  {{ form.companyName }}
                </el-form-item>
                <el-form-item label="备件仓库：" prop="warehouseId">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="差异单状态：" prop="orderStatus">
                  {{ form.orderStatusLabel }}
                </el-form-item>
                <el-form-item label="差异类型：" prop="differencesType">
                  {{ form.differencesTypeLabel }}
                </el-form-item>
                <el-form-item label="盘点类型：" prop="stockType">
                  {{ form.stockTypeLabel }}
                </el-form-item>
                <el-form-item label="申请人：" prop="apply">
                  {{ form.apply }}
                </el-form-item>
                <el-form-item label="申请时间：" prop="applyTime">
                  {{ form.applyTime }}
                </el-form-item>
                <el-form-item label="申请说明：" prop="applyDescription">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入"
                    v-model="form.applyDescription"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="审批人：" prop="approver">
                  {{ form.approver }}
                </el-form-item>
                <el-form-item label="审批时间：" prop="approvalTime">
                  {{ form.approvalTime }}
                </el-form-item>
                <el-form-item label="审批说明：" prop="approvalDescription">
                  {{ form.approvalDescription }}
                </el-form-item>
                <el-form-item label="出入库操作人：" prop="operationOperator">
                  {{ form.operationOperator }}
                </el-form-item>
                <el-form-item label="出入库操作时间：" prop="operationTime">
                  {{ form.operationTime }}
                </el-form-item>
                <el-form-item label="出入库状态：" prop="outInboundStatus">
                  {{ form.outInboundStatusLabel }}
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="差异单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="盘点单号：" prop="stockTakingCode">
                  {{ form.stockTakingCode }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="母公司名称：" prop="companyName">
                  {{ form.companyName }}
                </el-form-item>
                <el-form-item label="备件仓库：" prop="warehouseId">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="差异单状态：" prop="orderStatus">
                  {{ form.orderStatusLabel }}
                </el-form-item>
                <el-form-item label="差异类型：" prop="differencesType">
                  {{ form.differencesTypeLabel }}
                </el-form-item>
                <el-form-item label="盘点类型：" prop="stockType">
                  {{ form.stockTypeLabel }}
                </el-form-item>
                <el-form-item label="申请人：" prop="apply">
                  {{ form.apply }}
                </el-form-item>
                <el-form-item label="申请时间：" prop="applyTime">
                  {{ form.applyTime }}
                </el-form-item>
                <el-form-item label="申请说明：" prop="applyDescription">
                  {{ form.applyDescription }}
                </el-form-item>
                <el-form-item label="审批人：" prop="approver">
                  {{ form.approver }}
                </el-form-item>
                <el-form-item label="审批时间：" prop="approvalTime">
                  {{ form.approvalTime }}
                </el-form-item>
                <el-form-item label="审批说明：" prop="approvalDescription">
                  {{ form.approvalDescription }}
                </el-form-item>
                <el-form-item label="出入库操作人：" prop="operationOperator">
                  {{ form.operationOperator }}
                </el-form-item>
                <el-form-item label="出入库操作时间：" prop="operationTime">
                  {{ form.operationTime }}
                </el-form-item>
                <el-form-item label="出入库状态：" prop="outInboundStatus">
                  {{ form.outInboundStatusLabel }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>差异明细</h2>
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
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/sparepart/warehouse/stockTakingDifferences/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  applyDescription: '',
  code: '',
  stockTakingCode: '',
  dealerCode: '',
  companyCode: '',
  warehouseId: '',
  stockType: '',
  differencesType: '',
  orderStatus: '',
  outInboundStatus: '',
  createTime: '',
  updateTime: '',
  remark: '',
  dealerName: '',
  companyName: '',
  apply: '',
  applyTime: '',
  approver: '',
  approvalTime: '',
  approvalDescription: '',
  operationOperator: '',
  operationTime: '',
};

export default {
  name: 'stockTakingDifferencesEdit',
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
      return '盘点差异单号：' + this.form.code;
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
      pageTitle: '盘点差异单',
      pageType: 'edit',
      moduleKey: 'AISPART-stockTakingDifferences',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [],
      rules: {
        warehouseId: [
          { required: false, message: '请选择备件仓库 ID', trigger: 'change' }
        ],
        differencesType: [
          { required: false, message: '请选择差异类型', trigger: 'change' }
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'change' }
        ],
      }
    };
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
    openPane () {
      this.$refs.editLayout.openPane();
    },
    handleDeleteRow (index) {
      this.tableData.splice(index, 1);
    },
    queryListData (queryString) {
      return new Promise(resolve => {
        resolve([]);
      });
    },
    handleAddTableData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      const exists = this.tableData.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      this.tableData.push(record);
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
