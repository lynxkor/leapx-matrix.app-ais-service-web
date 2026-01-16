<template>
  <section class="common-section">
    <div class="common-section-header">
      <h2>
        <span>旧件明细</span>
        <div v-if="_id" class="btns">
          <el-button plain type="primary" v-if="canAddOrUpdate" size="small" @click.stop="openAdd"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
          <el-button v-if="canAddOrUpdate" size="small" @click.stop="handleRemoveRow">删除</el-button>
        </div>
      </h2>
    </div>
    <div v-if="_id" class="common-section-body">
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
        />
      </div>
    </div>
    <div class="common-section-body not-commit" v-else>
      提交新建后，即可添加
    </div>
    <old-part-dialog
      :visible.sync="visible"
      :_id="_id"
      :dealerCode="dealerCode"
      />
  </section>
</template>
<script>
import {
  getList, // 旧件库存详情分页查询
} from '@/api/claimreturn/oldpart/inventory/oem/index';
import {
  addDetail,
  removeDetail,
} from '@/api/claimreturn/oldpart/returnorder/index';
import EditTable from '@/libs/components/EditTable/index.vue';
import OldPartDialog from './OldPartDialog';

export default {
  props: {
    canAddOrUpdate: {
      type: Boolean,
    },
    _id: {
      type: String,
    },
    dealerCode: {
      type: String,
    },
  },
  components: {
    EditTable,
    OldPartDialog,
  },
  data () {
    return {
      defaultNewRow: {
        oldPartUniqueCode: '', // 旧件唯一码
        dealerName: '', // 厅店名称
        dealerStatus: '', // 门店库存状态
        isMainPart: '', // 是否主因零部件
        vin: '', // VIN
        oldPartSupplierName: '', // 零件供应商
        mainPartSupplierName: '', // 主因件供应商
        oldPartCode: '', // 旧件编码
        oldPartName: '', // 旧件名称
        partCode: '', // 零件编码
        partName: '', // 零件名称
        returnOrderNo: '', // 关联快返回运单号（和旧件库存中规则一致）
        checkRemark: '', // 验收备注
        warrantyNo: '', // 保修申请单（对应保修申请单编码）
        oemOutboundOrderNo: '' // 主机厂出库单号
      },
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      //
      visible: false,
      // 表格内的下拉列表
      options: {
        partCode: [],
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'partCode',
          title: '零件编码',
          width: '33%',
          editable: true,
          editRender: {
            name: 'ElSelect',
            multiRow: true,
            props: {
              filterable: true,
              clearable: true,
              remote: true,
              remoteMethod: this.sparePartListApi,
              placeholder: '请选择',
              'suffix-icon': 'el-icon-search',
            },
          },
          rules: [
            { required: true, message: '零件编码不能为空', trigger: 'blur' },
          ],
        },
        {
          field: 'partName',
          title: '零件名称',
          width: '33%',
        },
        {
          field: 'remark',
          title: '备注',
          width: '33%',
          editable: true,
          editRender: { name: 'ElInput' },
        },
      ],
    };
  },
  mounted () {
    this.getDetailPageApi();
  },
  beforeDestroy () {
  },
  methods: {
    // 表格数据
    getDetailPageApi () {
      if (!this._id) {
        return;
      }
      // returnOrderIdNe
      getList({
        returnOrderId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records;
        this.total = res.total;
        this.$emit('getTableData', this.tableData);
      });
    },
    openAdd () {
      if (!this.dealerCode) {
        this.$message.info('');
        return;
      }
      this.visible = true;
    },
    handleRemoveRow (row, index, defer) {
      if (!row.id) {
        return;
      }
      removeDetail({
        id: this._id,
        detailIdList: [row.id],
      }).then((d) => {
        defer.resolve();
        this.$message.success('删除成功');
      }).catch(() => {
        defer.reject();
      });
    },
    // 行保存
    saveRowEdit (row, defer) {
      const parmas = {
        id: this._id,
        detailIdList: [],
      };
      addDetail(parmas).then(id => {
        defer.resolve(id);
        this.$message.success('更新成功');
      }).catch(e => {
        defer.reject();
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
  },
};

</script>
<style lang="scss" scoped></style>
