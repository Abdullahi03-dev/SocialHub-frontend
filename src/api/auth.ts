import axios from "axios";

const API_URL = "http://127.0.0.1:8000/auth";

export const register = async (name: string, email: string, password: string) => {
  try{
    const res=axios.post(`${API_URL}/signup`, { name, email, password },{
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
   await axios.post(`${API_URL}/signin`, { email, password },{ withCredentials: true });
  }catch(error:any){
    throw error.response?.data?.detail||'Login FAILED'
  }
  
};



export const checkAuth = async (): Promise<boolean> => {
  try {
    const res = await axios.get(`${API_URL}/check-auth`, { withCredentials: true });
    return res.data.authenticated;
  } catch {
    return false;
  }
};

// export const getToken = () => localStorage.getItem("token");
// export const logout = () => localStorage.removeItem("token");

