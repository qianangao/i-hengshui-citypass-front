<template>
  <div class="his-chart-container">
    <div class="zyqh">
       <div class="histogramy" @click="histogramy" :class="time=='mouth' ? 'back': 'back2' ">近一月</div>
         <div class="histogramz" @click="histogramz" :class="time !=='mouth' ? 'back': 'back2' ">近一周</div>
      </div>
    <div class="his-chart" id="his"></div>
  </div>
</template>

<script>
let echarts = require("echarts/lib/echarts");
// 引入病状图组件
// require('echarts/lib/chart/bar')
require('echarts/lib/chart/pictorialBar')
// 引入提示框和title组件
// require("echarts/lib/component/series.pictorialBar");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");
require("echarts/lib/component/legendScroll"); //导入模拟数据
import {commonWork} from "@/api/system/bigScreen/index";
export default {
    
data () {
    return {
     his:null,
     name:[],
     value:[],
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
      commonWork(this.time).then((response) => {
          // console.log(response.data)
         let name = response.data.map(item => {
          return  item.name  
        });
         let value = response.data.map(item => {
          return  item.value  
        });
        this.name=name
        this.value=value
        this.work()
        }
      );
    },
    work(){
        // 基于准备好的dom，初始化echarts实例
      this.his = echarts.init(document.getElementById("his"));
      this.his.setOption({
      xAxis: {
              type: 'value',
         splitLine: {
            show: false
        },
        axisLine: {
            show: false
        },
        axisLabel: {
            show: false
        },
        axisTick: {
            show: false
        }
    },
    yAxis: {
      type: 'category',
      data: this.name,
       inverse: false,
       axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            textStyle: {
                  color: 'rgba(96,255,249,1)',
                   fontWeight:'100',
                   
             },
                    formatter:function(name){
              var res = name
          if (res.length > 1) {
            res = res.substring(0, 5) + '..'
          }
          return res
            }
        }
    },
    
     grid: {
         left: 100,
         top: 10, // 设置条形图的边距
         right: 80,
        bottom: 100
    },
    series: [{
         label: {
              normal: {
                show: true,
                position: "right",
                color:"'rgba(96,255,249,1)'"
              }
            },
        data: this.value,
        type: 'bar',
          barWidth: 14,
          legendHoverLink: false,
          silent: true,
          itemStyle: {
              barBorderRadius:[4,4,4,4],
              color:{
                   type: 'linear',
                   x: 0,
                   y: 0,
                   x2: 1,
                   y2: 0,
                   colorStops: [{
                 offset: 0, color: '#12272A' // 0% 处的颜色
                 }, {
                 offset: 1, color: '#62E6F6' // 100% 处的颜色
                }],
                  global: false // 缺省为 false
              },
             
          },
          
    },
    
      {
            // 分隔
            type: "pictorialBar",
            itemStyle: {
                normal:{
                    color:"#333"
                }
            },
            symbolRepeat: "fixed",
            symbolMargin: 6,
            symbol: "rect",
            symbolClip: true,
            symbolSize: [2, 21],
            symbolPosition: "start",
            symbolOffset: [1, -1],
            data:  this.value,
            z: 2,
            animationEasing: "elasticOut"
        },
        
    
    ]


    
      })
      
    }
}
}
</script>

<style lang="scss" scoped>
.his-chart-container {
  width: 100%;
  padding-top: 8%;
  overflow: hidden;
  .his-chart {
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
  color: #ffff;
  border: 1px solid #0053e5;
  border-radius: 2px;
  
}
.back2{
  background-color: #1d3257;
  color: #ffff;
  border: 1px solid #1890ff;
  border-radius: 2px;
  
}
</style>