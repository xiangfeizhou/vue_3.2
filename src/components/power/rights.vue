.<template>
    <!-- 面包屑 -->
    <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: 'userList' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片视图 -->
   <el-card class="box-card">
       <!-- table表格 -->
    <el-table :data="rightsList" style="width: 100%" border stripe>
    <el-table-column type="index" label="序号" width="100px"></el-table-column>
    <el-table-column prop="authName" label="权限名称" />
    <el-table-column prop="path" label="路径"  />
    <el-table-column prop="level" label="权限等级" >
        <template #default="{row}">
            <el-tag v-if="row.level==='0'">一级权限</el-tag>
            <el-tag v-else-if="row.level==='1'" class="ml-2" type="success">二级权限</el-tag>
            <el-tag v-else class="ml-2" type="warning">三级权限</el-tag>
        </template>

    </el-table-column>
  </el-table>
  </el-card>
</template>

<script setup>
import{reactive,ref,onMounted}from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import{ElMessage} from 'element-plus'
import axios from 'axios'

//权限列表
const rightsList=ref([]);

onMounted(() => {
    //获取所有的权限
    getRigthsList();
})

//获取权限列表
const getRigthsList=async()=>{
  const{data:res}= await axios.get('rights/list');
  console.log('data',res);
  if(res.meta.status!==200){
    return  ElMessage.error('获取权限列表失败')
  }
  rightsList.value=res.data

}

</script>

<style>
.el-card{
    margin-top: 15px;
}
</style>