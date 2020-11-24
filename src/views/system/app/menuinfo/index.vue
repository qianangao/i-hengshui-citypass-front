<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams">
      <el-row >
        <el-col :span="8">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input
              v-model="queryParams.menuName"
              placeholder="请输入角色名称"
              size="small"
              clearable
              class = 'roleInput'
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item>
                <el-button type="cyan" icon="el-icon-search" size="mini" >查询</el-button>
                <el-button icon="el-icon-refresh" size="mini" >重置</el-button>
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
            @click="handleAdd"
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
                <span>{{ parseTime(scope.row.status) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button ssize="mini" 
                      type="text" 
                      icon="el-icon-plus" @click="handleAdd(scope.row)"
                    >新增</el-button>
                    <el-button size="mini" 
                        type="text" 
                        icon="el-icon-edit" @click="handleUpdate(scope.row)"
                    >编辑</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-disable" @click ="handleStatusChange(scope.row)"
                    >禁用</el-button>
                </template>
        </el-table-column>
    </el-table>

        <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
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
          <el-col :span="24">
            <el-form-item v-if="form.menuType != 'F'" label="菜单图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'M'" label="权限标识">
              <el-input v-model="form.perms" placeholder="请权限标识" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="菜单Code"  prop="menuCode">
              <el-input  placeholder="请输入菜单名称" v-model="form.menuCode"/>
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
import { listTable, listMenu, addMenu } from "@/api/app/menuinfo";
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
      // 显示状态数据字典
      visibleOptions: [],
      // 菜单状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        menuName: undefined,
        visible: undefined
      },
      // 表单参数
      form: {},
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
        ]
      }
    };
  },
    created() {
        this.getList();
        // this.getTreeselect();
    },
    methods:{
    // 选择图标
    selected(name) {
      this.form.icon = name;
    },
      /** 查询菜单列表 */
      getList() {
        this.loading = true;
        listMenu(this.queryParams).then(response => {
          console.log("-kjhbgvfds",response);
            this.menuList = this.handleTree(response.data, "menuId");
            this.loading = false;
        });
      },
      /** 转换菜单数据结构 */
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.menuId,
          label: node.menuName,
          children: node.children
        };
      },
      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          parentId: "0",
          menuName: undefined,
          sortNum: undefined,
          icon: undefined,
          menuType: "M",
          visible: "0",
          status: "0"
        };
        this.resetForm("form");
      },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      listMenu().then(response => {
        // this.menuList = this.handleTree(response.data, "id");
        // this.loading = false;

        this.menuOptions = [];
        const menu = { menuId: 0, menuName: '主类目', children: [] };
        menu.children = this.handleTree(response.data, "menuId");
        this.menuOptions.push(menu);
      });
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      // addMenu().then(response =>{
      // })
      if (row != null && row.menuId) {
        this.form.parentId = row.menuId;
      } else {
        this.form.parentId = "0";
      }
      this.title = "添加菜单";
      this.open = true;
      
    },
    // 角色状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "禁用";
      this.$confirm('确认要"' + text + '""' + row.menuName + '"角色吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeRoleStatus(row.id, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
    },

    /** 搜索按钮操作 */
    // handleQuery() {
    //   this.getList();
    // },
    /** 重置按钮操作 */
    // resetQuery() {
    //   this.resetForm("queryForm");
    //   this.handleQuery();
    // },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect()
        this.open = true;
        this.title = "修改菜单";
      // getMenu(row.menuId).then(response => {
      //   this.form = response.data;
      //   this.open = true;
      //   this.title = "修改菜单";
      // });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateMenu(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMenu(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
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
    /** 删除按钮操作 */
    handleDelete(row) {
    //   this.$confirm('是否确认删除名称为"' + row.menuName + '"的数据项?', "警告", {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     }).then(function() {
    //       return delMenu(row.menuId);
    //     }).then(() => {
    //       this.getList();
    //       this.msgSuccess("删除成功");
    //     }).catch(()=>{})
    }
  }
}

</script>

<style lang="scss" scoped>
    .app-container{

      .roleInput{
        width: 240px;
      }
    }

</style>