<template>
  <section class="common-section">
    <div class="common-section-header">
      <h2>审计明细</h2>
    </div>
    <div class="common-section-body">
      <div class="common-section-header">
        <div style="display: flex;gap: 8px;">
          <base-search
            v-if="canAddOrUpdate && !isDetailFull"
            filterable
            clearable
            remote
            reserve-keyword
            :remote-method="queryListData"
            @change="handleAddTableData"
            value-key="id"
            label-key="applyNo"
            placeholder="请输入保修申请单"
          />
          <el-button size="small" @click="handleImport" v-if="canImport" :disabled="isDetailFull">导入</el-button>
        </div>
      </div>
      <div class="common-section-table">
        <vxe-table ref="tableRef" stripe :data="tableData" show-overflow resizable border="inner"
          min-height="0" max-height="400px">
          <vxe-column field="warrantyApplyCode" title="保修申请单" width="150" />
          <vxe-column field="auditStatusLabel" title="审计状态" width="150" />
          <vxe-column field="vin" title="VIN" width="250" />
          <vxe-column field="totalClaimAmount" title="索赔总金额" width="150" />
          <vxe-column field="laborClaimTotal" title="索赔工时小计" width="150" />
          <vxe-column field="partsClaimTotal" title="索赔零件小计" width="150" />
          <vxe-column field="otherClaimTotal" title="索赔其他小计" width="150" />
          <vxe-column field="laborDeduct" title="工时扣款" width="150" />
          <vxe-column field="partDeduct" title="备件扣款" width="150" />
          <vxe-column field="otherDeduct" title="其他扣款" width="150" />
          <vxe-column field="auditDesc" title="错误项" width="300" />
          <vxe-column title="操作" width="100" fixed="right">
            <template #default="{ row }">
              <el-popconfirm title="确定要删除吗？" @confirm="handleRemoveRow(row)" v-if="canAddOrUpdate">
                <span slot="reference" type="text" size="small" class="btn-delete" fixed="right">删除</span>
              </el-popconfirm>
            </template>
          </vxe-column>
          <template #empty>
            <div class="m-vxe-table-empty-text">暂无数据</div>
          </template>
        </vxe-table>
      </div>
    </div>
    <!-- TIPS: 填入项目id即可 -->
    <Upload
      :visible="uploadDialogVisible"
      :id="'warrantyAuditDetail'"
      downloadTitle="保修审计明细导入"
      @close="handleUploadDialogClose"
      @getData="getTableData"
      :businessParams="_id"
    />
  </section>
</template>

<script>
import {
  addDetail,
  removeDetail,
  getDetailTableList,
  detailSearchApi,
} from '@/api/claimreturn/claim/warrantyaudit/warrantyAudit/index';
import BaseSearch from '@/libs/components/BaseSearch';
import { getEnum } from '@/api/common';
import Upload from '@/libs/components/UploadDialog';
import { YES_NO_ENUM } from '@/libs/constants';

export default {
  props: {
    _id: {
      type: [String, Number],
      default: null
    },
    canAddOrUpdate: {
      type: Boolean,
    },
    canImport: {
      type: Boolean,
    },
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    BaseSearch,
    Upload
  },
  computed: {
    isDetailFull () {
      return this.tableData.length >= this.formData.planAuditCount && this.formData.planAuditCount > 0;
    },
  },
  data () {
    return {
      yes_no_enum: YES_NO_ENUM,
      emptyText: '若要启用此内容，请创建记录',
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      uploadDialogVisible: false,
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      rules: {},
    };
  },
  watch: {
    _id: {
      handler () {
        this.getTableData();
      },
      immediate: true
    }
  },
  methods: {
    handleImport () {
      this.uploadDialogVisible = true;
    },
    handleUploadDialogClose () {
      this.uploadDialogVisible = false;
    },
    getTableData () {
      if (!this._id) {
        return;
      }
      getDetailTableList({
        // TODO 根据需求进行替换
        // xxxId: this._id,
        //
        auditId: this._id,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records;
        this.total = res.total;
        this.$emit('data-change', this.tableData);
      });
    },
    handleRemoveRow (row) {
      if (!row.id) {
        return;
      }
      this.removeRows([row.id]);
    },
    removeRows (ids) {
      removeDetail(ids).then((d) => {
        this.$message.success('删除成功');
        this.getTableData();
        this.$emit('refresh');
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '删除失败!'
        });
      });
    },
    queryListData (query) {
      return detailSearchApi({
        applyNo: query,
        limitSize: 20,
        isClaimTrackIdNull: true,
        isWarrantyAuditDetailIdNull: true,
        approvalTimeStart: this.formData.warrantyApprovalStartDate,
        approvalTimeEnd: this.formData.warrantyApprovalEndDate,
        applyStatusList: ['70', '80'],
        dealerCode: this.formData.dealerCode
      });
    },
    // 新增子表数据
    handleAddTableData (val, record) {
      if (!record) {
        this.$message.warning('请先选择数据');
        return;
      }
      // 检查是否已存在
      const exists = this.tableData.some(item => item.id === record.id);
      if (exists) {
        this.$message.warning('请勿重复添加');
        return;
      }
      // 根据需求调用接口
      // this.tableData.push(record);
      addDetail({
        auditId: this._id,
        warrantyApplyId: record.id
      }).then(res => {
        this.$message.success('添加成功');
        this.getTableData();
        this.$emit('refresh');
      });
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
  }
};
</script>
