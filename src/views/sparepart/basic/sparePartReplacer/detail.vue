<template>
  <div class="page-common-detail m-spare-part-replacer-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>替换前备件编码：{{ info.beforePartCode }}</h2>
        <el-button v-if="canAddOrUpdate" size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="120px">
            <!-- TIPS: 根据实际情况调整展示字段 -->
            <el-form-item label="替换前备件编码：" prop="beforePartCode">
              {{ info.beforePartCode  }}
            </el-form-item>
            <el-form-item label="替换前备件名称：" prop="beforePartName">
              {{ info.beforePartName  }}
            </el-form-item>
            <el-form-item label="替换类型：" prop="replacementType">
              {{ info.replacementType  }}
            </el-form-item>
            <el-form-item label="替换后前备件编码：" prop="afterPartCode">
              {{ info.afterPartCode  }}
            </el-form-item>
            <el-form-item label="替换后前备件名称：" prop="afterPartName">
              {{ info.afterPartName  }}
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
              {{ info.remark  }}
            </el-form-item>
            <el-form-item label="状态变更描述：" prop="statusDesc">
              {{ info.statusDesc  }}
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
            <el-form-item label="状态：" prop="status">
              {{ info.status  }}
            </el-form-item>
            <el-form-item label="数据来源，140:新销服; 老销服:10：" prop="dataSource">
              {{ info.dataSource  }}
            </el-form-item>
            <el-form-item label="替换前件号ID：" prop="beforeSparePartId">
              {{ info.beforeSparePartId  }}
            </el-form-item>
            <el-form-item label="替换后件号ID：" prop="afterSparePartId">
              {{ info.afterSparePartId  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/sparepart/basic/sparePartReplacer/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
import permissions from '@/libs/mixins/permissions';

export default {
  name: 'sparePartReplacerDetail',
  mixins: [permissions],
  components: {
  },
  data () {
    return {
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISPART-sparePartReplacer',
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['备件替换件关系', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/sparepart/basic/sparePartReplacer/edit',
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
