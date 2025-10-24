<template>
  <div class="m-{{{nameKebabCase}}}-list">
    <div>
      <el-form
        :inline="true"
        :model="form"
        size="small"
        label-position="right"
        label-width="11rem"
      >
        <el-row>
          <el-col
            v-for="(item, index) in formListVisible"
            :key="index"
            :span="8"
          >
            <el-form-item :label="item.description + '：'">
              <el-date-picker
              v-if="item.format.includes('date')"
              v-model="form[item.key]"
              type="daterange"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              />
              <el-input
                v-else
                placeholder="请输入"
                v-model="form[item.key]"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <page-search-action
              v-model="show"
              :is-expandable="formList.length > 2"
              :loading="loading"
              @submit="onSubmit"
              @reset="onReset"
            />
          </el-col>
        </el-row>
      </el-form>
      <div class="mgb24">
        <el-button :loading="exportLoading" size="mini" @click="exportExcel">导出</el-button>
      </div>
    </div>
    <div
      class="m-table-c"
      :class="{ 'z-form-show': show }"
    >
      <LPVxeTable
        ref="tableRef"
        v-loading="loading"
        is-checkbox
        show-index
        is-page
        :option-obj="optionObj"
        :get-config="getConfig"
        :save-or-update="saveOrUpdate"
        @paginationChange="paginationChange"
        @handleSelect="handleSelectionChange"
      />
    </div>
    <edit-dialog
      :visible.sync="editDialogVisible"
      :info="editInfo"
      @submit="edit"
    />
  </div>
</template>

<script>
import debounce from 'lodash.debounce';
import { LPVxeTable } from '@leapmotor/design';
import PageSearchAction from '@/libs/components/page-search-action';
import { getList, deleteItem } from '@/api/{{{nameCamelCase}}}';
import { getTableConfig, tableAddOrUpdate, exportTable } from '@/api/common';
import EditDialog from './components/editDialog';

const defaultForm = {
  {{{#searchList}}}
  {{{#isDate}}}
  {{{key}}}: [],
  {{{/isDate}}}
  {{{#isNormal}}}
  {{{key}}}: '',
  {{{/isNormal}}}
  {{{/searchList}}}
};

const pageSize = 20;
const mockConfig = {
  data: null
};

export default {
  components: {
    PageSearchAction,
    LPVxeTable,
    EditDialog
  },
  data () {
    return {
      formList: [
        {{{#searchList}}}
        { key: '{{{key}}}', description: '{{{description}}}', type: '{{{type}}}', format: '{{{format}}}' },
        {{{/searchList}}}
      ],
      form: {
        ...defaultForm
      },
      show: false,
      loading: false,
      exportLoading: false,
      optionObj: {
        id: '{{{name}}}Table',
        dataList: [],
        form: {
          page: 1,
          size: pageSize
        },
        dataProp: [
          {{{#cols}}}
          { props: '{{{key}}}', label: '{{{description}}}', visible: {{{visible}}} },
          {{{/cols}}}
          {
            props: 'operate',
            label: '操作',
            type: 'operate',
            visible: true,
            fixed: 'right',
            buttons: [{
              name: '编辑',
              click: (rowIndex, row) => {
                this.editInfo = row;
                this.editDialogVisible = true;
              },
              type: 'primary'
            }, {
              name: '详情',
              click: (rowIndex, row) => {
                window.open(`/datacenter/{{{nameCamelCase}}}/detail?id=${row.id}`);
              }
            }, {
              name: '删除',
              click: (rowIndex, row) => {
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                      instance.confirmButtonLoading = true;
                      instance.confirmButtonText = '执行中...';
                      deleteItem([row.id]).then(() => {
                        done();
                      }).finally(() => {
                        instance.confirmButtonLoading = false;
                      });
                    } else {
                      done();
                    }
                  }
                }).then(() => {
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                  // 删除完要重新请求列表数据
                  this.getData();
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });
                });
              },
              type: 'danger'
            }]
          }
        ],
        total: 0
      },
      editDialogVisible: false,
      editInfo: null,
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
  computed: {
    formListVisible () {
      return this.formList.filter((item, index) => this.formList.length <= 2 || index < 2 || this.show);
    }
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['列表']);
    this.getData();
  },
  methods: {
    onSubmit () {
      this.getData();
    },
    onReset () {
      this.form = { ...defaultForm };
    },
    exportExcel () {
      this.exportLoading = true;
      exportTable({
        dataFetchPath: '/datacenter/{{{nameCamelCase}}}/page',
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
      console.log(selection);
    },
    edit (data) {
      const item = this.optionObj.dataList.find(item => item.id === data.id);
      Object.assign(item, data);
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
    }
  }
};
</script>

<style lang="scss" scoped>
.m-{{{nameKebabCase}}}-list {
  height: 100%;

  .m-table-c {
    height: calc(100% - 120px);

    &.z-form-show {
      height: calc(100% - 169px);
    }
  }
}
</style>
