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
              <!-- <el-button v-if="canAddOrUpdate && isEditing" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button> -->
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <base-search
                  v-if="canAddOrUpdate"
                  style="width: 360px;"
                  :remote-method="queryVinList"
                  remote
                  placeholder="搜索VIN码"
                  clearable
                  value-key="value"
                  label-key="label"
                  @change="handleVinSelect"
                />
              </div>
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="vinTableData"
                  :loading="vinLoading"
                  :show-pagination="true"
                  :total="vinTotal"
                  :current-page="vinPageNum"
                  :page-size="vinPageSize"
                  :show-toolbar="false"
                  :delTitle="delTitle"
                  :defaultNewRow="{}"
                  @remove-row="removeRow"
                  @current-page-change="onVinPageChange"
                  @page-size-change="onVinPageSizeChange"
                  :auth="{ delete: canDelete }"
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
import { getDetail, addOrUpdate, getVinList, addOrUpdateVin, deleteVin } from '@/api/maintain/basic/vehicleTag/index';
import EditTable from '@/libs/components/EditTable';
import BaseSearch from '@/libs/components/BaseSearch';
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
    EditTable,
    BaseSearch
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
      // VIN 子表分页(独立接口 getVinList)
      vinLoading: false,
      vinTableData: [],
      vinPageNum: 1,
      vinPageSize: 10,
      vinTotal: 0,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      delTitle: '此操作将删除此适配车辆信息，您无法撤消此操作，是否继续？',
      columns: [
        {
          field: 'vin',
          title: 'VIN',
        },
      ],
      rules: {
        name: [
          { required: true, message: '请输入车辆标识名称', trigger: 'blur' }
        ],
      }
    };
  },
  mounted () {
    if (this._id) {
      this.loadVinList();
    }
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
      // 基础信息保存:VIN 由独立接口分页管理,不再随表单提交
      const payload = { ...this.form };
      delete payload.vinList;
      return addOrUpdate(payload);
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
    queryVinList (query) {
      return new Promise(resolve => {
        getVehicleProfile({ searchVin: query }).then(res => {
          const list = res?.map(item => {
            return {
              ...item,
              value: item.id,
              label: item.vin,
              vin: item.vin,
            };
          }) || [];
          resolve(list);
        });
      });
    },
    handleVinSelect (val, record) {
      // 新增单条 VIN:vehicleTagId + vin
      addOrUpdateVin({ vehicleTagId: this._id, vin: record.vin })
        .then(() => {
          this.$message.success('添加成功');
          this.loadVinList();
        })
        .catch(() => {});
    },
    removeRow (row, index, defer) {
      // 按 VIN 记录 id 删除(接口支持批量,这里单条)
      deleteVin([row.id])
        .then(res => {
          defer.resolve(res);
          this.$message.success('删除成功');
          this.loadVinList();
        })
        .catch(() => defer.reject());
    },
    loadVinList () {
      if (!this._id) return;
      this.vinLoading = true;
      getVinList({
        vehicleTagId: this._id,
        pageNum: this.vinPageNum,
        pageSize: this.vinPageSize,
      }).then(res => {
        this.vinTableData = (res && res.records) || [];
        this.vinTotal = (res && res.total) || 0;
      }).finally(() => {
        this.vinLoading = false;
      });
    },
    onVinPageChange (page) {
      this.vinPageNum = page;
      this.loadVinList();
    },
    onVinPageSizeChange (size) {
      this.vinPageSize = size;
      this.vinPageNum = 1;
      this.loadVinList();
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
