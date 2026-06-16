import axios from "axios";
const api=axios.create({
    baseURL:"http://localhost:3000",
     withCredentials:true

})

export const register =  async ({username ,email,password})=>{
try{
    const response= await api.post('/api/register',{
    username,email,password
},{
 withCredentials:true
})
return response.data
}catch(err){
console.log(err);
}
}

export const login =  async ({email,password})=>{
try{
    const response= await api.post('/api/login',{
    email,password
},{
 withCredentials:true
})
return response.data
}catch(err){
console.log(err);
}
}

export async function logout() {
   try{
    const response= await api.get('/api/logout', {
      withCredentials: true
    })
return response.data
}catch(err){
console.log(err);
}

}

export async function getme() {
   try{
    const response= await api.get('/api/get-me', {
      withCredentials: true
    })
return response.data
}catch(err){
console.log(err);
}
}