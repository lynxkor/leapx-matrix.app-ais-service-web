<template>
  <section class="common-section">
    <div class="common-section-header">
      <h2>子表标题</h2>
    </div>
    <div class="common-section-body">
      <div class="common-section-header">
        <fetch-box v-if="canAddOrUpdate">
          <fetch-select
            filterable
            clearable
            remote
            reserve-keyword
            :remote-method="queryListData"
            @change="handleAddTableData"
            value-key="id"
            label-key="name"
            subLabelKey="code"
            placeholder="请输入"
          />
        </fetch-box>
      </div>
      <div class="common-section-table">
        <vxe-table ref="tableRef" stripe :data="tableData" show-overflow resizable border="inner" size="medium"
          min-height="0" max-height="400px">
          {{#each detailTable}}
          <vxe-column field="{{key}}" title="{{description}}" width="{{calc-width @root.detailTable}}" />
          {{/each}}
          <vxe-column title="操作" width="100">
            <template #default="{ row }">
              <el-popconfirm title="确定要删除吗？" @confirm="handleRemoveRow(row)">
                <span slot="reference" type="text" size="small" class="btn-delete" fixed="right">删除</span>
              </el-popconfirm>
            </template>
          </vxe-column>
          <template #empty>
            <div class="m-vxe-table-empty-text">{{ emptyText }}</div>
          </template>
        </vxe-table>
      </div>
    </div>
  </section>
</template>

<script>
import {
  addDetail,
  removeDetail,
  getDetailList,
  detailSearchApi,
} from '@/api/{{modulePath}}/index';
import FetchSelect from '@/libs/components/FetchSelect';
import FetchBox from '@/libs/components/FetchBox';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';

export default {
  props: {
    _id: {
      type: [String, Number],
      default: null
    },
    canAddOrUpdate: {
      type: Boolean,
    }
  },
  components: {
    FetchSelect,
    FetchBox,
  },
  computed: {
  },
  data () {
    return {
      yes_no_enum: YES_NO_ENUM,
      emptyText: '若要启用此内容，请创建记录',
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      rules: {},
    };
  },
  watch: {
    _id: {
      handler () {
        this.getTableData();
      },
      immediate: true
    }
  },
  mounted () {
    this.getTableData();
  },
  methods: {
    getTableData () {
      if (!this._id) {
        return;
      }
      getDetailList({
        // TODO 根据需求进行替换
        // xxxId: this._id,
        //
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records;
        this.total = res.total;
        this.$emit('data-change', this.tableData);
      });
    },
    handleRemoveRow (row) {
      if (!row.id) {
        return;
      }
      this.removeRows([row.id]);
    },
    removeRows (ids) {
      removeDetail({
        id: this._id,
        detailIdList: ids,
      }).then((d) => {
        this.$message.success('删除成功');
        this.getTableData();
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '删除失败!'
        });
      });
    },
    queryListData (query) {
      return detailSearchApi({ limitSize: 20, query: query });
    },
    // 新增子表数据
    handleAddTableData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      // 检查是否已存在
      const exists = this.tableData.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      // 根据需求调用接口
      this.tableData.push(record);
      addDetail({
        //
      }).then(res => {
        this.$message.success('添加成功');
        this.detailRequest();
      });
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
  }
};
</script>
