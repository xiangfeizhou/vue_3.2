<template>
  <div class="home">
    <h1>用户登入</h1>
 <el-form ref="formRef" :model="form" label-width="70px" :rules="rules">
    <el-form-item label="用户名" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
   
   <el-form-item label="密码" prop="password">
      <el-input v-model="form.password"></el-input>
    </el-form-item>
  </el-form>
  
   <el-button type="primary" class="jkl" @click="clickLogin">登入</el-button>
   <el-button type="primary" @click="resope">重置</el-button>
  </div>
</template>

<script setup>
import { reactive} from "@vue/reactivity";
import {ref} from 'vue'
import { ElMessage } from 'element-plus'
import {useRouter} from 'vue-router'

// @ is an alias to /src
 const form=reactive({
   name:'',
   password:''
 })
 const rules=reactive({
   name:[
     {
       required: true,
      message: '必填项',
      trigger: 'blur',
     }
   ],
    password:[
      {
        required: true,
      message: '必填项',
      trigger: 'blur',
      }
    ]
 });
 //创建路由实例
 const router=useRouter()
 //登入方法
 const formRef=ref(null)
   const clickLogin=()=>{
     formRef.value.validate((valid) => {
    if (valid) {
      if(form.name==="admin" && form.password==="123456"){
        router.push({
          name:'About'
        })
        console.log('成功');
      }else{
        console.log('失败');
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
   }
   //重置函数
   const resope=()=>{
     console.log(123);
     ElMessage.error('Oops, this is a error message.')
     formRef.value.resetFields()
   }
</script>

<style scoped>
    .home{
      width: 500px;
      height: 300px;
      text-align: center;
      margin: 300px auto;
      /* vertical-align:middel */
      /* background-color: pink; */
      padding-top: 50px;
    }
    .jkl{
      margin-left: 5px;
    }
    /* h{
      margin-bottom: 30px;
    } */
   
</style>