<template>
  <div class="com-chart-container">
    <div class="com-chart" id="com"></div>
  </div>
</template>

<script>
var dataStyle = {
  normal: {
    label: {
      show: true,
      color: "#fff",
      fontSize: 0,
    },
    labelLine: {
      //smooth: 0.2,
      length: 10,
      length2: 10,
    },
  },
};

var labelShow = {
  show: true,
  color: "#fff",
  fontSize: 15,
  formatter: ["{b| {b} }"].join("\n"),
  rich: {
    d: {
      color: "rgba(1,196,249,1)",
    },
    b: {
      color: "rgba(1,196,249,1)",
    },
  },
};

var placeHolderStyle = {
  normal: {
    color: "rgba(0,0,0,0)",
    label: { show: false },
    labelLine: { show: false },
  },
  emphasis: {
    color: "rgba(0,0,0,0)",
  },
};
let echarts = require("echarts/lib/echarts");
// 引入饼状图组件
require("echarts/lib/chart/pie");
require("echarts/lib/chart/bar");
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");
require("echarts/lib/component/legendScroll");
import "echarts/lib/component/polar";
import { commiss } from "@/api/system/bigScreen/index";
export default {
  data() {
    return {
      com: null,
      name: [],
      value: [],
      commissexh: "",
    };
  },
  created() {},
  mounted() {
    this.getUserwork();
  },
  methods: {
    // 获取用户数据
    getUserwork() {
      commiss().then((response) => {
        this.commissAll = response.data.list;
        this.work();
      });
    },
    jishu() {
      var jd = 0;
      var wd = 10;
      var zj = 15;
      var hr = 5;
      let commissexh = [];
      for (var i = 0; i < this.commissAll.length; i++) {
        jd = jd + 10;
        wd = wd + 10;
        zj = zj + 30;
        hr += hr + 70;
        if (jd < 60) {
          jd = jd + 10;
        } else {
          jd = jd - 10;
        }
        if (wd < 60) {
          wd = wd + 10;
        } else {
          wd = wd - 20;
        }

        if (hr > 140) {
          hr -= hr - 33;
        } else {
          hr += hr + 50;
        }
      
        commissexh.push({
          name: "Line 1",
          type: "pie",
          clockWise: false,
          radius: [jd, wd],
          itemStyle: dataStyle,
          hoverAnimation: false,
          data: [
            {
              value: hr,
              name: "",
              itemStyle: placeHolderStyle,
            },
            {
             
              value: this.commissAll[i].num,
              name: this.commissAll[i].deptName,
              label: labelShow,
            },
            {
              value: zj,
              name: "",
              itemStyle: placeHolderStyle,
            },
          ],
        });

      }

      return commissexh;
    },
    work() {
      // 基于准备好的dom，初始化echarts实例
      this.com = echarts.init(document.getElementById("com"));
      this.com.setOption({
        color: ["#2078d1", "#8a00ec", "#ff00f3", "#fb0065", "#ff941b"],
        // tooltip: {
        //   show: true,
        //   formatter: "{b} <br/> {c} ({d}%)",
        // },
        angleAxis: {
          type: "category",
          z: 10,
          axisLine: {
            color: "#fff",
            lineStyle: {
              width: 1,
              color: "#95CE5C",
            },
          },
        },
        radiusAxis: {
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
            color: "#fff",
          },
          axisLine: {
            show: false,
            color: "#fff",
            lineStyle: {
              color: "#fff",
            },
          },
          splitLine: {
            color: "#000",
            lineStyle: {
              type: "dotted",
              color: "rgba(170,170,170,.5)",
            },
          },
        },
        polar: {
          radius: 80,
          center: ["50%", "50%"],
        },

        series: [
          ...this.jishu(),
          {
            type: "bar",
            data: [0],
            coordinateSystem: "polar",
            name: "06a",
            stack: "a",
          },
        ],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.com-chart-container {
  width: 100%;
  height: 100%;
  padding-top: 5px;
  overflow: hidden;
  .com-chart {
    width: 100%;
    height: 100%;
  }
}
</style>