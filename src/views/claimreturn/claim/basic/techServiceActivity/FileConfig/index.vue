<template>
  <section class="common-section">
    <div class="common-section-header common-section-tip">
      <h2>自动审批附件清单</h2>
    </div>
    <div class="common-section-body" v-if="id && schemeId">
      <section class="common-section">
        <div
          v-if="canAddOrUpdate && id"
          class="common-section-header"
        >
          <fetch-box>
            <fetch-select
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
            <el-button
              type="primary"
              size="small"
              @click="handleAddPart"
              >
              添加
            </el-button>
          </fetch-box>
        </div>
        <Table
          :moduleKey="moduleKey"
          ref="table"
          :id="id"
          :schemeId="schemeId"
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
import { getList as repairList } from '@/api/maintain/basic/repairItem';
import { getList as repairTypeList } from '@/api/maintain/basic/repairItemType';
import permissions from '@/libs/mixins/permissions';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import { getEnum, sparePartList } from '@/api/common';
import Table from './Table.vue';
import FetchBox from '@/libs/components/FetchBox';
import { debounce } from 'lodash';

const defaultForm = {
  id: '',
  schemeId: '',
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
    schemeId: {
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
    FetchSelect,
    Table,
    FetchBox,
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
        schemeId: this.schemeId,
        pageNum: 1,
        pageSize: 999,
      };
    }
  },
  watch: {
    schemeId: {
      handler () {
        this.resetForm();
      }
    },
  },
  methods: {
    onChange (val, option) {
      this.searchOption = option;
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
    // 工时下拉接口
    repairRemote (query) {
      return repairList({
        codeLike: query,
        nameLike: query,
        pageSize: 20,
        pageNum: 1,
      }).then(res => {
        // this.form
        return res;
      });
    },
    //
    repairChange (val, record) {
    },
    // 10.5天 + 2.5天
    // 10 + 9 + 11 + 9 + 11 + 8 + 4 + 10 + 10 + 11 + 9
    // 102h
    // 维修类型下拉
    repairItemRemote (query) {
      return repairTypeList({
        codeLike: query,
        nameLike: query,
        pageSize: 20,
        pageNum: 1,
        categorys: [10], // 维修记录
      }).then(res => {
        // this.form
        return res;
      });
    },
    // ------------
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
      if (!this.search) {
        this.$message.error('请选择');
        return null;
      }
      const search = this.search;
      this.search = '';

      const newItem = {
        fileType: search,
        quantity: 1,
      };
      this.$refs.table.handleAdd(newItem);
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
