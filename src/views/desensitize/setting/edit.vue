<template>
  <edit-page-layout ref="editLayout" :title="title">
    <template #left>
      <edit-base-container
        ref="containerRef"
        :id="_id"
        :title="title"
        :isEditing.sync="isEditing"
        :form.sync="form"
        :originalForm.sync="originalForm"
        :submitRequest="submitRequest"
        :detailRequest="detailRequest"
      >
        <el-main>
          <!-- 基础信息 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="130px" class="form-edit" v-if="isEditing || !_id">
                <el-form-item label="系统：">
                  <fetch-select
                    v-model="systemId"
                    :options="[{ code: 'leapx', message: '零小跑' }, { code: 'ais', message: '销服' }]"
                    placeholder="请选择"
                    clearable
                    style="width: 280px;"
                  />
                </el-form-item>
                <el-form-item label="名称：" prop="name">
                  <el-input
                    v-model="form.name"
                    placeholder="请输入"
                    :maxlength="100"
                    show-word-limit
                    clearable
                    style="width: 280px;"
                  />
                </el-form-item>
                <el-form-item label="数据库：" prop="dbName">
                  <fetch-select
                    v-model="form.dbName"
                    :request="fetchDbList"
                    :params="systemId"
                    placeholder="请选择"
                    clearable
                    filterable
                    style="width: 280px;"
                    @change="handleDbChange"
                  />
                </el-form-item>
                <el-form-item label="表：" prop="tableName">
                  <fetch-select
                    v-model="form.tableName"
                    :request="fetchTableList"
                    :params="form.dbName"
                    :disabled="!form.dbName"
                    placeholder="请先选择数据库"
                    clearable
                    filterable
                    style="width: 280px;"
                    @change="handleTableChange"
                  />
                </el-form-item>
                <el-form-item label="表名：">
                  <el-input v-model="form.tableNameZh" readonly style="width: 280px;" />
                </el-form-item>
                <el-form-item label="字段：" prop="columnName">
                  <fetch-select
                    v-model="form.columnName"
                    :request="fetchColumnList"
                    :params="tableParams"
                    :disabled="!form.tableName"
                    placeholder="请先选择表"
                    clearable
                    filterable
                    style="width: 280px;"
                    @change="handleColumnChange"
                  />
                </el-form-item>
                <el-form-item label="字段名：">
                  <el-input v-model="form.columnNameZh" readonly style="width: 280px;" />
                </el-form-item>
                <el-form-item label="数据分类：" prop="dataCategory">
                  <fetch-select
                    :request="fetchCategoryList"
                    v-model="form.dataCategory"
                    placeholder="请选择"
                    clearable
                    filterable
                    style="width: 280px;"
                  />
                </el-form-item>
                <el-form-item label="前缀保留位数：" prop="prefixKeep">
                  <el-input-number
                    v-model="form.prefixKeep"
                    placeholder="请输入"
                    :min="0"
                    :precision="0"
                    :controls="false"
                    clearable
                    style="width: 280px;"
                  />
                </el-form-item>
                <el-form-item label="后缀保留位数：" prop="suffixKeep">
                  <el-input-number
                    v-model="form.suffixKeep"
                    placeholder="请输入"
                    :min="0"
                    :precision="0"
                    :controls="false"
                    clearable
                    style="width: 280px;"
                  />
                </el-form-item>
                <el-form-item label="列表默认脱敏：" prop="listDesensitize">
                  <el-select v-model="form.listDesensitize" placeholder="请选择" style="width: 280px;">
                    <el-option :value="1" label="是" />
                    <el-option :value="0" label="否" />
                  </el-select>
                </el-form-item>
                <el-form-item label="详情默认脱敏：" prop="detailDesensitize">
                  <el-select v-model="form.detailDesensitize" placeholder="请选择" style="width: 280px;">
                    <el-option :value="1" label="是" />
                    <el-option :value="0" label="否" />
                  </el-select>
                </el-form-item>
                <el-form-item label="导出默认脱敏：" prop="exportDesensitize">
                  <el-select v-model="form.exportDesensitize" placeholder="请选择" style="width: 280px;">
                    <el-option :value="1" label="是" />
                    <el-option :value="0" label="否" />
                  </el-select>
                </el-form-item>
              </el-form>

              <!-- 详情态 -->
              <el-form :inline="true" class="form-detail" v-else>
                <el-form-item label="名称：">{{ form.name }}</el-form-item>
                <el-form-item label="数据库：">{{ form.dbName }}</el-form-item>
                <el-form-item label="表：">{{ form.tableName }}</el-form-item>
                <el-form-item label="表名：">{{ form.tableNameZh }}</el-form-item>
                <el-form-item label="字段：">{{ form.columnName }}</el-form-item>
                <el-form-item label="字段名：">{{ form.columnNameZh }}</el-form-item>
                <el-form-item label="数据分类：">{{ form.dataCategory }}</el-form-item>
                <el-form-item label="前缀保留位数：">{{ form.prefixKeep }}</el-form-item>
                <el-form-item label="后缀保留位数：">{{ form.suffixKeep }}</el-form-item>
                <el-form-item label="列表默认脱敏：">{{ form.listDesensitize === 1 ? '是' : '否' }}</el-form-item>
                <el-form-item label="详情默认脱敏：">{{ form.detailDesensitize === 1 ? '是' : '否' }}</el-form-item>
                <el-form-item label="导出默认脱敏：">{{ form.exportDesensitize === 1 ? '是' : '否' }}</el-form-item>
                <el-form-item label="创建人：">{{ form.creatorName }}</el-form-item>
                <el-form-item label="创建时间：">{{ form.createTime }}</el-form-item>
                <el-form-item label="修改人：">{{ form.modifierName }}</el-form-item>
                <el-form-item label="修改时间：">{{ form.updateTime }}</el-form-item>
              </el-form>
            </div>
          </section>

          <!-- 子配置 1：按岗位配置脱敏 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>按岗位配置脱敏</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <el-button v-if="canOperate" type="primary" plain icon="el-icon-plus" size="small" @click="addPositionRow">添加</el-button>
              </div>
              <div class="common-section-table">
                <vxe-table
                  ref="tableRef"
                  stripe
                  :data="form.positionList"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  :row-config="{ isHover: true }"
                  empty-text="暂无岗位配置，点击右上方“添加”按钮新增"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column title="岗位" min-width="18%" >
                    <template #default="{ row }">
                      <el-select
                        v-if="isEditing || !_id"
                        v-model="row.positionId"
                        filterable
                        placeholder="请选择岗位"
                        style="width: 100%;"
                        @change="(val) => handlePositionChange(row, val)"
                      >
                        <el-option v-for="p in positionOptions" :key="p.id" :value="p.id" :label="p.name" />
                      </el-select>
                      <span v-else>{{ row.positionName }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column title="列表脱敏" min-width="18%">
                    <template #default="{ row }">
                      <el-select v-if="isEditing || !_id" v-model="row.listDesensitize" placeholder="请选择" style="width: 100%;">
                        <el-option :value="1" label="是" />
                        <el-option :value="0" label="否" />
                      </el-select>
                      <span v-else>{{ row.listDesensitize === 1 ? '是' : '否' }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column title="详情脱敏" min-width="18%">
                    <template #default="{ row }">
                      <el-select v-if="isEditing || !_id" v-model="row.detailDesensitize" placeholder="请选择" style="width: 100%;">
                        <el-option :value="1" label="是" />
                        <el-option :value="0" label="否" />
                      </el-select>
                      <span v-else>{{ row.detailDesensitize === 1 ? '是' : '否' }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column title="导出脱敏" min-width="18%">
                    <template #default="{ row }">
                      <el-select v-if="isEditing || !_id" v-model="row.exportDesensitize" placeholder="请选择" style="width: 100%;">
                        <el-option :value="1" label="是" />
                        <el-option :value="0" label="否" />
                      </el-select>
                      <span v-else>{{ row.exportDesensitize === 1 ? '是' : '否' }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column  title="操作" width="160">
                    <template #default="{ rowIndex }">
                      <el-popconfirm v-if="canOperate" title="确定要删除吗？" confirm-button-text="删除" confirm-button-type="danger"  @confirm="removePositionRow(rowIndex)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                </vxe-table>
              </div>
            </div>
          </section>

          <!-- 子配置 2：按用户配置脱敏 -->
          <section class="common-section">
            <div class="common-section-header">
              <h2>按用户配置脱敏</h2>
            </div>
            <div class="common-section-body">
              <div class="common-section-header">
                <el-button v-if="canOperate" type="primary" plain icon="el-icon-plus" size="small" @click="addUserRow">添加</el-button>
              </div>
              <div class="common-section-table">
                <vxe-table
                  ref="tableRef"
                  stripe
                  :data="form.userList"
                  show-overflow
                  resizable
                  border="inner"
                  size="medium"
                  :row-config="{ isHover: true }"
                  empty-text="暂无用户配置，点击右上方“添加”按钮新增"
                  min-height="0"
                  max-height="400px"
                >
                  <vxe-column title="姓名" min-width="18%">
                    <template #default="{ row }">
                      <el-select
                        v-if="isEditing || !_id"
                        v-model="row.userId"
                        filterable
                        :filter-method="searchUserOptions"
                        :loading="userSearchLoading"
                        placeholder="请输入姓名或手机号"
                        class="user-select"
                        style="width: 100%;"
                        @change="(val) => (row, val)"
                      >
                        <el-option
                          v-for="u in userOptions"
                          :key="u.userId"
                          :value="u.userId"
                          :label="`${u.userName || u.username || ''}${u.mobile || u.phone ? ' ' + (u.mobile || u.phone) : ''}`"
                        />
                      </el-select>
                      <span v-else>{{ row.userName }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column title="列表脱敏" min-width="18%">
                    <template #default="{ row }">
                      <el-select v-if="isEditing || !_id" v-model="row.listDesensitize" placeholder="请选择" style="width: 100%;">
                        <el-option :value="1" label="是" />
                        <el-option :value="0" label="否" />
                      </el-select>
                      <span v-else>{{ row.listDesensitize === 1 ? '是' : '否' }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column title="详情脱敏" min-width="18%">
                    <template #default="{ row }">
                      <el-select v-if="isEditing || !_id" v-model="row.detailDesensitize" placeholder="请选择" style="width: 100%;">
                        <el-option :value="1" label="是" />
                        <el-option :value="0" label="否" />
                      </el-select>
                      <span v-else>{{ row.detailDesensitize === 1 ? '是' : '否' }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column title="导出脱敏" min-width="18%">
                    <template #default="{ row }">
                      <el-select v-if="isEditing || !_id" v-model="row.exportDesensitize" placeholder="请选择" style="width: 100%;">
                        <el-option :value="1" label="是" />
                        <el-option :value="0" label="否" />
                      </el-select>
                      <span v-else>{{ row.exportDesensitize === 1 ? '是' : '否' }}</span>
                    </template>
                  </vxe-column>
                  <vxe-column  title="操作" width="160">
                    <template #default="{ rowIndex }">
                      <el-popconfirm v-if="canOperate" title="确定要删除吗？" confirm-button-text="删除" confirm-button-type="danger"  @confirm="removeUserRow(rowIndex)">
                        <span slot="reference" type="text" size="small" class="btn-delete">删除</span>
                      </el-popconfirm>
                    </template>
                  </vxe-column>
                </vxe-table>
              </div>
            </div>
          </section>
        </el-main>
      </edit-base-container>
    </template>
    <template #right>
      <div class="page-common-edit">
        <!-- 右侧栏组件，自行开发 -->
      </div>
    </template>
  </edit-page-layout>
</template>

<script>
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import FetchSelect from '@/libs/components/FetchSelect';
import { add, edit, findById } from '@/api/desensitize/rule';
import {
  getDatabases,
  getTables,
  getColumns
} from '@/api/desensitize/metadata';
import { findByDictType, findUserList, getPostPage } from '@/api/common';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';

const defaultForm = {
  id: '',
  name: '',
  dbName: '',
  tableName: '',
  tableNameZh: '',
  columnName: '',
  columnNameZh: '',
  dataCategory: '',
  prefixKeep: '',
  suffixKeep: '',
  listDesensitize: 1,
  detailDesensitize: 1,
  exportDesensitize: 1,
  status: 1,
  creator: '',
  creatorName: '',
  createTime: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  positionList: [],
  userList: []
};

const defaultPositionRow = () => ({
  positionId: '',
  positionName: '',
  listDesensitize: 1,
  detailDesensitize: 1,
  exportDesensitize: 1
});

const defaultUserRow = () => ({
  userId: '',
  userName: '',
  listDesensitize: 1,
  detailDesensitize: 1,
  exportDesensitize: 1
});

export default {
  name: 'desensitizeSettingEdit',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    FetchSelect
  },
  computed: {
    _id () {
      const id = this.id || this.$route.query.id || this.form.id;
      return id !== null ? String(id) : '';
    },
    title () {
      return this._id ? '脱敏设置详情' : '脱敏设置';
    },
    // 详情查看态下禁止添加/删除子配置，仅编辑态或新增态可操作
    canOperate () {
      return this.isEditing || !this._id;
    },
    // 表名下拉参数（用于字段下拉）
    tableParams () {
      return {
        dbName: this.form.dbName,
        tableName: this.form.tableName
      };
    }
  },
  watch: {
    id: {
      handler (val) {
        if (val && this.$refs.containerRef) {
          this.$refs.containerRef.loadDetail();
        }
      },
      immediate: true
    },
    // 切换系统后重新加载数据库列表，并级联清空已选中的数据库/表/字段
    systemId: {
      handler (val) {
        this.form.dbName = '';
        this.form.tableName = '';
        this.form.tableNameZh = '';
        this.form.columnName = '';
        this.form.columnNameZh = '';
      }
    },
    // 进入编辑态时预置已选岗位/用户选项，保证回显中文名
    // （岗位列表与用户列表本身在 mounted 里预加载一次，不需重复请求）
    isEditing (val) {
      if (val) {
        this.seedPositionOptionsFromRows();
        this.seedUserOptionsFromRows();
      }
    },
    // 详情数据加载完成后(form.userList 引用变化)再补一次已选用户选项，
    // 解决带 isEditing=true 直接进入编辑态时 watch isEditing 先于 detailRequest 完成、
    // seedUserOptionsFromRows 在空 userList 上执行导致用户下拉显示原始 userId 的问题
    'form.userList' () {
      if (this.isEditing) {
        this.seedUserOptionsFromRows();
      }
    },
    // 同上，岗位列表兜底预加载已选岗位，保证回显
    'form.positionList' () {
      if (this.isEditing) {
        this.seedPositionOptionsFromRows();
      }
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '脱敏设置',
      pageType: 'edit',
      moduleKey: 'AISSECURITY-desensitize',
      isEditing: false,
      systemId: 'leapx',
      positionOptions: [],
      userOptions: [],
      userSearchLoading: false,
      form: { ...form },
      originalForm: { ...form },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        dbName: [{ required: true, message: '请选择数据库', trigger: 'change' }],
        tableName: [{ required: true, message: '请选择实体表', trigger: 'change' }],
        columnName: [{ required: true, message: '请选择字段', trigger: 'change' }],
        dataCategory: [{ required: true, message: '请选择数据分类', trigger: 'change' }],
        prefixKeep: [{ required: true, message: '请输入前缀保留位数', trigger: 'blur', type: 'number' }],
        suffixKeep: [{ required: true, message: '请输入后缀保留位数', trigger: 'blur', type: 'number' }],
        listDesensitize: [{ required: true, message: '请选择', trigger: 'change' }],
        detailDesensitize: [{ required: true, message: '请选择', trigger: 'change' }],
        exportDesensitize: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    };
  },
  mounted () {
    // 预加载岗位与用户下拉选项，避免新增场景（!_id 且 isEditing=false）下拉空空如也
    // 编辑场景也会复用这份缓存（fetchPositionOptions 内部有 length>0 短路、searchUserOptions 在 watcher 里也会复用）
    this.fetchPositionOptions();
    this.searchUserOptions('');
  },
  methods: {
    // 数据库下拉 - FetchSelect request 方法
    async fetchDbList (systemId) {
      if (!systemId) return [];
      try {
        const list = await getDatabases(systemId);
        // 返回 { code, message } 格式
        return (list || []).map(name => ({ code: name, message: name }));
      } catch (err) {
        console.error('获取数据库列表失败', err);
        return [];
      }
    },
    // 表名下拉 - FetchSelect request 方法
    async fetchTableList (dbName) {
      if (!dbName) return [];
      try {
        const list = await getTables(this.systemId, dbName);
        // 下拉只显示表名，避免表注释过长导致换行/溢出；
        // 原 tableNameZh 仍回填表注释，供“表名”输入框展示。
        return (list || []).map(item => ({
          code: item.tableName,
          message: item.tableName,
          tableName: item.tableName,
          tableNameZh: item.tableComment || ''
        }));
      } catch (err) {
        console.error('获取表名列表失败', err);
        return [];
      }
    },
    // 字段下拉 - FetchSelect request 方法
    async fetchColumnList (params) {
      const { dbName, tableName } = params || {};
      if (!dbName || !tableName) return [];
      try {
        const list = await getColumns(this.systemId, dbName, tableName);
        // 下拉只显示字段名，避免字段注释过长导致换行/溢出；
        // 原 columnNameZh 仍回填字段注释，供“字段名”输入框展示。
        return (list || []).map(item => ({
          code: item.columnName,
          message: item.columnName,
          columnName: item.columnName,
          columnNameZh: item.columnComment || '',
          columnType: item.columnType || ''
        }));
      } catch (err) {
        console.error('获取字段列表失败', err);
        return [];
      }
    },
    async fetchPositionOptions () {
      // 一次性全量加载岗位列表（size=1000），重复调用直接返回缓存避免重复请求
      if (this.positionOptions.length > 0) return;
      try {
        const res = await getPostPage({ page: 1, size: 1000 });
        // 后端 PostInfoDTO 字段：postId / zhName / enCode，适配为前端期望的 { id, name }
        this.positionOptions = (res.records || []).map(item => ({
          id: String(item.postId),
          name: item.zhName || item.enCode || ''
        }));
      } catch (err) {
        console.error('岗位查询失败', err);
        this.positionOptions = [];
      }
    },
    // 把已选岗位补进 positionOptions，避免选项列表里无匹配项导致 el-select 直接显示 positionId
    // 回显中文名来自后端 detail 返回的 positionName，不依赖 fetchPositionOptions 列表匹配
    seedPositionOptionsFromRows () {
      const exist = new Set(this.positionOptions.map(p => p.id));
      (this.form.positionList || []).forEach(p => {
        if (p.positionId && !exist.has(p.positionId)) {
          this.positionOptions.push({
            id: p.positionId,
            name: p.positionName || ''
          });
        }
      });
    },
    // 把已选用户补进 userOptions，避免选项列表里无匹配项导致 el-select 直接显示 userId
    seedUserOptionsFromRows () {
      const exist = new Set(this.userOptions.map(u => u.userId));
      (this.form.userList || []).forEach(u => {
        if (u.userId && !exist.has(u.userId)) {
          this.userOptions.push({
            userId: u.userId,
            userName: u.userName || '',
            mobile: u.mobile || ''
          });
        }
      });
    },
    searchUserOptions (query) {
      this.userSearchLoading = true;
      findUserList({
        param: query || '',
        page: 1,
        size: 50
      }).then(res => {
        // 后端返回 PaginationModel<UserDTO>，列表字段为 records
        this.userOptions = (res.records || []).map(item => ({
          userId: String(item.userId),
          userName: item.username || item.name || '',
          mobile: item.mobile || ''
        }));
        // 合并各行已选用户，防止搜索结果覆盖后其他行回显丢失
        this.seedUserOptionsFromRows();
      }).catch(err => {
        console.error('用户搜索失败', err);
        this.userOptions = [];
      }).finally(() => {
        this.userSearchLoading = false;
      });
    },
    // 数据库下拉变更 - FetchSelect change 事件参数：(val, selectedOption)
    handleDbChange (val) {
      // 级联清空下游选项
      this.form.tableName = '';
      this.form.tableNameZh = '';
      this.form.columnName = '';
      this.form.columnNameZh = '';
    },
    // 表名下拉变更 - FetchSelect change 事件参数：(val, selectedOption)
    // selectedOption 包含 { code, message, tableName, tableNameZh }
    handleTableChange (val, option) {
      if (!val) {
        this.form.tableName = '';
        this.form.tableNameZh = '';
        this.form.columnName = '';
        this.form.columnNameZh = '';
        return;
      }
      // 从 selectedOption 获取中文表名
      this.form.tableNameZh = (option && option.tableNameZh) || '';
      this.form.columnName = '';
      this.form.columnNameZh = '';
    },
    // 字段下拉变更 - FetchSelect change 事件参数：(val, selectedOption)
    // selectedOption 包含 { code, message, columnName, columnNameZh, columnType }
    handleColumnChange (val, option) {
      if (!val) {
        this.form.columnName = '';
        this.form.columnNameZh = '';
        return;
      }
      // 从 selectedOption 获取中文字段名
      this.form.columnNameZh = (option && option.columnNameZh) || '';
    },
    handlePositionChange (row, val) {
      const found = this.positionOptions.find(p => p.id === val);
      if (found) {
        row.positionName = found.name;
      } else if (!val) {
        // 失焦未选中清空本行数据
        const copy = defaultPositionRow();
        Object.keys(row).forEach(k => {
          row[k] = copy[k];
        });
      }
    },
    handleUserChange (row, val) {
      const found = this.userOptions.find(u => u.userId === String(val));
      if (found) {
        row.userName = found.userName;
      } else if (!val) {
        // 失焦未选中清空本行数据
        const copy = defaultUserRow();
        Object.keys(row).forEach(k => {
          row[k] = copy[k];
        });
      }
    },
    addPositionRow () {
      this.form.positionList.push(defaultPositionRow());
      this.fetchPositionOptions();
    },
    removePositionRow (index) {
      this.form.positionList.splice(index, 1);
    },
    addUserRow () {
      this.form.userList.push(defaultUserRow());
      if (this.userOptions.length === 0) {
        this.searchUserOptions('');
      }
    },
    removeUserRow (index) {
      this.form.userList.splice(index, 1);
    },
    validateSubRows () {
      // 子配置行校验：存在时所有字段必须填写
      for (const [i, row] of this.form.positionList.entries()) {
        if (!row.positionId) {
          this.$message.warning(`第 ${i + 1} 行岗位配置未填写完整`);
          return false;
        }
      }
      for (const [i, row] of this.form.userList.entries()) {
        if (!row.userId) {
          this.$message.warning(`第 ${i + 1} 行用户配置未填写完整`);
          return false;
        }
      }
      return true;
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return findById(id).then(res => {
          if (res) {
            return {
              ...res,
              positionList: (res.positionList || []).map(p => ({
                ...p,
                positionId: String(p.positionId || p.id || ''),
                listDesensitize: p.listDesensitize ?? 1,
                detailDesensitize: p.detailDesensitize ?? 1,
                exportDesensitize: p.exportDesensitize ?? 1
              })),
              userList: (res.userList || []).map(u => ({
                ...u,
                userId: String(u.userId || u.id || ''),
                listDesensitize: u.listDesensitize ?? 1,
                detailDesensitize: u.detailDesensitize ?? 1,
                exportDesensitize: u.exportDesensitize ?? 1
              }))
            };
          }
          return res;
        });
      }
    },
    async submitRequest () {
      // 前置校验
      if (!this.validateSubRows()) {
        return Promise.reject(new Error('子配置校验未通过'));
      }
      const payload = {
        ...this.form,
        // 字段拆分：保留 DTO 字段，避免冗余
        positionList: (this.form.positionList || []).map(p => ({
          positionId: String(p.positionId || ''),
          positionName: p.positionName || '',
          listDesensitize: p.listDesensitize ?? 1,
          detailDesensitize: p.detailDesensitize ?? 1,
          exportDesensitize: p.exportDesensitize ?? 1
        })),
        userList: (this.form.userList || []).map(u => ({
          userId: String(u.userId || ''),
          userName: u.userName || '',
          listDesensitize: u.listDesensitize ?? 1,
          detailDesensitize: u.detailDesensitize ?? 1,
          exportDesensitize: u.exportDesensitize ?? 1
        }))
      };
      const isUpdate = !!payload.id;
      if (isUpdate) {
        return edit(payload);
      }
      // 新增接口由后端负责唯一性校验；失败抛 BusinessException
      return add(payload);
    },
    getDefautlForm () {
      return { ...defaultForm };
    },
    // 数据分类下拉 - FetchSelect request 方法
    async fetchCategoryList () {
      try {
        const res = await findByDictType({
          dictType: 'desensitizeCategory',
          status: 0
        });
        // 后端返回 { label, value } 格式，转换为 FetchSelect 需要的 { code, message }
        return (res || []).map(item => ({
          code: item.value,
          message: item.label
        }));
      } catch (err) {
        console.error('获取数据分类失败', err);
        return [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
