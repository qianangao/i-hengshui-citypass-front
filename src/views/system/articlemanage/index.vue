<template>
  <div class="app-container">
    <div  v-if="this.ly==0">
    <!-- 搜索框 -->
     <el-row class="el-center" :gutter="15">
      <!-- 用户查询条件 -->
      <el-form :model="queryParams" ref="queryForm" :inline="false" v-show="showSearch">
          <el-col :span="6">
            <el-form-item label="文章标题" prop="articleName">
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
      <el-table-column label="文章标题" :show-overflow-tooltip="true"  align="center" prop="title" />
      <el-table-column label="是否是banner" :formatter="articleBanner"  align="center" prop="ifBanner" /> 
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
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width" >
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:articlemanage:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:articlemanage:remove']">删除</el-button>
          <el-button size="mini" type="text" icon="el-icon-view" v-if="scope.row.url==''" @click="handleLook(scope.row)">查看</el-button>
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
            <el-form-item label="文章标题" prop="title">
              <el-input v-model="form.title" :disabled="this.disabled" maxlength="150" placeholder="请输入标题"/>
            </el-form-item>
            </el-col>
          </el-row> 
          <el-row>
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
          </el-row>
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
                  <img v-if="imageUrl" :src="imageUrl" class="avatarImg">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                   <div slot="tip" class="el-upload__tip">只能上传jpg/png/jpeg格式的缩略图，且不超过5MB!</div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="文章内容" v-if="form.ifLink!==0">
                <vue-ueditor-wrap v-if="form.ifLink!==0"  @addListener="addListener" v-model="form.content"  :initialStyle="config.initialStyle" :customstyle="config.customstyle" :config="config" :toolbars="config.toolbars" ></vue-ueditor-wrap>
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
import VueUeditorWrap from 'vue-ueditor-wrap';
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
 
export default {
  // 2、注册组件
  components: {
    // Editor,
    // UEditor,
    VueUeditorWrap
  },

  data() {
    return {
     rules: {
        title: [
          { required: true, message: "文章标题不能为空", trigger: "blur" },
        ],
        ifBanner:[
          { required: true, message: "是否为轮播不能为空", trigger: "blur" },
        ],
        ifLink:[
            { required: true, message: "是否为链接不能为空", trigger: "blur" },
        ],
         pic:[
            { required: true, message: "请上传图片" },
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
      config: {
        zIndex : 1,
        initialStyle:'p{font-size:28px}' ,
        fontsize:[
             28,
             38,
             48,
             58,
             68
        ],
          //可以在此处定义工具栏的内容
          toolbars: [
           [
        'undo', //撤销
        'redo', //重做
        'bold', //加粗
        'indent', //首行缩进
        'italic', //斜体
        'underline', //下划线
        'strikethrough', //删除线
        'subscript', //下标
        'fontborder', //字符边框
        'superscript', //上标
        'formatmatch', //格式刷
        'source', //源代码
        'blockquote', //引用
        'pasteplain', //纯文本粘贴模式
        'selectall', //全选
        'horizontal', //分隔线
        'removeformat', //清除格式
        'time', //时间
        'date', //日期
        'unlink', //取消链接
        'cleardoc', //清空文档
        'insertcode', //代码语言
        'fontfamily', //字体
        'fontsize', //字号
        'paragraph', //段落格式
        'simpleupload', //单图上传
        'insertimage', //多图上传
        'imagecenter', //图片居中
        'link', //超链接
        'spechars', //特殊字符
        'searchreplace', //查询替换
        'map', //Baidu地图
        'insertvideo', //视频
        'justifyleft', //居左对齐
        'justifyright', //居右对齐
        'justifycenter', //居中对齐
        'justifyjustify', //两端对齐
        'forecolor', //字体颜色
        'rowspacingtop', //段前距
        'rowspacingbottom', //段后距
        'pagebreak', //分页
        'attachment', //附件
        'lineheight', //行间距
        'edittip ', //编辑提示
        'customstyle', //自定义标题
        'autotypeset', //自动排版
        'touppercase', //字母大写
        'tolowercase', //字母小写
           ]
          ],
          readonly:false,
          autoFloatEnabled :false,
          autoHeightEnabled: false,      // 编辑器不自动被内容撑高
          initialContent:'请输入内容',    //初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
          autoClearinitialContent:true,  //是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
          initialFrameWidth: null,       // 初始容器宽度
          initialFrameHeight: 300,       // 初始容器高度
          BaseUrl: '',
          UEDITOR_HOME_URL: process.env.BASE_URL + 'ueditor/',   // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况
          // UEDITOR_HOME_URL: process.env.BASE_URL + 'static/ueditor/',   // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况
          // VUE CLI 3 会添加 process.env.BASE_URL 的环境变量，而 VUE CLI 2 没有，所以借此设置 UEDITOR_HOME_URL，能涵盖大部分 Vue 开发者的使用场景
          // UEDITOR_HOME_URL: process.env.BASE_URL ? process.env.BASE_URL + 'ueditor/' : 'static/ueditor/',
          // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
          // serverUrl: 'http://35.201.165.105:8000/controller.php',
          // serverUrl:  'http://10.92.119.10:8081/ueditor/exec',
        },
    };
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
    
     //监听富文本setContent
     addListener(editorInstance) {
      //  editorInstance.execCommand("fontsize","36px");
        // editorInstance.setContent('')
        editorInstance.setContent();
   },
     getUEContent() { // 获取内容方法
        return this.editor.getContent()
      },
  
    //获取富文本文档内容
    // getContent(){
    //   let content = this.$refs.ueditor.getUEContent();
    //   this.form.content = content;
    //   console.log(content);
    // },

    // 切换是否为链接让输入框为空
    agreeChange(){
       this.form.content="";
       this.form.url="";
    },
    // 表格格式化数据
    articleBanner(row, column){
      let ifBanner=row.ifBanner;
      if(ifBanner==0){
        return "是"
      }else{
        return "否"
      }
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
        ifBanner: 1,
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
      listArticle(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
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
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isPNG) {
          this.$message.error('只能上传图片格式文件!');
        }
        if (!isLt5M) {
          this.$message.error('上传5头像图片大小不能超过 5MB!');
        }
        return isPNG||isJPG &&isLt5M;
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
      this.title = "新增文章";
      this.config.initialContent="请输入内容";
      this.config.autoClearinitialContent=true;
      this.submitButton=1;
      this.disabled=false;
      this.config.readonly=false;
      this.ly=1
    },
    
    // 查看
    handleLook(row){
      this.updataHandleReset();
      const id = row.id || this.id;
      getArticle(id).then((response) => {
        if(response.code==200){
        this.config.autoClearinitialContent=false;
        this.config.initialContent=response.data.content;
        this.imageUrl= this.address + response.data.pic;
        this.form = response.data;
        this.form.ifBanner = Number(response.data.ifBanner);
        this.form.ifLink = Number(response.data.ifLink);
        this.form.msgType = Number(response.data.msgType);
        this.title = "查看文章";
        this.submitButton=0;
        this.disabled=true;
        this.config.readonly=true;
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
        this.config.autoClearinitialContent=false;
        this.config.initialContent=response.data.content;
        this.imageUrl= this.address + response.data.pic;
        this.form = response.data;
        this.form.ifBanner = Number(response.data.ifBanner);
        this.form.ifLink = Number(response.data.ifLink);
        this.form.msgType = Number(response.data.msgType);
        this.title = "修改文章";
        this.submitButton=1;
        this.disabled=false;
        this.config.readonly=false;
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
        '确认删除该文章？',
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


 
</style>
<style>
.el-tooltip__popper{font-size: 14px; max-width:40%;word-wrap:break-word;}
.operating{
  float: right;
  margin: 10px 10px;
}
#edui1_imagescale{display:none !important;}
</style>
