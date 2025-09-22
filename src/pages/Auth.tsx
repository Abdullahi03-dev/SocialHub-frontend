import { useState } from "react";
import Header from "@/components/Header";
import AuthForm from "@/components/AuthForm";
import { login, register } from "@/api/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate=useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const handleAuth =async (email: string, password: string, name: string, isLogin: boolean) => {
    console.log('Authentication attempt:', { email, name,password, isLogin });
    // In a real app, this would make an API call
    setIsAuthenticated(true);
    if(!isLogin){
      try{
        console.log(name,email,password)
        await register(name,email,password);
        toast.success('SIGN UP SUCCESSFULL')
        setTimeout(()=>{
      navigate(0);
        },2000)
      }catch(e:any){
        toast.error(e||'SIGNUP FAILED')
        console.log(e)
      }
    }else{
      try{
      await login(email, password);
      toast.success('LOGIN SUCCESSFUL')
      localStorage.setItem('email',email)
      setTimeout(()=>{
        navigate('/dashboard');
          },2000)
      }catch(e:any){
        toast.error(e||'LOGIN FAILED')
        console.log(e)
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header isAuthenticated={isAuthenticated} />
      <div className="container py-16">
        <div className="flex justify-center">
          <AuthForm onAuth={handleAuth} />
        </div>
      </div>
    </div>
  );
};

export default Auth;