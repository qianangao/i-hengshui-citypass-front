<template>
  <div class="app-container">
    <!-- 用户查询条件 -->
     <el-row  class="el-center" :gutter="15">
        <el-form  :model="queryParams" ref="queryForm">
          <el-col :span="6">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input  class="menuInput" v-model="queryParams.menuName"  placeholder="请输入菜单名称"  clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="cyan" icon="el-icon-search"  @click="handleQuery" v-hasPermi="['system:app:menuinfo:query']" size="mini">查询</el-button>
              <el-button icon="el-icon-refresh"  @click="resetQuery" v-hasPermi="['system:app:menuinfo:query']" size="mini">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
     </el-row>  
    <!-- 其他操作 -->
    <el-row :gutter="15" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus"  @click="handleAdd(null, 0)" v-hasPermi="['system:app:menuinfo:add']" size="mini">新增</el-button>
      </el-col>
    </el-row>
    <!-- table 展示 -->
    <el-table  v-loading="loading" :data="menuList" row-key="id" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column prop="menuName"  label="菜单名称" :show-overflow-tooltip="true"  align="center"></el-table-column>
      <el-table-column prop="menuCode" label="菜单Code" :show-overflow-tooltip="true"  align="center"></el-table-column>
      <el-table-column prop="ifHome" label="是否首页" align="center">
          <template slot-scope="scope">
          <span>{{ scope.row.ifHome === "0"? "是":"否" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sortNum" label="排序" class="sortNum"  align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" width="160px">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" align="center" width="160px">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column  class="status" v-model="queryParams.status" prop="status" label="菜单状态"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status === "0" ? "启用" : "禁用" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row, scope.row.level,scope.row.id)" v-if="scope.row.level < 3" v-hasPermi="['system:app:menuinfo:add']">新增</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row, scope.row.level)" v-hasPermi="['system:app:menuinfo:edit']">编辑</el-button>
          <el-button size="mini" type="text" icon="el-icon-disable" @click="handleStatusChange(scope.row)" v-if="scope.row.level > 1" >{{ scope.row.status === "0" ? "禁用" : "启用" }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加或修改二级菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model.trim="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="菜单Code" prop="menuCode">
              <el-select v-model="form.menuCode" placeholder="请选择菜单Code" style="100%">
                  <el-option v-for="dict in appMenuCode" 
                  :key="dict.dictValue" 
                  :label="dict.dictValue" 
                  :value="dict.dictValue" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="显示排序" prop="sortNum">
              <el-input-number v-model="form.sortNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改三级菜单菜单对话框 -->
    <el-dialog :title="title" :visible.sync="addOpen" width="600px"  :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rulesThird" label-width="130px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model.trim="form.menuName" placeholder="请输入应用名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="外链地址" prop="inUrl">
              <el-input v-model="form.inUrl" placeholder="请输入外链地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="是否首页" prop="ifHome">
              <el-radio v-model="form.ifHome" label="0">是</el-radio>
              <el-radio v-model="form.ifHome" label="1">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="是否携带用户信息" prop="ifCarryUser">
              <el-radio v-model="form.ifCarryUser" label="0">是</el-radio>
              <el-radio v-model="form.ifCarryUser" label="1">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
          <el-col :span="22">
            <el-form-item label="应用图标" prop="icon">
              <el-upload  class="menu-uploader"  action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess"  :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus menu-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="应用简介" prop="content">
              <el-input type="textarea" placeholder="请输入内容" v-model="form.content" :rows="3"  maxlength='300'></el-input>
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
import { listTable, listMenu, addMenu, getMenu, updataMenu, changeMenuStatus, uploadImg } from "@/api/app/menuinfo";

import settings from '@/settings.js'
export default {
  name: "Menu",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层
      addOpen: false,
      // 显示状态数据字典
      visibleOptions: [],
      // app菜单Code数据字典
      appMenuCode: [],
      // 查询参数
      queryParams: {
        menuName: undefined,
      },
      // 上传图标
      fileList: [],
      form: {},
      // 地址
      address:settings.address,
      // 表单校验
      rulesThird: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger:[ 'blur', 'change'] },
        ],
        inUrl: [
          { required: true, message: "外链地址不能为空", trigger:[ 'blur', 'change'] },
          {
            pattern: /(http|https):\/\/([\w.]+\/?)\S*/,
            message: "请输入正确的网址(以http://'或者'https://'格式开头)",
            trigger: ["blur", "change"]
          }
        ],
        icon: [
          { required: true, message: "icon不能为空", trigger:[ 'blur', 'change'] },
        ]
        
      },
      rules: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger:[ 'blur', 'change'] },
        ],
        sortNum: [
          { required: true, message: "菜单顺序不能为空", trigger:[ 'blur', 'change'] },
        ],
        menuCode: [
          { required: true, message: "菜单Code不能为空", trigger:[ 'blur', 'change'] },
        ],
      },
      supportPicFormat: ["jpg", "png", "gif", "JPEG"],
      imageUrl: "",
      value:''
    };
  },
  created() {
    // 获取菜单列表
    this.getList();
    //  app菜单Code数据字典
    this.getDicts("app_menu_code").then(response => {
      this.appMenuCode = response.data;
    }).catch( ()=>{})
  },
  methods: {
    /** 查询菜单列表 */
    getList() {
      this.loading = true;
      listMenu(this.queryParams).then((response) => {
        this.menuList = response.data,
        this.loading = false
      });
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        parentId: "0",
        menuName: undefined,
        sortNum: '',
        icon: null,
        status: "0",
        level: undefined,
        ifHot: "1",
        ifHome: "1",
        ifCarryUser: "1"
      };
      this.imageUrl = "";
      this.resetForm("form");
    },
    /** 新增按钮操作 */
    handleAdd(row, level) {
      this.reset();
      this.form.level = level + 1;
      if (row != null && row.id) {
        this.form.parentId = row.id;
      } else {
        this.form.parentId = "0";
      }
      this.title = "添加菜单";
      if (level === 2) {
        this.addOpen = true;
      } else {
        this.open = true;
      }
    },
    //菜单状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "禁用" : "启用";
      this.$confirm(
        '确认要"' + text + '""' + row.menuName + '"菜单吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(function () {
        const status =  row.status === "0" ? "1" : "0";
        return changeMenuStatus(row.id, status);
      }).then(() => {
        this.getList();
        this.msgSuccess(text + "成功");
      }).catch( ()=> {
      });
    },
    /** 查询按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 修改按钮操作 */
    handleUpdate(row, level) {
      this.reset();
      getMenu(row.id).then((response) => {
        this.form = response.data;
        if(this.form.icon != null) {
          this.imageUrl = this.address + this.form.icon;
        }
        if (level === 3) {
          this.addOpen = true;
        } else {
          this.open = true;
        }
          this.title = "修改菜单";

      }).catch( () =>{})
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updataMenu(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.addOpen = false;
              this.getList();
            });
          }else{
              addMenu(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.addOpen = false;
              this.getList();
            });
          }
        }
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.addOpen = false;
      this.reset();
    },
    // 上传地址
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    // 上传图片接口
    beforeAvatarUpload(file) {
      const supportPicFormat = file.type;
      const isLt2M = file.size / 1024 / 1024 < 10;
      // 文件类型进行判断 
       if (!supportPicFormat) {
        this.$message.error("上传头像图片只能是只能上传jpg/png文件!");
        return false;
      }
      // 文件大小进行判断 
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 10MB!");
        return false;
      }
      let fileParam = new FormData();
      fileParam.append("file", file);
       uploadImg(fileParam).then(res => {
      if (res.code == 200) {
        this.form.icon =  res.data;
        }
        this.loading = false;
      }).catch(()=>{}) 
    }
  }
}
</script>

<style  scoped>
.menuInput {
  width: 70%;
}
.el-dialog {
  overflow-x: auto;
}
.el-upload__tip {
  display: inline-block;
}

</style>
<style>
.menu-uploader .el-upload {
  border: 1px dashed rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.menu-uploader .el-upload:hover {
  border-color: #409eff;
}
.menu-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 130px;
  height: 130px;
  line-height: 130px;
  text-align: center;
}
.avatar {
  width: 130px;
  height: 130px;
  display: block;
}
.el-select{
  width: 100%;
}
.el-input-number--medium{
  width: 100%;
}
.sortNum{
  width: 100px;
}
</style>