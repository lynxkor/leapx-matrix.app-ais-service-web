<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :showBackBtn="showBackBtn"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="库存单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="备件编码：" prop="sparePartId">
                  {{ form.partCode }}
                </el-form-item>
                <el-form-item label="备件名称：" prop="sparePartId">
                  {{ form.partName }}
                </el-form-item>
                <el-form-item label="可用数量：" prop="availableQty">
                  {{ form.availableQty }}
                </el-form-item>
                <el-form-item label="冻结数量：" prop="frozenQty">
                  {{ form.frozenQty }}
                </el-form-item>
                <el-form-item label="共享数量：" prop="sharedQty">
                  {{ form.sharedQty }}
                </el-form-item>
                <el-form-item label="库存总数：" prop="totalQty">
                  {{ form.totalQty }}
                </el-form-item>
                <el-form-item label="在途数量：" prop="inTransitQty">
                  {{ form.inTransitQty }}
                </el-form-item>
                <el-form-item label="库存天数：">
                  {{ form.inventoryDays }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="厅店名称：" prop="dealerCode">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="仓库名称：" prop="warehouseId">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="库位：">
                  <fetch-select
                      :remote-method="getLocaltion"
                      remote
                      v-model="form.locationId"
                      placeholder="请输入库位名称"
                      labelKey="name"
                      valueKey="id"
                      clearable
                      collapseTags
                      filterable
                        />
                </el-form-item>
                <el-form-item label="最近入库时间：">
                  {{ form.latestInboundTime }}
                </el-form-item>
                <el-form-item label="最近出库时间：">
                  {{ form.latestOutboundTime }}
                </el-form-item>
                <el-form-item label="成本单价：" prop="costUnitPrice">
                  {{ form.costUnitPrice }}
                </el-form-item>
                <el-form-item label="成本金额：" prop="costAmount">
                  {{ form.costAmount }}
                </el-form-item>
                <el-form-item label="采购单价：" prop="costAmount">
                  {{ form.purchasePrice }}
                </el-form-item>
                <el-form-item label="销售单价：" prop="costAmount">
                  {{ form.salePrice }}
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="库存单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="备件编码：" prop="sparePartId">
                  {{ form.partCode }}
                </el-form-item>
                <el-form-item label="备件名称：" prop="sparePartId">
                  {{ form.partName }}
                </el-form-item>
                <el-form-item label="可用数量：" prop="availableQty">
                  {{ form.availableQty }}
                </el-form-item>
                <el-form-item label="冻结数量：" prop="frozenQty">
                  {{ form.frozenQty }}
                </el-form-item>
                <el-form-item label="共享数量：" prop="sharedQty">
                  {{ form.sharedQty }}
                </el-form-item>
                <el-form-item label="库存总数：" prop="totalQty">
                  {{ form.totalQty }}
                </el-form-item>
                <el-form-item label="在途数量：" prop="inTransitQty">
                  {{ form.inTransitQty }}
                </el-form-item>
                <el-form-item label="库存天数：">
                  {{ form.inventoryDays }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="厅店名称：" prop="dealerCode">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="仓库名称：" prop="warehouseId">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="库位：" prop="locationId">
                  {{ form.locationName }}
                </el-form-item>
                <el-form-item label="最近入库时间：" prop="latestInboundTime">
                  {{ form.latestInboundTime }}
                </el-form-item>
                <el-form-item label="最近出库时间：" prop="latestOutboundTime">
                  {{ form.latestOutboundTime }}
                </el-form-item>
                <el-form-item label="成本单价：" prop="costUnitPrice">
                  {{ form.costUnitPrice }}
                </el-form-item>
                <el-form-item label="成本金额：" prop="costAmount">
                  {{ form.costAmount }}
                </el-form-item>
                <el-form-item label="采购单价：" prop="costAmount">
                  {{ form.purchasePrice }}
                </el-form-item>
                <el-form-item label="销售单价：" prop="costAmount">
                  {{ form.salePrice }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>区块标题</h2>
              <el-button v-if="canAddOrUpdate" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="tableData"
                  :defaultNewRow="defaultNewRow"
                  :show-toolbar="false"
                  :options="options"
                  :auth="{edit: canAddOrUpdate, delete: canDelete}"
                />
              </div>
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
import { getDetail, addOrUpdate } from '@/api/sparepart/warehouse/inventory/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { locationList } from '@/api/sparepart/warehouse/warehouse/index';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  sparePartId: '',
  warehouseId: '',
  status: '',
  locationId: '',
  dealerCode: '',
  inTransitQty: '',
  availableQty: '',
  frozenQty: '',
  sharedQty: '',
  totalQty: '',
  costUnitPrice: '',
  costAmount: '',
  remark: '',
  latestInboundTime: '',
  latestOutboundTime: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  statusDesc: '',
  dataSource: '',
  inventoryDate: '',
  sharedContactPerson: '',
  sharedContactInfo: '',
  sharedDescription: '',
  suggestedSharedPrice: '',
};

export default {
  name: 'inventoryEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
    showBackBtn: {
      type: Boolean,
      default: true,
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    EditTable,
    FetchSelect
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
          this.getDetailData();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '厅店备件库存',
      pageType: 'edit',
      title: '库存单号：' + form.code,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-inventory',
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
        code: [
          { required: true, message: '请输入库存单号', trigger: 'change' }
        ],
        sparePartId: [
          { required: true, message: '请输入零件ID', trigger: 'change' }
        ],
        warehouseId: [
          { required: true, message: '请输入仓库ID', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        locationId: [
          { required: true, message: '请输入库位ID', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店code', trigger: 'change' }
        ],
        inTransitQty: [
          { required: true, message: '请输入在途数量', trigger: 'change' }
        ],
        availableQty: [
          { required: true, message: '请输入可用数量', trigger: 'change' }
        ],
        frozenQty: [
          { required: true, message: '请输入冻结数量', trigger: 'change' }
        ],
        sharedQty: [
          { required: true, message: '请输入共享数量', trigger: 'change' }
        ],
        totalQty: [
          { required: true, message: '请输入库存总数', trigger: 'change' }
        ],
        costUnitPrice: [
          { required: true, message: '请输入成本单价', trigger: 'change' }
        ],
        costAmount: [
          { required: true, message: '请输入成本金额', trigger: 'change' }
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'change' }
        ],
        latestInboundTime: [
          { required: true, message: '请选择最近入库时间', trigger: 'change' }
        ],
        latestOutboundTime: [
          { required: true, message: '请选择最近出库时间', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
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
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，150:新销服; 老销服:10', trigger: 'change' }
        ],
        inventoryDate: [
          { required: true, message: '请输入库存日期', trigger: 'change' }
        ],
        sharedContactPerson: [
          { required: true, message: '请输入共享联系人', trigger: 'change' }
        ],
        sharedContactInfo: [
          { required: true, message: '请输入共享联系方式', trigger: 'change' }
        ],
        sharedDescription: [
          { required: true, message: '请输入共享说明', trigger: 'change' }
        ],
        suggestedSharedPrice: [
          { required: true, message: '请输入建议共享价格', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
  },
  methods: {
    async getLocaltion (query) {
      try {
        const res = await locationList({ codeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
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
    }
  }
};
</script>
