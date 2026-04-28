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
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="工位代码：" prop="code">
                  <el-input
                    placeholder="自动生成"
                    v-model="form.code"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="工位名称：" prop="name">
                  <el-input
                    placeholder="请输入"
                    v-model="form.name"
                    maxlength="50"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
                <el-form-item label="工位类型：" prop="stationType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="mc_station_type"
                    v-model="form.stationType"
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
                    clearable
                    rows="3"
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="工位代码：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="工位名称：">
                  {{ form.name }}
                </el-form-item>
                <el-form-item label="工位类型：">
                  {{ form.stationTypeLabel }}
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
        </el-main>
      </edit-base-container>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/maintain/basic/dealerStation/index';
import FetchSelect from '@/libs/components/FetchSelect';
import InputLink from '@/libs/components/InputLink';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  remark: '',
  status: '',
  code: '',
  name: '',
  stationType: '',
  stationTypeLabel: '',
  dealerId: '',
  dealerCode: '',
  dealerName: '',
  ownerId: '',
  ownerUserName: '',
  statusLabel: '',
};

export default {
  name: 'dealerStationEdit',
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
    InputLink,
    EditPageLayout,
    EditBaseContainer,
  },
  computed: {
    _id () {
      return this.$route.query.id || this.form.id;
    },
    title () {
      return '工位代码：' + (this.form.code || '');
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '厅店工位信息',
      pageType: 'edit',
      moduleKey: 'AISMC-dealerStation',
      loading: false,
      submitLoading: false,
      info: {},
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        name: [
          { required: true, message: '请输入工位名称', trigger: 'blur' }
        ],
        stationType: [
          { required: true, message: '请选择工位类型', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请选择门店名称', trigger: 'blur' }
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
        return getDetail(id);
      }
      return {};
    },
    submitRequest () {
      return addOrUpdate({ id: this.form.id, ...this.form });
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
