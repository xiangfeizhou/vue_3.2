.<template>
  <div>
    <el-form ref="formRef" :model="from" label-width="120px" :rules="rules">
      <el-form-item label="用户名">
        <el-input v-model="from.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="from.password" type="password"></el-input>
      </el-form-item>
      <el-button type="primary" @click="userLogin">登入</el-button>
    </el-form>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, reactive } from "vue";
import { login } from "../request/userLogin.js";
const from = ref({
  username: "admin",
  password: "123456",
});
// 表单验证
const rules = reactive({
  username: [
    {
      required: true,
      message: "Please input Activity name",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "Please input Activity name",
      trigger: "blur",
    },
  ],
});

//获取form表单组件实例
let formRef=ref(null);
const userLogin = () => {
    formRef.value.validate(async(result)=>{
        // if(result){
        //  const{data:res}= await login(from.value);
        //  console.log(res);
        // }
      const res= await login(from.value)
      // console.log(res);
    })
  
};
</script>

<style>
</style>