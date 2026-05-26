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
                <el-form-item label="价格设置代码：" prop="code">
                  <el-input
                    placeholder="自动生成"
                    v-model="form.code"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <InputLink
                    v-model="form.dealerName"
                    :link="`/partner/channelManagement/shopDetail?dealerCode=${form.dealerCode}`"
                    placeholder="请输入"
                    readonly
                  />
                </el-form-item>
                <el-form-item label="工时单价：" prop="workhourPrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.workhourPrice"
                    type="number"
                    min="0"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="价格设置代码：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="门店名称：">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="工时单价：">
                  {{ form.workhourPrice }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>特殊价格</h2>
              <el-button v-if="canAddOrUpdate && isEditing" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="tableData"
                  :defaultNewRow="defaultNewRow"
                  :show-toolbar="false"
                  :options="options"
                  :delTitle="delTitle"
                  :auth="{edit: canAddOrUpdate, delete: canDelete}"
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
import { getDetail, addOrUpdate } from '@/api/maintain/basic/dealerWorkhourPriceSetting/index';
import EditTable from '@/libs/components/EditTable';
import InputLink from '@/libs/components/InputLink';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listVehicleYearTypeFull } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  code: '',
  dealerName: '',
  dealerCode: '',
  workhourPrice: '',
  statusLabel: '',
};

export default {
  name: 'dealerWorkhourPriceSettingEdit',
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditTable,
    InputLink,
    EditPageLayout,
    EditBaseContainer,
  },
  computed: {
    _id () {
      return this.$route.query.id || this.form.id;
    },
    title () {
      return '价格设置代码：' + (this.form.code || '');
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '工时价格设置',
      pageType: 'edit',
      moduleKey: 'AISMC-dealerWorkhourPriceSetting',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        vehicleModelName: '',
        workhourPrice: null,
        createTime: '',
      },
      tableData: [],
      options: {
        vehicleModelName: []
      },
      delTitle: '此操作将删除此特殊价格信息，您无法撤消此操作，是否继续？',
      columns: [
        {
          field: 'vehicleModelName',
          title: '基本车型',
          width: '27%',
          editable: true,
          editRender: {
            name: 'ElSelect',
            props: {
              clearable: true,
              filterable: true,
              remote: true,
              'suffix-icon': 'el-icon-search',
              placeholder: '请选择基本车型',
              'remote-method': this.querySearchAsync,
            }
          },
          rules: [
            { required: true, message: '基本车型不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'workhourPrice',
          title: '工时单价',
          editable: true,
          width: '27%',
          editRender: { name: 'ElInput', props: { type: 'number', min: 0 } },
          rules: [
            { required: true, message: '工时单价不能为空', trigger: 'blur' },
          ]
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '27%',
          editRender: { name: 'ElInput' }
        },
      ],
      rules: {
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'blur' }
        ],
        workhourPrice: [
          { required: true, message: '请输入工时单价', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === '' || value === undefined || value === null) {
                callback();
                return;
              }
              if (isNaN(Number(value))) {
                callback(new Error('请输入有效的数字'));
                return;
              }
              if (Number(value) < 0) {
                callback(new Error('工时单价不能小于0'));
                return;
              }
              const strValue = value.toString();
              if (strValue.includes('.')) {
                const decimalPart = strValue.split('.')[1];
                if (decimalPart.length > 2) {
                  callback(new Error('最多只能输入两位小数'));
                  return;
                }
              }
              callback();
            },
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          this.tableData = res.modelWorkhourPriceRespList || [];
          return res;
        });
      }
      return {};
    },
    async submitRequest () {
      let tableData = [];
      if (this.$refs.editTable) {
        try {
          tableData = await this.$refs.editTable.saveAll();
        } catch (e) {
          return Promise.reject(e);
        }
      }
      const formData = { ...this.form };
      if (this._id) {
        delete formData.modelWorkhourPriceRespList;
      }
      return addOrUpdate({ ...formData, modelWorkhourPriceList: tableData });
    },
    handleAddRow () {
      this.$refs.editTable.addRow();
    },
    getDefautlForm () {
      const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm,
        ownerId: userInfo.userId,
        ownerName: userInfo.userName,
        dealerName: userInfo.orgPostUserList.find(item => item.position === '1')?.orgName,
      };
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    querySearchAsync (queryString, cb) {
      listVehicleYearTypeFull({ modelNameLike: queryString, status: 1, pageSize: 1000 }).then(res => {
        const list = res?.map(item => {
          return {
            ...item,
            value: item.id,
            label: item.modelName,
            vehicleModelName: item.modelName,
            vehicleModelId: item.id,
          };
        }) || [];
        this.options.vehicleModelName = list;
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.status.primary {
  color: var(--leap-color-primary);
  font-weight: 500;
}
</style>
