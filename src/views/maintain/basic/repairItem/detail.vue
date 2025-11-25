<template>
  <div class="page-common-detail m-repair-item-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>维修项目代码：{{ info.code }}</h2>
        <el-button size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="150px">
            <el-form-item label="维修项目代码：" prop="code">
              {{ info.code  }}
            </el-form-item>
            <el-form-item label="维修项目名称：" prop="name">
              {{ info.name  }}
            </el-form-item>
            <el-form-item label="拼音简码：" prop="pinyinCode">
              {{ info.pinyinCode  }}
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              {{ info.statusLabel  }}
            </el-form-item>
            <el-form-item label="工时：" prop="workhour">
              {{ info.workhour  }}
            </el-form-item>
            <el-form-item label="工时单价：" prop="workhourPrice">
              {{ info.workhourPrice  }}
            </el-form-item>
            <el-form-item label="保养项目分类：" prop="maintenanceItemType">
              {{ info.maintenanceItemType  }}
            </el-form-item>
            <el-form-item label="保养时间（月）：" prop="maintenanceTime">
              {{ info.maintenanceTime  }}
            </el-form-item>
            <el-form-item label="保养里程（KM）：" prop="maintenanceMileage">
              {{ info.maintenanceMileage  }}
            </el-form-item>
            <el-form-item label="是否电池维修专用：" prop="isBatteryRepair">
              {{ info.isBatteryRepairLabel  }}
            </el-form-item>
            <el-form-item label="是否活动专用：" prop="isActivity">
              {{ info.isActivityLabel  }}
            </el-form-item>
            <el-form-item label="是否保修专用：" prop="isWarranty">
              {{ info.isWarrantyLabel  }}
            </el-form-item>
            <el-form-item label="是否生产类专用：" prop="isProdType">
              {{ info.isProdTypeLabel  }}
            </el-form-item>
            <el-form-item label="是否预约专用：" prop="isReservation">
              {{ info.isReservationLabel  }}
            </el-form-item>
            <el-form-item label="预约项目名称：" prop="appointmentItemName">
              {{ info.appointmentItemName  }}
            </el-form-item>
            <el-form-item label="更新时间：" prop="updateTime">
              {{ info.updateTime  }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
            <el-form-item label="维修项目类型：" prop="repairItemTypeId">
              {{ info.repairItemTypeId  }}
            </el-form-item>
            <el-form-item label="维修项目类型名称：" prop="repairItemTypeName">
              {{ info.repairItemTypeName  }}
            </el-form-item>
            <el-form-item label="里程间隔计算标准：" prop="mileageInterval">
              {{ info.mileageInterval  }}
            </el-form-item>
            <el-form-item label="时间间隔计算标准：" prop="timeInterval">
              {{ info.timeInterval  }}
            </el-form-item>
            <el-form-item label="下次保养计算里程：" prop="nextMaintenanceMileage">
              {{ info.nextMaintenanceMileage  }}
            </el-form-item>
            <el-form-item label="下次保养计算时间：" prop="nextMaintenanceTime">
              {{ info.nextMaintenanceTime  }}
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>适配车型</h2>
        </div>
        <div class="common-section-body">
          <div class="common-section-table">
            <edit-table
              ref="editTable"
              :columns="columns"
              :data="tableData"
              :show-toolbar="false"
            />
          </div>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>适配配件</h2>
        </div>
        <div class="common-section-body">
          <div class="common-section-table">
            <edit-table
              ref="editTablePj"
              :columns="columnsPj"
              :data="tableDataPj"
              :show-toolbar="false"
            />
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/maintain/basic/repairItem/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import EditTable from '@/libs/components/EditTable';
export default {
  name: 'repairItemDetail',
  components: {
    EditTable
  },
  data () {
    return {
      loading: true,
      info: {},
      tableData: [],
      tableDataPj: [],
      columnsPj: [
        {
          field: 'partsCode',
          title: '配件编码',
          width: '25%',
        },
        {
          field: 'partsName',
          title: '配件名称',
          width: '25%',
        },
        {
          field: 'isOemPart',
          title: '是否 OEM 配件',
          width: '25%',
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '25%',
        },
      ],
      columns: [
        {
          field: 'vehicleYearType',
          title: '年款',
          width: '16%',
        },
        {
          field: 'vehicleModelName',
          title: '车型',
          width: '16%',
        },
        {
          field: 'vehicleSeriesName',
          title: '车系',
          width: '16%',
        },
        {
          field: 'vehicleModelDesc	',
          title: '车型描述',
          width: '16%',
        },
        {
          field: 'remark',
          title: '备注',
          width: '16%',
        },
        {
          field: 'createTime',
          title: '创建时间',
          width: '16%',
        },
      ],
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['维修项目管理', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/maintain/basic/repairItem/edit',
        query: {
          id: this.$route.query.id
        }
      });
    },
    getData () {
      getDetail(this.$route.query.id).then(res => {
        this.loading = false;
        this.info = res;
        this.tableData = res.modelRespList || [];
        this.tableDataPj = res.partsRespList || [];
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>
