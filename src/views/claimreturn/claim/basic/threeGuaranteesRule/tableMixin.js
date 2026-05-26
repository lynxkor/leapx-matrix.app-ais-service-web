import { uIntRule } from '@/validation/rule';
import { sparePartListShort } from '@/api/common';
import {
  getDetailPage,
  //
  addOrUpdateDetail,
  deleteDetailItem,
} from '@/api/claimreturn/claim/basic/threeGuaranteesRule';
export default {
  data () {
    return {
      defaultNewRow: {
        partId: '', // 零件id
        partName: '', // 零件名称
        remark: '', // 备注
      },
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      // 表格内的下拉列表
      options: {
        partCode: [],
      },
      // TIPS: 复杂的表格输入项，参考 /dealerTeam/edit.vue
      columns: [
        {
          field: 'partCode',
          title: '零件编码',
          width: '33%',
          editable: true,
          editRender: {
            name: 'ElSelect',
            multiRow: true,
            props: {
              filterable: true,
              clearable: true,
              remote: true,
              remoteMethod: this.sparePartListApi,
              placeholder: '请选择',
              'suffix-icon': 'el-icon-search',
            },
          },
          rules: [
            { required: true, message: '零件编码不能为空', trigger: 'blur' },
          ],
        },
        {
          field: 'partName',
          title: '零件名称',
          width: '33%',
        },
        {
          field: 'remark',
          title: '备注',
          width: '33%',
          editable: true,
          editRender: { name: 'ElInput' },
        },
      ],
      rules: {
        judgmentBasis: [
          { required: true, message: '请输入判断依据', trigger: 'blur' },
        ],
        determineUnit: [
          {
            required: true,
            message: '请输入判断单位（次数，天数）',
            trigger: 'change',
          },
        ],
        accumulation: [
          {
            required: true,
            message: '请输入累计方式（单一零件，任意零件）',
            trigger: 'change',
          },
        ],
        vehicleProperty: [
          {
            required: true,
            message: '请选择',
            trigger: 'change',
          },
        ],
        saleStartDate: [
          { required: true, message: '请输入销售开始日期', trigger: 'blur' },
        ],
        saleEndDate: [
          { required: true, message: '请输入销售结束日期', trigger: 'blur' },
        ],
        warningVehicleAgeFrom: [
          { required: true, message: '请输入预警车龄起', trigger: 'blur' },
          uIntRule,
        ],
        warningVehicleAgeTo: [
          { required: true, message: '请输入预警车龄止', trigger: 'blur' },
          uIntRule,
        ],
        warningMileageFrom: [
          { required: true, message: '请输入预警里程起', trigger: 'blur' },
          uIntRule,
        ],
        warningMileageTo: [
          { required: true, message: '请输入预警里程止', trigger: 'blur' },
          uIntRule,
        ],
        greenWarning1: [
          // { required: true, message: '请输入绿色预警区间1', trigger: 'blur' },
          uIntRule,
        ],
        greenWarning2: [
          // { required: true, message: '请输入绿色预警区间2', trigger: 'blur' },
          uIntRule,
        ],
        yellowWarning2: [
          // { required: true, message: '请输入黄色预警区间2', trigger: 'blur' },
          uIntRule,
        ],
        yellowWarning1: [
          // { required: true, message: '请输入黄色预警区间1', trigger: 'blur' },
          uIntRule,
        ],
        redWarning1: [
          // { required: true, message: '请输入红色预警区间1', trigger: 'blur' },
          uIntRule,
        ],
        redWarning2: [
          // { required: true, message: '请输入红色预警区间2', trigger: 'blur' },
          uIntRule,
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' },
        ],
        updateTime: [
          { required: true, message: '请选择修改时间', trigger: 'change' },
        ],
        id: [{ required: true, message: '请输入主键', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
        statusDesc: [
          { required: true, message: '请选择状态变更描述', trigger: 'change' },
        ],
        reminderItem: [
          { required: true, message: '请输入警示条款', trigger: 'blur' },
        ],
        reminderContent: [
          { required: true, message: '请输入警示内容', trigger: 'blur' },
        ],
        warningContent: [
          { required: true, message: '请输入预警内容', trigger: 'blur' },
        ],
        details: [{ required: true, message: '请输入明细', trigger: 'blur' }],
      },
    };
  },
  mounted () {
    this.getDetailPageApi(this.getId());
  },
  beforeDestroy () {
  },
  methods: {
    getId () {
      return this.id || this.$route.query.id;
    },
    // 表格数据
    getDetailPageApi (id) {
      if (!id) {
        return;
      }
      getDetailPage({
        ruleId: id,
        pageSize: this.pageSize,
        pageNum: this.current,
      }).then((res) => {
        this.tableData = res.records;
        this.total = res.total;
      });
    },
    // 零件编码名称搜索
    sparePartListApi (query) {
      sparePartListShort({ partCodeOrNameLike: query, oemPart: 1 }).then((data) => {
        const list = data.map((item) => {
          return {
            value: item.id,
            label: item.code,
            labelDesc: item.name || '-',
            partId: item.id, // 表格
            partCode: item.code, // 表格
            partName: item.name || '-',
          };
        });
        this.options.partCode = list;
      });
    },
    handleAddRow () {
      // 通过引用直接调用子组件方法
      this.$refs.editTable.addRow();
    },
    handleRemoveRow (row, index, defer) {
      if (!row.id) {
        return;
      }
      deleteDetailItem([row.id]).then((d) => {
        defer.resolve();
        this.$message.success('删除成功');
      }).catch(() => {
        defer.reject();
      });
    },
    // 行保存
    saveRowEdit (row, defer) {
      const parmas = {
        id: row.id, // 修改需要
        partId: row.partId, // 零件ID
        remark: row.remark,
        ruleId: this.getId(), // 三包规则ID
      };
      addOrUpdateDetail(parmas).then(id => {
        defer.resolve(id);
        this.$message.success('更新成功');
      }).catch(e => {
        defer.reject();
      });
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.current = 1;
      this.getDetailPageApi(this.getId());
    },
    currentPageChange (current) {
      this.current = current;
      this.getDetailPageApi(this.getId());
    },
  },
};
