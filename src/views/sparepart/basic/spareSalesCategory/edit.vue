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
          <span :class="['status', form.status ? 'primary' : 'danger']">{{ form.statusLabel }}</span>
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="营销分类编码：" prop="categoryCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.categoryCode"
                    clearable
                    :disabled="!!partsId"
                  />
                </el-form-item>
                <el-form-item label="营销分类名称：" prop="categoryName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.categoryName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="可采购建店类型：" prop="buildTypeCode">
                  <el-select
                    v-model="form.buildTypeCode"
                    multiple
                    placeholder="请选择"
                    collapse-tags
                    clearable
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
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="营销分类编码：">
                  {{ form.categoryCode }}
                </el-form-item>
                <el-form-item label="营销分类名称：">
                  {{ form.categoryName }}
                </el-form-item>
                <el-form-item label="是否启用：">
                  {{ form.statusLabel }}
                </el-form-item>
                <el-form-item label="创建时间：">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="修改时间：">
                  {{ form.updateTime }}
                </el-form-item>
                <el-form-item label="建店类型：" style="width: 100%;">
                  {{ buildTypeNamesString }}
                </el-form-item>
                <el-form-item label="备注：" style="width: 100%;">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>可采购门店</h2>
            </div>
            <div class="common-section-body">
              <div class="ais-select-group" v-if="partsId && isEditing">
                <base-search
                  style="width: 300px;"
                  filterable
                  clearable
                  remote
                  placeholder="请选择"
                  v-model="dealerCodes"
                  :remote-method="getDealerList"
                  @change="(val, ele) => handleStoreChange(val, ele, 1)"
                  label-key="orgName"
                  value-key="orgCode"
                  subLabelKey="orgCode"
                />
              </div>
              <div class="common-section-table">
                <expand-table
                  ref="expandTable"
                  :columns="columns"
                  :data="tableData"
                  :auth="{
                    add: false,
                    edit: false,
                    delete: true,
                  }"
                  :delTitle="'确认删除该门店吗？'"
                  :show-toolbar="false"
                  showPagination
                  :current="procurable.current"
                  :pageSize="procurable.pageSize"
                  :total="procurable.total"
                  @page-size-change="pageSizeChange"
                  @current-page-change="currentPageChange"
                  @remove-row="handleDeleteStore"
                />
              </div>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>不可采购门店</h2>
            </div>
            <div class="common-section-body">
              <div class="ais-select-group" v-if="partsId && isEditing">
                <base-search
                  style="width: 300px;"
                  filterable
                  clearable
                  remote
                  placeholder="请选择"
                  v-model="noDealerCodes"
                  :remote-method="getDealerList"
                  @change="(val, ele) => handleStoreChange(val, ele, 0)"
                  label-key="orgName"
                  value-key="orgCode"
                  subLabelKey="orgCode"
                />
              </div>
              <div class="common-section-table">
                <expand-table
                  ref="expandTable"
                  :columns="columns"
                  :data="noTableData"
                  :auth="{
                    add: false,
                    edit: false,
                    delete: true,
                  }"
                  :delTitle="'确认删除该门店吗？'"
                  :show-toolbar="false"
                  showPagination
                  :current="noProcurable.current"
                  :pageSize="noProcurable.pageSize"
                  :total="noProcurable.total"
                  @page-size-change="noPageSizeChange"
                  @current-page-change="noCurrentPageChange"
                  @remove-row="handleDeleteStore"
                />
              </div>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate, categoryPurchaseDealer, addDealer, deleteDealer } from '@/api/sparepart/basic/spareSalesCategory/index';
import { getEnum, getBuildType, listOrgStoreInfoByParam } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import expandTable from '@/libs/components/expandTable';
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import BaseSearch from '@/libs/components/BaseSearch';

const defaultForm = {
  categoryCode: '',
  categoryName: '',
  statusLabel: '',
  buildTypeCode: [],
};

export default {
  name: 'spareSalesCategoryEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    expandTable,
    EditPageLayout,
    EditBaseContainer,
    BaseSearch
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '营销分类编码：' + (this.form.categoryCode || '');
    },
    buildTypeNamesString () {
    // 1. 获取数组引用
      const list = this.form.categoryBuildTypeRespList;

      // 2. 安全检查：先判断是否存在且为数组，防止报错
      if (!list || !Array.isArray(list)) return '';

      // 3. 链式调用：直接 map 提取名称并 join 拼接
      return list.map(item => item.buildTypeName).join('、');
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
      pageTitle: '备件销售分类',
      pageType: 'edit',
      moduleKey: 'AISPART-spareSalesCategory',
      loading: false,
      submitLoading: false,
      info: {},
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      partsId: null,
      procurable: {
        pageSize: 10,
        total: 0,
        current: 1,
      },
      noProcurable: {
        pageSize: 10,
        total: 0,
        current: 1,
      },
      storeTypeOptions: [],
      tableData: [],
      storeOptions: [],
      storeParams: {},
      dealerCodes: '',
      noDealerCodes: '',
      noTableData: [],
      rules: {
        categoryCode: [
          { required: true, message: '请输入营销分类编码', trigger: 'blur' }
        ],
        categoryName: [
          { required: true, message: '请输入营销分类名称', trigger: 'blur' }
        ],
      },
      columns: [
        {
          field: 'dealerName',
          title: '门店名称',
          width: '23%',
        },
        {
          field: 'dealerCode',
          title: '门店编码',
          width: '23%',
        },
        {
          field: 'createTime',
          title: '添加时间',
          width: '23%',
        },
        {
          field: 'creatorName',
          title: '操作人',
          width: '22%',
        }
      ],
    };
  },
  mounted () {
    this.getStore();
    this.partsId = this.$route.query.id;
    if (this.partsId) {
      this.getPurchaseDealer(this.$route.query.id);
    }
  },
  methods: {
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          res.buildTypeCode = res.categoryBuildTypeRespList?.map(item => Number(item.buildTypeCode)) || [];
          return res;
        });
      }
      return {};
    },
    submitRequest () {
      const newArray = this.form.buildTypeCode.map(code => {
        const matchedItem = this.storeTypeOptions.find(item => item.value === code);
        return {
          buildTypeCode: code,
          buildTypeName: matchedItem?.label
        };
      });
      return addOrUpdate({ ...this.form, buildTypeList: newArray });
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    async getStore () {
      const res = await getBuildType();
      if (res && Array.isArray(res)) {
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
    async getDealerList (query) {
      try {
        const res = await listOrgStoreInfoByParam({ orgCodeOrName: query });
        return res;
      } catch (error) {
        return [];
      }
    },
    handleStoreChange (val, ele, type) {
      this.storeParams = {
        dealerCode: ele.orgCode,
        dealerName: ele.orgName,
        categorySpareId: this.partsId
      };
      if (type === 0) {
        this.handleAddStores(type); // 不可采购门店
      } else if (type === 1) {
        this.handleAddStore(type); // 可采购门店
      }
    },
    // 可采购门店
    async handleAddStore (val) {
      if (!this.dealerCodes) {
        return;
      }
      const params = {
        purchaseStatus: val,
        ...this.storeParams
      };
      await addDealer(params);
      this.getPurchaseDealer(this.partsId, val);
      this.dealerCodes = '';
      this.storeParams = {};
    },
    // 不可采购门店
    async handleAddStores (val) {
      if (!this.noDealerCodes) {
        return;
      }
      const params = {
        purchaseStatus: val,
        ...this.storeParams
      };
      await addDealer(params);
      this.getPurchaseDealer(this.partsId, val);
      this.noDealerCodes = '';
      this.storeParams = {};
    },
    async getPurchaseDealer (val, status) {
      const [status0Res, status1Res] = await Promise.all([
        categoryPurchaseDealer({
          categorySpareId: val,
          purchaseStatus: 0,
          pageSize: this.noProcurable.pageSize,
          pageNum: this.noProcurable.current,
        }),
        categoryPurchaseDealer({
          categorySpareId: val,
          purchaseStatus: 1,
          pageSize: this.procurable.pageSize,
          pageNum: this.procurable.current,
        })
      ]);
      this.noTableData = status0Res?.records || [];
      this.noProcurable.total = status0Res?.total || 0;
      this.tableData = status1Res?.records || [];
      this.procurable.total = status1Res?.total || 0;
    },
    async handleDeleteStore (value) {
      await deleteDealer([value.id]);
      this.getPurchaseDealer(this.partsId);
    },
    pageSizeChange (pageSize) {
      this.procurable.pageSize = pageSize;
      this.procurable.current = 1;
      this.getPurchaseDealer(this.partsId);
    },
    noPageSizeChange (pageSize) {
      this.noProcurable.pageSize = pageSize;
      this.noProcurable.current = 1;
      this.getPurchaseDealer(this.partsId);
    },
    currentPageChange (current) {
      this.procurable.current = current;
      this.getPurchaseDealer(this.partsId);
    },
    noCurrentPageChange (current) {
      this.noProcurable.current = current;
      this.getPurchaseDealer(this.partsId);
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
.common-section-table {
  margin-top: 20px;
}
</style>
