<template>
  <div class="frame-list">
      <div v-for="i in frame_id" :key="i" class="block">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Frame # {{i}}</span><br>
          </div>
          <div style="text-align: center">
            <span>Page #</span>
            <span v-if ="page_num[i] !== -1">
              {{page_num[i]}}
            </span>
            <span v-else>
              空
            </span><br>
            <span>当前指令: </span>
            <span v-if ="page_num[i] !== -1">
              {{cur_inst[i]}}
            </span>
            <span v-else>
              空
            </span>
            <el-col>
              <div v-for="address in address_list[i]" v-bind:key="address.physical_address" class="item">
                <el-row>
                  {{address.physical_address}}
                </el-row>
              </div>
            </el-col>
          </div>
        </el-card>
      </div>
  </div>
</template>

<script>
export default {
  name: "FrameList",
  props:{
    page_num: Array,
    cur_inst: Array
  },
  data(){
    return{
      frame_id:[0,1,2,3],
      color:[],
    }
  },
  watch: {
    page_num: function(newValue) {
      console.log(newValue);
    }
  },
  computed:{
    address_list:{
      get(){
        var address_list = [];
        for (let i = 0; i < 4; i++) {
          address_list[i] = []
          if(this.page_num[i] >= 0 && this.page_num[i] < 32) {
            for (let j = 0; j < 10; ++j) {
              address_list[i].push({ physical_address: this.page_num[i] * 10 + j });
            }
          }
          else {
            for (let j = 0; j < 10; ++j) {
              address_list[i].push({ physical_address: "EMPTY" });
            }
          }
        }
        return address_list;
      }
    }
  }
}
</script>


<style scoped>
.item {
  font-size: 18px;
  background-color: powderblue;
  border-color: deepskyblue;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  border-width:2px;
  border-radius: 4px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.block{
  text-align: center;
  display: inline-flex;
  margin-top: 15px;
  margin-right:20px;
  margin-bottom: 15px;
}
.box-card {
  width: 200px;
}
.el-row {
  margin-top: 20px;
  margin-bottom: 20px;
}
.el-row  .el-card {
  text-align: center;
  min-width: 50%;
  height: 100%;
  margin-right: 20px;
  transition: all .5s;
}
</style>