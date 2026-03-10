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
                <el-form-item label="盘点单号：" prop="code">
                  <el-input
                    placeholder="自动生成"
                    v-model="form.code"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="备件仓库：" prop="warehouseId">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="母公司名称：" prop="companyCode">
                  {{ form.companyName }}
                </el-form-item>
                <el-form-item label="盘点类型：" prop="stockType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="StockTakingTypeEnum"
                    v-model="form.stockType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="盘点状态：" prop="stockStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="StockTakingStatusEnum"
                    v-model="form.stockStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="计划开始时间：">
                  <el-date-picker
                    v-model="form.planStartTime"
                    :picker-options="planStartTime"
                    range-separator="至"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  />
                </el-form-item>
                <el-form-item label="计划完成时间：">
                  <el-date-picker
                    v-model="form.planCompleteTime"
                    :picker-options="planCompleteTime"
                    range-separator="至"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="盘点单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="备件仓库：" prop="warehouseId">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="母公司名称：" prop="companyCode">
                  {{ form.companyName }}
                </el-form-item>
                <el-form-item label="盘点类型：" prop="stockType">
                  {{ form.stockTypeLabel }}
                </el-form-item>
                <el-form-item label="盘点状态：" prop="stockStatus">
                  {{ form.stockStatusLabel }}
                </el-form-item>
                <el-form-item label="计划开始时间：" prop="planStartTime">
                  {{ form.planStartTime }}
                </el-form-item>
                <el-form-item label="计划完成时间：" prop="planCompleteTime">
                  {{ form.planCompleteTime }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>盘点明细</h2>
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
import { getDetail, addOrUpdate } from '@/api/sparepart/warehouse/stockTaking/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, getUserByNameOrNo, listOrgStoreInfoByParam, getParentCompany, listWarehouse, getPartDealer, getLoginUser  } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  code: '',
  dealerCode: '',
  dealerName: '',
  companyCode: '',
  warehouseId: '',
  stockType: '',
  stockStatus: '0',
  planStartTime: '',
  planCompleteTime: '',
  remark: '',
  createTime: '',
  updateTime: '',
  companyName: '',
};

export default {
  name: 'stockTakingEdit',
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
      return '盘点单号：' + this.form.code;
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
      pageTitle: '库存盘点',
      pageType: 'edit',
      moduleKey: 'AISPART-stockTaking',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [],
      rules: {
        warehouseId: [
          { required: true, message: '请选择备件仓库', trigger: 'change' }
        ],
        stockType: [
          { required: true, message: '请选择盘点类型', trigger: 'change' }
        ],
        stockStatus: [
          { required: true, message: '请选择盘点状态', trigger: 'change' }
        ],
        planStartTime: [
          { required: true, message: '请选择计划开始时间', trigger: 'change' }
        ],
        planCompleteTime: [
          { required: true, message: '请选择计划完成时间', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    this.initDealerUser();
  },
  methods: {
    async initDealerUser () {
      // 查询是否店端 true为门店  false为厂端
      const res = await getLoginUser();
      this.form.dealerCode = res.currentDealerCode;// 当前门店code
      this.form.dealerName = res.currentDealerName;// 当前门店名称

      // 查询当前门店信息 公司
      const resDealer = await getPartDealer({ code: this.form.dealerCode });

      this.form.companyCode = resDealer.parentCompanyCode;// 当前门店code
      this.form.companyName = resDealer.parentCompanyName;// 当前门店名称

      this.form.warehouseName = resDealer.warehouseName;
      this.form.warehouseId = resDealer.warehouseId;// 当前门店code
      this.form.warehouseCode = resDealer.warehouseCode;// 当前门店名称
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
