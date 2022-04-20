import axios from "axios";
import { ElMessage } from 'element-plus'
import router from '../router/index'
const service =axios.create({
    timeout:5000
})
//获取路由实例
//    let router=useRouter()
//登入响应拦截器
service.interceptors.response.use((response)=>{
    // console.log(response);
    const{data,meta}=response.data
    console.log('响应拦截器',response);
    if(meta.status===200){
        //1登入成功之后的token,保存到客户端的sessionStorage中
        //    1.1项目中出现了登入之外的其他api接口，必须在登入之后才能访问
        //    1.2token只能在当前网站打开期间生效，所以将token保存在sessionStroage中
        // sessionStorage.setItem('token',data.token);
        localStorage.setItem('token',data.token);
        // 2.通过编程时导航跳转到后台主页
        // router.replace('/userList')
        console.log('tokentokentoken');
        ElMessage({
            message: meta.msg,
            type: 'success',
          })
        router.push('/userList');
        
        return data       
    }else{
        ElMessage.error(meta.msg);
        return Promise.reject(new Error(meta.msg))
    }
},(error)=>{
    error.response && ElMessage.error(error.response.data);
    return Promise.reject(new Error(error.response.data))
})

//axios请求拦截器
axios.interceptors.request.use(config=>{
    //为请求头对象 添加token验证的Authorization字段
    config.headers.Authorization=localStorage.getItem('token')
    return config
})
export default service
