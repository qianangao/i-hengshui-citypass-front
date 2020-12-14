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
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
              <el-button  icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!-- 文章表格数据 -->
      <el-table class="articlerForm" :data="articleList">
        <el-table-column label="用户名" align="center" prop="userName" :show-overflow-tooltip="true"/>
        <el-table-column label="手机号" align="center" prop="phone"/>
        <el-table-column label="创建时间" align="center" prop="createTime">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="updateTime" align="center">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最近登录时间" align="center" prop="loginTime">
            <template slot-scope="scope">
            <span>{{ parseTime(scope.row.loginTime) }}</span>
            </template>
        </el-table-column>
        <!-- <el-table-column label="终端类型" align="center" prop="terminal" /> -->
      </el-table>
       <!-- 分页器 -->
     <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"  @pagination="getList"/>
  </div>
</template>

<script>
import {appUserList} from "@/api/app/user";
import {Decrypt,decrypt} from "@/utils/aes/security.js";

export default {
  data(){
    return {
      // 总条数
      total: 0,
      articleList: [],   
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
      },
      showSearch: true,
    }
  },
  created(){
    this.getList()
  },
  methods:{
   getList() {
      this.loading = true;
      appUserList(this.queryParams).then((response) => {
      
     
         var appUserInfo= JSON.parse(Decrypt(response.data))
         console.log(appUserInfo)
         this.articleList=appUserInfo.data.rows;
         this.total = appUserInfo.data.total;
         this.loading = false;
        }
      );
    },
     // 查询按钮
    handleQuery(){
      this.queryParams.page = 1;
      this.getList();
    },
      /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.title = undefined;
      this.resetForm("queryForm");
      this.handleQuery();
    },
  }
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