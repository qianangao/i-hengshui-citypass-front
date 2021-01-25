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
  
    toolbox: {
        show: true,
        feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    series: [
        {
            // name: '面积模式',
            type: 'pie',
            radius: [10, 80],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
                borderRadius: 8,
            //       normal: {
            //   color: function(params) {
            //     //自定义颜色
            //     var colorList = [
            //       "rgba(131,119,233.1)",
            //       "rgba(231,188,242.1)",
            //       "rgba(251,115,148.1)",
            //       "rgba(251,158,127.1)",
            //       "rgba(251,199,116.1)",
            //       "rgba(159,230,184.1)",
            //       "rgba(22,253,255.1)",
            //       "rgba(53,157,255.1)",
            //     ];
            //     return colorList[params.dataIndex];
            //   }
            // }
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