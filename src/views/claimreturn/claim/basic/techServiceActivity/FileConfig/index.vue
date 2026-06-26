<template>
  <section class="common-section">
    <div class="common-section-header common-section-tip">
      <h2>自动审批附件清单</h2>
    </div>
    <div class="common-section-body" v-if="id">
      <section class="common-section">
        <div
          v-if="canAddOrUpdate && id"
          class="common-section"
        >
          <base-search
            :request="fetchOptions"
            enumCode="claim_auto_approval_file_type"
            v-model="search"
            placeholder="选择附件类型"
            clearable
            filterable
            value-key="message"
            label-key="message"
            @change="onChange"
          />
        </div>
        <Table
          :moduleKey="moduleKey"
          ref="table"
          :id="id"
          v-if="canDetail"
          >
        </Table>
      </section>
    </div>
    <div class="common-section-body not-commit" v-else>
      提交新建后，即可添加
    </div>
  </section>
</template>
<script>
// 维修保养 -> 维修项目
import permissions from '@/libs/mixins/permissions';
import { getEnum } from '@/api/common';
import { techServiceActivityFileConfigUpdate } from '@/api/claimreturn/claim/basic/serviceActivity';
import Table from './Table.vue';
import BaseSearch from '@/libs/components/BaseSearch';
import { debounce } from 'lodash';

const defaultForm = {
  id: '',
  activityId: '',
  quantity: 0,
  unitPrice: 0,
  discountAmount: 0,
  amount: 0, // 工时金额 = 工时数 * 工时单价 - 优惠金额
  repairItemName: '',
  repairItemId: '',
  repairItemCode: '',
  allowDelete: false,
  isMainRepairItem: false,
  repairItemTypeName: '',
  repairItemTypeId: '',
};

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
    Table,
    BaseSearch,
  },
  data () {
    return {
      partId: '',
      form: { ...defaultForm },
      rules: {
        checkoutTypeId: [
          { required: true, message: '请选择结算类型ID', trigger: 'change' }
        ],
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
      ],
      // ----
      currentVehicleId: '',
      search: '',
      searchOption: null,
      // ----
    };
  },
  computed: {
    loadParams () {
      return {
        activityId: this.id,
        pageNum: 1,
        pageSize: 999,
      };
    }
  },
  watch: {
  },
  methods: {
    onChange (val, option) {
      this.searchOption = option;
      this.handleAddPart();
    },
    resetForm () {
      this.form = {
        ...defaultForm
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // ------------
    // 详情表格相关数据
    handleAddPart: debounce(function () {
      if (!this.search) {
        return null;
      }
      const list = this.$refs.table.getTableData();
      const existItem = list.find(item => item.fileType === this.search);
      if (existItem) {
        this.$message.error('附件类型重复');
        return;
      }

      const fileType = this.search;
      this.search = '';

      techServiceActivityFileConfigUpdate({
        activityId: this.id,
        fileType,
        quantity: 1,
      }).then(() => {
        this.$message.success('添加成功');
        this.$refs.table.getTablePage();
      });
    }, 200),
  }
};

</script>
<style lang="scss" scoped>
.common-section-header{
  font-size: 14px;
  font-weight: 500;
}
</style>
