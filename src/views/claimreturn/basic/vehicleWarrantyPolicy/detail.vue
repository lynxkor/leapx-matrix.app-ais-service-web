<template>
  <div class="page-common-detail m-vehicle-warranty-policy-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>政策名称：{{ info.policyName }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="120px">
            <!-- TIPS: 根据实际情况调整展示字段 -->
            <el-form-item label="政策名称：" prop="policyName">
              {{ info.policyName  }}
            </el-form-item>
            <el-form-item label="车系名称：" prop="seriesName">
              {{ info.seriesName  }}
            </el-form-item>
            <el-form-item label="车型名称：" prop="modelName">
              {{ info.modelName  }}
            </el-form-item>
            <el-form-item label="车辆年款：" prop="yearTypeName">
              {{ info.yearTypeName  }}
            </el-form-item>
            <el-form-item label="车辆属性：" prop="vehicleProperty">
              {{ info.vehiclePropertyLabel  }}
            </el-form-item>
            <el-form-item label="里程数（KM）：" prop="mileage">
              {{ info.mileage  }}
            </el-form-item>
            <el-form-item label="保修期（月）：" prop="warrantyPeriod">
              {{ info.warrantyPeriod  }}
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
            <el-form-item label="修改时间：" prop="updateTime">
              {{ info.updateTime  }}
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              {{ info.statusLabel  }}
            </el-form-item>
            <el-form-item label="状态变更描述：" prop="statusDesc">
              {{ info.statusDesc  }}
            </el-form-item>
            <el-form-item label="数据来源" prop="dataSource">
              {{ info.dataSourceLabel  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/claimreturn/basic/vehicleWarrantyPolicy/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';

export default {
  name: 'vehicleWarrantyPolicyDetail',
  mixins: [permissions],
  components: {
  },
  data () {
    return {
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-vehicleWarrantyPolicy',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['整车保修政策设置', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/claimreturn/basic/vehicleWarrantyPolicy/edit',
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
