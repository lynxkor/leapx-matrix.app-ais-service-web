<template>
	<section class="common-section">
		<div class="common-section-header">
			<h2>维修履历信息</h2>
		</div>
		<div class="common-section-body">
			<div class="common-section-table">
				<edit-table
				ref="editTable"
				:columns="columns"
				:data="tableData"
				:defaultNewRow="defaultNewRow"
				:show-toolbar="false"
				:options="options"
				:auth="{edit: true, delete: true}"
				/>
			</div>
		</div>
	</section>
</template>
<script>
import EditTable from '@/libs/components/EditTable';
export default {
  components: {
    EditTable
  },
  data () {
    return {
      defaultNewRow: {
        name: '',
      },
      tableData: [
        { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
        { id: 2, name: '李四', age: 30, email: 'lisi@example.com' }
      ],
      options: {
        // 对应表格里选型枚举
        // 如 type: [{label: 'xxx', value: 'xxx'}]
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'name',
          title: '姓名',
          width: '33%',
          editable: true,
          editRender: { name: 'ElInput' },
          rules: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ]
        },
        {
          field: 'age',
          title: '年龄',
          editable: true,
          width: '33%',
          editRender: { name: 'ElInput', props: { type: 'number' } }
        },
        {
          field: 'email',
          title: '邮箱',
          width: '33%',
          editRender: { name: 'ElInput' }
        },
      ],
    };
  }
};

</script>
