<template>
  <div class="about">
    <el-button type="primary" @click="dialogVisible = true"
      >添加新用户</el-button
    >
    <el-table :data="list" style="width: 800px">
      <el-table-column prop="name" label="姓名" width="180" />
      <el-table-column prop="age" label="年龄" width="180" />
      <el-table-column prop="position" label="职位" />
      <el-table-column label="时间">
        <template #default="{ row }">
          {{ row.addtime }}
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="{ row }">
          <router-link to="">更多</router-link>
          &nbsp
          <el-button type="text" @click="open(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 对话框 -->
  <el-dialog
    v-model="dialogVisible"
    title="添加新用户"
    width="30%"
    @close="closeClick"
  >
    <!-- form表单主体 -->
    <el-form :model="from" :rules="rules" ref="userForm">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="from.name"></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model="from.age"></el-input>
      </el-form-item>
      <el-form-item label="头衔" prop="position">
        <el-input v-model="from.position"></el-input>
      </el-form-item>
    </el-form>

    <!-- 对话框底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="verifyClick">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
// import { Loading } from '@element-plus/icons-vue/dist/types';
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { reactive, onMounted, ref } from "vue";
let list = ref([]);
let dialogVisible = ref(false);
let userForm = ref(null); //获取对话框中表单的组件实例
let from = ref({
  name: "",
  age: "",
  position: "",
});
const rules = reactive({
  name: [
    {
      required: true,
      message: "必填项",
      trigger: "blur",
    },
  ],
  age: [
    {
      required: true,
      message: "必填项",
      trigger: "blur",
    },
  ],
  position: [
    {
      required: true,
      message: "必填项",
      trigger: "blur",
    },
  ],
});
//生命周期函数
onMounted(() => {
  getUserList();
});
//获取userlist方法
async function getUserList() {
  const { data: res } = await axios.get("/api/users");
  if (res.status !== 0) {
    console.log("请求失败");
    return;
  }
  //  console.log(res);
  list.value = res.data;
}
console.log(list);
// getUserList();
//对话框关闭事件
function closeClick() {
  userForm.value.resetFields();
}

//提交时验证对话框表单
function verifyClick() {
  userForm.value.validate(async (result) => {
    if (result) {
      //验证成功添加用户操作
      //  const {data:res}=await axios.post('/api/users',{
      //      name:from.value.name,
      //      age:from.value.age,
      //      position:from.value.position
      //   })
      const { data: res } = await axios.post("/api/users", from.value);
      if (res.status === 0) {
        ElMessage({
          message: "添加成功",
          type: "success",
        });
        getUserList();
        dialogVisible.value = false;
      } else {
        ElMessage.error("添加失败");
      }
      console.log(res);
    }
  });
}

// 删除用户的ajax请求方法
function delUserId(id) {
  axios
    .delete("/api/users/" + id)
    .then((reuslt) => {
      if (reuslt.data.status === 0) {
        //重新渲染数据
        getUserList();
        ElMessage({
          type: "success",
          message: "删除成功",
        });
      } else {
        ElMessage.error("删除失败");
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
// 删除用户的方法
function open(id) {
  ElMessageBox.confirm("此操作将永久删除该用户,是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      delUserId(id);
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "操作取消",
      });
    });
}
</script>

<style scoped>
.about {
  width: 800px;
  margin: 0 auto;
}
</style>