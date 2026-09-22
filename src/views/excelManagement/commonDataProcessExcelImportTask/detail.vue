<template>
  <div class="page-common-detail m-common-data-process-excel-task-detail">
    <el-skeleton v-if="loading" :rows="6" animated />
    <template v-else>
      <section class="common-title">
        <h2>业务标识：{{ info.businessType }}</h2>
        <div>
          <!-- 下载按钮展示条件与列表操作列一致：失败文件=状态14/15+已生成+权限码；原始文件=已存在+权限码 -->
          <el-button v-if="canShowDownloadFailFile && canDownloadFailFile" size="small" type="primary" @click="handleDownload()">下载失败文件</el-button>
          <el-button v-if="canDownloadOriginal" size="small" type="primary" @click="handleDownloadOriginal()">下载原始文件</el-button>
        </div>
      </section>
      <section class="common-section">
        <div class="common-section-header">
          <h2>基础信息</h2>
        </div>
        <div class="common-section-body">
          <el-form :inline="true" ref="ruleForm" label-width="220px">
            <el-form-item label="任务类型：" prop="taskType">
              {{ info.taskTypeLabel  }}
            </el-form-item>
            <el-form-item label="业务标识：" prop="businessType">
              {{ info.businessType  }}
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
            <el-form-item label="描述：" prop="importRemark">
              {{ info.importRemark }}
            </el-form-item>
            <el-form-item label="创建人：" prop="creatorName">
              {{ info.creatorName  }}
            </el-form-item>
            <el-form-item label="修改人：" prop="modifierName">
              {{ info.modifierName  }}
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
    // 下载失败文件权限码（moduleKey + '-downloadFailFile'）
    canDownloadFailFile () {
      return this.permissions.has(`${this.moduleKey}-downloadFailFile`);
    },
    // 下载原始文件权限码（moduleKey + '-downloadOriginalFile'）
    canDownloadOriginal () {
      return this.permissions.has(`${this.moduleKey}-downloadOriginalFile`);
    },
    // 下载失败文件按钮展示：状态 失败(14)/部分失败(15) + 失败文件已生成（importFailUrl 空=未生成不展示）
    canShowDownloadFailFile () {
      return [14, 15].includes(this.info?.taskStatus) && !!this.info?.importFailUrl;
    }
  },
  created () {
    this.$store.commit('SET_ACTIVE_BREADCRUMB', ['导入任务', '详情']);
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
    // 下载导入失败文件：文件名 = 业务标识 + yyyyMMddHHmmss
    handleDownload (row) {
      const url = row?.importFailUrl || this.info?.importFailUrl;
      const businessType = this.info?.businessType || '导入失败数据';
      this.downloadWithFileName(url, `${businessType}${this.nowTimestamp()}.xlsx`);
    },
    // 下载原始文件：文件名 = 之前导入文件的名称（建任务时落库的 importExcelFileName）
    handleDownloadOriginal () {
      const url = this.info?.importOriginalUrl;
      this.downloadWithFileName(url, this.info?.importExcelFileName || '原始导入文件.xlsx');
    },
    // 换签后以指定文件名下载：fetch 转 blob 走同源 a[download]，
    // 保证跨域签名 URL 下浏览器使用指定文件名（直挂 link 会被忽略、落成 OSS 的 md5 存储名）；
    // fetch 失败降级为直接下载（此时文件名可能不被浏览器采纳）
    downloadWithFileName (url, fileName) {
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
        if (!res) {
          this.$message({
            type: 'warning',
            message: '下载地址为空'
          });
          return;
        }
        fetch(res.authFileUrl).then(response => response.blob()).then(blob => {
          const objectUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = objectUrl;
          link.download = fileName;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(objectUrl);
        }).catch(() => {
          downloadExcel(res.authFileUrl, fileName);
        });
      });
    },
    // 当前时间 yyyyMMddHHmmss
    nowTimestamp () {
      const now = new Date();
      return [
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
      ].map(num => String(num).padStart(2, '0')).join('');
    }
  }
};
</script>
<style lang="scss" scoped>
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
</style>
