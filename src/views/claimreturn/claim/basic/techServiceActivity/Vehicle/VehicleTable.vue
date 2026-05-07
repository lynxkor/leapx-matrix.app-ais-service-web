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
    >
    <vxe-column field="vin" title="VIN" width="160">
      <template #default="{row}">
        <el-link type="success" :href="`/service/datacenter/vehicle/vehicleProfile/edit?id=${row.vehicleProfileId}`" target="_blank">{{ row.vin }}</el-link>
        <span v-if="row.vin !== row.vinAll" @click="() => onVin(row)" class="eye-icon iconfont icon-lxppc-eye"></span>
        <span v-else @click="() => onVin(row)" class="eye-icon iconfont icon-lxppc-eye-off"></span>
      </template>
    </vxe-column>
    <vxe-column title="计划实施门店名称" width="180">
      <template #default="{ row, rowIndex }">
        <fetch-select
          v-if="editRowIndex === rowIndex && row.finished==='0'"
          filterable
          clearable
          remote
          reserve-keyword
          v-model="row.plannedDealerId"
          :remote-method="dealerRemote"
          :params="row.plannedDealerName"
          @change="(value, option) => onDealerChange(row, value, option)"
          placeholder="请输入"
          value-key="orgId"
          label-key="orgName"
          sub-label-key="orgCode"
        />
        <span v-else>{{ row.plannedDealerName }}</span>
      </template>
    </vxe-column>
    <vxe-column field="finishedLabel" title="是否完成" width="160"></vxe-column>
    <vxe-column field="finishTime" title="完成时间" width="160"></vxe-column>
    <vxe-column field="actualDealerName" title="实际施工门店名称" width="160"></vxe-column>
    <vxe-column field="workOrderNo" title="施工单号" width="200">
      <template #default="{row}">
        <div class="href-link" @click="handleJump(row)">{{ row.workOrderNo }}</div>
      </template>
    </vxe-column>
    <vxe-column title="车主手机" width="160">
      <template #default="{row}">
        {{ row.ownerPhone }}
        <span v-if="row.ownerPhone !== row.ownerPhoneAll" @click="() => onPhone(row)" class="eye-icon iconfont icon-lxppc-eye"></span>
        <span v-else @click="() => onPhone(row)" class="eye-icon iconfont icon-lxppc-eye-off"></span>
      </template>
    </vxe-column>
    <vxe-column field="schemeId" title="施工方案" width="160"></vxe-column>
    <vxe-column field="createTime" title="创建时间" width="160"></vxe-column>
    <vxe-column field="updateTime" title="修改时间" width="160"></vxe-column>
    <vxe-column title="操作" :width="120" fixed="right" :resizable="false" v-if="canAddOrUpdate">
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
            v-if="row.finished==='0'"
          >
            编辑
          </span>
          <el-popconfirm
            title="确定要删除这条记录吗？"
            @confirm="handleRemoveRow(row, rowIndex)"
            v-if="row.finished==='0'"
            confirm-button-text="删除"
            confirm-button-type="danger"
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
import {
  serviceActivityVehiclePage,
  serviceActivityVehicleUpdate,
  serviceActivityVehicleDelete,
} from '@/api/claimreturn/claim/basic/serviceActivity';

import permissions from '@/libs/mixins/permissions';
import popconfirmScrollClose from '@/libs/mixins/popconfirmScrollClose';
import { listOrgStoreInfo } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import { cloneDeep } from 'lodash';
import { getDetailDecryptField } from '@/api/claimreturn/claim/basic/serviceActivityVehicle';
import { getList } from '@/api/datacenter/vehicle/serviceProxyHis/index';

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
    isServiceCareActivity: {
      type: Boolean,
    }
  },
  components: {
    FetchSelect,
  },
  mixins: [permissions, popconfirmScrollClose],
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
      //
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
  beforeDestroy () {
  },
  methods: {
    // 表格数据
    getDetailPageApi () {
      serviceActivityVehiclePage({
        activityId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current,
        isServiceCareActivity: this.isServiceCareActivity,
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
        this.tableData.splice(rowIndex, 1, originRow); // 数据还原
      }
      if (rowIndex === this.editRowIndex) {
        this.editRowIndex = -1;
      }
    },
    // 行保存
    saveRowEdit (row) {
      serviceActivityVehicleUpdate({
        id: row.id,
        activityId: this._id,
        plannedDealerId: row.plannedDealerId,
        plannedDealerCode: row.plannedDealerCode,
        plannedDealerName: row.plannedDealerName,
      }).then(id => {
        this.$message.success('更新成功');
        this.getDetailPageApi();
        this.editRowIndex = -1;
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
      if (this.editRowIndex !== -1) {
        this.$message.info('请先保存数据，再添加');
        return;
      }
      this.tableData.unshift(row);
      this.$refs.editTable.setEditRow(row);
      this.editRowIndex = 0;
    },
    // 门店
    onDealerChange (row, value, option) {
      row.plannedDealerCode = option?.orgCode;
      row.plannedDealerName = option?.orgName;
      row.plannedDealerId = option?.orgId;
    },
    // 门店下拉接口
    dealerRemote (query) {
      return listOrgStoreInfo({
        name: query,
      });
    },
    onVin (row) {
      if (row.vinAll) {
        row.vin = row.vin === row.vinAll ? row.vinMask : row.vinAll;
        return;
      }
      getDetailDecryptField(row.id, 'vin').then(data => {
        row.vinAll = data;
        row.vinMask = row.vin;
        row.vin = row.vinAll;
      });
    },
    onPhone (row) {
      if (row.ownerPhoneAll) {
        row.ownerPhone = row.ownerPhone === row.ownerPhoneAll ? row.ownerPhoneMask : row.ownerPhoneAll;
        return;
      }
      getDetailDecryptField(row.id, 'ownerPhone').then(data => {
        row.ownerPhoneAll = data;
        row.ownerPhoneMask = row.ownerPhone;
        row.ownerPhone = row.ownerPhoneAll;
      });
    },
    handleJump (row) {
      getList({
        pageNum: 1,
        pageSize: 20,
        serviceProxyId: row.workOrderId,
        // serviceProxyId: '019CF984-E27E-7B48-BCFD-7C735ACAC69C',
      }).then(res => {
        if (res?.records?.length) {
          const item = res.records[0];
          this.$router.push({
            path: '/datacenter/vehicle/serviceProxyHis/edit',
            query: {
              id: item.id,
            }
          });
        } else {
          this.$message.info('暂无维修履历');
        }
      });
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
.eye-icon{
  vertical-align: text-top;
  font-size: 20px;
  margin-left: 10px;
  cursor: pointer;
  color: #009100;
}
</style>
