<template>
  <div class="app-container">
    <el-row class="el-center" :gutter="15">
      <el-form  :model="queryParams" ref="queryForm">
        <el-col :span="6">
          <el-form-item label="标题" prop="title">
            <el-input v-model="queryParams.title" placeholder="请输入标题名称" size="small"  clearable class = 'feedInput'/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item label="反馈状态" prop="replyStatus">
              <el-select v-model="queryParams.replyStatus" placeholder="请选择反馈状态"  clearable size="small" class="feedInput">
                <el-option v-for="dict in statusOptions" 
                :key="dict.dictValue" 
                :label="dict.dictLabel" 
                :value="dict.dictValue" 
                />
              </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item style="width:220px">
                <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-col>
      </el-form>
    </el-row>
        
        <el-table  v-loading="loading" :data="menuList" row-key="id"  >
            <el-table-column label="反馈人" align="center" prop="userName" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.userName }}</span>
                </template>
            </el-table-column>
            
            <el-table-column label="部门名称" align="center" prop="deptName">
                <template slot-scope="scope">
                  <span>{{ scope.row.deptName }}</span>
                </template>
            </el-table-column>

            <el-input-number v-model="form.orderNum" controls-position="center" :min="0" />
            <el-table-column prop="title" label="标题" :show-overflow-tooltip="true" class = 'menuName' align="center" v-model="queryParams.replyStatus">
                <template slot-scope="scope">
                  <span>{{ scope.row.title }}</span>
                </template>
            </el-table-column>
            <el-table-column label="内容" align="center" prop="content" :show-overflow-tooltip='true'>
                <template slot-scope="scope">
                  <span>{{ scope.row.content }}</span>
                </template>
            </el-table-column>
             
            <el-table-column label="反馈时间" align="center" prop="createTime">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
           
            <el-table-column prop="replyStatus" label="反馈状态"  v-model="queryParams.replyStatus"  class="status" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.replyStatus === "0" ?"已回复":"未回复" }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                   <el-button size="mini"  type="text" @click = 'handleShow(scope.row)'>{{ scope.row.replyStatus === "1" ? "回复" : "查看"}}</el-button>
                </template>
        </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"  />
    <!-- 点击查看  弹出的模态框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" :close-on-press-escape="false" :close-on-click-modal="false"  append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-row>
           <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input   :disabled="true" v-model="showFrom.title"/>
            </el-form-item>
          </el-col>

           <el-col :span="12">
            <el-form-item label="反馈人"  prop="userName">
              <el-input   :disabled="true" v-model="showFrom.userName"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="反馈部门"  prop="deptName" :show-overflow-tooltip='true'>
               <el-input   :disabled="true" v-model="showFrom.deptName"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
              <el-form-item label="反馈时间"  prop="createTime">
                <el-input   :disabled="true" v-model="showFrom.createTime"/>
              </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="联系方式"  prop="contactPhone">
                <el-input  :disabled="true" v-model="showFrom.contactPhone"/>
            </el-form-item>
          </el-col>
        
          <el-col :span="12">
            <el-form-item label="身份证号"  prop="identityNum">
                <el-input  :disabled="true" v-model="showFrom.identityNum"/>
            </el-form-item>
          </el-col>
          
          <el-col :span="24">
            <el-form-item label="内容" prop="content">
               <el-input   :disabled="true" type="textarea" v-model="showFrom.content" rows= 3 />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  v-if="showFrom.replyStatus == '0'&&'1'">
          <el-col :span="24">
            <el-form-item label="反馈回复"  prop="replyContent">
              <el-input  type="textarea" :disabled="true" v-model="showFrom.replyContent" rows= 3 />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="showFrom.replyStatus == '1' ">
          <el-col :span="24">
            <el-form-item label="反馈回复"  prop="replyContent">
                <el-input type="textarea" placeholder="请输入反馈回复内容" v-model="showFrom.replyContent" rows= 3  maxlength = 300></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm()" v-if="showFrom.replyStatus == '1' " >回复</el-button>
        <el-button @click="cancel" v-if="showFrom.replyStatus == '0'||'1'">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMenu, getFrom, replyMenu } from "@/api/feedback/complaintFeedback";
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
      // 查看from列表数据
      showFrom: [],
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
        pageNum: 1,
        pageSize: 10,
        replyStatus: "",
        },
      form:{},
      // 查看表单
      showFrom :[],
      // 表单校验
      rules: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger:[ 'blur', 'change'] }
        ],
        sortNum: [
          { required: true, message: "菜单顺序不能为空", trigger:[ 'blur', 'change'] }
        ],
        path: [
          { required: true, message: "路由地址不能为空", trigger:[ 'blur', 'change'] }
        ]
      
      },
      id:''
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
            // console.log('------',response);
            this.menuList = response.data.rows;
            this.total = response.data.total;
            this.id = response.data.rows.id
            this.loading = false;
        }).catch(() =>{})
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
          replyStatus: undefined
        };
        this.resetForm("form");
      },
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
    handleShow(row){
        this.open = true;
        this.title = "查看菜单";
        getFrom(row.id).then(response =>{
          this.showFrom = response.data;
        })
    },
    /** 回复按钮 */
    submitForm() {
          if (!this.showFrom.replyContent) {
              this.msgError("请填写回复内容");
          } else {
           replyMenu(this.showFrom.id,this.showFrom.replyContent).then( response =>{
             console.log('replyContent',this.showFrom.replyContent);
              this.msgSuccess("回复成功");
              this.getList();
              this.open = false;
           }).catch( ()=>{})
          }
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

.feedInput{
width: 70%
}
.el-dialog{
overflow-x: auto;

.el-upload__tip{
display: inline-block;

}
}
}

</style>
<style>
.el-tooltip__popper{font-size: 14px; max-width:20%;word-wrap:break-word;}
</style>

