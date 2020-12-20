<template>
  <div class="app-container">
    <el-row class="el-center" :gutter="15">
      <!-- 用户查询条件 -->
      <el-form :model="queryParams" ref="queryForm" v-show="showSearch">
        <el-col :span="6">
          <el-form-item label="用户名称" prop="userName">
            <el-input class="inputQuery" v-model="queryParams.userName" placeholder="请输入用户名称" clearable size="small"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号码" prop="phone">
            <el-input class="inputQuery" v-model="queryParams.phone" placeholder="请输入手机号码" clearable size="small"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态" prop="status">
            <el-select class="inputQuery" v-model="queryParams.status" placeholder="请选择用户状态" clearable size="small">
              <el-option
                v-for="dict in statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!-- 其他操作 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:user:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:user:remove']">批量删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" icon="el-icon-upload2" size="mini" @click="handleImport" v-hasPermi="['system:user:import']">导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:user:export']">导出</el-button>
      </el-col>
    </el-row>
    <!-- table 展示 -->
    <el-table class="table-list" v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center"/>
      <el-table-column label="用户编号" align="center" prop="userId"/>
      <el-table-column label="用户名称" align="center" prop="userName" :show-overflow-tooltip="true"/>
      <el-table-column label="用户昵称" align="center" prop="nickName" :show-overflow-tooltip="true"/>
      <el-table-column label="归属部门" align="center" prop="deptName" :show-overflow-tooltip="true"/>
      <el-table-column label="角色权限" align="center" prop="roleName"/>
      <el-table-column label="手机号码" align="center" prop="phone" width="120"/>
      <el-table-column label="状态"  align="center" v-if="checkPermi(['system:user:export:enable'])" >
        <template slot-scope="scope" >
          <el-switch
            v-hasPermi="['system:user:export:enable']"
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width" v-if="checkPermi(['system:user:edit','system:user:remove','system:user:resetPwd'])">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:user:edit']">修改</el-button>
          <el-button v-if="scope.row.userId !== 1" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:user:remove']">删除</el-button>
          <el-button size="mini" type="text" icon="el-icon-key" @click="handleResetPwd(scope.row)" v-hasPermi="['system:user:resetPwd']">密码重置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>

     <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="userName">
              <el-input class="inputContent" :disabled="form.userId !== undefined" v-model.trim="form.userName" placeholder="请输入用户名称" maxlength="15"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input class="inputContent" v-model="form.phone" placeholder="请输入手机号码" maxlength="11"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色" prop="roleId">
              <el-select class="inputContent" v-model="form.roleId" placeholder="请选择角色">
                <el-option v-for="item in roleOptions" 
                  :key="item.roleId" 
                  :label="item.roleName" 
                  :value="item.roleId" 
                  :disabled="item.status == 1">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input class="inputContent" v-model.trim="form.email" placeholder="请输入邮箱" maxlength="50"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
             <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select class="inputContent" v-model="form.sex" placeholder="请选择">
                <el-option v-for="dict in sexOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="归属部门">
              <el-select class="inputContent" v-model="form.deptId" placeholder="请选择部门">
                <el-option v-for="item in deptOption"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="用户昵称">
              <el-input class="inputContent" v-model.trim="form.nickName" placeholder="请输入用户昵称" maxlength="10"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
       
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in statusOptions" 
                  :key="dict.dictLabel" 
                  :label="dict.dictValue">
                  {{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" rows="3" type="textarea" placeholder="请输入内容" maxlength="200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
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
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport"/>是否更新已经存在的用户数据
          <el-link class="templateDownload" type="info" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" slot="tip">
          提示：仅允许导入“xls”或“xlsx”格式文件！
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUser, getUser, delUser, addUser, updateUser, resetUserPwd, changeUserStatus } from "@/api/system/user";
import { getDeptSelect } from "@/api/system/dept";
import { getToken } from "@/utils/auth";
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数
import {Decrypt,Encrypt} from "@/utils/aes/security.js";
export default {
  name: "User",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 性别状态字典
      sexOptions: [],
      // 角色选项
      roleOptions: [],
      // 部门选项
      deptOption:[],
      // 表单参数
      form: {},
      // 用户导入参数
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
        url: process.env.VUE_APP_BASE_API + "/system/user/importData",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phone: undefined,
        status: undefined,
        deptId: undefined,
      },
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
          {
            pattern: /^[A-Za-z][a-zA-Z0-9_]{4,15}$/,
            message: "以字母开头(字母,数字/下划线),长度5~15",
            trigger: ["blur", "change"],
          },
        ],
        phone: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: ["blur", "change"],
          },
        ],
        roleId: [
          { required: true, message: "角色不能为空", trigger: "blur" },
        ],
        email: [
          { required: true, message: "email不能为空", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ]
      },
    };
  },
 
  created() {
    // 获取用户列表
    this.getList();
    // 状态数据字典
    this.getDicts("sys_normal_disable").then((response) => {
      this.statusOptions = response.data;
    });
    // 性别状态字典
    this.getDicts("sys_user_sex").then((response) => {
      this.sexOptions = response.data;
    });
  },
  methods: {
     checkPermi,
    checkRole,
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUser(this.queryParams).then((response) => {
          var systemUserInfo= JSON.parse(Decrypt(response.data))
          this.userList = systemUserInfo.rows;
          this.total = systemUserInfo.total;
          this.loading = false;
        }
      );
    },
    /** 表单重置 */
    handleReset() {
      this.form = {
        userId: undefined,
        // deptId: undefined,
        userName: undefined,
        nickName: undefined,
        phone: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        roleId: undefined
      };
      this.resetForm("form");
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.userName + '"用户吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(function () {
        return changeUserStatus(row.userId, row.status);
      }).then(() => {
        this.msgSuccess(text + "成功");
      }).catch(function () {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    /** 取消按钮 */
    handleCancel() {
      this.open = false;
      this.handleReset();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.handleReset();
      this.handleDept();
      getUser().then((response) => {
       
        this.roleOptions = response.data.roles;
        this.open = true;
        this.title = "添加用户";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.handleReset();
      this.handleDept();
      const userId = row.userId || this.ids;
      getUser(userId).then((response) => {
        if(response.code==200){
        this.form = response.data.userInfo;
        this.roleOptions = response.data.userInfo.roles;
       
        this.open = true;
        this.title = "修改用户";
        }else{
        this.open = false;
        this.$message.error(response.msg)
        }
      
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      resetUserPwd(row.userId).then((response) => {
        if(response.code===200){
        this.msgSuccess("重置密码成功，新密码是：123456" );
        }else{
        this.$message.error(response.msg)
        }
      });
      // this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      // }).then(({ value }) => {
      //   resetUserPwd(row.userId, value).then((response) => {
      //     this.msgSuccess("修改成功，新密码是：" + value);
      //   });
      // }).catch(() => {});
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.userId != undefined) {
            updateUser(this.form).then((response) => {
             if(response.code===200){
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
              }else{
              this.open = true;
              this.$message.error(response.msg)
              }
            });
          } else {
            addUser(this.form).then((response) => {
              if(response.code===200){
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
               }else{
              this.open = true;
              this.$message.error(response.msg)
               }
            });
          };
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      this.$confirm(
        '是否确认删除用户编号为"' + userIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(function () {
        return delUser(userIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/user/export",
        { ...this.queryParams },
        `user_${new Date().getTime()}.xlsx`
      );
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download(
        "system/user/importTemplate",
        { ...this.queryParams },
        `user_${new Date().getTime()}.xlsx`
      );
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    // 获取部门select
    handleDept() {
      getDeptSelect().then(response => {
        this.deptOption = response.data;
      })
    }
    
  },
};
</script>
<style  scoped>
.el-upload__tip {
  color: red;
}
.inputQuery {
  width: 70%;
}
.templateDownload {
  font-size: 12px;
}
.inputContent {
  width: 250px;
}
</style>