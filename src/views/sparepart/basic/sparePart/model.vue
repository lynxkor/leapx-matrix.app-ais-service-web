<template>
  <!-- 公共弹窗组件 -->
  <el-dialog title="维护车型" :visible="visible" width="60%" append-to-body @close="handleClose">
    <div class="dialog-content-scroll">
      <!-- 车系选择区域 -->
      <div class="selection-container">
        <div class="selection-section">
          <div class="section-title">车系</div>
          <div class="selection-items">
            <div v-for="(series, index) in seriesList" :key="'series-' + index"
              :class="['selection-item', { 'selected': selectedSeriesIndex === index }]"
              @click="selectSeries(index, series)">
              {{ series.seriesName }}
            </div>
          </div>
        </div>
        <!-- 年款选择区域 -->
        <div class="selection-section">
          <div class="section-title">年款</div>
          <div class="selection-items">
            <div v-for="(year, index) in options.vehicleYearTypeName" :key="'year-' + index"
              :class="['selection-item', { 'selected': selectedYearIndex === index }]" @click="selectYear(index, year)">
              {{ year.label }}
            </div>
          </div>
        </div>
        <!-- 车型 -->
        <div class="selection-section">
          <div class="section-title">车型</div>
          <div class="selection-items">
            <div v-for="(model, index) in applicableModelList" :key="'model-' + index"
              :class="['selection-item', { 'selected': selectedModelIndex === index, 'disabled': isModelDisabled(model.id) }]"
              @click="!isModelDisabled(model.id) && selectModel(index, model)">
              {{ model.modelName }}
            </div>
          </div>
        </div>
      </div>

      <!-- 表格区域 -->
      <div class="table-container">
        <expand-table ref="expandTable" :columns="columns" :data="tableData" :options="options" :auth="{
          add: false,
          edit: false,
          delete: false,
        }" :delTitle="'确认删除该门店吗？'" :show-toolbar="false" @value-change="handleYearChange">
          <template #btn-middle="{ row, rowIndex }">
            <el-popconfirm v-if="row.id" title="确定要停用此车型吗？" @confirm="toggleStatus(row)">
              <span slot="reference" class="action-button btn-delete">
                停用
              </span>
            </el-popconfirm>
            <el-button v-if="!row.id" type="text" class="btn-move" @click="delStatus(row, rowIndex)">
              移除
            </el-button>
          </template>
        </expand-table>
      </div>
    </div>

    <!-- 弹窗底部按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">取消</el-button>
      <el-button type="primary" size="small" @click="handleConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listVehicleSeries, listVehicleYearTypeFull, listVehicleYearType } from '@/api/common';
import { searchVehicleModel, addOrUpdateVehicleModel, deleteVehicleModel } from '@/api/sparepart/basic/sparePart/index';
import expandTable from '@/libs/components/expandTable';

export default {
  name: 'SeriesYearDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    modelId: {
      type: String || Number,
      default: null
    },
    // 可以接收外部传入的初始数据
    initialData: {
      type: Array,
      default: () => []
    }
  },
  components: {
    expandTable
  },
  data () {
    return {
      // 车系数据
      seriesList: [],
      selectedSeriesIndex: 0,
      // 年款数据
      yearList: [],
      selectedYearIndex: 0,
      yearDetail: {},
      // 车型
      applicableModelList: [],
      selectedModelIndex: null,
      // 表格 选择数据
      tableData: [],
      columns: [ // 适配车型
        {
          field: 'index',
          title: '序号',
          width: '22%',
        },
        {
          field: 'vehicleSeriesName',
          title: '车系',
          width: '22%',
        },
        {
          field: 'vehicleModelName',
          title: '适用车型',
          width: '22%',
        },
        {
          field: 'vehicleYearTypeName',
          title: '年款',
          width: '22%',
          editable: true,
          editRender: {
            name: 'ElSelect',
            props: {
              clearable: true,
              'suffix-icon': 'el-icon-search',
              placeholder: '请选择年款',
            },
          },
        }
      ],
      options: {
        vehicleYearTypeName: []
      }
    };
  },
  watch: {
    // 监听父组件传入的数据变化
    modelId: {
      handler (newVal) {
        if (!newVal) {
          return;
        }
        this.getData(newVal);
      },
      immediate: true, // 立即执行一次
      deep: true,
    },
  },
  mounted () {
    this.getVehicleList();
    this.getYearList();
    // 初始化时默认选择第一个车系和年款
    this.selectSeries(0);
    this.selectYear(0);
  },
  methods: {
    async getData (val) {
      const params = {
        pageNum: 1,
        pageSize: 100,
        sparePartId: val,
      };
      const res = await searchVehicleModel(params);
      this.tableData = res.records.map((item, index) => {
        return {
          ...item,
          index: index + 1 // 添加序号字段
        };
      });
    },
    async getVehicleList () {
      const res = await listVehicleSeries({ status: 1, pageSize: 1000 });
      this.seriesList = res || [];
      // 初始化时默认选择第一个车系
      if (this.seriesList.length > 0) {
        this.getModelList(this.seriesList[0].id);
      }
    },
    // 年款接口
    async getYearList () {
      const res = await listVehicleYearType({ status: 1, pageSize: 1000 });
      // 在数组开头添加"无年款"选项
      this.options.vehicleYearTypeName = [
        { value: '0', label: '无年款' },
        ...(res?.map(item => ({
          value: item.id, // 或 item.value，根据实际数据结构
          label: item.name // 或 item.label
        })) || [])
      ];
    },
    // 确定提交
    async addModel () {
      // 提交数据
      const params = {
        sparePartId: this.modelId,
        addOrUpdateReqList: this.tableData,
      };
      await addOrUpdateVehicleModel(params);
    },

    // 选择车系 车系id查询 车型
    async getModelList (seriesId) {
      const res = await listVehicleYearTypeFull({ seriesId: seriesId, status: 1, pageSize: 1000 });
      this.applicableModelList = res || [];
    },
    // 选择车型
    selectModel (index, model) {
      this.selectedModelIndex = index;
      // 更新当前行的车型选择
      let modelArray = [];

      if (Array.isArray(model)) {
        // 如果已经是数组，直接使用
        modelArray = model;
      } else if (model && typeof model === 'object') {
        // 如果是单个对象，包装成数组
        modelArray = [model];
      }
      // 获取当前 tableData 的长度作为起始索引
      const startIndex = this.tableData.length;
      // 更新当前行的车型选择
      const list = modelArray.map((item) => {
        return {
          index: startIndex + 1,
          value: item.id,
          label: item.modelName,
          vehicleModelId: item.id,
          vehicleModelName: item.modelName,
          vehicleSeriesId: item.seriesId,
          vehicleSeriesName: item.seriesName,
          vehicleModelDesc: item.remark,
          vehicleYearTypeId: this.yearDetail.vehicleYearTypeId,
          vehicleYearTypeName: this.yearDetail.vehicleYearTypeName,
        };
      }) || [];
      this.tableData.push(...list);
    },
    // 选择车系
    selectSeries (index, series) {
      this.selectedSeriesIndex = index;
      this.getModelList(series?.id);
      // 重新选择车系时，清空车型选择
      this.selectedModelIndex = null;
    },

    // 判断车型是否已被选中（同一车型+同一年款已存在表格中则置灰）
    isModelDisabled (modelId) {
      return this.tableData.some(item => item.vehicleModelId === modelId && item.vehicleYearTypeId === this.yearDetail.vehicleYearTypeId);
    },
    // 选择年款
    selectYear (index, year) {
      this.selectedYearIndex = index;
      this.selectedModelIndex = null;
      this.yearDetail = {
        vehicleYearTypeId: year?.value,
        vehicleYearTypeName: year?.label,
      };
    },

    // 年款下拉选择变更
    handleYearChange (row) {
      console.log('选择的年款数据:', row);

      // 计算数组下标：row.row.index 是从1开始的序号，需要减1得到数组下标
      const arrayIndex = row.row.index - 1;

      // 检查下标是否有效
      if (arrayIndex >= 0 && arrayIndex < this.tableData.length) {
        // 使用 $set 确保响应式更新
        const updatedRow = {
          ...this.tableData[arrayIndex],
          vehicleYearTypeId: row.option?.value,
          vehicleYearTypeName: row.option?.label
        };
        this.$set(this.tableData, arrayIndex, updatedRow);
      }
    },

    // 停用
    async toggleStatus (row) {
      await deleteVehicleModel([row.id]);
      this.getData(this.modelId);
    },
    // 删除
    delStatus (row, index) {
      this.tableData.splice(index, 1);
    },

    // 处理确定按钮
    async handleConfirm () {
      await this.addModel();
      this.getData(this.modelId);
      this.$emit('success');
      this.handleClose();
      // 车系 年款  车型 全部初始化 表格数据清空
      this.selectSeries(0);
      this.selectYear(0);
      this.getVehicleList();
    },

    // 处理取消按钮
    handleClose () {
      this.$emit('success');
      this.$emit('close');
    },
  }
};
</script>

<style scoped>
/* 外层滚动容器：车系+年款+车型+表格整体滚动 */
.dialog-content-scroll {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 8px;
}

/* 选择区域样式 */
.selection-section {
  display: flex;
  ;
  /* align-items: center; */
  margin-bottom: 20px;
}

.section-title {
  white-space: nowrap;
  font-size: 14px;
  margin: 6px 12px 6px 0;
  color: #333;
}

.selection-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.selection-item {
  padding: 0 16px;
  border: 1px solid #E6E6E5;
  border-radius: 4px;
  background-color: #ffffff;
  color: #3B3E3B;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  user-select: none;
  height: 32px;
  line-height: 32px;
}

.selection-item:hover:not(.disabled) {
  border-color: #c0c4cc;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.selection-item.selected {
  background-color: #009100;
  border: 1px solid #009100;
  color: #fff;
  border-radius: 4px;
}

.selection-item.disabled {
  background-color: #f5f5f5;
  border-color: #e6e6e5;
  color: #c0c4cc;
  cursor: not-allowed;
}

/* 表格容器 */
.table-container {
  margin-top: 20px;
  max-height: 300px;
  overflow-y: auto;
}

/* 停用按钮样式 */
.deactivate-btn {
  color: #f56c6c !important;
}

.deactivate-btn:hover {
  color: #f78989 !important;
}

/* 启用按钮样式 */
.activate-btn {
  color: #67c23a !important;
}

.activate-btn:hover {
  color: #85ce61 !important;
}

/* 弹窗底部按钮 */
.dialog-footer {
  text-align: right;
}

.action-button {
  margin: 0 5px;
  cursor: pointer;

  &.btn-edit {
    color: #4C4CD6;
  }

  &.btn-delete {
    color: #B91919;
  }
}

.btn-move {
  color: #B91919 !important;
}

.action-button {
  margin: 0 5px;
  cursor: pointer;

  &.btn-edit {
    color: #4C4CD6;
  }

  &.active {
    text-decoration: underline;
  }

  &.disabled {
    cursor: not-allowed;
    color: var(--disabled-color);
  }
}
</style>
