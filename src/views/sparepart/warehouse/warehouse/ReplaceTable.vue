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
          <vxe-table
            ref="tableRef"
            stripe
            :data="tableData"
            show-overflow
            resizable
            border="inner"
            size="medium"
            min-height="0"
            max-height="400px"
          >
            <vxe-column field="code" title="库存单号" min-width="25%">
              <template #default="{ row }">
                <el-link type="success" :href="`/service/sparepart/warehouse/inventory/edit?id=${row.id}`" target="_blank">{{ row.code }}</el-link>
              </template>
            </vxe-column>
            <vxe-column field="partCode" title="备件编码" min-width="25%">
              <template #default="{ row }">
                <el-link type="success" :href="`/service/sparepart/basic/sparePart/edit?id=${row.sparePartId}`" target="_blank">{{ row.partCode }}</el-link>
              </template>
            </vxe-column>
            <vxe-column field="partName" title="备件名称" min-width="25%" />
            <vxe-column field="locationName" title="库位名称" min-width="25%" />
            <template #empty>
              <div class="m-vxe-table-empty-text">{{emptyText}}</div>
            </template>
          </vxe-table>
          <div class="table-pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="current"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </section>
  </template>
<script>
import { uIntRule } from '@/validation/rule';
import { locationOrUpdate } from '@/api/sparepart/warehouse/warehouse/index';
import { getList } from '@/api/sparepart/warehouse/inventory/index';
import permissions from '@/libs/mixins/permissions';

export default {
  props: {
    replaceData: {
      type: Object,
      default: () => {},
    },
    moduleKey: {
      type: String,
      default: '',
    },
    id: {
      type: [String, Number],
      default: null,
    }
  },
  mixins: [permissions],
  data () {
    return {
      form: {},
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
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
        this.getDetailPageApi();
      },
      immediate: true, // 立即执行一次
      deep: true, // 深度监听
    }
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
    getId () {
      return this.id || this.$route.query.id;
    },
    // 表格数据
    getDetailPageApi () {
      getList({
        locationId: this.form.id,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records || [];
        this.total = res.total;
      });
    },
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
    handleSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getDetailPageApi();
    },
    handleCurrentChange (current) {
      this.current = current;
      this.getDetailPageApi();
    },
  },
};

</script>
<style lang="scss" scoped>
</style>
