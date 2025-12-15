<template>
  <div class="page-common-detail m-service-activity-detail">
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
            <el-form-item label="枚举:claim_activity_type：" prop="activityType">
              {{ info.activityType  }}
            </el-form-item>
            <el-form-item label="活动状态,（未提交0，提交零配件准备 1，零配件准备完成 2）：" prop="activityStatus">
              {{ info.activityStatus  }}
            </el-form-item>
            <el-form-item label="活动开始时间：" prop="startTime">
              {{ info.startTime  }}
            </el-form-item>
            <el-form-item label="活动结束时间：" prop="endTime">
              {{ info.endTime  }}
            </el-form-item>
            <el-form-item label="施工单必需上传附件（1&#x3D;是，0&#x3D;否）：" prop="attachmentRequired">
              {{ info.attachmentRequired  }}
            </el-form-item>
            <el-form-item label="活动描述：" prop="description">
              {{ info.description  }}
            </el-form-item>
            <el-form-item label="活动数量：" prop="vehicleCount">
              {{ info.vehicleCount  }}
            </el-form-item>
            <el-form-item label="修改时间：" prop="updateTime">
              {{ info.updateTime  }}
            </el-form-item>
            <el-form-item label="完成数量：" prop="finishedVehicleCount">
              {{ info.finishedVehicleCount  }}
            </el-form-item>
            <el-form-item label="完成情况：" prop="finishedPercent">
              {{ info.finishedPercent  }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
            <el-form-item label="主键：" prop="id">
              {{ info.id  }}
            </el-form-item>
            <el-form-item label="创建者：" prop="creator">
              {{ info.creator  }}
            </el-form-item>
            <el-form-item label="创建者名称：" prop="creatorName">
              {{ info.creatorName  }}
            </el-form-item>
            <el-form-item label="修改者：" prop="modifier">
              {{ info.modifier  }}
            </el-form-item>
            <el-form-item label="修改者名称：" prop="modifierName">
              {{ info.modifierName  }}
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              {{ info.status  }}
            </el-form-item>
            <el-form-item label="状态变更描述：" prop="statusDesc">
              {{ info.statusDesc  }}
            </el-form-item>
            <el-form-item label="数据来源，140:新销服; 老销服:10：" prop="dataSource">
              {{ info.dataSource  }}
            </el-form-item>
            <el-form-item label="是否自动审核（1&#x3D;是，0&#x3D;否）：" prop="autoApprove">
              {{ info.autoApprove  }}
            </el-form-item>
            <el-form-item label="活动费用内容：" prop="costContent">
              {{ info.costContent  }}
            </el-form-item>
            <el-form-item label="故障现象描述：" prop="faultPhenomenon">
              {{ info.faultPhenomenon  }}
            </el-form-item>
            <el-form-item label="故障排查流程：" prop="troubleshootingFlow">
              {{ info.troubleshootingFlow  }}
            </el-form-item>
            <el-form-item label="结算类型ID：" prop="settlementTypeId">
              {{ info.settlementTypeId  }}
            </el-form-item>
            <el-form-item label="结算类型名称：" prop="settlementTypeName">
              {{ info.settlementTypeName  }}
            </el-form-item>
            <el-form-item label="保修类型ID：" prop="warrantyTypeId">
              {{ info.warrantyTypeId  }}
            </el-form-item>
            <el-form-item label="保修类型名称：" prop="warrantyTypeName">
              {{ info.warrantyTypeName  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/claimreturn/web/basic/serviceActivity';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

export default {
  name: 'serviceActivityDetail',
  mixins: [permissions, commonMixins],
  components: {
  },
  data () {
    return {
      pageTitle: '技术服务活动',
      pageType: 'detail',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISCR-serviceActivity',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['技术服务活动', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/claimreturn/basic/serviceActivity/edit',
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
