<template>
  <edit-page-layout ref="editLayout" title="母公司详情">
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_companyCode"
        :title="`母公司编码：${form.companyCode || '-'}`"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :detailRequest="detailRequest"
        :showEditBtn="false"
      >
        <el-main>
          <!-- section 一：基础信息 -->
          <section class="common-section">
            <div class="common-section-header"><h2>基础信息</h2></div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" class="form-detail">
                <el-form-item label="母公司名称：">{{ form.companyName }}</el-form-item>
                <el-form-item label="母公司编码：">{{ form.companyCode }}</el-form-item>
                <el-form-item label="财务发票分类：">{{ form.financialInvoiceType }}</el-form-item>
                <el-form-item label="合作类型：">{{ form.cooperationTypeName || form.cooperationType }}</el-form-item>
                <el-form-item label="所属大区：">{{ form.regionName }}</el-form-item>
                <el-form-item label="企业客户分类：">{{ form.companyCustomerTypeName }}</el-form-item>
                <el-form-item label="法人代表：">{{ form.legalPerson }}</el-form-item>
                <el-form-item label="法人联系方式：">{{ form.legalPersonTelephone }}</el-form-item>
                <el-form-item label="公司邮箱：">{{ form.email }}</el-form-item>
              </el-form>
            </div>
          </section>

          <!-- section 二：地址信息 -->
          <section class="common-section">
            <div class="common-section-header"><h2>地址信息</h2></div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" class="form-detail">
                <el-form-item label="公司注册地址：">{{ form.address }}</el-form-item>
                <el-form-item label="详细地址：">{{ form.detailAddress }}</el-form-item>
              </el-form>
            </div>
          </section>

          <!-- section 三：开户信息 -->
          <section class="common-section">
            <div class="common-section-header"><h2>开户信息</h2></div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" class="form-detail">
                <el-form-item label="开户银行：">{{ form.bankName }}</el-form-item>
                <el-form-item label="税号：">{{ form.taxNumber }}</el-form-item>
                <el-form-item label="开户账户：">{{ form.openAccount }}</el-form-item>
                <el-form-item label="开票电话：">{{ form.invoicePhone }}</el-form-item>
                <el-form-item label="银行户主：">{{ form.bankHouseholder }}</el-form-item>
                <el-form-item label="开票地址：">{{ form.invoiceAddress }}</el-form-item>
              </el-form>
            </div>
          </section>

          <!-- section 四：投资人股权信息（含合计） -->
          <section class="common-section">
            <div class="common-section-header"><h2>投资人股权信息</h2></div>
            <div class="common-section-body">
              <vxe-table
                :data="form.investorEquityList || []"
                stripe
                show-overflow
                :row-config="{ isHover: true }"
                resizable
                min-height="0"
                max-height="400px"
                border="inner"
                size="medium"
                show-footer
                :footer-method="footerMethod"
              >
                <vxe-column field="investorName" title="投资人名称" min-width="220" />
                <vxe-column field="equityRatio" title="股权占比（%）" min-width="160" align="right" header-align="right">
                  <template #default="{ row }">{{ row.equityRatio }}</template>
                </vxe-column>
                <vxe-column field="investorType" title="投资人类型" min-width="160">
                  <template #default="{ row }">{{ row.investorType }}</template>
                </vxe-column>
                <template #footer>
                  <table class="vxe-table--footer">
                    <tbody>
                      <tr>
                        <td class="footer-cell">股权占比合计（%）</td>
                        <td class="footer-cell footer-value">{{ form.equityRatioTotal ?? totalRatio }}</td>
                        <td class="footer-cell"></td>
                      </tr>
                    </tbody>
                  </table>
                </template>
              </vxe-table>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
  </edit-page-layout>
</template>

<script>
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getDetail } from '@/api/datacenter/parentCompany/index';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  companyName: '',
  companyCode: '',
  financialInvoiceType: '',
  cooperationType: '',
  cooperationTypeName: '',
  regionName: '',
  companyCustomerTypeName: '',
  legalPerson: '',
  legalPersonTelephone: '',
  email: '',
  address: '',
  detailAddress: '',
  bankName: '',
  taxNumber: '',
  openAccount: '',
  invoicePhone: '',
  bankHouseholder: '',
  invoiceAddress: '',
  investorEquityList: [],
  equityRatioTotal: null
};

export default {
  name: 'parentCompanyDetail',
  props: {
    companyCode: { type: String, default: '' }
  },
  mixins: [permissions, commonMixins],
  components: { EditPageLayout, EditBaseContainer },
  computed: {
    _companyCode () {
      return this.companyCode || this.$route.query.companyCode || '';
    },
    totalRatio () {
      const list = this.form.investorEquityList || [];
      const sum = list.reduce((acc, cur) => acc + Number(cur.equityRatio || 0), 0);
      return Math.round(sum * 100) / 100;
    }
  },
  watch: {
    _companyCode: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      pageTitle: '母公司详情',
      pageType: 'detail',
      moduleKey: 'AISMC-parentCompany',
      isEditing: false,
      form: { ...defaultForm }
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['母公司管理', '母公司详情']);
  },
  methods: {
    async detailRequest () {
      const code = this._companyCode;
      if (!code) return null;
      const res = await getDetail({ companyCode: code });
      return res || { ...defaultForm };
    },
    footerMethod ({ columns, data }) {
      // 预留：vxe-table 内置合计方法（与模板 #footer 二选一）
      return [
        columns.map((col, idx) => {
          if (idx === 0) return '股权占比合计（%）';
          if (col.field === 'equityRatio') {
            const sum = (data || []).reduce((acc, cur) => acc + Number(cur.equityRatio || 0), 0);
            return Math.round(sum * 100) / 100;
          }
          return null;
        })
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.common-section-table { .m-vxe-table-empty-text { text-align: left; } }
.footer-cell { padding: 8px 12px; }
.footer-value { color: #f56c6c; font-weight: 600; }
</style>
