<template>
  <!-- TIPS: 如果填写项大于15项，使用类名page-common-edit替换page-common-add -->
  <edit-page-layout ref="editLayout" title="" >
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="`政策名称：${form.policyName}`"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template>
          <el-main>
            <section class="common-section">
              <div class="common-section-header">
                <h2>基础信息</h2>
              </div>
              <div class="common-section-body">
                <!-- TIPS: 如果填写项大于15项，加上 :inline="true" -->
                <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
                <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                  <el-form-item label="政策名称：" prop="policyName">
                    <el-input
                      placeholder="请输入"
                      v-model="form.policyName"
                      maxlength="100"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="车系：" prop="seriesId">
                    <list-select
                      listUrl="/datacenter/web/materials/vehicleSeries/list"
                      placeholder="请选择"
                      v-model="form.seriesId"
                      query-key="seriesNameLike"
                      auto-load-options
                      no-param-load
                      clearable
                      filterable
                      :disabled="Boolean(_id)"
                      :params="{}" />
                  </el-form-item>
                  <el-form-item label="车型：" prop="modelId">
                    <list-select
                      listUrl="/datacenter/web/materials/vehicleModel/list"
                      placeholder="请选择"
                      v-model="form.modelId"
                      query-key="modelNameLike"
                      :disabled="Boolean(_id)"
                      auto-load-options
                      collapseTags
                      clearable
                      filterable
                      :params="{seriesIdList: form.seriesId?[form.seriesId]:[]}" />
                  </el-form-item>
                  <el-form-item label="车辆年款：" prop="yearTypeId">
                    <list-select
                      listUrl="/datacenter/web/materials/vehicleYearType/list"
                      placeholder="请选择"
                      v-model="form.yearTypeId"
                      :disabled="Boolean(_id)"
                      query-key="yearTypeNameLike"
                      collapseTags
                      auto-load-options
                      no-param-load
                      filterable
                      :params="{}" />
                  </el-form-item>
                  <el-form-item label="车辆属性：" prop="vehicleProperty">
                    <fetch-select
                      :request="fetchOptions"
                      enumCode="claim_vehicle_property"
                      v-model="form.vehicleProperty"
                      :disabled="Boolean(_id)"
                      placeholder="请选择"
                      clearable
                      filterable
                    />
                  </el-form-item>
                  <el-form-item label="里程数（KM）：" prop="mileage">
                    <el-input-number
                      placeholder="请输入"
                      v-model="form.mileage"
                      :controls="false"
                      :precision="0"
                      :min="0"
                      :max="999999999"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="保修期（月）：" prop="warrantyPeriod">
                    <el-input-number
                      placeholder="请输入"
                      v-model="form.warrantyPeriod"
                      :controls="false"
                      :precision="0"
                      :min="0"
                      :max="999999999"
                      clearable
                    />
                  </el-form-item>
                  <el-form-item label="备注：" prop="remark">
                    <el-input
                      type="textarea"
                      placeholder="请输入"
                      v-model="form.remark"
                      maxlength="500"
                      show-word-limit
                      clearable
                    />
                  </el-form-item>
                </el-form>
                <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                  <el-form-item label="政策名称：" prop="policyName">
                    {{ form.policyName }}
                  </el-form-item>
                  <el-form-item label="车系：" prop="seriesName">
                    <el-link
                      v-if="form.seriesId"
                      type="primary"
                      :href="`/sales/datacenter/materials/vehicleSeries/edit?id=${form.seriesId}`"
                      target="_blank"
                    >{{ form.seriesName }}</el-link>
                    <span v-else>{{ form.seriesName }}</span>
                  </el-form-item>
                  <el-form-item label="车型：" prop="modelName">
                    <el-link
                      v-if="form.modelId"
                      type="primary"
                      :href="`/sales/datacenter/materials/vehicleModel/edit?id=${form.modelId}`"
                      target="_blank"
                    >{{ form.modelName }}</el-link>
                    <span v-else>{{ form.modelName }}</span>
                  </el-form-item>
                  <el-form-item label="车辆年款：" prop="yearTypeName">
                    {{ form.yearTypeName }}
                  </el-form-item>
                  <el-form-item label="车辆属性：" prop="vehiclePropertyLabel">
                    {{ form.vehiclePropertyLabel }}
                  </el-form-item>
                  <el-form-item label="里程数（KM）：" prop="mileage">
                    {{ form.mileage }}
                  </el-form-item>
                  <el-form-item label="保修期（月）：" prop="warrantyPeriod">
                    {{ form.warrantyPeriod }}
                  </el-form-item>
                  <el-form-item label="备注：" prop="remark">
                    {{ form.remark }}
                  </el-form-item>
                </el-form>
              </div>
            </section>
          </el-main>
       </template>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/claimreturn/claim/basic/vehicleWarrantyPolicy';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import ListSelect from '@/libs/components/list-select/index.vue';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import EditPageLayout from '@/libs/components/EditPageLayout';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  policyName: '',
  seriesName: '',
  modelName: '',
  yearTypeName: '',
  vehicleProperty: '',
  mileage: '',
  warrantyPeriod: '',
  remark: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  seriesId: '',
  modelId: '',
  yearTypeId: '',
};

export default {
  name: 'vehicleWarrantyPolicyEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
    showBackBtn: {
      type: Boolean,
      default: true,
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    ListSelect,
    FetchSelect,
    EditBaseContainer,
    EditPageLayout,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '整车保修政策设置',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-vehicleWarrantyPolicy',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        policyName: [
          { required: true, message: '请输入政策名称', trigger: 'blur' }
        ],
        vehicleProperty: [
          { required: true, message: '请输入车辆属性', trigger: 'blur' }
        ],
        mileage: [
          { required: true, message: '请输入里程数（KM）', trigger: 'blur' }
        ],
        warrantyPeriod: [
          { required: true, message: '请选择保修期（月）', trigger: 'change' }
        ],
        seriesId: [
          { required: true, message: '请输入车系', trigger: 'blur' }
        ]
      }
    };
  },
  mounted () {
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm
        // ownerId: userInfo.userId,
        // ownerName: userInfo.userName,
      };
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
