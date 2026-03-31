<template>
  <simple-table-dialog
    :visible.sync="dialogVisible"
    :title="'VIN：' + vin" >
    <vxe-table
      ref="table"
      :data="tableData"
      stripe
      resizable
      border="inner"
      size="medium"
      height="auto"
      v-loading="loading"
    >
      <vxe-column title="序号" width="60" align="center">
        <template #default="{ $rowIndex }">
          {{ $rowIndex + 1 }}
        </template>
      </vxe-column>
      <vxe-column field="rightsCode" title="权益编码" />
      <vxe-column field="rightsName" title="权益名称" />
      <vxe-column field="rightsRuleDesc" title="权益规则说明" />
    </vxe-table>
  </simple-table-dialog>
</template>

<script>
import { queryRights } from '@/api/claimreturn/claim/warrantyapply';
import SimpleTableDialog from '@/libs/components/dialogs/SimpleTableDialog.vue';

export default {
  name: 'RightsDialog',
  components: {
    SimpleTableDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    vehicleProfileId: {
      type: String,
      default: ''
    },
    vin: {
      type: String,
    },
  },
  data () {
    return {
      loading: false,
      //
      dialogVisible: this.visible,
      // 表格数据
      tableData: [],
      total: 0,
    };
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.getData();
      }
    }
  },
  methods: {
    getData () {
      this.loading = true;
      let data = {
        vin: this.vin,
        vehicleProfileId: this.vehicleProfileId,
      };
      queryRights(data)
        .then(res => {
          this.tableData = res;
        }).finally(() => {
          this.loading = false;
        });
    },
  }
};
</script>
