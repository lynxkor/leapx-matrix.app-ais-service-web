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
          <span class="status primary">{{ form.statusLabel }}</span>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="供应商编码：" prop="supplierCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.supplierCode"
                    clearable
                    :disabled="!!_id"
                  />
                </el-form-item>
                <el-form-item label="供应商名称：" prop="supplierName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.supplierName"
                    @change="handleSupplierNameChange()"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="拼音简码：">
                  <el-input
                    placeholder="保存后自动生成"
                    v-model="form.pinyinCode"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="供应商简称：" prop="supplierShortName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.supplierShortName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="国家：" prop="countryName">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="CountryEnum"
                    v-model="form.countryCode"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="省市区：" prop="provinceCode" v-if="oem">
                  <el-cascader
                    style="width: 100%"
                    placeholder="请选择省市区"
                    v-model="form.provinceCityCountyCode"
                    :props="orgProps"
                    :options="areaOptions"
                    filterable
                    clearable
                  />
                </el-form-item>
                <el-form-item label="地址：" prop="address" v-if="oem">
                  <el-input
                    placeholder="请输入"
                    v-model="form.address"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="供应商等级：" prop="supplierLevel">
                  <el-input
                    placeholder="请输入"
                    v-model="form.supplierLevel"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="联系人姓名：" prop="contactName" v-if="oem">
                  <el-input
                    placeholder="请输入"
                    v-model="form.contactName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="联系人电话：" prop="contactPhone" v-if="oem">
                  <el-input
                    placeholder="请输入"
                    v-model="form.contactPhone"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="联系人邮箱：" prop="contactEmail" v-if="oem">
                  <el-input
                    placeholder="请输入"
                    v-model="form.contactEmail"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="联系人传真：" prop="contactFax" v-if="oem">
                  <el-input
                    placeholder="请输入"
                    v-model="form.contactFax"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="供应商编码：">
                  {{ form.supplierCode }}
                </el-form-item>
                <el-form-item label="供应商名称：">
                  {{ form.supplierName }}
                </el-form-item>
                <el-form-item label="供应商简称：">
                  {{ form.supplierShortName }}
                </el-form-item>
                <el-form-item label="是否启用：">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="拼音简码：">
                  {{ form.pinyinCode }}
                </el-form-item>
                <el-form-item label="供应商类型：">
                  {{ form.supplierType }}
                </el-form-item>
                <el-form-item label="是否OEM：">
                  {{ form.oemFlagLabel }}
                </el-form-item>
                <el-form-item label="门店名称：">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="供应商等级：">
                  {{ form.supplierLevel }}
                </el-form-item>
                <el-form-item label="供应商安全库存系数：">
                  {{ form.supplierSafetyStock }}
                </el-form-item>
                <el-form-item label="国家：">
                  {{ form.countryName }}
                </el-form-item>
                <el-form-item label="省市区：" v-if="oem">
                  {{ form.provinceName }}{{ form.cityName }}{{ form.districtName }}
                </el-form-item>
                <el-form-item label="详细地址：" v-if="oem">
                  {{ form.address }}
                </el-form-item>
                <el-form-item label="联系人姓名：" v-if="oem">
                  {{ form.contactName }}
                </el-form-item>
                <el-form-item label="联系人电话：" v-if="oem">
                  {{ form.contactPhone }}
                </el-form-item>
                <el-form-item label="联系人邮箱：" v-if="oem">
                  {{ form.contactEmail }}
                </el-form-item>
                <el-form-item label="联系人传真：" v-if="oem">
                  {{ form.contactFax }}
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
        </el-main>
      </edit-base-container>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/sparepart/basic/supplierInfo/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  supplierCode: '',
  supplierName: '',
  supplierShortName: '',
  statusLabel: '',
  pinyinCode: '',
  supplierLevel: '',
  countryCode: 'CN',
  countryName: '中国',
  provinceCityCountyCode: '',
  provinceName: '',
  cityCode: '',
  cityName: '',
  districtCode: '',
  districtName: '',
  address: '',
  fullAddress: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  contactFax: '',
};

export default {
  name: 'supplierInfoEdit',
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
      return '供应商编码：' + (this.form.supplierCode || '');
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '供应商主数据',
      pageType: 'edit',
      moduleKey: 'AISPART-supplierInfo',
      loading: false,
      submitLoading: false,
      info: {},
      yes_no_enum: YES_NO_ENUM,
      oem: false,
      areaOptions: JSON.parse(localStorage.areaTree),
      orgProps: {
        checkStrictly: true,
        emitPath: false,
        label: 'name',
        value: 'code',
        children: 'child'
      },
      form: { ...form },
      originalForm: { ...form },
      rules: {
        supplierCode: [
          { required: true, message: '请输入供应商编码', trigger: 'blur' }
        ],
        supplierName: [
          { required: true, message: '请输入供应商名称', trigger: 'blur' }
        ],
      }
    };
  },
  mounted () {
    this.oem = this.$store.state.pageSource?.aisPageSource.includes('AISPART-sparePart-oem');
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
    handleSupplierNameChange () {
      console.log('handleSupplierNameChange');
      this.form.pinyinCode = this.form.supplierName;
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
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
