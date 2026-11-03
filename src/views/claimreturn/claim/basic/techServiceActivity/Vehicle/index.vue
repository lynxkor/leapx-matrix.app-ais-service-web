<template>
  <section class="common-section">
    <div class="common-section-header common-section-tip">
      <h2>车辆信息</h2>
    </div>
    <div class="common-section-body" v-if="id">
      <section class="common-section" style="display: flex;" v-if="canAddOrUpdate">
         <base-search
          :style="{marginRight: '8px'}"
          filterable
          clearable
          remote
          reserve-keyword
          :value="vin"
          :remote-method="vinRemote"
          :params="vin"
          @change="handleVin"
          placeholder="输入VIN"
          labelKey="vin"
          value-key="vin"
        />
        <el-button size="small" @click="handleImport">导入车辆</el-button>
      </section>
      <section class="common-section"  v-if="canDetail">
        <vehicle-table
          :moduleKey="moduleKey"
          ref="vehicleTable"
          :id="id"
          :isServiceCareActivity="isServiceCareActivity"
          />
      </section>
    </div>
    <div class="common-section-body not-commit" v-else>
      提交新建后，即可添加
    </div>
    <Upload
      :visible="uploadDialogVisible"
      id="serviceActivityVehicleInActivity"
      :business-params="id"
      :async="true"
      @close="handleUploadDialogClose"
      @getData="getData"
    />
  </section>
</template>
<script>
import {
  serviceActivityVehicleUpdate
} from '@/api/claimreturn/claim/basic/serviceActivity';
import permissions from '@/libs/mixins/permissions';
import { getEnum } from '@/api/common';
import VehicleTable from './VehicleTable.vue';
import { vehicleListFullByVin } from '@/api/datacenter/vehicle/vehicleProfile';
import BaseSearch from '@/libs/components/BaseSearch';
import Upload from '@/libs/components/UploadDialog/index.vue';

export default {
  props: {
    id: {
      type: String,
    },
    isEditing: {
      type: Boolean,
      default: true,
    },
    moduleKey: {
      type: String,
      required: true,
    },
    isServiceCareActivity: {
      type: Boolean,
    }
  },
  mixins: [permissions],
  components: {
    VehicleTable,
    BaseSearch,
    Upload,
  },
  data () {
    return {
      vin: '',
      //
      form: {
        id: '',
        activityId: '',
        schemeName: '',
        allowModifyOldPart: false, // true, '1'
        status: false, // true, 1
        mainPartId: '',
        mainPartName: '',
        mainSupplierId: '',
        mainSupplierName: '',
        vrtId: '',
        vrtName: '',
        vfgId: '',
        vfgName: '',
        responsibleDept: '',
        description: '',
      },
      rules: {
        checkoutTypeId: [
          { required: true, message: '请选择结算类型ID', trigger: 'change' }
        ],
        mainPartName: [
          { required: true, message: '请选择主因零部件', trigger: 'blur' }
        ]
      },
      supplierOptions: [],
      menus: [
        {
          label: '复制',
          value: 'copy',
        },
        {
          label: '删除',
          value: 'delete',
        },
      ],
      //
      uploadDialogVisible: false,
    };
  },
  computed: {
    loadParams () {
      return {
        activityId: this.id,
      };
    }
  },
  watch: {
  },
  methods: {
    getData () {
      this.$refs.vehicleTable.getDetailPageApi();
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    vinRemote (query) {
      return vehicleListFullByVin({
        searchVin: query,
        limitSize: 20,
      });
    },
    handleVin (val, selectedItem) {
      serviceActivityVehicleUpdate({
        vin: val,
        activityId: this.id,
      }).then(res => {
        this.getData();
      });
    },
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
  }
};

</script>
<style lang="scss" scoped>
.common-section-header{
  font-size: 14px;
  font-weight: 500;
}
.el-button {
  font-weight: 400;
}
</style>
