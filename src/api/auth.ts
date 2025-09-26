import axios from "axios";

// const API_URL = "https://socialhub-backend-se80.onrender.com/auth";
const API_URL=import.meta.env.VITE_API_URL

export const register = async (name: string, email: string, password: string) => {
  // const API_URL=process.env.API_URL
  try{
    const res=axios.post(`${API_URL}/auth/signup`, { name, email, password },{
      headers:{
        "Content-Type":"application/json"
      }
    });
    
    return (await res).data
  }catch(e:any){
    throw e.response?.data?.detail||'SIGNUP FAILED'
  }

};

export const login = async (email: string, password: string) => {
  try{
   await axios.post(`${API_URL}/auth/signin`, { email, password },{ withCredentials: true });
  }catch(error:any){
    throw error.response?.data?.detail||'Login FAILED'
  }
  
};



export const checkAuth = async (): Promise<boolean> => {
  try {
    const res = await axios.get(`${API_URL}/auth/check-auth`, { withCredentials: true });
    return res.data.authenticated;
  } catch {
    return false;
  }
};



