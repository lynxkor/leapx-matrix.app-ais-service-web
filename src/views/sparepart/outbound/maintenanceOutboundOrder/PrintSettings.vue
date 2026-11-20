<template>
    <el-dialog class="m-start-work-dialog" title="打印设置" width="660px" :visible.sync="dialogVisible" @close="close">
        <el-form :model="form" ref="ruleForm" label-width="150px" class="common-section-body">
            <el-form-item label="默认打印范围">
                <div class="print-setting-row">
                    <fetch-select class="print-setting-select" :options="rangeOptions"
                        v-model="form.defaultPrintRange" placeholder="请选择" clearable filterable
                        @change="handleRangeChange" />
                    <fetch-select v-if="showViewSelect" class="print-setting-select print-setting-select--view" :options="viewOptions"
                        v-model="form.customViewId" placeholder="请选择个人视图" clearable filterable
                        value-key="id" label-key="viewName" fallback-label="视图已删除" />
                </div>
            </el-form-item>
            <el-form-item label="排序">
                <fetch-select class="print-setting-select" :options="sortOptions"
                    v-model="form.sortOrder" placeholder="请选择" clearable filterable
                    @change="handleSortChange" />
            </el-form-item>
        </el-form>
        <template v-slot:footer>
            <div class="dialog-footer">
            <el-button size="small" @click="close">取消</el-button>
            <el-button size="small" type="primary" :loading="submitLoading" @click="submit">确定</el-button>
            </div>
      </template>
    </el-dialog>
</template>
<script>
import { getEnum } from '@/api/common';
import { getCurrentUserSet, settingUpdate } from '@/api/sparepart/outbound/maintenanceOutboundOrder/index';
import { page as pageCustomView, getDetail as getCustomViewDetail } from '@/libs/api/customView/customQueryView';
import FetchSelect from '@/libs/components/FetchSelect';

// 打印范围/排序枚举「按个人视图」的 code(与后端 MaintenanceOutboundPrintRangeEnum/SortEnum.PERSONAL_VIEW 对齐)
const PERSONAL_VIEW_CODE = '4';
// 个人视图 bizKey:维修出库单据明细表(与列表页 CustomView 组件一致)
const BIZ_KEY = 'maintenanceOutboundOrderDetail';
// 「按个人视图」选项文案(前端兜底,不依赖字典入库即可正常显示)
const PERSONAL_VIEW_LABEL = '按个人视图';

export default {
  components: {
    FetchSelect,
  },
  name: 'PrintSettings',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      dialogVisible: this.visible,
      form: {},
      submitLoading: false,
      // 个人视图选项列表 [{ id, viewName }]
      viewOptions: [],
      viewLoading: false,
      // 默认打印范围选项 [{ code, message }]
      rangeOptions: [],
      // 排序选项 [{ code, message }]
      sortOptions: []
    };
  },
  computed: {
    // 「默认打印范围」与「排序」是两个独立维度(2026-11-17 取消联动):
    //   范围决定打印哪些行,排序决定行怎么排;任一项选了「按个人视图」都需要选择具体视图
    //   (两个维度共用同一个 customViewId)
    showViewSelect () {
      return this.form.defaultPrintRange === PERSONAL_VIEW_CODE
        || this.form.sortOrder === PERSONAL_VIEW_CODE;
    }
  },
  watch: {
    visible (val) {
      this.dialogVisible = val;
      if (val) {
        this.initData();
      }
    },
  },
  methods: {
    async initData () {
      // 先加载下拉选项(字典 + 前端兜底)，保证「按个人视图」一定有中文文案
      await this.loadEnumOptions();
      const res = await getCurrentUserSet();
      this.form = res || {};
      // 不做任何归一化/强制联动:范围与排序各自独立,原样回显后端存的值
      if (this.showViewSelect) {
        // 必须等 form.customViewId 填好后再拉视图列表：
        // 列表拉回来后要按 id 匹配出视图名做回显，先拉列表会匹配不到
        await this.loadViewOptions();
        // 选了个人视图但没有视图ID：说明后端未部署新版(customViewId 字段缺失/未保存)
        // 或历史脏数据，此时给明确提示，而不是留一个空下拉让用户困惑
        if (!this.form.customViewId) {
          this.$message.warning('当前打印设置未绑定具体个人视图，请重新选择一个个人视图');
        }
      }
    },
    // 加载打印范围/排序选项
    // ⚠️ 不能用 FetchSelect 的 enumCode 模式：enumCode 依赖 Vuex 枚举缓存 + 后端字典，
    // 字典项缺失时 FetchSelect 找不到匹配 label，会直接显示原始值(如 code=4 显示成 "4")。
    // 这里改为自行拉字典并在前端强制补齐「按个人视图」选项，字典未入库也能正常显示中文。
    async loadEnumOptions () {
      const [rangeRes, sortRes] = await Promise.all([
        getEnum('MaintenanceOutboundPrintRangeEnum').catch(() => []),
        getEnum('MaintenanceOutboundPrintSortEnum').catch(() => [])
      ]);
      this.rangeOptions = this.buildOptions(rangeRes);
      this.sortOptions = this.buildOptions(sortRes);
    },
    // 组装选项：过滤已删除项 + 强制补齐「按个人视图」(去重，排在最后)
    buildOptions (list) {
      const options = (list || []).filter(item => item && item.code !== undefined && item.code !== null);
      const hasPersonalView = options.some(item => String(item.code) === PERSONAL_VIEW_CODE);
      if (!hasPersonalView) {
        options.push({ code: PERSONAL_VIEW_CODE, message: PERSONAL_VIEW_LABEL });
      }
      return options;
    },
    // 拉取当前用户在维修出库明细表下的个人视图列表(下拉一次性取全量,与 CustomView 组件同口径 pageSize=100)
    // 说明：不加「加载中直接 return」的短路 —— 那样会把并发调用直接丢掉
    // (initData 加载中时用户又改选项，第二次调用被丢弃，列表不会刷新)
    async loadViewOptions () {
      this.viewLoading = true;
      try {
        const res = await pageCustomView({ bizKey: BIZ_KEY, pageNum: 1, pageSize: 100 });
        const records = (res && res.records) || [];
        this.viewOptions = records;
        // 已保存的视图没在列表里(视图被删/无权限/列表接口异常)，
        // 再单独按 id 查一次详情兜底取视图名，保证能回显
        const savedViewId = this.form.customViewId;
        if (savedViewId && !records.some(item => String(item.id) === String(savedViewId))) {
          await this.loadSavedViewDetail(savedViewId);
        }
      } catch (e) {
        this.viewOptions = [];
      } finally {
        this.viewLoading = false;
      }
    },
    // 按 id 单独查视图详情，兜底取 viewName（列表接口拿不到时的第二条路）
    async loadSavedViewDetail (savedViewId) {
      try {
        const detail = await getCustomViewDetail(savedViewId);
        if (detail && detail.viewName) {
          this.viewOptions = [{ id: savedViewId, viewName: detail.viewName }, ...this.viewOptions];
          return;
        }
      } catch (e) {
        // 详情接口失败，落到占位文案
      }
      // 两条路都拿不到 → 占位文案（至少让用户知道自己配过一个视图）
      this.viewOptions = [{ id: savedViewId, viewName: '视图已删除或无权限' }, ...this.viewOptions];
    },
    // 默认打印范围变更：选「按个人视图」→ 拉取个人视图列表(不做联动、不锁排序)
    handleRangeChange (val) {
      if (val === PERSONAL_VIEW_CODE) {
        this.loadViewOptions();
      }
    },
    // 排序变更：选「按个人视图」→ 拉取个人视图列表(不做联动、不锁范围)
    handleSortChange (val) {
      if (val === PERSONAL_VIEW_CODE) {
        this.loadViewOptions();
      }
    },
    close () {
      this.$emit('close');
    },
    async submit () {
      // 选了「按个人视图」必须选定具体视图(范围或排序任一为「按个人视图」)
      if (this.showViewSelect && !this.form.customViewId) {
        this.$message.warning('请选择个人视图');
        return;
      }
      // 两项都未选「按个人视图」时清掉视图ID，避免残留脏数据
      if (!this.showViewSelect) {
        this.form.customViewId = '';
      }
      this.submitLoading = true;
      await settingUpdate(this.form);
      this.submitLoading = false;
      this.$emit('success');
    },
  }
};</script>
<style lang="scss" scoped>
.m-start-work-dialog {

    ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell,
    ::v-deep .vxe-table--render-default .vxe-body--column:not(.col--active).col--ellipsis>.vxe-cell,
    ::v-deep .vxe-table--render-default.size--medium .vxe-header--column.is--padding .vxe-cell {
        padding: 8px 12px !important;
    }

    // 默认打印范围 + 个人视图下拉 同一行并排
    .print-setting-row {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
    }

    // 下拉框固定宽度：不随行内元素数量增减而伸缩
    // (el-select 默认宽度由内容撑开,会导致「只有一个下拉时被拉满整行、
    //  有两个下拉时各占一半」,三个框宽度还不一致)
    .print-setting-select {
        flex: none;
        width: 180px;
    }

    // 个人视图名称较长(视图名可到十几个字)，单独放宽一点避免截断
    .print-setting-select--view {
        width: 220px;
    }

    .start-work-content {
        .time-section {
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 1px solid #e8e8e8;

            .el-form {
                .el-form-item {
                    margin-bottom: 0;
                }
            }
        }

        .table-section {
            margin-top: 15px;
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
}
</style>
