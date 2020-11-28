<template>
  <div class="app-container">
    <el-row class="el-center" :gutter="15">
      <!-- 文章查询条件 -->
      <el-form :model="queryParams" ref="queryForm">
        <el-col :span="6">
          <el-form-item label="用户名称" prop="userName">
            <el-input class="inputQuery" v-model="queryParams.userName" placeholder="请输入用户名称" clearable size="small"/>
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini">查询</el-button>
              <el-button  icon="el-icon-refresh" size="mini">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!-- 文章表格数据 -->
      <el-table class="articlerForm" :data="articleList">
        <el-table-column label="用户名" align="center" prop="userName"/>
        <el-table-column label="手机号" align="center" prop="phoneNumber" :show-overflow-tooltip="true"/>
        <el-table-column label="创建时间" align="center" prop="creationTime" :show-overflow-tooltip="true"/>
        <el-table-column label="修改时间" prop="changeTime" align="center"/>
        <el-table-column label="最近登录时间" align="center" prop="loginTime" width="120" />
        <el-table-column label="终端类型" align="center" prop="terminal" />
      </el-table>
  </div>
</template>

<script>
export default {
  data(){
    return {
      articleList: [
      {
        userName: "邵大帅哥",
        phoneNumber:"15109291806",
        creationTime: "2020-09-25 16:13:10",
        changeTime: "2019-01-03 17:03:56",
        loginTime: "2020-07-25 16:13:10",
        terminal:"android",
      },
      ],   
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        articleName: undefined,
      },
      showSearch: true,
    }
  },
}
</script>
<style>
.articlerForm {
  width: 100%;
}
.inputQuery{
  width: 70%;
}
</style>