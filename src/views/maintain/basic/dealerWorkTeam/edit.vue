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
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="班组代码：" prop="code">
                  <el-input
                    placeholder="自动生成"
                    v-model="form.code"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="班组名称：" prop="name">
                  <el-input
                    placeholder="请输入"
                    v-model="form.name"
                    maxlength="50"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
                <el-form-item label="班组类型：" prop="teamType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="mc_station_type"
                    v-model="form.teamType"
                    placeholder="请选择"
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
                <el-form-item label="负责人：" prop="ownerUserName">
                  <InputLink
                    v-model="form.ownerUserName"
                    :link="`/partner/user/list/detail?&userId=${form.ownerId}`"
                    placeholder="请输入"
                    readonly
                  />
                </el-form-item>
                <el-form-item label="说明：" prop="remark" class="form-item-full">
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
                <el-form-item label="班组代码：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="班组名称：">
                  {{ form.name }}
                </el-form-item>
                <el-form-item label="班组类型：">
                  {{ form.teamTypeLabel }}
                </el-form-item>
                <el-form-item label="门店名称：">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="负责人：">
                  {{ form.ownerUserName }}
                </el-form-item>
                <el-form-item label="说明：" class="form-item-full">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>维修工程师信息</h2>
              <el-button v-if="canAddOrUpdate && isEditing" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <base-search
                  v-if="canAddOrUpdate"
                  style="width: 360px;"
                  :remote-method="queryUserList"
                  remote
                  placeholder="搜索姓名、工号"
                  clearable
                  value-key="value"
                  label-key="label"
                  @change="handleUserSelect"
                />
              </div>
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="tableData"
                  :defaultNewRow="defaultNewRow"
                  :show-toolbar="false"
                  :options="options"
                  :del-title="delTitle"
                  :enableSingleRowSave="true"
                  @save-row-edit="saveRowEdit"
                  @remove-row="removeRow"
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
import { getDetail, addOrUpdate } from '@/api/maintain/basic/dealerWorkTeam/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import InputLink from '@/libs/components/InputLink';
import BaseSearch from '@/libs/components/BaseSearch';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, getUserByNameOrNo } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  code: '',
  name: '',
  teamType: '',
  teamTypeLabel: '',
  status: '',
  statusLabel: '',
  dealerId: '',
  dealerCode: '',
  dealerName: '',
  ownerId: '',
  ownerUserName: '',
  remark: '',
};

export default {
  name: 'dealerWorkTeamEdit',
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
    EditTable,
    InputLink,
    BaseSearch,
    EditPageLayout,
    EditBaseContainer,
  },
  computed: {
    _id () {
      return this.$route.query.id || this.form.id;
    },
    title () {
      return '班组代码：' + (this.form.code || '');
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '厅店班组信息',
      pageType: 'edit',
      moduleKey: 'AISMC-dealerWorkTeam',
      loading: false,
      submitLoading: false,
      info: {},
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        userName: '',
        userId: '',
        createTime: ''
      },
      tableData: [],
      options: {
        userName: []
      },
      delTitle: '此操作将删除此维修工程师信息，您无法撤销此操作，是否继续？',
      columns: [
        {
          field: 'userName',
          title: '姓名',
          width: '30%',
          editable: true,
          editRender: {
            name: 'ElSelect',
            props: {
              clearable: true,
              filterable: true,
              remote: true,
              'suffix-icon': 'el-icon-search',
              placeholder: '请选择姓名',
              'remote-method': this.querySearchAsync,
            }
          },
          rules: [
            { required: true, message: '姓名不能为空' }
          ]
        },
        {
          field: 'userId',
          title: '工号',
          width: '25%',
          editRender: { name: 'ElInput', props: { type: 'number' } },
          rules: [
            { required: true, message: '工号不能为空' }
          ]
        },
        {
          field: 'createTime',
          title: '创建时间',
          editRender: { name: 'ElInput' }
        },
      ],
      rules: {
        name: [
          { required: true, message: '请输入班组名称', trigger: 'blur' },
          { min: 0, max: 50, message: '最多50个字符', trigger: 'blur' }
        ],
        teamTypeDesc: [
          { required: true, message: '请选择班组类型描述', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择班组状态描述', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择班组状态', trigger: 'change' }
        ],
        teamType: [
          { required: true, message: '请选择班组类型', trigger: 'change' }
        ],
        ownerUserName: [
          { required: true, message: '请选择负责人', trigger: 'blur' }
        ],
      }
    };
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return new Promise((resolve) => {
          getDetail(id).then(res => {
            resolve(res);
            this.tableData = res.userRelations || [];
          }).catch(() => {
            resolve({});
          });
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
      return addOrUpdate({ id: this.form.id, ...this.form, teamUsers: tableData });
    },
    getDefautlForm () {
      const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm,
        ownerId: userInfo.userId,
        ownerUserName: userInfo.userName,
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
      getUserByNameOrNo({ name: queryString }).then(res => {
        const list = res?.map(item => {
          return {
            ...item,
            value: item.userId,
            label: item.username,
            userName: item.username
          };
        }) || [];
        this.options.userName = list;
      });
    },
    handleAddRow () {
      this.$refs.editTable.addRow();
    },
    queryUserList (queryString) {
      return new Promise(resolve => {
        getUserByNameOrNo({ name: queryString }).then(res => {
          const list = res?.map(item => {
            return {
              ...item,
              value: item.userId,
              label: item.username,
              userName: item.username,
              userId: item.userId,
            };
          }) || [];
          resolve(list);
        });
      });
    },
    handleUserSelect (val, record) {
      this.tableData.push({
        ...record,
        id: null,
      });
      addOrUpdate({ ...this.form, teamUsers: this.tableData }).then(res => {
        this.$message.success('添加成功');
      }).catch(e => {
        this.tableData = this.tableData.filter(item => item !== record);
      });
    },
    async saveRowEdit (row, defer) {
      this.submitRequest().then(res => {
        defer.resolve(res);
        this.$message.success('更新成功');
        this.$refs.containerRef.handleRefresh();
      }).catch(e => {
        defer.reject();
      });
    },
    async removeRow (row, index, defer) {
      this.submitRequest().then(res => {
        defer.resolve(res);
        this.$message.success('删除成功');
        this.$refs.containerRef.handleRefresh();
      }).catch(e => {
        defer.reject();
      });
    },
    handleTableChange (tableData) {
      this.tableData = tableData;
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
