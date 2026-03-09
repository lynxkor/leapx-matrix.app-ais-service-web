<template>
  <section class="common-section">
    <div class="common-section-header common-section-tip">
      <h2>车辆信息</h2>
    </div>
    <div class="common-section-body" v-if="id">
      <section class="common-section">
        <el-input placeholder="输入VIN" :style="{width: '305px', marginRight: '8px'}" v-model="vin" @keyup.enter="onEnter" :clearable="true" />
        <el-button size="small" @click="vehicle">导入车辆</el-button>
      </section>
      <section class="common-section"  v-if="canAddOrUpdate">
        <div class="common-section-body">
          <vehicle-table
            :moduleKey="moduleKey"
            ref="vehicleTable"
            :id="id"
            />
        </div>
      </section>
    </div>
  </section>
</template>
<script>
import {
  techServiceActivitySchemeCopy,
  techServiceActivitySchemeDelete,
  techServiceActivitySchemeGet,
  techServiceActivitySchemeList,
  techServiceActivitySchemeUpdate
} from '@/api/claimreturn/claim/basic/serviceActivity';
import { getList as partList } from '@/api/sparepart/basic/sparePart';
import { getList as sparePartList } from '@/api/sparepart/basic/sparePartSupplier';
import permissions from '@/libs/mixins/permissions';
import { getEnum } from '@/api/common';
import { getList as getVrtList } from '@/api/claimreturn/claim/basic/vrt';
import { getList as getVfgList } from '@/api/claimreturn/claim/basic/vfg';
import VehicleTable from './VehicleTable.vue';

export default {
  props: {
    id: {
      type: String,
    },
    isEditing: {
      type: Boolean,
      default: true,
    },
    moduleKey: {
      type: String,
      required: true,
    }
  },
  mixins: [permissions],
  components: {
    VehicleTable,
  },
  data () {
    return {
      vin: '',
      //
      form: {
        id: '',
        activityId: '',
        schemeName: '',
        allowModifyOldPart: false, // true, '1'
        status: false, // true, 1
        mainPartId: '',
        mainPartName: '',
        mainSupplierId: '',
        mainSupplierName: '',
        vrtId: '',
        vrtName: '',
        vfgId: '',
        vfgName: '',
        responsibleDept: '',
        description: '',
      },
      rules: {
        checkoutTypeId: [
          { required: true, message: '请选择结算类型ID', trigger: 'change' }
        ],
        mainPartName: [
          { required: true, message: '请选择主因零部件', trigger: 'blur' }
        ]
      },
      supplierOptions: [],
      menus: [
        {
          label: '复制',
          value: 'copy',
        },
        {
          label: '删除',
          value: 'delete',
        },
      ]
    };
  },
  computed: {
    loadParams () {
      return {
        activityId: this.id,
      };
    }
  },
  watch: {
  },
  methods: {
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 方案
    onTabAdd (item, defer) {
      return this.updatePlan({
        schemeName: item.label,
        activityId: this.id,
      }).then(res => {
        defer.resolve(res);
      });
    },
    // 更新方案
    updatePlan (data) {
      return techServiceActivitySchemeUpdate({
        ...data,
        allowModifyOldPart: data.allowModifyOldPart ? '1' : '0',
        status: data.status ? 1 : 0,
        activityId: this.id,
      });
    },
    loadData (params) {
      return techServiceActivitySchemeList(params);
    },
    getDetail (id) {
      techServiceActivitySchemeGet(id).then(data => {
        Object.keys(this.form).forEach(key => {
          if (key === 'allowModifyOldPart') {
            if (data[key] === '1') {
              this.form[key] = true;
            } else {
              this.form[key] = false;
            }
            return;
          }
          if (key === 'status') {
            if (data[key] === 1) {
              this.form[key] = true;
            } else {
              this.form[key] = false;
            }
            return;
          }
          this.form[key] = data[key];
        });
        this.$emit('change', data.id);
      });
    },
    onRemove (item, index, defer) {
      techServiceActivitySchemeDelete([item.value]).then(() => {
        this.$message.success('操作成功');
      });
    },
    // 主因零部件下拉接口
    partRemote (query) {
      return partList({
        partCodeOrNameLike: query,
        pageSize: 20,
        pageNum: 1,
      }).then(res => {
        // this.form
        return res;
      });
    },
    // 主因供应商列表
    partChange (val, record) {
      // 零部件id
      if (val) {
        sparePartList({
          sparePartId: val,
          pageNum: 1,
          pageSize: 100,
        }).then(res => {
          this.supplierOptions = res.records.map(item => {
            return {
              label: item.supplierName,
              value: item.supplierInfoId
            };
          });
          // 选中第一个
          if (this.supplierOptions.length) {
            const item = this.supplierOptions[0];
            this.form.mainSupplierId = item.value;
            this.form.mainSupplierName = item.label;
          } else {
            this.form.mainSupplierId = '';
            this.form.mainSupplierName = '';
          }
          // 更新
          this.updatePlan(this.form);
        });
      }
      //
    },
    // vrt
    vrtRemote (query) {
      return getVrtList({
        vrtNameLike: query,
        vrtCodeLike: query,
        pageSize: 20,
        pageNum: 1,
      });
    },
    vrtChange (val, record) {
      if (val) {
        this.form.vrtName = record.vrtName;
      } else {
        this.form.vrtName = '';
      }
      this.updatePlan(this.form);
    },
    // vfg
    vfgRemote (query) {
      return getVfgList({
        vfgNameLike: query,
        vfgCodeLike: query,
        pageSize: 20,
        pageNum: 1,
      });
    },
    vfgChange (val, record) {
      if (val) {
        this.form.vfgName = record.vfgName;
      } else {
        this.form.vfgName = '';
      }
      this.updatePlan(this.form);
    },
    command (command, item, index) {
      console.log(command, item, index);
      switch (command) {
        case 'copy':
          techServiceActivitySchemeCopy({
            id: item.id,
            activityId: this.id,
          }).then(() => {
            this.$refs.tabs.refresh();
          });
          break;
        case 'delete':
          this.$refs.tabs.onTabClose(item, index);
          break;
      }
    },
    onEnter () {
      // this.vin;
    },
    vehicle () {

    }
  }
};

</script>
<style lang="scss" scoped>
.common-section-header{
  font-size: 14px;
  font-weight: 500;
}
</style>
