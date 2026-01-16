<template>
  <section class="common-section">
    <div class="common-section-header">
      <h2>
        <span>旧件明细</span>
        <div class="btns">
          <el-button plain type="primary" v-if="canAddOrUpdate" size="small" @click.stop="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
          <el-button v-if="canAddOrUpdate" size="small" @click.stop="handleAddRow">删除</el-button>
        </div>
      </h2>
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
          :auth="{ edit: canAddOrUpdate, delete: canAddOrUpdate }"
          :isFocusNewRow="false"
          :enableSingleRowSave="true"
          :showPagination="true"
          :current="current"
          :pageSize="pageSize"
          :total="total"
          @save-row-edit="saveRowEdit"
          @remove-row="handleRemoveRow"
          @page-size-change="pageSizeChange"
          @current-page-change="currentPageChange"
        />
      </div>
    </div>
    <old-part-dialog
      :visible="true"
      />
  </section>
</template>
<script>
import { uIntRule } from '@/validation/rule';
import {
  getList, // 旧件库存详情分页查询
} from '@/api/claimreturn/oldpart/inventory/oem/index';
import {
  addDetail,
  removeDetail,
} from '@/api/claimreturn/oldpart/returnorder/index';
import EditTable from '@/libs/components/EditTable/index.vue';
import OldPartDialog from './OldPartDialog';

export default {
  props: {
    canAddOrUpdate: {
      type: Boolean,
    }
  },
  components: {
    EditTable,
    OldPartDialog,
  },
  data () {
    return {
      defaultNewRow: {
        oldPartUniqueCode: '', // 旧件唯一码
        dealerName: '', // 厅店名称
        dealerStatus: '', // 门店库存状态
        isMainPart: '', // 是否主因零部件
        vin: '', // VIN
        oldPartSupplierName: '', // 零件供应商
        mainPartSupplierName: '', // 主因件供应商
        oldPartCode: '', // 旧件编码
        oldPartName: '', // 旧件名称
        partCode: '', // 零件编码
        partName: '', // 零件名称
        returnOrderNo: '', // 关联快返回运单号（和旧件库存中规则一致）
        checkRemark: '', // 验收备注
        warrantyNo: '', // 保修申请单（对应保修申请单编码）
        oemOutboundOrderNo: '' // 主机厂出库单号
      },
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      // 表格内的下拉列表
      options: {
        partCode: [],
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'partCode',
          title: '零件编码',
          width: '33%',
          editable: true,
          editRender: {
            name: 'ElSelect',
            multiRow: true,
            props: {
              filterable: true,
              clearable: true,
              remote: true,
              remoteMethod: this.sparePartListApi,
              placeholder: '请选择',
              'suffix-icon': 'el-icon-search',
            },
          },
          rules: [
            { required: true, message: '零件编码不能为空', trigger: 'blur' },
          ],
        },
        {
          field: 'partName',
          title: '零件名称',
          width: '33%',
        },
        {
          field: 'remark',
          title: '备注',
          width: '33%',
          editable: true,
          editRender: { name: 'ElInput' },
        },
      ],
      rules: {
        judgmentBasis: [
          { required: true, message: '请输入判断依据', trigger: 'blur' },
        ],
        determineUnit: [
          {
            required: true,
            message: '请输入判断单位（次数，天数）',
            trigger: 'change',
          },
        ],
        accumulation: [
          {
            required: true,
            message: '请输入累计方式（单一零件，任意零件）',
            trigger: 'change',
          },
        ],
        vehicleProperty: [
          {
            required: true,
            message: '请选择',
            trigger: 'change',
          },
        ],
        saleStartDate: [
          { required: true, message: '请输入销售开始日期', trigger: 'blur' },
        ],
        saleEndDate: [
          { required: true, message: '请输入销售结束日期', trigger: 'blur' },
        ],
        warningVehicleAgeFrom: [
          { required: true, message: '请输入预警车龄起', trigger: 'blur' },
          uIntRule,
        ],
        warningVehicleAgeTo: [
          { required: true, message: '请输入预警车龄止', trigger: 'blur' },
          uIntRule,
        ],
        warningMileageFrom: [
          { required: true, message: '请输入预警里程起', trigger: 'blur' },
          uIntRule,
        ],
        warningMileageTo: [
          { required: true, message: '请输入预警里程止', trigger: 'blur' },
          uIntRule,
        ],
        greenWarning1: [
          // { required: true, message: '请输入绿色预警区间1', trigger: 'blur' },
          uIntRule,
        ],
        greenWarning2: [
          // { required: true, message: '请输入绿色预警区间2', trigger: 'blur' },
          uIntRule,
        ],
        yellowWarning2: [
          // { required: true, message: '请输入黄色预警区间2', trigger: 'blur' },
          uIntRule,
        ],
        yellowWarning1: [
          // { required: true, message: '请输入黄色预警区间1', trigger: 'blur' },
          uIntRule,
        ],
        redWarning1: [
          // { required: true, message: '请输入红色预警区间1', trigger: 'blur' },
          uIntRule,
        ],
        redWarning2: [
          // { required: true, message: '请输入红色预警区间2', trigger: 'blur' },
          uIntRule,
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' },
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' },
        ],
        id: [{ required: true, message: '请输入主键', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' },
        ],
        reminderItem: [
          { required: true, message: '请输入警示条款', trigger: 'blur' },
        ],
        reminderContent: [
          { required: true, message: '请输入警示内容', trigger: 'blur' },
        ],
        warningContent: [
          { required: true, message: '请输入预警内容', trigger: 'blur' },
        ],
        details: [{ required: true, message: '请输入明细', trigger: 'blur' }],
      },
    };
  },
  mounted () {
    this.getDetailPageApi();
  },
  beforeDestroy () {
  },
  methods: {
    // 表格数据
    getDetailPageApi () {
      if (!this._id) {
        return;
      }
      // returnOrderIdNe
      getList({
        returnOrderId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records;
        this.total = res.total;
      });
    },
    handleAddRow () {
      // 通过引用直接调用子组件方法
      // this.$refs.editTable.addRow();
    },
    handleRemoveRow (row, index, defer) {
      if (!row.id) {
        return;
      }
      removeDetail({
        id: this._id,
        detailIdList: [row.id],
      }).then((d) => {
        defer.resolve();
        this.$message.success('删除成功');
      }).catch(() => {
        defer.reject();
      });
    },
    // 行保存
    saveRowEdit (row, defer) {
      const parmas = {
        id: this._id,
        detailIdList: [],
      };
      addDetail(parmas).then(id => {
        defer.resolve(id);
        this.$message.success('更新成功');
      }).catch(e => {
        defer.reject();
      });
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getDetailPageApi();
    },
    currentPageChange (current) {
      this.current = current;
      this.getDetailPageApi();
    },
  },
};

</script>
<style lang="scss" scoped></style>
