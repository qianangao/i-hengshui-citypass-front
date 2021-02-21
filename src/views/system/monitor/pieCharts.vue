<template>
  <div class="pie-chart-container">
    <div class="pie-chart" id="pie"></div>
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
import {distribution} from "@/api/system/bigScreen/index";
export default {
  props: {
    yearBar: {
      type: Number,
      default: 0
    },
    barOriginalData: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    ageGroup:undefined,
    gender:undefined,
    chartBar: null,
    barOption: {
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)"
      },
      series: [
        {
          name: "性别统计",
          type: "pie",
          selectedMode: "single",
          radius: [0, "30%"],

          label: {
            position: "inner"
          },
          labelLine: {
            show: false
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: function(params) {
                //自定义颜色
                var colorList = [
                  "rgb(25,105,144)",
                  "rgb(11,130,144)"
                ];
                return colorList[params.dataIndex];
              }
            }
          },
          // data: [
          //   { value: 240, name: "女", selected: true },
          //   { value: 760, name: "男" }
          // ]
        },
        {
          name: "人数统计",
          type: "pie",
          radius: ["40%", "55%"],
          textStyle:{
            fontSize: 10
          },
          label: {
            // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
            // formatter: '{b|{b}: {c}} {abg|}\n{hr|}\n {per|{d}%}  ',
            formatter: "  {b|{b}：}{c}人{abg|}\n{hr|}\n\n  {per|{d}%}  ",
            backgroundColor: "rgba(10,96,145,0.25)",
            borderColor: "rgba(10,96,145,0.25)",
            borderWidth: 1,
            borderRadius: 3,
            
            rich: {
              a: {
                color: "#999",
                lineHeight: 22,
                align: "center"
              },
              hr: {
                borderColor: "#aaa",
                width: "100%",
                borderWidth: 0.5,
                height: 0
              },
              b: {
                fontSize: 12,
                lineHeight: 20
              },
              per: {
                padding: [2, 15],
                borderRadius: 2
              }
            }
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            },
            normal: {
              color: function(params) {
                //自定义颜色
                var colorList = [
                  "rgba(159,230,184,1)",
                  "rgba(251,199,116,1)",
                  "rgba(131,119,233,1)",
                  "rgba(53,157,255,1)",
                  "rgba(22,247,255,1)"
                ];
                return colorList[params.dataIndex];
              }
            }
          },
          // data: this.ageGroup

        }
      ]
    }
  }),
  watch: {
    // barOriginalData:{ //深度监听，可监听到对象、数组的变化
    //     handler (newV, oldV) {
    //         // do something, 可使用this
    //         this.initBarData();
    //         this.initData();
    //     },
    //     deep:true
    // }
  },
  created(){
  this.getUserDtb()
  },
  mounted() {
   
  },
  methods: {

           // 获取用户数量分布
    getUserDtb() {
      distribution().then((response) => {
         this.ageGroup=response.data.ageGroup
         this.gender=response.data.gender
          
      this.$nextTick(() => {
         this.initBarData();
          this.initData();
    });
        }
      );
    },
    initData() {
      // this.chartBar = echarts.init(document.getElementById(`bar-chart_${this.yearBar}`));
      this.chartBar = echarts.init(document.getElementById("pie"));
      this.barOption.series[1].data = this.ageGroup;
      this.barOption.series[0].data=this.gender;
      this.chartBar.setOption(this.barOption);
    },
    initBarData() {
      //   let originalBarData = [];
      //   let electronicBarData = [];
      //   let finXName = []; //x 轴
      // this.barOriginalData.forEach(item => {
      //     originalBarData.push(item.jcnum);
      //     electronicBarData.push(item.dlnum)
      //     finXName.push(item.dept || item.name);
      // });
      // this.barOption.series[0].data = originalBarData;
      // this.barOption.series[1].data = electronicBarData;
      // this.barOption.xAxis.data = finXName;
    }
  }
};
</script>
<style lang="scss" scoped>
.pie-chart-container {
  width: 100%;
  height: 100%;
  padding-top: 5px;
  .pie-chart {
    width: 100%;
    height: 100%;
    // height: 24vh;
  }
}
</style>    