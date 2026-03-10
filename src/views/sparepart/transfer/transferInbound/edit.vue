<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
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
          <span v-if="form.status" class="status primary">{{ form.status }}</span>
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
                <el-form-item label="调拨入库单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="调拨出库单：" prop="transferOutboundCode">
                  {{ form.transferOutboundCode }}
                </el-form-item>
                <el-form-item label="入库门店编码：" prop="inboundDealerCode">
                  {{ form.inboundDealerCode }}
                </el-form-item>
                <el-form-item label="入库门店名称：" prop="inboundDealerName">
                  {{ form.inboundDealerName }}
                </el-form-item>
                <el-form-item label="入库仓库：" prop="inboundWarehouseId">
                  {{ form.inboundWarehouseName }}
                </el-form-item>
                <el-form-item label="出库门店编码：" prop="outboundDealerCode">
                  {{ form.outboundDealerCode }}
                </el-form-item>
                <el-form-item label="出库门店名称：" prop="outboundDealerName">
                  {{ form.outboundDealerName }}
                </el-form-item>
                <el-form-item label="签收人：" prop="signUserName">
                  {{ form.signUserName }}
                </el-form-item>
                <el-form-item label="签收状态：" prop="signStatus">
                  {{ form.signStatus }}
                </el-form-item>
                <el-form-item label="签收时间：" prop="signTime">
                  {{ form.signTime }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="调拨入库单号：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="调拨出库单：" prop="transferOutboundCode">
                  {{ form.transferOutboundCode }}
                </el-form-item>
                <el-form-item label="入库门店编码：" prop="inboundDealerCode">
                  {{ form.inboundDealerCode }}
                </el-form-item>
                <el-form-item label="入库门店名称：" prop="inboundDealerName">
                  {{ form.inboundDealerName }}
                </el-form-item>
                <el-form-item label="入库仓库：" prop="inboundWarehouseId">
                  {{ form.inboundWarehouseName }}
                </el-form-item>
                <el-form-item label="出库门店编码：" prop="outboundDealerCode">
                  {{ form.outboundDealerCode }}
                </el-form-item>
                <el-form-item label="出库门店名称：" prop="outboundDealerName">
                  {{ form.outboundDealerName }}
                </el-form-item>
                <el-form-item label="签收人：" prop="signUserName">
                  {{ form.signUserName }}
                </el-form-item>
                <el-form-item label="签收状态：" prop="signStatus">
                  {{ form.signStatus }}
                </el-form-item>
                <el-form-item label="签收时间：" prop="signTime">
                  {{ form.signTime }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>入库明细</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-table">
                <vxe-table
                  ref="tableRef"
                  stripe
                  :data="tableData"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column field="name" title="名称" min-width="30%" />
                  <vxe-column field="age" title="年龄" min-width="30%" />
                  <vxe-column field="email" title="邮箱" min-width="30%" />
                  <template #empty>
                    <div class="m-vxe-table-empty-text">{{emptyText}}</div>
                  </template>
                </vxe-table>
              </div>
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
import { getDetail, addOrUpdate } from '@/api/sparepart/transfer/transferInbound/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  code: '',
  transferOutboundCode: '',
  inboundDealerCode: '',
  inboundDealerName: '',
  inboundWarehouseId: '',
  outboundDealerCode: '',
  outboundDealerName: '',
  signStatus: '',
  remark: '',
  createTime: '',
  updateTime: '',
  signTime: '',
};

export default {
  name: 'transferInboundEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '调拨入库单号：' + this.form.code;
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
      pageTitle: '备件调拨入库',
      pageType: 'edit',
      moduleKey: 'AISPART-transferInbound',
      loading: false,
      submitLoading: false,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [],
      rules: {
        remark: [
          { required: false, message: '请输入备注', trigger: 'change' }
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
    },
    submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    openPane () {
      this.$refs.editLayout.openPane();
    },
    queryListData (queryString) {
      return new Promise(resolve => {
        resolve([]);
      });
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
