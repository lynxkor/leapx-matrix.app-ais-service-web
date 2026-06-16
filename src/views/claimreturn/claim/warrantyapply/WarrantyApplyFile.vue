<template>
  <section class="common-section">
    <div class="common-section-header">
      <h2>附件</h2>
    </div>
    <div class="common-section-body">
      <div class="common-section-table">
        <!-- 非技术服务活动：原有逻辑 -->
        <AttachmentList
          v-if="!isTechServiceActivity"
          :business-id="_id"
          :config-code="configCode"
          type="card"
          :readonly="disabled || !canAddOrUpdate"
        />
        <!-- 技术服务活动：根据服务活动ID动态获取配置 -->
        <div v-else v-loading="loadingActivityConfigs">
          <AisAttachment
            v-for="config in activityFileConfigs"
            :key="config.id"
            :businessId="_id"
            :attachType="config.attachType"
            :title="config.attachType"
            :uploadConfig="config.uploadConfig"
            :readonly="disabled || !canAddOrUpdate"
            :config-code="'TECHNICAL_SERVICE_ACTIVITY'"
            type="card"
          />
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import AttachmentList from '@/libs/components/AttachmentList/index.vue';
import AisAttachment from '@/libs/components/AisAttachment';
import { getServiceActivityFileConfigPage } from '@/api/claimreturn/claim/warrantyapply/index.js';

const TECH_SERVICE_ACTIVITY_TYPE_ID = '64A3066F-82AC-E911-B0BB-FC82BA5F9EDF';

const repairItemTypeArr = [
  {
    id: 'F0C7FA93-9CDF-E911-B0BB-B12A64BD1304',
    name: '无',
    code: 'SELF_PAY',
  },
  {
    id: 'A9DD21B3-9CDF-E911-B0BB-B12A64BD1304',
    name: '无',
    code: 'INSURANCE',
  },
  {
    id: 'A627DD5C-9CDF-E911-B0BB-B12A64BD1304',
    name: '无',
    code: 'INTERNAL_SETTLEMENT',
  },
  {
    id: 'ED68D3F0-C1FB-E911-B0BB-FC82BA5F9EDF',
    name: '售前保修',
    code: 'PRE_SALE_WARRANTY',
  },
  {
    id: '70A3066F-82AC-E911-B0BB-FC82BA5F9EDF',
    name: '善意保修',
    code: 'GOODWILL_WARRANTY',
  },
  {
    id: '6CA3066F-82AC-E911-B0BB-FC82BA5F9EDF',
    name: '零件保修',
    code: 'PARTS_WARRANTY',
  },
  {
    id: '6AA3066F-82AC-E911-B0BB-FC82BA5F9EDF',
    name: 'PDI',
    code: 'PDI',
  },
  {
    id: TECH_SERVICE_ACTIVITY_TYPE_ID,
    name: '技术服务活动',
    code: 'TECHNICAL_SERVICE_ACTIVITY',
  },
  {
    id: '60A3066F-82AC-E911-B0BB-FC82BA5F9EDF',
    name: '免费保养',
    code: 'FREE_MAINTENANCE',
  },
  {
    id: '5EA3066F-82AC-E911-B0BB-FC82BA5F9EDF',
    name: '一般整车保修',
    code: 'GENERAL_VEHICLE_WARRANTY',
  },
  {
    id: 'BA408917-12AE-EF11-B1BC-B6F71A4539C1',
    name: '保养套餐',
    code: 'MAINTENANCE_PACKAGE',
  },
  {
    id: 'B96ED1D0-04AE-EE11-B156-E3C14957A562',
    name: '三电延长质保',
    code: 'EXTENDED_BATTERY_MOTOR_ELECTRONICS_WARRANTY',
  },
  {
    id: 'AD9C7E60-A279-EF11-B19A-D00604C9E6C8',
    name: '精品保修',
    code: 'BOUTIQUE_WARRANTY',
  },
  {
    id: '5180E2BE-04AE-EE11-B156-E3C14957A562',
    name: '整车终身质保',
    code: 'LIFETIME_VEHICLE_WARRANTY',
  },
  {
    id: '4EC01DDD-DD79-EC11-B0F9-9216EACB73F2',
    name: '终身保养',
    code: 'LIFETIME_MAINTENANCE',
  },
  {
    id: '4054DA40-A62B-EA11-B0BB-B12A64BD1304',
    name: '特殊保养',
    code: 'SPECIAL_MAINTENANCE',
  },
  {
    id: '2D87DFC4-04AE-EE11-B156-E3C14957A562',
    name: '三电终身质保',
    code: 'LIFETIME_BATTERY_MOTOR_ELECTRONICS_WARRANTY',
  }
];

export default {
  name: 'WarrantyApplyFile',
  components: {
    AttachmentList,
    AisAttachment,
  },
  props: {
    id: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
    canAddOrUpdate: {
      type: Boolean,
      default: false,
    },
    repairItemTypeId: {
      type: String,
    },
    serviceActivityId: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      activityFileConfigs: [],
      loadingActivityConfigs: false,
    };
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id;
    },
    isTechServiceActivity () {
      return this.repairItemTypeId === TECH_SERVICE_ACTIVITY_TYPE_ID;
    },
    configCode () {
      if (this.isTechServiceActivity) return '';
      const item = repairItemTypeArr.find(i => i.id === this.repairItemTypeId);
      return item ? item.code : '';
    },
  },
  watch: {
    serviceActivityId: {
      handler (val) {
        if (this.isTechServiceActivity && val) {
          this.loadActivityFileConfigs();
        } else {
          this.activityFileConfigs = [];
        }
      },
      immediate: true,
    },
  },
  methods: {
    async loadActivityFileConfigs () {
      if (!this.serviceActivityId) return;
      try {
        this.loadingActivityConfigs = true;
        const res = await getServiceActivityFileConfigPage({ activityId: this.serviceActivityId });
        const records = (res && res.records) || [];
        this.activityFileConfigs = records.map(item => ({
          id: item.id,
          attachType: item.fileType,
          uploadConfig: {
            attachType: item.fileType,
            maxNum: item.quantity || 9,
            acceptSuffix: '.jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx',
            maxSize: 50,
            required: item.required || '0',
          },
        }));
      } catch (e) {
        console.error('获取服务活动附件配置失败:', e);
      } finally {
        this.loadingActivityConfigs = false;
      }
    },
  },
};
</script>
<style lang="less" scoped></style>
