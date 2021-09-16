<script>
import { Table } from 'element-ui'

export default {
  name: 'CtrlTable',
  components: {
    'origin-table': Table
  },
  mixins: [],
  props: {
    checked: {
      type: [Array, undefined],
      default: undefined
    }
  },
  data: () => ({
    columns: []
  }),
  watch: {
    checked: {
      immediate: true,
      handler (val) {
        if (!this.checked) {
          this.columns = this.$slots.default
        } else {
          this.columns = this.$slots.default.filter(item => (
            val.includes(item.componentOptions && item.componentOptions.propsData.label) ||
            !(item.componentOptions && item.componentOptions.propsData.label) ||
            (item.componentOptions && item.componentOptions.propsData.label === '操作')
          ))
        }
      }
    }
  },
  render (h) {
    return h('origin-table', {
      attrs: this.$attrs,
      ref: 'table',
      on: this.$listeners
    }, this.columns)
  },
  methods: {}
}
</script>
