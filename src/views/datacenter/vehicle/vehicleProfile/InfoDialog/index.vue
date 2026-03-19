<template>
  <el-dialog
    title="调整保养信息"
    :visible.sync="dialogVisible"
    width="900px"
    :close-on-click-modal="false"
    @close="onClose"
  >
    <next-table
      :id="vehicleProfileId"
      :isEdit="true"
      @update="$emit('update')"
    />
  </el-dialog>
</template>

<script>
import NextTable from '../NextTable.vue';

export default {
  name: 'InfoDialog',
  components: {
    NextTable,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    vehicleProfileId: {
      type: [String, Number],
      default: null,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
    };
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible;
      },
      set (val) {
        this.$emit('update:visible', val);
      },
    },
  },
  watch: {
  },
  methods: {
    onClose () {
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.info-form {
  .el-form-item {
    margin-bottom: 20px;
  }
}
.page-common-edit .el-form-item, .page-common-detail .el-form-item{
  width: 50%;
}
</style>
