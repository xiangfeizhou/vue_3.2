.<template>
   <!-- 面包屑 -->
    <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: 'userList' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>

    <!-- 卡片视图 -->
   <el-card class="box-card">
        <!-- 添加角色   -->
    <el-button type="primary" @click="addLole">添加角色</el-button>
       <!-- table表格 -->
    <el-table :data="rolelist" row-key="id" style="width: 100%" border stripe>
        <!-- 展开列 -->
    <el-table-column type="expand">
        <template #default="{row}">
            <el-row v-for="(item1,i1) in row.children" :key="item1.id"
             
            >
            <!-- 渲染一级权限 -->
            <el-col :span="5">
                <el-tag closable @close="closeTag(row,item1.id)">{{item1.authName}}</el-tag>
                <el-icon><caret-right /></el-icon>
               
            </el-col>
            <!-- 渲染二级权限 -->
            <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row class="row2" v-for="(item2,i2) in item1.children" :key="item2.id"
                 
                >
                    <el-col :span="6">
                        <el-tag @close="closeTag(row,item2.id)" class="ml-2" type="success" closable>
                            {{item2.authName}}
                        </el-tag>
                    </el-col>
                <!-- 三级菜单 -->
                    <el-col :span="18">
                        <el-tag closable class="ml-2 tag3" type="warning" v-for="(item3,i3) in item2.children" :key="item3.id"
                        @close="closeTag(row,item3.id)"
                        >
                     
                            {{item3.authName}}
                        </el-tag>
                    </el-col>
                </el-row>

            </el-col>
            <!--  -->
        </el-row>
        </template>
       
    </el-table-column>
    <el-table-column type="index" label="序号" width="100px"></el-table-column>
    <el-table-column prop="roleName" label="角色名称" />
    <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
    <el-table-column  label="操作" >
        <template #default="{row}">
            <el-button size="small" type="primary" :icon="Edit" @click="editRole(row)">编辑</el-button>
            <el-button size="small" type="danger" :icon="Delete" @click="delRole(row.id)">删除</el-button>
             <!-- <el-button size="small" type="danger" :icon="Setting" @click="showSetRightDialog(row)">分配权限</el-button> -->

            <el-button size="small" type="warning" :icon="Setting" @click="ermissionList(row)">分配权限</el-button>
        </template>

    </el-table-column>
  </el-table>
  </el-card>

    <!--添加修改 对话框子组件 -->
   <rolesAddRole 
   v-model="dialogVisible" 
   @newgetuser="getRolesList"
   :title="title"
   :editRoleRow="editRoleRow"
   ></rolesAddRole>

    <!-- 分配权限子组件 -->
    <!-- <rolesPermissionDialog v-model="state" :permissRowList="permissRowList"></rolesPermissionDialog> -->

    <el-dialog
  v-model="state"
  width="30%"
  @close="closeDialog"
  title="分配权限"
  >

<el-tree :data="permissList" :props="defaultProps" show-checkbox 
 default-expand-all
 node-key="id"
 :default-checked-keys="defKeys"
 ref="treeRef"
/>
<!-- 底部按钮 -->
<template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="addRolesPermission"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import{reactive,ref,onMounted}from 'vue'
import { ArrowRight,Edit,Delete,Setting,Danger,CaretRight } from '@element-plus/icons-vue'
import{ElMessage,ElMessageBox} from 'element-plus'
import axios from 'axios'
import rolesAddRole from './rolesAddRole.vue'
import rolesPermissionDialog from './rolesPermissionDialog.vue'
//获取所有角色列表数据
const rolelist=ref([]);
//控制对话框显示变量
let dialogVisible=ref(false);
onMounted(() => {
    getRolesList()
})
//传递给rolesAddRole组件的Row角色对象
const editRoleRow=ref({});

//传递给rolesAddRole组件的对话框标题
const title=ref('');

//控制子组件分配角色对话框显示和隐藏的变量
let state=ref(false);

//传递给权限对话框组件的值
const permissRowList=ref({});
//获取所有角色列表
const getRolesList=async()=>{
    const{data:res}=await axios.get('roles');
    if(res.meta.status!==200){
        return ElMessage.error('获取角色列表失败');
    }
    rolelist.value=res.data;
    console.log(res.data);
}
//添加角色
const addLole=()=>{
    title.value='添加角色';
    dialogVisible.value=true;
    editRoleRow.value={}
}
//删除角色
const delRole=(id)=>{
    ElMessageBox.confirm(
    '该角色将永久删除?',
    '删除操作',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
       deleteRole(id);
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '操作取消',
      })
    })
}

//删除角色方法
const deleteRole=async(id)=>{
   const{data:res}=await axios.delete(`roles/${id}`);
   if(res.meta.status===200){
       ElMessage.success(res.meta.msg);
       getRolesList();
   }else{
       ElMessage.error('删除失败');
   }
}

//删除角色指定权限
const closeTag=async(row,item)=>{
  const{data:res}=await axios.delete(`roles/${row.id}/rights/${item}`);
    if(res.meta.status!==200){
       return ElMessage.error('删除失败');
    }
    ElMessage.success('删除成功');
    console.log('res',row.children);
    // getRolesList();
    row.children=res.data;
}

//编辑角色
const editRole=(row)=>{
    title.value='编辑角色';
    editRoleRow.value=JSON.parse(JSON.stringify(row));
    dialogVisible.value=true;
    // console.log('editRoleRow',editRoleRow.value);

}

//分配权限对话框
const showSetRightDialog=(row)=>{
    permissRowList.value=row
    state.value=true;
}

//分配权限
const quanxian=(row)=>{

}

//通过递归的形式，获取角色所有三级权限的id,并保存到数组中,用于实现树状图复选框默认值
    const getLeafKeys=(node, arr)=>{
        //如果当前node节点不包含children属性,则是三级节点
        if(!node.children){
            return arr.push(node.id);
        }

        node.children.forEach(item => {
            getLeafKeys(item,arr)
        });

    }
    //权限列表
    const permissList=ref([]);

     //获取数据对应的树状图属性
    const defaultProps={
        children: 'children',
        label: 'authName',
    }
     //默认选中的节点id数组
    const defKeys=ref([]);
    //角色id
    let roleId='';
  //获取权限列表
    const ermissionList=async(row)=>{
       const{data:res}=await axios.get(`rights/tree`);
       if(res.meta.status!==200){
         return  ElMessage.error('获取权限列表失败')
       }
        // getLeafKeys(row,defKeys.value);
        permissList.value=res.data;
        //递归
        getLeafKeys(row,defKeys.value);
        roleId=row.id;

        state.value=true;
        console.log(permissList.value);       

        //通过递归获取三级节点id
   
    //    closeDialog();
    }

    //对话框关闭触发的事件
    const closeDialog=()=>{
        defKeys.value.length=0;
        // emit('update:modelValue',false);
        state.value=false;
    }

    //分配权限
    let treeRef=ref(null);
    const addRolesPermission=async()=>{
        // ermissionList();
       const list=[
           ...treeRef.value.getCheckedKeys(),
           ...treeRef.value.getHalfCheckedKeys()
       ];
       const idStr=list.join(',');
       const{data:res}=await axios.post(`roles/${roleId}/rights`,{
           rids: idStr
       })
       if(res.meta.status===200){
           ElMessage.success('分配权限成功');
            //获取角色列表
            getRolesList();
           closeDialog();
       }else{
           ElMessage.error('分配权限失败')
       }
       console.log('进入了这个方法');
    }
</script>

<style scoped>
    .el-row{
        padding: 10px;
        justify-content: center;
        align-items: center;
        /* border-bottom: 1px solid #333; */

    }
    .el-table{
        margin-top: 15px;
    }
    /* .row2{
        margin: 10px;
    } */
    .tag3{
        margin: 5px;
    }
</style>