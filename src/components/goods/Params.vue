.<template>
  <!-- 面包屑导航区域 -->
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: 'userList' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>分类参数</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片视图 -->
  <el-card>
    <!-- 警告区域 -->
    <el-alert
      title="注意: 只允许为第三级分类设置相关参数"
      type="warning"
      show-icon
      :closable="false"
    />
    <!-- 选择商品分类区域 -->
    <el-row class="cat_opt">
      <el-col>
        <span class="col-span">选择商品分类</span>
        <el-cascader
          v-model="selectKeys"
          :options="cateList"
          :props="props"
          @change="handleChange"
          class="el-cader"
        />
      </el-col>
    </el-row>

    <!-- tabs 页签区域 -->
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <!-- 添加动态参数的面板 -->
      <el-tab-pane label="动态参数" name="many">
        <el-button
          type="primary"
          :disabled="isBtnDisabled"
          @click="addCateGoriesId()"
          >添加参数</el-button
        >
        <!-- 动态参数表格 -->
        <el-table :data="categoriesList" style="width: 100%" row-key="attr_id">
          <el-table-column type="expand" class="table-column">
            <template #default="{ row }">
              <!-- 遍历row中attr_vals数组 -->
              <el-row>
                <el-col>
                  <!-- 循环渲染tag标签 -->
                  <el-tag
                    v-for="(item, i) in row.attr_vals"
                    :key="i"
                    closable
                    @close="tagClose(i,row)"
                    >{{ item }}</el-tag
                  >

                  <!-- 输入框的文本 -->
                  <el-input
                    v-if="row.inputVisible"
                    ref="InputRef"
                    v-model.trim="row.inputValue"
                    class="ml-1 w-20 elinput table-column"
                    size="small"
                    @keyup.enter="handleInputConfirm(row)"
                    @blur="handleInputConfirm(row)"
                   />
                     <!-- 添加按钮 -->
             <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput(row)">
                  + New Tag
             </el-button>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#" />
          <el-table-column prop="attr_name" label="参数名称" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="primary" @click="addCateGoriesId(row)"
                >编辑</el-button
              >
              <el-button type="danger" @click="deleteIdCategories(row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 添加静态属性的面板 -->
      <el-tab-pane label="静态属性" name="only">
        <el-button
          type="primary"
          :disabled="isBtnDisabled"
          @click="addCateGoriesId()"
          >静态属性</el-button
        >
        <!-- 静态属性表格 -->
        <el-table :data="categoriesList" style="width: 100%" row-key="attr_id">
          <el-table-column type="expand">
            <template #default="{ row }">
              <!-- 遍历row中attr_vals数组 -->
              <el-row>
                <el-col>
                    <!-- 循环渲染tag标签 -->
                  <el-tag
                    v-for="(item, i) in row.attr_vals"
                    :key="i"
                    closable
                    @close="tagClose(i,row)"
                    >{{ item }}</el-tag
                  >

                  <!-- 输入框的文本 -->
                  <el-input
                    v-if="row.inputVisible"
                    ref="InputRef"
                    v-model.trim="row.inputValue"
                    class="ml-1 w-20 elinput table-column"
                    size="small"
                    @keyup.enter="handleInputConfirm(row)"
                    @blur="handleInputConfirm(row)"
                   />

                   <!-- 添加按钮 -->
             <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput(row)">
                  + New Tag
             </el-button>
                </el-col>
              </el-row>
            </template>
          </el-table-column>

          <el-table-column type="index" label="#" />
          <el-table-column prop="attr_name" label="参数名称" />
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="primary" @click="addCateGoriesId(row)"
                >编辑</el-button
              >
              <el-button type="danger" @click="deleteIdCategories(row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>

  <!-- 添加参数对话框 -->
  <el-dialog
    v-model="dialogVisible"
    :title="activeName === 'many' ? '动态参数' : '静态属性'"
    width="30%"
    @close="closeDialog"
  >
    <el-form :model="form" label-width="80px" ref="cateRef" :rules="rules">
      <el-form-item label="参数名称" prop="cateName">
        <el-input v-model="form.cateName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addOnlyManyCategories"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ArrowRight } from "@element-plus/icons-vue";
import { reactive, ref, onMounted, computed, nextTick } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
//商品分类列表数据
const cateList = ref([]);
//select选中的id 存放在数组里
const selectKeys = ref([]);

const props = reactive({
  value: "cat_id",
  label: "cat_name",
  children: "children",
  expandTrigger: "hover",
  // checkStrictly: true,  可以多选
});
//tabs标签选中后的参数
const activeName = ref("many");

//参数列表
const categoriesList = ref([]);

//对话框显示与隐藏参数
const dialogVisible = ref(false);

//参数名称
const form = ref({
  cateName: "",
});
//参数名称校验
const rules = reactive({
  cateName: [{ required: true, message: "不能为空", trigger: "blur" }],
});

//获取对话框组件实例
const cateRef = ref(null);

//控制按钮与文本框的显示 
const inputVisible=ref(false)

//输入框文本值
const inputValue=ref('');
//监听对话框关闭
const closeDialog = () => {
  cateRef.value.resetFields();
};
onMounted(() => {
  getCateList();
});
//计算属性 如果按钮需要被禁用，则返回true，否则返回false
const isBtnDisabled = computed(() => {
  if (selectKeys.value.length !== 3) {
    return true;
  } else {
    return false;
  }
});

//获取商品分类列表数据
const getCateList = async () => {
  const { data: res } = await axios.get("categories");
  if (res.meta.status !== 200) {
    return ElMessage.error("获取商品分类列表数据失败");
  }
  cateList.value = res.data;
  console.log(res);
};

//
const handleChange = () => {
  getParamsData();
};
//tabs页签点击事件的处理
const handleClick = (tab, event) => {
  console.log(activeName.value);
  getParamsData();
};

//获取参数的列表数据
const getParamsData = async () => {
  //证明选中的不是三级分类
  if (selectKeys.value.length !== 3) {
    selectKeys.value = [];
    return;
  }
  //根据所选分类的id,和当前所处的面板,获取对应的参数
  const { data: res } = await axios.get(
    `categories/${selectKeys.value[2]}/attributes`,
    { params: { sel: activeName.value } }
  );
  if (res.meta.status !== 200) {
    return ElMessage.error("获取参数列表数据失败");
  }
  //res中attr_vals拆分成数组
  res.data.forEach((item) => {
    item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
    //控制文本框的显示与隐藏
    item.inputVisible=false;
    //文本框中输入的值
    item.inputValue=''
  });
 
  categoriesList.value = res.data;
   console.log(res);
};

let done = false; //默认false修改操作 true为添加操作
const attrId = ref({}); //属性id
//添加参数和修改参数
const addCateGoriesId = (row) => {
  if (!row) {
    //row为空就是添加操作,不为空就是修改操作
    done = true;
  } else {
    done = false;
    attrId.value = row
  }

  dialogVisible.value = true;
};

//对话框确认方法  判定是添加还是修改
const addOnlyManyCategories = async () => {
  cateRef.value.validate((result) => {
    if (result) {
      if (done) {
        //添加操作
        addCategoriesOnlyMany();
      } else {
        //修改操作
        revCategories(attrId.value);
      }
      dialogVisible.value = false;
    }
  });
};
//添加动态参数或者静态属性
const addCategoriesOnlyMany = async () => {
  const { data: res } = await axios.post(
    `categories/${selectKeys.value[2]}/attributes`,
    {
      attr_name: form.value.cateName,
      attr_sel: activeName.value,
    }
  );
  if (res.meta.status === 201) {
    ElMessage.success("添加成功");
    getParamsData();
  } else {
    ElMessage.error("添加失败");
  }
};

//修改分类参数
const revCategories = async (row) => {   
  const { data: res } = await axios.put(
    `categories/${selectKeys.value[2]}/attributes/${row.attr_id}`,
    {
      attr_name: form.value.cateName,
      attr_sel: activeName.value,
      attr_vals:row.attr_vals.join(',')      
    }
  );
  if (res.meta.status === 200) {
    ElMessage.success("更新成功");
    getParamsData();
  } else {
    ElMessage.error("更新失败");
  }
  // console.log('====================');
  // console.log("attr_name",form.value.cateName);
  // console.log('attrId:',row.attr_id);
  //  console.log('id',selectKeys.value[2]);
  // console.log('attr_sel:',activeName.value);
  // console.log('attr_vals',row.attr_vals.join(','))
  // console.log(res);
  // console.log('===================');
};

//删除参数
const deleteIdCategories = (row) => {
  ElMessageBox.confirm("此操作将永久删除该条数据?", "删除操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      delIdCategories(row);
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "操作取消",
      });
    });
};

//删除参数方法
const delIdCategories = async (row) => {
  const { data: res } = await axios.delete(
    `categories/${selectKeys.value[2]}/attributes/${row.attr_id}`
  );
  if (res.meta.status === 200) {
    ElMessage.success("删除成功");
    getParamsData();
  } else {
    ElMessage.error("删除失败");
  }
};
//修改参数列表attr_vals里的数据
const revAttrvals=async(row)=>{
    //修改参数列表attr_vals里的数据
         const{data:res}=await axios.put(`categories/${selectKeys.value[2]}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(',')
    })
    if(res.meta.status===200){
        ElMessage.success('修改成功')
    }else{
        ElMessage.error('修改失败')
    }
    console.log(res);
}
//展开行input表单中文本框失去焦点或按下enter键都会触发
const handleInputConfirm=(row)=>{
    //判断用户输入是否为空
    if(row.inputValue){
        row.attr_vals.push(row.inputValue);
         revAttrvals(row)
         
    }
    row.inputValue=''
    row.inputVisible=false
}
//获取文本框组件实例
const InputRef = ref(null);
//输入框和按钮显示与隐藏
const showInput=(row)=>{
    row.inputVisible=true
    nextTick(()=>{
        InputRef.value.focus();
    })
}

//tab标签关闭触发的事件
const tagClose=(id,row)=>{
    //根据索引下标删除row里attr_vals数组中的数据
    row.attr_vals.splice(id,1)
    revAttrvals(row)
    console.log(id);
}
</script>

<style scoped>
.cat_opt {
  margin: 15px 0;
}
.col-span {
  margin-right: 15px;
}
.el-cader {
  width: 300px;
}
.el-tag {
  margin: 15px;
}
.elinput{
    width: 120px;
}
.table-column{
    margin-left: 15px;
}
.button-new-tag{
    margin-left: 15px;
}
</style>