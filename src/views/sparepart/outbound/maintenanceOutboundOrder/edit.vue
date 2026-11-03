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
        :showEditBtn="remarkEditable"
      >
        <template #extraButtons>
          <el-button v-if="form.outboundStatus !== '1' && form.outboundStatus !== '2' && permissions.has('AISPART-maintenanceOutboundOrder-outbound')" size="small" @click="repairPopup">出库</el-button>
          <el-button v-if="permissions.has('AISPART-maintenanceOutboundOrder-print')" size="small" type="primary" @click="handlePrint">打印</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- 编辑态：仅备注可编辑，其他只读 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="出库单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.dealerCode}`" target="_blank">
                    {{ form.dealerCode }}
                  </el-link>
                </el-form-item>
                <el-form-item label="出库状态：" prop="outboundStatus">
                  {{ form.outboundStatusLabel }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="备件仓库：" prop="warehouseId">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="接车施工单：" prop="serviceProxyCode">
                  <el-link type="primary" :href="`/service/maintain/sp/serviceProxy/edit?id=${form.serviceProxyId}`" target="_blank">
                    {{ form.serviceProxyCode }}
                  </el-link>
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
                  <el-input
                    type="textarea"
                    maxlength="500"
                    show-word-limit
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <!-- 详情态：全部只读 -->
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="出库单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                    <el-link type="primary" :href="`/service/datacenter/store/store/detail?storeCode=${form.dealerCode}`" target="_blank">
                    {{ form.dealerCode }}
                  </el-link>
                </el-form-item>
                <el-form-item label="出库状态：" prop="outboundStatus">
                  {{ form.outboundStatusLabel }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="备件仓库：" prop="warehouseName">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="接车施工单：" prop="serviceProxyCode">
                  <el-link type="primary" :href="`/service/maintain/sp/serviceProxy/edit?id=${form.serviceProxyId}`" target="_blank">
                    {{ form.serviceProxyCode }}
                  </el-link>
                </el-form-item>
                <el-form-item label="备注：" prop="remark" style="width: 100%;">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="客户经理：" prop="remark">
                  {{ form.serviceAdvisorName }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <div class="common-section-header__title">
                <h2>出库明细信息</h2>
                <CustomView
                  :biz-key="viewBizKey"
                  :active-preset-id.sync="activeViewId"
                  :value="viewConditionTree"
                  :sort-columns="viewSortColumns"
                  trigger-text="系统视图"
                  :dialog-component="viewDialogComponent"
                  :dialog-props="viewDialogProps"
                  local-apply
                  enable-default-view
                  @copy="onViewCopy"
                  @change="onViewChange"
                  @save="onViewSave"
                />
              </div>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :key="tableColumnsKey"
                  :columns="displayColumns"
                  :data="tableData"
                  :checkbox="true"
                  :show-toolbar="false"
                  :isFocusNewRow="false"
                  :showPagination="true"
                  :current="collarParams.current"
                  :pageSize="collarParams.pageSize"
                  :total="collarParams.total"
                  @page-size-change="pageSizeChange"
                  @current-page-change="currentPageChange"
                  @checkboxChange="handleCheckboxChange"
                />
              </div>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>退料明细信息</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columnsTl"
                  :data="goTableData"
                  :show-toolbar="false"
                  :isFocusNewRow="false"
                  :showPagination="true"
                  :current="goParams.current"
                  :pageSize="goParams.pageSize"
                  :total="goParams.total"
                  @page-size-change="goPageSize"
                  @current-page-change="goCurrentPage"
                />
              </div>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <!-- 右侧栏组件，自行开发 -->
    </template>
    <!-- 出库弹窗组件 -->
    <RepairDialog
      ref="repairDialogRef"
      :id="maintenanceId"
      :visible.sync="repairDialogVisible"
      @update:visible="val => repairDialogVisible = val"
      @success="refreshDetail"
    />
  </edit-page-layout>
</template>

<script>
import { getDetail, collarPage, goPage, updateRemark } from '@/api/sparepart/outbound/maintenanceOutboundOrder/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, getTableConfig, tableAddOrUpdate } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import RepairDialog from './RepairDialog.vue';
import CustomView from '@/libs/components/CustomView/index.vue';
import PersonalViewSetting from '@/components/PersonalViewSetting/index.vue';
import { executeQuery } from '@/libs/api/customView/customQueryView';
import {
  applyTableConfig,
  viewTableConfigCode
} from '@/components/PersonalViewSetting/localView';

// 个人视图的业务键:后端已为该 bizKey 配置好出库明细的字段元数据
// (customViewMain.path = /sp/web/maintenance/maintenanceOutboundOrderDetail/page)
const VIEW_BIZ_KEY = 'maintenanceOutboundOrderDetail';

const defaultForm = {
  // 多选时字段有变化，自行修复
  maintenanceOutboundOrderCode: '',
  dealerCode: '',
  dealerName: '',
  warehouseId: '',
  serviceProxyId: '',
  vehProfileVin: '',
  carPlate: '',
  outboundStatus: '',
  outboundStatusLabel: '',
  remark: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  returnMaterialStatus: '',
};

export default {
  name: 'maintenanceOutboundOrderEdit',
  // 集中视图预留
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
    EditTable,
    RepairDialog,
    CustomView
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '出库单号：' + this.form.code;
    },
    // 出库状态为待出库(0)或部分出库(3)时可编辑备注
    remarkEditable () {
      return this.form.outboundStatus === '0' || this.form.outboundStatus === '3';
    },
    /**
     * 实际渲染的出库明细列。
     * 视图的「自定义表格」配置(列显隐 + 顺序)在此生效。
     */
    displayColumns () {
      return applyTableConfig(this.columns, this.viewTableConfig);
    },
    /**
     * 表格组件的 key。
     *
     * <p>EditTable 内部是 vxe-table,vxe 在 columns prop 变化时只同步列的 visible,
     * <b>不会重排已有列的位置</b> —— 视图里拖拽调整的列顺序会不生效。
     * 这里用「可见列的字段序列」做 key,列顺序或显隐一变就重建表格组件,
     * 让 vxe 按新顺序渲染。未使用视图时 key 恒定,不影响常规操作。</p>
     */
    tableColumnsKey () {
      return this.displayColumns.map(col => col.field).join('|');
    },
    /**
     * 个人视图的业务键。
     */
    viewBizKey () {
      return VIEW_BIZ_KEY;
    },
    /**
     * 传给「个人视图设置」弹窗的 props。
     *
     * <p>config: 当前明细表的列定义 —— 弹窗里的「自定义显示列」据此渲染可勾选项。
     * perfTabCode: 性能测试的业务上下文(当前维修出库单 ID)—— 该 bizKey 的视图
     * 走通用视图查询(executeQuery),后端需要 tabCode 才能定位单据,
     * 性能测试同样要把 tabCode 带上,否则后端 perf 查不到数据、永远测不过。
     * showBaseSettings: EditTable 写死了 show-overflow 与行高,不支持折行/紧凑度,故隐藏。</p>
     */
    viewDialogProps () {
      return {
        config: {
          autoWrap: false,
          layout: 3,
          isOperateFixed: true,
          columnConfig: this.columns.map(col => ({
            props: col.field,
            label: col.title,
            visible: true,
            disabled: false,
            type: ''
          }))
        },
        perfTabCode: this._id,
        showBaseSettings: false
      };
    },
    /**
     * 「新增/编辑视图」弹窗组件。
     * 标准 CustomView 通过 dialog-component 入参接收,默认用内置的
     * CustomQueryDialog(仅自定义条件查询),这里换成合并后的「个人视图设置」。
     */
    viewDialogComponent () {
      return PersonalViewSetting;
    }
  },
  watch: {
    _id: {
      handler (val) {
        if (val) {
          this.getCollar();
          this.getOut();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '维修出库',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-maintenanceOutboundOrder',
      isEditing: false,
      loading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      // 退料列表
      goTableData: [],
      goParams: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      // 出库列表
      collarParams: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      // 当前选中的个人视图 id(null = 系统视图)
      activeViewId: null,
      // 当前视图的表格配置(列显隐/顺序)
      viewTableConfig: null,
      // 当前视图的筛选条件树
      viewConditionTree: null,
      // 当前视图的排序项 [{column, sort}]
      viewSortColumns: [],
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
          field: 'sparePartCode',
          title: '备件编码',
          width: '8%',
        },
        {
          field: 'sparePartName',
          title: '备件名称',
          width: '8%',
        },
        {
          field: 'locationName',
          title: '库位',
          width: '8%',
        },
        {
          field: 'availableQty',
          title: '可用库存',
          width: '8%',
        },
        {
          field: 'outboundQty',
          title: '出库数量',
          width: '8%',
        },
        {
          field: 'returnApplicationQty',
          title: '退料数量',
          width: '8%',
        },
        {
          field: 'price',
          title: '单价',
          width: '8%',
        },
        {
          field: 'discountAmount',
          title: '优惠金额',
          width: '8%',
        },
        {
          field: 'partsAmount',
          title: '应付金额',
          width: '8%',
        },
        {
          field: 'costUnitPrice',
          title: '成本价格',
          width: '8%',
        },
        {
          field: 'outboundIsLabel',
          title: '是否出库',
          width: '8%',
        },
        {
          field: 'pickerName',
          title: '领料人',
          width: '8%',
        },
        {
          field: 'pickTime',
          title: '领料日期',
          width: '8%',
        },
        {
          field: 'remark',
          title: '备注',
          width: '8%',
        },
      ],
      columnsTl: [
        {
          field: 'sparePartCode',
          title: '备件编码',
          width: '9%',
        },
        {
          field: 'sparePartName',
          title: '备件名称',
          width: '9%',
        },
        {
          field: 'locationName',
          title: '库位',
          width: '9%',
        },
        {
          field: 'returnApplicationQty',
          title: '退料申请数量',
          width: '9%',
        },
        {
          field: 'returnApplicationReason',
          title: '申请退料原因',
          width: '9%',
        },
        {
          field: 'returnApplicantName',
          title: '退料申请人',
          width: '9%',
        },
        {
          field: 'returnApplicationTime',
          title: '退料申请时间',
          width: '9%',
        },
        {
          field: 'inboundIsLabel',
          title: '是否已入库',
          width: '9%',
        },
        {
          field: 'returnWarehousingOperatorName',
          title: '退料入库人',
          width: '9%',
        },
        {
          field: 'returnWarehousingTime',
          title: '退料入库时间',
          width: '9%',
        },
        {
          field: 'remark',
          title: '备注',
          width: '9%',
        },
      ],
      rules: {
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
      },
      repairDialogVisible: false, // 维修出库弹窗
      maintenanceId: '', // 维修出库id
      selectedRows: [], // 表格选中的行
    };
  },
  mounted () {
  },
  methods: {
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    handleBack () {
      this.$router.back();
    },
    // EditBaseContainer 的详情加载请求
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    // EditBaseContainer 的保存请求（仅更新备注）
    submitRequest () {
      return updateRemark({
        id: this.form.id,
        remark: this.form.remark,
        outboundStatus: this.form.outboundStatus
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
    /**
     * 出库明细信息。
     *
     * 选中个人视图时,改走通用视图查询接口(datareport executeQuery),
     * 与保修申请单(warrantyApply)的个人视图一致:
     *   - 请求体带 viewId(视图) + tabCode(当前维修出库单 ID);
     *   - datareport 按 bizKey 找到本明细的列表接口并转发请求,
     *     后端用 tabCode 定位单据、叠加视图条件过滤 + 按视图排序;
     *   - 分页同样由后端完成。
     * 未选中视图(系统视图)时行为不变:直接走明细分页接口。
     *
     * @param {String} [viewId] 指定视图 id(不传则取当前选中的视图)。
     *        保存后立即刷新时用,避免「视图 id 还没同步过来就发了旧请求」。
     */
    async getCollar (viewId) {
      const activeId = viewId || this.activeViewId;
      if (activeId) {
        // 通用视图查询:viewId + tabCode(当前单据 ID)
        const res = await executeQuery({
          viewId: activeId,
          tabCode: this._id,
          pageNum: this.collarParams.current,
          pageSize: this.collarParams.pageSize
        });
        this.tableData = (res && res.records) || [];
        this.collarParams.total = (res && res.total) || 0;
        return;
      }
      const res = await collarPage({
        pageNum: this.collarParams.current,
        pageSize: this.collarParams.pageSize,
        maintenanceOutboundOrderId: this._id
      });
      this.tableData = (res && res.records) || [];
      this.collarParams.total = (res && res.total) || 0;
    },
    pageSizeChange (pageSize) {
      this.collarParams.pageSize = pageSize;
      this.collarParams.current = 1;
      this.getCollar();
    },
    currentPageChange (current) {
      this.collarParams.current = current;
      this.getCollar();
    },
    // 退料明细信息
    async getOut () {
      const params = {
        pageNum: this.goParams.current,
        pageSize: this.goParams.pageSize,
        maintenanceOutboundOrderId: this._id
      };
      const res = await goPage(params);
      this.goTableData = res.records || [];
      this.goParams.total = res.total || 0;
    },
    goPageSize (pageSize) {
      this.goParams.pageSize = pageSize;
      this.goParams.current = 1;
      this.getOut();
    },
    goCurrentPage (current) {
      this.goParams.current = current;
      this.getOut();
    },
    // 维修出库弹窗
    repairPopup () {
      this.maintenanceId = this._id;
      this.repairDialogVisible = true;
    },
    // 维修出库单打印
    handlePrint (val) {
      this.$print.show({
        id: this._id, // 必选，对应数据id
        selectedList: this.selectedRows, // 必选，对应数据
        template: 'MaintenanceOutbound', // 必选，对应 ./template/文件名.vue
        title: `${this.form.dealerName}维修出库单`// 可选，打印标题
      });
    },
    // 刷新详情数据
    refreshDetail () {
      this.$refs.containerRef.loadDetail();
      this.getCollar();
      this.getOut();
    },
    // 处理表格勾选变化
    handleCheckboxChange (selection) {
      let list = selection;
      this.selectedRows = list.map(item => item.id);
    },
    /**
     * 切换个人视图。
     *
     * <p>视图的筛选/排序由<b>后端</b>生效:选中视图后取数改走通用视图查询接口
     * (executeQuery,带 viewId + tabCode=当前单据 ID),后端叠加视图条件过滤、
     * 按视图排序并完成分页,前端不再本地过滤/排序。</p>
     *
     * <p>表格配置不在 change 事件里,需另行按视图 id 读取。</p>
     *
     * @param {Object} payload {conditions, sortColumns, activePresetId}
     */
    async onViewChange (payload) {
      const activePresetId = payload && payload.activePresetId;
      if (!activePresetId) {
        // 系统视图:清空筛选、排序与表格配置,恢复默认
        this.viewConditionTree = null;
        this.viewSortColumns = [];
        this.resetViewTableConfig();
        this.collarParams.current = 1;
        await this.getCollar();
        return;
      }
      this.viewConditionTree = (payload && payload.conditions) || null;
      this.viewSortColumns = (payload && payload.sortColumns) || [];
      // 表格配置与视图分开存储,按视图 id 读取
      this.viewTableConfig = await this.loadViewTableConfig(activePresetId);
      this.resetSelection();
      this.collarParams.current = 1;
      await this.getCollar();
    },
    /**
     * 复制视图成功后,把原视图的表格配置一并复制给新视图。
     *
     * <p>表格配置按视图 id 单独存在 userDefineTable,不在视图记录里,
     * 所以复制视图时需要单独复制一份,否则新视图会退回默认列配置。</p>
     *
     * @param {Object} payload {sourceId, newId, sourceIsSystem}
     */
    async onViewCopy (payload) {
      if (!payload || !payload.newId || !payload.sourceId) return;
      try {
        const src = await getTableConfig(viewTableConfigCode(this.viewBizKey, payload.sourceId));
        if (!src || !src.config) return;
        await tableAddOrUpdate({
          tableCode: viewTableConfigCode(this.viewBizKey, payload.newId),
          config: src.config,
          resizableData: {}
        });
      } catch (e) {
        // 表格配置复制失败不影响视图本身
      }
    },
    /**
     * 个人视图保存成功。
     * 视图与表格配置均已落库,这里应用表格配置并刷新明细。
     *
     * <p>save 事件先于「切换选中视图」抛出,此刻 activeViewId 还是旧值,
     * 故用 payload.id(新视图 id)直接取数,避免先发一次「旧视图/系统视图」的请求。</p>
     */
    async onViewSave (payload) {
      this.viewTableConfig = (payload && payload.tableConfig) || null;
      this.resetSelection();
      this.collarParams.current = 1;
      await this.getCollar(payload && payload.id);
    },
    /**
     * 清空勾选状态。
     * 切换视图会重建表格组件(列顺序/显隐变化),vxe 内部的勾选随之丢失,
     * 页面侧的选中记录需同步清空,避免与表格显示不一致。
     */
    resetSelection () {
      this.selectedRows = [];
    },
    /**
     * 读取视图已保存的表格配置(列显隐/顺序)。
     * 与 PersonalViewSetting 使用同一套存储键规则。
     * @param {String} viewId
     */
    async loadViewTableConfig (viewId) {
      if (!viewId) return null;
      try {
        const res = await getTableConfig(viewTableConfigCode(this.viewBizKey, viewId));
        return (res && res.config) || null;
      } catch (e) {
        return null;
      }
    },
    /**
     * 恢复默认表格配置(切回系统视图时用)。
     */
    resetViewTableConfig () {
      this.viewTableConfig = null;
    },
  }
};
</script>

<style lang="scss" scoped>
/* 标题 + 视图下拉的左对齐分组 */
.common-section-header__title {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
