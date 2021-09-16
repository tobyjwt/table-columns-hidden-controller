## 给你的table页面低成本的加上column隐藏控制器
最近接到一个需求，背景是用户反馈table的column普遍都太多了，不同的用户群体关注的是不同的column，他们期望可以自定义控制显示哪些column。

这个需求并不复杂，用v-if控制就可以轻松实现，可怕的是这样的页面有上百个，每个页面可能包含20-40个不等的column，如果每个column都用一个v-if语句来控制，实现起来也太不优雅了。

### 实现
#### 思路核心
由于存量的代码太多，想要最低成本的实现，最好是不用怎么修改原来的那些标签和属性，直接在入口文件中注册一个同名的组件覆盖掉原来的table组件，下面的代码都用element库来示例
```javascript
import CtrlTable from '@/components/CtrlTable'
Vue.component('el-table', CtrlTable)
```

接下来就来编写`CtrlTable`这个组件，我们的核心诉求是尽量少的修改存量的代码，所以这里要先将attr和事件监听透传下来

CtrlTable.vue
```javascript
import { Table } from 'element-ui'

export default {
  name: 'CtrlTable',
  components: {
    'origin-table': Table
  },
  render (h) {
    return h('origin-table', {
      attrs: this.$attrs,
      ref: 'table',
      on: this.$listeners
    }, this.$slots.default)
  }
}
```
上面组件中，从`element-ui`中引入了`Table`组件，然后在`render`函数中直接返回，这个组件的意义其实是作为一个中间组件，它接受旧代码中已经写在`el-table`标签里的attrs和事件监听，然后再把它们传递到真正的`el-table`组件中。到这一步，可以在页面中观察包含`el-table`的页面，它们已经正常出现在浏览器里了，看起来和之前并无区别，实际上中间多包了一层。

#### 补全实现
接下来补充控制语句，实际上已经很简单了，只要对`$slots.default`来做过滤就可以了，接收一个`checked`的props，它表示要显示哪些`column`

CtrlTable.vue
```javascript
import { Table } from 'element-ui'

export default {
  name: 'CtrlTable',
  components: {
    'origin-table': Table
  },
  props: {
    checked: {
      type: [Array, undefined],
      default: undefined
    }
  },
  computed: {
    columns () {
      if (!this.checked) {
        return this.$slots.default
      }
      return this.$slots.default.filter(item => (
        this.checked.includes(item.componentOptions && item.componentOptions.propsData.label) ||
        !(item.componentOptions && item.componentOptions.propsData.label) ||
        (item.componentOptions && item.componentOptions.propsData.label === '操作')
      ))
    }
  },
  render (h) {
    return h('origin-table', {
      attrs: this.$attrs,
      ref: 'table',
      on: this.$listeners
    }, this.columns)
  }
}
```
注意有一个小细节是如果不存在`checked`，会渲染所有的`$slots.default`，这么做的好处就是如果你有些页面不需要做`column`控制，只要不传`checked`，仍然可以渲染出所有的`column`。

接下来就是实现控制器了，抽成了一个`mixin`，逻辑比较简单，直接贴代码

columnsCtrl.js
```javascript
import Setting from '@/components/Setting'
const CONDITION_STORAGE_KEY = 'localstorage_key_demo'

export default {
  components: {
    Setting
  },

  data: () => ({
    tableCondition: [],
    tableChecked: []
  }),

  mounted () {
    this.__initCondition()
  },

  methods: {
    __initCondition () {
      const {
        table
      } = this.$refs
      if (table && table.$slots && table.$slots.default.length) {
        this.tableCondition = table.$slots.default.map(item => item.componentOptions && item.componentOptions.propsData.label).filter(item => !!item && item !== '操作')
      }
      this.__checkView(this.__getCache('table'))
    },

    __checkView (checked) {
      const { table } = this.$refs
      this.tableChecked = checked || table.$slots.default.map(item => item.componentOptions && item.componentOptions.propsData.label).filter(item => !!item && item !== '操作')
    },

    __getCache () {
      const { name } = this.$route
      const cacheKey = `${name}`
      const cache = JSON.parse(localStorage.getItem(CONDITION_STORAGE_KEY))
      if (cache && cache[cacheKey]) {
        return cache[cacheKey]
      }
      return null
    },

    handleSettingShow (cb) {
      const cache = this.__getCache()
      cb && cb(cache || [...this.tableCondition])
    },

    handleSettingSave ({ cb, checked }) {
      const { name } = this.$route
      const cacheKey = name
      let cache = JSON.parse(localStorage.getItem(CONDITION_STORAGE_KEY))
      if (!cache) {
        cache = {}
      }
      cache[cacheKey] = [...checked]
      localStorage.setItem(CONDITION_STORAGE_KEY, JSON.stringify(cache))
      this.__checkView(checked)
      cb && cb()
    }
  }
}
```
控制器组件部分代码比较简单，这里就省略了
