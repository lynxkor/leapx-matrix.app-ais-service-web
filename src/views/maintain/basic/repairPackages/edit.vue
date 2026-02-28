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
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="修改者：" prop="modifier">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifier"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="套餐代码：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="套餐名称：" prop="packageName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.packageName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="套餐类型id：" prop="typeId">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.typeId"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="拼音简码：" prop="spellCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.spellCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="适用车系：" prop="vehicleSeriesId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleSeriesId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="适用车系：" prop="vehicleSeriesIds">
                  <el-input
                    placeholder="请输入"
                    v-model="form.vehicleSeriesIds"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="数据来源：" prop="dataSource">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dataSource"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.status"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="总金额：" prop="totalAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.totalAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.modifierName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.updateTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creatorName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  <el-date-picker
                    :default-time="['00:00:00', '23:59:59']"
                    v-model="form.createTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item label="主键：" prop="id">
                  <el-input
                    placeholder="请输入"
                    v-model="form.id"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  <el-input
                    placeholder="请输入"
                    v-model="form.creator"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <el-input
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.statusDesc"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="维修套餐--维修项目：" prop="itemRespList">
                  <el-input
                    placeholder="请输入"
                    v-model="form.itemRespList"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="维修套餐--零配件：" prop="partRespList">
                  <el-input
                    placeholder="请输入"
                    v-model="form.partRespList"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="套餐类型：" prop="typeName">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.typeName"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="撤销下发日期：" prop="backoutSuedDate">
                  <el-input
                    placeholder="请输入"
                    v-model="form.backoutSuedDate"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="下发状态：" prop="comboStatus">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="xxx"
                    v-model="form.comboStatus"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="是否下发门店：" prop="suedDealer">
                  <el-input
                    placeholder="请输入"
                    v-model="form.suedDealer"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="归属门店ID（组织ID），当数据权限归属到本组织以及本下级：" prop="ownerOrgId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.ownerOrgId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.dealerCode"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="下发日期：" prop="suedDate">
                  <el-input
                    placeholder="请输入"
                    v-model="form.suedDate"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="维修备件合计：" prop="repairPartAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.repairPartAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="维修项目合计：" prop="repairProjectAmount">
                  <el-input
                    placeholder="请输入"
                    v-model="form.repairProjectAmount"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="适用车型：" prop="carModelId">
                  <el-input
                    placeholder="请输入"
                    v-model="form.carModelId"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="适用车型：" prop="carModelIds">
                  <el-input
                    placeholder="请输入"
                    v-model="form.carModelIds"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否已使用：" prop="used">
                  <el-radio-group v-model="form.used">
                    <el-radio v-for="item in yes_no_enum" :key="item.code" :label="item.code">{{ item.message }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="修改者：" prop="modifier">
                  {{ form.modifier }}
                </el-form-item>
                <el-form-item label="套餐代码：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="套餐名称：" prop="packageName">
                  {{ form.packageName }}
                </el-form-item>
                <el-form-item label="套餐类型id：" prop="typeId">
                  {{ form.typeId }}
                </el-form-item>
                <el-form-item label="拼音简码：" prop="spellCode">
                  {{ form.spellCode }}
                </el-form-item>
                <el-form-item label="适用车系：" prop="vehicleSeriesId">
                  {{ form.vehicleSeriesId }}
                </el-form-item>
                <el-form-item label="适用车系：" prop="vehicleSeriesIds">
                  {{ form.vehicleSeriesIds }}
                </el-form-item>
                <el-form-item label="数据来源：" prop="dataSource">
                  {{ form.dataSource }}
                </el-form-item>
                <el-form-item label="门店名称：" prop="dealerName">
                  {{ form.dealerName }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.status }}
                </el-form-item>
                <el-form-item label="总金额：" prop="totalAmount">
                  {{ form.totalAmount }}
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  {{ form.modifierName }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="主键：" prop="id">
                  {{ form.id }}
                </el-form-item>
                <el-form-item label="创建者：" prop="creator">
                  {{ form.creator }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="状态变更描述：" prop="statusDesc">
                  {{ form.statusDesc }}
                </el-form-item>
                <el-form-item label="维修套餐--维修项目：" prop="itemRespList">
                  {{ form.itemRespList }}
                </el-form-item>
                <el-form-item label="维修套餐--零配件：" prop="partRespList">
                  {{ form.partRespList }}
                </el-form-item>
                <el-form-item label="套餐类型：" prop="typeName">
                  {{ form.typeName }}
                </el-form-item>
                <el-form-item label="撤销下发日期：" prop="backoutSuedDate">
                  {{ form.backoutSuedDate }}
                </el-form-item>
                <el-form-item label="下发状态：" prop="comboStatus">
                  {{ form.comboStatus }}
                </el-form-item>
                <el-form-item label="是否下发门店：" prop="suedDealer">
                  {{ form.suedDealer }}
                </el-form-item>
                <el-form-item label="归属门店ID（组织ID），当数据权限归属到本组织以及本下级：" prop="ownerOrgId">
                  {{ form.ownerOrgId }}
                </el-form-item>
                <el-form-item label="门店编码：" prop="dealerCode">
                  {{ form.dealerCode }}
                </el-form-item>
                <el-form-item label="下发日期：" prop="suedDate">
                  {{ form.suedDate }}
                </el-form-item>
                <el-form-item label="维修备件合计：" prop="repairPartAmount">
                  {{ form.repairPartAmount }}
                </el-form-item>
                <el-form-item label="维修项目合计：" prop="repairProjectAmount">
                  {{ form.repairProjectAmount }}
                </el-form-item>
                <el-form-item label="适用车型：" prop="carModelId">
                  {{ form.carModelId }}
                </el-form-item>
                <el-form-item label="适用车型：" prop="carModelIds">
                  {{ form.carModelIds }}
                </el-form-item>
                <el-form-item label="是否已使用：" prop="used">
                  {{ yes_no_enum_map[form.used] }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>子表标题</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <div class="ais-select-group">
                  <fetch-select
                    style="width: 300px;"
                    :remote-method="queryListData"
                    remote
                    placeholder="请选择"
                    clearable
                    value-key="id"
                    label-key="name"
                    @change="handleAddTableData"
                  />
                  <el-button type="primary" size="small">添加</el-button>
                </div>
              </div>
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
                  <vxe-column title="操作" width="100" v-if="canDelete">
                    <template #default="{ rowIndex }">
                      <el-popconfirm title="确定要删除吗？" @confirm="handleDeleteRow(rowIndex)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
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
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/maintain/basic/repairPackages/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  modifier: '',
  code: '',
  packageName: '',
  typeId: '',
  spellCode: '',
  vehicleSeriesId: '',
  vehicleSeriesIds: '',
  dataSource: '',
  dealerName: '',
  status: '',
  totalAmount: '',
  modifierName: '',
  updateTime: '',
  creatorName: '',
  createTime: '',
  id: '',
  creator: '',
  remark: '',
  statusDesc: '',
  itemRespList: '',
  partRespList: '',
  typeName: '',
  backoutSuedDate: '',
  comboStatus: '',
  suedDealer: '',
  ownerOrgId: '',
  dealerCode: '',
  suedDate: '',
  repairPartAmount: '',
  repairProjectAmount: '',
  carModelId: '',
  carModelIds: '',
  used: '',
};

export default {
  name: 'repairPackagesEdit',
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
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '修改者：' + this.form.modifier;
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
      pageTitle: '新页面',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-repairPackages',
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
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入套餐代码', trigger: 'change' }
        ],
        packageName: [
          { required: true, message: '请输入套餐名称', trigger: 'change' }
        ],
        typeId: [
          { required: true, message: '请选择套餐类型id', trigger: 'change' }
        ],
        spellCode: [
          { required: true, message: '请输入拼音简码', trigger: 'change' }
        ],
        vehicleSeriesId: [
          { required: true, message: '请输入适用车系', trigger: 'change' }
        ],
        vehicleSeriesIds: [
          { required: true, message: '请输入适用车系', trigger: 'change' }
        ],
        dataSource: [
          { required: true, message: '请输入数据来源', trigger: 'change' }
        ],
        dealerName: [
          { required: true, message: '请输入门店名称', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        totalAmount: [
          { required: true, message: '请输入总金额', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: true, message: '请输入创建者', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        itemRespList: [
          { required: true, message: '请输入维修套餐--维修项目', trigger: 'change' }
        ],
        partRespList: [
          { required: true, message: '请输入维修套餐--零配件', trigger: 'change' }
        ],
        typeName: [
          { required: true, message: '请选择套餐类型', trigger: 'change' }
        ],
        backoutSuedDate: [
          { required: true, message: '请输入撤销下发日期', trigger: 'change' }
        ],
        comboStatus: [
          { required: true, message: '请选择下发状态', trigger: 'change' }
        ],
        suedDealer: [
          { required: true, message: '请输入是否下发门店', trigger: 'change' }
        ],
        ownerOrgId: [
          { required: true, message: '请输入归属门店ID（组织ID），当数据权限归属到本组织以及本下级', trigger: 'change' }
        ],
        dealerCode: [
          { required: true, message: '请输入门店编码', trigger: 'change' }
        ],
        suedDate: [
          { required: true, message: '请输入下发日期', trigger: 'change' }
        ],
        repairPartAmount: [
          { required: true, message: '请输入维修备件合计', trigger: 'change' }
        ],
        repairProjectAmount: [
          { required: true, message: '请输入维修项目合计', trigger: 'change' }
        ],
        carModelId: [
          { required: true, message: '请输入适用车型', trigger: 'change' }
        ],
        carModelIds: [
          { required: true, message: '请输入适用车型', trigger: 'change' }
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
