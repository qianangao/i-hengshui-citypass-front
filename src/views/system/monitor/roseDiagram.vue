<template>
  <div class="ros-chart-container">
     <div class="zyqh">
       <div class="histogramy" @click="histogramy" :class="time=='mouth' ? 'back': 'back2' ">近一月</div>
         <div class="histogramz" @click="histogramz" :class="time !=='mouth' ? 'back': 'back2' ">近一周</div>
      </div>
    <div class="ros-chart" id="ros"></div>
  </div>
</template>

<script>
let echarts = require("echarts/lib/echarts");
// 引入饼状图组件
require("echarts/lib/chart/pie");
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");
require("echarts/lib/component/legendScroll");
import {commonLight} from "@/api/system/bigScreen/index";
export default {
data () {
    return {
          ros:null,
          affair:undefined,
           time:'mouth'
    }
},
created(){
 this.getUserwork()
},
mounted(){

},
methods:{
    histogramy(){
  //  this.time='week'
    this.time='mouth'
   this.getUserwork()
  },
    histogramz(){
   this.time='week'
   this.getUserwork()
  },
     // 获取用户数据
    getUserwork() {
      commonLight(this.time).then((response) => {
          //  console.log(response.data)
        this.affair=response.data
        // console.log(this.affair)
        this.rosCharts()
        }
      );
    },
    rosCharts(){
     this.ros = echarts.init(document.getElementById("ros"));
      // 绘制图表
      this.ros.setOption({
  
     tooltip: {
        trigger: 'item',
        formatter: ' {c}次 ({d}%)'
    },
    series: [
        {
            name: '面积模式',         
            type: 'pie',
            radius: [10, 60],
            center: ['50%', '30%'],
            roseType: 'area',
            itemStyle: {
                borderRadius: 8,
              }, 
            
              labelLine:{  
                   normal:{  
                        length:1,  // 改变标示线的长度
                   }},
     
             label: {
             fontSize:12,
             show: true,
             width:1,
            overflow :'break',
             },
            
            data: this.affair,
            color: ['#8377E9', '#E7BCF2', '#FB7394', '#FB9E7F', '#FBC774', '#9FE6B8','#10C0CB','#359DFF']

        }
        
    ]


      })
    }
  
}

}
</script>
<style lang="scss" scoped>
.ros-chart-container {
  width: 100%;
  padding-top: 8%;
  overflow: hidden;
  .ros-chart {
    width: 100%;
    height: 35vh;
  }
}
.zyqh{
    position: absolute;
    right: 0;
   top: 20px;
}
.histogramy{
    /* background-color: blue; */
float: left;
    width: 50px;
    text-align: center;
    font-size: 12px;
    height: 20px;
    color: #ffff;
    line-height: 20px;
}
.histogramz{
  line-height: 20px;
    color: #ffff;
     /* background-color: wheat; */
   float: right;
    width: 50px;
    text-align: center;
     font-size: 12px;
       height: 20px;
}
.back{
  background-color: #0053e5;
  color: #fff;
  border: 1px solid #0053e5;
  border-radius: 2px;
  
}
.back2{
  background-color: #1d3257;
  color: #95CE5C;
  border: 1px solid #1890ff;
  border-radius: 2px;
  
}

</style>    