.<template>
  <!-- 添加用户对话框 -->
  <el-dialog
    :model-value="done"
    :title="dialogTitle"
    width="500px"
    @close="DialogClose"
  >
    <!-- 添加用户的表单 -->
    <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef">
      <el-form-item label="用户名" :label-width="70" prop="username">
        <el-input v-model="addFrom.username" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="70" prop="password" v-if="dialogTitle==='添加用户'">
        <el-input v-model="addFrom.password" clearable></el-input>
      </el-form-item>
      <el-form-item label="邮箱" :label-width="70" prop="email">
        <el-input v-model="addFrom.email" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机" :label-width="70" prop="mobile">
        <el-input v-model.number="addFrom.mobile" clearable></el-input>
      </el-form-item>
    </el-form>

    <!-- 底部两个按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="DialogClose">取消</el-button>
        <el-button type="primary" @click="adduser">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineProps, ref, reactive, defineEmits,watch } from "vue";
import { Edit } from "@element-plus/icons-vue";
import axios from "axios";
import { ElMessage } from "element-plus";

//定义emit事件
const emit = defineEmits(["update:modelValue", "newgetuser"]);
let props = defineProps({
  dialogTitle: {
    type: String,
    default: "",
  },
  addrevise:{
    type:Object,
    default:()=>{}
  }
});
let done = ref(false);
let dialog2 = ref(true);
let addFromRef = ref(null);
// 添加用户表单数据
// let addFrom = reactive({
//   username: "",
//   password: "",
//   email: "",
//   mobile: "",
// });
let addFrom=ref({
  username: "",
  password: "",
  email: "",
  mobile: 0,
})

//添加表单验证规则对象
const addFromRules = reactive({
  username: [
    {
      required: true,
      message: "请填写用户名",
      trigger: "blur",
    },
    {
      min: 3,
      max: 10,
      message: "用户名长度在3~10个字符之间",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "请填写密码",
      trigger: "blur",
    },
    {
      min: 3,
      max: 10,
      message: "密码长度在8~15个字符之间",
      trigger: "blur",
    },
  ],
  email: [
    {
      required: true,
      message: "请填写邮箱",
      trigger: "blur",
    },
    {
      type: "email",
      message: "请填写正确邮箱",
      trigger: ["blur"],
    },
    // ,
    // {
    //   validator: checkEmail,trigger:'blur'
    // }
  ],
  mobile: [
    {
      required: true,
      message: "请填写手机号",
      trigger: "blur",
    },
    {
      type: "number",
      message: "手机号必须是数字",
    },
  ],
});
//邮箱校验
const checkEmail = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请填写邮箱"));
  }
  const eml =
    /^([a-zA-Z0-9]+[_|_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
  if (eml.test(value)) {
    return callback();
  } else {
    callback(new Error("请输入正确的邮箱"));
  }
};

//监听addrevise
watch(()=>props.addrevise,()=>{
  // console.log("watch",props.addrevise);
  addFrom.value=props.addrevise
  // if(addFrom.value.mobile instanceof Number){
  //   console.log('是一个数字');
  // }else{
  //   console.log('不是一个数字');
  // }
  // console.log(12222222);
  console.log('手机号的数据类型是:',typeof(addFrom.value.mobile));
  // console.log("watchjkl",addFrom.value.email,"id"+addFrom.value.mobile);
},{deep:true,immediate:true})



//添加新用户
const adduser = () => {
  addFromRef.value.validate(async (callback) => {
    if (!callback) return;
    //发起post请求
    
    if(props.dialogTitle==='添加用户'){
      const { data: res } = await axios.post("users", addFrom.value);
        if (res.meta.status === 201) {
        ElMessage.success(res.meta.msg);
        emit("newgetuser"); //添加成功后重新获取list
        } else {
        ElMessage.error("添加用户失败");
        }
    }else{
     const{data:res}= await reviseuser();
  //  const{data:result}=await axios.put(`users/${addFrom.value.id}`,{email:addFrom.value.email,mobile:addFrom.value.mobile})
      if (res.meta.status === 200) {
        ElMessage.success(res.meta.msg);
        emit("newgetuser"); //添加成功后重新获取list
        } else {
        ElMessage.error("修改用户失败");
        }
        console.log(res);
    }
    // console.log(res);
    DialogClose();
  });
};
//对话框的关闭
const DialogClose = () => {
  emit("update:modelValue", false);
  addFromRef.value.resetFields();
};
// 修改数据ajax请求
const reviseuser = () => {
 return axios.put(`users/${addFrom.value.id}`,addFrom.value)

};

//添加和修改总方法
const addRevis=(row)=>{

}
</script>

<style>
</style>