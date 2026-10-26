<template>
  <edit-page-layout ref="editLayout" title="新车质量反馈设置" showPaneFooter>
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
      >
        <template #status>
        </template>
        <template #extraButtons>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="配置编码：" prop="code">
                  <el-input
                    placeholder="新增自动生成"
                    v-model="form.code"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="车系：" prop="vehSeriesId">
                  <list-select
                    listUrl="/datacenter/web/materials/vehicleSeries/list"
                    placeholder="请选择"
                    v-model="form.vehSeriesId"
                    query-key="seriesNameLike"
                    auto-load-options
                    no-param-load
                    clearable
                    filterable
                    :disabled="Boolean(_id)"
                    :params="{}"
                    @change="handleSeriesChange"
                  />
                </el-form-item>
                <el-form-item label="车型：" prop="vehModelId">
                  <list-select
                    v-if="!$route.query.id || form.id"
                    listUrl="/datacenter/web/materials/vehicleModel/list"
                    placeholder="请选择，留空表示全车型"
                    v-model="form.vehModelId"
                    query-key="modelNameLike"
                    auto-load-options
                    collapseTags
                    clearable
                    filterable
                    :disabled="Boolean(_id)"
                    :params="{seriesIdList: form.vehSeriesId ? [form.vehSeriesId] : []}"
                    @change="handleModelChange"
                  />
                </el-form-item>
                <el-form-item label="年款：" prop="vehYearTypeId">
                  <list-select
                    listUrl="/datacenter/web/materials/vehicleYearType/list"
                    placeholder="请选择"
                    v-model="form.vehYearTypeId"
                    query-key="yearTypeNameLike"
                    collapseTags
                    auto-load-options
                    no-param-load
                    clearable
                    filterable
                    :disabled="Boolean(_id)"
                    :params="{}"
                    @change="handleYearChange"
                  />
                </el-form-item>
                <el-form-item label="上市时间：" prop="launchDate">
                  <el-date-picker
                    v-model="form.launchDate"
                    type="date"
                    placeholder="请选择"
                    value-format="yyyy-MM-dd"
                    align="right"
                    :picker-options="pickerOptions"
                  />
                </el-form-item>
                <el-form-item label="新车期（月）：" prop="newCarPeriod">
                  <el-input-number
                    v-model="form.newCarPeriod"
                    :min="1"
                    :max="24"
                    :precision="0"
                    :controls="false"
                    placeholder="请输入"
                    @input="handleNewCarPeriodInput"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    type="textarea"
                    :rows="3"
                    maxlength="100"
                    show-word-limit
                    placeholder="请输入"
                    v-model="form.remark"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="配置编码：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="车系：" prop="vehSeriesName">
                  {{ form.vehSeriesName }}
                </el-form-item>
                <el-form-item label="车型：" prop="vehModelName">
                  {{ form.vehModelName || '全车型' }}
                </el-form-item>
                <el-form-item label="年款：" prop="vehYearTypeName">
                  {{ form.vehYearTypeName }}
                </el-form-item>
                <el-form-item label="上市时间：" prop="launchDate">
                  {{ form.launchDate }}
                </el-form-item>
                <el-form-item label="新车期（月）：" prop="newCarPeriod">
                  {{ form.newCarPeriod }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="备注说明：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="创建人：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改人：" prop="modifierName">
                  {{ form.modifierName }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
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
import { getDetail, addOrUpdate } from '@/api/maintain/basic/newCarQualityConfig/index';
import ListSelect from '@/libs/components/list-select/index.vue';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import EditPageLayout from '@/libs/components/EditPageLayout';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  code: '',
  vehSeriesId: '',
  vehSeriesName: '',
  vehModelId: '',
  vehModelName: '',
  vehYearTypeId: '',
  vehYearTypeName: '',
  launchDate: '',
  newCarPeriod: undefined,
  remark: '',
  statusDesc: '',
  status: '',
  statusLabel: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  createTime: '',
  updateTime: '',
};

export default {
  name: 'newCarQualityConfigEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    ListSelect,
    EditBaseContainer,
    EditPageLayout
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '编码：' + (this.form.code || '新增');
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
      pageTitle: '新车质量反馈设置',
      pageType: 'edit',
      moduleKey: 'AISMC-newCarQualityConfig',
      loading: false,
      submitLoading: false,
      // 上市时间只能选择今天及之前的日期
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      form: { ...form },
      originalForm: { ...form },
      rules: {
        vehSeriesId: [
          { required: true, message: '请选择车系', trigger: 'change' }
        ],
        vehYearTypeId: [
          { required: true, message: '请选择年款', trigger: 'change' }
        ],
        launchDate: [
          { required: true, message: '请选择上市时间', trigger: 'change' }
        ],
        newCarPeriod: [
          { required: true, message: '请输入新车期（月）', trigger: 'change' }
        ]
      }
    };
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
      return {
        ...defaultForm
      };
    },
    // 新车期输入有效数据后立即清除下方校验提示
    handleNewCarPeriodInput (val) {
      if (val !== undefined && val !== null && val !== '') {
        this.$refs.ruleForm.clearValidate('newCarPeriod');
      }
    },
    // 车系变化：回填车系名称并联动清空车型
    handleSeriesChange (val, record) {
      this.form.vehSeriesName = record ? record.name : '';
      if (!val) {
        this.form.vehSeriesName = '';
      }
      this.form.vehModelId = '';
      this.form.vehModelName = '';
    },
    // 车型变化：回填车型名称（留空表示全车型）
    handleModelChange (val, record) {
      if (record) {
        this.form.vehModelName = record.name;
      } else {
        this.form.vehModelName = '';
      }
    },
    // 年款变化：回填年款名称
    handleYearChange (val, record) {
      if (record) {
        this.form.vehYearTypeName = record.name;
      } else {
        this.form.vehYearTypeName = '';
      }
    }
  }
};
</script>