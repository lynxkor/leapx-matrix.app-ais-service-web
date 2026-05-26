<template>
  <edit-page-layout ref="editLayout" title="权益套餐详情" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :showEditBtn="false"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :detailRequest="detailRequest"
      >
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form ref="ruleForm" :inline="true" class="form-detail">
                <el-form-item label="接车施工单号：">
                  <el-link type="success" :href="`/service/maintain/sp/serviceProxy/edit?id=${form.serviceProxyId}`" target="_blank">{{ form.serviceProxyCode }}</el-link>
                </el-form-item>
                <el-form-item label="权益代码：">
                  {{ form.equityCode }}
                </el-form-item>
                <el-form-item label="权益名称：">
                  {{ form.equityName }}
                </el-form-item>
                <el-form-item label="权益使用状态：">
                  {{ form.equityUsageStatusLabel }}
                </el-form-item>
                <el-form-item label="核销时间：">
                  {{ form.verificationTime }}
                </el-form-item>
                <el-form-item label="取消时间：">
                  {{ form.cancellationTime }}
                </el-form-item>
                <el-form-item label="购买城市等级：">
                  {{ form.purchaseCityLevelLabel }}
                </el-form-item>
                <el-form-item label="核销城市等级：">
                  {{ form.verificationCityLevelLabel }}
                </el-form-item>
                <el-form-item label="补差价模式：">
                  {{ form.spreadTypeLabel }}
                </el-form-item>
                <el-form-item label="建议差价：">
                  {{ form.suggestedSpreadPrice }}
                </el-form-item>
                <el-form-item label="权益核销券码：">
                  {{ form.verificationEquityCode }}
                </el-form-item>
                <el-form-item label="权益发放ID：">
                  {{ form.equityDistributionId }}
                </el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
      </div>
    </template>
  </edit-page-layout>
</template>
<script>
import { getSpEquity } from '@/api/maintain/sp/serviceProxy/spEquity';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import routeGuard from '@/libs/mixins/routeGuard';
import commonMixins from '@/libs/mixins/commonMixins';
import permissions from '@/libs/mixins/permissions';

const defaultForm = {
  serviceProxyId: '',
  equityCode: '',
  equityName: '',
  equityUsageStatus: '',
  verificationTime: '',
  cancellationTime: '',
  purchaseCityLevel: '',
  verificationCityLevel: '',
  spreadType: '',
  suggestedSpreadPrice: '',
  verificationEquityCode: '',
  equityDistributionId: ''
};

export default {
  name: 'SpEquityDetail',
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer
  },
  data () {
    return {
      pageType: 'edit',
      isEditing: false,
      moduleKey: 'AISMC-spEquity',
      form: { ...defaultForm },
      originalForm: { ...defaultForm }
    };
  },
  computed: {
    _id () {
      return this.$route.query.id;
    },
    _serviceProxyId () {
      return this.$route.query.serviceProxyId;
    },
    title () {
      return '权益代码：' + (this.form.equityCode || '');
    }
  },
  methods: {
    detailRequest () {
      const equityCode = this._id;
      const serviceProxyId = this._serviceProxyId;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['权益详情']);
      if (equityCode && serviceProxyId) {
        return getSpEquity({ serviceProxyId, equityCode });
      }
    }
  }
};
</script>
