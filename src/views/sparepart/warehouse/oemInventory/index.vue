<template>
  <div class="page-common m-oem-inventory-list">
    <!--  TIPS: 自行调整如下label-width，满足label不换行  -->
    <el-form
      :inline="true"
      :model="form"
      size="small"
      label-position="right"
      label-width="150px"
      class="ais-search-form"
    >
      <el-form-item label="备件">
        <fetch-select
            :remote-method="getSparePart"
            remote
            v-model="form.sparePartIdList"
            placeholder="请输入编码或名称"
            labelKey="name"
            valueKey="id"
            subLabelKey="code"
            clearable
            multiple
            collapseTags
            filterable
              />
      </el-form-item>
      <template v-if="show">
      </template>
      <page-search-action
        v-if="canList"
        v-model="show"
        is-expandable
        :loading="loading"
        @submit="onSubmit"
        @reset="onReset"
      />
    </el-form>
    <div class="ais-actions">
      <!--  TIPS:根据产品增删功能按钮  -->
      <!-- <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="handleAdd"><i class="iconfont icon-lxppc-plus"></i>新增</el-button>
      <el-button v-if="canImport" size="small" @click="handleImport">导入</el-button>
      <el-button v-if="canExport" :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
      <el-button v-if="canDelete" size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量启用</el-button>
      <el-button v-if="canEnableOrDisable" size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量停用</el-button> -->
    </div>
    <div
      class="ais-table-c"
    >
      <LPVxeTable
        :key="tableKey"
        ref="tableRef"
        v-loading="loading"
        is-page
        :centralized="false"
        :showTableSetting="false"
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @sortChange="handleSortChange"
      >
        <EditPage slot="centralizedViewSlot" :id="clickItemId"/>
      </LPVxeTable>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      :id="'1'"
      @close="handleUploadDialogClose"
      @getData="getData"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/sparepart/warehouse/oemInventory/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, sparePartListShort } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';
import responsiveSearchForm from '@/libs/mixins/responsive';
import permissions from '@/libs/mixins/permissions';
import { handleBatchStatusChange, downloadExcel } from '@/libs/utils';
import commonMixins from '@/libs/mixins/commonMixins';
import EditPage from './edit.vue';

const defaultForm = {
  // TIPS:多选时字段名称会有变化，自行校对
  sparePartIdList: [],
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  mixins: [responsiveSearchForm, permissions, commonMixins],
  components: {
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    EditPage,
    Upload
  },
  data () {
    return {
      pageTitle: '主机厂备件库存查询',
      pageType: 'list',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-oemInventory',
      form: {
        ...defaultForm
      },
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      clickItemId: '',
      // 【新增】存储仓库列表，用于生成表头
      warehouseNameList: [],
      optionObj: {
        id: 'oemInventoryTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [],
        total: 0
      },
      sortColumns: [
        // {
        // column: 'create_time',
        // sort: 'DESC'
        // }
      ],
      tableKey: 0
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', [this.pageTitle]);
  },
  methods: {
    // 排序
    handleSortChange (value) {
      this.sortColumns = (value || []).map(item => {
        return {
          column: (item.field || '').replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
          sort: (item.order || '').toUpperCase()
        };
      });
      this.getData();
    },
    handleListSelect (row) {
      this.clickItemId = row.id;
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/sparepart/warehouse/oemInventory/edit'
      });
    },
    onSubmit () {
      this.optionObj.form.page = 1;
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.optionObj.form.page = 1;
      this.optionObj.form.pageSize = pageSize;
      this.getData();
    },
    async getSparePart (query) {
      try {
        const res = await sparePartListShort({ partCodeLikeOrList: query });
        // res.records = res.records?.map(item => ({
        //   ...item,
        //   displayName: item.companyName + `(${item.companyCode})`
        // }));
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    exportExcel () {
      this.exportLoading = true;
      const reqParams = this.getFormData() || {};
      if (this.selectionList.length > 0) {
        const ids = this.selectionList.map(item => item.id) || [];
        reqParams.ids = ids;
      }
      exportTable({
        businessType: '主机厂备件库存查询',
        dataFetchPath: 'sparepart/web/warehouse/oemInventory/page',
        reqParams,
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols()),
        httpMethod: 'POST'
      }).then(async res => {
        if (res && res.excelUrl) {
          try {
            await downloadExcel(res.excelUrl, '主机厂备件库存查询.xlsx');
          } catch (error) {
            this.$message({
              type: 'error',
              message: '文件导出失败'
            });
          }
        } else {
          this.$message({
            type: 'info',
            message: '请前往导出列表中查询导出结果'
          });
        }
      }).finally(() => {
        this.exportLoading = false;
      });
    },
    getData () {
      this.loading = true;
      this.selectionList = [];
      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          // 1. 提取动态表头数据 (假设在 res.data 下，根据你提供的返回值结构调整)
        // 如果 warehouseNameList 直接在 res 下，则用 res.warehouseNameList
          const whList = res.warehouseNameList || [];
          this.warehouseNameList = whList;

          // 2. 初始化/更新表头配置 (包含动态列)
          this.initDynamicColumns(whList);

          // 3. 处理表格行数据
          // 接口返回的是 partList，需要映射成表格能识别的格式
          const rawList = res.partList || [];

          this.optionObj.dataList = rawList.map((item, index) => {
          // 原始数据: { partCode: "...", partName: "...", invCountStrList: ["有库存", "无库存"] }
          // 目标数据: { partCode: "...", partName: "...", stock_0: "有库存", stock_1: "无库存", ... }

            const row = {
              ...item,
            // 保留原始数组以防万一，同时展开为独立字段供表格列读取
            // 假设 invCountStrList 的顺序严格对应 warehouseNameList 的顺序
            };

            // 将数组转换为对象属性，key 为 stock_0, stock_1... 对应下面的列 props
            if (Array.isArray(item.invCountStrList)) {
              item.invCountStrList.forEach((val, idx) => {
                row[`stock_${idx}`] = val;
              });
            }

            // 添加删除加载状态
            row.deleteLoading = false;
            return row;
          });
          // console.log(res);
          // this.optionObj.dataList = res.records.map(item => {
          //   return {
          //     ...item,
          //     deleteLoading: false
          //   };
          // });
          this.optionObj.total = res.total;
          this.tableKey += 1; // 强制销毁重建组件
        }).finally(() => {
          this.loading = false;
        });
    },
    // 动态生成表头配置
    initDynamicColumns (whList) {
      // 1. 定义固定列 (左侧)
      const fixedColumns = [
        {
          props: 'partCode',
          label: '备件代码',
          visible: true,
          width: 200,
          fixed: 'left',
        },
        {
          props: 'partName',
          label: '备件名称',
          visible: true,
          width: 200,
          fixed: 'left',
        }
      ];

      // 2. 生成动态仓库列 (中间)
      const dynamicColumns = whList.map((code, index) => {
        return {
          props: `stock_${index}`, // 对应 getData 中生成的 key
          label: code, // 表头显示仓库 Code (如 QY04)
          visible: true,
          width: 120,
        };
      });

      // 3. 定义操作列 (右侧)
      // const operateColumn = {
      //   props: 'operate',
      //   label: '操作',
      //   type: 'operate',
      //   visible: true,
      //   fixed: 'right',
      //   width: 150,
      //   buttons: [
      //     {
      //       name: '详情', // 或者编辑
      //       click: (rowIndex, row) => {
      //         // 这里可以跳转或者打开弹窗
      //         this.clickItemId = row.id || row.partCode;
      //         // 如果有编辑页面，类似之前：
      //         // this.$router.push({ path: '/...', query: { code: row.partCode } });
      //       },
      //       type: 'info'
      //     }
      //     // 如果需要删除，可以在这里加，但库存查询通常只读
      //   ]
      // };

      // 4. 合并所有列并赋值
      this.optionObj.dataProp = [
        ...fixedColumns,
        ...dynamicColumns,
        // operateColumn
      ];
    },
    // 需要防抖场景时使用
    debouncedGetData: debounce(function () {
      this.getData();
    }, 300),
    getConfig () {
      return new Promise((resolve, reject) => {
        getTableConfig(this.optionObj.id).then(data => {
          resolve({ data });
        }).catch(err => {
          // 容错：此处如果接口挂了，也不应该影响正常使用
          console.error(err);
          resolve(mockConfig);
        });
      });
    },
    saveOrUpdate (data) {
      return tableAddOrUpdate(data);
    },
    paginationChange (type, num) {
      if (type === 'page') {
        this.optionObj.form.page = num;
      } else {
        this.optionObj.form.size = num;
      }
      this.debouncedGetData();
    },
    // 多选框选中数据
    handleSelectionChange (selection) {
      this.selectionList = selection;
    },
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        if (data[key] === '' || data[key] === null || data[key].length === 0) {
          delete data[key];
        }
      });

      if (this.form.createTime) {
        delete data.createTime;
        if (this.form.createTime.length > 1) {
          data.createTimeStart = this.form.createTime[0];
          data.createTimeEnd = this.form.createTime[1];
        }
      }
      if (this.form.updateTime) {
        delete data.updateTime;
        if (this.form.updateTime.length > 1) {
          data.updateTimeStart = this.form.updateTime[0];
          data.updateTimeEnd = this.form.updateTime[1];
        }
      }
      // 排序字段
      data.sortColumns = this.sortColumns;
      return data;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 批量删除
    handleBatchDelete () {
      const ids = this.selectionList.map(item => item.id) || [];
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteItem(ids).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getData();
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        });
      }).catch(() => {});
    },
    // 批量启用停用
    handleBatchEnable (status) {
      handleBatchStatusChange.call(this, {
        selectionList: this.selectionList,
        targetStatus: status,
        apiFunc: enableItem,
        refreshFunc: this.getData
      });
      // const ids = this.selectionList.map(item => item.id) || [];
      // this.$confirm(`此操作将${status ? '启用' : '停用'}选中项，是否继续?`, '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   enableItem({
      //     idSet: ids,
      //     status
      //   }).then(() => {
      //     this.$message({
      //       type: 'success',
      //       message: '操作成功!'
      //     });
      //     this.getData();
      //   }).catch(() => {
      //     this.$message({
      //       type: 'error',
      //       message: '操作失败!'
      //     });
      //   });
      // });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-oem-inventory-list {
}
</style>
