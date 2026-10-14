<template>
    <div class="page-common-detail m-common-data-process-excel-model-map-detail">
      <el-skeleton v-if="loading" :rows="6" animated />
      <template v-else>
        <section class="common-title">
          <h2>主键：{{ info.id }}</h2>
          <el-button size="small" @click="handleEdit"><i class="iconfont icon-lxppc-edit"></i>编辑</el-button>
        </section>
        <section class="common-section">
          <div class="common-section-header">
            <h2>基础信息</h2>
          </div>
          <div class="common-section-body">
            <el-form :inline="true" ref="ruleForm" label-width="220px">
              <!-- <el-form-item label="模板id：" prop="id">
                {{ info.id  }}
              </el-form-item> -->
              <el-form-item label="模板编码：" prop="code">
                {{ info.code  }}
              </el-form-item>
              <el-form-item label="业务标识：" prop="businessType">
                {{ info.businessType  }}
              </el-form-item>
              <el-form-item label="导入业务：" prop="importBusiness">
                {{ info.importBusiness  }}
              </el-form-item>
              <el-form-item label="导入策略：" prop="importStrategy">
                {{ importStrategyLabel }}
              </el-form-item>
              <el-form-item label="文件大小限制（MB）：" prop="fileSizeLimitMb">
                {{ info.fileSizeLimitMb  }}
              </el-form-item>
              <el-form-item label="最大行数：" prop="maxRows">
                {{ info.maxRows  }}
              </el-form-item>
              <el-form-item label="导入参数DTO：" prop="postParamDto" class="header-map-item wrap-item" style="width: 100%;">
                {{ info.postParamDto  }}
              </el-form-item>
              <el-form-item label="每批N条数据：" prop="batchSize">
                {{ info.batchSize  }}
              </el-form-item>
              <el-form-item label="表头起始行：" prop="titleStartRow">
                {{ info.titleStartRow  }}
              </el-form-item>
              <el-form-item label="数据起始行：" prop="dataStartRow">
                {{ info.dataStartRow  }}
              </el-form-item>
              <el-form-item label="导入数据的第三方接口信息：" prop="postInterface" class="header-map-item" style="width: 100%;">
                  {{ info.postInterface }}
              </el-form-item>
              <el-form-item label="excel导入模板下载地址：" prop="excelModelUrl" class="header-map-item" style="width: 100%;">
                  <span v-if="!info.excelModelUrl"></span>
                  <span v-else>{{ info.excelModelUrl }}</span>
              </el-form-item>
              <el-form-item label="创建时间：" prop="createTime">
                {{ info.createTime  }}
              </el-form-item>
              <el-form-item label="修改时间：" prop="updateTime">
                {{ info.updateTime  }}
              </el-form-item>
            </el-form>
          </div>
        </section>
      </template>
    </div>
  </template>

<script>
import { getDetail } from '@/api/excelManagement/commonDataProcessExcelModelMap/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
export default {
  name: 'commonDataProcessExcelModelMapDetail',
  components: {
  },
  data () {
    return {
      loading: true,
      info: {},
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  computed: {
    // 导入策略两值字典映射：SKIP_ERROR_ROWS=跳过错误行（默认）/ ALL_OR_NOTHING=全有全无
    importStrategyLabel () {
      if (this.info.importStrategy === 'ALL_OR_NOTHING') {
        return '全有全无';
      }
      return this.info.importStrategy ? '跳过错误行' : '';
    }
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['导入模板', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/excelManagement/commonDataProcessExcelModelMap/edit',
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
<style lang="scss" scoped>
.header-map-item {
  width: 100%;
  ::v-deep .el-form-item__label {
    width: 220px;
  }
  ::v-deep .el-form-item__content {
    display: block;
    overflow: hidden;
  }
}
.wrap-item {
  ::v-deep .el-form-item__content {
    word-break: break-all;
    white-space: pre-wrap;
  }
}
</style>
