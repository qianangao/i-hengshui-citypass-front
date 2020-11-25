<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" ref="queryForm">
      <el-row >
        <el-col :span="8">
          <el-form-item label="标题" prop="title">
            <el-input
              v-model="queryParams.title"
              placeholder="请输入标题名称"
              size="small"
              clearable
              class = 'roleInput'
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="反馈状态" prop="replyStatus">
              <el-select
                v-model="queryParams.replyStatus"
                placeholder="请选择反馈状态"
                clearable
                size="small"
                class="roleInput"
               
              >
                <el-option
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
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
        
        <el-table
            v-loading="loading"
            :data="menuList"
            row-key="id"
            >
            <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            <el-table-column prop="title" label="标题" :show-overflow-tooltip="true" class = 'menuName ' v-model="queryParams.replyStatus">
                <template slot-scope="scope">
                  <span>{{ scope.row.title }}</span>
                </template>
            </el-table-column>
            <el-table-column label="内容" align="center" prop="content">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.content) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="反馈时间" align="center" prop="createTime">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="反馈人" align="center" prop="createBy">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.createBy) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="replyStatus" label="反馈状态"  v-model="queryParams.replyStatus"  class="status" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.replyStatus === "0" ?"已回复":"未回复" }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template >
                  <el-button size="mini" 
                    @click = 'handleShow'>查看</el-button>
                </template>
        </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 点击查看  弹出的模态框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" 
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-row>
          <el-col :span="22">
            <el-form-item label="标题" prop="title">
              <el-input  placeholder="请输入反馈时间" v-model="form.title"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="内容" prop="content">
               <el-input  placeholder="请输入反馈时间" v-model="form.content"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="22">
            <el-form-item label="反馈时间"  prop="createTime">
              <el-input  placeholder="请输入反馈时间" v-model="form.createTime"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
           <el-col :span="22">
            <el-form-item label="反馈人"  prop="createBy">
              <el-input  placeholder="请输入反馈人" v-model="form.createBy"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="反馈回复"  prop="replyContent">
                <el-input
                    type="textarea"
                    autosize
                    placeholder="请输入反馈回复内容"
                    v-model="form.replyContent">
                </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">回复</el-button>
        <el-button @click="cancel">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMenu } from "@/api/feedback/complaintFeedback";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";

export default {
    name: "Menu",
    components: { Treeselect, IconSelect },
  data() {
    return {
      // 总条数
      total: 0,
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
    //状态
        statusOptions: [
            {
            dictValue: '0',
            dictLabel: '已回复'
            }, {
            dictValue: '1',
            dictLabel: '未回复'
            }
        ],
      // 查询参数
      queryParams: {
        title: '',
        isAsc: "desc",
        pageNum: 1,
        pageSize: 10,
        orderByColumn: '',
        replyStatus: ""
        },
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
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
       phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
      
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
            console.log('------',response);
            this.menuList = response.data.rows;
            this.total = response.data.total;
            this.loading = false;
        });
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
          status: "0",
          level: undefined,

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

    // 反馈状态状态修改
    // handleStatusChange(row) {
    //   let text = row.replyStatus === "0" ? "禁用": "启用" ;
    //   this.$confirm('确认要"' + text + '""' + row.menuName + '"菜单吗?', "警告", {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     }).then(function() {
    //       row.replyStatus = row.replyStatus === "0" ? "1" : "0"
    //       return changeMenuStatus(row.id,row.replyStatus);
    //     }).then(() => {
    //       this.msgSuccess(text + "成功");
    //     }).catch(function() {
    //       row.replyStatus = row.replyStatus === "0" ? "1" : "0";
    //     });
    // },
    /** 查询按钮操作 */
    handleQuery() {
    this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 查看操作按钮
    handleShow(){
        this.open = true;
        this.title = "添加菜单";
    },
    /** 修改按钮操作 */
    // handleShow(row, level) {
    //     // console.log(level)
    //   this.reset();
    //   this.getTreeselect()
    //   getMenu(row.id).then(response => {
    //     this.form = response.data;
    //     if(level === 3){
    //     //   this.addOpen = true
    //     }
    //     else{
    //       this.open = true;
    //     }
    //     this.title = "查看";
    //   })
    // },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          console.log("valid-----",valid);
          console.log(this.form)
          if (this.form.id != undefined) {
            // updataMenu(this.form).then(response => {
            //   this.msgSuccess("修改成功");
            //   this.open = false;
            // //   this.addOpen = false
            //   this.getList();
            // });
          } else {
            // addMenu(this.form).then(response => {
            //   this.msgSuccess("新增成功");
            //   this.open = false;
            // //   this.addOpen = false
            //   this.getList();
            // });
          }
        }
      });
    },
    // 取消按钮
    cancel(){
       this.open = false;
        this.reset();
    }
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