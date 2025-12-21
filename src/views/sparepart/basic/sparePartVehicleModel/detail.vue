<template>
  <div class="page-common-detail m-spare-part-vehicle-model-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>零件编码：{{ info.partCode }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="120px">
            <!-- TIPS: 根据实际情况调整展示字段 -->
            <el-form-item label="备件编码：" prop="partCode">
              {{ info.partCode  }}
            </el-form-item>
            <el-form-item label="备件名称：" prop="partName">
              {{ info.partName  }}
            </el-form-item>
            <el-form-item label="车系名称：" prop="vehicleSeriesName">
              {{ info.vehicleSeriesName  }}
            </el-form-item>
            <el-form-item label="车型名称：" prop="vehicleModelName">
              {{ info.vehicleModelName  }}
            </el-form-item>
            <el-form-item label="年款名称：" prop="vehicleYearTypeName">
              {{ info.vehicleYearTypeName  }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
            <el-form-item label="修改时间：" prop="updateTime">
              {{ info.updateTime  }}
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
            <el-form-item label="备件ID：" prop="sparePartId">
              {{ info.sparePartId  }}
            </el-form-item>
            <el-form-item label="车系ID：" prop="vehicleSeriesId">
              {{ info.vehicleSeriesId  }}
            </el-form-item>
            <el-form-item label="车型ID：" prop="vehicleModelId">
              {{ info.vehicleModelId  }}
            </el-form-item>
            <el-form-item label="年款id：" prop="vehicleYearTypeId">
              {{ info.vehicleYearTypeId  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/sparepart/basic/sparePartVehicleModel/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';

export default {
  name: 'sparePartVehicleModelDetail',
  mixins: [permissions],
  components: {
  },
  data () {
    return {
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-sparePartVehicleModel',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['备件适用车型', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/sparepart/basic/sparePartVehicleModel/edit',
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
