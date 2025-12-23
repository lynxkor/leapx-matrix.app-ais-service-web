<template>
  <section class="common-section">
    <div
      v-if="canAddOrUpdate"
      class="common-section-header"
    >
      <fetch-box>
        <fetch-select
          filterable
          clearable
          remote
          reserve-keyword
          v-model="part"
          :remote-method="partRemote"
          @change="handlePartChange"
          value-key="id"
          label-key="partName"
          placeholder="请输入零件编码/名称"
        />
        <el-button
          type="primary"
          size="small"
          @click="handleAddPart"
          >
          添加
        </el-button>
      </fetch-box>
    </div>
    <div class="common-section-body">
      <div class="common-section-table">
        <edit-table
          ref="editTable"
          :columns="columns"
          :data="tableData"
          :defaultNewRow="defaultNewRow"
          :show-toolbar="false"
          :options="options"
          :auth="{ edit: canAddOrUpdate, delete: canAddOrUpdate }"
          :isFocusNewRow="false"
          :enableSingleRowSave="true"
          :showPagination="true"
          :current="current"
          :pageSize="pageSize"
          :total="total"
          @save-row-edit="saveRowEdit"
          @remove-row="handleRemoveRow"
          @page-size-change="pageSizeChange"
          @current-page-change="currentPageChange"
        >
        </edit-table>
      </div>
    </div>
  </section>
</template>
<script>
import { uIntRule } from '@/validation/rule';
import {
  freeMaintenancePartReplaceDetailDelete,
  freeMaintenancePartReplaceDetailPage,
  freeMaintenancePartReplaceDetailUpdate, // 免保零件明细删除
} from '../../../../../api/claimreturn/claim/basic/freeMaintenancePolicy';
import EditTable from '@/libs/components/EditTable';
import permissions from '@/libs/mixins/permissions';
import FetchSelect from '@/libs/components/FetchSelect';
import FetchBox from '@/libs/components/FetchBox';
import { sparePartList } from '../../../../../api/common';
import { debounce } from 'lodash';

export default {
  props: {
    replacePart: {
      type: Object,
    },
    moduleKey: {
      type: String,
    }
  },
  components: {
    EditTable,
    FetchSelect,
    FetchBox,
  },
  mixins: [permissions],
  data () {
    return {
      defaultNewRow: {
        prevPartCode: '',
        replacePartId: '',
        replacePartCode: '',
        replacePartName: '',
        purchasePrice: '', // 采购单价
        replacePartQuantity: '',
      },
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      options: {
      },
      columns: [
        {
          field: 'prevPartCode',
          title: '替换前零件',
          width: '20%',
        },
        {
          field: 'replacePartCode',
          title: '替换后零件',
          width: '20%',
        },
        {
          field: 'replacePartName',
          title: '零件名称',
          width: '20%',
        },
        {
          field: 'replacePartQuantity',
          title: '数量',
          width: '20%',
          editable: true,
          editRender: { name: 'ElInput' },
          rules: [
            { required: true, message: '请输入数量', trigger: 'blur' },
            uIntRule,
          ],
        },
        {
          field: 'purchasePrice',
          title: '采购单价',
          width: '20%',
        },
      ],
      //
      part: '',
      curPart: null,
    };
  },
  watch: {
    replacePart: {
      handler () {
        this.getDetailPageApi();
      }
    }
  },
  mounted () {
    this.getDetailPageApi();
  },
  beforeDestroy () {
  },
  methods: {
    getId () {
      return this.id || this.$route.query.id;
    },
    // 表格数据
    getDetailPageApi () {
      const id = this.getId();
      if (!id) {
        return;
      }
      freeMaintenancePartReplaceDetailPage({
        freeMaintenancePolicyId: id,
        partDetailId: this.replacePart.id, // 免保零件明细ID
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records.map(item => {
          return {
            ...item,
            prevPartCode: this.replacePart.partCode,
          };
        });
        this.total = res.total;
      });
    },
    handleRemoveRow (row, index, defer) {
      if (!row.id) {
        return;
      }
      freeMaintenancePartReplaceDetailDelete([row.id]).then((d) => {
        defer.resolve();
        this.$message.success('删除成功');
      }).catch(() => {
        defer.reject();
      });
    },
    // 行保存
    saveRowEdit (row, defer) {
      console.log(row);
      const parmas = {
        id: row.id,
        partDetailId: this.replacePart.id, // 零件数据id
        replacePartId: row.replacePartId, // 替换零件ID
        replacePartQuantity: row.replacePartQuantity, // 替换零件数量（正整数）
      };
      freeMaintenancePartReplaceDetailUpdate(parmas).then(id => {
        defer.resolve(id);
        this.$message.success('更新成功');
      }).catch(e => {
        defer.reject();
      });
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getDetailPageApi(this.getId());
    },
    currentPageChange (current) {
      this.current = current;
      this.getDetailPageApi(this.getId());
    },
    // ----------
    // 零件
    partRemote (query) {
      // 是否OEM, 是否启用
      return sparePartList({ partCodeOrNameLike: query, oemPart: 1, status: 1 });
    },
    handlePartChange (val, record) {
      this.curPart = record;
    },
    // 详情表格相关数据
    handleAddPart: debounce(function () {
      if (!this.part) {
        this.$message.error('请选择零件');
        return null;
      }
      const partId = this.part;
      const cur = this.curPart;
      this.part = '';

      const newItem = {
        prevPartCode: this.replacePart.partCode,
        replacePartId: partId,
        replacePartCode: cur.partCode,
        replacePartName: cur.partName,
        purchasePrice: cur.purchasePrice, // 采购单价
        replacePartQuantity: '',
      };
      this.$refs.editTable.addRow(newItem);
    }, 200),
  },
};

</script>
<style lang="scss" scoped>

</style>
