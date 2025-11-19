<template>
  <div class="page-common-detail m-repair-item-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>维修项目代码：{{ info.code }}</h2>
        <el-button size="small" @click="handleEdit" icon="el-icon-edit">编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="120px">
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
              {{ info.status  }}
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
              {{ info.isBatteryRepair  }}
            </el-form-item>
            <el-form-item label="是否活动专用：" prop="isActivity">
              {{ info.isActivity  }}
            </el-form-item>
            <el-form-item label="是否保修专用：" prop="isWarranty">
              {{ info.isWarranty  }}
            </el-form-item>
            <el-form-item label="是否生产类专用：" prop="isProdType">
              {{ info.isProdType  }}
            </el-form-item>
            <el-form-item label="是否预约专用：" prop="isReservation">
              {{ info.isReservation  }}
            </el-form-item>
            <el-form-item label="预约项目名称：" prop="appointmentItemName">
              {{ info.appointmentItemName  }}
            </el-form-item>
            <el-form-item label="：" prop="updateTime">
              {{ info.updateTime  }}
            </el-form-item>
            <el-form-item label="：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
            <el-form-item label="状态变更描述：" prop="statusDesc">
              {{ info.statusDesc  }}
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
          </el-form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/maintain/basic/repairItem/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
export default {
  name: 'repairItemDetail',
  components: {
  },
  data () {
    return {
      loading: true,
      info: {},
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
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>
