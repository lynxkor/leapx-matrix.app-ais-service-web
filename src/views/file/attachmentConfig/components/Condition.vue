<template>
  <div class="outer-container" :class="{ 'single-condition': conditions.length === 1 }">
    <div class="and-label" v-show="conditions.length > 1">or</div>
    <div
      class="conditions-wrapper"
      :class="{ 'has-multiple-conditions': conditions.length > 1 }"
    >
      <div
        v-for="(condition, conditionIndex) in conditions"
        :key="conditionIndex"
        class="main-content"
        :class="{
          'first-condition': conditionIndex === 0,
          'last-condition': conditionIndex === conditions.length - 1 && conditions.length > 1
        }"
      >
        <div class="condition">
          <div class="interior-container" :class="{ 'single-item': condition.dataList.length === 1 }">
            <div class="and-label" v-show="condition.dataList.length > 1">and</div>
            <div
              class="content-container"
              :class="{
                'has-multiple-items': condition.dataList.length >= 2,
                'single-item': condition.dataList.length === 1
              }"
            >
              <div
                v-for="(item, itemIndex) in condition.dataList"
                :key="itemIndex"
                class="data-item"
                :class="{ 'first-item': itemIndex === 0, 'last-item': itemIndex === condition.dataList.length - 1 }"
              >
                <!-- 字段选择 -->
                <fetch-select
                  ref="fieldSelectRef"
                  :options="fieldOptions"
                  v-model="item.field"
                  placeholder="请选择条件项"
                  value-key="value"
                  label-key="label"
                  @change="(val, row) => handleFieldChange(val, row, conditionIndex, itemIndex)"
                  clearable
                  style="margin-right: 10px; width: 200px;"
                />
                <!-- 逻辑判断 -->
                <el-select
                  v-model="item.operator"
                  placeholder="请选择逻辑判断"
                  style="margin-right: 10px;"
                  clearable
                >
                  <el-option
                    v-for="option in operatorOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>

                <!-- 条件值 - 根据 fieldType 动态展示 -->
                <!-- 文本类型 -->
                <el-input
                  v-if="item.fieldType === 'text'"
                  v-model="item.value"
                  placeholder="请输入条件值"
                  clearable
                  style="margin-right: 10px; width: 200px;"
                />
                <!-- 枚举类型 - 使用 fetch-select 远程加载 -->
                <fetch-select
                  v-else-if="item.fieldType === 'dict'"
                  :request="fetchOptions"
                  :enumCode="item.valueSource"
                  v-model="item.value"
                  placeholder="请选择条件值"
                  clearable
                  style="margin-right: 10px; width: 200px;"
                />
                <!-- URL 类型 - 远程搜索 -->
                <fetch-select
                  v-else-if="item.fieldType === 'url'"
                  :remote-method="(keyword) => handleUrlRemoteMethod(keyword, item)"
                  value-key="id"
                  label-key="name"
                  v-model="item.value"
                  placeholder="请选择条件值"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  style="margin-right: 10px; width: 200px;"
                />
                <!-- 默认展示输入框 -->
                <el-input
                  v-else
                  v-model="item.value"
                  placeholder="请输入条件值"
                  clearable
                  style="margin-right: 10px; width: 200px;"
                />

                <!-- 操作按钮 -->
                <div class="button-group">
                  <i @click="removeData(conditionIndex, itemIndex)" v-if="condition.dataList.length > 1" class="el-icon-minus" />
                  <i @click="addData(conditionIndex)" class="el-icon-plus" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="button-group outer-button-group">
          <i @click="removeOuterCondition(conditionIndex)" class="el-icon-minus" />
          <i @click="addOuterCondition" class="el-icon-plus" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FetchSelect from '@/libs/components/FetchSelect';
import { getEnum } from '@/api/common';
import { attachmentConfigConditionPage } from '@/libs/api/attachment';
import api from '@/axios';

export default {
  name: 'Condition',
  components: {
    FetchSelect
  },
  data () {
    return {
      fieldOptions: [],
      // 存储每个字段的 fieldType 信息
      fieldTypeInfoMap: {},
      operatorOptions: [
        { label: '等于', value: '=' },
        { label: '不等于', value: '!=' },
        { label: '大于', value: '>' },
        { label: '小于', value: '<' },
        { label: '大于等于', value: '>=' },
        { label: '小于等于', value: '<=' }
      ],
      conditions: [
        {
          dataList: [
            { field: '', fieldType: '', operator: '=', value: '' },
            // { field: '', fieldType: '', operator: '=', value: '' }
          ]
        }
      ]
    };
  },
  mounted () {
    this.loadFieldOptions();
  },
  methods: {
    handleFieldChange (_, row, conditionIndex, itemIndex) {
      // 清空值
      this.$set(this.conditions[conditionIndex].dataList[itemIndex], 'value', '');
      this.$set(this.conditions[conditionIndex].dataList[itemIndex], 'valueSource', row.valueSource);
      this.$set(this.conditions[conditionIndex].dataList[itemIndex], 'fieldType', row.fieldType);
    },
    // URL 类型的远程搜索
    async handleUrlRemoteMethod (keyword, item) {
      const url = item.valueSource;
      if (!url) return [];
      try {
        // 调用接口获取数据
        const res = await api.jsonPost(url, { keyword });
        return res.data || res || [];
      } catch (err) {
        console.error('获取远程数据失败', err);
        return [];
      }
    },
    // 加载字段选项 - 直接调用 attachmentConfigConditionPage 接口
    loadFieldOptions () {
      attachmentConfigConditionPage({ pageNum: 1, pageSize: 100 })
        .then(res => {
          const records = res.data?.records || [];
          this.fieldOptions = records.map(item => ({
            label: item.fieldName,
            value: item.fieldType,
            fieldType: item.fieldType,
            valueSource: item.valueSource
          }));
        })
        .catch(err => {
          console.error('加载字段选项失败', err);
        });
    },
    addData (conditionIndex) {
      this.conditions[conditionIndex].dataList.push({
        field: '',
        operator: '',
        value: ''
      });
    },
    removeData (conditionIndex, itemIndex) {
      this.conditions[conditionIndex].dataList.splice(itemIndex, 1);
    },
    addOuterCondition () {
      this.conditions.push({
        dataList: [{ field: '', operator: '', value: '' }]
      });
    },
    removeOuterCondition (conditionIndex) {
      if (this.conditions.length > 1) {
        this.conditions.splice(conditionIndex, 1);
      }
    },
    // 获取条件数据（供父组件调用）
    getConditions () {
      return this.conditions;
    },
    // 设置条件数据（供父组件回显）
    setConditions (conditions) {
      if (conditions && Array.isArray(conditions)) {
        this.conditions = JSON.parse(JSON.stringify(conditions));
        // 回显时重新初始化 fieldTypeInfoMap
        this.conditions.forEach(condition => {
          condition.dataList.forEach(item => {
            if (item.field && !item.fieldType) {
              // 如果是 url 类型，需要设置 fieldType
              if (item.valueSource && (item.valueSource.startsWith('http') || item.valueSource.startsWith('/'))) {
                item.fieldType = 'url';
              } else if (item.valueSource && item.valueSource.startsWith('dict:')) {
                item.fieldType = 'dict';
              } else {
                item.fieldType = 'text';
              }
            }
          });
        });
      }
    },
    // 重置条件（供父组件调用）
    resetConditions () {
      this.conditions = [
        {
          dataList: [
            { field: 'carSeries', fieldType: 'text', operator: '=', value: 'B10' },
            { field: 'yearType', fieldType: 'text', operator: '=', value: '2026' }
          ]
        }
      ];
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    }
  }
};
</script>

<style lang="scss" scoped>
.condition {
  width: 100%;
  border-radius: 5px;
  padding: 20px 10px 20px 30px;
}
.outer-container-borde {
  border: 1px solid #ddd;

}
.condition-group {
  padding: 20px;
}
.outer-container {
  padding: 20px 10px 20px 50px;
  margin-left: 20px;
  position: relative;
  min-height: 80px;
}

.outer-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 10%;
  height: 100%;
  border: 1px solid #ddd;
  border-right: none;
  border-radius: 12px 0 0 12px;
  pointer-events: none;
  box-sizing: border-box;
}

// 当只有一个条件且该条件只有一条数据时隐藏外层边框
.outer-container.single-condition::before {
  display: none;
}
.interior-container {
  // 确保没有完整的边框
  border: none;
  border-radius: 12px;
  padding: 20px 30px;
  padding-right: 0;
  position: relative;
  min-height: 80px;
}

.interior-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 10%;
  height: 100%;
  border: 1px solid #ddd;
  border-right: none; // 明确取消右边框
  border-radius: 12px 0 0 12px;
  pointer-events: none;
  box-sizing: border-box;
}

// 当只有一条数据时隐藏边框
.interior-container.single-item::before {
  display: none;
}

.and-label {
  position: absolute;
  top: 50%;
  left: -20px;
  transform: translateY(-50%);
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
  padding: 5px 10px;
  // font-size: 14px;
  color: #666;
  font-weight: bold;
}

.conditions-wrapper {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.main-content {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  // 调整对齐方式
  align-items: center;
}

// 修改 main-content 的条件样式逻辑
// 只有当 conditions 长度大于 1 时才应用特殊样式
.main-content {
  &.first-condition {
    margin-top: 0;
  }

  &.last-condition {
    margin-bottom: -0;
  }
}

// 新增：当有多个条件时的特殊处理
.conditions-wrapper.has-multiple-conditions {
  .main-content.first-condition {
    margin-top: -20px;
  }

  .main-content.last-condition {
    margin-bottom: -20px;
  }
}

.content-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 60px;
  position: relative;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-left: 20px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  // box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

// 修改 first-item 和 last-item 的样式
.data-item.first-item {
  margin-top: 0; // 移除负边距
}

.data-item.last-item {
  margin-bottom: 0; // 移除负边距
}

// 如果 dataList 长度大于等于 2，才应用特殊样式
.content-container.has-multiple-items {
  .data-item:first-child {
    margin-top: -20px; // 适度的向上偏移
  }
  .data-item:last-child {
    margin-bottom: -20px; // 适度的向下偏移
  }
}

.button-group {
  display: flex;
  gap: 8px;
  i {
    border: 0.9px solid #D8D8D8;
    border-radius: 4px;
    padding: 5px;
    cursor: pointer;
    color: var(--leap-color-defaul);
    font-size: 700;
  }
}

.outer-button-group {
  align-self: center;
  margin-left: 10px;
}
</style>
