<template>
  <div>
    <div id="container"></div>
    <!-- <div class="input-card" style="width: auto;">
      <div class="input-item">
        <button class="btn" @click="heatmap.show()">显示热力图</button>
      </div>
      <div class="input-item">
        <button class="btn" @click="heatmap.hide()">关闭热力图</button>
      </div>
    </div>-->
  </div>
</template>

<script>
// https://a.amap.com/jsapi_demos/static/resource/heatmapData.js
import { heatmapData } from "./heatmapData";
import { mapList } from "@/api/map/map";
import {hotMap} from "@/api/system/bigScreen/map";
export default {
  data() {
    return {
      hotmap:undefined,
      map: null,
      heatmap: null,
      layer: null,
      colors: ['#ffffcc', '#a1dab4', '#41b6c4', '#225ea8']
    };
  },
  created(){
    
  },
  mounted() {
    this.getUserNum()
    // 延迟加载，防止出现AMap not defined
    setTimeout(() => {
      this.initMap();
      // this.getMapList();
      this.createHeatMap();
    }, 1000);
  },
  beforeDestroy() {
    this.map && this.map.destroy();
  },
  methods: {
          // 获取用户数量frequency
    getUserNum() {
      hotMap().then((response) => {
      //  console.log(response)
       this.hotmap=response.data
       
        }
      );
    },
    initMap() {
      this.map = new AMap.Map("container", {
        resizeEnable: true,
        // center: [116.480983, 39.989628],
        // 衡水
         center: [115.67001720703126, 37.73570969510259],
        // // 西安
        // center:[108.92326367187499,34.27593418470092],
        zoom: 11,
        mapStyle: "amap://styles/blue" // 极夜蓝
        //自定义地图样式：https://lbs.amap.com/dev/mapstyle/index
      });
    },
    //判断浏览区是否支持canvas
    isSupportCanvas() {
      let elem = document.createElement("canvas");
      return !!(elem.getContext && elem.getContext("2d"));
    },
    createHeatMap() {
     
      if (!this.isSupportCanvas()) {
        return this.$msg.error(
          "热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试。"
        );
      }
      let __this = this;
      this.map.plugin(["AMap.Heatmap"], function() {
       
        //初始化heatmap对象
        __this.heatmap = new AMap.Heatmap(__this.map, {
          visible: false,
          radius: 25, //给定半径
          opacity: [0, 0.8]
        });
        //设置数据集：该数据为北京部分“公园”数据
        __this.heatmap.setDataSet({
          data:  __this.hotmap,
          max: 100
        });
      });
    },
    // getMapList() {
    //   mapList().then(response => {
    //     console.log("response",response);
    //   });
    // }
  }
};
</script>
<style  src="@/views/system/map/demo-center.css" scoped>

</style>
<style lang="scss" scoped>
/* @import url("https://a.amap.com/jsapi_demos/static/demo-center/css/demo-center.css"); */

#container {
  margin: 0;
  padding: 0;
  width: 100%;
  // height: 500px;
  height: 79vh;
  // height: 120%;
}
.input-card .btn {
  margin-right: 1.2rem;
  width: 9rem;
}

</style>
<style >
.amap-logo{
   opacity:0;
}
</style>