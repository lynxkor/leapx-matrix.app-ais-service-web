<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <edit-base-container ref="containerRef" :id="_id" :title="title" :isEditing.sync="isEditing" :form.sync="form"
        :originalForm.sync="originalForm" :submitRequest="submitRequest" :detailRequest="detailRequest"
        :showEditBtn="stockStatusType">
        <template #status>
          <span v-if="form.status" class="status primary">{{ form.stockStatusLabel }}</span>
        </template>
        <template #extraButtons>
          <el-button v-if="showImportRes" plain size="small" @click="handleImport('sparepartStockTakingDetailRes')">盘点结果导入</el-button>
          <el-button v-if="showInitialize" plain size="small" :loading="actionLoading" @click="handleInitialize">初始化</el-button>
          <el-button v-if="showCancel" plain size="small" :loading="actionLoading" @click="handleCancel">作废</el-button>
          <el-button v-if="showGenerateDifferences" plain size="small" :loading="actionLoading" @click="handleDifference">生成差异单</el-button>
          <el-button v-if="showPrint" type="primary" size="small" @click="handlePrint">打印</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit"
                v-show="isEditing || !_id">
                <el-form-item label="盘点单号：" prop="code">
                  <el-input placeholder="自动生成" v-model="form.code" clearable disabled />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-input placeholder="请输入" v-model="form.dealerName" disabled />
                </el-form-item>
                <el-form-item label="备件仓库：" prop="warehouseId">
                  <el-input placeholder="请输入" v-model="form.warehouseName" disabled />
                </el-form-item>
                <el-form-item label="母公司名称：" prop="companyCode">
                  <el-input placeholder="请输入" v-model="form.companyName" disabled />
                </el-form-item>
                <el-form-item label="盘点类型：" prop="stockType">
                  <fetch-select :request="fetchOptions" enumCode="StockTakingTypeEnum" v-model="form.stockType"
                    placeholder="请选择" clearable filterable :disabled="form.stockStatus !== '0'" />
                </el-form-item>
                <el-form-item label="盘点状态：" prop="stockStatus">
                  <fetch-select :request="fetchOptions" enumCode="StockTakingStatusEnum" v-model="form.stockStatus"
                    placeholder="请选择" clearable filterable disabled />
                </el-form-item>
                <el-form-item label="计划开始时间：">
                  <el-date-picker v-model="form.planStartTime" range-separator="至"
                    value-format="yyyy-MM-dd HH:mm:ss" />
                </el-form-item>
                <el-form-item label="计划完成时间：">
                  <el-date-picker v-model="form.planCompleteTime" range-separator="至"
                    value-format="yyyy-MM-dd HH:mm:ss" />
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
                  <el-input type="textarea" :rows="3" placeholder="请输入" v-model="form.remark" clearable />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="盘点单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.dealerCode}`" target="_blank">
                    {{ form.dealerCode }}
                  </el-link>
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
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
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
                    <base-search
                      style="width: 300px;"
                      filterable
                      clearable
                      remote
                      placeholder="请选择"
                      :remote-method="queryListData"
                      @change="handleAddTableData"
                      value-key="partCode"
                      label-key="partCode"
                      sub-label-key="partName"
                      :disabled="form.stockStatus !== '0'"
                    />
                  <el-button class="search-btn" size="small" @click="handleImport('sparepartStockTakingDetail')" :disabled="form.stockStatus !== '0'">导入备件清单</el-button>
                  <el-button class="search-btn" size="small" @click="handleImport('sparepartStockTakingDetailRes')" :disabled="form.stockStatus !== '2'">盘点结果导入</el-button>
                  <el-button class="search-btn" size="small" @click="handleExport">导出盘点结果</el-button>
                </div>
              </div>
              <div class="common-section-table">
                <vxe-table ref="tableRef" stripe :data="tableData" show-overflow resizable border="inner" size="medium"
                  min-height="0" max-height="400px">
                  <vxe-column field="sparePartCode" title="备件编码" min-width="12.5%" />
                  <vxe-column field="sparePartName" title="备件名称" min-width="12.5%" />
                  <vxe-column field="locationName" title="库位" min-width="12.5%" />
                  <vxe-column field="totalQty" title="库存总数" min-width="12.5%" />
                  <vxe-column field="actualQty" title="实盘库存" min-width="12.5%">
                    <template #default="{ row }">
                      <el-input v-model="row.actualQty" :disabled="!stockStatusType"
                        @change="handleActualQtyBlur(row)" type="number" min="1" />
                    </template>
                  </vxe-column>
                  <vxe-column field="remark" title="备注" min-width="12.5%">
                    <template #default="{ row }">
                      <el-input v-model="row.remark" @change="handleRemarkBlur(row)" :disabled="!stockStatusType" />
                    </template>
                  </vxe-column>
                  <vxe-column field="operatorName" title="操作人" min-width="12.5%">
                    <template #default="{ row }">
                      <el-select
                        v-model="row.operatorName"
                        size="mini"
                        placeholder="请选择"
                        filterable
                        remote
                        :disabled="!stockStatusType"
                        :remote-method="(query) => querySearchAsync(query)"
                        @change="handleOperatorChange(row, $event)"
                      >
                        <el-option
                          v-for="item in userList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </template>
                  </vxe-column>
                  <vxe-column field="createTime" title="创建时间" min-width="12.5%" />
                  <vxe-column title="操作" width="100" fixed="right" v-if="stockStatusType">
                    <template #default="{ row }">
                      <el-popconfirm title="确定要删除吗？" confirm-button-text="删除" confirm-button-type="danger"
                        @confirm="handleDeleteRow(row.id)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{ emptyText }}</div>
                  </template>
                </vxe-table>
                <div class="table-pagination">
                  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
                  </el-pagination>
                </div>
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
    <Upload
      :visible="uploadDialogVisible"
      :businessParams="_id"
      :id="importType"
      @close="handleUploadDialogClose"
      @submit="refreshForm"
    />
    <!-- 生成差异单弹窗 -->
    <DifferenceDialog
      ref="differenceDialogRef"
      :visible.sync="differenceDialogVisible"
      :differenceId="differenceId"
      :differenceList="differenceTableData"
      @update:visible="val => differenceDialogVisible = val"
      @confirm="refreshForm"
    />
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, stockTakingDetailPage, stockTakingDetailAddOrUpdate, stockTakingDetailDelete, initializeItem, cancelItem } from '@/api/sparepart/warehouse/stockTaking/index';
import { getExceptionList, initDifferences } from '@/api/sparepart/warehouse/stockTakingDifferences/index';
import { listDealerPartWithOem } from '@/api/sparepart/basic/sparePart/index';
import FetchSelect from '@/libs/components/FetchSelect';
// import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, getPartDealer, getLoginUser, userQuery, exportTable } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import Upload from '@/libs/components/UploadDialog';
import DifferenceDialog from './DifferenceDialog.vue';
import { handleCommonAction, downloadExcel } from '@/libs/utils';
import BaseSearch from '@/libs/components/BaseSearch';

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

const ACTION_CONFIG = { // 按钮配置
  initiaLize: { title: '此操作将初始化该库存盘点, 是否继续?', success: '初始化成功' },
  cancel: { title: '此操作将作废该库存盘点, 是否继续?', success: '作废成功' }
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
    FetchSelect,
    Upload,
    DifferenceDialog,
    BaseSearch
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '盘点单号：' + this.form.code;
    },
    showInitialize () {
      return this._id && this.form.stockStatus === '0' && this.permissions.has('AISPART-stockTaking-initialize');
    },
    showCancel () {
      return this._id && (this.form.stockStatus === '0' || this.form.stockStatus === '2') && this.permissions.has('AISPART-stockTaking-cancel');
    },
    showImportRes () {
      return this._id && this.form.stockStatus === '2' && this.permissions.has('AISPART-stockTaking-importRes');
    },
    showGenerateDifferences () {
      return this._id && this.form.stockStatus === '2' && this.permissions.has('AISPART-stockTaking-generateDifferences');
    },
    showPrint () {
      return this._id && this.permissions.has('AISPART-stockTaking-print');
    },
    stockStatusType () {
      return this.form.stockStatus === '0' || this.form.stockStatus === '2';
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
    'form.code': {
      handler (val) {
        if (val) {
          this.getData();
        }
      },
      immediate: true
    },
  },
  data () {
    const form = this.getDefautlForm();
    return {
      importType: '',
      uploadDialogVisible: false,
      differenceDialogVisible: false, // 生成差异单弹窗
      actionLoading: false, // 操作loading
      differenceId: '', // 差异单id
      differenceTableData: [], // 差异单数据
      pageTitle: '库存盘点',
      pageType: 'edit',
      moduleKey: 'AISPART-stockTaking',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      pageSize: 10,
      pageNum: 1,
      total: 0,
      emptyText: '若要启用此内容，请创建记录',
      userList: [], // 操作人列表
      tableData: [],
      rules: {
        warehouseId: [
          { required: true, message: '请选择备件仓库', trigger: 'change' }
        ],
        stockType: [
          { required: true, message: '请选择盘点类型', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
    if (!this._id) { // 新增时调账号信息
      this.initDealerUser();
    }
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
    // 导入备件清单
    handleImport (type) {
      this.importType = type;
      this.uploadDialogVisible = true;
    },
    // 导出盘点结果
    handleExport () {
      this.exportLoading = true;
      const reqParams = { stockTakingId: this._id };
      exportTable({
        businessType: '库存盘点',
        dataFetchPath: 'sp/web/dealer/stockTakingDetail/page',
        reqParams,
        titleMap: {
          sparePartCode: '备件编码',
          sparePartName: '备件名称',
          locationName: '库位',
          totalQty: '库存总数',
          actualQty: '实盘库存',
          remark: '备注',
          operatorName: '操作人',
          createTime: '创建时间',
        },
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '盘点结果.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$message({
            type: 'info',
            message: '请前往导出列表中查询导出结果'
          });
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
      this.getData();
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    async refreshForm () { // 刷新表单
      await this.$refs.containerRef.loadDetail();
      this.getData();
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 删除备件清单
    async handleDeleteRow (id) {
      if (id) {
        await stockTakingDetailDelete([id]);
        this.$message.success('删除成功');
        this.refreshForm();
      }
    },
    async queryListData (queryString) {
      // 查询当前门店备件列表
      return new Promise(resolve => {
        // 根据需求调用接口
        listDealerPartWithOem({ partCodeOrNameLike: queryString, status: 1, pageSize: 20 }).then(res => {
          const list = res || [];
          resolve(list);
        });
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
      const params = {
        stockTakingId: this._id,
        stockTakingCode: this.form.code,
        sparePartId: record.id,
      };
      this.handleAddOrUpdate(params, 'add');
    },
    // 修改备件清单
    handleBlur (val) {
      const params = {
        stockTakingId: this._id,
        stockTakingCode: this.form.code,
        sparePartId: val.id,
      };
      this.handleAddOrUpdate(params, 'update');
    },
    // 调取备件接口
    async handleAddOrUpdate (params) {
      await stockTakingDetailAddOrUpdate(params);
      this.$message.success('操作成功');
      this.getData();
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
    },
    // 获取盘点明细
    async getData () {
      const params = {
        stockTakingId: this._id,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await stockTakingDetailPage(params);
      this.total = res.total || 0;
      this.tableData = res.records || [];
      console.log(this.tableData);
    },
    handleCurrentChange (pageNum) {
      this.pageNum = pageNum;
      this.getData();
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.pageNum = 1;
      this.getData();
    },
    // 失焦以后 保存输入的库存数量
    handleActualQtyBlur (val) {
      if (val.actualQty) {
        const params = {
          id: val.id,
          actualQty: val.actualQty,
          remark: val.remark,
        };
        this.handleAddOrUpdate(params);
      }
    },
    // 失焦以后 输入的备注 判断是否 实盘库存是否超过库存总数
    handleRemarkBlur (val) {
      this.handleActualQtyBlur(val);
    },
    // 远程搜索方法，接收行索引参数
    querySearchAsync (queryString) {
      userQuery({ keyword: queryString }).then(res => {
        const list = res?.map(item => {
          return {
            value: item.userId,
            label: item.username
          };
        }) || [];

        this.userList = list;
      }).catch(error => {
        console.log('搜索用户失败:', error);
        this.userList = [];
      });
    },
    handleOperatorChange (row, val) {
      row.operator = this.userList.find(item => item.value === val)?.value;
      row.operatorName = this.userList.find(item => item.value === val)?.label;
      const params = {
        id: row.id,
        operator: val,
        operatorName: row.operatorName,
        actualQty: val.actualQty,
        remark: val.remark,
      };
      this.handleAddOrUpdate(params);
    },
    // 调用二次确认弹框
    _handleAction (apiFn, config) {
      this.actionLoading = true;
      handleCommonAction({
        $confirm: this.$confirm,
        $message: this.$message,
        apiFn,
        id: this._id,
        config,
        onSuccess: () => {
          this.actionLoading = false;
          this.refreshForm();
        },
        onComplete: () => {
          this.actionLoading = false;
        }
      });
    },
    // 初始化
    handleInitialize () {
      this._handleAction(initializeItem, ACTION_CONFIG.initiaLize);
    },
    // 作废
    handleCancel () {
      this._handleAction(cancelItem, ACTION_CONFIG.cancel);
    },
    // 生成差异单
    async handleDifference () {
      const message = '<div class="ais-leave-tips-main"><i class="iconfont icon-lxppc-prompt"></i>此操作将生成差异单, 是否继续?</div>';

      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        customClass: 'ais-leave-tips',
        showClose: false
      }).then(async () => {
        // 调用 API
        const res = await getExceptionList({ id: this._id });
        if (res.length > 0) {
          this.differenceId = this._id;
          this.differenceTableData = res;
          this.differenceDialogVisible = true;
        } else {
          await initDifferences({ id: this._id });
          this.$message.success('生成差异单成功!');
          this.refreshForm();
        }
      }).catch((err) => {
        // 错误处理
        if (err !== 'cancel') {
          console.error('操作失败:', err);
        }
      });
    },
    // 打印
    handlePrint () {
      this.$print.show({
        id: this._id,
        template: 'InventoryCount',
        title: `${this.form.dealerName}厅店库存盘点单`
      });
    },
  }
};
</script>

<style scoped lang="scss">
.search-btn {
  margin-left: 8px;
  border-radius: 4px;
}
</style>
