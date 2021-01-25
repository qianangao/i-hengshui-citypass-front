<template>
  <div class="app-container">
    <el-row class="el-center" :gutter="15">
      <!-- 文章查询条件 -->
      <el-form :model="queryParams" ref="queryForm" @submit.native.prevent>
        <el-col :span="6">
          <el-form-item label="违章地点" prop="videoCameraName">
            <el-input class="inputQuerys" v-model="queryParams.videoCameraName" placeholder="请输入违章地点" clearable size="small"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="违章方式" label-width="100" prop="threeLevelDir">
            <el-select class="inputQuerys" popper-class="select-down" v-model="queryParams.threeLevelDir" placeholder="请选择" clearable size="small">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
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
      <el-table-column label="违章地点" align="center" prop="videoCameraName" :show-overflow-tooltip="true"/>
      <el-table-column label="经度" width="180" align="center" prop="latitude" />
      <el-table-column label="纬度" width="180" align="center" prop="longitude" />
      <el-table-column label="导入时间" width="180" prop="importTime" align="center">
        <!-- <template slot-scope="scope">
            <span>{{ parseTime(scope.row.importTime) }}</span>
        </template>-->
      </el-table-column>
      <el-table-column label="三级目录类型" align="center" prop="threeLevelDir">
        <template slot-scope="scope">
          <span>{{ scope.row.threeLevelDir == "0" ? "电子警察" :scope.row.threeLevelDir=="1"?"卡口":scope.row.threeLevelDir=="2"?"车让人":"违停球" }}</span>
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
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url +`/`+true"
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
        <div class="el-upload__tip" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { Violationlist, Empty } from "@/api/system/taff";
export default {
  data() {
    return {
      fileList: [],
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
        url: process.env.VUE_APP_BASE_API + "/system/app/wism/point/importData"
      },
      options: [
        {
          value: "0",
          label: "电子警察"
        },
        {
          value: "1",
          label: "卡口"
        },
        {
          value: "2",
          label: "车让人"
        },
        {
          value: "3",
          label: "违停球"
        }
      ],
      // 总条数
      // 列表数据
      Traffic: [],
      total: 0,
      articleList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        videoCameraName: undefined,
        threeLevelDir: undefined,
        dateRange: undefined
      },
      showSearch: true
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      Violationlist(this.queryParams).then(response => {
        this.total = response.data.total;
        this.Traffic = response.data.rows;
      });
    },

    // 查询按钮
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.title = undefined;
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
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
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