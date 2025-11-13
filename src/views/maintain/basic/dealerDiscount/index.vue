<template>
  <div class="page-common m-dealer-discount-list">
    <div>
      <el-form
        :inline="true"
        :model="form"
        size="small"
        label-position="right"
        label-width="150px"
        class="ais-search-form"
      >
        <el-form-item label="创建时间：">
          <el-date-picker
            v-model="form.createTime"
            type="daterange"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          />
        </el-form-item>
        <el-form-item label="优惠名称：">
          <el-input
            placeholder="请输入"
            v-model="form.name"
            clearable
          />
        </el-form-item>
        <el-form-item label="门店名称：">
          <el-select
            v-model="form.dealerIds"
            multiple
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请选择"
            :remote-method="storeSearch"
            :loading="storeLoading">
            <el-option
              v-for="item in storeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <span v-show="show">
          <el-form-item label="状态：">
            <fetch-select
              :request="() => fetchOptions('StatusEnum')"
              v-model="form.status"
              placeholder="请选择"
              clearable
              multiple
            />
          </el-form-item>
        </span>
        <page-search-action
          v-model="show"
          is-expandable
          :loading="loading"
          @submit="onSubmit"
          @reset="onReset"
        />
      </el-form>
      <div class="ais-actions">
        <el-button size="small" @click="handleAdd">新增</el-button>
        <el-button size="small" @click="handleImport">导入</el-button>
        <el-button :loading="exportLoading" size="small" @click="exportExcel">导出</el-button>
        <el-button size="small" @click="handleBatchDelete" :disabled="selectionList.length === 0">批量删除</el-button>
        <el-button size="small" @click="handleBatchEnable(0)" :disabled="selectionList.length === 0">批量启用</el-button>
        <el-button size="small" @click="handleBatchEnable(1)" :disabled="selectionList.length === 0">批量停用</el-button>
      </div>
    </div>
    <div
      class="ais-table-c"
      :class="{ 'z-form-show': show }"
    >
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-checkbox
        is-page
        checkboxFixed
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
      />
    </div>
    <Upload
      :visible="uploadDialogVisible"
      templateUrl=""
      uploadUrl=""
      @close="handleUploadDialogClose"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/AisPageSearchAction';
import { getList, deleteItem, enableItem } from '@/api/maintain/basic/dealerDiscount/index';
import { getTableConfig, tableAddOrUpdate, exportTable, getEnum, listOrgStoreInfo } from '@/api/common';
import FetchSelect from '@/libs/components/FetchSelect';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';

const defaultForm = {
  // 多选时字段有变化，自行修复
  name: '',
  dealerIds: [],
  status: [],
  createTime: '',
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  components: {
    PageSearchAction,
    LPVxeTable,
    FetchSelect,
    Upload
  },
  data () {
    return {
      form: {
        ...defaultForm
      },
      storeOptions: [], // 门店名称下拉框选项
      storeLoading: false, // 门店名称下拉框loading
      searchTimer: null, // 防抖定时器
      selectionList: [],
      yes_no_enum: YES_NO_ENUM,
      show: false,
      loading: false,
      exportLoading: false,
      uploadDialogVisible: false,
      optionObj: {
        id: 'dealerDiscountTable',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {
            props: 'code',
            label: '优惠代码',
            visible: true,
            width: 200,
            fixed: 'left',
            buttons: [{
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/maintain/basic/dealerDiscount/detail',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }]
          },
          { props: 'name', label: '优惠名称', visible: true, width: 200 },
          { props: 'dealerName', label: '门店名称', visible: true, width: 200 },
          { props: 'discountWorkhourRate', label: '工时折扣率', visible: true, width: 200 },
          { props: 'discountPartRate', label: '备件折扣率', visible: true, width: 200 },
          { props: 'status', label: '状态', visible: true, width: 200 },
          { props: 'createTime', label: '创建时间', visible: true, width: 200 },
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '编辑',
              click: (rowIndex, row) => {
                this.$router.push({
                  path: '/maintain/basic/dealerDiscount/edit',
                  query: {
                    id: row.id
                  }
                });
              },
              type: 'primary'
            }, {
              name: '删除',
              popconfirmTitle: '此操作将永久删除, 是否继续?',
              click: (rowIndex, row) => {
                deleteItem([row.id]).then(() => {
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
              },
              type: 'danger'
            }]
          }
        ],
        total: 0
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['门店优惠模式管理']);
    this.getData();
  },
  methods: {
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    handleAdd () {
      this.$router.push({
        path: '/maintain/basic/dealerDiscount/edit'
      });
    },
    onSubmit () {
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.getData();
    },
    exportExcel () {
      this.exportLoading = true;
      exportTable({
        dataFetchPath: '/datacenter/maintain/basic/dealerDiscount/page',
        reqParams: this.getFormData(),
        titleMap: Object.fromEntries(this.$refs.tableRef.getVisibleCols())
      }).then(res => {
        if (res) {
          if (res.excelUrl) {
            window.location.href = res.excelUrl;
          } else {
            this.$message({
              type: 'error',
              message: '导出失败'
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

      getList({ ...this.getFormData(), pageNum: this.optionObj.form.page, pageSize: this.optionObj.form.size })
        .then(res => {
          console.log(res);
          this.optionObj.dataList = res.records.map(item => {
            return {
              ...item,
              deleteLoading: false
            };
          });
          this.optionObj.total = res.total;
        }).finally(() => {
          this.loading = false;
        });
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
    // 门店搜索
    async storeSearch (query) {
      if (query !== '' && query.length < 2) {
        this.storeOptions = [];
        return;
      }

      // 防抖处理，避免频繁请求
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }

      this.searchTimer = setTimeout(async () => {
        this.storeLoading = true;
        try {
          // 调用搜索接口，传递搜索关键词
          const res = await listOrgStoreInfo({ name: query });

          if (res && res.data) {
            this.storeOptions = res?.map(item => ({
              value: item.orgId, // 门店ID
              label: item.orgName // 门店名称
            }));
          } else {
            this.storeOptions = [];
          }
        } catch (error) {
          this.storeOptions = [];
          this.$message.error('搜索失败');
        } finally {
          this.storeLoading = false;
        }
      }, 300); // 300ms防抖延迟
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
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });

      if (this.form.nextDate) {
        delete data.nextDate;
        if (this.form.nextDate.length > 1) {
          data.nextDateStart = this.form.nextDate[0];
          data.nextDateEnd = this.form.nextDate[1];
        }
      }

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
      const ids = this.selectionList.map(item => item.id) || [];
      enableItem({
        idSet: ids,
        status
      }).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
        this.getData();
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '操作失败!'
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.m-dealer-discount-list {
}
</style>
