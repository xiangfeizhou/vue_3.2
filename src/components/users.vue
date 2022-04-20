.<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: 'userList' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片视图 -->
  <el-card class="box-card">
    <el-row :gutter="15">
      <el-col :span="10">
        <el-input
          placeholder="请输入内容"
          v-model="list.query"
          clearable
          @clear="getUserList"
        >
          <template #append>
            <el-button :icon="Search" @click="getUserList"></el-button>
          </template>
        </el-input>
      </el-col>


      <el-col :span="4">
        <el-button
          type="primary"
          @click="reviseUser()"
          >添加用户</el-button
        >
      </el-col>
    </el-row>
    <!-- list渲染 -->
    <el-table :data="userlist.users" style="width: 100%">
      <el-table-column type="index" label="序号" width="70px" />
      <el-table-column prop="username" label="姓名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="role_name" label="角色" />
      <el-table-column prop="create_time" label="电话" />

      <el-table-column label="状态">
        <template #default="{ row }">
          <el-switch v-model="row.mg_state" @change="userStateChanged(row)" />
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <!-- 插槽 -->
        <template #default="{row}">
          <el-tooltip 
          class="box-item"
            effect="light"
            content="修改用户"
            placement="left"
            :enterable="false"
          >
          <el-button
            type="primary"
            :icon="Edit"
            circle
            @click="reviseUser(row)"
          ></el-button>
          </el-tooltip>
          <el-button type="danger" :icon="Delete" circle @click="delUser(row.id)"></el-button>

          <el-tooltip
            class="box-item"
            effect="light"
            content="分配角色"
            placement="right"
            :enterable="false"
          >
            <el-button type="warning" :icon="Setting" circle @click="editusersRoles(row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:currentPage="list.pagenum"
      v-model:page-size="list.pagesize"
      :page-sizes="[5, 10]"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </el-card>
<!-- <component :is="done ? ReviseUserDialog : ''"></component> -->
  <ReviseUserDialog
    v-model="done"
    :dialogTitle="dialogTitle"
    @newgetuser="newgetuser"
    :addrevise="addrevise"
  ></ReviseUserDialog>

<!-- 分配角色对话框组件 -->

<usersRoles v-model="usersRolesDone" :userId="userId" @success="getUserList"></usersRoles>
</template>

<script setup>
import { ref, onMounted, reactive, toRef } from "vue";
import axios from "axios";
import { ArrowRight, } from "@element-plus/icons-vue";
import { Search, Edit, Check, Delete, Setting } from "@element-plus/icons-vue";
import { ElMessage,ElMessageBox } from "element-plus";
import ReviseUserDialog from "./ReviseUserDialog.vue";
import usersRoles from './usersRoles.vue'
let done = ref(false);
//控制修改组件对话框的变量
let reviseValue = ref(false);
//控制对话框显示和隐藏
let dialogFormVisible = ref(false);
let inputValue = ref("");

//子组件标题
let dialogTitle = ref("");
// const userlist=ref();
const list = reactive({
  query: "",
  // 当前的页数
  pagenum: 1,
  //每页显示多少条
  pagesize: 5,
});
let total = ref(0);
let userlist = ref([]);
let todolist = reactive([]);
// 获取表单组件实例
let addFromRef = ref(null);
//编辑用户传送给子组件的对象
let addrevise=ref({})
onMounted(() => {
  getUserList();
});

//获取用户列表数据
const getUserList = async () => {
  const { data: res } = await axios.get("users", { params: list });
  if (res.meta.status !== 200) {
    return ElMessage.error(res.meta.msg);
  }
  userlist.value = res.data;
  total.value = res.data.total;
  console.log('角色列表',userlist.value);
  //    jkl=toRef(todolist,'users');
};
// 更新每页显示的数量
const handleSizeChange = (val) => {
  list.pagesize = val;
  getUserList();
  console.log("sizechange" + val);
};
// 更新当前的页数
const handleCurrentChange = (val) => {
  list.pagenum = val;
  getUserList();
};

// 更改用户的状态
const userStateChanged = async (row) => {
  const { data: res } = await axios.put(
    `users/${row.id}/state/${row.mg_state}`
  );
  if (res.meta.status !== 200) {
    row.mg_state = !row.mg_state;
    return ElMessage.error("更新用户状态失败");
  }
  ElMessage.success(res.meta.msg);
};

//对话框关闭清空文本框内容和校验内容
const DialogClose = () => {
  addFromRef.value.resetFields();
};

//修改用户,row是用户对象
const reviseUser = (row) => {
  done.value = true;
  if(row){
    row.mobile=parseInt(row.mobile);
    addrevise.value=JSON.parse(JSON.stringify(row));
    dialogTitle.value = "修改用户";
  }else{
    addrevise.value={};
    dialogTitle.value = "添加用户";
  }
  
  // console.log("进入了这个方法",addrevise.value);
  // reviseValue.value=true
};

//update自定义事件
const update = (val) => {
  console.log("update" + val);
  // done.value=false
};
//通过id删除用户
const delUser=(id)=>{
  ElMessageBox.confirm(
    '将永久删除该用户?',
    '删除操作',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
     deleuserss(id)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '操作取消',
      })
    })


 
 
}
//删除用户方法
const deleuserss=async(id)=>{
   const{data:res}=await axios.delete(`users/${id}`)
            if(res.meta.status===200){
        ElMessage.success(res.meta.msg);
        getUserList();
      }else{
        ElMessage.error("删除用户失败");
      }
}
//添加用户和修改用户之后重新获取list
const newgetuser = () => {
  getUserList();
};

//分配角色
//传递给子组件用户id
let userId=ref('');
//控制分配角色对话框显示隐藏的变量
let usersRolesDone=ref(false);
const editusersRoles=(id)=>{
  console.log('id',id);
  userId.value=id;
  usersRolesDone.value=true;

}
</script>

<style scoped>
.box-card {
  margin-top: 15px;
  font-size: 12px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-pagination {
  margin-top: 15px;
}

.el-dialog__body {
  padding-bottom: 0px !important;
}
</style>