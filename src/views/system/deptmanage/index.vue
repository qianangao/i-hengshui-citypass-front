<template>
  <div class="app-container">
    <el-row class="el-center" :gutter="15">
      <!-- 用户查询条件 -->
      <el-form :model="queryParams" ref="queryForm" v-show="showSearch" @submit.native.prevent>
        <el-col :span="6">
          <el-form-item label="机构名称" prop="deptName">
            <el-input class="deptInputQuery" v-model="queryParams.deptName" placeholder="请输入机构名称" clearable size="small"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="负责人" prop="leader">
            <el-input class="deptInputQuery" v-model="queryParams.leader" placeholder="请输入负责人" clearable size="small"/>
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
    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:dept:add']">新增</el-button>
      </el-col>
    </el-row> -->
     <!-- table 展示 -->
    <el-table class="table-list" v-loading="loading" :data="deptList" row-key="deptId" default-expand-all :tree-props="{children: 'childrenList', hasChildren: 'hasChildren'}">
      <el-table-column prop="deptName" label="机构名称"  :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="leader" label="机构负责人" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="fixedPhone" label="座机号" align="center"></el-table-column>
      <el-table-column prop="email" label="邮箱" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="创建时间"  prop="createTime" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" align="center" width="180" v-if="userAdminName =='admin'">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)" v-if="(userAdminName =='admin' &&scope.row.level<2)" v-hasPermi="['system:dept:add']">新增</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-if="userAdminName =='admin'" v-hasPermi="['system:dept:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-if="userAdminName =='admin' " v-hasPermi="['system:dept:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <!-- <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/> -->
    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="机构名称" prop="deptName">
              <el-input v-model.trim="form.deptName" placeholder="请输入机构名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="机构负责人" prop="leader">
              <el-input v-model.trim="form.leader" placeholder="请输入负责人" maxlength="20" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="座机号" prop="fixedPhone">
              <el-input v-model.trim="form.fixedPhone" placeholder="请输入座机号码" maxlength="16" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="22">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :span="22">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model.trim="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="机构简介" prop="remark">
              <el-input type="textarea" :rows="3" v-model="form.remark" placeholder="请输入机构简介" maxlength="200"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDept, addDept, getDept, delDept, updateDept, listDeptExcludeChild } from "@/api/system/dept";
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数
export default {
  name: "Dept",
  components: {},
  data() {
    return {
       userAdminName:this.$store.state.user.name,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
      // 总条数
      total: 0,
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptName: undefined,
        // status: undefined
        leader: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        deptName: [
          { required: true, message: "机构名称不能为空", trigger: ["blur", "change"] }
        ],
        leader: [
          { required: true, message: "机构负责人不能为空", trigger: ["blur", "change"] }
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        fixedPhone: [
          { required: true, message: "座机号不能为空", trigger: "blur" },
          {
            // pattern: /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,
            pattern: /^(0[0-9]{2,3}\-)([2-9][0-9]{6,11})+(\-[0-9]{1,6})?$/,
            message: "请输入正确座机号码",
            trigger: ["blur", "change"]
          }
        ],
        // phone: [
        //   {
        //     pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        //     message: "请输入正确的手机号码",
        //     trigger: "blur"
        //   }
        // ]
      }
    };
  },
  created() {
    /** 获取部门列表 */
    this.getList();
    /** 状态数据字典 */
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
     checkPermi,
    checkRole,
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      listDept(this.queryParams).then(response => {
        this.loading = false;
        this.deptList = response;
        // this.total = response.data.total;
      });
    },
    /** 字典状态 */
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    /** 表单重置 */
    reset() {
      this.form = {
        level: undefined,
        deptName: undefined,
        leader: undefined,
        phone: undefined,
        fixedPhone: undefined,
        email: undefined,
        status: "0",
        remark: undefined,
         pid:0
      };
      this.resetForm("form");
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 取消按钮 */
    handleCancel() {
      this.open = false;
      this.reset();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.form.level=row.level+1
      this.open = true;
       if (row != null && row.deptId) {
        this.form.pid = row.deptId;
      } else {
        this.form.pid = 0;
      }
      this.open = true;
      // this.title = "添加角色";
      this.title = "添加机构";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getDept(row.deptId).then(response => {
        if (response.code===200) {
        this.form = response.data;
        this.open = true;
        this.title = "修改机构";
        }else{
        this.$message.error(response.msg)
        this.open = false;
        }
     
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.deptId != undefined) {
            updateDept(this.form).then(response => {
              if(response.code===200){
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
              }else{
              this.$message.error(response.msg)
              }
            });
          } else {
            addDept(this.form).then(response => {
                if(response.code===200){
                 this.msgSuccess("新增成功");
                 this.open = false;
                 this.getList();
                }else{
                 this.$message.error(response.msg)   
                }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.deptName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDept(row.deptId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    }
  }
};
</script>
<style>
.deptInputQuery {
  width: 70%;
}
</style>