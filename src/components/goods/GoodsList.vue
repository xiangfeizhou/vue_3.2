.<template>
  <!-- 面包屑导航区域 -->
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: 'userList' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片区域 -->
  <el-card>
    
    <el-row>
      <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="form.query" clearable @clear="getGoodsList">
         <template #append>
        <el-button :icon="Search" @click="getGoodsList"/>
      </template>
        </el-input>
        
        </el-col>
        <el-col :span="8" style="margin-left:20px">
          <el-button type="primary" @click="addGoodFun">添加商品</el-button>
        </el-col>
    </el-row>
    <!-- 表格主体 -->
    <el-table :data="goodsList">
      <el-table-column label="#"  type="index" width="50px">

      </el-table-column>
      <el-table-column label="商品名称" prop="goods_name">

      </el-table-column>
      <el-table-column label="商品价格(元)" prop="goods_price" width="250px">

      </el-table-column>
      <el-table-column label="创作时间" prop="add_time" width="250px">
        <template #default={row}>
          {{dateTime(row.add_time)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250px">
        <template #default="{row}">
          <el-button type="primary" :icon="Edit" circle />
          <el-button type="danger" :icon="Delete" circle />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row style="margin-top:10px">
      <el-col>
         <el-pagination
      v-model:currentPage="form.pagenum"
      v-model:page-size="form.pagesize"
      :page-sizes="[10, 15, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="getGoodsList"
      @current-change="getGoodsList"
    />
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
  import{ArrowRight,Search,Edit,Delete} from '@element-plus/icons-vue'
  import{ref,reactive,onMounted} from 'vue'
  import axios from 'axios'
  import { ElMessage } from 'element-plus';
  import router from '../../router/index'
  //商品列表数据数组
  const goodsList=ref([]);
  //分页请求对象
  const form=reactive({
    query:'',
    pagenum:1,
    pagesize:10
  })
  const total=ref(0);
  //获取商品列表数据
  const getGoodsList=async()=>{
    const{data:res}=await axios.get('goods',{params:form});
    if(res.meta.status!==200){
      return ElMessage.error('获取商品数据列表失败')
    }
    goodsList.value=res.data.goods;
    total.value=res.data.total;
    console.log('goods',res);
  }
  onMounted(()=>{
    getGoodsList();
  })
  const handleSizeChange=()=>{
    console.log(form.pagenum);
  }
  //毫秒转换成日期格式
  const dateTime=(time)=>{
    const dt=new Date(time);
    const y=dt.getFullYear();
    const m=(dt.getMonth()+1+'').padStart(2,'0');
    const d=(dt.getDate()+'').padStart(2,'0');

    const hh=(dt.getHours()+'').padStart(2,'0');
    const mm=(dt.getMinutes()+'').padStart(2,'0');
    const ss=(dt.getSeconds()+'').padStart(2,'0');

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }
  //点击添加商品跳转
  const addGoodFun=()=>{
    router.push({path:'/goods/add'})
  }
</script>

<style scoped>

</style>