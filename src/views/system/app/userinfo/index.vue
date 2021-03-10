<template>
  <div class="app-container">
    <el-row class="el-center" :gutter="15">
      <!-- 文章查询条件 -->
      <el-form :model="queryParams" ref="queryForm" @submit.native.prevent>
        <el-row>
        <el-col :span="6">
          <el-form-item label='用户名'  prop="userName" class="nameclass">
             <label slot="label">&nbsp; 用&nbsp;户&nbsp;名&nbsp; &nbsp; &nbsp;</label>
            <el-input style="width: 72%;" v-model="queryParams.userName" placeholder="请输入用户名称" clearable size="small"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号" prop="phone">
            <el-input style="width: 70%;" v-model="queryParams.phone" placeholder="请输入手机号" clearable size="small"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态" prop="isIdentity">
            <el-select style="width: 70%;" popper-class="select-dow" v-model="queryParams.isIdentity" placeholder="请选择用户状态" clearable size="small">
              <el-option
                v-for="dict in statusOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建时间" prop="dateRange">
            <el-date-picker
              style="width: 70%;"
              v-model="dateRange"
              type="daterange"
              value-format="yyyy-MM-dd "
              range-separator="-"
              :picker-options="pickerOptions"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
            ></el-date-picker>
          </el-form-item>
        </el-col>
         </el-row>
          <el-row>
        <el-col :span="6">
          <el-form-item label="登录时间" prop="Logintime">
            <el-date-picker
              style="width: 70%;"
              v-model="Logintime"
              type="daterange"
              value-format="yyyy-MM-dd "
              range-separator="-"
              :picker-options="pickerOptions"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
         </el-row>
      </el-form>
    </el-row>
    <!-- 文章表格数据 -->
    <el-table
      class="articlerForm"
      :data="articleList"
      @sort-change="changeTableSort"
      :default-sort="{prop: 'updateTime', order: 'descending'}"
    >
      <el-table-column label="用户名" align="center" prop="userName" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.userName||scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" prop="phone" />
      <el-table-column label="是否实名" align="center" prop="isIdentity" :formatter="article" />
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updateTime" :sortable="'custom'" align="center">
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
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { appUserList } from "@/api/app/user";
import { Decrypt, decrypt } from "@/utils/aes/security.js";

export default {
  data() {
    return {
      statusOptions: [
        {
          value: "0",
          label: "已实名"
        },
        {
          value: "1",
          label: "未实名"
        }
      ],

      // 创建时间
      dateRange: [],
      // 登录时间
      Logintime: [],
      // 总条数
      total: 0,
      articleList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        isIdentity: undefined,
        phone: undefined,
        userName: undefined,
        isAsc: "desc",
        orderByColumn: "update_time"
      },
      showSearch: true,
      //日期组件截至日期
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now(); //设置选择今天以及今天以前的日期
        }
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      if (this.dateRange != null){
        if (this.dateRange.length > 0) {
            this.queryParams["createStartTime"] = this.dateRange[0] + `00:00:00`;
            this.queryParams["createEndTime"] = this.dateRange[1] + `23:59:59`;
        }
      } else {
        this.queryParams["createStartTime"] = undefined;
        this.queryParams["createEndTime"] = undefined;
     
      }
      if(this.Logintime!=null){
        if (this.Logintime.length > 0) {
          this.queryParams["loginStartTime"] = this.Logintime[0] + `00:00:00`;
          this.queryParams["loginEndTime"] = this.Logintime[1] + `23:59:59`;
        }
      }else {
        this.queryParams["loginStartTime"] = undefined;
        this.queryParams["loginEndTime"] = undefined;
      }

      appUserList(this.queryParams).then(response => {
        console.log(this.queryParams)
        var appUserInfo = JSON.parse(Decrypt(response.data));
        this.articleList = appUserInfo.rows;
        this.total = appUserInfo.total;
        this.loading = false;
      });
    },
    // 表格格式化数据
    article(row, column) {
      let isIdentity = row.isIdentity;
      if (isIdentity == 0) {
        return "已实名";
      } else {
        return "未实名";
      }
    },
    // 查询按钮
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.title = undefined;
      this.dateRange = [];
      this.Logintime = [];
       this.queryParams["createStartTime"] = undefined;
        this.queryParams["createEndTime"] = undefined;
      this.queryParams["loginStartTime"] = undefined;
      this.queryParams["loginEndTime"] = undefined;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 列表排序
    changeTableSort(k) {
      // console.log(k.prop)
      // console.log(k.order)
      if (k.order == "ascending") {
        this.queryParams.isAsc = "asc";
        this.getList();
      } else {
        this.queryParams.isAsc = "desc";
        this.getList();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.articlerForm {
  width: 100%;
}
.inputQuery {
  width: 70%;
}
/deep/.select-dow .el-select-dropdown__item:hover {
  width: 80% !important;
}
/deep/.select-dow .el-select-dropdown__item:hover{
     width: 70% !important;
  }
  
</style>