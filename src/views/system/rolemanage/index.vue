<template>
  <div class="app-container">
     <el-row>
        <el-col :span="4">
         <div class="head-container">
          <el-tree
            :data="sscbl"
            :props="ssProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
        </el-col>
    <el-col :span="20"> 
    <el-row class="el-center" :gutter="15">
      <!-- 用户查询条件 -->
      <el-form :model="queryParams" ref="queryForm" v-show="showSearch"  @submit.native.prevent>
        <el-col :span="7">
          <el-form-item label="角色名称" prop="roleName" label-width="70px">
            <el-input class="roleInput" v-model="queryParams.roleName" placeholder="请输入角色名称" clearable size="small"/>
          </el-form-item>
        </el-col>
        <el-col :span="7">
            <el-form-item label="权限字符" prop="roleKey" label-width="70px">
              <el-input class="roleInput" v-model="queryParams.roleKey" placeholder="请输入权限字符" clearable size="small"/>
            </el-form-item>
        </el-col>
        <el-col :span="5">
            <el-form-item label="状态" prop="status" v-if="checkPermi(['system:role:enable'])">
              <el-select v-model="queryParams.status" placeholder="请选择角色状态" clearable size="small" class="roleInput">
                <el-option v-for="dict in statusOptions" 
                :key="dict.dictValue" 
                :label="dict.dictLabel" 
                :value="dict.dictValue"/>
              </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item>
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <!-- 其他操作 -->
    <el-row :gutter="15" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:role:add']">新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:role:remove']">批量删除</el-button>
      </el-col> -->
    </el-row>
    <!-- table 展示 -->
    <el-table v-loading="loading" :data="roleList"  @selection-change="handleSelectionChange" >
  
      <!-- <el-table-column label="角色编号" prop="roleId" align="center" width="100"/> -->
      <el-table-column label="角色名称" prop="roleName" align="center" :show-overflow-tooltip="true" />
       <el-table-column label="归属部门" prop="deptName" align="center" :show-overflow-tooltip="true" />
      <el-table-column label="权限字符" prop="roleKey" align="center" :show-overflow-tooltip="true" />
      <el-table-column label="状态" align="center" v-if="checkPermi(['system:role:enable'])">
        <template slot-scope="scope">
          <el-switch  v-hasPermi="['system:role:enable']" v-model="scope.row.status" active-value="0" inactive-value="1" @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180px" v-if="checkPermi(['system:role:edit', 'system:role:remove'])">
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleAdd(scope.row)" v-if="!((userAdminName =='admin' && scope.row.level ==2)||scope.row.level==3) " v-hasPermi="['system:role:add']" >新增</el-button> -->
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:role:edit']" v-if="scope.row.roleId!==1">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete"  @click="handleDelete(scope.row)" v-if="scope.row.roleId!==1" v-hasPermi="['system:role:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
 </el-col>  
    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model.trim="form.roleName" placeholder="请输入角色名称" />
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
          <el-col :span="22">
            <el-form-item label="权限字符" prop="roleKey">
              <el-input class="roleKeyInput" v-model.trim="form.roleKey" placeholder="请输入权限字符" clearable />
            </el-form-item>
          </el-col>
        </el-row>
           <el-row>
          <el-col :span="22">
            <el-form-item label="归属部门" prop="deptId">
              <!-- <el-select class="inputContent" v-model="form.deptId" placeholder="请选择部门">
                <el-option v-for="item in deptOption"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId"></el-option>
              </el-select> -->
               <treeselect v-model="form.deptId"   :options="deptOption"  :normalizer="normalizer" :show-count="true" placeholder="请选择归属部门" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="菜单权限">
              <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
              <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
              <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
              <el-tree class="treeBorder" :data="menuOptions" show-checkbox ref="menu" node-key="id" :check-strictly="!form.menuCheckStrictly" empty-text="加载中，请稍后" :props="defaultProps"></el-tree>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" rows= 3 maxlength = 200 ></el-input>
            </el-form-item>
            </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    </el-row>
  </div>
</template>

<script>
import { listRole, getRole, delRole, addRole, updateRole, dataScope, changeRoleStatus } from "@/api/system/rolemanage";
import { treeselect as menuTreeselect, roleMenuTreeselect } from "@/api/system/menu";
import { listDept } from "@/api/system/dept";
import { deptSelect } from "@/api/system/user";
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "Role",
  components: { Treeselect },
  data() {
    return {
       sscbl:[],
       ssProps: {
        children: "childrenList",
        label: "deptName"
      },
      userAdminName:this.$store.state.user.name,
        // level: undefined,
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
      // 角色表格数据
      roleList: [],
        // 部门选项
       deptOption:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
	    menuExpand: false,
      menuNodeAll: false,
      // 状态数据字典
      statusOptions: [],
      // 菜单列表
      menuOptions: [],
      // 部门列表p
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined,
        deptId: undefined
      },
      // 权限字符数据字典
      permissionType: [],
      // 表单参数
      form: {
      },
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger:[ 'blur', 'change'] }
        ],
        roleKey: [
          { required: true, message: "权限字符不能为空", trigger:[ 'blur', 'change'] },
          { pattern: /^[a-zA-Z0-9_]{3,}$/, message: "仅支持字母,数字或者下划线,长度大于3",trigger: ["blur", "change"] }
        ],
        roleSort: [
          { required: true, message: "角色顺序不能为空", trigger:[ 'blur', 'change'] }
        ],
        deptId:[
          { required: true, message: "部门不能为空", trigger:[ 'blur', 'change']}
        ]
      },
    };
  },
  created() {
    // 侧边搜索树
    this.getTreeselect();
    // 获取菜单列表
    this.getList();
    // 状态数据字典
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    sss(row){

    },
      checkPermi,
    checkRole,
      // 获取部门select
    handleDept(w) {
      deptSelect().then(response => {
        this.deptOption = response;
      
      })
    },
        normalizer(node) {
      if (node.childrenList && !node.childrenList.length) {
        delete node.childrenList;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.childrenList
      };
    },
        // 获取部门树结构
    getTreeselect() {
      listDept().then(response => {
        this.sscbl = response;
      });
    },
      handleNodeClick(data){
      this.queryParams.deptId = data.deptId;
      this.getList();
    },
       filterNode(value, data) {
      if (!value) return true;
      return data.deptName.indexOf(value) !== -1;
    },
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      listRole(this.queryParams).then(response => {

          this.loading = false;
          this.roleList =response.data.rows
          // this.roleList = this.handleTree(response.data, "roleId");
           this.total = response.data.total;
        }
      );
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then(response => {
        this.menuOptions = response.data;
      });
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    // 所有部门节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的部门节点
      let checkedKeys = this.$refs.dept.getCheckedKeys();
      // 半选中的部门节点
      let halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      return roleMenuTreeselect(roleId).then(response => {
        this.menuOptions = response.menus;
        return response;
      });
    },
    // 角色状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.roleName + '"角色吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeRoleStatus(row.roleId, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
	    this.menuExpand = false,
      this.menuNodeAll = false,
      this.form = {
        // 部门id区别 deptIds
        level: undefined,
        deptId: undefined,
        roleId: undefined,
        roleName: undefined,
        roleKey: undefined,
        // roleSort: 0,
        status: "0",
        menuIds: [],
        deptIds: [],
        menuCheckStrictly: true,
        deptCheckStrictly: true,
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
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.roleId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
	  // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type == 'menu') {
        let treeList = this.menuOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
        }
      } else if (type == 'dept') {
        let treeList = this.deptOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions: []);
      } else if (type == 'dept') {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions: []);
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type == 'menu') {
        this.form.menuCheckStrictly = value ? true: false;
      } else if (type == 'dept') {
        this.form.deptCheckStrictly = value ? true: false;
      }
    },
    /** 新增按钮操作 */
    handleAdd(row) {
       this.reset();
       this.form.level=row.level+1
      if(row.deptName==null||undefined||''){
         this.handleDept(row);
      }else{
        this.deptOption = [{'deptName':row.deptName,'deptId':row.deptId}];

      }

      this.getMenuTreeselect();
       if (row != null && row.roleId) {
        this.form.pid = row.roleId;
      } else {
        this.form.pid = 0;
      }
      this.open = true;
      this.title = "添加角色";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.handleDept();
      this.reset();
      const roleId = row.roleId || this.ids
      const roleMenu = this.getRoleMenuTreeselect(roleId);
      getRole(roleId).then(response => {
        if(response.code===200){
        this.form = response.data;
        this.open = true;
        this.$nextTick(() => {
          roleMenu.then(res => {
            this.$refs.menu.setCheckedKeys(res.checkedKeys);
          });
        });
        this.title = "修改角色";
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
          if (this.form.roleId != undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            updateRole(this.form).then(response => {
              if(response.code===200){
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
              }else{
              this.$message.error(response.msg)
              }
            })
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            addRole(this.form).then(response => {
               if(response.code===200){
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
               }else{
               
               }
            });
          }
        }
      })
    },
    /** 提交按钮（数据权限） */
    submitDataScope: function() {
      if (this.form.roleId != undefined) {
        this.form.deptIds = this.getDeptAllCheckedKeys();
        dataScope(this.form).then(response => {
          if(response.code===200){
          this.msgSuccess("修改成功");
          this.openDataScope = false;
          this.getList();
          }else{
          this.$message.error(response.msg)
          }

        }).catch(()=>{})
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const roleId = row.roleId || this.ids;
      const roleName =row.roleName
      this.$confirm('是否确认删除角色"' + roleName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRole(roleId);
        }).then(() => {
          this.getList();
         
        }).catch ( () =>{
        })
    }
  }
};
</script>

<style lang="scss" scoped>
  .roleInput{
    width: 70%;
  }
</style>
<style>
  .treeBorder{
    height: 142px;
    overflow: auto;
    border: 0.5px solid rgba(0, 0, 0, 0.1);
  }
  .el-select{
    width: 100%;
  }
  .el-input-number--medium{
    width: 100%;
  }
  .roleKeyInput{
    width: 100%;
  }
</style>