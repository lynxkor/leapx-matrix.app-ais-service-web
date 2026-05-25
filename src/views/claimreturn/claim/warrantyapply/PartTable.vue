<template>
  <div class="common-section-table pb-0">
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
    >
      <vxe-column title="是否主因" width="80" align="center">
        <template #default="{ row }">
          <el-switch
            v-if="canAddOrUpdate"
            @change="saveRowEdit(row)"
            v-model="row.isMainPart"
            :active-value="1"
            :inactive-value="0"
          />
          <span v-else>{{ row.isMainPart === 1 ? '是' : '否' }}</span>
        </template>
      </vxe-column>
      <vxe-column field="oldPartUniqueCode" title="旧件唯一码" width="180"></vxe-column>
      <vxe-column field="partCode" title="零件编码" width="150"></vxe-column>
      <vxe-column field="partName" title="零件名称" width="150"></vxe-column>
      <vxe-column field="returnPartTypeLabel" title="旧件返还类型" width="120"></vxe-column>
      <vxe-column title="是否已返" width="120">
        <template #default="{row}">
          {{ row.isReturned ? '是' : '否' }}
        </template>
      </vxe-column>
      <vxe-column title="旧件编码" width="200">
        <template #default="{ row, rowIndex }">
          <fetch-select
            v-if="editRowIndex === rowIndex"
            :remote-method="partRemote"
            remote
            v-model="row.partAndSupplierId"
            @change="(val, option) => onOldPartChange(val, option, row)"
            placeholder="请输入零件编码/名称"
            :params="row.oldPartCode"
            labelKey="partCode"
            valueKey="partAndSupplierId"
            clearable
            filterable
          >
            <template #option="{ item }">
              <span v-if="item.disabled">{{ item.placeholder }}</span>
              <span v-else>{{ item.partCode }}/{{ item.partName }}{{item.supplierCode ? `-${item.supplierName}-${item.supplierCode}`: ''}}</span>
            </template>
          </fetch-select>
          <span v-else>{{ row.oldPartCode }}</span>
        </template>
      </vxe-column>
      <vxe-column field="oldPartName" title="旧件名称" width="150"></vxe-column>
      <vxe-column field="oldPartSupplierCode" title="旧件供应商编码" width="150"></vxe-column>
      <vxe-column field="oldPartSupplierName" title="旧件供应商名称" width="150"></vxe-column>
      <vxe-column field="partQuantity" title="零件数" width="120"></vxe-column>
      <vxe-column field="partUnitPrice" title="零件单价" width="120"></vxe-column>
      <vxe-column field="managementRate" title="管理费率%" width="120"></vxe-column>
      <vxe-column field="totalCostAmount" title="总金额" width="120"></vxe-column>
      <vxe-column field="remark" title="备注" min-width="150">
        <template #default="{ row, rowIndex }">
          <el-input
            v-if="editRowIndex === rowIndex"
            v-model="row.remark"
            placeholder="请输入备注"
            clearable
          />
          <span v-else>{{ row.remark }}</span>
        </template>
      </vxe-column>
      <vxe-column title="操作" :width="120" align="center" fixed="right" :resizable="false" v-if="canAddOrUpdate">
        <template #default="{ row, rowIndex }">
          <template v-if="editRowIndex === rowIndex">
            <span
              class="action-button btn-edit"
              @click="saveRowEdit(row, rowIndex)"
            >
              保存
            </span>
            <span
              class="action-button btn-edit"
              @click="cancelEdit(row, rowIndex)"
            >
              取消
            </span>
          </template>
          <template v-else>
            <span
              class="action-button btn-edit"
              @click="editRow(row, rowIndex)"
            >
              编辑
            </span>
            <el-popconfirm
              title="确定要删除这条记录吗？"
              @confirm="handleRemoveRow(row, rowIndex)"
            >
              <el-button
                class="action-button btn-delete"
                slot="reference"
                type="text"
              >
                删除
              </el-button>
            </el-popconfirm>
          </template>
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
</template>

<script>
import { cloneDeep } from 'lodash';
import { warrantyApplyPartPage, warrantyApplyPartDelete, warrantyApplyPartUpdate } from '@/api/claimreturn/claim/warrantyapply/warrantyApplyPart';
import { getSparePartFull } from '@/api/sparepart/basic/sparePart';
import FetchSelect from '@/libs/components/FetchSelect';
import { getList } from '@/api/sparepart/basic/sparePartSupplier/index';

export default {
  props: {
    id: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
    canAddOrUpdate: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    FetchSelect,
  },
  mixins: [],
  computed: {
    _id () {
      return this.id || this.$route.query.id;
    }
  },
  data () {
    return {
      // 正在编辑的行
      editRowIndex: -1,
      originTableData: [],
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
    };
  },
  watch: {
    _id: {
      handler (val) {
        this.getDetailPageApi();
      }
    },
  },
  mounted () {
    this.getDetailPageApi();
  },
  beforeDestroy () {},
  methods: {
    // 表格数据
    getDetailPageApi () {
      warrantyApplyPartPage({
        applyId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = (res.records || []).map(item => {
          // 备件编码/备件名称————供应商(供应商编码)
          return {
            ...item,
            partAndSupplierId: item.oldPartId + item.oldPartSupplierId,
          };
        });
        this.originTableData = cloneDeep(this.tableData);
        this.total = res.total;
      });
    },
    getOriginRow (id) {
      return this.originTableData.find(row => row.id === id);
    },
    getTableData () {
      return this.$refs.editTable.getData();
    },
    handleRemoveRow (row, rowIndex) {
      if (!row.id) {
        this.tableData.splice(rowIndex, 1);
        return;
      }
      warrantyApplyPartDelete([row.id]).then((d) => {
        this.$message.success('删除成功');
        this.getDetailPageApi();
        this.$emit('update');
      }).catch(() => {});
    },
    editRow (row, rowIndex) {
      if (this.editRowIndex !== -1) {
        this.$message.info('数据未保存');
        return;
      }
      this.editRowIndex = rowIndex;
    },
    // 取消
    cancelEdit (row, rowIndex) {
      if (!row.id) {
        this.tableData.splice(rowIndex, 1);
      } else {
        const originRow = this.getOriginRow(row.id);
        this.tableData.splice(rowIndex, 1, originRow);
      }
      if (rowIndex === this.editRowIndex) {
        this.editRowIndex = -1;
      }
    },
    // 行保存
    saveRowEdit (row) {
      warrantyApplyPartUpdate({
        id: row.id,
        applyId: this._id,
        isMainPart: row.isMainPart,
        remark: row.remark,
        oldPartId: row.oldPartId,
        oldPartSupplierId: row.oldPartSupplierId,
        oldPartSupplierName: row.oldPartSupplierName,
      }).then(id => {
        this.$message.success('更新成功');
        this.getDetailPageApi();
        this.editRowIndex = -1;
        this.$emit('update');
      }).catch(e => {});
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
    handleAdd (row) {
      if (this.editRowIndex !== -1) {
        this.$message.info('请先保存数据，再添加');
        return;
      }
      this.tableData.unshift(row);
      this.editRowIndex = 0;
    },
    // 搜索旧件
    partRemote (query) {
      return new Promise((resolve, reject) => {
        getList({
          pageNum: 1,
          pageSize: 20,
          oemPart: 1,
          partCodeOrNameLike: query,
          status: 1,
        }).then(res => {
          if (!res?.records?.length) {
            resolve({
              ...res,
              records: [
                {
                  placeholder: `备件编码：${query}不存在备件供应商关系信息`,
                  disabled: true,
                }
              ],
            });
          } else {
            const records = res?.records?.map(item => {
              return {
                ...item,
                partAndSupplierId: item.sparePartId + item.supplierInfoId,
              };
            });
            resolve({
              ...res,
              records,
            });
          }
        });
      });
    },
    // 旧件选择变更
    onOldPartChange (val, option, row) {
      if (!option) {
        row.oldPartCode = '';
        row.oldPartName = '';
        row.oldPartId = '';
        row.oldPartSupplierCode = '';
        row.oldPartSupplierName = '';
        row.oldPartSupplierId = '';
        row.partAndSupplierId = '';
        return;
      }
      row.oldPartCode = option.partCode;
      row.oldPartName = option.partName;
      row.oldPartId = option.sparePartId;

      row.oldPartSupplierCode = option.supplierCode;
      row.oldPartSupplierName = option.supplierName;
      row.oldPartSupplierId = option.supplierInfoId;
      row.partAndSupplierId = row.oldPartId + row.oldPartSupplierId;
    }
  },
};
</script>

<style lang="scss" scoped>
.table-pagination {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}

.action-button {
  margin: 0 5px;
  cursor: pointer;
  &.btn-edit {
    color: #4C4CD6;
  }
  &.btn-delete {
    color: #b91919 !important;
  }
  &.disabled {
    cursor: not-allowed;
    color: var(--disabled-color);
  }
}
</style>
