<template>
  <div class="page-common-detail m-service-activity-vehicle-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>活动编码：{{ info.activityCode }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="120px">
            <!-- TIPS: 根据实际情况调整展示字段 -->
            <el-form-item label="活动编码：" prop="activityCode">
              {{ info.activityCode  }}
            </el-form-item>
            <el-form-item label="活动名称：" prop="activityName">
              {{ info.activityName  }}
            </el-form-item>
            <el-form-item label="VIN：" prop="vin">
              {{ info.vin  }}
            </el-form-item>
            <el-form-item label="计划实施门店：" prop="plannedDealerName">
              {{ info.plannedDealerName  }}
            </el-form-item>
            <el-form-item label="车主姓名：" prop="ownerName">
              {{ info.ownerName  }}
            </el-form-item>
            <el-form-item label="车主手机号码：" prop="ownerPhone">
              {{ info.ownerPhone  }}
            </el-form-item>
            <el-form-item label="是否完成：" prop="finished">
              {{ info.finishedLabel  }}
            </el-form-item>
            <el-form-item label="完成时间：" prop="finishTime">
              {{ info.finishTime  }}
            </el-form-item>
            <el-form-item label="实际施工门店名称：" prop="actualDealerName">
              {{ info.actualDealerName  }}
            </el-form-item>

            <el-form-item label="接车施工单号：" prop="workOrderNo">
              {{ info.workOrderNo  }}
            </el-form-item>
            <el-form-item label="施工方案：" prop="schemeName">
              {{ info.schemeName  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/claimreturn/claim/basic/serviceActivityVehicle';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

export default {
  name: 'serviceActivityVehicleDetail',
  mixins: [permissions, commonMixins],
  components: {
  },
  data () {
    return {
      pageTitle: '新页面',
      pageType: 'detail',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-serviceActivityVehicle',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['服务活动车辆', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/claimreturn/basic/serviceActivityVehicle/edit',
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
