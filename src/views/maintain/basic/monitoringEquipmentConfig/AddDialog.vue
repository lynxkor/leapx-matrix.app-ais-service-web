<template>
  <el-dialog
    title="新增监控设备用途"
    :visible="visible"
    custom-class="monitoring-equipment-add-dialog"
    width="1200px"
    append-to-body
    @close="handleClose"
  >
    <div class="dialog-content">
      <!-- 搜索区域 -->
      <el-form :inline="true" :model="searchForm" size="small" class="search-form">
        <el-form-item label="设备名称">
          <el-input
            v-model="searchForm.deviceSerialName"
            placeholder="请输入设备名称"
            clearable
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="通道名称">
          <el-input
            v-model="searchForm.channelName"
            placeholder="请输入通道名称"
            clearable
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="门店名称">
          <dealer-select
            v-model="searchForm.dealerCode"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" size="small">搜索</el-button>
          <el-button @click="handleReset" size="small">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 设备列表 -->
      <div class="table-container" v-loading="loading" element-loading-text="加载中...">
        <vxe-table
          ref="xTable"
          border
          stripe
          resizable
          show-overflow
          :data="tableData"
          :loading="loading"
          :checkbox-config="{ checkField: 'checked', checkRowKey: 'id' }"
          @checkbox-all="handleSelectionChange"
          @checkbox-change="handleSelectionChange"
        >
          <vxe-column type="checkbox" width="60" fixed="left"></vxe-column>
          <vxe-column type="seq" title="序号" width="60" fixed="left"></vxe-column>
          <vxe-column field="dealerName" title="门店名称" min-width="150"></vxe-column>
          <vxe-column field="deviceSerialName" title="设备名称" min-width="150"></vxe-column>
          <vxe-column field="deviceSerialNumber" title="设备序列号" min-width="150"></vxe-column>
          <vxe-column field="channelNumber" title="通道号" min-width="100"></vxe-column>
          <vxe-column field="channelName" title="通道名称" min-width="150"></vxe-column>

          <!-- 设备用途 -->
          <vxe-column field="devicePurpose" title="设备用途" min-width="150">
            <template #default="{ row }">
              <fetch-select
                :request="fetchOptions"
                enumCode="maintain_device_purpose"
                v-model="row.devicePurpose"
                placeholder="请选择"
              />
            </template>
          </vxe-column>

          <!-- 工位名称 -->
          <vxe-column field="dealerStationName" title="工位名称" min-width="150">
            <template #default="{ row }">
              <fetch-select
                v-model="row.dealerStationName"
                placeholder="请选择工位"
                filterable
                remote
                :remote-method="(query) => queryDealerStations(query, row)"
                :loading="stationLoading"
                clearable
                value-key="id"
                label-key="name"
                @change="(data, obj) => handleStationChange(row, data, obj)"
              />
            </template>
          </vxe-column>

          <vxe-column field="remark" title="备注" min-width="200">
            <template #default="{ row }">
              <el-input v-model="row.remark" placeholder="请输入备注" limit="500" show-word-limit />
            </template>
          </vxe-column>
        </vxe-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            :current-page.sync="pagination.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pagination.size"
            :total="pagination.total"
            :disabled="loading"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose" size="small">关闭</el-button>
      <el-button
        type="primary"
        :loading="submitLoading"
        @click="handleSubmit"
        size="small"
        :disabled="selectedRows.length === 0"
      >确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { batchUpdate, page } from '@/api/maintain/basic/monitoringEquipmentConfig/index';
import { getEnum } from '@/api/common';
import { getList as getDealerStationList } from '@/api/maintain/basic/dealerStation/index';
import FetchSelect from '@/libs/components/FetchSelect';
import DealerSelect from '@/components/dealer-select/index.vue';

export default {
  name: 'MonitoringEquipmentAddDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    FetchSelect,
    DealerSelect
  },
  data () {
    return {
      loading: false,
      submitLoading: false,
      stationLoading: false,
      searchForm: {
        deviceSerialName: '',
        channelName: '',
        dealerCode: '',
        hasDevicePurpose: false
      },
      tableData: [],
      selectedRows: [],
      devicePurposeOptions: [],
      devicePurposeMap: {},
      stationOptions: [],
      pagination: {
        page: 1,
        size: 20,
        total: 0
      }
    };
  },
  watch: {
    visible (val) {
      if (val) {
        this.loadEnum();
        this.loadData();
      }
    }
  },
  methods: {
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    handleClose () {
      this.selectedRows = [];
      this.searchForm = {
        deviceSerialName: '',
        channelName: '',
        dealerCode: '',
        hasDevicePurpose: false
      };
      this.$emit('close');
    },

    handleSearch () {
      this.pagination.page = 1;
      this.loadData();
    },

    handleReset () {
      this.searchForm = {
        deviceSerialName: '',
        channelName: '',
        dealerName: '',
        hasDevicePurpose: false
      };
      this.pagination.page = 1;
      this.loadData();
    },

    async loadEnum () {
      try {
        const res = await getEnum('maintain_device_purpose');
        this.devicePurposeOptions = res || [];
        // 创建映射：code -> message
        this.devicePurposeMap = {};
        this.devicePurposeOptions.forEach(opt => {
          this.devicePurposeMap[opt.code] = opt.message;
        });
      } catch (error) {
        console.error('加载枚举失败:', error);
        this.devicePurposeOptions = [];
        this.devicePurposeMap = {};
      }
    },

    async loadData () {
      this.loading = true;
      try {
        const res = await page({
          ...this.searchForm,
          pageNum: this.pagination.page,
          pageSize: this.pagination.size
        });
        this.tableData = (res.records || []).map(item => ({
          ...item,
          checked: false,
          devicePurpose: null,
          dealerStationName: '',
          remark: '',
          stationOptions: [] // 每行独立的工位选项
        }));
        this.pagination.total = res.total || 0;
      } catch (error) {
        console.error('加载数据失败:', error);
        this.$message.error('加载数据失败');
      } finally {
        this.loading = false;
      }
    },

    handleSizeChange (size) {
      this.pagination.size = size;
      this.pagination.page = 1;
      this.loadData();
    },

    handleCurrentChange (page) {
      this.pagination.page = page;
      this.loadData();
    },

    handleSelectionChange ({ records }) {
      this.selectedRows = records.filter(row => row.checked);
    },

    getPurposeCode (message) {
      for (const [code, msg] of Object.entries(this.devicePurposeMap)) {
        if (msg === message) return code;
      }
      return '';
    },

    async queryDealerStations (query, row) {
      this.stationLoading = true;
      try {
        return await getDealerStationList({ name: query, dealerCodes: [row.dealerCode] });
      } catch (error) {
        console.error('查询工位失败:', error);
        row.stationOptions = [];
      } finally {
        this.stationLoading = false;
      }
    },
    handleStationChange (row, data, obj) {
      row.dealerStationId = data;
      row.dealerStationName = obj.name;
    },
    async handleSubmit () {
      // 验证必填项
      for (const row of this.selectedRows) {
        if (!row.devicePurpose) {
          this.$message.error('请为所有选中设备选择设备用途');
          return;
        }

        const purposeMessage = this.devicePurposeMap[row.devicePurpose];
        if (purposeMessage === '维修工位直播' && !row.dealerStationName) {
          this.$message.error(`设备"${row.deviceSerialName}"的设备用途为"维修工位直播"，请选择工位名称`);
          return;
        }
      }

      this.submitLoading = true;
      try {
        const submitData = this.selectedRows.map(row => ({
          id: row.id,
          devicePurpose: row.devicePurpose,
          dealerStationName: row.dealerStationName,
          dealerStationId: row.dealerStationId,
          remark: row.remark
          // 其他必要字段根据后端接口需要添加
        }));

        // 调用新增或更新接口
        await batchUpdate(submitData);

        this.$message.success('新增成功');
        this.$emit('success');
        this.handleClose();
      } catch (error) {
        console.error('提交失败:', error);
        this.$message.error('提交失败');
      } finally {
        this.submitLoading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.monitoring-equipment-add-dialog {
  .dialog-content {
    padding: 20px 0;
  }

  .search-form {
    margin-bottom: 20px;
  }

  .table-container {
    margin-bottom: 20px;
  }

  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }

}
</style>
