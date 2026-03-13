<template>
  <div class="change-history">
    <el-form :inline="true" :model="form" class="ais-search-form">
      <el-form-item label="业务类型" label-width="80px">
        <fetch-select
          :request="fetchOptions"
          enumCode="claim_key_info_change_business_type"
          v-model="form.businessType"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <el-form-item label="字段" label-width="70px">
        <fetch-select
          :request="fetchOptions"
          enumCode="claim_change_field_type"
          v-model="form.businessType"
          placeholder="请选择"
          clearable
          multiple
          filterable
        />
      </el-form-item>
      <AisPageSearchAction @submit="onSubmit" @reset="onReset" :isExpandable="false" />
    </el-form>
    <el-timeline :reverse="reverse">
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        color="#6C6E6C"
        :timestamp="activity.timestamp">
        {{activity.content}}
      </el-timeline-item>
    </el-timeline>
    <!-- <div class="history-timeline">
      <div v-for="(item, index) in historyList" :key="index" class="timeline-item">
        <div class="timeline-dot" :class="{
          blue: true,
        }">
          <span class="label">{{ getStatusLabel(item.status) }}</span>
        </div>
        <div class="timeline-content">
          <div class="content-header">
            <span class="time">{{ item.time }}</span>
            <span class="type">{{ item.type }}</span>
            <span class="separator">业务单据：{{ item.billNo }}</span>
            <span class="separator">操作人：{{ item.operator }}</span>
          </div>
          <div class="content-body">
            <vxe-table
              :data="[item]"
              border="inner"
              size="small"
              :show-header="true"
              :header-cell-config="{height: 32}"
              class="history-mini-table"
            >
              <vxe-column field="ownerName" title="车主姓名">
                <template #default="{ row }">
                  <span class="empty-text">{{ row.ownerName }}</span>
                </template>
              </vxe-column>
              <vxe-column field="ownerPhone" title="车主手机号码">
                <template #default="{ row }">
                  <span class="empty-text">{{ row.ownerPhone }}</span>
                </template>
              </vxe-column>
              <vxe-column field="ownerIdCard" title="车主证件号码">
                <template #default="{ row }">
                  <span class="empty-text">{{ row.ownerIdCard }}</span>
                </template>
              </vxe-column>
            </vxe-table>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import AisPageSearchAction from '@/libs/components/AisPageSearchAction';
import FetchSelect from '@/libs/components/FetchSelect';
import commonMixins from '@/libs/mixins/commonMixins';

export default {
  name: 'ChangeHistory',
  components: {
    AisPageSearchAction,
    FetchSelect,
  },
  mixins: [commonMixins],
  data () {
    return {
      form: {
        businessType: '',
        field: ''
      },
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }],
      businessTypeOptions: [
        { label: '退车', value: 'refund' },
        { label: '二手车信息变更', value: 'usedCar' },
        { label: '展车信息变更', value: 'displayCar' },
        { label: '专属服务门店变更', value: 'serviceStore' },
        { label: '车辆档案更新', value: 'archiveUpdate' },
        { label: '绑车人更新', value: 'bindUserUpdate' }
      ],
      fieldOptions: [
        { label: '车主姓名', value: 'ownerName' },
        { label: '车主手机号码', value: 'ownerPhone' },
        { label: '车主证件号码', value: 'ownerIdCard' }
      ],
      historyList: [
        {
          time: '2025-11-12 16:33:00',
          type: '退车',
          billNo: 'LP-ZCTC-02512347761',
          operator: '运维001',
          status: 'active',
          statusLabel: '已生效',
          ownerName: '',
          ownerPhone: '',
          ownerIdCard: ''
        },
        {
          time: '2025-11-12 16:33:00',
          type: '二手车信息变更',
          billNo: 'LP-ZCTC-02512347761',
          operator: '运维001',
          status: 'active',
          statusLabel: '已生效',
          ownerName: '',
          ownerPhone: '',
          ownerIdCard: ''
        },
        {
          time: '2025-11-12 16:33:00',
          type: '展车信息变更',
          billNo: 'LP-ZCTC-02512347761',
          operator: '运维001',
          status: 'pending',
          statusLabel: '已生效',
          ownerName: '',
          ownerPhone: '',
          ownerIdCard: ''
        },
        {
          time: '2025-11-12 16:33:00',
          type: '专属服务门店变更',
          billNo: 'LP-ZCTC-02512347761',
          operator: '运维001',
          status: 'active',
          statusLabel: '已生效',
          ownerName: '',
          ownerPhone: '',
          ownerIdCard: ''
        },
        {
          time: '2025-11-12 16:33:00',
          type: '车辆档案更新',
          billNo: 'LP-ZCTC-02512347761',
          operator: '运维001',
          status: 'active',
          statusLabel: '已生效',
          ownerName: '',
          ownerPhone: '',
          ownerIdCard: ''
        },
        {
          time: '2025-11-12 16:33:00',
          type: '绑车人更新',
          billNo: 'LP-ZCTC-02512347761',
          operator: '运维001',
          status: 'active',
          statusLabel: '已生效',
          ownerName: '',
          ownerPhone: '',
          ownerIdCard: ''
        }
      ]
    };
  },
  methods: {
    onSubmit () {
      console.log('筛选', this.form);
    },
    onReset () {
      this.form = {
        businessType: '',
        field: ''
      };
    },
    getStatusLabel (status) {
      const map = {
        active: '已生效',
        pending: '审核中',
        rejected: '已驳回'
      };
      return map[status] || status;
    }
  }
};
</script>

<style lang="scss" scoped>
.change-history {
  padding: 0px;
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

  .history-timeline {
    background: #fff;
    border-radius: 4px;
    padding: 20px;

    .timeline-item {
      display: flex;
      position: relative;
      padding-bottom: 24px;

      &:not(:last-child)::before {
        content: '';
        position: absolute;
        left: 32px;
        top: 32px;
        bottom: 0;
        width: 1px;
        background: var(--leap-color-default-light-3);
      }

      .timeline-dot {
        height: 32px;
        padding: 5px 16px;
        border-radius: 4px;
        &.blue {
          background-color: #2261DD;
        }
        &.green{
          background-color: #009100;
        }
        .label {
          font-size: 14px;
          font-weight: 500;
          color: #fff;
          line-height: 22px;
        }
      }

      .timeline-content {
        flex: 1;
        padding-bottom: 16px;
        // border-bottom: 1px solid var(--leap-color-default-light-4);

        .content-header {
          margin-bottom: 12px;
          font-size: 14px;

          .time {
            color: var(--leap-color-default);
            font-weight: 500;
            margin-right: 12px;
          }

          .type {
            color: var(--leap-color-default);
            font-weight: 500;
            margin-right: 12px;
          }

          .separator {
            color: var(--leap-color-default-light-1);
            margin-right: 16px;
          }
        }

        .content-body {
          .history-mini-table {
            background: var(--leap-color-default-light-5);
            border-radius: 4px;
            overflow: hidden;

            ::v-deep .vxe-table--header-wrapper {
              background: transparent;

              .vxe-table--header {
                background: transparent;
              }

              .vxe-header--row {
                background: transparent;
              }

              .vxe-header--column {
                background: transparent;
                font-size: 13px;
                color: var(--leap-color-default-light-1);
                font-weight: normal;
                padding: 8px 0;
              }
            }

            ::v-deep .vxe-table--body-wrapper {
              background: transparent;

              .vxe-table--body {
                background: transparent;
              }

              .vxe-body--row {
                background: transparent;
              }

              .vxe-body--column {
                background: transparent;
                font-size: 13px;
                color: var(--leap-color-default-light-2);
                padding: 8px 0;

                .empty-text {
                  color: var(--leap-color-default-light-2);
                }
              }
            }

            ::v-deep .vxe-table--border-line {
              border: none;
            }

            ::v-deep .vxe-table--header-border-line {
              border-bottom: 1px solid var(--leap-color-default-light-4);
            }
          }
        }
      }

      &:last-child {
        padding-bottom: 0;

        .timeline-content {
          border-bottom: none;
        }
      }
    }
  }
}
</style>
