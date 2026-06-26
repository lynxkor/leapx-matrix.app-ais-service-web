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
        <template #extraButtons>
          <!-- <el-button v-if="form.id" size="small" @click="handleJumpAuditLog">审核日志</el-button> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit" v-show="isEditing || !_id">
                <el-form-item label="维修项目代码：" prop="code">
                  <el-input
                    placeholder="请输入"
                    v-model="form.code"
                    clearable
                    maxLength="50"
                    show-word-limit
                  />
                </el-form-item>
                <el-form-item label="维修项目名称：" prop="name">
                  <el-input
                    placeholder="请输入"
                    v-model="form.name"
                    clearable
                    maxLength="50"
                    show-word-limit
                  />
                </el-form-item>
                <el-form-item label="维修类型：" prop="repairItemTypeId">
                  <fetch-select
                    :remote-method="repairItemSearch"
                    remote
                    v-model="form.repairItemTypeId"
                    placeholder="请输入维修类型名称"
                    labelKey="label"
                    valueKey="value"
                    clearable
                    filterable
                    @change="handleRepairItemChange"
                  />
                </el-form-item>
                <el-form-item label="拼音简码：" prop="pinyinCode">
                  <el-input
                    placeholder="请输入"
                    v-model="form.pinyinCode"
                    clearable
                    maxLength="50"
                    show-word-limit
                  />
                </el-form-item>
                <el-form-item label="工时：" prop="workhour">
                  <el-input
                    placeholder="请输入"
                    v-model="form.workhour"
                    clearable
                    type="number"
                  />
                </el-form-item>
                <el-form-item label="工时单价：" prop="workhourPrice">
                  <el-input
                    placeholder="请输入"
                    v-model="form.workhourPrice"
                    clearable
                    type="number"
                  />
                </el-form-item>
                <el-form-item label="是否活动专用：" prop="isActivity">
                  <el-radio-group v-model="form.isActivity">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="是否保修专用：" prop="isWarranty">
                  <el-radio-group v-model="form.isWarranty">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="是否电池维修专用：" prop="isBatteryRepair">
                  <el-radio-group v-model="form.isBatteryRepair">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="是否生产类专用：" prop="isProdType">
                  <el-radio-group v-model="form.isProdType">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="是否预约专用：" prop="isReservation">
                  <el-radio-group v-model="form.isReservation" @change="handleReservationChange">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="预约项目名称：" prop="appointmentItemName">
                  <el-input
                    placeholder="请输入"
                    v-model="form.appointmentItemName"
                    clearable
                    maxLength="50"
                    show-word-limit
                  />
                </el-form-item>
                <el-form-item label="保养项目分类：" prop="maintenanceItemType">
                  <fetch-select
                    :request="fetchOptionsMaintenanceItem"
                    enumCode="MaintenanceItemEnum"
                    v-model="form.maintenanceItemType"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="保养时间（月）：" prop="maintenanceTime">
                  <el-input
                    placeholder="请输入"
                    v-model="form.maintenanceTime"
                    clearable
                    type="number"
                  />
                </el-form-item>
                <el-form-item label="保养里程（KM）：" prop="maintenanceMileage">
                  <el-input
                    placeholder="请输入"
                    v-model="form.maintenanceMileage"
                    clearable
                    type="number"
                  />
                </el-form-item>
                <el-form-item label="里程间隔计算标准：" prop="mileageInterval">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="mc_mileage_interval"
                    v-model="form.mileageInterval"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="时间间隔计算标准：" prop="timeInterval">
                  <fetch-select
                    :request="fetchOptions"
                    enumCode="mc_time_interval"
                    v-model="form.timeInterval"
                    placeholder="请选择"
                    clearable
                  />
                </el-form-item>
                <el-form-item label="下次保养计算里程：" prop="nextMaintenanceMileage">
                  <el-input
                    placeholder="请输入"
                    v-model="form.nextMaintenanceMileage"
                    clearable
                    type="number"
                  />
                </el-form-item>
                <el-form-item label="下次保养计算时间：" prop="nextMaintenanceTime">
                  <el-input
                    placeholder="请输入"
                    v-model="form.nextMaintenanceTime"
                    clearable
                    type="number"
                  />
                </el-form-item>
                <el-form-item label="备注：" prop="remark" class="form-item-full">
                  <el-input
                    type="textarea"
                    style="width: 100%"
                    placeholder="请输入"
                    v-model="form.remark"
                    clearable
                    maxLength="500"
                    show-word-limit
                  />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="维修项目代码：">
                  {{ form.code }}
                </el-form-item>
                <el-form-item label="维修项目名称：">
                  {{ form.name }}
                </el-form-item>
                <el-form-item label="维修类型：">
                  {{ form.repairItemTypeName }}
                </el-form-item>
                <el-form-item label="拼音简码：">
                  {{ form.pinyinCode }}
                </el-form-item>
                <el-form-item label="工时：">
                  {{ form.workhour }}
                </el-form-item>
                <el-form-item label="工时单价：">
                  {{ form.workhourPrice }}
                </el-form-item>
                <el-form-item label="是否活动专用：">
                  {{ form.isActivityLabel }}
                </el-form-item>
                <el-form-item label="是否保修专用：">
                  {{ form.isWarrantyLabel }}
                </el-form-item>
                <el-form-item label="是否电池维修专用：">
                  {{ form.isBatteryRepairLabel }}
                </el-form-item>
                <el-form-item label="是否生产类专用：">
                  {{ form.isProdTypeLabel }}
                </el-form-item>
                <el-form-item label="是否预约专用：">
                  {{ form.isReservationLabel }}
                </el-form-item>
                <el-form-item label="预约项目名称：">
                  {{ form.appointmentItemName }}
                </el-form-item>
                <el-form-item label="保养项目分类：">
                  {{ form.maintenanceItemTypeLabel }}
                </el-form-item>
                <el-form-item label="保养时间（月）：">
                  {{ form.maintenanceTime }}
                </el-form-item>
                <el-form-item label="保养里程（KM）：">
                  {{ form.maintenanceMileage }}
                </el-form-item>
                <el-form-item label="里程间隔计算标准：">
                  {{ form.mileageIntervalLabel }}
                </el-form-item>
                <el-form-item label="时间间隔计算标准：">
                  {{ form.timeIntervalLabel }}
                </el-form-item>
                <el-form-item label="下次保养计算里程：">
                  {{ form.nextMaintenanceMileage }}
                </el-form-item>
                <el-form-item label="下次保养计算时间：">
                  {{ form.nextMaintenanceTime }}
                </el-form-item>
                <el-form-item label="备注：" class="form-item-full">
                  {{ form.remark }}
                </el-form-item>
              </el-form>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>适配车型</h2>
              <!-- <el-button v-if="canAddOrUpdate && isEditing" size="small" icon="el-icon-plus" @click="handleAddRow('cx')">添加</el-button> -->
            </div>
            <div class="common-section-body">
              <el-button v-if="canAddOrUpdate" type="primary" size="small" plain @click.stop="handleModel">适配车型</el-button>
              <div class="common-section-table">
                <edit-table
                  ref="editTable"
                  :columns="columns"
                  :data="tableData"
                  :defaultNewRow="defaultNewRow"
                  :show-toolbar="false"
                  :options="options"
                  :delTitle="delTitle"
                  :enableSingleRowSave="true"
                  @save-row-edit="saveRowEdit"
                  @remove-row="removeRow"
                  :auth="{edit: canAddOrUpdate, delete: canDelete}"
                />
              </div>
            </div>
          </section>
          <section class="common-section" v-if="_id">
            <div class="common-section-header">
              <h2>适配配件</h2>
              <!-- <el-button v-if="canAddOrUpdate && isEditing" size="small" icon="el-icon-plus" @click="handleAddRow('pj')">添加</el-button> -->
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <base-search
                  style="width: 360px;"
                  :remote-method="querySparePartsList"
                  remote
                  placeholder="搜索零件代码、名称、拼音简码"
                  clearable
                  value-key="value"
                  label-key="label"
                  @change="handlePartSelect"
                />
              </div>
              <div class="common-section-table">
                <edit-table
                  ref="editTablePj"
                  :columns="columnsPj"
                  :data="tableDataPj"
                  :defaultNewRow="defaultNewRowPj"
                  :show-toolbar="false"
                  :options="options"
                  :delTitle="delTitlePj"
                  :enableSingleRowSave="true"
                  @save-row-edit="saveRowEdit"
                  @remove-row="removeRow"
                  :auth="{edit: canAddOrUpdate, delete: canDelete}"
                >
                  <template v-slot:default="{ row, column, col }">
                    <div class="cell-content">
                      <template v-if="col.click">
                        <el-button class="link btn-text" @click="(e) => col.click(row, e)" type="text">{{ row[column.field] }}</el-button>
                      </template>
                      <span v-else class="cell-text">{{ row[column.field] }}</span>
                    </div>
                  </template>
                </edit-table>
              </div>
            </div>
          </section>
        </el-main>
        <VehicleModelDialog :visible.sync="modelDialogVisible" :initialData="tableData" @confirm="handleUpdateTableData" @close="handleCloseModel" />
      </edit-base-container>
    </template>
  </edit-page-layout>
</template>

<script>
import { getDetail, addOrUpdate } from '@/api/maintain/basic/repairItem/index';
import FetchSelect from '@/libs/components/FetchSelect';
import BaseSearch from '@/libs/components/BaseSearch';
import EditTable from '@/libs/components/EditTable';
import VehicleModelDialog from '@/libs/components/VehicleModelDialog';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum, listVehicleYearTypeFull, listVehicleYearType, repairItemType, listDealerPartWithOem, getMaintenanceItemEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  code: '',
  name: '',
  pinyinCode: '',
  workhour: '',
  workhourPrice: '',
  maintenanceItemType: null,
  maintenanceItemTypeLabel: '',
  maintenanceTime: '',
  maintenanceMileage: '',
  isBatteryRepair: 0,
  isActivity: 0,
  isWarranty: 0,
  isProdType: 0,
  isReservation: 0,
  isBatteryRepairLabel: '',
  isActivityLabel: '',
  isWarrantyLabel: '',
  isProdTypeLabel: '',
  isReservationLabel: '',
  appointmentItemName: '',
  remark: '',
  repairItemTypeId: '',
  repairItemTypeName: '',
  mileageInterval: '',
  mileageIntervalLabel: '',
  timeInterval: '',
  timeIntervalLabel: '',
  nextMaintenanceMileage: '',
  nextMaintenanceTime: '',
  statusLabel: '',
};

export default {
  name: 'repairItemEdit',
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    FetchSelect,
    EditTable,
    VehicleModelDialog,
    EditPageLayout,
    EditBaseContainer,
    BaseSearch
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '维修项目：' + (this.form.name || '');
    }
  },
  watch: {
    'form.isReservation': {
      handler (newVal) {
        if (Number(newVal) === 1) {
          this.rules.appointmentItemName[0].required = true;
        } else {
          this.rules.appointmentItemName[0].required = false;
          this.$nextTick(() => {
            this.$refs.ruleForm.clearValidate('appointmentItemName');
          });
        }
      },
      deep: true,
      immediate: true
    },
    'form.maintenanceItemType': {
      handler (newVal) {
        if (Number(newVal) === 0) {
          this.rules.maintenanceTime[0].required = false;
          this.rules.maintenanceMileage[0].required = false;
          this.rules.mileageInterval[0].required = false;
          this.rules.timeInterval[0].required = false;
          this.rules.nextMaintenanceMileage[0].required = false;
          this.rules.nextMaintenanceTime[0].required = false;
          this.$nextTick(() => {
            this.$refs.ruleForm.clearValidate('maintenanceTime');
            this.$refs.ruleForm.clearValidate('maintenanceMileage');
            this.$refs.ruleForm.clearValidate('mileageInterval');
            this.$refs.ruleForm.clearValidate('timeInterval');
            this.$refs.ruleForm.clearValidate('nextMaintenanceMileage');
            this.$refs.ruleForm.clearValidate('nextMaintenanceTime');
          });
        } else {
          this.rules.maintenanceTime[0].required = true;
          this.rules.maintenanceMileage[0].required = true;
          this.rules.mileageInterval[0].required = true;
          this.rules.timeInterval[0].required = true;
          this.rules.nextMaintenanceMileage[0].required = true;
          this.rules.nextMaintenanceTime[0].required = true;
        }
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      pageTitle: '维修项目',
      pageType: 'edit',
      moduleKey: 'AISMC-repairItem',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      repairItemLoading: false,
      repairItemOptions: [],
      repairItemTimer: null,
      modelDialogVisible: false,
      form: { ...defaultForm },
      originalForm: { ...defaultForm },
      defaultNewRow: {
        vehicleYearType: '',
        vehicleModelName: '',
        vehicleSeriesName: '',
        vehicleModelDesc: '',
        remark: '',
        createTime: '',
      },
      defaultNewRowPj: {
        partsCode: '',
        partsName: '',
        isOemPart: null,
        createTime: '',
      },
      tableData: [],
      tableDataPj: [],
      options: {
        vehicleYearType: [],
        vehicleModelName: [],
        partsCode: [],
      },
      delTitle: '此操作将删除此维修项目-适配车型信息，您无法撤消此操作，是否继续？',
      delTitlePj: '此操作将删除此维修项目-适配配件信息，您无法撤消此操作，是否继续？',
      columns: [
        {
          field: 'vehicleYearType',
          title: '年款',
          width: '15%',
          editable: true,
          editRender: {
            name: 'ElSelect',
            props: {
              clearable: true,
              filterable: true,
              remote: true,
              'suffix-icon': 'el-icon-search',
              placeholder: '请选择年款',
              'remote-method': this.queryModelYear
            }
          },
        },
        {
          field: 'vehicleModelName',
          title: '车型',
          width: '15%',
          editable: true,
          editRender: {
            name: 'ElSelect',
            props: {
              clearable: true,
              filterable: true,
              remote: true,
              'suffix-icon': 'el-icon-search',
              placeholder: '请选择车型',
              'remote-method': this.querySearchAsync,
            }
          },
          rules: [
            { required: true, message: '车型不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'vehicleSeriesName',
          title: '车系',
          width: '15%',
          editRender: { name: 'ElInput' }
        },
        {
          field: 'vehicleModelDesc',
          title: '车型描述',
          width: '15%',
          editRender: { name: 'ElInput' }
        },
        {
          field: 'remark',
          title: '备注',
          editable: true,
          width: '15%',
          editRender: { name: 'ElInput' }
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '15%',
          editRender: { name: 'ElInput' }
        },
      ],
      columnsPj: [
        {
          field: 'partsCode',
          title: '零件代码',
          width: '22%',
          editable: true,
          editRender: {
            name: 'ElSelect',
            props: {
              clearable: true,
              filterable: true,
              remote: true,
              'suffix-icon': 'el-icon-search',
              placeholder: '请选择零件代码',
              'remote-method': this.querySpareParts,
            },
          },
          click: (row, e) => {
            e.stopPropagation();
            this.navigateToRoute({
              path: '/sparepart/basic/sparePart/edit',
              query: {
                id: row.partsId,
              },
            });
          },
          rules: [
            { required: true, message: '零件代码不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'partsName',
          title: '零件名称',
          width: '22%',
          editRender: { name: 'ElInput' },
        },
        {
          field: 'isOemPartLabel',
          title: '是否OEM件',
          width: '22%',
          editRender: { name: 'ElInput' }
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '22%',
          editRender: { name: 'ElInput' }
        }
      ],
      rules: {
        code: [
          { required: true, message: '请输入维修项目代码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入维修项目名称', trigger: 'blur' }
        ],
        pinyinCode: [
          { required: true, message: '请输入拼音简码', trigger: 'blur' }
        ],
        workhour: [
          { required: true, message: '请输入工时', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === '' || value === undefined || value === null) {
                callback();
                return;
              }
              if (isNaN(Number(value))) {
                callback(new Error('请输入有效的数字'));
                return;
              }
              if (Number(value) < 0) {
                callback(new Error('工时不能小于0'));
                return;
              }
              const strValue = value.toString();
              if (strValue.includes('.')) {
                const decimalPart = strValue.split('.')[1];
                if (decimalPart.length > 2) {
                  callback(new Error('最多只能输入两位小数'));
                  return;
                }
              }
              callback();
            },
            trigger: 'blur'
          }
        ],
        workhourPrice: [
          { required: true, message: '请输入工时单价', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === '' || value === undefined || value === null) {
                callback();
                return;
              }
              if (isNaN(Number(value))) {
                callback(new Error('请输入有效的数字'));
                return;
              }
              if (Number(value) < 0) {
                callback(new Error('工时单价不能小于0'));
                return;
              }
              const strValue = value.toString();
              if (strValue.includes('.')) {
                const decimalPart = strValue.split('.')[1];
                if (decimalPart.length > 2) {
                  callback(new Error('最多只能输入两位小数'));
                  return;
                }
              }
              callback();
            },
            trigger: 'blur'
          }
        ],
        maintenanceItemType: [
          { required: true, message: '请选择保养项目分类', trigger: 'change' }
        ],
        maintenanceTime: this.createNumberRule({
          fieldName: '请选择保养时间（月）',
          required: false
        }),
        maintenanceMileage: this.createNumberRule({
          fieldName: '请输入下次保养里程',
          required: false
        }),
        isBatteryRepair: [
          { required: true, message: '请输入是否电池维修专用', trigger: 'blur' }
        ],
        isActivity: [
          { required: true, message: '请输入是否活动专用', trigger: 'blur' }
        ],
        isWarranty: [
          { required: true, message: '请输入是否保修专用', trigger: 'blur' }
        ],
        isProdType: [
          { required: true, message: '请选择是否生产类专用', trigger: 'change' }
        ],
        isReservation: [
          { required: true, message: '请输入是否预约专用', trigger: 'blur' }
        ],
        appointmentItemName: [
          { required: false, message: '请输入预约项目名称', trigger: 'blur' }
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'blur' }
        ],
        repairItemTypeId: [
          { required: false, message: '请选择维修类型', trigger: 'change' }
        ],
        mileageInterval: [
          { required: false, message: '请输入里程间隔计算标准', trigger: 'blur' }
        ],
        timeInterval: [
          { required: false, message: '请选择时间间隔计算标准', trigger: 'change' }
        ],
        nextMaintenanceMileage: this.createNumberRule({
          fieldName: '请输入下次保养计算里程',
          required: false
        }),
        nextMaintenanceTime: this.createNumberRule({
          fieldName: '请选择下次保养计算时间',
          required: false
        }),
      }
    };
  },
  methods: {
    // 备件主数据表列表查询
    querySparePartsList (queryString) {
      return new Promise(resolve => {
        listDealerPartWithOem({ partCodeOrNameLike: queryString, status: 1, limitSize: 20 }).then(res => {
          const list = res?.map(item => {
            return {
              ...item,
              value: item.id,
              label: `${item.partCode}-${item.partName}`,
              partsId: item.id,
              partsName: item.partName,
              partsCode: item.partCode,
              isOemPart: item.oemPart,
              isOemPartLabel: item.oemPartLabel,
            };
          }) || [];
          resolve(list);
        });
      });
    },
    // 零件选择变更
    handlePartSelect (val, record) {
      this.tableDataPj.push({
        ...record,
        partsId: record.id,
        partsName: record.partName,
        partsCode: record.partCode,
        isOemPart: record.oemPart,
        oemPartLabel: record.oemPartLabel,
        id: null,
        createTime: null
      });
      addOrUpdate({ ...this.form, repairItemVehicleModelList: this.tableData, repairItemPartsList: this.tableDataPj }).then(res => {
        this.$message.success('添加成功');
        this.$refs.containerRef.handleRefresh();
      }).catch(e => {
        this.tableDataPj = this.tableDataPj.filter(item => item.id !== record.id);
      });
    },
    // 行保存
    async saveRowEdit (row, defer) {
      this.submitRequest().then(res => {
        defer.resolve(res);
        this.$message.success('更新成功');
        this.$refs.containerRef.handleRefresh();
      }).catch(e => {
        defer.reject();
      });
    },
    // 行删除
    async removeRow (row, index, defer) {
      this.submitRequest().then(res => {
        defer.resolve(res);
        this.$message.success('删除成功');
        this.$refs.containerRef.handleRefresh();
      }).catch(e => {
        defer.reject();
      });
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id).then(res => {
          this.tableData = res.modelRespList || [];
          this.tableDataPj = res.partsRespList || [];
          return res;
        });
      }
      return {};
    },
    async submitRequest () {
      // 先同步表格数据，确保编辑状态的数据已更新到组件内部
      let tableData = [];
      let tableDataPj = [];

      if (this.$refs.editTable) {
        try {
          tableData = await this.$refs.editTable.saveAll();
        } catch (e) {
          return Promise.reject(e);
        }
      }

      if (this.$refs.editTablePj) {
        try {
          tableDataPj = await this.$refs.editTablePj.saveAll();
        } catch (e) {
          return Promise.reject(e);
        }
      }

      const formData = { ...this.form };
      if (this._id) {
        delete formData.partsRespList;
        delete formData.modelRespList;
      }
      return addOrUpdate({ ...formData, repairItemVehicleModelList: tableData, repairItemPartsList: tableDataPj });
    },
    handleJumpAuditLog () {
      this.$auditLog.show({ id: this._id });
    },
    handleRepairItemChange (val) {
      const selectedVal = this.repairItemOptions.find(option => option.value === val);
      if (selectedVal) {
        this.form.repairItemTypeName = selectedVal.label;
      }
    },
    async repairItemSearch (query) {
      try {
        const res = await repairItemType({ nameLike: query, categorys: [10] });
        this.repairItemOptions = res?.map(item => {
          return {
            value: item.id,
            label: item.name
          };
        });
        return this.repairItemOptions;
      } catch (error) {
        console.error('Error fetching series list:', error);
      }
    },
    handleReservationChange (val) {
      if (this.$route.query.id) {
        if (val === 1) {
          this.$confirm('此操作将对C端APP用户预约产生影响，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.form.isReservation = 1;
          }).catch(() => {
            this.form.isReservation = 0;
          });
        }
      }
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    async fetchOptionsMaintenanceItem (code) {
      if (code) {
        return getMaintenanceItemEnum(code);
      }
      return [];
    },
    handleAddRow (val) {
      if (val === 'cx') {
        this.$refs.editTable.addRow();
      } else {
        this.$refs.editTablePj.addRow();
      }
    },
    handleSaveTable () {
      return new Promise((resolve, reject) => {
        this.$refs.editTable.saveAll().then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },
    handleSaveTablePj () {
      return new Promise((resolve, reject) => {
        this.$refs.editTablePj.saveAll().then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      });
    },
    queryModelYear (name) {
      listVehicleYearType({ yearTypeNameLike: name, status: 1, pageSize: 1000 }).then(res => {
        const list = res?.map(item => {
          return {
            ...item,
            value: item.id,
            label: item.name,
            vehicleYearType: item.name,
            vehicleYearTypeId: item.id,
          };
        }) || [];
        this.options.vehicleYearType = list;
      });
    },
    querySearchAsync (queryString, cb) {
      listVehicleYearTypeFull({ modelNameLike: queryString, status: 1, pageSize: 1000 }).then(res => {
        const list = res?.map(item => {
          return {
            ...item,
            value: item.id,
            label: item.modelName,
            vehicleModelId: item.id,
            vehicleModelName: item.modelName,
            vehicleSeriesId: item.seriesId,
            vehicleSeriesName: item.seriesName,
            vehicleModelDesc: item.remark,
          };
        }) || [];
        this.options.vehicleModelName = list;
      });
    },
    querySpareParts (queryString, cb) {
      listDealerPartWithOem({ partCodeOrNameLike: queryString, status: 1, limitSize: 20 }).then(res => {
        const list = res?.map(item => {
          let label = item.partCode || '';
          if (item.partName) {
            label += `- ${item.partName}`;
          }
          return {
            ...item,
            value: item.id,
            label: label,
            partsId: item.id,
            partsName: item.partName,
            partsCode: item.partCode,
            isOemPart: item.oemPart,
            oemPartLabel: item.oemPartLabel,
          };
        }) || [];
        this.options.partsCode = list;
      });
    },
    handleModel () {
      this.modelDialogVisible = true;
    },
    handleUpdateTableData (data) {
      this.tableData = [...data];
      this.$refs.containerRef.handleSubmit();
    },
    handleCloseModel () {
      this.modelDialogVisible = false;
    },
    createNumberRule ({ fieldName, unit = '', required = false, trigger = 'blur' }) {
      const displayName = unit ? `${fieldName}（${unit}）` : fieldName;
      return [
        {
          required,
          message: `请输入${displayName}`,
          trigger
        },
        {
          validator: (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
              callback();
              return;
            }
            const num = Number(value);
            if (isNaN(num)) {
              callback(new Error('请输入有效的数字'));
              return;
            }
            if (Math.floor(num) !== num) {
              callback(new Error('请输入整数'));
              return;
            }
            if (num < 0) {
              callback(new Error('请输入大于等于0的整数'));
              return;
            }
            callback();
          },
          trigger
        }
      ];
    },
  }
};
</script>

<style lang="scss" scoped>
.status.primary {
  color: var(--leap-color-primary);
  font-weight: 500;
}
</style>
