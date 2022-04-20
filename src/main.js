import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus, { useLocale } from 'element-plus'
import 'element-plus/dist/index.css'
import '@/styles/index.scss'
import axios from 'axios'
// import zhCn from 'element-plus/es/locale/lang/zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn'
// 全局样式表
import './assets/global.css'
// import less from 'less'
//导入vue-quill-editor富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'



// axios.defaults.baseURL="http://localhost:8080"
const app = createApp(App)
// app.config.globalProperties.$http=axios
app.use(VueQuillEditor)
app.use(ElementPlus,{locale})
app.use(store)
app.use(router)
// app.use(less)
app.mount('#app')