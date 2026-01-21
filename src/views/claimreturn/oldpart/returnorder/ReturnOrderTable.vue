<template>
  <section class="common-section">
    <div class="common-section-header">
      <h2>
        旧件明细
        <div v-if="_id && !disabled" class="btns">
          <el-button plain type="primary" v-if="canAddOrUpdate" size="small" @click.stop="openAdd"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
          <el-button v-if="canAddOrUpdate" :disabled="!isSelect" size="small" @click.stop="handleRemoveRows">删除</el-button>
        </div>
      </h2>
    </div>
    <div v-if="_id" class="common-section-body">
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
    <!-- 旧件明细 - 添加弹窗 -->
    <old-part-dialog
      :visible.sync="visible"
      :_id="_id"
      :dealerCode="dealerCode"
      @update="getTableData"
      />
  </section>
</template>
<script>
import {
  getList, // 旧件库存详情分页查询
  getDetailDecryptField,
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
    },
    _id: {
      type: String,
    },
    dealerCode: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false
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
      //
      visible: false,
      // 表格内的下拉列表
      options: {
        partCode: [],
      },
      selectedRows: [],
      columns: [
        {
          field: 'serviceProxyNo',
          title: '接车施工单',
          width: '160',
        },
        {
          field: 'warrantyNo',
          title: '保修申请单',
          width: '160',
        },
        {
          field: 'oldPartUniqueCode',
          title: '旧件唯一码',
          width: '160',
        },
        {
          field: 'dealerName',
          title: '厅店名称',
          width: '160',
        },
        {
          field: 'dealerStatusLabel',
          title: '门店库存状态',
          width: '160',
        },
        {
          field: 'isMainPartLabel',
          title: '是否主因零部件',
          width: '160',
        },
        {
          field: 'vin',
          title: 'VIN',
          width: '200',
          mask: true,
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
          field: 'partCode',
          title: '零件编码',
          width: '160',
        },
        {
          field: 'partName',
          title: '零件名称',
          width: '160',
        },
        {
          field: 'checkRemark',
          title: '验收备注',
          width: '160',
        },
      ]
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
        returnOrderId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records;
        this.total = res.total;
        this.$emit('getTableData', this.tableData);
      });
    },
    openAdd () {
      if (!this.dealerCode) {
        this.$message.info('');
        return;
      }
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
    handleRemoveRow (row) {
      if (!row.id) {
        return;
      }
      this.removeRows([row.id]);
    },
    removeRows (ids) {
      removeDetail({
        id: this._id,
        detailIdList: ids,
      }).then((d) => {
        this.$message.success('删除成功');
        this.getTableData();
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '删除失败!'
        });
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
    }
  },
};

</script>
<style lang="scss" scoped>
.btn-delete{
  color: #B91919;
}
</style>
