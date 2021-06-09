<template>
  <div class="Home">
    <el-container>
      <ControlPanel
          :algorithm="algorithm"
          :page_fault_num="page_fault_num"
          :inst_num=320
          :exec_inst_num="exec_inst_num"
          :cur_inst="inst_addr"
          :execute_type="execute_type"
          @reset="reset"
          @execute="execute"
          @set_algorithm="setAlgorithm"
          @set_execute_type="setExecuteType"
      ></ControlPanel>
        <FrameList class="block-flex"
                   v-bind:page_num="[page_list[0],page_list[1],page_list[2],page_list[3]]"
                   v-bind:cur_inst="[cur_inst[0],cur_inst[1],cur_inst[2],cur_inst[3]]"
        ></FrameList>
      <el-main>
      </el-main>
      <el-aside width="420px" height="100px"><InstructionList class="form-flex" v-bind:inst_list="inst_history"></InstructionList></el-aside>
    </el-container>
  </div>
</template>

<script>
import ControlPanel from '@/components/ControlPanel.vue'
import FrameList from '@/components/FrameList.vue'
import InstructionList from '@/components/InstructionList.vue'

export default {
  name: 'Home',
  components:{
    ControlPanel,
    FrameList,
    InstructionList
  },
  data(){
    return {
      page_list: [],
      inst_history: [],
      cur_inst: [],
      switch_page: Array,
      call_in_time: Array,
      priority: Array,
      inst_addr: Number,
      algorithm: String,
      execute_type: String,
      page_fault_num: Number,
      exec_inst_num: Number,
    };
  },
  created() {
    this.page_list = [-1, -1, -1, -1];
    this.cur_inst = [-1, -1, -1, -1];
    this.switch_page = [0, 0, 0, 0];
    this.inst_addr = 100;
    this.algorithm = "FIFO";
    this.execute_type = "连续执行";
    this.page_fault_num = 0;
    this.exec_inst_num = 0;
    this.priority = [0, 0, 0, 0];
    var timestamp = new Date();
    this.call_in_time = [];
    for (var i = 0; i < 4; ++i) {
      this.call_in_time.push(timestamp.getTime());
    }
  },
  methods: {
    getRandomNum(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getNextInst() { // 获取下一条指令地址
      const rand = Math.random();
      if (rand < 0.5) {
        return (this.inst_addr + 1) % 320;
      } else if (rand >= 0.5 && rand < 0.75) {
        return this.getRandomNum((this.inst_addr + 1) % 320, 319);
      } else {
        return this.getRandomNum(0, this.inst_addr - 1);
      }
    },
    execute(period) { //执行指令
      const next_inst = this.getNextInst();
      const page = Math.floor(next_inst / 10);
      for (let i = 0; i < 4; ++i) {
        this.priority[i]++;
      }
      var page_fault = true; // 判断是否出现缺页中断
      for (let i = 0; i < 4; ++i) {
        if (this.page_list[i] === page) {
          page_fault = false;
          this.priority[i] = 0;
          break;
        }
      }
      if (page_fault) {
        this.page_fault_num++;
        if (this.algorithm === "FIFO") { //FIFO算法
          const earliest_time = Math.min(...this.call_in_time)
          const earliest_id = this.call_in_time.indexOf(earliest_time)
          if(this.page_list[earliest_id] === -1){
            this.inst_history.unshift({"instruction":this.exec_inst_num,"address":next_inst,"missPage":'True',"passPage":'无'})
          }
          else{
            this.inst_history.unshift({"instruction":this.exec_inst_num,"address":next_inst,"missPage":'True',"passPage":this.page_list[earliest_id]})
          }
          this.page_list[earliest_id] = page;
          this.cur_inst[earliest_id] = next_inst
          this.call_in_time[earliest_id] = new Date().getTime();
          this.priority[earliest_id] = 0;
          this.switch_page[earliest_id] = 1;
          setTimeout(() => {
            this.switch_page[earliest_id] = 0;
          }, 0.75 * period);

        } else { //LRU算法
          const least_used_times = Math.min(...this.priority)
          const least_used_id = this.priority.indexOf(least_used_times)
          if(this.page_list[least_used_id] === -1){
            this.inst_history.unshift({"instruction":this.exec_inst_num,"address":next_inst,"missPage":'True',"passPage":'无'})
          }
          else{
            this.inst_history.unshift({"instruction":this.exec_inst_num,"address":next_inst,"missPage":'True',"passPage":this.page_list[least_used_id]})
          }
          this.page_list[least_used_id] = page;
          this.cur_inst[least_used_id] = next_inst
          this.priority[least_used_id] = 0;
          this.switch_page[least_used_id] = 1;
          setTimeout(() => {
            this.switch_page[least_used_id] = 0;
          }, 0.75 * period);

        }
      }
      else{
        this.inst_history.unshift({"instruction":this.exec_inst_num,"address":next_inst,"missPage":'False',"passPage": '-'})
      }
      this.exec_inst_num++;
      this.inst_addr = next_inst;
    },
    setExecuteType(type) {
      this.execute_type = type;
    },
    setAlgorithm(algorithm) {
      this.algorithm = algorithm;
    },
    reset() {
      this.inst_addr = 0;
      this.execute_type = "连续执行";
      this.page_fault_num = 0;
      this.exec_inst_num = 0;
      this.page_list = [-1, -1, -1, -1];
      this.inst_history = [];
      this.switch_page = [0, 0, 0, 0];
      this.priority = [0, 0, 0, 0];
      const timestamp = new Date();
      this.call_in_time = [];
      for (let i = 0; i < 4; ++i) {
        this.call_in_time.push(timestamp.getTime());
      }
    },
  },
};
</script>

<style scoped>
.block-flex{
  margin-left:20px;
}
.form-flex{
  display:block;
  margin-top: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>