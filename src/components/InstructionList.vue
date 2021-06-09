<template>
  <div class="inst-list">
    <el-table
        height="600px"
        :data="inst_list"
        stripe
        style="width: 100%">
      <el-table-column
          prop="instruction"
          label="指令序号"
          width="80">
      </el-table-column>
      <el-table-column
          prop="address"
          label="指令地址"
          width="80">
      </el-table-column>
      <el-table-column
          prop="missPage"
          label="缺页"
          width="80">
      </el-table-column>
      <el-table-column
          prop="passPage"
          label="换出页">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "InstructionList",
  props:{
    inst_list: []
  }
}
</script>

<style scoped>

</style>