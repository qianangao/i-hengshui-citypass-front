<template>
  <!-- 柱形图+折线图多个展示 -->
  <div class="bar-chart-container">
    <div class="bar-chart" id="myMaxbar"></div>
    <!-- <div id="myMaxbar" :style="{width: '500px', height: '350px'}"></div> -->
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
import {distributionWeek} from "@/api/system/bigScreen/index";
export default {
  data() {
    return {
      myMaxbar: null,
      userwork:undefined,
      title:[],
      visitsNum:[],
      peopleNum:[]
    };
  },
  created(){
    this.getUseerwok()
  },
  mounted() {
    
    
  },
  methods: {
    // 获取本周分布用户
    getUseerwok() {
      distributionWeek().then((response) => {
        this.distributionWeek=response.data
        let title = response.data.map(item => {
          return  item.title  
        });
       let visitsNum = response.data.map(item => {
          return  item.visitsNum  
        });
         let peopleNum = response.data.map(item => {
          return  item.peopleNum  
        });
        this.peopleNum=peopleNum
        this.visitsNum=visitsNum
        this.title = title;
        this.drawLine();
        }
      );
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      this.myMaxbar = echarts.init(document.getElementById("myMaxbar"));
      // 绘制图表
      this.myMaxbar.setOption({
        color: ["#0EA9A1", "#95CE5C", "#21D86D"],
        //提示框组件配置
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          textStyle: {
            fontSize: 12,
            color: "#fff"
          },
          padding: 10
        },
        // 图例组件
        legend: {
          show: true,
          top: "0",
          left: "5%",
          selectedMode: true,
          data: [
            {
              name: "访问次数",
              textStyle: {
                color: "#0EA9A1"
              }
            },
            {
              name: "访问人数",
              textStyle: {
                color: "#95CE5C"
              }
            },
            // {
            //   name: "销售品种",
            //   textStyle: {
            //     color: "#21D86D"
            //   }
            // }
          ]
        },
        //定义折线图距离左边多少右边多少的距离
        grid: {
          left: "2%",
          right: "5%",
          bottom: "16%",
          containLabel: true //区域是否包含坐标轴的刻度标签
        },
        xAxis: [
          //定义x轴
          {
            type: "category", //设置x轴的类型
            data: this.title
            // data:[
            //   'aaa',
            //   'bbb',
            //   'ccc'
            // ]
            ,
            nameTextStyle: {
              fontSize: 14
            },
            axisLabel: {
              //坐标轴刻度的相关设置
              interval: 0, //设置成 0 强制显示所有标签。
              rotate: -45, //标签旋转的角度
              margin: 15,
              textStyle: {
                color: "#fff"
              }
            }
          }
        ],
        yAxis: [
          // 定义y轴
          {
            nameTextStyle: {
              color: "#666666",
              fontSize: 14
            },
            show: true,
            type: "value",
            axisLabel: {
              // 坐标轴刻度标签的相关设置
              textStyle: {
                color: "#fff"
              }
            },
            axisLine: {
              // 坐标轴轴线相关设置
              show: false
            },
            splitLine: {
              // 坐标轴在网格区域中的分隔线
              lineStyle: {
                //x轴网格样式设置
                color: "#12403F"
              }
            }
          }
        ],
        series: [
          //系列列表。每个系列通过 type 决定自己的图表类型
          {
            name: "访问次数",
            type: "bar", // 设置为柱状图
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
            name: "访问人数",
            type: "line", // 设置为折线图
            symbol: "circle",
            symbolSize: [10, 10],
            data: this.peopleNum
          },
          // {
          //   name: "销售品种",
          //   type: "line",
          //   symbol: "circle",
          //   symbolSize: [10, 10],
          //   data: [
          //     111,
          //     122,
          //     100,
          //     104,
          //     70,
          //     210,
          //     200,
          //     160,
          //     300,
          //     400,
          //     100,
          //     102,
          //     91,
          //     124,
          //     40,
          //     210,
          //     230,
          //     140,
          //     240,
          //     180,
          //     140
          //   ]
          // }
        ]
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.bar-chart-container {
  width: 100%;
  padding-top: 8%;
  .bar-chart {
    width: 100%;
    height: 35vh;
  }
}
</style> 