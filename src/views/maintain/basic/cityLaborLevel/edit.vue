<template>
  <edit-page-layout ref="editLayout" :title="pageTitle" showPaneFooter @save="handleSaveClick"
    @cancel="handleCancelClick">
    <template #left>
      <!-- TIPS: 如果需要竖排，direction="vertical" -->
      <edit-base-container ref="containerRef" :id="_id" :title="title" :isEditing.sync="isEditing" :form.sync="form"
        :originalForm.sync="originalForm" :submitRequest="submitRequest" :detailRequest="detailRequest" :dataTransform="dataTransform">
        <template #status>
          <!-- 支持primary,warning,success,danger等状态 -->
          <!-- <span class="status primary">状态</span> -->
        </template>
        <template #extraButtons>
          <!-- <el-button size="small">按钮1</el-button>
          <el-button size="small">按钮2</el-button> -->
        </template>
        <el-main>
          <section class="common-section">
            <div class="common-section-header">
              <h2>基础信息</h2>
            </div>
            <div class="common-section-body">
              <!-- TIPS: 自行调整label-width="150px"，使得label不换行 -->
              <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm" label-width="150px" class="form-edit"
                v-show="isEditing || !_id">
                <el-form-item label="行政区域名称：" prop="areaCode">
                  <el-cascader
                    placeholder="请选择行政区域"
                    v-model="form.areaCode"
                    :props="cascaderProps"
                    :options="areaOptions"
                    filterable
                    clearable
                    @change="handleCascaderChange"
                  />
                </el-form-item>
                <el-form-item label="行政区域代码：" prop="areaCode">
                  <el-input placeholder="请输入" v-model="form.areaCode" clearable disabled />
                </el-form-item>
                <el-form-item label="行政区域级别：" prop="areaLevel">
                  <fetch-select :request="fetchOptions" enumCode="AreaLevelEnum" v-model="form.areaLevel" placeholder="请选择"
            clearable disabled />
                </el-form-item>
                <el-form-item label="父级代码：" prop="parentId">
                  <el-input placeholder="请输入" v-model="form.parentId" clearable disabled />
                </el-form-item>
                <el-form-item label="父级行政区名称：" prop="parentName">
                  <el-input placeholder="请输入" v-model="form.parentName" clearable disabled />
                </el-form-item>
                <el-form-item label="城市工时等级：" prop="laborLevel">
                  <fetch-select :request="fetchOptions"  enumCode="CityLevelEnum"  v-model="form.laborLevel" placeholder="请选择" clearable
                    filterable value-key="code" label-key="message" />
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="form-detail" v-show="!(isEditing || !_id)">
                <el-form-item label="行政区域名称：" prop="areaName">
                  {{ form.areaName }}
                </el-form-item>
                <el-form-item label="行政区域代码：" prop="areaCode">
                  {{ form.areaCode }}
                </el-form-item>
                <el-form-item label="行政区域级别：" prop="areaLevelLabel">
                  {{ form.areaLevelLabel }}
                </el-form-item>
                <el-form-item label="父级代码：" prop="parentId">
                  {{ form.parentId }}
                </el-form-item>
                <el-form-item label="父级行政区名称：" prop="parentName">
                  {{ form.parentName }}
                </el-form-item>
                <el-form-item label="城市工时等级：" prop="laborLevelLabel">
                  {{ form.laborLevelLabel }}
                </el-form-item>
                <el-form-item label="创建时间：" prop="createTime">
                  {{ form.createTime }}
                </el-form-item>
                <el-form-item label="状态：" prop="status">
                  {{ form.statusLabel }}
                </el-form-item>
              </el-form>
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
import { getDetail, addOrUpdate } from '@/api/maintain/basic/cityLaborLevel/index';
import EditPageLayout from '@/libs/components/EditPageLayout';
import EditBaseContainer from '@/libs/components/EditBaseContainer';
import { getEnum } from '@/api/common';
import { YES_NO_ENUM } from '@/libs/constants';
import routeGuard from '@/libs/mixins/routeGuard';
import permissions from '@/libs/mixins/permissions';
import commonMixins from '@/libs/mixins/commonMixins';
import { getAreaTree } from '@/utils';
import FetchSelect from '@/libs/components/FetchSelect';

const defaultForm = {
  // 多选时字段有变化，自行修复
  id: '',
  creator: '',
  creatorName: '',
  modifier: '',
  modifierName: '',
  updateTime: '',
  remark: '',
  status: 1, // 默认可用状态
  statusDesc: '',
  areaCode: '',
  areaName: '',
  areaLevel: '',
  parentId: '',
  parentName: '',
  laborLevel: '',
  createTime: '',
};

export default {
  name: 'cityLaborLevelEdit',
  // 集中视图预留
  props: {
    id: {
      type: [String, Number],
      default: null
    },
  },
  mixins: [routeGuard, permissions, commonMixins],
  components: {
    EditPageLayout,
    EditBaseContainer,
    FetchSelect
  },
  computed: {
    _id () {
      return this.id || this.$route.query.id || this.form.id;
    },
    title () {
      return '行政区域代码：' + (this.form.areaCode || '新增');
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
    'form.areaCode': {
      handler (val) {
        if (val) {
          console.log(val);
          this.handleCascaderChange(val);
        }
      }
    }
  },
  data () {
    const form = this.getDefautlForm();
    return {
      pageTitle: '城市工时等级',
      pageType: 'edit',
      // TIPS: 权限前缀 AISMC，根据实际情况修改
      moduleKey: 'AISMC-cityLaborLevel',
      loading: false,
      submitLoading: false,
      yes_no_enum: YES_NO_ENUM,
      form: { ...form },
      originalForm: { ...form },
      emptyText: '若要启用此内容，请创建记录',
      areaOptions: getAreaTree(), // 行政区域选项数据
      cascaderProps: {
        checkStrictly: true,
        emitPath: false,
        label: 'name',
        value: 'code',
        children: 'child'
      },
      rules: {
        areaCode: [
          { required: true, message: '请选择行政区域', trigger: 'change' }
        ],
        areaLevel: [
          { required: true, message: '请输入行政区域级别', trigger: 'change' }
        ],
        laborLevel: [
          { required: false, message: '请选择城市工时等级', trigger: 'change' }
        ],
      }
    };
  },
  methods: {
    // 级联选择器变化事件
    handleCascaderChange (value) {
      if (value) {
        const areaInfo = this.getAreaInfo(value);
        if (areaInfo) {
          console.log('areaInfo', areaInfo);
          this.form.areaCode = value;
          // 根据选择的区域判断级别
          if (areaInfo.districtCode === value) {
            this.form.areaName = areaInfo.districtName;
            this.form.areaLevel = '3';
            this.form.parentId = areaInfo.cityCode;
            this.form.parentName = areaInfo.cityName;
          } else if (areaInfo.cityCode === value) {
            this.form.areaName = areaInfo.cityName;
            this.form.areaLevel = '2';
            this.form.parentId = areaInfo.provinceCode;
            this.form.parentName = areaInfo.provinceName;
          } else if (areaInfo.provinceCode === value) {
            this.form.areaName = areaInfo.provinceName;
            this.form.areaLevel = '1';
            this.form.parentId = '';
            this.form.parentName = '';
          }
        }
      } else {
        // 清空选择
        this.form.areaCode = '';
        this.form.areaName = '';
        this.form.areaLevel = '';
        this.form.parentId = '';
        this.form.parentName = '';
      }
    },
    /**
     * 获取省市县信息
     * @param {String} code 区域编码（省/市/区县）
     * @returns {Object} 省市区县信息
     */
    getAreaInfo (code) {
      let areaTree;
      try { areaTree = JSON.parse(localStorage.getItem('areaTree')) || []; } catch { areaTree = []; }

      // 遍历省级
      for (const province of areaTree) {
        // 省级匹配
        if (province.code === code) {
          return {
            provinceCode: province.code,
            provinceName: province.name,
            cityCode: '',
            cityName: '',
            districtCode: '',
            districtName: '',
          };
        }

        // 遍历市级
        if (province.child) {
          for (const city of province.child) {
            // 市级匹配
            if (city.code === code) {
              return {
                provinceCode: province.code,
                provinceName: province.name,
                cityCode: city.code,
                cityName: city.name,
                districtCode: '',
                districtName: '',
              };
            }

            // 遍历区县级
            if (city.child) {
              for (const district of city.child) {
                if (district.code === code) {
                  return {
                    provinceCode: province.code,
                    provinceName: province.name,
                    cityCode: city.code,
                    cityName: city.name,
                    districtCode: district.code,
                    districtName: district.name,
                  };
                }
              }
            }
          }
        }
      }
    },
    detailRequest () {
      const id = this._id;
      if (id) {
        return getDetail(id);
      }
    },
    // 数据转换，用于详情回显
    dataTransform (data) {
      // 确保区域名称正确显示
      return data;
    },
    submitRequest () {
      // 校验必填项
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            // 设置默认状态为可用
            this.form.status = 1;
            addOrUpdate({ ...this.form }).then(res => {
              resolve(res);
            }).catch(error => {
              reject(error);
            });
          } else {
            this.$message.error('请填写必填项');
            reject(new Error('表单验证失败'));
          }
        });
      });
    },
    // 处理保存按钮点击
    handleSaveClick () {
      this.submitRequest();
    },
    // 处理取消按钮点击
    handleCancelClick () {
      // 关闭侧边栏
      this.$refs.editLayout.closePane();
      // 如果有 id，说明是编辑模式，需要返回列表页
      if (this._id) {
        this.$router.push({ name: 'cityLaborLevel' });
      }
    },
    getDefautlForm () {
      // TIPS: 此处可添加表单默认值，如当前用户信息等
      // const userInfo = this.$store.state.user.userInfo;
      return {
        ...defaultForm
        // ownerId: userInfo.userId,
        // ownerName: userInfo.userName,
      };
    },
    // 审核日志
    // handleJumpAuditLog () {
    //   this.$auditLog.show({ id: 123 });
    // },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>
