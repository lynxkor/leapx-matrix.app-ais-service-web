<template>
  <div>
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
    :edit-rules="{
      quantity: [{ required: true },]
    }"
    >
    <vxe-column field="vin" title="VIN" width="160"></vxe-column>
    <vxe-column field="" title="计划实施门店名称" width="160">
      <template #default="{ row, rowIndex }">
        <fetch-select
          v-if="eidtRowIndex === rowIndex"
          filterable
          clearable
          remote
          reserve-keyword
          v-model="row.oldPartCode"
          :remote-method="partRemote"
          :params="row.oldPartCode"
          @change="(value, option) => onOldPartCodeChange(row, value, option)"
          placeholder="请输入"
          value-key="partCode"
          label-key="partName"
        />
        <span v-else>{{ row.oldPartName }}</span>
      </template>
    </vxe-column>
    <vxe-column field="" title="是否完成" width="160"></vxe-column>
    <vxe-column field="" title="完成时间" width="160"></vxe-column>
    <vxe-column field="" title="实际施工门店名称" width="160"></vxe-column>
    <vxe-column field="" title="施工单号" width="160"></vxe-column>
    <vxe-column field="" title="车主手机" width="160"></vxe-column>
    <vxe-column field="" title="施工方案" width="160"></vxe-column>
    <vxe-column field="" title="创建时间" width="160"></vxe-column>
    <vxe-column field="" title="修改时间" width="160"></vxe-column>
    <vxe-column title="操作" :width="200" align="center" fixed="right" :resizable="false">
      <template #default="{ row, rowIndex }">
        <template v-if="eidtRowIndex === rowIndex">
          <span
            class="action-button btn-edit"
            @click="saveRowEdit(row, rowIndex)"
            v-if="canAddOrUpdate"
          >
            保存
          </span>
          <span
            class="action-button btn-edit"
            @click="cancelEdit(row, rowIndex)"
            v-if="canAddOrUpdate"
          >
            取消
          </span>
        </template>
        <template v-else>
          <span
            class="action-button btn-edit"
            @click="editRow(row, rowIndex)"
            v-if="canAddOrUpdate"
          >
            编辑
          </span>
          <el-popconfirm
            title="确定要删除这条记录吗？"
            @confirm="handleRemoveRow(row, rowIndex)"
            v-if="canAddOrUpdate"
          >
            <el-button
              class="action-button btn-delete"
              slot="reference"
              type="text">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </template>
    </vxe-column>
    <template #empty>
      <div class="m-vxe-table-empty-text">
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
import {
  serviceActivityVehiclePage,
  serviceActivityVehicleUpdate,
  serviceActivityVehicleDelete,
} from '@/api/claimreturn/claim/basic/serviceActivity';

import permissions from '@/libs/mixins/permissions';
import { getEnum, repairItemType } from '@/api/common';
import { getList as partList } from '@/api/sparepart/basic/sparePart';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import { cloneDeep } from 'lodash';

export default {
  props: {
    id: {
      type: String,
    },
    moduleKey: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
    },
  },
  components: {
    FetchSelect,
  },
  mixins: [permissions],
  computed: {
    _id () {
      return this.id || this.$route.query.id;
    }
  },
  data () {
    return {
      // 正在编辑的行
      eidtRowIndex: -1,
      originTableData: [],
      //
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      editConfig: {
        trigger: 'click',
        mode: 'row'
      },
      options: {
        returnType: [],
        oldPartCode: [],
      },
      defaultNewRow: {
        id: '',
        activityId: '',
        partId: '',
        partCode: '',
        partName: '',
        repairItemTypeId: '',
        repairItemTypeCode: '',
        repairItemTypeName: '',
        oldPartId: '',
        oldPartCode: '',
        oldPartName: '',
        oldSupplierId: '',
        oldSupplierCode: '',
        oldSupplierName: '',
        quantity: '',
        mainPart: '',
        allowDelete: '',
        returnType: '',
        returnTypeLabel: '',
      },
      selectedRow: {},
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
    this.returnTypeRemote();
  },
  beforeDestroy () {
  },
  methods: {
    // 表格数据
    getDetailPageApi () {
      serviceActivityVehiclePage({
        activityId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records;
        this.originTableData = cloneDeep(res.records);
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
      serviceActivityVehicleDelete([row.id]).then((d) => {
        this.$message.success('删除成功');
        this.getDetailPageApi();
      }).catch(() => {
      });
    },
    editRow (row, rowIndex) {
      if (this.eidtRowIndex !== -1) {
        this.$message.info('数据未保存');
        return;
      }
      this.eidtRowIndex = rowIndex;
    },
    // 取消
    cancelEdit (row, rowIndex) {
      if (!row.id) {
        this.tableData.splice(rowIndex, 1);
      } else {
        const originRow = this.getOriginRow(row.id);
        this.tableData.splice(rowIndex, 1, originRow); // 数据还原
      }
      if (rowIndex === this.eidtRowIndex) {
        this.eidtRowIndex = -1;
      }
    },
    // 数量验证
    validateQuantity (quantity) {
      if (!quantity) {
        this.$message.warning('请输入数量');
        return false;
      }

      if (!/^\d+(\.\d+)?$/.test(quantity)) {
        this.$message.warning('请输入有效的数字');
        return false;
      }

      if (parseFloat(quantity) <= 0) {
        this.$message.warning('数量必须大于0');
        return false;
      }
      return true;
    },
    // 行保存
    saveRowEdit (row) {
      const parmas = {};
      Object.keys(this.defaultNewRow).forEach(key => {
        if (key === 'allowDelete' || key === 'mainPart') {
          parmas[key] = row[key] === '1' ? '1' : '0';
          return;
        }
        parmas[key] = row[key];
      });
      parmas.activityId = this._id;
      if (!this.validateQuantity(parmas.quantity)) {
        return;
      }

      serviceActivityVehicleUpdate(parmas).then(id => {
        this.$message.success('更新成功');
        this.getDetailPageApi();
        this.eidtRowIndex = -1;
      }).catch(e => {
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
    // -------------
    handleAdd (partId, row) {
      if (this.eidtRowIndex !== -1) {
        this.$message.info('请先保存数据，再添加');
        return;
      }
      this.tableData.unshift(row);
      this.$refs.editTable.setEditRow(row);
      this.eidtRowIndex = 0;
    },
    // 维修类型
    repairItemTypeRemote (query) {
      return repairItemType({
        nameLike: query,
        categorys: [10]
      });
    },
    onRepairChange (row, value, option) {
      row.repairItemTypeName = option.name;
      row.repairItemTypeCode = option.code;
    },
    // 旧件返回类型接口
    returnTypeRemote () {
      getEnum('old_part_return_type').then(res => {
        const list = res?.map(item => {
          return {
            returnType: item.code,
            returnTypeLabel: item.message,
          };
        }) || [];
        this.options.returnType = list;
      });
    },
    // 旧件供应商下拉
    onOldSupplierChange (value, row) {
      const options = row.__options__?.oldSupplierId || [];
      const option = options.find((item) => item.value === value);
      row.oldSupplierId = option?.value;
      row.oldSupplierName = option?.label;
      row.oldSupplierCode = option?.labelDesc;
      this.$refs.editTable.updateData(row, row);
    },
    // 旧件编码下拉
    onOldPartCodeChange (row, value, option) {
      row.oldPartCode = option?.partCode;
      row.oldPartName = option?.partName;
      row.oldPartId = option?.id;
      console.log(option, row);
      this.sparePartSupplierListApi(option?.id, row);
    },
    // 零部件下拉接口
    partRemote (query) {
      return partList({
        partCodeOrNameLike: query,
        pageSize: 20,
        pageNum: 1,
      });
    },
  },
};

</script>
<style lang="scss" scoped>
  .table-pagination {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;
  }

  .action-button{
    margin: 0 5px;
    cursor: pointer;
    &.btn-edit{
      color:#4C4CD6;
    }
    &.btn-delete{
      color: #b91919 !important;;
    }
    &.disabled{
      cursor: not-allowed;
      color: var(--disabled-color);
    }
  }
</style>
