.<template>
  <el-dialog
  :model-value="state"
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
    import{ref,defineProps,defineEmits,onMounted,watch} from 'vue'
    import axios from 'axios'
    import{ElMessage} from 'element-plus'
    let state=ref(false);

    const emit=defineEmits(['update:modelValue']);

    const props=defineProps({
        permissRowList:{
            type:Object,
            defalut:{}
        }
    })
    //权限列表
    const permissList=ref([]);
    //获取数据对应的树状图属性
    const defaultProps={
        children: 'children',
        label: 'authName',
    }
    //默认选中的节点id数组
    const defKeys=ref([]);

    //对话框关闭触发的事件
    const closeDialog=()=>{
        defKeys.value.length=0;
        emit('update:modelValue',false);
    }

    onMounted(() => {
        // ermissionList();
    })
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
      //获取权限列表
    const ermissionList=async(row)=>{
       const{data:res}=await axios.get(`rights/tree`);
       if(res.meta.status!==200){
         return  ElMessage.error('获取权限列表失败')
       }
        getLeafKeys(row,defKeys.value);
        permissList.value=res.data;
        console.log(permissList.value);
        

        //通过递归获取三级节点id
   

    //    closeDialog();
    }

    watch(()=>props.permissRowList,()=>{
        // console.log('watchzhogn',props.permissRowList);  
             ermissionList(props.permissRowList);
           
       
       

    },{deep:true,immediate:true});

    //分配权限
    let treeRef=ref(null);
    const addRolesPermission=async()=>{
        // ermissionList();
       const list=[
           ...treeRef.value.getCheckedKeys(),
           ...treeRef.value.getHalfCheckedKeys()
       ];
       const idStr=list.join(',');
       const{data:res}=await axios.post(`roles/${props.permissRowList.id}/rights`,{
           rids: idStr
       })
       if(res.meta.status===200){
           ElMessage.success('分配权限成功');
        //    ermissionList();
           closeDialog();
       }else{
           ElMessage.error('分配权限失败')
       }
       
    }
   
  

    
</script>

<style>

</style>