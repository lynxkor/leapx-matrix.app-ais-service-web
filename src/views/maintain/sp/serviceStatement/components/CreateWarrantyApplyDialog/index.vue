<template>
  <el-dialog
    class="m-create-warranty-apply-dialog"
    title="创建保修申请单"
    width="1000px"
    :visible.sync="dialogVisible"
    @close="close"
  >
    <div class="dialog-content" v-loading="loading">
      <el-tabs v-model="activeTab" class="warranty-tabs">
        <el-tab-pane
          v-for="(item, index) in wattantyData"
          :label="item.warrantyTypeName"
          :name="item.warrantyTypeId"
          :key="item.warrantyTypeId">
          <el-checkbox-group
            @change="onChange"
            v-model="item.dataScopes"
            class="warranty-checkbox">
            <el-checkbox
              v-for="option in vehicleDataScopesOptions"
              :disabled="option.disabled"
              :label="option.value"
              :key="option.value">
              {{option.label}}
            </el-checkbox>
          </el-checkbox-group>
          <div class="table-section">
            <div class="table-title">工时列表</div>
            <vxe-table
              :ref="'vehicleLaborTable' + index"
              :data="item.workhourList"
              :checkbox-config="{ highlight: true }"
              @checkbox-change="(r) => workhourCheckbox(r, item)"
              @checkbox-all="(r) => workhourCheckbox(r, item)"
              round
              auto-resize
              stripe
              show-overflow
              resizable
              :row-config="{ isHover: true }"
              border="inner"
              size="medium"
              min-height="0"
              max-height="400px"
            >
              <vxe-column type="checkbox" width="60"></vxe-column>
              <vxe-column field="repairItemCode" title="工时代码"></vxe-column>
              <vxe-column field="repairItemName" title="工时名称"></vxe-column>
              <vxe-column field="workHour" title="工时数"></vxe-column>
            </vxe-table>
          </div>
          <div class="table-section">
            <div class="table-title">零件列表</div>
            <vxe-table
              :ref="'vehiclePartTable' + index"
              :data="item.partList"
              :checkbox-config="{ highlight: true }"
              @checkbox-change="(r) => partCheckbox(r, item)"
              @checkbox-all="(r) => partCheckbox(r, item)"
              round
              auto-resize
              stripe
              show-overflow
              resizable
              :row-config="{ isHover: true }"
              border="inner"
              size="medium"
              min-height="0"
              max-height="400px"
            >
              <vxe-column type="checkbox" width="60"></vxe-column>
              <vxe-column field="partCode" title="零件编码"></vxe-column>
              <vxe-column field="partName" title="零件名称"></vxe-column>
              <vxe-column field="partQuantity" title="零件数"></vxe-column>
            </vxe-table>
          </div>
          <div class="table-section">
            <div class="table-title">其他列表</div>
            <vxe-table
              :ref="'vehicleOtherTable' + index"
              :data="item.otherList"
              :checkbox-config="{ highlight: true }"
              @checkbox-change="(r) => otherCheckbox(r, item)"
              @checkbox-all="(r) => otherCheckbox(r, item)"
              round
              auto-resize
              stripe
              show-overflow
              resizable
              :row-config="{ isHover: true }"
              border="inner"
              size="medium"
              min-height="0"
              max-height="400px"
            >
              <vxe-column type="checkbox" width="60"></vxe-column>
              <vxe-column field="repairItemCode" title="其他代码"></vxe-column>
              <vxe-column field="repairItemName" title="其他名称"></vxe-column>
            </vxe-table>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div v-if="!loading && wattantyData.length===0" class="no-data">暂无数据</div>
    </div>

    <template v-slot:footer>
      <div class="dialog-footer">
        <el-button size="small" @click="close">取消</el-button>
        <el-button
          size="small"
          type="primary"
          :loading="submitLoading"
          @click="submitAndClose"
        >
          生成并关闭
        </el-button>
        <el-button
          size="small"
          type="primary"
          :loading="submitLoading"
          @click="submitAndNext"
        >
          生成并再次申请
        </el-button>
        <div class="radio-box">
          <el-radio v-model="radio" label="1">当前保修类型</el-radio>
          <el-radio v-model="radio" label="2">所有保修类型</el-radio>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { listUnprocessedDetails, warrantyApplyCreate, listWarrantyTypes } from '@/api/claimreturn/claim/warrantyapply';

export default {
  name: 'CreateWarrantyApplyDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      dialogVisible: this.visible,
      submitLoading: false,
      activeTab: '',
      radio: '2',
      vehicleDataScopesOptions: [
        { label: '未生成', value: 'UNGENERATED' },
        { label: '未提交', value: 'UNSUBMITTED' },
        { label: '已驳回', value: 'REJECTED' },
        { label: '审核中', value: '1', disabled: true },
        { label: '已拒赔', value: '2', disabled: true },
        { label: '审核通过', value: '3', disabled: true },
      ],
      //
      wattantyData: [],
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.initData();
      }
    }
  },
  mounted () {
  },
  methods: {
    close () {
      this.$emit('update:visible', false);
      this.onReset();
    },
    onReset () {
      this.activeTab = '';
      this.radio = '2';
    },
    initData () {
      this.listWarrantyTypes();
    },
    listWarrantyTypes () {
      this.loading = true;
      listWarrantyTypes({ statementId: this.id }).then(res => {
        this.wattantyData = (res || []).map(item => {
          return {
            ...item,
            dataScopes: ['UNGENERATED'],
          };
        });
        if (this.wattantyData.length) {
          this.activeTab = this.wattantyData[0].warrantyTypeId;
        }
        this.getData();
      }).finally(() => {
        this.loading = false;
      });
    },
    onChange (val) {
      this.getData();
    },
    getNewIds (newList, oldIds = []) {
      if (!newList || !newList.length) return [];
      const newIds = newList.map(item => item.id);
      if (!oldIds.length) return newIds;
      return oldIds.filter(id => newIds.includes(id));
    },
    getData () {
      this.loading = true;
      const warrantyTypeScopes = this.wattantyData.map(item => {
        return {
          warrantyTypeId: item.warrantyTypeId,
          dataScopes: item.dataScopes,
        };
      });
      listUnprocessedDetails({
        // 019CE115-B1DD-71D0-82E5-EEC97D939977
        // 019D0A53-FF5A-749E-BF72-D8E8CC88A090
        statementId: this.id,
        warrantyTypeScopes,
      }).then(res => {
        if (res.statementWarrantyDetailListResp?.length) {
          (res.statementWarrantyDetailListResp || []).forEach((item, index) => {
            const oldItem = this.wattantyData[index];
            const newItem = {
              ...oldItem,
              ...item,
              workhourIds: this.getNewIds(item.workhourList, oldItem.workhourIds || []),
              partIds: this.getNewIds(item.partList, oldItem.partIds || []),
              otherIds: this.getNewIds(item.otherList, oldItem.otherIds || []),
            };
            this.$set(this.wattantyData, index, newItem);
            this.$nextTick(() => {
              this.setTableCheckedStatus(index);
            });
          });
        } else {
          this.wattantyData = this.wattantyData.map(item => {
            return {
              dataScopes: item.dataScopes,
              warrantyTypeId: item.warrantyTypeId,
              warrantyTypeName: item.warrantyTypeName,
            };
          });
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    setTableCheckedStatus (index) {
      const item = this.wattantyData[index];
      if (!item) return;

      // 设置工时表格选中状态
      if (item.workhourList && item.workhourIds && item.workhourIds.length) {
        const workhourTable = this.$refs[`vehicleLaborTable${index}`];
        if (workhourTable && workhourTable[0]) {
          const tableInstance = workhourTable[0];
          const rowsToCheck = item.workhourList.filter(row =>
            item.workhourIds.includes(row.id)
          );
          rowsToCheck.forEach(row => {
            tableInstance.setCheckboxRow(row, true);
          });
        }
      }

      // 设置零件表格选中状态
      if (item.partList && item.partIds && item.partIds.length) {
        const partTable = this.$refs[`vehiclePartTable${index}`];
        if (partTable && partTable[0]) {
          const tableInstance = partTable[0];
          const rowsToCheck = item.partList.filter(row =>
            item.partIds.includes(row.id)
          );
          rowsToCheck.forEach(row => {
            tableInstance.setCheckboxRow(row, true);
          });
        }
      }

      // 设置其他表格选中状态
      if (item.otherList && item.otherIds && item.otherIds.length) {
        const otherTable = this.$refs[`vehicleOtherTable${index}`];
        if (otherTable && otherTable[0]) {
          const tableInstance = otherTable[0];
          const rowsToCheck = item.otherList.filter(row =>
            item.otherIds.includes(row.id)
          );
          rowsToCheck.forEach(row => {
            tableInstance.setCheckboxRow(row, true);
          });
        }
      }
    },
    workhourCheckbox ({ records }, item) {
      item.workhourIds = records.map(item => item.id);
    },
    partCheckbox ({ records }, item) {
      item.partIds = records.map(item => item.id);
    },
    otherCheckbox ({ records }, item) {
      item.otherIds = records.map(item => item.id);
    },
    submitAndNext () {
      this.submit(false);
    },
    submitAndClose () {
      this.submit(true);
    },
    submit (isClose) {
      let detailList = [];
      if (this.radio === '1') {
        const data = this.wattantyData.find(item => item.warrantyTypeId === this.activeTab);
        detailList = [
          {
            warrantyTypeId: data.warrantyTypeId,
            workhourIds: data.workhourIds || [],
            partIds: data.partIds || [],
            otherIds: data.otherIds || [],
          }
        ];
      } else {
        detailList = this.wattantyData.map(item => {
          return {
            warrantyTypeId: item.warrantyTypeId,
            workhourIds: item.workhourIds || [],
            partIds: item.partIds || [],
            otherIds: item.otherIds || [],
          };
        });
      }
      this.submitLoading = true;
      warrantyApplyCreate({
        statementId: this.id,
        detailList,
      }).then(res => {
        if (isClose) {
          if (res.applyIds?.length) {
            const id = res.applyIds[res.applyIds.length - 1];
            // 保修申请单详情页
            this.$router.push({
              path: '/claimreturn/claim/warrantyApply/edit',
              query: {
                id,
              }
            });
          }
        } else {
          this.onReset();
          this.initData();
        }
      }).finally(() => {
        this.submitLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-create-warranty-apply-dialog {
  ::v-deep .el-dialog{
    margin-top: 80px !important;
    height: calc(100% - 160px) !important;
    display: flex;
    flex-direction: column;
  }
  ::v-deep .el-dialog__body {
    flex: 1;
    max-height: none;
    .container {
      height: 100%;
    }
  }

  .dialog-content {
    height: 100%;
    min-height: 300px;
    .warranty-tabs {
      .table-section {
        margin-bottom: 20px;

        &:last-child {
          margin-bottom: 0;
        }

        .table-title {
          font-size: 14px;
          font-weight: 500;
          color: #333;
          margin-bottom: 10px;
          padding-left: 8px;
          border-left: 3px solid var(--leap-color-primary);
        }
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
  }
  .warranty-checkbox{
    margin-bottom: 20px;
  }
  .radio-box{
    margin-left: 12px;
  }
  .no-data{
    text-align: center;
    margin-top: 100px;
    color: var(--leap-color-default-light-1);
  }
}
</style>
