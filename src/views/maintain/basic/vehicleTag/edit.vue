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
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="130px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="车辆标识代码：" prop="code">
                  <el-input
                    placeholder="自动生成"
                    v-model="form.code"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车辆标识名称：" prop="name">
                  <el-input
                    placeholder="请输入"
                    v-model="form.name"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="车辆标识代码：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="车辆标识名称：">
                  {{ form.name }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>适配车辆</h2>
              <el-button v-if="canAddOrUpdate && isEditing" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="form.vinList"
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
import { getDetail, addOrUpdate } from '@/api/maintain/basic/vehicleTag/index';
import EditTable from '@/libs/components/EditTable';
import { getEnum, getUserByNameOrNo } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getVehicleProfile } from '@/api/maintain/sp/serviceProxy/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';

const defaultForm = {
  code: '',
  name: '',
  statusDesc: '',
  createTime: '',
  updateTime: '',
  status: '',
  vinList: [],
  statusLabel: '',
};

export default {
  name: 'vehicleTagEdit',
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    EditTable
  },
  computed: {
    _id () {
      return this.$route.query.id || this.form.id;
    },
    title () {
      return '车辆标识代码：' + (this.form.code || '');
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '车辆标识',
      pageType: 'edit',
      moduleKey: 'AISMC-vehicleTag',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      options: {
        vin: []
      },
      delTitle: '此操作将删除此适配车辆信息，您无法撤消此操作，是否继续？',
      columns: [
        {
          field: 'vin',
          title: 'VIN',
          width: '80%',
          editable: true,
          editRender: {
            name: 'ElSelect',
            props: {
              clearable: true,
              filterable: true,
              remote: true,
              'suffix-icon': 'el-icon-search',
              placeholder: '请选择VIN',
              'remote-method': this.querySearchAsync,
            }
          },
          rules: [
            { required: true, message: 'VIN不能为空', trigger: 'blur' }
          ]
        },
      ],
      rules: {
        name: [
          { required: true, message: '请输入车辆标识名称', trigger: 'blur' }
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
    async submitRequest () {
      let tableData = [];
      if (this.$refs.editTable) {
        try {
          tableData = await this.$refs.editTable.saveAll();
        } catch (e) {
          return Promise.reject(e);
        }
      }
      return addOrUpdate({ ...this.form, vinList: tableData });
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
    handleAddRow () {
      this.$refs.editTable.addRow();
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    querySearchAsync (query, cb) {
      if (!query) {
        return;
      }
      getVehicleProfile({ searchVin: query }).then(res => {
        const list = res?.map(item => {
          return {
            value: item.id,
            label: item.vin,
            ...item
          };
        }) || [];
        this.options.vin = list;
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
