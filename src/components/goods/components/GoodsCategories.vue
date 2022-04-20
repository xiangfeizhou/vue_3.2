.<template>
  <el-dialog
    :model-value="dialogVisible"
    :title="GoodsCategoriesTitle"
    width="30%"
    @close="closeDialog"
  >
   <!-- form表单 -->
   <el-form ref="ruleFormRef" :model="form" label-width="80px" :rules="rules">
       <el-form-item :label="GoodsCategoriesTitle==='添加操作' ? '分类名称' : '新的名称'" prop="cat_name">
           <el-input v-model="form.cat_name" clearable></el-input>
       </el-form-item>
       <el-form-item label="父级分类" v-show="GoodsCategoriesTitle==='添加操作' ? true : false">
         <!-- options用户指定数据源 -->
           <el-cascader
      v-model="selectKeys"
      :options="options1"
      :props="cascaderProps"
      @change="handleChange"
      clearable
      class="el-cascader55"
    />
       </el-form-item>
       <el-form-item lable>

       </el-form-item>
   </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="addCategories"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>

  <!-- <select v-model="selected" @change="selChange">

  <option value="上海">上海</option>
  <option value="北京">北京</option>
</select> -->
</template>

<script setup>
import{ref,reactive,defineEmits,onMounted,defineProps} from 'vue'
import axios from 'axios'
import{ElMessage} from 'element-plus'
import { id } from 'element-plus/lib/locale';
const dialogVisible=ref(false);

//商品分类列表数据
const options=ref([]);
//选中的父级分类Id数组
const selectKeys=ref([]);
//指定级联选择器的配置对象
const cascaderProps=reactive({
    value:'cat_id',
    label:'cat_name',
    children:'children',
    expandTrigger: 'hover',
    checkStrictly: true,
})
//获取表单组件实例
const ruleFormRef=ref(null);

const emit=defineEmits(['update:modelValue','getGdGrList']);
const props=defineProps({
  //对话框标题
  GoodsCategoriesTitle:{
    type:String,
    default:''
  },
  //父组件传递的商品分类列表数据
  options1:{
    type:Array,
    default:[]
  },
  //接受父组件传递过来的row对象
  goodsRow:{
    type:Object,
    default:()=>{}
  }
})
const form=reactive({
    //将要添加的分类名称
    cat_name:'',
    //父级分类id
    cat_pid:0,
    //分类层级,默认的是一级分类就是0
    cat_level:0
})
//表单检验规则
const rules=reactive({
    cat_name:[
        { required: true, message: '不能为空', trigger: 'blur' },
    ]
})
onMounted(() => {
  getCategoriesList();  
})

//对话框关闭操作

const closeDialog=()=>{
    ruleFormRef.value.resetFields();
    selectKeys.value=[];
    form.cat_pid=0;
    form.cat_level=0;
    emit('update:modelValue',false);

}
// 获取分类列表
const getCategoriesList=async()=>{
  const{data:res}= await axios.get('categories',{params:{type:2}})
  console.log('商品分类列表',res);
  options.value=res.data;
}

//select选择项发生了变化触发这个函数
const handleChange=()=>{
  //如果selectKeys数组长度大于0证明选中了父级分类
  //不关选中的是父级分类还是子集分类都只取数组最后一个分类id
  //当清空select选项是绑定的v-model值会被赋值为null
  if(selectKeys.value!==null){
    if(selectKeys.value.length>0){
      form.cat_pid=selectKeys.value[selectKeys.value.length-1]
    form.cat_level=selectKeys.value.length;
    
    console.log('cat_pid',form.cat_pid);
    console.log(form.cat_level);
    }else{
      form.cat_pid=0
      form.cat_level=0
    }
    
  }else{
     form.cat_pid=0
      form.cat_level=0
  }
//  console.log(selectKeys.value);
}
//点击确认
const addCategories=()=>{
  ruleFormRef.value.validate((value)=>{
    if(!value){
      return
    }
   if(props.GoodsCategoriesTitle==='添加操作'){
     addGoodsCategories();
   }else{
     reviseCategories();
   }
  
  emit('update:modelValue',false);
  })
}
//添加分类方法
const addGoodsCategories=async()=>{
const{data:res}= await axios.post('categories',form);
  if(res.meta.status===201){
    ElMessage.success('添加成功');
    getCategoriesList();
    emit('getGdGrList');
  }else{
    ElMessage.error('添加失败')
  }
}
//修改分类方法
const reviseCategories=async()=>{
 const{data:res}=await axios.put(`categories/${props.goodsRow.cat_id}`,
 { 
     cat_name:form.cat_name 
 });
  if(res.meta.status===200){
    ElMessage.success('更新成功')
    getCategoriesList();
    emit('getGdGrList');
  }else{
    ElMessage.error('更新失败')
  }

}


</script>

<style lang="less" scoped>
/deep/ .el-cascader55{
    width: 100%;
  }
</style>