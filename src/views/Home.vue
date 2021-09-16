<template>
  <div class="home">
    <div class="flex-wrap">
      <Setting
        :condition="tableCondition"
        @on-show="handleSettingShow"
        @on-save="handleSettingSave"
      ></Setting>
    </div>
    <el-table
      ref="table"
      :data="tableData"
      :checked="tableChecked"
      border
    >
      <el-table-column
        v-for="item in columns"
        :key="item.key"
        :label="item.label"
        :prop="item.key"/>
    </el-table>
  </div>
</template>

<script>
import columnsCtrl from '../mixins/columnsCtrl'

export default {
  name: 'Home',
  mixins: [columnsCtrl],
  data: () => ({
    tableData: [],
    columns: []
  }),
  created () {
    // mock data
    const data = {}
    for (let i = 1; i <= 10; i++) {
      const key = `column${i}`
      this.columns.push({
        key,
        label: `label${i}`
      })
      data[key] = `${key}数据`
    }
    this.tableData.push(data)
  }
}
</script>
<style scoped>
.flex-wrap {
  display: flex;
  justify-content: right;
}
</style>
