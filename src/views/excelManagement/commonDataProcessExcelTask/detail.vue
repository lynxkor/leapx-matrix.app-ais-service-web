<template>
  <div class="page-common-detail m-common-data-process-excel-task-detail">
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
          <el-form :inline="true" ref="ruleForm" label-width="120px">
            <el-form-item label="主键：" prop="id">
              {{ info.id  }}
            </el-form-item>
            <el-form-item label="任务类型：" prop="taskType">
              {{ info.taskType  }}
            </el-form-item>
            <el-form-item label="业务标识：" prop="businessType">
              {{ info.businessType  }}
            </el-form-item>
            <el-form-item label="导出的excel下载地址：" prop="excelUrl">
              {{ info.excelUrl  }}
            </el-form-item>
            <el-form-item label="导入结果备注：" prop="importRemark">
              {{ info.importRemark  }}
            </el-form-item>
            <el-form-item label="任务状态：" prop="taskStatus">
              {{ info.taskStatus  }}
            </el-form-item>
            <el-form-item label="创建者：" prop="creator">
              {{ info.creator  }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
            <el-form-item label="修改时间：" prop="updateTime">
              {{ info.updateTime  }}
            </el-form-item>
            <el-form-item label="导入模板的主键id：" prop="importModelId">
              {{ info.importModelId  }}
            </el-form-item>
            <el-form-item label="导入失败的数据excel下载地址：" prop="importFailUrl">
              {{ info.importFailUrl  }}
            </el-form-item>
            <el-form-item label="修改者：" prop="modifier">
              {{ info.modifier  }}
            </el-form-item>
            <el-form-item label="删除状态：" prop="deleteStatus">
              {{ info.deleteStatus  }}
            </el-form-item>
            <el-form-item label="任务需要转发的请求头：" prop="headerMap">
              {{ info.headerMap  }}
            </el-form-item>
            <el-form-item label="业务标题：" prop="businessTitle">
              {{ info.businessTitle  }}
            </el-form-item>
          </el-form>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { getDetail } from '@/api/excelManagement/commonDataProcessExcelTask/index';
import { YES_NO_ENUM_MAP } from '@/libs/constants';
export default {
  name: 'commonDataProcessExcelTaskDetail',
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
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['新页面', '详情']);
    this.getData();
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/excelManagement/commonDataProcessExcelTask/edit',
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
