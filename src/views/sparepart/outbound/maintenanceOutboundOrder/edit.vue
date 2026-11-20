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
                  v-bind="viewStandardProps"
                  :biz-key="viewBizKey"
                  :active-preset-id.sync="activeViewId"
                  :value="viewConditionTree"
                  :sort-columns="viewSortColumns"
                  @copy="onViewCopy"
                  @change="onViewChange"
                  @save="onViewSave"
                  @ready="onViewReady"
                  @refresh="onViewRefresh"
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
import { executeQuery } from '@/libs/api/customView/customQueryView';
import { viewTableConfigCode } from '@/libs/components/CustomView/tableConfig';
import { standardViewOptions } from '@/libs/components/CustomView/viewConfig';
import {
  applyTableConfig
} from './localView';

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
     * 个人视图标准 props —— 与全局 AisPageTitle 共用 lib 的同一份配置出口。
     *
     * <p>本页能拿到明细表列定义,故传 columns 开启弹窗的「自定义表格」合并模式;
     * 明细表后端通用查询不可用,视图在本地过滤/排序,故 localApply = true;
     * 保存视图后不自动切换视图(autoApplyAfterSave = false)——
     * 正在用视图 A 时编辑了视图 B,保存 B 不该把当前选择抢走,
     * 视图是否生效由用户自己在下拉里点选决定。
     * 这三项是本页与列表页唯一允许的差异,其余配置完全一致。</p>
     */
    viewStandardProps () {
      return standardViewOptions({
        columns: this.columns,
        localApply: true,
        autoApplyAfterSave: false
      });
    }
  },
  watch: {
    _id: {
      handler (val) {
        if (val) {
          // 退料明细与视图无关,直接取数
          this.getOut();
          // 出库明细取数要先等「默认视图」解析出来(见 refreshCollarByView),
          // 否则首屏会先发一次 page 接口,再被默认个人视图刷新覆盖
          this.refreshCollarByView();
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
      // 视图列表是否已就绪(即「默认视图」已解析出来)。
      // 就绪前不发明细取数请求,避免先走 page 接口再被个人视图刷新覆盖
      viewReady: false,
      // 当前表格数据对应的视图 id(null = 系统视图;undefined = 还没加载过)。
      // 用于「视图驱动的刷新」去重,同一视图不重复发请求
      loadedViewId: undefined,
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
        // 序号是后端计算的虚拟字段:(pageNum-1)*pageSize+行序,分页连续
        // (每页 10 条时第 2 页首行为 11),前端只负责展示,不再自行编号。
        {
          field: 'rowIndex',
          title: '序号',
          width: '5%',
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '10%',
        },
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
        // 序号是后端计算的虚拟字段:(pageNum-1)*pageSize+行序,分页连续
        // (每页 10 条时第 2 页首行为 11),前端只负责展示,不再自行编号。
        {
          field: 'rowIndex',
          title: '序号',
          width: '5%',
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '10%',
        },
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
      // viewId 不传 = 用当前选中的视图;传 null = 明确按系统视图取数
      const activeId = viewId === undefined ? this.activeViewId : (viewId || null);
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
    /**
     * 按「生效视图」刷新出库明细。
     *
     * <p>首屏不能直接取数:默认视图尚未解析时只能走明细分页接口,
     * 等个人视图列表回来后又要按视图重查一次 —— 会出现「先进页面就请求一次
     * page 接口,列表拿到后又被个人视图刷新覆盖」的重复请求与画面闪动。</p>
     *
     * <p>因此取数时机交给 {@link onViewReady}(视图列表就绪)统一触发:
     * 生效视图是系统视图 → 明细分页接口;是个人视图 → executeQuery。</p>
     *
     * <p>本方法是「视图驱动的刷新」唯一入口:
     * ①视图未就绪(viewReady=false)时直接跳过,交给 onViewReady 触发 —— 首屏只发一次请求;
     * ②同一视图的数据已经加载过(loadedViewId)时跳过,避免「change + ready」
     * 两个事件都指向同一视图时重复请求;
     * ③单据 id 与视图两者都就绪才取数,谁先到谁触发。</p>
     *
     * @param {String} [viewId] 生效视图 id:
     *        不传 = 当前选中的视图(this.activeViewId);
     *        传 null = 明确指定系统视图;
     *        传 id = 指定该个人视图(视图刚保存、选中态还没同步过来时用)
     * @param {Boolean} [force] 强制刷新:跳过「同一视图已加载」的去重。
     *        重复点击当前视图时用(视图没变,但数据要重查)
     */
    async refreshCollarByView (viewId, force) {
      if (!this._id || !this.viewReady) return;
      const targetId = viewId === undefined ? (this.activeViewId || null) : (viewId || null);
      if (!force && this.loadedViewId === targetId) return;
      // 先占位再请求:避免并发触发(如 change 与 ready 几乎同时到达)时重复请求
      this.loadedViewId = targetId;
      // 视图变了回到第 1 页(与取数绑定:没取数就不重置页码)
      this.collarParams.current = 1;
      try {
        await this.getCollar(targetId);
      } catch (e) {
        // 取数失败:解除占用,允许下次重试(错误提示由 axios 拦截器给出)
        this.loadedViewId = undefined;
      }
    },
    /**
     * 视图列表就绪(默认视图已解析)。
     *
     * <p>payload.activePresetId = 生效视图 id:null = 系统视图,非空 = 默认个人视图。</p>
     *
     * <p>这是首屏取数的触发点:系统视图走明细分页接口,个人视图走 executeQuery。
     * CustomView 每次刷新视图列表(打开下拉、复制/删除视图等)都会抛这个事件,
     * 后续由 refreshCollarByView 按「视图是否变化」决定要不要重新取数。</p>
     *
     * @param {Object} payload {activePresetId}
     */
    onViewReady (payload) {
      this.viewReady = true;
      const resolvedId = (payload && payload.activePresetId) || null;
      // 生效视图与本地选中态对齐(默认视图自动选中时,状态已由 CustomView 同步过来,
      // 这里再兜一次,保证取数用的视图 id 与后端解析出的默认视图一致)
      this.activeViewId = resolvedId;
      this.refreshCollarByView(resolvedId);
    },
    /**
     * 重新应用当前选中的视图(下拉里重复点击已选中的视图时触发)。
     *
     * <p>CustomView 对「重复点击当前视图」走 refresh 通道(activePresetId 不变,
     * 不会再发 change 事件),这里必须接住,否则提示「已刷新视图」却没有任何请求。</p>
     *
     * <p>视图没变,但数据要按该视图重新查一遍 —— 强制刷新,
     * 跳过 refreshCollarByView 的「同一视图已加载」去重。</p>
     */
    onViewRefresh () {
      this.refreshCollarByView(this.activeViewId, true);
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
     * <p>取数统一交给 {@link refreshCollarByView}:它按「生效视图是否变化」判断要不要重新取数,
     * 首屏(视图未就绪)与「change + ready 指向同一视图」这两种情况都不会重复请求。</p>
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
        this.resetSelection();
        this.refreshCollarByView(null);
        return;
      }
      this.viewConditionTree = (payload && payload.conditions) || null;
      this.viewSortColumns = (payload && payload.sortColumns) || [];
      // 表格配置与视图分开存储,按视图 id 读取
      this.viewTableConfig = await this.loadViewTableConfig(activePresetId);
      this.resetSelection();
      this.refreshCollarByView(activePresetId);
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
     * 视图与表格配置均已落库,这里按「保存的是不是当前视图」分别处理。
     *
     * <p>①保存的正是<b>当前选中的视图</b> —— 条件/列配置可能变了:
     * 应用新的列配置,列表由随后的 refresh 通道(见 onViewRefresh)按新条件强制重查。</p>
     *
     * <p>②保存的是<b>另一个视图</b> —— 当前选择、当前列配置、当前列表都不动:
     * 视图配置已落库,是否生效由用户自己在下拉里点选决定
     * (autoApplyAfterSave = false,lib 也不会自动切换到刚保存的视图)。</p>
     *
     * @param {Object} payload {id, tableConfig}
     */
    async onViewSave (payload) {
      const savedId = payload && payload.id;
      if (savedId && savedId === this.activeViewId) {
        this.viewTableConfig = (payload && payload.tableConfig) || null;
        this.resetSelection();
      }
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
     * 与视图弹窗(lib 的 CustomQueryDialog 合并模式)使用同一套存储键规则。
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
