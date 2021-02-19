<template>
  <div class="app-container">
    <el-row class="el-center" :gutter="15">
      <!-- 文章查询条件 -->
      <el-form :model="queryParams" ref="queryForm" @submit.native.prevent>
        <el-col :span="8">
          <el-form-item label="工程名称" prop="projectName">
            <el-input class="inputQuerys" v-model="queryParams.projectName" placeholder="请输入工程名称" clearable size="small"/>
          </el-form-item>
        </el-col>
     
        <el-col :span="8">
          <el-form-item label="施工时间" prop="dateRange">
            <el-date-picker
              class="inputQuery"
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
     
        <el-col :span="6">
          <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!-- 其他操作 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete">清空数据</el-button>
      </el-col>
    </el-row>
    <!-- 文章表格数据 -->
    <el-table class="articlerForm" :data="Traffic">
      <el-table-column label="序号" type="index" width="80" align="center">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" align="center" prop="projectName" :show-overflow-tooltip="true"/>
       <el-table-column label="施工地点" align="center" prop="constructSite" :show-overflow-tooltip="true"/>
      <el-table-column label="导入时间" width="180" prop="createTime" align="center">
        <!-- <template slot-scope="scope">
            <span>{{ parseTime(scope.row.importTime) }}</span>
        </template>-->
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" class="menuOptaion" width="160px" >
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"/>
    <el-dialog :title="upload.title" :visible.sync="upload.open" :close-on-press-escape="false" :close-on-click-modal="false" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".doc, .docx"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <!-- <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport"/>是否更新已经存在的用户数据
          <el-link class="templateDownload" type="info" @click="importTemplate">下载模板</el-link>
        </div>-->
        <div class="el-upload__tip" slot="tip">提示：仅允许导入“doc”或“docx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

      <!-- 点击查看  弹出的模态框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" :close-on-press-escape="false" :close-on-click-modal="false"  append-to-body>
      <el-form ref="form" :model="form"  label-width="90px">
        <el-row>
           <el-col :span="12">
            <el-form-item label="项目名称" prop="projectName">
              <el-input :disabled="true" v-model="showFrom.projectName"/>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="编号"  prop="publishDate">
              <el-input :disabled="true" v-model="showFrom.publishDate"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="施工地点"  prop="constructSite" :show-overflow-tooltip='true'>
               <el-input :disabled="true" v-model="showFrom.constructSite"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="disabled">
              <el-form-item label="导入时间"  v-if="disabled" prop="createTime">
                <el-input :disabled="true" v-model="showFrom.createTime"/>
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主要材料"  prop="mainMaterials">
                <el-input :disabled="true" v-model="showFrom.mainMaterials"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="材料供应"  prop="materialSupply">
                <el-input :disabled="true" v-model="showFrom.materialSupply"/>
            </el-form-item>
          </el-col>
              <el-col :span="12">
            <el-form-item label="主要机械"  prop="mainMachine">
                <el-input :disabled="true" v-model="showFrom.mainMachine"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="质检负责"  prop="qualityDirector">
                <el-input :disabled="true" v-model="showFrom.qualityDirector"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容" prop="content">
               <el-input  :disabled="disabled" type="textarea" v-model="showFrom.content" :rows="5" />
            </el-form-item>
          </el-col>
        </el-row>
      
      </el-form>
      <div slot="footer" class="dialog-footer">
       <el-button v-if="!disabled" type="primary" @click="submitForm()"  >上传</el-button>
        <el-button  @click="open = false">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { save, Empty,munlist,munxq } from "@/api/system/municipal";
export default {
  data() {
    return {
      disabled:false,
        // 查看from列表数据
      showFrom: {},
        disabled:false,
         form:{},
      fileList: [],
       title: "",
      open:false,
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/app/engineer/importData"
      },
      // 总条数
      // 列表数据
      Traffic: [],
      total: 0,
      articleList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectName: undefined,
        // threeLevelDir: undefined,
        //  dateRange: undefined
      },
      showSearch: true,
        //日期组件截至日期
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now(); //设置选择今天以及今天以前的日期
        }
      },
         // 创建时间
      dateRange: [],
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
            this.queryParams["publishStartDate"] = this.dateRange[0] + `00:00:00`;
            this.queryParams["publishEndDate"] = this.dateRange[1] + `23:59:59`;
        }
      } else {
        this.queryParams["publishStartDate"] = undefined;
        this.queryParams["publishEndDate"] = undefined;
     
      }
      munlist(this.queryParams).then(response => {
        this.total = response.data.total;
        this.Traffic = response.data.rows;
      });
    },
       /** 上传按钮 */
      submitForm() {
          save(this.showFrom).then( response =>{
            if(response.code===200){
            this.msgSuccess("上传成功");
             this.getList();
            this.open = false;
            }else{
            this.$message.error(response.msg)
            }
          }).catch( ()=>{})
      },
// 详情
handleUpdate(row){
this.open = true;
this.title="施工详情",
this.disabled=true
munxq(row.id).then(response =>{
 this.showFrom = response.data;
})

},
    // 查询按钮
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.title = undefined;
      this.queryParams.publishStartDate = undefined;
      this.queryParams.publishEndDate = undefined;
       this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 取消操作
    handleCancel() {
      this.open = false;
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "信息导入";
      this.upload.open = true;
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
      this.fileList = fileList;
      fileList.map(item => {
        if (item.response) {
          this.form = item.response.data;
        }
      });
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      // this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
          this.open = true;
          this.disabled=false
          this.title="工程保存"
        this.showFrom = fileList[0].response.data;
  
      this.getList();
    },
    submitFileForm() {
      this.$refs.upload.submit();
    },
    /** 删除按钮操作 */
    handleDelete() {
      this.$confirm("是否确认清除所有数据?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return Empty();
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    }
  }
};
</script>
<style scoped lang="scss">
.inputQuery {
  width: 70%;
}
.articlerForm {
  width: 100%;
}
.inputQuerys {
  width: 70%;
}
/deep/.select-down .el-select-dropdown__item:hover {
  width: 70% !important;
}
</style>