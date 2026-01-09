<template>
  <!-- TIPS: 如果填写项大于15项，使用类名page-common-edit替换page-common-add -->
  <div class="page-common-edit">
    <el-container>
      <el-main>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <!-- TIPS: 如果填写项大于15项，加上 :inline="true" -->
            <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
            <el-form inline :model="form" :rules="rules" ref="ruleForm" label-width="150px">
              <el-form-item label="营销分类编码" prop="categoryCode">
                <el-input
                  placeholder="请输入"
                  v-model="form.categoryCode"
                  clearable
                  :disabled="!!partsId"
                />
              </el-form-item>
              <el-form-item label="营销分类名称" prop="categoryName">
                <el-input
                  placeholder="请输入"
                  v-model="form.categoryName"
                  clearable
                />
              </el-form-item>
              <el-form-item label="可采购建店类型" prop="buildTypeCode">
                <el-select
                  v-model="form.buildTypeCode"
                  multiple
                  placeholder="请选择"
                  collapse-tags
                  >
                  <el-option
                    v-for="item in storeTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </section>
        <section class="common-section">
          <div class="common-section-header">
            <h2>可采购门店</h2>
          </div>
          <div class="common-section-body">
            <div class="ais-select-group" v-if="partsId">
              <el-select
                style="width: 305px;"
                v-model="dealerCodes"
                filterable
                clearable
                remote
                placeholder="请选择"
                :remote-method="getStoreByName"
                @change="handleStoreChange"
                collapse-tags
                >
                  <el-option
                    v-for="item in storeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
              <el-button
                type="primary"
                @click="handleAddStore(1)"
                size="small"
              >
                添加
              </el-button>
            </div>
            <div class="common-section-table">
              <el-table
                :data="tableData"
                style="width: 100%"
                fit
                stripe
                highlight-current-row
              >
                <el-table-column prop="dealerName" label="门店名称" width="280"></el-table-column>
                <el-table-column prop="dealerCode" label="门店编码" width="280"></el-table-column>
                <el-table-column prop="createTime" label="添加时间" width="280"></el-table-column>
                <el-table-column prop="creatorName" label="操作人" width="280"></el-table-column>
                <el-table-column label="操作" width="100" fixed="right">
                  <template slot-scope="scope">
                    <el-popconfirm
                      title="确认删除该门店吗？"
                      @confirm="handleDeleteStore(scope.row.id)"
                    >
                      <span
                        slot="reference"
                        class="action-button btn-delete"
                      >
                        删除
                      </span>
                    </el-popconfirm>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </section>
        <section class="common-section">
          <div class="common-section-header">
            <h2>不可采购门店</h2>
          </div>
          <div class="common-section-body">
            <div class="ais-select-group" v-if="partsId">
              <el-select
                style="width: 305px;"
                v-model="noDealerCodes"
                filterable
                clearable
                remote
                placeholder="请选择"
                :remote-method="getStoreByName"
                @change="handleStoreChange"
                collapse-tags
                >
                  <el-option
                    v-for="item in storeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>
              <el-button
                type="primary"
                @click="handleAddStore(0)"
                size="small"
              >
                添加
              </el-button>
            </div>
            <div class="common-section-table">
              <el-table
                :data="noTableData"
                style="width: 100%"
                fit
                stripe
                highlight-current-row
              >
                <el-table-column prop="dealerName" label="门店名称" width="280"></el-table-column>
                <el-table-column prop="dealerCode" label="门店编码" width="280"></el-table-column>
                <el-table-column prop="createTime" label="添加时间" width="280"></el-table-column>
                <el-table-column prop="creatorName" label="操作人" width="280"></el-table-column>
                <el-table-column label="操作" width="100" fixed="right">
                  <template slot-scope="scope">
                    <el-popconfirm
                      title="确认删除该门店吗？"
                      @confirm="handleDeleteStore(scope.row.id)"
                    >
                      <span
                        slot="reference"
                        class="action-button btn-delete"
                      >
                        删除
                      </span>
                    </el-popconfirm>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </section>
      </el-main>
      <el-footer height="60px">
        <el-button v-if="canAddOrUpdate" size="small" type="primary" @click="submitForm('ruleForm')" :loading="submitLoading">保存</el-button>
        <el-button size="small" @click="handleBack">取消</el-button>
        <!-- <el-button size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getDetail, addOrUpdate, categoryPurchaseDealer, addDealer, deleteDealer } from '@/api/sparepart/basic/spareSalesCategory/index';
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum, getBuildType, listOrgStoreInfo } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  // 多选时字段有变化，自行修复
  categoryCode: '',
  categoryName: '',
  statusDesc: '',
  createTime: '',
  updateTime: '',
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  remark: '',
  status: '1',
  dataSource: '',
  categoryType: '',
  buildTypeCode: [],
};

export default {
  name: 'spareSalesCategoryEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
  },
  data () {
    const form = this.getDefautlForm();
    return {
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-spareSalesCategory',
      pageType: 'edit',
      pageTitle: '备件销售分类',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      partsId: null, // 保存成功时ID
      storeTypeOptions: [], // 建店类型选项
      buildTypeList: [], // 可采购建店类型列表 传参字段
      tableData: [], // 可采购门店列表
      storeOptions: [], // 可采购门店列表
      storeParams: {}, // 可采购门店列表
      dealerCodes: '', // 可采购门店列表
      noDealerCodes: '', // bu可采购门店列表
      noTableData: [], // 不可采购门店列表
      rules: {
        categoryCode: [
          { required: true, message: '请输入营销分类编码', trigger: 'blur' }
        ],
        categoryName: [
          { required: true, message: '请输入营销分类名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    };
  },
  mounted () {
    this.getDetailData();
    this.getStore();
    this.partsId = this.$route.query.id;
    this.getPurchaseDealer(this.$route.query.id);
  },
  methods: {
    handleBack () {
      this.$router.back();
    },
    getDetailData () {
      const id = this.id || this.$route.query.id;
      this.$store.commit('SET_ACTIVE_BREADCRUMB', ['备件营销分类', `${id ? '编辑' : '新建'}`]);
      if (id) {
        getDetail(id).then(res => {
          this.loading = false;
          Object.assign(this.form, res);
          Object.assign(this.originalForm, res);
          this.form.buildTypeCode = res.categoryBuildTypeRespList.map(item => Number(item.buildTypeCode)) || [];
        });
      }
    },
    submitForm (formName, rest = false) {
      this.$refs[formName].validate((valid) => {
        const newArray = this.form.buildTypeCode.map(code => {
          // 在 storeTypeOptions 中查找匹配的项
          const matchedItem = this.storeTypeOptions.find(item => item.value === code);
          return {
            buildTypeCode: code,
            buildTypeName: matchedItem.label // 如果没有匹配到，可以设置默认值
          };
        });
        if (valid) {
          this.submitLoading = true;
          addOrUpdate({ ...this.form, buildTypeList: newArray }).then(res => {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            this.partsId = res || '';
            if (this.partsId) { // 判断新增时 获取到id 就赋值 调整为编辑状态 传参id
              this.form.id = this.partsId;
            }
            this.form.id = this.partsId;
            const id = this.$route.query.id;
            if (res) {
              this.getDetailData();
              this.getPurchaseDealer(this.partsId);
              return;
            }
            if (rest || !id) {
              this.resetForm(formName);
            } else {
              this.getDetailData();
            }
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.tableData = []; // 可采购门店列表
      this.noTableData = []; // 不可采购门店列表
      this.form = this.getDefautlForm();
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
    // handleJumpAuditLog () {
    //   this.$router.push({
    //     path: '/xxx/auditLog',
    //     query: {
    //       tableCode: '',
    //       tableId: ''
    //     }
    //   });
    // },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 处理建店类型选择变更事件
    async getStore () {
      const res = await getBuildType();

      if (res && Array.isArray(res)) {
        // 使用 flatMap 提取所有 children 并合并成一个新数组
        this.storeTypeOptions = res.flatMap(item => {
          if (item.children && Array.isArray(item.children)) {
            return item.children.map(child => ({
              label: child.label,
              value: Number(child.value)
            }));
          }
          return [];
        });
      } else {
        this.storeTypeOptions = [];
      }
    },
    // 可采购/不可采购门店
    getStoreByName (query) {
      listOrgStoreInfo({
        name: query
      }).then(res => {
        this.storeOptions = res?.map(item => {
          return {
            ...item,
            value: item.orgCode,
            label: item.orgName
          };
        });
      });
    },
    // 处理选择门店时拿到所有的数据
    handleStoreChange (val) {
      // 根据 value 在 storeOptions 中查找完整的对象
      const selectedItem = this.storeOptions.find(item => item.orgCode === val);
      this.storeParams = {
        dealerCode: selectedItem.orgCode,
        dealerName: selectedItem.orgName,
        categorySpareId: this.partsId
      };
    },
    // 处理添加门店事件
    async handleAddStore (val) {
      const params = {
        purchaseStatus: val,
        ...this.storeParams
      };
      await addDealer(params);
      this.getPurchaseDealer(this.partsId, val);
      this.dealerCodes = ''; // 可采购门店列表
      this.noDealerCodes = ''; // 不可采购门店列表
      this.storeParams = {}; // 添加以后清空
    },
    // 查询可采购门店数据
    async getPurchaseDealer (val, status) {
      const [status0Res, status1Res] = await Promise.all([
        categoryPurchaseDealer({ // 不可采购门店
          categorySpareId: val,
          purchaseStatus: 0
        }),
        categoryPurchaseDealer({ // 可采购门店
          categorySpareId: val,
          purchaseStatus: 1
        })
      ]);

      // 区分状态，分别存储
      this.noTableData = status0Res?.records || [];
      this.tableData = status1Res?.records || [];
    },
    // 处理删除门店事件
    async handleDeleteStore (value) {
      await deleteDealer([value]);
      this.getPurchaseDealer(this.partsId);
    }
  }
};
</script>

<style scoped>
.cascader {
  width: 100%;
}
.action-button{
  margin: 0 5px;
  cursor: pointer;
  &.btn-edit{
    color:#4C4CD6;
  }
  &.btn-delete{
    color:#B91919;
  }
}
</style>
