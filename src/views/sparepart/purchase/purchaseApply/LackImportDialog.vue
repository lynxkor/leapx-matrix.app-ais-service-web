<template>
  <el-dialog
    class="m-start-work-dialog"
    title="缺料导入"
    width="80%"
    :visible.sync="dialogVisible"
    @close="close"
  >
    <el-form ref="form" :model="searchForm" inline label-width="100px" size="small">
      <el-form-item label="备件编码：">
        <tag-input v-model="searchForm.partCodeList" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="备件名称：">
        <el-input v-model="searchForm.partNameLike" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="施工单号：">
        <el-input v-model="searchForm.workOrderNo" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="VIN：">
        <el-input v-model="searchForm.vin" placeholder="请输入" />
      </el-form-item>
      <page-search-action v-model="show" :isExpandable="false" :loading="loading" @submit="onSubmit" @reset="onReset" />
    </el-form>

    <div class="table-section">
      <vxe-table
        ref="lackTable"
        :data="tableData"
        :checkbox-config="{ checkField: 'checked', highlight: true, visibleMethod: ({ row }) => !row._isDetail }"
        :tree-config="{ children: 'children', expandAll: false, treeNodeKey: '_treeKey' }"
        stripe
        show-overflow
        resizable
        border="inner"
        size="medium"
        @checkbox-change="handleCheckboxChange"
        @checkbox-all="handleCheckboxChange"
      >
        <vxe-column type="checkbox" width="50" />
        <vxe-column field="partCode" title="备件编码" width="150" tree-node />
        <vxe-column field="partName" title="备件名称" width="180" />
        <vxe-column field="workOrderNo" title="施工单号" width="180" />
        <vxe-column field="vin" title="VIN" width="160">
          <template #default="{ row }">
            <template v-if="row._isDetail && row.vin">
              <span>{{ row._vinDecrypted ? row.vin : maskVin(row.vin) }}</span>
              <i
                :class="['iconfont', row._vinDecrypted ? 'icon-lxppc-eye-off' : 'icon-lxppc-eye']"
                @click="toggleVinDecrypt(row)"
              />
            </template>
          </template>
        </vxe-column>
        <vxe-column field="repairQty" title="维修数量" width="120" />
        <vxe-column field="availableQty" title="可用数量" width="120">
          <template #default="{ row }">{{ row._isDetail ? '' : row.availableQty }}</template>
        </vxe-column>
        <vxe-column field="inTransitQty" title="在途数量" width="120">
          <template #default="{ row }">{{ row._isDetail ? '' : row.inTransitQty }}</template>
        </vxe-column>
        <vxe-column field="minOrderQty" title="最小订购量" width="130">
          <template #default="{ row }">{{ row._isDetail ? '' : row.minOrderQty }}</template>
        </vxe-column>
        <vxe-column field="suggestedPurchaseQty" title="建议采购数" width="130">
          <template #default="{ row }">{{ row._isDetail ? '' : row.suggestedPurchaseQty }}</template>
        </vxe-column>
        <vxe-column field="unitPrice" title="单价" width="100">
          <template #default="{ row }">{{ row._isDetail ? '' : row.unitPrice }}</template>
        </vxe-column>
        <vxe-column field="purchaseQty" title="采购量" fixed="right" width="160">
          <template #default="{ row }">
            <el-input-number
              v-if="!row._isDetail"
              v-model="row.purchaseQty"
              :min="0"
              :step="Number(row.minOrderQty) || 1"
              size="small"
              placeholder="请输入"
              @change="handlePurchaseQtyChange(row)"
            />
          </template>
        </vxe-column>
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
        />
      </div>
    </div>

    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" type="primary" :loading="submitLoading" @click="submit">确定</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import TagInput from '@/libs/components/TagInput';
import { getRepairShortagePage, addDetail } from '@/api/sparepart/purchase/purchaseApply/index';

const defaultSearchForm = {
  partCodeList: [],
  partNameLike: '',
  workOrderNo: '',
  vin: '',
};

export default {
  name: 'LackImportDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
  },
  components: {
    PageSearchAction,
    TagInput
  },
  data () {
    return {
      dialogVisible: false,
      loading: false,
      submitLoading: false,
      show: false,
      searchForm: { ...defaultSearchForm },
      tableData: [],
      current: 1,
      pageSize: 10,
      total: 0,
      selectedRows: []
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.getData();
      }
    },
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
    },
    onSubmit () {
      this.current = 1;
      this.getData();
    },
    onReset () {
      this.searchForm = { ...defaultSearchForm };
      this.current = 1;
      this.pageSize = 10;
      this.getData();
    },
    getFormData () {
      const data = {};
      if (this.searchForm.partCodeList && this.searchForm.partCodeList.length > 0) {
        data.sparePartCodeList = this.searchForm.partCodeList;
      }
      if (this.searchForm.partNameLike) {
        data.sparePartNameLike = this.searchForm.partNameLike;
      }
      if (this.searchForm.workOrderNo) {
        data.serviceProxyCode = this.searchForm.workOrderNo;
      }
      if (this.searchForm.vin) {
        data.vin = this.searchForm.vin;
      }
      return data;
    },
    getData () {
      if (!this.id) {
        return;
      }
      this.loading = true;
      getRepairShortagePage({
        ...this.getFormData(),
        purchaseApplyId: this.id,
        pageNum: this.current,
        pageSize: this.pageSize
      }).then(res => {
        const records = res.records || [];
        this.tableData = records.map((item, index) => ({
          partCode: item.sparePartCode,
          partName: item.sparePartName,
          sparePartId: item.sparePartId,
          repairQty: item.maintenanceQty,
          availableQty: item.availableQty,
          inTransitQty: item.inTransitQty,
          minOrderQty: item.minOrderQty,
          suggestedPurchaseQty: item.suggestedPurchaseQty,
          unitPrice: item.purchasePrice,
          purchaseQty: item.purchaseQty,
          checked: true,
          _treeKey: `g-${index}`,
          children: (item.details || []).map((detail, dIdx) => ({
            partCode: detail.sparePartCode,
            partName: detail.sparePartName,
            workOrderNo: detail.serviceProxyCode,
            vin: detail.vin,
            repairQty: detail.maintenanceQty,
            checked: false,
            _isDetail: true,
            _vinDecrypted: false,
            _treeKey: `g-${index}-d-${dIdx}`
          }))
        }));
        this.total = res.total || 0;
        this.selectedRows = [...this.tableData];
      }).finally(() => {
        this.loading = false;
      });
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getData();
    },
    currentPageChange (current) {
      this.current = current;
      this.getData();
    },
    handleCheckboxChange ({ records }) {
      this.selectedRows = (records || []).filter(row => !row._isDetail);
    },
    handlePurchaseQtyChange (row) {
      const purchaseQty = Number(row.purchaseQty);
      const minOrderQty = Number(row.minOrderQty) || 1;
      if (purchaseQty > 0 && purchaseQty % minOrderQty !== 0) {
        this.$message.warning(`采购量必须是最小订购量（${minOrderQty}）的倍数`);
      }
    },
    maskVin (vin) {
      if (!vin || vin.length <= 8) {
        return vin;
      }
      return `${vin.slice(0, 4)}${'*'.repeat(vin.length - 8)}${vin.slice(-4)}`;
    },
    toggleVinDecrypt (row) {
      row._vinDecrypted = !row._vinDecrypted;
    },
    async submit () {
      if (!this.selectedRows || this.selectedRows.length === 0) {
        this.$message.warning('请选择要导入的备件');
        return;
      }
      for (const row of this.selectedRows) {
        const purchaseQty = Number(row.purchaseQty);
        const minOrderQty = Number(row.minOrderQty) || 1;
        if (!purchaseQty || purchaseQty <= 0) {
          this.$message.warning('采购量必须大于0');
          return;
        }
        if (purchaseQty % minOrderQty !== 0) {
          this.$message.warning(`采购量必须是最小订购量（${minOrderQty}）的倍数`);
          return;
        }
      }
      this.submitLoading = true;
      try {
        for (const row of this.selectedRows) {
          await addDetail({
            purchaseApplyId: this.id,
            sparePartId: row.sparePartId,
            purchaseQty: row.purchaseQty
          });
        }
        this.close();
        this.$emit('submit');
        this.$message.success('导入成功');
      } finally {
        this.submitLoading = false;
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.m-start-work-dialog {
  ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
  ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis>.vxe-cell,
  ::v-deep .vxe-table--render-default.size--medium .vxe-body--column.is--padding .vxe-cell {
    padding: 8px 12px !important;
  }

  .table-section {
    margin-top: 15px;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .iconfont {
    color: var(--leap-color-primary);
    cursor: pointer;
    margin-left: 4px;
  }
}

.table-pagination {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}
</style>
