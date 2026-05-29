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
                <el-form-item label="留车项配置代码：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="年款：" prop="vehYearTypeName">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.vehYearTypeName"
                    :remote-method="vehYearSearch"
                    :params="form.vehYearTypeName"
                    @change="handleVehYearChange"
                    value-key="id"
                    label-key="name"
                  />
                </el-form-item>
                <el-form-item label="车型：" prop="vehModelName">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.vehModelName"
                    :remote-method="modelSearch"
                    :params="form.vehModelName"
                    @change="handleModelChange"
                    value-key="id"
                    label-key="name"
                  />
                </el-form-item>
                <el-form-item label="故障名称：" prop="cccName">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.cccName"
                    :remote-method="cccSearch"
                    :params="form.cccName"
                    @change="handleCccChange"
                    value-key="id"
                    label-key="cccName"
                  />
                </el-form-item>
                <el-form-item label="留车范围：" prop="provinceCodeList">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    multiple
                    v-model="form.provinceCodeList"
                    :remote-method="getProvince"
                    @change="handleProvinceChange"
                    value-key="code"
                    label-key="name"
                  />
                </el-form-item>
                <el-form-item label="涉及零件编码：" prop="partsCode">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    v-model="form.partsCode"
                    :remote-method="partsSearch"
                    :params="form.partsCode"
                    @change="handlePartsChange"
                    value-key="partCode"
                    label-key="partCode"
                    subLabelKey="partName"
                  />
                </el-form-item>
                <el-form-item label="涉及零件名称：" prop="partsName">
                  <el-input
                    v-model="form.partsName"
                    clearable
                    disabled
                  />
                </el-form-item>
                <el-form-item label="制造开始日期：" prop="manufactureStartOn">
                  <el-date-picker
                    v-model="form.manufactureStartOn"
                    range-separator="至"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    align="right"
                  />
                </el-form-item>
                <el-form-item label="制造结束日期：" prop="manufactureEndOn">
                  <el-date-picker
                    v-model="form.manufactureEndOn"
                    range-separator="至"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    align="right"
                  />
                </el-form-item>
                <el-form-item label="配置有效开始日期：" prop="effectiveOn">
                  <el-date-picker
                    v-model="form.effectiveOn"
                    range-separator="至"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    align="right"
                  />
                </el-form-item>
                <el-form-item label="配置有效结束日期：" prop="ineffectiveOn">
                  <el-date-picker
                    v-model="form.ineffectiveOn"
                    range-separator="至"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    align="right"
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="编码：" prop="code">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="年款：" prop="vehYearTypeName">
                  {{ form.vehYearTypeName }}
                </el-form-item>
                <el-form-item label="车型：" prop="vehModelName">
                  {{ form.vehModelName }}
                </el-form-item>
                <el-form-item label="故障名称：" prop="cccName">
                  {{ form.cccName }}
                </el-form-item>
                <el-form-item label="涉及零件编码：" prop="partsCode">
                  {{ form.partsCode }}
                </el-form-item>
                <el-form-item label="涉及零件名称：" prop="partsName">
                  {{ form.partsName }}
                </el-form-item>
                <el-form-item label="留车范围：" prop="retainedScope">
                  {{ form.retainedScope }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="制造开始日期：" prop="manufactureStartOn">
                  {{ form.manufactureStartOn }}
                </el-form-item>
                <el-form-item label="制造结束日期：" prop="manufactureEndOn">
                  {{ form.manufactureEndOn }}
                </el-form-item>
                <el-form-item label="配置有效开始日期：" prop="effectiveOn">
                  {{ form.effectiveOn }}
                </el-form-item>
                <el-form-item label="配置有效结束日期：" prop="ineffectiveOn">
                  {{ form.ineffectiveOn }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="创建者名称：" prop="creatorName">
                  {{ form.creatorName }}
                </el-form-item>
                <el-form-item label="修改者名称：" prop="modifierName">
                  {{ form.modifierName }}
                </el-form-item>
                <el-form-item label="修改时间：" prop="updateTime">
                  {{ form.updateTime }}
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
import { getDetail, addOrUpdate } from '@/api/maintain/sp/vehRetention/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listVehicleYearType, listVehicleModel, sparePartList } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import api from '@/axios';

const defaultForm = {
  // 多选时字段有变化，自行修复
  code: '',
  vehYearTypeName: '',
  vehModelName: '',
  cccName: '',
  partsCode: '',
  partsName: '',
  retainedScope: '',
  status: '',
  manufactureStartOn: '',
  manufactureEndOn: '',
  effectiveOn: '',
  ineffectiveOn: '',
  createTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  statusDesc: '',
  vehModelId: '',
  vehYearTypeId: '',
  cccId: '',
  partsId: '',
  retainedScopeList: [],
  provinceCodeList: []
};

export default {
  name: 'vehRetentionEdit',
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
      return '编码：' + this.form.code;
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
    const validateManufactureDateStart = (rule, value, callback) => {
      if (this.form.manufactureStartOn && this.form.manufactureEndOn) {
        const start = new Date(this.form.manufactureStartOn).getTime();
        const end = new Date(this.form.manufactureEndOn).getTime();
        if (end <= start) {
          callback(new Error('制造开始日期必须大于制造结束日期'));
        } else {
          callback();
        }
      } else {
        // 如果其中一个为空，由 required 规则处理，这里直接通过
        callback();
      }
    };
    const validateManufactureDateEnd = (rule, value, callback) => {
      if (this.form.manufactureStartOn && this.form.manufactureEndOn) {
        const start = new Date(this.form.manufactureStartOn).getTime();
        const end = new Date(this.form.manufactureEndOn).getTime();
        if (end <= start) {
          callback(new Error('制造结束日期必须大于制造开始日期'));
        } else {
          callback();
        }
      } else {
        // 如果其中一个为空，由 required 规则处理，这里直接通过
        callback();
      }
    };

    const validateEffectiveDateStart = (rule, value, callback) => {
      if (this.form.effectiveOn && this.form.ineffectiveOn) {
        const start = new Date(this.form.effectiveOn).getTime();
        const end = new Date(this.form.ineffectiveOn).getTime();
        if (end <= start) {
          callback(new Error('配置有效开始日期必须小于配置有效结束日期'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const validateEffectiveDateEnd = (rule, value, callback) => {
      if (this.form.effectiveOn && this.form.ineffectiveOn) {
        const start = new Date(this.form.effectiveOn).getTime();
        const end = new Date(this.form.ineffectiveOn).getTime();
        if (end <= start) {
          callback(new Error('配置有效结束日期必须大于配置有效开始日期'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      pageTitle: '留车项配置',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-vehRetentionConfig',
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
        vehYearTypeName: [
          { required: true, message: '请选择年型', trigger: 'change' }
        ],
        vehModelName: [
          { required: true, message: '请输入基本车型', trigger: 'change' }
        ],
        cccName: [
          { required: true, message: '请输入故障名称', trigger: 'change' }
        ],
        partsCode: [
          { required: true, message: '请输入零件代码', trigger: 'change' }
        ],
        retainedScope: [
          { required: true, message: '请输入留车范围', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        manufactureStartOn: [
          { required: true, message: '请输入制造开始日期', trigger: 'change' },
          { validator: validateManufactureDateStart, trigger: 'change' }
        ],
        manufactureEndOn: [
          { required: true, message: '请输入制造结束日期', trigger: 'change' },
          { validator: validateManufactureDateEnd, trigger: 'change' }
        ],
        effectiveOn: [
          { required: true, message: '请输入配置有效开始日期', trigger: 'change' },
          { validator: validateEffectiveDateStart, trigger: 'change' }
        ],
        ineffectiveOn: [
          { required: true, message: '请输入配置有效结束日期', trigger: 'change' },
          { validator: validateEffectiveDateEnd, trigger: 'change' }
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
        creatorName: [
          { required: true, message: '请输入创建者名称', trigger: 'change' }
        ],
        modifier: [
          { required: true, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: true, message: '请输入修改者名称', trigger: 'change' }
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' }
        ],
        vehModelId: [
          { required: true, message: '请输入基本车型id', trigger: 'change' }
        ],
        vehYearTypeId: [
          { required: true, message: '请选择年型id', trigger: 'change' }
        ],
        cccId: [
          { required: true, message: '请输入故障名称id', trigger: 'change' }
        ],
        partsId: [
          { required: true, message: '请输入零件代码id', trigger: 'change' }
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
    },
    async modelSearch (query) {
      return listVehicleModel({ modelNameLike: query });
    },
    handleModelChange (val, record) {
      if (record) {
        this.form.vehModelName = record.name;
        this.form.vehModelId = record.id;
      }
    },
    async vehYearSearch (query) {
      return listVehicleYearType({ modelNameLike: query });
    },
    handleVehYearChange (val, record) {
      if (record) {
        this.form.vehYearTypeName = record.name;
        this.form.vehYearTypeId = record.id;
      }
    },
    async cccSearch (query) {
      if (!query) {
        return [];
      }
      return api.jsonPost('maintain/web/sp/serviceProxy/cccList', query);
    },
    handleCccChange (val, record) {
      if (record) {
        this.form.cccName = record.cccName;
        this.form.cccId = record.id;
      }
    },
    async partsSearch (query) {
      return sparePartList({ partCodeOrNameLike: query, status: '1' });
    },
    handlePartsChange (val, record) {
      if (record) {
        this.form.partsName = record.partName;
        this.form.partsCode = record.partCode;
        this.form.partsId = record.id;
      } else {
        this.form.partsName = '';
        this.form.partsCode = '';
        this.form.partsId = '';
      }
    },
    async getProvince (params) {
      const res = await api.get('/area/tree');
      let list = res || [];
      if (params && params.trim()) {
        const searchText = params.trim().toLowerCase();
        list = list.filter(item => item.name && item.name.toLowerCase().includes(searchText));
      }
      return list;
    },
    handleProvinceChange (val, record) {
      const procinceList = [];
      for (const item of record) {
        procinceList.push({
          provinceCode: item.code,
          provinceName: item.name,
        });
      }
      this.form.retainedScopeList = procinceList;
    },
  }
};
</script>
