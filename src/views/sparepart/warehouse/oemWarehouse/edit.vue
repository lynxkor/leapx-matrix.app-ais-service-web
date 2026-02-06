<template>
  <edit-page-layout ref="editLayout" title="侧边栏标题" showPaneFooter>
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="`${title} ${form.createTime}`"
        :isEditing.sync="isEditing"
        :form.sync="form"
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
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="仓库名称：" prop="warehouseName">
                  <el-input
                    placeholder="请输入"
                    :disabled="isEditing"
                    v-model="form.warehouseName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="仓库编码：" prop="warehouseCode">
                  <el-input
                    :disabled="isEditing"
                    placeholder="请输入"
                    v-model="form.warehouseCode"
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
                <el-form-item label="备注：" prop="remark">
                  <el-input placeholder="请输入" v-model="form.remark" clearable />
                </el-form-item>
                <el-form-item label="省市区：" prop="provinceCode">
                  <el-cascader
                    placeholder="请选择省市区"
                    v-model="form.provinceCityCountyCode"
                    :props="orgProps"
                    :options="areaOptions"
                    filterable
                    clearable>
                  </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址：" prop="address">
                  <el-input placeholder="请输入" v-model="form.address" clearable />
                </el-form-item>
              </el-form>
              <el-form label-width="150px" :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="仓库名称：" prop="warehouseName">
                  {{ form.warehouseName }}
                </el-form-item>
                <el-form-item label="仓库编码：" prop="warehouseCode">
                  {{ form.warehouseCode }}
                </el-form-item>
                <el-form-item label="联系人姓名：" prop="contactName">
                  {{ form.contactName }}
                </el-form-item>
                <el-form-item label="联系人电话：" prop="contactPhone">
                  {{ form.contactPhone }}
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  {{ form.remark }}
                </el-form-item>
                <el-form-item label="省：" prop="provinceName">
                  {{ form.provinceName }}
                </el-form-item>
                <el-form-item label="市：" prop="cityName">
                  {{ form.cityName }}
                </el-form-item>
                <el-form-item label="区：" prop="districtName">
                  {{ form.districtName }}
                </el-form-item>
                <el-form-item label="详细地址：" prop="address">
                  {{ form.address }}
                </el-form-item>
                <el-form-item label="是否启用：" >
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="停用原因：">
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
import { getDetail, addOrUpdate } from '@/api/sparepart/warehouse/oemWarehouse/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  remark: '',
  status: '',
  statusDesc: '',
  provinceCityCountyCode: '',
  provinceCode: '',
  provinceName: '',
  cityCode: '',
  cityName: '',
  districtCode: '',
  districtName: '',
  address: '',
  dataSource: '',
  warehouseCode: '',
  warehouseName: '',
  dealerCode: '',
  dealerName: '',
  disableReason: '',
  locationRespList: '',
};

export default {
  name: 'oemWarehouseEdit',
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
    EditBaseContainer,
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
      // 省市区
      areaOptions: JSON.parse(localStorage.areaTree),
      orgProps: {
        checkStrictly: true,
        emitPath: false,
        label: 'name',
        value: 'code',
        children: 'child'
      },
      pageTitle: '主机厂仓库设置',
      pageType: 'edit',
      title: '创建时间：',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-oemWarehouse',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
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
        remark: [
          { required: false, message: '请输入备注', trigger: 'change' }
        ],
        provinceCityCountyCode: [
          { required: false, message: '请输入省市区code', trigger: 'change' }
        ],
        address: [
          { required: false, message: '请输入详细地址', trigger: 'change' }
        ],
        warehouseCode: [
          { required: true, message: '请输入仓库编码', trigger: 'change' }
        ],
        warehouseName: [
          { required: true, message: '请输入仓库名称', trigger: 'change' }
        ],
        contactName: [
          { required: false, message: '请输入联系人姓名', trigger: 'change' }
        ],
        contactPhone: [
          { required: false, message: '请输入联系人电话', trigger: 'change' }
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
    }
  }
};
</script>
