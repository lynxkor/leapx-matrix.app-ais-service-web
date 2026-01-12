<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="`门店回运单号：${form.returnOrderNo}`"
        :isEditing.sync="isEditing"
        :form.sync="form"
        direction="horizontal"
        :showBackBtn="showBackBtn"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-if="isEditing || !_id">
                <el-form-item label="门店回运单号：" prop="returnOrderNo">
                  <base-input
                    placeholder="请输入"
                    v-model="form.returnOrderNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="回运状态：" prop="returnStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="old_part_return_order_status"
                    v-model="form.returnStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="旧件返回类型：" prop="returnType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="old_part_return_type"
                    v-model="form.returnType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <base-input
                    placeholder="请输入"
                    v-model="form.dealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="回运地址：" prop="receiverAddress">
                  <base-input
                    placeholder="请输入"
                    v-model="form.receiverAddress"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="回运日期：" prop="returnDate">
                  <el-date-picker
                    v-model="form.returnDate"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="收货联系人：" prop="receiverContact">
                  <base-input
                    placeholder="请输入"
                    v-model="form.receiverContact"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="收货电话：" prop="receiverPhone">
                  <base-input
                    placeholder="请输入"
                    v-model="form.receiverPhone"
                    clearable
                    maxlength="11"
                  />
                </el-form-item>
                <el-form-item label="回运件数（纸箱/木架）：" prop="returnUnit">
                  <base-input
                    placeholder="请输入"
                    v-model="form.returnUnit"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="物流商：" prop="logisticsCompany">
                  <base-input
                    placeholder="请输入"
                    v-model="form.logisticsCompany"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="物流单号：" prop="logisticsTrackingNo">
                  <base-input
                    placeholder="请输入"
                    v-model="form.logisticsTrackingNo"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否验收完成：" prop="isChecked">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="BooleanEnum"
                    v-model="form.isChecked"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="签收日期：" prop="signReceiveDate">
                  <el-date-picker
                    v-model="form.signReceiveDate"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="预计到达日期：" prop="estimatedArrivalDate">
                  <el-date-picker
                    v-model="form.estimatedArrivalDate"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
                <el-form-item class="form-item-full" label="备注：" prop="remark">
                  <base-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                    maxlength="1000"
                    type="textarea"
                  />
                </el-form-item>
                <el-form-item class="form-item-full" label="签收备注：" prop="signRemark">
                  <base-input
                    placeholder="请输入"
                    v-model="form.signRemark"
                    clearable
                    maxlength="1000"
                    type="textarea"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-else>
                <el-form-item label="门店回运单号：" prop="returnOrderNo">
                  {{ form.returnOrderNo }}
                </el-form-item>
                <el-form-item label="回运状态：" prop="returnStatus">
                  {{ form.returnStatus }}
                </el-form-item>
                <el-form-item label="旧件返回类型：" prop="returnType">
                  {{ form.returnType }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="回运地址：" prop="receiverAddress">
                  {{ form.receiverAddress }}
                </el-form-item>
                <el-form-item label="回运日期：" prop="returnDate">
                  {{ form.returnDate }}
                </el-form-item>
                <el-form-item label="收货联系人：" prop="receiverContact">
                  {{ form.receiverContact }}
                </el-form-item>
                <el-form-item label="收货电话：" prop="receiverPhone">
                  {{ form.receiverPhone }}
                </el-form-item>
                <el-form-item label="回运件数（纸箱/木架）：" prop="returnUnit">
                  {{ form.returnUnit }}
                </el-form-item>
                <el-form-item label="物流商：" prop="logisticsCompany">
                  {{ form.logisticsCompany }}
                </el-form-item>
                <el-form-item label="物流单号：" prop="logisticsTrackingNo">
                  {{ form.logisticsTrackingNo }}
                </el-form-item>
                <el-form-item label="是否验收完成：" prop="isChecked">
                  {{ form.isChecked == '1' ? '是' : '否' }}
                </el-form-item>
                <el-form-item label="签收日期：" prop="signReceiveDate">
                  {{ form.signReceiveDate }}
                </el-form-item>
                <el-form-item label="预计到达日期：" prop="estimatedArrivalDate">
                  {{ form.estimatedArrivalDate }}
                </el-form-item>
                <el-form-item class="form-item-full" label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item class="form-item-full" label="签收备注：" prop="signRemark">
                  {{ form.signRemark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section">
            <div class="common-section-header">
              <h2>区块标题</h2>
              <el-button v-if="canAddOrUpdate" size="small" @click="handleAddRow"><i class="iconfont icon-lxppc-plus"></i>添加</el-button>
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
                  :auth="{edit: canAddOrUpdate, delete: canDelete}"
                />
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
import { getDetail, addOrUpdate } from '@/api/claimreturn/oldpart/returnorder';
import FetchSelect from '@/libs/components/FetchSelect/index.vue';
import EditTable from '@/libs/components/EditTable/index.vue';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import EditBaseContainer from '@/components/EditBaseContainer';
import EditPageLayout from '@/libs/components/EditPageLayout';
import BaseInput from '@/libs/components/BaseInput/index.vue';

const defaultForm = {
  // 多选时字段有变化，自行修复
  returnOrderNo: '',
  dealerName: '',
  dealerCode: '',
  returnStatus: '10', // 10 草稿; 20待回运; 30 已回运; 40 已签收
  isChecked: '',
  returnDate: '',
  returnType: '',
  receiverAddress: '',
  receiverContact: '',
  logisticsTrackingNo: '',
  logisticsCompany: '',
  estimatedArrivalDate: '',
  returnUnit: '',
  signReceiveDate: '',
  createTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusDesc: '',
  dataSource: '',
  warrantyMonth: '',
  receiverPhone: '',
  signRemark: '',
};

export default {
  name: 'ReturnOrderEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
    showBackBtn: {
      type: Boolean,
      default: true,
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditTable,
    FetchSelect,
    EditBaseContainer,
    BaseInput,
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
      pageTitle: '旧件快返回运单',
      pageType: 'edit',
      // TIPS: 权限前缀 AISCR，根据实际情况修改
      moduleKey: 'AISCR-fastReturnOrder',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      defaultNewRow: {
        name: '',
      },
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'name',
          title: '姓名',
          width: '33%',
          editable: true,
          editRender: { name: 'ElInput' },
          rules: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'age',
          title: '年龄',
          editable: true,
          width: '33%',
          editRender: { name: 'ElInput', props: { type: 'number' } }
        },
        {
          field: 'email',
          title: '邮箱',
          width: '33%',
          editRender: { name: 'ElInput' }
        },
      ],
      rules: {
        returnOrderNo: [
          { required: true, message: '请输入门店回运单号', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        returnStatus: [
          { required: true, message: '请选择回运状态', trigger: 'change' }
        ],
        returnType: [
          { required: true, message: '请选择旧件返回类型', trigger: 'change' }
        ],
        receiverContact: [
          { required: true, message: '请输入收货联系人', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        warrantyMonth: [
          { required: true, message: '请输入保修月份', trigger: 'change' }
        ],
        receiverPhone: [
          { required: true, message: '请输入收货电话，手机号输入限制', trigger: 'change' }
        ],
      }
    };
  },
  mounted () {
  },
  methods: {
    // 打开侧边栏
    openPane () {
      this.$refs.editLayout.openPane();
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    submitRequest () {
      return addOrUpdate({
        ...this.form,
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
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
