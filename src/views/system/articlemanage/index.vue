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
              <el-form-item label="标题查询" prop="articleName">
                <el-input
                  class="inputQuery"
                  v-model="queryParams.title"
                  placeholder="请输入标题"
                  clearable
                  size="small"
                />
              </el-form-item>
            </el-col>
            <el-col :span="13">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
                  >查询</el-button
                >
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-col>
           
          </el-row>
          <el-row>
          <el-col :span="2">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small "
                @click="Addsubmi"
                >新增文章</el-button
              >
            </el-col>
          </el-row>
          <!-- 文章表格数据 -->
          <el-table class="articlerForm" :data="articleList">
            <el-table-column label="文章编号" align="center" prop="id" />
            <el-table-column label="文章类型" :formatter="articleType"  align="center" prop="msgType" />
            <el-table-column
              label="标题"
              align="center"
              prop="title"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="链接"
              align="center"
              prop="url"
              :show-overflow-tooltip="true"
            />
            <el-table-column label="图片">
              <template slot-scope="scope">
                <img style="margin-left: 10px" :src="scope.row.pic" />
              </template>
            </el-table-column>
            <el-table-column
              label="创建日期 "
              align="center"
              prop="createTime"
              width="120"
            />
            <el-table-column label="权重" align="center" prop="Weights" />

            <el-table-column
              label="操作"
              align="center"
              width="160"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:article:list']"
                  >修改</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
          <!-- 对话框 -->

          <el-dialog :visible.sync="open" :title="title">
            <el-form ref="form" :model="form">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="类别：">
                    <el-radio-group v-model="form.msgType">
                      <el-radio
                  v-for="dict in aceType"
                  :key="dict.dictSort"
                  :label="dict.dictSort"
                  >{{ dict.dictLabel }}</el-radio
                >
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="20">
                  <el-form-item label="标题">
                    <el-input
                      class="modal"
                      v-model="form.title"
                      placeholder="请输入标题"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="是否链接:">
                    <el-radio-group v-model="form.ifLink">
                          <el-radio
                  v-for="dict in dictionaryLink"
                  :key="dict.dictSort"
                  :label="dict.dictSort"
                  >{{ dict.dictLabel }}</el-radio
                >
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="20">
                  <el-form-item label="链接:" v-if="form.ifLink === 0">
                    <el-input
                      class="modal"
                      v-model="form.url"
                      placeholder="请输入链接"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="num">
                  <el-form-item label="排序:">
                    <el-input-number
                      v-model="form.num"
                      controls-position="right"
                      :min="1"
                      :max="999"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="图片上传:">
                    <el-upload
                      class="upload-demo"
                      :headers="headers"
                      :action="url"
                      :on-success="handlePreview"
                      :on-remove="handleRemove"
                      :before-remove="beforeRemove"
                      multiple
                      :limit="1"
                      :on-exceed="handleExceed"
                      :file-list="fileList"
                    >
                      <el-button size="small" type="primary"
                        >点击上传</el-button
                      >
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="首页是否轮播">
                    <el-radio-group v-model="form.ifBanner">
                      <el-radio
                  v-for="dict in dictionaryBanner"
                  :key="dict.dictSort"
                  :label="dict.dictSort"
                  >{{ dict.dictLabel }}</el-radio
                >
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="form.ifLink !== 0">
                <Editor v-model="form.content" :min-height="80" />
              </el-row>
              <el-row>
                <el-col class="okbutton">
                  <el-button type="primary" round size="mini" @click="oksubmi"
                    >确认</el-button
                  >
                </el-col>
              </el-row>
            </el-form>
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
      // 模态框标题
      title: "",
      headers: { Authorization: "Bearer " + getToken() },
      // 图片上传
      url: process.env.VUE_APP_BASE_API + "/file/ftpUpload",
      // 上传图片
      fileList: undefined,
      // 弹出框计数器

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
        console.log(response)
      this.aceType = response.data;
    }),
     this.getList();
    // 类型字典
      this.getDicts("project_status").then((response) => {
        console.log(response)
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
        num: 999,
        // 是否首页轮播
        ifBanner: 0,
        // 是否外联
        ifLink: 0,
        // 弹出框单选按钮参数
        msgType:1 ,
      };
      this.resetForm("form");
    },
    /** 编辑表单重置 */
    updataHandleReset() {
      this.form = {
        // 富文本框
        content: "",
        editorOption: {},
        num: "",
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
          // console.log(response);
          this.articleList = response.data.rows;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
      this.form.pic = "http://10.92.119.10/" + file.data;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 模态框确认按钮
    oksubmi() {
      this.open = false;
    },
    Addsubmi() {
      this.addHandleReset();
      this.open = true;
      this.title = "新增文章";
    },
    // 修改按钮
    handleUpdate(row) {
      this.updataHandleReset();
      this.open = true;
      const id = row.id || this.id;
      getArticle(id).then((response) => {
        this.form = response.data;
        this.form.ifBanner = Number(response.data.ifBanner);
        this.form.ifLink = Number(response.data.ifLink);
        this.form.msgType = Number(response.data.msgType);
        this.open = true;
        this.title = "修改文章";
      });
    },
    oksubmi() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateArticle(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addArticle(this.form).then((response) => {
              console.log(this.form);
              console.log(response);
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.id || this.ids;
      this.$confirm(
        '是否确认删除用户编号为"' + userIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delArticle(userIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
  },
};
</script>

<style scoped>
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
.num {
  margin-bottom: 5px;
}

.okbutton {
  text-align: center;
  margin-top: 10px;
}
.modal {
  width: 400px;
}
.ql-editor {
  min-height: 80px;
}
.ql-editor p {
  min-height: 80px;
}
</style>