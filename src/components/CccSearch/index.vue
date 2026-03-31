<template>
  <tree-search
    :selectRef="onSelectRef"
    :style="style"
    filterable
    clearable
    remote
    reserve-keyword
    :showAdd="showAdd"
    :showSearch="showSearch"
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
</template>
<script>
import { searchTree } from '@/api/claimreturn/claim/basic/ccc';
import TreeSearch from '@/libs/components/TreeSearch';
export default {
  props: {
    isAdd: {
      type: Boolean,
    },
    value: {
      type: String,
      default: '',
    }
  },
  components: {
    TreeSearch,
  },
  computed: {
    style: {
      get () {
        if (this.isAdd) {
          return { width: '305px', marginRight: '8px' };
        }
        return { width: '100%' };
      }
    },
    showAdd: {
      get () {
        if (this.isAdd) {
          return true;
        }
        return false;
      }
    },
    showSearch: {
      get () {
        if (this.isAdd) {
          return true;
        }
        return false;
      }
    }
  },
  watch: {
    value: {
      handler (val) {
        this.ccc = val;
      },
      immediate: true
    }
  },
  data () {
    return {
      ccc: '',
      selectRef: null
    };
  },
  methods: {
    onSelectRef (el) {
      this.selectRef = el;
    },
    cccRemote (query) {
      return searchTree({
        cccNameOrCodeLike: query,
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
    handleNodeClick (data, node) {
      if (!node.isLeaf) {
        return;
      }
      this.selectRef.blur();
      this.$emit('update', {
        data,
        node,
      });
    },
    // 自定义渲染内容
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
