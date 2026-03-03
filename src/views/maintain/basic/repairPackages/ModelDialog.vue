<template>
    <!-- 公共弹窗组件 -->
    <el-dialog
    title="维护车型"
    :visible="visible"
    width="60%"
    append-to-body
    @close="handleClose"
    >
    <!-- 车系选择区域 -->
    <div class="selection-container">
        <div class="selection-section">
        <div class="section-title">车系</div>
        <div class="selection-items">
            <div
            v-for="(series, index) in seriesList"
            :key="'series-' + index"
            :class="['selection-item', { 'selected': selectedSeriesIndex === index }]"
            @click="selectSeries(index, series)"
            >
            {{ series.seriesName }}
            </div>
        </div>
        </div>
        <!-- 年款选择区域 -->
        <div class="selection-section">
        <div class="section-title">年款</div>
        <div class="selection-items">
            <div
            v-for="(year, index) in yearList"
            :key="'year-' + index"
            :class="['selection-item', { 'selected': selectedYearIndex === index }]"
            @click="selectYear(index, year)"
            >
            {{ year.name }}
            </div>
        </div>
        </div>
        <!-- 车型 -->
        <div class="selection-section">
        <div class="section-title">车型</div>
        <div class="selection-items">
            <div
            v-for="(model, index) in applicableModelList"
            :key="'model-' + index"
            :class="['selection-item', { 'selected': selectedModelIndex === index }]"
            @click="selectModel(index, model)"
            >
            {{ model.modelName }}
            </div>
        </div>
        </div>
    </div>

    <!-- 分隔线 -->
    <el-divider></el-divider>

    <!-- 表格区域 -->
    <div class="table-container">
        <el-table
        :data="tableData"
        style="width: 100%"
        stripe
        size="medium"
        >
        <el-table-column
            prop="index"
            label="序号"
            width="80"
            align="center"
        >
            <template slot-scope="scope">
            {{ scope.$index + 1 }}
            </template>
        </el-table-column>

        <el-table-column
            prop="series"
            label="车系"
            width="150"
            align="center"
        >
            <template slot-scope="scope">
            {{ scope.row.vehicleSeriesName }}
            </template>
        </el-table-column>

        <el-table-column
            prop="applicableModel"
            label="适用车型"
            align="center"
        >
            <template slot-scope="scope">
            {{ scope.row.vehicleModelName }}
            </template>
        </el-table-column>

        <el-table-column
            prop="year"
            label="年款"
            width="150"
            align="center"
        >
            <template slot-scope="scope">
            <el-select
                v-model="scope.row.vehicleYearTypeId"
                placeholder="请选择"
                size="small"
                @change="handleYearChange($event, scope.$index)"
            >
                <el-option
                v-for="(year, index) in yearList"
                :key="index"
                :label="year.name"
                :value="year.id"
                ></el-option>
            </el-select>
            <!-- <span v-else>{{ scope.row.year }}</span> -->
            </template>
        </el-table-column>

        <el-table-column
            label="操作"
            width="120"
            align="center"
            fixed="right"
        >
            <template slot-scope="scope">
            <el-button
                type="text"
                size="small"
                style="color: #B91919 !important;"
                @click="toggleStatus(scope.row, scope.$index)"
            >
                停用
            </el-button>
            </template>
        </el-table-column>
        </el-table>
    </div>

    <!-- 弹窗底部按钮 -->
    <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleClose">取 消</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
    </div>
    </el-dialog>
  </template>

<script>
import { listVehicleSeries, listVehicleYearTypeFull, listVehicleYearType } from '@/api/common';
import { saveModelBatch } from '@/api/maintain/basic/repairPackages/index';

export default {
  name: 'SeriesYearDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    },
    // 可以接收外部传入的初始数据
    initialData: {
      type: Array,
      default: () => []
    }
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
      tableData: []
    };
  },
  watch: {
    // 监听父组件传入的数据变化
    data: {
      handler (newVal) {
        this.tableData = newVal ? [...newVal] : [];
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
    async getVehicleList () {
      const res = await listVehicleSeries({ status: 1 });
      this.seriesList = res || [];
      // 初始化时默认选择第一个车系
      if (this.seriesList.length > 0) {
        this.getModelList(this.seriesList[0].id);
      }
    },
    // 年款接口
    async getYearList () {
      const res = await listVehicleYearType({ status: 1 });
      // 在数组开头添加"无年款"选项
      this.yearList = [
        { id: 0, name: '无年款' },
        ...(res || [])
      ];
    },
    // 选择车系 车系id查询 车型
    async getModelList (seriesId) {
      const res = await listVehicleYearTypeFull({ seriesId: seriesId, status: 1 });
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
      // 更新当前行的车型选择
      const list = modelArray.map(item => {
        return {
          ...item,
          value: item.id,
          label: item.modelName,
          vehicleModelId: item.id,
          vehicleModelName: item.modelName,
          vehicleSeriesId: item.seriesId,
          vehicleSeriesName: item.seriesName,
          vehicleModelDesc: item.remark,
          vehicleYearTypeId: this.yearDetail.vehicleYearTypeId,
          vehicleYearType: this.yearDetail.vehicleYearTypeName,
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

    // 选择年款
    selectYear (index, year) {
      this.selectedYearIndex = index;
      this.yearDetail = {
        vehicleYearTypeId: year?.id,
        vehicleYearTypeName: year?.name,
      };
    },

    // 年款下拉选择变更
    handleYearChange (ele, row) {
      // ele当前选择的id  row当前行索引  更新当前行的年款名称 id已有
      this.tableData[row].vehicleYearType = this.yearList.find(item => item.id === ele).name;
    },

    // 删除
    toggleStatus (row, index) {
      this.tableData.splice(index, 1);
    },

    // 处理确定按钮
    async handleConfirm () {
      await saveModelBatch(this.tableData);
      // 将数据传递给父组件
      this.$emit('success');
      // 车系 年款  车型 全部初始化 表格数据清空
      this.selectSeries(0);
      this.selectYear(0);
      this.getVehicleList();
      this.tableData = [];
    },

    // 处理取消按钮
    handleClose () {
      this.$emit('close');
    },
  }
};
</script>

  <style scoped>
  /* 选择区域样式 */
  .selection-section {
    display: flex;;
    align-items: center;
    margin-bottom: 20px;
  }

  .section-title {
    white-space: nowrap;
    font-size: 14px;
    margin-right: 12px;
    color: #333;
  }

  .selection-items {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .selection-item {
    padding: 5px 16px;
    border: 1px solid #E6E6E5;
    border-radius: 4px;
    background-color: #ffffff;
    color: #3B3E3B;;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 14px;
    user-select: none;
  }

  .selection-item:hover {
    color: var(--themColor);
    background-color: #fff;
    border-color: var(--themColor);
  }

  .selection-item.selected {
    background-color: #009100;
    border: 1px solid #009100;
    color: #fff;
    border-radius: 4px;
  }

  /* 表格容器 */
  .table-container {
    margin-top: 20px;
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
  </style>
