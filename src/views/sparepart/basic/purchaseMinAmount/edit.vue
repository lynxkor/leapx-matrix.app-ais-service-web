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
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="采购申请单类型：" prop="purchaseOrderType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="purchase_order_type"
                    v-model="form.purchaseOrderType"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="!!_id"
                  />
                </el-form-item>
                <el-form-item label="类型：" prop="type">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="purchase_min_amount_type"
                    v-model="form.type"
                    placeholder="请选择"
                    clearable
                    filterable
                    :disabled="!!_id"
                  />
                </el-form-item>
                <el-form-item label="门店：" prop="dealerCode" v-if="form.type == '1'">
                  <fetch-select
                    style="width: 305px;"
                    :remote-method="getStoreByName"
                    remote
                    v-model="form.dealerCode"
                    placeholder="请输入门店编码或名称"
                    :disabled="!!_id"
                    labelKey="orgName"
                    valueKey="orgCode"
                    subLabelKey="orgCode"
                    clearable
                    filterable
                    @change="handleStoreChange"
                  />
                </el-form-item>
                <el-form-item label="门店名称：" v-if="form.type == '1'">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="起订金额：" prop="minimumAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.minimumAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="生效开始日期：" prop="effectiveStartDate">
                  <el-date-picker
                    v-model="form.effectiveStartDate"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark" class="form-item-full">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="订单类型：">
                  {{ form.purchaseOrderTypeLabel }}
                </el-form-item>
                <el-form-item label="类型：">
                  {{ form.typeLabel }}
                </el-form-item>
                <el-form-item label="门店编码：">
                  <el-link type="primary" :href="`/partner/channelManagement/shopDetail?dealerCode=${form.dealerCode}`" target="_blank">
                    {{ form.dealerCode }}
                  </el-link>
                </el-form-item>
                <el-form-item label="门店名称：">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="起订金额：">
                  {{ form.minimumAmount }}
                </el-form-item>
                <el-form-item label="生效开始日期：">
                  {{ form.effectiveStartDate }}
                </el-form-item>
                <el-form-item label="状态：">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="创建时间：">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改时间：">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="创建者名称：">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="修改者名称：">
                  {{ form.modifierName }}
                </el-form-item>
                <el-form-item label="备注：" class="form-item-full">
                  {{ form.remark }}
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
import { getDetail, addOrUpdate } from '@/api/sparepart/basic/purchaseMinAmount/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listOrgStoreInfoByParam } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  purchaseOrderType: '',
  purchaseOrderTypeLabel: '',
  type: '',
  typeLabel: '',
  dealerCode: '',
  dealerName: '',
  minimumAmount: '',
  effectiveStartDate: '',
  status: '1',
  statusLabel: '',
  remark: '',
  createTime: '',
  updateTime: '',
  creatorName: '',
  modifierName: '',
};

export default {
  name: 'purchaseMinAmountEdit',
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
      return '备件起订金额设置' + (this.form.purchaseOrderTypeLabel ? ' - ' + this.form.purchaseOrderTypeLabel : '');
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '备件起订金额设置',
      pageType: 'edit',
      moduleKey: 'AISPART-purchaseMinAmount',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        purchaseOrderType: [
          { required: true, message: '请选择采购申请单类型', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请选择门店', trigger: 'change' }
        ],
        minimumAmount: [
          { required: true, message: '请输入起订金额', trigger: 'blur' }
        ],
        effectiveStartDate: [
          { required: true, message: '请选择生效开始日期', trigger: 'blur' }
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
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    async getStoreByName (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching store list:', error);
      }
    },
    handleStoreChange (val, all) {
      if (all) {
        this.form.dealerCode = all.orgCode;
        this.form.dealerName = all.orgName;
      }
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
