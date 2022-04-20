.<template>
   <!-- 面包屑导航区域 -->
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{path: '/userList' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item :to="{path:'/goods'}">商品列表</el-breadcrumb-item>
    <el-breadcrumb-item>添加商品</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片区域 -->
  <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"/>
       <el-steps :active="activeIndex-0" finish-status="success"  style="margin-top: 10px" align-center>
    <el-step title="基本信息" />
    <el-step title="商品参数" />
    <el-step title="商品属性" />
    <el-step title="商品图片" />
    <el-step title="商品内容" />
    <el-step title="完成" />
  </el-steps>

<!-- form表单 -->
 <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px"
 label-position="top"
 >
  <!-- tabs标签 -->
  
   <el-tabs v-model="activeIndex" tab-position="left" style="margin-top:15px" class="demo-tabs"
   :before-leave="beforeLeave"
   >
    <el-tab-pane label="基本信息" name="0">
      <el-form-item label="商品名称" prop="goods_name">
        <el-input v-model="addForm.goods_name"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="goods_price">
        <el-input v-model.trim="addForm.goods_price" type="number"></el-input>
      </el-form-item>
      <el-form-item label="商品重量" prop="goods_weight">
        <el-input v-model.trim="addForm.goods_weight" type="number"></el-input>
      </el-form-item>
      <el-form-item label="商品数量" prop="goods_number">
        <el-input v-model.trim="addForm.goods_number" type="number"></el-input>
      </el-form-item>
      <el-form-item label="商品分类" prop="goods_name">
        <!-- 级联选择器 -->
        <el-cascader
      v-model="addForm.goods_cat"
      :options="categoriesList"
      :props="cateprops"
      @change="handleChange"
    />
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品参数" name="1">
      <el-form-item :label="item.attr_name" v-for="item in goodCascaderList" :key="item.attr_id">
      <!-- checkbox多选框 -->
       <el-checkbox-group v-model="checkList"  >
    <el-checkbox border :label="todo" v-for="(todo,i) in item.attr_vals" :key="i" @change="checkboxChange(item,todo)" :checked="false"/>
  </el-checkbox-group>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
    <el-tab-pane label="商品图片" name="3">
      <!-- 图片上传 -->
      <el-upload
    :action="imgUrl"
    list-type="picture-card"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
    :headers="tokenObj"
    :on-success="headerSuccess"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>

  <el-dialog v-model="dialogVisible" title="图片预览" width="30%">
    <img w-full :src="previewPath"  class="perviewImg"/>
  </el-dialog>

    </el-tab-pane>
    <el-tab-pane label="商品内容" name="4">
      <!-- 本编辑器 -->

     <el-input
    v-model.trim="addForm.goods_introduce"
    maxlength="500"
    placeholder="商品描述"
    show-word-limit
    type="textarea"
  />
  <el-button type="primary" class="addbutton" @click="addGoods">添加商品</el-button>    
   </el-tab-pane>
    <el-tab-pane label="完成" name="5">完成</el-tab-pane>
  </el-tabs>
  </el-form>
  </el-card>
  {{addForm.goods_introduce}}
</template>

<script setup>
    import{ArrowRight,Plus}from '@element-plus/icons-vue'
    import{ref,onMounted,watch}from 'vue'
    import axios from 'axios'
    import{ElMessage} from 'element-plus'
    import editor from '@tinymce/tinymce-vue'

    let activeIndex=ref('');
    let active=ref('0');
    //添加商品表单数据对象
    const addForm=ref({
      //商品名称
      goods_name:'',
      //商品价格
      goods_price:'',
      //商品数量
      goods_number:'',
      //商品重量
      goods_weight:'',
      //级联选择器保存的数组
      goods_cat:[],
      //上传图片路径数组
      pics:[],
      //商品详情描述
      goods_introduce:'',
      //商品参数数组包含动态参数和静态属性
      attrs:[]
    })
    watch(()=>addForm,()=>{
      console.log(addForm.value.goods_introduce);
    },{deep:true})
    //商品分类数据
    const categoriesList=ref([]);

    //级联选择器props
    const cateprops = {
      label:'cat_name',
      value:'cat_id',
      children:'children',
    expandTrigger: 'hover',
    }
    //级联选择器保存的值
    const cascaderList=ref([]);
    //商品参数列表保存的值
    const goodCascaderList=ref([]);
    //商品属性列表保存的值
    const goodCascaderListOnly=ref([]);
    //多选框数组
    const checkList=ref([]);
    //上传图片路径
    const imgUrl=ref('https://lianghj.top:8888/api/private/v1/upload')
    //图片上传组件token请求头
    const tokenObj=ref({
      Authorization:localStorage.getItem('token')
    })
    //图片路径
    const previewPath=ref('');

    //控制对话框显示与隐藏
    const dialogVisible=ref(false);
    //获取表单组件实例
    const addFormRef=ref(null);
    //chenckbox值
    const done=false;
   //表单校验
    const addFormRules=ref({

      goods_name:[
        {
          required: true, message: '不能为空', trigger: 'blur'
        }
      ],
      goods_price:[
        {
          required: true, message: '不能为空', trigger: 'blur'

        }
      ],
      goods_number:[
        {
         required: true, message: '不能为空', trigger: 'blur'

        }
      ],
      goods_weight:[
        {
         required: true, message: '不能为空', trigger: 'blur'

        }
      ]

    })
  //获取商品分类列表
  const getCategoriedList=async()=>{
    const{data:res}=await axios.get('categories',{params:{type:3}});
    if(res.meta.status!==200){
      return ElMessage.error('商品分类列表数据获取失败');
    }
    categoriesList.value=res.data;
    console.log(res);
  }
  onMounted(()=>{
    getCategoriedList();
  })
  //级联选择器点击事件
  const handleChange=()=>{
    if(addForm.value.goods_cat.length!==3){
     return addForm.value.goods_cat=[];
    }
    console.log(addForm.value.goods_cat);
  }
  //
  const beforeLeave=(activeName, oldActiveName)=>{
    console.log('activeName',typeof activeName);
    console.log('oldActiveName',typeof oldActiveName);
    
    
    // activeIndex.value=activeIndex.value-0;
    console.log(typeof activeIndex.value);
    if(oldActiveName==='0' && addForm.value.goods_cat.length!==3 ){
      ElMessage.info('请选择商品分类')
      return false
    }
    if(activeName==='1'){
      getCategoriesID('many');
    }
    if(activeName==='2'){
      getCategoriesID('only');
    }

     
  }
  //获取商品参数或商品属性
  const getCategoriesID=async(selVal)=>{
    const{data:res}=await axios.get(`categories/${addForm.value.goods_cat[2]}/attributes`,
    {params:{
      sel:selVal
    }})
    if(res.meta.status!==200){
     return ElMessage.error('商品参数列表数据获取失败')
    }
    //根据,号分割attr_vals字符串，将它变成一个数组
    res.data.forEach(element => {
      element.attr_vals=element.attr_vals.length===0 ? [] :element.attr_vals.split(',');
    });
    if(selVal==='many'){
       goodCascaderList.value=res.data
    }else{
      goodCascaderListOnly.value=res.data
    }
    
  }
  //对选款事件chenge事件
  const list=[];
  const checkboxChange=(item,todo)=>{
    console.log(checkList.value,'item',item,'todo',todo);
    //长度大于1代表选中了至少一个
    // if(checkList.value.length>0){ 
    //   const obj={
    //     attr_id:item.attr_id,
    //     attr_vals:checkList.value
    //   }
    //   //第一次点击
    //   if(list.length===0){
    //     list.push(obj)
    //   }
    //   list.forEach((todo)=>{
    //     if(todo.attr_id===item.attr_id){
    //       todo.attr_vals=checkList.value;
    //     }else{
    //       list.push(obj)
    //     }
    //   })
      
    //   console.log(list);
    // }
  }
  //处理图片预览效果
  const handlePictureCardPreview=(file)=>{
    previewPath.value=file.response.data.url;
    dialogVisible.value=true;
    console.log(file);
  }
  //处理移除图片操作
  const handleRemove=(uploadFile)=>{
    //1.获取将要删除的图片临时路径
    //2.从addForm对象pics数组中,找到这个图片对应的索引值
    //3.调用数组的splice方法,把图片信息对象,从pics数组中移除
    const tmp_path=uploadFile.response.data.tmp_path;
    const index=addForm.value.pics.findIndex(todo=>{
      return todo.pic===tmp_path
    })
    addForm.value.pics.splice(index,1);
    console.log(addForm.value.pics);
  }
  //监听图片上传成功后的事件
  const headerSuccess=(response)=>{
    //1.拼接得到一个图片对象
    const picInfo={
      pic:response.data.tmp_path
    }
    addForm.value.pics.push(picInfo);
    console.log(addForm.value.pics);
  }
  //添加商品
  const addGoods=()=>{
    addFormRef.value.validate((value)=>{
      if(!value){
       return ElMessage.error('请输入必填项')
      }
      //添加商品操作
    
     //处理动态参数
      goodCascaderList.value.forEach(todo=>{
      addForm.value.attrs.push({
        attr_id:todo.attr_id,
        attr_value:todo.attr_vals
      })
      
    })
    console.log(addForm.value.attrs);
    })
  }
  //添加商品ajax请求
  const addGoodsPost=async()=>{
    //将数组处理成字符串
    addForm.value.goods_cat=addForm.value.goods_cat.join(',');
    //处理动态参数
    goodCascaderList.value.forEach(todo=>{
     const newInfo={
        attr_id:todo.attr_id,
        attr_value:todo.attr_vals
      }
      addForm.value.attrs.push(newInfo)
    })
     
    //处理静态参数
    goodCascaderListOnly.value.forEach(todo=>{

    })
    console.log(addForm.value.goods_cat);
    const{data:res}=await axios.post('goods',addForm.value)
  }
</script>


<style lang="less" scoped >
    // .el-steps{
    //     font-size: 10px;
    // }
  // /deep/ .el-step__title{
  //       font-size: 14px;
  //   }
  //  /deep/ .el-step__icon{
  //       width: 21px;
  //       height: 21px;
  //   }

    :deep(.el-step__icon){
      width: 21px;
        height: 21px;
    }
    :deep(.el-step__title){
      font-size: 14px;
    }
    .perviewImg{
      width: 100%;
      height: 500px;
    }
  //  /deep/ #id{
  //     height: 300px;
  //   }
    .el-textarea {
      height: 170px;
    }
    :deep(.el-textarea__inner){
      height: 100%;
    }
    :deep(.addbutton){
      margin-top:10px;
    }
</style>