<template>
  <div class="app-container">
    <!-- 用户查询条件 -->
     <el-row  class="el-center" :gutter="15">
        <el-form  :model="queryParams" ref="queryForm" @submit.native.prevent>
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
      <el-table-column prop="menuName"  label="菜单名称" :show-overflow-tooltip="true"  ></el-table-column>
      <el-table-column prop="menuCode" label="菜单Code" width="90px" :show-overflow-tooltip="true"  align="center"></el-table-column>
      <el-table-column prop="level" label="菜单层级" width="90px" :show-overflow-tooltip="true"  align="center"></el-table-column>
      <el-table-column prop="ifHome" label="是否首页" width="90px" align="center">
          <template slot-scope="scope">
          <span  v-if="!(scope.row.level ==1)&&!(scope.row.level ==2)">{{ scope.row.ifHome === "0"? "是":"否" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ifBigPicUrl" label="是否大图展示" width="100px" align="center">
          <template slot-scope="scope">
          <span  v-if="!(scope.row.level ==1)&&!(scope.row.level ==2)">{{ scope.row.ifBigPicUrl === "0"? "是":"否" }}</span>
        </template>
      </el-table-column>
        <el-table-column prop="ifHot" label="是否热门" width="90px" align="center">
          <template slot-scope="scope">
          <span  v-if="!(scope.row.level ==1)&&!(scope.row.level ==2)">{{ scope.row.ifHot === "0"? "是":"否" }}</span>
        </template>
      </el-table-column>
       <el-table-column prop="ifCarryUser" label="访问方式" width="90px" align="center" >
          <template slot-scope="scope" >
          <span v-if="!(scope.row.level ==1)&&!(scope.row.level ==2)">{{ scope.row.ifCarryUser === "0"? "未认证": scope.row.ifCarryUser==='1'?'访客':'已认证'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sortNum" label="排序" width="90px" class="sortNum"  align="center"></el-table-column>
      <!-- <el-table-column prop="createTime" label="创建时间" align="center" width="160px">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="updateTime" label="更新时间" align="center" width="160px">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column  class="status" v-model="queryParams.status" prop="status" label="菜单状态"  align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status === "0" ? "启用" : "禁用" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" align="center"  width="160px" v-if="checkPermi(['system:app:menuinfo:add:child', 'system:app:menuinfo:edit','system:app:menuinfo:enable'])">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row, scope.row.level,scope.row.id)" v-if="scope.row.level < 4" v-hasPermi="['system:app:menuinfo:add:child']">新增</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row, scope.row.level)" v-hasPermi="['system:app:menuinfo:edit']">编辑</el-button>
          <el-button size="mini" type="text" icon="el-icon-disable" @click="handleStatusChange(scope.row)" v-if="scope.row.level > 1" v-hasPermi="['system:app:menuinfo:enable']" >{{ scope.row.status === "0" ? "禁用" : "启用" }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加或修改二级菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" :close-on-press-escape="false" :close-on-click-modal="false" v-if="open">
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
         <el-row>
          <el-col :span="22">
            <el-form-item label="应用图标" prop="icon" v-if="this.form.level != 1">
              <el-upload  class="menu-uploader"  
                :action="urlPath"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :headers="headers">
                <div slot="tip" class="scti">
                  <p>建议上传</p>
                  <p>图标分辨率：70*70</p>
                  <p>大图分辨率：750*252</p>
                </div>
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus menu-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png/jpeg格式的缩略图，且不超过5MB!</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改三级菜单菜单对话框 -->
    <el-dialog :title="title" :visible.sync="addOpen" width="800px"  :close-on-press-escape="false" :close-on-click-modal="false" v-if="addOpen">
      <el-form ref="formThird" :model="form" :rules="rulesThird" label-width="130px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model.trim="form.menuName" placeholder="请输入应用名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22" v-if="this.form.level === 3">
            <el-form-item label="外链地址">
              <el-input v-model="form.inUrl" placeholder="请输入外链地址" />
            </el-form-item>
          </el-col>
          <el-col :span="22" v-else>
            <el-form-item label="外链地址" prop="inUrl">
              <el-input v-model="form.inUrl" placeholder="请输入外链地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="访问方式">
              <el-select v-model="form.ifCarryUser">
                <el-option
                  v-for="item in carryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="10">
            <el-form-item label="显示排序" prop="sortNum">
              <el-input-number v-model="form.sortNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item  label="是否大图展示">
              <el-radio-group v-model="form.ifBigPicUrl">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item  label="是否热门">
              <el-radio-group v-model="form.ifHot">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
         <el-col :span="11">
            <el-form-item label="是否首页">
              <el-radio-group v-model="form.ifHome">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        
         <el-row>
          <el-col :span="11">
            <el-form-item label="图标" prop="icon">
              <el-upload  class="menu-uploader"  
                :action="urlPath"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :headers="headers">
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus menu-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">图标分辨率：70*70，只能上传jpg/png/jpeg格式，且不超过5MB!</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="11" v-if="form.ifBigPicUrl==='0'">
            <el-form-item label="大图" prop="bigIcon">
              <el-upload  class="menu-uploader"  
                :action="urlPath"
                :show-file-list="false"
                :on-success="handleBigIcon"
                :before-upload="beforeAvatarUpload"
                :headers="headers">
                <img v-if="imageBigIcon" :src="imageBigIcon" class="avatar" />
                <i v-else class="el-icon-plus menu-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">大图分辨率：750*252，只能上传jpg/png/jpeg格式，且不超过5MB!</div>
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
        <el-button type="primary" @click="submitForm('formThird')">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTable, listMenu, addMenu, getMenu, updataMenu, changeMenuStatus, uploadImg } from "@/api/app/menuinfo";
import settings from '@/settings.js';
import { getToken } from "@/utils/auth";
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数
export default {
  name: "Menu",
  data() {
     var valiIcon = (rule, value, callback) => {
      // 图片验证
      if (!this.form.icon ) { 
        callback(new Error("请上传图片"));
      } else {
        callback();
      }
    }
    var bigvaliIcon = (rule, value, callback) => {
      // 图片验证
      if (!this.form.bigIcon ) { 
        callback(new Error("请上传图片"));
      } else {
        callback();
      }
    }
    return {
          // 文件上传格式刷
      headers: { Authorization: "Bearer " + getToken() },
        // 图片上传地址
      url: process.env.VUE_APP_BASE_API + "/file/ftpUpload",
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
      // app菜单类型
      appMenuType:[],
      // 查询参数
      queryParams: {
        menuName: undefined,
      },
      // 上传图标
      fileList: [],
      // 图片上传地址
      urlPath: process.env.VUE_APP_BASE_API + "/file/ftpUpload",
      // 文件上传格式刷
      headers: { Authorization: "Bearer " + getToken() },
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
         { required: true,validator: valiIcon  },
        ],
        bigIcon: [
         { required: true,validator: bigvaliIcon  },
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
      supportPicFormat: ["jpg", "png", "jpeg","JPG","PNG","JPEG"],
      imageUrl: "",
      imageBigIcon: "",
      value:'',
      carryOptions:[
        {
          value: '1',
          label: '访客'
        },
        {
          value: '0',
          label: '未认证'
        },
        {
          value: '2',
          label: '已认证'
        }
      ]
    };
  },
  created() {
    // 获取菜单列表
    this.getList();
    //  app菜单Code数据字典
    this.getDicts("app_menu_code").then(response => {
      this.appMenuCode = response.data;
    }).catch( ()=>{});
    // 获取app菜单分类
    // this.getDicts("app_menu_classify").then(response => {
    //  this.appMenuType=response.data;
    // }).catch( ()=>{})
  },
  methods: {
    checkPermi,
    checkRole,
        // 选择图标
    selected(name) {
      this.form.icon = name;
    },
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
        icon: undefined,
        bigIcon: undefined,
        status: "0",
        level: undefined,
        ifHot: "1",
        ifHome: "1",
        ifCarryUser: "1",
        ifBigPicUrl:"1",
        ifHot: "1"
      };
      this.imageUrl = "";
      this.imageBigIcon = "";
      this.resetForm("form");
      this.resetForm("formThird");
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
      } else if (level === 3){
        this.addOpen = true;
      }
       else {
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
        if (response.code===200) {
          this.form = response.data;
        if(this.form.icon != null) {
          this.imageUrl = this.address + this.form.icon;
        }
        if(this.form.bigIcon != null){
          this.imageBigIcon = this.address + this.form.bigIcon;
        }
        if (level === 3) {
          this.addOpen = true;
        } 
        else if(level === 4){
            this.addOpen = true;
        }
        else {
          this.open = true;
        }
          this.title = "修改菜单";
        }else{
          this.$message.error(response.msg)
        }
      
      }).catch( () =>{})
    },
    /** 提交按钮 */
    submitForm(value) {
      this.$refs[value].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updataMenu(this.form).then((response) => {
              if(response.code===200){
              this.msgSuccess("修改成功");
              this.open = false;
              this.addOpen = false;
              this.getList();
              }else{
              this.$message.error(response.msg)  
              }
            });
          }else{
              addMenu(this.form).then((response) => {
                if(response.code===200){
                this.msgSuccess("新增成功");
                this.open = false;
                this.addOpen = false;
                this.getList();
                }else{
                 this.$message.error(response.msg)
                }
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
      this.form.icon = res.data;
      this.imageUrl = URL.createObjectURL(file.raw);
      if (res.code===200) {
        this.$message.success("上传成功")
      }else{
        this.$message.error(file.response.msg);
      }
     
    },
    // 上传图片接口
    beforeAvatarUpload(file) {
      const supportPicFormat = file.type;
      const isLt5M = file.size / 1024 / 1024 < 5;
      // 文件类型进行判断 
       if (!supportPicFormat) {
        this.$message.error("只能上传jpg/png/jpeg文件!");
        return false;
      }
      // 文件大小进行判断 
      if (!isLt5M) {
        this.$message.error("上传图标大小不能超过5MB!");
        return false;
      }
    },
    // 上传大图
    handleBigIcon(res, file) {
      this.form.bigIcon = res.data;
      this.imageBigIcon = URL.createObjectURL(file.raw);
      if (res.code===200) {
       this.$message.success("上传成功")
      }else{
        this.$message.error(file.response.msg);
      }
    },
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
.scti{
  float: right;
  margin-right: 40%;
  margin-top: 8px;
}
.scti p{
  margin: -10px;
  padding: -10px;
  font-size: 12px;
  color: #606266;
}
.sctier{
  float: right;
  margin-right: 35%;
  margin-top: 8px;
}
.sctier p{
  margin: -10px;
  padding: -10px;
  font-size: 12px;
  color: #606266;
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