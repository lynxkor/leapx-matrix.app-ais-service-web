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
                <el-form-item label="备件编码：" prop="partCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.partCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备件名称：" prop="partName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.partName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车系名称：" prop="vehicleSeriesName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleSeriesName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车型名称：" prop="vehicleModelName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleModelName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="年款名称：" prop="vehicleYearTypeName">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.vehicleYearTypeName"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-date-picker
                    v-model="form.createTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  <el-date-picker
                    v-model="form.updateTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="主键：" prop="id">
                  <el-input
                    placeholder="请输入"
                    v-model="form.id"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creatorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改者：" prop="modifier">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifier"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifierName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark" class="form-item-full">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statusDesc"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="数据来源：" prop="dataSource" class="form-item-full">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataSource"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备件ID：" prop="sparePartId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.sparePartId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车系ID：" prop="vehicleSeriesId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleSeriesId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车型ID：" prop="vehicleModelId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleModelId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="年款ID：" prop="vehicleYearTypeId">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.vehicleYearTypeId"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" label-width="150px" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="备件编码：">
                  {{ form.partCode }}
                </el-form-item>
                <el-form-item label="备件名称：">
                  {{ form.partName }}
                </el-form-item>
                <el-form-item label="车系名称：">
                  {{ form.vehicleSeriesName }}
                </el-form-item>
                <el-form-item label="车型名称：">
                  {{ form.vehicleModelName }}
                </el-form-item>
                <el-form-item label="年款名称：">
                  {{ form.vehicleYearTypeName }}
                </el-form-item>
                <el-form-item label="创建时间：">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改时间：">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="主键：">
                  {{ form.id }}
                </el-form-item>
                <el-form-item label="创建者：">
                  {{ form.creator }}
                </el-form-item>
                <el-form-item label="创建者名称：">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="修改者：">
                  {{ form.modifier }}
                </el-form-item>
                <el-form-item label="修改者名称：">
                  {{ form.modifierName }}
                </el-form-item>
                <el-form-item label="备注：" class="form-item-full">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="状态：">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="状态变更描述：">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="数据来源：" class="form-item-full">
                  {{ form.dataSource }}
                </el-form-item>
                <el-form-item label="备件ID：">
                  {{ form.sparePartId }}
                </el-form-item>
                <el-form-item label="车系ID：">
                  {{ form.vehicleSeriesId }}
                </el-form-item>
                <el-form-item label="车型ID：">
                  {{ form.vehicleModelId }}
                </el-form-item>
                <el-form-item label="年款ID：">
                  {{ form.vehicleYearTypeId }}
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
import { getDetail, addOrUpdate } from '@/api/sparepart/basic/sparePartVehicleModel/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  partCode: '',
  partName: '',
  vehicleSeriesName: '',
  vehicleModelName: '',
  vehicleYearTypeName: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  remark: '',
  status: '',
  statusLabel: '',
  statusDesc: '',
  dataSource: '',
  sparePartId: '',
  vehicleSeriesId: '',
  vehicleModelId: '',
  vehicleYearTypeId: '',
};

export default {
  name: 'sparePartVehicleModelEdit',
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
      return '备件编码：' + (this.form.partCode || '');
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '备件适用车型',
      pageType: 'edit',
      moduleKey: 'AISPART-sparePartVehicleModel',
      loading: false,
      submitLoading: false,
      info: {},
      form: { ...form },
      originalForm: { ...form },
      rules: {
        partCode: [
          { required: true, message: '请输入备件编码', trigger: 'blur' }
        ],
        partName: [
          { required: true, message: '请输入备件名称', trigger: 'blur' }
        ],
        vehicleSeriesName: [
          { required: true, message: '请输入车系名称', trigger: 'blur' }
        ],
        vehicleModelName: [
          { required: true, message: '请输入车型名称', trigger: 'blur' }
        ],
        vehicleYearTypeName: [
          { required: true, message: '请选择年款名称', trigger: 'change' }
        ],
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
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
