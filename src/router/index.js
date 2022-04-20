import { createRouter, createWebHashHistory } from 'vue-router'
// import Home from '../views/Home.vue'
// import Lgoin from '../views/Login.vue'
// import About from '../views/About.vue'
import UserLogin from '../views/userLogin.vue'
import userList from '../views/userList.vue'
import welcome from '../views/Welcome.vue'
import users from '../components/users.vue'
import rights from '../components/power/rights.vue'
import roles from '../components/power/roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import GoodsList from '../components/goods/GoodsList.vue'
import AddGoods from '../components/goods/components/AddGoods.vue'
import Order from '../components/order/Order.vue'
const routes = [
  {
    path:'/',
    name: 'UserLogin',
    component: UserLogin,
    
  },
  {
    path:'/userList',
    name: 'userList',
    component:userList,
    redirect:'/welcome',
    children:[
      {path:'/welcome',component:welcome},
      {path: '/users',component:users},
      {path: '/rights',component:rights},
      {path: '/roles',component:roles},
      {path: '/categories',component:Cate},
      {path: '/params',component:Params},
      {path: '/goods',component:GoodsList},
      {path: '/goods/add',component:AddGoods},
      {path: '/orders',component:Order}
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
//挂在路由导航守卫
router.beforeEach((to,from,next)=>{
  //to将要访问的路径
  //from代表从哪个路劲跳转过来
  //next是一个函数，表示放行
  //next() 放行    next('/login') 强制跳转

  //用户访问登入页面直接放行
  if(to.path=== '/'){
    return next()
  }
  //获取token的值
  const token=localStorage.getItem('token');
  //没有token,强制跳转到登入页面
  if(!token){
    return next('/');
  }
  next();
})
export default router
