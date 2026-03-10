<template>
  <section class="common-section">
    <div class="common-section-header common-section-tip">
      <h2>故障名称</h2>
    </div>
    <div class="common-section-body" v-if="id">
      <section class="common-section">
        <tree-search
          :selectRef="onSelectRef"
          :style="{width: '305px', marginRight: '8px'}"
          filterable
          clearable
          remote
          reserve-keyword
          :value="ccc"
          :remote-method="cccRemote"
          :params="ccc"
          placeholder="请输入CCC编码或名称"
          label-key="name"
          value-key="id"
          sub-label-key="code"
          :treeProps="{
            'default-expand-all': true,
            props: {
              children: 'children',
              label: 'name'
            },
            'render-content': renderContent
          }"
          :treeListeners="{
            'node-click': handleNodeClick
          }"
        />
      </section>
      <section class="common-section"  v-if="canAddOrUpdate">
        <vehicle-table
          :moduleKey="moduleKey"
          ref="vehicleTable"
          :id="id"
          />
      </section>
    </div>
    <div class="common-section-body not-commit" v-else>
      提交新建后，即可添加
    </div>
  </section>
</template>
<script>

import {
  serviceActivityFaultUpdate
} from '@/api/claimreturn/claim/basic/serviceActivity';
import permissions from '@/libs/mixins/permissions';
import { getEnum } from '@/api/common';
import VehicleTable from './FaultTable.vue';
import TreeSearch from '@/libs/components/TreeSearch';
import { searchTree } from '@/api/claimreturn/claim/basic/ccc/index';

export default {
  props: {
    id: {
      type: String,
    },
    isEditing: {
      type: Boolean,
      default: true,
    },
    moduleKey: {
      type: String,
      required: true,
    }
  },
  mixins: [permissions],
  components: {
    VehicleTable,
    TreeSearch,
  },
  data () {
    return {
      ccc: '',
      selectRef: null,
    };
  },
  computed: {
    loadParams () {
      return {
        activityId: this.id,
      };
    }
  },
  watch: {
  },
  methods: {
    onSelectRef (el) {
      this.selectRef = el;
    },
    getData () {
      this.$refs.vehicleTable.getDetailPageApi();
    },
    async fetchOptions (code) {
      if (code) {
        return getEnum(code);
      }
      return [];
    },
    cccRemote (query) {
      return searchTree({
        cccCodeLike: query,
        cccNameLike: query,
        pageNum: 1,
        pageSize: 20,
      }).then(res => {
        return res.tree.map(item => {
          return {
            ...item,
            disabled: true,
          };
        });
      });
    },
    onUpdate (val, selectedItem) {
      serviceActivityFaultUpdate({
        vin: val,
        activityId: this.id,
      }).then(res => {
        this.getData();
      });
    },
    handleNodeClick (data, node) {
      if (!node.isLeaf) {
        return;
      }
      this.selectRef.blur();
      console.log(node, data);
    },
    renderContent (h, { node, data, store }) {
      const isLeaf = node.isLeaf;
      return h('div', {
        class: {
          'is-leaf': isLeaf,
        },
      }, [
        h('span', {
          class: 'node-label'
        }, node.label)
      ]);
    }
  }
};

</script>
<style lang="scss" scoped>
.common-section-header{
  font-size: 14px;
  font-weight: 500;
}

</style>
