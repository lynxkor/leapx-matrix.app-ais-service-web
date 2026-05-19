<template>
  <div class="change-history">
    <template v-if="tableData.length">
      <el-timeline class="change-history-timeline">
        <el-timeline-item
          v-for="(item, index) in tableData"
          :key="index"
          color="#354"
          >
          <template v-slot:dot>
            <div class="dot" :class="{'first': index === 0}"></div>
          </template>
          <div class="item">
            <div class="line-1">{{ item.orderTime }}
              <span class="type" v-for="val in item.repairTypes" :key="val">{{ val }}</span>
            </div>
            <div class="line-2">
              <div class="line-item">
                <span class="grey">业务单据：</span>
                <el-link type="success" @click="handleLinkClick(item)">{{ item.serviceProxyCode }}</el-link>
              </div>
            </div>
            <div class="line-2">
              <div class="line-item">
                <span class="grey">施工门店：</span>
                <span>{{ item.dealerName }}</span>
              </div>
            </div>
            <div class="line-2">
              <div class="line-item">
                <span class="grey">进店里程：</span>
                <span>{{ item.mileage }}</span>
              </div>
            </div>
            <div class="line-2">
              <div class="line-item">
                <span class="grey">客户故障描述：</span>
                <span>{{ item.customerFaultDescription }}</span>
              </div>
            </div>
            <div class="line-2">
              <div class="line-item">
                <span class="grey">客户经理建议：</span>
                <span>{{ item.managerSuggestion }}</span>
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
  </template>
  <div v-else class="empty-text">暂无数据</div>
  </div>
</template>

<script>
import { serviceProxyHisPage } from '@/api/datacenter/vehicle/vehicleProfile';
import { getLoginUser } from '@/api/common';
import commonMixins from '@/libs/mixins/commonMixins';

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
      loginUser: null,
      //
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
    this.initLoginUser();
    this.getDetailPageApi();
  },

  methods: {
    getDetailPageApi () {
      serviceProxyHisPage({
        vehProfileId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current,
        sortColumns: [{
          column: 'order_time',
          sort: 'DESC'
        }]
      }).then((res) => {
        this.tableData = (res.records || []).map(item => {
          return {
            ...item,
            repairTypes: `${item.repairItemTypeDetailCollect}`.split('&'),
          };
        });
        this.total = res.total;
      });
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
    async initLoginUser () {
      this.loginUser = await getLoginUser();
    },
    handleLinkClick (item) {
      if (this.loginUser?.accountFlag && this.loginUser.currentDealerCode !== item.dealerCode) {
        this.$message.warning('权限不足');
        return;
      }
      window.open(`/maintain/sp/serviceProxy/edit?id=${item.serviceProxyId}`, '_blank');
    },
  }
};
</script>

<style lang="scss" scoped>
.change-history {
  padding: 0 0 12px 0;
  height: 100%;
  display: flex;
  flex-direction: column;
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
  flex: 1;
  overflow-y: auto;
  padding-top: 10px;
  padding-left: 18px;
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
    .line-1{
      color: #0A0E0A;
      font-weight: 500;
      font-size: 14px;
      line-height: 22px;
      .type {
        display: inline-block;
        margin-left: 8px;
        margin-bottom: 8px;
        color: #3B3E3B;
        border: 1px solid #3B3E3B;
        padding: 2px 10px;
        border-radius: 4px;
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
      margin-bottom: 8px;
      .line-item{
        flex: 1;
        .grey{
          color: #6C6E6C;
          font-weight: normal;
        }
      }
    }
  }
}
.table-pagination{
  padding: 0 12px;
}
.empty-text {
  padding: 200px 0;
  text-align: center;
  color: #999;
  font-size: 14px;
}
::v-deep .el-timeline .el-timeline-item .el-timeline-item__tail {
  top: 7px;
}
::v-deep .el-timeline .el-timeline-item:last-child{
  .el-timeline-item__tail{
    border:none;
  }
}
::v-deep .el-timeline .el-timeline-item .el-timeline-item__wrapper{
  padding-left: 24px;
}

::v-deep .el-timeline .el-timeline-item:last-child .el-timeline-item__tail {
  display: block !important;
}
::v-deep .el-pagination{
  display: flex;
  flex-wrap: wrap;
}
.dot{
  position: absolute;
  top: 7px;
  left: 50%;
  border-radius: 50%;
  width: 8px;
  height: 8px;
  background-color: #fff;
  border: 1px solid #3B3E3B;
  margin-left: 1px;
  &.first{
    background-color: #009100;
  }
}
</style>
