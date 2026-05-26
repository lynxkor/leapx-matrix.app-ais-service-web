<template>
  <div class="common-section-table pb-0">
  <vxe-table
    ref="editTable"
    :data="tableData"
    :class="{isEdit: isEdit}"
    v-loading="isEdit && loading"
    stripe
    show-overflow
    resizable
    :row-config="{ isHover: true }"
    border="inner"
    size="medium"
    min-height="0"
    max-height="400px"
    >
    <vxe-column field="name" title="保养零件名称" ></vxe-column>
    <vxe-column field="maintenancePartCode" title="保养零件代码" >
      <template #default="{ row }">
        <el-link v-if="row.maintenancePartId" type="success" :href="`/service/maintain/basic/maintenancePartData/edit?id=${row.maintenancePartId}`" target="_blank">{{ row.maintenancePartCode }}</el-link>
        <span v-else>{{ row.maintenancePartCode }}</span>
      </template>
    </vxe-column>
    <vxe-column field="mileageTypeLabel" title="里程类型" ></vxe-column>
    <vxe-column field="nextMaintenanceDate" title="下次保养日期" >
      <template #default="{ row, rowIndex }">
        <el-date-picker
          v-if="isEdit && eidtRowIndex === rowIndex"
          v-model="row.nextMaintenanceDate"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期"
          size="small"
        />
        <span v-else>{{ row.nextMaintenanceDate }}</span>
      </template>
    </vxe-column>
    <vxe-column field="nextMileage" title="下次保养里程" >
      <template #default="{ row, rowIndex }">
        <el-input-number
          v-if="isEdit && eidtRowIndex === rowIndex"
          v-model="row.nextMileage"
          placeholder="请输入"
          :controls="false"
          :precision="2"
          size="small"
          style="width: 100%;"
        />
        <span v-else>{{ row.nextMileage }}</span>
      </template>
    </vxe-column>
    <vxe-column title="操作" width="150" align="center" fixed="right" :resizable="false" v-if="isEdit">
      <template #default="{ row, rowIndex }">
        <template v-if="eidtRowIndex === rowIndex">
          <span
            class="action-button btn-edit"
            @click="saveRowEdit(row, rowIndex)"
          >
            保存
          </span>
          <span
            class="action-button btn-delete"
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
      v-if="tableData.length"
    >
    </el-pagination>
  </div>
</div>
</template>
<script>
import { vehicleProfileMaintenanceRecordPage, editMaintenanceRecord } from '@/api/datacenter/vehicle/vehicleProfile';
import permissions from '@/libs/mixins/permissions';
import { cloneDeep } from 'lodash';

export default {
  props: {
    id: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
    isEdit: {
      type: Boolean,
      default: false,
    }
  },
  components: {
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
      loading: false,
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
  beforeDestroy () {
  },
  methods: {
    // 表格数据
    getDetailPageApi () {
      this.loading = true;
      vehicleProfileMaintenanceRecordPage({
        vehicleProfileId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records;
        this.originTableData = cloneDeep(res.records);
        this.total = res.total;
      }).finally(() => {
        this.loading = false;
      });
    },
    getTableData () {
      return this.$refs.editTable.getData();
    },
    getOriginRow (id) {
      return this.originTableData.find(row => row.id === id);
    },
    editRow (row, rowIndex) {
      if (this.eidtRowIndex !== -1) {
        this.$message.info('请先保存当前编辑的数据');
        return;
      }
      this.eidtRowIndex = rowIndex;
    },
    cancelEdit (row, rowIndex) {
      const originRow = this.getOriginRow(row.id);
      if (originRow) {
        this.tableData.splice(rowIndex, 1, cloneDeep(originRow));
      }
      if (rowIndex === this.eidtRowIndex) {
        this.eidtRowIndex = -1;
      }
    },
    saveRowEdit (row, rowIndex) {
      editMaintenanceRecord({
        id: row.id,
        nextMaintenanceDate: row.nextMaintenanceDate,
        nextMileage: row.nextMileage,
      }).then(() => {
        this.$message.success('保存成功');
        this.originTableData = cloneDeep(this.tableData);
        this.eidtRowIndex = -1;
        this.$emit('update');
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
    color: #b91919;
  }
}
</style>
