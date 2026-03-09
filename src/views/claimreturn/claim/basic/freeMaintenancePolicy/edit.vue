<template>
  <!-- TIPS: 如果填写项小于15项，使用类名page-common-add替换page-common-edit -->
  <edit-page-layout ref="editLayout" :title="pannelTitle" :width="40">
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="`政策名称：${form.policyName}`"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 如果填写项小于15项，去掉 :inline="true" -->
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-if="isEditing || !_id">
                <el-form-item label="政策名称：" prop="policyName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.policyName"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="政策类型：" prop="policyType">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="claim_free_maintenance_policy_type"
                    v-model="form.policyType"
                    placeholder="请选择"
                    clearable
                    filterable
                  />
                </el-form-item>
                <el-form-item label="维修项目代码：" prop="repairItemId">
                  <fetch-select
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    v-model="form.repairItemId"
                    :remote-method="repairItemSearch"
                    :params="form.repairItemCode"
                    @change="handleRepairItemChange"
                    value-key="id"
                    label-key="code"
                    placeholder="请输入项目代码/名称"
                  />
                </el-form-item>
                <el-form-item label="维修项目名称：" prop="repairItemName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.repairItemName"
                    clearable
                    maxLength="100"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="工时数：" prop="workhour">
                  <el-input
                    placeholder="请输入"
                    v-model="form.workhour"
                    clearable
                    maxLength="100"
                    disabled
                  />
                </el-form-item>
                <el-form-item label="免保时间：" prop="freePeriod">
                  <el-input
                    placeholder="请输入"
                    v-model="form.freePeriod"
                    clearable
                    maxLength="100"
                  >
                    <template slot="append">月</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="里程：" prop="mileage">
                  <el-input
                    placeholder="请输入"
                    v-model="form.mileage"
                    clearable
                    maxLength="100"
                  >
                    <template slot="append">公里</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="延后天数：" prop="delayDays">
                  <el-input
                    placeholder="请输入"
                    v-model="form.delayDays"
                    clearable
                    maxLength="100"
                  >
                    <template slot="append">天</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="延后里程：" prop="delayMileage">
                  <el-input
                    placeholder="请输入"
                    v-model="form.delayMileage"
                    clearable
                    maxLength="100"
                  >
                    <template slot="append">公里</template>
                  </el-input>
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-else>
                <el-form-item label="政策名称：" prop="policyName">
                  {{ form.policyName }}
                </el-form-item>
                <el-form-item label="政策类型：" prop="policyType">
                  {{ form.policyTypeLabel }}
                </el-form-item>
                <el-form-item label="维修项目代码：" prop="repairItemCode">
                  {{ form.repairItemCode }}
                </el-form-item>
                <el-form-item label="维修项目名称：" prop="repairItemName">
                  {{ form.repairItemName }}
                </el-form-item>
                <el-form-item label="工时数：" prop="workhour">
                  {{ form.workhour }}
                </el-form-item>
                <el-form-item label="免保时间：" prop="freePeriod">
                  {{ form.freePeriod }}
                </el-form-item>
                <el-form-item label="里程：" prop="mileage">
                  {{ form.mileage }}
                </el-form-item>
                <el-form-item label="延后天数：" prop="delayDays">
                  {{ form.delayDays }}
                </el-form-item>
                <el-form-item label="延后里程：" prop="delayMileage">
                  {{ form.delayMileage }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header common-section-tip">
              <h2>零件信息</h2><span class="p-1">个别公告车型使用不同零件时可以添加多套方案，常规只需使用默认方案即可。</span>
            </div>
            <div class="common-section-body">
              <section class="common-section">
                <enhanced-tabs
                  v-model="currentVehicleId"
                  :load-params="loadParams"
                  :load-data="loadData"
                  :item-config="{
                    valueKey: 'vehicleRegisteredModelId',
                    labelKey: 'vehicleRegisteredModelName',
                    disableCloseKey: 'disableClose',
                    disableFirst: true,
                  }"
                  close-tip="确定删除该公共车型吗？"
                  :remote-method="remoteMethod"
                  :select-config="{
                    valueKey: 'id',
                    labelKey: 'name',
                    placeholder: '请输入公告车型代码/名称',
                  }"
                  @remove="onRemove"
                  />
                </section>
                <section class="common-section">
                  <div
                    v-if="canAddOrUpdate && _id"
                    class="common-section-header"
                  >
                    <base-search
                      v-if="canAddOrUpdate"
                      filterable
                      clearable
                      remote
                      reserve-keyword
                      v-model="part"
                      :remote-method="partRemote"
                      @change="handlePartChange"
                      value-key="id"
                      label-key="partName"
                      subLabelKey="partCode"
                      placeholder="请输入零件编码/名称"
                    />
                  </div>
                  <part-table
                    :moduleKey="moduleKey"
                    ref="partTable"
                    :currentVehicleId="currentVehicleId"
                    :id="id"
                    @replace="onReplace"
                    >
                  </part-table>
                </section>
            </div>
          </section>
        </el-main>
      </edit-base-container>
     </template>
    <template #right>
      <div class="page-common-edit">
        <replace-table
          :moduleKey="moduleKey"
          ref="replaceTable"
          :id="id"
          :replacePart="replacePart"
          >
        </replace-table>
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import FetchSelect from '@/libs/components/FetchSelect';
import EditPageLayout from '@/libs/components/EditPageLayout';
import BaseSearch from '@/libs/components/BaseSearch';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getList } from '@/api/maintain/basic/repairItem';
import { debounce } from 'lodash';
import { uIntRule } from '@/validation/rule';
import EnhancedTabs from '@/libs/components/EnhancedTabs';
import { getDetail, addOrUpdate, freeMaintenancePolicyPartDetailList, freeMaintenancePolicyPartDetailDeleteVehicle } from '../../../../../api/claimreturn/claim/basic/freeMaintenancePolicy';
import { vehicleSalesVersionList, getEnum, sparePartList } from '../../../../../api/common';
import PartTable from './PartTable.vue';
import ReplaceTable from './ReplaceTable.vue';
import EditBaseContainer from '@/libs/components/EditBaseContainer';

const defaultForm = {
  // 多选时字段有变化，自行修复
  policyName: '',
  repairItemCode: '',
  repairItemName: '',
  policyType: '',
  freePeriod: '',
  mileage: '',
  delayDays: '',
  delayMileage: '',
  workhour: '',
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
  dataSource: '',
  repairItemId: '',
  parts: '',
};

export default {
  name: 'freeMaintenancePolicyEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditBaseContainer,
    FetchSelect,
    PartTable,
    EditPageLayout,
    EnhancedTabs,
    BaseSearch,
    ReplaceTable,
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    loadParams () {
      return { freeMaintenancePolicyId: this._id };
    },
  },
  watch: {
    id: {
      handler (val) {
        if (this.$refs.editLayout) {
          this.$refs.editLayout.closePane();
        }
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
      pageTitle: '免费保养政策',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-freeMaintenancePolicy',
      yes_no_enum: YES_NO_ENUM,
      pannelTitle: '',
      form: { ...form },
      originalForm: { ...form },
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
      },
      rules: {
        policyName: [
          { required: true, message: '请输入政策名称', trigger: 'blur' }
        ],
        repairItemId: [
          { required: true, message: '请输入维修项目代码', trigger: 'blur' }
        ],
        policyType: [
          { required: true, message: '请选择政策类型（免费保养，终身免费保养）', trigger: 'change' }
        ],
        freePeriod: [
          { required: true, message: '请输入免保时间（月）（最小为0）', trigger: 'blur' },
          uIntRule,
        ],
        mileage: [
          { required: true, message: '请输入里程（最小为0）', trigger: 'blur' },
          uIntRule,
        ],
      },
      //
      currentVehicleId: '',
      //
      part: '',
      curPart: null,
      // 替换件
      replacePart: null,
    };
  },
  mounted () {
  },
  methods: {
    // 项目维修代码
    handleRepairItemChange (val, record) {
      if (record) {
        const regex = /(\d+(?:\.\d+)?)\s*公里/;
        const match = record.name.match(regex);
        if (match) {
          this.form.mileage = parseFloat(match[1]);
        }
        const regex2 = /(\d+(?:\.\d+)?)\s*个月/;
        const match2 = record.name.match(regex2);
        if (match) {
          this.form.freePeriod = parseFloat(match2[1]);
        }

        this.form.repairItemId = record.id;
        this.form.repairItemCode = record.code;
        this.form.repairItemName = record.name;
        this.form.workhour = record.workhour;
      }
    },
    // 项目维修代码
    async repairItemSearch (query) {
      return getList({
        maintenanceItemTypes: [],
        nameOrCodeOrPinyinLike: query,
        pageSize: 20,
        pageNum: 1,
      });
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    async submitRequest () {
      return addOrUpdate({ ...this.form });
    },
    getDefautlForm () {
      return {
        ...defaultForm
      };
    },
    // 详情表格相关数据
    handleAddPart: debounce(function () {
      if (!this.part) {
        this.$message.error('请选择零件');
        return null;
      }
      const partId = this.part;
      const cur = this.curPart;
      this.part = '';

      const newItem = {
        partId: partId,
        partCode: cur.partCode,
        partName: cur.partName,
        purchasePrice: cur.purchasePrice,
        partQuantity: 1,
      };
      this.$refs.partTable.handleAdd(newItem);
    }, 200),
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    // 零件
    partRemote (query) {
      // 是否OEM, 是否启用
      return sparePartList({ partCodeOrNameLike: query, oemPart: 1, status: 1 });
    },
    handlePartChange (val, record) {
      this.curPart = record;
      this.handleAddPart();
    },
    // 公告车型
    loadData (params) {
      return freeMaintenancePolicyPartDetailList(params);
    },
    remoteMethod (query) {
      return vehicleSalesVersionList({
        registeredModelNameLike: query,
        pageSize: 20,
        pageNum: 1,
      });
    },
    onRemove (item, index, defer) {
      if (!item.vehicleRegisteredModelId) {
        return;
      }
      freeMaintenancePolicyPartDetailDeleteVehicle({
        freeMaintenancePolicyId: this._id,
        vehicleRegisteredModelId: item.value,
      }).then(() => {
        this.$message.success('操作成功');
      });
    },
    //
    onReplace (row, rowIndex) {
      this.replacePart = row;
      this.pannelTitle = `零件编码: ${row.partCode}`;
      this.$refs.editLayout.openPane();
    }
  }
};
</script>
<style lang="scss" scoped>
  .common-section{
    .common-section-tip{
      justify-content: flex-start;
      .p-1{
        padding-left: 4px;
        color: #9D9F9D;
      }
    }
  }
</style>
