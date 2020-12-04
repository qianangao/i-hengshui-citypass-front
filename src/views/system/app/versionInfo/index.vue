<template>
  <div class="app-container">
    <el-row class="el-center" :gutter="15">
      <!-- 版本查询条件 -->
      <el-form :model="queryParams" ref="queryForm">
        <el-col :span="6">
          <el-form-item label="版本类型" prop="appType">
            <el-input  placeholder="请输入版本类型" v-model="queryParams.appType" clearable size="small" class="versionInfo"/>
          </el-form-item>
        </el-col>
         <el-col :span="8">
          <el-form-item label="创建时间">
             <el-date-picker
                v-model="dateRange"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 240px"
                size="small"
                >
              </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item>
              <el-button type="cyan" icon="el-icon-search" size="mini" v-hasPermi="['system:app:versionInfo:query']" @click="handleQuery">查询</el-button>
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
     <!-- 版本表格数据展示 -->
       <el-table  v-loading="loading" :data="versionList" row-key="id">
        <el-table-column label="app名称" prop="appName" align="center" />
        <el-table-column label="创建时间" prop="createTime" align="center">
            <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
        </el-table-column>
        <el-table-column label="设备" prop="appType" align="center" />
        <el-table-column label="APP包大小" prop="pkSize" align="center" />
        <el-table-column label="下载地址"  prop="appId" align="center" />
        <el-table-column label="操作" class-name="small-padding fixed-width" align="center">
            <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-plus" @click="handleShow(scope.row)">查看</el-button>
                <el-button size="mini" type="text" icon="el-icon-plus" v-hasPermi="['system:versionInfo:remove']" @click="handleDelete(scope.row)">删除</el-button>
            </template>
        </el-table-column>
     </el-table>
     <!-- 添加新版本信息 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" :close-on-press-escape="false" :close-on-click-modal="false"  :before-close='closeDialog'>
      <el-form ref="form" :model="form" label-width="90px">
          <el-row>
            <el-col :span="24">
                <el-form-item label="上传文件" v-if="this.title=='添加版本'" >
                   
                           <el-upload
                              class="upload-demo"    
                              ref="upload"
                              :limit="1"
                              :action="url"
                              :on-change="handleChange"
                              :file-list="fileList"
                              :on-remove="handleRemove"
                              :headers="headers"
                              multiple
                              drag>
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip">只能上传akp/ipa文件，且不超过300M</div>
                          </el-upload>
                </el-form-item>
                <el-form-item label="文件名" v-if="this.title=='查看版本'">
                  <el-input :disabled="true" v-model="form.uploadFileName"/>
                </el-form-item>
            </el-col>
          </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="版本大小" >
              <el-input :disabled="true" v-model="form.pkSize" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="版本名称">
              <el-input :disabled="true" v-model="form.versionName"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="版本内容" >
              <el-input type="textarea" placeholder="请输入版本内容" v-model="form.content" :rows="3"  maxlength='500'></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="this.title!=='查看版本'" @click="submitForm">确 定</el-button>
        <el-button @click="cancel" >取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getToken} from '@/utils/auth';
import { versionTable, addVersion, uploadFile, delVersion, getFrom, closeButton } from "@/api/app/versionInfo";
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
      // 文件上传格式刷
      headers: { Authorization: "Bearer " + getToken() },
      // 文件上传地址
      url: process.env.VUE_APP_BASE_API + "/system/sys/app/version/record/upload",
      // 查询参数
      queryParams: {
        appType: undefined
      },
      // 上传图标
      form: {},
      // 上传信息
      fileList: [],
      // 日期范围
      dateRange:[],
      
    }
  },
  created(){
    // 获取版本列表
    this.getList();
  },
  methods:{
    // 查询版本列表 
    getList() {
      this.loading = true;
      this.queryParams["startTime"]= this.dateRange[0];
      this.queryParams["endTime"]= this.dateRange[1];
      versionTable(this.queryParams).then((response) => {
        this.versionList = response.data.rows,
        this.loading = false;
      }).catch( ()=>{});
    },
    // 表单重置
    reset() {
      this.form = {
        content:undefined,
        createTime:undefined,
        createdBy:undefined,
        versionName:undefined,
        pkSize:undefined,
        appId:undefined,
        appName:undefined,
        appType:undefined,
        fileName:undefined,
        uploadFileName:undefined,
         // this.form.versionName = item.response.data.versionName;
            // this.form.pkSize = item.response.data.pkSize;
            // this.form.appId = item.response.data.appId;
            // this.form.appName = item.response.data.appName;
            // this.form.appType = item.response.data.appType;
            // this.form.fileName = item.response.data.fileName;
            // this.form.uploadFileName = item.response.data.uploadFileName;
      };
      this.fileList=[];
      this.resetForm("form");
    },
      //新增按钮操作 
      handleAdd() {
        this.title = "添加版本";
        this.open = true;
        this.reset();
      },
       //关闭弹框的事件
        closeDialog(done){
          // 根据id判断是否为新增 如果是新增版本，点击关闭按钮，调用删除操作
          if(!this.form.id && this.form.uploadFileName){
              closeButton({"filePath":this.form.uploadFileName}).then( (response)=>{
              }).catch( ()=>{});
          }
          done()
        },
      //文件上传中处理
      handleChange(file, fileList) {
        this.reset();
        this.fileList = fileList;
        fileList.map(item => {
          if(item.response){
            this.form = item.response.data;
            // this.form.versionName = item.response.data.versionName;
            // this.form.pkSize = item.response.data.pkSize;
            // this.form.appId = item.response.data.appId;
            // this.form.appName = item.response.data.appName;
            // this.form.appType = item.response.data.appType;
            // this.form.fileName = item.response.data.fileName;
            // this.form.uploadFileName = item.response.data.uploadFileName;
          }
        })
      },
    //提交按钮 
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if(this.fileList){
          addVersion(this.form).then((response)=>{
                this.loading = false;
                this.getList();
                this.open = false;
          }).catch( ()=>{});
        }else{
          this.$message.error('请上传文件');
        }
      })
    },
    // 取消按钮
    cancel() {
      // 根据id判断是否为新增 如果是新增版本，点击关闭按钮，调用删除操作
      if(this.title === '添加版本' && this.form.uploadFileName){
        closeButton({"filePath":this.form.uploadFileName}).then( (response)=>{
        }).catch( ()=>{})
      }
      this.open = false;
      this.reset()
    },
    // 点击×时候的操作
     handleRemove(file, fileList) {
          if(this.title === '添加版本' && this.form.uploadFileName){
              closeButton({"filePath":this.form.uploadFileName}).then( (response)=>{
              }).catch( ()=>{})
          }
          this.reset()
     },
    // 搜索按钮操作
    handleQuery() {
      this.getList();
    },
    // 重置按钮操作 
    resetQuery() {
      this.queryParams.appType=undefined;
      this.dateRange = [];
      this.handleQuery();
    },
  // 查看操作按钮
    handleShow(row){
      this.open = true;
      this.title ="查看版本"
      getFrom(row.id).then(response =>{
        this.form = response.data;
        const file = {"name":response.data.uploadFileName,"url":response.data.appId}
        this.fileList.push(file)
      })
    },
    // 删除按钮操作
    handleDelete(row) {
      const id = row.id;
      this.$confirm(
        '是否确认删除用户编号为"' + id + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(function () {
        return delVersion(id);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch( ()=>{});
    }
  }
}
</script>
<style>
.versionInfo{
    width: 70%;
}
</style>