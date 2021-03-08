<template>
  <!-- 柱形图+折线图多个展示 -->
  <div class="bar-chart-container">
    <div class="bar-chart" id="myBarAndLine"></div>
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
import {distributionWeek, userVisitDistributed} from "@/api/system/bigScreen/index";
export default {
  data() {
    return {
      myBarAndLine: null,
      userwork:undefined,
      clickDate:[],
      visitsNum:[],
      peopleNum:[],

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
      userVisitDistributed().then((response) => {
        //  console.log("response.data",response.data);
         this.distributionWeek=response.data;
        let clickDate = response.data.map(item => {
          return  item.clickDate  
        });
        let visitsNum = response.data.map(item => {
          return  item.visitsNum  
        });
         let peopleNum = response.data.map(item => {
          return  item.peopleNum
        });
        this.peopleNum=peopleNum
        this.visitsNum=visitsNum
        this.clickDate = clickDate;
        this.drawLine();
      }).then(()=>{
        this.drawLine();
      });
    },

    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      this.myBarAndLine = echarts.init(document.getElementById("myBarAndLine"));
      // 绘制图表
      this.myBarAndLine.setOption({
        color: ["#0EA9A1", "#95CE5C"],
        //提示框组件配置
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          textStyle: {
            color: "rgba(96,255,249,1)",
            fontWeight:'100'
          },
          padding: 10
        },
        // 图例组件
        legend: {
          show: true,
          top: "5%",
          left: "5%",
          selectedMode: true,
          data: [
            {
              name:'访问次数',
              textStyle: {
                  color: "#0EA9A1"
              }
            }, { 
              name: '访问人数',
              textStyle: {
                  color: "#95CE5C"
              }
            }
          ]
        },
        //定义折线图距离左边多少右边多少的距离
        grid: {
          left: "2%",
          right: "8%",
          bottom: "5%",
          containLabel: true //区域是否包含坐标轴的刻度标签
        },
        xAxis: [
          {
            type: 'category',
            name: "日期",
            data: this.clickDate,
            axisPointer: {
                type: 'shadow'
            },
            nameTextStyle: {
              fontSize: 10
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(1,196,249,1)',//左边线的颜色
              }
            },
            axisLabel: {
              //坐标轴刻度的相关设置
            //   interval: 0, //设置成 0 强制显示所有标签。
            //   rotate: -15, //标签旋转的角度
              margin: 10,
              textStyle: {
                color: "rgba(1,196,249,1)",
                fontWeight:'100',
              }
            },
            // 去掉刻度
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '次数',
            min: 0,
            // max: 250,
            // interval: 50,
            axisLabel: {
                formatter: '{value}',
                // 坐标轴刻度标签的相关设置
                textStyle: {
                  color: "rgba(1,196,249,1)",
                }
            },
            axisLine: {
              // 坐标轴轴线相关设置
              show: true,
              lineStyle: {
                color: 'rgba(1,196,249,1)',//左边线的颜色
              }
            },
            splitLine: {
              show:false,
              // 坐标轴在网格区域中的分隔线
              lineStyle: {
                //x轴网格样式设置
                color: "#0EA9A1"
              }
            },
            // 去掉刻度
            // axisTick: {
            //   show: false
            // }
          },
          {
            type: 'value',
            name: '人数',
            min: 0,
            // max: 25,
            interval: 10,
            axisLabel: {
                formatter: '{value}',
                // 坐标轴刻度标签的相关设置
                textStyle: {
                  color: "rgba(1,196,249,1)",
                }
            },
            axisLine: {
              // 坐标轴轴线相关设置
              show: true,
              lineStyle: {
                color: 'rgba(1,196,249,1)',//左边线的颜色
              }
            },
            splitLine: {
              show:false,
              // 坐标轴在网格区域中的分隔线
              lineStyle: {
                //x轴网格样式设置
                color: "#95CE5C"
              }
            }
          }
        ],
        series: [
          {
            name: '访问次数',
            type: 'bar',
            barWidth: 14,
            //柱状图设置数值
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            data: this.visitsNum
          },
          {
            name: '访问人数',
            type: 'line',
            yAxisIndex: 1,
            symbol: "circle",
            symbolSize: [10, 10],
             data: this.peopleNum
          }
        ]
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.bar-chart-container {
  width: 100%;
  height: 100%;
  padding-top: 5px;
  .bar-chart {
    width: 100%;
    height: 100%;
  }
}
</style> 