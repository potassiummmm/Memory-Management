<template>
  <div class="borders">
    <el-card>
      OS-请求调页<br>
      1852612 周涵嵩
    </el-card>
      <div><br>
        <div>当前置换算法</div><br>
        {{algorithm}}
        <br>
        <el-button type="primary" @click="setAlgo('FIFO')" round>FIFO</el-button>
        <el-button type="primary" @click="setAlgo('LRU')" round>LRU</el-button>
      </div><br>

      <div>总指令条数</div><br>
      <div>{{inst_num}}条</div>
      <br>
      <div>已执行指令条数</div><br>
      <div>{{exec_inst_num}}条</div>
      <br>
      <div>当前正在执行指令</div><br>
      <div>{{cur_inst}}</div>
      <div>缺页次数</div><br>
      <div>{{page_fault_num}}</div>
      <br>
      <div>缺页率</div><br>
      <div>{{page_fault_rate}}%</div>

    <el-main>
      <el-button type="primary" @click="reset" round :disabled="execute_type === '停止执行'">重置指令</el-button>
      <el-divider direction="horizontal"></el-divider>
      <el-button type="primary" @click="singleExec" round :disabled="execute_type === '停止执行'">单步执行</el-button>
      <el-divider direction="vertical"></el-divider>
      <el-button type="primary" @click="continuousExec" round :class="{
        'el-button--danger': execute_type === '停止执行',
      }">{{execute_type}}</el-button>
    </el-main>
  </div>
</template>


<script>
export default {
  name: "ControlPanel",
  props: {
    algorithm: String,
    execute_type: String,
    inst_num: Number,
    exec_inst_num: Number,
    cur_inst: Number,
    page_fault_num: Number,
  },
  data() {
    return {
      interval: Object,
      period: Number,
    }
  },
  created() {
    this.algorithm = "FIFO"
    this.period = 20
  },
  methods :{
    singleExec() {
      if (this.exec_inst_num >= 320) {
        if (this.execute_type === '停止执行') {
          alert("指令执行完毕！");
          this.$emit("set_execute_type", "连续执行");
          clearInterval(this.interval);
        }
        return;
      }
      this.$emit("execute", this.period);
    },
    continuousExec() {
      if (this.execute_type === "连续执行") {
        // alert("开启连续执行！");
        this.$emit("set_execute_type", "停止执行");
        this.interval = setInterval(this.singleExec, this.period);
      } else {
        // alert("结束连续执行！");
        this.$emit("set_execute_type", "连续执行");
        clearInterval(this.interval);
        this.period = 20;
      }
    },
    setAlgo(algo) {
      this.$emit("set_algorithm",algo)
    },
    reset(){
      this.$emit('reset')
    }
  },
  computed: {
    page_fault_rate: {
      get() {
        if (this.exec_inst_num === 0) {
          return 0;
        }
        return Math.floor((this.page_fault_num / this.exec_inst_num) * 100);
      }
    }
  }
}
</script>

<style scoped>
.borders{
  border-width: 2px;
  border-radius: 4px;
  border-style: solid;
  border-color: rgb(167, 167, 175);
  display: inline-block;
}
</style>