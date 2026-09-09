<template>
  <div class="page-common-detail m-common-data-process-excel-task-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>主键：{{ info.id }}</h2>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="220px">
            <!-- <el-form-item label="主键：" prop="id">
              {{ info.id  }}
            </el-form-item> -->
            <el-form-item label="业务标题：" prop="businessTitle">
              {{ info.businessTitle  }}
            </el-form-item>
            <el-form-item label="任务类型：" prop="taskType">
              {{ info.taskTypeLabel  }}
            </el-form-item>
            <el-form-item label="业务标识：" prop="businessType">
              {{ info.businessType  }}
            </el-form-item>
            <el-form-item label="文件名称：" prop="importExcelFileName">
              {{ info.importExcelFileName  }}
            </el-form-item>
            <el-form-item label="总数据行数：" prop="totalNum">
              {{ formatNum(info.totalNum) }}
            </el-form-item>
            <el-form-item label="成功行数：" prop="successNum">
              {{ formatNum(info.successNum) }}
            </el-form-item>
            <el-form-item label="失败行数：" prop="failNum">
              {{ formatNum(info.failNum) }}
            </el-form-item>
            <el-form-item v-if="info.taskStatus === 11 || info.taskStatus === 12" label="发送进度：">
              {{ formatProgress(info) }}
            </el-form-item>
            <el-form-item label="任务状态：" prop="taskStatus">
              {{ info.taskStatusLabel  }}
            </el-form-item>
            <el-form-item label="导入模板的主键：" prop="importModelId">
              {{ info.importModelId  }}
            </el-form-item>
            <el-form-item label="创建者：" prop="creatorName">
              {{ info.creatorName  }}
            </el-form-item>
            <el-form-item label="创建时间：" prop="createTime">
              {{ info.createTime  }}
            </el-form-item>
            <el-form-item label="修改者：" prop="modifierName">
              {{ info.modifierName  }}
            </el-form-item>
            <el-form-item label="修改时间：" prop="updateTime">
              {{ info.updateTime  }}
            </el-form-item>
            <el-form-item label="删除状态：" prop="deleteStatusLabel">
              {{ info.deleteStatusLabel  }}
            </el-form-item>
            <el-form-item label="结果备注：" prop="importRemark">
              {{ info.importRemark }}
            </el-form-item>
            <el-form-item label="需要转发的请求头：" label-width="220px" prop="headerMap" class="header-map-item" style="width: 100%;">
              {{ info.headerMap }}
            </el-form-item>
            <el-form-item label="导入表头：" label-width="220px" prop="importExcelHeaderTitle" class="header-map-item" style="width: 100%;">
              {{ info.importExcelHeaderTitle }}
            </el-form-item>
            <el-form-item label="导入失败的数据excel下载地址：" prop="importFailUrl" class="header-map-item" style="width: 100%;">
              <span v-if="!info.fileId"></span>
              <span v-else class="url-link" @click="handleDownload"> 点击下载 </span>
            </el-form-item>
            <el-form-item label="原始文件：" prop="importOriginalUrl" class="header-map-item" style="width: 100%;">
              <span v-if="!info.importOriginalUrl"></span>
              <span v-else-if="canDownloadOriginal" class="url-link" @click="handleDownloadOriginal"> 点击下载 </span>
              <span v-else></span>
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
import { downloadExcel } from '@/utils/index.js';
import { refreshFileAuthUrl } from '@/api/file/fileDetail';
import permissions from '@/libs/mixins/permissions';

export default {
  name: 'commonDataProcessExcelTaskDetail',
  mixins: [permissions],
  components: {
  },
  data () {
    return {
      loading: true,
      info: {},
      moduleKey: 'AISMC-commonDataProcessExcelImportTask',
      yes_no_enum_map: YES_NO_ENUM_MAP
    };
  },
  computed: {
    // 下载原始文件权限码（moduleKey + '-downloadOriginalFile'）
    canDownloadOriginal () {
      return this.permissions.has(`${this.moduleKey}-downloadOriginalFile`);
    }
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['Excel模板导入', '详情']);
    this.getData();
  },
  methods: {
    // 行数类字段空值展示 '-'
    formatNum (value) {
      return (value ?? '-');
    },
    // 处理中任务发送进度（sendNum/totalNum，随详情刷新更新，无轮询）
    formatProgress (info) {
      return `${info.sendNum ?? 0}/${info.totalNum ?? '-'}`;
    },
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
    },
    handleDownload (row) {
      const url = row?.importFailUrl || this.info?.importFailUrl;
      const originalUrl = url.split('?')[0];
      refreshFileAuthUrl({
        url: originalUrl,
        expireMinutes: 1440
      }).then(res => {
        if (res) {
          // console.log(res);
          downloadExcel(res.authFileUrl, res.originalFilename || '导入失败数据.xlsx');
        } else {
          this.$message({
            type: 'warning',
            message: '下载地址为空'
          });
        }
      });
    },
    // 下载原始文件：与下载失败文件同形式，详情数据 importOriginalUrl 走 refreshFileAuthUrl 换签后下载
    handleDownloadOriginal () {
      const url = this.info?.importOriginalUrl;
      if (!url) {
        this.$message({
          type: 'warning',
          message: '下载地址为空'
        });
        return;
      }
      const originalUrl = url.split('?')[0];
      refreshFileAuthUrl({
        url: originalUrl,
        expireMinutes: 1440
      }).then(res => {
        if (res) {
          downloadExcel(res.authFileUrl, res.originalFilename || this.info?.importExcelFileName || '原始导入文件.xlsx');
        } else {
          this.$message({
            type: 'warning',
            message: '下载地址为空'
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.url-link {
  color: #009100;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
.standalone-item {
  display: block;
  width: 100%;
  &::after {
    content: '';
    display: table;
    clear: both;
  }
  ::v-deep .el-form-item__content {
    display: block;
    width: 100%;
  }
}
.header-map-item {
  ::v-deep .el-form-item__label {
    width: 220px;
  }
  ::v-deep .el-form-item__content {
    display: block;
    overflow: hidden;
  }
}
</style>
