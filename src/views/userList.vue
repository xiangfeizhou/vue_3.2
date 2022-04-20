.<template>
  <div class="home">
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
        <div>
          <span>后台管理系统</span>
        </div>
        <el-button type="info" @click="quitClick">退出</el-button>
      </el-header>

      <!-- 页面主体区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
            <!-- 按钮 -->
            <div class="aside-btn" @click="toggleCollapse">
               <el-icon :size="20" color="#ffffff" v-if="isCollapse">
                   <arrow-right />
               </el-icon>
                <el-icon :size="20" color="#ffffff" v-else>
                    <arrow-left />
                </el-icon>
          
          </div>
          <!-- 侧边栏菜单区域 -->
          <el-menu
            active-text-color="#409EFF"
            background-color="#545c64"
            class="el-menu-vertical-demo"
            text-color="#fff"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            router
            :default-active="done"
          >
          <!-- 一级菜单 -->
            <el-sub-menu :index="item.id.toString()" v-for="item in list" :key="item.id">
              <template #title>               
                      <!-- 动态icon -->
                    <el-icon>
                        <i :class="icons[item.id]" aria-hidden="true"></i>   
                    </el-icon>         
                <span>{{item.authName}}</span>
              </template>

              <!-- 二级菜单 -->
              <el-menu-item :index="`/${todo.path}`" v-for="todo in item.children" :key="todo.id" @click="clickMeIt(todo.path)">
                <template #title>
                    <el-icon><IconMenu /></el-icon>
                  <span>{{todo.authName}}</span>
                </template>
              </el-menu-item>
            </el-sub-menu>

          </el-menu>
        </el-aside>

        <!-- 右侧内容主体 -->
        <el-main>
            <!-- 路由占位符 -->
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import {
  Burger,
  Location,
  Setting,
  Document,
  ChatDotSquare,
  Menu as IconMenu,
  Apple,
  ArrowLeft,
  ArrowRight
} from "@element-plus/icons-vue";
import router from "@/router/index";
import{onMounted,ref,reactive} from 'vue'
import axios from "axios";

const list=ref([]);
let isCollapse=ref(false);
let done=ref(sessionStorage.getItem('path'));
const icons=reactive({
    '125': 'fa fa-user',
     '103'  : "fa fa-id-card" ,
     '101': 'fa fa-shopping-bag',
     '102' :"fa fa-shopping-cart",
     '145': 'fa fa-calculator',

})
console.log(icons[125]);
//退出登入并清除token
function quitClick() {
  localStorage.clear();
  sessionStorage.clear();
  router.push("/");
 

}
 onMounted(() => {
      getMenuList()
  });

//获取所有的子菜单
async function getMenuList(){
    const{data:res}=await axios.get('menus');
    if(res.meta.status!==200){
        return ElMessage.error(res.meta.msg)
    }
    console.log('子菜单',res);
    list.value=res.data
}

function toggleCollapse(){
    isCollapse.value=!isCollapse.value;
    console.log('123');
}
// 解决刷新网页选中菜单没有高亮效果
function clickMeIt(path){
    // let val="/"+path;
    sessionStorage.setItem('path',`/${path}`) //
    // console.log(localStorage.getItem('path'));
}
</script>

<style>
.home {
  height: 100%;
}
.el-header {
  background-color: #333333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-aside {
  background-color: #545c64;
}
.el-main {
  background-color: #f5f5f5;
}
.home-container {
  height: 100%;
}

.el-aside .el-menu {
    border-right:none
}
.aside-btn{
    text-align: center;
    cursor: pointer;
}
</style>
