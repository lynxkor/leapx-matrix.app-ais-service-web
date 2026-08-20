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
                <el-form-item label="优惠代码：" prop="code">
                  <el-input
                    placeholder="自动生成"
                    v-model="form.code"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="优惠名称：" prop="name">
                  <el-input
                    placeholder="请输入"
                    v-model="form.name"
                    clearable
                    maxLength="50"
                    show-word-limit
                  />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <InputLink
                    v-model="form.dealerName"
                    :link="`/service/datacenter/store/store/detail?storeCode=${form.dealerCode}`"
                    placeholder="请输入"
                    readonly
                  />
                </el-form-item>
                <el-form-item label="工时折扣率：" prop="discountWorkhourRate">
                  <el-input
                    type="number"
                    placeholder="请输入"
                    v-model="form.discountWorkhourRate"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备件折扣率：" prop="discountPartRate">
                  <el-input
                    type="number"
                    placeholder="请输入"
                    v-model="form.discountPartRate"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="优惠代码：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="优惠名称：">
                  {{ form.name }}
                </el-form-item>
                <el-form-item label="门店名称：">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="工时折扣率：">
                  {{ form.discountWorkhourRate }}
                </el-form-item>
                <el-form-item label="备件折扣率：">
                  {{ form.discountPartRate }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>可使用对象</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <el-button v-if="canAddOrUpdate" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
              </div>
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
                  enableSingleRowSave
                  @save-row-edit="handleSaveRowEdit"
                  @remove-row="handleRemoveRow"
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
import { getDetail, addOrUpdate } from '@/api/maintain/basic/dealerDiscount/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditTable from '@/libs/components/EditTable';
import InputLink from '@/libs/components/InputLink';
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
  dealerName: '',
  dealerCode: '',
  discountWorkhourRate: '',
  discountPartRate: '',
  statusLabel: '',
};

export default {
  name: 'dealerDiscountEdit',
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
      return '优惠名称：' + (this.form.name || '');
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '门店优惠模式',
      pageType: 'edit',
      moduleKey: 'AISMC-dealerDiscount',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        userName: '',
        createTime: ''
      },
      tableData: [],
      options: {
        userName: [],
      },
      delTitle: '此操作将删除此可使用对象信息，您无法撤消此操作，是否继续？',
      columns: [
        {
          field: 'userName',
          title: '账号',
          width: '45%',
          editable: true,
          editRender: {
            name: 'ElSelect',
            props: {
              clearable: true,
              filterable: true,
              remote: true,
              'suffix-icon': 'el-icon-search',
              placeholder: '请选择账号',
              'remote-method': this.querySearchAsync,
            }
          },
          rules: [
            { required: true, message: '账号不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '45%',
          editRender: { name: 'ElInput' }
        }
      ],
      rules: {
        name: [
          { required: true, message: '请输入优惠名称', trigger: 'blur' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'blur' }
        ],
        discountWorkhourRate: [
          { required: true, message: '请输入工时折扣率：介入0-1之间，包含0、1', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              const numValue = Number(value);
              if (value === '' || value === null || value === undefined) {
                callback(new Error('请输入工时折扣率'));
                return;
              }
              if (isNaN(numValue)) {
                callback(new Error('请输入有效的数字'));
                return;
              }
              if (numValue < 0 || numValue > 1) {
                callback(new Error('工时折扣率必须在0-1之间'));
                return;
              }
              const strValue = value.toString();
              if (strValue.includes('.')) {
                const decimalPart = strValue.split('.')[1];
                if (decimalPart.length > 2) {
                  callback(new Error('工时折扣率最多只能有两位小数'));
                  return;
                }
              }
              callback();
            }
          }
        ],
        discountPartRate: [
          { required: true, message: '请输入备件折扣率：介入0-1之间，包含0、1', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              const numValue = Number(value);
              if (value === '' || value === null || value === undefined) {
                callback(new Error('请输入备件折扣率'));
                return;
              }
              if (isNaN(numValue)) {
                callback(new Error('请输入有效的数字'));
                return;
              }
              if (numValue < 0 || numValue > 1) {
                callback(new Error('备件折扣率必须在0-1之间'));
                return;
              }
              const strValue = value.toString();
              if (strValue.includes('.')) {
                const decimalPart = strValue.split('.')[1];
                if (decimalPart.length > 2) {
                  callback(new Error('备件折扣率最多只能有两位小数'));
                  return;
                }
              }
              callback();
            }
          }
        ],
      }
    };
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          this.tableData = res.dealerUserDiscountRespList || [];
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
        delete formData.dealerUserDiscountRespList;
      }
      return addOrUpdate({ ...formData, dealerUserDiscountAddOrUpdateReqs: tableData });
    },
    handleAddRow () {
      this.$refs.editTable.addRow();
    },
    async handleSaveRowEdit (row, defer) {
      try {
        const formData = { ...this.form };
        if (this._id) {
          delete formData.dealerUserDiscountRespList;
        }
        const tableData = this.$refs.editTable.getData();
        await addOrUpdate({ ...formData, dealerUserDiscountAddOrUpdateReqs: tableData });
        this.$message.success('保存成功');
        this.$refs.containerRef.handleRefresh();
        defer.resolve(row.id);
      } catch (e) {
        this.$message.error('保存失败');
        defer.reject();
      }
    },
    async handleRemoveRow (row, index, defer) {
      try {
        const formData = { ...this.form };
        if (this._id) {
          delete formData.dealerUserDiscountRespList;
        }
        const tableData = this.$refs.editTable.getData();
        await addOrUpdate({ ...formData, dealerUserDiscountAddOrUpdateReqs: tableData });
        this.$message.success('删除成功');
        this.$refs.containerRef.handleRefresh();
        defer.resolve();
      } catch (e) {
        this.$message.error('删除失败');
        defer.reject();
      }
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
      getUserByNameOrNo({ name: queryString }).then(res => {
        const list = res?.map(item => {
          let label = item.username || '';
          if (item.empNo) {
            label += `- ${item.empNo}`;
          }
          return {
            ...item,
            value: item.userId,
            label: label,
            userName: item.username
          };
        }) || [];
        this.options.userName = list;
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
