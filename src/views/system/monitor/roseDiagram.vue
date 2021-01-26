<template>
  <div class="ros-chart-container">
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
          affair:undefined
    }
},
created(){
 this.getUserwork()
},
mounted(){

},
methods:{
     // 获取用户数据
    getUserwork() {
      commonLight().then((response) => {
        //   console.log(response.data.affair)
        this.affair=response.data.affair
        // console.log(this.affair)
        this.rosCharts()
        }
      );
    },
    rosCharts(){
     this.ros = echarts.init(document.getElementById("ros"));
      // 绘制图表
      this.ros.setOption({
  
  
    series: [
        {
            name: '面积模式',         
            type: 'pie',
            radius: [10, 60],
            center: ['50%', '50%'],
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
</style>    