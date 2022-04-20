import request from './request'
import axios from 'axios'

// export const login=(data)=>{
//     return request({
//         url: '/login',
//         method: 'POST',
//         data
//     })
// }
export const login=(obj)=>{
    return request.post('login',obj)
}

