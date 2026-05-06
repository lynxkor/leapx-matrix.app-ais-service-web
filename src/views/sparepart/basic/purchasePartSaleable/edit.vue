<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="订单类型：" prop="orderType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="PurchaseOrderTypeEnum"
                    v-model="form.orderType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <!-- <el-form-item label="备件编码：" prop="partCode">
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
                </el-form-item> -->

                <el-form-item label="备件编码：" prop="partCode">
                <fetch-select
                  prop="partCode"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  v-model="form.partCode"
                  :remote-method="getSparePart"
                  labelKey="code"
                  valueKey="code"
                  subLabelKey="name"
                  @change="listSparePartChange"
                />
              </el-form-item>
              <el-form-item label="备件名称：" prop="partName">
                <el-input
                    v-model="form.partName"
                    clearable
                    :disabled="true"
                  />
              </el-form-item>

                <el-form-item label="是否可售：" prop="saleableIs">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.saleableIs"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    type="textarea"
                    show-word-limit
                    maxlength="500"
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="订单类型：" prop="orderType">
                  {{ form.orderTypeLabel }}
                </el-form-item>
                <el-form-item label="备件编码：" prop="partCode">
                  {{ form.partCode }}
                </el-form-item>
                <el-form-item label="备件名称：" prop="partName">
                  {{ form.partName }}
                </el-form-item>
                <el-form-item label="是否可售：" prop="saleableIs">
                  {{ form.saleableIsLabel }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/sparepart/basic/purchasePartSaleable/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, sparePartListShort } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getSparePart } from '@/api/sparepart/basic/sparePart/index';

const defaultForm = {
  // 多选时字段有变化，自行修复
  orderType: '',
  orderTypeLabel: '',
  partCode: '',
  partName: '',
  saleableIs: '',
  remark: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  sparePartId: '',
};

export default {
  name: 'purchasePartSaleableEdit',
  // 集中视图预留
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
    // EditTable,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
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
      pageTitle: '订单类型采购备件设置',
      pageType: 'edit',
      title: '订单类型：' + form.orderTypeLabel,
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-purchasePartSaleable',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      defaultNewRow: {
        name: '',
      },
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      rules: {
        orderType: [
          { required: true, message: '请选择订单类型', trigger: 'change' }
        ],
        partCode: [
          { required: true, message: '请输入备件编码', trigger: 'change' }
        ],
        partName: [
          { required: true, message: '请输入备件名称', trigger: 'change' }
        ],
        saleableIs: [
          { required: true, message: '请输入是否可售', trigger: 'change' }
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源，150:新销服; 老销服:10', trigger: 'change' }
        ],
        sparePartId: [
          { required: true, message: '请输入备件ID', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
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
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 详情表格相关数据
    handleAddRow () {
      // 通过引用直接调用子组件方法
      this.$refs.editTable.addRow();
    },
    handleSaveTable (data) {
      // 调用保存方法并处理结果
      return new Promise((resolve, reject) => {
        this.$refs.editTable.saveAll().then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm
        // ownerId: userInfo.userId,
        // ownerName: userInfo.userName,
      };
    },
    // 审核日志
    // handleJumpAuditLog () {
    //   this.$auditLog.show({ id: 123 });
    // },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    async listSparePart (query) {
      var a = await getSparePart({ partCodeOrNameLike: query });
      return a;
    },
    async getSparePart (query) {
      try {
        const res = await sparePartListShort({ partCodeLikeOrList: query });
        // res.records = res.records?.map(item => ({
        //   ...item,
        //   displayName: item.companyName + `(${item.companyCode})`
        // }));
        return res;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    listSparePartChange (val, all) {
      this.form.sparePartId = all.id;
      this.form.partCode = all.code;
      this.form.partName = all.name;
    }
  }
};
</script>
<style lang="scss" scoped>
  .full-width-item {
    width: 100%;
  }
</style>
