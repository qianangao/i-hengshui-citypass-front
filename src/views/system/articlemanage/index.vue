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
                  v-model="queryParams.articleName"
                  placeholder="请输入标题"
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
              </el-form-item>
            </el-col>
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
            <el-table-column
              label="文章类型"
              align="center"
              prop="articleType"
            />
            <el-table-column
              label="标题"
              align="center"
              prop="title"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="链接"
              align="center"
              prop="link"
              :show-overflow-tooltip="true"
            />
            <el-table-column label="图片">
              <template slot-scope="scope">
                <img style="margin-left: 10px" :src="scope.row.image" />
              </template>
            </el-table-column>
            <el-table-column
              label="创建日期 "
              align="center"
              prop="date"
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
              </template>
            </el-table-column>
          </el-table>

          <!-- 对话框 -->

          <el-dialog :visible.sync="open">
            <el-form>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="类别：">
                    <el-radio-group v-model="category">
                      <el-radio :label="1">顺德热点</el-radio>
                      <el-radio :label="2">周边资讯</el-radio>
                      <el-radio :label="3">政策动态</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="20">
                  <el-form-item label="标题">
                    <el-input class="modal" placeholder="请输入标题" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="是否链接:">
                    <el-radio-group v-model="externalLink">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="20">
                  <el-form-item label="链接:" v-if="externalLink === 1">
                    <el-input class="modal" placeholder="请输入链接" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col class="num">
                  <el-form-item label="排序:">
                    <el-input-number
                      v-model="num"
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
                      action="https://jsonplaceholder.typicode.com/posts/"
                     
                      :before-remove="beforeRemove"
                      multiple
                      :limit="3"
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
                    <el-radio-group v-model="carousel">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="2">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="externalLink !== 1">
                <Editor :min-height="80" />
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

export default {
  components: {
    Editor,
  },
  data() {
    return {
      // 富文本框
      content: "",
      editorOption: {},
      // 上传图片
      fileList: undefined,
      // 弹出框计数器
      num: 999,
      // 是否首页轮播
      carousel: 1,
      // 是否外联
      externalLink: 1,
      // 弹出框单选按钮参数
      category: 1,
      // 总条数
      total: 0,
      // 文章表格数据
      articleList: [
        {
          articleType: "周边资讯",
          title:
            "三分钟，让你了解《中华人民共和国境外非政府组织境内活动管理法》",
          link: "https://mp.weixin.qq.com/s/w2r8p8zMyPTHHPgV5CiumQ",
          date: "2019-01-03 17:03:56",
          Weights: "999",
          image:
            "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1616827913,2063578408&fm=26&gp=0.jpg",
        },
      ],

     
      
      // 是否显示弹出层
      open: false,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        articleName: undefined,
        
      },
    };
  },
  methods: {
  
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
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
      this.open = true;
    },
    handleUpdate() {
      this.open = true;
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