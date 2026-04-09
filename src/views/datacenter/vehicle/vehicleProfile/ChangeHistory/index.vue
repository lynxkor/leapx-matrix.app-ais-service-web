<template>
  <div class="change-history">
    <el-form :inline="true" :model="form" class="ais-search-form">
      <el-form-item label="业务类型" label-width="80px">
        <fetch-select
          :request="fetchOptions"
          enumCode="key_info_change_business_type"
          v-model="form.businessType"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <el-form-item label="字段" label-width="70px">
        <fetch-select
          :request="fetchOptions"
          enumCode="claim_change_field_type"
          v-model="form.fieldName"
          placeholder="请选择"
          clearable
          filterable
        />
      </el-form-item>
      <AisPageSearchAction @submit="onSubmit" @reset="onReset" :isExpandable="false" />
    </el-form>
    <el-timeline class="change-history-timeline">
      <el-timeline-item
        v-for="(item, index) in tableData"
        :key="index"
        color="#6C6E6C"
        >
        <!-- 状态：EFFECTIVE-已生效，PENDING-审批中 -->
        <div class="status" :class="{blue: item.changeStatus === 'PENDING'}">
          {{item.changeStatusLabel}}
        </div>
        <div class="item">
          <div class="line-1">{{ item.operateTime}} {{ item.businessTypeLabel }}</div>
          <div class="line-2">
            <div class="line-item" v-if="types.includes(item.businessType)">
              <span class="grey" v-if="item.businessType === 'RETURN_VEHICLE'">OA流程：</span>
              <span class="grey" v-else>业务单据：</span>
              <span>{{item.businessCode}}</span>
            </div>
            <div class="line-item">
              <span class="grey">操作人：</span>
              <span>{{item.operatorName}}</span>
            </div>
          </div>
          <vxe-table
            :data="item.changeDetails"
            stripe
            show-overflow
            resizable
            :row-config="{ isHover: true }"
            border="inner"
            size="medium"
            min-height="0"
            max-height="400px"
            >
            <vxe-column field="fieldLabel" title="字段" ></vxe-column>
            <vxe-column field="newValue" title="新值" ></vxe-column>
            <vxe-column field="oldValue" title="旧值" ></vxe-column>
            <template #empty>
              <div class="m-vxe-table-empty-text">
                暂无数据
              </div>
            </template>
          </vxe-table>
        </div>
      </el-timeline-item>
    </el-timeline>
    <div class="table-pagination">
      <el-pagination
        @size-change="pageSizeChange"
        @current-change="currentPageChange"
        :current-page="current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { keyInfoChangeLogPage } from '@/api/datacenter/vehicle/vehicleProfile';
import AisPageSearchAction from '@/libs/components/AisPageSearchAction';
import FetchSelect from '@/libs/components/FetchSelect';
import commonMixins from '@/libs/mixins/commonMixins';
import { getEnum } from '@/api/common';

const defaultForm = {
  businessType: '',
  fieldName: '',
};
export default {
  name: 'ChangeHistory',
  props: {
    id: {
      type: String,
    }
  },
  components: {
    AisPageSearchAction,
    FetchSelect,
  },
  mixins: [commonMixins],
  data () {
    return {
      form: { ...defaultForm },
      //
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      //
      types: [
        'RETURN_VEHICLE',
        'USED_CAR_CHANGE',
        'ORIGINAL_OWNER_CHANGE',
        'SERVICE_DEALER_CHANGE',
      ],
    };
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id;
    }
  },
  watch: {
    _id: {
      handler (val) {
        this.getDetailPageApi();
      }
    },
  },
  mounted () {
    this.getDetailPageApi();
  },

  methods: {
    getDetailPageApi () {
      keyInfoChangeLogPage({
        // vin: 'LFZ63AV56SD020798',
        vehicleProfileId: this.id,
        pageSize: this.pageSize,
        pageNum: this.current,
        ...this.getFormData(),
      }).then((res) => {
        this.tableData = res.records;
        this.total = res.total;
      });
    },
    getFormData () {
      const data = { ...this.form };

      Object.keys(this.form).forEach(key => {
        if (Array.isArray(data[key]) && !data[key].length) {
          delete data[key];
        }
        if (data[key] === '' || data[key] === null) {
          delete data[key];
        }
      });

      return data;
    },
    onSubmit () {
      this.getDetailPageApi();
    },
    onReset () {
      this.form = { ...defaultForm };
      this.current = 1;
      this.getDetailPageApi();
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
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
  }
};
</script>

<style lang="scss" scoped>
.change-history {
  padding: 0 0 12px 0;
  .ais-search-form {
    display: flex;
    .el-form-item:not(.form-item-action) {
      flex: 1;
    }
    .el-form-item.form-item-action{
      width: 150px;
      text-align: right;
      padding-left: 0px;
      ::v-deep .el-form-item__content{
        top: -1px;
      }
    }
  }
}
.change-history-timeline{
  margin-top: 10px;
  padding-left: 30px;
  .status{
    position: absolute;
    left: -32px;
    top: 26px;
    background-color: #009100;
    width: 74px;
    height: 32px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    &.blue{
      background-color: #2261DD;
    }
  }
  .item{
    padding-left: 30px;
    .line-1{
      color: #0A0E0A;
      font-weight: 500;
      font-size: 14px;
      line-height: 22px;
      margin-bottom: 4px;
    }
    .line-2{
      color: #0A0E0A;
      font-weight: 500;
      font-size: 14px;
      line-height: 22px;
      display: flex;
      flex-wrap: wrap;
      .line-item{
        flex: 1;
        .grey{
          color: #6C6E6C;
        }
      }
    }
  }
}
.change-history{
  ::v-deep .el-timeline .el-timeline-item:last-child .el-timeline-item__tail {
    display: block !important;
  }
  ::v-deep .el-pagination{
    display: flex;
    flex-wrap: wrap;
  }
}

</style>
