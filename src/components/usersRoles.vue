.<template>
<!-- 分配角色对话框组件 -->
  <el-dialog
    :model-value="usersRolesDone"
    title="分配角色"
    width="30%"
    @close="closeUserRolesDialog"
  >

  <!-- select选择器 -->
  <div>
      当前用户
  </div>
    <el-select v-model="rolesId" class="m-2" placeholder="Select" size="large">
    <el-option
      v-for="item in userRolesList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id"
    />
  </el-select>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeUserRolesDialog">取消</el-button>
        <el-button type="primary" @click="editUsersRoles"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
 
</template>

<script setup>
import{ref,defineEmits,onMounted,defineProps} from 'vue'
import axios from 'axios'
import {ElMessage} from 'element-plus'
    //对话框绑定的默认值,实际值从父组件v-model传过来
   let usersRolesDone=ref(false);

    
   const rolesId = ref('');
   const userRolesList=ref([]);
    const emit=defineEmits(['update:modelValue','success']);

    const props=defineProps({
        // 父组件传过来的用户id
        userId:{
            
        }

        

    })
   //对话框关闭时触发事件
   const closeUserRolesDialog=()=>{
       emit('update:modelValue',false);
   }


   
   
   onMounted(() => {
       console.log('usersRoles声明周期');
       getRoleList();
   })
   //获取角色列表
   const getRoleList=async()=>{
      const{data:res}=await axios.get('roles');
      userRolesList.value=res.data;
      console.log(res);
   }
   //分配角色方法
   const editUsersRoles=async()=>{
       console.log('id',props.userId);
       console.log('value',rolesId.value);
       if(!rolesId.value){
         return  ElMessage.info('请选择角色')
       }
     const{data:res}=await  axios.put(`users/${props.userId}/role`,{
           rid:rolesId.value
       })
       if(res.meta.status===200){
          
           ElMessage.success('分配角色成功')
           emit('success');
       }else{
           ElMessage.error(res.meta.msg);
       }
       closeUserRolesDialog()
       console.log(res);
   }
</script>

<style>

</style>