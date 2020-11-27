<template>
  <div class="app-container">
    <el-row class="elCenter" :gutter="20">
      <!-- 文章数据 -->
      <el-col class="articleCenter" :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" >
          <!-- 查询框 -->
          <el-row>
            <el-col :span="6">
              <el-form-item label="标题查询" prop="articleName">
                <el-input class="inputQuery" v-model="queryParams.title" placeholder="请输入标题" clearable size="small"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
                  >查询</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-col>
           
          </el-row>
          <el-row>
          <el-col :span="2">
              <el-button type="primary" icon="el-icon-plus"  size="small " @click="Addsubmi">新增文章</el-button >
            </el-col>
          </el-row>
          <!-- 文章表格数据 -->
          <el-table class="articlerForm" :data="articleList">
            <el-table-column label="文章类型"   align="center" prop="title" />
            <!-- <el-table-column label="文章编号" align="center" prop="id" /> -->
            <!-- <el-table-column label="文章类型" :formatter="articleType"  align="center" prop="msgType" /> -->
             <el-table-column label="是否在首页轮播" :formatter="articleBanner"  align="center" prop="ifBanner" /> 
            <el-table-column label="链接或富文本内容 " align="center"  prop="url"   :show-overflow-tooltip="true">
              <template slot-scope="scope">
              <div v-if="scope.row.content!==''||null||undefined" v-html="scope.row.content"></div>
              <div v-if="scope.row.url!==''||undefined||null" >{{scope.row.url}}</div>
            </template>
           </el-table-column>
            <el-table-column align="center" label="图片" >
              <template slot-scope="scope">
                  <el-popover placement="right" title="" trigger="hover" >
                 <img style="margin-left: 10px" :src="`http://10.92.119.10/${scope.row.pic}`" class="imgSlotHover" />
                 <img slot="reference" :src="`http://10.92.119.10/${scope.row.pic}`" :alt="scope.row.pic" class="imgSlot" >
                </el-popover>
              </template>
            </el-table-column>
             <!-- <el-table-column label="头像" align="center" height="10px">
             <template slot-scope="scope">
             <el-popover placement="right" title="" trigger="hover">
             <img :src="scope.row.image_url" />
             <img slot="reference" :src="scope.row.image_url" :alt="scope.row.image_url" style="max-height: 50px;max-width: 130px">
             </el-popover>
             </template>
             </el-table-column> -->
            <!-- <el-table-column
              label="创建日期 "
              align="center"
              prop="createTime"
              width="120"
            /> -->
            <!-- <el-table-column label="权重" align="center" prop="Weights" /> -->

            <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width" >
              <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:article:list']">修改</el-button>
                <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"  @pagination="getList"/>
          <!-- 对话框 -->

          <el-dialog :visible.sync="open" :title="title" :close-on-press-escape="false" :close-on-click-modal="false"  width="600px">
            <el-form ref="form" :model="form" :rules="rules" class="dialogForm"  label-width="125px">
              <!-- <el-row>
                <el-col :span="24">
                  <el-form-item label="类别：">
                    <el-radio-group v-model="form.msgType">
                      <el-radio
                  v-for="dict in aceType"
                  :key="dict.dictSort"
                  :label="dict.dictSort"
                  >{{ dict.dictLabel }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row> -->
                   <el-row>
                  <el-form-item label="标题" prop="title">
                    <el-input  class="modal" v-model="form.title" placeholder="请输入标题"/>
                  </el-form-item>
                  </el-row> 
                  <el-row>
                    <el-form-item label="是否首页轮播" prop="ifBanner">
                    <el-radio-group v-model="form.ifBanner">
                      <el-radio
                     v-for="dict in dictionaryBanner"
                     :key="dict.dictSort"
                     :label="dict.dictSort">{{ dict.dictLabel }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  </el-row>
                   <el-row>
                  <el-form-item label="文章是否为链接:" prop="ifLink">
                    <el-radio-group v-model="form.ifLink">
                        <el-radio
                          v-for="dict in dictionaryLink"
                         :key="dict.dictSort"
                         :label="dict.dictSort">{{ dict.dictLabel }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
               </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="链接:" prop="url" v-if="form.ifLink === 0">
                    <el-input class="modal" v-model="form.url" placeholder="请输入链接"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- <el-row>
                <el-col class="num">
                  <el-form-item label="排序:">
                    <el-input-number
                      v-model="form.num"
                      controls-position="right"
                      :min="1"
                      :max="999" >
                      </el-input-number>
                  </el-form-item>
                </el-col>
              </el-row> -->
              <el-row>
                <el-col>
                 <el-form-item label="图片上传:">
                 <el-upload class="avatar-uploader" :action="url" :headers="headers" :show-file-list="false" :on-success="handlePreview" :on-error="handlEerror">
                 <img v-if="imageUrl" :src="imageUrl" class="avatar">
                 <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                 </el-upload>
                </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="form.ifLink !== 0">
                <Editor v-model="form.content"  :min-height="80" />
              </el-row>
            </el-form>
              <div slot="footer" class="dialog-footer">
                  <el-button type="primary"  @click="oksubmi">确认</el-button>
                  <el-button @click="handleCancel">取 消</el-button>
               </div>
          </el-dialog>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Editor from "@/components/Editor";
import { getToken } from "@/utils/auth";
import {
  listArticle,
  addArticle,
  getArticle,
  updateArticle,
  delArticle,
  uploadAvatar,
} from "@/api/system/article";
export default {
  components: {
    Editor,
  },

  data() {
    return {
     rules: {
        title: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
        ],
        ifBanner:[
          { required: true, message: "是否为轮播不能为空", trigger: "blur" },
        ],
        ifLink:[
            { required: true, message: "是否为链接不能为空", trigger: "blur" },
        ],
        url:[
          { required: true, message: "链接不能为空", trigger: "blur" },
        ],
      },
      // 文件上传
        imageUrl: '',
      // 模态框标题
        title: "",
      // 文件上传格式刷
      headers: { Authorization: "Bearer " + getToken() },
      // 图片上传地址
        url: process.env.VUE_APP_BASE_API + "/file/ftpUpload",
      // 上传图片
      // fileList: undefined,
      // 总条数
      total: 0,
      fileList: [],
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
      // 是否显示弹出层
      open: false,
      // 总条数
      total: 1,
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
    // 表格格式化数据
    articleType(row, column){
       let msgType=row.msgType;
       if(msgType==1){
            return "衡水热点"
       }else if(msgType==2){
             return "周边资讯"
       }else{
         return "政策动态"
       }
    },
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
      this.imageUrl =  "http://10.92.119.10/" + file.data;
    },
     handlEerror(){
       this.$message.error("上传失败");
     },
    // 模态框确认按钮
    oksubmi() {
      this.open = false;
    },
    // 模态框取消按钮
    handleCancel(){
       this.open = false;
       this.addHandleReset()
    },
    // 新增文章按钮
    Addsubmi() {
      this.addHandleReset();
      this.open = true;
      this.title = "新增文章";
    },
    // 修改文章按钮
    handleUpdate(row) {
      this.updataHandleReset();
      this.open = true;
      const id = row.id || this.id;
    getArticle(id).then((response) => {
        this.imageUrl= "http://10.92.119.10/" + response.data.pic;
        this.form = response.data;
        this.form.ifBanner = Number(response.data.ifBanner);
        this.form.ifLink = Number(response.data.ifLink);
        this.form.msgType = Number(response.data.msgType);
        this.open = true;
        this.title = "修改文章";
      });
    },
    // 模态框确认事件
    oksubmi() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateArticle(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addArticle(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row){
      const userIds = row.id || this.ids;
      this.$confirm(
        '是否确认删除用户编号为"' + userIds + '"的数据项?',
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
        });
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
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .dialogForm::v-deep .el-form-item__content{
    margin-left: 20px !important;
  }
</style>