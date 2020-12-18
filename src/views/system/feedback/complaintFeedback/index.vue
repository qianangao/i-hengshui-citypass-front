<template>
  <div class="app-container">
    <el-row class="el-center" :gutter="15">
      <el-form  :model="queryParams" ref="queryForm">
        <el-col :span="6">
          <el-form-item label="标题" prop="title">
            <el-input v-model="queryParams.title" placeholder="请输入标题名称" clearable size="small" class='feedInput'/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item label="反馈状态" prop="replyStatus">
              <el-select v-model="queryParams.replyStatus" placeholder="请选择反馈状态"  clearable size="small" class="feedInput">
                <el-option v-for="dict in statusOptions" 
                :key="dict.dictValue" 
                :label="dict.dictLabel" 
                :value="dict.dictValue"/>
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
    <!-- table -->
    <el-table v-loading="loading" :data="menuList">
      <el-table-column label="标题" prop="title" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="内容" prop="content" align="center" :show-overflow-tooltip='true'></el-table-column>
      <el-table-column label="反馈人" prop="userName" align="center"></el-table-column>
      <el-table-column label="反馈时间" prop="createTime" align="center"></el-table-column>
      <el-table-column label="部门名称" prop="deptName" align="center"></el-table-column>
      <el-table-column label="反馈状态" prop="replyStatus" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.replyStatus === "0" ?"已回复":"未回复" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-if="checkPermi(['system:feedback:complaintFeedback:reply'])">
        <template slot-scope="scope">
          <el-button size="mini" type="text" v-hasPermi="[scope.row.replyStatus==1?'system:feedback:complaintFeedback:reply':'']" @click='handleShow(scope.row)'>{{ scope.row.replyStatus === "1" ? "回复" : "查看"}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    <!-- 点击查看  弹出的模态框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" :close-on-press-escape="false" :close-on-click-modal="false"  append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-row>
           <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input :disabled="true" v-model="showFrom.title"/>
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="反馈人"  prop="userName">
              <el-input :disabled="true" v-model="showFrom.userName"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="反馈部门"  prop="deptName" :show-overflow-tooltip='true'>
               <el-input :disabled="true" v-model="showFrom.deptName"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
              <el-form-item label="反馈时间"  prop="createTime">
                <el-input :disabled="true" v-model="showFrom.createTime"/>
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式"  prop="contactPhone">
                <el-input :disabled="true" v-model="showFrom.contactPhone"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号"  prop="identityNum">
                <el-input :disabled="true" v-model="showFrom.identityNum"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容" prop="content">
               <el-input  :disabled="true" type="textarea" v-model="showFrom.content" :rows="3" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  v-if="showFrom.replyStatus==='0'">
          <el-col :span="24">
            <el-form-item label="反馈回复"  prop="replyContent">
              <el-input  type="textarea" :disabled="true" v-model="showFrom.replyContent" :rows="3"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="showFrom.replyStatus==='1'">
          <el-col :span="24">
            <el-form-item label="反馈回复"  prop="replyContent">
                <el-input type="textarea" placeholder="请输入反馈回复内容" v-model="showFrom.replyContent" :rows="3"  maxlength="300"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm()" v-if="showFrom.replyStatus==='1'" >回复</el-button>
        <el-button @click="cancel">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMenu, getFrom, replyMenu } from "@/api/feedback/complaintFeedback";
import { checkPermi, checkRole } from "@/utils/permission"; // 权限判断函数
export default {
  name: "dict",
  components: { },
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
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        replyStatus: undefined,
      },
      form:{},
      // 查看表单
      showFrom :[],
      // 表单校验
      rules: {
        sortNum: [
          { required: true, message: "菜单顺序不能为空", trigger:[ 'blur', 'change'] }
        ],      
      },
      id:''
      }
    },
    created() {
        this.getList();
    },
    methods: {
       checkPermi,
    checkRole,
      /** 查询菜单列表 */
      getList() {
        this.loading = true;
        listMenu(this.queryParams).then(response => {
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
          icon: undefined,
          menuType: "M",
          replyStatus: undefined
        };
        this.resetForm("form");
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 查询按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      // 查看操作按钮
      handleShow(row){
        this.open = true;
        this.title = row.replyStatus === "0" ?"查看":"回复";
        getFrom(row.id).then(response =>{
          if(response.code===200){
          this.showFrom = response.data;
          }else{
          this.$message.error(response.msg)
          }
          
        })
      },
      /** 回复按钮 */
      submitForm() {
        if (!this.showFrom.replyContent) {
            this.msgError("请填写回复内容");
        } else {
          replyMenu(this.showFrom.id,this.showFrom.replyContent).then( response =>{
            if(response.code===200){
            this.msgSuccess("回复成功");
            this.getList();
            this.open = false;
            }else{
            this.$message.error(response.msg)
            }
           
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
.feedInput{
  width: 70%
}
</style>
<style>
.el-tooltip__popper{
  font-size: 14px;
  max-width:20%;
  word-wrap:break-word;
}
</style>

