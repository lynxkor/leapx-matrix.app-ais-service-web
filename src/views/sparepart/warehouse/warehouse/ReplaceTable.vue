<template>
    <section class="common-section">
      <div
        v-if="canAddOrUpdate"
        class="common-section-header"
      >
      <div class="ais-select-group">
        <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="85px"
          class="form-edit">
          <el-form-item label="库位名称：" prop="locationName">
            <el-input placeholder="请输入" v-model="form.locationName" clearable />
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input placeholder="请输入" type="textarea" v-model="form.remark" clearable />
          </el-form-item>
        </el-form>
      </div>
      </div>
      <div class="common-section-body">
        <div class="common-section-table">
          <edit-table
            ref="editTable"
            :columns="columns"
            :data="tableData"
            :show-toolbar="false"
            :options="options"
            :isFocusNewRow="false"
            :enableSingleRowSave="true"
            :showPagination="true"
            :current="current"
            :pageSize="pageSize"
            :total="total"
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
import { locationOrUpdate } from '@/api/sparepart/warehouse/warehouse/index';
import EditTable from '@/libs/components/EditTable';
import permissions from '@/libs/mixins/permissions';

export default {
  props: {
    replaceData: {
      type: Object,
      default: () => {},
    },
    moduleKey: {
      type: String,
    },
    id: {
      type: [String, Number],
      default: null,
    }
  },
  components: {
    EditTable,
  },
  mixins: [permissions],
  data () {
    return {
      form: {},
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      options: {
      },
      columns: [
        {
          field: 'prevPartCode',
          title: '库存单号',
          width: '25%',
        },
        {
          field: 'replacePartCode',
          title: '零件编码',
          width: '25%',
        },
        {
          field: 'replacePartName',
          title: '零件名称',
          width: '25%',
        },
        {
          field: 'replacePartQuantity',
          title: '库位名称',
          width: '25%',
        },
      ],
      rules: {
        locationName: [
          { required: true, message: '请填写库位名称', trigger: 'blur' }
        ]
      }
    };
  },
  watch: {
    replaceData: {
      handler (newVal) {
        this.form = newVal;
        // this.getDetailPageApi();
      },
      immediate: true, // 立即执行一次
      deep: true, // 深度监听
    }
  },
  mounted () {
    // this.getDetailPageApi();
  },
  beforeDestroy () {
  },
  methods: {
    getId () {
      return this.id || this.$route.query.id;
    },
    // 表格数据
    // getDetailPageApi () {
    //   const id = this.getId();
    //   if (!id) {
    //     return;
    //   }
    //   freeMaintenancePartReplaceDetailPage({
    //     freeMaintenancePolicyId: id,
    //     partDetailId: this.replacePart.id, // 免保零件明细ID
    //     pageSize: this.pageSize,
    //     pageNum: this.current,
    //   }).then((res) => {
    //     this.tableData = res.records.map(item => {
    //       return {
    //         ...item,
    //         prevPartCode: this.replacePart.partCode,
    //       };
    //     });
    //     this.total = res.total;
    //   });
    // },
    // 保存库位名称和备注
    saveRowEdit () {
      const params = {
        id: this.form.id,
        warehouseId: this.form.warehouseId,
        locationName: this.form.locationName,
        remark: this.form.remark
      };
      locationOrUpdate(params).then(() => {
        this.$message.success('编辑成功');
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
  },
};

</script>
<style lang="scss" scoped>
</style>
