<template>
  <div class="com-chart-container">
    <div class="com-chart" id="com"></div>
  </div>
</template>

<script>
  var dataStyle = {
        normal: {
          label: {
            show:true,
            color: '#fff',
            fontSize: 0,
          },
          labelLine: {
            //smooth: 0.2,
            length: 10,
            length2: 10
          },
        }
      };

      var labelShow = {
        show:true,
        color: '#fff',
        fontSize: 15,
        formatter: [
         
          '{b| {b} }'
        ].join('\n'),
        rich: {
          d: {
            
            color: 'rgba(1,196,249,1)'
          },
          b: {
           
            color: 'rgba(1,196,249,1)'
          },
        }
      };

      var placeHolderStyle = {
        normal : {
          color: 'rgba(0,0,0,0)',
          label: {show:false},
          labelLine: {show:false}
        },
        emphasis : {
          color: 'rgba(0,0,0,0)'
        }
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
import 'echarts/lib/component/polar'
import {commiss} from "@/api/system/bigScreen/index";
export default {
    
data () {
    return {
     com:null,
     name:[],
     value:[]
    }
},
created(){
 
},
mounted(){
 this.getUserwork()
},
methods:{
 // 获取用户数据
    getUserwork() {
      commiss().then((response) => {
     this.commissAll=response.data;
      
     let name = response.data.list.map(item => {
          return  item.deptName  
        });
         let value = response.data.list.map(item => {
          return  item.num  
        });
        this.name=name
        this.value=value
        
        this.work()
        }
      );
    },
    work(){
        // 基于准备好的dom，初始化echarts实例
      this.com = echarts.init(document.getElementById("com"));
      this.com.setOption({
  

    color: ['#2078d1', '#8a00ec', '#ff00f3', '#fb0065', '#ff941b'],
    tooltip: {
        show: true,
        formatter: "{b} <br/> {c} ({d}%)"
    },
    angleAxis: {
        type: 'category',
        z: 10,
        axisLine: {
            color: '#fff',
            lineStyle: {
                width: 1,
                color: '#95CE5C',
            }
        },
    },
    radiusAxis: {
        axisTick: {
            show: false
        },
        axisLabel: {
            show: false,
            color: '#fff'
        },
        axisLine: {
            show: false,
            color: '#fff',
            lineStyle: {
                color: '#fff',
            }
        },
        splitLine: {
            color: '#000',
            lineStyle: {
                type: 'dotted',
                color: 'rgba(170,170,170,.5)',
            }
        },

    },
    polar: {
      
        radius: 80,
            center: ['50%', '50%'],
    },
 
    series: [{
            name: 'Line 1',
            type: 'pie',
            clockWise: false,
            radius: [30, 40],
            itemStyle: dataStyle,
            hoverAnimation: false,
            data: [{
                    value: 20,
                    name: '',
                    itemStyle: placeHolderStyle
                },
                {
                    value: this.value[0],
                    name: this.name[0],
                    label: labelShow,
                },
                {
                    value: 0,
                    name: '',
                    itemStyle: placeHolderStyle
                }

            ]
        },
        {
            name: 'Line 2',
            type: 'pie',
            clockWise: false,
            radius: [30, 40],
            itemStyle: dataStyle,
            hoverAnimation: false,

            data: [{
                    value: 30,
                    name: '',
                    itemStyle: placeHolderStyle
                },
                {
                    value: this.value[1],
                    name: this.name[1],
                    label: labelShow,
                },
                {
                    value: 100,
                    name: '',
                    itemStyle: placeHolderStyle
                }
            ]
        },
        {
            name: 'Line 3',
            type: 'pie',
            clockWise: false,
            hoverAnimation: false,
            radius: [40, 55],
            itemStyle: dataStyle,

            data: [{
                    value: 100,
                    name: '',
                    itemStyle: placeHolderStyle
                },
                {
                  value: this.value[2],
                    name: this.name[2],
                    label: labelShow,
                },
                {
                    value: 17,
                    name: '',
                    itemStyle: placeHolderStyle
                }
            ]
        },
        {
            name: 'Line 4',
            type: 'pie',
            clockWise: false,
            hoverAnimation: false,
            radius: [30, 40],
            itemStyle: dataStyle,

            data: [{
                    value: 150,
                    name: '',
                    itemStyle: placeHolderStyle
                },
                {
               value: this.value[3],
                    name: this.name[3],
                    label: labelShow,
                },
                {
                    value: 230,
                    name: '',
                    itemStyle: placeHolderStyle
                }
            ]
        },
        // {
        //     name: 'Line 5',
        //     type: 'pie',
        //     clockWise: false,
        //     hoverAnimation: false,
        //     radius: [35, 35],
        //     itemStyle: dataStyle,

        //     data: [{
        //             value: 0,
        //             name: '',
        //             itemStyle: placeHolderStyle
        //         },
        //         {
        //             value: 40,
        //             name: '五类烟',
        //             label: labelShow,
        //         },
        //         {
        //             value: 320,
        //             name: '',
        //             itemStyle: placeHolderStyle
        //         }
        //     ]
        // },
        {
            type: 'bar',
            data: [0],
            coordinateSystem: 'polar',
            name: '06a',
            stack: 'a'
        },

    ]

  


    
      })
      
    }
}
}
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