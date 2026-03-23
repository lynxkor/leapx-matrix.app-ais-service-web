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
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <template #status>
          <!-- 支持 primary,warning,success,danger 等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮 1</el-button>
          <el-button size="small">按钮 2</el-button> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整 label-width="150px"，使得 label 不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="价格序号：" prop="priceSerialNo">
                  <el-input
                    placeholder="系统自动生成"
                    v-model="form.priceSerialNo"
                    disabled
                    clearable
                  />
                </el-form-item>
                <el-form-item label="车系名称：" prop="vehicleSeriesName">
                  <list-select
                    listUrl="/datacenter/web/materials/vehicleModel/list"
                    placeholder="请输入车系名称"
                    v-model="form.vehicleSeriesId"
                    :disabled="Boolean(_id)"
                    query-key="modelNameLike"
                    auto-load-options
                    filterable
                    clearable
                    value-key="id"
                    label-key="name"
                    @change="handleVehicleSeriesChange"
                    :params="{}" />
                </el-form-item>
                <el-form-item label="供应商索赔价格：" prop="supplierClaimPrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.supplierClaimPrice"
                    :disabled="cannotEditPrice"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="生效开始日期：" prop="effectiveStartTime">
                  <el-date-picker
                    v-model="form.effectiveStartTime"
                    type="date"
                    :picker-options="startDatePickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :disabled="cannotEditEffectiveStartTime"
                    placeholder="请选择生效开始日期"
                    @change="handleStartDateChange"
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="StatusEnum"
                    v-model="form.status"
                    clearable
                    disabled="true"
                    filterable
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    type="textarea"
                    v-model="form.remark"
                    placeholder="请输入"
                    :rows="3"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="价格序号：" prop="priceSerialNo">
                  {{ form.priceSerialNo }}
                </el-form-item>
                <el-form-item label="车系名称：" prop="vehicleSeriesName">
                  {{ form.vehicleSeriesName }}
                </el-form-item>
                <el-form-item label="供应商索赔价格：" prop="supplierClaimPrice">
                  {{ form.supplierClaimPrice }}
                </el-form-item>
                <el-form-item label="生效开始日期：" prop="effectiveStartTime">
                  {{ form.effectiveStartTime }}
                </el-form-item>
                <el-form-item label="是否启用：" prop="status">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="说明：" prop="statusDesc">
                  {{ form.statusDesc }}
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
import { getDetail, addOrUpdate } from '@/api/claimreturn/claim/basic/supplierReplacementCarClaimPrice/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import ListSelect from '@/libs/components/list-select/index.vue';
const defaultForm = {
  // 多选时字段有变化，自行修复
  priceSerialNo: '',
  vehicleSeriesName: '',
  supplierClaimPrice: '',
  effectiveStartTime: '',
  status: '1',
  remark: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  statusDesc: '',
  dataSource: '',
  vehicleSeriesId: '',
};

export default {
  name: 'supplierReplacementCarClaimPriceEdit',
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
    ListSelect,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '价格序号：' + this.form.priceSerialNo;
    },
    // 判断是否可以编辑供应商索赔价格
    cannotEditPrice () {
      if (!this.form.effectiveStartTime || !this._id) {
        return false;
      }
      const effectiveDate = new Date(this.form.effectiveStartTime);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // 生效开始日期早于当天，不允许修改
      return effectiveDate.getTime() < today.getTime();
    },
    // 判断是否可以编辑生效开始日期
    cannotEditEffectiveStartTime () {
      if (!this.form.effectiveStartTime || !this._id) {
        return false;
      }
      const effectiveDate = new Date(this.form.effectiveStartTime);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // 生效开始日期晚于当天，可以修改；否则不允许修改
      return effectiveDate.getTime() <= today.getTime();
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
      pageTitle: '供应商代步车索赔价格',
      pageType: 'edit',
      // TIPS: 权限前缀 AISCR，根据实际情况修改
      moduleKey: 'AISCR-supplierReplacementCarClaimPrice',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      rules: {
        vehicleSeriesName: [
          { required: true, message: '请输入车系名称', trigger: 'change' }
        ],
        supplierClaimPrice: [
          { required: true, message: '请输入供应商索赔价格', trigger: 'change' },
          { validator: this.validatePositiveNumber, trigger: 'change' }
        ],
        effectiveStartTime: [
          { required: true, message: '请选择生效开始日期', trigger: 'change' },
          { validator: this.validateEffectiveStartTime, trigger: 'change' }
        ],
      },
      startDatePickerOptions: {
        disabledDate: (time) => {
          // 新增时不能选择今天之前的日期
          // 编辑时，如果生效开始日期晚于当天，只能选择以后的日期（不能早于当前已选日期）
          if (!this._id) {
            return time.getTime() < Date.now() - 86400000;
          }
          // 编辑状态且生效开始日期晚于当天，不能选择早于今天的日期
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return time.getTime() < today.getTime();
        }
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
    validatePositiveNumber (rule, value, callback) {
      if (value === '' || value === null || value === undefined) {
        callback();
        return;
      }
      if (value <= 0) {
        callback(new Error('必须大于 0'));
      } else {
        callback();
      }
    },
    handleVehicleSeriesChange (val, selectedItem) {
      this.form.vehicleSeriesId = val;
      this.form.vehicleSeriesName = selectedItem ? selectedItem.name : '';
    },
    validateEffectiveStartTime (rule, value, callback) {
      // 只在新增时验证，编辑时不允许编辑早于今天的日期，不需要验证提示
      if (!this._id && value) {
        const selectedDate = new Date(value).getTime();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today.getTime()) {
          callback(new Error('生效开始日期不能早于今天'));
          return;
        }
      }
      callback();
    },
    handleStartDateChange (val) {
      // 生效开始日期变化时的处理
      if (val && this._id) {
        // 编辑时日期变化后重新判断是否可以编辑价格
      }
    },
    openPane () {
      this.$refs.editLayout.openPane();
    },
    // 删除子表数据
    handleDeleteRow (index) {
      const item = this.tableData[index];
      this.tableData.splice(index, 1);
      // 根据需求调用接口
      // deletePartVehModel([item.id]).then(res => {
      //   this.$message.success('删除成功');
      //   this.tableData.splice(index, 1);
      // });
    },
    // 查询新增项的列表
    queryListData (queryString) {
      return new Promise(resolve => {
        // 根据需求调用接口
        // sparePartList({ partCodeOrNameLike: queryString, status: 1, limitSize: 20 }).then(res => {
        //   const list = res || [];
        //   resolve(list);
        // });
        resolve([
          { id: 1, name: 'test', age: 25, email: 'test@example.com' }
        ]);
      });
    },
    // 新增子表数据
    handleAddTableData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      // 检查是否已存在
      const exists = this.tableData.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      // 根据需求调用接口
      this.tableData.push(record);
      // addPartItem({
      //   maintenancePartId: this._id,
      //   partsCode: record.partCode,
      //   partsName: record.partName,
      //   partsId: record.id,
      // }).then(res => {
      //   this.$message.success('添加成功');
      //   this.detailRequest();
      // });
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
    }
  }
};
</script>
