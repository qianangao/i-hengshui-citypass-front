<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" ref="queryForm">
      <el-row >
        <el-col :span="8">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input
              v-model="queryParams.menuName"
              placeholder="请输入菜单名称"
              size="small"
              clearable
              class = 'roleInput'
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item>
                <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-col>
       </el-row>
    </el-form>
    <el-row :gutter="8" class="mb8">
        <el-col :span="1.5">
            <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd(null,0)"
            >新增菜单</el-button>
        </el-col>
        <!-- <right-toolbar :showSearch.sync="showSearch"></right-toolbar> -->
    </el-row>
        <el-table
            v-loading="loading"
            :data="menuList"
            row-key="id"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            >
            <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" class = 'menuName'></el-table-column>
            <el-table-column prop="sortNum" label="排序" class="orderNum" width="100px"></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="编辑时间" align="center" prop="editTime">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.updateTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="菜单状态"  v-model="queryParams.status"  class="status" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.status === "0" ?"启用":"禁用"}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button size="mini" 
                      type="text" 
                      icon="el-icon-plus" @click="handleAdd(scope.row,scope.row.level)"
                      v-if="scope.row.level < 3"
                    >新增</el-button>
                    <el-button size="mini" 
                        type="text" 
                        icon="el-icon-edit" @click="handleUpdate(scope.row,scope.row.level)"
                    >编辑</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-disable" @click ="handleStatusChange(scope.row)"
                    >{{ scope.row.status === "0" ?"禁用":"启用"}}
                    </el-button>
                </template>
        </el-table-column>
    </el-table>
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-row>
          <!-- <el-col :span="24">
            <el-form-item label="上级菜单">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="菜单Code"  prop="menuCode">
              <el-input  placeholder="请输入菜单名称" v-model="form.menuCode"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="应用图标" prop="inUrl">
              <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-preview="handlePreview"
                  multiple
                  :limit="1"
                  :on-exceed="handleExceed"
                  accept="image/jpeg, image/jpg, image/png, image/pdf"
                  :before-upload="uploadMenuImg"
                  >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <span slot="tip" class="el-upload__tip" style="margin-left: 10px">只能上传jpg/png文件，且不超过10Mb</span>
              </el-upload>
            </el-form-item>
          </el-col>
         
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="addOpen" width="600px" height= "600px"  append-to-body >
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入应用名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="应用简介" prop="content">
              <el-input v-model="form.content" placeholder="请输入应用简介" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="菜单Code"  prop="menuCode">
              <el-input  placeholder="请输入菜单Code" v-model="form.menuCode"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="应用图标" prop="icon">
              <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-preview="handlePreview"
                  multiple
                  :limit="1"
                  :on-exceed="handleExceed"
                  accept="image/jpeg, image/jpg, image/png, image/pdf"
                  :before-upload="uploadMenuImg"
                 >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <span slot="tip" class="el-upload__tip" style="margin-left: 10px">只能上传jpg/png文件，且不超过10Mb</span>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="入口地址" prop="inUrl">
              <el-input v-model="form.inUrl" placeholder="请输入入口地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="授权回调地址" prop="callbackUrl">
              <el-input v-model="form.callbackUrl" placeholder="请输入授权回调地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="联系人姓名" prop="linkman">
              <el-input v-model="form.linkman" placeholder="请输入联系人姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="联系方式" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系方式" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="版本号" prop="version">
              <el-input v-model="form.version" placeholder="请输入版本号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="是否热门"  prop="ifHot">
                <el-radio v-model="form.ifHot" label="0">是</el-radio>
                <el-radio v-model="form.ifHot" label="1">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="是否携带用户信息"  prop="ifCarryUser">
                <el-radio v-model="form.ifCarryUser" label="0">是</el-radio>
                <el-radio v-model="form.ifCarryUser" label="1">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
          <el-col :span="24">
            <el-form-item label="机构名称" prop="orgName">
              <el-input v-model="form.orgName" placeholder="请输入机构名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="应用ID" prop="appId">
              <el-input v-model="form.appId" placeholder="请输入应用ID" />
            </el-form-item>
          </el-col>
        </el-row><el-row>
          <el-col :span="24">
            <el-form-item label="AppKey" prop="appKey">
              <el-input v-model="form.appKey" placeholder="请输入AppKey" />
            </el-form-item>
          </el-col>
        </el-row><el-row>
          <el-col :span="24">
            <el-form-item label="App secret" prop="appSecret">
              <el-input v-model="form.appSecret" placeholder="请输入App secret" />
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
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";

export default {
    name: "Menu",
    components: { Treeselect, IconSelect },
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
      // 菜单状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        menuName: undefined,
        visible: undefined
      },
      // 上传图标
      fileList:[],
      form:{},
      // 表单校验
      rules: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" }
        ],
        sortNum: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" }
        ],
        path: [
          { required: true, message: "路由地址不能为空", trigger: "blur" }
        ],
        menuCode: [
          { required: true, message: "菜单Code不能为空", trigger: "blur" }
        ],
       phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      },
      supportPicFormat: ["jpg", "png", "gif", "JPEG"],
      
    }
  },
    created() {
        this.getList();
    },
    methods:{
      /** 查询菜单列表 */
      getList() {
        this.loading = true;
        listMenu(this.queryParams).then(response => {
            this.menuList = this.handleTree(response.data, "menuId");
            this.loading = false;
            // this.getTreeselect()
        });
      },
      // /** 转换菜单数据结构 */
      // normalizer(node) {
      //   if (node.children && !node.children.length) {
      //     delete node.children;
      //   }
      //   return {
      //     id: node.menuId,
      //     label: node.menuName,
      //     children: node.children
      //   };
      // },
      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          parentId: "0",
          menuName: undefined,
          sortNum: undefined,
          icon: undefined,
          menuType: "M",
          status: "0",
          level: undefined,
          ifHot: '1',
          ifCarryUser: '1'
        };
        this.resetForm("form");
      },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      listMenu().then(response => {
        this.menuOptions = [];
        const menu = { menuId: 0, menuName: '主类目', children: [] };
        console.log("menu-----",menu)
        this.menuOptions = this.handleTree(response.data, "id");
      });
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
      if(level === 2){
        this.addOpen = true;
      }else{
         this.open = true;
      }
    },
    // 角色状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "禁用": "启用" ;
      this.$confirm('确认要"' + text + '""' + row.menuName + '"菜单吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          row.status = row.status === "0" ? "1" : "0"
          return changeMenuStatus(row.id,row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "0" ? "1" : "0";
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
        // console.log(level)
      this.reset();
      this.getTreeselect()
      getMenu(row.id).then(response => {
        this.form = response.data;
        if(level === 3){
          this.addOpen = true
        }
        else{
          this.open = true;
        }
        this.title = "修改菜单";
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          console.log("valid-----",valid);
          console.log(this.form)
          if (this.form.id != undefined) {
            updataMenu(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.addOpen = false
              this.getList();
            });
          } else {
            addMenu(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.addOpen = false
              this.getList();
            });
          }
        }
      });
    },
    // 取消按钮
    cancel(){
       this.open = false;
      this.reset();
    },
    // 上传图标
     handlePreview(file) {
        // console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      //去上传
      uploadFile(file) {
        const fileTypeName = file.name.substring(
          file.name.lastIndexOf(".") * 1 + 1 * 1
        ); // 获取后缀名
        if (this.supportPicFormat.indexOf(fileTypeName) == -1) {
          this.$message.error("格式不支持!");
          return false;
        } else {
          this.loading = true;
          let fileParam = new FormData();
          fileParam.append("file", file);
          let url = "";
          uploadImg(fileParam).then(res => {
            if (res.code == 200) {
              this.form.icon =  res.data;
            }
            this.loading = false;
          });
        }
      },
      //上传菜单图片
      uploadMenuImg(file) {
        // console.log('file--------',file);
        this.uploadFile(file);
      },

  }
}

</script>

<style lang="scss" scoped>
    .app-container{

      .roleInput{
        width: 240px;
      }
      .el-dialog{
        overflow-x: auto;

        .el-upload__tip{
          display: inline-block;
          
        }
      }
    }

</style>