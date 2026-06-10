<template>
  <section class="common-section">
    <div class="common-section-header">
      <h2>
        变更车辆信息
      </h2>
    </div>
    <div v-if="_id" class="common-section-body">
      <div v-if="_id && !disabled" class="btns">
        <el-button plain type="primary" v-if="canAddOrUpdate" size="small" @click.stop="openAdd"><i class="iconfont icon-lxppc-plus"></i>添加车辆</el-button>
        <el-button plain type="primary" v-if="canAddOrUpdate" size="small" @click.stop="batchTransfer">批量转移</el-button>
        <el-button plain type="primary" v-if="canAddOrUpdate" size="small" @click.stop="handleImport">导入车辆</el-button>
      </div>
      <div class="common-section-table">
        <vxe-table
          ref="editTable"
          :data="tableData"
          stripe
          show-overflow
          resizable
          :row-config="{ isHover: true }"
          border="inner"
          size="medium"
          min-height="0"
          max-height="400px"
          :checkbox="true"
          @checkboxChange="checkboxChange"
        >
          <vxe-column field="vin" title="VIN" width="160">
            <template #default="{ row }">
              <el-link type="success" :href="`/service/datacenter/vehicle/vehicleProfile/edit?vin=${row.vin}`" target="_blank">{{ row.vin }}</el-link>
            </template>
          </vxe-column>
          <vxe-column field="beforeDealerCode" title="变更前门店编码" width="160"></vxe-column>
          <vxe-column field="beforeDealerName" title="变更前门店名称" width="160"></vxe-column>
          <vxe-column field="afterDealerCode" title="变更后门店编码" width="160"></vxe-column>
          <vxe-column field="afterDealerName" title="变更后门店名称" width="160"></vxe-column>
          <vxe-column field="isUserChange" title="是否用户修改专属服务门店" width="160">
            <template #default="{ row }">
              {{ row.isUserChange ? '是' : '否' }}
            </template>
          </vxe-column>
          <vxe-column field="applyReason" title="申请原因" width="160"></vxe-column>
          <vxe-column field="salesDate" title="销售日期" width="160"></vxe-column>
          <vxe-column field="createTime" title="创建时间" width="160"></vxe-column>
          <vxe-column title="操作" :width="100" align="center" fixed="right" :resizable="false">
            <template #default="{ row, rowIndex }">
              <el-popconfirm
                title="确定要删除这条记录吗？"
                @confirm="handleRemoveRow(row, rowIndex)"
                v-if="canAddOrUpdate && !disabled"
              >
                <el-button
                  class="action-button btn-delete"
                  slot="reference"
                  type="text">
                  删除
                </el-button>
              </el-popconfirm>
            </template>
          </vxe-column>
          <template #empty>
            <div class="m-vxe-table-empty-text">
              暂无数据
            </div>
          </template>
        </vxe-table>
        <div class="table-pagination">
          <el-pagination
            @size-change="pageSizeChange"
            @current-change="currentPageChange"
            :current-page="current"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="common-section-body not-commit" v-else>
      提交新建后，即可添加
    </div>
    <Upload
      :visible="uploadDialogVisible"
      :businessParams="_id"
      id="serviceDealerChangeVehicle"
      @close="handleUploadDialogClose"
      @getData="onImportComplete"
    />
    <BatchTransferDialog
      :visible.sync="batchTransferDialogVisible"
      :applyId="_id"
      :selectedRows="selectedRows"
      @success="onTransferComplete"
    />
  </section>
</template>
<script>

import {
  getDetailList,
  removeDetail,
} from '@/api/datacenter/vehicle/serviceDealerChangeApply/index';
import Upload from '@/libs/components/UploadDialog';
import BatchTransferDialog from './BatchTransferDialog';

export default {
  props: {
    canAddOrUpdate: {
      type: Boolean,
    },
    _id: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Upload,
    BatchTransferDialog,
  },
  data () {
    return {
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      visible: false,
      selectedRows: [],
      uploadDialogVisible: false,
      batchTransferDialogVisible: false,
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
  methods: {
    getTableData () {
      if (!this._id) {
        return;
      }
      getDetailList({
        applyId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records;
        this.total = res.total;
        this.selectedRows = [];
        this.$emit('data-change', this.tableData);
      });
    },
    openAdd () {
      this.$emit('open-add');
    },
    handleRemoveRows () {
      this.$confirm('您确定要移除选择的【' + this.selectedRows.length + '】条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.selectedRows.map(item => item.id);
        this.removeRows(ids);
      }).catch(() => {});
    },
    handleRemoveRow (row, rowIndex) {
      if (!row.id) {
        return;
      }
      this.removeRows([row.id]);
    },
    removeRows (ids) {
      removeDetail(ids).then((d) => {
        this.$message.success('删除成功');
        this.selectedRows = [];
        this.getTableData();
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '删除失败!'
        });
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
    batchTransfer () {
      this.batchTransferDialogVisible = true;
    },
    onTransferComplete () {
      this.getTableData();
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    onImportComplete () {
      this.getTableData();
    },
  },
};
</script>
<style lang="scss" scoped>
.btn-delete{
  color: #B91919;
}
.btns {
  margin-bottom: 10px;
}
</style>
