<template>
  <div class="page-common-detail m-battery-unit-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>单位代码：{{ info.code }}</h2>
        <el-button size="small" @click="handleEdit" icon="el-icon-edit">编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基本信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="150px">
            <el-form-item label="单位代码：" prop="code">
              {{ info.code  }}
            </el-form-item>
            <el-form-item label="单位名称：" prop="name">
              {{ info.name  }}
            </el-form-item>
            <el-form-item label="统一社会信用代码：" prop="buinessLicense">
              {{ info.buinessLicense  }}
            </el-form-item>
            <el-form-item label="负责人姓名：" prop="ownerName">
              {{ info.ownerName  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/maintain/basic/batteryUnit/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
export default {
  name: 'batteryUnitDetail',
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
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['电池去向单位管理', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/maintain/basic/batteryUnit/edit',
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
