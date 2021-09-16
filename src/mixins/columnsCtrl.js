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
