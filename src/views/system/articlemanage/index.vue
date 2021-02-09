<template>
  <div class="app-container">
    <div  v-if="this.ly==0">
    <!-- 搜索框 -->
     <el-row class="el-center" :gutter="15">
      <!-- 用户查询条件 -->
      <el-form :model="queryParams" ref="queryForm" :inline="false" v-show="showSearch" @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="标题" prop="articleName">
              <el-input class="inputQuery" v-model="queryParams.title" placeholder="请输入标题" clearable size="small"/>
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
    <!-- 新增按钮 -->
    <el-row :gutter="10" class="addBut" >
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus"  size="small " @click="Addsubmi"  v-hasPermi="['system:articlemanage:add']">新增</el-button >
      </el-col>
    </el-row>
    <!-- 文章表格数据 -->
    <el-table class="articlerForm" :data="articleList">
      <el-table-column label="编号" align="center">
        <template slot-scope="scope">
          <span >{{scope.$index+(queryParams.pageNum - 1) * queryParams.pageSize + 1}} </span>
         
        </template>
      </el-table-column>
      <el-table-column label="标题" :show-overflow-tooltip="true"  align="center" prop="title" />
      <!-- <el-table-column label="是否是banner" :formatter="articleBanner"  align="center" prop="ifBanner" />  -->
      <el-table-column label="链接 " align="center"  prop="url"   :show-overflow-tooltip="true"/>
      <el-table-column align="center" label="缩略图" >
        <template slot-scope="scope">
          <el-popover placement="right" title="" trigger="hover" >
            <img style="margin-left: 10px" :src="address+scope.row.pic" class="imgSlotHover" />
            <img slot="reference" :src="address+scope.row.pic" :alt="scope.row.pic" class="imgSlot" >
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="创建时间"   align="center" prop="createTime" :show-overflow-tooltip="true" />
       <el-table-column label="修改时间"   align="center" prop="updateTime" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width" v-if="checkPermi(['system:articlemanage:edit', 'system:articlemanage:remove','system:articlemanage:look'])">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:articlemanage:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:articlemanage:remove']">删除</el-button>
          <el-button size="mini" type="text" icon="el-icon-view" v-if="scope.row.url==''" @click="handleLook(scope.row)" v-hasPermi="['system:articlemanage:look']" >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"  @pagination="getList"/>
  </div>
    <div v-if="this.ly==1" >
            <el-form ref="form" :model="form" :rules="rules"   label-width="120px" >
             <h4 v-cloak>{{title}}</h4>
          <el-row>
            <el-col :span="22">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" :disabled="this.disabled" maxlength="150" placeholder="请输入标题"/>
            </el-form-item>
            </el-col>
          </el-row> 
          <!-- <el-row>
           <el-col :span="22">
            <el-form-item label="是否banner" prop="ifBanner">
              <el-radio-group v-model="form.ifBanner" :disabled="this.disabled">
                  <el-radio v-for="dict in dictionaryBanner"
                    :key="dict.dictSort"
                    :label="dict.dictSort">
                    {{ dict.dictLabel }}
                  </el-radio>
              </el-radio-group>
            </el-form-item>
            </el-col>
          </el-row> -->
          <el-row>
            <el-col :span="22">
              <el-form-item label="是否为链接" prop="ifLink">
                <el-radio-group v-model="form.ifLink"  @change="agreeChange" :disabled="this.disabled">
                  <el-radio v-for="dict in dictionaryLink"
                    :key="dict.dictSort"
                    :label="dict.dictSort">
                    {{ dict.dictLabel }}
                  </el-radio>
              </el-radio-group>
            </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="网址链接" prop="url" v-if="form.ifLink === 0">
                  <el-input v-model="form.url" placeholder="请输入链接" :disabled="this.disabled"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="图片上传" prop="pic" ref="image">
                <el-upload class="avatar-uploader" 
                  :action="url" 
                  :disabled="this.disabled"
                  :headers="headers"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :on-success="handlePreview"
                  :on-error="handlEerror">
                  <!-- <div slot="tip" class="scti"><p>建议上传</p><p>大图分辨率：750*252</p><p>图片分辨率：70*60</p></div> -->
                  <img v-if="imageUrl" :src="imageUrl" class="avatarImg">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png/jpeg格式的缩略图,且不超过20MB!</div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="文章内容" v-if="form.ifLink!==0">
                <!-- <vue-ueditor-wrap v-if="form.ifLink!==0"  @addListener="addListener" v-model="form.content"  :initialStyle="config.initialStyle" :customstyle="config.customstyle" :config="config" :toolbars="config.toolbars" ></vue-ueditor-wrap> -->
              <quill-editor ref="myQuillEditor" :disabled="this.disabled" v-model="form.content" :options="editorOption"  @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)" /> 
              </el-form-item>
            </el-col>
          </el-row>
      </el-form>
      <!-- 模态框操作 -->
     
          <el-button class="operating" @click="handleCancel">取 消</el-button>
          
          <el-button  class="operating"  type="primary" v-if=" this.submitButton!==0"  @click="oksubmi" >确认</el-button>
    
    </div>
   </div>
   
</template>

<script>

// import Editor from "@/components/Editor";
import { getToken } from "@/utils/auth";
// 1、引入UEditor组件
// import UEditor from '@/components/Ueditor/ueditor.vue';
// import VueUeditorWrap from 'vue-ueditor-wrap';
import { quillEditor,Quill } from 'vue-quill-editor'
import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module'
Quill.register('modules/ImageExtend', ImageExtend)
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数
// 从全局工具类引入全局地址变量
import settings from "@/settings.js";
import {
  listArticle,
  addArticle,
  getArticle,
  updateArticle,
  delArticle,
  uploadAvatar,
} from "@/api/system/article";
 // 工具栏配置

export default {
  // 2、注册组件
  components: {
    // VueUeditorWrap
    quillEditor
  },

  data() {
    var valiIcon = (rule, value, callback) => {
      // 图片验证
      if (!this.form.pic) { 
        callback(new Error("请上传图片"));
      } else {
        callback();
      }}
    return {
     editorOption: {
        placeholder: "请输入内容",
        modules: {
          ImageExtend: {
            loading: true,
            name:'file',
             methods: 'post',  // 必填参数 图片上传方式
            action:process.env.VUE_APP_BASE_API+ `/file/ftpUpload`,
            response: res => {
              return this.address+res.data;
            },
                headers: (xhr) => {
                //关键是这句话
                   xhr.setRequestHeader('Authorization', "Bearer " + getToken());
                                return xhr
               //    Authorization:localStorage.getItem("sessionKey")
               },
               
            //  // 可选参数 设置请求头部
            // sizeError: () => {
            //   return this.$message.error("图片超过50kb");
            // } // 图片超过大小的回调
          },
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"], // 加粗，斜体，下划线，删除线
              ["blockquote", "code-block"], //引用，代码块
              [{ header: 1 }, { header: 2 }], // 几级标题
              [{ list: "ordered" }, { list: "bullet" }], // 有序列表，无序列表
              [{ script: "sub" }, { script: "super" }], // 下角标，上角标
              [{ indent: "-1" }, { indent: "+1" }], // 缩进
              [{ direction: "rtl" }], // 文字输入方向
              [{ size: ["small", false, "large", "huge"] }], // 字体大小
              [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
              [{ color: [] }, { background: [] }], // 颜色选择
              [{ font: [] }], // 字体
              [{ align: [] }], // 居中
              ["link", "image"],
              ["clean"]
            ],
            handlers: {
              image: function() {
                QuillWatch.emit(this.quill.id);
              }
            }
          }
        }
      },
      //  uniqueId: "uniqueId",
      //   editorOption: {
      //   //  富文本编辑器配置
      //   modules: {
      //     toolbar: toolbarOptions
      //   },
      //   theme: "snow",
      //   placeholder: "请输入正文"
      // },
     rules: {
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" },
        ],
        // ifBanner:[
        //   { required: true, message: "是否为轮播不能为空", trigger: "blur" },
        // ],
        ifLink:[
            { required: true, message: "是否为链接不能为空", trigger: "blur" },
        ],
         pic:[
            { required: true,validator: valiIcon  },
        ],
        url:[
          { required: true, message: "链接不能为空", trigger: "blur" },
          { pattern: /(http|https):\/\/([\w.]+\/?)\S*/,
            message: "请正确输入以http或https开头的网址",
            trigger: ["blur", "change"]
            }
        ],
      },
      // 是否显示弹出层
      ly:0,
      // 全局地址变量
       address:settings.address,
      // 提交按钮状态
      submitButton:0,
      fileList:[],
      // 文件上传
        imageUrl: '',
      // 模态框标题
        title: "",
      // 文件上传格式刷
      headers: { Authorization: "Bearer " + getToken() },
      // 图片上传地址
      url: process.env.VUE_APP_BASE_API + "/file/ftpUpload",
      // 上传图片
      fileList: [],
      // 总条数
      total: 0,
      
      // 表单禁用
      disabled:false,
      // 文章表格数据
      articleList: null,
      // 表单模态框参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 文章类型字典
      aceType:[],
      // 项目是否链接
      dictionaryLink:[],
      // s是否轮播
      dictionaryBanner:[],
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {
        title:undefined,
        pageNum: 1,
        pageSize: 10,
        articleName: undefined,
      },
      // 3、v-model绑定数据 form.content
      // 4、根据项目需求自行配置,具体配置参见ueditor.config.js源码或 http://fex.baidu.com/ueditor/#start-start
    
    };
  },
   computed: {
    //当前富文本实例
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  created() {
    this.getList();
    // 类型字典
      this.getDicts("sc_msg_type").then((response) => {
      this.aceType = response.data;
    }),
     this.getList();
    // 类型字典
      this.getDicts("project_status").then((response) => {
      this.dictionaryLink = response.data;
      this.dictionaryBanner=response.data
    })
  },
  methods: {
     checkPermi,
    checkRole,
  //失去焦点事件
      onEditorBlur(quill) {
        // console.log('editor blur!', quill)
      }, 
      //获得焦点事件
      onEditorFocus(quill) {
        // console.log('editor focus!', quill)
      },
       // 准备富文本编辑器
      onEditorReady(quill) {
        // console.log('editor ready!', quill)
      },
      //内容改变事件
      onEditorChange({ quill, html, text }) {
        console.log('editor change!', quill, html, text)
        this.content = html
      },
    
    // 切换是否为链接让输入框为空
    agreeChange(){
       this.form.content="";
       this.form.url="";
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
    /** 添加表单重置 */
    addHandleReset() {
      this.form = {
        // 富文本框
        content: "",
        editorOption: {},
        // num: 999,
        // 是否首页轮播
        // ifBanner: 1,
        ifBanner: 0,
        // 是否外联
        ifLink: 0,
        // 弹出框单选按钮参数
        msgType:1 ,
      };
      this.imageUrl="";
      this.resetForm("form");
    },
    /** 编辑表单重置 */
    updataHandleReset() {
      this.form = {
        // 富文本框
        content: "",
        editorOption: {},
        // num: "",
        // 是否首页轮播
        ifBanner: 0,
        // 是否外联
        ifLink: 0,
        // 弹出框单选按钮参数
        msgType: 1,
      };
      this.resetForm("form"); 
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listArticle(this.addDateRange(this.queryParams, this.dateRange)).then((response) => {
      
          this.articleList = response.data.rows;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    // 图片上传

     handlePreview(file) {
      this.form.pic =  file.data;
      this.$refs.image.clearValidate()
      this.imageUrl =  this.address + file.data;
      if(file.code==200){
        this.$message.success("上传成功")
      }else{
         this.$message.error("上传失败");
      }
    },
     handlEerror(){
       this.$message.error("上传失败");
     },
      beforeAvatarUpload(file) {
        // 图片上传限制
       const isPNG = file.type === 'image/png'||file.type === 'image/jpeg' || file.type === 'image/jpg' ;
        const isLt20M = file.size / 1024 / 1024 < 20;
        if (!isPNG) {
          this.$message.error('只能上传jpg/png/jpeg格式文件!');
        }
        if (!isLt20M) {
          this.$message.error('上传头像图片大小不能超过20MB!');
        }
        return isPNG||isJPG &&isLt20M;
      },
      
    // 模态框确认按钮
    oksubmi() {
      this.ly=0
    },
    // 模态框取消按钮
    handleCancel(){
       this.addHandleReset()
       this.ly=0
    },
    // 新增文章按钮
    Addsubmi() {
      this.addHandleReset();
      this.title = "新增Banner";
      this.submitButton=1;
      this.disabled=false;
      // this.config.readonly=false;
      this.ly=1
    },
    
    // 查看
    handleLook(row){
      this.updataHandleReset();
      const id = row.id || this.id;
      getArticle(id).then((response) => {
        if(response.code==200){
        // this.config.autoClearinitialContent=false;
        // this.config.initialContent=response.data.content;
        this.imageUrl= this.address + response.data.pic;
        this.form = response.data;
        this.form.ifBanner = Number(response.data.ifBanner);
        this.form.ifLink = Number(response.data.ifLink);
        this.form.msgType = Number(response.data.msgType);
        this.title = "查看Banner";
        this.submitButton=0;
        this.disabled=true;
        // this.config.readonly=true;
        this.ly=1
        }else{
        this.$message.error(response.msg)
        this.ly=0
        }
  
      });
    },
    // 修改文章按钮
    handleUpdate(row) {
      this.updataHandleReset();
      const id = row.id || this.id;
      getArticle(id).then((response) => {
        if(response.code==200){
        // this.config.autoClearinitialContent=false;
        // this.config.initialContent=response.data.content;
        this.imageUrl= this.address + response.data.pic;
        this.form = response.data;
        this.form.ifBanner = Number(response.data.ifBanner);
        this.form.ifLink = Number(response.data.ifLink);
        this.form.msgType = Number(response.data.msgType);
        this.title = "修改Banner";
        this.submitButton=1;
        this.disabled=false;
        // this.config.readonly=false;
        this.ly=1
        }else{
        this.$message.error(response.msg)
        this.ly=0
        }
      });
    },
    // 模态框确认事件
    oksubmi() {
 
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id !== undefined) {
              updateArticle(this.form).then((response) => {
                if(response.code==200){
                  this.msgSuccess("修改成功");
                  this.ly=0;
                  this.getList(); 
                }else{
                  this.$message.error(response.msg)
                  this.ly=1;
                }

            });
          } else {
            addArticle(this.form).then((response) => {
              if(response.code==200){
                this.msgSuccess("新增成功");
                this.getList();
                this.ly=0
              }else{
                this.$message.error(response.msg)
                this.ly=1;
              }
              
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row){
      const userIds = row.id || this.ids;
      this.$confirm(
        '确认删除该Banner？',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(function () {
        return delArticle(userIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(() => {
        
      })
    },
  },
};
</script>

<style scoped lang="scss">
img {
  width: 80px;
  height: 80px;
}
.app-container,
.elCenter,
.articleCenter,
.articlerForm {
  width: 100%;
}
.modal {
  width: 300px;
}
.ql-editor {
  min-height: 80px;
}
.ql-editor p {
  min-height: 80px;
}
.imgSlotHover{
  width: 200px;
  height: 200px;
} 
.imgSlot{
  width: 80px;
  height: 80px;
} 
.avatar{
  width: 100%;
  height: 100%;
}
.avatar-uploader::v-deep .el-upload{
      width: 130px;
  height: 130px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 130px;
    height: 130px;
    line-height: 130px;
    text-align: center;
  }
  .avatarImg {
    width: 130px;
    height: 130px;
    display: block;
  }
  .dialogForm::v-deep .el-form-item__content{
    margin-left: 20px !important;
  }
  .inputQuery{
    width: 70%;
  }
  .addBut{
    margin-bottom: 10px;
  }
.scti{
  float: right;
  margin-right: 72%;
  margin-top: 10px;
}
.scti p{
  margin: -10px;
  padding: -10px;
  font-size: 12px;
  color: #606266;
}

 
</style>
<style>
.el-tooltip__popper{font-size: 14px; max-width:40%;word-wrap:break-word;}
.operating{
  float: right;
  margin: 10px 10px;
}
#edui1_imagescale{display:none !important;}
</style>
<style lang='scss' >
.editor {
  line-height: normal !important;
  height: 500px;
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}
 .ql-editor{
         height:300px;
     }
</style>