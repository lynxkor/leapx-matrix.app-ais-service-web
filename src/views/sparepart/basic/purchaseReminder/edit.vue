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
                <el-form-item label="提醒类别：" prop="reminderCategory">
                  <el-input
                    placeholder="请输入"
                    v-model="form.reminderCategory"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="提醒内容：" prop="reminderContent" class="form-item-full">
                  <el-input
                    type="textarea"
                    maxlength="500"
                    show-word-limit
                    placeholder="请输入"
                    v-model="form.reminderContent"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="提醒类别：">
                  {{ form.reminderCategory }}
                </el-form-item>
                <el-form-item label="提醒内容：" class="form-item-full">
                  {{ form.reminderContent }}
                </el-form-item>
                <el-form-item label="是否启用：">
                  {{ form.statusLabel }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>备件清单</h2>
            </div>
            <div class="common-section-body">
              <div style="display: flex;gap: 8px;">
                <base-search
                  v-if="canAddOrUpdate"
                  style="width: 360px;"
                  :remote-method="queryPartList"
                  remote
                  placeholder="请输入编码或名称"
                  clearable
                  value-key="value"
                  label-key="label"
                  @change="handlePartSelect"
                />
                <el-button
                  v-if="canAddOrUpdate"
                  type="primary"
                  @click="handleImport()"
                  size="small"
                  plain
                >
                  导入零件
                </el-button>
              </div>
              <div class="common-section-table">
                <vxe-table
                  :data="tableData"
                  stripe
                  show-overflow resizable border="inner" size="medium"
                  min-height="0" max-height="400px"
                >
                  <vxe-column field="sparePartCode" title="零件编码">
                    <template #default="{ row }">
                      <el-link type="success" :href="'/service/sparepart/basic/sparePart/edit?id=' + row.sparePartId" target="_blank">{{ row.sparePartCode }}</el-link>
                    </template>
                  </vxe-column>
                  <vxe-column field="sparePartName" title="零件名称"></vxe-column>
                  <vxe-column field="createTime" title="创建时间"></vxe-column>
                  <vxe-column title="操作" width="100" fixed="right" v-if="canAddOrUpdate">
                    <template #default="{ row }">
                      <el-popconfirm
                        title="确认删除该零件吗？"
                        confirm-button-type="danger"
                        confirm-button-text="删除"
                        @confirm="handleDeletePart(row.id)"
                      >
                        <span
                          slot="reference"
                          class="action-button btn-delete"
                        >
                          删除
                        </span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                </vxe-table>
              </div>
            </div>
          </section>
        </el-main>
        <Upload
          :visible="uploadDialogVisible"
          :businessParams="_id"
          id="purchaseReminderPartImport"
          @close="handleUploadDialogClose"
        />
      </edit-base-container>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, getPartDetailPage, addPart, deletePart } from '@/api/sparepart/basic/purchaseReminder/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import BaseSearch from '@/libs/components/BaseSearch';
import { getEnum, sparePartListShort } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import Upload from '@/libs/components/UploadDialog';

const defaultForm = {
  reminderCategory: '',
  reminderContent: '',
  status: '1',
  statusLabel: '',
};

export default {
  name: 'purchaseReminderEdit',
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    BaseSearch,
    EditPageLayout,
    EditBaseContainer,
    Upload
  },
  computed: {
    _id () {
      return this.$route.query.id || this.form.id;
    },
    title () {
      return '提醒类别：' + (this.form.reminderCategory || '');
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '备件采购提醒设置',
      pageType: 'edit',
      moduleKey: 'AISPART-purchaseReminder',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      tableData: [],
      uploadDialogVisible: false,
      rules: {
        reminderCategory: [
          { required: true, message: '请输入提醒类别', trigger: 'blur' }
        ],
        reminderContent: [
          { required: true, message: '请输入提醒内容，最大2000字符', trigger: 'blur' }
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
    },
    queryPartList (queryString) {
      return new Promise(resolve => {
        sparePartListShort({ partCodeLikeOrList: queryString }).then(res => {
          const list = res?.map(item => {
            return {
              ...item,
              value: item.id,
              label: `${item.code} - ${item.name}`,
            };
          }) || [];
          resolve(list);
        });
      });
    },
    handlePartSelect (val, record) {
      if (!record.name) {
        this.$message.warning('该备件未维护名称，请联系管理员');
        return;
      }
      addPart({
        sparePartId: record.id,
        sparePartCode: record.code,
        sparePartName: record.name,
        purchaseReminderId: this._id
      }).then(() => {
        this.$message.success('添加成功');
        this.partDetailPage(this._id);
      });
    },
    async handleDeletePart (val) {
      try {
        await deletePart([val]);
        this.$message.success('删除成功');
        this.partDetailPage(this._id);
      } catch (error) {}
    },
    async partDetailPage (val) {
      if (!val) return;
      const partRes = await getPartDetailPage({
        purchaseReminderId: val
      });
      this.tableData = partRes?.records || [];
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
      this.partDetailPage(this._id);
    },
  },
  mounted () {
    if (this._id) {
      this.partDetailPage(this._id);
    }
  },
  watch: {
    _id: {
      handler (val) {
        if (val) {
          this.partDetailPage(val);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.status.primary {
  color: var(--leap-color-primary);
  font-weight: 500;
}
.common-section-table {
  margin-top: 20px;
}
</style>
