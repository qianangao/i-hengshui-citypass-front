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
import {distributionWeek, userVisitDistributed} from "@/api/system/bigScreen/index";
export default {
  data() {
    return {
      barChartsApply: null,
      userwork:undefined,
      title:[],
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
        console.log("response.data",response.data);
      }).then(()=>{
        this.drawLine();
      });
    },
    // getUseerwok() {
    //   distributionWeek().then((response) => {
    //     this.distributionWeek=response.data;
    //     let title = response.data.map(item => {
    //       return  item.title  
    //     });
    //    let visitsNum = response.data.map(item => {
    //       return  item.visitsNum  
    //     });
    //      let peopleNum = response.data.map(item => {
    //       return  item.peopleNum
    //     });
    //     this.peopleNum=peopleNum
    //     this.visitsNum=visitsNum
    //     this.title = title;
    //     this.drawLine();
    //   });
    // },
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
          bottom: '0px',
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
            }
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
                  color: '#fff'
              },
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
          data: ['电话缴费', '固话缴费', '常用电话', '家政服务', '手机缴费']
        }, {
          type: 'category',
          inverse: true,
          axisTick: 'none',
          axisLine: 'none',
          show: true,
          axisLabel: {
              textStyle: {
                  color: '#ffffff',
                  fontSize: '10'
              }
          },
          data: [30000, 22000, 10000, 5000, 1000]
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
          data: [30000, 22000, 10000, 5000, 1000]
        },
        {
          name: '背景',
          type: 'bar',
          barWidth: 10,
          barGap: '-100%',
          data: [30000, 30000, 30000, 30000, 30000],
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