<template>
  <el-popover
    ref="popover"
    placement="bottom"
    width="300"
    trigger="click"
    class="customer-setting"
    @show="handleShow"
  >
    <el-button slot="reference" icon="el-icon-setting" size="small" circle />
    <div>
      <p>
        <el-button size="mini" @click="handleCancel">取消</el-button>
        <el-button size="mini" type="primary" @click="handleSave">保存</el-button>
      </p>
      <el-checkbox-group v-model="checked" class="checkbox">
        <el-checkbox
          v-for="item in condition"
          :key="item"
          class="checkbox-item"
          :label="item"
        />
      </el-checkbox-group>
    </div>
  </el-popover>
</template>
<script>

export default {
  name: 'CustomerSetting',
  mixins: [],
  props: {
    condition: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    visible: false,
    checked: []
  }),
  watch: {},
  methods: {
    handleShow () {
      this.$emit('on-show', (checked) => {
        this.checked = [...checked]
      })
    },

    handleSave () {
      this.$emit('on-save', {
        checked: this.checked,
        cb: () => {
          this.$message.success('保存成功')
        }
      })
      this.handleCancel()
    },

    handleCancel () {
      this.$refs.popover && this.$refs.popover.doClose()
    }
  }
}
</script>
<style scoped>
.checkbox {
  display: flex;
  flex-wrap: wrap;
}
.checkbox-item {
  flex: 0 0 50%;
  margin-right: 0;
}
</style>
