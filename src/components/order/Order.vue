.<template>
  <!-- 面包屑导航区域 -->
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/userList' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    <el-breadcrumb-item>订单列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图 -->
  <el-card>
    <!-- <el-row>
       
      <el-col :span="8">
        <el-input v-model.trim="orders.query" placeholder="请输入内容">
          <template #append>
            <el-button :icon="Search" @click="getOrderDetails"/>
          </template>
        </el-input>
      </el-col>
    </el-row> -->
    <!-- 主体区域 -->
    <el-table :data="orderlist">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column label="订单编号" prop="order_id" />
      <el-table-column label="订单价格" prop="order_price"></el-table-column>
      <el-table-column label="是否付款" prop="pay_status">
        <template #default="{row}">
         <el-tag v-if="row.pay_status!=='0'" class="ml-2" type="success">已付款</el-tag>
         <el-tag v-else class="ml-2" type="danger">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send"></el-table-column>
      <el-table-column label="下单时间">
        <template #default="{row}">
            {{dateTime(row.create_time)}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
          <template #default="{row}">
             <el-button type="primary" :icon="Edit" circle @click="shwoBox"/>
             <el-button type="success" :icon="Location" circle @click="checkAddress"/>
             <!-- <el-icon><location /></el-icon> -->
          </template>
      </el-table-column>



    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-model:currentPage="orders.pagenum"
      v-model:page-size="orders.pagesize"
      :page-sizes="[5, 10, 15, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="getOrderList"
      @current-change="getOrderList"
    />
  </el-card>

  <!-- Dialog对话框 -->
  <el-dialog
    v-model="dialogVisible"
    title="修改地址"
    width="30%"
    @close="handleClose"
  >
    <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef"
    label-width="90px">
      <el-form-item label="省市区/县" prop="address1">
          <!-- 级联选择器 -->
          <el-cascader
      v-model="addressForm.address1"
      :options="citeDate"
      :props="props"
      @change="handleChange"
    />
      </el-form-item>
      <el-form-item label="详细地址" prop="address2">
        <el-input v-model="addressForm.address2"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addRessPost"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>

  <!-- 查看物流信息 -->
  <el-dialog
   v-model="dialogVisible02"
    title="物流信息"
    width="30%"

  >
  <!-- 时间线 -->
  <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in activities"
      :key="index"
      :timestamp="activity.time"
      :icon="MoreFilled"
      color="#0bbd87"
    >
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>

   <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogVisible02 = false"
          >关闭</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ArrowRight, Search,Edit,Delete,Location,MoreFilled } from "@element-plus/icons-vue";
import { ref,onMounted} from "vue";
import axios from 'axios'
import {ElMessage} from 'element-plus'
import dateTime from '../../request/tool'
import citeDate from '../../request/city_data'

//订单列表数据集合
const orderlist = ref([]);
//订单列表总数量
const total=ref(0);
//订单数据列表参数
const orders=ref({
    query: '',
    pagenum: 1,
    pagesize: 10,
    //用户id
    user_id:'',
    //支付状态
    pay_status:'',
    //是否发货
    is_send:'',
    //公司名称
    order_fapiao_company:''
})
//form表单
const addressForm=ref({
  address1:[],
  address2:''
})
//表单验证
const addressFormRules=ref({
  address1:[
    {required: true, message: '请填写地址', trigger: 'change'}
  ],
  address2:[
    {required: true, message: '请填写详细地址', trigger: 'blur'}
  ]
})
//对话框显示与隐藏变量
const dialogVisible=ref(false);
//物流对话框显示与隐藏变量
const dialogVisible02=ref(false);
//获取表单组件实例
const addressFormRef=ref(null);
//物流信息数据
const activities=ref([]);
//获取订单数据列表
const getOrderList=async()=>{

  const{data:res}=await axios.get('orders',{
      params:orders.value
  })
  if(res.meta.status!==200){
      return ElMessage.error('商品列表数据数据失败!')
  }
  orderlist.value=res.data.goods;
  total.value=res.data.total;
  console.log(orderlist.value);
}
onMounted(()=>{
    getOrderList();
})
const fangfa=()=>{
  console.log(123);
}

//编辑操作
const shwoBox=()=>{
  dialogVisible.value=true;
}
//添加操作
function addRessPost(){
  
  addressFormRef.value.validate((value)=>{
    if(value){

    }else{
      return
    }
    dialogVisible.value=false
  })
}
//对话框关闭
const handleClose=()=>{
  addressFormRef.value.resetFields();
  dialogVisible.value=false;
}
//查看物流信息
const checkAddress=async()=>{
     const{data:res}=await axios.get('/kuaidi/1106975712662');
     if(res.meta.status!==200){
      return ElMessage.error('获取物流信息失败!')
     }
     activities.value=res.data;
  console.log(activities.value);
    dialogVisible02.value=true
}
//查看订单详情
const getOrderDetails=async()=>{
  console.log(orders.value.query);
  const{data:res}=await axios.get(`orders/${orders.value.query}`)
  // if(res.meta.status!==200){
  //  return ElMessage.error('获取订单详情数据失败')
  // }
  // orderlist.value
  console.log(res);
}
</script>

<style scoped lang="less">
    .el-pagination{
        margin-top: 10px;
    }
    :deep(.el-cascader){
      width: 100%;
    }
</style>>
