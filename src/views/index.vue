<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="7" :xs="24">
        <el-card class="boxCard">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user"/><span class="personInfo">用户名称</span>
                <div class="pull-right">{{ user.userName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone"/><span class="personInfo">手机号码</span>
                <div class="pull-right">{{ user.phone }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email"/><span class="personInfo">用户邮箱</span>
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="tree"/><span class="personInfo">所属部门</span>
                <div class="pull-right" v-if="user.deptName">{{ user.deptName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples"/><span class="personInfo">所属角色</span>
                <div class="pull-right">{{ roleGroup }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date"/><span class="personInfo">创建日期</span>
                <div class="pull-right">{{ user.createTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="17" :xs="24">
        <el-card class="boxCard">
          <div slot="header" class="clearfix">
            <span>个人资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from "./system/usermanage/profile/userAvatar";
import userInfo from "./system/usermanage/profile/userInfo";
import resetPwd from "./system/usermanage/profile/resetPwd";
import { getUserProfile } from "@/api/system/user";

export default {
  name: "Profile",
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      open:false,
      user: {},
      roleGroup: {},
      postGroup: {},
      activeTab: "userinfo"
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data;
        this.roleGroup = response.roleGroup;
        this.postGroup = response.postGroup;
      });
    },
  }
};
</script>
<style scoped>
.personInfo {
  margin-left: 10px;
}
/* .boxCard {
  height: 75vh;
} */
</style>

