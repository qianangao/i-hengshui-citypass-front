<template>
    <div class="monitor-container">
        <div class="monitor-header">
            <div class="monitor-header-left">
                <el-button class="monitor-header-button" type="primary" size="mini" round @click="goBack">返回</el-button>
            </div>
            <div class="monitor-header-middle">
                <div class="monitor-header-title">I 衡水运行监控平台</div>
            </div>
            <div class="monitor-header-right">
                <!-- <span><img src="../../../assets/monitor/timeIcon.png"/></span> -->
                <span>{{this.currentTime}}</span>
            </div>
        </div>
        <div class="monitor-content">
            <!-- 左侧的布局 -->
            <div class="monitor-content-between">
                <div class="content-between-layout">
                    <div class="between-layout">
                        <div>用户分布</div>
                        <div class="content-charts">
                            <pieCharts/>
                        </div>
                    </div>
                </div>
                <div class="content-between-layout">
                    <div class="between-layout">
                        <div>本周用户访问分布</div>
                        <div class="content-charts">
                            <barAndLineCharts/>
                        </div>
                    </div>
                </div>
                <div class="content-between-layout">
                    <div class="between-layout">
                        <div>本周应用访问分布</div>
                        <div class="content-charts">
                            <barChartsApply/>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 中间的布局 -->
            <div class="monitor-content-middle">
                <div class="content-middle">
                    <div class="content-middle-top">
                        <el-row>
                            <el-col :span="6">
                                <div class="content-middle-register">
                                    <div>{{this.registerUserNum}}</div>
                                    <div>注册用户</div>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="content-middle-verified">
                                    <div>{{this.isIdentityUserNum}}</div>
                                    <div>实名认证数</div>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="content-middle-number">
                                    <div>{{this.visitsPeopleNum}}</div>
                                    <div>当天访问人数</div>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="content-middle-times">
                                    <div>{{this.visitsFrequencyNum}}</div>
                                    <div>当天访问次数</div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="content-middle-bottom">
                        <Map/>
                    </div>
                </div>
            </div>
            <!-- 右侧的布局 -->
            <div class="monitor-content-between">
                <div class="content-between-layout">
                    <div class="between-layout">
                        <div>常用办事排行TOP10</div>
                        <!-- <div class="content-charts">
                            <histogram/>
                         </div> -->
                    </div>
                </div>
                <div class="content-between-layout">
                    <div class="between-layout">
                        <div>常用生活服务TOP10</div>
                        <!-- <div class="content-charts">
                           <roseDiagram/>
                        </div> -->
                    </div>
                </div>
                <div class="content-between-layout">
                    <div class="between-layout">
                        <div>委办局接入服务</div>
                        <!-- <div class="content-charts">
                           <roseDiagram/>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Map from "../map/index";
import pieCharts from "./pieCharts";
import barAndLineCharts from "./barAndLineCharts";
import barChartsApply from "./barChartsApply";
// import barCharts from "./barCharts";
import histogram from "./histogram";
import roseDiagram from "./roseDiagram";
import {amountoFusers,frequency} from "@/api/system/bigScreen/index";
export default {
    components: {
        Map,
        pieCharts,
        barAndLineCharts,
        barChartsApply,
        // barCharts,
        histogram,
        roseDiagram
    },
    data() {
        return {
            currentTime:"",
            timer: "",
            // 实名注册数
            isIdentityUserNum:undefined,
            // 用户注册数
            registerUserNum:undefined,
            // 当天访问人数
            visitsPeopleNum:undefined,
            // 当天访问次数
            visitsFrequencyNum:undefined
        }
    },
    created() {
        this.getCurrentTime();
        this.getUserNum();
        this.getfrequency();
    },
    mounted() {
        this.timer = setInterval(this.getCurrentTime, 1000);
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        goBack() {
            window.history.go(-1);
        },
        getCurrentTime(){
            let date = new Date();
            let year = date.getFullYear();
            let month = (date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : (date.getMonth()+1));
            let day = (date.getDate()<10) ? "0"+date.getDate() : date.getDate() ;
            let hour = (date.getHours()<10) ? "0"+date.getHours() : date.getHours();
            let minute = (date.getMinutes()<10) ? "0"+date.getMinutes() : date.getMinutes();
            let second = (date.getSeconds()<10) ? "0"+date.getSeconds() : date.getSeconds();
            this.currentTime = year + "年" + month + "月" + day + "日 " + hour + ":" + minute + ":" + second;
        },

        // 获取用户数量frequency
    getUserNum() {
      amountoFusers().then((response) => {
        this.isIdentityUserNum=response.data.isIdentityUserNum;
        this.registerUserNum=response.data.registerUserNum
        }
      );
    },
      getfrequency() {
      frequency().then((response) => {
        this.visitsPeopleNum=response.data.visitsPeopleNum;
        this.visitsFrequencyNum=response.data.visitsFrequencyNum
        }
      );
    },
    }
}
</script>
<style lang="scss" scoped>
.monitor-container {
    width: 100%;
    height: 100vh;
    background-image: url(../../../assets/monitor/bg.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.monitor-header {
    width: 100%;
    height: 8vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-image: url(../../../assets/monitor/headerTitleImg.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.monitor-header-left {
    width: 30%;
    height: 8vh;
    padding: 10px;
}
.monitor-header-button {
    background:transparent;
    color: rgba(54,163,255,1);
    border: 0.5px dashed rgba(54,163,255,1);
}
.monitor-header-middle {
    width: 40%;
    height: 8vh;
    display: flex;
    flex-direction: column;
    line-height: 6vh;
    align-items: center;
    background-image: url(../../../assets/monitor/headerTitle.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.monitor-header-title {
    font-size: 30px;
    font-weight: 1000;
    font-family: "FZCQK--GBK1-0",Georgia;
    color: #FFFFFF;
    letter-spacing: 5px;
    cursor:pointer;
    background-image: linear-gradient(to bottom, rgba(255,255,255,1), rgba(54,163,255,1), rgba(96,255,249,1));
    -webkit-background-clip:text; 
    -webkit-text-fill-color:transparent;
}
.monitor-header-right {
    width: 30%;
    height: 8vh;
    display: flex;
    justify-content: flex-end;
    padding: 10px;
    font-size: 16px;
}
.monitor-header-right > span {
     margin: 5px 5px 0px 0px ;
    color: rgba(54,163,255,1);
}
.monitor-content {
    width: 100%;
    height: 92vh;
    display: flex;
    flex-direction: row;
    align-content: space-between;
}
// 两侧的布局
.monitor-content-between {
    width: 25%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-family: "PingFangSC-Medium";
    font-size: 16px;
    color: rgba(54,163,255,1);
    letter-spacing: 2px;
    text-align: center;
}
.content-between-layout {
    width: 100%;
    height: 40vh;
}
.between-layout {
    width: 100%;
    height: 28vh;
    background-image: url(../../../assets/monitor/cardBg.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.between-layout > div:first-child {
    // height: 30px;
    height: 15px;
    padding-top: 2px;
    background-image: url(../../../assets/monitor/cardTitle.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    font-size: 10px;
}
.content-charts{
    height: 100%;
}
// 中间的布局
.monitor-content-middle {
    width: 50%;
    height: 91vh;
    display: flex;
    justify-content: center;
}
.content-middle {
    width: 95%;
    height: 91vh;
}
.content-middle-top {
    height: 11vh;
    width: 100%;
    color: #FFFFFF;
}
.content-middle-register {
    height: 11vh;
    width: 95%;
    background-image: url(../../../assets/monitor/middle/registeredUser.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}
.content-middle-register > div {
    padding-top: 3px;
    padding-left: 40%;
    font-size: 12px;
}
.content-middle-register > div:first-child {
    font-size: 20px;
    color:rgba(1,196,249,1);
    font-weight: 700;
}
.content-middle-verified {
    height: 11vh;
    width: 95%;
    background-image: url(../../../assets/monitor/middle/verified.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}
.content-middle-verified > div {
    padding-top: 3px;
    padding-left: 40%;
    font-size: 12px;
}
.content-middle-verified > div:first-child {
    font-size: 20px;
    color:rgba(1,196,249,1);
    font-weight: 700;
}
.content-middle-number {
    height: 11vh;
    width: 95%;
    background-image: url(../../../assets/monitor/middle/personNum.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}
.content-middle-number > div {
    padding-top: 3px;
    padding-left: 40%;
    font-size: 12px;
}
.content-middle-number > div:first-child {
    font-size: 20px;
    color:rgba(1,196,249,1);
    font-weight: 700;
}
.content-middle-times {
    height: 11vh;
    background-image: url(../../../assets/monitor/middle/numberTimes.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}
.content-middle-times > div {
    padding-top: 3px;
    padding-left: 40%;
    font-size: 12px;
}
.content-middle-times > div:first-child {
    font-size: 20px;
    color:rgba(1,196,249,1);
    font-weight: 700;
}
.content-middle-bottom {
    width: 100%;
    height: 79vh;
    margin-top: 1vh;
}
</style>