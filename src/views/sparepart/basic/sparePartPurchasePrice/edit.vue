<template>
  <edit-page-layout ref="editLayout" :title="title" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
        :showEditBtn="true"
      >
        <template #status>
          <span :class="['status', form.status ? 'primary' : 'danger']">{{ form.statusLabel }}</span>
        </template>
        <template #extraButtons>
          <el-button :disabled="form.canInvalid === 0" type="primary" size="small" :loading="actionLoading" @click="handleFailure">失效</el-button>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="定价模式：" prop="pricingModel">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="PricingModelEnum"
                    v-model="form.pricingModel"
                    placeholder="请选择"
                    clearable
                    :disabled="!!_id"
                    filterable
                  />
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode" v-if="form.pricingModel != 'standardPrice'">
                  <fetch-select
                    :remote-method="getDealerList"
                    remote
                    v-model="form.dealerCode"
                    placeholder="请输入门店编码或名称"
                    :disabled="!!_id"
                    labelKey="orgCode"
                    valueKey="orgCode"
                    subLabelKey="orgName"
                    clearable
                    collapseTags
                    filterable
                    @change="listDealerChange"
                  />
                </el-form-item>
                <el-form-item label="门店名称：" v-if="form.pricingModel != 'standardPrice'">
                  <el-input v-model="form.dealerName" placeholder="请输入" clearable disabled />
                </el-form-item>
                <el-form-item label="备件编码：" prop="sparePartCode" v-if="form.pricingModel != 'dealerPriceRatio'">
                  <fetch-select
                    prop="sparePartCode"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    v-model="form.sparePartCode"
                    :remote-method="getSparePart"
                    :disabled="!!_id"
                    labelKey="code"
                    valueKey="code"
                    subLabelKey="name"
                    @change="listSparePartChange"
                  />
                </el-form-item>
                <el-form-item label="备件名称：" v-if="form.pricingModel != 'dealerPriceRatio'">
                  <el-input v-model="form.sparePartName" placeholder="请输入" clearable disabled />
                </el-form-item>
                <el-form-item label="采购价格：" prop="dealerPurchasePrice" v-if="form.pricingModel != 'dealerPriceRatio'">
                  <el-input
                    type="number"
                    placeholder="请输入"
                    v-model="form.dealerPurchasePrice"
                    clearable
                    :disabled="!canEditPurchasePrice"
                  />
                </el-form-item>
                <el-form-item label="调价比例(%)：" prop="adjustmentRatio" v-if="form.pricingModel == 'dealerPriceRatio'">
                  <el-input
                    type="number"
                    placeholder="请输入"
                    v-model="form.adjustmentRatio"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="生效开始日期：" prop="effectiveStartDate">
                  <el-date-picker
                    type="date"
                    v-model="form.effectiveStartDate"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    @change="handleDateChange"
                  />
                </el-form-item>
                <el-form-item label="生效结束时间：" v-if="form.pricingModel != 'standardPrice'">
                  <el-input v-model="form.effectiveEndDatetime" placeholder="请输入" clearable disabled />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="价格序号：">
                  {{ form.id }}
                </el-form-item>
                <el-form-item label="备件编码：">
                  {{ form.sparePartCode }}
                </el-form-item>
                <el-form-item label="备件名称：">
                  {{ form.sparePartName }}
                </el-form-item>
                <el-form-item label="定价模式：">
                  {{ form.pricingModelLabel }}
                </el-form-item>
                <el-form-item label="门店采购价格：">
                  {{ form.dealerPurchasePrice }}
                </el-form-item>
                <el-form-item label="门店编码：">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="门店名称：">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="调价比例(%)：">
                  {{ form.adjustmentRatio }}
                </el-form-item>
                <el-form-item label="生效开始日期：">
                  {{ form.effectiveStartDate }}
                </el-form-item>
                <el-form-item label="生效结束时间：">
                  {{ form.effectiveEndDatetime }}
                </el-form-item>
                <el-form-item label="失效操作人：">
                  {{ form.invalidOperator }}
                </el-form-item>
                <el-form-item label="失效原因：">
                  {{ form.invalidReason }}
                </el-form-item>
                <el-form-item label="创建时间：">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改时间：">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="备注：">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="是否启用：">
                  {{ form.statusLabel }}
                </el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, enableItem } from '@/api/sparepart/basic/sparePartPurchasePrice/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listOrgStoreInfoByParam, sparePartListShort } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getSparePart } from '@/api/sparepart/basic/sparePart/index';

const defaultForm = {
  id: '',
  sparePartCode: '',
  sparePartName: '',
  pricingModel: 'standardPrice',
  dealerPurchasePrice: '',
  dealerCode: '',
  dealerName: '',
  adjustmentRatio: '',
  effectiveStartDate: '',
  effectiveEndDatetime: '',
  statusLabel: '',
};

export default {
  name: 'sparePartPurchasePriceEdit',
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
    EditPageLayout,
    EditBaseContainer,
  },
  computed: {
    _id () {
      return this.$route.query.id || this.form.id;
    },
    title () {
      return '备件采购价格' + (this.form.id ? ' - ' + this.form.id : '');
    },
    canEditPurchasePrice () {
      if (!this.form.effectiveStartDate) {
        return false;
      }
      const selectedDate = new Date(this.form.effectiveStartDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '备件采购价格',
      pageType: 'edit',
      moduleKey: 'AISPART-sparePartPurchasePrice',
      loading: false,
      submitLoading: false,
      actionLoading: false,
      info: {},
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        sparePartCode: [
          { required: true, message: '请输入备件编码', trigger: 'blur' }
        ],
        pricingModel: [
          { required: true, message: '请输入定价模式', trigger: 'blur' }
        ],
        dealerPurchasePrice: [
          { required: true, message: '请输入门店采购价格', trigger: 'blur' }
        ],
        effectiveStartDate: [
          { required: true, message: '请输入生效开始日期', trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
      return {};
    },
    submitRequest () {
      return addOrUpdate({ id: this.form.id, ...this.form });
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    handleDateChange () {
      if (this.$route.query.id) {
        return;
      }
      if (!this.canEditPurchasePrice && this.form.dealerPurchasePrice) {
        this.form.dealerPurchasePrice = '';
      }
    },
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    async getSparePart (query) {
      try {
        const res = await sparePartListShort({ partCodeLikeOrList: query });
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    listDealerChange (val, all) {
      this.form.dealerCode = all.orgCode;
      this.form.dealerName = all.orgName;
    },
    listSparePartChange (val, all) {
      this.form.sparePartId = all.id;
      this.form.sparePartCode = all.code;
      this.form.sparePartName = all.name;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    handleFailure () {
      this.actionLoading = true;
      this.$prompt('请输入失效说明', '失效', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        enableItem({ idSet: [this.form.id], statusDesc: value, status: 0 }).then(() => {
          this.$message({
            type: 'success',
            message: '失效成功!'
          });
          this.$refs.containerRef.loadDetail();
          this.actionLoading = false;
        }).finally(() => {
          this.actionLoading = false;
        });
      }).catch(() => {
        this.actionLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.status.primary {
  color: var(--leap-color-primary);
  font-weight: 500;
}
</style>
