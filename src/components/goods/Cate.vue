.<template>
  <!-- 面包屑导航区域 -->
    <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: 'userList' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>

    <!--卡片视图区域  -->
    <el-card class="box-card">
    <!-- <template #header>
      <div class="card-header">
      </div>
    </template> -->
    <el-row>
        <el-col>
                    <el-button class="button" type="primary" @click="addCategories()">添加分类</el-button>
        </el-col>
    </el-row>

    <!-- 表格内容区域 -->
    <el-table :data="cateList" style="width: 100%"
    row-key="cat_id"
    
    >
    
        <el-table-column prop="cat_name" label="分类名称" width="180" />
        <el-table-column prop="cat_deleted" label="是否有效" width="180" >
          <template #default="{row}">
            <el-icon class="cel" v-if="!row.cat_deleted" color="lightgreen" ><circle-check-filled /></el-icon>
            <el-icon v-else color="red" ><circle-close-filled /></el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序" >
          <template #default="{row}">
            <el-tag  v-if="row.cat_level===0">一级菜单</el-tag>
            <el-tag v-else-if="row.cat_level===1" type="success">二级菜单</el-tag>
            <el-tag v-else type="warning">三级菜单</el-tag>
          </template>
        </el-table-column>

        <el-table-column  label="操作" >
          <template #default="{row}">
            <el-button type="primary" :icon="Edit" size="small" @click="addCategories(row)">编辑</el-button>
            <el-button type="danger" :icon="Delete" size="small" @click="deleteIdGoods(row)">删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      v-model:currentPage="querInfo.pagenum"
      v-model:page-size="querInfo.pagesize"
      :page-sizes="[5,10,20]"
      small
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
 

  <!-- 对话框组件 -->
  <GoodsCategories v-model="dialogVisible" :GoodsCategoriesTitle="GoodsCategoriesTitle"
  :goodsRow="goodsRow"
  @getGdGrList="getCateList"
  :options1="options1"
  ></GoodsCategories>

</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import{ref,reactive, onMounted} from 'vue'
import axios from 'axios'
import {ElMessage,ElMessageBox} from 'element-plus'
import{Edit,Delete,CircleCheckFilled,CircleCloseFilled} from '@element-plus/icons-vue'
import GoodsCategories from './components/GoodsCategories.vue'
//默认展开行
// const expands=ref(['2','5']);
//商品分类数据列表,默认为空
const cateList=ref([]);

//分页查询条件
const querInfo=ref({
    type:3,
    pagenum:1,
    pagesize:5
})
//分页总条数
const total=ref(0);
//子组件对话框标题
const GoodsCategoriesTitle=ref('');
onMounted(() => {
    getCateList();
})

//获取商品数据列表方法
const getCateList=async()=>{
   const{data:res}=await axios.get('categories',{
    params:querInfo.value
   });
   if(res.meta.status!==200){
     return  ElMessage.error('获取数据失败')
   }
   cateList.value=res.data.result;
   total.value=res.data.total;
   console.log('Cate',res);
}
//监听pagesize改变
const handleSizeChange=(newSize)=>{
  getCateList();
}
//监听pagenum改变
const handleCurrentChange=(newNum)=>{
  getCateList();
}

//添加和修改
//控制对话框显示和隐藏的变量
const dialogVisible=ref(false);
//传递给子组件的对象
const goodsRow=ref({});
//传递给子组件的商品分类数据列表
const options1=ref([]);
const addCategories=async(row1)=>{
  console.log(row1);
  if(!row1){
    GoodsCategoriesTitle.value='添加操作'
     const{data:res}= await axios.get('categories',{params:{type:2}})
     options1.value=res.data
  }else{
    GoodsCategoriesTitle.value='更新操作'
    goodsRow.value=row1
  }
  dialogVisible.value=true;
}

//根据id删除指定列表
const deleteIdGoods=(row)=>{
   ElMessageBox.confirm(
    '此操作将永久删除该条数据?',
    '删除分类',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
     delCategories(row.cat_id);
    })
    .catch(() => {
      // ElMessage({
      //   type: 'info',
      //   message: '操作取消',
      // })
    })
    
}

//删除分类方法
const delCategories=async(row)=>{
 const{data:res}=await axios.delete(`categories/${row}`)
 if(res.meta.status===200){
   ElMessage.success('删除成功');
   getCateList();
 }else{
   ElMessage.error('删除失败');
   
 }
}
</script>

<style scoped>
  .cel{
    height: 30px;
    line-height: 30px;
  }
  /* el-icon{
    height: 50px;
  } */
  .el-pagination{
    margin-top: 15px;
  }
 
</style>