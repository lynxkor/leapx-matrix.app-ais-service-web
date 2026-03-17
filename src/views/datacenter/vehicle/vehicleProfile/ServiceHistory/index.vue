<template>
  <div class="change-history">
    <el-timeline class="change-history-timeline">
      <el-timeline-item
        v-for="(item, index) in [1,2]"
        :key="index"
        color="#6C6E6C"
        >
        <div class="item">
          <div class="line-1">2025-11-12 16:33:00 退车
            <span>精品附件</span>
            <span>精品附件</span>
            <span>精品附件</span>
            <span>精品附件</span>
          </div>
          <div class="line-2">
            <div class="line-item">
              <span class="grey">操作人：</span>
              <span>sfdf</span>
            </div>
          </div>
          <div class="line-2">
            <div class="line-item">
              <span class="grey">操作人：</span>
              <span>sfdf</span>
            </div>
          </div>
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
import { serviceProxyHisPage } from '@/api/datacenter/vehicle/vehicleProfile';
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
      serviceProxyHisPage({
        vehProfileId: this.id,
        pageSize: this.pageSize,
        pageNum: this.current,
        sortColumns: [{
          column: 'order_time',
          sort: 'DESC'
        }]
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
      span{
        display: inline-block;
        background: #FAF6EA;
        padding: 2px 10px;
        margin-right: 6px;
        color: #C8A12B;
        line-height: 20px;
        font-size: 12px;
        font-weight: normal;
      }
    }
    .line-2{
      color: #0A0E0A;
      font-weight: 500;
      font-size: 14px;
      line-height: 22px;
      display: flex;
      flex-wrap: wrap;
      margin-top: 5px;
      .line-item{
        flex: 1;
        .grey{
          color: #6C6E6C;
        }
      }
    }
  }
}
::v-deep .el-timeline .el-timeline-item:last-child .el-timeline-item__tail {
  display: block !important;
}
::v-deep .el-pagination{
  display: flex;
  flex-wrap: wrap;
}
</style>
