<template>
  <!-- 柱形图+折线图多个展示 -->
  <div class="bar-chart-container">
    <div class="bar-chart" id="barChartsApply"></div>
  </div>  
</template>

<script>
let echarts = require("echarts/lib/echarts");
// 引入病状图组件
require("echarts/lib/chart/bar");
require("echarts/lib/chart/line");
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");
require("echarts/lib/component/legendScroll"); //导入模拟数据
import {distributionWeek, commonAll} from "@/api/system/bigScreen/index";
export default {
  data() {
    return {
      barChartsApply: null,
      userwork:undefined,
      name:[],
      value:[],
      leneght:[]

    };
  },
  created(){
    this.getUserVisit();
  },
  mounted() {
  },
  methods: {
    
    // 获取本周用户访问分布
    getUserVisit() {
      commonAll().then((response) => {
        //  console.log("response",response);
        this.commonAll=response.data;
      let name = response.data.map(item => {
          return  item.name  
        });
         let value = response.data.map(item => {
          return  item.value  
        });
        this.name=name
        this.value = value;
        this.jishu()
        this.drawLine();
      }).then(()=>{
        this.drawLine();
      });
    },

    jishu(){
     
      this.value.sort((a, b) => b - a)
      
      for (var i=0;i<this.value.length;i++) { 
           this.leneght.push(this.value[0])
          }
    },
 
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      this.barChartsApply = echarts.init(document.getElementById("barChartsApply"));
      // 绘制图表
      this.barChartsApply.setOption({
        //提示框组件配置
        tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'none'
          },
          formatter: function(params) {
              return params[0].name + '<br/>' +
                  "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:rgba(36,207,233,0.9)'></span>" +
                  params[0].seriesName + ' : ' + params[0].value + '<br/>'
          }
        },
        //定义折线图距离左边多少右边多少的距离
        grid: {
          left: '5%',
          right: '5%',
          bottom: '5%',
          top: '1px',
          containLabel: true
        },
        xAxis: {
          name: "次数",
          show: true,
          type: 'value',
          splitLine: {
            show:false
          },
          axisLabel: {
            //坐标轴刻度的相关设置
            interval: 0, //设置成 0 强制显示所有标签。
            rotate: -30, //标签旋转的角度
            margin: 5,
            
            textStyle: {
                color: "rgba(1,196,249,1)",
            },
          
            
          },
          axisLine: {
              // 坐标轴轴线相关设置
              show: false,
              lineStyle: {
                  color: 'rgba(1,196,249,1)',//左边线的颜色
              }
          },
          axisTick: {
              show: false
          }
        },
        yAxis: [{
          type: 'category',
          inverse: true,
          axisLabel: {
              show: true,
              textStyle: {
                  color: 'rgba(1,196,249,1)'
              },
           formatter:function(name){
              var res = name
          if (res.length > 5) {
            res = res.substring(0, 5) + '..'
          }
          return res
            }
          },
          splitLine: {
              show: false
          },
          axisTick: {
              show: false
          },
          axisLine: {
              show: false
          },
          data:this.name
        }, {
          type: 'category',
          inverse: true,
          axisTick: 'none',
          axisLine: 'none',
          show: true,
          axisLabel: {
              textStyle: {
                  color: 'rgba(1,196,249,1)',
                  fontSize: '10'
              },
   
          },
          data: this.value
        }],
        series: [{
          name: '次数',
          type: 'bar',
          zlevel: 1,
          itemStyle: {
              normal: {
                  barBorderRadius: 30,
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                      offset: 0,
                      color: 'rgb(57,89,255,1)'
                  }, {
                      offset: 1,
                      color: 'rgb(46,200,207,1)'
                  }]),
              },
          },
          barWidth: 10,
          data: this.value,
          
        },
        {
          name: '背景',
          type: 'bar',
          barWidth: 10,
          barGap: '-100%',
          data: this.leneght,
          itemStyle: {
            normal: {
                color: 'rgba(24,31,68,1)',
                barBorderRadius: 30,
            }
          },
        }]
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.bar-chart-container {
  width: 100%;
  height: 100%;
  padding-top: 2px;
  .bar-chart {
    width: 100%;
    height: 90%;
  }
}
</style> 