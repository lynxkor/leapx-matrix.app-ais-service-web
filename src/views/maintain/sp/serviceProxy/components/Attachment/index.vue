<template>
	<section class="common-section">
		<div class="common-section-header">
			<h2>资料附件</h2>
		</div>
		<div class="common-section-body">
			<div class="common-section-table table-section">
				<vxe-table
          ref="faultTable"
          :data="formData"
          stripe
          show-overflow
          :row-config="{ isHover: true }"
          resizable
          min-height="0"
          max-height="500px"
          border="inner"
          size="medium"
        >
          <vxe-column field="fileName" title="附件名称" min-width="150">
            <template #default="{ row }">
              <el-link :href="row.fileUrl" target="_blank" type="success">{{ row.fileName }}</el-link>
            </template>
          </vxe-column>
          <vxe-column field="createTime" title="创建时间" min-width="150"/>
          <vxe-column title="操作" width="100" align="center" fixed="right" :resizable="false">
            <template #default="{ row }">
              <el-popconfirm
                title="确定删除此文件吗？"
                @confirm="deleteFile(row)"
              >
                <span
                  class="action-button btn-delete"
                  slot="reference"
                  type="text">
                  删除
                </span>
              </el-popconfirm>
            </template>
          </vxe-column>
          <template #empty>
            <div class="m-vxe-table-empty-text">若要启用此内容，请创建记录</div>
          </template>
        </vxe-table>
			</div>
		</div>
	</section>
</template>
<script>
import { deleteFile } from '@/libs/api/attachment';

export default {
  props: {
    formData: {
      type: Array,
      default: () => []
    },
    _id: {
      type: [String, Number],
      default: null
    }
  },
  components: {
    // FetchSelect
  },
  watch: {
    formData: {
      handler (val) {
        if (val) {
          this.form = val;
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      form: {},
    };
  },
  methods: {
    deleteFile (row) {
      deleteFile([row.id]).then(res => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.$emit('refresh');
      });
    }
  }
};

</script>
<style scoped lang="scss">
.table-section{
  &-header {
    h3{
      font-size: 14px;
    }
    margin: 8px 0;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .m-vxe-table-empty-text {
    text-align: left;
  }
  .btn-delete {
    color: var(--leap-color-danger);
    cursor: pointer;
    &:hover {
      text-decoration: underline;
      color: var(--leap-color-danger-dark-1);
    }
    &.disabled{
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
  ::v-deep .vxe-table--empty-content {
    color: var(--leap-color-default-light-2);
    width: 100%;
    padding: 0 16px;
  }
}
</style>
