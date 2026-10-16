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
          <span v-if="_id" class="status" :class="form.status === 1 ? 'primary' : 'danger'">
            {{ form.status === 1 ? '已启用' : '已停用' }}
          </span>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2><span class="m-required">*</span>常规信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="名称：" prop="code">
                  <el-input
                    v-model="form.code"
                    :placeholder="codePlaceholder"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="订单类型：" prop="purchaseOrderType">
                  <fetch-select
                    filterable
                    clearable
                    v-model="form.purchaseOrderType"
                    :request="fetchOptions"
                    enumCode="PurchaseOrderTypeEnum"
                    :disabled="!!_id"
                    placeholder="请选择"
                  />
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    v-model="form.dealerCode"
                    :remote-method="getDealerList"
                    :disabled="!!_id"
                    labelKey="orgName"
                    valueKey="orgCode"
                    subLabelKey="orgCode"
                    placeholder="请输入门店编码或名称"
                    @change="handleDealerChange"
                  />
                </el-form-item>
                <el-form-item label="月使用次数：" prop="monthlyUseCount">
                  <el-input
                    type="number"
                    :min="0"
                    :step="1"
                    v-model.number="form.monthlyUseCount"
                    placeholder="请输入"
                  />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-input
                    v-model="form.dealerName"
                    placeholder="选择门店后自动带出"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark" class="form-item-full">
                  <el-input
                    type="textarea"
                    :rows="3"
                    :maxlength="500"
                    show-word-limit
                    v-model="form.remark"
                    placeholder="请输入备注"
                    style="width: 800px;"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="名称：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="订单类型：">
                  {{ form.purchaseOrderTypeLabel || form.purchaseOrderType }}
                </el-form-item>
                <el-form-item label="门店编码：">
                  <el-link type="primary" :href="`/service/datacenter/store/store/detail?storeCode=${form.dealerCode}`" target="_blank">
                    {{ form.dealerCode }}
                  </el-link>
                </el-form-item>
                <el-form-item label="月使用次数：">
                  {{ form.monthlyUseCount }}
                </el-form-item>
                <el-form-item label="门店名称：">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="备注：">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="创建时间：">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改时间：">
                  {{ form.updateTime }}
                </el-form-item>
              </el-form>
            </div>
          </section>

          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2><span class="m-required">*</span>使用信息</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  :data="useDetailList"
                  stripe
                  resizable
                  show-overflow
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="purchaseApplyCode" title="采购申请单" min-width="180">
                    <template #default="{ row }">
                      <div v-if="row.purchaseApplyId" class="href-link" @click="handlePurchaseApplyJump(row)">
                        {{ row.purchaseApplyCode }}
                      </div>
                      <span v-else>-</span>
                    </template>
                  </vxe-column>
                  <vxe-column field="approveTime" title="审批时间" min-width="160" />
                  <vxe-column field="originalMonthlyUseCount" title="月使用次数（原）" min-width="140" />
                  <vxe-column field="originalRuleRemark" title="使用规则备注（原）" min-width="200" show-overflow="ellipsis" />
                  <vxe-column field="createTime" title="创建时间" min-width="180" />
                  <template #empty>
                    <div class="m-empty-tip">
                      暂无使用明细。规则 <b>{{ form.code }}</b> 的门店内没有匹配的已审批采购申请单。
                    </div>
                  </template>
                </vxe-table>
                <el-pagination
                  v-if="useDetailTotal > 0"
                  style="margin-top: 12px; text-align: right;"
                  :current-page.sync="useDetailPage.current"
                  :page-size="useDetailPage.size"
                  :page-sizes="[10, 20, 50, 100]"
                  :total="useDetailTotal"
                  layout="total, prev, pager, next, sizes, jumper"
                  @current-change="loadUseDetailByPage"
                  @size-change="loadUseDetailBySizeChange"
                />
              </div>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, useDetailPage } from '@/api/sparepart/basic/marginFundRule/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listOrgStoreInfoByParam } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  id: '',
  code: '',
  dealerCode: '',
  dealerName: '',
  ownerOrgId: '',
  purchaseOrderType: '',
  purchaseOrderTypeLabel: '',
  monthlyUseCount: 0,
  remark: '',
  status: 1,
  dataSource: '',
  createTime: '',
  updateTime: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: ''
};

export default {
  name: 'marginFundRuleEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
    EditPageLayout,
    EditBaseContainer,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '预留金使用规则' + (this.form.code ? ' - ' + this.form.code : '');
    },
    codePlaceholder () {
      return this._id ? '' : '提交后自动生成';
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
    },
    'form.code' (val) {
      // 监听 form.code 唯一字段，避免 dealerCode/purchaseOrderType 同步赋值时双触发
      this.$nextTick(() => this.loadUseDetailIfReady())
    }
  },
  data () {
    return {
      pageTitle: '预留金使用规则设置',
      pageType: 'edit',
      moduleKey: 'AISPART-marginFundRule',
      loading: false,
      submitLoading: false,
      info: {},
      yes_no_enum: YES_NO_ENUM,
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      useDetailList: [],
      useDetailTotal: 0,
      useDetailPage: {
        current: 1,
        size: 10
      },
      rules: {
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        purchaseOrderType: [
          { required: true, message: '请选择订单类型', trigger: 'change' }
        ],
        monthlyUseCount: [
          {
            validator: (rule, value, callback) => {
              if (value === undefined || value === null || value === '') {
                callback(new Error('请输入月使用次数'));
                return;
              }
              if (Number(value) < 0) {
                callback(new Error('月使用次数必须大于等于0'));
                return;
              }
              if (!Number.isInteger(Number(value))) {
                callback(new Error('月使用次数必须为整数'));
                return;
              }
              callback();
            },
            trigger: 'blur'
          }
        ]
      }
    };
  },
  mounted () {},
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          // 注意：getDetail 的 res 是 MarginFundRuleResp，
          // 父组件通过 :form.sync="form" 接收到 form 更新
          // 这里用 watch form.dealerCode / form.purchaseOrderType 触发 loadUseDetail
          return res;
        });
      }
      return {};
    },
    // 等 form.code 到位后再调 useDetailPage（后端 SQL 关联按 codeList 过滤）
    loadUseDetailIfReady () {
      if (!this._id) return
      if (!this.form.code) return
      this.loadUseDetail()
    },
    submitRequest () {
      return addOrUpdate({ id: this.form.id, ...this.form });
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 门店下拉远程搜索
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
        return res;
      } catch (error) {
        console.error('Error fetching dealer list:', error);
        return [];
      }
    },
    // 选择门店后回填名称 + orgId
    handleDealerChange (val, all) {
      if (all) {
        this.form.dealerName = all.orgName;
        this.form.ownerOrgId = all.id;
      } else {
        this.form.dealerName = '';
        this.form.ownerOrgId = '';
      }
    },
    // 加载使用信息（按 codeList 走后端 SQL 关联，margin_fund_rule LEFT JOIN purchase_apply）
    async loadUseDetail (pageNum, pageSize) {
      if (!this.form.code) {
        this.useDetailList = [];
        this.useDetailTotal = 0;
        return;
      }
      // 首次进入时，用 useDetailPage 当前分页；事件触发时取传入值
      const current = pageNum || this.useDetailPage.current
      const size = pageSize || this.useDetailPage.size
      this.useDetailPage.current = current
      this.useDetailPage.size = size
      console.log('[marginFundRule] useDetailPage 请求 codeList:', [this.form.code], { current, size })
      try {
        const res = await useDetailPage({
          codeList: [this.form.code],
          pageNum: current,
          pageSize: size
        });
        console.log('[marginFundRule] useDetailPage 响应:', res)
        this.useDetailList = res?.records || []
        this.useDetailTotal = res?.total || 0
      } catch (e) {
        console.error('[marginFundRule] 加载使用信息失败:', e);
        this.useDetailList = [];
        this.useDetailTotal = 0;
      }
    },
    // 翻页（页码变化）
    loadUseDetailByPage (page) {
      this.loadUseDetail(page)
    },
    // 改每页大小（重置到第 1 页）
    loadUseDetailBySizeChange (size) {
      this.loadUseDetail(1, size)
    },
    handlePurchaseApplyJump (row) {
      if (!row.purchaseApplyId) return;
      this.$router.push({
        path: '/sparepart/purchase/purchaseApply/edit',
        query: { id: row.purchaseApplyId }
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
.status.danger {
  color: var(--leap-color-danger);
  font-weight: 500;
}
.m-required {
  color: var(--leap-color-danger);
  margin-right: 2px;
}
.form-item-full {
  width: 100%;
}
.m-empty-tip {
  padding: 24px 12px;
  color: #909399;
  font-size: 13px;
  text-align: center;
  line-height: 1.6;
}
</style>
