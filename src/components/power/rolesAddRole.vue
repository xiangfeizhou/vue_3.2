.<template>
  <!-- 添加角色对话框 -->
  <el-dialog
    :model-value="dialogVisible"
    :title="title"
    width="30%"
    @close="closeValue"
  >
  <!-- 表单主体 -->
    <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="80px"
    
  >
    <el-form-item label="角色名称" prop="roleName">
      <el-input v-model="ruleForm.roleName"  autocomplete="off" />
    </el-form-item>
    <el-form-item label="角色描述" prop="roleDesc">
      <el-input
        v-model="ruleForm.roleDesc"
        autocomplete="off"
      />
    </el-form-item>
  
   
  </el-form>

  <!-- 底部按钮 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeValue">取消</el-button>
        <el-button type="primary" @click="addEditRoles"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
    import{defineProps,defineEmits,ref,watch} from 'vue'
    import axios from 'axios'
    import{ElMessage} from 'element-plus'
    
    //控制对话框显示的值
    const dialogVisible=ref(false);
    //表单内容
    const ruleForm=ref({
        roleName:'',
        roleDesc:''
    })
    //获取表单组件实例
        let ruleFormRef=ref(null);
        //表单校验
    const rules=ref({
        roleName: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    }
    ],
     roleDesc: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur',
    }
    ]

    })

    const props=defineProps({
        title:{
            type:String,
            default:''
        },
        editRoleRow:{
            type:Object,
            default:()=>{}
        }
    })
    watch(()=>props.editRoleRow,()=>{
        ruleForm.value=props.editRoleRow;
        // console.log(props.editRoleRow);
    },{deep:true,immediate:true})
    
    

    //定义自定义事件修改dialogVisible 控制对话框的显示
    const emit = defineEmits(["update:modelValue", "newgetuser"]);
    //对话框关闭销毁文本框的值
    const closeValue=()=>{
        ruleFormRef.value.resetFields();
        emit('update:modelValue',false);
    }

    //添加角色和修改角色
    const addEditRoles=()=>{      
        ruleFormRef.value.validate((val)=>{
            if(!val){
                return
            }
            if(props.title==='添加角色'){
                addRole(); 
            }else{
                ReviseRole();
            }   
            
        closeValue();
        })
    }
    //添加角色方法
    const addRole=async()=>{
         const{data:res}= await axios.post('roles',ruleForm.value);
        if(res.meta.status===201){
            ElMessage.success(res.meta.msg);
            emit('newgetuser');
        }else{
            ElMessage.success('创建失败');
        }
    }
    //修改角色方法
    const ReviseRole=async()=>{
      const{data:res}= await axios.put(`roles/${ruleForm.value.id}`,ruleForm.value)
        if(res.meta.status===200){
            ElMessage.success('修改成功');
            emit('newgetuser');
        }else{
            ElMessage.error('修改失败');
        }
    }
</script>

<style>

</style>