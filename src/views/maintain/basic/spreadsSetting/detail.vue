<template>
  <div class="page-common-detail m-spreads-setting-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>差价设置代码：{{ info.code }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="120px">
            <el-form-item label="差价设置代码：" prop="code">
              {{ info.code  }}
            </el-form-item>
            <el-form-item label="车型：" prop="vehicleModelName">
              {{ info.vehicleModelName  }}
            </el-form-item>
            <el-form-item label="购买城市等级：" prop="buyCityLevelLabel">
              {{ info.buyCityLevelLabel  }}
            </el-form-item>
            <el-form-item label="核销城市等级：" prop="verificationCityLevelLabel">
              {{ info.verificationCityLevelLabel  }}
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              {{ info.statusLabel  }}
            </el-form-item>
            <el-form-item label="单次需补差价：" prop="spreadPrice">
              {{ info.spreadPrice  }}
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
            <el-form-item label="生效开始日期：" prop="effectiveon">
              {{ info.effectiveon  }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/maintain/basic/spreadsSetting/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';

export default {
  name: 'spreadsSettingDetail',
  components: {
  },
  mixins: [permissions],
  data () {
    return {
      moduleKey: 'AISMC-spreadsSetting',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['保养套餐差价设置', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/maintain/basic/spreadsSetting/edit',
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
