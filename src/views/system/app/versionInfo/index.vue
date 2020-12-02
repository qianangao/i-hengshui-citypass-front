<template>
  <div class="app-container">
    <el-row class="el-center" :gutter="15">
      <!-- 版本查询条件 -->
      <el-form :model="queryParams" ref="queryForm" v-show="showSearch">
        <el-col :span="6">
          <el-form-item label="app名称" prop="appName">
            <el-input  placeholder="请输入app名称" v-model="queryParams.appName" clearable size="small" class="versionInfo"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="版本号" prop="versionCode">
            <el-input  placeholder="请输入版本号" v-model="queryParams.versionCode" clearable size="small" class="versionInfo"/>
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
    <!-- 其他操作 -->
    <el-row :gutter="15" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus"  @click="handleAdd"  v-hasPermi="['system:app:versionInfo:add']" size="mini">新增版本</el-button>
      </el-col>
    </el-row>
     <!-- 版本表格数据 -->
       <el-table  v-loading="loading" :data="versionList" row-key="id">
        <el-table-column label="app名称" prop="appName" align="center"  :show-overflow-tooltip="true"/>
        <el-table-column label="版本号"  prop="versionCode" align="center" :show-overflow-tooltip="true"/>
        <el-table-column label="创建时间" prop="createTime" align="center">
            <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
        </el-table-column>
        <el-table-column label="设备" prop="appType" align="center" />
        <el-table-column label="APP包大小" prop="pkSize" align="center" />
        <el-table-column label="下载地址"  prop="appId" align="center" />
        <el-table-column label="操作" class-name="small-padding fixed-width" align="center">
            <template >
                <el-button size="mini" type="text" icon="el-icon-plus">删除</el-button>
            </template>
        </el-table-column>
     </el-table>
        <!-- 添加新版本信息 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
          <el-row>
            <el-col :span="22">
                <el-form-item label="上传文件">
                    <el-upload
                        ref="upload"
                        :limit="1"
                        accept=""
                        :headers="upload.headers"
                        :action="upload.url + '?updateSupport=' + upload.updateSupport"
                        :disabled="upload.isUploading"
                        :auto-upload="false"
                        :on-progress="handleFileUploadProgress"
                        drag>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                    </div>
                   </el-upload>
                </el-form-item>
            </el-col>
          </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="版本号">
              <el-input :disabled="true" v-model="form.versionCode"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="版本大小">
              <el-input :disabled="true" v-model="form.pkSize" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="版本名称">
              <el-input :disabled="true" v-model="form.versionName"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="下载地址">
              <el-input :disabled="true" v-model="form.menuName"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="升级内容" prop="content">
              <el-input type="textarea" placeholder="请输入升级内容" v-model="form.content" :rows="3"  maxlength='300'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { versionTable, addVersion, uploadFile } from "@/api/app/versionInfo";


export default {
  data(){
    return {
       // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 版本table数据
     versionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        menuName: undefined,
      },
      // 上传图标
      form: {},
      // 文件上传信息
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData",
        },
        //   表单校验
        rules:{
            content:[
                { min: 20, max: 150,message: "长度在20 到 150 个字符", trigger:[ 'blur', 'change'] }
            ]
        } ,
        // 查询参数
      queryParams: {
        versionCode: undefined,
        appName: undefined,
      },
     
    }
  },
  created(){
     // 获取版本列表
    this.getList();
    
  },
  methods:{
    //   查询版本列表 
    getList() {
      this.loading = true;
      versionTable().then((response) => {
        this.versionList = response.data.rows,
        this.loading = false
      });
    },
 
    //  新增按钮操作 
    handleAdd() {
        this.title = "添加新版本";
        this.open = true;

      },
    // 表单重置
    reset() {
      this.form = {
        appId:undefined,
        appName:undefined,
        appType:undefined,
        content:undefined,
        pkSize:undefined,
        versionCode:undefined,
        versionName:undefined
      };
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
        uploadFile(file).then( (response)=>{
                console.log("12345678",response)
         })
        console.log("file-----",file);
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {


      this.upload.open = false;
      this.$refs.upload.clearFiles();
      
    },
    //   提交按钮 
    submitForm() {
      this.$refs["form"].validate((valid) => {
          addVersion().then((response)=>{
                this.from = response.data.rows,
                this.loading = false
          }).catch( ()=>{})
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
    //   this.reset();
    },
        /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
        /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
  
  }
}
</script>
<style>
.versionInfo{
    width: 70%;
}
</style>