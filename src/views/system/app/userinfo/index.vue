<template>
  <div class="app-container">
    <el-row class="elCenter" :gutter="20">
      <!-- 文章数据 -->
      <el-col class="articleCenter" :span="20" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          v-show="showSearch"
        >
          <!-- 查询框 -->
          <el-row>
            <el-col :span="8">
              <el-form-item label="用户名查询" prop="articleName">
                <el-input
                  class="inputQuery"
                  v-model="queryParams.articleName"
                  placeholder="请输入用户名"
                  clearable
                  size="small"
                />
              </el-form-item>
            </el-col>
            <el-col :span="13" >
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini"
                  >查询</el-button
                >
                 <el-button  icon="el-icon-refresh" size="mini"
                  >重置</el-button
                >
              </el-form-item>
            </el-col>
           
          </el-row>
          <!-- 文章表格数据 -->
     
   <el-table class="articlerForm" :data="articleList">
            <el-table-column
              label="用户名"
              align="center"
              prop="userName"
            />
            <el-table-column
              label="手机号"
              align="center"
              prop="phoneNumber"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="创建时间"
              align="center"
              prop="creationTime"
              :show-overflow-tooltip="true"
            />
            <el-table-column label="修改时间" prop="changeTime" align="center"/>
              
            
            <el-table-column
              label="最近登录时间 "
              align="center"
              prop="loginTime"
              width="120"
            />
            <el-table-column label="终端类型" align="center" prop="terminal" />

            <el-table-column
              label="操作"
              align="center"
              width="160"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button v-if="scope.row.userId !== 1" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">注销</el-button>
              </template>
            </el-table-column>
          </el-table>

  

         
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>


<script>
export default {
    data(){
        return {
            articleList: [
        {
          userName: "vffbr121221",
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
    methods: {
          /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      this.$confirm(
        '是否确认删除用户编号为"' + row.userName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(function() {
        return delUser(userIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      });
    },
    }
}
</script>

<style>
.app-container,
.elCenter,
.articleCenter,
.articlerForm {
  width: 100%;
}
</style>