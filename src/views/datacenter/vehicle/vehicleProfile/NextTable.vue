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
          :clearable="false"
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
          :clearable="!originTableData[rowIndex] || !originTableData[rowIndex].nextMileage"
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
          <span
            v-if="canResetPart && row.maintenancePartCode "
            :class="['action-button', resettingRowId === row.id ? 'btn-reset-loading' : 'btn-reset']"
            @click="resettingRowId === row.id ? null : handleResetPart(row)"
          >
            重置
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
import { resetPart } from '@/api/maintain/basic/maintenanceRemind';
import { getCarInfo } from '@/api/maintain/sp/serviceProxy';
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
    },
    vin: {
      type: String,
      default: '',
    },
    canResetPart: {
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
      resettingRowId: null,
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
    if (this._id) {
      this.getDetailPageApi();
    }
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
      const origin = this.originTableData.find(r => r.id === row.id);
      // 若原数据日期非空,当前值不能为空
      if (origin && origin.nextMaintenanceDate && !row.nextMaintenanceDate) {
        this.$message.error('下次保养日期不能为空');
        return;
      }
      // 若原数据里程非空,当前值不能为空
      if (origin && origin.nextMileage && (row.nextMileage === '' || row.nextMileage === null || row.nextMileage === undefined)) {
        this.$message.error('下次保养里程不能为空');
        return;
      }
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
    async handleResetPart (row) {
      if (this.resettingRowId || this.eidtRowIndex !== -1) return;
      if (!this.vin || !row.maintenancePartCode) {
        this.$message.warning('缺少 VIN 或零件代码,无法重置');
        return;
      }
      // mileageTypeLabel 为后端返回的中文里程类型标签: 总里程 / 增程里程
      const mileageType = row.mileageTypeLabel;
      this.resettingRowId = row.id;
      try {
        const carInfo = await getCarInfo(this.vin);
        let mileageValue;
        let mileageLabel;
        if (mileageType === '增程里程') {
          mileageValue = carInfo && carInfo.oilMileage;
          mileageLabel = '增';
          if (mileageValue === null || mileageValue === undefined || mileageValue === '') {
            this.$message.warning('该车辆暂无增程里程数据');
            return;
          }
        } else if (mileageType === '总里程') {
          mileageValue = carInfo && carInfo.mileage;
          mileageLabel = '总';
          if (mileageValue === null || mileageValue === undefined || mileageValue === '') {
            this.$message.warning('未获取到车联网里程,无法重置');
            return;
          }
        } else {
          this.$message.error('零件里程类型异常,无法重置');
          return;
        }
        await this.$confirm(
          `当前车联网里程数(${mileageLabel})为 ${mileageValue} km,是否确定重置?`,
          '重置确认',
          { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
        );
        const res = await resetPart({
          vin: this.vin,
          maintenancePartCode: row.maintenancePartCode,
        });
        const idx = this.tableData.findIndex(r => r.id === row.id);
        if (idx !== -1) {
          this.tableData[idx].nextMaintenanceDate = res.nextMaintenanceDate;
          // 后端字段:nextMaintenanceMileage(注意"Maintenance"全词)
          this.tableData[idx].nextMileage = res.nextMaintenanceMileage;
          const oIdx = this.originTableData.findIndex(r => r.id === row.id);
          if (oIdx !== -1) {
            this.originTableData[oIdx] = cloneDeep(this.tableData[idx]);
          }
        }
        this.$message.success('重置成功');
        this.$emit('update');
      } finally {
        this.resettingRowId = null;
      }
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
  &.btn-reset {
    color: #67c23a;
  }
  &.btn-reset-loading {
    color: #999;
    cursor: not-allowed;
  }
}
</style>
