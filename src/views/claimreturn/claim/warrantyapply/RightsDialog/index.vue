<template>
  <simple-table-dialog
    :visible.sync="dialogVisible"
    :title="'VIN：' + decryptedVin"
    @close="handleClose"
  >
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
      <vxe-column field="rightsCode" title="权益编码" width="120" />
      <vxe-column field="rightsName" title="权益名称" width="120" />
      <vxe-column field="rightsRuleDesc" title="权益规则说明">
        <template #default="{ row }">
          <span v-safe-html="row.rightsRuleDesc" />
        </template>
      </vxe-column>
    </vxe-table>
  </simple-table-dialog>
</template>

<script>
import { queryRights, getDetailDecryptField } from '@/api/claimreturn/claim/warrantyapply';
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
    id: {
      type: String,
    }
  },
  data () {
    return {
      loading: false,
      //
      dialogVisible: this.visible,
      // 表格数据
      tableData: [],
      total: 0,
      decryptedVin: '',
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
    handleClose () {
      this.$emit('update:visible', false);
    },
    getData () {
      this.decryptedVin = '';
      this.tableData = [];
      this.loading = true;
      if (this.id) {
        getDetailDecryptField(this.id, 'vin').then(decryptedVin => {
          this.decryptedVin = decryptedVin;
        }).catch(() => {});
      }
      queryRights({ vehicleProfileId: this.vehicleProfileId })
        .then(res => {
          this.tableData = res || [];
        })
        .catch(() => {
          this.tableData = [];
        })
        .finally(() => {
          this.loading = false;
        });
    },
  }
};
</script>
