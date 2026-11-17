<template>
  <section class="common-section">
    <div class="common-section-header">
      <h2>
        旧件库存
      </h2>
    </div>
    <div v-if="_id" class="common-section-body">
      <div v-if="!disabled" class="btns" style="margin-bottom: 15px;">
        <el-button plain type="primary" v-if="canAddOrUpdate" size="small" @click.stop="openAdd"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
        <el-button v-if="canAddOrUpdate" :disabled="!isSelect" size="small" @click.stop="handleRemoveRows">删除</el-button>
        <el-button v-if="canAddOrUpdate" size="small" @click.stop="handleImport">旧件出库明细导入</el-button>
        <el-button v-if="canAddOrUpdate" :loading="attachLoading" size="small" @click="addAttach">添加连带件</el-button>
        <el-input v-if="canAddOrUpdate" placeholder="扫描条码" class="input-inline" size="small" v-model="oldPartUniqueCode" @keyup.enter.native="scanAdd" clearable/>
      </div>
      <div class="common-section-table">
        <!-- 旧件明细表格 -->
        <edit-table
          ref="editTable"
          :columns="columns"
          :data="tableData"
          :defaultNewRow="disabled ? null : defaultNewRow"
          :show-toolbar="false"
          :options="options"
          :checkbox="true"
          :auth="{ edit: false, delete: canAddOrUpdate && !disabled }"
          :isFocusNewRow="false"
          :enableSingleRowSave="false"
          :showPagination="true"
          :current="current"
          :pageSize="pageSize"
          :total="total"
          @save-row-edit="saveRowEdit"
          @remove-row="handleRemoveRow"
          @page-size-change="pageSizeChange"
          @current-page-change="currentPageChange"
          @checkboxChange="checkboxChange"
          @mask="mask"
        />
      </div>
    </div>
    <div class="common-section-body not-commit" v-else>
      提交新建后，即可添加
    </div>
    <Upload
      :visible="uploadDialogVisible"
      :businessParams="_id"
      id="oldPartOemOutboundOrderImportDetail"
      @close="handleUploadDialogClose"
      @getData="getTableData"
    />
    <!-- 旧件明细 - 添加弹窗 -->
    <old-part-dialog
      type="outbound"
      :visible.sync="visible"
      :_id="_id"
      :dealerCode="dealerCode"
      :supplierId="supplierId"
      @update="getTableData"
      />
  </section>
</template>
<script>
import {
  getList, // 旧件库存
  getDetailDecryptField,
} from '@/api/claimreturn/oldpart/inventory/oem/index';
import {
  removeDetail,
  addAssociatedParts,
  scanCodeAddDetail,
} from '@/api/claimreturn/oldpart/outbound/index';// 出库
import EditTable from '@/libs/components/EditTable/index.vue';
import Upload from '@/libs/components/UploadDialog';
import OldPartDialog from '../components/OldPartDialog';

export default {
  props: {
    canAddOrUpdate: {
      type: Boolean,
    },
    _id: {
      type: String,
    },
    dealerCode: {
      type: String,
    },
    supplierId: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  components: {
    EditTable,
    OldPartDialog,
    Upload,
  },
  data () {
    return {
      defaultNewRow: {
        oldPartUniqueCode: '', // 旧件唯一码
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
      //
      visible: false,
      // 表格内的下拉列表
      options: {
        partCode: [],
      },
      selectedRows: [],
      columns: [
        {
          field: 'serialNo',
          title: '序号',
          width: '60',
        },
        {
          field: 'oldPartUniqueCode',
          title: '旧件唯一码',
          width: '160',
        },
        {
          field: 'oemStatusLabel',
          title: '主机厂库存状态',
          width: '160',
        },
        {
          field: 'dutySupplierName',
          title: '责任供应商',
          width: '160',
        },
        {
          field: 'dealerName',
          title: '门店名称',
          width: '160',
        },
        {
          field: 'isMainPartLabel',
          title: '是否主因零部件',
          width: '160',
        },
        {
          field: 'repairItemTypeName',
          title: '保修类型',
          width: '160',
        },
        {
          field: 'mileage',
          title: '进店里程KM',
          width: '140',
        },
        {
          field: 'vin',
          title: 'VIN',
          width: '200',
          mask: true,
        },
        {
          field: 'oldPartCode',
          title: '旧件编码',
          width: '160',
        },
        {
          field: 'oldPartName',
          title: '旧件名称',
          width: '160',
        },
        {
          field: 'partUnitPrice',
          title: '零件单价',
          width: '120',
        },
        {
          field: 'oldPartSupplierName',
          title: '零件供应商',
          width: '160',
        },
        {
          field: 'mainPartSupplierName',
          title: '主因件供应商',
          width: '160',
        },
        {
          field: 'oemCheckTime',
          title: '主机厂验收时间',
          width: '160',
        },
        {
          field: 'oemOutTime',
          title: '主机厂出库时间',
          width: '160',
        },
        {
          field: 'returnTypeLabel',
          title: '旧件返还类型',
          width: '160',
        },
      ],
      //
      uploadDialogVisible: false,
      attachLoading: false,
      //
      oldPartUniqueCode: '',
    };
  },
  computed: {
    isSelect () {
      return this.selectedRows?.length > 0;
    }
  },
  watch: {
    _id: {
      handler () {
        this.getTableData();
      },
      immediate: true
    }
  },
  mounted () {
    this.getTableData();
  },
  beforeDestroy () {
  },
  methods: {
    // 表格数据
    getTableData () {
      if (!this._id) {
        return;
      }
      getList({
        oemOutboundOrderId: this._id, // 主机厂出库单ID
        pageSize: this.pageSize,
        pageNum: this.current,
        // 排序（按需求）：零件单价倒序 → 添加时间倒序（update_time=关联进出库单的时间，与回运单明细口径一致），末位 id 兜底保证分页稳定
        sortColumns: [
          { column: 'part_unit_price', sort: 'DESC' },
          { column: 'update_time', sort: 'DESC' },
          { column: 'id', sort: 'DESC' }
        ]
      }).then((res) => {
        const records = res.records || [];
        this.tableData = records.map((item, idx) => ({
          ...item,
          serialNo: records.length - idx,
        }));
        this.total = res.total;
        this.selectedRows = [];
        this.$emit('getTableData', this.tableData);
      });
    },
    openAdd () {
      this.visible = true;
    },
    handleRemoveRows () {
      // 您确定要移除选择的【{N}】条数据吗？
      this.$confirm('您确定要移除选择的【' + this.selectedRows.length + '】条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.selectedRows.map(item => item.id);
        this.removeRows(ids);
      }).catch(() => {});
    },
    handleRemoveRow (row, index, defer) {
      if (!row.id) {
        return;
      }
      this.removeRows([row.id], defer);
    },
    removeRows (ids, defer) {
      removeDetail({
        id: this._id,
        detailIdList: ids,
      }).then((d) => {
        this.$message.success('删除成功');
        this.selectedRows = [];
        this.getTableData();
      }).catch(() => {
        defer?.reject();
      });
    },
    // 行保存
    saveRowEdit (row, defer) {
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
    checkboxChange (records) {
      this.selectedRows = records;
      this.$emit('checkboxChange', this.selectedRows);
    },
    // ---
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
    // 连带件
    addAttach () {
      this.attachLoading = true;
      addAssociatedParts(this._id).then(res => {
        this.$message.success('正在添加连带件，请稍后刷新查看');
        this.getTableData();
      }).finally(() => {
        this.attachLoading = false;
      });
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    scanAdd (e) {
      const code = this.oldPartUniqueCode;
      if (!code) return;
      this.oldPartUniqueCode = '';
      scanCodeAddDetail({
        id: this._id,
        oldPartUniqueCode: code,
      }).then(res => {
        this.$message.success('添加成功');
        this.getTableData();
      }).catch(() => {});
    }
  },
};

</script>
<style lang="scss" scoped>
.btn-delete{
  color: #B91919;
}
.input-inline{
  display: inline;
  margin-left: 10px;
  ::v-deep .el-input__inner{
    width: 200px;
  }
  ::v-deep .el-input__suffix{
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
