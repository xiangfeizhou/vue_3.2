.<template>
  <div class="login-container">
    <el-form ref="formRef" :model="form" class="login-form" :rules="rules">
      <div class="title-container">
        <h3 class="title">用户登入</h3>
      </div>
      <el-form-item prop="username">
        <el-icon :size="20" class="svg-container"><avatar /></el-icon>
        <!--         
        <el-icon :size="20" class="svg-container">
      <edit></edit>
    </el-icon> -->
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <!-- 密码框 -->
      <el-form-item prop="password">
        <el-icon :size="20" class="svg-container"><lock /></el-icon>
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-button type="primary" class="login-button" @click="submitForm">登入</el-button>
    </el-form>
    <!-- 登入按钮 -->
  </div>
</template>

<script setup>
import { Edit, Avatar, Lock } from "@element-plus/icons-vue";
import {login} from '@/api/login'
import { ref,getCurrentInstance } from "vue";
import axios from 'axios'
const form = ref({
  username: "",
  password: "",
});
const rules = ref({
  username: [
    {
      required: true,
      message: "必填项",
      trigger: "blur",
    },
  ],
  password:[
      {
          required: true,
      message: "密码没有填写",
      trigger: "blur", 
      }
  ]
});
  function loginPost(username1,password2){
     axios.post('https://lianghj.top:8888/api/private/v1/',{
          username:username1,
          password:password2
      }).then(function(result){
          console.log(result);
      })
      
  }
//登入方法
 const formRef=ref(null)
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loginPost(form.value.username,form.value.password)
      console.log('submit!')
    } else {
      console.log('error submit!')
      return false
    }
  })

}
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
$cursor: #fff;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

    ::v-deep .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }

    ::v-deep .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;
      }
    }
    .login-button {
      width: 100%;
      box-sizing: border-box;
    }
  }

  .tips {
    font-size: 16px;
    line-height: 28px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    ::v-deep .lang-select {
      position: absolute;
      top: 4px;
      right: 0;
      background-color: white;
      font-size: 22px;
      padding: 4px;
      border-radius: 4px;
      cursor: pointer;
    }
  }

  .show-pwd {
    // position: absolute;
    // right: 10px;
    // top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>