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
                <el-form-item label="供应商编码：" prop="supplierCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.supplierCode"
                    clearable
                    :disabled="!!_id"
                  />
                </el-form-item>
                <el-form-item label="供应商名称：" prop="supplierName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.supplierName"
                    @change="handleSupplierNameChange()"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="拼音简码：">
                  <el-input
                    placeholder="保存后自动生成"
                    v-model="form.pinyincode"
                    clearable
                    disabled="true"
                  />
                </el-form-item>
                <el-form-item label="供应商简称：" prop="supplierShortName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.supplierShortName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="国家：" prop="countryName">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="CountryEnum"
                    v-model="form.countryCode"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="省市区：" prop="provinceCode"
                >
                  <el-cascader
                    style="width: 100%"
                    placeholder="请选择省市区"
                    v-model="form.provinceCityCountyCode"
                    :props="orgProps"
                    :options="areaOptions"
                    filterable
                    clearable>
                  </el-cascader>
                </el-form-item>
                <el-form-item label="地址：" prop="address">
                  <el-input
                    placeholder="请输入"
                    v-model="form.address"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="供应商类型：" prop="supplierType">
                  <el-input
                    placeholder="请输入"
                    v-model="form.supplierType"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="联系人姓名：" prop="contactName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.contactName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="联系人电话：" prop="contactPhone">
                  <el-input
                    placeholder="请输入"
                    v-model="form.contactPhone"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="联系人邮箱：" prop="contactEmail">
                  <el-input
                    placeholder="请输入"
                    v-model="form.contactEmail"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="联系人传真：" prop="contactFax">
                  <el-input
                    placeholder="请输入"
                    v-model="form.contactFax"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="是否启用：" prop="status">
                  {{ form.statusLabel  }}
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="供应商编码：" prop="supplierCode">
                  {{ form.supplierCode  }}
                </el-form-item>
                <el-form-item label="供应商名称：" prop="supplierName">
                  {{ form.supplierName  }}
                </el-form-item>
                <el-form-item label="供应商简称：" prop="supplierShortName">
                  {{ form.supplierShortName  }}
                </el-form-item>
                <el-form-item label="国家：" prop="countryName">
                  {{ form.countryCodeLabel  }}
                </el-form-item>
                <el-form-item label="省：" prop="provinceName">
                  {{ form.provinceName  }}
                </el-form-item>
                <el-form-item label="市：" prop="cityName">
                  {{ form.cityName  }}
                </el-form-item>
                <el-form-item label="地址：" prop="address">
                  {{ form.address  }}
                </el-form-item>
                <el-form-item label="供应商类型：" prop="supplierType">
                  {{ form.supplierType  }}
                </el-form-item>
                <el-form-item label="拼音简码：" prop="pinyinCode">
                  {{ form.pinyinCode  }}
                </el-form-item>
                <el-form-item label="联系人姓名：" prop="contactName">
                  {{ form.contactName  }}
                </el-form-item>
                <el-form-item label="联系人电话：" prop="contactPhone">
                  {{ form.contactPhone  }}
                </el-form-item>
                <el-form-item label="联系人邮箱：" prop="contactEmail">
                  {{ form.contactEmail  }}
                </el-form-item>
                <el-form-item label="联系人传真：" prop="contactFax">
                  {{ form.contactFax  }}
                </el-form-item>
                <el-form-item label="是否启用：" prop="status">
                  {{ form.statusLabel  }}
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
import { getDetail, addOrUpdateDealer } from '@/api/sparepart/basic/supplierInfo/index';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getAreaTree } from '@/utils';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: '',
  statusLabel: '是',
  statusDesc: '',
  provinceCityCountyCode: '',
  provinceCode: '',
  provinceName: '',
  cityCode: '',
  cityName: '',
  districtCode: '',
  districtName: '',
  address: '',
  fullAddress: '',
  supplierCode: '',
  supplierName: '',
  pinyinCode: '',
  supplierShortName: '',
  supplierType: '',
  oemFlag: '',
  dealerCode: '',
  dealerName: '',
  supplierLevel: '',
  supplierSafetyStock: '',
  countryCode: '',
  countryName: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  contactFax: '',
};

export default {
  name: 'dealerSupplierInfoEdit',
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
      return '主键：' + this.form.id;
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
      areaOptions: getAreaTree(),
      orgProps: {
        checkStrictly: true,
        emitPath: false,
        label: 'name',
        value: 'code',
        children: 'child'
      },
      pageTitle: '外购件供应商主数据',
      pageType: 'edit',
      // TIPS: 权限前缀 AISPART，根据实际情况修改
      moduleKey: 'AISPART-dealerSupplierInfo',
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
        id: [
          { required: false, message: '请输入主键', trigger: 'change' }
        ],
        creator: [
          { required: false, message: '请输入创建者', trigger: 'change' }
        ],
        creatorName: [
          { required: false, message: '请输入创建者名称', trigger: 'change' }
        ],
        createTime: [
          { required: false, message: '请选择创建时间', trigger: 'change' }
        ],
        modifier: [
          { required: false, message: '请输入修改者', trigger: 'change' }
        ],
        modifierName: [
          { required: false, message: '请输入修改者名称', trigger: 'change' }
        ],
        updateTime: [
          { required: false, message: '请选择修改时间', trigger: 'change' }
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'change' }
        ],
        status: [
          { required: false, message: '请选择状态', trigger: 'change' }
        ],
        statusDesc: [
          { required: false, message: '请选择状态变更描述', trigger: 'change' }
        ],
        provinceCityCountyCode: [
          { required: false, message: '请输入省市区code', trigger: 'change' }
        ],
        provinceCode: [
          { required: false, message: '请输入省code', trigger: 'change' }
        ],
        provinceName: [
          { required: false, message: '请输入省', trigger: 'change' }
        ],
        cityCode: [
          { required: false, message: '请输入市code', trigger: 'change' }
        ],
        cityName: [
          { required: false, message: '请输入市', trigger: 'change' }
        ],
        districtCode: [
          { required: false, message: '请输入区&#x2F;县编码', trigger: 'change' }
        ],
        districtName: [
          { required: false, message: '请输入区&#x2F;县名称', trigger: 'change' }
        ],
        address: [
          { required: false, message: '请输入详细地址', trigger: 'change' }
        ],
        fullAddress: [
          { required: false, message: '请输入详细地址', trigger: 'change' }
        ],
        supplierCode: [
          { required: true, message: '请输入供应商编码', trigger: 'change' }
        ],
        supplierName: [
          { required: true, message: '请输入供应商名称', trigger: 'change' }
        ],
        pinyinCode: [
          { required: false, message: '请输入拼音简码', trigger: 'change' }
        ],
        supplierShortName: [
          { required: false, message: '请输入供应商简称', trigger: 'change' }
        ],
        supplierType: [
          { required: false, message: '请选择供应商类型', trigger: 'change' }
        ],
        oemFlag: [
          { required: false, message: '请输入是否OEM', trigger: 'change' }
        ],
        dealerCode: [
          { required: false, message: '请输入门店编码（组织code）', trigger: 'change' }
        ],
        dealerName: [
          { required: false, message: '请输入门店名称（组织名称）', trigger: 'change' }
        ],
        supplierLevel: [
          { required: false, message: '请输入供应商等级', trigger: 'change' }
        ],
        supplierSafetyStock: [
          { required: false, message: '请输入供应商安全库存系数', trigger: 'change' }
        ],
        countryCode: [
          { required: false, message: '请输入国家code', trigger: 'change' }
        ],
        countryName: [
          { required: false, message: '请输入国家', trigger: 'change' }
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
      return addOrUpdateDealer({ ...this.form });
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
