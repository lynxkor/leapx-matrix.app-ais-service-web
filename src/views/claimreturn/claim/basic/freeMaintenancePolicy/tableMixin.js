import { uIntRule } from '@/validation/rule';
import { sparePartListShort } from '@/api/common';
import {
  freeMaintenancePolicyPartDetailPage, // 免保零件明细分页查询
  freeMaintenancePolicyPartDetailUpdate, // 免保零件明细新增/编辑
  freeMaintenancePolicyPartDetailDelete, // 免保零件明细删除
} from '../../../../../api/claimreturn/claim/basic/freeMaintenancePolicy';

export default {
  data () {
    return {
      defaultNewRow: {
        partId: '',
        partCode: '',
        partName: '',
        purchasePrice: '',
        partQuantity: '',
      },
      current: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      options: {
      },
      columns: [
        {
          field: 'partCode',
          title: '零件编码',
          width: '25%',
        },
        {
          field: 'partName',
          title: '零件名称',
          width: '25%',
        },
        {
          field: 'partQuantity',
          title: '数量',
          width: '25%',
          editable: true,
          editRender: { name: 'ElInput' },
          rules: [
            { required: true, message: '请输入数量', trigger: 'blur' },
            uIntRule,
          ],
        },
        {
          field: 'purchasePrice',
          title: '采购单价',
          width: '25%',
        },
      ],
    };
  },
  mounted () {
    this.getDetailPageApi();
  },
  watch: {
    vehicleRegisteredModelId: {
      handler () {
        this.getDetailPageApi();
      }
    }
  },
  beforeDestroy () {
  },
  methods: {
    getId () {
      return this.id || this.$route.query.id;
    },
    // 表格数据
    getDetailPageApi () {
      const id = this.getId();
      if (!id) {
        return;
      }
      freeMaintenancePolicyPartDetailPage({
        vehicleRegisteredModelId: this.vehicleRegisteredModelId,
        freeMaintenancePolicyId: id,
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
            labelDesc: item.name,
            partId: item.id, // 表格
            partCode: item.code, // 表格
            partName: item.name,
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
      freeMaintenancePolicyPartDetailDelete([row.id]).then((d) => {
        defer.resolve();
        this.$message.success('删除成功');
      }).catch(() => {
        defer.reject();
      });
    },
    // 行保存
    saveRowEdit (row, defer) {
      const parmas = {
        id: row.id,
        partId: row.partId, // 零件ID
        partQuantity: row.partQuantity, // 零件数量
        freeMaintenancePolicyId: this.getId(), // 免保政策ID
        vehicleRegisteredModelId: this.vehicleRegisteredModelId, // 公告车型ID
      };
      freeMaintenancePolicyPartDetailUpdate(parmas).then(id => {
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
